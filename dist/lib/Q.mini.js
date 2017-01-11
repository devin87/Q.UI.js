//Q.mini.js devin87@qq.com
//build:2017/01/11 16:44:26
!function(t){"use strict";function e(){var t=function(t){return arguments[0]=1,t!=arguments[0]};return t(0)}function r(e){if(e==t)return""+e;if("object"!=typeof e&&"function"!=typeof e)return typeof e;if(Y){if("number"==typeof e.nodeType)return"node";if("number"==typeof e.length){if(!V&&e.callee)return"arguments";if(e==e.window)return"window";if(e.item)return"list"}}return q.call(e).slice(8,-1).toLowerCase()}function n(t){return"[object Function]"===q.call(t)}function i(t){return t&&"[object Object]"===q.call(t)}function o(t){return"[object Array]"===q.call(t)}function a(t){var e=r(t);return"array"==e||"list"==e||"arguments"==e}function s(e,r){return e!==t?e:r}function c(e,r,n){return"number"!=typeof e?!1:r!=t&&r>e?!1:!(n!=t&&e>n)}function u(t){return"number"==typeof t&&t>0}function f(t,e,r){return c(t,e,r)&&t===Math.floor(t)}function l(t){return f(t,1)}function p(t,e,r){return!isNaN(t)&&c(+t,e,r)}function h(t,e,r){return!isNaN(t)&&f(+t,e,r)}function d(t,e){return"string"==typeof t?t.toUpperCase():e}function g(t,e){return"string"==typeof t?t.toLowerCase():e}function m(t,e){for(var r=[],n=e||0,i=t.length;i>n;n++)r.push(t[n]);return r}function v(e,n){if(e==t)return[];switch(r(e)){case"array":return n?e.slice(n):e;case"list":return X(e,n);case"arguments":return G.call(e,n)}return[e]}function y(e,r,i){n(r)&&(i=r,r=0),r==t&&(r=0),i==t&&(i=1);var o=[],a=0;if(n(i))for(;e>a;)r=i(r,a,o),o.push(r),a++;else for(;e>a;)o.push(r),r+=i,a++;return o}function b(e,r,n){if(!e)return[];n=n!==!1;for(var i,o=e.length,a=0,s=[];o>a;a++)i=e[a],(i&&i[r]!=t||!n)&&s.push(i[r]);return s}function w(t,e,r){if(t&&t.prototype){var n=t.prototype;if("string"==typeof e)n[r]=n[e];else for(var i in e)K.call(e,i)&&K.call(n,i)&&(n[e[i]]=n[i]);return t}}function k(e,r,n){if(!e||!r)return e;for(var i in r)i!=t&&K.call(r,i)&&(n||e[i]===t)&&(e[i]=r[i]);return e}function x(t){if(!t)return t;switch(typeof t){case"string":case"number":case"boolean":return t}var e;if(o(t)){e=[];for(var r=0,n=t.length;n>r;r++)e[r]=x(t[r])}else if(i(t)){e={};for(var a in t)K.call(t,a)&&(e[a]=x(t[a]))}return e}function j(e,r,i){if(e){for(var o={},a=n(r),s=r!==t,c=0,u=e.length;u>c;c++){var f,l=e[c];if(l!=t){if(a){var p=r.call(e,l,c);if(!p)continue;l=p[0],f=p[1]}else f=s?r:c;o[i?l.toLowerCase():l]=f}}return o}}function S(e,r,n){if(e){var i={},o=!1;n===!0&&(o=n,n=t);for(var a=0,s=e.length;s>a;a++){var c=e[a];c&&"object"==typeof c&&(o&&(c.index=a),i[c[r]]=n?c[n]:c)}return i}}function O(t,e,r){r?t.sort(function(t,r){return-(t[e]||"").localeCompare(r[e]||"")}):t.sort(function(t,r){return(t[e]||"").localeCompare(r[e]||"")})}function M(t,e,r){r?t.sort(function(t,r){return r[e]-t[e]}):t.sort(function(t,r){return t[e]-r[e]})}function I(t,e,r){t.sort(function(t,n){var i=t[e],o=n[e];if(i==o)return 0;var a=Date.from(i),s=Date.from(o),c=0;return a!=nt&&s!=nt?c=a-s:a==nt&&s!=nt?c=-1:a!=nt&&s==nt&&(c=1),r?-c:c})}function T(t,e,r,n){switch(e){case 1:M(t,r,n);break;case 2:I(t,r,n);break;default:O(t,r,n)}}function Q(t,e){if(i(t)){var r=e;e=t,t=e[r]}return function(){t.apply(e,arguments)}}function N(e,r){return e!=t?e.apply(r,G.call(arguments,2)):void 0}function A(e,r,n,i){return e!=t?setTimeout(function(){e.apply(r,i||[])},s(n,20)):void 0}function D(e,r){return n(e)&&A(e,t,r,G.call(arguments,2))}function C(t){var e=+new Date,r=t.timeout,n=r&&e-t.startTime>r;return n||t.check(t)?(t.endTime=e,void t.callback(t,n)):(t.count++,D(C,t.sleep,t))}function E(t,e,r,n){C({check:t,callback:e,timeout:r,sleep:n,count:0,startTime:+new Date})}function _(t,e,r){for(var n=0,i=t.length;i>n;n++)n in t&&e.call(r,t[n],n,t)}function L(t){var e=t;return e.constructor=L,e.prototype.constructor=e,e.extend=function(t,e){k(this.prototype,t,e)},e.alias=function(t,e){w(this,t,e)},e}function R(t,e){switch(t){case"d":case"day":return e/864e5;case"h":case"hour":return e/36e5;case"m":case"minute":return e/6e4;case"s":case"second":return e/1e3}return e}function U(t,e){var r=this;r.map={},r.bind=e,t.forEach(function(t){r.map[t]=[]})}function F(t){var e=t.split("."),r=e.length;if(4!=r)return!1;for(var n=0;r>n;n++){var i=+e[n];if(!e[n]||isNaN(i)||0>i||i>255)return!1}return!0}function H(t){return ot.test(t)}function B(t){return at.test(t)}function W(t){return st.test(t)}function P(t){return ct.test(t)}function J(t,e,r){t=+t,e=e||1024;for(var n=0,i="number"==typeof e,o=1,a=l(r)?r:i?100:e.length;t>=o&&a>n;)o*=i?e:e[n],n++;return n&&o>t&&(n--,o/=i?e:e[n]),{value:n?t/o:t,level:n}}function z(e,r){if(r=r===!0?{all:!0}:r||{},isNaN(e)||e==t||0>e){var n=r.error||"--";return r.all?{text:n}:n}var i=J(e,r.steps,r.limit),o=i.value,a=o.toFixed(s(r.digit,2));return r.trim!==!1&&-1!=a.lastIndexOf(".")&&(a=a.replace(/\.?0+$/,"")),i.text=a+(r.join||"")+(r.units||ut)[i.level+(r.start||0)],r.all?i:i.text}var $="object"==typeof global?global:window,q=Object.prototype.toString,K=Object.prototype.hasOwnProperty,G=Array.prototype.slice,V=e(),Y=$==$.window,X=function(){try{return G.call(document.documentElement.childNodes),function(t,e){return G.call(t,e)}}catch(t){return m}}();_([String,Array,Number,Boolean,Function,Date,RegExp],L),k(Object,{create:function(t){var e=function(){};return e.prototype=t,new e},forEach:function(t,e,r){for(var n in t)K.call(t,n)&&e.call(r,n,t[n],t)},keys:function(t){var e=[];for(var r in t)K.call(t,r)&&e.push(r);return e},values:function(t){var e=[];for(var r in t)K.call(t,r)&&e.push(t[r]);return e},size:function(t){var e=0;for(var r in t)K.call(t,r)&&e++;return e},hasItem:function(t){for(var e in t)if(K.call(t,e))return!0;return!1}}),String.extend({trim:function(){for(var t=""+this,t=t.replace(/^\s\s*/,""),e=/\s/,r=t.length;e.test(t.charAt(--r)););return t.slice(0,r+1)},repeat:function(t){for(var e=""+this,r="";t>0&&(t%2==1&&(r+=e),1!=t);)e+=e,t>>=1;return r},startsWith:function(t,e){var r=""+this;return r.substr(e||0,t.length)===t},endsWith:function(e,r){var n=""+this,i=r==t||r>n.length?n.length:r;return n.substr(i-e.length,e.length)===e},contains:function(t,e){return-1!=this.indexOf(t,e)}}),String.extend({drop:function(t,e){var r="string"==typeof t?new RegExp(t,e||"g"):t;return this.replace(r,"")},reverse:function(){return this.split("").reverse().join("")},htmlEncode:function(){return this.replace(/\x26/g,"&amp;").replace(/\x3c/g,"&lt;").replace(/\x3e/g,"&gt;").replace(/\r?\n|\r/g,"<br/>").replace(/\t/g,"&nbsp;&nbsp;&nbsp;&nbsp;").replace(/\s/g,"&nbsp;")},htmlDecode:function(){return this.replace(/<br[^>]*>/gi,"\n").replace(/<script[^>]*>([^~]|~)+?<\/script>/gi,"").replace(/<[^>]+>/g,"").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&nbsp;/g," ").replace(/&amp;/g,"&")}}),Number.extend({format:function(t,e){var r=this.toString(e||10),n=t-r.length;return(n>0?"0".repeat(n):"")+r}}),Array.extend({forEach:function(t,e){for(var r=this,n=0,i=r.length;i>n;n++)n in r&&t.call(e,r[n],n,r)},map:function(t,e){for(var r=this,n=[],i=0,o=r.length;o>i;i++)i in r&&n.push(t.call(e,r[i],i,r));return n},indexOf:function(e,r){var n,i=this,o=i.length;if(0==o)return-1;for(r==t?n=0:(n=Number(r),0>n&&(n=Math.max(n+o,0)));o>n;n++)if(n in i&&i[n]===e)return n;return-1},lastIndexOf:function(e,r){var n,i=this,o=i.length;if(0==o)return-1;for(r==t?n=o-1:(n=Number(r),n=n>=0?Math.min(n,o-1):n+o);n>=0;n--)if(n in i&&i[n]===e)return n;return-1},filter:function(t,e){for(var r=this,n=[],i=0,o=r.length;o>i;i++)if(i in r){var a=r[i];t.call(e,a,i,r)&&n.push(a)}return n},every:function(t,e){for(var r=this,n=0,i=r.length;i>n;n++)if(n in r&&!t.call(e,r[n],n,r))return!1;return!0},some:function(t,e){for(var r=this,n=0,i=r.length;i>n;n++)if(n in r&&t.call(e,r[n],n,r))return!0;return!1}}),Array.extend({contains:function(t,e){return-1!==this.indexOf(t,e)},get:function(e){return e>=0?this[e]:(e+=this.length,e>=0?this[e]:t)},first:function(){return this.get(0)},last:function(){return this.get(-1)},del:function(t,e){return this.splice(t,e||1)},unique:function(t){for(var e=this,r=[],n={},i=0,o=e.length;o>i;i++){var a=e[i],s=t?a[t]:a,c=typeof s+s;n[c]||(r.push(a),n[c]=!0)}return r},clean:function(){for(var e=this,r=[],n=0,i=e.length;i>n;n++)e[n]!=t&&r.push(e[n]);return r},items:function(t,e){return b(this,t,e)},toMap:function(t,e){return j(this,t,e)},toObjectMap:function(t,e){return S(this,t,e)}}),k(Array,{forEach:_,isArray:o});var Z=[/y{2,4}/,/M{1,2}/,/d{1,2}/,/H{1,2}|h{1,2}/,/m{1,2}/,/s{1,2}/,/S/,/W/,/AP/],tt=(new Date).getTimezoneOffset(),et="日一二三四五六".split(""),rt=["上午","下午"],nt=new Date(""),it=["getFullYear","getMonth","getDate","getHours","getMinutes","getSeconds","getMilliseconds","getDay","getHours"];Date.extend({isValid:function(){return!isNaN(this.valueOf())},format:function(t,e){if(e=e||{},!this.isValid())return e.invalid||"--";for(var r=e.months,n=e.weeks||et,i=e.aps||rt,o=Z.length,a=0;o>a;a++){var s=Z[a],c=this[it[a]]();t=t.replace(s,function(t){var e=t.length;if(8==a)return i[c>12?1:0];if(7==a)return n[c];if(1==a){if(r)return r[c];c++}return 3==a&&"h"==t.charAt(0)&&c>12&&(c-=12),1==e?""+c:("00"+c).slice(-e)})}return t},add:function(t,e){var r=this;switch(t){case"y":case"year":r.setFullYear(r.getFullYear()+e);break;case"M":case"month":r.setMonth(r.getMonth()+e);break;case"d":case"day":r.setDate(r.getDate()+e);break;case"h":case"hour":r.setHours(r.getHours()+e);break;case"m":case"minute":r.setMinutes(r.getMinutes()+e);break;case"s":case"second":r.setSeconds(r.getSeconds()+e);break;case"ms":case"millisecond":r.setMilliseconds(r.getMilliseconds()+e)}return r},diff:function(t,e){return R(t,this-e)},fromUTC:function(){return this.setMinutes(this.getMinutes()-tt),this},toUTC:function(){return this.setMinutes(this.getMinutes()+tt),this},clone:function(){return new Date(this.getTime())}}),k(Date,{now:function(){return+new Date}}),k(Date,{from:function(t){if("number"==typeof t)return new Date(t);if("string"==typeof t){if(!t)return nt;var e,r,n="Z"==t.slice(t.length-1),i=t.replace(/[-\u5e74\u6708]/g,"/").replace(/[\u65f6\u5206\u70b9]/g,":").replace("T"," ").replace(/[Z\u65e5\u53f7\u79d2]/g,""),o=i.lastIndexOf(".");if(-1!=o&&(r=+i.slice(o+1),i=i.slice(0,o)),e=new Date(i),!e.isValid()&&i.indexOf("/")>0){var a=i.split(" "),s=(a[0]+(a[0].endsWith("/")?"":"/")+"1/1").split("/").slice(0,3).join("/");e=new Date(s+" "+(a[1]||""))}return r&&e.setMilliseconds(r),e.isValid()?n?e.fromUTC():e:t}return"[object Date]"==q.call(t)?t:nt},parts:function(t){var e=0,r=0,n=0;return e=Math.floor(t/86400),e>0&&(t-=86400*e),r=Math.floor(t/3600),r>0&&(t-=3600*r),n=Math.floor(t/60),n>0&&(t-=60*n),{days:e,hours:r,mintues:n,seconds:t}},total:R}),U.prototype={constructor:U,add:function(t,e){var r=this.map;return"string"==typeof t?n(e)&&r[t].push(e):i(t)&&Object.forEach(t,function(t,e){r[t]&&n(e)&&r[t].push(e)}),this},remove:function(e,r){if(r!=t)for(var n=this.map[e],i=n.length;--i>=0;)n[i]==r&&(n=n.splice(i,1));else this.map[e]=[];return this},trigger:function(t,e){for(var r=this,n=r.map[t],i=n.length,o=0;i>o&&n[o].apply(r.bind,[].concat(e))!==!1;o++);return r}};var ot=/^[\w\.-]+@[\w-]+(\.[\w-]+)*\.[\w-]+$/,at=/^(1\d{10}|(\d{3,4}-?)?\d{7,8}(-\d{1,4})?)$/,st=/^1\d{10}$/,ct=/^https?:\/\//i,ut=["B","KB","MB","GB","TB","PB","EB"],ft={version:"1.2.2",G:$,strict:V,type:r,isFunc:n,isObject:i,isArray:Array.isArray,isArrayLike:a,def:s,isNum:c,isUNum:u,isInt:f,isUInt:l,checkNum:p,checkInt:h,toUpper:d,toLower:g,toArray:m,makeArray:v,arr:y,vals:b,alias:w,extend:k,clone:x,toMap:j,toObjectMap:S,sortNumber:M,sortString:O,sortDate:I,sort:T,proxy:Q,fire:N,delay:A,async:D,waitFor:E,factory:L,isIP:F,isMail:H,isPhone:B,isTel:W,isHttpURL:P,parseLevel:J,formatSize:z,Listener:U};$.Q=ft,"object"==typeof module&&"object"==typeof module.exports&&(module.exports=ft)}(),function(t){"use strict";function e(t){t=t||{};var e=this,r=t.tasks;e._listener=new g(w,e),e.auto=t.auto!==!1,e.workerThread=t.workerThread||1,e.timeout=t.timeout,"auto"==t.rtype&&(e.rtype=p(r)),w.forEach(function(r){var n=t[r];n&&e.on(r,n)}),t.inject&&(e.inject=t.inject),t.process&&(e.process=t.process),t.processResult&&(e.processResult=t.processResult),e.ops=t,e.reset(),e.addList(r)}function r(r,n,i,o){return u(n)&&(i=n,n=t),new e(a(i||{},{rtype:"auto",workerThread:o,tasks:r,complete:n}))}function n(t,e,n){return r(t,e,n,f(t)?t.length:Object.size(t))}function i(t){return t=t||{},new e(a(t,{exec:t.ajax||Q.ajax||$.ajax,injectIndex:1,injectCallback:"complete"}))}var o=Q.delay,a=Q.extend,s=Q.fire,c=Q.isFunc,u=Q.isObject,f=Q.isArrayLike,l=Q.isUInt,p=Q.type,h=Q.makeArray,d=Q.factory,g=Q.Listener,m=-1,v=0,y=1,b=2,w=["add","start","end","stop","complete"];d(e).extend({on:function(t,e){return this._listener.add(t,e),this},trigger:function(t,e){return this._listener.trigger(t,e),this},reset:function(){var t=this;return t.tasks=[],t.index=0,t.workerIdle=t.workerThread,t},_add:function(e,r,n){var i=this,o={args:h(e),state:v};return r!=t&&(o.key=r),i.tasks.push(o),i.trigger("add",o),n&&i.start(),i},add:function(){return this._add(arguments,t,this.auto)},addList:function(t){var e=this;return t?(f(t)?Array.forEach(t,function(t,r){e._add(t,r,!1)}):Object.forEach(t,function(t,r){e._add(r,t,!1)}),e.auto&&e.start(),e):e},size:function(e){return e!=t?this.tasks.filter(function(t){return t.state==e}).length:this.tasks.length},_run:function(){var t=this;if(t.stoped||t.workerIdle<=0||t.index>=t.tasks.length)return t;var e=t.tasks[t.index++],r=t.timeout;return t.workerIdle--,t.trigger("start",e),e.state!=v?t.ok(e):(e.state=y,l(r)&&(e._timer=o(t.ok,t,r,[e,m])),t.process(e,function(){t.ok(e,b)}),t.workerIdle?t._run():t)},start:function(){var t=this;return t.stoped=!1,t.auto||(t.auto=!0),o(t._run,t,10),t},stop:function(t){var e=this;return e.stoped=!0,l(t)&&o(e.start,e,t),e},inject:function(e,r){var n=this,i=n.ops,o=i.injectIndex||0,a=i.injectCallback,s=e.args.slice(0);!i.exec&&c(s[0])&&o++;var u,f=s[o],l=function(t){e.result=t,c(u)&&u.apply(this,arguments),r()};if(a!=t){f||(f={});var p=f.__qcallback;u=p||f[a],!p&&u&&(f.__qcallback=u),f[a]=l,s[o]=f}else u=f,s[o]=l;return s},process:function(t,r){var n=this,i=n.ops,o=i.exec,a=i.bind,s=n.inject(t,r),c=s[0];c instanceof e?c.start():o?o.apply(a,s):c.apply(a,s.slice(1))},processResult:function(t){switch(this.rtype){case"array":case"list":case"arguments":return t.items("result");case"object":return t.toObjectMap("key","result")}return[t]},isCompleted:function(t){return(t||this.tasks).every(function(t){return t.state==b||t.state==m})},ok:function(e,r){var n=this;return e.state!=y?n._run():(++n.workerIdle>n.workerThread&&(n.workerIdle=n.workerThread),e._timer&&clearTimeout(e._timer),r!=t&&(e.state=r),n.trigger("end",e),n.stoped?n.isCompleted(n.tasks.slice(0,n.index))&&n.trigger("stop",n.processResult(n.tasks)):n.isCompleted()&&(n.trigger("complete",n.processResult(n.tasks)),s(n.complete,n)),n._run())}}),e.TASK={TIMEDOUT:m,READY:v,PROCESSING:y,OK:b},a(Q,{Queue:e,series:r,parallel:n,ajaxQueue:i})}(),function(t){"use strict";function e(t){try{return decodeURIComponent(t)}catch(e){return t}}function r(e){if(!e)return"";if("string"==typeof e)return e;var r=[];return Object.forEach(e,function(e,n){"function"!=typeof n&&r.push(W(e)+"="+(n!=t?W(n):""))}),r.join("&")}function n(t){for(var e=[],n=arguments,i=1,o=n.length;o>i;i++){var a=n[i];a&&e.push(r(a))}var s=t.indexOf("#"),c="";-1!=s&&(c=t.slice(s),t=t.slice(0,s));var u=e.join("&");return u&&(t+=(t.contains("?")?"&":"?")+u),t+c}function i(t){if(!t)return{};if("?"==t.charAt(0)&&(t=t.slice(1)),!t)return{};for(var r=t.split("&"),n={},i=0,o=r.length;o>i;i++)if(r[i]){var a=r[i].split("="),s=a[0],c=a[1];s&&(n[e(s)]=c?e(c):"")}return n}function o(e){return e!=t?"string"==typeof e?i(e):r(e):void 0}function a(t){t||(t=location.hash);var e,r=t;if(t){var n=t.indexOf("!/");-1!=n&&(r=t.slice(0,n),e=t.slice(n+2))}return{nav:r,param:e}}function s(t,e){var r=(t||location.pathname).replace(/\\/g,"/"),n=r.lastIndexOf("/")+1;if(e)return r.slice(n);var i=r.indexOf("?",n);return-1==i&&(i=r.indexOf("#",n)),-1!=i?r.slice(n,i):r.slice(n)}function c(e,r,i,o){var a=C(e),s=a.length;if(!(0>=s)){i=i||{},T(r)&&(i=r,r=i.complete);var c=i.init||o,u=0,f=function(t,e){P[t]!=$&&(P[t]=$,i.removed&&H.removeChild(e),_(i.after,e,t,e),l(t))},l=function(e){++u>=s&&_(r,t,e)};a.forEach(function(t){if(i.cache===!1&&(t=n(t,"_="+ ++J)),i.once!==!1&&P[t])return P[t]==$?l(t):L(function(){return P[t]==$},function(){l(t)});var e=c(t);P[t]=z,e.onreadystatechange=function(){"loaded"!=this.readyState&&"complete"!=this.readyState||f(t,this)},e.onload=function(){f(t,this)},_(i.before,e,t,e),H.insertBefore(e,H.lastChild)}),a=null}}function u(t,e,r){c(t,e,r,function(t){var e=U.createElement("script");return e.type="text/javascript",e.src=t,e})}function f(t,e,r){c(t,e,r,function(t){var e=U.createElement("link");return e.type="text/css",e.rel="stylesheet",e.href=t,e})}function l(t){return V[t]||t}function p(e){switch(D(e)){case"string":return'"'+e.replace(/[\x00-\x1f\\"]/g,l)+'"';case"list":case"array":for(var r=[],n=0,i=e.length;i>n;n++)"function"!=typeof e[n]&&r.push(e[n]!=t?p(e[n]):Y);return"["+r+"]";case"object":case"arguments":var r=[];for(var o in e)G.call(e,o)&&"function"!=typeof e[o]&&r.push('"'+o+'":'+p(e[o]));return"{"+r.toString()+"}";case"boolean":return e+"";case"number":return isFinite(e)?e+"":Y;case"date":return isFinite(e.valueOf())?e.toUTC().format("yyyy-MM-ddThh:mm:ss.SZ"):Y;case"function":return;default:return"object"==typeof e?"{}":Y}}function h(t,e){if(e!==!1&&!/^[\],:{}\s]*$/.test(t.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))throw new Error("JSON SyntaxError");try{return new Function("return "+t)()}catch(r){}}function d(t){return 0===t.indexOf('"')&&(t=t.slice(1,-1).replace(/\\"/g,'"').replace(/\\\\/g,"\\")),e(t.replace(/\+/g," "))}function g(r){for(var n=r?t:{},i=U.cookie?U.cookie.split("; "):[],o=0,a=i.length;a>o;o++){var s=i[o].split("="),c=e(s[0]),u=s.slice(1).join("=");if(r&&r===c){n=d(u);break}r||(u=d(u))===t||(n[c]=u)}return n}function m(t,e,r){r=r||{};var n=r.expires;"number"==typeof n&&(n=(new Date).add("d",n)),U.cookie=[W(t),"=",W(e),n?"; expires="+n.toUTCString():"",r.path?"; path="+r.path:"",r.domain?"; domain="+r.domain:"",r.secure?"; secure":""].join("")}function v(e){g(e)!=t&&m(e,"",{expires:-1})}function y(){for(var t=U.cookie?U.cookie.split("; "):[],r=0,n=t.length;n>r;r++){var i=t[r].split("="),o=e(i[0]);v(o)}}function b(e,r){var n="sessionStorage"!=e;if(n||location.host){var i=e,o=R[i],a=o&&"getItem"in o?"storage":null;if(!a){var s=U.documentElement,c="_Q_";try{s.addBehavior("#default#userdata"),n&&(s.expires=(new Date).add("d",7).toUTCString()),i=location.hostname||"local",s.save(i),o={getItem:function(t){return s.load(i),s.getAttribute(t)},setItem:function(t,e){s.setAttribute(t,e),s.save(i)},removeItem:function(t){s.removeAttribute(t),s.save(i)},clear:function(){s.load(i);var t=(new Date).add("d",-1);s.expires=t.toUTCString(),s.save(i)}},o.getItem(c)===t&&(o.setItem(c,1),o.removeItem(c)),a="userdata"}catch(u){}!a&&r&&(o={getItem:g,setItem:n?function(t,e){m(t,e,{expires:7})}:m,removeItem:v,clear:y},a="cookie")}var f=!!a,l={support:f,adapter:a,get:function(e,r){if(f)try{var n=o.getItem(e);return r?n?JSON.parse(n):null:n}catch(i){}return t},set:function(t,e){if(f)try{return o.setItem(t,"string"==typeof e?e:JSON.stringify(e)),!0}catch(r){}return!1},remove:function(t){if(f)try{return o.removeItem(t),!0}catch(e){}return!1},clear:function(){if(f)try{return o.clear(),!0}catch(t){}return!1}};return l}}function w(t){return t>=65&&90>=t||32==t||229==t||t>=48&&57>=t||t>=96&&111>=t&&108!=t?!0:t>=186&&192>=t||t>=219&&222>=t?!0:8==t||46==t}function k(e){if(!A(e))return!0;var r=RegExp.lastMatch.length,n=e.indexOf("/",r),i=e.slice(0,-1!=n?n:t);return i.toLowerCase()==(location.protocol+"//"+location.host).toLowerCase()}function x(){if(R.getSelection){var t=getSelection();t.removeAllRanges?t.removeAllRanges():t.empty&&t.empty()}else U.selection&&U.selection.empty()}function j(t){L(function(){return U.body},t)}function S(){Q.body=O=U.body,Q.root=M=B?O:F}var O,M,I,T=Q.isObject,N=Q.isFunc,A=Q.isHttpURL,D=Q.type,C=Q.makeArray,E=Q.extend,_=Q.fire,L=Q.waitFor,R=Q.G,U=R.document,F=U.documentElement,H=U.head||U.getElementsByTagName("head")[0],B="BackCompat"==U.compatMode,W=encodeURIComponent,P={},J=Date.now(),z=1,$=2,q="unknown",K={};R.ActiveXObject||R.msIndexedDB?(K.ie=I=U.documentMode||(R.XMLHttpRequest?7:6),K["ie"+(6>I?6:I)]=!0,q="trident"):R.opera?q="opera":R.mozInnerScreenX!=t||N(U.getBoxObjectFor)?q="gecko":(R.webkitMediaStream||R.WebKitPoint)&&(q="webkit"),K[q]=!0,E(Q,K),K.name=q;var G=Object.prototype.hasOwnProperty,V={"\b":"\\b","	":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},Y="null";R.JSON||(R.JSON={stringify:p,parse:h}),JSON.encode=p,JSON.decode=h;var X={get:g,set:m,remove:v,clear:y},Z={getSize:function(){return{width:M.clientWidth,height:M.clientHeight}},getWidth:function(){return M.clientWidth},getHeight:function(){return M.clientHeight},getScrollWidth:function(){return Math.max(F.scrollWidth,O.scrollWidth)},getScrollHeight:function(){return Math.max(F.scrollHeight,O.scrollHeight)},getScrollLeft:function(){return F.scrollLeft||O.scrollLeft},getScrollTop:function(){return F.scrollTop||O.scrollTop}};E(Q,{html:F,head:H,quirk:B,ready:j,param:o,join:n,parseHash:a,getPageName:s,loadJS:u,loadCSS:f,engine:K,isInputKey:w,isSameHost:k,clearSelection:x,cookie:X,store:new b("localStorage",!0),session:new b("sessionStorage",!0),view:Z,Storage:b}),U.body?S():L(function(){return U.body},S),R.request=i(location.search)}(),function(t){"use strict";function e(e){var n=e.box,i=e.process,o=e.pad?2:1,a=e.time,s=e.step||1,c=e.sleep||1e3,u=e.join||"",f=e.units||["天","小时","分","秒"];if((n||i)&&a!=t&&!isNaN(a)){var l,p=+a,h=function(t,e){return t>9||1==e?t:"0"+t},d=function(){if(p+=s,!(0>p)){var e=Date.parts(p),a=e.days,g=e.hours,m=e.mintues,v=e.seconds,y=a+f[0]+u+h(g,o)+f[1]+u+h(m,o)+f[2]+u+h(v,o)+f[3],b=r(i,t,p,y,a,g,m,v);b!==!1&&($(n).html("string"==typeof b?b:y),l=setTimeout(d,c))}};d();var g={start:d,stop:function(){l&&clearTimeout(l)}};return g}}var r=Q.fire;Q.setTimer=e}();