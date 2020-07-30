 var contentNum = unity.getVars("contentNum")*1+1; //剧集生效，当前播放集数
 var contentCode = ''; //单集生效，内容视频code
 var conCodeList = []; //剧集生效，存储子集contentCode
 var contentType = null;
 var currentId = 'nav1_1';
 //var backUrl = params.returnUrl;
 var index = 0; // 焦点序号
 var stbid = ''; //盒子型号
 var mp = null; //播放器
 var preVolume = 5; //每一次增减的音量
 var nowVolume = 0; //获取当前媒体的音量
 var totalVolume = 100; //总音量
 var hiddenTimer = null; //隐藏音量组件，定时器
 var hiddenPress = null; //隐藏进度条
 var overTime = null; //播放结束定时器
 var isPause = false; //播放状态
 var trickmode = 'play';
 var playtime = ""; //当前播放时间
 var starttime = 0; //开始播放时间
 var endtime = ""; //播放总时长
 var speedindex = 1; //当前快进倍数
 var isExit = false; //退出界面
 var isNextPlay = false;
 window.isOrder = $.cookie("isOrder");
 var detailURL = "../detail/" + unity.getVars("fromPage") + "?from=player";
 var totalName = ''; //资产名称
 var fromOrder  = 0 ;
 var g_playlong = unity.getVars("g_playlong") || 0; // 历史播放时间
 var biPayData = {
  detailData:{},
  qb_datetime: '',
  zb_datetime: '',
  qb_assettime: 0,//starttime 对应，暂时未加
  zb_assettime: 0,
  error: "1"
 }
 

    // unity.alertMsg(window.isOrder)

 function fn$(id) {
   return document.getElementById(id);
 }

 window.onload = function () {
   try {
     stbid = Authentication.CTCGetConfig("STBType"); //获取盒子型号
   } catch (error) {
     document.onkeydown = keypress; //键盘事件监听绑定
   }
   var stbid2 = stbid.substring(0, 6);
   if (stbid2 == 'IP906H') {
     document.onkeydown = keypress; //事件监听绑定
   } else {
     document.onkeypress = keypress; //事件监听绑定
   }
   if (window.location.search.indexOf("result") != -1) {
     fromOrder=1
     if (unity.getVars("result") == 0) {
       window.isOrder = 1;
       $.cookie("isOrder",1,{path:"/"})
     } else {
       window.isOrder = 0;
       $.cookie("isOrder",0,{path:"/"})
     }
   }
   videoInfo.getDetail();
 }

 //获取播放信息
 var videoInfo = {
   //内容详情
   getDetail: function () {
     var url = $.cookie("detailUrl")
     unity.jsonp(url, function (res) {
       var item = res.data;
       biPayData.detailData = res.data;
       contentType = item.assetType;

       if(window.isOrder==0&&fromOrder==1) {   // 从订购页回来未订购
         if (contentType == "Movie") {
          window.location = "../detail/movieDetail.html?fromPage=player"
         } else {
           window.location = "../detail/seriesDetail.html?fromPage=player&contentNum=" + contentNum
         }
       } else {
          var name = item.assetName;
          totalName = name;
          if (contentType == "Movie") { //说明是电影，播放电影
            fn$("viode_name").innerHTML = name;
            fn$("osdTitle").innerHTML = name;
            contentCode = item.itemList[0].vodList[0].playUrl;
          } else {
            for (var i = 0, len = item.itemList.length; i < len; i++) {
              conCodeList.push(item.itemList[i]);
            }
            console.log(conCodeList);
            if (contentType == "Column") { //说明是综艺，播放综艺
              fn$("viode_name").innerHTML = conCodeList[contentNum - 1].itemName;
              fn$("osdTitle").innerHTML = conCodeList[contentNum - 1].itemName;
              contentCode = conCodeList[contentNum - 1].vodList[0].playUrl;
            } else { //说明是电视剧，播放电视剧
              fn$("viode_name").innerHTML = conCodeList[contentNum - 1].itemName;
              fn$("osdTitle").innerHTML = conCodeList[contentNum - 1].itemName;
              contentCode = conCodeList[contentNum - 1].vodList[0].playUrl;
            }
          }
          biPayData.qb_datetime = Math.round(new Date().getTime()).toString();
          video.play();
       }
       
     })
   }
 };
 var video = {
   play: function () {
     try {
       var epgdomain = Authentication.CTCGetConfig("EPGDomain");
     } catch (e) {

     }
     if (epgdomain.indexOf("iptvepg") == -1) { //华为
       var srcHost = epgdomain.split("/EPG")[0] + "/EPG/MediaService/SmallScreen.jsp?ContentID=" + contentCode + "&Left=0&Top=0&Width=1280&Height=720&CycleFlag=0&GetCntFlag=0&ifameFlag=0&ReturnURL=";
       fn$("smallvodFull").src = srcHost;
     } else { //中兴
       var last = epgdomain.lastIndexOf("/");
       var host = epgdomain.substr(0, last);
       var srcHost = host + "/MediaService/SmallScreen?ContentID=" + contentCode + "&Left=0&Top=0&Width=1280&Height=720&CycleFlag=0";
       fn$("smallvodFull").src = srcHost;
     }
     setTimeout(function () {
       video.getIframe();
     }, 1000)
     setTimeout(function () {
       fn$("blackBg").style.display = 'none';
     }, 200)
   },
   biPay:function(){
    try {
      var jsonOb = {}
      jsonOb.asset_id = biPayData.detailData.assetId
      jsonOb.item_id = biPayData.detailData.itemList[contentNum-1].itemId.toString()
      jsonOb.qb_datetime = biPayData.qb_datetime
      jsonOb.zb_datetime = biPayData.zb_datetime
      var playTime = mp.getCurrentPlayTime() * 1000
      jsonOb.time = playTime.toString()
      jsonOb.ep = biPayData.detailData.itemList.length.toString()
      jsonOb.fee = biPayData.detailData.itemList[contentNum-1].fee
      jsonOb.isFullScreen = '0'
      jsonOb.pos_id = $.cookie('position')
      jsonOb.recmd_id = $.cookie('recommend')
      jsonOb.parent_page_type = '0301'
      jsonOb.parent_page_id = $.cookie("play_id")
      bi.vod(jsonOb) 
      $.cookie("recommend", '', {path: "/"})
      $.cookie('position', '', {path: "/"})
    } catch (error) {
      console.log('埋点异常', error);
    }
  },
   getIframe: function () {
     var iframe = fn$("smallvodFull");
     var iframeContent = (iframe.contentWindow || iframe.contentDocument);
     try {
       var epgdomain = Authentication.CTCGetConfig("EPGDomain");
     } catch (error) {

     }
     if (epgdomain.indexOf("iptvepg") == -1) {
       try {
         mp = iframeContent.mp; // 华为获取Mediaplayer 对象
       } catch (e) {}
     } else {
       try {
         mp = iframeContent.mymediaplayer; // 中兴获取Mediaplayer 对象
       } catch (e) {}
     }
     /*if (starttime && !isNextPlay) {    //根据时间播放
     	mp.playByTime(1, parseInt(starttime), 1);
     }*/

     if (contentType == "Movie") { //电影进来要判断是否快结束了
       var totalTime = mp.getMediaDuration();
       if (totalTime - g_playLong < 2) { //如果记录时长快结束了就从头播
       } else {
         mp.playByTime(1, g_playlong, 1);
       }
       //  XEpg.Util.delCookie('continueTime');
     } else {
       mp.playByTime(1, g_playlong, 1);
       //  XEpg.Util.delCookie('continueTime');
     }
     video.initMediaPlay();
     video.initPlayDiv();
     isUseAbled(); // 判断订购情况
   },
   initMediaPlay: function () {
     mp.setMuteFlag(0); //是否静音
     mp.setCycleFlag(1); //0循环播放   1单次播放
     mp.setAllowTrickmodeFlag(0); //设置是否允许trick操作。 0:允许 1：不允许
     mp.setNativeUIFlag(0); //播放器是否显示缺省的Native UI，  0:不允许 1：允许
     mp.setAudioTrackUIFlag(0); //设置音轨的本地UI显示标志 0:不允许 1：允许
     mp.setMuteUIFlag(0); //设置静音的本地UI显示标志 0:不允许 1：允许
     mp.setAudioVolumeUIFlag(0); //设置音量调节本地UI的显示标志 0:不允许 1：允许
     mp.setVideoDisplayMode(0); //设置为全屏
     mp.setChannelNoUIFlag(0)
     mp.setProgressBarUIFlag(0);//不使用进度条的本地UI显示功能
     mp.setChannelNoUIFlag(0);//不使用频道号的本地UI显示功能
     mp.refreshVideoDisplay(); //调整视频显示，需要上面两函数配合
   },
   initPlayDiv: function () {
     playtime = mp.getCurrentPlayTime(); //当前播放时间
     endtime = mp.getMediaDuration(); //总播放时间
     //starttime = 0;
     fn$('playtime').innerHTML = video.convertTime(playtime);
     fn$('endtime').innerHTML = video.convertTime(endtime);
   },
   //时间格式转换
   convertTime: function (time) {
     var time_second, time_min, time_hour;
     if (time == null) {
       time = mp.getMediaDuration();
     }
     time = parseInt(time, 10);
     time_hour = Math.floor(time / 3600);
     time_min = Math.floor(time % 3600 / 60);
     time_second = time % 3600 % 60;

     time_hour = time_hour < 10 ? '0' + time_hour : time_hour;
     time_min = time_min < 10 ? '0' + time_min : time_min;
     time_second = time_second < 10 ? '0' + time_second : time_second;

     return time_hour + ':' + time_min + ':' + time_second;
   },
   //初始化音量
   initVolume: function () {
     nowVolume = mp.getVolume();
     var height = (nowVolume * 155) / totalVolume;
     fn$('volbar').style.height = height + 'px';
   },
   //获取当前播放时长，设置滚动条位置
   getCurrentPlayTime: function (currentPlayTime, endTime) {
     var width = Math.ceil((858 * currentPlayTime) / endTime);
     fn$('mediaBar').style.width = width + 'px';
     fn$('mediaPoint').style.left = (width - 17) + 'px';
   },
   showFastForward: function () {
     var currentPlayTime = mp.getCurrentPlayTime();
     var endTime = mp.getMediaDuration();
     video.getCurrentPlayTime(currentPlayTime, endTime);
   }
 }
 //控制
 var control = {
   //音量加
   volumeUp: function () {
     if (hiddenTimer) {
       clearTimeout(hiddenTimer);
     }
     fn$("voice").style.display = 'block';
     fn$('mute').style.display = 'none';
     fn$("volbox").style.display = 'block';
     if (hiddenTimer) {
       clearTimeout(hiddenTimer);
     }
     mp.setMuteFlag(0); //0为有声， 1为静音
     nowVolume = mp.getVolume();
     nowVolume += preVolume;
     if (nowVolume >= totalVolume) {
       nowVolume = totalVolume;
     }
     mp.setVolume(nowVolume);

     var height = (nowVolume * 155) / totalVolume;
     fn$('volbar').style.height = height + 'px';

     hiddenTimer = setTimeout(function () { //三秒后隐藏音量组件
       fn$("voice").style.display = 'none';
     }, 3000);

   },
   //音量减
   volumeDown: function () {
     fn$("voice").style.display = 'block';
     fn$('mute').style.display = 'none';
     fn$("volbox").style.display = 'block';
     if (hiddenTimer) {
       clearTimeout(hiddenTimer);
     }
     nowVolume = mp.getVolume();
     nowVolume -= preVolume;
     if (nowVolume <= 0) {
       nowVolume = 0;
       mp.setMuteFlag(1);
       fn$("volbox").style.display = 'none';
       fn$('mute').style.display = 'block';
     }
     mp.setVolume(nowVolume); //设置音量
     var height = (nowVolume * 155) / totalVolume;
     fn$('volbar').style.height = height + 'px';
     hiddenTimer = setTimeout(function () { //三秒后隐藏音量组件
       fn$("voice").style.display = 'none';
     }, 3000);
   },
   //静音
   setMuteFlag: function () {
     fn$("voice").style.display = 'block';

     if (hiddenTimer) {
       clearTimeout(hiddenTimer);
     }
     var muteFlag = mp.getMuteFlag();
     if (muteFlag == 1) {
       mp.setMuteFlag(0);
       initVolume();
       fn$("volbox").style.display = 'block';
       fn$('mute').style.display = 'none';
     } else {
       mp.setMuteFlag(1);
       //initVolume();
       fn$("volbox").style.display = 'none';
       fn$('mute').style.display = 'block';
     }
     hiddenTimer = setTimeout(function () { //三秒后隐藏音量组件
       fn$("voice").style.display = 'none';
     }, 3000);
   },
   //暂停、播放切换
   pauseOrPlay: function () {
     clearTimeout(hiddenPress);
     if (trickmode == 'pause') { //暂停到播放
       mp.resume();
       fn$("bar_img").src = '../public/image_video/yq-icon-play.png'
       fn$("center").style.display = 'none';
       fn$("fast_stop").style.display = 'block';
       control.hiddenFastForward();
       isPause = false;
       trickmode = 'play';
     } else if (trickmode == 'play') {
       mp.pause();
       video.showFastForward();
       video.initPlayDiv();
       fn$("bar_img").src = '../public/image_video/yq-icon-stop.png';
       fn$("multiple_img").style.display = 'none';
       fn$("center_img").style.display = 'block';
       fn$("center").style.display = 'block';
       fn$("fast_stop").style.display = 'block';
       trickmode = 'pause';
       isPause = true;
       control.hiddenFastForward();
     } else if (trickmode == 'fastforward' || trickmode == 'fastrewind') {
       speedindex = 1;
       mp.resume();
       fn$("bar_img").src = '../public/image_video/yq-icon-play.png';
       fn$("center").style.display = 'none';
       fn$("fast_stop").style.display = 'block';
       control.hiddenFastForward();
       isPause = false;
       trickmode = 'play';
     }
   },
   //快进
   fastForward: function () {
     clearTimeout(hiddenPress);
     if (isPause == false) {
       fn$("bar_img").src = '../public/image_video/yq-icon-fast.png';
       if (trickmode == 'fastrewind') {
         clearTimeout(hiddenPress);
         speedindex = 1;
         mp.resume();
         trickmode = 'play';
         fn$("bar_img").src = '../public/image_video/yq-icon-play.png';
         fn$("center").style.display = 'none';
         fn$("fast_stop").style.display = 'block';
         control.hiddenFastForward();
       } else {
         fn$("center").style.display = 'block';
         fn$("multiple_img").style.display = 'block';
         fn$("center_img").style.display = 'none';
         fn$("fast_stop").style.display = 'block';
         speedindex = speedindex * 2;
         if (speedindex >= 64) {
           speedindex = 2;
         }
         fn$("multiple_img").innerHTML = 'x' + speedindex;
         trickmode = 'fastforward';
         mp.fastForward(speedindex);
         var currentPlayTime = mp.getCurrentPlayTime();
         var endTime = mp.getMediaDuration();
         if (speedindex > 1) {
           var timer = setInterval(function () {
             video.getCurrentPlayTime(mp.getCurrentPlayTime(), mp.getMediaDuration());
             video.initPlayDiv();
           }, 1000);
         } else {
           clearInterval(timer)
         }
       }
     }
   },
   //快退
   fastRewind: function () {
     clearTimeout(hiddenPress);
     if (isPause == false) {
       fn$("bar_img").src = '../public/image_video/yq-icon-slow.png';
       if (trickmode == 'fastforward') {
         clearTimeout(hiddenPress);
         speedindex = 1;
         mp.resume();
         trickmode = 'play';
         fn$("bar_img").src = '../public/image_video/yq-icon-play.png'
         fn$("center").style.display = 'none';
         fn$("fast_stop").style.display = 'block';
         control.hiddenFastForward();
       } else {
         fn$("center").style.display = 'block';
         fn$("multiple_img").style.display = 'block';
         fn$("center_img").style.display = 'none';
         fn$("fast_stop").style.display = 'block';
         speedindex = speedindex * 2;
         if (speedindex >= 64) {
           speedindex = 2;
         }
         fn$("multiple_img").innerHTML = '-x' + speedindex;
         trickmode = 'fastrewind';
         mp.fastRewind(-speedindex);
         var currentPlayTime = mp.getCurrentPlayTime();
         var endTime = mp.getMediaDuration();
         if (speedindex > 1) {
           var timer = setInterval(function () {
             video.getCurrentPlayTime(mp.getCurrentPlayTime(), mp.getMediaDuration());
             video.initPlayDiv();
           }, 1000);
         } else {
           clearInterval(timer)
         }
       }
     }
   },
   //退出视频
   exitAction: function () {
     releaseMedia();
     setTimeout(function () {
        if (contentType == "Movie") {
          window.location = "../detail/movieDetail.html?fromPage=player"
        } else {
          window.location = "../detail/seriesDetail.html?fromPage=player&contentNum=" +contentNum
        }
     }, 150);
   },
   //上一集
   preVideo: function () {
     isNextPlay = true;
     if (overTime) {
       clearInterval(overTime);
       fn$("isEnd").style.display = 'none';
     }
     if (contentNum > 1) {
       releaseMedia();
       contentNum--;
       contentCode = conCodeList[contentNum - 1].vodList[0].playUrl;
       fn$("viode_name").innerHTML = conCodeList[contentNum - 1].itemName;
       video.play();
       fn$("quit").style.display = 'none';
       mp.resume();
       fn$(currentId).className = "item";
       if (contentType == "Movie") {
         currentId = "nav1_1";
       } else {
         currentId = "nav1_4";
       }
       isExit = false;
     } else {
       unity.alertMsg("当前播放已是第一集。")
      //  releaseMedia();
      //  window.location.href = detailURL
     }
   },
   //下一集
   nextVideo: function () {
     isNextPlay = true;
     if (overTime) {
       clearInterval(overTime);
       fn$("isEnd").style.display = 'none';
     }

     if (contentNum < (conCodeList.length)) {
       releaseMedia();
       contentNum++;
       contentCode = conCodeList[contentNum - 1].vodList[0].playUrl;
       fn$("viode_name").innerHTML = conCodeList[contentNum - 1].itemName;
       video.play();
       fn$("quit").style.display = 'none';
       mp.resume();
       fn$(currentId).className = "item";
       if (contentType == "Movie") {
         currentId = "nav1_1";
       } else {
         currentId = "nav1_4";
       }
       isExit = false;
     } else {
       unity.alertMsg("当前播放已是最后一集。")
      //  releaseMedia();
      //  window.location.href=detailURL
     }
   },
   //隐藏快退、快进面板
   hiddenFastForward: function () {
     hiddenPress = setTimeout(function () {
       fn$('fast_stop').style.display = 'none';
     }, 3000);
   }
 }

 function pressOk() {
   if (isExit) {
     var index = parseInt(currentId.substring(5), 10);
     switch (index) {
       case 0:
         //  clickCol();
         break;
       case 1:
       case 4:
       case 8:
         if (overTime) {
           clearInterval(overTime);
           fn$("isEnd").style.display = 'none';
         }
         video.biPay()
         control.exitAction(); //确认退出	
         break;
       case 2:
         //case 6 :
         fn$("quit").style.display = 'none';
         mp.resume();
         fn$(currentId).className = "item";
         if (contentType == 1) {
           currentId = "nav1_1";
         } else {
           currentId = "nav1_4";
         }
         isExit = false;
         break;
       case 3:
       case 7:
         control.preVideo();
         break;
       case 5:
       case 9:
         if(window.isOrder==0) {  //未订购去请购
            getAuth();
         } else {
          control.nextVideo();
         }
         break;
       default:
         fn$("quit").style.display = 'none';
         mp.resume();
         isExit = false;
     }
   } else {
     control.pauseOrPlay();
   }
 }

 var pressMove = {
   right: function () {
     var index = parseInt(currentId.substring(5), 10);
     fn$(currentId).className = "item";
     switch (index) {
       case 0:
         currentId = "nav1_1";
         break;
       case 1:
         currentId = "nav1_2";
         break;
       case 2:
         currentId = "nav1_1";
         break;
       case 3:
         currentId = "nav1_4";
         break;
       case 4:
         currentId = "nav1_5";
         break;
       case 5:
         currentId = "nav1_3";
         break;
         //case 6 :
         //	currentId = "nav1_5";
         //	break;
       case 7:
         currentId = "nav1_8";
         break;
       case 8:
         currentId = "nav1_9";
         break;
       case 9:
         currentId = "nav1_7";
         break;
       default:
         return;
     }
     fn$(currentId).className = "item item_focus";
   },
   left: function () {
     var index = parseInt(currentId.substring(5), 10);
     fn$(currentId).className = "item";
     switch (index) {
       case 0:
         currentId = "nav1_2";
         break;
       case 1:
         currentId = "nav1_2";
         break;
       case 2:
         currentId = "nav1_1";
         break;
       case 3:
         currentId = "nav1_5";
         break;
       case 4:
         currentId = "nav1_3";
         break;
       case 5:
         currentId = "nav1_4";
         break;
         //case 6 :
         //	currentId = "nav1_3";
         //	break;
       case 7:
         currentId = "nav1_9";
         break;
       case 8:
         currentId = "nav1_7";
         break;
       case 9:
         currentId = "nav1_8";
         break;
       default:
         return;
     }
     fn$(currentId).className = "item item_focus";
   }
 }


 //退出
 function showExit() {
   mp.pause();
   fn$("quit").style.display = 'block';
   if (contentType == "Movie") {
     fn$("stateOne").style.display = 'block';
     fn$("stateTwo").style.display = 'none';
   }
 }

 //播放结束
 function isOverPlay() {
   var index = 4;
   if (trickmode == 'fastforward' || trickmode == 'fastrewind') {
     speedindex = 1;
     mp.resume();
     fn$("bar_img").src = '../public/image_video/yq-icon-play.png';
     fn$("center").style.display = 'none';
     fn$("fast_stop").style.display = 'none';
     isPause = false;
     trickmode = 'play';
   }
   fn$(currentId).className = "item";
   currentId = "nav1_8";
   fn$(currentId).className = "item item_focus";
   fn$("osdTitle").innerHTML = conCodeList[contentNum - 1].itemName;
   fn$("isEnd").style.display = 'block';
   isExit = true;
   if (contentType == "Movie") {
     fn$("isEnd").style.display = 'none';
     isExit = false;
     control.exitAction(); //确认退出	
   } else { //系列片
     if (window.isOrder == 0) { //未订购 当前播放是第一集
          fn$("isEnd").style.display = 'none';
          isExit = false;
          releaseMedia();
          overTime = setInterval(function () {
            index--;
            if (index == 0) {
              clearInterval(overTime);
              getAuth();
            } else {
              fn$("osdTitle2").innerHTML = '未订购' + index + '秒后自动跳转订购页';
            }
          }, 1000)
     } else {
       overTime = setInterval(function () {
         index--;
         if (index == 0) {
           clearInterval(overTime);
           fn$("isEnd").style.display = 'none';
           isExit = false;
           control.nextVideo();
         } else {
           fn$("osdTitle2").innerHTML = index + '秒后自动播放下一集';
         }
       }, 1000)
     }
   }
 }

 //快退到起点
 function isBeginNing() {
   speedindex = 1;
   mp.resume();
   fn$("bar_img").src = '../public/image_video/yq-icon-play.png';
   fn$("center").style.display = 'none';
   fn$("fast_stop").style.display = 'none';
   isPause = false;
   trickmode = 'play';
 }

 //退出视频，返回上一个页面
 function releaseMedia() {
   mp.stop(); //停止播放
   mp.releaseMediaPlayer(mp.getNativePlayerInstanceId()); //释放终端 MediaPlayer 的对象，结束对应MediaPlayer 的生命周期
 };
 /*******************遥控器事件监听方法****************************/

 /**
  * 遥控器按键事件监听函数
  * @param {Object} event
  */
 function keypress(event) {
   var val = event.which ? event.which : event.keyCode;

   switch (val) {
     case 8: //返回
       if (fn$("quit").style.display == 'block') {
         fn$("quit").style.display = 'none';
         mp.resume();
         fn$(currentId).className = 'item';
         if (contentType == "Movie") {
           currentId = 'nav1_1';
         } else {
           currentId = 'nav1_4';
         }
         isExit = false;
       } else {
         if (!isExit && (trickmode == 'play')) {
           mp.pause();
           fn$("quit").style.display = 'block';

           if (contentType == "Movie") {
             currentId = "nav1_1";
             fn$("stateOne").style.display = 'block';
             fn$("stateTwo").style.display = 'none';
           } else {
             currentId = "nav1_4";
             fn$("stateOne").style.display = 'none';
             fn$("stateTwo").style.display = 'block';
           }
           fn$(currentId).className = "item item_focus";
           isExit = true;
         }
       }
       break;
     case 259:
       control.volumeUp(); //音量加
       break;
     case 260:
       control.volumeDown(); //音量减法
       break;
     case 261:
       control.setMuteFlag(); //静音
       break;
     case 37: //向左
       if (!isExit) {
         control.fastRewind();
         fn$(currentId).className = "item";
       } else {
         pressMove.left();
       }
       break;
     case 38: //向上
       //pressMove.up();
       break;
     case 40: //向下
       //pressMove.down();
       break;
     case 39: //向右
       if (!isExit) {
         control.fastForward();
         fn$(currentId).className = "item";
       } else {
         pressMove.right();
       }
       break;
     case 264: //快进
       control.fastForward();
       break;
     case 265: //快退
       control.fastRewind();
       break;
     case 263:
     case 13:
       pressOk(); //确认键
       break;
     case 272:
       releaseMedia();
       break;
     case 768:
       goUtility(); //虚拟键：播放完成或者发生error执行
       break;
     default:
       break;
   }
   return 0;
 };

 //虚拟键：播放完成或者发生error执行
 function goUtility() {
   eval("eventJson = " + Utility.getEvent());
   var typeStr = eventJson.type;
   switch (typeStr) {
     case "EVENT_MEDIA_ERROR":
       control.exitAction();
       break;
     case "EVENT_MEDIA_END":
       isOverPlay();
       break;
     case "EVENT_MEDIA_BEGINING":
       isBeginNing();
       break;
     default:
       return 1;
   }
   return 1;
 };


 function isUseAbled() {
   //		document.getElementById("test1").innerHTML =  contentNum;
   if (window.isOrder == 0) { //判断是否通过挽留页进入
     if (contentType == "Movie") { //如果是电影
       unity.alertMsg("未订购试看10分钟")
       setInterval(function () {
         playtime = mp.getCurrentPlayTime();
         if (playtime >= 600) { //电影判断播放时长，当播放时长大于10分钟
          fn$("osdTitle2").innerHTML = '试看结束，跳转订购页';
          releaseMedia() //关闭播放器
           getAuth();
         }
       }, 2000);
     } else {
       unity.alertMsg("未订购第一集免费")
     }
   }
 }

  function  getAuth() {
    var returnURL = window.location.href.split("?")[0];
    unity.order(returnURL)
 }