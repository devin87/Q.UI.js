//devin87@qq.com
//build:2015/07/15 16:04:20
!function(t){"use strict";function e(){if(v.getSelection){var t=getSelection();t.removeAllRanges?t.removeAllRanges():t.empty&&t.empty()}else g.selection&&g.selection.empty()}function i(){Q.body=f=g.body,Q.root=h=y?f:b}function n(t,e,i,n,o){var s=$(t);return s.on(e,i,n,o),{off:function(t,e){s.off(t,e)}}}function o(t,e,i){var n=new jQuery.Event(t);e!==!1&&n.preventDefault(),i!==!1&&n.stopPropagation()}function s(t,e,i){var n=$(t);t&&n.css(e)!=i&&n.css(e,i)}function r(t,e,i){var n=g.createElement(t);return e&&(n.className=e),i&&(n.innerHTML=i),n}function a(e,i){var n=r("div",t,e);return i?n.childNodes:Q.getFirst(n)}function l(t,e){var i=t.style.cssText;i&&(t.style.cssText=i.drop(e+"(-[^:]+)?\\s*:[^;]*;?","gi").trim())}function c(t,e){e?t.style.borderColor="red":t.style.border="1px solid red",t.value="",t.focus()}function u(t){l(t,"border")}function d(t,e,i,n){for(var t=t[i||e],o=[];t;){if(1==t.nodeType){if(!n)return t;o.push(t)}t=t[e]}return n?o:null}var f,h,v=Q.G,m=Q.extend,x=Q.async,p=Q.makeArray,g=v.document,b=g.documentElement,_=g.head||g.getElementsByTagName("head")[0],y="BackCompat"==g.compatMode;g.body?i():x(i,0);var w={getSize:function(){return{width:h.clientWidth,height:h.clientHeight}},getWidth:function(){return h.clientWidth},getHeight:function(){return h.clientHeight},getScrollWidth:function(){return Math.max(b.scrollWidth,f.scrollWidth)},getScrollHeight:function(){return Math.max(b.scrollHeight,f.scrollHeight)},getScrollLeft:function(){return b.scrollLeft||f.scrollLeft},getScrollTop:function(){return b.scrollTop||f.scrollTop}};m(Q,{html:b,head:_,quirk:y,clearSelection:e,view:w});var C,k="unknown",M={};v.ActiveXObject||v.msIndexedDB?(M.ie=C=g.documentMode||(v.XMLHttpRequest?7:6),M["ie"+(6>C?6:C)]=!0,k="trident"):v.opera?k="opera":v.mozInnerScreenX!=t||isFunc(g.getBoxObjectFor)?k="gecko":(v.WebKitPoint||v.devicePixelRatio)&&(k="webkit"),M[k]=!0,m(Q,M),M.name=k,Q.engine=M,jQuery.Event.prototype.stop=function(){o(this)},Q.event={fix:function(t){return new jQuery.Event(t)},stop:o,trigger:function(t,e){$(t).trigger(e)},add:n};var I="previousSibling",H="nextSibling",S="firstChild",E="lastChild";m(Q,{camelCase:$.camelCase,attr:function(t,e,i){return $(t).attr(e,i)},prop:function(t,e,i){return $(t).prop(e,i)},width:function(t,e){return $(t).width(e)},height:function(t,e){return $(t).height(e)},getStyle:function(t,e){return $(t).css(e)},setStyle:function(t,e,i){return null===i?l(t,e):void $(t).css(e,i)},setOpacity:function(t,e){return $(t).css("opacity",e)},removeCss:l,css:function(t,e,i){return $(t).css(e,i)},show:function(t){$(t).show()},hide:function(t){$(t).hide()},toggle:function(t){$(t).toggle()},isHidden:function(t){return $(t).is(":hidden")},offset:function(e,i,n){var o=$(e);if(i===t&&n===t){var r=o.offset();return r.width=o.outerWidth(),r.height=o.outerHeight(),r}s(e,"position","absolute"),i!==t&&o.css("left",i),n!==t&&o.css("top",n)},setCssIfNot:s,setCenter:function(t){s(t,"position","absolute");var e=w.getSize(),i=$(t.offsetParent).offset(),n=Math.round((e.width-t.offsetWidth)/2)-i.left+w.getScrollLeft(),o=Math.round((e.height-t.offsetHeight)/2)-i.top+w.getScrollTop();$(t).css({left:Math.max(n,0),top:Math.max(o,0)})},getFirst:function(t){return t.firstElementChild||d(t,H,S,!1)},getLast:function(t){return t.lastElementChild||d(t,I,E,!1)},getPrev:function(t){return t.previousElementSibling||d(t,I,null,!1)},getNext:function(t){return t.nextElementSibling||d(t,H,null,!1)},getChilds:function(t){return t.children?p(t.children):d(t,H,S,!0)},findTag:function(t,e){for(;t&&"BODY"!=t.tagName;){if(t.tagName==e)return t;t=t.parentNode}},createEle:r,parseHTML:a,removeEle:function(t){$(t).remove()},hasClass:function(t,e){return $(t).hasClass(e)},addClass:function(t,e){$(t).addClass(e)},removeClass:function(t,e){$(t).removeClass(e)},replaceClass:function(t,e,i){$(t).removeClass(e).addClass(i)},toggleClass:function(t,e){$(t).toggleClass(e)},setInputError:c,setInputDefault:u}),v.$$=Q.query=$.find}(),function(t){"use strict";function e(t){var e=H("div","x-mask");Q.body.appendChild(e),X&&(e.style.height=P.getScrollHeight()+"px"),this.box=e,this.set(b(t||{},R))}function i(){return Y?(Y.show(),Y):Y=new e}function n(t,e){b(R,t,!0),e&&Y&&Y.reset(t)}function o(t){for(var e=[],i=t||d;i.top!=i;){var n=i.parent;e.push(n),i=n}return e}function s(t){var e=this;p(t,e),e._apis=[],e.start()}function r(t,e){return new s(function(){1!=t.nodeType?(e=t,t=e.ele):(e=e||{},e.ele=t);var i,n,o,s,r=this,a=e.range||{x:0,y:0},l=e.shadow!==!1,c=t.offsetWidth,u=t.offsetHeight,d=t;l&&(G||(G=H("div","x-drag-shadow"),Q.body.appendChild(G)),d=G),r.ops=e,r.doDown=function(e){i=e.clientX-t.offsetLeft,n=e.clientY-t.offsetTop,l&&Object.forEach(w(t),function(t,e){y(d,t,e)})},r.doMove=function(t){if(E(d),o){var e=t.clientX-i;a&&(e<a.x?e=a.x:a.w&&e+c>a.x+a.w&&(e=a.x+a.w-c)),d.style.left=e+"px"}if(s){var r=t.clientY-n;a&&(r<a.y?r=a.y:a.h&&r+u>a.y+a.h&&(r=a.y+a.h-u)),d.style.top=r+"px"}},l&&(r.doUp=function(){T(d)||(j(d),t.style.left=d.style.left,t.style.top=d.style.top)}),r.setLock=function(t,e){return o=t,s=e,r.pause(!t&&!e)},r.setRange=function(t,e,i,n){return a=h(t)?t:{x:t,y:e,w:i,h:n},r},r.setLock(e.isX!==!1,e.isY!==!1)})}function a(t){p(t,this)}function l(t){return t=t||{},new a(function(){var e=this,n=t.width,o=t.height,s=t.maxHeight,a=t.className;e.callback=t.callback;var l='<div class="x-head"><h2 class="x-title">'+(t.title||"弹出框")+'</h2><a class="x-close" title="点击关闭">X</a></div><div class="x-main"><div class="x-view">'+(t.html||"")+"</div></div>";X&&(l+='<iframe class="x-ie-fix" style="position: absolute;top:0;left:0;z-index:-1;" scrolling="no" frameborder="0"></iframe>');var c=H("div","x-box"+(a?" "+a:""),l);Q.body.appendChild(c);var u=t.zIndex||0;K>U&&(u=Math.max(u,K)),u&&(c.style.zIndex=u);var d=C(c),h=k(d);m(n)&&M(c,n),s&&(m(o)&&o>s&&(o=s),c.offsetHeight>s&&(o=s,W(c,"x-box-auto"))),m(o)&&o>50&&I(h,o-d.offsetHeight-20),d.offsetWidth<10&&M(d,c.offsetWidth),t.mask&&(e.mbox=i());var v=t.close||"hide",x=e.getEventCallback(v);e.on(".x-close","click",v),t.esc!==!1&&A.add(f,"keyup",function(t){27==t.keyCode&&x()});var b=t.time;m(b)&&g(x,b),e.box=c,p(t.init,e,c,t),t.drag!==!1&&r(c,{target:d,center:t.center!==!1,onCheck:function(t){var e=t.target;return e&&"x-close"!=e.className}}),$(".x-ie-fix",c).width(c.offsetWidth-2).height(c.offsetHeight-2),e.setTitle=function(t){$(".x-title",d).html(t)}})}function c(t){t.width||(t.width=320);var e=t.width;if(t.icon||t.iconHtml){var i='<div class="fl x-ico">'+(t.iconHtml||'<img alt="" src="'+t.icon+'"/>')+'</div><div class="fl x-dialog"'+(m(e)?' style="width:'+(e-60)+'px;"':"")+">"+t.html+'</div><div class="clear"></div>';t.html=i;var n=t.init;t.init=function(t,e){var i=this,o=i.get(".x-view").offsetWidth-i.get(".x-ico").offsetWidth;$(".x-dialog",t).width(o),p(n,i,t,e)}}else t.html='<div class="x-dialog">'+t.html+"</div>";return t.bottom&&(t.html+=t.bottom),t.close||(t.close="remove"),l(t)}function u(t,e){var i="inline-block w-button w-"+(e||"dark"),n='<div class="x-bottom"><div class="'+i+' x-submit">确定</div>'+(2==t?'<div class="'+i+' x-cancel">取消</div>':"")+"</div>";return n}var d=Q.G,f=d.document,h=Q.isObject,v=Q.isFunc,m=Q.isUInt,x=Q.def,p=Q.fire,g=Q.async,b=Q.extend,_=Q.getStyle,y=Q.setStyle,w=Q.offset,C=Q.getFirst,k=Q.getNext,M=Q.width,I=Q.height,H=Q.createEle,S=Q.removeEle,E=Q.show,j=Q.hide,T=Q.isHidden,L=Q.toggle,W=Q.addClass,N=Q.setCssIfNot,z=Q.setCenter,D=Q.query,B=Q.clearSelection,F=Q.factory,O=Q.ie,X=7>O,P=Q.view,A=Q.event,R={color:"#999",opacity:.3};F(e).extend({opacity:function(t){return this.set({opacity:t})},set:function(e){var i=this.box;return Object.forEach(e,function(e,n){n!==t&&y(i,"color"!=e?e:"backgroundColor",n)}),this},show:function(){return this.removed&&(Q.body.appendChild(this.box),this.removed=!1),E(this.box),this},hide:function(){return j(this.box),this},remove:function(){return S(this.box),this.removed=!0,this}});var Y,q,U=1e3,K=U;F(s).extend({start:function(){var t=this,i=t.ops,n=i.scope||d,s=n.document,r=i.ele,a=i.target||r,l=i.autoIndex!==!1,c=i.autoMask!==!1,u=1==r.nodeType?+_(r,"z-index"):0,f=t.doDown,h=t.doMove,m=t.doUp,x=i.onCheck,b=i.onDown,y=i.onMove,w=i.onUp,Q=o(n),C=!!r.setCapture,k=!C&&Q.length>0;u>=K&&(K=u+1),N(r,"position","absolute"),N(a,"cursor","move"),i.center&&(z(r),A.add(n,"resize",function(){z(r)}));var M=function(i){if(!v(x)||x.call(t,i)!==!1){if(l){var o=+_(r,"z-index")||0;K>o&&(K++,r.style.zIndex=K)}t._unbind(),C?(r.setCapture(),t._bind(r,"losecapture",H)):t._bind(n,"blur",H),t._bind(s,{mousemove:I,mouseup:H}),k&&t._bind(Q,"mouseup",H),c&&(q||(q=new e({color:null,opacity:null,zIndex:999999})),X&&q.set({height:P.getScrollHeight()})),g(B,20),p(f,t,i),p(b,t,i)}},I=function(e){t._pause||(p(h,t,e),p(y,t,e))},H=function(e){t._unbind(),C&&r.releaseCapture(),c&&q&&(q.remove(),q=null),B(),p(m,t,e),p(w,t,e)};t._up=H,t._api=A.add(a,"mousedown",M)},_bind:function(){this._apis.push(A.add.apply(A,arguments))},_unbind:function(){var t=this._apis;t.length>0&&(t.forEach(function(t){t.off()}),this._apis=[])},pause:function(t){this._pause=t,this._up&&this._up()},stop:function(){var t=this,e=t._api;t._unbind(),e&&(e.off(),t._api=null)}});var G;$.fn.extend({drag:function(t){return this.each(function(e,i){r(i,t)})}}),F(a).extend({find:function(t,e){return D(t,e||this.box)},get:function(t,e){return this.find(t,e)[0]},fire:function(){return p(this.callback,this,this.data),this},getEventCallback:function(t,e){var i=this;return"hide"==t?function(){i.data=e,i.hide()}:"remove"==t?function(){i.data=e,i.remove()}:t},on:function(t,e,i,n){var o=this,s=o.find(t);return h(e)?(n=i,Object.forEach(e,function(t,e){A.add(s,t,o.getEventCallback(e,n))})):A.add(s,e,o.getEventCallback(i,n)),o},show:function(){var t=this;return t.onShow&&t.onShow(),E(t.box),t.mbox&&t.mbox.show(),t},hide:function(){var t=this;return j(t.box),t.mbox&&t.mbox.hide(),t.onHide&&t.onHide(),t.fire()},toggle:function(){return L(this.box),this},remove:function(){var t=this;if(t.box)return S(t.box),t.mbox&&t.mbox.remove(),t.box=t.mbox=null,t.onRemove&&t.onRemove(),t.fire()}});var J={createDialogBox:c,alert:function(t,e,i){var i=i||{};return v(e)?i.callback=e:"object"==typeof e&&(i=e),i.title||(i.title="提示信息"),i.iconHtml='<div class="ico x-alert"></div>',i.html=t,c(i)},confirm:function(t,e,i){var i=i||{};v(e)?i.callback=e:"object"==typeof e&&(i=e),i.title||(i.title="确认信息"),i.html=t,i.bottom||(i.bottom=u(2)),i.mask=i.mask!==!1;var n=c(i);return n.on(".x-submit","click","remove",!0).on(".x-cancel","click","remove",!1),n},prompt:function(t,e,i){var i=i||{};"object"==typeof e&&(i=e),i.title||(i.title="输入信息"),i.html='<div class="x-text">'+t+'</div><div class="x-input"><input type="'+(i.pwd?"password":"text")+'" /></div>',i.width||(i.width=320),i.bottom||(i.bottom=u(2));var n=c(i),o=n.get(".x-input>input");o.focus(),o.value=x(i.value,"");var s=function(){var t=p(e,o,o.value);t!==!1?n.remove():setInputError(o)};return n.on(o,"keyup",function(t){13==t.keyCode?s():setInputDefault(this)}),n.on(".x-submit","click",s).on(".x-cancel","click","remove"),n},bottom:u,showLoading:function(t){return t=t||{html:"正在加载数据,请稍后…"},t.iconHtml='<div class="ico x-loading"></div>',t.title||(t.title="加载数据"),c(t)}};b(Q,J),b(Q,{getMaskBox:i,maskSetup:n,setDrag:r,MaskBox:e,DragX:s,Box:a,WinBox:l})}(),function(t){"use strict";function e(e,i,n){i!=t&&(e.style.left=i+"px"),n!=t&&(e.style.top=n+"px")}function i(t,e){s(this,e),this.init(t)}var n=window.document,o=Q.fire,s=Q.extend,r=Q.makeArray,a=Q.getStyle,l=Q.offset,c=Q.hasClass,u=Q.addClass,d=Q.removeClass,f=Q.createEle,h=Q.factory,v=Q.event,m=-1e4;h(i).extend({init:function(t){var e=this;return e.draw(t),e.autoHide!==!1&&(e._e0=v.add(n,"mousedown",function(){e.hide()})),e},draw:function(e){var i=this;i._menus=[],i._items=[],i._map_menu={},i._map_item={},i.i=i.j=0,i._active=t;var n,s=i._tmp=[];for(i.drawMenu(e);n=s.shift();)i.drawMenu.apply(i,n);i._tmp=null,i.i=i.j=0;var r=i._getMenu(0).node;i.box=r;var a=[];return i._menus.forEach(function(t){t&&!t.linked&&a.push(t.node)}),i._e1&&i._e1.off(),i._e1=v.add(a,{click:function(t){var e=this,n=e._j;if(c(e,"x-disabled")||i._getSubMenu(n)&&!i.isFireAll)return void v.stop(t);var s=i._getItem(n);o(s.data.click,e,t,s),o(i.onclick,e,t,s),i.hide()},mouseenter:function(t){var e=this,n=e._i,s=e._j;i._hideSub(n,s),u(e,"x-on");var r=i._getItem(s);o(r.data.mouseover,e,t,r),o(i.onmouseover,e,t,r),c(e,"x-disabled")||i._showSub(n,s,e)},mouseleave:function(t){var e=this,n=e._i,s=e._j,r=i._getSubMenu(s);c(e,"x-disabled")||!r?d(e,"x-on"):0==n&&(i._active=s);var a=i._getItem(s);o(a.data.mouseout,e,t,a),o(i.onmouseout,e,t,a)}},".x-item"),i._e2&&i._e2.off(),i._e2=v.add(a,"mousedown",v.stop),i.hide()},drawMenu:function(e,i){var o=this,s=o._menus,r=o._items,a=o._map_menu,l=o._map_item,c=e.box,u=!!c,d=o.i++;if(!c){var h=e.className,c=f("div","x-panel"+(h?" "+h:""));c.style.width=(e.width||120)+"px"}if(s[d]={node:c,linked:u,j:i,data:e},i&&(a[i]=d),u)return o;for(var v=o.subMenu!==!1,m=0,x=e.items;m<x.length;m++){var p=x[m];if(p){var g=n.createElement("div"),b=o.j++;if(g._i=d,g._j=b,r[b]={node:g,i:d,j:b,data:p},p.id&&(l[p.id]=b),p.split)g.className="x-split";else{g.className="x-item"+(p.disabled?" x-disabled":""),g.x=p.x!=t?p.x:"";var _=p.group,y=v&&_&&(_.box||_.items&&_.items.length>0),w=p.ico,C=p.html||'<div class="x-icon">'+(w?/^<.+>$/.test(w)?w:'<img alt="" src="'+w+'">':"")+'</div><div class="x-text"'+(p.title?' title="'+p.title+'"':"")+">"+p.text+"</div>"+(y?'<div class="arrow"></div>':"");g.innerHTML=C,y&&o._tmp.push([_,b])}c.appendChild(g)}}return Q.body.appendChild(c),o},_getMenu:function(t){return this._menus[t]},_getSubMenu:function(e){var i=this._map_menu[e];return i!=t?this._getMenu(i):t},_getItem:function(t){return this._items[t]},getItem:function(e){var i=this._map_item[e];return i!=t?this._items[i]:t},setItemText:function(t,e){var i=this.getItem(t);if(i){i.data.text=e;var n=i.node.childNodes[1];n&&(n.innerHTML=e)}},processItems:function(t,e){var i=this;return r(t).forEach(function(t){var n=i.getItem(t);n&&e(n.node,n)}),i},_processItems:function(t,e,i){return this.processItems(t,function(t){e(t,i)})},enableItems:function(t){return this._processItems(t,d,"x-disabled")},disableItems:function(t){return this._processItems(t,u,"x-disabled")},showItems:function(t){return this._processItems(t,d,"hide")},hideItems:function(t){return this._processItems(t,u,"hide")},_setPos:function(i,n,o,s){var r=this,a=r.rangeX,l=r.rangeY,c=i.node,u=c.offsetWidth,d=c.offsetHeight,f=i.data||{},h=f.maxHeight;if(h){var v=Math.max(d,c.scrollHeight),m=v>h;c.style.height=m?h+"px":"auto",r.fixedWidth||(c.style.width=f.width+(m?17:0)+"px"),d=c.offsetHeight}return n==t&&(n=r.x||0),o==t&&(o=r.y||0),a&&n+u>a&&(n=a-u,s&&(n=n-s.offsetWidth+3)),l&&o+d>l&&(o=l-d-1),0>n&&(n=0),0>o&&(o=0),e(c,n,o),r.x=n,r.y=o,r},_showSub:function(t,e,i){var n=this,o=n._getMenu(t),s=n._getSubMenu(e);if(s){var r=o.node,c=s.node,u=l(i),d=+a(r,"zIndex"),f=+a(c,"zIndex");d>=f&&(c.style.zIndex=d+1),n._setPos(s,u.left+u.width-2,u.top,r)}return n.i=t,n.j=e,n},_inactive:function(t){var e=this._getItem(t);return e&&d(e.node,"x-on"),this},_hideSub:function(t,e){var i=this;if(t<=i.i&&e!=i.j){var n,o=i._menus;for(n=o.length-1;n>t;n--)i._hide(o[n]);if(t<i.i)for(n=i.i;n>t;n--){var s=i._getMenu(n);i._inactive(s.j)}}return t==i.i&&e!=i.j&&i._getSubMenu(i.j)&&i._inactive(i.j),i},_hide:function(t){if(t){var i=t.node;i.style.left!=m&&e(i,m,m)}return this},show:function(t,e){return this.hide()._setPos(this._menus[0],t,e)},hide:function(){var e=this;return e._menus.forEach(function(t){e._hide(t)}),e._active!=t&&(e._inactive(e._active),e._active=t),e},isHidden:function(){var t=this,e=t.box,i=parseFloat(e.style.left),n=parseFloat(e.style.top);return i<=-e.offsetWidth||n<=-e.offsetHeight},toggle:function(){return this.isHidden()?this.show():this.hide()}}),Q.ContextMenu=i}(),function(t){"use strict";function e(t){t=t||{};var e=this;e.box=t.box,e.items=t.items||[],e.multiple=t.multiple,e.value=t.value,e.index=t.index||0,e.ops=t}var i=window.document,n=Q.def,o=Q.fire,s=Q.isObject,r=Q.getFirst,a=Q.getLast,l=Q.width,c=l,u=Q.hasClass,d=Q.addClass,f=Q.removeClass,h=Q.createEle,v=Q.factory,m=Q.ie,x=Q.event;v(e).extend({init:function(){var t=this,e=t.ops,n=t.box,s=!t.multiple,l=(s?'<div class="x-sel-tag"><div class="x-sel-text"></div><div class="x-sel-arrow"><div class="arrow arrow-down"></div></div></div>':"")+'<div class="x-panel x-sel-list"></div>';d(n,"x-sel"),n.innerHTML=l;var f,h,v,p=a(n);c(p,e.width||n.offsetWidth-2),s&&(f=r(n),h=r(f),v=a(f),t.elText=h,t.elArrow=v),t.elList=p;var g;return s?(x.add(i,"mousedown",function(){t.hide()}),x.add(n,"mousedown",function(e){t.toggle(),x.stop(e)}),g={mousedown:x.stop,mouseup:function(e){var i=this.x,n=t.items[i];t.hide(),o(t.onclick,t,n,i),i!=t.index&&t.select(i)},mouseenter:function(){var e=this;u(e,"x-disabled")||t.active(e.x)}}):(t.selectedItems=[],t.seletedMap={},g={mousedown:function(e){var i=this;if(!u(i,"x-disabled")){var n=this.x,o=t.selectedItems[0],s=e.shiftKey,r=e.ctrlKey;if((s||!r)&&t.clearSelect(),s){var a=o?o.index:n,l=n;a>l&&(l=a,a=n);for(var c=a;l>=c;c++)t.active(c)}else r&&t.seletedMap[n]?t.inactive(n):t.select(n)}}},10>m&&(g.selectstart=x.stop)),x.add(p,g,".x-item"),t.draw()},draw:function(){var t=this,e=t.ops,i=t.items,n=t.elList,o=e.hasTitle,s=e.maxHeight,r={};if(n.innerHTML="",i.forEach(function(t,e){t.index=e,r[t.value]=t;var i=t.text||"",s=h("div","x-item"+(t.group?" x-sel-group":t.disabled?" x-disabled":""),i);o&&(s.title=t.title||i.toText()),s.x=e,t.node=s,n.appendChild(s)}),t.map=r,s){var a=n.offsetHeight;a>s&&(n.style.height=s)}var l=t.value,c=t.index;if(l){var u=t.find(l);u&&(c=u.index)}return t.select(c),t.multiple?t:t.hide()},add:function(t,e,i){return this.items.push(s(t)?t:{text:t,value:e,title:i}),this},find:function(t){return this.map[t]},clearSelect:function(){var t=this,e=function(t){t.node&&f(t.node,"selected")};return t.multiple?(t.selectedItems.forEach(e),t.selectedItems=[],t.seletedMap={}):e({node:t._el}),t},active:function(t){var e=this,i=e.items[t];if(!i)return e;var n,o=i.node;return e.multiple?i.disabled||e.seletedMap[t]||(e.selectedItems.push(i),e.seletedMap[t]=!0,n=!0):(e.clearSelect(),n=!0,e._el=o),n&&d(o,"selected"),this},inactive:function(e){var i=this,n=i.items[e];return i.multiple&&(i.selectedItems=i.selectedItems.filter(function(t){return t.index!=e}),i.seletedMap[e]=t),f(n.node,"selected"),i},select:function(t,e){var i=this,s=i.items,r=s[t];return r?(i.text=n(r.text,""),i.value=n(r.value,""),i.elText&&(i.elText.innerHTML=i.text),i.active(t),e||t==i.index||o(i.onchange,i,r,t),i.index=t,i):i},show:function(){return this.elList.style.display="",this.select(this.index)},hide:function(){return this.elList.style.display="none",this},toggle:function(){return"none"==this.elList.style.display?this.show():this.hide()}}),Q.DropdownList=e}();