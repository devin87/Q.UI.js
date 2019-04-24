//Q.mini.js devin87@qq.com
//build:2019/04/16 10:42:55
!function(l){"use strict";var t="object"==typeof global?global:window,c=Object.prototype.toString,a=Object.prototype.hasOwnProperty,r=Array.prototype.slice,e=t==t.window;function n(t){if(t==l)return""+t;if("object"!=typeof t&&"function"!=typeof t)return typeof t;if(e){if("number"==typeof t.nodeType)return"node";if("number"==typeof t.length){if(t==t.window)return"window";if(t.item)return"list"}}return c.call(t).slice(8,-1).toLowerCase()}function h(t){return"[object Function]"===c.call(t)}function s(t){return t&&"[object Object]"===c.call(t)}function u(t){return"[object Array]"===c.call(t)}function o(t,e){return t!==l?t:e}function i(t,e,r,n){if("number"!=typeof t||isNaN(t))return!1;if(e!=l&&t<e)return!1;if(r!=l&&r<t)return!1;if(n&&n<((t+"").split(".")[1]||"").length)return!1;return!0}function f(t,e,r){return i(t,e,r)&&t===Math.floor(t)}function p(t){return f(t,1)}function d(t,e){for(var r=[],n=e||0,i=t.length;n<i;n++)r.push(t[n]);return r}var g=function(){try{return r.call(document.documentElement.childNodes),function(t,e){return r.call(t,e)}}catch(t){return d}}();function m(t,e,r){if(!t)return[];r=!1!==r;for(var n,i=t.length,o=0,a=[];o<i;o++)(n=t[o])&&n[e]!=l?a.push(n[e]):r||a.push(l);return a}function v(t,e,r){if(t&&t.prototype){var n=t.prototype;if("string"==typeof e)n[r]=n[e];else for(var i in e)a.call(e,i)&&a.call(n,i)&&(n[e[i]]=n[i]);return t}}function y(t,e,r){if(!t||!e)return t;for(var n in e)n!=l&&a.call(e,n)&&(r||t[n]===l)&&(t[n]=e[n]);return t}function b(t,e,r){if(t){for(var n={},i=h(e),o=e!==l,a=0,s=t.length;a<s;a++){var c,u=t[a];if(u!=l){if(i){var f=e.call(t,u,a);if(!f)continue;u=f[0],c=f[1]}else c=o?e:a;n[r?u.toLowerCase():u]=c}}return n}}function x(t,e,r){if(t){var n={},i=!1;!0===r&&(i=r,r=l);for(var o=0,a=t.length;o<a;o++){var s=t[o];s&&"object"==typeof s&&(i&&(s.index=o),n[s[e]]=r?s[r]:s)}return n}}function w(t){return t==l?"":t+""}function k(t,r,e){e?t.sort(function(t,e){return-w(t[r]).localeCompare(w(e[r]))}):t.sort(function(t,e){return w(t[r]).localeCompare(w(e[r]))})}function j(t,r,e){e?t.sort(function(t,e){return(+e[r]||0)-(+t[r]||0)}):t.sort(function(t,e){return(+t[r]||0)-(+e[r]||0)})}function O(t,s,c){t.sort(function(t,e){var r=t[s],n=e[s];if(r==n)return 0;var i=Date.from(r),o=Date.from(n),a=0;return i!=N&&o!=N?a=i-o:i==N&&o!=N?a=-1:i!=N&&o==N&&(a=1),c?-a:a})}function S(t){var e=t.split(".");return 256*(+e[0]||0)*256*256+256*(+e[1]||0)*256+256*(+e[2]||0)+(+e[3]||0)}function M(t,e,r,n){if(t!=l)return setTimeout(function(){t.apply(e,n||[])},o(r,20))}function I(t,e){return h(t)&&M(t,l,e,r.call(arguments,2))}function T(t){var e=+new Date,r=t.timeout,n=r&&e-t.startTime>r;if(!n&&!t.check(t))return t.count++,I(T,t.sleep,t);t.endTime=e,t.callback(t,n)}function Q(t,e,r){for(var n=0,i=t.length;n<i;n++)n in t&&e.call(r,t[n],n,t)}function E(t,e){if(e&&h(e)){var r=function(){};r.prototype=e.prototype,t.prototype=new r}var n=t;return n.constructor=E,(n.prototype.constructor=n).extend=function(t,e){y(this.prototype,t,e)},n.alias=function(t,e){v(this,t,e)},n}Q([String,Array,Number,Boolean,Function,Date,RegExp],E),y(Object,{create:function(t){var e=function(){};return e.prototype=t,new e},forEach:function(t,e,r){for(var n in t)a.call(t,n)&&e.call(r,n,t[n],t)},keys:function(t){var e=[];for(var r in t)a.call(t,r)&&e.push(r);return e},values:function(t){var e=[];for(var r in t)a.call(t,r)&&e.push(t[r]);return e},size:function(t){var e=0;for(var r in t)a.call(t,r)&&e++;return e},hasItem:function(t){for(var e in t)if(a.call(t,e))return!0;return!1}}),String.extend({trim:function(){for(var t,e=/\s/,r=(t=(t=""+this).replace(/^\s\s*/,"")).length;e.test(t.charAt(--r)););return t.slice(0,r+1)},repeat:function(t){for(var e=""+this,r="";0<t&&(t%2==1&&(r+=e),1!=t);)e+=e,t>>=1;return r},startsWith:function(t,e){return(""+this).substr(e||0,t.length)===t},endsWith:function(t,e){var r=""+this,n=e==l||e>r.length?r.length:e;return r.substr(n-t.length,t.length)===t},contains:function(t,e){return-1!=this.indexOf(t,e)}}),String.extend({drop:function(t,e){var r="string"==typeof t?new RegExp(t,e||"g"):t;return this.replace(r,"")},reverse:function(){return this.split("").reverse().join("")},htmlEncode:function(){return this.replace(/\x26/g,"&amp;").replace(/\x3c/g,"&lt;").replace(/\x3e/g,"&gt;").replace(/\r?\n|\r/g,"<br/>").replace(/\t/g,"&nbsp;&nbsp;&nbsp;&nbsp;").replace(/\s/g,"&nbsp;")},htmlDecode:function(){return this.replace(/<br[^>]*>/gi,"\n").replace(/<script[^>]*>([^~]|~)+?<\/script>/gi,"").replace(/<[^>]+>/g,"").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&nbsp;/g," ").replace(/&amp;/g,"&")}}),Number.extend({format:function(t,e){var r=this.toString(e||10),n=t-r.length;return(0<n?"0".repeat(n):"")+r}}),Array.extend({forEach:function(t,e){for(var r=0,n=this.length;r<n;r++)r in this&&t.call(e,this[r],r,this)},map:function(t,e){for(var r=[],n=0,i=this.length;n<i;n++)n in this&&r.push(t.call(e,this[n],n,this));return r},indexOf:function(t,e){var r,n=this.length;if(0==n)return-1;for(e==l?r=0:(r=Number(e))<0&&(r=Math.max(r+n,0));r<n;r++)if(r in this&&this[r]===t)return r;return-1},lastIndexOf:function(t,e){var r,n=this.length;if(0==n)return-1;for(r=e==l?n-1:0<=(r=Number(e))?Math.min(r,n-1):r+n;0<=r;r--)if(r in this&&this[r]===t)return r;return-1},filter:function(t,e){for(var r=[],n=0,i=this.length;n<i;n++)if(n in this){var o=this[n];t.call(e,o,n,this)&&r.push(o)}return r},every:function(t,e){for(var r=0,n=this.length;r<n;r++)if(r in this&&!t.call(e,this[r],r,this))return!1;return!0},some:function(t,e){for(var r=0,n=this.length;r<n;r++)if(r in this&&t.call(e,this[r],r,this))return!0;return!1}}),Array.extend({contains:function(t,e){return-1!==this.indexOf(t,e)},get:function(t){return 0<=t?this[t]:0<=(t+=this.length)?this[t]:l},first:function(){return this.get(0)},last:function(){return this.get(-1)},del:function(t,e){return this.splice(t,e||1)},unique:function(t){for(var e=[],r={},n=0,i=this.length;n<i;n++){var o=this[n],a=t?o[t]:o,s=typeof a+a;r[s]||(e.push(o),r[s]=!0)}return e},clean:function(){for(var t=[],e=0,r=this.length;e<r;e++)this[e]!=l&&t.push(this[e]);return t},items:function(t,e){return m(this,t,e)},toMap:function(t,e){return b(this,t,e)},toObjectMap:function(t,e){return x(this,t,e)}}),y(Array,{forEach:Q,isArray:u});var A=[/y{2,4}/,/M{1,2}/,/d{1,2}/,/H{1,2}|h{1,2}/,/m{1,2}/,/s{1,2}/,/S/,/W/,/AP/],D=(new Date).getTimezoneOffset(),_="日一二三四五六".split(""),C=["上午","下午"],N=new Date(""),U=["getFullYear","getMonth","getDate","getHours","getMinutes","getSeconds","getMilliseconds","getDay","getHours"];function R(t,e){switch(t){case"d":case"day":return e/864e5;case"h":case"hour":return e/36e5;case"m":case"minute":return e/6e4;case"s":case"second":return e/1e3}return e}function L(t,e){var r=this;r.map={},r.bind=e,t.forEach(function(t){r.map[t]=[]})}Date.extend({isValid:function(){return!isNaN(this.valueOf())},format:function(t,e){if(e=e||{},!this.isValid())return e.invalid||"--";for(var r=e.months,n=e.weeks||_,i=e.aps||C,o=A.length,a=0;a<o;a++){var s=A[a],c=this[U[a]]();t=t.replace(s,function(t){var e=t.length;if(8==a)return i[12<c?1:0];if(7==a)return n[c];if(1==a){if(r)return r[c];c++}return 3==a&&"h"==t.charAt(0)&&12<c&&(c-=12),1==e?""+c:("00"+c).slice(-e)})}return t},add:function(t,e){var r=this;switch(t){case"y":case"year":r.setFullYear(r.getFullYear()+e);break;case"M":case"month":r.setMonth(r.getMonth()+e);break;case"d":case"day":r.setDate(r.getDate()+e);break;case"h":case"hour":r.setHours(r.getHours()+e);break;case"m":case"minute":r.setMinutes(r.getMinutes()+e);break;case"s":case"second":r.setSeconds(r.getSeconds()+e);break;case"ms":case"millisecond":r.setMilliseconds(r.getMilliseconds()+e)}return r},diff:function(t,e){return R(t,this-e)},fromUTC:function(){return this.setMinutes(this.getMinutes()-D),this},toUTC:function(){return this.setMinutes(this.getMinutes()+D),this},clone:function(){return new Date(this.getTime())}}),y(Date,{now:function(){return+new Date}}),y(Date,{from:function(t){if("number"==typeof t)return new Date(t);if("string"!=typeof t)return"[object Date]"==c.call(t)?t:N;if(!t)return N;var e,r,n="Z"==t.slice(t.length-1),i=t.replace(/[-\u5e74\u6708]/g,"/").replace(/[\u65f6\u5206\u70b9]/g,":").replace("T"," ").replace(/[Z\u65e5\u53f7\u79d2]/g,""),o=i.lastIndexOf(".");if(-1!=o&&(r=+i.slice(o+1,o+4),i=i.slice(0,o)),!(e=new Date(i)).isValid()&&0<i.indexOf("/")){var a=i.split(" "),s=(a[0]+(a[0].endsWith("/")?"":"/")+"1/1").split("/").slice(0,3).join("/");e=new Date(s+" "+(a[1]||""))}return r&&e.setMilliseconds(r),e.isValid()?n?e.fromUTC():e:N},parts:function(t){var e,r,n;return 0<(e=Math.floor(t/86400))&&(t-=86400*e),0<(r=Math.floor(t/3600))&&(t-=3600*r),0<(n=Math.floor(t/60))&&(t-=60*n),{days:e,hours:r,minutes:n,mintues:n,seconds:t}},total:R}),L.prototype={constructor:L,add:function(t,e){var r=this.map;return"string"==typeof t?h(e)&&r[t].push(e):s(t)&&Object.forEach(t,function(t,e){r[t]&&h(e)&&r[t].push(e)}),this},remove:function(t,e){if(e!=l)for(var r=this.map[t],n=r.length;0<=--n;)r[n]==e&&(r=r.splice(n,1));else this.map[t]=[];return this},trigger:function(t,e){for(var r=this.map[t],n=r.length,i=0;i<n&&!1!==r[i].apply(this.bind,[].concat(e));i++);return this}};var F={get:function(t){var e=t.replace(/\\(?!d|B|w|W|s|S)/g,"\\\\").replace(/\./g,"\\.").replace(/[\[\]\(\)]/g,"\\$&").replace(/\*/,".*");return new RegExp(e,"i")},search:function(t,e,r,o){if(!t||t.length<=0)return[];if(!r)return t.forEach(function(t){t.__match=l}),t;var a=F.get(r);return t.filter(function(r){var n=!1,i={};return e.forEach(function(t){var e=r[t];e&&a.test(e)&&(o&&(i[t]=(e+"").replace(a,"`#`{$&}`#`")),n=!0)}),r.__match=n&&o?i:l,n})},read:function(t,e){var r=t.__match;return r&&r[e]?r[e].htmlEncode().replace(/`#`{(.+?)}`#`/g,function(t,e){return'<span class="light">'+e+"</span>"}):((t[e]||"")+"").htmlEncode()}},H=/^[\w\.-]+@[\w-]+(\.[\w-]+)*\.[\w-]+$/,B=/^(1\d{10}|(\d{3,4}-?)?\d{7,8}(-\d{1,4})?)$/,$=/^1\d{10}$/,P=/^[a-fA-F0-9]{2}([:-][a-fA-F0-9]{2}){5}$/,W=/^https?:\/\//i;function J(t,e,r){t=+t;for(var n=0,i="number"==typeof(e=e||1024),o=1,a=p(r)?r:i?100:e.length;o<=t&&n<a;)o*=i?e:e[n],n++;return n&&t<o&&(n--,o/=i?e:e[n]),{value:n?t/o:t,level:n}}var z=["B","KB","MB","GB","TB","PB","EB"];var q=encodeURIComponent;function G(e){try{return decodeURIComponent(e)}catch(t){return e}}function K(t){if(!t)return"";if("string"==typeof t)return t;var r=[];return Object.forEach(t,function(t,e){e!=l&&"function"!=typeof e&&r.push(q(t)+"="+q(e))}),r.join("&")}function V(t){if(!t)return{};-1!=(i=t.indexOf("?"))&&(t=t.slice(i+1));var e=t.indexOf("#");if(-1!=e&&(t=t.slice(0,e)),!t)return{};for(var r=t.split("&"),n={},i=0,o=r.length;i<o;i++)if(r[i]){var a=r[i].split("="),s=a[0],c=a[1];s&&(n[G(s)]=c?G(c):"")}return n}var Y=t.location||{protocol:"",hash:"",pathname:""};var X={version:"1.2.2",G:t,strict:!0,type:n,isFunc:h,isObject:s,isArray:Array.isArray,isArrayLike:function(t){var e=n(t);return"array"==e||"list"==e||"arguments"==e},def:o,isNum:i,isUNum:function(t){return"number"==typeof t&&0<t},isInt:f,isUInt:p,checkNum:function(t,e,r,n){return"number"==typeof t?i(t,e,r,n):"string"==typeof t&&(t=t.trim())&&i(+t,e,r,n)},checkInt:function(t,e,r){return"number"==typeof t?f(t,e,r):"string"==typeof t&&(t=t.trim())&&f(+t,e,r)},toUpper:function(t,e){return"string"==typeof t?t.toUpperCase():e},toLower:function(t,e){return"string"==typeof t?t.toLowerCase():e},toArray:d,makeArray:function(t,e){if(t==l)return[];switch(n(t)){case"array":return e?t.slice(e):t;case"list":return g(t,e);case"arguments":return r.call(t,e)}return[t]},arr:function(t,e,r){h(e)&&(r=e,e=0),e==l&&(e=0),r==l&&(r=1);var n=[],i=0;if(h(r))for(;i<t;)e=r(e,i,n),n.push(e),i++;else for(;i<t;)n.push(e),e+=r,i++;return n},vals:m,alias:v,extend:y,clone:function t(e){if(!e)return e;switch(typeof e){case"string":case"number":case"boolean":return e}var r;if(u(e)){r=[];for(var n=0,i=e.length;n<i;n++)r[n]=t(e[n])}else if(s(e))for(var o in r={},e)a.call(e,o)&&(r[o]=t(e[o]));return r},toMap:b,toObjectMap:x,ip2int:S,sortNumber:j,sortString:k,sortDate:O,sort:function(t,e,r,n){switch(e){case 1:j(t,r,n);break;case 2:O(t,r,n);break;case 3:o=r,a=n,t.sort(function(t,e){var r=t[o]||"",n=e[o]||"";if(r==n)return 0;var i=S(r)-S(n);return a?-i:i});break;default:k(t,r,n)}var o,a},proxy:function(t,e){if(s(t)){var r=e;t=(e=t)[r]}return function(){t.apply(e,arguments)}},fire:function(t,e){if(t!=l)return t.apply(e,r.call(arguments,2))},delay:M,async:I,waitFor:function(t,e,r,n){T({check:t,callback:e,timeout:r,sleep:n,count:0,startTime:+new Date})},throttle:function(t,e,r){var n,i,o=function(t){n=Date.now(),i&&(clearTimeout(i),i=l),e.apply(r,t)};return function(){if(!n||Date.now()-n>t)return o(arguments);i||(i=setTimeout(function(){o(arguments)},t))}},debounce:function(e,r,n){var i;return function(){i&&clearTimeout(i);var t=arguments;i=setTimeout(function(){r.apply(n,t)},e)}},factory:E,isIP:function(t){var e=t.split("."),r=e.length;if(4!=r)return!1;for(var n=0;n<r;n++){var i=+e[n];if(!e[n]||isNaN(i)||i<0||255<i)return!1}return!0},isMail:function(t){return H.test(t)},isPhone:function(t){return B.test(t)},isTel:function(t){return $.test(t)},isMAC:function(t){return P.test(t)},isHttpURL:function(t){return W.test(t)},parseLevel:J,formatSize:function(t,e){if(e=!0===e?{all:!0}:e||{},isNaN(t)||t==l||t<0){var r=e.error||"--";return e.all?{text:r}:r}var n=J(t,e.steps,e.limit),i=n.value.toFixed(o(e.digit,2));return!1!==e.trim&&-1!=i.lastIndexOf(".")&&(i=i.replace(/\.?0+$/,"")),n.text=i+(e.join||"")+(e.units||z)[n.level+(e.start||0)],e.all?n:n.text},parseUrlParams:V,joinUrlParams:K,param:function(t){if(t!=l)return"string"==typeof t?V(t):K(t)},join:function(t){for(var e=[],r=arguments,n=1,i=r.length;n<i;n++){var o=r[n];o&&e.push(K(o))}var a=t.indexOf("#"),s="";-1!=a&&(s=t.slice(a),t=t.slice(0,a)),t=t.replace(/\?&$|\?$|\&$/,"");var c=e.join("&");return c&&(t+=(t.contains("?")?"&":"?")+c),t+s},parseUrl:function(t){var e=t.match(/(^[^:]*:)?\/\/([^:\/]+)(:\d+)?(.*)$/),r=e[1]||Y.protocol,n=e[2],i=(e[3]||"").slice(1),o=n+(i?":"+i:""),a=e[4]||"",s="",c="",u=a.indexOf("#");return-1!=u&&(c=a.slice(u),a=a.slice(0,u)),-1!=(u=a.indexOf("?"))&&(s=a.slice(u),a=a.slice(0,u)),{href:r+"//"+o+a+s+c,origin:r+"//"+o,protocol:r,host:o,hostname:n,port:i,pathname:a||"/",search:s,hash:c}},parseHash:function(t){t||(t=Y.hash);var e,r=t;if(t){var n=t.indexOf("!/");-1!=n&&(r=t.slice(0,n),e=t.slice(n+2))}return{nav:r,param:e}},getPageName:function(t,e){var r=(t||Y.pathname).replace(/\\/g,"/"),n=r.lastIndexOf("/")+1;if(e)return r.slice(n);var i=r.indexOf("?",n);return-1==i&&(i=r.indexOf("#",n)),-1!=i?r.slice(n,i):r.slice(n)},Listener:L,SE:F};t.Q=X,"object"==typeof module&&"object"==typeof module.exports&&(module.exports=X)}(),function(f){"use strict";var n=Q.delay,i=Q.extend,o=Q.fire,l=Q.isFunc,a=Q.isObject,s=Q.isArrayLike,c=Q.isUInt,e=Q.type,h=Q.makeArray,t=Q.factory,u=Q.Listener,p=["add","start","end","stop","complete","limit"];function d(r){var n=this,t=(r=r||{}).tasks;n._listener=new u(p,n),n.count=+r.count||1e4,n.limitMode=r.limitMode||1,n.auto=!1!==r.auto,n.workerThread=r.workerThread||1,n.timeout=r.timeout,n.id=0,"auto"==r.rtype&&(n.rtype=e(t)),p.forEach(function(t){var e=r[t];e&&n.on(t,e)}),r.inject&&(n.inject=r.inject),r.process&&(n.process=r.process),r.processResult&&(n.processResult=r.processResult),n.ops=r,n.reset(),n.addList(t)}function g(t,e,r,n){return a(e)&&(r=e,e=f),new d(i(r||{},{rtype:"auto",workerThread:n,tasks:t,complete:e}))}t(d).extend({on:function(t,e){return this._listener.add(t,e),this},trigger:function(t,e){return this._listener.trigger(t,e),this},reset:function(){var t=this;return t.tasks=[],t.index=0,t.id=0,t.workerIdle=t.workerThread,t},_add:function(t,e,r){var n=this,i=n.tasks,o=n.count,a=!0,s={id:++n.id,args:h(t),state:0};if(e!=f&&(s.key=e),i.length>=o){if(n.index&&(i=i.slice(n.index),n.index=0),i.length>=o){var c,u=2==n.limitMode;u?(c=i.slice(0,i.length-o+1),i=i.slice(1-o),n.index=0):a=!1,n.trigger("limit",u?c:s)}n.tasks=i}return a&&(i.push(s),n.trigger("add",s)),r&&n.start(),n},add:function(){return this._add(arguments,f,this.auto)},addList:function(t){var r=this;return t&&(s(t)?Array.forEach(t,function(t,e){r._add(t,e,!1)}):Object.forEach(t,function(t,e){r._add(e,t,!1)}),r.auto&&r.start()),r},size:function(e){return e!=f?this.tasks.filter(function(t){return t.state==e}).length:this.tasks.length},_run:function(){var t=this;if(t.stopped||t.workerIdle<=0||t.index>=t.tasks.length)return t;var e=t.tasks[t.index++],r=t.timeout;return t.workerIdle--,t.trigger("start",e),0!=e.state?t.ok(e):(e.state=1,c(r)&&(e._timer=n(t.ok,t,r,[e,-1])),t.process(e,function(){t.ok(e,2)}),t.workerIdle?t._run():t)},start:function(){var t=this;return t.stopped=!1,t.auto||(t.auto=!0),n(t._run,t,10),t},stop:function(t){return this.stopped=!0,c(t)&&n(this.start,this,t),this},inject:function(e,r){var t=this.ops,n=t.injectIndex||0,i=t.injectCallback,o=(e.args||[]).slice(0);!t.exec&&l(o[0])&&n++;var a,s=o[n],c=function(t){e.result=t,l(a)&&a.apply(this,arguments),r()};if(i!=f){s||(s={});var u=s.__qcallback;a=u||s[i],!u&&a&&(s.__qcallback=a),s[i]=c,o[n]=s}else a=s,o[n]=c;return o},process:function(t,e){var r=this.ops,n=r.exec,i=r.bind,o=this.inject(t,e),a=o[0];a&&(a instanceof d?a.start():n?n.apply(i,o):a.apply(i,o.slice(1)))},processResult:function(t){switch(this.rtype){case"array":case"list":case"arguments":return t.items("result");case"object":return t.toObjectMap("key","result")}return[t]},isCompleted:function(t){return(t||this.tasks).every(function(t){return 2==t.state||-1==t.state})},ok:function(t,e){var r=this;return 1!=t.state||(++r.workerIdle>r.workerThread&&(r.workerIdle=r.workerThread),t._timer&&clearTimeout(t._timer),e!=f&&(t.state=e),r.trigger("end",t),r.stopped?r.isCompleted(r.tasks.slice(0,r.index))&&r.trigger("stop",r.processResult(r.tasks)):r.isCompleted()&&(r.trigger("complete",r.processResult(r.tasks)),o(r.complete,r))),r._run()}}),d.TASK={TIMEDOUT:-1,READY:0,PROCESSING:1,OK:2};var r=(Q.G||{}).$||{};i(Q,{Queue:d,series:g,parallel:function(t,e,r){return g(t,e,r,s(t)?t.length:Object.size(t))},ajaxQueue:function(t){return new d(i(t=t||{},{exec:t.ajax||Q.ajax||Q.http||r.ajax,injectIndex:1,injectCallback:"complete"}))}})}(),function(f){"use strict";var t,e,l=Q.isObject,r=Q.isFunc,n=Q.isHttpURL,o=Q.type,h=Q.makeArray,i=Q.extend,p=Q.fire,d=Q.waitFor,c=Q.G,u=c.document,a=u.documentElement,g=u.head||u.getElementsByTagName("head")[0],s="BackCompat"==u.compatMode,m=encodeURIComponent;function v(e){try{return decodeURIComponent(e)}catch(t){return e}}var y={},b=Date.now(),x=1,w=2;function k(t,e,r,n){var i=h(t),o=i.length;if(!(o<=0)){r=r||{},l(e)&&(e=(r=e).complete);var a=r.init||n,s=0,c=function(t,e){y[t]!=w&&(y[t]=w,r.removed&&g.removeChild(e),p(r.after,e,t,e),u(t))},u=function(t){++s>=o&&p(e,f,t)};i.forEach(function(t){if(!1===r.cache&&(t=join_url(t,"_="+ ++b)),!1!==r.once&&y[t])return y[t]==w?u(t):d(function(){return y[t]==w},function(){u(t)});var e=a(t);y[t]=x,e.onreadystatechange=function(){"loaded"!=this.readyState&&"complete"!=this.readyState||c(t,this)},e.onload=function(){c(t,this)},p(r.before,e,t,e),g.insertBefore(e,g.lastChild)}),i=null}}var j,O="unknown",S={};c.ActiveXObject||c.msIndexedDB?(S.ie=j=u.documentMode||(c.XMLHttpRequest?7:6),S["ie"+(j<6?6:j)]=!0,O="trident"):c.opera?O="opera":c.mozInnerScreenX!=f||r(u.getBoxObjectFor)?O="gecko":(c.webkitMediaStream||c.WebKitPoint)&&(O="webkit"),S[O]=!0,i(Q,S),S.name=O;var M=Object.prototype.hasOwnProperty,I={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},T="null";function E(t){return I[t]||t}function A(t){switch(o(t)){case"string":return'"'+t.replace(/[\x00-\x1f\\"]/g,E)+'"';case"list":case"array":for(var e=[],r=0,n=t.length;r<n;r++)"function"!=typeof t[r]&&e.push(t[r]!=f?A(t[r]):T);return"["+e+"]";case"object":case"arguments":e=[];for(var i in t)M.call(t,i)&&"function"!=typeof t[i]&&e.push('"'+i+'":'+A(t[i]));return"{"+e.toString()+"}";case"boolean":return t+"";case"number":return isFinite(t)?t+"":T;case"date":return isFinite(t.valueOf())?'"'+t.toUTC().format("yyyy-MM-ddTHH:mm:ss.SZ")+'"':T;case"function":return;default:return"object"==typeof t?"{}":T}}function D(t,e){if(!1!==e&&!/^[\],:{}\s]*$/.test(t.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))throw new Error("JSON SyntaxError");try{return new Function("return "+t)()}catch(t){}}function _(t){return 0===t.indexOf('"')&&(t=t.slice(1,-1).replace(/\\"/g,'"').replace(/\\\\/g,"\\")),v(t.replace(/\+/g," "))}function C(t){for(var e=t?f:{},r=u.cookie?u.cookie.split("; "):[],n=0,i=r.length;n<i;n++){var o=r[n].split("="),a=v(o[0]),s=o.slice(1).join("=");if(t&&t===a){e=_(s);break}t||(s=_(s))===f||(e[a]=s)}return e}function N(t,e,r){var n=(r=r||{}).expires;"number"==typeof n&&(n=(new Date).add("d",n)),u.cookie=[m(t),"=",m(e),n?"; expires="+n.toUTCString():"",r.path?"; path="+r.path:"",r.domain?"; domain="+r.domain:"",r.secure?"; secure":""].join("")}function U(t){C(t)!=f&&N(t,"",{expires:-1})}function R(){for(var t=u.cookie?u.cookie.split("; "):[],e=0,r=t.length;e<r;e++){U(v(t[e].split("=")[0]))}}function L(t,e){var r="sessionStorage"!=t;if(r||location.host){var n=t,i=c[n],o=i&&"getItem"in i?"storage":null;if(!o){var a=u.documentElement;try{a.addBehavior("#default#userdata"),r&&(a.expires=(new Date).add("d",7).toUTCString()),n=location.hostname||"local",a.save(n),(i={getItem:function(t){return a.load(n),a.getAttribute(t)},setItem:function(t,e){a.setAttribute(t,e),a.save(n)},removeItem:function(t){a.removeAttribute(t),a.save(n)},clear:function(){a.load(n);var t=(new Date).add("d",-1);a.expires=t.toUTCString(),a.save(n)}}).getItem("_Q_")===f&&(i.setItem("_Q_",1),i.removeItem("_Q_")),o="userdata"}catch(t){}!o&&e&&(i={getItem:C,setItem:r?function(t,e){N(t,e,{expires:7})}:N,removeItem:U,clear:R},o="cookie")}var s=!!o;return{support:s,adapter:o,get:function(t,e){if(s)try{var r=i.getItem(t);return e?r?JSON.parse(r):null:r}catch(t){}return f},set:function(t,e){if(s)try{return i.setItem(t,"string"==typeof e?e:JSON.stringify(e)),!0}catch(t){}return!1},remove:function(t){if(s)try{return i.removeItem(t),!0}catch(t){}return!1},clear:function(){if(s)try{return i.clear(),!0}catch(t){}return!1}}}}c.JSON||(c.JSON={stringify:A,parse:D}),JSON.encode=A,JSON.decode=D;var F={getSize:function(){return{width:e.clientWidth,height:e.clientHeight}},getWidth:function(){return e.clientWidth},getHeight:function(){return e.clientHeight},getScrollWidth:function(){return Math.max(a.scrollWidth,t.scrollWidth)},getScrollHeight:function(){return Math.max(a.scrollHeight,t.scrollHeight)},getScrollLeft:function(){return a.scrollLeft||t.scrollLeft},getScrollTop:function(){return a.scrollTop||t.scrollTop}};function H(){Q.body=t=u.body,Q.root=e=s?t:a}i(Q,{html:a,head:g,quirk:s,ready:function(t){d(function(){return Q.root},t)},loadJS:function(t,e,r){k(t,e,r,function(t){var e=u.createElement("script");return e.type="text/javascript",e.src=t,e})},loadCSS:function(t,e,r){k(t,e,r,function(t){var e=u.createElement("link");return e.type="text/css",e.rel="stylesheet",e.href=t,e})},engine:S,isInputKey:function(t){return 65<=t&&t<=90||32==t||229==t||48<=t&&t<=57||96<=t&&t<=111&&108!=t||186<=t&&t<=192||219<=t&&t<=222||8==t||46==t},isSameHost:function(t){if(!n(t))return!0;var e=RegExp.lastMatch.length,r=t.indexOf("/",e);return t.slice(0,-1!=r?r:f).toLowerCase()==(location.protocol+"//"+location.host).toLowerCase()},clearSelection:function(){if(c.getSelection){var t=getSelection();t.removeAllRanges?t.removeAllRanges():t.empty&&t.empty()}else u.selection&&u.selection.empty()},cookie:{get:C,set:N,remove:U,clear:R},store:new L("localStorage",!0),session:new L("sessionStorage",!0),view:F,Storage:L}),u.body?H():d(function(){return u.body},H),c.request=Q.parseUrlParams(location.search)}(),function(t){"use strict";var x=Q.fire;Q.setTimer=function(s){var c=s.box,u=s.process,f=s.pad?2:1,t=s.time,l=s.step||1,h=s.sleep||1e3,p=+s.max||0,d=s.join||"",g=s.units||["天","小时","分","秒"];if((c||u)&&null!=t&&!isNaN(t)){var m,v=+t,y=function(t,e){return 9<t||1==e?t:"0"+t},b=function(){if((v+=l)<p)return x(s.over);m&&clearTimeout(m);var t=Date.parts(v),e=t.days,r=t.hours,n=t.mintues,i=t.seconds,o=e+g[0]+d+y(r,f)+g[1]+d+y(n,f)+g[2]+d+y(i,f)+g[3],a=x(u,void 0,v,o,e,r,n,i);!1!==a&&($(c).html("string"==typeof a?a:o),m=setTimeout(b,h))};return b(),{start:b,stop:function(){m&&clearTimeout(m)}}}}}();