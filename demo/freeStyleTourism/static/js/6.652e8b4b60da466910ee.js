webpackJsonp([6],{"N/Dt":function(t,a){},WQuv:function(t,a,e){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var s={data:function(){return{value:"",sort:"",sortList:"",sortData:0,area:"",areaList:"",areaData:0,years:"",yearsList:"",yearsData:0,content:"",contentList:"",contentData:0,sortID:"",areaID:"",yearsID:"",contentID:"",list:[0],url:"",catName:"",location:"",sortName:"",areaName:"",yearsName:"",contentName:""}},props:["jsonUrl","tags","tagName"],created:function(){!function(){var t=document.createElement("script");t.src="https://hm.baidu.com/hm.js?4926cf3d2b853ff341b5b083520ef6a1";var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(t,a)}(),1==localStorage.getItem("city")||4==localStorage.getItem("city")?this.location=1:null==localStorage.getItem("city")?this.location=-1:this.location=2,console.log(this.jsonUrl),console.log(this.tags),this.jsonUrl?(localStorage.setItem("fitter",this.jsonUrl),this.value=this.jsonUrl):this.value=localStorage.getItem("fitter");var t=this.value+"&l=zh_CN";this.filter(t)},methods:{back:function(){this.$router.push({path:"/index/recommend"})},clickSort:function(t){this.sortData=t,this.sortID=this.sortList[this.sortData].categoryId;var a=this.url+"&"+this.areaName+"="+this.areaID+"&"+this.yearsName+"="+this.yearsID+"&"+this.contentName+"="+this.contentID+"&l=zh_CN";this.filterList(a)},clickArea:function(t){this.areaData=t,this.areaData=t,this.areaID=this.areaList[this.areaData].categoryId;var a=this.url+"&"+this.areaName+"="+this.areaID+"&"+this.yearsName+"="+this.yearsID+"&"+this.contentName+"="+this.contentID+"&l=zh_CN";this.filterList(a)},clickYears:function(t){this.yearsData=t,this.yearsData=t,this.yearsID=this.yearsList[this.yearsData].categoryId;var a=this.url+"&"+this.areaName+"="+this.areaID+"&"+this.yearsName+"="+this.yearsID+"&"+this.contentName+"="+this.contentID+"&l=zh_CN";this.filterList(a)},clickContent:function(t){this.contentData=t,this.contentData=t,this.contentID=this.contentList[this.contentData].categoryId;var a=this.url+"&"+this.areaName+"="+this.areaID+"&"+this.yearsName+"="+this.yearsID+"&"+this.contentName+"="+this.contentID+"&l=zh_CN";this.filterList(a)},filter:function(t){var a=this;this.axios.get(t).then(function(t){console.log(t);var e=t.data.data.jsonUrl;a.url=e,a.filterList(e+"&l=zh_CN"),console.log("筛选：",t),a.catName=t.data.data.categoryName;try{a.area=t.data.data.list[2],a.areaName=t.data.data.list[2].categoryCode}catch(t){}if(a.area){var s={categoryId:"",categoryName:a.area.categoryName};a.areaList=t.data.data.list[2].list,a.areaList.splice(0,0,s)}try{a.years=t.data.data.list[1],a.yearsName=t.data.data.list[1].categoryCode}catch(t){}if(a.years){var i={categoryId:"",categoryName:a.years.categoryName};a.yearsList=t.data.data.list[1].list,a.yearsList.splice(0,0,i)}try{a.content=t.data.data.list[0],a.contentName=t.data.data.list[0].categoryCode}catch(t){}if(a.content){var r={categoryId:"",categoryName:a.content.categoryName};a.contentList=t.data.data.list[0].list,a.contentList.splice(0,0,r);for(var c=0;c<a.contentList.length;c++)a.tagName==a.contentList[c].categoryName&&(a.contentData=c)}}).catch(function(t){console.log(t)})},filterList:function(t){var a=this;console.log(t),this.axios.get(t).then(function(t){if(a.list=[],console.log(t),0==localStorage.getItem("city"))for(var e=0;e<t.data.data.assets.length;e++)"2"==t.data.data.assets[e].playArea?a.list.push(t.data.data.assets[e]):"0"==t.data.data.assets[e].playArea&&a.list.push(t.data.data.assets[e]);else if(1==localStorage.getItem("city")||4==localStorage.getItem("city"))for(var s=0;s<t.data.data.assets.length;s++)"1"==t.data.data.assets[s].playArea?a.list.push(t.data.data.assets[s]):"0"==t.data.data.assets[s].playArea&&a.list.push(t.data.data.assets[s]);else if(null==localStorage.getItem("city"))for(var i=0;i<t.data.data.assets.length;i++)a.list.push(t.data.data.assets[i])}).catch(function(t){console.log(t)})},toDetail:function(t,a){var e=this.list[t].jsonUrl;this.$router.push({name:"detail",params:{jsonUrl:e}})}}},i={render:function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"container"},[e("div",{staticClass:"fitter_header"},[e("span",[t._v(t._s(t.catName))])]),t._v(" "),e("div",{staticClass:"fitter_conetnt"},[e("ul",{staticClass:"fitter_multiple"},t._l(t.sortList,function(a,s){return e("li",{key:s,class:{select:t.sortData==s},on:{click:function(a){return t.clickSort(s)}}},[t._v(t._s(a.categoryName))])}),0),t._v(" "),e("ul",{staticClass:"fitter_type"},t._l(t.contentList,function(a,s){return e("li",{key:s,class:{select:t.contentData==s},on:{click:function(a){return t.clickContent(s)}}},[t._v(t._s(a.categoryName))])}),0),t._v(" "),e("ul",{staticClass:"fitter_region"},t._l(t.areaList,function(a,s){return e("li",{key:s,ref:"area",refInFor:!0,class:{select:t.areaData==s},on:{click:function(a){return t.clickArea(s)}}},[t._v(t._s(a.categoryName))])}),0),t._v(" "),e("ul",{staticClass:"fitter_year"},t._l(t.yearsList,function(a,s){return e("li",{key:s,class:{select:t.yearsData==s},on:{click:function(a){return t.clickYears(s)}}},[t._v(t._s(a.categoryName))])}),0)]),t._v(" "),e("div",{staticClass:"clear",staticStyle:{clear:"both"}}),t._v(" "),e("ul",{staticClass:"fitter_list"},t._l(t.list,function(a,s){return e("li",{key:s,on:{click:function(a){return t.toDetail(s)}}},[e("div",{staticClass:"fitter_list_img",style:"backgroundImage: url("+a.assetImg+")"}),t._v(" "),e("div",{staticClass:"fitter_list_title"},[t._v(t._s(a.assetName))])])}),0),t._v(" "),t.list.length<1?e("div",{staticClass:"no_fitter"},[t._v("暂无筛选内容")]):t._e()])},staticRenderFns:[]};var r=e("VU/8")(s,i,!1,function(t){e("N/Dt")},"data-v-6671865f",null);a.default=r.exports}});
//# sourceMappingURL=6.652e8b4b60da466910ee.js.map