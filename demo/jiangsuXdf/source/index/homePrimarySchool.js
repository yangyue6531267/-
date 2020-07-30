//小学

var homePrimarySchool = {
	homePrimarySchoolList:[],
	coponentIdList:[],
	name:'homePrimarySchool',
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
	},
	firstModularInit:function () {  
		normalRecommendTop.init();
	}
}

//  模板二
 var primarySchoolRecommendTop_7 = {
	 itemNo:0,
	 id:0,
	 list:[],
	 name:'primarySchoolRecommendTop_7',
	 template:function (list) {  
		this.list = list;
		this.itemNo = 0;
		this.id = list.specialId;
		var xiaoxue_primarySchoolRecommendTop_7Html = '';
		console.log(list)
		for (var  i = 0; i < list.elementList.length; i++) {
		   var div = '<div class="itemWrap" id="primarySchoolRecommendTop_7-item_'+i+'"><div class="imgWrap"><img src="'+list.elementList[i].elementImg+'"></div></div>'	
		   xiaoxue_primarySchoolRecommendTop_7Html+=div;
	   }
		return '<div class="primarySchoolRecommendTop_7">'+xiaoxue_primarySchoolRecommendTop_7Html+'</div>';
	 },
	 init:function (itemNo) { 
		if(itemNo){
			this.itemNo = itemNo;
		} 
        areaObj = primarySchoolRecommendTop_7;
        setTimeout(function(){
			addClass(getId('primarySchoolRecommendTop_7-item_'+primarySchoolRecommendTop_7.itemNo),'topFilterHover');     
		},10)		 
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
		  var pos_id = '0'+(Home.itemNo+1)+'020'+(this.itemNo+1);
		  bi.recommendClick(pos_id,'0','0101',Home.homeCategoryList.data.catList[Home.itemNo].catId,'4',this.list.elementList[this.itemNo].elementId);
		  var num = '';
		  var classification = '';
		  var catCode = '';
		  if(this.list.specialName == "小学筛选分类"){
			num = 'xcgkt';
			classification = '小学'
			catCode = 'Primaryschool';
	      }
		  var pos = Home.scrollArr.length == 0?0:Home.scrollArr[Home.scrollArr.length-1];
		  var backUrl = window.location.pathname + '?pos='+pos+'&itemNo=' + this.itemNo + '&columnName=primarySchoolRecommendTop_7&navItem='+Home.itemNo + '&catId=' + this.list.elementList[this.itemNo].elementId;
		  routeJumpFilter(num,backUrl,classification,this.list.elementList[this.itemNo].elementName,catCode)		
	  },
	back:function () {
		backTop(getId('primarySchoolRecommendTop_7-item_'+this.itemNo),'topFilterHover')
		this.itemNo = 0;
	  }
 };
