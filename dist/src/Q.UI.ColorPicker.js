//devin87@qq.com
//build:2015/12/02 13:19:46
!function(t){"use strict";function r(r,e,o){e!=t&&(r.style.left=e+"px"),o!=t&&(r.style.top=o+"px")}function e(t){return"#"+("00000"+t.toString(16)).slice(-6)}function o(t,r,o){return e(65536*t+256*r+o)}function i(t){return"number"==typeof t?e(t):(t=t.replace(/\s+/g,""),x.test(t)?o(+RegExp.$1,+RegExp.$2,+RegExp.$3):t)}function n(t){if("number"==typeof t&&(t=e(t)),!w.test(t))return t;if(t=RegExp.$1,3==t.length){var r=t.charAt(0),o=t.charAt(1),i=t.charAt(2);t=r+r+o+o+i+i}return"rgb("+parseInt(t.substr(0,2),16)+","+parseInt(t.substr(2,2),16)+","+parseInt(t.substr(4,2),16)+")"}function l(t){var r=this;r.row=12,r.col=21,r.set(t).init()}var s=window.document,f=Q.isFunc,a=Q.extend,c=Q.getFirst,u=Q.getNext,d=Q.getLast,v=Q.createEle,h=Q.factory,p=Q.event,b=-1e4,x=/^rgb\((\d+),(\d+),(\d+)\)$/i,w=/^#?([0-9A-F]{3}|[0-9A-F]{6})$/i,C=["#000000","#333333","#666666","#999999","#cccccc","#ffffff","#ff0000","#00ff00","#0000ff","#ffff00","#00ffff","#ff00ff"];h(l).extend({init:function(){var t=this,r='<div class="xp-title"><div class="xp-preview"></div><div class="xp-val"></div><div class="xp-type"><select><option value="Cube" selected="selected">立方色</option><option value="Series">连续色调</option><option value="Gray">灰度等级</option></select></div></div><div class="xp-table"><table>'+("<tr>"+"<td></td>".repeat(t.col)+"</tr>").repeat(t.row)+"</table></div>",e=v("div","x-picker",r),o=c(e),i=c(o),n=u(i),l=d(o),f=d(e),a=c(f);return Q.body.appendChild(e),t.box=e,t.table=a,t.boxPreview=i,t.boxValue=n,p.add(c(l),"change",function(){t["draw"+this.value+"Color"]()}),p.add(a,{mouseover:function(r){t.setPreview(this.style.backgroundColor)},click:function(r){var e=this.style.backgroundColor;t.fire(e).hide()}},"td"),p.add(e,"click",p.stop),p.add(s,"click",function(r){t.hide()}),t.drawCubeColor().hide()},set:function(t){return a(this,t,!0),this.setPreview(t.color)},fire:function(t){var r=this;return f(r.callback)&&r.callback.call(r,r.isHex?i(t):t),r},setPreview:function(t){var r=this;return t&&(r.boxPreview.style.backgroundColor=t,r.boxValue.innerHTML=i(t).toUpperCase()),r},fillColor:function(t,r,e){return this.table.rows[t].cells[r].style.backgroundColor=e,this},drawLeftColor:function(){for(var t=this,r=t.row,e=0;r>e;e++)t.fillColor(e,0,"#000").fillColor(e,1,C[e]).fillColor(e,2,"#000");return t},drawCubeColor:function(){var t,r=this,o=r.row,i=r.col,n=0,l=3342336;r.drawLeftColor();for(var s=0;o>s;s++){t=n=s>5?10027008+51*(s-6):0+51*s;for(var f=3;i>f;f++)r.fillColor(s,f,e(t)),t+=13056,(f-2)%6==0&&(n+=l,t=n)}return r},drawSeriesColor:function(){var t,r=this,o=r.row,i=r.col,n=13434879,l=6684672,s=1;r.drawLeftColor();for(var f=0;o>f;f++){t=n=f>5?16711935+13056*(f-6):13434879-13056*f,s=1;for(var a=3;i>a;a++)r.fillColor(f,a,e(t)),t-=51*s,(a-2)%6==0&&(s*=-1,n-=l,t=n-(s>0?0:255))}return r},drawGrayColor:function(){for(var t=this,r=t.row,o=t.col,i=16777215,n=0;r>n;n++)for(var l=0;o>l;l++)t.fillColor(n,l,e(i)),0>=i?i=0:i-=65793;return t},show:function(e,o){var i=this;return e==t?e=i.x:i.x=e,o==t?o=i.y:i.y=o,r(i.box,e,o),i},hide:function(){return r(this.box,b,b),this},isHidden:function(){var t=this,r=t.box,e=parseFloat(r.style.left),o=parseFloat(r.style.top);return e<=-r.offsetWidth||o<=-r.offsetHeight},toggle:function(t,r){return this.isHidden()?this.show(t,r):this.hide()}}),Q.toHex=i,Q.toRGB=n,Q.ColorPicker=l}();