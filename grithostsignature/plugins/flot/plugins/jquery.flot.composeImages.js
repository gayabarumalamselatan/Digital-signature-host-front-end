!function(e){"use strict";const t=-100;var n=1,o=e.plot.browser,s=o.getPixelRatio;function i(e,t){var i=e.filter(r);n=s(t.getContext("2d"));var u=i.map((function(e){var t=new Image,n=new Promise(function(e,t){return e.sourceDescription='<info className="'+t.className+'" tagName="'+t.tagName+'" id="'+t.id+'">',e.sourceComponent=t,function(n,s){var i,r,l,u,m;e.onload=function(t){e.successfullyLoaded=!0,n(e)},e.onabort=function(t){e.successfullyLoaded=!1,console.log("Can't generate temp image from "+e.sourceDescription+". It is possible that it is missing some properties or its content is not supported by this browser. Source component:",e.sourceComponent),n(e)},e.onerror=function(t){e.successfullyLoaded=!1,console.log("Can't generate temp image from "+e.sourceDescription+". It is possible that it is missing some properties or its content is not supported by this browser. Source component:",e.sourceComponent),n(e)},r=e,"CANVAS"===(i=t).tagName&&(l=i,r.src=l.toDataURL("image/png")),"svg"===i.tagName&&(u=i,m=r,o.isSafari()||o.isMobileSafari()?function(e,t){var n,o,s=a(g(document),e);s=c(s),o=function(e){var t="";const n=new Uint8Array(e);for(var o=0;o<n.length;o+=16384)t+=String.fromCharCode.apply(null,n.subarray(o,o+16384));return t}(new(TextEncoder||TextEncoderLite)("utf-8").encode(s)),n="data:image/svg+xml;base64,"+btoa(o),t.src=n}(u,m):function(e,t){var n=a(g(document),e);n=c(n);var o=new Blob([n],{type:"image/svg+xml;charset=utf-8"}),s=(self.URL||self.webkitURL||self).createObjectURL(o);t.src=s}(u,m)),r.srcImgTagName=i.tagName,function(e,t){t.genLeft=e.getBoundingClientRect().left,t.genTop=e.getBoundingClientRect().top,"CANVAS"===e.tagName&&(t.genRight=t.genLeft+e.width,t.genBottom=t.genTop+e.height),"svg"===e.tagName&&(t.genRight=e.getBoundingClientRect().right,t.genBottom=e.getBoundingClientRect().bottom)}(i,r)}}(t,e));return n})),m=Promise.all(u).then(function(e){return function(t){var o=function(e,t){var o=function(e,t){var o=0;if(0===e.length)o=-1;else{var s=e[0].genLeft,i=e[0].genTop,r=e[0].genRight,g=e[0].genBottom,a=0;for(a=1;a<e.length;a++)s>e[a].genLeft&&(s=e[a].genLeft),i>e[a].genTop&&(i=e[a].genTop);for(a=1;a<e.length;a++)r<e[a].genRight&&(r=e[a].genRight),g<e[a].genBottom&&(g=e[a].genBottom);if(r-s<=0||g-i<=0)o=-2;else{for(t.width=Math.round(r-s),t.height=Math.round(g-i),a=0;a<e.length;a++)e[a].xCompOffset=e[a].genLeft-s,e[a].yCompOffset=e[a].genTop-i;!function(e,t){void 0!==t.find((function(e){return"svg"===e.srcImgTagName}))&&n<1&&(e.width=e.width*n,e.height=e.height*n)}(t,e)}}return o}(e,t);if(0===o)for(var s=t.getContext("2d"),i=0;i<e.length;i++)!0===e[i].successfullyLoaded&&s.drawImage(e[i],e[i].xCompOffset*n,e[i].yCompOffset*n);return o}(t,e);return o}}(t),l);return m}function r(e){var t=!0,n=!0;return null==e?n=!1:"CANVAS"===e.tagName&&(e.getBoundingClientRect().right!==e.getBoundingClientRect().left&&e.getBoundingClientRect().bottom!==e.getBoundingClientRect().top||(t=!1)),n&&t&&"visible"===window.getComputedStyle(e).visibility}function g(e){for(var t=e.styleSheets,n=[],o=0;o<t.length;o++)try{for(var s=t[o].cssRules||[],i=0;i<s.length;i++){var r=s[i];n.push(r.cssText)}}catch(e){console.log("Failed to get some css rules")}return n}function a(e,t){return['<svg class="snapshot '+t.classList+'" width="'+t.width.baseVal.value*n+'" height="'+t.height.baseVal.value*n+'" viewBox="0 0 '+t.width.baseVal.value+" "+t.height.baseVal.value+'" xmlns="http://www.w3.org/2000/svg">',"<style>","/* <![CDATA[ */",e.join("\n"),"/* ]]> */","</style>",t.innerHTML,"</svg>"].join("\n")}function c(e){var t="";return e.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)||(t=e.replace(/^<svg/,'<svg xmlns="http://www.w3.org/2000/svg"')),e.match(/^<svg[^>]+"http:\/\/www\.w3\.org\/1999\/xlink"/)||(t=e.replace(/^<svg/,'<svg xmlns:xlink="http://www.w3.org/1999/xlink"')),'<?xml version="1.0" standalone="no"?>\r\n'+t}function l(){return t}e.plot.composeImages=i,e.plot.plugins.push({init:function(e){e.composeImages=i},name:"composeImages",version:"1.0"})}(jQuery);