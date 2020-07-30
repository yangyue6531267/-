
var assetRecommendation_6 = {
	id:0,
	itemNo:0,
	fatherList:[],
	list:[],
	template:function (dataList,list) {
		this.list = list;
		this.itemNo = 0;
		this.fatherList = dataList;
		this.id = list.specialId;
		var assetRecommendation_6Html = ''
		for (var i = 0; i < list.elementList.length; i++) {
			var div = '<div class="itemWrap"><div id="assetRecommendation_6-item_'+i+'"><li class="imgWrap" class="content-item'+i+'"><img class="lazyload" src="source/public/images/img_loading_160x230.png"  data-img="' + list.elementList[i].elementImg + '"/></li></div><div class="itemName">'+list.elementList[i].elementName+'</div></div>';	
			assetRecommendation_6Html+=div;
		}
		return '<div class="assetRecommendation_6"><div class="mkName">'+list.specialName+'</div><div class="assetWrap">'+assetRecommendation_6Html+'</div></div>';		
	 },
	init:function (itemNo) { 
		if(itemNo){
			this.itemNo = itemNo;
		}
		areaObj = assetRecommendation_6;
		addClass(getId('assetRecommendation_6-item_'+this.itemNo),'topRecommendHover')			
	 },
	 left:function () { 
		if(this.itemNo == 0)return;
		removeClass(getId('assetRecommendation_6-item_'+this.itemNo),'topRecommendHover')	
		this.itemNo--;
		addClass(getId('assetRecommendation_6-item_'+this.itemNo),'topRecommendHover')			
	 },
	right:function () { 
		if(this.itemNo == 5)return;
		removeClass(getId('assetRecommendation_6-item_'+this.itemNo),'topRecommendHover')	
		this.itemNo++;
		addClass(getId('assetRecommendation_6-item_'+this.itemNo),'topRecommendHover')		
	 },
	up:function () { 
		removeClass(getId('assetRecommendation_6-item_'+this.itemNo),'topRecommendHover');
		var i = handleCoponentsKey(this.fatherList,this.id,'up');
		eval(Home.homeCategoryChildrenList[i].layout).init();			
		pageScroll(Home.homeCategoryChildrenList[i].layout,'up')	
	 },
	down:function () { 
		var i = handleCoponentsKey(this.fatherList,this.id,'down');
		if(i == undefined)return;
		removeClass(getId('assetRecommendation_6-item_'+this.itemNo),'topRecommendHover');
		eval(Home.homeCategoryChildrenList[i].layout).init();
		pageScroll(Home.homeCategoryChildrenList[i].layout,'down',eleOffsetTop('#assetRecommendation_6-item_'+this.itemNo)+50)
	 },
	enter:function () { 
		if(this.list.elementList[this.itemNo].elementType == 1){
			var pos = Home.scrollArr.length == 0?0:Home.scrollArr[Home.scrollArr.length-1];
			var backUrl = window.location.pathname + '?pos='+pos+'&itemNo=' + this.itemNo + '&columnName=assetRecommendation_6&navItem='+Home.itemNo;
			routeJump(1,backUrl,this.list.elementList[this.itemNo].jsonUrl)
		}		
	 }
}