webpackJsonp([11],{CFhX:function(t,e,a){var i=a("vZFp");"string"==typeof i&&(i=[[t.i,i,""]]),i.locals&&(t.exports=i.locals);a("FIqI")("253707a2",i,!0,{})},EM5Z:function(t,e,a){t.exports=a.p+"static/img/anchor-recommend-active.f391ee4.png"},FpfF:function(t,e,a){"use strict";var i=a("4YfN"),s=a.n(i),o=a("g5qz"),r=a("tk87"),n=a("OK1g"),l=a("48sp"),c=a("xG35"),h=a("GSPp");e.a={data:function(){return{detailData:[],isShow:!1,itemNo:-1,lastFocus:0,jsonUrl:"",placeholder:a("1xnn"),maskShow:!1,likeShow:!0,actorRecParameter:"&actorRec=1&actor=1",startTime:0}},mounted:function(){this.startTime=new Date-0},created:function(){if(this.$route.params.jsonUrl){this.jsonUrl=this.$route.params.jsonUrl;var t=this.$route.params.jsonUrl+this.actorRecParameter+"&package=1"+this.behindParams;localStorage.setItem("detailJsonUrl",this.jsonUrl),this.getDetailData(t)}else if(this.$route.query.jsonUrl){o.a.startTime(),h.a.start("0201"),this.jsonUrl=this.$route.query.jsonUrl+"&p="+this.$route.query.p+"&k="+this.$route.query.k+"&v="+this.$route.query.v+"&assetId="+this.$route.query.assetId+"&c="+this.$route.query.c+"&package=1";var e=this.jsonUrl+this.actorRecParameter+"&package=1"+this.behindParams;this.getDetailData(e)}else{var a=localStorage.getItem("detailJsonUrl")+"&package=1"+this.actorRecParameter+this.behindParams;this.getDetailData(a)}},computed:s()({},Object(l.c)(["behindParams","navpos"])),components:{detailtop:r.a},methods:{getDetailData:function(t){var e=this;console.log("获取详情页信息"+t),n.a.jsonp(t,function(t){if(null==t.data){e.maskShow=!0;var a=JSON.parse(localStorage.getItem("historyListsr"));if(null!=a){var i=e.$route.params.jsonUrl;a.forEach(function(t,e){-1!=t.jsonUrl.indexOf(i)&&c.a.delHistory(e)})}var s=e.GetRequest(e.$route.params.jsonUrl.split("?")[1]).assetId;return void o.a.uesrCollect({},"del","relateId",s)}e.maskShow=!1,e.detailData=t.data,e.newJump(),0==e.detailData.assetList.length?e.likeShow=!1:e.likeShow=!0})},playVideo:function(){var t=this.jsonUrl;c.a.showVideo(t)},keyCode:function(t){"down"!==t&&("up"===t?this.up():"left"===t?this.left():"right"===t?this.right():"KeyEnter"===t?this.enter():"KeyBack"===t&&(this.$store.commit("GET_ISSHOWPLAY",!1),this.$route.params.bp&&this.$route.params.bp.type?o.a.routerBack(this.$router,this.$route.params.bp.type):o.a.routerBack(this.$router,void 0)))},GetRequest:function(t){for(var e=new Object,a=t.split("&"),i=0;i<a.length;i++)e[a[i].split("=")[0]]=unescape(a[i].split("=")[1]);return e},up:function(){this.isShow=!1,this.lastFocus=this.itemNo,this.itemNo=-1,this.$refs.dl.getKeyListen()},left:function(){0!==this.itemNo&&(this.itemNo>=6&&(this.$refs.contentBox.style.marginLeft=183*-(this.itemNo-6)+"px"),this.itemNo--)},right:function(){this.itemNo!==this.detailData.actorList.length-1&&++this.itemNo>=7&&(this.$refs.contentBox.style.marginLeft=183*-(this.itemNo-6)+"px")},enter:function(){localStorage.setItem("BI_recmd_id",3);var t=this.detailData.actorList[this.itemNo].jsonUrl,e=this.detailData.actorList[this.itemNo];this.$store.commit("GET_ISSHOWPLAY",!1),this.setLogJump(),this.$router.push({name:"anchorDetail",params:{jsonUrl:t,bp:e}});var a={pos_id:"",recmd_id:"3",page_type:"0301",page_id:this.detailData.assetId,cid:this.detailData.assetId,click_type:"3"};h.a.jumpRecommend(a)},newJump:function(){if("jump"==o.a.isJump()){o.a.removeJump();var t={page_type:"0301",page_id:this.detailData.assetId,parent_page_type:o.a.getParentPageType(),parent_page_id:o.a.getParentPageId()};h.a.newJump(t)}},keepDo:function(t,e,a){if(this.detailData.actorList&&0==this.detailData.actorList.length)return this.$refs.dl.getKeyListen(),void(this.isShow=!1);"down"===a&&(this.isShow=!0,this.itemNo=this.lastFocus)},setLogJump:function(){o.a.setJump(),o.a.setParentPageType("0301"),o.a.setParentPageId(this.detailData.assetId)}}}},ITBh:function(t,e,a){t.exports=a.p+"static/img/anchor-recommend.57706b4.png"},TGIH:function(t,e,a){"use strict";function i(t){a("CFhX")}Object.defineProperty(e,"__esModule",{value:!0});var s=a("FpfF"),o=a("qWSU"),r=a("C7Lr"),n=i,l=r(s.a,o.a,!1,n,"data-v-0f47b0d0",null);e.default=l.exports},qWSU:function(t,e,a){"use strict";var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"anchor-shot-detail"},[t._m(0),t._v(" "),a("detailtop",{ref:"dl",attrs:{initData:t.detailData,jsonUrl:t.jsonUrl},on:{pressDown:t.keepDo}}),t._v(" "),a("div",{staticClass:"recommend"},[t.likeShow?a("h4",[t._v("猜你喜欢")]):t._e(),t._v(" "),a("ul",{ref:"contentBox",staticClass:"recommend-content"},t._l(t.detailData.actorList,function(e,i){return a("li",{key:i,class:{active:i===t.itemNo},attrs:{id:"box-"+i}},[a("img",{attrs:{src:e.actorImg,alt:""}}),t._v(" "),a("span",[t._v(t._s(e.actorName))])])}),0)]),t._v(" "),t.maskShow?a("div",{staticClass:"mask"},[t._v("\n    该资产已下线，点击返回体验更多精彩视频\n  ")]):t._e(),t._v(" "),t.isShow?a("keyDo",{ref:"keydo",on:{listenKeyCode:t.keyCode}}):t._e()],1)},s=[function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"title"},[a("h3",[t._v("主播短视频")])])}],o={render:i,staticRenderFns:s};e.a=o},vZFp:function(t,e,a){var i=a("L4zZ");e=t.exports=a("UTlt")(!1),e.push([t.i,".mask[data-v-0f47b0d0]{width:1280px;height:720px;background-color:rgba(0,0,0,.8);color:#fff;position:fixed;top:0;left:0;text-align:center;z-index:999;line-height:1050px;font-size:40px}.anchor-shot-detail[data-v-0f47b0d0]{width:1280px;height:720px;background:url("+i(a("NZBP"))+");overflow:hidden}.anchor-shot-detail .title[data-v-0f47b0d0]{position:relative;left:-20px;display:block;width:254px;height:58px;background:#052c55;line-height:58px;font-size:25px;font-weight:300;text-align:center;-webkit-transform:skewX(-30deg);transform:skewX(-30deg)}.title h3[data-v-0f47b0d0]{-webkit-transform:skewX(30deg);transform:skewX(30deg)}.recommend[data-v-0f47b0d0]{padding-left:30px;margin-left:55px;width:10000000px}.recommend h4[data-v-0f47b0d0]{font-size:20px;opacity:.4;line-height:24px;margin-top:20px}.recommend-content li img[data-v-0f47b0d0]{width:100%;height:100%;position:relative}.recommend-content li[data-v-0f47b0d0]{float:left;width:100px;height:100px;margin-right:83px;margin-top:20px;background:url("+i(a("ITBh"))+") no-repeat;background-size:100% 100%;background-size:cover;text-align:center;position:relative}.recommend-content li.active[data-v-0f47b0d0]{background:url("+i(a("EM5Z"))+") no-repeat;background-size:100% 100%;background-size:cover}.recommend-content span[data-v-0f47b0d0]{position:absolute;bottom:0;left:34px;font-size:16px}",""])}});