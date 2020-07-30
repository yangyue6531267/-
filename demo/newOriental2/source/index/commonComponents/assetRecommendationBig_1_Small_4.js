
// 模板4
var assetRecommendationBig_1_Small_4 = {
	id:0,
	itemNo:0,
	fatherList:[],
	list:[],
	template:function (dataList,list) { 
		this.list = list;
		this.itemNo = 0;
		this.fatherList = [];
		this.fatherList = dataList;
		this.id = list.specialId;
		var assetRecommendationBig_1_Small_4Html = '';
		for (var i = 0; i < list.elementList.length; i++) {
			var div = '<div class="itemWrap"><div id="assetRecommendationBig_1_Small_4-item_'+i+'"><li class="imgWrap" class="content-item'+i+'"><img class="lazyload" src="source/public/images/img_loading_160x230.png"  data-img="' + list.elementList[i].elementImg + '"/></li></div><div class="itemName">'+list.elementList[i].elementName+'</div></div>';	
			assetRecommendationBig_1_Small_4Html+=div;
		}
		return '<div class="assetRecommendationBig_1_Small_4"><div class="mkName">'+list.specialName+'</div><div class="assetWrap">'+assetRecommendationBig_1_Small_4Html+'</div></div>';		
	 },
	init:function (itemNo) { 
		if(itemNo){
			this.itemNo = itemNo;
		}
		areaObj = assetRecommendationBig_1_Small_4;
		addClass(getId('assetRecommendationBig_1_Small_4-item_'+this.itemNo),'topRecommendHover')			
	 },
	up:function () { 
		removeClass(getId('assetRecommendationBig_1_Small_4-item_'+this.itemNo),'topRecommendHover');
		var i = handleCoponentsKey(this.fatherList,this.id,'up');
		eval(Home.homeCategoryChildrenList[i].layout).init();
		pageScroll(this.id,'up')		
	 },
	down:function () { 
		var i = handleCoponentsKey(this.fatherList,this.id,'down');
		if(i == undefined)return;
		removeClass(getId('assetRecommendationBig_1_Small_4-item_'+this.itemNo),'topRecommendHover');
		eval(Home.homeCategoryChildrenList[i].layout).init();	
		pageScroll(Home.homeCategoryChildrenList[i].layout,'down',eleOffsetTop('#assetRecommendationBig_1_Small_4-item_'+this.itemNo)+150)
	 },
	left:function () { 
		if(this.itemNo == 0)return;
		removeClass(getId('assetRecommendationBig_1_Small_4-item_'+this.itemNo),'topRecommendHover')	
		this.itemNo--;
		addClass(getId('assetRecommendationBig_1_Small_4-item_'+this.itemNo),'topRecommendHover')	
	 },
	right:function () { 
		if(this.itemNo == 4)return;
		removeClass(getId('assetRecommendationBig_1_Small_4-item_'+this.itemNo),'topRecommendHover')	
		this.itemNo++;
		addClass(getId('assetRecommendationBig_1_Small_4-item_'+this.itemNo),'topRecommendHover')
	 }, 
	enter:function () { 
		if(this.list.elementList[this.itemNo].elementType == 1){
			var pos = Home.scrollArr.length == 0?0:Home.scrollArr[Home.scrollArr.length-1];
			var backUrl = window.location.pathname + '?pos='+pos+'&itemNo=' + this.itemNo + '&columnName=assetRecommendationBig_1_Small_4&navItem='+Home.itemNo;
			routeJump(1,backUrl,this.list.elementList[this.itemNo].jsonUrl)
		}
	 }
};