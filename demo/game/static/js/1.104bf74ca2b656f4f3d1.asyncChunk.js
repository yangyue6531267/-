webpackJsonp([1],{"+Mlu":function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=i("ctJm"),a={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"sizer"},[i("p",{staticClass:"sizer-title"},[t._v("视频分类")]),t._v(" "),i("div",{staticClass:"page"},[t._v("第"),i("span",[t._v(t._s(t.pageNum))]),t._v("页")]),t._v(" "),i("div",{staticClass:"sizer-left"},[i("div",{staticClass:"categoryBox"},[i("ul",t._l(t.category,function(e,s){return i("li",{key:s},[t._v(t._s(e.categoryName))])})),t._v(" "),i("div",{staticClass:"active"})])]),t._v(" "),i("div",{staticClass:"sizer-right"},[i("ul",t._l(t.videoList,function(e,s){return i("li",{key:s},[i("lazy-image",{attrs:{src:e.assetImg,placeholder:t.placeholder,imgClass:t.round,initScore:t.initScore,title:e.assetName,score:e.score}})],1)}))]),t._v(" "),t._m(0),t._v(" "),t.isShow?i("keyDo",{ref:"keyDo",on:{listenKeyCode:t.keyCode}}):t._e()],1)},staticRenderFns:[function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"search-scroll"},[e("div",{staticClass:"search-bar"})])}]};var o=function(t){i("aHUm"),i("HsoH")},r=i("VU/8")(s.a,a,!1,o,"data-v-b8a9b28a",null);e.default=r.exports},HsoH:function(t,e){},aHUm:function(t,e){},ctJm:function(t,e,i){"use strict";(function(t){var s=i("Dd8w"),a=i.n(s),o=i("NYxO"),r=i("OK1g"),h=i("luaM"),c=i("psq8"),n=i.n(c);e.a={name:"sizer",props:["catCode","categoryName","catId"],data:function(){return{category:[{categoryName:"CG动画",categoryId:"1499654521269784714",catCode:""},{categoryName:"网络游戏",categoryId:"1499654442597670738",catCode:""},{categoryName:"手机游戏",categoryId:"1499654475198688880",catCode:""},{categoryName:"单机游戏",categoryId:"1499654488381787868",catCode:""},{categoryName:"主机游戏",categoryId:"1499654495939201751",catCode:""},{categoryName:"CG动画",categoryId:"1499654521269784714",catCode:""}],videoList:[],isShow:!0,pos:0,itemNo:0,pageSize:10,pageIndex:0,placeholder:i("BL9n"),initScore:i("R9pJ"),round:"round",pageNum:1,scrollBar:90,movePercent:0,timer:0,firstLoad:!0,ajaxLoad:!0}},activated:function(){this.$store.commit("GET_HTTPRESPONSETIME",(new Date).getTime()),this.removeCss(),this.pos=0,this.itemNo=0,this.addCss(),this.pageIndex=0,this.pageSize=10,this.videoList=[],this.init();try{var t=this.httpResponseTime-this.startTime;this.firstLoad&&(this.firstLoad=!1);var e="|"+this.catId+"|";h.a.loadPage(e,"|1|9|",9,0,1,this.catId,0,t)}catch(t){console.log(t)}},created:function(){this.init()},methods:{init:function(){var t=this.category[3].categoryId;this.getSearchResults(t)},getSearchResults:function(e){var i=this;r.a.getFilterResult(e,this.pageIndex,this.pageSize).then(function(e){i.videoList=e.data.assetList,i.pageNum=1,i.scrollBar=90,i.movePercent=0,i.$nextTick(function(){t(".search-bar").stop(!1,!0).animate({top:"-1%"}),i.$lazyImages.loadImage()})})},getNextPage:function(t){this.ajaxLoad=!1;var e=this,i=this.category[3].categoryId;r.a.getFilterResult(i,t,this.pageSize).then(function(t){e.videoList=t.data.assetList,e.ajaxLoad=!0,e.$nextTick(function(){e.$lazyImages.loadImage(),e.addCss()})})},keyCode:function(e){if("down"==e){if(t(".sizer-left ul").is(":animated"))return;this.down()}else if("up"==e){if(t(".sizer-left ul").is(":animated"))return;this.up()}else if("left"==e)this.left();else if("right"==e)this.right();else if("KeyEnter"==e){try{this.videoList[this.itemNo].assetId;void 0==this.catCode&&(this.catCode=0),void 0==this.catId&&(this.catId=0);var i="|"+this.catId+"|";h.a.shaixuan(this.category[3].categoryId,i,"|1|9|",1,this.catId,"",9,0)}catch(t){console.log(t)}var s=this.videoList[this.itemNo].jsonUrl;this.$router.push({name:"GamePages",params:{jsonUrl:s}})}else"KeyBack"==e&&this.$router.go(-1)},left:n.a.debounce(function(){1==this.pos&&(this.removeCss(),0==this.itemNo||5==this.itemNo?this.pos=0:this.itemNo--,this.addCss())},300),right:n.a.debounce(function(){if(0==this.pos)this.removeCss(),this.pos=1,this.itemNo=0,this.addCss();else if(1==this.pos){if(this.itemNo==this.videoList.length-1)return;if(9==this.itemNo)return;this.removeCss(),this.itemNo++,this.addCss()}},300),up:n.a.debounce(function(){if(0==this.pos){this.pageIndex=0;var e=this,i=this.category[this.category.length-2];t(".sizer-left ul").stop(!1,!0).animate({top:"0px"},250,function(){e.category.pop(),e.category.unshift(i),t(".sizer-left ul").css("top","-87px");var s=e.category[3].categoryId;e.getSearchResults(s)})}else if(1==this.pos)if(this.removeCss(),this.itemNo<5&&this.pageIndex>0){if(this.ajaxLoad){if(this.pageIndex-=10,this.getNextPage(this.pageIndex),this.itemNo=0,this.pageNum--,this.movePercent=this.movePercent-this.scrollBar,this.scrollBar=Math.ceil(2*this.scrollBar),this.scrollBar>=50)return t(".search-bar").stop(!1,!0).animate({top:"-1%"}),void this.addCss();t(".search-bar").stop(!1,!0).animate({top:this.movePercent+"%"})}}else this.itemNo>4?(this.itemNo-=5,this.addCss()):this.itemNo<4&&1===this.pageNum&&this.addCss()},300),down:n.a.debounce(function(){if(0==this.pos){this.pageIndex=0;var e=this;this.category.push(this.category[1]),t(".sizer-left ul").stop(!1,!0).animate({top:"-174px"},250,function(){e.category.shift(),t(".sizer-left ul").css("top","-87px");var i=e.category[3].categoryId;e.getSearchResults(i)})}else if(1==this.pos)if(this.removeCss(),this.itemNo>4){if(this.ajaxLoad){if(this.itemNo<=this.videoList.length-1&&this.videoList.length<10)return void this.addCss();this.pageIndex+=10,this.getNextPage(this.pageIndex),this.itemNo=0,this.pageNum++,this.scrollBar=Math.ceil(this.scrollBar/2),this.movePercent=this.movePercent+this.scrollBar,t(".search-bar").stop(!1,!0).animate({top:this.movePercent+"%"})}}else this.itemNo<5&&this.videoList.length>5?(this.itemNo+=5,this.itemNo>this.videoList.length-1&&(this.itemNo-=5),this.addCss()):this.itemNo<5&&this.videoList.length<=5&&this.addCss()},300),addCss:function(){if(1==this.pos){if(t(".sizer-right li").eq(this.itemNo).addClass("hover"),t(".sizer-right li:eq("+this.itemNo+") .s-title-name").text().length>=9){var e=".sizer-right li",i=this,s=document.querySelectorAll(e+" .s-title")[this.itemNo],a=document.querySelectorAll(e+" .s-title-name")[this.itemNo],o=document.querySelectorAll(e+" .s-title-temp")[this.itemNo];s.style.textOverflow="clip",o.innerHTML=a.innerHTML,this.timer=setInterval(function(){i.Marquee(s,a,o)},50)}}else t(".active").show()},removeCss:function(){if(1==this.pos){if(t(".sizer-right li").eq(this.itemNo).removeClass("hover"),0!=this.timer){clearInterval(this.timer),this.timer=0;var e=".sizer-right li",i=document.querySelectorAll(e+" .s-title")[this.itemNo];document.querySelectorAll(e+" .s-title-temp")[this.itemNo].innerHTML="",i.scrollLeft=0,i.style.textOverflow="ellipsis"}}else t(".active").hide()},Marquee:function(t,e,i){var s=0;i.offsetWidth-t.scrollLeft<=0?t.scrollLeft=0:(s=t.scrollLeft,t.scrollLeft++,s==t.scrollLeft&&(t.scrollLeft=0))}},computed:a()({},Object(o.b)(["rootPath","catList","behindParams","isHTTPS","startTime","httpRequestTime","httpResponseTime"])),beforeRouteLeave:function(t,e,i){try{console.log("开始时间被重置"+this.startTime);var s;s=(new Date).getTime()-this.httpResponseTime,void 0==this.catCode&&(this.catCode=0),void 0==this.catId&&(this.catId=0);var a="|"+this.catId+"|";this.$store.commit("GET_STARTTIME",(new Date).getTime()),h.a.closPage(a,"|1|9|",9,0,1,this.catId,0,s),console.log("页面停留时间："+s+"^^^^^^^focusId:"+this.catId)}catch(t){console.log(t)}finally{i()}}}}).call(e,i("7t+N"))}});
//# sourceMappingURL=1.104bf74ca2b656f4f3d1.asyncChunk.js.map