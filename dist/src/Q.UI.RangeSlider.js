//devin87@qq.com
//build:2019/04/24 11:15:56
!function(e){"use strict";var u=Q.fire,r=Q.createEle,t=Q.factory,s=Q.DragX;function a(e){var t=(e=e||{}).box,a=r("div","range-slider-bar"),d=r("div","range-progress"),f=r("div","range-slider");a.appendChild(d),a.appendChild(f),t.appendChild(a);var v=this;v._elBar=a,v._elProgress=d,v._elSlider=f,v.min=+e.min||0,v.max=+e.max||100,v.step=+e.step||1,v.value=+e.value||0;var n=v.step+"",i=n.lastIndexOf("."),l=-1!=i?n.length-i-1:0,h=Math.pow(10,l);v.onchange=e.onchange,v.val(v.value),v._drag=new s(function(){var l,r,s,o,e=this;e.ops={ele:f,autoCursor:!1},e.doDown=function(e){l=a.offsetWidth,r=d.offsetWidth,s=e.clientX,o=l-f.offsetWidth},e.doMove=function(e){var t=e.clientX-s,a=r+t;a<0?a=0:l<a&&(a=l);var n=~~(a*(v.max-v.min)/(l*v.step)),i=(v.min*h+v.step*h*n)/h;d.style.width=100*a/l+"%",f.style.left=100*Math.min(a,o)/l+"%",i!=v.value&&(v.value=i,u(v.onchange,v,v.value))}})}t(a).extend({val:function(e){var t=this;if(null==e)return t.value;e<t.min?e=t.min:e>t.max&&(e=t.max);var a=t._elProgress,n=t._elSlider,i=t._elBar.offsetWidth;return t.value=e,a.style.width=100*(e-t.min)/(t.max-t.min)+"%",n.style.left=100*Math.min(a.offsetWidth,i-n.offsetWidth)/i+"%",t}}),Q.RangeSlider=a}();