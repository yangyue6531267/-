var playerBox = {
  indexPlay: 0,//当前播放第几集
  totalNumber: 1,//集数，
  detailUrl: "",
  detailData: {},
  authCode: '3a',
  returnUrl: "",
  playDate: {
    curPlayTime: 0,
    allTime: '',
  },
  positionBar: 0,
  timer: null,
  fastTime: 15000,
  playUrl: '',
  isShowTrial: false,
  currentTime: 0,//续播时长
  //   onStart	准备播放
  // onPlay	开始播放
  // onPause	暂停
  // onResume	续播
  // onProgress	当前播放时长
  // onStop	手动停止
  // onCompleted	播放完毕
  // onError	播放失败
  // onScreenChange	大小屏切换
  // onBufferingStart	开始缓冲
  // onBufferfinish	缓冲结束
  isfullPlay: false,
  pauseStatus: 0,
  status: -2,// - 1 – 开始缓冲 0 – 暂停 1 – 正在播放 2 – 播放完毕 3 - 播放失败
  initData: function () {
    // 跳转播放器的url
    var url = "";
    //订购返回
    if (getParam('code')) {
      url = $.cookie("JX_playUrl");
      if (getParam('code') == 0) {
        $.cookie('isOrder', '1', {
          path: '/'
        })
      }
    } else {
      url = window.location.href;
      $.cookie("JX_playUrl", url);
    }
    playConfig.isOrder = $.cookie('isOrder') || 0;
    playerBox.indexPlay = getParam('indexPlay', url) * 1 || 0;
    playerBox.detailUrl = decodeURIComponent(getParam('detailUrl', url));
    playerBox.returnUrl = getParam('returnUrl', url);
    playerBox.currentTime = getParam('currentTime', url);
  },
  getData: function () {
    areaObj = playerBox;
    $.ajax({
      type: "GET",
      url: playerBox.detailUrl + '&returnType=jsonp',
      dataType: "jsonp",
      jsonpCallback: 'jsonpCallback',
      success: function (response) {
        if (response.code == 200) {
          areaObj = playerBox;
          playerBox.detailData = response.data;
          getId('viode_name').innerHTML = playerBox.detailData.itemList[playerBox.indexPlay].itemName
          playerBox.fullPlay();
          playerBox.totalNumber = playerBox.detailData.itemList.length;
          if (playerBox.detailData.assetType == "Movie" && playConfig.isOrder != "1") {
            getId('noFee').style.display = "block";
          }
        } else {
          playerBox.back();
        }
      },
      fail: function (error) {
        playerBox.back();
      }
    })
  },
  initPlay: function () {
    if (playerBox.timer) {
      clearInterval(playerBox.timer);
    }
    playerBox.timer = setInterval(function () {
      getId('totalTime').innerHTML = secondToDate(playerBox.playDate.allTime / 1000);
      getId('currTime').innerHTML = secondToDate(playerBox.playDate.curPlayTime / 1000);
      var currProgress = playerBox.playDate.curPlayTime / playerBox.playDate.allTime * 858;
      getId('currBar').style.width = currProgress + "px";
      getId('currBox').style.left = currProgress - 36 + "px";
    }, 200);
  },
  uploadPlayStatus: function (res) {
    if (playerBox.pauseStatus == 1) return
    if (res) {
      playerBox.playDate = res;
    }
  },
  updateBar: function () {
    playerBox.pauseStatus = 0;
    player.seekTime({ 'seekTime': playerBox.positionBar });
    playerBox.showBar();
  },
  // 显示暂停ui
  showPause: function () {
    getId('pause').style.visibility = "visible";
    playerBox.showBar();
  },
  // 隐藏暂停ui
  hiddenPause: function () {
    getId('pause').style.visibility = "hidden";
    debounce(playerBox.hiddenBar, 3000);
  },
  // 显示播放器进度条
  showBar: function () {
    if (playerBox.status == 2) return;
    getId('footerPlayer').style.visibility = "visible";
    getId('viode_name').style.visibility = "visible";
    if (playerBox.status == 0) return
    debounce(playerBox.hiddenBar, 3000);
  },
  // 隐藏播放器进度条
  hiddenBar: function () {
    if (playerBox.status == 0) return;
    getId('footerPlayer').style.visibility = "hidden";
    getId('viode_name').style.visibility = "hidden";
  },
  //全屏
  fullPlay: function () {
    var playUrl = playerBox.detailData.itemList[playerBox.indexPlay].vodList[0].playUrl
    playerBox.playUrl = playUrl;
    // 小屏播放器
    // getId('footerPlayer').style.visibility = "hidden";
    // getId('pause').style.visibility = "hidden";
    // getId('box-wrap').style.visibility = 'visible';
    // if (playerBox.status == 0) {
    //   player.togglePlay('resume');
    // }

    player.setDisplayerLocation({ x: 0, y: 0, w: -1, h: -1 });
    player.initPlayer();
    player.toggleShow('showPlayer');
    player.setCallback(videoStateChange);
    player.play(playerBox.authCode, playUrl, playerBox.currentTime);
    unity.playRecord(playerBox, playerBox.playDate.curPlayTime, playerBox.indexPlay)
    try {
      //点播调出选集页
      var chargeType = 0;
      if (playerBox.indexPlay > 0) {
        chargeType = 1;
      }
      var params = {
        type: 4,
        content: {
          type: 14,
          seriesID: playerBox.detailData.assetId,
          programIdID: getParam('programId', playerBox.detailData.itemList[playerBox.indexPlay].vodList[0].playUrl),
          chargeType: chargeType,
          resolution: 0,
          moveLength: playerBox.playDate.allTime,
          location: playerBox.playDate.curPlayTime,
          playID: getParam('migu_play_url', playerBox.detailData.itemList[playerBox.indexPlay].vodList[0].playUrl)
        }
      }
      if (playerBox.playDate.curPlayTime > 0) {
        stat(params);
      }

      var chargeType = 0;
      if (playerBox.indexPlay > 0) {
        chargeType = 1;
      }
      var params = {
        type: 4,
        content: {
          type: 15,
          seriesID: playerBox.detailData.assetId,
          programIdID: getParam('programId', playerBox.detailData.itemList[playerBox.indexPlay].vodList[0].playUrl),
          chargeType: chargeType,
          resolution: 0,
          moveLength: playerBox.playDate.allTime,
          location: playerBox.playDate.curPlayTime,
          playID: getParam('migu_play_url', playerBox.detailData.itemList[playerBox.indexPlay].vodList[0].playUrl)
        }
      }
      if (playerBox.playDate.curPlayTime > 0) {
        stat(params);
      }
    } catch (e) {
      console.log(e);
    }
    try {
      //点播调出选集页
      var chargeType = 0;
      if (playerBox.indexPlay > 0) {
        chargeType = 1;
      }
      var params = {
        type: 4,
        content: {
          type: 15,
          seriesID: playerBox.detailData.assetId,
          programIdID: getParam('programId', playerBox.detailData.itemList[playerBox.indexPlay].vodList[0].playUrl),
          chargeType: chargeType,
          resolution: 0,
          moveLength: playerBox.playDate.allTime,
          location: playerBox.playDate.curPlayTime,
          playID: getParam('migu_play_url', playerBox.detailData.itemList[playerBox.indexPlay].vodList[0].playUrl)
        }
      }
      if (playerBox.playDate.curPlayTime > 0) {
        stat(params);
      }
    } catch (e) {
      console.log(e);
    }
  },
  // 隐藏播放器
  hidePlayer: function () {
    try {
      commonParams.asset_id = playerBox.detailData.assetId;
      commonParams.item_id = playerBox.detailData.itemList[playerBox.indexPlay].itemId
      commonParams.qb_datetime = $.cookie('qb_datetime')
      commonParams.zb_datetime = (new Date()).valueOf() + ''
      commonParams.time = playerBox.playDate.curPlayTime
      commonParams.ep = playerBox.detailData.episodes + ''
      commonParams.fee = '1'
      commonParams.isFullScreen = '0'
      commonParams.pos_id = $.cookie('pos_id')
      commonParams.recmd_id = $.cookie('recmd_id')
      commonParams.parent_page_type = '0301'
      commonParams.parent_page_id = playerBox.detailData.assetId
      if (playerBox.indexPlay > 0) {
        commonParams.fee = '2'
      }
      bi.vod(commonParams)
    } catch (e) {
      console.log('错误信息' + e)
    }
    $.cookie('qb_datetime', (new Date()).valueOf(), {
      path: '/'
    })
    player.stop();
    player.toggleShow('hidePlayer');
  },
  //下一集
  playNext: function (curr) {
    if (playerBox.indexPlay > 0 && playConfig.isforbid == '1') {
      // 黑名单，第二集不能看，不能跳订购
      getId('blacklist').style.display = 'block'
      return
    };
    if (curr == 'next') {
      //自动跳转下一集
      if (playerBox.indexPlay + 1 < playerBox.totalNumber) {
        playerBox.indexPlay++;
        if (playerBox.indexPlay > 0 && playConfig.isforbid == '1') {
          // 黑名单，第二集不能看，不能跳订购
          getId('blacklist').style.display = 'block'
          return
        };
      } else {
        backBox.goBack();
        return
      }
      if (playConfig.isOrder == '1') {
        if (playerBox.indexPlay >= playerBox.totalNumber) return;
        getId('viode_name').innerHTML = playerBox.detailData.itemList[playerBox.indexPlay].itemName;
        if (playerBox.status != -2) {
          // var playUrl = 'http://ip:port?programId=YANHUA00000000043PITEM0097118357&file_name=20190613160207909e229185c&migu_play_url=1041000196';
          // var playUrl = 'http://gslbserv.itv.cmvideo.cn/20180626151640187bcda1ef0.ts?channel-id=yanhuasp&Contentid=1041001719&authCode=3a&stbId=005903FF000100606001C0132B043D08&usergroup=g29097100000&userToken=6a83ea9ccbeaef860d6149adf107314029pb';
          var playUrl = playerBox.detailData.itemList[playerBox.indexPlay].vodList[0].playUrl;
          playerBox.playUrl = playUrl;
          player.stop();
          player.play(playerBox.authCode, playUrl, playerBox.currentTime);
          // unity.playRecord(playerBox, playerBox.playDate.curPlayTime, playerBox.indexPlay)
        } else {
          //播放器未初始化
          playerBox.fullPlay();
        }
      } else {
        var playUrl = playerBox.detailData.itemList[playerBox.indexPlay].vodList[0].playUrl
        var contentID = getParam('migu_play_url', playUrl);
        playerBox.hidePlayer();
        unifiedOrder(contentID);
      }
    } else {
      if (playerBox.indexPlay > 0 && playConfig.isforbid == '1') {
        // 黑名单，第二集不能看，不能跳订购
        getId('blacklist').style.display = 'block'
        return
      };
      if (playerBox.indexPlay > 0 && playConfig.isOrder != '1') {
        var playUrl = playerBox.detailData.itemList[playerBox.indexPlay].vodList[0].playUrl
        var contentID = getParam('migu_play_url', playUrl);
        playerBox.hidePlayer();
        unifiedOrder(contentID);
      } else {
        // var  playUrl = 'http://gslbserv.itv.cmvideo.cn/20190613160207909e229185c.ts?channel-id=yanhuasp&Contentid=1041000196&authCode=3a&stbId=005903FF000100606001C0132B043D08&usergroup=g29097100000&userToken=6a83ea9ccbeaef860d6149adf107314029pb';
        var playUrl = playerBox.detailData.itemList[playerBox.indexPlay].vodList[0].playUrl
        playerBox.playUrl = playUrl;
        player.stop();
        player.play(value.authCode, playUrl);
        // unity.playRecord(playerBox, playerBox.playDate.curPlayTime, playerBox.indexPlay)
      }
    }
  },
  up: function () { },
  down: function () { },
  left: function () {
    if (playerBox.playDate.curPlayTime == 0 || playerBox.playDate.curPlayTime == '') return
    // playerBox.playDate.curPlayTime
    playerBox.pauseStatus = 1;//暂停接收回调状态，
    playerBox.positionBar = Number(playerBox.playDate.curPlayTime) - playerBox.fastTime;
    if (playerBox.positionBar <= 0) {
      playerBox.playDate.curPlayTime = 0;
      playerBox.positionBar = 0;
    } else {
      playerBox.playDate.curPlayTime = playerBox.positionBar;
    }
    debounce(playerBox.updateBar, 200);
  },
  right: function () {
    if (playerBox.playDate.curPlayTime == 0 || playerBox.playDate.curPlayTime == '' || playerBox.status == 2 || playerBox.status == -2) return
    playerBox.pauseStatus = 1;
    playerBox.positionBar = Number(playerBox.playDate.curPlayTime) + playerBox.fastTime;
    if (playerBox.positionBar > playerBox.playDate.allTime) {
      playerBox.playDate.curPlayTime = playerBox.playDate.allTime
    } else {
      playerBox.playDate.curPlayTime = playerBox.positionBar;
    }
    console.log('快进到的时间' + playerBox.positionBar);
    //试看类型跳转订购
    if (playConfig.isOrder != "1" && playerBox.detailData.assetType == "Movie" && playerBox.positionBar >= 1000 * 60 * 10) {
      player.togglePlay('pause');
      orderBox.init();
    }

    debounce(playerBox.updateBar, 300);
  },
  enter: function () {
    console.log('playerBox.status----' + playerBox.status);
    if (playerBox.status == 1) {
      player.togglePlay('pause');
      playerBox.showPause();
    } else if (playerBox.status == 0) {
      player.togglePlay('resume');
      playerBox.hiddenPause();
    }
  },
  back: function () {
    // backBox.init();//挽留页
    backBox.goBack();
  },
  seekTime: function (to) {
    var currTime = Number(playerBox.playDate.curPlayTime) + playerBox.fastTime;
    // player.seekTime({ 'seekTime': currTime });
    playerBox.showBar();

  },
  onStart: function (res) {
    playerBox.pauseStatus = 0;
    // console.log('onStart-------------------' + JSON.stringify(res))
    // this.playDate = res;
  },
  onPlay: function (res) {
    // playerBox.hiddenBar();//
    getId('footerPlayer').style.visibility = "hidden";
    getId('viode_name').style.visibility = "hidden";
    getId('pause').style.visibility = "hidden";
    playerBox.playDate = res;
    playerBox.initPlay();
    playerBox.status = 1;
    console.log('onPlay-------------------' + JSON.stringify(res))
  },
  onPause: function (res) {
    playerBox.status = 0;
    console.log('onPause-------------------' + JSON.stringify(res))
  },
  onResume: function (res) {
    playerBox.status = 1;
    console.log('onResume-------------------' + JSON.stringify(res))
  },
  onStop: function (res) {
    playerBox.status = 0;
    console.log('onStop-------------------' + JSON.stringify(res))
  },
  onCompleted: function (res) {
    playerBox.pauseStatus = 1;
    // this.playDate = res;
    playerBox.status = 2;
    getId('pause').style.visibility = "hidden";
    getId('viode_name').style.visibility = "hidden";
    getId('footerPlayer').style.visibility = "hidden";
    playerBox.playDate.curPlayTime = 0;
    //播放完毕操作
    console.log('onCompleted-------------------' + JSON.stringify(res));
    try {
      commonParams.asset_id = playerBox.detailData.assetId;
      commonParams.item_id = playerBox.detailData.itemList[playerBox.indexPlay].itemId
      commonParams.qb_datetime = $.cookie('qb_datetime')
      commonParams.zb_datetime = (new Date()).valueOf() + ''
      commonParams.time = playerBox.playDate.curPlayTime
      commonParams.ep = playerBox.detailData.episodes
      commonParams.fee = '1'
      commonParams.isFullScreen = '0'
      commonParams.pos_id = $.cookie('pos_id')
      commonParams.recmd_id = $.cookie('recmd_id')
      commonParams.parent_page_type = '0301'
      commonParams.parent_page_id = playerBox.detailData.assetId
      if (playerBox.indexPlay > 0) {
        commonParams.fee = '2'
      }
      bi.vod(commonParams)
    } catch (e) {
      console.log('错误信息' + e)
    }
    this.playNext('next');
  },
  onError: function (res) {
    this.playDate = null;
    playerBox.status = 3;
    console.log('onError-------------------' + JSON.stringify(res));
    setTimeout(function () {
      toast(JSON.stringify(res) + '播放失败，三秒后自动退出');
      backBox.goBack();
    }, 3000);
  },
  onScreenChange: function (res) {
    console.log('onScreenChange-------------------' + JSON.stringify(res))
  },
  onBufferingStart: function (res) {
    // playerBox.status = -1;
    console.log('onBufferingStart-------------------' + JSON.stringify(res))
    getId('playLoading').style.display = 'block';
  },
  onBufferfinish: function (res) {
    console.log('onBufferfinish-------------------' + JSON.stringify(res))
    getId('playLoading').style.display = 'none';
  },
  onProgress: function (res) {
    playerBox.uploadPlayStatus(res);
    //电影类型跳转订购
    if (playConfig.isOrder != "1" && playerBox.detailData.assetType == "Movie" && res.curPlayTime >= 1000 * 60 * 10) {
      player.togglePlay('pause');
      orderBox.init();
    }
    console.log('onProgress-------------------' + JSON.stringify(res));
  },
}
// areaObj = playerBox
//试看完毕，订购确认框
var orderBox = {
  itemNo: 0,
  init: function () {
    if (playerBox.isShowTrial == false) {
      playerBox.isShowTrial = true;
      $("#yqOk").addClass("hover")
      getId('cardFee').style.display = 'block';
      areaObj = orderBox;
    }

  },
  up: function () { },
  down: function () { },
  left: function () {
    if (this.itemNo == 0) return
    $("#yqCancel").removeClass("hover")
    this.itemNo = 0;
    $("#yqOk").addClass("hover")
  },
  right: function () {
    if (this.itemNo == 1) return
    $("#yqOk").removeClass("hover")
    this.itemNo = 1;
    $("#yqCancel").addClass("hover")
  },
  enter: function () {
    getId('cardFee').style.display = 'none';
    $("#yqCancel").removeClass("hover")
    if (this.itemNo == 1) {
      setTimeout(function () {
        //避免高频率操作导致试看弹框反复调用
        playerBox.isShowTrial = false;
        areaObj = playerBox;
      }, 1000)
      player.seekTime({ 'seekTime': 0 });
      player.togglePlay('resume');
    } else {
      playerBox.isShowTrial = false;
      player.stop();
      var playUrl = playerBox.detailData.itemList[playerBox.indexPlay].vodList[0].playUrl
      var contentID = getParam('migu_play_url', playUrl);
      unifiedOrder(contentID);
    }
  },
  back: function () {

  },
}
//退出挽留框(未使用)
var backBox = {
  isExit: false, //退出界面
  itemNo: 1,
  init: function () {
    areaObj = backBox;
    getId('quit').style.display = 'block';
    if (this.itemNo == 1) {
      $('#nav1_2').css("background-image", "url(../public/image_video/yq-btnBg_focus.png)");
    } else {
      $('#nav1_1').css("background-image", "url(../public/image_video/yq-btnBg_focus.png)");
    }
  },
  up: function () { },
  down: function () { },
  left: function () {
    if (this.itemNo == 0) return
    this.itemNo = 0;
    $('#nav1_2').css("background-image", "url(../public/image_video/yq-btnBg.png)")
    $('#nav1_1').css("background-image", "url(../public/image_video/yq-btnBg_focus.png)")
  },
  right: function () {
    if (this.itemNo == 1) return
    this.itemNo = 1;
    $('#nav1_1').css("background-image", "url(../public/image_video/yq-btnBg.png)")
    $('#nav1_2').css("background-image", "url(../public/image_video/yq-btnBg_focus.png)")
  },
  enter: function () {
    if (this.itemNo == 1) {
      this.back();
    } else {
      this.goBack();
    }
  },
  back: function () {
    $('#nav1_1').css("background-image", "url(../public/image_video/yq-btnBg.png)")
    getId('quit').style.display = 'none';
    this.itemNo = 1;
    areaObj = playerBox;
  },
  goBack: function () {
    unity.playRecord(playerBox, playerBox.playDate.curPlayTime, playerBox.indexPlay);
    playerBox.hidePlayer();
    window.location.replace(playerBox.returnUrl)
    try {
      //点播调出详情页
      var chargeType = 0;
      if (playerBox.indexPlay > 0) {
        chargeType = 1;
      }
      var params = {
        type: 4,
        content: {
          type: 5,
          seriesID: playerBox.detailData.assetId,
          programIdID: getParam('programId', playerBox.detailData.itemList[playerBox.indexPlay].vodList[0].playUrl),
          chargeType: chargeType,
          resolution: 0,
          moveLength: playerBox.playDate.allTime,
          location: playerBox.playDate.curPlayTime,
          playID: getParam('migu_play_url', playerBox.detailData.itemList[playerBox.indexPlay].vodList[0].playUrl)
        }
      }
      if (playerBox.playDate.curPlayTime > 0) {
        stat(params);
      }
    } catch (e) {
      console.log(e);
    }
    try {
      //点播调出选集页
      var chargeType = 0;
      if (playerBox.indexPlay > 0) {
        chargeType = 1;
      }
      var params = {
        type: 4,
        content: {
          type: 6,
          seriesID: playerBox.detailData.assetId,
          programIdID: getParam('programId', playerBox.detailData.itemList[playerBox.indexPlay].vodList[0].playUrl),
          chargeType: chargeType,
          resolution: 0,
          moveLength: playerBox.playDate.allTime,
          location: playerBox.playDate.curPlayTime,
          playID: getParam('migu_play_url', playerBox.detailData.itemList[playerBox.indexPlay].vodList[0].playUrl)
        }

      }
      if (playerBox.playDate.curPlayTime > 0) {
        stat(params);
      }
    } catch (e) {
      console.log(e);
    }
  }
}
window.onload = function () {
  playerBox.initData();
  playerBox.getData();
};
//生命周期回调，避免设置，首页按键切出去切回来播放器bug
function registerLifecycleCallback(res) {
  console.log('registerLifecycleCallback' + JSON.stringify(res));
  try {
    if (res.status == 3 || res.status == 4) {
      var time = Math.floor(playerBox.playDate.curPlayTime / 1000) || 0
      player.togglePlay('pause');
      var data = {
        playUrl: playerBox.playUrl,
        time: time
      }
      setStorage('xdf-payTime', JSON.stringify(data));
    } else if (res.status == 1) {
      player.togglePlay('resume');
      var his = getStorage('xdf-payTime');
      console.log('xdf-payTime-----' + his);
      his = JSON.parse('his');
      player.stop();
      player.play(value.authCode, his.playUrl, his.time);
      // player.togglePlay('resume');
    }
  } catch (err) {

  }

}
submitPrompt('registerLifecycleCallback', { return: 'registerLifecycleCallback' });


onKeyPress = function (keyCode) {
  if (getId('blacklist').style.display == 'block') {
    if (keyCode == 'back') {
      getId('blacklist').style.display = 'none';
    }
    return;
  }
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
      areaObj.back();
      break;
    case "enter":
      areaObj.enter();
      break;
    case "home":
      areaObj.home();
      break;
    case "menu":
  }
};
document.onkeydown = grepEvent;