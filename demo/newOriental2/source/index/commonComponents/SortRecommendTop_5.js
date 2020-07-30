// 筛选组件
//  模板二
var SortRecommendTop_5 = {
    itemNo:0,
    id:0,
    list:[],
    fatherList:[],
    coponentIdList:[],
    template:function (dataList,list) {  
        this.itemNo = 0;
        this.list = list;
        this.fatherList = dataList;
        this.coponentIdList = [];
        for (var i = 0; i < this.fatherList.length; i++) {
			     this.coponentIdList.push(this.fatherList[i].specialId)	 
		    }
        this.id = list.specialId;
       var SortRecommendTop_5Html = '';
       for (var  i = 0; i < list.elementList.length; i++) {
          var div = '<div class="itemWrap" id="SortRecommendTop_5-item_'+i+'"><div class="imgWrap">'+list.elementList[i].elementName+'</div></div>'	
          SortRecommendTop_5Html+=div;
      }
       return '<div class="chuzhong_SortRecommendTop_5 SortRecommendTop_5">'+SortRecommendTop_5Html+'</div>';
    },
    init:function (itemNo) { 
        if(itemNo){
          this.itemNo = itemNo;
        } 
        areaObj = SortRecommendTop_5;
        addClass(getId('SortRecommendTop_5-item_'+this.itemNo),'topFilterHover');       
    },
    up:function () {  
      removeClass(getId('SortRecommendTop_5-item_'+this.itemNo),'topFilterHover'); 
      var i = handleCoponentsKey(this.fatherList,this.id,'up');
      eval(Home.homeCategoryChildrenList[i].layout).init();  
      pageScroll('','up')
    },
    down:function () {  
      removeClass(getId('SortRecommendTop_5-item_'+this.itemNo),'topFilterHover'); 
      var i = handleCoponentsKey(this.fatherList,this.id,'down');
      eval(Home.homeCategoryChildrenList[i].layout).init();  
      pageScroll(Home.homeCategoryChildrenList[i].layout,'down',eleOffsetTop('#SortRecommendTop_5-item_'+this.itemNo)+100)     
    },
    left:function () {  
      if(this.itemNo == 0)return;
      removeClass(getId('SortRecommendTop_5-item_'+this.itemNo),'topFilterHover'); 
      this.itemNo--;   
      addClass(getId('SortRecommendTop_5-item_'+this.itemNo),'topFilterHover');       
    },
    right:function () {  
      if(this.itemNo == 4)return;
      removeClass(getId('SortRecommendTop_5-item_'+this.itemNo),'topFilterHover'); 
      this.itemNo++;   
      addClass(getId('SortRecommendTop_5-item_'+this.itemNo),'topFilterHover');   
    },
    enter:function () {  
      if(this.list.elementList[this.itemNo].elementType == 7){
        var pos = Home.scrollArr.length == 0?0:Home.scrollArr[Home.scrollArr.length-1];
        var backUrl = window.location.pathname + '?pos='+pos+'&itemNo=' + this.itemNo + '&columnName=SortRecommendTop_5&navItem='+Home.itemNo + '&catId=' + this.list.elementList[this.itemNo].elementId;
        routeJump(7,backUrl,this.list.elementList[this.itemNo].jsonUrl)
      }    
    }
};
