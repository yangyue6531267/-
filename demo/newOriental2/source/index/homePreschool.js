//学前

var homePreschool = {
	homePreschoolList:[],
	coponentIdList:[],
	init:function (data) {  
		this.homePreschoolList = data.data.specialList;
		this.coponentIdList = [];
		for (var i = 0; i < this.homePreschoolList.length; i++) {
			this.coponentIdList.push(this.homePreschoolList[i].specialId)	 
		}
		var homeCategoryEle = getId('homeContent');
		var homeRecommendHtml = '';
		for (var i = 0; i < data.data.specialList.length; i++) {
			if( data.data.specialList[i].layout == 'preschoolRecommendTop'){
				homeRecommendHtml+=preschoolRecommendTop.template(data.data.specialList[i])
			}else if(data.data.specialList[i].layout == 'preschoolRecommendTop_6'){
				homeRecommendHtml+=preschoolRecommendTop_6.template(data.data.specialList[i])
			}else if(data.data.specialList[i].layout == 'assetRecommendationBig_1_Small_4'){	
				homeRecommendHtml+=assetRecommendationBig_1_Small_4.template(this.coponentIdList,data.data.specialList[i])
			}else if(data.data.specialList[i].layout == 'assetRecommendationBig_3'){
				homeRecommendHtml+=assetRecommendationBig_3.template(this.coponentIdList,data.data.specialList[i]);
			}else if(data.data.specialList[i].layout == 'assetRecommendation_12'){
				homeRecommendHtml+=assetRecommendation_12.template(this.coponentIdList,data.data.specialList[i]);
			}else if(data.data.specialList[i].layout == 'assetRecommendation_6'){
				homeRecommendHtml+=assetRecommendation_6.template(this.coponentIdList,data.data.specialList[i]);
			}
		}
		homeCategoryEle.innerHTML = homeRecommendHtml;
		imgLazyLoad(); // 懒加载
	}
}


//  模板一
var preschoolRecommendTop = {
	itemNo:0,
	id:0,
	list:[],
	template:function (list) {  
		this.itemNo = 0 ;
		this.id = list.specialId;
		this.list = list;
		var xueqian_preschoolRecommendTopHtml = '';
		for (var i = 0; i < list.elementList.length; i++) {
			var div = '<div class="itemWrap" id="xueqian_preschoolRecommendTop-item_'+i+'"><div class="imgWrap"><img class="lazyload" src="source/public/images/img_loading_160x230.png"  data-img="' + list.elementList[i].elementImg + '"/></div></div>'
			xueqian_preschoolRecommendTopHtml+=div;
		}
		return '<div class="xueqian_preschoolRecommendTop">'+xueqian_preschoolRecommendTopHtml+'</div>'
	},
	init:function (itemNo) {  
		if(itemNo){
			this.itemNo = itemNo;
		}
		areaObj = preschoolRecommendTop;
		addClass(getId('xueqian_preschoolRecommendTop-item_'+this.itemNo),'preschooltTopRecommendHover');		
	},
	up:function () {  
		removeClass(getId('xueqian_preschoolRecommendTop-item_'+this.itemNo),'preschooltTopRecommendHover');
		if(this.itemNo>2){	
			this.itemNo -=2;
			addClass(getId('xueqian_preschoolRecommendTop-item_'+this.itemNo),'preschooltTopRecommendHover');	
		}else{
			Home.init(Home.itemNo+1);
		}
	},
	down:function () {  
		removeClass(getId('xueqian_preschoolRecommendTop-item_'+this.itemNo),'preschooltTopRecommendHover');	
		if(this.itemNo == 0 || this.itemNo>2){
			var i = handleCoponentsKey(homePreschool.coponentIdList,this.id,'down');
            eval(Home.homeCategoryChildrenList[i].layout).init();      
		}else{
			this.itemNo +=2;
			addClass(getId('xueqian_preschoolRecommendTop-item_'+this.itemNo),'preschooltTopRecommendHover');	
		}
	},
	left:function () {  
		if(this.itemNo == 0)return;
		removeClass(getId('xueqian_preschoolRecommendTop-item_'+this.itemNo),'preschooltTopRecommendHover');	
		if(this.itemNo == 1 || this.itemNo == 3){
			this.itemNo = 0;
			addClass(getId('xueqian_preschoolRecommendTop-item_'+this.itemNo),'preschooltTopRecommendHover');	
		}else{
			this.itemNo--;
			addClass(getId('xueqian_preschoolRecommendTop-item_'+this.itemNo),'preschooltTopRecommendHover');	
		}
	},
	right:function () {  
		if(this.itemNo == 2 || this.itemNo == 4)return;
		removeClass(getId('xueqian_preschoolRecommendTop-item_'+this.itemNo),'preschooltTopRecommendHover');
		this.itemNo++;
		addClass(getId('xueqian_preschoolRecommendTop-item_'+this.itemNo),'preschooltTopRecommendHover');	
	},
	enter:function () {
		if(this.list.elementList[this.itemNo].elementType == 1){
			var pos = Home.scrollArr.length == 0?0:Home.scrollArr[Home.scrollArr.length-1];
			var backUrl = window.location.pathname + '?pos='+pos+'&itemNo=' + this.itemNo + '&columnName=preschoolRecommendTop&navItem='+Home.itemNo;
			routeJump(1,backUrl,this.list.elementList[this.itemNo].jsonUrl)
		}		
	}
};


//  模板二
 var preschoolRecommendTop_6 = {
	 itemNo:0,
	 id:0,
	 list:[],
	 template:function (list) {  
		this.itemNo = 0;
		this.id = list.specialId;
		this.list = list;
		var xueqian_preschoolRecommendTop_6Html = '';
		for (var  i = 0; i < list.elementList.length; i++) {
		   var div = '<div class="itemWrap" id="preschoolRecommendTop_6-item_'+i+'"><div class="imgWrap"><img class="lazyload" src="source/public/images/img_loading_160x230.png"  data-img="' + list.elementList[i].elementImg + '"/></div></div>'	
		   xueqian_preschoolRecommendTop_6Html+=div;
	   }
		return '<div class="xueqian_preschoolRecommendTop_6">'+xueqian_preschoolRecommendTop_6Html+'</div>';
	 },
	 init:function (itemNo) {  
		if(itemNo){
			this.itemNo = itemNo;
		}
        areaObj = preschoolRecommendTop_6;
        addClass(getId('preschoolRecommendTop_6-item_'+this.itemNo),'preschooltTopFilterHover');       
    },
    up:function () {  
      removeClass(getId('preschoolRecommendTop_6-item_'+this.itemNo),'preschooltTopFilterHover'); 
      var i = handleCoponentsKey(homePreschool.coponentIdList,this.id,'up');
      eval(Home.homeCategoryChildrenList[i].layout).init();  
    },
    down:function () {  
      removeClass(getId('preschoolRecommendTop_6-item_'+this.itemNo),'preschooltTopFilterHover'); 
      var i = handleCoponentsKey(homePreschool.coponentIdList,this.id,'down');
	  eval(Home.homeCategoryChildrenList[i].layout).init();  
	  pageScroll(Home.homeCategoryChildrenList[i].layout,'down',eleOffsetTop('#preschoolRecommendTop_6-item_'+this.itemNo)+150)
    },
    left:function () {  
      if(this.itemNo == 0)return;
      removeClass(getId('preschoolRecommendTop_6-item_'+this.itemNo),'preschooltTopFilterHover'); 
      this.itemNo--;   
      addClass(getId('preschoolRecommendTop_6-item_'+this.itemNo),'preschooltTopFilterHover');       
    },
    right:function () {  
      if(this.itemNo == 5)return;
      removeClass(getId('preschoolRecommendTop_6-item_'+this.itemNo),'preschooltTopFilterHover'); 
      this.itemNo++;   
      addClass(getId('preschoolRecommendTop_6-item_'+this.itemNo),'preschooltTopFilterHover');   
	},
	enter:function () {
		if(this.list.elementList[this.itemNo].elementType == 1){
			var pos = Home.scrollArr.length == 0?0:Home.scrollArr[Home.scrollArr.length-1];
			var backUrl = window.location.pathname + '?pos='+pos+'&itemNo=' + this.itemNo + '&columnName=preschoolRecommendTop_6&navItem='+Home.itemNo;
			routeJump(1,backUrl,this.list.elementList[this.itemNo].jsonUrl)
		}		
	}
	 
 };
