/// <reference path="../lib/Q.js" />
/*
* Q.UI.ContextMenu.js 多级上下文菜单(右键菜单)
* https://github.com/devin87/Q.UI.js
* author:devin87@qq.com
* update:2015/07/15 12:07
*/
(function (undefined) {
    "use strict";

    var document = window.document,

        //isObject = Q.isObject,

        fire = Q.fire,
        extend = Q.extend,
        makeArray = Q.makeArray,

        getStyle = Q.getStyle,
        getOffset = Q.offset,

        hasClass = Q.hasClass,
        addClass = Q.addClass,
        removeClass = Q.removeClass,

        createEle = Q.createEle,
        factory = Q.factory,

        E = Q.event;

    var POS_VALUE_HIDDEN = -10000;

    //设置元素位置
    function set_pos(el, x, y) {
        if (x != undefined) el.style.left = x + "px";
        if (y != undefined) el.style.top = y + "px";
    }

    //---------------------- 上下文菜单 ----------------------
    function ContextMenu(data, ops) {
        extend(this, ops);

        this.init(data);
    }

    factory(ContextMenu).extend({
        //初始化菜单
        init: function (data) {
            var self = this;

            self.draw(data);

            if (self.autoHide !== false) {
                self._e0 = E.add(document, "mousedown", function () {
                    self.hide();
                });
            }

            return self;
        },
        //生成所有菜单
        draw: function (data) {
            var self = this;

            //数据重置
            self._menus = [];
            self._items = [];
            self._map_menu = {};
            self._map_item = {};

            self.i = self.j = 0;
            self._active = undefined;

            //生成菜单
            var tmp = self._tmp = [],
                args;

            self.drawMenu(data);

            while ((args = tmp.shift())) {
                self.drawMenu.apply(self, args);
            }

            self._tmp = null;
            self.i = self.j = 0;

            //主菜单
            var box = self._getMenu(0).node;
            self.box = box;

            //------------ 菜单事件 ------------
            var list_box = [];
            self._menus.forEach(function (m) {
                if (m && !m.linked) list_box.push(m.node);
            });

            //移除之前绑定的事件
            if (self._e1) self._e1.off();

            self._e1 = E.add(list_box, {
                click: function (e) {
                    var el = this,
                        j = el._j;

                    if (hasClass(el, "x-disabled") || (self._getSubMenu(j) && !self.isFireAll)) {
                        E.stop(e);
                        return;
                    }

                    var item = self._getItem(j);

                    fire(item.data.click, el, e, item);
                    fire(self.onclick, el, e, item);

                    self.hide();
                },
                mouseenter: function (e) {
                    var el = this,
                        i = el._i,
                        j = el._j;

                    self._hideSub(i, j);

                    addClass(el, "x-on");

                    var item = self._getItem(j);
                    fire(item.data.mouseover, el, e, item);
                    fire(self.onmouseover, el, e, item);

                    if (hasClass(el, "x-disabled")) return;

                    self._showSub(i, j, el);
                },
                mouseleave: function (e) {
                    var el = this,
                        i = el._i,
                        j = el._j,

                        sub_menu = self._getSubMenu(j);

                    if (hasClass(el, "x-disabled") || !sub_menu) removeClass(el, "x-on");
                    else if (i == 0) self._active = j;

                    var item = self._getItem(j);
                    fire(item.data.mouseout, el, e, item);
                    fire(self.onmouseout, el, e, item);
                }
            }, ".x-item");

            if (self._e2) self._e2.off();
            self._e2 = E.add(list_box, "mousedown", E.stop);

            return self.hide();
        },
        //生成菜单
        drawMenu: function (data, pid) {
            var self = this,

                list_menu = self._menus,
                list_item = self._items,
                map_menu = self._map_menu,
                map_item = self._map_item,

                box = data.box,
                is_linked_box = !!box,

                menu_index = self.i++;

            if (!box) {
                var className = data.className,
                    box = createEle("div", "x-panel" + (className ? " " + className : ""));

                box.style.width = (data.width || 120) + "px";
            }

            list_menu[menu_index] = { node: box, linked: is_linked_box, j: pid, data: data };
            if (pid) map_menu[pid] = menu_index;

            //链接菜单
            if (is_linked_box) return self;

            var global_submenu = self.subMenu !== false

            //循环生成菜单项
            for (var i = 0, data_items = data.items; i < data_items.length; i++) {
                var m = data_items[i];
                if (!m) continue;

                var item = document.createElement("div"),
                    item_index = self.j++;

                item._i = menu_index;
                item._j = item_index;

                list_item[item_index] = { node: item, i: menu_index, j: item_index, data: m };
                if (m.id) map_item[m.id] = item_index;

                if (m.split) {
                    item.className = "x-split";
                } else {
                    item.className = "x-item" + (m.disabled ? " x-disabled" : "");
                    item.x = m.x != undefined ? m.x : ""; //自定义值

                    var group = m.group,
                        has_submenu = global_submenu && group && (group.box || (group.items && group.items.length > 0)),
                        ico = m.ico;

                    var html = m.html ||
                        '<div class="x-icon">' +
                            (ico ? /^<.+>$/.test(ico) ? ico : '<img alt="" src="' + ico + '">' : '') +
                        '</div>' +
                        '<div class="x-text"' + (m.title ? ' title="' + m.title + '"' : '') + '>' +
                            m.text +
                        '</div>' +
                        (has_submenu ? '<div class="arrow"></div>' : '');

                    item.innerHTML = html;

                    if (has_submenu) self._tmp.push([group, item_index]);
                }

                box.appendChild(item);
            }

            Q.body.appendChild(box);

            return self;
        },

        //根据菜单索引获取菜单
        _getMenu: function (i) {
            return this._menus[i];
        },

        //根据菜单项索引获取子菜单
        _getSubMenu: function (j) {
            var i = this._map_menu[j];
            return i != undefined ? this._getMenu(i) : undefined;
        },

        //根据菜单项索引获取菜单项
        _getItem: function (j) {
            return this._items[j];
        },

        //根据指定的id获取菜单项
        getItem: function (id) {
            var j = this._map_item[id];

            return j != undefined ? this._items[j] : undefined;
        },

        //更改菜单项的值
        setItemText: function (id, text) {
            var item = this.getItem(id);
            if (!item) return;

            item.data.text = text;

            var node_text = item.node.childNodes[1];
            if (node_text) node_text.innerHTML = text;
        },

        //处理菜单项
        processItems: function (ids, fn) {
            var self = this;

            makeArray(ids).forEach(function (id) {
                var item = self.getItem(id);
                if (item) fn(item.node, item);
            });

            return self;
        },

        //处理菜单项(className)
        _processItems: function (ids, fn, className) {
            return this.processItems(ids, function (node) {
                fn(node, className);
            });
        },

        //启用菜单项
        enableItems: function (ids) {
            return this._processItems(ids, removeClass, "x-disabled");
        },
        //禁用菜单项
        disableItems: function (ids) {
            return this._processItems(ids, addClass, "x-disabled");
        },
        //显示菜单项
        showItems: function (ids) {
            return this._processItems(ids, removeClass, "hide");
        },
        //隐藏菜单项
        hideItems: function (ids) {
            return this._processItems(ids, addClass, "hide");
        },

        //元素智能定位
        _setPos: function (menu, x, y, pbox) {
            var self = this,
                rangeX = self.rangeX,
                rangeY = self.rangeY,

                box = menu.node,
                width = box.offsetWidth,
                height = box.offsetHeight,

                data = menu.data || {},
                maxHeight = data.maxHeight;

            //如果菜单高度超出最大高度,则启用垂直滚动条
            if (maxHeight) {
                var realHeight = Math.max(height, box.scrollHeight),
                    hasScrollbar = realHeight > maxHeight;

                box.style.height = hasScrollbar ? maxHeight + "px" : "auto";

                //是否固定宽度,默认菜单宽度会增加17px
                if (!self.fixedWidth) box.style.width = (data.width + (hasScrollbar ? 17 : 0)) + "px";

                height = box.offsetHeight;
            }

            if (x == undefined) x = self.x || 0;
            if (y == undefined) y = self.y || 0;

            if (rangeX && x + width > rangeX) {
                x = rangeX - width;
                if (pbox) x = x - pbox.offsetWidth + 3;
            }

            if (rangeY && y + height > rangeY) y = rangeY - height - 1;

            if (x < 0) x = 0;
            if (y < 0) y = 0;

            set_pos(box, x, y);

            self.x = x;
            self.y = y;

            return self;
        },

        //显示子菜单(如果有)
        _showSub: function (i, j, el) {
            var self = this,

                menu = self._getMenu(i),
                sub_menu = self._getSubMenu(j);

            if (sub_menu) {
                var node = menu.node,
                    sub_node = sub_menu.node,
                    offset = getOffset(el),

                    zIndex = +getStyle(node, "zIndex"),
                    zIndex_sub = +getStyle(sub_node, "zIndex");

                if (zIndex_sub <= zIndex) sub_node.style.zIndex = zIndex + 1;

                self._setPos(sub_menu, offset.left + offset.width - 2, offset.top, node);
            }

            self.i = i;
            self.j = j;

            return self;
        },

        //取消高亮的项
        _inactive: function (j) {
            var item = this._getItem(j);
            if (item) removeClass(item.node, "x-on");

            return this;
        },

        //隐藏子菜单
        _hideSub: function (i, j) {
            var self = this;

            if (i <= self.i && j != self.j) {
                var list_menu = self._menus, k;

                //隐藏子一级菜单(当前菜单以后的菜单)
                for (k = list_menu.length - 1; k > i; k--) {
                    self._hide(list_menu[k]);
                }

                //移除子一级菜单高亮的项
                if (i < self.i) {
                    for (k = self.i; k > i; k--) {
                        var p_menu = self._getMenu(k);
                        self._inactive(p_menu.j);
                    }
                }
            }

            //移除同一菜单里上次高亮的项(有子菜单的项)
            if (i == self.i && j != self.j && self._getSubMenu(self.j)) self._inactive(self.j);

            return self;
        },
        //隐藏指定菜单
        _hide: function (menu) {
            if (menu) {
                var node = menu.node;
                if (node.style.left != POS_VALUE_HIDDEN) set_pos(node, POS_VALUE_HIDDEN, POS_VALUE_HIDDEN);
            }

            return this;
        },

        //显示
        show: function (x, y) {
            return this.hide()._setPos(this._menus[0], x, y);
        },
        //隐藏
        hide: function () {
            var self = this;

            self._menus.forEach(function (m) {
                self._hide(m);
            });

            if (self._active != undefined) {
                self._inactive(self._active);
                self._active = undefined;
            }

            return self;
        },

        //菜单是否为隐藏状态
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

    Q.ContextMenu = ContextMenu;

})();