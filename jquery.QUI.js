//Q.mini.js (Q.js、Q.Queue.js、Q.core.js、Q.setTimer.js) for jquery 等库
﻿/*
* Q.js (包括 通用方法、原生对象扩展 等) for browser or Node.js
* https://github.com/devin87/Q.js
* author:devin87@qq.com  
* update:2018/11/28 19:40
*/
(function (undefined) {
    "use strict";

    //Node.js中闭包外部this并非global eg:(function(g){})(this); //this not global
    //严格模式下this不指向全局变量
    var GLOBAL = typeof global == "object" ? global : window,

        toString = Object.prototype.toString,
        has = Object.prototype.hasOwnProperty,
        slice = Array.prototype.slice;

    //严格模式与window识别检测
    //2018/10/10: uglify压缩会导致此检测函数失效
    //function detect_strict_mode() {
    //    var f = function (arg) {
    //        arguments[0] = 1;

    //        return arg != arguments[0];
    //    };

    //    return f(0);
    //}

    //默认严格模式,不再通过检测判断
    var is_strict_mode = true, //detect_strict_mode(),
        is_window_mode = GLOBAL == GLOBAL.window;

    //返回对象的类型(小写)
    function getType(obj) {
        if (obj == undefined) return "" + obj;

        //内置函数,性能最好 (注意：safari querySelectorAll返回值类型为function)
        if (typeof obj !== "object" && typeof obj !== "function") return typeof obj;

        //非window模式(Node)下禁用以下检测
        if (is_window_mode) {
            if (typeof obj.nodeType === "number") return "node";

            if (typeof obj.length === "number") {
                //严格模式禁止使用 arguments.callee,调用会报错
                //IE9+等使用 toString.call 会返回 [object Arguments],此为兼容低版本IE
                //if (!is_strict_mode && obj.callee) return "arguments";

                //IE9+等使用 toString.call 会返回 [object Window],此为兼容低版本IE
                if (obj == obj.window) return "window";

                //document.getElementsByTagName("*") => HTMLCollection
                //document.querySelectorAll("*")     => NodeList
                //此处统一为 list
                if (obj.item) return "list";
            }
        }

        //在某些最新的浏览器中(IE11、Firefox、Chrome)性能与hash读取差不多 eg: return class2type[toString.call(obj)];
        return toString.call(obj).slice(8, -1).toLowerCase();
    }

    //检测是否为函数
    function isFunc(fn) {
        //在IE11兼容模式（ie6-8）下存在bug,当调用次数过多时可能返回不正确的结果
        //return typeof fn == "function";

        return toString.call(fn) === "[object Function]";
    }

    //检测是否为对象
    function isObject(obj) {
        //typeof null => object
        //toString.call(null) => [object Object]

        return obj && toString.call(obj) === "[object Object]";
    }

    //检测是否为数组
    function isArray(obj) {
        return toString.call(obj) === "[object Array]";
    }

    //检测是否为数组或类数组
    function isArrayLike(obj) {
        var type = getType(obj);

        return type == "array" || type == "list" || type == "arguments";
    }

    //若value不为undefine,则返回value;否则返回defValue
    function def(value, defValue) {
        return value !== undefined ? value : defValue;
    }

    //检测是否为数字
    function isNum(n, min, max, max_decimal_len) {
        if (typeof n != "number") return false;

        if (min != undefined && n < min) return false;
        if (max != undefined && n > max) return false;

        if (max_decimal_len) {
            var l = ((n + '').split('.')[1] || '').length;
            if (l > max_decimal_len) return false;
        }

        return true;
    }

    //检测是否为大于0的数字
    function isUNum(n) {
        return typeof n == "number" && n > 0;
    }

    //检测是否为整数
    function isInt(n, min, max) {
        return isNum(n, min, max) && n === Math.floor(n);
    }

    //检测是否为大于0的整数
    function isUInt(n) {
        return isInt(n, 1);
    }

    //判断字符串是否是符合条件的数字
    function checkNum(str, min, max, max_decimal_len) {
        return str != null && str != "" && !isNaN(str) && isNum(+str, min, max, max_decimal_len);
    }

    //判断字符串是否是符合条件的整数
    function checkInt(str, min, max) {
        return str != null && str != "" && !isNaN(str) && isInt(+str, min, max);
    }

    //将字符串转为大写,若str不是字符串,则返回defValue
    function toUpper(str, defValue) {
        return typeof str == "string" ? str.toUpperCase() : defValue;
    }

    //将字符串转为小写,若str不是字符串,则返回defValue
    function toLower(str, defValue) {
        return typeof str == "string" ? str.toLowerCase() : defValue;
    }

    //转为数组
    function toArray(obj, from) {
        var tmp = [];

        for (var i = from || 0, len = obj.length; i < len; i++) {
            tmp.push(obj[i]);
        }

        return tmp;
    }

    //将 NodeList 转为 Array
    var makeArrayNode = (function () {
        try {
            slice.call(document.documentElement.childNodes);

            return function (obj, from) {
                return slice.call(obj, from);
            }
        } catch (e) {
            return toArray;
        }
    })();

    //将类数组对象转为数组,若对象不存在,则返回空数组
    function makeArray(obj, from) {
        if (obj == undefined) return [];

        switch (getType(obj)) {
            case "array": return from ? obj.slice(from) : obj;
            case "list": return makeArrayNode(obj, from);
            case "arguments": return slice.call(obj, from);
        }

        return [obj];
    }

    //按条件产生数组 arr(5,2,2) => [2,4,6,8,10]
    //eg:按1-10项产生斐波那契数列 =>arr(10, function (value, i, list) { return i > 1 ? list[i - 1] + list[i - 2] : 1; })
    //length:数组长度
    //value:数组项的初始值
    //step:递增值或处理函数(当前值,索引,当前产生的数组)
    function arr(length, value, step) {
        if (isFunc(value)) {
            step = value;
            value = 0;
        }
        if (value == undefined) value = 0;
        if (step == undefined) step = 1;

        var list = [], i = 0;

        if (isFunc(step)) {
            while (i < length) {
                value = step(value, i, list);
                list.push(value);
                i++;
            }
        } else {
            while (i < length) {
                list.push(value);
                value += step;
                i++;
            }
        }

        return list;
    }

    //根据指定的键或索引抽取数组项的值
    //eg:vals([{id:1},{id:2}], "id")  =>  [1,2]
    //eg:vals([[1,"a"],[2,"b"]], 1)   =>  ["a","b"]
    //skipUndefined:是否跳过值不存在的项,默认为true
    function vals(list, prop, skipUndefined) {
        if (!list) return [];

        skipUndefined = skipUndefined !== false;

        var len = list.length,
            i = 0,
            item,
            tmp = [];

        for (; i < len; i++) {
            item = list[i];
            if (item && item[prop] != undefined) {
                tmp.push(item[prop]);
            } else if (!skipUndefined) {
                tmp.push(undefined);
            }
        }

        return tmp;
    }

    //prototype 别名 eg:alias(Array,"forEach","each");
    function alias(obj, name, aliasName) {
        if (!obj || !obj.prototype) return;

        var prototype = obj.prototype;

        if (typeof name == "string") {
            prototype[aliasName] = prototype[name];
        } else {
            for (var key in name) {
                if (has.call(name, key) && has.call(prototype, key)) prototype[name[key]] = prototype[key];
            }
        }

        return obj;
    }

    //扩展对象
    //forced:是否强制扩展
    function extend(destination, source, forced) {
        if (!destination || !source) return destination;

        for (var key in source) {
            if (key == undefined || !has.call(source, key)) continue;

            if (forced || destination[key] === undefined) destination[key] = source[key];
        }
        return destination;
    }

    //数据克隆（for undefined、null、string、number、boolean、array、object）
    function clone(data) {
        if (!data) return data;

        switch (typeof data) {
            case "string":
            case "number":
            case "boolean":
                return data;
        }

        var result;

        if (isArray(data)) {
            result = [];
            for (var i = 0, len = data.length; i < len; i++) {
                result[i] = clone(data[i]);
            }
        } else if (isObject(data)) {
            result = {};
            for (var key in data) {
                if (has.call(data, key)) result[key] = clone(data[key]);
            }
        }

        return result;
    }

    //将数组或类数组转换为键值对
    //fv:默认值(fv可为处理函数,该函数返回一个长度为2的数组 eg:[key,value])
    //ignoreCase:键是否忽略大小写(如果是,则默认小写)
    function toMap(list, fv, ignoreCase) {
        if (!list) return;

        var map = {},
            isFn = isFunc(fv),
            hasValue = fv !== undefined;

        for (var i = 0, len = list.length; i < len; i++) {
            var key = list[i], value;
            if (key == undefined) continue;

            if (isFn) {
                var kv = fv.call(list, key, i);
                if (!kv) continue;

                key = kv[0];
                value = kv[1];
            } else {
                value = hasValue ? fv : i;
            }

            map[ignoreCase ? key.toLowerCase() : key] = value;
        }

        return map;
    }

    //将对象数组转换为键值对
    //propKey:对象中作为键的属性
    //propValue:对象中作为值的属性,若为空,则值为对象本身;若为true,则给对象添加index属性,值为对象在数组中的索引
    function toObjectMap(list, propKey, propValue) {
        if (!list) return;

        var map = {}, isBuildIndex = false;

        if (propValue === true) {
            isBuildIndex = propValue;
            propValue = undefined;
        }

        for (var i = 0, len = list.length; i < len; i++) {
            var obj = list[i];
            if (!obj || typeof obj != "object") continue;

            if (isBuildIndex) obj.index = i;

            map[obj[propKey]] = propValue ? obj[propValue] : obj;
        }

        return map;
    }

    //转为字符串
    //undefined|null  => ""
    //true|false      => "true" | "false"
    //0               => "0"
    function to_string(v) {
        return v == undefined ? "" : v + "";
    }

    //按字符串排序
    function sortString(list, prop, desc) {
        if (desc) list.sort(function (a, b) { return -to_string(a[prop]).localeCompare(to_string(b[prop])); });
        else list.sort(function (a, b) { return to_string(a[prop]).localeCompare(to_string(b[prop])); });
    }

    //按数字排序
    function sortNumber(list, prop, desc) {
        if (desc) list.sort(function (a, b) { return (+b[prop] || 0) - (+a[prop] || 0); });
        else list.sort(function (a, b) { return (+a[prop] || 0) - (+b[prop] || 0); });
    }

    //按日期排序
    function sortDate(list, prop, desc) {
        list.sort(function (a, b) {
            var v1 = a[prop], v2 = b[prop];
            if (v1 == v2) return 0;

            var d1 = Date.from(v1), d2 = Date.from(v2), rv = 0;

            if (d1 != INVALID_DATE && d2 != INVALID_DATE) rv = d1 - d2;
            else if (d1 == INVALID_DATE && d2 != INVALID_DATE) rv = -1;
            else if (d1 != INVALID_DATE && d2 == INVALID_DATE) rv = 1;

            return desc ? -rv : rv;
        });
    }

    //IP转数字（用于排序）
    function ip2int(ip) {
        var ips = ip.split('.');

        return (+ips[0] || 0) * 256 * 256 * 256 + (+ips[1] || 0) * 256 * 256 + (+ips[2] || 0) * 256 + (+ips[3] || 0);
    }

    //按IP排序
    function sortIP(list, prop, desc) {
        list.sort(function (a, b) {
            var v1 = a[prop] || "", v2 = b[prop] || "";
            if (v1 == v2) return 0;

            var rv = ip2int(v1) - ip2int(v2);

            return desc ? -rv : rv;
        });
    }

    //对象数组排序
    //type:排序类型 0:字符串排序|1:数字排序|2:日期排序|3:IP排序
    function sortList(list, type, prop, desc) {
        switch (type) {
            case 1: sortNumber(list, prop, desc); break;
            case 2: sortDate(list, prop, desc); break;
            case 3: sortIP(list, prop, desc); break;
            default: sortString(list, prop, desc); break;
        }
    }

    //返回一个绑定到指定作用域的新函数
    function proxy(fn, bind) {
        if (isObject(fn)) {
            var name = bind;
            bind = fn;
            fn = bind[name];
        }

        return function () {
            fn.apply(bind, arguments);
        }
    }

    //触发指定函数,如果函数不存在,则不触发 eg:fire(fn,this,arg1,arg2)
    function fire(fn, bind) {
        if (fn != undefined) return fn.apply(bind, slice.call(arguments, 2));
    }

    //延迟执行,若fn未定义,则忽略 eg:delay(fn,this,10,[arg1,arg2])
    //注意:若传入args,则args必须为数组
    function delay(fn, bind, time, args) {
        if (fn == undefined) return;

        return setTimeout(function () {
            //ie6-7,apply第二个参数不能为空,否则报错
            fn.apply(bind, args || []);
        }, def(time, 20));
    }

    //异步执行,相当于setTimeout,但会检查fn是否可用 eg:async(fn,10,arg1,arg2)
    function async(fn, time) {
        return isFunc(fn) && delay(fn, undefined, time, slice.call(arguments, 2));
    }

    //等待达到条件或超时时,执行一个回调函数 callback(ops,timedout)
    function _waitFor(ops) {
        var now_time = +new Date,

            timeout = ops.timeout,  //超时时间
            timedout = timeout && now_time - ops.startTime > timeout;  //是否超时

        //若未超时且未达到条件,则继续等待
        if (!timedout && !ops.check(ops)) {
            ops.count++;

            return async(_waitFor, ops.sleep, ops);
        }

        ops.endTime = now_time;
        ops.callback(ops, timedout);
    }

    //等待达到条件或超时时,执行一个回调函数 callback(ops,timedout)
    //timeout:超时时间(单位:ms),默认10000ms
    //sleep:每次休眠间隔(单位:ms),默认20ms
    function waitFor(check, callback, timeout, sleep) {
        _waitFor({
            check: check,
            callback: callback,
            timeout: timeout,
            sleep: sleep,

            count: 0,
            startTime: +new Date
        });
    };

    //遍历数组或类数组
    //与浏览器实现保持一致(忽略未初始化的项,注意:ie8及以下会忽略数组中 undefined 项)
    function each_array(list, fn, bind) {
        for (var i = 0, len = list.length; i < len; i++) {
            if (i in list) fn.call(bind, list[i], i, list);
        }
    }

    //简单通用工厂
    function factory(init, Super) {
        if (Super && isFunc(Super)) {
            var F = function () { };
            F.prototype = Super.prototype;

            init.prototype = new F();
        }

        var obj = init;

        obj.constructor = factory;
        obj.prototype.constructor = obj;

        //prototype扩展
        obj.extend = function (source, forced) {
            extend(this.prototype, source, forced);
        };

        //函数别名
        obj.alias = function (name, aliasName) {
            alias(this, name, aliasName);
        };

        return obj;
    };

    /*
    * extend.js:JavaScript核心对象扩展
    */
    each_array([String, Array, Number, Boolean, Function, Date, RegExp], factory);

    //----------------------------- Object extend -----------------------------

    //扩展Object
    extend(Object, {
        //创建一个拥有指定原型的对象,未实现第二个参数
        create: function (o) {
            var F = function () { };
            F.prototype = o;
            return new F();
        },

        //遍历对象
        forEach: function (obj, fn, bind) {
            for (var key in obj) {
                if (has.call(obj, key)) fn.call(bind, key, obj[key], obj);
            }
        },

        //获取对象所有键
        keys: function (obj) {
            var tmp = [];

            //注意:for in 在ie6下无法枚举 propertyIsEnumerable,isPrototypeOf,hasOwnProperty,toLocaleString,toString,valueOf,constructor 等属性
            //尽量不要使用上述属性作为键
            for (var key in obj) {
                if (has.call(obj, key)) tmp.push(key);
            }

            return tmp;
        },
        //获取对象所有值
        values: function (obj) {
            var tmp = [];

            for (var key in obj) {
                if (has.call(obj, key)) tmp.push(obj[key]);
            }

            return tmp;
        },

        //获取项数量
        size: function (obj) {
            var count = 0;

            for (var key in obj) {
                if (has.call(obj, key)) count++;
            }

            return count;
        },

        //对象是否拥有子项
        hasItem: function (obj) {
            for (var key in obj) {
                if (has.call(obj, key)) return true;
            }

            return false;
        }
    });

    //----------------------------- String extend -----------------------------

    //String原型扩展(已标准化,此为兼容浏览器原生方法)
    String.extend({
        //去掉首尾空格
        trim: function () {
            //return this.replace(/^\s+|\s+$/g, "");

            var str = "" + this,
                str = str.replace(/^\s\s*/, ""),
                ws = /\s/,
                i = str.length;

            while (ws.test(str.charAt(--i))) { };

            return str.slice(0, i + 1);
        },
        //返回将本身重复n次的字符串 eg:"abc".repeat(2) => "abcabc"
        repeat: function (n) {
            //if (n < 1) return "";

            //return new Array(n + 1).join(this);

            //二分法,性能大大提升
            var str = "" + this,
                total = "";

            while (n > 0) {
                if (n % 2 == 1) total += str;
                if (n == 1) break;

                str += str;
                n >>= 1;
            }

            return total;
        },
        //是否以指定字符串开头
        startsWith: function (str, index) {
            var s = "" + this;

            return s.substr(index || 0, str.length) === str;
        },
        //是否以指定字符串结尾
        endsWith: function (str, index) {
            var s = "" + this,
                end = index == undefined || index > s.length ? s.length : index;

            return s.substr(end - str.length, str.length) === str;
        },
        //是否包含指定字符串
        contains: function (str, index) {
            return this.indexOf(str, index) != -1;
        }
    });

    //String原型扩展
    String.extend({
        //删除指定字符串
        //pattern:要删除的字符串或正则表达式
        //flags:正则表达式标记,默认为g
        drop: function (pattern, flags) {
            var regexp = typeof pattern == "string" ? new RegExp(pattern, flags || "g") : pattern;
            return this.replace(regexp, "");
        },
        //字符串反转
        reverse: function () {
            return this.split("").reverse().join("");
        },
        //html编码 eg:\n => <br/>
        htmlEncode: function () {
            return this.replace(/\x26/g, "&amp;").replace(/\x3c/g, "&lt;").replace(/\x3e/g, "&gt;").replace(/\r?\n|\r/g, "<br/>").replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;").replace(/\s/g, "&nbsp;");
        },
        //html解码 eg:<br/> => \n
        htmlDecode: function () {
            return this.replace(/<br[^>]*>/ig, "\n").replace(/<script[^>]*>([^~]|~)+?<\/script>/gi, "").replace(/<[^>]+>/g, "").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&");
        }
    });

    //----------------------------- Number extend -----------------------------

    //Number原型扩展
    Number.extend({
        //将数字按长度和进制转换为一个长度不低于自身的字符串 eg:(13).format(4) ->'0013'
        //(13).format(1) -> '13'   (13).format(4, 16)->'000d'   (13).format(4, 2) ->'1101'
        format: function (length, radix) {
            var str = this.toString(radix || 10), fix = length - str.length;
            return (fix > 0 ? "0".repeat(fix) : "") + str;
        }
    });

    //----------------------------- Array extend -----------------------------

    //Array原型扩展(已标准化,此为兼容浏览器原生方法)
    //与浏览器实现保持一致(忽略未初始化的项,注意:ie8及以下会忽略数组中 undefined 项)
    //部分函数未做参数有效性检测,传参时需注意
    Array.extend({
        //迭代器:用函数(fn)处理数组的每一项
        forEach: function (fn, bind) {
            var self = this;
            for (var i = 0, len = self.length; i < len; i++) {
                if (i in self) fn.call(bind, self[i], i, self);
            }
        },
        //迭代器:返回经过函数(fn)处理后的新数组
        map: function (fn, bind) {
            var self = this, tmp = [];
            for (var i = 0, len = self.length; i < len; i++) {
                if (i in self) tmp.push(fn.call(bind, self[i], i, self));
            }
            return tmp;
        },
        //查找方法(顺序)
        indexOf: function (item, index) {
            var self = this, len = self.length, i;
            if (len == 0) return -1;

            if (index == undefined) i = 0;
            else {
                i = Number(index);
                if (i < 0) i = Math.max(i + len, 0);
            }

            for (; i < len; i++) {
                if (i in self && self[i] === item) return i;
            }
            return -1;
        },
        //查找方法(倒序)
        lastIndexOf: function (item, index) {
            var self = this, len = self.length, i;
            if (len == 0) return -1;

            if (index == undefined) i = len - 1;
            else {
                i = Number(index);
                i = i >= 0 ? Math.min(i, len - 1) : i + len;
            }

            for (; i >= 0; i--) {
                if (i in self && self[i] === item) return i;
            }
            return -1;
        },
        //将所有在给定过滤函数中过滤通过的数组项创建一个新数组
        filter: function (fn, bind) {
            var self = this, tmp = [];
            for (var i = 0, len = self.length; i < len; i++) {
                if (i in self) {
                    var val = self[i];
                    if (fn.call(bind, val, i, self)) tmp.push(val);
                }
            }
            return tmp;
        },
        //如果数组中的每一项都通过给定函数的测试,则返回true
        every: function (fn, bind) {
            var self = this;
            for (var i = 0, len = self.length; i < len; i++) {
                if (i in self && !fn.call(bind, self[i], i, self)) return false;
            }
            return true;
        },
        //如果数组中至少有一个项通过了给出的函数的测试,则返回true
        some: function (fn, bind) {
            var self = this;
            for (var i = 0, len = self.length; i < len; i++) {
                if (i in self && fn.call(bind, self[i], i, self)) return true;
            }
            return false;
        }
    });

    //Array原型扩展
    Array.extend({
        //数组中是否存在指定的项
        contains: function (item, index) {
            return this.indexOf(item, index) !== -1;
        },
        //获取数组项
        //若index小于0,则从右往左获取
        get: function (index) {
            if (index >= 0) return this[index];

            index += this.length;
            return index >= 0 ? this[index] : undefined;
        },
        //获取数组第一项
        first: function () {
            return this.get(0);
        },
        //获取数组最后一项
        last: function () {
            return this.get(-1);
        },
        //根据索引删除数组中的项
        del: function (index, n) {
            return this.splice(index, n || 1);
        },
        //去掉数组中的重复项 eg:[0,"0",false,null,undefined] 不支持的特殊情况:[ new String(1), new Number(1) ]
        //如果是对象数组,可以指定对象的键 eg:[{id:1},{id:2}] -> ret.unique("id")
        unique: function (prop) {
            var ret = this, tmp = [], hash = {};

            for (var i = 0, len = ret.length; i < len; i++) {
                var item = ret[i],
                    value = prop ? item[prop] : item,
                    key = typeof (value) + value;  //typeof -> toString.call,性能略有下降

                if (!hash[key]) {
                    tmp.push(item);
                    hash[key] = true;
                }
            }

            return tmp;
        },
        //去掉空的项,并返回一个新数组
        clean: function () {
            var ret = this, tmp = [];

            for (var i = 0, len = ret.length; i < len; i++) {
                if (ret[i] != undefined) tmp.push(ret[i]);
            }

            return tmp;
        },
        //根据指定的键或索引抽取数组项的值 
        //eg:[{id:1},{id:2}]    ->  ret.items("id") => [1,2]
        //eg:[[1,"a"],[2,"b"]]  ->  ret.items(1)    => ["a","b"]
        items: function (prop, skipUndefined) {
            return vals(this, prop, skipUndefined);
        },
        //将数组转换为键值对
        //value:若为空,则使用数组索引;为处理函数,需返回包含键值的数组 eg: value(item,i) => [key,value]
        toMap: function (value, ignoreCase) {
            return toMap(this, value, ignoreCase);
        },
        //将对象数组转换为键值对
        //propKey:对象中作为键的属性
        //propValue:对象中作为值的属性,若为空,则值为对象本身;若为true,则给对象添加index属性,值为对象在数组中的索引
        toObjectMap: function (propKey, propValue) {
            return toObjectMap(this, propKey, propValue);
        }
    });

    //Array静态方法扩展(已标准化,此为兼容浏览器原生方法)
    extend(Array, {
        forEach: each_array,

        isArray: isArray
    });

    //----------------------------- Date extend -----------------------------

    var DATE_REPLACEMENTS = [/y{2,4}/, /M{1,2}/, /d{1,2}/, /H{1,2}|h{1,2}/, /m{1,2}/, /s{1,2}/, /S/, /W/, /AP/],
        FIX_TIMEZONEOFFSET = new Date().getTimezoneOffset(),

        WEEKS = "日一二三四五六".split(""),
        APS = ["上午", "下午"],

        INVALID_DATE = new Date(""),

        DATE_FNS = ["getFullYear", "getMonth", "getDate", "getHours", "getMinutes", "getSeconds", "getMilliseconds", "getDay", "getHours"];

    //获取指定part形式表示的日期
    function format_date(part, t) {
        switch (part) {
            case "d": case "day": return t / 86400000;
            case "h": case "hour": return t / 3600000;
            case "m": case "minute": return t / 60000;
            case "s": case "second": return t / 1000;
        }
        return t;
    }

    //Date原型扩展
    Date.extend({
        //是否有效日期
        isValid: function () {
            return !isNaN(this.valueOf());
        },
        //格式化日期显示 eg:(new Date()).format("yyyy-MM-dd HH:mm:ss");
        format: function (format, ops) {
            ops = ops || {};

            if (!this.isValid()) return ops.invalid || "--";

            var months = ops.months,
                weeks = ops.weeks || WEEKS,
                aps = ops.aps || APS,

                len = DATE_REPLACEMENTS.length,
                i = 0;

            for (; i < len; i++) {
                var re_date = DATE_REPLACEMENTS[i], n = this[DATE_FNS[i]]();

                format = format.replace(re_date, function (match) {
                    var length = match.length;

                    //上午|下午
                    if (i == 8) return aps[n > 12 ? 1 : 0];

                    //星期
                    if (i == 7) return weeks[n];

                    //月份
                    if (i == 1) {
                        if (months) return months[n];

                        //月份索引从0开始,此处加1
                        n++;
                    }

                    //12小时制
                    if (i == 3 && match.charAt(0) == "h" && n > 12) n -= 12;

                    //匹配的长度为1时,直接转为字符串输出 H -> 9|19
                    if (length == 1) return "" + n;

                    //按照指定的长度输出字符串(从右往左截取)
                    return ("00" + n).slice(-length);
                });
            }

            return format;
        },
        //按照part(y|M|d|h|m|s|ms)添加时间间隔
        add: function (part, n) {
            var date = this;
            switch (part) {
                case "y": case "year": date.setFullYear(date.getFullYear() + n); break;
                case "M": case "month": date.setMonth(date.getMonth() + n); break;
                case "d": case "day": date.setDate(date.getDate() + n); break;
                case "h": case "hour": date.setHours(date.getHours() + n); break;
                case "m": case "minute": date.setMinutes(date.getMinutes() + n); break;
                case "s": case "second": date.setSeconds(date.getSeconds() + n); break;
                case "ms": case "millisecond": date.setMilliseconds(date.getMilliseconds() + n); break;
            }
            return date;
        },
        //返回两个指定日期之间所跨的日期或时间 part 边界的数目
        diff: function (part, date) {
            return format_date(part, this - date);
        },
        //从UTC时间转为本地时间
        fromUTC: function () {
            this.setMinutes(this.getMinutes() - FIX_TIMEZONEOFFSET);
            return this;
        },
        //转为UTC时间
        toUTC: function () {
            this.setMinutes(this.getMinutes() + FIX_TIMEZONEOFFSET);
            return this;
        },
        //返回一个日期副本,对该副本所做的修改,不会同步到原日期
        clone: function () {
            return new Date(this.getTime());
        }
    });

    //Date静态方法扩展(已标准化,此为兼容浏览器原生方法)
    extend(Date, {
        //获取当前日期和时间所代表的毫秒数
        now: function () {
            return +new Date;
        }
    });

    //Date静态方法扩展
    extend(Date, {
        //将字符串解析为Date对象
        from: function (s) {
            if (typeof s == "number") return new Date(s);
            if (typeof s == "string") {
                if (!s) return INVALID_DATE;

                //将年、月、横线(-)替换为斜线(/),将时、分替换为冒号(:),去掉日、号、秒
                //var ds = s.replace(/[-\u5e74\u6708]/g, "/").replace(/[\u65f6\u5206\u70b9]/g, ":").replace(/[T\u65e5\u53f7\u79d2]/g, ""), date = new Date(ds);
                var isUTC = s.slice(s.length - 1) == "Z",
                    ds = s.replace(/[-\u5e74\u6708]/g, "/").replace(/[\u65f6\u5206\u70b9]/g, ":").replace("T", " ").replace(/[Z\u65e5\u53f7\u79d2]/g, ""),
                    //毫秒检测
                    index = ds.lastIndexOf("."),
                    date,
                    ms;

                if (index != -1) {
                    ms = +ds.slice(index + 1, index + 4);
                    ds = ds.slice(0, index);
                }

                date = new Date(ds);

                //兼容只有年月的情况 eg:2014/11
                if (!date.isValid() && ds.indexOf("/") > 0) {
                    var ps = ds.split(' '),
                        s_date = (ps[0] + (ps[0].endsWith("/") ? "" : "/") + "1/1").split('/').slice(0, 3).join("/");

                    date = new Date(s_date + ' ' + (ps[1] || ""));
                }

                //设置毫秒
                if (ms) date.setMilliseconds(ms);

                return date.isValid() ? (isUTC ? date.fromUTC() : date) : INVALID_DATE;
            }

            return toString.call(s) == "[object Date]" ? s : INVALID_DATE;
        },

        //获取秒转化的时间部分
        parts: function (t) {
            var days = 0, hours = 0, minutes = 0;

            days = Math.floor(t / 86400);
            if (days > 0) t -= days * 86400;

            hours = Math.floor(t / 3600);
            if (hours > 0) t -= hours * 3600;

            minutes = Math.floor(t / 60);
            if (minutes > 0) t -= minutes * 60;

            //mintues: 之前拼写错误，此为兼容之前的调用
            return { days: days, hours: hours, minutes: minutes, mintues: minutes, seconds: t };
        },

        //计算时间t所代表的总数
        total: format_date
    });

    //---------------------- 事件监听器 ----------------------

    //自定义事件监听器
    //types:自定义事件列表
    //bind:事件函数绑定的上下文 eg:fn.call(bind)
    function Listener(types, bind) {
        var self = this;

        self.map = {};
        self.bind = bind;

        types.forEach(function (type) {
            self.map[type] = [];
        });
    }

    Listener.prototype = {
        constructor: Listener,

        //添加自定义事件 eg:listener.add("start",fn);
        add: function (type, fn) {
            var map = this.map;

            if (typeof type == "string") {
                if (isFunc(fn)) map[type].push(fn);
            } else if (isObject(type)) {
                Object.forEach(type, function (k, v) {
                    if (map[k] && isFunc(v)) map[k].push(v);
                });
            }

            return this;
        },
        //移除自定义事件,若fn为空,则移除该类型下的所有事件
        remove: function (type, fn) {
            if (fn != undefined) {
                var list = this.map[type], i = list.length;
                while (--i >= 0) {
                    if (list[i] == fn) list = list.splice(i, 1);
                }
            } else {
                this.map[type] = [];
            }

            return this;
        },
        //触发自定义事件 eg:listener.trigger("click",args);
        trigger: function (type, args) {
            var self = this,
                list = self.map[type],
                len = list.length,
                i = 0;

            for (; i < len; i++) {
                if (list[i].apply(self.bind, [].concat(args)) === false) break;
            }

            return self;
        }
    };

    //-------------------------- 搜索 --------------------------

    var SE = {
        //获取搜索对象
        get: function (words) {
            var pattern = words.replace(/\\(?!d|B|w|W|s|S)/g, "\\\\").replace(/\./g, "\\.").replace(/[\[\]\(\)]/g, "\\$&").replace(/\*/, ".*");

            return new RegExp(pattern, "i");
        },

        //在列表内搜索
        //props:要搜索的属性数组
        //keywords:搜索关键字
        //highlight:是否记录高亮信息
        search: function (list, props, keywords, highlight) {
            if (!list || list.length <= 0) return [];

            if (!keywords) {
                list.forEach(function (u) {
                    u.__match = undefined;
                });

                return list;
            }

            var tester = SE.get(keywords);

            var tmp = list.filter(function (data) {
                var matched = false;

                var map_match = {};

                props.forEach(function (prop) {
                    var text = data[prop];
                    if (!text || !tester.test(text)) return;

                    if (highlight) map_match[prop] = (text + "").replace(tester, '`#`{$&}`#`');

                    matched = true;
                });

                data.__match = matched && highlight ? map_match : undefined;

                return matched;
            });

            return tmp;
        },

        //读取数据,若搜索时启用了高亮,则返回高亮字符串
        read: function (data, prop) {
            var match = data.__match;
            if (match && match[prop]) {
                return match[prop].htmlEncode().replace(/`#`{(.+?)}`#`/g, function (m, m1) {
                    return '<span class="light">' + m1 + '</span>';
                });
            }

            return ((data[prop] || "") + "").htmlEncode();
        }
    };

    //---------------------- 其它 ----------------------

    //正则验证
    var RE_MAIL = /^[\w\.-]+@[\w-]+(\.[\w-]+)*\.[\w-]+$/,           //验证邮箱
        RE_PHONE = /^(1\d{10}|(\d{3,4}-?)?\d{7,8}(-\d{1,4})?)$/,    //验证电话号码(手机号码、带区号或不带区号、带分机号或不带分机号)
        RE_TEL = /^1\d{10}$/,                                       //验证手机号码
        RE_MAC = /^[a-fA-F0-9]{2}([:-][a-fA-F0-9]{2}){5}$/,         //验证MAC地址
        RE_HTTP = /^https?:\/\//i;

    //判断字符串是否符合IPv4格式
    function isIP(ip) {
        var parts = ip.split("."), length = parts.length;
        if (length != 4) return false;

        for (var i = 0; i < length; i++) {
            var part = +parts[i];
            if (!parts[i] || isNaN(part) || part < 0 || part > 255) return false;
        }

        return true;
    }

    //是否符合邮箱格式
    function isMail(str) {
        return RE_MAIL.test(str);
    }

    //是否符合电话号码格式 18688889999 | 027-88889999-3912
    function isPhone(str) {
        return RE_PHONE.test(str);
    }

    //是否符合手机号码格式 18688889999
    function isTel(str) {
        return RE_TEL.test(str);
    }

    //是否符合MAC地址格式 00:11:22:33:44:ff
    function isMAC(str) {
        return RE_MAC.test(str);
    }

    //是否http路径(以 http:// 或 https:// 开头)
    function isHttpURL(url) {
        return RE_HTTP.test(url);
    }

    //按照进制解析数字的层级 eg:时间转化 -> parseLevel(86400,[60,60,24]) => { value=1, level=3 }
    //steps:步进,可以是固定的数字(eg:1024),也可以是具有层次关系的数组(eg:[60,60,24])
    //limit:限制解析的层级,正整数,默认为100
    function parseLevel(size, steps, limit) {
        size = +size;
        steps = steps || 1024;

        var level = 0,
            isNum = typeof steps == "number",
            stepNow = 1,
            count = isUInt(limit) ? limit : (isNum ? 100 : steps.length);

        while (size >= stepNow && level < count) {
            stepNow *= (isNum ? steps : steps[level]);
            level++;
        }

        if (level && size < stepNow) {
            level--;
            stepNow /= (isNum ? steps : steps[level]);
        }

        return { value: level ? size / stepNow : size, level: level };
    }

    var UNITS_FILE_SIZE = ["B", "KB", "MB", "GB", "TB", "PB", "EB"];

    //格式化数字输出,将数字转为合适的单位输出,默认按照1024层级转为文件单位输出
    function formatSize(size, ops) {
        ops = ops === true ? { all: true } : ops || {};

        if (isNaN(size) || size == undefined || size < 0) {
            var error = ops.error || "--";

            return ops.all ? { text: error } : error;
        }

        var pl = parseLevel(size, ops.steps, ops.limit),

            value = pl.value,
            text = value.toFixed(def(ops.digit, 2));

        if (ops.trim !== false && text.lastIndexOf(".") != -1) text = text.replace(/\.?0+$/, "");

        pl.text = text + (ops.join || "") + (ops.units || UNITS_FILE_SIZE)[pl.level + (ops.start || 0)];

        return ops.all ? pl : pl.text;
    }

    //编码url参数
    var encode_url_param = encodeURIComponent;

    //解码url参数值 eg:%E6%B5%8B%E8%AF%95 => 测试
    function decode_url_param(param) {
        try {
            return decodeURIComponent(param);
        } catch (e) {
            return param;
        }
    }

    //将对象转为查询字符串
    function to_param_str(obj) {
        if (!obj) return "";
        if (typeof obj == "string") return obj;

        var tmp = [];

        Object.forEach(obj, function (k, v) {
            if (v != undefined && typeof v != "function") tmp.push(encode_url_param(k) + "=" + encode_url_param(v));
        });

        return tmp.join("&");
    }

    //连接url和查询字符串(支持传入对象)
    function join_url(url) {
        var params = [], args = arguments;
        for (var i = 1, len = args.length; i < len; i++) {
            var param = args[i];
            if (param) params.push(to_param_str(param));
        }

        var index = url.indexOf("#"), hash = "";
        if (index != -1) {
            hash = url.slice(index);
            url = url.slice(0, index);
        }

        url = url.replace(/\?&$|\?$|\&$/, '');

        var str_params = params.join("&");
        if (str_params) url += (url.contains("?") ? "&" : "?") + str_params;

        return url + hash;
    }

    //解析url参数 eg:url?id=1
    function parse_url_params(search) {
        if (!search) return {};

        var i = search.indexOf("?");
        if (i != -1) search = search.slice(i + 1);

        var j = search.indexOf("#");
        if (j != -1) search = search.slice(0, j);

        if (!search) return {};

        var list = search.split("&"), map = {};

        for (var i = 0, len = list.length; i < len; i++) {
            //跳过空字符串
            if (!list[i]) continue;

            var kv = list[i].split("="),
                key = kv[0],
                value = kv[1];

            if (key) map[decode_url_param(key)] = value ? decode_url_param(value) : "";
        }

        return map;
    }

    //编码或解码查询字符串
    function process_url_param(obj) {
        if (obj == undefined) return;

        return typeof obj == "string" ? parse_url_params(obj) : to_param_str(obj);
    }

    var DEF_LOC = GLOBAL.location || { protocol: "", hash: "", pathname: "" };

    //解析URL路径 => {href,origin,protocol,host,hostname,port,pathname,search,hash}
    function parse_url(url) {
        //return new URL(url);

        var m = url.match(/(^[^:]*:)?\/\/([^:\/]+)(:\d+)?(.*)$/),
            protocol = m[1] || DEF_LOC.protocol,
            hostname = m[2],
            port = (m[3] || "").slice(1),
            host = hostname + (port ? ":" + port : ""),

            pathname = m[4] || "",
            search = "",
            hash = "",

            i = pathname.indexOf("#");

        if (i != -1) {
            hash = pathname.slice(i);
            pathname = pathname.slice(0, i);
        }

        i = pathname.indexOf("?");
        if (i != -1) {
            search = pathname.slice(i);
            pathname = pathname.slice(0, i);
        }

        return { href: protocol + "//" + host + pathname + search + hash, origin: protocol + "//" + host, protocol: protocol, host: host, hostname: hostname, port: port, pathname: pathname || "/", search: search, hash: hash };
    }

    //解析url hash eg:#net/config!/wan  => {nav:"#net/config",param:"wan"}
    function parse_url_hash(hash) {
        if (!hash) hash = DEF_LOC.hash;
        //可能对后续处理造成影响,比如 param 中有/等转码字符
        //if(hash) hash = decode_url_param(hash);

        var nav = hash, param;

        if (hash) {
            var index = hash.indexOf("!/");
            if (index != -1) {
                nav = hash.slice(0, index);
                param = hash.slice(index + 2);
            }
        }

        return { nav: nav, param: param };
    }

    //获取页名称
    //keepQueryHash:是否保留查询字符串和Hash字符串
    function get_page_name(path, keepQueryHash) {
        var pathname = (path || DEF_LOC.pathname).replace(/\\/g, "/"),
            start = pathname.lastIndexOf("/") + 1;

        if (keepQueryHash) return pathname.slice(start);

        var end = pathname.indexOf("?", start);
        if (end == -1) end = pathname.indexOf("#", start);

        return end != -1 ? pathname.slice(start, end) : pathname.slice(start);
    }

    //---------------------- export ----------------------

    var Q = {
        version: "1.2.2",
        G: GLOBAL,

        strict: is_strict_mode,

        type: getType,

        isFunc: isFunc,
        isObject: isObject,
        isArray: Array.isArray,
        isArrayLike: isArrayLike,

        def: def,
        isNum: isNum,
        isUNum: isUNum,
        isInt: isInt,
        isUInt: isUInt,
        checkNum: checkNum,
        checkInt: checkInt,

        toUpper: toUpper,
        toLower: toLower,

        toArray: toArray,
        makeArray: makeArray,

        arr: arr,
        vals: vals,

        alias: alias,
        extend: extend,
        clone: clone,

        toMap: toMap,
        toObjectMap: toObjectMap,

        ip2int: ip2int,

        sortNumber: sortNumber,
        sortString: sortString,
        sortDate: sortDate,
        sort: sortList,

        proxy: proxy,
        fire: fire,
        delay: delay,
        async: async,
        waitFor: waitFor,

        factory: factory,

        isIP: isIP,
        isMail: isMail,
        isPhone: isPhone,
        isTel: isTel,
        isMAC: isMAC,
        isHttpURL: isHttpURL,

        parseLevel: parseLevel,
        formatSize: formatSize,

        parseUrlParams: parse_url_params,
        joinUrlParams: to_param_str,
        param: process_url_param,
        join: join_url,

        parseUrl: parse_url,
        parseHash: parse_url_hash,
        getPageName: get_page_name,

        Listener: Listener,
        SE: SE
    };

    GLOBAL.Q = Q;

    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = Q;
    }

})();

﻿/*
* Q.Queue.js 队列 for browser or Node.js
* author:devin87@qq.com
* update:2018/07/23 09:42
*/
(function (undefined) {
    "use strict";

    var delay = Q.delay,
        extend = Q.extend,
        fire = Q.fire,

        isFunc = Q.isFunc,
        isObject = Q.isObject,
        isArrayLike = Q.isArrayLike,
        isUInt = Q.isUInt,

        getType = Q.type,
        makeArray = Q.makeArray,
        factory = Q.factory,

        Listener = Q.Listener;

    var QUEUE_TASK_TIMEDOUT = -1,    //任务已超时
        QUEUE_TASK_READY = 0,        //任务已就绪，准备执行
        QUEUE_TASK_PROCESSING = 1,   //任务执行中
        QUEUE_TASK_OK = 2,           //任务已完成

        //自定义事件
        LIST_CUSTOM_EVENT = ["add", "start", "end", "stop", "complete", "limit"];

    //异步队列
    function Queue(ops) {
        ops = ops || {};

        var self = this,
            tasks = ops.tasks;

        //队列自定义事件
        self._listener = new Listener(LIST_CUSTOM_EVENT, self);

        self.count = +ops.count || 10000;               //队列长度,超过后将清理已完成的任务
        self.limitMode = ops.limitMode || 1;            //队列在超出长度后的限制模式(1:禁止添加|2:清理早期的任务)
        self.auto = ops.auto !== false;                 //是否自动开始
        self.workerThread = ops.workerThread || 1;      //工作线程
        self.timeout = ops.timeout;                     //超时时间(毫秒)

        self.id = 0;

        if (ops.rtype == "auto") self.rtype = getType(tasks);

        LIST_CUSTOM_EVENT.forEach(function (type) {
            var fn = ops[type];
            if (fn) self.on(type, fn);
        });

        if (ops.inject) self.inject = ops.inject;
        if (ops.process) self.process = ops.process;
        if (ops.processResult) self.processResult = ops.processResult;

        self.ops = ops;

        self.reset();

        self.addList(tasks);
    }

    factory(Queue).extend({
        //添加自定义事件
        on: function (type, fn) {
            this._listener.add(type, fn);
            return this;
        },
        //触发自定义事件
        trigger: function (type, args) {
            this._listener.trigger(type, args);
            return this;
        },

        //重置队列
        reset: function () {
            var self = this;

            self.tasks = [];
            self.index = 0;
            self.id = 0;

            self.workerIdle = self.workerThread;

            return self;
        },

        //添加任务
        _add: function (args, key, auto) {
            var self = this,
                tasks = self.tasks,
                count = self.count,
                is_add = true;

            var task = { id: ++self.id, args: makeArray(args), state: QUEUE_TASK_READY };

            if (key != undefined) task.key = key;

            if (tasks.length >= count) {
                if (self.index) {
                    tasks = tasks.slice(self.index);
                    self.index = 0;
                }

                if (tasks.length >= count) {
                    var is_dropped = self.limitMode == 2, dropped_tasks;

                    if (is_dropped) {
                        dropped_tasks = tasks.slice(0, tasks.length - count + 1);
                        tasks = tasks.slice(-count + 1);
                        self.index = 0;
                    } else {
                        is_add = false;
                    }

                    self.trigger("limit", is_dropped ? dropped_tasks : task);
                }

                self.tasks = tasks;
            }

            if (is_add) {
                tasks.push(task);
                self.trigger("add", task);
            }

            if (auto) self.start();

            return self;
        },

        //添加任务
        add: function () {
            return this._add(arguments, undefined, this.auto);
        },

        //批量添加任务
        addList: function (tasks) {
            var self = this;
            if (!tasks) return self;

            if (isArrayLike(tasks)) {
                Array.forEach(tasks, function (v, i) {
                    self._add(v, i, false);
                });
            } else {
                Object.forEach(tasks, function (k, v) {
                    self._add(v, k, false);
                });
            }

            if (self.auto) self.start();

            return self;
        },

        //返回队列长度,可指定任务状态
        size: function (state) {
            return state != undefined ? this.tasks.filter(function (task) { return task.state == state; }).length : this.tasks.length;
        },

        //运行队列
        _run: function () {
            var self = this;

            if (self.stopped || self.workerIdle <= 0 || self.index >= self.tasks.length) return self;

            var task = self.tasks[self.index++],
                timeout = self.timeout;

            self.workerIdle--;

            self.trigger("start", task);

            //跳过任务
            if (task.state != QUEUE_TASK_READY) return self.ok(task);

            task.state = QUEUE_TASK_PROCESSING;

            //超时检测
            if (isUInt(timeout)) task._timer = delay(self.ok, self, timeout, [task, QUEUE_TASK_TIMEDOUT]);

            //处理任务
            self.process(task, function () {
                self.ok(task, QUEUE_TASK_OK);
            });

            return self.workerIdle ? self._run() : self;
        },

        //启动队列,默认延迟10ms
        start: function () {
            var self = this;
            self.stopped = false;
            if (!self.auto) self.auto = true;

            delay(self._run, self, 10);

            return self;
        },

        //暂停队列,可以调用start方法重新启动队列
        //time:可选,暂停的毫秒数
        stop: function (time) {
            var self = this;
            self.stopped = true;

            if (isUInt(time)) delay(self.start, self, time);

            return self;
        },

        //回调函数注入(支持2级注入)
        inject: function (task, callback) {
            var self = this,
                ops = self.ops,

                injectIndex = ops.injectIndex || 0,     //执行函数中回调函数所在参数索引
                injectCallback = ops.injectCallback,    //如果该参数是一个对象,需指定参数名称,可选

                args = (task.args || []).slice(0);

            //自执行函数
            if (!ops.exec && isFunc(args[0])) injectIndex++;

            //task.args 克隆,避免对原数据的影响
            var data = args[injectIndex],
                originalCallback;

            //注入回调函数
            var inject = function (result) {
                //注入结果仅取第一个返回值,有多个结果的请使用数组或对象传递
                task.result = result;

                //执行原回调函数(如果有)
                if (isFunc(originalCallback)) originalCallback.apply(this, arguments);

                //触发任务完成回调,并执行下一个任务 
                callback();
            };

            if (injectCallback != undefined) {
                if (!data) data = {};

                //避免重复注入
                var qcallback = data.__qcallback;
                originalCallback = qcallback || data[injectCallback];
                if (!qcallback && originalCallback) data.__qcallback = originalCallback;

                data[injectCallback] = inject;
                args[injectIndex] = data;
            } else {
                originalCallback = data;

                args[injectIndex] = inject;
            }

            return args;
        },

        //处理队列任务
        process: function (task, callback) {
            var self = this,
                ops = self.ops,

                exec = ops.exec,    //执行函数
                bind = ops.bind,    //执行函数绑定的上下文,可选

                args = self.inject(task, callback),
                fn = args[0];

            if (!fn) return;

            if (fn instanceof Queue) fn.start();
            else if (exec) exec.apply(bind, args);
            else fn.apply(bind, args.slice(1));
        },

        //队列完成时,任务结果处理,用于complete事件参数
        processResult: function (tasks) {
            switch (this.rtype) {
                case "array":
                case "list":
                case "arguments":
                    return tasks.items("result");

                case "object": return tasks.toObjectMap("key", "result");
            }

            return [tasks];
        },

        //所有任务是否已完成
        isCompleted: function (tasks) {
            return (tasks || this.tasks).every(function (task) {
                return task.state == QUEUE_TASK_OK || task.state == QUEUE_TASK_TIMEDOUT;
            });
        },

        //设置任务执行状态为完成并开始新的任务
        ok: function (task, state) {
            var self = this;
            if (task.state != QUEUE_TASK_PROCESSING) return self._run();

            if (++self.workerIdle > self.workerThread) self.workerIdle = self.workerThread;

            if (task._timer) clearTimeout(task._timer);

            if (state != undefined) task.state = state;

            //触发任务完成事件
            self.trigger("end", task);

            if (self.stopped) {
                //任务已停止且完成时触发任务停止事件
                if (self.isCompleted(self.tasks.slice(0, self.index))) self.trigger("stop", self.processResult(self.tasks));
            } else {
                //当前队列任务已完成
                if (self.isCompleted()) {
                    self.trigger("complete", self.processResult(self.tasks));

                    //队列完成事件,此为提供注入接口
                    fire(self.complete, self);
                }
            }

            return self._run();
        }
    });

    //队列任务状态
    Queue.TASK = {
        TIMEDOUT: QUEUE_TASK_TIMEDOUT,
        READY: QUEUE_TASK_READY,
        PROCESSING: QUEUE_TASK_PROCESSING,
        OK: QUEUE_TASK_OK
    };

    //函数排队执行
    function series(tasks, complete, ops, workerThread) {
        if (isObject(complete)) {
            ops = complete;
            complete = undefined;
        }

        return new Queue(extend(ops || {}, {
            rtype: "auto",
            workerThread: workerThread,

            tasks: tasks,
            complete: complete
        }));
    }

    //函数并行执行
    function parallel(tasks, complete, ops) {
        return series(tasks, complete, ops, isArrayLike(tasks) ? tasks.length : Object.size(tasks));
    }

    //ajax队列
    function ajaxQueue(ops) {
        ops = ops || {};

        return new Queue(extend(ops, {
            exec: ops.ajax || Q.ajax || $.ajax,
            injectIndex: 1,
            injectCallback: "complete"
        }));
    }

    //------------------------- export -------------------------

    extend(Q, {
        Queue: Queue,

        series: series,
        parallel: parallel,

        ajaxQueue: ajaxQueue
    });

})();

﻿/*
* Q.core.js (包括 通用方法、JSON、Cookie、Storage 等) for browser
* author:devin87@qq.com  
* update:2018/01/31 10:35
*/
(function (undefined) {
    "use strict";

    var isObject = Q.isObject,
        isFunc = Q.isFunc,
        isHttpURL = Q.isHttpURL,

        getType = Q.type,

        makeArray = Q.makeArray,
        extend = Q.extend,

        fire = Q.fire,

        waitFor = Q.waitFor;

    var window = Q.G,
        document = window.document,

        html = document.documentElement,
        head = document.head || document.getElementsByTagName("head")[0],

        is_quirk_mode = document.compatMode == "BackCompat",

        body,
        root;

    //编码url参数
    var encode_url_param = encodeURIComponent;

    //解码url参数值 eg:%E6%B5%8B%E8%AF%95 => 测试
    function decode_url_param(param) {
        try {
            return decodeURIComponent(param);
        } catch (e) {
            return param;
        }
    }

    var map_loaded_resource = {},
        GUID_RESOURCE = Date.now(),

        //LOAD_READY = 0,
        LOAD_PROCESSING = 1,
        LOAD_COMPLETE = 2;

    //通过创建html标签以载入资源
    //init:初始化函数,返回html标签 eg:init(url) -> script|link
    function load_with_html(urls, callback, ops, init) {
        var list = makeArray(urls), length = list.length;
        if (length <= 0) return;

        ops = ops || {};
        if (isObject(callback)) {
            ops = callback;
            callback = ops.complete;
        }

        var create_element = ops.init || init,
            count = 0;

        var afterLoad = function (url, element) {
            if (map_loaded_resource[url] == LOAD_COMPLETE) return;
            map_loaded_resource[url] = LOAD_COMPLETE;

            if (ops.removed) head.removeChild(element);

            fire(ops.after, element, url, element);

            doComplete(url);
        };

        //所有资源加载完毕
        var doComplete = function (url) {
            if (++count >= length) fire(callback, undefined, url);
        };

        list.forEach(function (url) {
            if (ops.cache === false) url = join_url(url, "_=" + (++GUID_RESOURCE))

            //避免加载重复资源
            if (ops.once !== false && map_loaded_resource[url]) {
                //已加载过,直接返回
                if (map_loaded_resource[url] == LOAD_COMPLETE) return doComplete(url);

                //正在加载,等待加载完成
                return waitFor(function () {
                    return map_loaded_resource[url] == LOAD_COMPLETE;
                }, function () {
                    doComplete(url);
                });
            }

            var element = create_element(url);

            map_loaded_resource[url] = LOAD_PROCESSING;

            element.onreadystatechange = function () {
                if (this.readyState == "loaded" || this.readyState == "complete") afterLoad(url, this);
            };

            element.onload = function () {
                afterLoad(url, this);
            };

            fire(ops.before, element, url, element);

            head.insertBefore(element, head.lastChild);
        });

        list = null;
    }

    //加载脚本文件
    //callback:回调函数
    function loadJS(urls, callback, ops) {
        load_with_html(urls, callback, ops, function (url) {
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = url;

            return script;
        });
    }

    //加载样式文件
    //callback:回调函数
    function loadCSS(urls, callback, ops) {
        load_with_html(urls, callback, ops, function (url) {
            var link = document.createElement("link");
            link.type = "text/css";
            link.rel = "stylesheet";
            link.href = url;

            return link;
        });
    }

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
    } else if (window.webkitMediaStream || window.WebKitPoint) {
        //window.WebKitPoint        => chrome38-
        //window.webkitMediaStream  => chrome39+
        engine_name = "webkit";
    }

    engine[engine_name] = true;

    extend(Q, engine);

    engine.name = engine_name;

    //----------------------- JSON.js -----------------------

    var has = Object.prototype.hasOwnProperty,

        JSON_SPECIAL = { '\b': '\\b', '\t': '\\t', '\n': '\\n', '\f': '\\f', '\r': '\\r', '"': '\\"', '\\': '\\\\' },
        JSON_NULL = "null";

    //字符转义
    function json_replace(c) {
        //return JSON_SPECIAL[c]||'\\u' + ('0000' + c.charCodeAt(0).toString(16)).slice(-4);
        return JSON_SPECIAL[c] || c;
    }

    //json转化
    function json_encode(obj) {
        switch (getType(obj)) {
            case "string": return '"' + obj.replace(/[\x00-\x1f\\"]/g, json_replace) + '"';
            case "list":
            case "array":
                var tmp = [];
                for (var i = 0, len = obj.length; i < len; i++) {
                    if (typeof obj[i] !== "function") tmp.push(obj[i] != undefined ? json_encode(obj[i]) : JSON_NULL);
                }
                return "[" + tmp + "]";
            case "object":
            case "arguments":
                var tmp = [];
                for (var k in obj) {
                    if (has.call(obj, k) && typeof obj[k] !== "function") tmp.push("\"" + k + "\":" + json_encode(obj[k]));
                }
                return "{" + tmp.toString() + "}";
            case "boolean": return obj + "";
            case "number": return isFinite(obj) ? obj + "" : JSON_NULL;
            case "date": return isFinite(obj.valueOf()) ? "\"" + obj.toUTC().format("yyyy-MM-ddTHH:mm:ss.SZ") + "\"" : JSON_NULL;
            case "function": return;
            default: return typeof obj == "object" ? "{}" : JSON_NULL;
        }
    }

    //json解析
    //secure:是否进行安全检测
    function json_decode(text, secure) {
        //安全检测
        if (secure !== false && !/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) throw new Error("JSON SyntaxError");
        try {
            return (new Function("return " + text))();
        } catch (e) { }
    }

    if (!window.JSON) {
        window.JSON = {
            stringify: json_encode,
            parse: json_decode
        };
    }

    JSON.encode = json_encode;
    JSON.decode = json_decode;

    //------------------------------- cookie.js -------------------------------
    //解析cookie值
    function parseCookieValue(s) {
        if (s.indexOf('"') === 0) s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');

        return decode_url_param(s.replace(/\+/g, ' '));
    }

    //读取cookie值或返回整个对象
    function getCookie(key) {
        var result = key ? undefined : {},
            cookies = document.cookie ? document.cookie.split('; ') : [];

        for (var i = 0, len = cookies.length; i < len; i++) {
            var parts = cookies[i].split('='),
                name = decode_url_param(parts[0]),
                cookie = parts.slice(1).join('=');

            if (key && key === name) {
                result = parseCookieValue(cookie);
                break;
            }

            if (!key && (cookie = parseCookieValue(cookie)) !== undefined) {
                result[name] = cookie;
            }
        }

        return result;
    }

    //设置cookie
    function setCookie(key, value, ops) {
        ops = ops || {};

        var expires = ops.expires;
        if (typeof expires === "number") expires = new Date().add("d", expires);

        document.cookie = [
            encode_url_param(key), '=', encode_url_param(value),
            expires ? '; expires=' + expires.toUTCString() : '',
            ops.path ? '; path=' + ops.path : '',
            ops.domain ? '; domain=' + ops.domain : '',
            ops.secure ? '; secure' : ''
        ].join('');
    }

    //移除cookie
    function removeCookie(key) {
        if (getCookie(key) != undefined) setCookie(key, '', { expires: -1 });
    }

    //清空cookie
    function clearCookie() {
        var cookies = document.cookie ? document.cookie.split('; ') : [];
        for (var i = 0, len = cookies.length; i < len; i++) {
            var parts = cookies[i].split('='),
                key = decode_url_param(parts[0]);

            removeCookie(key);
        }
    }

    var cookie = {
        get: getCookie,
        set: setCookie,
        remove: removeCookie,

        clear: clearCookie
    };

    //------------------------------- Storage.js -------------------------------
    //type:localStorage | sessionStorage
    //useCookie:在其它特性不支持的情况下是否启用cookie模拟
    function Storage(type, useCookie) {
        var isLocal = type != "sessionStorage";

        if (!isLocal && !location.host) return;

        var STORE_NAME = type,

            storage = window[STORE_NAME],
            adapter = storage && "getItem" in storage ? "storage" : null;

        if (!adapter) {
            var userData = document.documentElement, TEST_KEY = "_Q_";

            try {
                //ie userdata
                userData.addBehavior('#default#userdata');
                //7天后过期
                if (isLocal) userData.expires = new Date().add("d", 7).toUTCString();

                STORE_NAME = location.hostname || "local";
                userData.save(STORE_NAME);

                storage = {
                    getItem: function (key) {
                        userData.load(STORE_NAME);
                        return userData.getAttribute(key);
                    },
                    setItem: function (key, value) {
                        userData.setAttribute(key, value);
                        userData.save(STORE_NAME);
                    },
                    removeItem: function (key) {
                        userData.removeAttribute(key);
                        userData.save(STORE_NAME);
                    },
                    clear: function () {
                        userData.load(STORE_NAME);

                        var now = new Date().add("d", -1);
                        userData.expires = now.toUTCString();
                        userData.save(STORE_NAME);
                    }
                };

                if (storage.getItem(TEST_KEY) === undefined) {
                    storage.setItem(TEST_KEY, 1);
                    storage.removeItem(TEST_KEY);
                }

                adapter = "userdata";
            } catch (e) { }

            //cookie 模拟
            if (!adapter && useCookie) {

                storage = {
                    getItem: getCookie,
                    //setItem: setCookie,
                    setItem: isLocal ? function (key, value) {
                        setCookie(key, value, { expires: 7 });
                    } : setCookie,
                    removeItem: removeCookie,
                    clear: clearCookie
                };

                adapter = "cookie";
            }
        }

        var support = !!adapter;

        var store = {
            //是否支持本地缓存
            support: support,

            //适配器:storage|userdata|cookie|null
            adapter: adapter,

            //获取本地缓存
            get: function (key, isJSON) {
                if (support) {
                    try {
                        var value = storage.getItem(key);
                        return isJSON ? (value ? JSON.parse(value) : null) : value;
                    } catch (e) { }
                }

                return undefined;
            },
            //设置本地缓存
            set: function (key, value) {
                if (support) {
                    try {
                        storage.setItem(key, typeof value == "string" ? value : JSON.stringify(value));
                        return true;
                    } catch (e) { }
                }

                return false;
            },
            //删除本地缓存
            remove: function (key) {
                if (support) {
                    try {
                        storage.removeItem(key);
                        return true;
                    } catch (e) { }
                }

                return false;
            },
            //清空本地缓存
            clear: function () {
                if (support) {
                    try {
                        storage.clear();
                        return true;
                    } catch (e) { }
                }

                return false;
            }
        };

        return store;
    }

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

    //---------------------- 其它 ----------------------

    //是否是输入按键
    function isInputKey(code) {
        //65-90   : A-Z
        //32      : 空格键
        //229     : 中文输入
        //48-57   : 大键盘0-9
        //96-105  : 小键盘0-9
        //106-111 : * + Enter - . / 
        if ((code >= 65 && code <= 90) || code == 32 || code == 229 || (code >= 48 && code <= 57) || (code >= 96 && code <= 111 && code != 108)) return true;

        //186-192 : ;: =+ ,< -_ .> /? `~ 
        //219-222 : [{ \| ]} '"
        if ((code >= 186 && code <= 192) || (code >= 219 && code <= 222)) return true;

        //8       : BackSpace
        //46      : Delete   
        if (code == 8 || code == 46) return true;

        return false;
    };

    //判断指定路径与当前页面是否同域(包括协议检测 eg:http与https不同域)
    function isSameHost(url) {
        if (!isHttpURL(url)) return true;

        var start = RegExp.lastMatch.length,
            end = url.indexOf("/", start),
            host = url.slice(0, end != -1 ? end : undefined);

        return host.toLowerCase() == (location.protocol + "//" + location.host).toLowerCase();
    }

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

    //---------------------- export ----------------------

    function ready(fn) {
        waitFor(function () { return Q.root; }, fn);
    }

    extend(Q, {
        html: html,
        head: head,
        quirk: is_quirk_mode,

        ready: ready,

        loadJS: loadJS,
        loadCSS: loadCSS,

        engine: engine,

        isInputKey: isInputKey,
        isSameHost: isSameHost,

        clearSelection: clearSelection,

        cookie: cookie,
        store: new Storage("localStorage", true),
        session: new Storage("sessionStorage", true),
        view: view,

        Storage: Storage
    });

    //调用涉及到 body 操作的方法时,推荐在body标签闭合之前引入 Q.core.js 库
    function init() {
        Q.body = body = document.body;
        Q.root = root = is_quirk_mode ? body : html;
    }

    //确保 document.body 已就绪
    if (document.body) init();
    else waitFor(function () { return document.body; }, init);

    //暴露接口
    window.request = Q.parseUrlParams(location.search);

})();

﻿/*
* Q.setTimer.js 计时器
* author:devin87@qq.com
* update:2017/11/22 15:14
*/
(function (undefined) {
    "use strict";

    var fire = Q.fire;

    //---------------------- 计时器 ----------------------

    //计时器
    //ops: { box:".uptime",time:1566, pad:true, step:1, sleep:1000, join:"",units:["天", "时", "分", "秒"],process:function(total, text, days, hours, mintues, seconds){} }
    function setTimer(ops) {
        var box = ops.box,
            process = ops.process,

            length = ops.pad ? 2 : 1,

            time = ops.time,
            step = ops.step || 1,
            sleep = ops.sleep || 1000,
            max = +ops.max || 0,

            str_join = ops.join || "",

            units = ops.units || ["天", "小时", "分", "秒"];

        if ((!box && !process) || time == undefined || isNaN(time)) return;

        var total = +time, timer;

        var pad = function (n, len) {
            return n > 9 || len == 1 ? n : "0" + n;
        };

        var update = function () {
            total += step;
            if (total < max) return fire(ops.over);

            if (timer) clearTimeout(timer);

            var t = Date.parts(total),
                days = t.days,
                hours = t.hours,
                mintues = t.mintues,
                seconds = t.seconds;

            var text = days + units[0] + str_join + pad(hours, length) + units[1] + str_join + pad(mintues, length) + units[2] + str_join + pad(seconds, length) + units[3],
                result = fire(process, undefined, total, text, days, hours, mintues, seconds);

            if (result !== false) {
                $(box).html(typeof result == "string" ? result : text);
                timer = setTimeout(update, sleep);
            }
        };

        update();

        var api = {
            start: update,
            stop: function () {
                if (timer) clearTimeout(timer);
            }
        };

        return api;
    }

    //------------------------- export -------------------------

    Q.setTimer = setTimer;

})();

﻿/*
* Q.UI.adapter.jquery.js
* author:devin87@qq.com  
* update:2017/12/25 13:44
*/
(function (undefined) {
    "use strict";

    var window = Q.G,

        isFunc = Q.isFunc,
        isObject = Q.isObject,
        isArrayLike = Q.isArrayLike,

        extend = Q.extend,
        makeArray = Q.makeArray,

        view = Q.view;

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

    //动态创建样式
    function createStyle(cssText) {
        var style = document.createElement("style");
        style.type = "text/css";

        style.styleSheet && (style.styleSheet.cssText = cssText) || style.appendChild(document.createTextNode(cssText));

        Q.head.appendChild(style);

        return style;
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
    //value:重置后输入框的值,默认为空字符串
    function setInputError(input, hasBorder, value) {
        if (hasBorder) input.style.borderColor = "red";
        else input.style.border = "1px solid red";

        input.value = value || "";
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

    var DEF_OFFSET = { left: 0, top: 0 };

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
        setCenter: function (el, onlyPos) {
            setCssIfNot(el, "position", "absolute");

            var size = view.getSize(),
                offset = $(el.offsetParent).offset() || DEF_OFFSET,

                left = Math.round((size.width - $(el).outerWidth()) / 2) - offset.left + view.getScrollLeft(),
                top = Math.round((size.height - $(el).outerHeight()) / 2) - offset.top + view.getScrollTop(),

                pos = { left: Math.max(left, 0), top: Math.max(top, 0) };

            return onlyPos ? pos : $(el).css(pos);
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
        createStyle: createStyle,
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

﻿/*
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

﻿/*
* Q.UI.ContextMenu.js 多级上下文菜单(右键菜单)
* https://github.com/devin87/Q.UI.js
* author:devin87@qq.com
* update:2015/11/26 17:19
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
        this.set(ops).init(data);
    }

    factory(ContextMenu).extend({
        //初始化菜单
        init: function (data) {
            var self = this;

            self.draw(data);

            if (self.autoHide !== false) {
                self._e0 = E.add(document, "click", function () {
                    self.hide();
                });
            }

            return self;
        },
        //菜单设置 {x,y,rangeX,rangeY}
        set: function (ops) {
            extend(this, ops, true);
            return this;
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

                    if (hasClass(el, "x-disabled") || (self._getSubMenu(j) && !self.isFireAll)) return false;

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
                if (m.id != undefined) map_item[m.id] = item_index;

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

                self._setPos(sub_menu, offset.left + el.offsetWidth - 2, offset.top, node);
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
            return this._setPos(this._menus[0], x, y);
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
        toggle: function (x, y) {
            return this.isHidden() ? this.show(x, y) : this.hide();
        },

        //注销菜单
        destroy: function () {
            var self = this;

            if (self._e0) self._e0.off();
            if (self._e1) self._e1.off();

            self._menus.forEach(function (menu) {
                menu.node.innerHTML = '';
                $(menu.node).remove();
            });

            Object.forEach(self, function (prop) {
                self[prop] = null;
            });

            return self;
        }
    });

    //------------------------- export -------------------------

    Q.ContextMenu = ContextMenu;

})();

﻿/*
* Q.UI.DropdownList.js 下拉列表
* https://github.com/devin87/Q.UI.js
* author:devin87@qq.com
* update:2018/11/28 19:10
*/
(function (undefined) {
    "use strict";

    var document = window.document,

        def = Q.def,
        fire = Q.fire,

        isObject = Q.isObject,

        getFirst = Q.getFirst,
        getLast = Q.getLast,

        getWidth = Q.width,
        setWidth = getWidth,

        hasClass = Q.hasClass,
        addClass = Q.addClass,
        removeClass = Q.removeClass,

        createEle = Q.createEle,
        factory = Q.factory,

        ie = Q.ie,

        E = Q.event;

    //---------------------- 下拉列表 ----------------------

    function DropdownList(ops) {
        ops = ops || {};

        var self = this;

        self.box = ops.box;
        self.items = ops.items || [];
        self.multiple = ops.multiple;
        self.canInput = ops.canInput;
        self.textProp = ops.textProp || "text";

        //默认值或索引
        self.value = ops.value;
        self.index = ops.index || 0;

        self.ops = ops;
    }

    factory(DropdownList).extend({
        init: function () {
            var self = this,

                ops = self.ops,
                box = self.box,

                isDropdownList = !self.multiple,
                canInput = self.canInput,
                placeholder = ops.placeholder;

            var html =
                (isDropdownList ?
                '<div class="x-sel-tag">' +
                    (canInput ?
                    '<input type="text" class="x-sel-text"' + (placeholder ? ' placeholder="' + placeholder + '"' : '') + ' />' :
                    '<div class="x-sel-text"></div>') +
                    '<div class="x-sel-arrow">' +
                        '<div class="arrow arrow-down"></div>' +
                    '</div>' +
                '</div>' : '') +
                '<div class="x-panel x-sel-list' + (isDropdownList ? '' : ' x-sel-multiple') + '"></div>';

            addClass(box, "x-sel");

            box.innerHTML = html;

            var elList = getLast(box),
                elTag, elText, elArrow;

            setWidth(elList, ops.width || box.offsetWidth - 2);

            if (isDropdownList) {
                elTag = getFirst(box);
                elText = getFirst(elTag);
                elArrow = getLast(elTag);

                self.elText = elText;
                self.elArrow = elArrow;
            }

            self.elList = elList;

            //------------- Event --------------

            //item 相关事件
            var listener_item;

            //下拉列表
            if (isDropdownList) {
                if (ops.autoHide !== false) {
                    E.add(document, "mousedown", function () {
                        self.hide();
                    });

                    E.add(box, "mousedown", function (e) {
                        E.stop(e, false, true);
                    });
                }

                E.add(canInput ? elArrow : elTag, "mousedown", function (e) {
                    self.toggle();

                    return false;
                });

                listener_item = {
                    //mousedown: E.stop,
                    mouseup: function (e) {
                        var index = this.x,
                            item = self.items[index];

                        fire(self.onclick, self, item, index);

                        if (item.disabled) return;

                        self.hide();
                        if (index != self.index) self.select(index);
                    },
                    mouseenter: function () {
                        var index = this.x,
                            item = self.items[index];

                        if (!item.disabled) self.active(index);
                    }
                };
            } else {
                self.selectedItems = [];
                self.seletedMap = {};

                //多选框事件
                listener_item = {
                    mousedown: function (e) {
                        var el = this;
                        if (hasClass(el, "x-disabled")) return;

                        var index = this.x,
                            //items = self.items,
                            firstItem = self.selectedItems[0],

                            shiftKey = e.shiftKey,
                            ctrlKey = e.ctrlKey;

                        if (shiftKey || !ctrlKey) self.clearSelect();

                        if (shiftKey) {
                            var start = firstItem ? firstItem.index : index,
                                end = index;

                            if (start > end) {
                                end = start;
                                start = index;
                            }
                            for (var i = start; i <= end; i++) {
                                self.active(i);
                            }
                        } else {
                            if (ctrlKey && self.seletedMap[index]) self.inactive(index);
                            else self.select(index);
                        }
                    }
                };

                if (ie < 10) listener_item.selectstart = E.stop;
            }

            E.add(elList, listener_item, ".x-item");

            self.draw();

            fire(self.oninit, self);

            return self;
        },
        //绘制下拉视图
        draw: function () {
            var self = this,
                ops = self.ops,
                items = self.items,
                elList = self.elList,
                hasTitle = ops.hasTitle,
                maxHeight = ops.maxHeight,
                map = {};

            elList.innerHTML = "";

            items.forEach(function (m, i) {
                m.index = i;
                map[m.value] = m;

                var text = m.text || '',
                    node = createEle("div", "x-item" + (m.group ? " x-sel-group" : m.disabled ? " x-disabled" : ""), text);

                if (hasTitle) node.title = m.title || text.toText();

                node.x = i;
                m.node = node;

                elList.appendChild(node);
            });

            self.map = map;

            if (maxHeight) {
                var realHeight = elList.offsetHeight;
                if (realHeight > maxHeight) elList.style.height = maxHeight + "px";
            }

            fire(self.ondraw, self);

            var value = self.value,
                index = self.index;

            if (value) {
                var item = self.find(value);
                if (item) index = item.index;
            }

            self.select(index);

            return self.multiple ? self : self.hide();
        },

        //添加下拉项,类似option
        add: function (text, value, title) {
            this.items.push(isObject(text) ? text : { text: text, value: value, title: title });
            return this;
        },
        //查找指定值的项 eg:{text,value,index}
        find: function (value) {
            return this.map[value];
        },
        //清除选中项
        clearSelect: function () {
            var self = this;

            var inactive = function (item) {
                if (item.node) removeClass(item.node, "selected");
            };

            //多选框
            if (self.multiple) {
                self.selectedItems.forEach(inactive);

                self.selectedItems = [];
                self.seletedMap = {};
            } else {
                inactive({ node: self._el });
            }

            return self;
        },
        //设置项高亮
        active: function (index) {
            var self = this,
                item = self.items[index];

            if (!item) return self;

            var node = item.node,
                flag;

            //多选框
            if (self.multiple) {
                if (!item.disabled && !self.seletedMap[index]) {
                    self.selectedItems.push(item);
                    self.seletedMap[index] = true;

                    flag = true;
                }
            } else {
                self.clearSelect();
                flag = true;

                self._el = node;
            }

            if (flag) addClass(node, "selected");

            return this;
        },
        //取消项高亮
        inactive: function (index) {
            var self = this,
                item = self.items[index];

            if (self.multiple) {
                self.selectedItems = self.selectedItems.filter(function (item) {
                    return item.index != index;
                });
                self.seletedMap[index] = undefined;
            }

            removeClass(item.node, "selected");

            return self;
        },
        //选中指定索引的项
        //isNotChange:是否不触发change事件
        select: function (index, isNotChange) {
            var self = this,
                items = self.items,
                item = items[index];

            if (!item) return self;

            self.text = def(item.text, "");
            self.value = def(item.value, "");

            if (self.elText) self.elText[self.canInput ? "value" : "innerHTML"] = self[self.textProp];

            //多选框
            self.active(index);

            if (!isNotChange && index != self.index) fire(self.onchange, self, item, index);

            self.index = index;

            return self;
        },

        //显示下拉列表
        show: function () {
            this.elList.style.display = "";
            return this.select(this.index);
        },
        //隐藏下拉列表
        hide: function () {
            this.elList.style.display = "none";
            return this;
        },
        //自动切换显示或隐藏下拉列表
        toggle: function () {
            return this.elList.style.display == "none" ? this.show() : this.hide();
        },
        //获取当前项文本,当canInput为true时可调用此方法获取输入文本
        getText: function () {
            return this.canInput ? this.elText.value : this.text;
        }
    });

    //------------------------- export -------------------------

    Q.DropdownList = DropdownList;

})();

﻿/*
* Q.UI.DataPager.js 数据分页
* https://github.com/devin87/Q.UI.js
* author:devin87@qq.com
* update:2018/12/18 10:48
*/
(function (undefined) {
    "use strict";

    var extend = Q.extend,
        factory = Q.factory;

    var LANG = {
        prevPage: "&lt;上一页",
        nextPage: "下一页&gt;",
        pageSize: "每页{0}条",
        totalCount: "共{0}条数据"
    };

    //配置语言
    function setLang(langs) {
        extend(LANG, langs, true);
    }

    //---------------------- 数据分页 ----------------------

    //生成分页页码数据 eg:create_pager_bar_data(9,28,5) => [1,0,4,5,6,7,8,0,28] 0表示省略号，其它表示页码
    //size:要显示的页码数量(包括省略号),不小于7的奇数
    //totalPage:总页数
    //page:当前页索引
    function create_pager_bar_data(size, totalPage, page) {
        var tmp = [1];

        //只有一页的情况
        if (totalPage == 1) return tmp;

        //if (size < 7) size = 7;
        //else if (size % 2 == 0) size++;

        var first = 2, last;

        //总页数小于或等于页码数量
        if (totalPage <= size) {
            last = totalPage;
        } else {
            var sideCount = (size - 5) / 2;

            //左边无省略号 eg: [1,2,3,4,5,0,20]
            if (page <= sideCount + 3) {
                last = size - 2;
            } else if (page > totalPage - sideCount - 3) {
                //右边无省略号 eg: [1,0,16,17,18,19,20]
                first = totalPage - size + 3;  //=last-(size-4)
                last = totalPage - 1;
            } else {
                //左右均有省略号 eg: [1,0,8,9,10,0,20]
                first = page - ~~sideCount;
                last = first + size - 5;
            }
        }

        if (first > 2) tmp.push(0);
        for (var i = first; i <= last; i++) tmp.push(i);

        if (totalPage > size) {
            if (last < totalPage - 1) tmp.push(0);
            tmp.push(totalPage);
        }

        return tmp;
    }

    //构造器:分页对象
    function DataPager(ops) {
        var self = this;

        self.ops = ops;
        self.size = ops.size || 9;
        self.cache = {};

        if (ops.href == undefined) {
            var boxNav = ops.boxNav;
            if (boxNav) {
                $(boxNav).on("click", "li", function () {
                    self.go($(this).attr("x"));

                    if (self.onclick) self.onclick.call(self, self.page);
                });
            }
        } else {
            ops.cache = ops.preload = false;
        }

        self.set(ops.totalCount, ops.pageSize || ops.pageCount || 10).setData(ops.data).go(ops.page);
    }

    factory(DataPager).extend({
        //设置总的数据条数和每页显示的数据条数
        set: function (totalCount, pageSize) {
            var self = this;
            if (totalCount != undefined) self.totalCount = totalCount;
            if (pageSize != undefined) self.pageSize = pageSize;

            if (self.totalCount != undefined) self.totalPage = Math.ceil(self.totalCount / self.pageSize);

            //重置页码
            //self.page = undefined;

            return self;
        },
        //设置数据列表(用于ops.load)
        //data:数据列表
        setData: function (data) {
            if (data) {
                this.data = data;
                this.set(data.length);
            }
            return this;
        },
        //加载数据
        _load: function (page, callback) {
            var self = this,
                ops = self.ops,
                onload = self.onload;

            self.page = page;

            var complete = function (list) {
                if (onload) onload.call(self, list);
                if (callback) callback.call(self, list);

                return self;
            };

            //本地数据分页
            if (!ops.load) {
                var pageSize = self.pageSize,
                    start = (page - 1) * pageSize;

                return complete(self.data.slice(start, start + pageSize));
            }

            //使用缓存
            var list = ops.cache ? self.cache[page] : undefined;
            if (list) return complete(list);

            //获取远程数据
            ops.load(page, function (data) {
                list = data.data || [];
                if (ops.cache) self.cache[page] = list;

                self.set(data.totalCount, data.pageSize || data.pageCount);

                complete(list);
            });

            return self;
        },
        //加载并渲染数据
        load: function (page) {
            return this._load(page, this.draw);
        },
        //重新载入当前数据并渲染
        reload: function (page) {
            return this.load(page || this.page);
        },
        //跳转到指定页
        //forced:是否强制跳转
        go: function (page, forced) {
            var self = this;

            if (isNaN(page)) return self;

            page = +page;
            if (self.totalPage != undefined && page > self.totalPage) page = self.totalPage;
            if (page < 1) page = 1;

            if (page == self.page && !forced) return self;

            self.load(page);
            if (self.ops.load && self.ops.preload) self._load(page + 1);

            if (self.onchange) self.onchange.call(self, page);

            return self;
        },
        //绘制导航区(分页按钮)
        drawNav: function () {
            var self = this,
                ops = self.ops,
                boxNav = ops.boxNav;

            if (!boxNav) return self;

            var totalCount = self.totalCount,
                pageSize = self.pageSize,

                totalPage = self.totalPage,
                page = self.page,

                href = ops.href,
                text = ops.text || {},

                list_bar = create_pager_bar_data(self.size, totalPage, page);

            if (href != undefined) href += href.indexOf("?") != -1 ? "&" : "?";

            var get_html_bar = function (i, title, className) {
                if (!className) className = i == page ? "on" : (i ? "" : "skip");

                return '<li' + (className ? ' class="' + className + '"' : '') + ' x="' + i + '">' + (href ? '<a' + (i ? ' href="' + href + 'page=' + i + '"' : '') + '>' + title + '</a>' : title) + '</li>';
            };

            var draw_size = ops.drawSize || function (self, html_page, html_count) {
                return html_page + '/' + html_count;
            };

            var html =
                '<div class="inline-block pager-bar' + (href ? ' pager-link' : '') + '">' +
                    '<ul>' +
                        get_html_bar(Math.max(page - 1, 1), text.prev || LANG.prevPage, "prev") +
                        list_bar.map(function (i) {
                            return get_html_bar(i, i || "…");
                        }).join('') +
                        get_html_bar(Math.min(page + 1, totalPage), text.next || LANG.nextPage, "next") +
                    '</ul>' +
                '</div>' +
                (ops.showSize !== false ?
                '<div class="inline-block pager-count">' +
                    draw_size(self, LANG.pageSize.replace("{0}", '<span class="page-size">' + pageSize + '</span>'), LANG.totalCount.replace("{0}", '<span class="total-count">' + totalCount + '</span>')) +
                '</div>' : '');

            $(boxNav).html(html);
        },
        //绘制UI
        draw: function (list) {
            this.drawNav();
            this.ops.draw.call(this, list);

            return this;
        }
    });

    //------------------------- export -------------------------

    DataPager.setLang = setLang;

    Q.DataPager = DataPager;
})();

﻿/*
* Q.UI.Tabs.js 选项卡插件
* author:devin87@qq.com  
* update:2017/04/21 21:29
*/
(function () {
    "use strict";

    var async = Q.async,

        getFirst = Q.getFirst,
        parseHash = Q.parseHash,

        $$ = $.find;

    //选项卡对象
    function Tabs(ops) {
        ops = ops || {};

        var self = this,

            context = ops.context,

            tabs = ops.tabs || $$(".tab-title li.tab,.tabTitle>li", context),
            conts = ops.conts || $$(".tab-cont>.turn-box,.tabCont>.turn-box", context);

        self.tabs = tabs;
        self.conts = conts;
        self.map_loaded = {};
        self.map_index = {};

        //扫描index和对应的hash
        tabs.forEach(function (el, i) {
            //优先显示
            if (el.getAttribute("x-def") == "1") ops.index = i;

            var link = getFirst(el);
            if (!link) return;

            var hash = link.href.split("#")[1] || "", nav = parseHash(hash).nav;
            if (nav) self.map_index[nav] = i;
        });

        //选项卡点击事件
        tabs.forEach(function (el, i) {
            if ($(el).hasClass("skip")) return;

            $(el).click(function () {
                self.showTab(i);
            });
        });

        $(conts).hide();

        //显示默认的选项卡
        setTimeout(function () {
            var hash = parseHash().nav.slice(1) || ops.hash,
                index = self.map_index[hash];

            if (index == undefined) index = ops.index || 0;

            //默认显示顺序 location hash -> html定义(x-def属性) -> ops.index -> 0
            self.showTab(index);
        }, 20);
    }

    Q.factory(Tabs).extend({
        //获取选项卡元素
        getTab: function (i) {
            return this.tabs[i];
        },
        //获取对应的视图元素
        getCont: function (i) {
            return this.conts[i];
        },
        //该视图是否已加载过
        hasLoaded: function (i) {
            return !!this.map_loaded[i];
        },
        //显示指定索引的选项卡
        showTab: function (index) {
            var self = this,
                lastIndex = self.index;

            if (index === lastIndex) return;

            if (lastIndex !== undefined) {
                var lastTab = self.getTab(lastIndex),
                    lastCont = self.getCont(lastIndex);

                $(lastTab).removeClass("on");
                $(lastCont).hide();
            }

            var tab = self.getTab(index),
                cont = self.getCont(index),
                map_loaded = self.map_loaded;

            $(tab).addClass("on");
            $(cont).show();

            self.index = index;

            //触发选项卡切换事件
            var data = { index: index, tab: tab, cont: cont, loaded: map_loaded[index] };
            async(self.onchange, 100, data);
            async(window.onTabChange, 200, data);
            if (!map_loaded[index]) map_loaded[index] = true;
        }
    });

    //设置选项卡切换
    function setTabs(ops) {
        return new Tabs(ops);
    }

    //------------------------- export -------------------------

    Q.Tabs = Tabs;
    Q.setTabs = setTabs;

})();

﻿/*
* Q.UI.RangeSlider.js 滑动条(input[type=range])
* https://github.com/devin87/Q.UI.js
* author:devin87@qq.com
* update:2017/09/27 15:46
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
            elProgress.style.width = (v * 100 / (self.max - self.min)) + '%';
            elSlider.style.left = (Math.min(elProgress.offsetWidth, totalWidth - elSlider.offsetWidth) * 100 / totalWidth) + '%';

            return self;
        }
    });

    //------------------------- export -------------------------

    Q.RangeSlider = RangeSlider;

})();