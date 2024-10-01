!function(e){"use strict";var t=e.plot.browser,i="hover";e.plot.plugins.push({init:function(o){var a,n=[];function r(e){var t=o.getOptions(),a=new CustomEvent("mouseevent");return a.pageX=e.detail.changedTouches[0].pageX,a.pageY=e.detail.changedTouches[0].pageY,a.clientX=e.detail.changedTouches[0].clientX,a.clientY=e.detail.changedTouches[0].clientY,t.grid.hoverable&&s(a,i,30),!1}function s(e,t,i){var a=o.getData();if(void 0!==e&&a.length>0&&void 0!==a[0].xaxis.c2p&&void 0!==a[0].yaxis.c2p){var n=t+"able";u("plot"+t,e,(function(e){return!1!==a[e][n]}),i)}}function l(e){a=e,o.getPlaceholder()[0].lastMouseMoveEvent=e,s(e,i)}function c(e){a=void 0,o.getPlaceholder()[0].lastMouseMoveEvent=void 0,u("plothover",e,(function(e){return!1}))}function h(e){s(e,"click")}function p(){o.unhighlight(),o.getPlaceholder().trigger("plothovercleanup")}function u(e,i,a,r){var s=o.getOptions(),l=o.offset(),c=t.getPageXY(i),h=c.X-l.left,p=c.Y-l.top,u=o.c2p({left:h,top:p}),v=void 0!==r?r:s.grid.mouseActiveRadius;u.pageX=c.X,u.pageY=c.Y;var f=o.findNearbyItems(h,p,a,v),b=f[0];for(let e=1;e<f.length;++e)(void 0===b.distance||f[e].distance<b.distance)&&(b=f[e]);if(b?(b.pageX=parseInt(b.series.xaxis.p2c(b.datapoint[0])+l.left,10),b.pageY=parseInt(b.series.yaxis.p2c(b.datapoint[1])+l.top,10)):b=null,s.grid.autoHighlight){for(let t=0;t<n.length;++t){var m=n[t];(m.auto!==e||b&&m.series===b.series&&m.point[0]===b.datapoint[0]&&m.point[1]===b.datapoint[1])&&b||g(m.series,m.point)}b&&d(b.series,b.datapoint,e)}o.getPlaceholder().trigger(e,[u,b,f])}function d(e,t,i){if("number"==typeof e&&(e=o.getData()[e]),"number"==typeof t){var a=e.datapoints.pointsize;t=e.datapoints.points.slice(a*t,a*(t+1))}var r=v(e,t);-1===r?(n.push({series:e,point:t,auto:i}),o.triggerRedrawOverlay()):i||(n[r].auto=!1)}function g(e,t){if(null==e&&null==t)return n=[],void o.triggerRedrawOverlay();if("number"==typeof e&&(e=o.getData()[e]),"number"==typeof t){var i=e.datapoints.pointsize;t=e.datapoints.points.slice(i*t,i*(t+1))}var a=v(e,t);-1!==a&&(n.splice(a,1),o.triggerRedrawOverlay())}function v(e,t){for(var i=0;i<n.length;++i){var o=n[i];if(o.series===e&&o.point[0]===t[0]&&o.point[1]===t[1])return i}return-1}function f(){p(),s(a,i)}function b(){s(a,i)}function m(e,t,i){var o,a,r=e.getPlotOffset();for(t.save(),t.translate(r.left,r.top),o=0;o<n.length;++o)(a=n[o]).series.bars.show?k(a.series,a.point,t):y(a.series,a.point,t,e);t.restore()}function y(t,i,o,a){var n=i[0],r=i[1],s=t.xaxis,l=t.yaxis,c="string"==typeof t.highlightColor?t.highlightColor:e.color.parse(t.color).scale("a",.5).toString();if(!(n<s.min||n>s.max||r<l.min||r>l.max)){var h=t.points.radius+t.points.lineWidth/2;o.lineWidth=h,o.strokeStyle=c;var p=1.5*h;n=s.p2c(n),r=l.p2c(r),o.beginPath();var u=t.points.symbol;"circle"===u?o.arc(n,r,p,0,2*Math.PI,!1):"string"==typeof u&&a.drawSymbol&&a.drawSymbol[u]&&a.drawSymbol[u](o,n,r,p,!1),o.closePath(),o.stroke()}}function k(t,i,o){var a,n="string"==typeof t.highlightColor?t.highlightColor:e.color.parse(t.color).scale("a",.5).toString(),r=n,s=t.bars.barWidth[0]||t.bars.barWidth;switch(t.bars.align){case"left":a=0;break;case"right":a=-s;break;default:a=-s/2}o.lineWidth=t.bars.lineWidth,o.strokeStyle=n;var l=t.bars.fillTowards||0,c=l>t.yaxis.min?Math.min(t.yaxis.max,l):t.yaxis.min;e.plot.drawSeries.drawBar(i[0],i[1],i[2]||c,a,a+s,(function(){return r}),t.xaxis,t.yaxis,o,t.bars.horizontal,t.bars.lineWidth)}o.hooks.bindEvents.push((function(e,t){var i=e.getOptions();(i.grid.hoverable||i.grid.clickable)&&(t[0].addEventListener("touchevent",p,!1),t[0].addEventListener("tap",r,!1)),i.grid.clickable&&t.bind("click",h),i.grid.hoverable&&(t.bind("mousemove",l),t.bind("mouseleave",c))})),o.hooks.shutdown.push((function(e,t){t[0].removeEventListener("tap",r),t[0].removeEventListener("touchevent",p),t.unbind("mousemove",l),t.unbind("mouseleave",c),t.unbind("click",h),n=[]})),o.hooks.processOptions.push((function(e,t){e.highlight=d,e.unhighlight=g,(t.grid.hoverable||t.grid.clickable)&&(e.hooks.drawOverlay.push(m),e.hooks.processDatapoints.push(f),e.hooks.setupGrid.push(b)),a=e.getPlaceholder()[0].lastMouseMoveEvent}))},options:{grid:{hoverable:!1,clickable:!1}},name:"hover",version:"0.1"})}(jQuery);