
//  模板5
var assetRecommendationBig_3 = {
	itemNo:0,
	id:0,
	fatherList:[],
	list:[],
	template:function (dataList,list) { 
		this.list = list;
		this.itemNo = 0;
		this.fatherList = dataList;
		this.id = list.specialId;
		var assetRecommendationBig_3Html = '';
		for (var i = 0; i < list.elementList.length; i++) {
			var div = '<div class="itemWrap"><div id="assetRecommendationBig_3-item_'+i+'"><li class="imgWrap" class="content-item'+i+'"><img class="lazyload" src="source/public/images/img_loading_160x230.png"  data-img="' + list.elementList[i].elementImg + '"/></li></div><div class="itemName">'+list.elementList[i].elementName+'</div></div>';	
			assetRecommendationBig_3Html+=div;
		}
		return '<div class="assetRecommendationBig_3"><div class="mkName">'+list.specialName+'</div><div class="assetWrap">'+assetRecommendationBig_3Html+'</div></div>';
	 },
	init:function (itemNo) { 
		if(itemNo){
			this.itemNo = itemNo;
		}
		areaObj = assetRecommendationBig_3;
		addClass(getId('assetRecommendationBig_3-item_'+this.itemNo),'topRecommendHover')			
	 },
	left:function () { 
		if(this.itemNo == 0)return;
		removeClass(getId('assetRecommendationBig_3-item_'+this.itemNo),'topRecommendHover')	
		this.itemNo--;
		addClass(getId('assetRecommendationBig_3-item_'+this.itemNo),'topRecommendHover')			
	 },
	right:function () { 
		if(this.itemNo == 2)return;
		removeClass(getId('assetRecommendationBig_3-item_'+this.itemNo),'topRecommendHover')	
		this.itemNo++;
		addClass(getId('assetRecommendationBig_3-item_'+this.itemNo),'topRecommendHover')		
	 },
	up:function () { 
		removeClass(getId('assetRecommendationBig_3-item_'+this.itemNo),'topRecommendHover');
		var i = handleCoponentsKey(this.fatherList,this.id,'up');
		eval(Home.homeCategoryChildrenList[i].layout).init();		
		pageScroll(this.id,'up')		
	 },
	down:function () { 
		var i = handleCoponentsKey(this.fatherList,this.id,'down');
		if(i == undefined)return;
		removeClass(getId('assetRecommendationBig_3-item_'+this.itemNo),'topRecommendHover');
		eval(Home.homeCategoryChildrenList[i].layout).init();	
		pageScroll(Home.homeCategoryChildrenList[i].layout,'down',eleOffsetTop('#assetRecommendationBig_3-item_'+this.itemNo)+250)
	 },
	enter:function () { 
		if(this.list.elementList[this.itemNo].elementType == 1){
			var pos = Home.scrollArr.length == 0?0:Home.scrollArr[Home.scrollArr.length-1];
			var backUrl = window.location.pathname + '?pos='+pos+'&itemNo=' + this.itemNo + '&columnName=assetRecommendationBig_3&navItem='+Home.itemNo;
			routeJump(1,backUrl,this.list.elementList[this.itemNo].jsonUrl)
		}
	 }
};