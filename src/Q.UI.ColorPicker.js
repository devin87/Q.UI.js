/// <reference path="../lib/Q.js" />
/*
* Q.UI.ColorPicker.js 颜色选择器
* author:devin87@qq.com
* update:2015/07/15 12:07
*/
(function (undefined) {
    "use strict";

    var document = window.document,

        isFunc = Q.isFunc,

        //extend = Q.extend,
        //fire = Q.fire,

        getFirst = Q.getFirst,
        getNext = Q.getNext,
        getLast = Q.getLast,

        getOffset = Q.offset,

        createEle = Q.createEle,
        factory = Q.factory,

        E = Q.event;

    var POS_VALUE_HIDDEN = -10000;

    //设置元素位置
    function set_pos(el, x, y) {
        if (x != undefined) el.style.left = x + "px";
        if (y != undefined) el.style.top = y + "px";
    }

    //---------------------- util ----------------------

    var RE_RGB = /^rgb\((\d+),(\d+),(\d+)\)$/i,
        RE_Hex = /^#?([0-9A-F]{3}|[0-9A-F]{6})$/i;

    //int值转为16进制颜色
    function int2hex(n) {
        return "#" + ("00000" + n.toString(16)).slice(-6);   //faster

        //var str = ("00000" + n.toString(16)).slice(-6);
        //return "#" + str.slice(4) + str.slice(2, 4) + str.slice(0, 2);
    }

    //RGB颜色转为16进制颜色
    function rgb2hex(r, g, b) {
        return int2hex(r * 65536 + g * 256 + b);
        //return int2hex(r + g * 256 + b * 65536);
    }

    //转为16进制颜色
    function toHex(color) {
        if (typeof color == "number") return int2hex(color);

        color = color.replace(/\s+/g, "");
        if (!RE_RGB.test(color)) return color;

        return rgb2hex(+RegExp.$1, +RegExp.$2, +RegExp.$3);
    }

    //转为RGB颜色
    function toRGB(color) {
        if (typeof color == "number") color = int2hex(color);
        if (!RE_Hex.test(color)) return color;

        color = RegExp.$1;

        if (color.length == 3) {
            var a = color.charAt(0), b = color.charAt(1), c = color.charAt(2);
            color = a + a + b + b + c + c;
        }

        return "rgb(" + parseInt(color.substr(0, 2), 16) + "," + parseInt(color.substr(2, 2), 16) + "," + parseInt(color.substr(4, 2), 16) + ")";
    }

    //---------------------- ColorPicker ----------------------

    var LIST_COLOR = ['#000000', '#333333', '#666666', '#999999', '#cccccc', '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff', '#ff00ff'];

    //颜色选择器
    function ColorPicker(target, callback) {
        var self = this;

        //默认行数与列数
        self.row = 12;  //不得超过 LIST_COLOR.length
        self.col = 21;

        //默认设置对象的前景色(字体颜色)
        self.isColor = true;

        self.set(target, callback).init();
    }

    factory(ColorPicker).extend({
        //初始化
        init: function () {
            var self = this;

            var html =
                '<div class="xp-title">' +
                    '<div class="xp-preview"></div>' +
                    '<div class="xp-val"></div>' +
                    '<div class="xp-type">' +
                        '<select>' +
                            '<option value="Cube" selected="selected">立方色</option>' +
                            '<option value="Series">连续色调</option>' +
                            '<option value="Gray">灰度等级</option>' +
                        '</select>' +
                    '</div>' +
                '</div>' +
                '<div class="xp-table">' +
                    '<table>' +
                        ('<tr>' + '<td></td>'.repeat(self.col) + '</tr>').repeat(self.row) +
                    '</table>' +
                '</div>';

            var box = createEle("div", "x-picker", html),

                boxTitle = getFirst(box),
                boxPreview = getFirst(boxTitle),
                boxValue = getNext(boxPreview),
                boxType = getLast(boxTitle),

                boxTable = getLast(box),
                table = getFirst(boxTable);

            Q.body.appendChild(box);

            self.box = box;
            self.table = table;
            self.boxPreview = boxPreview;
            self.boxValue = boxValue;

            //------------------- init event -------------------

            //类型切换
            E.add(getFirst(boxType), "change", function () {
                self["draw" + this.value + "Color"]();
            });

            E.add(table, {
                //鼠标移动,预览颜色
                mouseover: function (e) {
                    self.setPreview(this.style.backgroundColor);
                },

                //选择并设置颜色
                click: function (e) {
                    var color = this.style.backgroundColor;
                    self.fire(color).setColor(color).hide();
                }
            }, "td");

            E.add(box, "click", E.stop);
            E.add(document, "click", function (e) { self.hide(); });

            return self.drawCubeColor().hide();
        },
        //设置模式
        //isColor:更新目标(target)的前景色
        //isBgColor:更新目标(target)的背景色
        mode: function (isColor, isBgColor) {
            var self = this;

            self.isColor = isColor;
            self.isBgColor = isBgColor;

            return self;
        },
        //设置目标和回调函数
        set: function (target, callback) {
            if (isFunc(target)) {
                callback = target;
                target = undefined;
            }

            var self = this;

            if (target) {
                var offset = getOffset(target);
                self.show(offset.left, offset.top + offset.height).hide();

                self.target = target;
            }
            if (callback) self.callback = callback;

            return self;
        },

        //触发回调函数
        fire: function (color) {
            var self = this;
            if (isFunc(self.callback)) self.callback.call(self, color);
            return self;
        },
        //设置颜色到对象
        setColor: function (color) {
            var self = this,
                target = self.target;

            if (target) {
                if (self.isColor) target.style.color = color;
                if (self.isBgColor) target.style.backgroundColor = color;
            }

            return self;
        },
        //设置预览颜色
        setPreview: function (color) {
            var self = this;

            self.boxPreview.style.backgroundColor = color;
            self.boxValue.innerHTML = toHex(color).toUpperCase();

            return self;
        },

        //填充单元格颜色
        fillColor: function (i, j, color) {
            this.table.rows[i].cells[j].style.backgroundColor = color;
            return this;
        },

        //画左边的颜色
        drawLeftColor: function () {
            var self = this,
                row = self.row;

            for (var i = 0; i < row; i++) {
                self.fillColor(i, 0, "#000").fillColor(i, 1, LIST_COLOR[i]).fillColor(i, 2, "#000");
            }

            return self;
        },
        //画立方色
        drawCubeColor: function () {
            var self = this,
                row = self.row,
                col = self.col,
                start = 0,
                step = 0x330000,
                color;

            self.drawLeftColor();

            for (var i = 0; i < row; i++) {
                if (i > 5) color = start = 0x990000 + (i - 6) * 0x000033;
                else color = start = 0x0 + i * 0x000033;

                for (var j = 3; j < col; j++) {
                    self.fillColor(i, j, int2hex(color));
                    color += 0x003300;
                    if ((j - 2) % 6 == 0) start += step, color = start;
                }
            }

            return self;
        },
        //画连续色
        drawSeriesColor: function () {
            var self = this,
                row = self.row,
                col = self.col,
                start = 0xCCFFFF,
                step = 0x660000,
                flag = 1,
                color;

            self.drawLeftColor();

            for (var i = 0; i < row; i++) {
                if (i > 5) color = start = 0xFF00FF + (i - 6) * 0x003300;
                else color = start = 0xCCFFFF - i * 0x003300;

                flag = 1;

                for (var j = 3; j < col; j++) {
                    self.fillColor(i, j, int2hex(color));
                    color -= 0x000033 * flag;
                    if ((j - 2) % 6 == 0) {
                        flag *= -1;
                        start -= step;
                        color = start - ((flag > 0) ? 0 : 0x0000FF);
                    }
                }
            }

            return self;
        },
        //画灰度等级色
        drawGrayColor: function () {
            var self = this,
                row = self.row,
                col = self.col,
                color = 0xffffff;

            for (var i = 0; i < row; i++) {
                for (var j = 0; j < col; j++) {
                    self.fillColor(i, j, int2hex(color));

                    if (color <= 0) color = 0x000000;
                    else color -= 0x010101;
                }
            }

            return self;
        },

        //显示
        show: function (x, y) {
            var self = this;

            if (x == undefined) x = self.x;
            else self.x = x;

            if (y == undefined) y = self.y;
            else self.y = y;

            set_pos(self.box, x, y);

            return self;
        },
        //隐藏
        hide: function () {
            set_pos(this.box, POS_VALUE_HIDDEN, POS_VALUE_HIDDEN);

            return this;
        },

        //是否为隐藏状态
        isHidden: function () {
            var self = this,
                box = self.box,
                x = parseFloat(box.style.left),
                y = parseFloat(box.style.top);

            return x <= -box.offsetWidth || y <= -box.offsetHeight;
        },

        //自动切换显示或隐藏
        toggle: function () {
            return this.isHidden() ? this.show() : this.hide();
        }
    });

    //------------------------- export -------------------------

    Q.toHex = toHex;
    Q.toRGB = toRGB;
    Q.ColorPicker = ColorPicker;

})();