// 初中 高中 成教 头部
//  模板一
var normalRecommendTop = {
	itemNo:0,
    id:0,
    list:[],
    fatherList:[],
    coponentIdList:[],
	template:function (dataList,list) {  
        this.list = list;
        this.itemNo = 0;
        this.coponentIdList = dataList;
        this.id = list.specialId;
		var normalRecommendTopHtml = '';
		for (var i = 0; i < list.elementList.length; i++) {
			var div = '<div class="itemWrap" id="normalRecommendTopHtml-item_'+i+'"><div class="imgWrap"><img class="lazyload" src="source/public/images/img_loading_160x230.png"  data-img="' + list.elementList[i].elementImg + '"/></div></div>'
			normalRecommendTopHtml+=div;
		}
		return '<div class="xiaoxue_normalRecommendTop normalRecommendTop">'+normalRecommendTopHtml+'</div>'		
    },
    init:function (itemNo) {  
		if(itemNo){
			this.itemNo = itemNo;
		}
        areaObj = normalRecommendTop;
        if(this.itemNo == 0 || this.itemNo == 1 || this.itemNo == 2){
            addClass(getId('normalRecommendTopHtml-item_'+this.itemNo),'topRecommendHover3');           
        }else{
            addClass(getId('normalRecommendTopHtml-item_'+this.itemNo),'topRecommendHover2'); 
        }      
    },
    left:function () {  
        if(this.itemNo == 0)return;
        if(this.itemNo == 1){
            removeClass(getId('normalRecommendTopHtml-item_'+this.itemNo),'topRecommendHover3');       
            this.itemNo = 0;
            addClass(getId('normalRecommendTopHtml-item_'+this.itemNo),'topRecommendHover2');     
            return;         
        }
        if(this.itemNo == 2){
            removeClass(getId('normalRecommendTopHtml-item_'+this.itemNo),'topRecommendHover3');       
            this.itemNo = 1;
            addClass(getId('normalRecommendTopHtml-item_'+this.itemNo),'topRecommendHover3');  
            return;  
        }
        if(this.itemNo == 3){
            removeClass(getId('normalRecommendTopHtml-item_'+this.itemNo),'topRecommendHover2');       
            this.itemNo = 0;
            addClass(getId('normalRecommendTopHtml-item_'+this.itemNo),'topRecommendHover2');        
            return;          
        }
        removeClass(getId('normalRecommendTopHtml-item_'+this.itemNo),'topRecommendHover2');       
        this.itemNo--;
        addClass(getId('normalRecommendTopHtml-item_'+this.itemNo),'topRecommendHover2'); 
    },
    right:function () { 
        if(this.itemNo == 0){
            removeClass(getId('normalRecommendTopHtml-item_'+this.itemNo),'topRecommendHover3'); 
            this.itemNo = 1;
            addClass(getId('normalRecommendTopHtml-item_'+this.itemNo),'topRecommendHover3'); 
            return;  
        } 
        if(this.itemNo == 1){
            removeClass(getId('normalRecommendTopHtml-item_'+this.itemNo),'topRecommendHover3'); 
            this.itemNo = 2;
            addClass(getId('normalRecommendTopHtml-item_'+this.itemNo),'topRecommendHover3'); 
            return;              
        }
        if(this.itemNo == 2 || this.itemNo == 6)return;
        removeClass(getId('normalRecommendTopHtml-item_'+this.itemNo),'topRecommendHover2');       
        this.itemNo++;
        addClass(getId('normalRecommendTopHtml-item_'+this.itemNo),'topRecommendHover2');       
    },
    down:function () {    
        if(this.itemNo == 1 || this.itemNo == 2){
            removeClass(getId('normalRecommendTopHtml-item_'+this.itemNo),'topRecommendHover3');     
            this.itemNo+=2;
            addClass(getId('normalRecommendTopHtml-item_'+this.itemNo),'topRecommendHover2');  
            return;
        }else{
            if(this.itemNo == 0 ){
            removeClass(getId('normalRecommendTopHtml-item_'+this.itemNo),'topRecommendHover3'); 
            }else{
            removeClass(getId('normalRecommendTopHtml-item_'+this.itemNo),'topRecommendHover2'); 
            }
			var i = handleCoponentsKey(this.coponentIdList,this.id,'down');
            eval(Home.homeCategoryChildrenList[i].layout).init();    
			pageScroll(Home.homeCategoryChildrenList[i].layout,'down',eleOffsetTop('#normalRecommendTopHtml-item_'+this.itemNo)+383)                 
        }
    },
    up:function () {  
        if(this.itemNo >= 3){   
            removeClass(getId('normalRecommendTopHtml-item_'+this.itemNo),'topRecommendHover2'); 
            this.itemNo = 2;
            addClass(getId('normalRecommendTopHtml-item_'+this.itemNo),'topRecommendHover3');       
        }else{
            removeClass(getId('normalRecommendTopHtml-item_'+this.itemNo),'topRecommendHover3'); 
            Home.init(Home.itemNo+1);
        }
    },
    enter:function () {
		if(this.list.elementList[this.itemNo].elementType == 1){
			var pos = Home.scrollArr.length == 0?0:Home.scrollArr[Home.scrollArr.length-1];
			var backUrl = window.location.pathname + '?pos='+pos+'&itemNo=' + this.itemNo + '&columnName=normalRecommendTop&navItem='+Home.itemNo;
			routeJump(1,backUrl,this.list.elementList[this.itemNo].jsonUrl)
		}		
	}
};