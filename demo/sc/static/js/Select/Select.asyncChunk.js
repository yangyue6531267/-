webpackJsonp([13],{"3SSL":function(e,t,i){e.exports=i.p+"static/img/children-entery.d88badf.png"},"4i2Y":function(e,t,i){"use strict";var o=i("OK1g"),s=i("g5qz");t.a={props:["backType"],data:function(){return{RecList:[],isShow:!0,itemNo:0,pos:0,recType:0,AdIMGURL:i("t7ds"),OpenType:!0}},created:function(){this.backType?this.init(o.a.getSearchHot()):this.getOpenAd()},methods:{init:function(e){var t=this;o.a.jsonp(e,function(e){console.log(e),t.RecList=e.data.hotAssetList})},keyCode:function(e){if("KeyBack"==e)this.back();else if("right"==e)this.right();else if("left"==e)this.left();else if("down"==e)this.down();else if("up"==e)this.up();else if("KeyEnter"==e)if(0===this.pos)0===this.itemNo?(this.$router.push({name:"index"}),localStorage.setItem("EnteryType","children")):(localStorage.setItem("EnteryType","esport"),alert("电竞专区正在加紧开发中"));else if(1===this.pos)if(0===this.recType){var t=this.RecList[this.itemNo].jsonUrl,i=this.RecList[this.itemNo].elementType;s.a.routerSkip(t,i,{},this.$router)}else alert("暂未开放")},right:function(){if(0===this.pos)this.itemNo=1,this.recType=1,this.init(o.a.EsportsSearchHot());else{if(this.itemNo===this.RecList.length-1||5===this.itemNo)return;this.itemNo++}},left:function(){if(0===this.pos)this.itemNo=0,this.recType=0,this.init(o.a.getSearchHot());else{if(0===this.itemNo)return;this.itemNo--}},up:function(){1===this.pos&&(this.init(o.a.getSearchHot()),this.pos=0,this.itemNo=0)},down:function(){0===this.pos&&(this.pos=1,this.itemNo=0)},getOpenAd:function(){var e=this,t=0,i=localStorage.getItem("EnteryType");"children"===i?console.log("默认进入少儿首页"):"children"===i&&(console.log("默认进入电竞首页"),t=1),o.a.jsonp(o.a.getOpenAdUrl(t),function(t){var i=t.data.imgInfos;i.length>0&&(e.OpenType=!1,e.AdIMGURL=i[0].fileUrl,e.$router.push({name:"index"}))})}}}},Frey:function(e,t,i){var o=i("jgRS");"string"==typeof o&&(o=[[e.i,o,""]]),o.locals&&(e.exports=o.locals);i("rjj0")("3fc19100",o,!0)},gr31:function(e,t,i){"use strict";function o(e){i("Frey")}Object.defineProperty(t,"__esModule",{value:!0});var s=i("4i2Y"),n=i("z20e"),r=i("VU/8"),a=o,l=r(s.a,n.a,!1,a,null,null);t.default=l.exports},jgRS:function(e,t,i){t=e.exports=i("FZ+f")(!1),t.push([e.i,".openBg{background-size:100% 100%}.openBg,.selectBox{position:absolute;width:1280px;height:720px;overflow:hidden}.selectBox{background:url("+i("nMyi")+") no-repeat}.selectTitle{position:relative;height:156px;font-size:47px;text-align:center;line-height:156px}.enteryButton{position:relative;height:200px;padding-left:60px;width:1238px}.enteryButton,.entry-1,.entry-2{display:-webkit-box;display:-ms-flexbox;display:flex}.entry-1,.entry-2{width:572px;height:186px}.entry-title{-webkit-box-flex:3;-ms-flex:3;flex:3;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column;display:-webkit-box;display:-ms-flexbox;display:flex}.entry-img{-webkit-box-flex:1;-ms-flex:1;flex:1;height:100%}.entry-img img{width:100%;height:100%}.spacewhite{position:relative;width:17px;height:10px;display:block}.entry-1{background:url("+i("3SSL")+") no-repeat;background-size:100% 100%}.entry-2{background:url("+i("vpog")+") no-repeat;background-size:100% 100%}.entry-title span:first-child{font-size:37px;font-weight:700;width:100%;-webkit-box-flex:1;-ms-flex:1;flex:1;-webkit-box-align:end;-ms-flex-align:end;align-items:flex-end;display:-webkit-box;display:-ms-flexbox;display:flex}.entry-title span:nth-child(2){font-size:30px;font-weight:400;width:100%;-webkit-box-flex:1;-ms-flex:1;flex:1}.recommendData h1{font-weight:700;font-size:40px;margin-left:60px}.recommendData ul{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-ms-flex-direction:row;flex-direction:row;margin-top:10px;padding-left:40px}.recommendData li{width:178px;height:255px;z-index:10;-webkit-box-sizing:border-box;box-sizing:border-box;margin-left:18px}.recommendData li img{width:100%;height:100%;border-radius:15px}.recommendData li p{text-align:center;margin-top:10px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.Enterhover{border:10px solid #e79e18;border-radius:30px;margin:-10px}.Imghover{border:4px solid #e79e18;margin:-4px;-webkit-box-shadow:0 5px 5px #333;box-shadow:0 5px 5px #333;transform:scale(1.105);-webkit-transform:scale(1.05)}",""])},nMyi:function(e,t,i){e.exports=i.p+"static/img/selectEntery.d39cc58.png"},t7ds:function(e,t){e.exports="data:image/png;base64,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"},vpog:function(e,t,i){e.exports=i.p+"static/img/esport-entery.c865745.png"},z20e:function(e,t,i){"use strict";var o=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"openBg",style:{background:"url("+e.AdIMGURL+") no-repeat"}},[i("div",{directives:[{name:"show",rawName:"v-show",value:e.OpenType,expression:"OpenType"}],staticClass:"selectBox"},[i("div",{staticClass:"selectTitle"},[e._v("请选择您的启动页面")]),e._v(" "),i("div",{staticClass:"enteryButton"},[i("div",{class:{"entry-1":!0,Enterhover:0===e.pos&&0===e.itemNo}}),e._v(" "),i("span",{staticClass:"spacewhite"}),e._v(" "),i("div",{class:{"entry-2":!0,Enterhover:0===e.pos&&1===e.itemNo}})]),e._v(" "),i("div",{staticClass:"recommendData"},[i("h1",[e._v("大家都在看")]),e._v(" "),i("ul",[e._l(e.RecList,function(t,o){return[o<6?i("li",{key:o},[i("img",{class:{Imghover:1===e.pos&&o===e.itemNo},attrs:{src:t.elementImg}}),e._v(" "),i("p",[e._v(e._s(t.elementName))])]):e._e()]})],2)]),e._v(" "),e.isShow?i("keyDo",{on:{listenKeyCode:e.keyCode}}):e._e()],1)])},s=[],n={render:o,staticRenderFns:s};t.a=n}});