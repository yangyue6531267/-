webpackJsonp([13],{"+16d":function(t,e,i){"use strict";var a=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"variety_content"},[i("div",{directives:[{name:"show",rawName:"v-show",value:!t.isFullScreen,expression:"!isFullScreen"}],staticClass:"variety-detail"},[t._m(0),t._v(" "),i("detailtop",{ref:"dl",attrs:{bigScreenPlay:t.bigScreenPlay,initData:t.detailData,jsonUrl:t.jsonUrl},on:{pressDown:t.keepDo}}),t._v(" "),i("div",{staticClass:"recommend"},[t.likeShow?i("h4",[t._v("猜你喜欢")]):t._e(),t._v(" "),i("ul",{ref:"contentBox",staticClass:"recommend-content"},t._l(t.detailData.assetList,function(e,a){return i("li",{key:a,class:{active:a===t.itemNo},attrs:{id:"box-"+a}},[i("span",{staticClass:"itemName"},[t._v(t._s(e.assetName))])])}),0)]),t._v(" "),t.maskShow?i("div",{staticClass:"mask"},[t._v("\n      该资产已下线，点击返回体验更多精彩视频\n    ")]):t._e(),t._v(" "),t.isShow?i("keyDo",{ref:"keydo",on:{listenKeyCode:t.keyCode}}):t._e()],1),t._v(" "),i("div",{staticClass:"variety_video_wrapper"},[t.isShowPlay&&t.ispayplay&&t.hasData?i("VideoPlayer",{ref:"videoplayer",attrs:{videoDetailData:t.videoDetailData,psId:t.psId,player:t.player,isFree:t.isFree,isBought:t.isBought,size:t.size,shouye:t.shouye,fee:1,smallScreenPlay:t.smallScreenPlay,watchOverTip:t.watchOverTip},on:{setCurrPlay:function(e){return t.setCurrPlay(e)},goCloudPay:function(e){return t.goCloudPay(e)}}}):t._e()],1)])},s=[function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"title"},[i("h3",[t._v("综艺详情")])])}],o={render:a,staticRenderFns:s};e.a=o},"/Cf+":function(t,e,i){var a=i("L4zZ");e=t.exports=i("UTlt")(!1),e.push([t.i,".variety_content[data-v-6d4df713]{width:100%;height:100%;background-color:transparent;position:relative}.mask[data-v-6d4df713]{width:1280px;height:720px;background-color:#000;color:#fff;position:fixed;top:0;left:0;text-align:center;z-index:999;line-height:1050px;font-size:40px}.variety-detail[data-v-6d4df713]{width:1280px;height:720px;background:url("+a(i("NZBP"))+');overflow:hidden}.variety-detail .title[data-v-6d4df713]{position:relative;left:-20px;display:block;width:254px;height:58px;background:#002d50;line-height:58px;font-size:25px;font-weight:300;text-align:center;-webkit-transform:skewX(-30deg);transform:skewX(-30deg)}.title h3[data-v-6d4df713]{-webkit-transform:skewX(30deg);transform:skewX(30deg);margin-top:0}.recommend ul[data-v-6d4df713]{margin-left:35px;width:10000px;-webkit-transition:all .5s;transition:all .5s}.recommend h4[data-v-6d4df713]{font-size:20px;opacity:.4;line-height:24px;margin-left:20px;margin-top:20px}.recommend-content ul[data-v-6d4df713]:after{content:"";display:block;clear:both}.recommend-content li[data-v-6d4df713]{float:left;width:231px;height:130px;margin-left:20px;margin-top:20px;background:url('+a(i("IeHd"))+") no-repeat;background-size:100% 100%;text-align:center;font-size:20px;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center}.recommend-content li.active[data-v-6d4df713]{background:url("+a(i("BO1M"))+") no-repeat;background-size:100% 100%}.recommend-content li .itemName[data-v-6d4df713]{width:166px;display:-webkit-box;text-overflow:ellipsis;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;white-space:normal}",""])},NrB0:function(t,e,i){"use strict";function a(t){i("PATs")}Object.defineProperty(e,"__esModule",{value:!0});var s=i("TEEl"),o=i("+16d"),r=i("C7Lr"),n=a,l=r(s.a,o.a,!1,n,"data-v-6d4df713",null);e.default=l.exports},PATs:function(t,e,i){var a=i("/Cf+");"string"==typeof a&&(a=[[t.i,a,""]]),a.locals&&(t.exports=a.locals);i("FIqI")("071466d9",a,!0,{})},TEEl:function(t,e,i){"use strict";var a=i("4YfN"),s=i.n(a),o=i("g5qz"),r=i("tk87"),n=i("OK1g"),l=i("b8UZ"),d=i("xG35"),c=i("h8TQ"),h=i("GSPp"),u=i("lZCa");e.a={data:function(){return{detailData:[],isShow:!1,itemNo:-1,lastFocus:0,jsonUrl:"",maskShow:!1,likeShow:!0,startTime:0,shouye:"detop",size:{x:50,y:75,w:405,h:246},player:c.a,psId:"",hasData:!1}},created:function(){if(this.$route.params.jsonUrl){this.jsonUrl=this.$route.params.jsonUrl;var t=this.$route.params.jsonUrl+this.behindParams;localStorage.setItem("detailJsonUrl",this.jsonUrl),this.getDetailData(t)}else if(this.$route.query.jsonUrl){o.a.startTime(),this.jsonUrl=this.$route.query.jsonUrl+"&p="+this.$route.query.p+"&k="+this.$route.query.k+"&v="+this.$route.query.v+"&assetId="+this.$route.query.assetId+"&c="+this.$route.query.c;var e=this.jsonUrl+this.behindParams;this.getDetailData(e)}else{var i=localStorage.getItem("detailJsonUrl")+this.behindParams;this.jsonUrl=localStorage.getItem("detailJsonUrl"),this.getDetailData(i)}},mounted:function(){this.startTime=new Date-0},computed:s()({},Object(l.c)(["behindParams","navpos","isShowPlay","isFree","isBought","isFullScreen","ispayplay","videoDetailData"])),components:{detailtop:r.a,VideoPlayer:u.default},watch:{videoDetailData:function(){this.videoDetailData.itemList&&(this.hasData=!0)}},methods:{getDetailData:function(t){var e=this;console.log("获取详情页信息"),n.a.jsonp(t,function(t){if(null==t.data){e.maskShow=!0,e.$store.commit("GET_ISSHOWPLAY",!1);var i=JSON.parse(localStorage.getItem("historyListsr"));if(null!=i){var a=e.$route.params.jsonUrl;i.forEach(function(t,e){-1!=t.jsonUrl.indexOf(a)&&d.a.delHistory(e)})}var s=e.GetRequest(e.$route.params.jsonUrl.split("?")[1]).assetId,o={siteId:d.a.siteId,userId:d.a.userId,collectType:1,relateId:s};return void n.a.post("http://112.18.251.95:7077/uds/cloud/collection/del?version=1",o,function(t){console.log(t),"ok"===t.mes&&console.log("删除收藏成功")})}e.maskShow=!1,e.detailData=t.data,e.$store.commit("GET_VIDEO_DATA",t.data),e.newJump(),0==e.detailData.assetList.length?e.likeShow=!1:e.likeShow=!0})},bigScreenPlay:function(t){var e=this;this.$nextTick(function(){console.log("详情页面大小屏幕切换");var i=e.$refs.videoplayer.currPlayTime||0;t(i),e.$refs.videoplayer.isShow=!0,e.$store.commit("GET_IS_FULL_SCREEN",!0),e.player.toggleFullScreen()})},smallScreenPlay:function(){var t=this;this.$nextTick(function(){t.$refs.videoplayer.isShow=!1,t.$store.commit("GET_IS_FULL_SCREEN",!1),t.player.toggleFullScreen()})},setCurrPlay:function(t){var e=this;this.$nextTick(function(){e.$refs.dl.setCurrPlay(t)})},goCloudPay:function(){var t=this;this.$nextTick(function(){t.$refs.dl.goCloudPay()})},watchOverTip:function(){var t=this;this.$nextTick(function(){t.$refs.dl.watchOverTip()})},openAuthAlert:function(){var t=this;this.$nextTick(function(){t.$refs.dl.openAuthAlert("该节目已经下线!")})},keyCode:function(t){var e=this;"down"!==t&&("up"===t?this.up():"left"===t?this.left():"right"===t?this.right():"KeyEnter"===t?this.enter():"KeyBack"===t&&(console.log("keyback触发了keyback触发了keyback触发了keyback触发了"),this.$store.commit("GET_ISSHOWPLAY",!1),this.$route.params.bp&&this.$route.params.bp.type?this.$nextTick(function(){o.a.routerBack(e.$router,e.$route.params.bp.type)}):this.$nextTick(function(){o.a.routerBack(e.$router,void 0)})))},GetRequest:function(t){for(var e=new Object,i=t.split("&"),a=0;a<i.length;a++)e[i[a].split("=")[0]]=unescape(i[a].split("=")[1]);return e},playVideo:function(){d.a.showVideo(this.jsonUrl)},up:function(){this.isShow=!1,this.lastFocus=this.itemNo,this.itemNo=-1,this.$refs.dl.getKeyListen()},left:function(){0!==this.itemNo&&(this.itemNo>=3&&(this.$refs.contentBox.style.marginLeft=35-251*(this.itemNo-3)+"px"),this.itemNo--)},right:function(){this.itemNo!==this.detailData.assetList.length-1&&++this.itemNo>=4&&(this.$refs.contentBox.style.marginLeft=35-251*(this.itemNo-3)+"px")},enter:function(){localStorage.setItem("BI_recmd_id",3);var t=this.detailData.assetList[this.itemNo].jsonUrl;this.jsonUrl=t;var e=this.detailData.assetList[this.itemNo].layout;this.detailData.assetList[this.itemNo].assetId;this.$store.commit("GET_ISSHOWPLAY",!1),"Game_Zy"==e?(localStorage.setItem("detailJsonUrl",t),this.$store.commit("GET_VIDEO_DATA",[]),this.$store.commit("GET_ISBACK",!1),t+=this.behindParams,this.getDetailData(t),this.$refs.contentBox.style.marginLeft="35px",this.isShow=!1,this.itemNo=-1,this.lastFocus=0,this.$refs.dl.getKeyListen("enter")):(this.setLogJump(),o.a.routerSkip(t,"1",e,{},this.$router));var i={pos_id:"",recmd_id:"3",page_type:"0301",page_id:this.detailData.assetId,cid:this.detailData.assetId,click_type:"1"};h.a.jumpRecommend(i)},newJump:function(){if("jump"==o.a.isJump()){o.a.removeJump();var t={page_type:"0301",page_id:this.detailData.assetId,parent_page_type:o.a.getParentPageType(),parent_page_id:o.a.getParentPageId()};h.a.newJump(t)}},setLogJump:function(){o.a.setJump(),o.a.setParentPageType("0301"),o.a.setParentPageId(this.detailData.assetId)},keepDo:function(t,e,i){if(this.detailData.assetList&&0==this.detailData.assetList.length)return this.$refs.dl.getKeyListen("up"),void(this.isShow=!1);"down"===i&&(this.isShow=!0,this.itemNo=this.lastFocus)}}}}});