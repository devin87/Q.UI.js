/// <reference path="../lib/Q.js" />
/// <reference path="Q.UI.Box.js" />
/*
* Q.UI.RangeSlider.js 滑动条(input[type=range])
* https://github.com/devin87/Q.UI.js
* author:devin87@qq.com
* update:2019/04/24 11:14
*/
(function (undefined) {
    "use strict";

    var fire = Q.fire,
        createEle = Q.createEle,
        factory = Q.factory,
        DragX = Q.DragX;

    //---------------------- 滑动条 ----------------------

    //滑动条,颜色、高度等设置可以在样式表里控制
    /* ops配置:
    {
        box: el,   //滑动条容器
        min: 0,    //滑动条最小值
        max: 100,  //滑动条最大值
        step: 1,   //滑动步进
        value: 0   //滑动条当前值
    }
    */
    function RangeSlider(ops) {
        ops = ops || {};

        var container = ops.box,

            elBar = createEle("div", "range-slider-bar"),
            elProgress = createEle("div", "range-progress"),
            elSlider = createEle("div", "range-slider");

        elBar.appendChild(elProgress);
        elBar.appendChild(elSlider);
        container.appendChild(elBar);

        var self = this;
        self._elBar = elBar;
        self._elProgress = elProgress;
        self._elSlider = elSlider;

        self.min = +ops.min || 0;
        self.max = +ops.max || 100;
        self.step = +ops.step || 1;
        self.value = +ops.value || 0;

        var str = self.step + '',
            i = str.lastIndexOf('.'),
            n = i != -1 ? str.length - i - 1 : 0;

        //修复step非整数时精度不准确的问题
        var FIX_INT = Math.pow(10, n);

        self.onchange = ops.onchange;

        self.val(self.value);

        self._drag = new DragX(function () {
            var base = this,
                totalWidth,

                startWidth,  //初始宽度
                startX,      //初始x坐标
                maxLeft;     //elSlider最大偏移

            //实现ops接口
            base.ops = { ele: elSlider, autoCursor: false };

            //实现doDown接口
            base.doDown = function (e) {
                totalWidth = elBar.offsetWidth;
                startWidth = elProgress.offsetWidth;
                startX = e.clientX;
                maxLeft = totalWidth - elSlider.offsetWidth;
            };

            //实现doMove接口
            base.doMove = function (e) {
                //水平移动的距离
                var x = e.clientX - startX,
                    w = startWidth + x;

                if (w < 0) w = 0;
                else if (w > totalWidth) w = totalWidth;

                var steps = ~~(w * (self.max - self.min) / (totalWidth * self.step)),
                    v = (self.min * FIX_INT + self.step * FIX_INT * steps) / FIX_INT;

                elProgress.style.width = (w * 100 / totalWidth) + '%';
                elSlider.style.left = (Math.min(w, maxLeft) * 100 / totalWidth) + '%';

                if (v != self.value) {
                    self.value = v;
                    fire(self.onchange, self, self.value);
                }
            };
        });
    }

    factory(RangeSlider).extend({
        val: function (v) {
            var self = this;
            if (v == undefined) return self.value;

            if (v < self.min) v = self.min;
            else if (v > self.max) v = self.max;

            var elProgress = self._elProgress,
                elSlider = self._elSlider,
                totalWidth = self._elBar.offsetWidth;

            self.value = v;
            elProgress.style.width = ((v - self.min) * 100 / (self.max - self.min)) + '%';
            elSlider.style.left = (Math.min(elProgress.offsetWidth, totalWidth - elSlider.offsetWidth) * 100 / totalWidth) + '%';

            return self;
        }
    });

    //------------------------- export -------------------------

    Q.RangeSlider = RangeSlider;

})();