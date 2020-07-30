
// 12个资产推荐
var assetRecommendation_12 = {
	itemNo:0,
	id:0,
	fatherList:[],
	list:[],
	init:function (itemNo) { 
		if(itemNo){
			this.itemNo = itemNo;
		}
		areaObj = assetRecommendation_12;
		addClass(getId('assetRecommendation_12-item_'+this.itemNo),'topRecommendHover')
	 },
	template:function (dataList,list) { 
		this.list = list;
		this.itemNo = 0;
		this.fatherList = dataList;
		this.id = list.specialId;
		var assetRecommendation_12Html = ''
		for (var  i = 0; i < list.elementList.length; i++) {
			var div = '<div class="itemWrap"><div id="assetRecommendation_12-item_'+i+'"><li class="imgWrap" class="content-item'+i+'"><img class="lazyload" src="source/public/images/img_loading_160x230.png"  data-img="' + list.elementList[i].elementImg + '"/></li></div><div class="itemName">'+list.elementList[i].elementName+'</div></div>'
			assetRecommendation_12Html+=div;
		}
		return '<div class="assetRecommendation_12"><div class="mkName">'+list.specialName+'</div><div class="assetWrap">'+assetRecommendation_12Html+'</div></div>';
	 },
	left:function () {
		if(this.itemNo == 0)return;
		removeClass(getId('assetRecommendation_12-item_'+this.itemNo),'topRecommendHover');
		this.itemNo--;
		addClass(getId('assetRecommendation_12-item_'+this.itemNo),'topRecommendHover')
	 },
	right:function () { 
		if((this.itemNo+1)%6 == 0)return;
		removeClass(getId('assetRecommendation_12-item_'+this.itemNo),'topRecommendHover');
		this.itemNo++;
		addClass(getId('assetRecommendation_12-item_'+this.itemNo),'topRecommendHover')
	 },
	down:function () {
		var i = handleCoponentsKey(this.fatherList,this.id,'down');
		if(this.itemNo>5){
			if( i == undefined)return;
			removeClass(getId('assetRecommendation_12-item_'+this.itemNo),'topRecommendHover');
			eval(Home.homeCategoryChildrenList[i].layout).init();
			pageScroll(Home.homeCategoryChildrenList[i].layout,'down',eleOffsetTop('#assetRecommendation_12-item_'+this.itemNo)+150)
		}else{
			if(i == undefined)i = Home.homeCategoryChildrenList.length-1;
			pageScroll(Home.homeCategoryChildrenList[i].layout,'down',eleOffsetTop('#assetRecommendation_12-item_'+this.itemNo)-106)
			removeClass(getId('assetRecommendation_12-item_'+this.itemNo),'topRecommendHover');
			this.itemNo+=6;
			addClass(getId('assetRecommendation_12-item_'+this.itemNo),'topRecommendHover')
		}
	 },
	up:function () { 
		var i = handleCoponentsKey(this.fatherList,this.id,'up');
		if(this.itemNo>5){
			removeClass(getId('assetRecommendation_12-item_'+this.itemNo),'topRecommendHover');
			this.itemNo-=6;
			addClass(getId('assetRecommendation_12-item_'+this.itemNo),'topRecommendHover')
			if(i == 4){
				pageScroll('','up')				
			}
		}else{
			removeClass(getId('assetRecommendation_12-item_'+this.itemNo),'topRecommendHover');
			eval(Home.homeCategoryChildrenList[i].layout).init();
			pageScroll('','up')
		}
	 },
	enter:function () { 
		if(this.list.elementList[this.itemNo].elementType == 1){
			var pos = Home.scrollArr.length == 0?0:Home.scrollArr[Home.scrollArr.length-1];
			var backUrl = window.location.pathname + '?pos='+pos+'&itemNo=' + this.itemNo + '&columnName=assetRecommendation_12&navItem='+Home.itemNo;
			routeJump(1,backUrl,this.list.elementList[this.itemNo].jsonUrl)
		}
	 }
};