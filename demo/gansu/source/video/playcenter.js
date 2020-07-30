
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
  Cookies.set('qb_datetime', (new Date()).valueOf(), {path: '/'})
  //按键分发事件
  var onKeyPress;
  //按键prev处理函数
  var grepEvent = function (e) {
    var keyCode = e.keyCode || e.which;
    return onKeyPress(KEYMAP[keyCode]);
  };
  var value = {
    detailData: {},
    isBack: false,
    detailUrl: "",
    isOrder: 1,
    itemPlay:0,
    list:null,
    timers:null,
    historyTime:{
      time:0,
      index:0,
    },
    getValue: function () {
        player.initPlayer();
        this.detailUrl = Cookies.get('detailUrl');
        console.log('获取播放');
        videoOptions.onStart = function (res){
          console.log('准备播放')
        }
        videoOptions.onPlay = function (res){
          console.log('开始播放')
        }
        videoOptions.onProgress = function (res){
          console.log('每秒调用');
          playmode.refreshProgressView(res.curPlayTime,res.allTime);    
        }
        videoOptions.onPause = function (res){
            console.log('暂停')
            playmode.stopPlay = true;
        }
        videoOptions.onResume = function (res){
            console.log('续播')
            // playmode.cachePlayTime =-1;
            playmode.stopPlay = false;
        }
        videoOptions.onStop = function (res){
            console.log('手动停止')
            playRecord();
            var json = {time: playmode.startTime*1,
              index:value.itemPlay*1};
            Cookies.set(value.detailData.assetId, JSON.stringify(json),{
              path: '/'
            })
        }
        videoOptions.onCompleted = function (res){
            console.log('播放完毕')
            try {
              commonParams.asset_id = value.detailData.assetId;
              commonParams.item_id = value.detailData.itemList[value.itemPlay].itemId
              commonParams.qb_datetime = Cookies.get('qb_datetime')
              commonParams.zb_datetime = (new Date()).valueOf()
              commonParams.time = commonParams.zb_datetime - commonParams.qb_datetime
              commonParams.ep = value.detailData.episodes
              commonParams.fee = '1'
              commonParams.isFullScreen = '0'
              commonParams.pos_id = Cookies.get('pos_id')
              commonParams.recmd_id = Cookies.get('recmd_id')
              commonParams.parent_page_type = '0301'
              commonParams.parent_page_id = value.detailData.assetId
              if (value.itemPlay > 0) {
                commonParams.fee = '2'
              }
              bi.vod(commonParams)
            } catch (e) {
              console.log('错误信息' + e)
            }
            var isOrder = Cookies.get('isOrder') || 1;
            var isZero = Cookies.get('specialType')
        if (value.itemPlay ==0 &&isOrder==1&&isZero!=0) {
            value.itemPlay = 0;
            playRecord();
            var json = {
              // time: playmode.startTime*1,
              time: 0*1,
              index:value.itemPlay*1};
            Cookies.set(value.detailData.assetId, JSON.stringify(json),{
              path: '/'
            })
            window.location.href = "./../detail/detail.html";
          return
        }
          var json = {
            time: 0,
            index:value.itemPlay*1+1};
          Cookies.set(value.detailData.assetId, JSON.stringify(json),{
            path: '/'
          })
          playRecord();
          playmode.playNext();
          
        }
        videoOptions.onError = function (res){
            console.log('报错')
        }
    },
    play:function (obj){
       try {
        player.setCallback(player.videoStateChange);
        view.hideTopBottom();
        player.setDisplayerLocation();
        player.toggleShow('showPlayer');
        // var playUrl ='http://iptvdirect.gs.chinamobile.com/270000000322/6990015801111110000000001064231/index.m3u8'
        // // var playUrl = value.list[obj.index].vodList[0].playUrl;
        var playUrl ="http://iptvdirect.gs.chinamobile.com/270000000322/"+value.list[obj.index].vodList[0].playUrl.split(":")[1]+"/index.m3u8";
        var OpJson ={
          playUrl:playUrl,
          historyTime:obj.time
        }
        player.play(OpJson)
      } catch (error) {
        console.log(error);
        console.log('播放器初始化失败');
      }
    }
  }
  function playRecord() {
    // 播放历史记录
    var collectType = '3';
    var relateId = value.detailData.assetId;
    var relateTitle = value.detailData.assetName;
    var relateImg = value.detailData.assetImg;
    var relateUrl = value.detailUrl;
    var relateLayout = value.detailData.layout;
    var relateScore = value.detailData.score == undefined ? '' : value.detailData.score;
    var relateEpisode = value.itemPlay*1 + 1;
    var relateTime = playmode.startTime*1;
    if (value.detailData.score && value.detailData.score.length == 1) {
      relateScore += '0'
    }
    var data = '{"siteId":' + '"' + yh.siteId + '"' + ',"relateEpisode":' + '"' + relateEpisode + '"' + ',"relateTime":' + '"' + relateTime + '"' + ',"userId":' + '"' + yh.userId + '"' + ',"collectType":' + '"' + collectType + '"' + ',"relateId":' + '"' + relateId + '"' + ',"relateTitle":' + '"' + relateTitle + '"' + ',"relateImg":' + '"' + relateImg + '"' + ',"relateUrl":' + '"' + relateUrl + '"' + ',"relateLayout":' + '"' + relateLayout + '"' + ',"relateScore":' + '"' + relateScore + '"' + '}';
    var urls = historylUrl + '/collect?version=1';
    getYhSpecialSC(urls, data);
  };
  var getData = function (url) {
     console.warn("=播放器"+url);
    $.ajax({
      type: "GET",
      url: url+'&returnType=jsonp',
      dataType: "jsonp",
      jsonpCallback:'jsonpCallback',
      success: function (response) {
        console.log(typeof(response))
        value.detailData = response.data;
        console.log(value.detailData);
        console.log(value.detailData.assetId);
        if (Cookies.get(value.detailData.assetId)) {
          value.historyTime = JSON.parse(Cookies.get(value.detailData.assetId));          
        }
        console.warn(Cookies.get(value.detailData.assetId));
        value.itemPlay = value.historyTime.index;
        value.list = value.detailData.itemList;
        console.log('获取数据');
        playContent.init();
        value.play(value.historyTime);
      },
      fail: function (error) {
        console.log(error);
      }
    })
  }
  var playContent = {
      isStop:false,
      init:function (){
        console.log(value.detailData.assetName);
        console.log(document);
        console.log(document.getElementById("play_name"));
        document.getElementById("play_name").innerHTML = value.detailData.assetName;
        console.log(value.detailData.assetName);
        document.getElementById("play_info").innerHTML =  "第" + (value.itemPlay*1+1) + "集"
        // document.getElementById("description").innerHTML = value.detailData.description
        view.hideTopBottom();
      },
      right:function (){
          // playmode.pause();
          playmode.goForwardView();
      },
      left:function(){
          // playmode.pause();
          playmode.goBackView();
      },
      enter:function(){
          if (this.isStop) {
            this.isStop = false;
            document.getElementById("play_center").style.cssText='display:none'
            player.togglePlay('resume');
          } else {
            this.isStop = true;
            document.getElementById("play_center").style.cssText='display:table'
            view.hideTopBottom();
            player.togglePlay('pause');
          }
      }
  }

  var playmode = {
    funViewInited:false,
    playState:0,
    cachePlayTime:0,
    currPlayTime:-1,
    startTime:0,
    allTime:null,
    stopPlay:false,
    time : null,
    ret :null,
    getTimeFormat:function(secondTimes) {
        var secondTime = secondTimes/1000;
        if (secondTime <= 0) { return '00:00:00'; }
        var hour = parseInt(secondTime / 3600) + '';
        if (hour.length == 1) { hour = '0' + hour; }
        var minute = parseInt((secondTime%3600)/ 60) + '';
        if (minute.length == 1) { minute = '0' + minute; }
        var second = parseInt(secondTime % 60) + '';
        if (second.length == 1) { second = '0' + second; }
        console.log(secondTime);
        return hour + ':' + minute + ':' + second;
    },
    resume:function(){
      document.getElementById("play_center").style.cssText='display:none'
      player.togglePlay('resume');
    },
    pause:function(){
      document.getElementById("play_center").style.cssText='display:table'
      player.togglePlay('pause');
    },
    refreshProgressView:function(startTime,allTime) {
        // 若没有数据，则在1秒后再尝试
        if (allTime <= 0) {
          this.funViewInited = false;
          setTimeout(function(){
            this.refreshProgressView(startTime,allTime);
          }, 1000);
          return;
        }
        this.funViewInited = true;
        playmode.startTime = startTime;
        playmode.allTime = allTime*1;
        // console.log("refreshProgressView total time = " + this.playerCore.getTotalTime() + " currtime = " + this.playerCore.getCurrentTime());
        // this.currPlayTime = this.playerCore.getCurrentTime();
        
        // if (this.playState == 2) {
        //   console.log('刷新进度条，暂停状态');
        // } else {
        //   console.log('刷新进度条,播放器状态' + this.playState);
        // }
        
        if (!this.stopPlay) {
          view.timeChange(startTime,allTime);
        } 
      },
      goForwardView:function () {
        // 快进
        if (this.startTime == 0 || this.allTime == 0) return;
        if (this.time !=null) {
          clearTimeout(this.time);    
        }
        if (this.ret !=null) {
          clearTimeout(this.ret);
          console.warn('清除时间');          
         }
        view.hideTopBottom();
        if (!this.funViewInited) {return;}
        if (!this.stopPlay) {
          this.pause();
        } 
        // if (!this.funViewInited) { return; }
        if (this.cachePlayTime < this.startTime) { this.cachePlayTime = -1;}
        console.log('现在时间'+this.startTime);
        if (this.cachePlayTime != -1) {
           this.currPlayTime = this.cachePlayTime; 
          } else {
          this.currPlayTime = this.startTime; 
          this.ret = setTimeout(function () {
            console.warn("清除定时"); 
            playmode.currPlayTime = -1;
            console.log(playmode.currPlayTime);
          },1500);
        }
        console.log("全部时间"+this.allTime);
        console.log(playmode.currPlayTime);
        // if (this.currPlayTime >= this.allTime) { return; }
        console.log(this.currPlayTime);
        this.currPlayTime = this.currPlayTime*1+20000;
        console.log('开始快进')
        if (this.currPlayTime > this.allTime) { this.currPlayTime = this.allTime-5000; }
        console.log ('快进到底')
        this.cachePlayTime = this.currPlayTime;
        console.log ('开始跳转')
        view.timeChange(this.currPlayTime,this.allTime);
      this.time = setTimeout(function(){
          player.seekTime({seekTime:playmode.currPlayTime});
          console.log('跳转成功')
          playmode.cachePlayTime = -1
          playmode.resume();
        },800)
      },
      goBackView:function() {
        // 快退
        if (this.startTime == 0 || this.allTime == 0) return;
        if (this.time !=null) {
          clearTimeout(this.time);          
         }
         if (this.ret !=null) {
           clearTimeout(this.ret);          
          }
        if (!this.funViewInited) {return;}
        view.hideTopBottom();
        if (!this.stopPlay) {
          this.pause();
        }
        if (this.cachePlayTime > this.startTime) { this.cachePlayTime = -1; }
        if (this.cachePlayTime != -1) {
           this.currPlayTime = this.cachePlayTime; 
          } else {
           this.currPlayTime = this.startTime;
            this.ret = setTimeout(function () {
              playmode.currPlayTime = -1;
            },1500);
          }
        if (this.currPlayTime <= 0) { return; }
        this.currPlayTime = this.currPlayTime*1-20000;
        if (this.currPlayTime < 0) { this.currPlayTime = 0; }
        this.cachePlayTime = this.currPlayTime;
        view.timeChange(this.currPlayTime,this.allTime);
       this.time = setTimeout(function(){
          player.seekTime({seekTime:playmode.currPlayTime});
          playmode.cachePlayTime = -1
          playmode.resume();
        },800)
      },
      playNext:function(){
        player.stop();
        console.log("切集钱"+value.itemPlay)
        if (value.itemPlay>=value.list.length-1) {
          value.itemPlay = 0;
          window.location.href = "./../detail/detail.html";
        } else {
        value.itemPlay = value.itemPlay*1+1;
        playContent.init();
        try {
            view.hideTopBottom();
            player.setDisplayerLocation();
            player.toggleShow('showPlayer');
            // var playUrl ='http://iptvdirect.gs.chinamobile.com/270000000322/6990015801111110000000001064231/index.m3u8'
            var playUrl ="http://iptvdirect.gs.chinamobile.com/270000000322/"+value.list[value.itemPlay].vodList[0].playUrl.split(":")[1]+"/index.m3u8";
            // var playUrl = value.list[value.itemPlay].vodList[0].playUrl;
            var OpJson ={
              playUrl:playUrl,
              historyTime:0
            }
            player.play(OpJson)
          } catch (error) {
            console.log(error);
            console.log('播放器初始化失败');
          }
          console.log("切集后"+value.itemPlay)
        }
      }
  }
  var view = {
    timer:null,
    hideTopBottom:function(){
      document.getElementById("play-top").style.cssText='display:block';
      document.getElementById("play-bottom").style.cssText='display:block'
      // 隐藏ui展示
      clearTimeout(view.timer);
      view.timer = setTimeout(function(){
        document.getElementById("play-top").style.cssText='display:none';
        document.getElementById("play-bottom").style.cssText='display:none'
      },7000)
    },
    timeChange:function(startTime,allTime){
      var progress = startTime/ allTime;
        if (progress > 1) { progress = 1;}
        document.getElementById('allLongs').style.width = progress * 993 + 'px';
        document.getElementById('play_icon').style.left = (progress * 993) + 'px';
        document.getElementById('play_icon').innerHTML = playmode.getTimeFormat(startTime);
        document.getElementById('play_time').innerHTML = playmode.getTimeFormat(allTime);
    }
  }

  window.homePress = function (){
    console.log('首页键位');
  }

  function registerLifecycleCallback(res){
    console.log('获取硬件信息-----------registerLifecycleCallback')
    console.log(JSON.stringify(res))
    if (res.status == 3) {
      player.togglePlay('pause');
    }
    if ( res.status == 4) {
      player.stop();
      prompt("yanhua://epg/exit");
    }else if (res.status==1 ||res.status ==2) {
      player.togglePlay('resume');
    }
  }
  value.getValue();
  prompt('yanhua://epg/registerLifecycleCallback?return=registerLifecycleCallback');
  getData(value.detailUrl)

  areaObj = playContent; //初始焦点赋值

onKeyPress = function (keyCode) {
  switch (keyCode) {
    case "up": //上边
      areaObj.up();
      break;
    case "down": //下边
      areaObj.down();
      break;
    case "left": //左边
      areaObj.left();
      break;
    case "right": //右边
      areaObj.right();
      break;
    case "back":
      // var backUrl = Cookies.get('backUrl')
      player.stop();
      window.location.href = "./../detail/detail.html";
      break;
    case "enter":
      areaObj.enter();
      break;
    case "home":
      areaObj.home();
      break;
  }
};

  document.onkeydown = grepEvent;
