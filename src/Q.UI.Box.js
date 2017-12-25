/// <reference path="../lib/Q.js" />
/*
* Q.UI.Box.js (包括遮罩层、拖动、弹出框)
* https://github.com/devin87/Q.UI.js
* author:devin87@qq.com
* update:2017/11/22 15:40
*/
(function (undefined) {
    "use strict";

    var window = Q.G,
        document = window.document,

        isObject = Q.isObject,
        isFunc = Q.isFunc,
        isUNum = Q.isUNum,
        isUInt = Q.isUInt,

        def = Q.def,
        fire = Q.fire,
        async = Q.async,
        extend = Q.extend,

        makeArray = Q.makeArray,

        getStyle = Q.getStyle,
        setStyle = Q.setStyle,

        getFirst = Q.getFirst,
        getNext = Q.getNext,
        //getLast = Q.getLast,

        setWidth = Q.width,
        setHeight = Q.height,

        createEle = Q.createEle,
        removeEle = Q.removeEle,

        cssShow = Q.show,
        cssHide = Q.hide,
        isHidden = Q.isHidden,

        addClass = Q.addClass,

        setCssIfNot = Q.setCssIfNot,
        setCenter = Q.setCenter,

        setInputError = Q.setInputError,
        setInputDefault = Q.setInputDefault,
        clearSelection = Q.clearSelection,

        query = Q.query,

        factory = Q.factory,

        browser_ie = Q.ie,
        isIE6 = browser_ie < 7,

        view = Q.view,

        E = Q.event;

    //------------------------- Mask -------------------------

    var GLOBAL_MASK_SETTINGS = { color: "#999", opacity: 0.3 };

    //构造器:遮罩层
    function MaskBox(ops) {
        var box = createEle("div", "x-mask");
        Q.body.appendChild(box);

        if (isIE6) box.style.height = view.getScrollHeight() + "px";

        this.box = box;

        this.set(extend(ops || {}, GLOBAL_MASK_SETTINGS));

        this.count = isHidden(box) ? 0 : 1;
    }

    factory(MaskBox).extend({
        //设置透明度
        opacity: function (opacity) {
            return this.set({ opacity: opacity });
        },
        //设置遮罩层样式 eg:{color,zIndex,width,height}
        set: function (ops) {
            var box = this.box;

            Object.forEach(ops, function (key, value) {
                if (value !== undefined) setStyle(box, key != "color" ? key : "backgroundColor", value);
            });

            return this;
        },
        //显示遮罩层
        show: function () {
            if (this.removed) {
                Q.body.appendChild(this.box);
                this.removed = false;
            }

            cssShow(this.box);
            this.count++;

            return this;
        },
        //隐藏遮罩层
        hide: function () {
            if (this.count > 0) this.count--;
            if (this.count <= 0) cssHide(this.box);

            return this;
        },
        //移除遮罩层
        remove: function () {
            removeEle(this.box);
            this.removed = true;
            this.count = 0;

            return this;
        }
    });

    var GLOBAL_MASK_BOX;

    //获取通用遮罩层(默认配置)
    function getMaskBox() {
        if (GLOBAL_MASK_BOX) {
            GLOBAL_MASK_BOX.show();
            return GLOBAL_MASK_BOX;
        }

        GLOBAL_MASK_BOX = new MaskBox();
        return GLOBAL_MASK_BOX;
    }

    //修改遮罩层全局配置
    function maskSetup(ops, isUpdateUI) {
        extend(GLOBAL_MASK_SETTINGS, ops, true);

        if (isUpdateUI && GLOBAL_MASK_BOX) GLOBAL_MASK_BOX.reset(ops);
    }

    //------------------------- Drag -------------------------

    //获取所有顶层窗口(parent)
    function getTops(w) {
        var parents = [], cwin = w || window;
        while (cwin.top != cwin) {
            var pwin = cwin.parent;
            parents.push(pwin);
            cwin = pwin;
        }
        return parents;
    }

    /*//获取所有内嵌框架
    function _getFrames(w, ret) {
        var frames = w.frames, len = frames.length;
        if (len <= 0) return;
        for (var i = 0; i < len; i++) {
            ret.push(frames[i]);
            _getFrames(frames[i], ret);
        }
    }

    //获取所有内嵌框架
    function getFrames(w) {
        var frames = [];
        _getFrames(w || window, frames);
        return frames;
    }*/

    var DEF_INDEX = 1000, CURRENT_INDEX = DEF_INDEX, MASK_FOR_FRAME;

    //基础拖动对象
    function DragX(init) {
        var self = this;

        fire(init, self);

        self._apis = [];

        self.start();
    }

    factory(DragX).extend({
        //开始拖动
        start: function () {
            var self = this,
                ops = self.ops,

                win = ops.scope || window,
                document = win.document,

                ele = ops.ele,
                target = ops.target || ele,

                autoIndex = ops.autoIndex !== false,
                autoMask = !!ops.autoMask,
                autoCss = ops.autoCss !== false,
                autoCursor = ops.autoCursor !== false,

                zIndex = ele.nodeType == 1 ? +getStyle(ele, "z-index") : 0,

                doDown = self.doDown,
                doMove = self.doMove,
                doUp = self.doUp,

                onCheck = ops.onCheck,

                onDown = ops.onDown,
                onMove = ops.onMove,
                onUp = ops.onUp,

                topWins = getTops(win),
                //frameWins,

                hasCapture = !!ele.setCapture,
                hasListen = !hasCapture && topWins.length > 0;  //是否需要监听其它窗口

            if (zIndex >= CURRENT_INDEX) CURRENT_INDEX = zIndex + 1;

            //初始化元素状态
            if (autoCss) setCssIfNot(ele, "position", "absolute");
            if (autoCss && autoCursor) setCssIfNot(target, "cursor", "move");

            //设置元素居中
            if (ops.center) {
                setCenter(ele);

                self._api_resize = E.add(win, "resize", function () {
                    setCenter(ele);
                });
            }

            //鼠标按下事件
            var mousedown = function (e) {
                if (isFunc(onCheck) && onCheck.call(self, e) === false) return;

                if (autoIndex) {
                    var _zIndex = +getStyle(ele, "z-index") || 0;
                    if (_zIndex < CURRENT_INDEX) {
                        CURRENT_INDEX++;
                        ele.style.zIndex = CURRENT_INDEX;
                    }
                }

                self._unbind();

                if (hasCapture) {
                    ele.setCapture();
                    self._bind(ele, "losecapture", mouseup);
                } else {
                    self._bind(win, "blur", mouseup);
                }

                self._bind(document, {
                    "mousemove": mousemove,
                    "mouseup": mouseup
                });

                if (hasListen) self._bind(topWins, "mouseup", mouseup);

                //frameWins = getFrames(win);
                //var hasMask = autoMask && !hasCapture && frameWins.length > 0;

                //创建一个遮罩层,在遮罩层上拖动
                //1. 避免某些浏览器在经过iframe时鼠标事件响应不正常
                //2. 避免拖动过程产生文本选区
                if (autoMask) {
                    if (!MASK_FOR_FRAME) MASK_FOR_FRAME = new MaskBox({ color: null, opacity: null, zIndex: 999999 });
                    if (isIE6) MASK_FOR_FRAME.set({ height: view.getScrollHeight() });
                }

                //清除文本选区
                async(clearSelection, 20);

                fire(doDown, self, e);
                fire(onDown, self, e);
            };

            //鼠标移动事件
            var mousemove = function (e) {
                if (self._pause) return;

                fire(doMove, self, e);
                fire(onMove, self, e);
            };

            //鼠标释放事件
            var mouseup = function (e) {
                self._unbind();

                if (hasCapture) ele.releaseCapture();

                if (autoMask && MASK_FOR_FRAME) {
                    MASK_FOR_FRAME.remove();
                    MASK_FOR_FRAME = null;
                }

                clearSelection();

                fire(doUp, self, e);
                fire(onUp, self, e);
            };

            self._up = mouseup;
            self._api = E.add(target, "mousedown", mousedown);

            return self;
        },

        //绑定事件
        _bind: function () {
            this._apis.push(E.add.apply(E, arguments));
        },
        //清理事件绑定
        _unbind: function () {
            var apis = this._apis;

            if (apis.length > 0) {
                apis.forEach(function (api) { api.off(); });
                this._apis = [];
            }
        },

        //暂停拖动
        pause: function (flag) {
            var self = this;

            self._pause = flag;
            self._up && self._up();

            return self;
        },
        //停止拖动
        stop: function () {
            var self = this,
                api = self._api;

            self._unbind();

            if (api) {
                api.off();
                self._api = null;
            }

            return self;
        },

        destroy: function () {
            var self = this,
                api_resize = self._api_resize;

            self.stop();
            if (api_resize) {
                api_resize.off();
                self._api_resize = null;
            }

            return self;
        }
    });

    var ELE_DRAG_SHADOW;

    //设置拖动
    function setDrag(ele, ops) {
        return new DragX(function () {
            if (ele.nodeType != 1) {
                ops = ele;
                ele = ops.ele;
            } else {
                ops = ops || {};
                ops.ele = ele;
            }

            var base = this,

                range = ops.range || { x: 0, y: 0 },
                hasShadow = !!ops.shadow,

                w = ele.offsetWidth,
                h = ele.offsetHeight,

                target = ele,

                startLeft, startTop,

                startX, startY, movedX, movedY, _isX, _isY;

            if (hasShadow) {
                if (!ELE_DRAG_SHADOW) {
                    ELE_DRAG_SHADOW = createEle("div", "x-drag-shadow");
                    Q.body.appendChild(ELE_DRAG_SHADOW);
                }

                target = ELE_DRAG_SHADOW;
            }

            //实现ops接口
            base.ops = ops;

            //实现doDown接口
            base.doDown = function (e) {
                startX = e.clientX;
                startY = e.clientY;

                var offset = hasShadow ? $(ele).offset() : $(ele).position();

                startLeft = offset.left;
                startTop = offset.top;

                if (hasShadow) {
                    Object.forEach({ left: startLeft, top: startTop, width: w, height: h }, function (key, value) {
                        target.style[key] = value + "px";
                    });

                    //cssShow(target);
                }
            };

            //实现doMove接口
            base.doMove = function (e) {
                cssShow(target);

                if (_isX) {
                    movedX = e.clientX - startX;

                    var x = startLeft + movedX;
                    if (range) {
                        if (x < range.x) x = range.x;
                        else if (range.w && x + w > range.x + range.w) x = range.x + range.w - w;
                    }

                    target.style.left = x + "px";
                }
                if (_isY) {
                    movedY = e.clientY - startY;

                    var y = startTop + movedY;
                    if (range) {
                        if (y < range.y) y = range.y;
                        else if (range.h && y + h > range.y + range.h) y = range.y + range.h - h;
                    }
                    target.style.top = y + "px";
                }
            };

            if (hasShadow) {
                base.doUp = function () {
                    cssHide(target);

                    ele.style.left = (ele.offsetLeft + movedX) + "px";
                    ele.style.top = (ele.offsetTop + movedY) + "px";
                };
            }

            //设置拖动方向
            base.setLock = function (isX, isY) {
                _isX = isX;
                _isY = isY;

                return base.pause(!isX && !isY);
            };

            //设置拖动范围
            base.setRange = function (x, y, w, h) {
                range = isObject(x) ? x : { x: x, y: y, w: w, h: h };

                return base;
            };

            base.setLock(ops.isX !== false, ops.isY !== false);
        });
    }

    $.fn.extend({
        drag: function (ops) {
            return this.each(function (i, el) {
                setDrag(el, ops);
            });
        }
    });

    //------------------------- Box -------------------------

    //接口,构造器:Box对象
    function Box(init) {
        this._es = [];

        fire(init, this);
    }

    factory(Box).extend({
        //在弹出框内查找对象
        find: function (pattern, context) {
            return typeof pattern == "string" ? query(pattern, context || this.box) : makeArray(pattern);
        },
        //在弹出框内查找对象
        $: function (pattern, context) {
            return $(this.find(pattern, context));
        },
        //获取弹出框内查找到的第一个对象
        get: function (pattern, context) {
            return this.find(pattern, context)[0];
        },
        //触发回调函数
        fire: function () {
            fire(this.callback, this, this.data);
            return this;
        },
        //获取事件回调函数
        getEventCallback: function (fn, data) {
            var self = this;

            if (fn == "hide") return function () { self.data = data; self.hide(); };
            if (fn == "remove") return function () { self.data = data; self.remove(); };

            return fn;
        },

        //绑定事件,同 Event.add,不过会缓存事件句柄,用于统一销毁
        bind: function (selector, types, fn, data) {
            var self = this;
            self._es.push(E.add(self.find(selector), types, self.getEventCallback(fn, data)));
            return self;
        },
        //事件代理,将事件代理到box上执行
        on: function (types, selector, fn, data) {
            var self = this;
            self._es.push(E.add(self.box, types, selector, self.getEventCallback(fn, data)));
            return self;
        },
        //显示
        show: function () {
            var self = this;

            if (self.onShow) self.onShow();

            cssShow(self.box);
            if (self.mbox) self.mbox.show();

            return self;
        },
        //隐藏
        hide: function () {
            var self = this;

            cssHide(self.box);
            if (self.mbox) self.mbox.hide();
            if (self.onHide) self.onHide();

            return self.fire();
        },
        //自动切换显示或隐藏
        toggle: function () {
            return isHidden(this.box) ? this.show() : this.hide();
        },
        //移除
        remove: function () {
            var self = this;
            if (!self.box) return;

            removeEle(self.box);

            //遮罩层
            if (self.mbox) self.mbox.hide();

            //拖动框
            if (self.dr) self.dr.destroy();

            //解除绑定的事件
            self._es.forEach(function (api) {
                api.off();
            });

            self.box = self.mbox = self.dr = null;

            if (self.onRemove) self.onRemove();

            return self.fire();
        }
    });

    Box.alias({
        "$": "query",
        "remove": "destroy"
    });

    //弹出层语言
    var LANG_BOX = {
        titleBox: "弹出框",
        titleAlert: "提示信息",
        titleConfirm: "确认信息",
        titlePrompt: "输入信息",
        titleClose: "点击关闭",
        titleLoading: "加载数据",

        buttonSubmit: "确定",
        buttonCancel: "取消",

        textLoading: "正在加载数据,请稍后…"
    };

    //配置弹出层
    function setBoxLang(langs) {
        extend(LANG_BOX, langs, true);
    }

    //构造器:弹出层
    function WinBox(ops) {
        ops = ops || {};

        return new Box(function () {
            var self = this,

                width = ops.width,
                height = ops.height,
                maxHeight = def(ops.maxHeight, view.getHeight() - 60),
                isDrag = ops.drag !== false,
                isCenter = isDrag && ops.center !== false,
                className = ops.className;

            self.ops = ops;
            self.callback = ops.callback;

            var html =
                '<div class="x-head">' +
                    '<h2 class="x-title">' + (ops.title || LANG_BOX.titleBox) + '</h2>' +
                    '<a class="x-close" title="' + LANG_BOX.titleClose + '">X</a>' +
                '</div>' +
                '<div class="x-main">' +
                    '<div class="x-view">' +
                        (ops.html || '') +
                    '</div>' +
                '</div>';

            //解决ie6中 div 无法遮盖 select 的问题
            if (isIE6) {
                html += '<iframe class="x-ie-fix" style="position: absolute;top:0;left:0;z-index:-1;" scrolling="no" frameborder="0"></iframe>';
            }

            var box = createEle("div", "x-box" + (className ? " " + className : ""), html);
            Q.body.appendChild(box);

            self.box = box;

            var zIndex = ops.zIndex || 0;
            if (CURRENT_INDEX > DEF_INDEX) zIndex = Math.max(zIndex, CURRENT_INDEX);

            if (zIndex) box.style.zIndex = zIndex;

            var boxHead = getFirst(box),
                boxMain = getNext(boxHead);

            //设置标题
            self.setTitle = function (title) {
                $(".x-title", boxHead).html(title);
                return self;
            };

            //设置宽度
            self.setWidth = function (width) {
                ops.width = width;
                setWidth(box, width);
                fire(ops.resize, self);

                return self;
            };

            //设置高度
            self.setHeight = function (height) {
                ops.height = height;
                setHeight(boxMain, height - boxHead.offsetHeight - 20);

                return self;
            };

            //设置最大高度,超出后出现滚动条
            self.setMaxHeight = function (maxHeight) {
                ops.maxHeight = maxHeight;

                var height = ops.height;

                if (isUNum(height) && height > maxHeight) height = maxHeight;

                if (box.scrollHeight > maxHeight) {
                    height = maxHeight;

                    addClass(box, "x-box-auto");
                }

                if (isUNum(height)) self.setHeight(height);
                if (isCenter) setCenter(box);

                fire(ops.resize, self);

                return self;
            };

            //自动调整高度以适应maxHeight
            self.autoHeight = function () {
                var maxHeight = ops.maxHeight;
                if (!maxHeight) return self;

                var height_head = self.get(".x-head").offsetHeight,
                   height_main = maxHeight - height_head - 20,
                   max_height_main = maxHeight - height_head;

                boxMain.style.height = boxMain.scrollHeight > max_height_main ? height_main + "px" : "auto";
                if (isCenter) setCenter(box);

                return self;
            };

            //兼容性考虑,width最好指定固定值
            if (isUNum(width)) setWidth(box, width);

            if (boxHead.offsetWidth < 10) setWidth(boxHead, box.offsetWidth);

            //高度设置
            if (maxHeight) self.setMaxHeight(maxHeight);
            else if (isUNum(height)) self.setHeight(height);

            //遮罩层
            if (ops.mask !== false) self.mbox = ops.mask == "new" ? new MaskBox() : getMaskBox();

            var action_close = ops.close || "hide",
                callback_close = self.getEventCallback(action_close);

            //点击关闭事件
            self.bind(".x-close", "click", action_close);

            //按ESC关闭事件
            if (ops.esc !== false) {
                self.bind(document, "keyup", function (e) {
                    if (e.keyCode == 27) callback_close();
                });
            }

            //指定时间后自动关闭弹出框
            var time = ops.time;
            if (isUInt(time)) async(callback_close, time);

            fire(ops.init, self, box, ops);

            //拖动
            if (isDrag) {
                self.dr = setDrag(box, {
                    target: boxHead,
                    center: isCenter,
                    shadow: ops.shadow,
                    autoMask: true,

                    //1.由于拖动会创建一个遮罩层,点击关闭时不会触发 .x-close 的click事件,此处检查点击元素,只有非 .x-close 元素才会执行拖动操作
                    //2.亦可将 .x-close 的click事件替换为mousedown事件以优先执行,可不必传入onCheck
                    onCheck: function (e) {
                        var target = e.target;
                        return target && target.className != "x-close";
                    }
                });
            }

            $(".x-ie-fix", box).width(box.offsetWidth - 2).height(box.offsetHeight - 2);
        });
    }

    //创建对话框
    function createDialogBox(ops) {
        if (!ops.width) ops.width = 320;

        var width = ops.width;

        if (ops.icon || ops.iconHtml) {
            var html =
                '<div class="fl x-ico">' +
                    (ops.iconHtml || '<img alt="" src="' + ops.icon + '"/>') +
                '</div>' +
                '<div class="fl x-dialog"' + (isUNum(width) ? ' style="width:' + (width - 60) + 'px;"' : '') + '>' + ops.html + '</div>' +
                '<div class="clear"></div>';

            ops.html = html;

            var oldInit = ops.init;

            ops.resize = function () {
                var self = this,
                    contentWidth = self.get(".x-view").offsetWidth - self.get(".x-ico").offsetWidth;

                $(".x-dialog", self.box).width(contentWidth);
            };

            ops.init = function (box, ops) {
                var self = this;

                ops.resize.call(self);
                fire(oldInit, self, box, ops);
            };
        } else {
            ops.html = '<div class="x-dialog">' + ops.html + '</div>';
        }

        if (ops.bottom) ops.html += ops.bottom;
        if (!ops.close) ops.close = "remove";

        return WinBox(ops);
    }

    //获取底部模板代码
    function get_bottom_html(mode, style) {
        var buttonStyle = 'inline-block w-button w-' + (style || "dark"),

            html =
                '<div class="x-bottom">' +
                    '<div class="' + buttonStyle + ' x-submit">' + LANG_BOX.buttonSubmit + '</div>' +
                    (mode == 2 ? '<div class="' + buttonStyle + ' x-cancel">' + LANG_BOX.buttonCancel + '</div>' : '') +
                '</div>';

        return html;
    }

    //获取弹出框配置对象
    function get_dialog_ops(title, msg, fn, ops) {
        if (typeof fn === "object") {
            ops = fn;
            fn = ops;
        }

        ops = extend({}, ops);
        if (isFunc(fn)) ops.callback = fn;
        if (!ops.title) ops.title = title;
        ops.html = msg;

        return ops;
    }

    var dialog = {
        //创建自定义弹出框
        createDialogBox: createDialogBox,

        //提示框
        alert: function (msg, fn, ops) {
            ops = get_dialog_ops(LANG_BOX.titleAlert, msg, fn, ops);
            //ops.icon = 'images/Q/alert.gif';
            ops.iconHtml = '<div class="ico x-alert"></div>';

            return createDialogBox(ops);
        },
        //确认框
        confirm: function (msg, fn, ops) {
            ops = get_dialog_ops(LANG_BOX.titleConfirm, msg, fn, ops);
            if (!ops.bottom) ops.bottom = get_bottom_html(2);
            ops.mask = ops.mask !== false;

            var box = createDialogBox(ops);
            return box.bind(".x-submit", "click", "remove", true).bind(".x-cancel", "click", "remove", false);
        },
        prompt: function (msg, fn, ops) {
            ops = get_dialog_ops(LANG_BOX.titlePrompt, undefined, fn, ops);
            fn = ops.callback;
            ops.callback = undefined;

            var html =
                '<div class="x-text">' + msg + '</div>' +
                '<div class="x-input"><input type="' + (ops.pwd ? 'password' : 'text') + '" /></div>';

            ops.html = html;
            if (!ops.bottom) ops.bottom = get_bottom_html(2);

            var box = createDialogBox(ops),
                input = box.get(".x-input>input");

            input.focus();
            input.value = def(ops.value, "");

            var submit = function () {
                var v = fire(fn, input, input.value);
                if (v !== false) box.remove();
                else setInputError(input);
            };

            //输入框快捷提交
            box.bind(input, "keyup", function (e) {
                if (e.keyCode == 13) submit();
                else setInputDefault(this);
            });

            //确定与取消
            return box.bind(".x-submit", "click", submit).bind(".x-cancel", "click", "remove");
        },

        bottom: get_bottom_html,

        //显示加载框
        showLoading: function (ops) {
            ops = extend({}, ops);

            if (!ops.title) ops.title = LANG_BOX.titleLoading;
            if (!ops.html) ops.html = LANG_BOX.textLoading;
            //ops.icon = 'images/Q/loading.gif';
            ops.iconHtml = '<div class="ico x-loading"></div>';

            return createDialogBox(ops);
        }
    };

    extend(Q, dialog);

    //------------------------- export -------------------------

    extend(Q, {
        getMaskBox: getMaskBox,
        maskSetup: maskSetup,

        setDrag: setDrag,
        setBoxLang: setBoxLang,

        MaskBox: MaskBox,
        DragX: DragX,

        Box: Box,
        WinBox: WinBox
    });

})();