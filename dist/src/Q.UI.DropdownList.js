//devin87@qq.com
//build:2020/03/26 15:30:47
!function(){"use strict";var x=window.document,n=Q.def,h=Q.fire,s=Q.isObject,v=Q.getFirst,p=Q.getLast,f=Q.width,m=Q.hasClass,w=Q.addClass,l=Q.removeClass,c=Q.createEle,e=Q.factory,g=Q.ie,I=Q.event;function t(e){e=e||{};var t=this;t.box=e.box,t.items=e.items||[],t.multiple=e.multiple,t.canInput=e.canInput,t.textProp=e.textProp||"text",t.value=e.value,t.index=e.index||0,t.ops=e}e(t).extend({init:function(){var r=this,e=r.ops,t=r.box,i=!r.multiple,s=r.canInput,n=e.placeholder,l=(i?'<div class="x-sel-tag">'+(s?'<input type="text" class="x-sel-text"'+(n?' placeholder="'+n+'"':"")+" />":'<div class="x-sel-text"></div>')+'<div class="x-sel-arrow"><div class="arrow arrow-down"></div></div></div>':"")+'<div class="x-panel x-sel-list'+(i?"":" x-sel-multiple")+'"></div>';w(t,"x-sel"),t.innerHTML=l;var d,a,o,c,u=p(t);return f(u,e.width||t.offsetWidth-2),i&&(d=v(t),a=v(d),o=p(d),r.elText=a,r.elArrow=o),r.elList=u,i?(!1!==e.autoHide&&(I.add(x,"mousedown",function(){r.hide()}),I.add(t,"mousedown",function(e){I.stop(e,!1,!0)})),I.add(s?o:d,"mousedown",function(e){return r.toggle(),!1}),c={mouseup:function(e){var t=this.x,i=r.items[t];h(r.onclick,r,i,t),i.disabled||(r.hide(),t!=r.index&&r.select(t))},mouseenter:function(){var e=this.x;r.items[e].disabled||r.active(e)}}):(r.selectedItems=[],r.seletedMap={},c={mousedown:function(e){if(!m(this,"x-disabled")){var t=this.x,i=r.selectedItems[0],s=e.shiftKey,n=e.ctrlKey;if(!s&&n||r.clearSelect(),s){var l=i?i.index:t,d=t;d<l&&(d=l,l=t);for(var a=l;a<=d;a++)r.active(a)}else n&&r.seletedMap[t]?r.inactive(t):r.select(t)}}},g<10&&(c.selectstart=I.stop)),I.add(u,c,".x-item"),r.draw(),h(r.oninit,r),r},draw:function(){var e=this,t=e.ops,i=e.items,n=e.elList,l=t.hasTitle,s=t.maxHeight,d={};n.innerHTML="",i.forEach(function(e,t){e.index=t;var i=(d[e.value]=e).text||"",s=c("div","x-item"+(e.group?" x-sel-group":e.disabled?" x-disabled":""),i);l&&(s.title=e.title||i.toText()),s.x=t,e.node=s,n.appendChild(s)}),e.map=d,!s||s<n.offsetHeight&&(n.style.height=s+"px");h(e.ondraw,e);var a=e.value,r=e.index;if(a){var o=e.find(a);o&&(r=o.index)}return e.select(r),e.multiple?e:e.hide()},add:function(e,t,i){return this.items.push(s(e)?e:{text:e,value:t,title:i}),this},find:function(e){return this.map[e]},clearSelect:function(){function e(e){e.node&&l(e.node,"selected")}var t=this;return t.multiple?(t.selectedItems.forEach(e),t.selectedItems=[],t.seletedMap={}):e({node:t._el}),t},active:function(e){var t=this,i=t.items[e];if(!i)return t;var s,n=i.node;return t.multiple?i.disabled||t.seletedMap[e]||(t.selectedItems.push(i),s=t.seletedMap[e]=!0):(t.clearSelect(),s=!0,t._el=n),s&&w(n,"selected"),this},inactive:function(t){var e=this,i=e.items[t];return e.multiple&&(e.selectedItems=e.selectedItems.filter(function(e){return e.index!=t}),e.seletedMap[t]=void 0),l(i.node,"selected"),e},select:function(e,t){var i=this,s=i.items[e];return s&&(i.text=n(s.text,""),i.value=n(s.value,""),i.elText&&(i.elText[i.canInput?"value":"innerHTML"]=i[i.textProp]),i.active(e),t||e==i.index||h(i.onchange,i,s,e),i.index=e),i},show:function(){return this.elList.style.display="",this.select(this.index)},hide:function(){return this.elList.style.display="none",this},toggle:function(){return"none"==this.elList.style.display?this.show():this.hide()},getText:function(){return this.canInput?this.elText.value:this.text}}),Q.DropdownList=t}();