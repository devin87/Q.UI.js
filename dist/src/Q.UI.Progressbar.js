//devin87@qq.com
//build:2015/08/27 15:14:25
!function(t){"use strict";function r(t){t=t||{};var r=t.box,e=s("div","progress-bar"),i=s("div","progress");e.appendChild(i),r.appendChild(e);var o=this;o._bar=e,o._node=i,o.speed=t.speed||1,o.wait=t.wait||100,o.progress=0,o.time=0,o.onprogress=t.onprogress}var e=Q.fire,s=Q.createEle,i=Q.factory;i(r).extend({start:function(){var t=this;if(!(t.progress>=100))return t._timer=setInterval(function(){t.update()},t.wait),t},stop:function(){return this._timer&&clearInterval(this._timer),this},restart:function(){return this.stop().update(0).start()},update:function(r){var s=this;return r!=t?s.progress=Math.max(r,0):s.progress+=s.speed,s.progress>100&&(s.progress=100,s.stop()),s._node.style.width=s.progress.toFixed(2)+"%",s.time+=s.wait,e(s.onprogress,s,s.progress,s.speed,s.time),s},set:function(t,r){return t&&(this.speed=t),r&&(this.wait=r),this.stop().start()}}),Q.Progressbar=r}();