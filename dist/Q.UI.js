//devin87@qq.com
//build:2017/11/22 15:41:16
!function(t){"use strict";function e(t){var e=H("div","x-mask");Q.body.appendChild(e),A&&(e.style.height=F.getScrollHeight()+"px"),this.box=e,this.set(b(t||{},U)),this.count=E(e)?0:1}function i(){return R?(R.show(),R):R=new e}function s(t){m(t,this),this._apis=[],this.start()}function n(t,e){return new s(function(){1!=t.nodeType?t=(e=t).ele:(e=e||{}).ele=t;var i,s,n,o,a,r,h,l,u=this,d=e.range||{x:0,y:0},f=!!e.shadow,v=t.offsetWidth,p=t.offsetHeight,x=t;f&&(G||(G=H("div","x-drag-shadow"),Q.body.appendChild(G)),x=G),u.ops=e,u.doDown=function(e){n=e.clientX,o=e.clientY;var a=f?$(t).offset():$(t).position();i=a.left,s=a.top,f&&Object.forEach({left:i,top:s,width:v,height:p},function(t,e){x.style[t]=e+"px"})},u.doMove=function(t){if(z(x),h){a=t.clientX-n;var e=i+a;d&&(e<d.x?e=d.x:d.w&&e+v>d.x+d.w&&(e=d.x+d.w-v)),x.style.left=e+"px"}if(l){r=t.clientY-o;var u=s+r;d&&(u<d.y?u=d.y:d.h&&u+p>d.y+d.h&&(u=d.y+d.h-p)),x.style.top=u+"px"}},f&&(u.doUp=function(){T(x),t.style.left=t.offsetLeft+a+"px",t.style.top=t.offsetTop+r+"px"}),u.setLock=function(t,e){return h=t,l=e,u.pause(!t&&!e)},u.setRange=function(t,e,i,s){return d=c(t)?t:{x:t,y:e,w:i,h:s},u},u.setLock(!1!==e.isX,!1!==e.isY)})}function o(t){this._es=[],m(t,this)}function a(t){return t=t||{},new o(function(){var s=this,o=t.width,a=t.height,r=x(t.maxHeight,F.getHeight()-60),h=!1!==t.drag,l=h&&!1!==t.center,u=t.className;s.ops=t,s.callback=t.callback;var c='<div class="x-head"><h2 class="x-title">'+(t.title||J.titleBox)+'</h2><a class="x-close" title="'+J.titleClose+'">X</a></div><div class="x-main"><div class="x-view">'+(t.html||"")+"</div></div>";A&&(c+='<iframe class="x-ie-fix" style="position: absolute;top:0;left:0;z-index:-1;" scrolling="no" frameborder="0"></iframe>');var f=H("div","x-box"+(u?" "+u:""),c);Q.body.appendChild(f),s.box=f;var b=t.zIndex||0;K>q&&(b=Math.max(b,K)),b&&(f.style.zIndex=b);var _=C(f),w=k(_);s.setTitle=function(t){return $(".x-title",_).html(t),s},s.setWidth=function(e){return t.width=e,I(f,e),m(t.resize,s),s},s.setHeight=function(e){return t.height=e,M(w,e-_.offsetHeight-20),s},s.setMaxHeight=function(e){t.maxHeight=e;var i=t.height;return v(i)&&i>e&&(i=e),f.scrollHeight>e&&(i=e,L(f,"x-box-auto")),v(i)&&s.setHeight(i),l&&W(f),m(t.resize,s),s},s.autoHeight=function(){var e=t.maxHeight;if(!e)return s;var i=s.get(".x-head").offsetHeight,n=e-i-20,o=e-i;return w.style.height=w.scrollHeight>o?n+"px":"auto",l&&W(f),s},v(o)&&I(f,o),_.offsetWidth<10&&I(_,f.offsetWidth),r?s.setMaxHeight(r):v(a)&&s.setHeight(a),!1!==t.mask&&(s.mbox="new"==t.mask?new e:i());var y=t.close||"hide",S=s.getEventCallback(y);s.bind(".x-close","click",y),!1!==t.esc&&s.bind(d,"keyup",function(t){27==t.keyCode&&S()});var z=t.time;p(z)&&g(S,z),m(t.init,s,f,t),h&&(s.dr=n(f,{target:_,center:l,shadow:t.shadow,autoMask:!0,onCheck:function(t){var e=t.target;return e&&"x-close"!=e.className}})),$(".x-ie-fix",f).width(f.offsetWidth-2).height(f.offsetHeight-2)})}function r(t){t.width||(t.width=320);var e=t.width;if(t.icon||t.iconHtml){var i='<div class="fl x-ico">'+(t.iconHtml||'<img alt="" src="'+t.icon+'"/>')+'</div><div class="fl x-dialog"'+(v(e)?' style="width:'+(e-60)+'px;"':"")+">"+t.html+'</div><div class="clear"></div>';t.html=i;var s=t.init;t.resize=function(){var t=this.get(".x-view").offsetWidth-this.get(".x-ico").offsetWidth;$(".x-dialog",this.box).width(t)},t.init=function(t,e){e.resize.call(this),m(s,this,t,e)}}else t.html='<div class="x-dialog">'+t.html+"</div>";return t.bottom&&(t.html+=t.bottom),t.close||(t.close="remove"),a(t)}function h(t,e){var i="inline-block w-button w-"+(e||"dark");return'<div class="x-bottom"><div class="'+i+' x-submit">'+J.buttonSubmit+"</div>"+(2==t?'<div class="'+i+' x-cancel">'+J.buttonCancel+"</div>":"")+"</div>"}function l(t,e,i,s){return"object"==typeof i&&(i=s=i),s=b({},s),f(i)&&(s.callback=i),s.title||(s.title=t),s.html=e,s}var u=Q.G,d=u.document,c=Q.isObject,f=Q.isFunc,v=Q.isUNum,p=Q.isUInt,x=Q.def,m=Q.fire,g=Q.async,b=Q.extend,_=Q.makeArray,w=Q.getStyle,y=Q.setStyle,C=Q.getFirst,k=Q.getNext,I=Q.width,M=Q.height,H=Q.createEle,S=Q.removeEle,z=Q.show,T=Q.hide,E=Q.isHidden,L=Q.addClass,j=Q.setCssIfNot,W=Q.setCenter,P=Q.setInputError,N=Q.setInputDefault,D=Q.clearSelection,B=Q.query,X=Q.factory,A=Q.ie<7,F=Q.view,O=Q.event,U={color:"#999",opacity:.3};X(e).extend({opacity:function(t){return this.set({opacity:t})},set:function(t){var e=this.box;return Object.forEach(t,function(t,i){void 0!==i&&y(e,"color"!=t?t:"backgroundColor",i)}),this},show:function(){return this.removed&&(Q.body.appendChild(this.box),this.removed=!1),z(this.box),this.count++,this},hide:function(){return this.count>0&&this.count--,this.count<=0&&T(this.box),this},remove:function(){return S(this.box),this.removed=!0,this.count=0,this}});var R,Y,q=1e3,K=q;X(s).extend({start:function(){var t=this,i=t.ops,s=i.scope||u,n=s.document,o=i.ele,a=i.target||o,r=!1!==i.autoIndex,h=!!i.autoMask,l=!1!==i.autoCss,d=!1!==i.autoCursor,c=1==o.nodeType?+w(o,"z-index"):0,v=t.doDown,p=t.doMove,x=t.doUp,b=i.onCheck,_=i.onDown,y=i.onMove,Q=i.onUp,C=function(t){for(var e=[],i=t||u;i.top!=i;){var s=i.parent;e.push(s),i=s}return e}(s),k=!!o.setCapture,I=!k&&C.length>0;c>=K&&(K=c+1),l&&j(o,"position","absolute"),l&&d&&j(a,"cursor","move"),i.center&&(W(o),t._api_resize=O.add(s,"resize",function(){W(o)}));var M=function(e){t._pause||(m(p,t,e),m(y,t,e))},H=function(e){t._unbind(),k&&o.releaseCapture(),h&&Y&&(Y.remove(),Y=null),D(),m(x,t,e),m(Q,t,e)};return t._up=H,t._api=O.add(a,"mousedown",function(i){f(b)&&!1===b.call(t,i)||(r&&(+w(o,"z-index")||0)<K&&(K++,o.style.zIndex=K),t._unbind(),k?(o.setCapture(),t._bind(o,"losecapture",H)):t._bind(s,"blur",H),t._bind(n,{mousemove:M,mouseup:H}),I&&t._bind(C,"mouseup",H),h&&(Y||(Y=new e({color:null,opacity:null,zIndex:999999})),A&&Y.set({height:F.getScrollHeight()})),g(D,20),m(v,t,i),m(_,t,i))}),t},_bind:function(){this._apis.push(O.add.apply(O,arguments))},_unbind:function(){var t=this._apis;t.length>0&&(t.forEach(function(t){t.off()}),this._apis=[])},pause:function(t){return this._pause=t,this._up&&this._up(),this},stop:function(){var t=this._api;return this._unbind(),t&&(t.off(),this._api=null),this},destroy:function(){var t=this._api_resize;return this.stop(),t&&(t.off(),this._api_resize=null),this}});var G;$.fn.extend({drag:function(t){return this.each(function(e,i){n(i,t)})}}),X(o).extend({find:function(t,e){return"string"==typeof t?B(t,e||this.box):_(t)},$:function(t,e){return $(this.find(t,e))},get:function(t,e){return this.find(t,e)[0]},fire:function(){return m(this.callback,this,this.data),this},getEventCallback:function(t,e){var i=this;return"hide"==t?function(){i.data=e,i.hide()}:"remove"==t?function(){i.data=e,i.remove()}:t},bind:function(t,e,i,s){return this._es.push(O.add(this.find(t),e,this.getEventCallback(i,s))),this},on:function(t,e,i,s){return this._es.push(O.add(this.box,t,e,this.getEventCallback(i,s))),this},show:function(){return this.onShow&&this.onShow(),z(this.box),this.mbox&&this.mbox.show(),this},hide:function(){return T(this.box),this.mbox&&this.mbox.hide(),this.onHide&&this.onHide(),this.fire()},toggle:function(){return E(this.box)?this.show():this.hide()},remove:function(){if(this.box)return S(this.box),this.mbox&&this.mbox.hide(),this.dr&&this.dr.destroy(),this._es.forEach(function(t){t.off()}),this.box=this.mbox=this.dr=null,this.onRemove&&this.onRemove(),this.fire()}}),o.alias({$:"query",remove:"destroy"});var J={titleBox:"弹出框",titleAlert:"提示信息",titleConfirm:"确认信息",titlePrompt:"输入信息",titleClose:"点击关闭",titleLoading:"加载数据",buttonSubmit:"确定",buttonCancel:"取消",textLoading:"正在加载数据,请稍后…"},V={createDialogBox:r,alert:function(t,e,i){return i=l(J.titleAlert,t,e,i),i.iconHtml='<div class="ico x-alert"></div>',r(i)},confirm:function(t,e,i){(i=l(J.titleConfirm,t,e,i)).bottom||(i.bottom=h(2)),i.mask=!1!==i.mask;return r(i).bind(".x-submit","click","remove",!0).bind(".x-cancel","click","remove",!1)},prompt:function(t,e,i){i=l(J.titlePrompt,void 0,e,i),e=i.callback,i.callback=void 0;var s='<div class="x-text">'+t+'</div><div class="x-input"><input type="'+(i.pwd?"password":"text")+'" /></div>';i.html=s,i.bottom||(i.bottom=h(2));var n=r(i),o=n.get(".x-input>input");o.focus(),o.value=x(i.value,"");var a=function(){!1!==m(e,o,o.value)?n.remove():P(o)};return n.bind(o,"keyup",function(t){13==t.keyCode?a():N(this)}),n.bind(".x-submit","click",a).bind(".x-cancel","click","remove")},bottom:h,showLoading:function(t){return(t=b({},t)).title||(t.title=J.titleLoading),t.html||(t.html=J.textLoading),t.iconHtml='<div class="ico x-loading"></div>',r(t)}};b(Q,V),b(Q,{getMaskBox:i,maskSetup:function(t,e){b(U,t,!0),e&&R&&R.reset(t)},setDrag:n,setBoxLang:function(t){b(J,t,!0)},MaskBox:e,DragX:s,Box:o,WinBox:a})}(),function(t){"use strict";function e(e,i,s){i!=t&&(e.style.left=i+"px"),s!=t&&(e.style.top=s+"px")}function i(t,e){this.set(e).init(t)}var s=window.document,n=Q.fire,o=Q.extend,a=Q.makeArray,r=Q.getStyle,h=Q.offset,l=Q.hasClass,u=Q.addClass,d=Q.removeClass,c=Q.createEle,f=Q.factory,v=Q.event;f(i).extend({init:function(t){var e=this;return e.draw(t),!1!==e.autoHide&&(e._e0=v.add(s,"click",function(){e.hide()})),e},set:function(t){return o(this,t,!0),this},draw:function(e){var i=this;i._menus=[],i._items=[],i._map_menu={},i._map_item={},i.i=i.j=0,i._active=t;var s,o=i._tmp=[];for(i.drawMenu(e);s=o.shift();)i.drawMenu.apply(i,s);i._tmp=null,i.i=i.j=0;var a=i._getMenu(0).node;i.box=a;var r=[];return i._menus.forEach(function(t){t&&!t.linked&&r.push(t.node)}),i._e1&&i._e1.off(),i._e1=v.add(r,{click:function(t){var e=this._j;if(l(this,"x-disabled")||i._getSubMenu(e)&&!i.isFireAll)return!1;var s=i._getItem(e);n(s.data.click,this,t,s),n(i.onclick,this,t,s),i.hide()},mouseenter:function(t){var e=this,s=e._i,o=e._j;i._hideSub(s,o),u(e,"x-on");var a=i._getItem(o);n(a.data.mouseover,e,t,a),n(i.onmouseover,e,t,a),l(e,"x-disabled")||i._showSub(s,o,e)},mouseleave:function(t){var e=this,s=e._i,o=e._j,a=i._getSubMenu(o);l(e,"x-disabled")||!a?d(e,"x-on"):0==s&&(i._active=o);var r=i._getItem(o);n(r.data.mouseout,e,t,r),n(i.onmouseout,e,t,r)}},".x-item"),i._e2&&i._e2.off(),i._e2=v.add(r,"mousedown",v.stop),i.hide()},drawMenu:function(e,i){var n=this._menus,o=this._items,a=this._map_menu,r=this._map_item,h=e.box,l=!!h,u=this.i++;if(!h){var d=e.className;(h=c("div","x-panel"+(d?" "+d:""))).style.width=(e.width||120)+"px"}if(n[u]={node:h,linked:l,j:i,data:e},i&&(a[i]=u),l)return this;for(var f=!1!==this.subMenu,v=0,p=e.items;v<p.length;v++){var x=p[v];if(x){var m=s.createElement("div"),g=this.j++;if(m._i=u,m._j=g,o[g]={node:m,i:u,j:g,data:x},x.id!=t&&(r[x.id]=g),x.split)m.className="x-split";else{m.className="x-item"+(x.disabled?" x-disabled":""),m.x=x.x!=t?x.x:"";var b=x.group,_=f&&b&&(b.box||b.items&&b.items.length>0),w=x.ico,y=x.html||'<div class="x-icon">'+(w?/^<.+>$/.test(w)?w:'<img alt="" src="'+w+'">':"")+'</div><div class="x-text"'+(x.title?' title="'+x.title+'"':"")+">"+x.text+"</div>"+(_?'<div class="arrow"></div>':"");m.innerHTML=y,_&&this._tmp.push([b,g])}h.appendChild(m)}}return Q.body.appendChild(h),this},_getMenu:function(t){return this._menus[t]},_getSubMenu:function(e){var i=this._map_menu[e];return i!=t?this._getMenu(i):t},_getItem:function(t){return this._items[t]},getItem:function(e){var i=this._map_item[e];return i!=t?this._items[i]:t},setItemText:function(t,e){var i=this.getItem(t);if(i){i.data.text=e;var s=i.node.childNodes[1];s&&(s.innerHTML=e)}},processItems:function(t,e){var i=this;return a(t).forEach(function(t){var s=i.getItem(t);s&&e(s.node,s)}),i},_processItems:function(t,e,i){return this.processItems(t,function(t){e(t,i)})},enableItems:function(t){return this._processItems(t,d,"x-disabled")},disableItems:function(t){return this._processItems(t,u,"x-disabled")},showItems:function(t){return this._processItems(t,d,"hide")},hideItems:function(t){return this._processItems(t,u,"hide")},_setPos:function(i,s,n,o){var a=this.rangeX,r=this.rangeY,h=i.node,l=h.offsetWidth,u=h.offsetHeight,d=i.data||{},c=d.maxHeight;if(c){var f=Math.max(u,h.scrollHeight)>c;h.style.height=f?c+"px":"auto",this.fixedWidth||(h.style.width=d.width+(f?17:0)+"px"),u=h.offsetHeight}return s==t&&(s=this.x||0),n==t&&(n=this.y||0),a&&s+l>a&&(s=a-l,o&&(s=s-o.offsetWidth+3)),r&&n+u>r&&(n=r-u-1),s<0&&(s=0),n<0&&(n=0),e(h,s,n),this.x=s,this.y=n,this},_showSub:function(t,e,i){var s=this._getMenu(t),n=this._getSubMenu(e);if(n){var o=s.node,a=n.node,l=h(i),u=+r(o,"zIndex");+r(a,"zIndex")<=u&&(a.style.zIndex=u+1),this._setPos(n,l.left+i.offsetWidth-2,l.top,o)}return this.i=t,this.j=e,this},_inactive:function(t){var e=this._getItem(t);return e&&d(e.node,"x-on"),this},_hideSub:function(t,e){if(t<=this.i&&e!=this.j){var i,s=this._menus;for(i=s.length-1;i>t;i--)this._hide(s[i]);if(t<this.i)for(i=this.i;i>t;i--){var n=this._getMenu(i);this._inactive(n.j)}}return t==this.i&&e!=this.j&&this._getSubMenu(this.j)&&this._inactive(this.j),this},_hide:function(t){if(t){var i=t.node;-1e4!=i.style.left&&e(i,-1e4,-1e4)}return this},show:function(t,e){return this._setPos(this._menus[0],t,e)},hide:function(){var e=this;return e._menus.forEach(function(t){e._hide(t)}),e._active!=t&&(e._inactive(e._active),e._active=t),e},isHidden:function(){var t=this.box,e=parseFloat(t.style.left),i=parseFloat(t.style.top);return e<=-t.offsetWidth||i<=-t.offsetHeight},toggle:function(t,e){return this.isHidden()?this.show(t,e):this.hide()},destroy:function(){var t=this;return t._e0&&t._e0.off(),t._e1&&t._e1.off(),t._menus.forEach(function(t){t.node.innerHTML="",$(t.node).remove()}),Object.forEach(t,function(e){t[e]=null}),t}}),Q.ContextMenu=i}(),function(t){"use strict";function e(t){t=t||{};this.box=t.box,this.items=t.items||[],this.multiple=t.multiple,this.canInput=t.canInput,this.textProp=t.textProp||"text",this.value=t.value,this.index=t.index||0,this.ops=t}var i=window.document,s=Q.def,n=Q.fire,o=Q.isObject,a=Q.getFirst,r=Q.getLast,h=Q.width,l=Q.hasClass,u=Q.addClass,d=Q.removeClass,c=Q.createEle,f=Q.factory,v=Q.ie,p=Q.event;f(e).extend({init:function(){var t=this,e=t.ops,s=t.box,o=!t.multiple,d=t.canInput,c=e.placeholder,f=(o?'<div class="x-sel-tag">'+(d?'<input type="text" class="x-sel-text"'+(c?' placeholder="'+c+'"':"")+" />":'<div class="x-sel-text"></div>')+'<div class="x-sel-arrow"><div class="arrow arrow-down"></div></div></div>':"")+'<div class="x-panel x-sel-list'+(o?"":" x-sel-multiple")+'"></div>';u(s,"x-sel"),s.innerHTML=f;var x,m,g,b=r(s);h(b,e.width||s.offsetWidth-2),o&&(x=a(s),m=a(x),g=r(x),t.elText=m,t.elArrow=g),t.elList=b;var _;return o?(!1!==e.autoHide&&p.add(i,"mousedown",function(){t.hide()}),p.add(d?g:s,"mousedown",function(e){return t.toggle(),!1}),_={mousedown:p.stop,mouseup:function(e){var i=this.x,s=t.items[i];n(t.onclick,t,s,i),s.disabled||(t.hide(),i!=t.index&&t.select(i))},mouseenter:function(){var e=this.x;t.items[e].disabled||t.active(e)}}):(t.selectedItems=[],t.seletedMap={},_={mousedown:function(e){if(!l(this,"x-disabled")){var i=this.x,s=t.selectedItems[0],n=e.shiftKey,o=e.ctrlKey;if(!n&&o||t.clearSelect(),n){var a=s?s.index:i,r=i;a>r&&(r=a,a=i);for(var h=a;h<=r;h++)t.active(h)}else o&&t.seletedMap[i]?t.inactive(i):t.select(i)}}},v<10&&(_.selectstart=p.stop)),p.add(b,_,".x-item"),t.draw()},draw:function(){var t=this.ops,e=this.items,i=this.elList,s=t.hasTitle,n=t.maxHeight,o={};if(i.innerHTML="",e.forEach(function(t,e){t.index=e,o[t.value]=t;var n=t.text||"",a=c("div","x-item"+(t.group?" x-sel-group":t.disabled?" x-disabled":""),n);s&&(a.title=t.title||n.toText()),a.x=e,t.node=a,i.appendChild(a)}),this.map=o,n){i.offsetHeight>n&&(i.style.height=n)}var a=this.value,r=this.index;if(a){var h=this.find(a);h&&(r=h.index)}return this.select(r),this.multiple?this:this.hide()},add:function(t,e,i){return this.items.push(o(t)?t:{text:t,value:e,title:i}),this},find:function(t){return this.map[t]},clearSelect:function(){var t=function(t){t.node&&d(t.node,"selected")};return this.multiple?(this.selectedItems.forEach(t),this.selectedItems=[],this.seletedMap={}):t({node:this._el}),this},active:function(t){var e=this.items[t];if(!e)return this;var i,s=e.node;return this.multiple?e.disabled||this.seletedMap[t]||(this.selectedItems.push(e),this.seletedMap[t]=!0,i=!0):(this.clearSelect(),i=!0,this._el=s),i&&u(s,"selected"),this},inactive:function(t){var e=this.items[t];return this.multiple&&(this.selectedItems=this.selectedItems.filter(function(e){return e.index!=t}),this.seletedMap[t]=void 0),d(e.node,"selected"),this},select:function(t,e){var i=this.items[t];return i?(this.text=s(i.text,""),this.value=s(i.value,""),this.elText&&(this.elText[this.canInput?"value":"innerHTML"]=this[this.textProp]),this.active(t),e||t==this.index||n(this.onchange,this,i,t),this.index=t,this):this},show:function(){return this.elList.style.display="",this.select(this.index)},hide:function(){return this.elList.style.display="none",this},toggle:function(){return"none"==this.elList.style.display?this.show():this.hide()},getText:function(){return this.canInput?this.elText.value:this.text}}),Q.DropdownList=e}(),function(t){"use strict";function e(e){var i=this;if(i.ops=e,i.size=e.size||9,i.cache={},e.href==t){var s=e.boxNav;s&&$(s).on("click","li",function(){i.go($(this).attr("x")),i.onclick&&i.onclick.call(i,i.page)})}else e.cache=e.preload=!1;i.set(e.totalCount,e.pageSize||10).setData(e.data).go(e.page)}(0,Q.factory)(e).extend({set:function(e,i){return e!=t&&(this.totalCount=e),i!=t&&(this.pageSize=i),this.totalCount!=t&&(this.totalPage=Math.ceil(this.totalCount/this.pageSize)),this},setData:function(t){return t&&(this.data=t,this.set(t.length)),this},_load:function(e,i){var s=this,n=s.ops,o=s.onload;s.page=e;var a=function(t){return o&&o.call(s,t),i&&i.call(s,t),s};if(!n.load){var r=s.pageSize,h=(e-1)*r;return a(s.data.slice(h,h+r))}var l=n.cache?s.cache[e]:t;return l?a(l):(n.load(e,function(t){l=t.data||[],n.cache&&(s.cache[e]=l),s.set(t.totalCount,t.pageSize),a(l)}),s)},load:function(t){return this._load(t,this.draw)},reload:function(t){return this.load(t||this.page)},go:function(e,i){return isNaN(e)?this:(e=+e,this.totalPage!=t&&e>this.totalPage&&(e=this.totalPage),e<1&&(e=1),e!=this.page||i?(this.load(e),this.ops.load&&this.ops.preload&&this._load(e+1),this.onchange&&this.onchange.call(this,e),this):this)},drawNav:function(){var e=this.ops,i=e.boxNav;if(!i)return this;var s=this.totalCount,n=this.pageSize,o=this.totalPage,a=this.page,r=e.href,h=e.text||{},l=function(t,e,i){var s=[1];if(1==e)return s;var n,o=2;if(e<=t)n=e;else{var a=(t-5)/2;i<=a+3?n=t-2:i>e-a-3?(o=e-t+3,n=e-1):n=(o=i-~~a)+t-5}o>2&&s.push(0);for(var r=o;r<=n;r++)s.push(r);return e>t&&(n<e-1&&s.push(0),s.push(e)),s}(this.size,o,a);r!=t&&(r+=-1!=r.indexOf("?")?"&":"?");var u=function(t,e,i){return i||(i=t==a?"on":t?"":"skip"),"<li"+(i?' class="'+i+'"':"")+' x="'+t+'">'+(r?"<a"+(t?' href="'+r+"page="+t+'"':"")+">"+e+"</a>":e)+"</li>"},d=e.drawSize||function(t,e,i){return e+"/"+i},c='<div class="inline-block pager-bar'+(r?" pager-link":"")+'"><ul>'+u(Math.max(a-1,1),h.prev||"&lt;上一页","prev")+l.map(function(t){return u(t,t||"…")}).join("")+u(Math.min(a+1,o),h.next||"下一页&gt;","next")+"</ul></div>"+(!1!==e.showSize?'<div class="inline-block pager-count">'+d(this,'每页<span class="page-size">'+n+"</span>条",'共<span class="total-count">'+s+"</span>条数据")+"</div>":"");$(i).html(c)},draw:function(t){return this.drawNav(),this.ops.draw.call(this,t),this}}),Q.DataPager=e}(),function(){"use strict";function t(t){var e=this,o=(t=t||{}).context,a=t.tabs||n(".tab-title li.tab,.tabTitle>li",o),r=t.conts||n(".tab-cont>.turn-box,.tabCont>.turn-box",o);e.tabs=a,e.conts=r,e.map_loaded={},e.map_index={},a.forEach(function(n,o){"1"==n.getAttribute("x-def")&&(t.index=o);var a=i(n);if(a){var r=a.href.split("#")[1]||"",h=s(r).nav;h&&(e.map_index[h]=o)}}),a.forEach(function(t,i){$(t).hasClass("skip")||$(t).click(function(){e.showTab(i)})}),$(r).hide(),setTimeout(function(){var i=s().nav.slice(1)||t.hash,n=e.map_index[i];void 0==n&&(n=t.index||0),e.showTab(n)},20)}var e=Q.async,i=Q.getFirst,s=Q.parseHash,n=$.find;Q.factory(t).extend({getTab:function(t){return this.tabs[t]},getCont:function(t){return this.conts[t]},hasLoaded:function(t){return!!this.map_loaded[t]},showTab:function(t){var i=this.index;if(t!==i){if(void 0!==i){var s=this.getTab(i),n=this.getCont(i);$(s).removeClass("on"),$(n).hide()}var o=this.getTab(t),a=this.getCont(t),r=this.map_loaded;$(o).addClass("on"),$(a).show(),this.index=t;var h={index:t,tab:o,cont:a,loaded:r[t]};e(this.onchange,100,h),e(window.onTabChange,200,h),r[t]||(r[t]=!0)}}}),Q.Tabs=t,Q.setTabs=function(e){return new t(e)}}(),function(t){"use strict";function e(t){var e=(t=t||{}).box,n=s("div","range-slider-bar"),a=s("div","range-progress"),r=s("div","range-slider");n.appendChild(a),n.appendChild(r),e.appendChild(n);var h=this;h._elBar=n,h._elProgress=a,h._elSlider=r,h.min=+t.min||0,h.max=+t.max||100,h.step=+t.step||1,h.value=+t.value||0;var l=h.step+"",u=l.lastIndexOf("."),d=-1!=u?l.length-u-1:0,c=Math.pow(10,d);h.onchange=t.onchange,h.val(h.value),h._drag=new o(function(){var t,e,s,o;this.ops={ele:r,autoCursor:!1},this.doDown=function(i){t=n.offsetWidth,e=a.offsetWidth,s=i.clientX,o=t-r.offsetWidth},this.doMove=function(n){var l=n.clientX-s,u=e+l;u<0?u=0:u>t&&(u=t);var d=~~(u*(h.max-h.min)/(t*h.step)),f=(h.min*c+h.step*c*d)/c;a.style.width=100*u/t+"%",r.style.left=100*Math.min(u,o)/t+"%",f!=h.value&&(h.value=f,i(h.onchange,h,h.value))}})}var i=Q.fire,s=Q.createEle,n=Q.factory,o=Q.DragX;n(e).extend({val:function(t){if(void 0==t)return this.value;t<this.min?t=this.min:t>this.max&&(t=this.max);var e=this._elProgress,i=this._elSlider,s=this._elBar.offsetWidth;return this.value=t,e.style.width=100*t/(this.max-this.min)+"%",i.style.left=100*Math.min(e.offsetWidth,s-i.offsetWidth)/s+"%",this}}),Q.RangeSlider=e}();