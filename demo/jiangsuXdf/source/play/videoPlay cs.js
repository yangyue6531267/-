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

var videoPlayer = {};  //容器

var menu_list = {}; //选集菜单

var progress_Bar = {}; //进度条

var controlTimer = null; 

var areaObj;

function logVod(){
  var zb = Date.now();
  var time = zb - videoPlayer.qb_datetime - videoPlayer.pauseTime;
  var item = value.detailData.itemList[menu_list.playEp];
  var itemId = item.itemId;
  var episode = item.episode;
  var o = {
    asset_id : videoPlayer.asset_id,
    item_id : itemId,
    qb_datetime : videoPlayer.qb_datetime,
    zb_datetime : Date.now(),
    ep : episode,
    time : time,
    error : '',
    fee: 1,
    parent_page_type : Cookies.get('parent_page_type'),
    parent_page_id : Cookies.get('parent_page_id'),
    pos_id : '',
    isFullScreen : 0,
    recmd_id : '',
  }
  logUp( '8', o );
}

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

var url = Cookies.get('detailUrl');

var value = {
  detailData:null,
  isBack:false,
  detailUrl:'',
  getValue: function(){
    this.detailUrl = Cookies.get('detailUrl')
  }
}

getData( url,function(response){
  value.detailData = eval("(" + response + ")").data;
  console.log( value.detailData );
  videoPlayer.init();
  menu_list.init( value.detailData.itemList,videoPlayer.record.epoised );
  progress_Bar.init();
  videoPlayer.setPlayer();
  //查询是否收藏
  var userObj = userTrackObj.checkCollect( '1',value.detailData.assetId );
  userTrackList( userObj,function(res){
    var response =  eval('('+res+')').data;
    if( response.resultNum > 0 ){
      videoPlayer.collectInfo = true;
      videoPlayer.addCollectEl.innerHTML = '取消收藏';
      addClass( getElement('.video_addCollect'),'hasCollect');
    } else {
      videoPlayer.collectInfo = false;
      videoPlayer.addCollectEl.innerHTML = '加入收藏'
    }
  });
//增加观看记录
  var obj = userTrackObj.addHistory( value.detailData.assetId,value.detailData.score,value.detailData.assetName,value.detailData.assetImg, url,'detail' );
  userTrack(obj,'collect',function(res){
    console.log(res);
  },function(err){
    console.log(err,'err');
  });
},function( err ){
  console.log(err);
});

var grepEvent = function( e ){
  var keyCode = e.keyCode || e.which;
  return onKeyPress(KEYMAP[keyCode]);
};




var playerOptions = {
  onStart:null,
  onPlay:null,
  onPause:null,
  onResume:null,
  onStop:null,
  onCompleted:null,
  onError:null,
  onScreenChange: null,
  onBufferingStart: null,
  onBufferfinish: null,
  onProgress: null
};

//容器

videoPlayer.controlType = 0;

videoPlayer.asset_id = '';

videoPlayer.videoName = '';

videoPlayer.player = player;

videoPlayer.state = 0;

videoPlayer.collectInfo = false;

videoPlayer.authResult = false;

videoPlayer.tryWatchTime = 20000;

videoPlayer.qb_datetime = '';

videoPlayer.record = '';

videoPlayer.pauseTime = 0;

videoPlayer.init = function(){
  
  this.record =  playRecorder.getRecord();
  this.asset_id = value.detailData.assetId;
  this.videoTitleEl = getElement('.videoPlay_name_text');
  this.stopBtn = getElement('.video_stop');
  this.videoNameEl = getElement('.videoPlay_name');
  this.addCollectEl = getElement('.a');
};

videoPlayer.up = function(){
  if( menu_list.data && menu_list.data.length > 1){
    this.showControl(1);
  } else {
    console.log('单集或者集数还未获取到')
  }
}

videoPlayer.down = function(){
  if( menu_list.data && menu_list.data.length > 1){
    this.showControl(1);
  } else {
    console.log('单集或者集数还未获取到')
  }
}

videoPlayer.left = function(){
  if( progress_Bar.hasTime ){
    this.showControl(2);
  } else {
    console.log('时间还未获取到')
  }
}

videoPlayer.right = function(){
  if( progress_Bar.hasTime ){
    this.showControl(2);
  }else {
    console.log('时间还未获取到')
  }
}

videoPlayer.enter = function(){
  if( this.state == 0 ){
    this.pause();
  } else if ( this.state == 2 ){
    this.resume();
  }
}

videoPlayer.showControl = function( controlType ){
  if( this.controlType == controlType ) return;
  if( controlType == 1 ){
    if( menu_list.data && menu_list.data.length > 1 ){
      if( !menu_list.menuShow ){
        menu_list.show();
        areaObj = menu_list;
      } 
    }
  } else if ( controlType == 2 ) {
    if( !progress_Bar.progressShow ){
      progress_Bar.show();
      areaObj = progress_Bar; 
    }
  }
  addClass( this.videoNameEl,'nameshow' )
  this.controlType = controlType;
}

videoPlayer.changeTitle = function ( title ) {
  this.videoName = title;
  this.videoTitleEl.innerHTML = '正在播放:'+ this.videoName;
}

videoPlayer.startPlay = function( index ){
  if( index ){
    this.playVideo( index , 0 );
  } else {
    var ep = this.record.epoised;
    var hisTime = this.record.curTime;
    console.log(hisTime,'his');
    this.playVideo( ep,hisTime );
  }
}

videoPlayer.playVideo = function( index, hisTime ){
  if(index < 0) return;
  // 'http://devimages.apple.com.edgekey.net/streaming/examples/bipbop_4x3/gear2/prog_index.m3u8'
  var playUrl = value.detailData.itemList[index].vodList[0].playUrl;
  hisTime = hisTime || 0;
  this.player.play( { hisTime:hisTime, playUrl: playUrl } );
  playerOptions.onStart();
  playerOptions.onPlay();
}

videoPlayer.setPlayer = function(){
  this.player.setDisplayerLocation({ x:0,y:0,w:-1,h:-1});
  if( !Cookies.get('hasInit') ){
    Cookies.set('hasInit','yes');
    this.player.initPlayer();
  } 
  this.player.toggleShow('showPlayer');
  this.player.setCallback( playerOptions );
  this.startPlay();
}

videoPlayer.stopPlay = function(){
  this.player.stop();
  this.controlType = 0;
  areaObj = this;
  if( progress_Bar.progressShow ){
    progress_Bar.hide(); 
  }
 

  if( progressTimer ) {
  clearInterval( progressTimer )
  progressTimer = null;
  }
}

videoPlayer.resume = function(){
  this.state = 0;
  this.player.togglePlay('resume');
  removeClass(this.stopBtn,'btnShow');
  var pauseTime = Date.now() - Cookies.get('puase');
  this.pauseTime += pauseTime;
  if( !progressTimer ) {
    progressTimer = setInterval(function(){
      if( !videoPlayer.authResult ){
        if( progress_Bar.currentTime >= videoPlayer.tryWatchTime ){
           console.log('页面跳转')
        }
      }
      if( progress_Bar.currentTime - 0 >= progress_Bar.totalTime - 0){
        return playerOptions.onCompleted();
      }
      progress_Bar.currentTime = progress_Bar.currentTime - 0 + 1000;
      progress_Bar.progressTime(progress_Bar.currentTime);
    },1000)
  }
}

videoPlayer.pause = function (){
  this.state = 2;
  this.player.togglePlay('pause');
  addClass(this.stopBtn,'btnShow');
  Cookies.set('puase',Date.now(),{
    path: '/'
  })
  clearInterval( progressTimer );
  progressTimer = null;
}

videoPlayer.playNext = function(){
  logVod();
  removeClass( getElement('.menu_item-'+ menu_list.playEp),'videopl' );
  menu_list.playEp ++;
  var dir = -1;
  var reset = false;
  if( menu_list.playEp >= menu_list.data.length ){
    menu_list.playEp = 0;
    dir = 1;
    reset = true;
    console.log('===============')
  }
  menu_list.itemNo = menu_list.playEp;
  menu_list.transitionToIndex( dir, menu_list.playEp, 68, reset );
  addClass( getElement('.menu_item-'+ menu_list.playEp),'videopl' );
  progress_Bar.hasTime = false;
  this.stopPlay();
  var title = menu_list.data[menu_list.playEp].itemName;
  videoPlayer.changeTitle( title );
  this.startPlay( menu_list.playEp );
}

//选集菜单menu_list
menu_list.data = null

menu_list.itemNo = 0;

menu_list.menuShow = false;

menu_list.diff = 0;

menu_list.startY = 0;

menu_list.playEp = 0;

menu_list.init = function(  menuList, index ){
  this.data = menuList;
  this.el = getElement( '.menu_list' );
  this.scroller = getElement('.menu_list');
  index = index || 0;
  this.itemNo = index;
  this.playEp = index;
  this.transitionToIndex( -1, index, 68 );
  var title = this.data[this.itemNo].itemName;
  videoPlayer.changeTitle( title );
  this.template( this.data );
  addClass( getElement('.menu_item-'+ this.playEp),'videopl' );
};

menu_list.template = function( data ){
  var list = '';
  data && data.forEach( function( item,index ){
    var dom = '<div class="menu_item menu_item-'+ index +'">' + 
   '<i class="menu_item_icon"></i>'+ 
   '<span class="menu_item_title">'+ item.itemName +'</span>'+
 '</div>'
  list += dom
  })
  this.el.innerHTML = list;
}

menu_list.domTransition = function( dis ){
  console.log(this.scroller,'dis')
  this.scroller.style.top = dis + 'px';
}

menu_list.transitionToIndex = function( dir,index,dis, reset){
  // var top = 0;
  // if( this.scroller.offsetTop ){
  //   top = this.scroller.offsetTop
  // } else {
  //   top = 178;
  // }
  
  this.diff = this.scroller.offsetTop + ( dir * index * dis );
  if( reset ){
    this.diff = 0;
  }
  this.scroller.style.top = this.diff  + 'px';
}

menu_list.direction = function( flag ){
  console.log(this.diff,'diff')
  console.log(this.scroller.offsetTop,'offset')
  if( this.diff !== this.scroller.offsetTop ) return;
  removeClass( getElement('.menu_item-'+ this.itemNo),'videohover' );
  var before = this.itemNo;
  if( flag == 1){
    if( this.itemNo == 0 ) {
      this.itemNo = this.data.length - 1;
    } else {
      this.itemNo --;
    }
  } else {
    if( this.itemNo == this.data.length - 1 ) {
      this.itemNo = 0;
    } else {
      this.itemNo ++;  
    }
  }
  var after = this.itemNo;
  var dis = before - after;
  console.log( dis,'dis' )
  this.diff = this.scroller.offsetTop + ( 68 * dis);
  this.domTransition(this.diff);
  addClass( getElement('.menu_item-'+ this.itemNo),'videohover' );
}


menu_list.show = function(){
  if( !this.menuShow ){
    this.menuShow = true;
    addClass( getElement('.video_leftContent'),'show' );
    // if( !this.diff ){
    //   this.diff = this.scroller.offsetTop;
    // }
    // if( !this.startY ){
    //   this.startY = this.scroller.offsetTop;
    // }
    addClass(getElement('.video_rightContent'),'thin');
    addClass(getElement('.video_Progress_BarBox'),'shorter');
  } 
}

menu_list.hide = function(){
  if( this.menuShow ){
    this.menuShow = false;
    removeClass( getElement('.video_leftContent'),'show' );
    removeClass(getElement('.video_rightContent'),'thin');
    removeClass(getElement('.video_Progress_BarBox'),'shorter');
  } else {
    console.log('选集条还未展示')
  }
}

menu_list.up = function(){
  this.direction( 1 );
  
}

menu_list.down = function(){
  this.direction( -1 );
}

menu_list.left = function(){

}

menu_list.right = function(){
  if( !progress_Bar.progressShow ){
    if( progress_Bar.hasTime ){
      progress_Bar.show();
    }
  } else {
    areaObj = progress_Bar;
    progress_Bar.pos = 1;
    addClass( progress_Bar.subContentChildres[progress_Bar.itemNo],'progresshover' )
  }
}

menu_list.enter = function(){
  if( this.playEp == this.itemNo ) return console.log('正在播放此集');
  logVod();
  removeClass( getElement('.menu_item-'+ this.playEp),'videopl' );
  this.playEp = this.itemNo;
  addClass( getElement('.menu_item-'+ this.playEp),'videopl' );
  var title = this.data[this.playEp].itemName;
  videoPlayer.changeTitle( title );
  videoPlayer.stopPlay();
  videoPlayer.startPlay( this.playEp )
}


//进度条

progress_Bar.progressShow = false;

progress_Bar.pos = 0;

progress_Bar.itemNo = 0;

progress_Bar.hasTime = false;

progress_Bar.inerTotalTime = '00:00';

progress_Bar.inerCurrentTime = '00:00';

progress_Bar.totalTime = 0;

progress_Bar.currentTime = 0;

progress_Bar.percent = 0;

progress_Bar.init = function(  ){
  this.el = getElement('.progress_Control');
  this.subContentChildres = getElement('.video_Progress_SubContentWrapper').children;
  this.totalTimeEl = getElement('.video_TotalTime');
  this.currentTimeEl = getElement('.video_block_CurrentTime');
  this.progressEr = getElement('.video_Progress_Bar');
  this.tryWatchEl  = getElement('.video_TryWatch_Tip');
  this.template();
};

progress_Bar.template = function( data ){
    if( videoPlayer.authResult ){
      this.tryWatchEl.style.display = 'none';
    } else {
      this.tryWatchEl.style.display = 'block';
    }
}

progress_Bar.show = function(){
    addClass(getElement('.video_rightContent'),'show');
    progress_Bar.progressShow = true; 
}

progress_Bar.hide = function(){
  if( progress_Bar.progressShow ){
    removeClass(getElement('.video_rightContent'),'show');
    progress_Bar.progressShow = false; 
    removeClass( this.subContentChildres[this.itemNo],'progresshover' );
    this.itemNo = 0 ;
  } else {
    console.log('进度条还未展示')
  }
}

progress_Bar.direction = function( flag ){
  if( this.progressShow ){
    removeClass( this.subContentChildres[this.itemNo],'progresshover' );
  if( flag ){
    if( !this.itemNo == 0 ) {
      this.itemNo --;
    } 
  } else {
    if( this.itemNo !== this.subContentChildres.length - 1 ) {
      this.itemNo ++;  
    } 
  }
  addClass( this.subContentChildres[this.itemNo],'progresshover' );
  }
}

progress_Bar.formatInerHTML = function(){
  this.currentTimeEl.innerHTML = this.inerCurrentTime;
}

progress_Bar.progressWidth = function(){
  if( this.percent >= 100 ){
    this.percent = 100;
  }
  this.progressEr.style.width = this.percent + '%';
}

progress_Bar.progressTime = function( cur ){
  progress_Bar.currentTime = cur;
  progress_Bar.inerCurrentTime = progressTimeFormat( progress_Bar.currentTime );
  progress_Bar.percent = progress_Bar.currentTime / progress_Bar.totalTime * 100;
  progress_Bar.formatInerHTML();
  progress_Bar.progressWidth();
}

progress_Bar.goForward = function(){
  var seekTime;
  if( this.currentTime - 0 + 15000 > this.totalTime ){
    return;
  }
  seekTime = this.currentTime - 0 + 15000
  this.progressTime( seekTime );
  videoPlayer.player.seekTime({'seekTime':this.currentTime});
}

progress_Bar.backForward = function(){
  var seekTime;
  if( this.currentTime -  15000 < 0  ){
    seekTime = 0;
  } else {
    seekTime = this.currentTime - 15000;
  }

  this.progressTime( seekTime );
  videoPlayer.player.seekTime({'seekTime':this.currentTime});
}

progress_Bar.up = function(){
  if( this.pos == 0 ){
    this.pos = 1;
    addClass( this.subContentChildres[this.itemNo],'progresshover' )
  } else {
    if ( menu_list.data && menu_list.data.length > 1 ) {
      if( !menu_list.menuShow ){
        menu_list.show();
      }
      areaObj = menu_list;
      removeClass( this.subContentChildres[this.itemNo],'progresshover' );
    }
  }
}

progress_Bar.down = function(){
  if( this.pos == 1 ){
    this.pos = 0;
    removeClass( this.subContentChildres[this.itemNo],'progresshover' );
  }
}

progress_Bar.left = function(){
  if( this.pos == 1 ){
    if( this.itemNo == 0 ){
      if( menu_list.menuShow ){
        areaObj = menu_list;
        removeClass( this.subContentChildres[this.itemNo],'progresshover' );
      } else {  
        console.log('选集条还未展示')
      }
    } else {
      this.direction(1)
    }
  } else {
    if( videoPlayer.state == 2 ){
        videoPlayer.resume();
    } else {
      this.backForward();
    }
  }
}

progress_Bar.right = function(){
  if( this.pos == 1 ){
    this.direction(0)
  } else {
    if( videoPlayer.state == 2 ){
      videoPlayer.resume();
    } else {
      this.goForward();
    }
  }
}

progress_Bar.enter = function(){
  if( this.pos == 0 ){
    if( videoPlayer.state == 2 ){
      videoPlayer.resume();
    } else if ( videoPlayer.state == 0 ){
      videoPlayer.pause();
    }
  } else if ( this.pos == 1 ){
    if( this.itemNo == 1 ){
      console.log('立即购买');
      var pkg_type = '1';
      var pkg_id = '1';
      var operator_id = '1';
      var order_msg ='1';
      Cookies.set('hasInit','');
      bi.orderBtnClick( pkg_type,pkg_id,operator_id,order_msg, 2 );
      logVod();
    } else if ( this.itemNo == 2 ){
      var data = value.detailData;
      var trackType = '';
    if( videoPlayer.collectInfo ){
      var obj = userTrackObj.collect( true,'1', data.assetId);
      trackType = 'del';
    } else {
      var cateArr = value.detailData.fCategory.split(',')
      var cate = cateArr[1] || cateArr[0];
      var obj = userTrackObj.collect( false,'1', data.assetId,data.score,data.assetName,data.assetImg,url,'detail',cate);
      trackType = 'collect';
    }
    userTrack(obj,trackType,function(res){
      console.log(res);
      if( trackType == 'collect' ){
        addClass( getElement('.video_addCollect') ,'hasCollect');
        videoPlayer.collectInfo = true;
        videoPlayer.addCollectEl.innerHTML = '取消收藏';
      } else {
        removeClass( getElement('.video_addCollect'),'hasCollect');
        videoPlayer.collectInfo = false;
        videoPlayer.addCollectEl.innerHTML = '加入收藏';
      }
    },function(err){
      console.log(err,'err');
    });
    }
  }
}



//播放器回调对象
// var playerOptions = {
//   onStart:null,
//   onPlay:null,
//   onPause:null,
//   onResume:null,
//   onStop:null,
//   onCompleted:null,
//   onError:null,
//   onScreenChange: null,
//   onBufferingStart: null,
//   onBufferfinish: null,
//   onProgress: null
// };
//开始播放
var progressTimer = null;

playerOptions.onStart = function(){
  videoPlayer.qb_datetime = Date.now();
  console.log('onStart')
}
// 开始播放
playerOptions.onPlay = function( res ){
  getData('./progress.json',function( res ){
    var data = eval( '('+ res +')' ).data;
    progress_Bar.totalTime = data.total;
    progress_Bar.inerTotalTime = progressTimeFormat( progress_Bar.totalTime );
    progress_Bar.totalTimeEl.innerHTML = progress_Bar.inerTotalTime;
    progress_Bar.progressTime( videoPlayer.record.curTime );
    progress_Bar.hasTime = true;  
    playerOptions.onProgress();
    if( menu_list.menuShow ){
      areaObj = menu_list;
      videoPlayer.controlType = 1;
      removeClass( progress_Bar.subContentChildres[progress_Bar.itemNo],'progresshover' );
    } else {
      areaObj = videoPlayer;
    }
    
  },function(err){
    console.log(err);
  });
}

//进度
playerOptions.onProgress = function(){
  progressTimer = setInterval(function(){
    if( videoPlayer.authResult ){
      if( progress_Bar.currentTime >= videoPlayer.tryWatchTime ){
         console.log('页面跳转');
         logVod();
         Cookies.set('orderbackUrl',window.location.href,{
           path:'/'
          });
          Cookies.set('hasInit','');
          playRecorder.addRecord( menu_list.playEp, 0 );
          // window.location.href = '../order/order.html'
      }
    }
    if( progress_Bar.currentTime - 0 >= progress_Bar.totalTime - 0){
      return playerOptions.onCompleted();
    }
    progress_Bar.currentTime = progress_Bar.currentTime - 0 + 1000;
    progress_Bar.progressTime(progress_Bar.currentTime);
  },1000)
}

//暂停
playerOptions.onPause = function(){
  console.log('pause')
}

//重新播放
playerOptions.onResume = function(){
  console.log('重新播放');
}

playerOptions.onStop = function(){
  console.log('stop');
}

playerOptions.onError = function(){
  console.log('播放器错误')
}

playerOptions.onScreenChange = function(){
  console.log('播放器大小改变')
}

playerOptions.onBufferingStart = function(){
  console.log('缓冲开始')
}

playerOptions.onBufferfinish = function(){
  console.log('缓冲结束')
}

playerOptions.onCompleted = function(){
  clearInterval( progressTimer );
  progressTimer = null;
  videoPlayer.playNext();
  console.log('播放完毕');
}





function progressTimeFormat( t ){
  if( t >= 3600000 ){
    //当时间超过1小时
    var h = parseInt(t / 1000 / 3600);
    var m = parseInt(t / 1000 / 60 % 60);
    var s = parseInt(t / 1000 % 60);
    h = h >= 10 ? h : '0' + h;
    m = m >= 10 ? m : '0' + m;
    s = s >= 10 ? s : '0' + s;
    return  h + ':' + m + ':' + s
  } else {
    var m = parseInt(t / 1000 / 60 % 60);
    var s = parseInt(t / 1000 % 60);
    m = m >= 10 ? m : '0' + m;
    s = s >= 10 ? s : '0' + s;
    return    m + ':' + s
  }
}

function controlDuration( callback ){
  if( controlTimer ){
    clearTimeout( controlTimer );
    controlTimer = null;
  }
  controlTimer = setTimeout(function(){
    hideControl();
    if( callback ){
      callback();
    }
  },100000000)
}

function hideControl(){
  menu_list.hide();
  progress_Bar.hide();
  areaObj = videoPlayer;
  progress_Bar.pos = 0;
  videoPlayer.controlType = 0;
  removeClass( videoPlayer.videoNameEl,'nameshow' )
  removeClass( progress_Bar.subContentChildres[progress_Bar.itemNo],'progresshover' );
}

onKeyPress = function (keyCode) {
  if( keyCode != 'back' ){
    controlDuration()
  }
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
      if( areaObj ){
        if( videoPlayer.controlType == 0 ){
        videoPlayer.stopPlay();
        playRecorder.addRecord( menu_list.playEp, progress_Bar.currentTime );
        logVod();
        Cookies.set('hasInit','');
        var videoBackUrl = Cookies.get('videoBackUrl') || '../../index.html'
        window.location.href = videoBackUrl;
        return;
      }
        hideControl();
        if(controlTimer){
          clearTimeout( controlTimer );
          controlTimer = null;
        }
      }
      
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