// 大家都在看

var homeRecommend = {};
homeRecommend.homeRecommendList = [];
homeRecommend.coponentIdList = []
homeRecommend.init = function (data) { 
	this.homeRecommendList = data.data.specialList;
	this.coponentIdList = [];
    for (var i = 0; i < this.homeRecommendList.length; i++) {
		this.coponentIdList.push(this.homeRecommendList[i].specialId)	 
	}
	var homeCategoryEle = getId('homeContent');
	var homeRecommendHtml = '';
	for (var i = 0; i < data.data.specialList.length; i++) {
		if( data.data.specialList[i].layout == 'homePageRecommendTop'){
			homeRecommendHtml+=homePageRecommendTop.template(data.data.specialList[i])
		}else if(data.data.specialList[i].layout == 'homePageRecommendTop_4'){
			homeRecommendHtml+=homePageRecommendTop_4.template(data.data.specialList[i])
		}else if(data.data.specialList[i].layout == 'assetRecommendation_12'){
			homeRecommendHtml+=assetRecommendation_12.template(this.coponentIdList,data.data.specialList[i])
		}else if(data.data.specialList[i].layout == 'assetRecommendationBig_1_Small_4'){
			homeRecommendHtml+=assetRecommendationBig_1_Small_4.template(this.coponentIdList,data.data.specialList[i]);
		}else if(data.data.specialList[i].layout == 'assetRecommendationBig_3'){
			homeRecommendHtml+=assetRecommendationBig_3.template(this.coponentIdList,data.data.specialList[i]);
		}else if(data.data.specialList[i].layout == 'assetRecommendation_6'){
			homeRecommendHtml+=assetRecommendation_6.template(this.coponentIdList,data.data.specialList[i]);
		}
	}
	homeCategoryEle.innerHTML = homeRecommendHtml;
	imgLazyLoad(); // 懒加载
 }

//  顶部推荐
 var homePageRecommendTop = {
	itemNo:0,
	id:0,
	list:[],
	template:function (list) { 
		this.list = list;
		this.itemNo = 0;
		this.id = list.specialId;
		var topRecommendLeftHtml = '<div>'+list.specialName+'</div>';
		var topRecommendCenterHtml = '';
		var topRecommendRightHtml = '';
		for (var i = 0; i < list.elementList.length; i++) {
			if(i<=4){
				var div = '<div id="topRecommendItem_'+i+'">'+list.elementList[i].elementName+'</div>'
				topRecommendLeftHtml+=div;
			};
			if(i == 5){
				var div = '<div class="itemWrap" id="topRecommendItem_'+i+'"><div class="imgWrap"><img class="lazyload" src="source/public/images/img_loading_352x190.png"  data-img="' + list.elementList[i].elementImg + '"/></div></div>'
				topRecommendCenterHtml+=div;
			}
			if(i>5){
				var div = '<div class="itemWrap" id="topRecommendItem_'+i+'"><div class="imgWrap"><img class="lazyload" src="source/public/images/img_loading_160x230.png"  data-img="' + list.elementList[i].elementImg + '"/></div></div>'
				topRecommendRightHtml+=div;
			}
		}
		return '<div class="topRecommend" id="topRecommend"><div class="topRecommendLeft" id="topRecommendLeft">'+topRecommendLeftHtml+'</div><div class="topRecommendCenter" id="topRecommendCenter">'+topRecommendCenterHtml+'</div><div class="topRecommendRight" id="topRecommendRight">'+topRecommendRightHtml+'</div></div>';
	},
	init:function (itemNo) { 
		if(itemNo){
			this.itemNo = itemNo;
		} 
		areaObj = homePageRecommendTop;
		if(this.itemNo <= 4){
			addClass(getId('topRecommendItem_'+this.itemNo),'topRecommendLeftHover');
		}else{
			addClass(getId('topRecommendItem_'+this.itemNo),'topRecommendHover');
		}
	},
	up:function () { 
		if(this.itemNo == 0 || this.itemNo == 5 || this.itemNo == 6){
			if(this.itemNo == 0){
			   removeClass(getId('topRecommendItem_'+this.itemNo),'topRecommendLeftHover')			
			}else{
				removeClass(getId('topRecommendItem_'+this.itemNo),'topRecommendHover')			
			}
			Home.init(Home.itemNo+1);
			return;
		};
		if(this.itemNo<=4){
			removeClass(getId('topRecommendItem_'+this.itemNo),'topRecommendLeftHover')	
			this.itemNo--;
			addClass(getId('topRecommendItem_'+this.itemNo),'topRecommendLeftHover');
		};
		if(this.itemNo == 7){
			removeClass(getId('topRecommendItem_'+this.itemNo),'topRecommendHover')	
			this.itemNo--;
			addClass(getId('topRecommendItem_'+this.itemNo),'topRecommendHover');		
		}
	},
	down:function () {  
		if(this.itemNo == 4 || this.itemNo == 5 || this.itemNo == 7){
			if(this.itemNo == 4){
				removeClass(getId('topRecommendItem_'+this.itemNo),'topRecommendLeftHover')					
			}else{
				removeClass(getId('topRecommendItem_'+this.itemNo),'topRecommendHover')	
			}
			var i = handleCoponentsKey(homeRecommend.coponentIdList,this.id,'down');
			eval(Home.homeCategoryChildrenList[i].layout).init();
		};
		if(this.itemNo<4){
			removeClass(getId('topRecommendItem_'+this.itemNo),'topRecommendLeftHover')
			this.itemNo++;
			addClass(getId('topRecommendItem_'+this.itemNo),'topRecommendLeftHover');
		} 
		if(this.itemNo == 6){
			removeClass(getId('topRecommendItem_'+this.itemNo),'topRecommendHover')
			this.itemNo++;
			addClass(getId('topRecommendItem_'+this.itemNo),'topRecommendHover');
		}
	},
	left:function () {  
		if(this.itemNo <= 4)return;
		if(this.itemNo >5){
			removeClass(getId('topRecommendItem_'+this.itemNo),'topRecommendHover')
			this.itemNo = 5;
			addClass(getId('topRecommendItem_'+this.itemNo),'topRecommendHover');			
		}else{
			removeClass(getId('topRecommendItem_'+this.itemNo),'topRecommendHover')
			this.itemNo = 0;
			addClass(getId('topRecommendItem_'+this.itemNo),'topRecommendLeftHover');			
		}
	},
	right:function () {  
		if(this.itemNo>5)return;
		if(this.itemNo<=4){
			removeClass(getId('topRecommendItem_'+this.itemNo),'topRecommendLeftHover')
			this.itemNo = 5;
			addClass(getId('topRecommendItem_'+this.itemNo),'topRecommendHover');		
		}else if(this.itemNo == 5){
			removeClass(getId('topRecommendItem_'+this.itemNo),'topRecommendHover')
			this.itemNo = 6;
			addClass(getId('topRecommendItem_'+this.itemNo),'topRecommendHover');			
		}
	},
	enter:function () { 
		if(this.list.elementList[this.itemNo].elementType == 1){
			var pos = Home.scrollArr.length == 0?0:Home.scrollArr[Home.scrollArr.length-1];
			var backUrl = window.location.pathname + '?pos='+pos+'&itemNo=' + this.itemNo + '&columnName=homePageRecommendTop&navItem='+Home.itemNo;
			routeJump(1,backUrl,this.list.elementList[this.itemNo].jsonUrl)
		}
	 }

 };
// 顶部推荐4个
var homePageRecommendTop_4 = {
	id:0,
	itemNo:0,
	list:[],
	template: function (list) { 
		this.list = list;
		this.itemNo = 0;
		this.id = list.specialId
		var homePageRecommendTop_4Html = '';
		for (var  i = 0; i < list.elementList.length; i++) {
			var div = '<div class="itemWrap"><div class="imgWrap" id="homePageRecommendTop_4-item_'+i+'"><li><img class="lazyload" src="source/public/images/img_loading_160x230.png"  data-img="' + list.elementList[i].elementImg + '"/></li></div></div>'
			homePageRecommendTop_4Html+=div;
		}
		return '<div class="topRecommend_4">'+homePageRecommendTop_4Html+'</div>'
	  },
	init:function (itemNo) { 
		if(itemNo){
			this.itemNo = itemNo;
		} 
		areaObj = homePageRecommendTop_4;
		addClass(getId('homePageRecommendTop_4-item_'+this.itemNo),'topRecommendHover')
	  },
	up:function () { 
		homePageRecommendTop.init();
		removeClass(getId('homePageRecommendTop_4-item_'+this.itemNo),'topRecommendHover')
	  },
	down:function () {
		removeClass(getId('homePageRecommendTop_4-item_'+this.itemNo),'topRecommendHover')
		var i = handleCoponentsKey(homeRecommend.coponentIdList,this.id,'down');
		eval(Home.homeCategoryChildrenList[i].layout).init();
		pageScroll(Home.homeCategoryChildrenList[i].layout,'down',eleOffsetTop('#homePageRecommendTop_4-item_'+this.itemNo))
	  },
	left:function () {
		if(this.itemNo == 0)return;
		removeClass(getId('homePageRecommendTop_4-item_'+this.itemNo),'topRecommendHover')
		this.itemNo--;
		addClass(getId('homePageRecommendTop_4-item_'+this.itemNo),'topRecommendHover')
	  },
	right:function () {
		if(this.itemNo == 3)return;
		removeClass(getId('homePageRecommendTop_4-item_'+this.itemNo),'topRecommendHover')
		this.itemNo++;
		addClass(getId('homePageRecommendTop_4-item_'+this.itemNo),'topRecommendHover')
	  },
	enter:function () {
		if(this.list.elementList[this.itemNo].elementType == 1){
			var pos = Home.scrollArr.length == 0?0:Home.scrollArr[Home.scrollArr.length-1];
			var backUrl = window.location.pathname + '?pos='+pos+'&itemNo=' + this.itemNo + '&columnName=homePageRecommendTop_4&navItem='+Home.itemNo;
			routeJump(1,backUrl,this.list.elementList[this.itemNo].jsonUrl)
		}
	  }
};

