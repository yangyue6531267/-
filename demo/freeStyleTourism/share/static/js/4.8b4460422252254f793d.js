webpackJsonp([4],{HGop:function(t,e){},NaGH:function(t,e){},X3L6:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=i("XHv2"),a={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"container"},[i("div",{staticClass:"content"},[i("div",{staticClass:"content_title"},[t._v("观看视频时长"),i("div",{staticClass:"time_yi"},[t._v("已兑换时长："+t._s(t.yeffectTime)+"分钟")])]),t._v(" "),i("div",{ref:"content_bar",staticClass:"content_bar"},[i("div",{ref:"bar_me",staticClass:"bar_me"}),t._v(" "),i("div",{ref:"bar_friend",staticClass:"bar_friend"})]),t._v(" "),i("div",{staticClass:"content_time"},[t._m(0),t._v(" "),t._m(1),t._v(" "),i("div",{staticClass:"time_ke"},[t._v("可兑换时长："+t._s(t.effectTime)+"分钟")])]),t._v(" "),t._m(2),t._v(" "),i("ul",{staticClass:"content_box"},[i("li",{class:{box_lq:t.effectTime>=1&&t.exchangeNum<10,box_ylq:t.effectTime<1||t.exchangeNum>=10},on:{click:function(e){return t.receive(t.sku1)}}},[t._m(3),t._v(" "),i("span",[t._v("领取")])]),t._v(" "),i("li",{class:{box_lq:t.effectTime>=2&&t.exchangeNum<9,box_ylq:t.effectTime<2||t.exchangeNum>=9},on:{click:function(e){return t.receive(t.sku2)}}},[t._m(4),t._v(" "),i("span",[t._v("领取")])]),t._v(" "),i("li",{class:{box_lq:t.effectTime>=5&&t.exchangeNum<6,box_ylq:t.effectTime<5||t.exchangeNum>=6},on:{click:function(e){return t.receive(t.sku3)}}},[t._m(5),t._v(" "),i("span",[t._v("领取")])]),t._v(" "),i("li",{class:{box_lq:t.effectTime>=10&&t.exchangeNum<1,box_ylq:t.effectTime<10||t.exchangeNum>=1},on:{click:function(e){return t.receive(t.sku4)}}},[t._m(6),t._v(" "),i("span",[t._v("领取")])])])]),t._v(" "),i("div",{staticClass:"background",class:{hide:t.hide}}),t._v(" "),i("div",{staticClass:"notice",class:{hide:t.hide}},[i("div",{staticClass:"notice_explain"},[t._v("恭喜您兑换无忧币成功")]),t._v(" "),i("div",{staticClass:"notice_notes"},[t._v("再接再厉，更多无忧币等您领取")])]),t._v(" "),i("div",{staticClass:"notice_enter",class:{hide:t.hide},on:{click:t.enter}})])},staticRenderFns:[function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"time_me"},[e("i"),e("span",[this._v("本人观看时长")])])},function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"time_friend"},[e("i"),e("span",[this._v("好友贡献时长")])])},function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"free_coin"},[e("span",[this._v("行")])])},function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"flow"},[e("div",{staticClass:"flow_up"},[this._v("1分钟")]),this._v(" "),e("div",{staticClass:"flow_down"},[e("img",{attrs:{src:i("peQQ"),alt:""}}),this._v(" X 1")])])},function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"flow"},[e("div",{staticClass:"flow_up"},[this._v("2分钟")]),this._v(" "),e("div",{staticClass:"flow_down"},[e("img",{attrs:{src:i("peQQ"),alt:""}}),this._v(" X 2")])])},function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"flow"},[e("div",{staticClass:"flow_up"},[this._v("5分钟")]),this._v(" "),e("div",{staticClass:"flow_down"},[e("img",{attrs:{src:i("peQQ"),alt:""}}),this._v(" X 5")])])},function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"flow"},[e("div",{staticClass:"flow_up"},[this._v("10分钟")]),this._v(" "),e("div",{staticClass:"flow_down"},[e("img",{attrs:{src:i("peQQ"),alt:""}}),this._v(" X 10")])])}]};var n=function(t){i("NaGH")},c={components:{Reward:i("VU/8")(s.a,a,!1,n,"data-v-7a1a8328",null).exports},data:function(){return{dataUrl:"",fromPage:""}},props:["jsonUrl"],beforeRouteEnter:function(t,e,i){i(function(t){t.from(e.path)})},beforeRouteLeave:function(t,e,i){i()},created:function(){!function(){var t=document.createElement("script");t.src="https://hm.baidu.com/hm.js?4926cf3d2b853ff341b5b083520ef6a1";var e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(t,e)}(),window.scrollTo(0,0)},mounted:function(){this.dataUrl=this.$route.params.jsonUrl},methods:{back:function(){if("/index/recommend"==this.fromPage)this.$router.push({path:this.fromPage});else{var t=this.$route.params.jsonUrl;this.$router.push({name:"detail",params:{jsonUrl:t}})}},from:function(t){this.fromPage=t}}},r={render:function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"container"},[e("div",{staticClass:"activity_header"}),this._v(" "),e("div",{staticClass:"activity_container"},[this._m(0),this._v(" "),e("div",{staticClass:"container_middle"},[e("Reward")],1),this._v(" "),this._m(1)])])},staticRenderFns:[function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"container_top"},[e("div",{staticClass:"container_top_title"},[this._v("看精彩视频，领无忧好礼")]),this._v(" "),e("div",{staticClass:"container_top_content"},[this._v("观看视频累积时长达活动指定条件，即可领取对应的无忧币换领无忧好礼啦！详情见活动规则。")])])},function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"container_bottom"},[i("div",{staticClass:"container_bottom_title"},[t._v("活动规则")]),t._v(" "),i("div",{staticClass:"container_bottom_content"},[t._v("\n        1. 此活动仅针对无忧行APP注册用户（以下简称“用户”）；\n        "),i("br"),t._v("\n        2. 用户在无忧行看世界页面观看视频达指定时长即可领取无忧币；\n        "),i("br"),t._v("\n        3. 每日观看视频累计达1分钟，可领取1个无忧币；每日观看视频累计达2分钟，可领取2个无忧币；每日观看视频累计达5分钟，可领取5个无忧币；每日观看视频累计达10分钟，可领取10个无忧币；\n        "),i("br"),t._v("\n        4. 每位用户于活动期间每日领取上限为10个无忧币；\n        "),i("br"),t._v("\n        5. 用户分享视频给好友，好友观看时长的10%将同步计入分享者的观看时长；\n        "),i("br"),t._v("\n        6. 每日未兑换或超出当日兑换上限的观看时长，将于次日凌晨12时（北京时间）清零；\n        "),i("br"),t._v("\n        7. 爱奇艺和芒果TV跳转观看时长不计入；\n        "),i("br"),t._v("\n        8. 用户可于“无忧行APP > 我的 > 无忧币”查看及兑换相应礼品，此活动无忧币兑换条件与细则遵循无忧行APP相关规定；\n        "),i("br"),t._v("\n        9. 活动结束时间为2020年1月31日，无忧币限量发放，领完即止，恕不另行通知；\n        "),i("br"),t._v("\n        10.此活动最终解释权归中国移动国际有限公司所有。\n      ")])])}]};var o=i("VU/8")(c,r,!1,function(t){i("HGop")},"data-v-7fc9926a",null);e.default=o.exports},XHv2:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_exports__.a={name:"Reword",props:[],data:function(){return{hide:1,userInfo:"",userCode:"",msgid1:"30012000",msgid2:"30012015",partyid:"80000096",version:"1.0",key:"88cce715cceb4623ad643e3a6ec438dc",token:"",attendid:"",sku1:"79f2eeb056334116a546eadeb6ad134f",sku2:"6ca1880fa0eb4b68b0b2f296f9e0c972",sku3:"fa147e3e88964a539a48dd12757a5b2f",sku4:"33c9a57f935d45b69ca8a2d2071a7416",yeffectTime:0,effectTime:0,userWatchTime:0,relateWatchTime:0,allTime:0,exchangeNum:0,exchangeTime:0,exchange:0}},created:function created(){try{var json=eval("("+Jegotrip.getUserInfo()+")");this.userCode=json.userCode,this.init()}catch(t){console.log(t)}},mounted:function(){},methods:{init:function init(){var _this2=this;this.userInfo=eval("("+Jegotrip.getUserInfo()+")"),console.log(this.userInfo),this.userCode=this.userInfo.userCode;var data={userId:this.userCode};console.log(data),this.axios.post("http://223.121.14.236/uds/cloud/watch/list?version=1",data).then(function(t){console.log("时长条显示数据",t),_this2.effectTime=t.data.data.effectTime,_this2.userWatchTime=t.data.data.userWatchTime,_this2.relateWatchTime=t.data.data.relateWatchTime,_this2.allTime=_this2.userWatchTime+_this2.relateWatchTime,_this2.yeffectTime=(_this2.allTime-_this2.effectTime).toFixed(),_this2.exchangeNum=t.data.data.exchangeNum,_this2.effectTime<_this2.relateWatchTime&&(_this2.relateWatchTime=0),_this2.yeffectTime<=0&&(_this2.yeffectTime=0),_this2.$refs.bar_me.style.width=Number(_this2.userWatchTime*_this2.effectTime/(_this2.allTime*_this2.allTime)*100).toFixed(1)+"%",_this2.$refs.bar_friend.style.width=Number(_this2.userWatchTime*_this2.relateWatchTime/(_this2.allTime*_this2.allTime)*100).toFixed(1)+"%"}).catch(function(t){console.log(t)})},receive:function(t){var e=this;if("79f2eeb056334116a546eadeb6ad134f"==t&&this.effectTime>=1&&this.exchangeNum<10)this.exchangeTime=1,this.exchange=1;else if("6ca1880fa0eb4b68b0b2f296f9e0c972"==t&&this.effectTime>=2&&this.exchangeNum<9)this.exchangeTime=2,this.exchange=2;else if("fa147e3e88964a539a48dd12757a5b2f"==t&&this.effectTime>=5&&this.exchangeNum<6)this.exchangeTime=5,this.exchange=5;else{if(!("33c9a57f935d45b69ca8a2d2071a7416"==t&&this.effectTime>=10&&this.exchangeNum<1))return void console.log("条件不符");this.exchangeTime=10,this.exchange=10}var i=(new Date).getTime();if(this.attendid=parseInt((Math.random()+1)*Math.pow(10,11)),this.exchangeNum<10){var s=this.SHA1("msgid="+this.msgid1+"&partyid="+this.partyid+"&timestamp="+i+"&version="+this.version+"&key="+this.key).toUpperCase(),a={msgid:this.msgid1,partyid:this.partyid,timestamp:i,version:this.version,signature:s};console.log("msgid="+this.msgid1+"&partyid="+this.partyid+"&timestamp="+i+"&version="+this.version+"&key="+this.key);var n=this;this.axios.post("http://app1.jegotrip.com.cn/third/authParty.action",a).then(function(s){console.log("认证成功",s),n.token=s.data.token,console.log("attendid="+e.attendid+"&msgid="+e.msgid2+"&msisdn="+e.userInfo.mobile+"&partyid="+e.partyid+"&sku="+t+"&timestamp="+i+"&token="+e.token+"&key="+e.key);var a=e.SHA1("attendid="+e.attendid+"&msgid="+e.msgid2+"&msisdn="+e.userInfo.mobile+"&partyid="+e.partyid+"&sku="+t+"&timestamp="+i+"&token="+e.token+"&key="+e.key).toUpperCase(),c={partyid:e.partyid,msgid:e.msgid2,token:e.token,msisdn:e.userInfo.mobile,sku:t,attendid:e.attendid,timestamp:i,signature:a};e.axios.post("http://app1.jegotrip.com.cn/third/activity/rewards",c).then(function(t){console.log("领取成功",t),0==t.data.retcode&&(e.hide=0)}).catch(function(t){console.log(t)})}).catch(function(t){console.log(t)})}},enter:function(){var t=this;this.hide=1;var e={userId:this.userInfo.userCode,exchangeTime:this.exchangeTime,exchangeNum:this.exchange};console.log(this.userInfo.userCode,"用户ID"),this.axios.post("http://223.121.14.236/uds/cloud/watch/exchange?version=1",e).then(function(e){console.log("兑换奖励成功",e),t.init()}).catch(function(t){console.log(t)})},SHA1:function(t){var e=0;return i(t);function i(t){return function(t){for(var i=e?"0123456789ABCDEF":"0123456789abcdef",s="",a=0;a<4*t.length;a++)s+=i.charAt(t[a>>2]>>8*(3-a%4)+4&15)+i.charAt(t[a>>2]>>8*(3-a%4)&15);return s}(function(t){for(var e=t,i=Array(80),r=1732584193,o=-271733879,h=-1732584194,l=271733878,f=-1009589776,d=0;d<e.length;d+=16){for(var _=r,u=o,m=h,v=l,p=f,g=0;g<80;g++){i[g]=g<16?e[d+g]:c(i[g-3]^i[g-8]^i[g-14]^i[g-16],1);var b=n(n(c(r,5),s(g,o,h,l)),n(n(f,i[g]),a(g)));f=l,l=h,h=c(o,30),o=r,r=b}r=n(r,_),o=n(o,u),h=n(h,m),l=n(l,v),f=n(f,p)}return new Array(r,o,h,l,f)}(function(t){for(var e=1+(t.length+8>>6),i=new Array(16*e),s=0;s<16*e;s++)i[s]=0;for(s=0;s<t.length;s++)i[s>>2]|=t.charCodeAt(s)<<24-8*(3&s);return i[s>>2]|=128<<24-8*(3&s),i[16*e-1]=8*t.length,i}(t)))}function s(t,e,i,s){return t<20?e&i|~e&s:t<40?e^i^s:t<60?e&i|e&s|i&s:e^i^s}function a(t){return t<20?1518500249:t<40?1859775393:t<60?-1894007588:-899497514}function n(t,e){var i=(65535&t)+(65535&e);return(t>>16)+(e>>16)+(i>>16)<<16|65535&i}function c(t,e){return t<<e|t>>>32-e}}}}},peQQ:function(t,e){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABxElEQVQ4T63TO2uUURAG4OfsJkYJ0ZCLeMFGDSIJpLG1Eiv/g2DlJY2p7S2NjZJO/BFWYuUfMCgBiQpRsglkozEmYq5H5tuzYVli5zQfM/PNO++8MyfpsrzqCu7hlux8lU6W8AqzadTHzpLUdnLWo+kxpu3osYHtku3DSRyzhxmLHqVrdlvYyAv6DHrtwHXL+N7Nq/hDOIuat9bdTGO2WwCrZh2460vVhV4c4Cf6S6ztR/5iBRLj3E952bhec5bUrZVkFIUFkzpOFT8Av2IY5+zbM5nyqhm7Hh5KEwW1UrBfvhELCxahQvAOqXs9DYB5a65q4AxGOn6OWHQf6ABcxO+KQTCZD4BNDf0V/aA+iBArthCUc4nFFmKkiG0ejrEVABsaBiqAsOMYwzesl1iAXsAC/pRYS4dfKTe91zRRjRB2ApeLWNEt7CiAGGHIh2DwxK7pSsQQL/YcBZ86unUDtEWsm0l5xYS6dxrqejBaZm0zOopBe401k61Danpm3wMrpetW1yXG8YSIP8pRxSElz9NpU//nlCsWWZ9gwh07av94THFKL4yYSqn11A5fY5t0XjMuuy27gUsl/hlv1LxMw+Y7B/wLZKqYXSGnIxkAAAAASUVORK5CYII="}});
//# sourceMappingURL=4.8b4460422252254f793d.js.map