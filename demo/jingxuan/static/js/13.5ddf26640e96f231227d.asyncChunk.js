webpackJsonp([13],{Lxn6:function(e,t,n){"use strict";n.d(t,"a",function(){return r});var r;!function(e){function t(){var e=document.createElement("div");return e.style.position="absolute",e.style.top="0px",e.style.left="0px",e.style.right="0px",e.style.padding="8px",e.style.color="#fff",e.style.backgroundColor="rgba(0, 0, 0, 0.85)",e.style.fontSize="18px",e.style.zIndex="10",e}function n(e){return void 0===e&&(e=document.body),void 0==a&&(a=e.appendChild(t())),a}function r(t){e.enableLog&&(n().textContent+="[ "+t+" ] ")}function o(e,t){var n="./entrance.html"+t+"&hqpage=lottery&hqentrance="+e+"&";return location.href=n}var a;e.enableLog=!1,e.getUrlParame=function(e){var t=new RegExp("(^|&)"+e+"=([^&]*)(&|$)","i"),n=location.search.substr(1).match(t);if(null!=n)try{return decodeURIComponent(n[2])}catch(e){return decodeURI(n[2])}return""},e.getCookie=function(e){for(var t,n=document.cookie?document.cookie.split("; "):[],r=0;r<n.length;r++){var o=n[r],a=o.indexOf("=");a=a<0?o.length:a;var i=o.substr(0,a),c=void 0;try{c=decodeURIComponent(i)}catch(e){console&&"function"==typeof console.error&&console.error("Could not decode cookie with key "+i,e);continue}if(c==e){t=decodeURIComponent(o.substr(a+1));break}}return t},e.setCookie=function(e,t){document.cookie=i(e,t)};var i=function(e,t){return e=e.replace(/[^#$&+\^`|]/g,encodeURIComponent),e=e.replace(/\(/g,"%28").replace(/\)/g,"%29"),t=(t+"").replace(/[^!#$&-+\--:<-\[\]-~]/g,encodeURIComponent),e+"="+t+";path=/"};e.printLogToScreen=function(e){return},e.isEmptyURLParameters=function(e){return null==e||""==e||"undefiend"==e||"null"==e};var c=-1,l=function(e,t,n){if(e.readyState==XMLHttpRequest.DONE){clearTimeout(c),c=-1;try{return t(JSON.parse(e.responseText))}catch(e){return n(e)}}},u={};e.setAjaxGlobalParameters=function(e){for(var t in e)e.hasOwnProperty(t)&&(u[t]=e[t])},e.ajax=function(t){var n=t.method||"GET",r=t.url,o=t.parametes,a=t.success,i=t.failure,c=new XMLHttpRequest;return"GET"==n&&o&&(r=e.appendParametersToURL(r,o)),e.setAjaxGlobalParameters({version:"2.0.0.AH.0.Release"}),null!=u&&(r=e.appendParametersToURL(r,u)),r=e.appendParametersToURL(r,{now:""+(new Date).getTime()}),void 0!=t.beforeSend&&(r=t.beforeSend(r)),c.open(n,r),c.onreadystatechange=function(){return l(c,a,i)},c.send(null),c},e.appendParametersToURL=function(e,t){-1!=e.indexOf("?")?"&"!=e[e.length-1]&&(e+="&"):e+="?";for(var n in t)t.hasOwnProperty(n)&&(e+=n+"="+t[n]+"&");return"&"==e[e.length-1]&&(e=e.substring(0,e.length-1)),e},e.createLogElement=t,e.log=r,e.openLotteryPage=o}(r||(r={}))},Qu0k:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n("l03b"),o=n("VMcr"),a=n("VU/8"),i=a(r.a,o.a,!1,null,null,null);t.default=i.exports},V9aM:function(e,t,n){"use strict";n.d(t,"a",function(){return r});var r,o=n("pFYg"),a=n.n(o),i=n("Lxn6");!function(e){var t=i.a.getCookie("providerID"),n="hw"==t,r="zx"==t,o="",c="",l=i.a.getUrlParame("episode"),u=i.a.getUrlParame("video_id"),s=i.a.getUrlParame("several_type"),d=i.a.getUrlParame("category"),f=i.a.getUrlParame("contentID"),p=i.a.getUrlParame("start_time")||0,m=i.a.getUrlParame("try_view")||0;e.start=function(){if(n&&(o=i.a.getUrlParame("mediastr")),r){var t=e.createPlayerIframe(f);return document.body.appendChild(t),void(t.onload=g)}return y()};var g=function(){return o=v(f),y()},v=function(e){var t="";try{t=window.if_smallscreen.getMediastr(e)}catch(e){}return t},y=function(){return n&&(c=o.replace("*","&").substring(o.lastIndexOf("rtsp"))),r&&(c=o),h()},h=function(){var e="/tryViemPlay?",t={start_time:p+"",video_id:u,several_type:s,category:d,try_view:m+"",episode:l,playURL:encodeURIComponent(c)};return e=i.a.appendParametersToURL(e,t),console.log("播放器试看跳转地址:"+e),location.href=e};e.createPlayerIframe=function(e){var t="";"object"==("undefined"==typeof Authentication?"undefined":a()(Authentication))&&(t="CTCSetConfig"in Authentication?Authentication.CTCGetConfig("EPGDomain")||"":Authentication.CUGetConfig("EPGDomain")||"");var n=t.lastIndexOf("/"),r=t.substr(0,n),o=r;o+="/MediaService/SmallScreen?",o+="ContentID="+e,o+="&ReturnURL="+decodeURIComponent("http://www.a.com"),o+="&Left=0&Top=0&Width=1280&Height=720",o+="&GetCntFlag=1";var i=document.createElement("iframe");return i.name="if_smallscreen",i.style.display="none",i.style.top="0px",i.style.left="0px",i.style.width="0px",i.style.height="0px",i.src=o,i.frameBorder="no",i.scrolling="no",i}}(r||(r={}))},VMcr:function(e,t,n){"use strict";var r=function(){var e=this,t=e.$createElement;return(e._self._c||t)("div")},o=[],a={render:r,staticRenderFns:o};t.a=a},l03b:function(e,t,n){"use strict";var r=n("V9aM");t.a={created:function(){r.a.start()}}}});
//# sourceMappingURL=13.5ddf26640e96f231227d.asyncChunk.js.map