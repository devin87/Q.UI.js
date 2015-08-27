/// <reference path="../lib/Q.js" />
/*
* Q.UI.Progressbar.js 进度条
* https://github.com/devin87/Q.UI.js
* author:devin87@qq.com
* update:2015/07/15 11:46
*/
(function (undefined) {
    "use strict";

    var fire = Q.fire,
        createEle = Q.createEle,
        factory = Q.factory;

    //---------------------- 进度条 ----------------------

    //进度条,颜色、高度等设置可以在样式表里控制
    //ops:{box:进度条所在容器,speed:速度(0-100),wait:每隔多长时间更新一次进度(ms),onprogress(progress,speed,time):进度更新时回调函数}
    function Progressbar(ops) {
        ops = ops || {};

        var container = ops.box,

            boxBar = createEle("div", "progress-bar"),
            boxNode = createEle("div", "progress");

        boxBar.appendChild(boxNode);
        container.appendChild(boxBar);

        var self = this;
        self._bar = boxBar;
        self._node = boxNode;

        self.speed = ops.speed || 1;
        self.wait = ops.wait || 100;
        self.progress = 0;
        self.time = 0;

        self.onprogress = ops.onprogress;
    }

    factory(Progressbar).extend({
        //启动进度条
        start: function () {
            var self = this;
            if (self.progress >= 100) return;

            self._timer = setInterval(function () {
                self.update();
            }, self.wait);

            return self;
        },
        //停止进度条
        stop: function () {
            if (this._timer) clearInterval(this._timer);

            return this;
        },
        //重新启动进度条(进度归0)
        restart: function () {
            return this.stop().update(0).start();
        },
        //更新进度条进度
        update: function (progress) {
            var self = this;
            if (progress != undefined) self.progress = Math.max(progress, 0);
            else self.progress += self.speed;

            if (self.progress > 100) {
                self.progress = 100;
                self.stop();
            }

            self._node.style.width = self.progress.toFixed(2) + "%";
            self.time += self.wait;

            fire(self.onprogress, self, self.progress, self.speed, self.time);

            return self;
        },
        //设置速度和等待时间
        set: function (speed, wait) {
            if (speed) this.speed = speed;
            if (wait) this.wait = wait;

            return this.stop().start();
        }
    });

    //------------------------- export -------------------------

    Q.Progressbar = Progressbar;

})();