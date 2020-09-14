/// <reference path="../lib/Q.js" />
/*
* Q.UI.Marquee.js 无缝滚动插件
* https://github.com/devin87/Q.UI.js
* author:devin87@qq.com
* update:2019/07/26 18:37
*/
(function (undefined) {
    "use strict";

    var fire = Q.fire,
        factory = Q.factory;

    //---------------------- 无缝滚动插件 ----------------------
    /*
        调用示例如下：
        new Q.Marquee({
            box: box,                       //顶层DOM对象，下列ul、boxControl等都基于此对象
            ul: ".slide-ul",                //要滚动的ul对象
            boxControl: ".slide-control",   //下方滚动按钮容器，可选
            btnPrev: ".prev",               //向左滚动按钮
            btnNext: ".next",               //向右滚动按钮
            way: i == 2 ? "top" : "left",   //滚动方向，top:向上滚动，left:向左滚动，默认left

            sleep: 5000,                    //自动滚动的时间间隔（ms）

            isSlideKeydown: true,           //是否允许键盘（左右方向键）控制滚动，默认为true
            isStoppedHover: true,           //鼠标移上去时停止自动滚动，移出时开始自动滚动，默认为true

            auto: true                      //是否自动滚动
        });
    */
    function Marquee(ops) {
        var self = this,
            box = ops.box;

        self._$box = $(box);
        self._$ul = $(ops.ul, box);
        self._$control = $(ops.boxControl, box);
        self._$btnPrev = $(ops.btnPrev, box);
        self._$btnNext = $(ops.btnNext, box);

        self.auto = !!ops.auto;
        self.way = ops.way || "left";
        self.speed = ops.speed || "slow";
        self.sleep = ops.sleep || 5000;
        self.step = ops.step || 1;

        self.isSlideKeydown = ops.isSlideKeydown !== false;
        self.isStoppedHover = ops.isStoppedHover !== false;

        self.clsActive = "slide-on";
        self.index = 0;

        self.init();
    }

    factory(Marquee).extend({
        //初始化
        init: function () {
            var self = this,
                $box = self._$box,

                $ul = self._$ul,
                $lis = $ul.children(),
                $control = self._$control,

                size = $lis.size(),
                $controls;

            if (size > 0) {
                //追加首尾元素，以实现无缝滚动
                $ul.prepend($lis.last()[0].cloneNode(true));
                $ul.append($lis.first()[0].cloneNode(true));
            }

            if (size > 1) {
                $control.html('<a></a>'.repeat(size));
            } else {
                self._$btnPrev.hide();
                self._$btnNext.hide();
            }

            $lis = $ul.children();

            $lis.each(function (i, li) {
                li.style[self.way] = (i - 1) * 100 + "%";
            });

            $controls = $control.children();
            $controls.each(function (i) {
                this.x = i;
            });

            self._$lis = $lis;
            self._$controls = $controls;
            self._cssBox = $box.prop("className");
            self.size = size;

            $lis.eq(1).addClass(self.clsActive);
            self.updateControl(0);

            if (self.auto) self.start();

            return self.initEvent();
        },
        //初始化事件
        initEvent: function () {
            var self = this;

            if (self.size > 1) {
                //点击控制区域切换滚动
                self._$control.on("click", "a", function () {
                    self.play(this.x);
                });

                //向左滚动
                self._$btnPrev.click(function () {
                    self.playPrev();
                });

                //向右滚动
                self._$btnNext.click(function () {
                    self.playNext();
                });
            }

            if (self.isSlideKeydown) {
                //键盘控制滚动
                $(document).keydown(function (e) {
                    switch (e.keyCode) {
                        case 37: self.playPrev(); break;
                        case 39: self.playNext(); break;
                    }
                });
            }

            //鼠标放在banner上时暂停播放，移除后继续
            if (self.auto && self.isStoppedHover) {
                self._$ul.hover(function () {
                    self.stop();
                }, function () {
                    self.start();
                });
            }

            return self;
        },
        //更新控制按钮
        updateControl: function (i) {
            var self = this,
                clsName = self._cssBox || "";

            self._$box.prop("className", clsName + (clsName ? " " : "") + "b" + (i + 1));
            self._$controls.prop("className", "").eq(i).prop("className", self.clsActive);

            return self;
        },
        //无缝滚动（-1<=i<=size）
        play: function (i) {
            var self = this,
                clsActive = self.clsActive,
                $ul = self._$ul,
                $lis = self._$lis,
                size = self.size;

            if (size <= 1) return self;

            var i_valid = i;
            if (i_valid >= size) i_valid = 0;
            else if (i_valid < 0) i_valid = size - 1;

            $lis.removeClass(clsActive).eq(i + 1).addClass(clsActive);
            self.updateControl(i_valid);

            fire(self.onPlay, self, i_valid);

            var params = {};
            params[self.way] = (-i * 100) + "%";

            $ul.animate(params, self.speed, function () {
                if (i == size || i == -1) {
                    $lis.removeClass(clsActive).eq(i_valid + 1).addClass(clsActive);
                    $ul.css(self.way, (-i_valid * 100) + "%");
                    self.index = i_valid;

                    fire(self.onPlayed, self, i_valid);
                }
            });

            self.index = i;

            return self;
        },
        //向前滚动
        playPrev: function () {
            return this.play(this.index - this.step);
        },
        //向后滚动
        playNext: function () {
            return this.play(this.index + this.step);
        },
        //开始自动滚动
        start: function () {
            var self = this;
            self.stop();

            if (self.size <= 1) return self;

            self.timer = setTimeout(function () {
                self.playNext();
                self.start();
            }, self.sleep);

            return self;
        },
        //停止自动滚动
        stop: function () {
            var self = this;
            if (self.timer) {
                clearTimeout(self.timer);
                self.timer = undefined;
            }
            return self;
        }
    });

    //------------------------- export -------------------------

    Q.Marquee = Marquee;

})();