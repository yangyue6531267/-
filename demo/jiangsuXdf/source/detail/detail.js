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

var grepEvent = function( e ){
  var keyCode = e.keyCode || e.which;
  e.preventDefault()
  return onKeyPress(KEYMAP[keyCode]);
};

var areaObj;

var rowTsDiff = 520;


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



var data = {};

var url = Cookies.get('detailUrl') || 'http://47.97.96.103/?s=120|15&p=yhAssetDetail&k=1&v=1&assetId=201838&c=15';

var detail_info = {};

var detail_epoisd_list  = {};

var detail_scroll_Bar = {};



getData(url,
function( res ){
  data = eval('('+res+')').data
  console.log(data)
  detail_epoisd_list.epList = splitArray(data.itemList,10);
  if( window.location.href.indexOf('?') != -1 ){
    var curIndex = window.location.href.split('?')[1];
    var pageIndex = parseInt(curIndex / 10);
    var itemNo = curIndex % 10;
    detail_epoisd_list.itemNo = itemNo;
    detail_epoisd_list.pageIndex = pageIndex;
    areaObj = detail_epoisd_list;
  } else {
    areaObj = detail_info;
  }
  var userObj = userTrackObj.checkCollect('1',data.assetId);
  userTrackList( userObj,function(res){
    var response =  eval('('+res+')').data;
    if( response.resultNum > 0 ){
      detail_info.collectInfo = true;
      detail_info.addCollectEl.innerHTML = '取消收藏';
      addClass( getElement('.btn-1'),'hasCollect');
    } else {
      detail_info.collectInfo = false;
      detail_info.addCollectEl.innerHTML = '加入收藏'
    }
  });
  bi.pageJump( data.assetId,'0301' );
  detail_info.tagName = data.fCategory.split(',')[1];
  detail_info.init();
  detail_epoisd_list.init();
},function(e){

})




//详情页产品信息
detail_info.itemNo = 0;

detail_info.tagName = '';

detail_info.collectInfo = false;

detail_info.init = function(){
  this.infoPoster = getElement('.detail_poster');
  this.infoTitle = getElement('.detail_title');
  this.detailInfo = getElement('.detail_desc');
  this.addCollectEl = getElement('.a');
  this.template();
  if( areaObj == this ){
    if( this.itemNo == 0 ){
      addClass(getElement('.btn-' + this.itemNo),'buy_hover');
    } else {
      addClass( getElement('.btn-' + this.itemNo),'detail_hover')
    }
  }
}

detail_info.template = function(){
  this.infoPoster.innerHTML = '<img src ="'+data.assetImg +'">';
  this.infoTitle.innerHTML = data.assetName;
  this.detailInfo.innerHTML = data.description;
}

detail_info.up = function(){

};

detail_info.down = function(){

};

detail_info.left = function(){
  this.direction(0);
};

detail_info.right = function(){
  this.direction(1);
  
};

detail_info.enter = function(){
  if( this.itemNo ){
    var trackType = '';
    var obj = {};
    if( this.collectInfo ){
      var obj = userTrackObj.collect( true,'1',data.assetId);
      trackType = 'del';
    } else {
      var cateArr = data.fCategory.split(',')
      var cate = cateArr[1] || cateArr[0];
      var obj = userTrackObj.collect( false,'1',data.assetId,data.score, data.assetName,data.assetImg,url,'detail',cate);
      trackType = 'collect';
    }
    userTrack(obj,trackType,function(res){
      console.log(res);
      if( trackType == 'collect' ){
        addClass( getElement('.btn-1'),'hasCollect');
        detail_info.collectInfo = true;
        detail_info.addCollectEl.innerHTML = '取消收藏';
        
      } else {
        removeClass( getElement('.btn-1'),'hasCollect');
        detail_info.collectInfo = false;
        detail_info.addCollectEl.innerHTML = '加入收藏';
      }

      bi.collectClick( 1, data.assetId, trackType === 'collect' ? 1 : 2 );
    },function(err){
      console.log(err,'err');
    });
  } else {
    console.log('立即购买')
    bi.orderBtnClick( data.assetId, data.fCategory.indexOf('学前') != -1 ? '0302' : '0301' ,'1'  );
  }
};

detail_info.direction = function( dir ){
  if( this.itemNo == 0 ){
    removeClass(getElement('.btn-' + this.itemNo),'buy_hover');
  } else {
    removeClass( getElement('.btn-' + this.itemNo),'detail_hover');
  }

  if( dir ){
    if( this.itemNo == 1 ){
      areaObj = detail_epoisd_list;
      addClass( getElement('.detail_list_item-' + detail_epoisd_list.pageIndex + '-'+detail_epoisd_list.itemNo),'hover' );
      addClass( getElement('.pageIndex-' + detail_epoisd_list.pageIndex),'detail_pageHover' );
      return;
    } else {
      this.itemNo ++;
    }
  } else {
    if( this.itemNo == 0 ){
      this.itemNo = 0;
    } else {
      this.itemNo --;
    }
  }
  if( this.itemNo == 0 ){
    addClass(getElement('.btn-' + this.itemNo),'buy_hover');
  } else {
    addClass( getElement('.btn-' + this.itemNo),'detail_hover')
  }
}


//详情页集数列表
detail_epoisd_list.epList =[];

detail_epoisd_list.itemNo = 0;

detail_epoisd_list.pageIndex = 0;

detail_epoisd_list.diff = '';

detail_epoisd_list.init = function(){
  this.el = getElement('.detail_epoised');
  this.pageIndexEl = getElement('.detail_page_index');
  this.pageTotalEl = getElement('.detail_page_size');
  this.barer = getElement('.detail_scroll_Barer');
  this.scrollBarBlock = getElement('.detail_scroll_block');
  this.pageTotal = this.epList.length -1;
  detail_epoisd_list.template();
  if( areaObj === this ){
    addClass( getElement('.pageIndex-' + this.pageIndex),'detail_pageHover' );
    addClass( getElement('.detail_list_item-' + this.pageIndex +'-'+ this.itemNo),'hover' );
  }
  this.diff =  this.el.offsetTop - ( this.pageIndex * rowTsDiff ); 
  this.scrollBarBlock.style.top = this.pageIndex  / (  this.pageTotal + 1 ) * 100 + '%';
  this.pageIndexEl.innerHTML = this.pageIndex + 1 + ' /';
  this.domTransition('top', this.diff + 'px' );
  this.scrollBarInit();
}

detail_epoisd_list.template = function(){
  var _this = this;
  this.epList && this.epList.forEach( function( item,index ){
    var list = '';
    var element = document.createElement('div');
    element.setAttribute('class','detail_list pageIndex-'+ index );
    item.forEach(function( el, i ){
      var dom = '<div class="detail_list_item detail_list_item-'+ index +'-'+ i +'">' +
      '<div class="detail_item_num">'+
      el.episode
      +'</div>'+
      '<div class="detail_item_title">'+
      el.itemName+
        '</div>'+
    '</div>'
    list += dom;
    element.innerHTML = list;
    });
    _this.el.appendChild( element );
  });
};

detail_epoisd_list.down = function(){
  this.direction( 1,2 );
};

detail_epoisd_list.up = function(){
  this.direction( 0, 2 );
};

detail_epoisd_list.left = function(){
  if( this.itemNo % 2 == 0 ){
    areaObj = detail_info;
    detail_info.itemNo = 1;
    addClass( getElement('.btn-' + detail_info.itemNo),'detail_hover');
    removeClass( getElement('.detail_list_item-' + this.pageIndex +'-'+ this.itemNo),'hover' );
    removeClass( getElement('.pageIndex-' + this.pageIndex),'detail_pageHover' );
  } else {
    this.direction( 0, 1 );
  }
};

detail_epoisd_list.right = function(){
  this.direction( 1,1 );
};

detail_epoisd_list.setCookie = function( curIndex ){
  var href = window.location.href;
  var videoBackUrl = href.indexOf('?') != -1 ? href.split('?')[0] : href
  Cookies.set('detailUrl',url,{
    expires:7,
    path:'/'
  });
  Cookies.set('videoBackUrl',videoBackUrl + '?' +curIndex,{
    path:'/'
  });
  
  Cookies.set('parent_page_type','0301',{
    path:'/'
  })
  Cookies.set('parent_page_id',data.assetId,{
    path:'/'
  })
}



detail_epoisd_list.enter = function(){
  var curIndex = this.pageIndex * 10 + this.itemNo;
  this.setCookie( curIndex );
  var record = playRecorder.getRecord();
  var hisTime = 0;
  if( record.epoised == curIndex ){
    if( record.curTime ){
      hisTime = record.curTime;
    }
  }
  
  playRecorder.addRecord( curIndex, hisTime );
  window.location.href = "../play/videoPlay.html";
};

detail_epoisd_list.domTransition = function( dir,dis ){
  this.el.style[dir] = dis;
}

detail_epoisd_list.direction = function( flag,num ){
  if( this.el.offsetTop != this.diff ) return;
  removeClass( getElement('.detail_list_item-' + this.pageIndex +'-'+ this.itemNo),'hover' );
  if( flag ){
      this.itemNo += num;
      if( this.itemNo > this.epList[this.pageIndex].length -1){
        if( this.pageIndex < this.pageTotal  ){
          removeClass( getElement('.pageIndex-' + this.pageIndex),'detail_pageHover' );
          this.pageIndex ++;
          this.pageIndexEl.innerHTML = this.pageIndex + 1 + ' /';
          this.itemNo = 0;
          addClass( getElement('.pageIndex-' + this.pageIndex),'detail_pageHover' );
          this.diff = this.el.offsetTop - rowTsDiff;
          this.domTransition( 'top', this.diff + 'px' );
          this.scrollBarBlock.style.top = this.pageIndex  / (  this.pageTotal + 1 ) * 100 + '%';
        } else {
          this.itemNo = this.epList[this.pageIndex].length - 1;
        }
      }
  } else {
    this.itemNo -= num;
    if( this.itemNo < 0  ){
      if( this.pageIndex > 0 ){
        removeClass( getElement('.pageIndex-' + this.pageIndex),'detail_pageHover' );
        this.pageIndex --;
        this.pageIndexEl.innerHTML = this.pageIndex + 1 + ' /';
        this.itemNo =  this.epList[this.pageIndex].length -1;
        addClass( getElement('.pageIndex-' + this.pageIndex),'detail_pageHover' );
        this.diff = this.el.offsetTop + rowTsDiff;
        this.domTransition( 'top', this.diff + 'px' );
        this.scrollBarBlock.style.top = this.pageIndex  / (  this.pageTotal + 1 ) * 100 + '%';
      } else {
        this.itemNo = 0;
      }
    }
  }
  addClass( getElement('.detail_list_item-' + this.pageIndex +'-'+ this.itemNo),'hover' );
}

//详情页滚动条
detail_epoisd_list.scrollBarInit = function(){
  this.pageIndexEl.innerHTML = this.pageIndex + 1 + ' /';
  this.pageTotalEl.innerHTML = this.pageTotal + 1;
  var p = this.pageIndex + 1 / (  this.pageTotal + 1 ) * 100 + '%';
  this.scrollBarBlock.style.height = p;
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
      var backUrl = Cookies.get('backUrl') || '../../index.html';
      Cookies.remove('backUrl')
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