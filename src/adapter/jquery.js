/// <reference path="../../lib/jquery-1.11.3.js" />
/// <reference path="../../lib/Q.mini.js" />
/*
* Q.UI.adapter.jquery.js
* author:devin87@qq.com  
* update:2015/07/15 11:43
*/
(function (undefined) {
    "use strict";

    var window = Q.G,

        isFunc = Q.isFunc,
        isObject = Q.isObject,
        isArrayLike = Q.isArrayLike,

        extend = Q.extend,
        async = Q.async,
        makeArray = Q.makeArray;

    //---------------------- core.js ----------------------

    var document = window.document,

        html = document.documentElement,
        head = document.head || document.getElementsByTagName("head")[0],

        is_quirk_mode = document.compatMode == "BackCompat",

        body,
        root;

    //清除文本选区
    function clearSelection() {
        if (window.getSelection) {
            var sel = getSelection();
            if (sel.removeAllRanges) sel.removeAllRanges();
            else if (sel.empty) sel.empty();    //old chrome and safari
        } else if (document.selection) {   //ie
            document.selection.empty();
        }
    }

    function init() {
        Q.body = body = document.body;
        Q.root = root = is_quirk_mode ? body : html;
    }

    //确保 document.body 已就绪
    if (document.body) init();
    else async(init, 0);

    //----------------------- view -----------------------

    //页面视图
    var view = {
        //获取可用宽高
        getSize: function () {
            return { width: root.clientWidth, height: root.clientHeight };
        },
        //获取可用宽度
        getWidth: function () {
            return root.clientWidth;
        },
        //获取可用高度
        getHeight: function () {
            return root.clientHeight;
        },
        //获取页面宽度(包括滚动条)
        getScrollWidth: function () {
            //fix webkit bug:document.documentElement.scrollWidth等不能准确识别
            return Math.max(html.scrollWidth, body.scrollWidth);
        },
        //获取页面高度(包括滚动条)
        getScrollHeight: function () {
            //fix webkit bug
            return Math.max(html.scrollHeight, body.scrollHeight);
        },
        //获取左边的滚动距离
        getScrollLeft: function () {
            //fix webkit bug
            return html.scrollLeft || body.scrollLeft;
        },
        //获取上边的滚动距离
        getScrollTop: function () {
            //fix webkit bug
            return html.scrollTop || body.scrollTop;
        }
    };

    extend(Q, {
        html: html,
        head: head,
        quirk: is_quirk_mode,

        clearSelection: clearSelection,

        view: view
    });

    //---------------------- browser.js ----------------------

    var browser_ie,
        engine_name = "unknown",
        engine = {};

    //ie11 开始不再保持向下兼容(例如,不再支持 ActiveXObject、attachEvent 等特性)
    if (window.ActiveXObject || window.msIndexedDB) {
        //window.ActiveXObject => ie10-
        //window.msIndexedDB   => ie11+

        engine.ie = browser_ie = document.documentMode || (!!window.XMLHttpRequest ? 7 : 6);
        engine["ie" + (browser_ie < 6 ? 6 : browser_ie)] = true;

        engine_name = "trident";
    } else if (window.opera) {
        engine_name = "opera";
    } else if (window.mozInnerScreenX != undefined || isFunc(document.getBoxObjectFor)) {
        //document.getBoxObjectFor => firefox3.5-
        //window.mozInnerScreenX   => firefox3.6+
        engine_name = "gecko";
    } else if (window.WebKitPoint || window.devicePixelRatio) {
        //window.WebKitPoint => chrome8+
        engine_name = "webkit";
    }

    engine[engine_name] = true;

    extend(Q, engine);

    engine.name = engine_name;

    Q.engine = engine;

    //---------------------- event.js ----------------------

    function stop_event(event, isPreventDefault, isStopPropagation) {
        var e = new jQuery.Event(event);
        if (isPreventDefault !== false) e.preventDefault();
        if (isStopPropagation !== false) e.stopPropagation();
    }

    jQuery.Event.prototype.stop = function () {
        stop_event(this);
    };

    var SUPPORT_W3C_EVENT = !!document.addEventListener;

    //添加DOM事件,未做任何封装
    function addEvent(ele, type, fn) {
        if (SUPPORT_W3C_EVENT) ele.addEventListener(type, fn, false);
        else ele.attachEvent("on" + type, fn);  //注意:fn的this并不指向ele
    }

    //移除DOM事件
    function removeEvent(ele, type, fn) {
        if (SUPPORT_W3C_EVENT) ele.removeEventListener(type, fn, false);
        else ele.detachEvent("on" + type, fn);
    }

    //添加事件
    function add_event(ele, type, selector, fn, once, stops) {
        var handle = fn;

        if (once) {
            handle = function (e) {
                fn.call(this, e);

                $(ele).off(type, selector, handle);
            };
        }

        $(ele).on(type, selector, handle);

        if (!once) stops.push([ele, type, handle, selector]);
    }

    //批量添加事件
    //types:事件类型,多个之间用空格分开;可以为对象
    //selector:要代理的事件选择器或处理句柄
    function add_events(elements, types, selector, handle, once) {
        if (typeof types == "string") {
            types = types.split(' ');

            if (isFunc(selector)) {
                once = once || handle;
                handle = selector;
                selector = undefined;
            }
        } else {
            if (selector === true || handle === true) once = true;
            if (selector === true) selector = undefined;
        }

        var stops = [];

        makeArray(elements).forEach(function (ele) {
            if (isArrayLike(types)) {
                makeArray(types).forEach(function (type) {
                    add_event(ele, type, selector, handle, once, stops);
                });
            } else if (isObject(types)) {
                Object.forEach(types, function (type, handle) {
                    add_event(ele, type, selector, handle, once, stops);
                });
            }
        });

        //返回移除事件api
        return {
            es: stops,

            off: function (types, selector) {
                remove_events(stops, types, selector);
            }
        };
    }

    //批量移除事件
    //es:事件句柄对象列表  eg:es => [[ele, type, handle, selector],...]
    function remove_events(es, types, selector) {
        es.forEach(function (s) {
            $(s[0]).off(s[1], s[3], s[2]);
        });
    }

    //批量添加事件,执行一次后取消
    function add_events_one(elements, types, selector, handle) {
        return add_events(elements, types, selector, handler, true);
    }

    Q.event = {
        fix: function (e) {
            return new jQuery.Event(e);
        },
        stop: stop_event,
        trigger: function (el, type) {
            $(el).trigger(type);
        },

        //原生事件添加(建议使用add)
        addEvent: addEvent,
        //原生事件移除
        removeEvent: removeEvent,

        //添加事件,并返回操作api
        add: add_events,

        //注意:批量移除事件,与一般事件移除不同;移除事件请使用add返回的api
        removeEs: remove_events,
        one: add_events_one
    };

    //---------------------- dom.js ----------------------

    //var _parseFloat = parseFloat;

    //当元素的css值与要设置的css值不同时,设置css
    function setCssIfNot(el, key, value) {
        var $el = $(el);
        if (el && $el.css(key) != value) $el.css(key, value);
    }

    //创建元素
    function createEle(tagName, className, html) {
        var el = document.createElement(tagName);
        if (className) el.className = className;
        if (html) el.innerHTML = html;

        return el;
    }

    //解析html为元素,默认返回第一个元素节点
    //all:是否返回所有节点(childNodes)
    function parseHTML(html, all) {
        var _pNode = createEle("div", undefined, html);

        return all ? _pNode.childNodes : Q.getFirst(_pNode);
    }

    //移除指定内联样式
    function removeCss(el, key) {
        var cssText = el.style.cssText;
        if (cssText) el.style.cssText = cssText.drop(key + "(-[^:]+)?\\s*:[^;]*;?", "gi").trim();
    }

    //将输入框样式设为错误模式
    function setInputError(input, hasBorder) {
        if (hasBorder) input.style.borderColor = "red";
        else input.style.border = "1px solid red";

        input.value = "";
        input.focus();
    }

    //恢复输入框默认样式
    function setInputDefault(input) {
        removeCss(input, "border");
    }

    var NODE_PREV = "previousSibling",
        NODE_NEXT = "nextSibling",
        NODE_FIRST = "firstChild",
        NODE_LAST = "lastChild";

    //遍历元素节点
    function walk(el, walk, start, all) {
        var el = el[start || walk];
        var list = [];
        while (el) {
            if (el.nodeType == 1) {
                if (!all) return el;
                list.push(el);
            }
            el = el[walk];
        }
        return all ? list : null;
    }

    extend(Q, {
        camelCase: $.camelCase,

        attr: function (el, key, value) {
            return $(el).attr(key, value);
        },
        prop: function (el, key, value) {
            return $(el).prop(key, value);
        },
        width: function (el, w) {
            return $(el).width(w);
        },
        height: function (el, h) {
            return $(el).height(h);
        },
        getStyle: function (el, key) {
            return $(el).css(key);
        },
        setStyle: function (el, key, value) {
            if (value === null) return removeCss(el, key);
            $(el).css(key, value);
        },
        setOpacity: function (el, value) {
            return $(el).css("opacity", value);
        },
        removeCss: removeCss,
        css: function (el, key, value) {
            return $(el).css(key, value);
        },

        show: function (el) {
            $(el).show();
        },
        hide: function (el) {
            $(el).hide();
        },
        toggle: function (el) {
            $(el).toggle();
        },
        isHidden: function (el) {
            return $(el).is(":hidden");
        },
        offset: function (el, x, y) {
            var $el = $(el);

            if (x === undefined && y === undefined) {
                var offset = $el.offset();

                offset.width = $el.outerWidth();
                offset.height = $el.outerHeight();

                return offset;
            }

            setCssIfNot(el, "position", "absolute");
            if (x !== undefined) $el.css("left", x);
            if (y !== undefined) $el.css("top", y);

        },
        //getPos: function (el, pNode) {
        //    if (!pNode) pNode = el.offsetParent;

        //    var $el = $(el),
        //        $pl = $(pNode),

        //        offset = $el.offset(),
        //        poffset = $pl.offset();

        //    offset.left -= poffset.left + _parseFloat($pl.css("borderLeftWidth")) + _parseFloat($el.css("marginLeft"));

        //    offset.top -= poffset.top + _parseFloat($pl.css("borderTopWidth")) + _parseFloat($el.css("marginTop"));

        //    return offset;
        //},

        setCssIfNot: setCssIfNot,
        setCenter: function (el) {
            setCssIfNot(el, "position", "absolute");

            var size = view.getSize(),
                offset = $(el.offsetParent).offset(),

                left = Math.round((size.width - el.offsetWidth) / 2) - offset.left + view.getScrollLeft(),
                top = Math.round((size.height - el.offsetHeight) / 2) - offset.top + view.getScrollTop();

            $(el).css({ left: Math.max(left, 0), top: Math.max(top, 0) });
        },

        getFirst: function (el) {
            return el.firstElementChild || walk(el, NODE_NEXT, NODE_FIRST, false);
        },
        getLast: function (el) {
            return el.lastElementChild || walk(el, NODE_PREV, NODE_LAST, false);
        },
        getPrev: function (el) {
            return el.previousElementSibling || walk(el, NODE_PREV, null, false);
        },
        getNext: function (el) {
            return el.nextElementSibling || walk(el, NODE_NEXT, null, false);
        },
        getChilds: function (el) {
            //walk方式性能要好于通过childNodes筛选
            return el.children ? makeArray(el.children) : walk(el, NODE_NEXT, NODE_FIRST, true);
        },

        findTag: function (el, tagName) {
            while (el && el.tagName != "BODY") {
                if (el.tagName == tagName) return el;
                el = el.parentNode;
            }
        },
        createEle: createEle,
        parseHTML: parseHTML,
        removeEle: function (el) {
            $(el).remove();
        },

        hasClass: function (el, clsName) {
            return $(el).hasClass(clsName);
        },
        addClass: function (el, clsName) {
            $(el).addClass(clsName);
        },
        removeClass: function (el, clsName) {
            $(el).removeClass(clsName);
        },
        replaceClass: function (el, oldName, clsName) {
            $(el).removeClass(oldName).addClass(clsName);
        },
        toggleClass: function (el, clsName) {
            $(el).toggleClass(clsName);
        },

        setInputError: setInputError,
        setInputDefault: setInputDefault
    });

    window.$$ = Q.query = $.find;

})();