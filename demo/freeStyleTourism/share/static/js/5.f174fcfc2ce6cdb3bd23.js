webpackJsonp([5],{"0Leu":function(t,e){},"1BQj":function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a={name:"app_video_label",props:["liveData"],data:function(){return{player:"",live:"",program:"",video:"",playUrl:"",isPoster:1,isPosterPlay:1,isRecommend:0,isPlay:0,num:""}},created:function(){this.init()},mounted:function(){this.video=this.$refs.video;Math.min(document.body.clientWidth,640);var t=larkplayer("vod-player"+this.num);this.player=t},methods:{init:function(){var t=this;this.live=this.liveData;var e=this.live.jsonUrl;this.axios.get(e).then(function(e){console.log(e),t.program=e.data.data.programs[0].startTime+" "+e.data.data.programs[0].programName,t.poster=e.data.data.detail.channelLogo,t.playUrl=e.data.data.detail.livePlayurls[0].playurl,t.player.poster(t.poster),t.player.src(t.playUrl)}).catch(function(t){console.log(t)})},play:function(){this.video.play(),this.isPoster=0,this.isPlay=1,this.showOtherVideo()},showOtherVideo:function(){}},computed:{randomId:function(){for(var t="",e=0;e<6;e++)t+=Math.floor(10*Math.random());return this.num=t,t}}},s={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"feeds_video"},[i("div",{staticClass:"video-wrapper",class:{hide:0==t.isPlay}},[i("div",{staticClass:"video-play"},[i("video",{ref:"video",staticStyle:{"object-fit":"fill"},attrs:{id:"vod-player"+t.randomId,"x5-video-player-type":"h5-page","x-webkit-airplay":"allow",preload:"auto",playsinline:"true","webkit-playsinline":"true","x5-video-player-fullscreen":"false","x5-video-orientation":"portraint",src:"http://1.203.114.102:9010/live/c8f8df0d02cf494fb355caa17c19445e/eccfedf04ba54c1581ae955b8341ebdc.m3u8"}})])]),t._v(" "),i("div",{staticClass:"item_detail"},[i("div",{staticClass:"item_detail_left"},[i("div",{staticClass:"TV_station"},[t._v(t._s(t.live.title))]),t._v(" "),i("div",{staticClass:"program"},[t._v(t._s(t.program))])]),t._v(" "),t._m(0)]),t._v(" "),i("div",{staticClass:"clear"})])},staticRenderFns:[function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"item_detail_right"},[e("img",{staticClass:"live",attrs:{src:i("8RIO"),alt:""}}),this._v(" "),e("div",{staticClass:"living"},[this._v("正在直播")])])}]};var o={name:"",components:{videoLive:i("VU/8")(a,s,!1,function(t){i("FAcl")},"data-v-d8d2ee22",null).exports},props:["jsonUrl"],data:function(){return{initData:"",dataUrl:this.jsonUrl,liveUrl:"",u:0}},created:function(){var t=this;setTimeout(function(){var e=0,i=document.querySelectorAll("video");console.warn(i);for(var a=function(a){i[a].onclick=function(){i[e].pause(),i[a].play(),e=a,t.u=e}},s=0;s<i.length;s++)a(s)},1e3)},beforeRouteLeave:function(t,e,i){document.querySelectorAll("video")[this.u].pause(),setTimeout(function(){i()},200)},mounted:function(){var t=this,e=this.dataUrl;console.log(this),this.axios.get(e).then(function(e){console.log(e),t.initData=e.data.data.comps,t.liveUrl=e.data.data.comps[0].elements}).catch(function(t){console.log(t)})}},l={render:function(){var t=this.$createElement,e=this._self._c||t;return this.initData?e("div",{staticClass:"UTV_box"},this._l(this.liveUrl,function(t,i){return e("videoLive",{key:i,attrs:{liveData:t}})}),1):this._e()},staticRenderFns:[]};var r=i("VU/8")(o,l,!1,function(t){i("0Leu")},"data-v-2b292ace",null);e.default=r.exports},"8RIO":function(t,e){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAEc0lEQVR4Xu2aT2xUVRTGv+9NOy1QaOn0Nf4XDAJKGhvmT2cm1RjdiHHX4IJAYlA2GlesxERFoyvdaBMWaqJRQmwMMRoNupCwmJm2M6WARaKoiStjZ1oqFBzavnfMlJRMx/TNe31O7NBz1+e8e8/vffe8e985hA5HAlQ+zgQUUBWFKCAF5C+JqIJUQaogfwRUQf74aQ5SBd3KChIY8VzoMZBPEFKgYR1L75z63V/I3rxX9BZLZM1nSRwh2FgKSwTnCbsvFS385C3M5VuvWEDdo21t66zgrwDay8MTylvpcP7l5YfszXPFAoqPhB4ISODHynBE7E/T0cI+b2Eu33rFAooOt+8IGg1j/wIE+2g6Uti7/JC9eSqgev3Mq4KqvLn6BCRgeGR9qLml6Xpqe+GKt93szbruAIVzG+8JSsMbJGIArgPySTpSeMdb2O6t6wrQlm/Q1NnZ+R4gzxG8mdhtsfdkooVj7sN2b1lXgJKplk40rTlFcHvFoe1UOpx/1H3Y7i3rClA413F7E5gleOciQCI/p6P5be7Ddm9Zd4CawRzAO8pDtCkXM+H8Vvdhu7dUQLfSZ760xVRBDm9UAVWRuwJSQEsScHWb96UgARM5s5uUAxRuAeU4ijia6nW+qqyar1jsbOvmxtngCYDzxwEBZiB2fzpaOOgkXL+AwjmsDbL9YbECreTsxUxk6gxYmt7bqLmCEllzP4kPyq8oIvh7Onht07mHpseXWq4fQPNXI7NjgDQSgJT+Z09YtA4NhicHvOEBag9oxOw3hC9ULsyi1TcYnjheC0DxnPliAHx30bNFUkXK7pFI4Q8vkGoOKJk13yR5qHJRti27MrH8iVoASgybnxkGn150LQImbVq9g+GJC6seUDJrfk3yyQoQV2HP9aRik+cVUM78iuBTFSCmZ+y5eFYBAUkF5Fz2UUBV6mIKSAEBfg6KqiBVkCoItTxJ6xbTLaZbTLfYwj3o/7jNaw7SHKQ5SHOQ5iAAbpoXNElX6e5QQAoI8FNZXRUKig6btzUaHCRwb0WH2Vg6mu9yqhIkch2vGDAOLy7BiFiQx4cihZNL+Uay67cF2XyhvOBYsrUhH2ci+Wec5kxmzc9J9i22kSmLdrImZZ9EGmsQNI8Q2EfQuFFCFhEDBzI78x86lpBHze5Gi98S6FywE5HT42355C/3l7pllxgDCCQ3mzmS3Tf9gBkReT4TdZ4zftrcZdj8gkBwYa0Qfilri/szOy5P/udln9IDY0MdWxsMHiawG0BeKG+Ptxb6HYMsOZ5EQ3xDaK8hgdcocpcNfGfZsy8N90ydrbbQxJlQjHP8CPPNo5wl5f3ZueKrwz1XJhx9T6Ih0RLaQ/J1gHeLyPe2YR0cCl/64UZ7gPvhqrJa/riuc9i44TLmUr3w1kguMCK51k256F+/uV8e8OAYgq3F0H12U/HSUNfVP734lhoY7Gst60Yfmc578Su39QxouRPVq58CqvLmFJAC8re5VUGqIFWQPwKqIH/8NAepglRB/ghU8f4HYhazhdNx1L0AAAAASUVORK5CYII="},FAcl:function(t,e){}});
//# sourceMappingURL=5.f174fcfc2ce6cdb3bd23.js.map