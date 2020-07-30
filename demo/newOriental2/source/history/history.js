

var KEYMAP = {
  38: "up",
  40: "down",
  37: "left",
  39: "right",
  13: "enter",
  8: "back",
  27: "back",
  22: "back",
  283: 'back',
  461: "back",
  340: "back",
  181: "home", // 首页
  278: "message", // 信息
  272: "home",
};

//列的滚动距离
var rowDiff = 370;

//行的滚动距离
var colDiff = 1188;

//收藏到推荐内容的距离
var recDiff = 126;

var grepEvent = function( e ){
  var keyCode = e.keyCode || e.which;
  return onKeyPress(KEYMAP[keyCode]);
};

var areaObj;

var url = "http://47.97.96.103/?s=120|15&p=yhAssetDetail&k=1&v=1&assetId=8334&c=15"
var history_Content = {};

var history_recommend = {};

var history_list_progress = {};

var value = {
  detailData:null,
  isBack:false,
  detailUrl:'',
  getValue: function(){
    this.detailUrl = Cookies.get('detailUrl')
  }
}

function setCookie ( obj,jsonUrl ){
  
  Cookies.set( 'parent_page_type', '0501', {
    path:'/'
  });
  Cookies.set( 'parent_page_id', '103-1', {
    path:'/'
  });
  if(!obj) return;
  var href = window.location.href;
  var backUrl = href.indexOf('?') != -1 ? href.split('?')[0] : href;
  var paramString = objToUrl( obj, true );
  Cookies.set( 'backUrl', backUrl + '?'+ paramString, {
    expires:7,
    path:'/'
  });
  Cookies.set('detailUrl',jsonUrl || url,{
    path:'/'
  });
}

function getRecomd(){
  //获取推荐列表
  getsearchRecommend(function( res ){
    res = eval('('+ res +')');
    history_recommend.recommendList = res.data.hotAssetList;
    console.log(res,'res');
    history_recommend.init();
    var rec ='';
    rec = getUrlParam('rec');
    if( rec ){
      if(getElement('.yh_list_item-' + history_Content.pos +'-'+ history_Content.curPageIndex +'-' + history_Content.itemNo)){
        removeClass( getElement('.yh_list_item-' + history_Content.pos +'-'+ history_Content.curPageIndex +'-' + history_Content.itemNo),'hover' );
      }
      history_Content.pos = history_Content.history_list.length - 1;
      if(!history_Content.pos){
        history_Content.topDiff = history_Content.el.offsetTop - recDiff;
      } else {
        history_Content.topDiff = history_Content.el.offsetTop - ( ( history_Content.history_list.length - 1 ) * rowDiff + recDiff);
      }
      history_Content.domTransition( 'el', 'top', history_Content.topDiff + 'px');
      history_recommend.itemNo = rec;
      if( rec > 5 ){
        history_recommend.domTransition('scroller',  - ( rec - 5 )  );
      }  
      addClass( getElement('.yh_list_item-' + history_recommend.itemNo),'hover' );
      areaObj = history_recommend;
    } else {
      if( history_Content.history_list.length ){
        areaObj = history_Content;
        addClass( getElement('.yh_list_item-' + history_Content.pos +'-'+ history_Content.curPageIndex +'-' + history_Content.itemNo),'hover' );
      } else {
        addClass( getElement('.yh_list_item-' + history_recommend.itemNo),'hover' );
        areaObj = history_recommend;
      }
    }
  },function(){
    getRecomd();
  });
}


//查询用户观看历史记录
var userObj = userTrackObj.searchUserTrack( true );
userTrackList( userObj,function(res){
  value.detailData = eval('('+ res +')').data;
  console.log(value.detailData.resultList);
  if( window.location.href.indexOf('?') != -1 ){
    var tagArr = getUrlParam('tag') && getUrlParam('tag').split('-');
    if( tagArr ){
      history_Content.pos = tagArr[0];
      history_Content.curPageIndex = tagArr[1];
      history_Content.itemNo = tagArr[2];
    }
  }
  history_Content.init();
  getRecomd();
  bi.pageJump( '103-1', '0501' );
},function(err){
  console.log(err);
});


history_list_progress.getDomStr = function( tag, pageIndex, totalIndex ){
  var per = pageIndex / totalIndex * 100 + "%";
  var pro = '<div class="list_scrollBar_Content">'+
             '<div class="list_scrollBar">'+
              '<div class="list_scrollBlock list_scrollBlock-'+ tag +'" style="width:'+ per +'"></div>'+
             '</div>'+
            '</div>'
      return pro;
}




history_Content.itemNo = 0;
 
history_Content.pos = 0;

//当前页数下标
history_Content.curPageIndex = 0;

//当前行
history_Content.curList = '';

//当前页
history_Content.curPage = '';

//当前滚动元素
history_Content.curScroller = '';

//当前滑块
history_Content.curProBlock = '';

history_Content.hashistory = false;

history_Content.leftDiff = 0;

history_Content.topDiff = 0;

history_Content.init = function(){
  history_Content.history_list = groupArrByTime(value.detailData.resultList,'relateTime');
  // if( this.history_list.length ){
  //   if( this.history_list.length == 1 ){
  //     rowDiff = 126
  //   } else {
  //     rowDiff = parseInt((370  + (130 / this.history_list.length - 1)));
  //   }
  // }
  this.el = getElement('.history_wrapper');
  this.template();
  this.topDiff = this.el.offsetTop - ( this.pos * rowDiff );
  this.domTransition( 'el', 'top', this.topDiff + 'px');
  this.leftDiff = this.curScroller.offsetLeft - ( colDiff * this.curPageIndex );
  this.domTransition('curScroller','left',this.leftDiff + 'px');
  if( this.curProBlock ){
    this.curProBlock.style.left =  ( this.curPageIndex / this.curList.length * 100 + '%'); 
  }
};

history_Content.template = function(){
  if ( this.history_list.length ){
    var frg = '';
    var _this = this;
    this.history_list && this.history_list.forEach(function( item,index ){
      var domStr = _this.getDomStr( item.list,index );
      var proStr = '';
      if( item.list.length > 1 ){
       proStr = history_list_progress.getDomStr( index, 1 ,item.list.length );
      }
      var str = '<div class="yh_list">' +
                  '<div class="item_day">'+
                    '<i class="arc"></i>'+
                    '<span class="date"> '+item.title+' </span>'+
                  '</div>'+
                '<div class="yh_list_wrapper">'+
                    '<div class="yh_list_scroller yh_list_scroller-'+ index +'">'+
                      domStr +
                    '</div>'+
                  '</div>'+
                  proStr +
                '</div>'
      frg += str;
    });
    
    this.el.innerHTML = frg;
    this.curList = this.history_list[this.pos].list;
    this.curScroller = getElement('.yh_list_scroller-' + this.pos);
    this.curProBlock = getElement('.list_scrollBlock-' + this.pos);
    this.hashistory = true;
  } else {
    var str = '<div class="history_none">'+
                '<span>还没有学习记录，快去学习吧</span>'+
              '</div>'
    this.el.innerHTML = str;
  }
};

history_Content.getDomStr = function( listData,row ){
  var list = '';
  listData && listData.forEach(function( item,tag ){
    item && item.forEach(function( element, index ){
      var dom = '<div class="yh_list_item yh_list_item-'+ row +'-'+tag+'-'+index+'">'+
                  '<div class="video_info">'+
                  '<div class ="info_bg"></div>'+
                    '<div class="video_score">'+
                      '<span class="score"> '+element.relateScore+' </span>'+
                    '</div>'+
                    '<div class="video_img">'+
                    '<img src="'+ element.relateImg +'"/>'
                    +'</div>'+
                  '</div>'+
                  '<div class="video_name">'+
                      element.relateTitle +
                  '</div>'+
                '</div>'
      list += dom;
    })
    
  });
  return list;
}

history_Content.getCurDom = function(){
  this.curList = this.history_list[this.pos].list;
  this.curScroller =  getElement('.yh_list_scroller-' + this.pos);
  this.curProBlock =  getElement('.list_scrollBlock-' + this.pos);
} 

history_Content.domTransition = function( el, dir, dis ){
  if( this[el] ){
    this[el].style[dir] = dis;
  }
}

history_Content.colTransition = function( flag, dis ){
  this.leftDiff = this.curScroller.offsetLeft - (flag * dis);
  this.domTransition('curScroller','left',this.leftDiff + 'px');
}

history_Content.rowTransition = function( flag, dis ){
  this.topDiff = this.el.offsetTop - (flag * dis);
  this.domTransition( 'el', 'top', this.topDiff + 'px');
}


history_Content.up = function(){
  if( this.topDiff != this.el.offsetTop ) return;
  if( this.pos > 0 ){
    removeClass( getElement('.yh_list_item-' + this.pos +'-'+ this.curPageIndex +'-' + this.itemNo),'hover' );
    this.pos --;
    this.getCurDom();
    
    var dis;
    // this.topDiff = this.el.offsetTop + rowDiff;
    // this.domTransition( 'el', 'top', this.topDiff + 'px');
    if( this.curPageIndex > this.curList.length - 1 ){
      this.curPageIndex = this.curList.length - 1;
      this.leftDiff = - this.curPageIndex * colDiff ;
      
      dis = this.leftDiff + 'px'; 
    } else {
      dis = - this.curPageIndex * colDiff + 'px'; 
    }
    if( this.itemNo > this.curList[this.curPageIndex].length - 1 ){
      this.itemNo = this.curList[this.curPageIndex].length -1;
    }   
    this.rowTransition( -1, rowDiff);
    this.domTransition( 'curScroller','left', dis );
    if( this.curProBlock ){
      this.curProBlock.style.left =  ( this.curPageIndex / this.curList.length * 100 + '%'); 
    }
    addClass( getElement('.yh_list_item-' + this.pos +'-'+ this.curPageIndex +'-' + this.itemNo),'hover' );
  } else {
    console.log('到底了')
  }
};

history_Content.down = function(){
  if( this.topDiff != this.el.offsetTop ) return;
  if( this.pos < this.history_list.length - 1 ){
    removeClass( getElement('.yh_list_item-' + this.pos +'-'+ this.curPageIndex +'-' + this.itemNo),'hover' );
    this.pos ++;
    this.getCurDom();
    
    var dis;
    // this.topDiff = this.el.offsetTop - rowDiff;
    // this.domTransition( 'el', 'top', this.topDiff+ 'px');
    if( this.curPageIndex > this.curList.length - 1 ){
      this.curPageIndex = this.curList.length - 1;
      this.leftDiff = - this.curPageIndex * colDiff ;
      
      dis = this.leftDiff + 'px';
    } else {
      dis = - this.curPageIndex * colDiff + 'px'; 
    }
    if( this.itemNo > this.curList[this.curPageIndex].length - 1 ){
      this.itemNo = this.curList[this.curPageIndex].length -1;
    }
    this.rowTransition( 1, rowDiff);
    this.domTransition( 'curScroller','left', dis );
    if( this.curProBlock ){
      this.curProBlock.style.left =  ( this.curPageIndex / this.curList.length * 100 + '%'); 
    }
    addClass( getElement('.yh_list_item-' + this.pos +'-'+ this.curPageIndex +'-' + this.itemNo),'hover' );
  } else {
    this.rowTransition( 1, recDiff);
    areaObj = history_recommend;
    removeClass( getElement('.yh_list_item-' + this.pos +'-'+ this.curPageIndex +'-' + this.itemNo),'hover' );
    addClass( getElement('.yh_list_item-' + history_recommend.itemNo),'hover' );
  }
};

history_Content.left = function(){
  this.direction(0);
};

history_Content.right = function(){
  this.direction(1);
};

history_Content.enter = function(){
  console.log( this.curList[this.curPageIndex][this.itemNo],'obj' );
  var jsonUrl = this.curList[this.curPageIndex][this.itemNo].relateUrl
  var tag =  this.pos + '-' + this.curPageIndex + '-' + this.itemNo
  setCookie({
    'tag':tag 
  },jsonUrl);
  window.location.href = '../detail/detail.html';
};

//键盘左右方向
history_Content.direction = function( flag ){
  if( this.leftDiff != this.curScroller.offsetLeft ) return;
  removeClass( getElement('.yh_list_item-' + this.pos +'-'+ this.curPageIndex +'-' + this.itemNo),'hover' );
  if( flag ){
    if( this.itemNo < this.curList[this.curPageIndex].length - 1 ){
      this.itemNo ++;
    } else {
      if( this.curPageIndex < this.curList.length - 1 ){
        this.itemNo = 0;
        this.curPageIndex ++;
        if( this.curProBlock ){
          this.curProBlock.style.left =  ( this.curPageIndex / this.curList.length * 100 + '%'); 
        }
        this.colTransition( 1, colDiff );
        // this.leftDiff = this.curScroller.offsetLeft - colDiff;
        // this.domTransition('curScroller','left',this.leftDiff + 'px');
      }
    }
  } else {
    if( this.itemNo > 0 ){
      this.itemNo --;
    } else {
      if( this.curPageIndex > 0 ){
        this.curPageIndex --;
        this.itemNo = this.curList[this.curPageIndex].length -1;
        // this.leftDiff = this.curScroller.offsetLeft + colDiff
        // // this.curScroller.style.left = this.curScroller.offsetLeft + colDiff + 'px'; 
        // this.domTransition('curScroller','left',this.leftDiff + 'px');
        this.colTransition( -1, colDiff );
        if( this.curProBlock ){
          this.curProBlock.style.left =  ( this.curPageIndex / this.curList.length * 100 + '%'); 
        }
      }
    }
  }
  
  addClass( getElement('.yh_list_item-' + this.pos +'-'+ this.curPageIndex +'-' + this.itemNo),'hover' );
};




history_recommend.itemNo = 0;

history_recommend.recommendList = [];

history_recommend.leftDiff = 0;

history_recommend.scroller = null; //滚动元素

history_recommend.transitionDiff = 220;

history_recommend.init = function(){
  this.el = getElement('.history_recommend');
  this.template();
  this.scroller = getElement('.yh_list_scroller-re');
  console.log(this.scroller,'sc')
};

history_recommend.template = function(){
  var list = '';
  this.recommendList && this.recommendList.forEach(function( item,index ){
    var dom = '<div class="yh_list_item yh_list_item-'+index+'">'+
                '<div class="video_info">'+
                '<div class ="info_bg"></div>'+
                  '<div class="video_img">'
                  + '<img src ="'+ item.elementImg +'"/>' +
                  '</div>'+
                '</div>'+
                '<div class="video_name">'+
                item.elementName +
                '</div>'+
              '</div>';
    list += dom;
  });
  var str = '<div class="yh_list">' +
                '<div class="item_day">'+
                  '<i class="arc"></i>'+
                  '<span class="date">大家都在学</span>'+
                '</div>'+
              '<div class="yh_list_wrapper">'+
                  '<div class="yh_list_scroller yh_list_scroller-re">'+
                  list +
                  '</div>'+
                '</div>'+
              '</div>'
  this.el.innerHTML = str;
  history_Content.el.appendChild( this.el );
};

history_recommend.up = function(){
  if( history_Content.history_list.length ){
    history_Content.rowTransition( -1, recDiff);
    areaObj = history_Content;
    removeClass( getElement('.yh_list_item-' + this.itemNo),'hover' );
    addClass( getElement('.yh_list_item-' + history_Content.pos +'-'+ history_Content.curPageIndex +'-' + history_Content.itemNo),'hover' );
  } 
};

history_recommend.down = function(){};

history_recommend.left = function(){
  this.direction(0);
};

history_recommend.right = function(){
  this.direction(1);
};

history_recommend.enter = function(){
  console.log( this.recommendList[this.itemNo],'obj' );
  var num = this.itemNo;
  var jsonUrl = this.recommendList[this.itemNo].jsonUrl;
  setCookie({
    'rec':num
  },jsonUrl);
  window.location.href = "../detail/detail.html";
};

history_recommend.direction = function( flag ){
  if( this.leftDiff != this.scroller.offsetLeft ){
    return;
  }
  removeClass( getElement('.yh_list_item-' + this.itemNo),'hover' );
  if( flag ){
    if( this.itemNo < this.recommendList.length - 1 ){
      this.itemNo ++;
      if( this.itemNo > 5 ){
        this.domTransition( 'scroller', -1 );
      }
    }
  } else {
    if( this.itemNo > 0 ){
      this.itemNo --;
      if( this.itemNo >=  5 ){
        this.domTransition( 'scroller', 1 );
      }
    }
  }
  addClass( getElement('.yh_list_item-' + this.itemNo),'hover' );
};

history_recommend.domTransition = function( el, dis ){
  if( this[el] ){
    this.leftDiff =  this[el].offsetLeft + dis * this.transitionDiff;
    this[el].style.left = this.leftDiff + 'px';
  } else {
    console.log('元素不存在');
  }
}





onKeyPress = function (keyCode) {
  switch (keyCode) {
    case "up": //上边
    areaObj && areaObj.up();
      break;
    case "down": //下边
    areaObj && areaObj.down();
      break;
    case "left": //左边
    areaObj && areaObj.left();
      break;
    case "right": //右边
    areaObj && areaObj.right();
      break;
    case "back":
        var backUrl = Cookies.get('hobbyBackUrl') || '../../index.html';
        window.location.href = backUrl;
      break;
    case "enter":
      areaObj && areaObj.enter();
      break;
    case "home":
      areaObj && areaObj.home();
      break;
  }
};
//事件绑定
document.onkeydown = grepEvent;