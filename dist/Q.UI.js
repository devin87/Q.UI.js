//devin87@qq.com
//build:2015/08/20 17:01:57
!function(t){"use strict";function e(t){var e=j("div","x-mask");Q.body.appendChild(e),U&&(e.style.height=Y.getScrollHeight()+"px"),this.box=e,this.set(g(t||{},P))}function i(){return R?(R.show(),R):R=new e}function n(t,e){g(P,t,!0),e&&R&&R.reset(t)}function s(t){for(var e=[],i=t||c;i.top!=i;){var n=i.parent;e.push(n),i=n}return e}function o(t){var e=this;b(t,e),e._apis=[],e.start()}function a(t,e){return new o(function(){1!=t.nodeType?(e=t,t=e.ele):(e=e||{},e.ele=t);var i,n,s,o,a=this,r=e.range||{x:0,y:0},d=e.shadow!==!1,l=t.offsetWidth,u=t.offsetHeight,c=t;d&&(J||(J=j("div","x-drag-shadow"),Q.body.appendChild(J)),c=J),a.ops=e,a.doDown=function(e){i=e.clientX-t.offsetLeft,n=e.clientY-t.offsetTop,d&&Object.forEach(k(t),function(t,e){y(c,t,e)})},a.doMove=function(t){if(E(c),s){var e=t.clientX-i;r&&(e<r.x?e=r.x:r.w&&e+l>r.x+r.w&&(e=r.x+r.w-l)),c.style.left=e+"px"}if(o){var a=t.clientY-n;r&&(a<r.y?a=r.y:r.h&&a+u>r.y+r.h&&(a=r.y+r.h-u)),c.style.top=a+"px"}},d&&(a.doUp=function(){T(c)||(L(c),t.style.left=c.style.left,t.style.top=c.style.top)}),a.setLock=function(t,e){return s=t,o=e,a.pause(!t&&!e)},a.setRange=function(t,e,i,n){return r=f(t)?t:{x:t,y:e,w:i,h:n},a},a.setLock(e.isX!==!1,e.isY!==!1)})}function r(t){b(t,this)}function d(t){return t=t||{},new r(function(){var e=this,n=t.width,s=t.height,o=t.maxHeight,r=t.className;e.callback=t.callback;var d='<div class="x-head"><h2 class="x-title">'+(t.title||"弹出框")+'</h2><a class="x-close" title="点击关闭">X</a></div><div class="x-main"><div class="x-view">'+(t.html||"")+"</div></div>";U&&(d+='<iframe class="x-ie-fix" style="position: absolute;top:0;left:0;z-index:-1;" scrolling="no" frameborder="0"></iframe>');var l=j("div","x-box"+(r?" "+r:""),d);Q.body.appendChild(l);var u=t.zIndex||0;G>q&&(u=Math.max(u,G)),u&&(l.style.zIndex=u);var c=I(l),f=M(c);m(n)&&C(l,n),o&&(m(s)&&s>o&&(s=o),l.offsetHeight>o&&(s=o,z(l,"x-box-auto"))),m(s)&&s>50&&H(f,s-c.offsetHeight-20),c.offsetWidth<10&&C(c,l.offsetWidth),t.mask&&(e.mbox=i());var v=t.close||"hide",p=e.getEventCallback(v);e.on(".x-close","click",v),t.esc!==!1&&A.add(h,"keyup",function(t){27==t.keyCode&&p()});var g=t.time;x(g)&&_(p,g),e.box=l,b(t.init,e,l,t),t.drag!==!1&&a(l,{target:c,center:t.center!==!1,onCheck:function(t){var e=t.target;return e&&"x-close"!=e.className}}),$(".x-ie-fix",l).width(l.offsetWidth-2).height(l.offsetHeight-2),e.setTitle=function(t){$(".x-title",c).html(t)}})}function l(t){t.width||(t.width=320);var e=t.width;if(t.icon||t.iconHtml){var i='<div class="fl x-ico">'+(t.iconHtml||'<img alt="" src="'+t.icon+'"/>')+'</div><div class="fl x-dialog"'+(m(e)?' style="width:'+(e-60)+'px;"':"")+">"+t.html+'</div><div class="clear"></div>';t.html=i;var n=t.init;t.init=function(t,e){var i=this,s=i.get(".x-view").offsetWidth-i.get(".x-ico").offsetWidth;$(".x-dialog",t).width(s),b(n,i,t,e)}}else t.html='<div class="x-dialog">'+t.html+"</div>";return t.bottom&&(t.html+=t.bottom),t.close||(t.close="remove"),d(t)}function u(t,e){var i="inline-block w-button w-"+(e||"dark"),n='<div class="x-bottom"><div class="'+i+' x-submit">确定</div>'+(2==t?'<div class="'+i+' x-cancel">取消</div>':"")+"</div>";return n}var c=Q.G,h=c.document,f=Q.isObject,v=Q.isFunc,m=Q.isUNum,x=Q.isUInt,p=Q.def,b=Q.fire,_=Q.async,g=Q.extend,w=Q.getStyle,y=Q.setStyle,k=Q.offset,I=Q.getFirst,M=Q.getNext,C=Q.width,H=Q.height,j=Q.createEle,S=Q.removeEle,E=Q.show,L=Q.hide,T=Q.isHidden,W=Q.toggle,z=Q.addClass,N=Q.setCssIfNot,D=Q.setCenter,F=Q.query,X=Q.clearSelection,B=Q.factory,O=Q.ie,U=7>O,Y=Q.view,A=Q.event,P={color:"#999",opacity:.3};B(e).extend({opacity:function(t){return this.set({opacity:t})},set:function(e){var i=this.box;return Object.forEach(e,function(e,n){n!==t&&y(i,"color"!=e?e:"backgroundColor",n)}),this},show:function(){return this.removed&&(Q.body.appendChild(this.box),this.removed=!1),E(this.box),this},hide:function(){return L(this.box),this},remove:function(){return S(this.box),this.removed=!0,this}});var R,K,q=1e3,G=q;B(o).extend({start:function(){var t=this,i=t.ops,n=i.scope||c,o=n.document,a=i.ele,r=i.target||a,d=i.autoIndex!==!1,l=i.autoMask!==!1,u=1==a.nodeType?+w(a,"z-index"):0,h=t.doDown,f=t.doMove,m=t.doUp,x=i.onCheck,p=i.onDown,g=i.onMove,y=i.onUp,Q=s(n),k=!!a.setCapture,I=!k&&Q.length>0;u>=G&&(G=u+1),N(a,"position","absolute"),N(r,"cursor","move"),i.center&&(D(a),A.add(n,"resize",function(){D(a)}));var M=function(i){if(!v(x)||x.call(t,i)!==!1){if(d){var s=+w(a,"z-index")||0;G>s&&(G++,a.style.zIndex=G)}t._unbind(),k?(a.setCapture(),t._bind(a,"losecapture",H)):t._bind(n,"blur",H),t._bind(o,{mousemove:C,mouseup:H}),I&&t._bind(Q,"mouseup",H),l&&(K||(K=new e({color:null,opacity:null,zIndex:999999})),U&&K.set({height:Y.getScrollHeight()})),_(X,20),b(h,t,i),b(p,t,i)}},C=function(e){t._pause||(b(f,t,e),b(g,t,e))},H=function(e){t._unbind(),k&&a.releaseCapture(),l&&K&&(K.remove(),K=null),X(),b(m,t,e),b(y,t,e)};t._up=H,t._api=A.add(r,"mousedown",M)},_bind:function(){this._apis.push(A.add.apply(A,arguments))},_unbind:function(){var t=this._apis;t.length>0&&(t.forEach(function(t){t.off()}),this._apis=[])},pause:function(t){this._pause=t,this._up&&this._up()},stop:function(){var t=this,e=t._api;t._unbind(),e&&(e.off(),t._api=null)}});var J;$.fn.extend({drag:function(t){return this.each(function(e,i){a(i,t)})}}),B(r).extend({find:function(t,e){return F(t,e||this.box)},get:function(t,e){return this.find(t,e)[0]},fire:function(){return b(this.callback,this,this.data),this},getEventCallback:function(t,e){var i=this;return"hide"==t?function(){i.data=e,i.hide()}:"remove"==t?function(){i.data=e,i.remove()}:t},on:function(t,e,i,n){var s=this,o=s.find(t);return f(e)?(n=i,Object.forEach(e,function(t,e){A.add(o,t,s.getEventCallback(e,n))})):A.add(o,e,s.getEventCallback(i,n)),s},show:function(){var t=this;return t.onShow&&t.onShow(),E(t.box),t.mbox&&t.mbox.show(),t},hide:function(){var t=this;return L(t.box),t.mbox&&t.mbox.hide(),t.onHide&&t.onHide(),t.fire()},toggle:function(){return W(this.box),this},remove:function(){var t=this;if(t.box)return S(t.box),t.mbox&&t.mbox.remove(),t.box=t.mbox=null,t.onRemove&&t.onRemove(),t.fire()}});var V={createDialogBox:l,alert:function(t,e,i){var i=i||{};return v(e)?i.callback=e:"object"==typeof e&&(i=e),i.title||(i.title="提示信息"),i.iconHtml='<div class="ico x-alert"></div>',i.html=t,l(i)},confirm:function(t,e,i){var i=i||{};v(e)?i.callback=e:"object"==typeof e&&(i=e),i.title||(i.title="确认信息"),i.html=t,i.bottom||(i.bottom=u(2)),i.mask=i.mask!==!1;var n=l(i);return n.on(".x-submit","click","remove",!0).on(".x-cancel","click","remove",!1),n},prompt:function(t,e,i){var i=i||{};"object"==typeof e&&(i=e),i.title||(i.title="输入信息"),i.html='<div class="x-text">'+t+'</div><div class="x-input"><input type="'+(i.pwd?"password":"text")+'" /></div>',i.width||(i.width=320),i.bottom||(i.bottom=u(2));var n=l(i),s=n.get(".x-input>input");s.focus(),s.value=p(i.value,"");var o=function(){var t=b(e,s,s.value);t!==!1?n.remove():setInputError(s)};return n.on(s,"keyup",function(t){13==t.keyCode?o():setInputDefault(this)}),n.on(".x-submit","click",o).on(".x-cancel","click","remove"),n},bottom:u,showLoading:function(t){return t=t||{html:"正在加载数据,请稍后…"},t.iconHtml='<div class="ico x-loading"></div>',t.title||(t.title="加载数据"),l(t)}};g(Q,V),g(Q,{getMaskBox:i,maskSetup:n,setDrag:a,MaskBox:e,DragX:o,Box:r,WinBox:d})}(),function(t){"use strict";function e(e,i,n){i!=t&&(e.style.left=i+"px"),n!=t&&(e.style.top=n+"px")}function i(t,e){o(this,e),this.init(t)}var n=window.document,s=Q.fire,o=Q.extend,a=Q.makeArray,r=Q.getStyle,d=Q.offset,l=Q.hasClass,u=Q.addClass,c=Q.removeClass,h=Q.createEle,f=Q.factory,v=Q.event,m=-1e4;f(i).extend({init:function(t){var e=this;return e.draw(t),e.autoHide!==!1&&(e._e0=v.add(n,"mousedown",function(){e.hide()})),e},draw:function(e){var i=this;i._menus=[],i._items=[],i._map_menu={},i._map_item={},i.i=i.j=0,i._active=t;var n,o=i._tmp=[];for(i.drawMenu(e);n=o.shift();)i.drawMenu.apply(i,n);i._tmp=null,i.i=i.j=0;var a=i._getMenu(0).node;i.box=a;var r=[];return i._menus.forEach(function(t){t&&!t.linked&&r.push(t.node)}),i._e1&&i._e1.off(),i._e1=v.add(r,{click:function(t){var e=this,n=e._j;if(l(e,"x-disabled")||i._getSubMenu(n)&&!i.isFireAll)return void v.stop(t);var o=i._getItem(n);s(o.data.click,e,t,o),s(i.onclick,e,t,o),i.hide()},mouseenter:function(t){var e=this,n=e._i,o=e._j;i._hideSub(n,o),u(e,"x-on");var a=i._getItem(o);s(a.data.mouseover,e,t,a),s(i.onmouseover,e,t,a),l(e,"x-disabled")||i._showSub(n,o,e)},mouseleave:function(t){var e=this,n=e._i,o=e._j,a=i._getSubMenu(o);l(e,"x-disabled")||!a?c(e,"x-on"):0==n&&(i._active=o);var r=i._getItem(o);s(r.data.mouseout,e,t,r),s(i.onmouseout,e,t,r)}},".x-item"),i._e2&&i._e2.off(),i._e2=v.add(r,"mousedown",v.stop),i.hide()},drawMenu:function(e,i){var s=this,o=s._menus,a=s._items,r=s._map_menu,d=s._map_item,l=e.box,u=!!l,c=s.i++;if(!l){var f=e.className,l=h("div","x-panel"+(f?" "+f:""));l.style.width=(e.width||120)+"px"}if(o[c]={node:l,linked:u,j:i,data:e},i&&(r[i]=c),u)return s;for(var v=s.subMenu!==!1,m=0,x=e.items;m<x.length;m++){var p=x[m];if(p){var b=n.createElement("div"),_=s.j++;if(b._i=c,b._j=_,a[_]={node:b,i:c,j:_,data:p},p.id&&(d[p.id]=_),p.split)b.className="x-split";else{b.className="x-item"+(p.disabled?" x-disabled":""),b.x=p.x!=t?p.x:"";var g=p.group,w=v&&g&&(g.box||g.items&&g.items.length>0),y=p.ico,k=p.html||'<div class="x-icon">'+(y?/^<.+>$/.test(y)?y:'<img alt="" src="'+y+'">':"")+'</div><div class="x-text"'+(p.title?' title="'+p.title+'"':"")+">"+p.text+"</div>"+(w?'<div class="arrow"></div>':"");b.innerHTML=k,w&&s._tmp.push([g,_])}l.appendChild(b)}}return Q.body.appendChild(l),s},_getMenu:function(t){return this._menus[t]},_getSubMenu:function(e){var i=this._map_menu[e];return i!=t?this._getMenu(i):t},_getItem:function(t){return this._items[t]},getItem:function(e){var i=this._map_item[e];return i!=t?this._items[i]:t},setItemText:function(t,e){var i=this.getItem(t);if(i){i.data.text=e;var n=i.node.childNodes[1];n&&(n.innerHTML=e)}},processItems:function(t,e){var i=this;return a(t).forEach(function(t){var n=i.getItem(t);n&&e(n.node,n)}),i},_processItems:function(t,e,i){return this.processItems(t,function(t){e(t,i)})},enableItems:function(t){return this._processItems(t,c,"x-disabled")},disableItems:function(t){return this._processItems(t,u,"x-disabled")},showItems:function(t){return this._processItems(t,c,"hide")},hideItems:function(t){return this._processItems(t,u,"hide")},_setPos:function(i,n,s,o){var a=this,r=a.rangeX,d=a.rangeY,l=i.node,u=l.offsetWidth,c=l.offsetHeight,h=i.data||{},f=h.maxHeight;if(f){var v=Math.max(c,l.scrollHeight),m=v>f;l.style.height=m?f+"px":"auto",a.fixedWidth||(l.style.width=h.width+(m?17:0)+"px"),c=l.offsetHeight}return n==t&&(n=a.x||0),s==t&&(s=a.y||0),r&&n+u>r&&(n=r-u,o&&(n=n-o.offsetWidth+3)),d&&s+c>d&&(s=d-c-1),0>n&&(n=0),0>s&&(s=0),e(l,n,s),a.x=n,a.y=s,a},_showSub:function(t,e,i){var n=this,s=n._getMenu(t),o=n._getSubMenu(e);if(o){var a=s.node,l=o.node,u=d(i),c=+r(a,"zIndex"),h=+r(l,"zIndex");c>=h&&(l.style.zIndex=c+1),n._setPos(o,u.left+u.width-2,u.top,a)}return n.i=t,n.j=e,n},_inactive:function(t){var e=this._getItem(t);return e&&c(e.node,"x-on"),this},_hideSub:function(t,e){var i=this;if(t<=i.i&&e!=i.j){var n,s=i._menus;for(n=s.length-1;n>t;n--)i._hide(s[n]);if(t<i.i)for(n=i.i;n>t;n--){var o=i._getMenu(n);i._inactive(o.j)}}return t==i.i&&e!=i.j&&i._getSubMenu(i.j)&&i._inactive(i.j),i},_hide:function(t){if(t){var i=t.node;i.style.left!=m&&e(i,m,m)}return this},show:function(t,e){return this.hide()._setPos(this._menus[0],t,e)},hide:function(){var e=this;return e._menus.forEach(function(t){e._hide(t)}),e._active!=t&&(e._inactive(e._active),e._active=t),e},isHidden:function(){var t=this,e=t.box,i=parseFloat(e.style.left),n=parseFloat(e.style.top);return i<=-e.offsetWidth||n<=-e.offsetHeight},toggle:function(){return this.isHidden()?this.show():this.hide()}}),Q.ContextMenu=i}(),function(t){"use strict";function e(t){t=t||{};var e=this;e.box=t.box,e.items=t.items||[],e.multiple=t.multiple,e.value=t.value,e.index=t.index||0,e.ops=t}var i=window.document,n=Q.def,s=Q.fire,o=Q.isObject,a=Q.getFirst,r=Q.getLast,d=Q.width,l=d,u=Q.hasClass,c=Q.addClass,h=Q.removeClass,f=Q.createEle,v=Q.factory,m=Q.ie,x=Q.event;v(e).extend({init:function(){var t=this,e=t.ops,n=t.box,o=!t.multiple,d=(o?'<div class="x-sel-tag"><div class="x-sel-text"></div><div class="x-sel-arrow"><div class="arrow arrow-down"></div></div></div>':"")+'<div class="x-panel x-sel-list"></div>';c(n,"x-sel"),n.innerHTML=d;var h,f,v,p=r(n);l(p,e.width||n.offsetWidth-2),o&&(h=a(n),f=a(h),v=r(h),t.elText=f,t.elArrow=v),t.elList=p;var b;return o?(x.add(i,"mousedown",function(){t.hide()}),x.add(n,"mousedown",function(e){t.toggle(),x.stop(e)}),b={mousedown:x.stop,mouseup:function(e){var i=this.x,n=t.items[i];t.hide(),s(t.onclick,t,n,i),i!=t.index&&t.select(i)},mouseenter:function(){var e=this;u(e,"x-disabled")||t.active(e.x)}}):(t.selectedItems=[],t.seletedMap={},b={mousedown:function(e){var i=this;if(!u(i,"x-disabled")){var n=this.x,s=t.selectedItems[0],o=e.shiftKey,a=e.ctrlKey;if((o||!a)&&t.clearSelect(),o){var r=s?s.index:n,d=n;r>d&&(d=r,r=n);for(var l=r;d>=l;l++)t.active(l)}else a&&t.seletedMap[n]?t.inactive(n):t.select(n)}}},10>m&&(b.selectstart=x.stop)),x.add(p,b,".x-item"),t.draw()},draw:function(){var t=this,e=t.ops,i=t.items,n=t.elList,s=e.hasTitle,o=e.maxHeight,a={};if(n.innerHTML="",i.forEach(function(t,e){t.index=e,a[t.value]=t;var i=t.text||"",o=f("div","x-item"+(t.group?" x-sel-group":t.disabled?" x-disabled":""),i);s&&(o.title=t.title||i.toText()),o.x=e,t.node=o,n.appendChild(o)}),t.map=a,o){var r=n.offsetHeight;r>o&&(n.style.height=o)}var d=t.value,l=t.index;if(d){var u=t.find(d);u&&(l=u.index)}return t.select(l),t.multiple?t:t.hide()},add:function(t,e,i){return this.items.push(o(t)?t:{text:t,value:e,title:i}),this},find:function(t){return this.map[t]},clearSelect:function(){var t=this,e=function(t){t.node&&h(t.node,"selected")};return t.multiple?(t.selectedItems.forEach(e),t.selectedItems=[],t.seletedMap={}):e({node:t._el}),t},active:function(t){var e=this,i=e.items[t];if(!i)return e;var n,s=i.node;return e.multiple?i.disabled||e.seletedMap[t]||(e.selectedItems.push(i),e.seletedMap[t]=!0,n=!0):(e.clearSelect(),n=!0,e._el=s),n&&c(s,"selected"),this},inactive:function(e){var i=this,n=i.items[e];return i.multiple&&(i.selectedItems=i.selectedItems.filter(function(t){return t.index!=e}),i.seletedMap[e]=t),h(n.node,"selected"),i},select:function(t,e){var i=this,o=i.items,a=o[t];return a?(i.text=n(a.text,""),i.value=n(a.value,""),i.elText&&(i.elText.innerHTML=i.text),i.active(t),e||t==i.index||s(i.onchange,i,a,t),i.index=t,i):i},show:function(){return this.elList.style.display="",this.select(this.index)},hide:function(){return this.elList.style.display="none",this},toggle:function(){return"none"==this.elList.style.display?this.show():this.hide()}}),Q.DropdownList=e}();