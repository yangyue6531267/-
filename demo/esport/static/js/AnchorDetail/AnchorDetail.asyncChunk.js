webpackJsonp([13],{"/2Ou":function(t,e,i){"use strict";var n=i("Dd8w"),A=i.n(n),a=i("OK1g"),s=i("NYxO"),o=i("j2NW"),r=(i("xG35"),i("g5qz")),d=i("GSPp");e.a={data:function(){return{detailData:[],isShow:!0,position:0,itemNo:0,lastFocus:-1,tempAssetList:[],tempAssetListLength:0}},created:function(){var t=null;void 0!=this.$route.params.jsonUrl?(t=this.$route.params.jsonUrl+this.behindParams,this.itemNo=0,this.position=0,this.tempAssetListLength=0,localStorage.setItem("detailJsonUrl",this.$route.params.jsonUrl)):this.$route.query.jsonUrl?(r.a.startTime(),this.jsonUrl=this.$route.query.jsonUrl+"&p="+this.$route.query.p+"&k="+this.$route.query.k+"&v="+this.$route.query.v+"&assetId="+this.$route.query.assetId+"&c="+this.$route.query.c,t=this.jsonUrl+this.behindParams,localStorage.setItem("detailJsonUrl",this.jsonUrl)):t=localStorage.getItem("detailJsonUrl")+this.behindParams,this.getDetailData(t)},activated:function(){var t=null;void 0!=this.$route.params.jsonUrl?(t=this.$route.params.jsonUrl+this.behindParams,this.itemNo=0,this.position=0,this.tempAssetListLength=0):(console.warn(this.$route.query),this.jsonUrl=this.$route.query.jsonUrl+"&p="+this.$route.query.p+"&k="+this.$route.query.k+"&v="+this.$route.query.v+"&assetId="+this.$route.query.assetId+"&c="+this.$route.query.c,t=this.jsonUrl+this.behindParams,console.warn(t)),this.getDetailData(t)},mounted:function(){},computed:A()({},Object(s.c)(["behindParams","navpos"])),components:{detailMoreIntroduction:o.a},methods:{getDetailData:function(t){var e=this;console.log("获取详情页信息"),a.a.jsonp(t,function(t){console.log(t),e.detailData=t.data,e.newJump(),e.detailData.assetList?e.tempAssetList=e.split_array(e.detailData.assetList,6):(e.tempAssetList=[],e.position=-1,e.itemNo=-1)})},keyCode:function(t){if("down"===t)this.down();else if("up"===t)this.up();else if("left"===t){if(-1===this.position)return;this.left()}else if("right"===t){if(-1===this.position)return;this.right()}else"KeyEnter"===t?this.enter():"KeyBack"===t&&(this.$store.commit("GET_ISSHOWPLAY",!1),this.$route.params.bp&&this.$route.params.bp.type?r.a.routerBack(this.$router,this.$route.params.bp.type):r.a.routerBack(this.$router,void 0))},up:function(){-1!==this.position&&(this.itemNo%3==0?(this.position=-1,this.lastFocus=this.itemNo,this.itemNo=-1):this.itemNo--)},down:function(){if(-1===this.position){if(0==this.tempAssetList.length)return;this.position=0,this.itemNo=this.lastFocus}else{if(this.itemNo>=this.tempAssetList[this.tempAssetListLength].length-1)return;this.itemNo++}},split_array:function(t,e){for(var i=t.length,n=[],A=0;A<i;A+=e)n.push(t.slice(A,A+e));return n},left:function(){if(this.itemNo<3){if(this.tempAssetListLength<=0)return;this.itemNo+=3,this.tempAssetListLength--}else this.itemNo-=3},right:function(){if(this.itemNo>=3){if(this.tempAssetListLength>=this.tempAssetList.length-1)return;this.tempAssetListLength++,this.itemNo-=3}else this.itemNo+=3;this.itemNo>=this.tempAssetList[this.tempAssetListLength].length-1&&(this.itemNo=this.tempAssetList[this.tempAssetListLength].length-1)},enter:function(){if(-1===this.position)this.isShow=!1,this.$refs.detailM.getKeyListen(!1);else{var t=this.tempAssetList[this.tempAssetListLength][this.itemNo].jsonUrl,e=this.tempAssetList[this.tempAssetListLength][this.itemNo].layout;r.a.setParentPageType("0401"),r.a.setParentPageId(this.detailData.actorId),r.a.setJump(),r.a.routerSkip(t,"1",e,{type:"anchorDetail"},this.$router)}},keepDo:function(t,e){"introduction"===t&&(this.isShow=!0)},newJump:function(){if("jump"==r.a.isJump()){r.a.removeJump();var t={page_type:"0401",page_id:this.detailData.actorId,parent_page_type:r.a.getParentPageType(),parent_page_id:r.a.getParentPageId()};d.a.newJump(t)}}}}},Tf86:function(t,e,i){var n=i("gwms");"string"==typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);i("rjj0")("2167376e",n,!0)},bQZZ:function(t,e,i){t.exports=i.p+"static/img/anchor-detail-bg.c9dfa06.png"},gwms:function(t,e,i){e=t.exports=i("FZ+f")(!0),e.push([t.i,".anchor-detail[data-v-d7ff2c8c]{width:1280px;height:720px;background:url("+i("bQZZ")+");overflow:hidden}.anchor-detail .title[data-v-d7ff2c8c]{position:relative;left:-20px;display:block;width:254px;height:58px;background:#002d50;line-height:58px;font-size:25px;font-weight:300;text-align:center;-webkit-transform:skewX(-30deg);transform:skewX(-30deg)}.title h3[data-v-d7ff2c8c]{-webkit-transform:skewX(30deg);transform:skewX(30deg)}.details[data-v-d7ff2c8c]{width:662px;height:272px;position:relative;left:400px;top:-50px}.details .img[data-v-d7ff2c8c]{width:341px;height:515px;position:absolute;left:-379px;top:76px}.details .img img[data-v-d7ff2c8c]{width:100%;height:100%}.text-box[data-v-d7ff2c8c]{display:inline-block;height:100px;margin-top:20px;margin-left:10px}.text-box p[data-v-d7ff2c8c]{padding-bottom:10px;margin-bottom:10px;border-bottom:2px solid hsla(0,0%,100%,.3);line-height:36px;font-size:30px}.text-box span[data-v-d7ff2c8c]{font-size:18px;line-height:22px}.collection[data-v-d7ff2c8c]{width:200px;height:64px;position:absolute;top:160px;left:25px;background:url("+i("rdUz")+')}.introduction[data-v-d7ff2c8c]{width:500px;height:90px;position:absolute;left:40px;top:78px}.introduction .word[data-v-d7ff2c8c]{margin-top:28px;margin-left:17px;width:430px;height:60px;font-size:20px;line-height:30px;overflow:hidden}.introduction .word .text[data-v-d7ff2c8c]{width:430px;height:60px;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}.introduction span[data-v-d7ff2c8c]{display:block;content:"";width:76px;height:43px;position:absolute;bottom:-14px;right:0;background:url('+i("AlPF")+")}.introduction span.active[data-v-d7ff2c8c]{background:url("+i("kjz8")+")}.content-left[data-v-d7ff2c8c]{position:relative;left:200px;top:-55px}.content-left ul li[data-v-d7ff2c8c]{width:335px;height:64px;margin-bottom:20px;background:rgba(0,45,80,.8);line-height:58px;font-size:25px;font-weight:300;text-align:center;-webkit-transform:skewX(-30deg);transform:skewX(-30deg)}.content-left span[data-v-d7ff2c8c]{display:block;-webkit-transform:skewX(30deg);transform:skewX(30deg)}.content-right[data-v-d7ff2c8c]{width:500px;height:480px;position:absolute;top:230px;left:500px;overflow:hidden}.content-right[data-v-d7ff2c8c],.content-right ul[data-v-d7ff2c8c]{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column;-ms-flex-wrap:wrap;flex-wrap:wrap}.content-right ul[data-v-d7ff2c8c]{margin-left:0;-webkit-transition:all .5s;transition:all .5s}.left[data-v-d7ff2c8c]{background:url("+i("AwiB")+");left:370px}.left[data-v-d7ff2c8c],.right[data-v-d7ff2c8c]{width:66px;height:66px;position:absolute;top:140px}.right[data-v-d7ff2c8c]{background:url("+i("AwiB")+");left:990px;-webkit-transform:rotate(180deg);transform:rotate(180deg)}.content-right ul li[data-v-d7ff2c8c]{width:231px;height:130px;margin-right:25px;margin-bottom:25px;background:url("+i("IeHd")+");position:relative}.content-right ul li div[data-v-d7ff2c8c],.content-right ul li div img[data-v-d7ff2c8c]{width:100%;height:100%}.content-right ul li div span.active[data-v-d7ff2c8c]{position:absolute;top:0;left:0;display:block;width:100%;height:100%;z-index:99;background:url("+i("BO1M")+") no-repeat;background-size:100% 100%;text-align:center;font-size:22px;line-height:130px;overflow:hidden}","",{version:3,sources:["E:/Bitbucket/CMCC/android_luncher_esports/src/page/detail/AnchorDetail/anchor-detail.vue"],names:[],mappings:"AACA,gCACE,aAAc,AACd,aAAc,AACd,yCAA+D,AAC/D,eAAiB,CAClB,AACD,uCACE,kBAAmB,AACnB,WAAY,AACZ,cAAe,AACf,YAAa,AACb,YAAa,AACb,mBAAoB,AACpB,iBAAkB,AAClB,eAAgB,AAChB,gBAAiB,AACjB,kBAAmB,AACnB,gCAAiC,AACzB,uBAAwB,CACjC,AACD,2BACE,+BAAgC,AACxB,sBAAuB,CAChC,AACD,0BAEE,YAAa,AACb,aAAc,AACd,kBAAmB,AACnB,WAAY,AACZ,SAAU,CACX,AACD,+BACE,YAAa,AACb,aAAc,AACd,kBAAmB,AACnB,YAAa,AACb,QAAU,CACX,AACD,mCACE,WAAY,AACZ,WAAa,CACd,AACD,2BACE,qBAAsB,AACtB,aAAc,AACd,gBAAiB,AACjB,gBAAkB,CACnB,AACD,6BACE,oBAAqB,AACrB,mBAAoB,AACpB,2CAAkD,AAClD,iBAAkB,AAClB,cAAgB,CACjB,AACD,gCACE,eAAgB,AAChB,gBAAkB,CACnB,AACD,6BACE,YAAa,AACb,YAAa,AACb,kBAAmB,AACnB,UAAW,AACX,UAAW,AACX,wCAAwD,CACzD,AACD,+BACE,YAAa,AACb,YAAa,AACb,kBAAmB,AACnB,UAAW,AACX,QAAU,CACX,AACD,qCACE,gBAAiB,AACjB,iBAAkB,AAClB,YAAa,AACb,YAAa,AACb,eAAgB,AAChB,iBAAkB,AAClB,eAAiB,CAClB,AACD,2CACE,YAAa,AACb,YAAa,AACb,uBAAwB,AACxB,oBAAqB,AACrB,qBAAsB,AACtB,2BAA6B,CAC9B,AACD,oCACE,cAAe,AACf,WAAY,AACZ,WAAY,AACZ,YAAa,AACb,kBAAmB,AACnB,aAAc,AACd,QAAW,AACX,wCAAgE,CACjE,AACD,2CACE,wCAAuE,CACxE,AACD,+BACE,kBAAmB,AACnB,WAAY,AACZ,SAAW,CACZ,AACD,qCACE,YAAa,AACb,YAAa,AACb,mBAAoB,AACpB,4BAAiC,AACjC,iBAAkB,AAClB,eAAgB,AAChB,gBAAiB,AACjB,kBAAmB,AACnB,gCAAiC,AACzB,uBAAwB,CACjC,AACD,oCACE,cAAe,AACf,+BAAgC,AACxB,sBAAuB,CAChC,AACD,gCACE,YAAa,AACb,aAAc,AACd,kBAAmB,AACnB,UAAW,AACX,WAAY,AAUZ,eAAiB,CAClB,AACD,mEAXE,oBAAqB,AACrB,oBAAqB,AACrB,aAAc,AACd,4BAA6B,AAC7B,6BAA8B,AAC1B,0BAA2B,AACvB,sBAAuB,AAC/B,mBAAoB,AAChB,cAAgB,CAgBrB,AAbD,mCACE,cAAe,AAUf,2BAA6B,AAC7B,kBAAqB,CACtB,AACD,uBAGE,yCAA8D,AAG9D,UAAY,CACb,AACD,+CAPE,WAAY,AACZ,YAAa,AAEb,kBAAmB,AACnB,SAAW,CAYZ,AATD,wBAGE,yCAA8D,AAG9D,WAAY,AACZ,iCAAkC,AAC1B,wBAAyB,CAClC,AACD,sCACE,YAAa,AACb,aAAc,AACd,kBAAmB,AACnB,mBAAoB,AACpB,yCAA0D,AAC1D,iBAAmB,CACpB,AAKD,wFACE,WAAY,AACZ,WAAa,CACd,AACD,sDACE,kBAAmB,AACnB,MAAO,AACP,OAAQ,AACR,cAAe,AACf,WAAY,AACZ,YAAa,AACb,WAAY,AACZ,mDAA2E,AAC3E,0BAA2B,AAC3B,kBAAmB,AACnB,eAAgB,AAChB,kBAAmB,AACnB,eAAiB,CAClB",file:"anchor-detail.vue",sourcesContent:['\n.anchor-detail[data-v-d7ff2c8c] {\n  width: 1280px;\n  height: 720px;\n  background: url("../../../assets/detail/anchor-detail-bg.png");\n  overflow: hidden;\n}\n.anchor-detail .title[data-v-d7ff2c8c] {\n  position: relative;\n  left: -20px;\n  display: block;\n  width: 254px;\n  height: 58px;\n  background: #002D50;\n  line-height: 58px;\n  font-size: 25px;\n  font-weight: 300;\n  text-align: center;\n  -webkit-transform: skewX(-30deg);\n          transform: skewX(-30deg)\n}\n.title h3[data-v-d7ff2c8c] {\n  -webkit-transform: skewX(30deg);\n          transform: skewX(30deg)\n}\n.details[data-v-d7ff2c8c] {\n  position: relative;\n  width: 662px;\n  height: 272px;\n  position: relative;\n  left: 400px;\n  top: -50px\n}\n.details .img[data-v-d7ff2c8c] {\n  width: 341px;\n  height: 515px;\n  position: absolute;\n  left: -379px;\n  top: 76px;\n}\n.details .img img[data-v-d7ff2c8c]{\n  width: 100%;\n  height: 100%;\n}\n.text-box[data-v-d7ff2c8c] {\n  display: inline-block;\n  height: 100px;\n  margin-top: 20px;\n  margin-left: 10px;\n}\n.text-box p[data-v-d7ff2c8c] {\n  padding-bottom: 10px;\n  margin-bottom: 10px;\n  border-bottom: 2px solid rgba(255, 255, 255, 0.3);\n  line-height: 36px;\n  font-size: 30px;\n}\n.text-box span[data-v-d7ff2c8c] {\n  font-size: 18px;\n  line-height: 22px;\n}\n.collection[data-v-d7ff2c8c] {\n  width: 200px;\n  height: 64px;\n  position: absolute;\n  top: 160px;\n  left: 25px;\n  background: url("../../../assets/detail/collected.png");\n}\n.introduction[data-v-d7ff2c8c] {\n  width: 500px;\n  height: 90px;\n  position: absolute;\n  left: 40px;\n  top: 78px;\n}\n.introduction .word[data-v-d7ff2c8c] {\n  margin-top: 28px;\n  margin-left: 17px;\n  width: 430px;\n  height: 60px;\n  font-size: 20px;\n  line-height: 30px;\n  overflow: hidden;\n}\n.introduction .word .text[data-v-d7ff2c8c]{\n  width: 430px;\n  height: 60px;\n  text-overflow: ellipsis;\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n}\n.introduction span[data-v-d7ff2c8c] {\n  display: block;\n  content: "";\n  width: 76px;\n  height: 43px;\n  position: absolute;\n  bottom: -14px;\n  right: 0px;\n  background: url("../../../assets/detail/more-introduction.png");\n}\n.introduction span.active[data-v-d7ff2c8c] {\n  background: url("../../../assets/detail/more-introduction-active.png");\n}\n.content-left[data-v-d7ff2c8c] {\n  position: relative;\n  left: 200px;\n  top: -55px;\n}\n.content-left ul li[data-v-d7ff2c8c] {\n  width: 335px;\n  height: 64px;\n  margin-bottom: 20px;\n  background: rgba(0, 45, 80, 0.8);\n  line-height: 58px;\n  font-size: 25px;\n  font-weight: 300;\n  text-align: center;\n  -webkit-transform: skewX(-30deg);\n          transform: skewX(-30deg)\n}\n.content-left span[data-v-d7ff2c8c] {\n  display: block;\n  -webkit-transform: skewX(30deg);\n          transform: skewX(30deg)\n}\n.content-right[data-v-d7ff2c8c] {\n  width: 500px;\n  height: 480px;\n  position: absolute;\n  top: 230px;\n  left: 500px;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  -ms-flex-wrap: wrap;\n      flex-wrap: wrap;\n  overflow: hidden;\n}\n.content-right ul[data-v-d7ff2c8c] {\n  margin-left: 0;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  -ms-flex-wrap: wrap;\n      flex-wrap: wrap;\n  -webkit-transition: all 0.5s;\n  transition: all 0.5s;\n}\n.left[data-v-d7ff2c8c] {\n  width: 66px;\n  height: 66px;\n  background: url(\'../../../assets/search/icons_dark_next.png\');\n  position: absolute;\n  top: 140px;\n  left: 370px;\n}\n.right[data-v-d7ff2c8c] {\n  width: 66px;\n  height: 66px;\n  background: url(\'../../../assets/search/icons_dark_next.png\');\n  position: absolute;\n  top: 140px;\n  left: 990px;\n  -webkit-transform: rotate(180deg);\n          transform: rotate(180deg)\n}\n.content-right ul li[data-v-d7ff2c8c] {\n  width: 231px;\n  height: 130px;\n  margin-right: 25px;\n  margin-bottom: 25px;\n  background: url("../../../assets/detail/img_230x130.png");\n  position: relative;\n}\n.content-right ul li div[data-v-d7ff2c8c] {\n  width: 100%;\n  height: 100%;\n}\n.content-right ul li div img[data-v-d7ff2c8c] {\n  width: 100%;\n  height: 100%;\n}\n.content-right ul li div span.active[data-v-d7ff2c8c] {\n  position: absolute;\n  top: 0;\n  left: 0;\n  display: block;\n  width: 100%;\n  height: 100%;\n  z-index: 99;\n  background: url("../../../assets/detail/img_230x130_active.png") no-repeat;\n  background-size: 100% 100%;\n  text-align: center;\n  font-size: 22px;\n  line-height: 130px;\n  overflow: hidden;\n}\n'],sourceRoot:""}])},n9d9:function(t,e,i){"use strict";function n(t){i("Tf86")}Object.defineProperty(e,"__esModule",{value:!0});var A=i("/2Ou"),a=i("wSpY"),s=i("VU/8"),o=n,r=s(A.a,a.a,!1,o,"data-v-d7ff2c8c",null);e.default=r.exports},wSpY:function(t,e,i){"use strict";var n=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"anchor-detail"},[t._m(0),t._v(" "),i("div",{staticClass:"detail-top"},[i("div",{staticClass:"details"},[i("div",{staticClass:"img"},[i("img",{attrs:{src:t.detailData.backgroundImg,alt:""}})]),t._v(" "),i("div",{staticClass:"text-box"},[i("p",[t._v(t._s(t.detailData.actorName))])]),t._v(" "),i("div",{staticClass:"introduction"},[i("div",{staticClass:"word"},[i("p",{staticClass:"text"},[t._v(t._s(t.detailData.introduce))])]),t._v(" "),i("span",{class:{active:-1===t.position}})])])]),t._v(" "),i("div",{staticClass:"detail-content"},[i("div",{staticClass:"content-left"},[i("ul",[i("div",{directives:[{name:"show",rawName:"v-show",value:t.tempAssetListLength>0,expression:"tempAssetListLength>0"}],staticClass:"left"}),t._v(" "),i("div",{directives:[{name:"show",rawName:"v-show",value:t.tempAssetListLength<t.tempAssetList.length-1,expression:"tempAssetListLength<tempAssetList.length-1"}],staticClass:"right"})])]),t._v(" "),i("div",{staticClass:"content-right"},[i("ul",{ref:"contentBox"},t._l(t.tempAssetList[t.tempAssetListLength],function(e,n){return i("li",{key:n,attrs:{id:"box-"+n}},[i("div",[i("img",{attrs:{src:e.assetImgH,alt:""}}),i("span",{directives:[{name:"show",rawName:"v-show",value:n===t.itemNo,expression:"index===itemNo"}],class:{active:n===t.itemNo}},[t._v(t._s(e.assetName))])])])}))])]),t._v(" "),i("detailMoreIntroduction",{ref:"detailM",attrs:{isAlert:t.detailData.introduce},on:{pressDown:t.keepDo}}),t._v(" "),t.isShow?i("keyDo",{ref:"keydo",on:{listenKeyCode:t.keyCode}}):t._e()],1)},A=[function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"title"},[i("h3",[t._v("主播详情")])])}],a={render:n,staticRenderFns:A};e.a=a}});
//# sourceMappingURL=AnchorDetail.asyncChunk.js.map