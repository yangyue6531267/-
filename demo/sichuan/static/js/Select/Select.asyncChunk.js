webpackJsonp([8],{"1kS7":function(e,t){t.f=Object.getOwnPropertySymbols},"3SSL":function(e,t,i){e.exports=i.p+"static/img/children-entery.d88badf.png"},"4i2Y":function(e,t,i){"use strict";var o=i("Dd8w"),n=i.n(o),s=i("OK1g"),r=(i("GSPp"),i("g5qz")),a=i("NYxO"),p=i("xG35");t.a={props:["backType","Ptype"],data:function(){return{RecList:[],isShow:!1,itemNo:0,pos:0,recType:0,AdIMGURL:i("t7ds"),OpenType:!1,eSportUrl:"http://112.18.251.100:7077/esport/jx/index?Ptype="+p.a.cdn}},computed:n()({},Object(a.b)(["isBack"])),created:function(){this.$store.commit("GET_ISBACK",!0),this.Ptype?(localStorage.setItem("cdnType",this.Ptype),p.a.setCdnType(this.Ptype)):p.a.setCdnType(localStorage.getItem("cdnType")),this.backType||this.$route.query.backType?(this.OpenType=!0,this.isShow=!0,"index"===this.backType?(this.itemNo=1,this.recType=1,this.init(s.a.EsportsSearchHot())):this.init(s.a.getSearchHot())):this.getOpenAd()},methods:{init:function(e){var t=this;console.log(e),s.a.jsonp(e,function(e){console.log(e),t.RecList=e.data.hotAssetList})},keyCode:function(e){if("KeyBack"==e)window.close();else if("right"==e)this.right();else if("left"==e)this.left();else if("down"==e)this.down();else if("up"==e)this.up();else if("KeyEnter"==e)if(0===this.pos)0===this.itemNo?(localStorage.setItem("EnteryType","children"),location.href="http://112.18.251.100:7077/sichuan/jx/index?Ptype="+p.a.cdn):(localStorage.setItem("EnteryType","esport"),location.href="http://112.18.251.100:7077/esport/jx/index?Ptype="+p.a.cdn);else if(1===this.pos)if(r.a.setParentPageType("1301"),r.a.setParentPageId("105-1"),0===this.recType){var t=this.RecList[this.itemNo].jsonUrl,i=this.RecList[this.itemNo].elementType,o=this.RecList[this.itemNo].elementType;r.a.routerSkip(t,i,{},this.$router,o)}else{var n=this.RecList[this.itemNo].jsonUrl,s=this.RecList[this.itemNo].layout,a="";"Detail_News"===s?a="http://112.18.251.100:7077/esport/eventDetail?Ptype="+p.a.cdn:"Host_Js"===s?a="http://112.18.251.100:7077/esport/AnchorShotVideo?Ptype="+p.a.cdn:"Game_Zy"===s&&(a="http://112.18.251.100:7077/esport/varietyDetail?Ptype="+p.a.cdn),location.href=a+"&jsonUrl="+n}},right:function(){if(0===this.pos)this.itemNo=1,this.recType=1,this.init(s.a.EsportsSearchHot());else{if(this.itemNo===this.RecList.length-1||5===this.itemNo)return;this.itemNo++}},left:function(){if(0===this.pos)this.itemNo=0,this.recType=0,this.init(s.a.getSearchHot());else{if(0===this.itemNo)return;this.itemNo--}},up:function(){1===this.pos&&(this.init(s.a.getSearchHot()),this.pos=0,this.itemNo=0)},down:function(){0===this.pos&&(this.pos=1,this.itemNo=0)},getOpenAd:function(){var e=this,t=0,i=localStorage.getItem("EnteryType");if("children"===i)console.log("默认进入少儿首页");else{if("esport"!==i)return this.OpenType=!0,this.isShow=!0,this.itemNo=0,this.recType=0,this.init(s.a.getSearchHot()),!1;console.log("默认进入电竞首页"),t=1}s.a.jsonp(s.a.getOpenAdUrl(t),function(i){if(200===i.code||"200"===i.code){var o=i.data.imgInfos;o&&o.length>0?(e.OpenType=!1,void 0!=o[0].fileUrl&&""!=o[0].fileUrl?(e.AdIMGURL=o[0].fileUrl,setTimeout(function(){0===t?e.$router.push({name:"index"}):location.href="http://112.18.251.100:7077/esport/jx/index?Ptype="+p.a.cdn},5e3)):0===t?e.$router.push({name:"index"}):location.href="http://112.18.251.100:7077/esport/jx/index?Ptype="+p.a.cdn):0===t?e.$router.push({name:"index"}):location.href="http://112.18.251.100:7077/esport/jx/index?Ptype="+p.a.cdn}else 0===t?e.$router.push({name:"index"}):location.href="http://112.18.251.100:7077/esport/jx/index?Ptype="+p.a.cdn},function(){console.log("获取开机海报异常,直接进入首页"),0===t?e.$router.push({name:"index"}):location.href="http://112.18.251.100:7077/esport/jx/index?Ptype="+p.a.cdn})}}}},"8NUL":function(e,t,i){var o=i("vw7y");"string"==typeof o&&(o=[[e.i,o,""]]),o.locals&&(e.exports=o.locals);i("rjj0")("02341c88",o,!0)},DNbL:function(e,t,i){"use strict";var o=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"openBg",style:{background:"url("+e.AdIMGURL+") no-repeat"}},[i("div",{directives:[{name:"show",rawName:"v-show",value:e.OpenType,expression:"OpenType"}],staticClass:"selectBox"},[i("div",{staticClass:"selectTitle"},[e._v("请选择您的启动页面")]),e._v(" "),i("div",{staticClass:"enteryButton"},[i("div",{class:{"entry-1":!0,Enterhover:0===e.pos&&0===e.itemNo}}),e._v(" "),i("span",{staticClass:"spacewhite"}),e._v(" "),i("div",{class:{"entry-2":!0,Enterhover:0===e.pos&&1===e.itemNo}})]),e._v(" "),i("div",{staticClass:"recommendData"},[i("h1",[e._v("大家都在看")]),e._v(" "),i("ul",[e._l(e.RecList,function(t,o){return[o<6?i("li",{key:o,class:{Imghover:1===e.pos&&o===e.itemNo}},[i("img",{attrs:{src:t.elementImg}}),e._v(" "),1!=e.pos||o!=e.itemNo?i("p",[e._v(e._s(t.elementName))]):e._e(),e._v(" "),i("p",[1===e.pos&&o==e.itemNo?i("marquee",{attrs:{behavior:"scroll",scrollamount:"5"}},[e._v(e._s(t.elementName))]):e._e()],1)]):e._e()]}),e._v(" "),i("div",{staticStyle:{clear:"both"}})],2)]),e._v(" "),e.isShow?i("keyDo",{on:{listenKeyCode:e.keyCode}}):e._e()],1)])},n=[],s={render:o,staticRenderFns:n};t.a=s},Dd8w:function(e,t,i){"use strict";t.__esModule=!0;var o=i("woOf"),n=function(e){return e&&e.__esModule?e:{default:e}}(o);t.default=n.default||function(e){for(var t=1;t<arguments.length;t++){var i=arguments[t];for(var o in i)Object.prototype.hasOwnProperty.call(i,o)&&(e[o]=i[o])}return e}},"EH+q":function(e,t,i){e.exports=i.p+"static/img/asset_hover.b70e908.png"},NpIQ:function(e,t){t.f={}.propertyIsEnumerable},R4wc:function(e,t,i){var o=i("kM2E");o(o.S+o.F,"Object",{assign:i("To3L")})},To3L:function(e,t,i){"use strict";var o=i("lktj"),n=i("1kS7"),s=i("NpIQ"),r=i("sB3e"),a=i("MU5D"),p=Object.assign;e.exports=!p||i("S82l")(function(){var e={},t={},i=Symbol(),o="abcdefghijklmnopqrst";return e[i]=7,o.split("").forEach(function(e){t[e]=e}),7!=p({},e)[i]||Object.keys(p({},t)).join("")!=o})?function(e,t){for(var i=r(e),p=arguments.length,l=1,h=n.f,c=s.f;p>l;)for(var d,g=a(arguments[l++]),f=h?o(g).concat(h(g)):o(g),u=f.length,x=0;u>x;)c.call(g,d=f[x++])&&(i[d]=g[d]);return i}:p},V3tA:function(e,t,i){i("R4wc"),e.exports=i("FeBl").Object.assign},gr31:function(e,t,i){"use strict";function o(e){i("8NUL")}Object.defineProperty(t,"__esModule",{value:!0});var n=i("4i2Y"),s=i("DNbL"),r=i("VU/8"),a=o,p=r(n.a,s.a,!1,a,null,null);t.default=p.exports},nMyi:function(e,t,i){e.exports=i.p+"static/img/selectEntery.d39cc58.png"},t7ds:function(e,t){e.exports="data:image/png;base64,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"},vpog:function(e,t,i){e.exports=i.p+"static/img/esport-entery.c865745.png"},vw7y:function(e,t,i){t=e.exports=i("FZ+f")(!1),t.push([e.i,".openBg{background-size:100% 100%}.openBg,.selectBox{position:absolute;width:1280px;height:720px;overflow:hidden}.selectBox{background:url("+i("nMyi")+") no-repeat}.selectTitle{position:relative;height:156px;font-size:47px;text-align:center;line-height:156px}.enteryButton{position:relative;height:200px;padding-left:60px;width:1238px}.enteryButton,.entry-1,.entry-2{display:-webkit-box;display:-ms-flexbox;display:flex}.entry-1,.entry-2{width:572px;height:186px}.entry-title{-webkit-box-flex:3;-ms-flex:3;flex:3;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column;display:-webkit-box;display:-ms-flexbox;display:flex}.entry-img{-webkit-box-flex:1;-ms-flex:1;flex:1;height:100%}.entry-img img{width:100%;height:100%}.spacewhite{position:relative;width:17px;height:10px;display:block}.entry-1{background:url("+i("3SSL")+") no-repeat;background-size:100% 100%}.entry-2{background:url("+i("vpog")+") no-repeat;background-size:100% 100%}.entry-title span:first-child{font-size:37px;font-weight:700;width:100%;-webkit-box-flex:1;-ms-flex:1;flex:1;-webkit-box-align:end;-ms-flex-align:end;align-items:flex-end;display:-webkit-box;display:-ms-flexbox;display:flex}.entry-title span:nth-child(2){font-size:30px;font-weight:400;width:100%;-webkit-box-flex:1;-ms-flex:1;flex:1}.recommendData h1{font-weight:700;font-size:40px;margin-left:60px}.recommendData ul{margin-top:10px;padding-left:40px;position:absolute;overflow:hidden;z-index:100}.recommendData li{float:left;width:178px;height:255px;z-index:10;-webkit-box-sizing:border-box;box-sizing:border-box;margin-left:18px;border-radius:16px;z-index:50}.recommendData li img{width:172px;height:240px;border-radius:15px;z-index:-1;position:absolute}.recommendData li p{text-align:center;margin-top:10px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;position:absolute;top:206px;width:159px;margin-left:9px}.Enterhover{border:10px solid #e79e18;border-radius:30px;margin:-10px}.Imghover{background:url("+i("EH+q")+") no-repeat;background-size:100% 100%}",""])},woOf:function(e,t,i){e.exports={default:i("V3tA"),__esModule:!0}}});