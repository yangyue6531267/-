
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
    isOrder: 0,
    itemPlay:0,
    list:null,
    timers:null,
    historyTime:{
      time:0,
      index:0,
    },
    getValue: function () {
        // this.detailUrl = localStorage.getItem('detailUrl');
        this.detailUrl = $.cookie("detailUrl")
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
            // playRecord();
            var json = {time: playmode.startTime*1,
              index:value.itemPlay*1};
            localStorage.setItem(value.detailData.assetId, JSON.stringify(json),{
              path: '/'
            })
        }
        videoOptions.onCompleted = function (res){
            console.log('播放完毕')
            playmode.playNext();
            playRecord();
            var json = {time: playmode.startTime*1,
              index:value.itemPlay*1 + 1};
            localStorage.setItem(value.detailData.assetId, JSON.stringify(json),{
              path: '/'
            })
            player.stop();
            window.location.href = "./../detail/detail.html"
        }
        videoOptions.onError = function (res){
            console.log('报错')
        }
    },
    play:function (obj){
      player.initPlayer()
       try {
        console.warn(player.videoStateChange)
        player.setCallback(player.videoStateChange);
        view.hideTopBottom();
        player.setDisplayerLocation();
        player.toggleShow('showPlayer');
        // var playUrl = 'http://111.20.33.8/88889331/16/20191206/272581351/272581351.ts/index.m3u8?fmt=ts2hls&servicetype=0&icpid=&accounttype=1&limitflux=-1&limitdur=-1&GuardEncType=2&accountinfo=UscodoDVlmTeWaggrSXD1Dx9c79L1q1Mj+h1hOggiKfpyEPZ9frA7SumfGNqZJc7lUrwQ2Ieyx5t2p8G5RjrNyVS128T7vUs7UCbiI3R0VG3+B529c454xiBx6ZxHSfdQhkYVcYRkp24jxu8nLXu3A==:20191210152603,13474100670,111.20.40.12,20191210152603,YANHUA90000035PITEM0040006862845,4890340C7C12A8CC2E22130AFD129A2B,,1,0,-1,12,1,425,,4211141,1,END'
        // var playUrl = value.list[obj.index].vodList[0].playUrl;
        // var playUrl = obj.playurl
        console.log('播放地址前')
        console.log(obj)
        console.log(JSON.stringify(obj))
        var playUrl = obj.playurl
        // var playUrl ='http://devimages.apple.com.edgekey.net/streaming/examples/bipbop_4x3/gear2/prog_index.m3u8'
        // var playUrl ="http://117.156.27.148/270000000122/6990015801111110000000000415021/XXSX2S0018.ts";
        // var playUrl = 'http://111.20.33.8/88889331/16/20191206/272581351/272581351.ts/index.m3u8?fmt=ts2hls&servicetype=0&icpid=&accounttype=1&limitflux=-1&limitdur=-1&GuardEncType=2&accountinfo=UscodoDVlmTeWaggrSXD1Dx9c79L1q1Mj+h1hOggiKfpyEPZ9frA7SumfGNqZJc7lUrwQ2Ieyx5t2p8G5RjrNyVS128T7vUs7UCbiI3R0VG3+B529c454xiBx6ZxHSfdQhkYVcYRkp24jxu8nLXu3A==:20191210152603,13474100670,111.20.40.12,20191210152603,YANHUA90000035PITEM0040006862845,4890340C7C12A8CC2E22130AFD129A2B,,1,0,-1,12,1,425,,4211141,1,END'
        // var playUrl = 'http://111.20.105.60:6060/yanhuajingxuan/32/YANHUA00000000048MMVOD0007311484?AuthInfo=c6eU0xj82YwA1gvxYpApbJo02%2F6jXeuLiowtvqhQL5zRpVRpYDXkAGOmScl7f4RLkFCn58sfUUxBq1dyKe4mLKXOvZGL1qCZ6vyJPf28SiQidO81ipSCEu6JaoXHjeOM2WqkK1kVGp6bWSX8nZWtrw%3D%3D&version=v1.0&virtualDomain=yanhuajingxuan.vod_hpd.zte.com&stbid=0044030000010060180858B42D844C10&terminalflag=1&userid=D071C46F2ECB'
        
        console.log('播放地址后')
        if (yh.cnd == 'http://111.20.105.85:9330') {
          var a = playUrl.match(/(\S*)AuthInfo=/)[1]
          var b = playUrl.match(/AuthInfo=(\S*)&version=/)[1]
          var c = playUrl.match(/&version=(\S*)/)[1]
          b = b.replace(/\=/g,"%3D") 
          // b = b.replace("=","%3D") 
          b = b.replace(/\//g,"%2F") 
          playUrl = a + 'AuthInfo=' + b + '&version=' + c
        }
        console.log(playUrl)
        if (obj.timeshifturl) {
          var time = obj.timeshifturl;
        }else{
          var time = 0;
        }
        var OpJson ={
          playUrl:playUrl,
          // historyTime:obj.time
          historyTime:0
        }
        player.play(OpJson)
      } catch (error) {
        console.log(error);
        console.log('播放器初始化失败');
      }
    }
  }
  // function playRecord() {
  //   // 播放历史记录
  //   var collectType = '3';
  //   var relateId = value.detailData.assetId;
  //   var relateTitle = value.detailData.assetName;
  //   var relateImg = value.detailData.assetImg;
  //   var relateUrl = value.detailUrl;
  //   var relateLayout = value.detailData.layout;
  //   var relateScore = value.detailData.score == undefined ? '' : value.detailData.score;
  //   var relateEpisode = value.itemPlay*1 + 1;
  //   var relateTime = playmode.startTime*1;
  //   if (value.detailData.score && value.detailData.score.length == 1) {
  //     relateScore += '0'
  //   }
  //   var data = '{"siteId":' + '"' + yh.siteId + '"' + ',"relateEpisode":' + '"' + relateEpisode + '"' + ',"relateTime":' + '"' + relateTime + '"' + ',"userId":' + '"' + yh.userId + '"' + ',"collectType":' + '"' + collectType + '"' + ',"relateId":' + '"' + relateId + '"' + ',"relateTitle":' + '"' + relateTitle + '"' + ',"relateImg":' + '"' + relateImg + '"' + ',"relateUrl":' + '"' + relateUrl + '"' + ',"relateLayout":' + '"' + relateLayout + '"' + ',"relateScore":' + '"' + relateScore + '"' + '}';
  //   var urls = historylUrl + '/collect?version=1';
  //   getYhSpecialSC(urls, data);
  // };
  var getData = function (url) {
    console.log("获取详情数据");
    ajax({
      type: "GET",
      url: url,
      data: {},
      dataType: "json",
      success: function (response) {
        value.detailData = eval("(" + response + ")").data;
        console.log(value.detailData )
        if (localStorage.getItem(value.detailData.assetId)) {
          value.historyTime = JSON.parse(localStorage.getItem(value.detailData.assetId));
        }
        console.warn(localStorage.getItem(value.detailData.assetId));
        value.itemPlay = value.historyTime.index;
        value.list = value.detailData.itemList;
        console.log('获取数据');
        // if (localStorage.getItem('superid') != '') {
        //   value.cid = localStorage.getItem('cid')
        //   value.superid = localStorage.getItem('superid')
        // } else {
          // if (yh.cnd == 'http://111.20.33.16:33200') {
          yh.cdn = localStorage.getItem('cdn')
          console.log(yh.cdn)
          var itemNo = localStorage.getItem('itemNo')
          if (yh.cnd.indexOf("33200") != -1) {
            value.cid = value.detailData.itemList[itemNo].vodList[0].playUrl.split(":")[2].match(/programId=(\S*)&/)[1]
            value.superid = value.detailData.itemList[itemNo].vodList[0].playUrl.split(":")[2].match(/seriesId=(\S*)/)[1]
          } else {
            value.cid = value.detailData.itemList[itemNo].vodList[1].playUrl.split(":")[2].match(/programId=(\S*)&/)[1]
            value.superid = value.detailData.itemList[itemNo].vodList[1].playUrl.split(":")[2].match(/seriesId=(\S*)/)[1]
          }
        // }
        
        playContent.init();

        var contentId = localStorage.getItem('contentId')
        userPower(playVideoBig(value.cid, value.superid), contentId)

        console.log('cid和sid', value.cid, value.superid)
        // playVideoBig(value.cid, value.superid)
        // value.play(value.historyTime);
        
        
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
        document.getElementById("play_info").innerHTML = value.detailData.area + " | " + (value.itemPlay*1+1) + " | " + value.detailData.episodes + "集"
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
        console.log("切集前"+value.itemPlay)
        if (value.itemPlay>=value.list.length-1) {
          value.itemPlay = 0;
          // var backUrl = localStorage.getItem('backUrl')
          // 
          window.location.href = "./../detail/detail.html";
        } else {
        value.itemPlay = value.itemPlay*1+1;
       
        playContent.init();
        try {
            view.hideTopBottom();
            player.setDisplayerLocation();
            player.toggleShow('showPlayer');
            var itemNo = localStorage.getItem('itemNo')
            // var playUrl ='http://devimages.apple.com.edgekey.net/streaming/examples/bipbop_4x3/gear2/prog_index.m3u8'
            var playUrl = value.list[value.itemPlay].vodList[itemNo].playUrl;
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
  value.getValue();
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
      player.stop();
      
      if (localStorage.getItem('detailsPage') == 'movies') {
        window.location.href = "../detail/movieDetail.html";
      } else {
        window.location.href = "../detail/seriesDetail.html";
      }
      
      // window.history.go(-1)
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
