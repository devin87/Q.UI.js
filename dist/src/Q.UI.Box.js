//devin87@qq.com
//build:2017/11/22 15:41:17
!function(t){"use strict";function i(t){var i=E("div","x-mask");Q.body.appendChild(i),A&&(i.style.height=O.getScrollHeight()+"px"),this.box=i,this.set(g(t||{},Y)),this.count=L(i)?0:1}function e(){return q?(q.show(),q):q=new i}function n(t){m(t,this),this._apis=[],this.start()}function o(t,i){return new n(function(){1!=t.nodeType?t=(i=t).ele:(i=i||{}).ele=t;var e,n,o,s,r,a,h,c,u=this,l=i.range||{x:0,y:0},f=!!i.shadow,x=t.offsetWidth,v=t.offsetHeight,p=t;f&&(J||(J=E("div","x-drag-shadow"),Q.body.appendChild(J)),p=J),u.ops=i,u.doDown=function(i){o=i.clientX,s=i.clientY;var r=f?$(t).offset():$(t).position();e=r.left,n=r.top,f&&Object.forEach({left:e,top:n,width:x,height:v},function(t,i){p.style[t]=i+"px"})},u.doMove=function(t){if(S(p),h){r=t.clientX-o;var i=e+r;l&&(i<l.x?i=l.x:l.w&&i+x>l.x+l.w&&(i=l.x+l.w-x)),p.style.left=i+"px"}if(c){a=t.clientY-s;var u=n+a;l&&(u<l.y?u=l.y:l.h&&u+v>l.y+l.h&&(u=l.y+l.h-v)),p.style.top=u+"px"}},f&&(u.doUp=function(){I(p),t.style.left=t.offsetLeft+r+"px",t.style.top=t.offsetTop+a+"px"}),u.setLock=function(t,i){return h=t,c=i,u.pause(!t&&!i)},u.setRange=function(t,i,e,n){return l=d(t)?t:{x:t,y:i,w:e,h:n},u},u.setLock(!1!==i.isX,!1!==i.isY)})}function s(t){this._es=[],m(t,this)}function r(t){return t=t||{},new s(function(){var n=this,s=t.width,r=t.height,a=p(t.maxHeight,O.getHeight()-60),h=!1!==t.drag,c=h&&!1!==t.center,u=t.className;n.ops=t,n.callback=t.callback;var d='<div class="x-head"><h2 class="x-title">'+(t.title||K.titleBox)+'</h2><a class="x-close" title="'+K.titleClose+'">X</a></div><div class="x-main"><div class="x-view">'+(t.html||"")+"</div></div>";A&&(d+='<iframe class="x-ie-fix" style="position: absolute;top:0;left:0;z-index:-1;" scrolling="no" frameborder="0"></iframe>');var f=E("div","x-box"+(u?" "+u:""),d);Q.body.appendChild(f),n.box=f;var g=t.zIndex||0;G>P&&(g=Math.max(g,G)),g&&(f.style.zIndex=g);var y=_(f),w=C(y);n.setTitle=function(t){return $(".x-title",y).html(t),n},n.setWidth=function(i){return t.width=i,H(f,i),m(t.resize,n),n},n.setHeight=function(i){return t.height=i,z(w,i-y.offsetHeight-20),n},n.setMaxHeight=function(i){t.maxHeight=i;var e=t.height;return x(e)&&e>i&&(e=i),f.scrollHeight>i&&(e=i,B(f,"x-box-auto")),x(e)&&n.setHeight(e),c&&D(f),m(t.resize,n),n},n.autoHeight=function(){var i=t.maxHeight;if(!i)return n;var e=n.get(".x-head").offsetHeight,o=i-e-20,s=i-e;return w.style.height=w.scrollHeight>s?o+"px":"auto",c&&D(f),n},x(s)&&H(f,s),y.offsetWidth<10&&H(y,f.offsetWidth),a?n.setMaxHeight(a):x(r)&&n.setHeight(r),!1!==t.mask&&(n.mbox="new"==t.mask?new i:e());var k=t.close||"hide",M=n.getEventCallback(k);n.bind(".x-close","click",k),!1!==t.esc&&n.bind(l,"keyup",function(t){27==t.keyCode&&M()});var S=t.time;v(S)&&b(M,S),m(t.init,n,f,t),h&&(n.dr=o(f,{target:y,center:c,shadow:t.shadow,autoMask:!0,onCheck:function(t){var i=t.target;return i&&"x-close"!=i.className}})),$(".x-ie-fix",f).width(f.offsetWidth-2).height(f.offsetHeight-2)})}function a(t){t.width||(t.width=320);var i=t.width;if(t.icon||t.iconHtml){var e='<div class="fl x-ico">'+(t.iconHtml||'<img alt="" src="'+t.icon+'"/>')+'</div><div class="fl x-dialog"'+(x(i)?' style="width:'+(i-60)+'px;"':"")+">"+t.html+'</div><div class="clear"></div>';t.html=e;var n=t.init;t.resize=function(){var t=this.get(".x-view").offsetWidth-this.get(".x-ico").offsetWidth;$(".x-dialog",this.box).width(t)},t.init=function(t,i){i.resize.call(this),m(n,this,t,i)}}else t.html='<div class="x-dialog">'+t.html+"</div>";return t.bottom&&(t.html+=t.bottom),t.close||(t.close="remove"),r(t)}function h(t,i){var e="inline-block w-button w-"+(i||"dark");return'<div class="x-bottom"><div class="'+e+' x-submit">'+K.buttonSubmit+"</div>"+(2==t?'<div class="'+e+' x-cancel">'+K.buttonCancel+"</div>":"")+"</div>"}function c(t,i,e,n){return"object"==typeof e&&(e=n=e),n=g({},n),f(e)&&(n.callback=e),n.title||(n.title=t),n.html=i,n}var u=Q.G,l=u.document,d=Q.isObject,f=Q.isFunc,x=Q.isUNum,v=Q.isUInt,p=Q.def,m=Q.fire,b=Q.async,g=Q.extend,y=Q.makeArray,w=Q.getStyle,k=Q.setStyle,_=Q.getFirst,C=Q.getNext,H=Q.width,z=Q.height,E=Q.createEle,M=Q.removeEle,S=Q.show,I=Q.hide,L=Q.isHidden,B=Q.addClass,W=Q.setCssIfNot,D=Q.setCenter,N=Q.setInputError,U=Q.setInputDefault,X=Q.clearSelection,j=Q.query,T=Q.factory,A=Q.ie<7,O=Q.view,R=Q.event,Y={color:"#999",opacity:.3};T(i).extend({opacity:function(t){return this.set({opacity:t})},set:function(t){var i=this.box;return Object.forEach(t,function(t,e){void 0!==e&&k(i,"color"!=t?t:"backgroundColor",e)}),this},show:function(){return this.removed&&(Q.body.appendChild(this.box),this.removed=!1),S(this.box),this.count++,this},hide:function(){return this.count>0&&this.count--,this.count<=0&&I(this.box),this},remove:function(){return M(this.box),this.removed=!0,this.count=0,this}});var q,F,P=1e3,G=P;T(n).extend({start:function(){var t=this,e=t.ops,n=e.scope||u,o=n.document,s=e.ele,r=e.target||s,a=!1!==e.autoIndex,h=!!e.autoMask,c=!1!==e.autoCss,l=!1!==e.autoCursor,d=1==s.nodeType?+w(s,"z-index"):0,x=t.doDown,v=t.doMove,p=t.doUp,g=e.onCheck,y=e.onDown,Q=e.onMove,k=e.onUp,_=function(t){for(var i=[],e=t||u;e.top!=e;){var n=e.parent;i.push(n),e=n}return i}(n),C=!!s.setCapture,H=!C&&_.length>0;d>=G&&(G=d+1),c&&W(s,"position","absolute"),c&&l&&W(r,"cursor","move"),e.center&&(D(s),t._api_resize=R.add(n,"resize",function(){D(s)}));var z=function(i){t._pause||(m(v,t,i),m(Q,t,i))},E=function(i){t._unbind(),C&&s.releaseCapture(),h&&F&&(F.remove(),F=null),X(),m(p,t,i),m(k,t,i)};return t._up=E,t._api=R.add(r,"mousedown",function(e){f(g)&&!1===g.call(t,e)||(a&&(+w(s,"z-index")||0)<G&&(G++,s.style.zIndex=G),t._unbind(),C?(s.setCapture(),t._bind(s,"losecapture",E)):t._bind(n,"blur",E),t._bind(o,{mousemove:z,mouseup:E}),H&&t._bind(_,"mouseup",E),h&&(F||(F=new i({color:null,opacity:null,zIndex:999999})),A&&F.set({height:O.getScrollHeight()})),b(X,20),m(x,t,e),m(y,t,e))}),t},_bind:function(){this._apis.push(R.add.apply(R,arguments))},_unbind:function(){var t=this._apis;t.length>0&&(t.forEach(function(t){t.off()}),this._apis=[])},pause:function(t){return this._pause=t,this._up&&this._up(),this},stop:function(){var t=this._api;return this._unbind(),t&&(t.off(),this._api=null),this},destroy:function(){var t=this._api_resize;return this.stop(),t&&(t.off(),this._api_resize=null),this}});var J;$.fn.extend({drag:function(t){return this.each(function(i,e){o(e,t)})}}),T(s).extend({find:function(t,i){return"string"==typeof t?j(t,i||this.box):y(t)},$:function(t,i){return $(this.find(t,i))},get:function(t,i){return this.find(t,i)[0]},fire:function(){return m(this.callback,this,this.data),this},getEventCallback:function(t,i){var e=this;return"hide"==t?function(){e.data=i,e.hide()}:"remove"==t?function(){e.data=i,e.remove()}:t},bind:function(t,i,e,n){return this._es.push(R.add(this.find(t),i,this.getEventCallback(e,n))),this},on:function(t,i,e,n){return this._es.push(R.add(this.box,t,i,this.getEventCallback(e,n))),this},show:function(){return this.onShow&&this.onShow(),S(this.box),this.mbox&&this.mbox.show(),this},hide:function(){return I(this.box),this.mbox&&this.mbox.hide(),this.onHide&&this.onHide(),this.fire()},toggle:function(){return L(this.box)?this.show():this.hide()},remove:function(){if(this.box)return M(this.box),this.mbox&&this.mbox.hide(),this.dr&&this.dr.destroy(),this._es.forEach(function(t){t.off()}),this.box=this.mbox=this.dr=null,this.onRemove&&this.onRemove(),this.fire()}}),s.alias({$:"query",remove:"destroy"});var K={titleBox:"弹出框",titleAlert:"提示信息",titleConfirm:"确认信息",titlePrompt:"输入信息",titleClose:"点击关闭",titleLoading:"加载数据",buttonSubmit:"确定",buttonCancel:"取消",textLoading:"正在加载数据,请稍后…"},V={createDialogBox:a,alert:function(t,i,e){return e=c(K.titleAlert,t,i,e),e.iconHtml='<div class="ico x-alert"></div>',a(e)},confirm:function(t,i,e){(e=c(K.titleConfirm,t,i,e)).bottom||(e.bottom=h(2)),e.mask=!1!==e.mask;return a(e).bind(".x-submit","click","remove",!0).bind(".x-cancel","click","remove",!1)},prompt:function(t,i,e){e=c(K.titlePrompt,void 0,i,e),i=e.callback,e.callback=void 0;var n='<div class="x-text">'+t+'</div><div class="x-input"><input type="'+(e.pwd?"password":"text")+'" /></div>';e.html=n,e.bottom||(e.bottom=h(2));var o=a(e),s=o.get(".x-input>input");s.focus(),s.value=p(e.value,"");var r=function(){!1!==m(i,s,s.value)?o.remove():N(s)};return o.bind(s,"keyup",function(t){13==t.keyCode?r():U(this)}),o.bind(".x-submit","click",r).bind(".x-cancel","click","remove")},bottom:h,showLoading:function(t){return(t=g({},t)).title||(t.title=K.titleLoading),t.html||(t.html=K.textLoading),t.iconHtml='<div class="ico x-loading"></div>',a(t)}};g(Q,V),g(Q,{getMaskBox:e,maskSetup:function(t,i){g(Y,t,!0),i&&q&&q.reset(t)},setDrag:o,setBoxLang:function(t){g(K,t,!0)},MaskBox:i,DragX:n,Box:s,WinBox:r})}();