//小学

var homePrimarySchool = {
	homePrimarySchoolList:[],
	coponentIdList:[],
	init:function (data) {  
		console.log(data)
		this.homePrimarySchoolList = data.data.specialList;
		this.coponentIdList = [];
		for (var i = 0; i < this.homePrimarySchoolList.length; i++) {
			this.coponentIdList.push(this.homePrimarySchoolList[i].specialId)	 
		}
		var homeCategoryEle = getId('homeContent');
		var homeRecommendHtml = '';
		for (var i = 0; i < data.data.specialList.length; i++) {
			if( data.data.specialList[i].layout == 'normalRecommendTop'){
				homeRecommendHtml+=normalRecommendTop.template(this.coponentIdList,data.data.specialList[i])
			}else if(data.data.specialList[i].layout == 'primarySchoolRecommendTop_7'){
				homeRecommendHtml+=primarySchoolRecommendTop_7.template(data.data.specialList[i])
			}else if(data.data.specialList[i].layout == 'assetRecommendationBig_1_Small_4'){	
				homeRecommendHtml+=assetRecommendationBig_1_Small_4.template(this.coponentIdList,data.data.specialList[i])
			}else if(data.data.specialList[i].layout == 'assetRecommendationBig_3'){
				homeRecommendHtml+=assetRecommendationBig_3.template(this.coponentIdList,data.data.specialList[i]);
			}else if(data.data.specialList[i].layout == 'assetRecommendation_6'){
				homeRecommendHtml+=assetRecommendation_6.template(this.coponentIdList,data.data.specialList[i]);
			}else if(data.data.specialList[i].layout == 'assetRecommendation_12'){
				homeRecommendHtml+=assetRecommendation_12.template(this.coponentIdList,data.data.specialList[i]);
			}
		}
		homeCategoryEle.innerHTML = homeRecommendHtml;
		imgLazyLoad(); // 懒加载
	}
}


//  模板一
// var normalRecommendTop = {
// 	itemNo:0,
// 	id:0,
// 	template:function (list) {  
// 		this.id = list.specialId;
// 		var xiaoxue_normalRecommendTopHtml = '';
// 		for (var i = 0; i < list.elementList.length; i++) {
// 			var div = '<div class="itemWrap" id="xiaoxue_normalRecommendTop-item_'+i+'"><div class="imgWrap"><img class="lazyload" src="source/public/images/img_loading_160x230.png"  data-img="' + list.elementList[i].elementImg + '"/></div></div>'
// 			xiaoxue_normalRecommendTopHtml+=div;
// 		}
// 		return '<div class="xiaoxue_normalRecommendTop">'+xiaoxue_normalRecommendTopHtml+'</div>'
// 	},
// 	init:function () {  
// 		areaObj = normalRecommendTop;
// 		addClass(getId('xiaoxue_normalRecommendTop-item_'+this.itemNo),'topRecommendHover');
// 	},
//     left:function () {  
//         if(this.itemNo == 0)return;
//         if(this.itemNo == 1 || this.itemNo == 3){
//             removeClass(getId('xiaoxue_normalRecommendTop-item_'+this.itemNo),'topRecommendHover');       
//             this.itemNo = 0;
//             addClass(getId('xiaoxue_normalRecommendTop-item_'+this.itemNo),'topRecommendHover');                  
//         }else{
//             removeClass(getId('xiaoxue_normalRecommendTop-item_'+this.itemNo),'topRecommendHover');       
//             this.itemNo --;
//             addClass(getId('xiaoxue_normalRecommendTop-item_'+this.itemNo),'topRecommendHover');              
//         }
//     },
//     right:function () {  
//         if(this.itemNo == 2 || this.itemNo == 6)return;
//         removeClass(getId('xiaoxue_normalRecommendTop-item_'+this.itemNo),'topRecommendHover');       
//         this.itemNo++;
//         addClass(getId('xiaoxue_normalRecommendTop-item_'+this.itemNo),'topRecommendHover');       
//     },
//     down:function () {  
// 		debugger
//         removeClass(getId('xiaoxue_normalRecommendTop-item_'+this.itemNo),'topRecommendHover');       
//         if(this.itemNo == 1 || this.itemNo == 2){
//             this.itemNo+=2;
//             addClass(getId('xiaoxue_normalRecommendTop-item_'+this.itemNo),'topRecommendHover');  
//         }else{
// 			var i = handleCoponentsKey(homePrimarySchool.coponentIdList,this.id,'down');
//             eval(Home.homeCategoryChildrenList[i].layout).init();       
                 
//         }
//     },
//     up:function () {  
//         removeClass(getId('xiaoxue_normalRecommendTop-item_'+this.itemNo),'topRecommendHover'); 
//         if(this.itemNo >= 3){   
//             this.itemNo = 2;
//             addClass(getId('xiaoxue_normalRecommendTop-item_'+this.itemNo),'topRecommendHover');       
//         }else{
//             Home.init(Home.itemNo+1);
//         }
//     }
// };

//  模板二
 var primarySchoolRecommendTop_7 = {
	 itemNo:0,
	 id:0,
	 list:[],
	 template:function (list) {  
		this.list = list;
		this.itemNo = 0;
		this.id = list.specialId;
		var xiaoxue_primarySchoolRecommendTop_7Html = '';
		console.log(list)
		for (var  i = 0; i < list.elementList.length; i++) {
		   var div = '<div class="itemWrap" id="primarySchoolRecommendTop_7-item_'+i+'"><div class="imgWrap">'+list.elementList[i].elementName+'</div></div>'	
		   xiaoxue_primarySchoolRecommendTop_7Html+=div;
	   }
		return '<div class="primarySchoolRecommendTop_7">'+xiaoxue_primarySchoolRecommendTop_7Html+'</div>';
	 },
	 init:function (itemNo) { 
		if(itemNo){
			this.itemNo = itemNo;
		} 
        areaObj = primarySchoolRecommendTop_7;
        addClass(getId('primarySchoolRecommendTop_7-item_'+this.itemNo),'topFilterHover');     		 
	 },
	 up:function () {  
		removeClass(getId('primarySchoolRecommendTop_7-item_'+this.itemNo),'topFilterHover'); 
		var i = handleCoponentsKey(homePrimarySchool.coponentIdList,this.id,'up');
		eval(Home.homeCategoryChildrenList[i].layout).init();  
		pageScroll('','up');
	  },
	  down:function () {  
		removeClass(getId('primarySchoolRecommendTop_7-item_'+this.itemNo),'topFilterHover'); 
		var i = handleCoponentsKey(homePrimarySchool.coponentIdList,this.id,'down');
		eval(Home.homeCategoryChildrenList[i].layout).init();  
		pageScroll(Home.homeCategoryChildrenList[i].layout,'down',eleOffsetTop('#primarySchoolRecommendTop_7-item_'+this.itemNo)+100)  
	  },
	  left:function () {  
		if(this.itemNo == 0)return;
		removeClass(getId('primarySchoolRecommendTop_7-item_'+this.itemNo),'topFilterHover'); 
		this.itemNo--;   
		addClass(getId('primarySchoolRecommendTop_7-item_'+this.itemNo),'topFilterHover');       
	  },
	  right:function () {  
		if(this.itemNo == 6)return;
		removeClass(getId('primarySchoolRecommendTop_7-item_'+this.itemNo),'topFilterHover'); 
		this.itemNo++;   
		addClass(getId('primarySchoolRecommendTop_7-item_'+this.itemNo),'topFilterHover');   
	  },
	  enter:function () {
		if(this.list.elementList[this.itemNo].elementType == 1){
			var pos = Home.scrollArr.length == 0?0:Home.scrollArr[Home.scrollArr.length-1];
			var backUrl = window.location.pathname + '?pos='+pos+'&itemNo=' + this.itemNo + '&columnName=primarySchoolRecommendTop_7&navItem='+Home.itemNo;
			routeJump(1,backUrl,this.list.elementList[this.itemNo].jsonUrl)
		};
		if(this.list.elementList[this.itemNo].elementType == 7){
			var pos = Home.scrollArr.length == 0?0:Home.scrollArr[Home.scrollArr.length-1];
			var backUrl = window.location.pathname + '?pos='+pos+'&itemNo=' + this.itemNo + '&columnName=primarySchoolRecommendTop_7&navItem='+Home.itemNo + '&catId=' + this.list.elementList[this.itemNo].elementId;
			routeJump(7,backUrl,this.list.elementList[this.itemNo].jsonUrl)
		}		
	  }
 };
