
// 12个资产推荐
var assetRecommendation_12 = {
	itemNo:0,
	id:0,
	fatherList:[],
	list:[],
	name:'assetRecommendation_12',
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
			var div = '';
			if(Home.itemNo == 0){
				div = '<div class="itemWrap"><div id="assetRecommendation_12-item_'+i+'"><li class="imgWrap" class="content-item'+i+'"><img class="lazyload" src="source/public/images/img_loading_160x230.png"  data-img="' + list.elementList[i].elementImg + '"/></li></div><div class="itemName">'+list.elementList[i].elementName+'</div></div>'
			}else{
				if(i < 11){
					div = '<div class="itemWrap"><div id="assetRecommendation_12-item_'+i+'"><li class="imgWrap" class="content-item'+i+'"><img class="lazyload" src="source/public/images/img_loading_160x230.png"  data-img="' + list.elementList[i].elementImg + '"/></li></div><div class="itemName">'+list.elementList[i].elementName+'</div></div>'
				}else{
					div = '<div class="itemWrap" id="viewMore"><div id="assetRecommendation_12-item_11"><li class="imgWrap" style="background:rgba(238,232,213,1)"></li></div><div class="itemName">查看更多</div></div>'
				}
			}
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
		var click_type = '';
		if(this.list.elementList[this.itemNo].elementType == '1'){
			click_type = '1';
		}else if(this.list.elementList[this.itemNo].elementType == '4'){
			click_type = '2';
		};
		var pos_id = '0'+(Home.itemNo+1)+'0'+handleCoponentsKey2(this.fatherList,this.id)+'0'+(this.itemNo+1)
		bi.recommendClick(pos_id,'0','0101',Home.homeCategoryList.data.catList[Home.itemNo].catId,click_type,this.list.elementList[this.itemNo].elementId);
		var pos = Home.scrollArr.length == 0?0:Home.scrollArr[Home.scrollArr.length-1];
		var backUrl = window.location.pathname + '?pos='+pos+'&itemNo=' + this.itemNo + '&columnName=assetRecommendation_12&navItem='+Home.itemNo;
		if(this.list.elementList[this.itemNo].elementType == 1){
			routeJump(this.list.elementList[this.itemNo].elementType,backUrl,this.list.elementList[this.itemNo].jsonUrl)
		}else if(this.list.elementList[this.itemNo].elementType == 7){
			var num = '';
			var classification = '';
			var catCode = '';
			if(Home.itemNo == 1){
			num = 'cjkt';
			classification = '学前';
			catCode = 'Preschool ';
			}else if(Home.itemNo == 2){
			num = 'xcgkt';
			classification = '小学'
			catCode = 'Primaryschool';
			}else if(Home.itemNo == 3){
			num = 'xcgkt';  
			classification = '初中'   
			catCode = 'Middleschool'; 
			}else if(Home.itemNo == 4){
			num = 'xcgkt';  
			classification = '高中'
			catCode = 'Hinghschool';
			}else if(Home.itemNo == 5){
			num = 'cjkt';  
			classification = '成教' 
			catCode = 'Adultschool';
			}
			routeJumpFilter(num,backUrl,classification,this.list.elementList[this.itemNo].elementName,catCode)
		}
	 },
	back:function () { 
		backTop(getId('assetRecommendation_12-item_'+this.itemNo),'topRecommendHover')
		this.itemNo = 0;
	 }
};