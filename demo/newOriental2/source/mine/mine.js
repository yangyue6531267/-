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

var areaObj;

var rowTsDiff = 340;

var grepEvent = function( e ){
  var keyCode = e.keyCode || e.which;
  return onKeyPress(KEYMAP[keyCode]);
};

var getData = function (url, sucessfn, errorfn) {
  ajax({
    type: "GET",
    url: url,
    data: {},
    dataType: "json",
    success: sucessfn,
    fail: errorfn
  })
}

var findAllObj = userTrackObj.findAll();
//查询历史收藏记录
userTrackList( findAllObj,function(res){
  data = eval('('+res+')').data.resultList;
  var arrObj = segsArr(data,'relateCategory');
  mine_wrapper.init();
  mine_tabBar.init();
  mine_history.init( arrObj.a );
  mine_collect.init( arrObj.s );
  if( !mine_history.hisList.length && !mine_collect.collList.length ){
    addClass( getElement('.nothing'),'show' )
  } else {
    removeClass( getElement('.nothing'),'show' );
  }
  if( window.location.href.indexOf('?') != -1 ){
    var area = getUrlParam('area');
    var num = getUrlParam('num');
    if( area > 0 ){
      mine_wrapper.diff = -rowTsDiff;
      mine_wrapper.elTransition( 'top',-rowTsDiff );
    }
    switch( area ){
      case '0':
        areaObj = mine_tabBar;
      break;

      case '1':
        removeClass(getElement('.m_btn-'+ mine_tabBar.itemNo),'btnhover');
        mine_history.itemNo = num;
        addClass( getElement('.yh_list_item-h' + mine_history.itemNo),'hover' );
        areaObj = mine_history;
      break;

      default:
        removeClass(getElement('.m_btn-'+ mine_tabBar.itemNo),'btnhover');
        mine_collect.itemNo = num;
        addClass( getElement('.yh_list_item-c' + mine_collect.itemNo),'hover' );
        areaObj = mine_collect;
    }
  } else {
    areaObj = mine_tabBar;
  }
  bi.pageJump( '个人中心','个人中心' );
},function(err){
  console.log(err);
});

//容器
var mine_wrapper = {};

//订购栏
var mine_tabBar = {};

//观看记录
var mine_history = {};

//观看收藏
var mine_collect = {};

mine_wrapper.diff = 0;

mine_wrapper.init = function(){
  this.wrapperEl = getElement('.mine_wrapper');
}

mine_wrapper.elTransition = function( dir,dis ){
  this.wrapperEl.style[dir] = this.wrapperEl.offsetTop + dis + 'px';
}



//订购抽奖栏
mine_tabBar.itemNo = 0;

mine_tabBar.init = function(){
  this.orderEl = getElement('.mine_order');
  this.lottery = getElement('.mine_Lottery');
  addClass(getElement('.m_btn-'+ this.itemNo),'btnhover');
}

mine_tabBar.up = function(){};

mine_tabBar.down = function(){
  if( mine_history.hisList.length ){
    if( mine_wrapper.diff != mine_wrapper.wrapperEl.offsetTop ) return;
    removeClass(getElement('.m_btn-'+ this.itemNo),'btnhover');
    mine_wrapper.diff = -rowTsDiff;
    mine_wrapper.elTransition( 'top',-rowTsDiff );
    areaObj = mine_history;
    addClass( getElement('.yh_list_item-h' + mine_history.itemNo),'hover' );
  } else {
    if( mine_collect.collList.length ){
      removeClass(getElement('.m_btn-'+ this.itemNo),'btnhover');
      areaObj = mine_collect;
      addClass( getElement('.yh_list_item-c' + mine_collect.itemNo),'hover' );
    }
  }
};

mine_tabBar.left = function(){
  this.direction(0);
};

mine_tabBar.right = function(){
  this.direction(1);
};

mine_tabBar.enter = function(){
  var num = this.itemNo;
  if( this.itemNo ){

  } else {
    var obj = {
      num: num
    };
    setCookie( obj, 0, 'orderbackUrl', '' );
    window.location.href = "../order/order.html";
    console.log(areaObj)
  }
};

mine_tabBar.direction = function( flag ){
  removeClass(getElement('.m_btn-'+ this.itemNo),'btnhover');
  if( flag ){
    if( this.itemNo < 1 ){
      this.itemNo ++;
    }
  } else {
    if( this.itemNo > 0  ){
      this.itemNo --;
    }
  }
  addClass(getElement('.m_btn-'+ this.itemNo),'btnhover');
}



//个人中心历史记录栏
mine_history.itemNo = 0;

mine_history.hisList = [];

mine_history.watchMore = false;

mine_history.init = function( hisArr ){
  if( !hisArr.length ){
    return;
  }
  this.hisList = hisArr;
  this.el = getElement('.mine_history');
  this.template();
};

mine_history.template = function(){
  var list = '';
  var watchMore = '';
  if( this.hisList.length > 5 ){
    this.hisList = this.hisList.slice( 0,5 );
     watchMore = '<div class="yh_list_item yh_list_item-h5">'+
                    '<div class="video_watchMore">'+
                    '<div class ="info_bg"></div>'+
                      '<div class="watchMore">查看更多</div>'+
                    '</div>'+
                  '</div>';
    this.watchMore = true;
  } else {
    this.watchMore = false;
  }
  this.hisList && this.hisList.forEach(function( item,index ){
    var dom = '<div class="yh_list_item yh_list_item-h'+index+'">'+
                '<div class="video_info">'+
                '<div class ="info_bg"></div>' +
                  '<div class="video_score">'+
                    '<span class="score"> '+item.relateScore  +' </span>'+
                  '</div>'+
                  '<div class="video_img">'+
                  '<img src ="'+item.relateImg+'"/>'
                  +'</div>'+
                '</div>'+
                '<div class="video_name">'+
                item.relateTitle +
                '</div>'+
              '</div>';
    list += dom;
  });
  list += watchMore;
  var str = '<div class="yh_list">' +
                '<div class="item_day">'+
                  '<i class="arc"></i>'+
                  '<span class="date">最近观看</span>'+
                '</div>'+
              '<div class="yh_list_wrapper">'+
                  '<div class="yh_list_scroller">'+
                  list +
                  '</div>'+
                '</div>'+
              '</div>'
  this.el.innerHTML = str;
};

mine_history.up = function(){
  if( mine_wrapper.diff != mine_wrapper.wrapperEl.offsetTop ) return;
  removeClass( getElement('.yh_list_item-h' + this.itemNo),'hover' );
  areaObj = mine_tabBar;
  mine_wrapper.diff = 0;
  mine_wrapper.elTransition( 'top',rowTsDiff );
  addClass(getElement('.m_btn-'+ mine_tabBar.itemNo),'btnhover');
};

mine_history.down = function(){
  if( mine_collect.collList.length ){
    removeClass( getElement('.yh_list_item-h' + this.itemNo),'hover' );
    areaObj = mine_collect;
    addClass( getElement('.yh_list_item-c' + mine_collect.itemNo),'hover' );
  }
};

mine_history.left = function(){
  this.direction(0);
};

mine_history.right = function(){
  this.direction(1);
};

mine_history.enter = function(){
  var num = this.itemNo;
  if( this.itemNo < 5 ){
    console.log( this.hisList[this.itemNo],'obj' );
    var jsonUrl = this.hisList[this.itemNo].relateUrl;
    var obj = {
      num: num
    };
    setCookie( obj, 1, 'backUrl',jsonUrl );
    window.location.href = "../detail/detail.html";
  } else {
    var obj = {
      num: num
    };
    setCookie( obj, 1, 'hobbyBackUrl', '' );
    window.location.href = "../history/history.html"
  }
};

mine_history.direction = function( flag ){
  removeClass( getElement('.yh_list_item-h' + this.itemNo),'hover' );
  if( flag ){
    if( this.itemNo < this.hisList.length - 1 ){
      this.itemNo ++;
    } else {
      if( this.watchMore ){
        if( this.itemNo == this.hisList.length - 1){
          this.itemNo ++;
        }
      }
    }
  } else {
    if( this.itemNo > 0 ){
      this.itemNo --;
    }
  }
  addClass( getElement('.yh_list_item-h' + this.itemNo),'hover' );
};



//个人中心收藏栏
mine_collect.itemNo = 0;

mine_collect.collList = [];

mine_collect.watchMore = false;

mine_collect.init = function( colArr ){
  if( !colArr.length ){
    return;
  }
  this.collList = colArr;
  this.el = getElement('.mine_collect');
  this.template();
};

mine_collect.template = function(){
  var list = '';
  var watchMore = '';
  if( this.collList.length > 5 ){
    this.collList = this.collList.slice( 0,5 );
     watchMore = '<div class="yh_list_item yh_list_item-c5">'+
                  '<div class="video_watchMore">'+
                  '<div class ="info_bg"></div>'+ 
                    '<div class="watchMore">查看更多</div>'+
                  '</div>'+
                '</div>';
    this.watchMore = true;
  } else {
    this.watchMore = false;
  }
  this.collList && this.collList.forEach(function( item,index ){
    var dom = '<div class="yh_list_item yh_list_item-c'+index+'">'+
                '<div class="video_info">'+
                '<div class ="info_bg"></div>'+
                  '<div class="video_score">'+
                    '<span class="score"> '+item.relateScore+' </span>'+
                  '</div>'+
                  '<div class="video_img">'+
                  '<img src ="'+item.relateImg+'"/>'
                  +'</div>'+
                '</div>'+
                '<div class="video_name">'+
                item.relateTitle +
                '</div>'+
              '</div>';
    list += dom;
  });
  list += watchMore;
  var str = '<div class="yh_list">' +
                '<div class="item_day">'+
                  '<i class="arc"></i>'+
                  '<span class="date">最近收藏</span>'+
                '</div>'+
              '<div class="yh_list_wrapper">'+
                  '<div class="yh_list_scroller">'+
                  list +
                  '</div>'+
                '</div>'+
              '</div>'
  this.el.innerHTML = str;
};

mine_collect.up = function(){
  if( mine_history.hisList.length ){
    removeClass( getElement('.yh_list_item-c' + this.itemNo),'hover' );
    areaObj = mine_history;
    addClass( getElement('.yh_list_item-h' + mine_history.itemNo),'hover' );
    
  } else {
    removeClass( getElement('.yh_list_item-c' + this.itemNo),'hover' );
    areaObj = mine_tabBar;
    addClass(getElement('.m_btn-'+ mine_tabBar.itemNo),'btnhover');
  }
};

mine_collect.down = function(){};

mine_collect.left = function(){
  this.direction(0);
};

mine_collect.right = function(){
  this.direction(1);
};

mine_collect.enter = function(){
  var num = this.itemNo;
  if( this.itemNo < 5 ){
    console.log( this.collList[this.itemNo],'obj' );
    var jsonUrl = this.collList[this.itemNo].relateUrl;
    var obj = {
      num: num
    };
    setCookie( obj, 2, 'backUrl', jsonUrl );
    window.location.href = "../detail/detail.html";
  } else {
    var obj = {
      num: num
    };
    setCookie( obj, 2, 'hobbyBackUrl', '' );
    window.location.href = "../collect/collect.html"
  }
};

mine_collect.direction = function( flag ){
  removeClass( getElement('.yh_list_item-c' + this.itemNo),'hover' );
  if( flag ){
    if( this.itemNo < this.collList.length - 1 ){
      this.itemNo ++;
    } else {
      if( this.watchMore ){
        if( this.itemNo == this.collList.length - 1){
          this.itemNo ++;
        }
      }
    }
  } else {
    if( this.itemNo > 0 ){
      this.itemNo --;
    }
  }
  addClass( getElement('.yh_list_item-c' + this.itemNo),'hover' );
};



function setCookie ( obj,controler, backName,detailUrl ){
  var href = window.location.href;
  var backUrl = href.indexOf('?') != -1 ? href.split('?')[0] : href;
  obj['area'] = controler;
  var paramString = objToUrl( obj , true );
  Cookies.set( 'parent_page_type', '个人中心', {
    path:'/'
  });
  Cookies.set( 'parent_page_id', '个人中心', {
    path:'/'
  });
  Cookies.set( backName, backUrl + '?'+ paramString, {
    path:'/'
  });
  if( detailUrl ){
    Cookies.set('detailUrl',detailUrl,{
      expires:7,
      path:'/'
    });
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
      var mineBackUrl = Cookies.get('mineBackUrl')
      window.location.href =  mineBackUrl || '../../index.html';
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