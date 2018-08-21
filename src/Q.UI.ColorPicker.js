/// <reference path="../lib/Q.js" />
/*
* Q.UI.ColorPicker.js 颜色选择器
* https://github.com/devin87/Q.UI.js
* author:devin87@qq.com
* update:2018/06/13 11:12
*/
(function (undefined) {
    "use strict";

    var document = window.document,

        isFunc = Q.isFunc,

        extend = Q.extend,
        //fire = Q.fire,

        getFirst = Q.getFirst,
        getNext = Q.getNext,
        getLast = Q.getLast,

        //getOffset = Q.offset,

        createEle = Q.createEle,
        factory = Q.factory,

        E = Q.event;

    var LANG = {
        cubic_color: "立方色",
        series_color: "连续色调",
        gray_color: "灰度等级"
    };

    //配置语言
    function setLang(langs) {
        extend(LANG, langs, true);
    }

    var POS_VALUE_HIDDEN = -10000;

    //设置元素位置
    function set_pos(el, x, y) {
        if (x != undefined) el.style.left = x + "px";
        if (y != undefined) el.style.top = y + "px";
    }

    //---------------------- util ----------------------

    //int值转为16进制颜色
    function int2hex(n, a) {
        return "#" + (a ? Math.round(a * 255).toString(16) : "") + ("00000" + n.toString(16)).slice(-6);   //faster
    }

    //RGB颜色转为16进制颜色
    function rgb2hex(r, g, b, a) {
        return int2hex(r * 65536 + g * 256 + b * 1, a);
    }

    //解析为rgba数组,若解析失败,则返回空数组 => [r,g,b,a]
    //支持 #ffffff|#80ffffff|rgb(0,0,0)|rgba(0,0,0,0.5)
    function parseColor(color) {
        var rgba = [];

        if (typeof color == "number") color = int2hex(color);
        if (color.indexOf("#") == 0) {
            var len = color.length;
            if (len == 3 || len == 4) {
                color = "#" + color.charAt(0) + color.charAt(0) + color.charAt(1) + color.charAt(1) + color.charAt(2) + color.charAt(2);
                if (len == 4) color += color.charAt(3) + color.charAt(3);
            }

            if (len == 9) {
                rgba[3] = Math.round(parseInt(color.substr(1, 2), 16) * 100 / 255) / 100;
                color = "#" + color.slice(3);
            }

            if (color.length == 7) {
                rgba[0] = parseInt(color.substr(1, 2), 16);
                rgba[1] = parseInt(color.substr(3, 2), 16);
                rgba[2] = parseInt(color.substr(5, 2), 16);
            }

            return rgba;
        }

        color = color.replace(/\s+/g, "");
        var start = color.indexOf('(');
        if (start != -1) {
            rgba = color.slice(start + 1, -1).split(',');
        }

        return rgba;
    }

    //转为16进制颜色 eg: rgb(153,204,0) => #99CC00
    function toHex(color) {
        var rgba = parseColor(color);
        if (rgba.length <= 0) return color;

        return rgb2hex.apply(undefined, rgba.slice(0, 3));
    }

    //转为16进制颜色 eg: rgba(153,204,0,0.5) => #8099CC00
    function toAHex(color) {
        var rgba = parseColor(color);
        if (rgba.length <= 0) return color;

        return rgb2hex.apply(undefined, rgba);
    }

    //转为RGB颜色,转换失败则返回原颜色 eg: #99CC00 => rgba(153,204,0)
    function toRGB(color) {
        var rgba = parseColor(color);
        if (rgba.length <= 0) return color;

        return "rgb(" + rgba.slice(0, 3).join(",") + ")";
    }

    //转为RGBA颜色,转换失败则返回原颜色 eg: #8099CC00 => rgba(153,204,0,0.5)
    function toRGBA(color) {
        var rgba = parseColor(color);
        if (rgba.length <= 0) return color;

        return "rgba(" + rgba.join(",") + ")";
    }

    Q.parseColor = parseColor;
    Q.toHex = toHex;
    Q.toAHex = toAHex;
    Q.toRGB = toRGB;
    Q.toRGBA = toRGBA;

    //---------------------- ColorPicker ----------------------

    var LIST_COLOR = ['#000000', '#333333', '#666666', '#999999', '#cccccc', '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff', '#ff00ff'];

    //颜色选择器
    function ColorPicker(ops) {
        var self = this;

        //默认行数与列数
        self.row = 12;  //不得超过 LIST_COLOR.length
        self.col = 21;

        self.set(ops).init();
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
                            '<option value="Cube" selected="selected">' + LANG.cubic_color + '</option>' +
                            '<option value="Series">' + LANG.series_color + '</option>' +
                            '<option value="Gray">' + LANG.gray_color + '</option>' +
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
                    self.fire(color).hide();
                }
            }, "td");

            E.add(box, "click", E.stop);
            E.add(document, "click", function (e) { self.hide(); });

            return self.drawCubeColor().hide();
        },
        //设置 { isHex,callback }
        //isHex:输出为16进制颜色
        set: function (ops) {
            extend(this, ops, true);

            return this.setPreview((ops || {}).color);
        },

        //触发回调函数
        fire: function (color) {
            var self = this;
            if (isFunc(self.callback)) self.callback.call(self, self.isHex ? toHex(color) : color);
            return self;
        },
        //设置预览颜色
        setPreview: function (color) {
            var self = this;

            if (color) {
                self.boxPreview.style.backgroundColor = color;
                self.boxValue.innerHTML = toHex(color).toUpperCase();
            }

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
        toggle: function (x, y) {
            return this.isHidden() ? this.show(x, y) : this.hide();
        }
    });

    ColorPicker.setLang = setLang;

    //------------------------- export -------------------------

    Q.ColorPicker = ColorPicker;

})();