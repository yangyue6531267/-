/**
 * create:2019-10-22
 *
 * update:songxiz
 *
 */

// 播放、播放鉴权参数
var appId = '1fe3144ab9524ce';
var videoType = 'program';
var channelId = 'yanhuasp';
var videoParams = {};
var channelCode = '2626046001'
var appKey = '60adac342c13f6d6f08c3330ebe26ceb'
var playAuthCacllBack = null;//查看鉴权是否返回，无返回处理
/**
 * 未来播放器SDK对接
 * 
 * 1.设置播放器位置
 * 2.初始化状态回调函数
 * 3.显示播放器
 * 4.开始播放
*/

var player = function () { };

// 播放回调
function videoStateChange(res) {
  console.log('// 状态值改变的方法' + JSON.stringify(res));
  switch (res.tag) {
    case 'onStart':
      playerBox.onStart(res);
      break;
    case 'onPlay':
      playerBox.onPlay(res);
      break;
    case 'onPause':
      playerBox.onPause(res);
      break;
    case 'onResume':
      playerBox.onResume(res);
      break;
    case 'onStop':
      playerBox.onStop(res);
      break;
    case 'onCompleted':
      playerBox.onCompleted(res);
      break;
    case 'onError':
      playerBox.onError(res);
      break;
    case 'onScreenChange':
      playerBox.onScreenChange(res);
      break;
    case 'onBufferingStart':
      playerBox.onBufferingStart(res);
      break;
    case 'onBufferingFinish':
      playerBox.onBufferfinish(res);
      break;
    case 'onProgress':
      playerBox.onProgress(res);
      break;
    default:
      console.log('没有对应的方法');
  }
};

// 设置播放器位置
player.setDisplayerLocation = function (options) {
  if (judgeObj(options.x) == 'Number' &&
    judgeObj(options.y) == 'Number' &&
    judgeObj(options.w) == 'Number' &&
    judgeObj(options.h) == 'Number') {
    submitPrompt('setPlayerLocation', options);
  }
};

// 更新播放器位置
player.upPlayerLocation = function (options) {
  if (judgeObj(options.x) == 'Number' &&
    judgeObj(options.y) == 'Number' &&
    judgeObj(options.w) == 'Number' &&
    judgeObj(options.h) == 'Number') {
    submitPrompt('setPlayerLocation', options);
  }
};

// 显示隐藏播放器 ( key 为 hidePlayer 隐藏 key 为 showPlayer 是显示 )
// 隐藏播放器之前需要先停止播放器
player.toggleShow = function (key) {
  submitPrompt(key);
};

// player.play = function (authCode, str) {
player.play = function (authCode, str, time) {
  var file = getParam('file_name', str);
  var contentid = getParam('migu_play_url', str);
  var programId = getParam('programId', str);
  // 测试公网 播放串拼接
  var playUrl = 'http://gslbserv.itv.cmvideo.cn/' + file + '.ts?channel-id=' + channelId + '&Contentid=' + contentid + '&authCode=' + authCode + '&stbId=' + yh.stbId + '&usergroup=' + yh.userGroup + '&userToken=' + yh.token
  // 正式省份 播放串拼接
  // var playUrl = 'http://gslbserv.itv.cmvideo.cn/' + file + '.ts?channel-id=' + channelId + '&Contentid=' + contentid + '&authCode=' + authCode + '&stbId=' + yh.stbId + '&usergroup=g29097100000&userToken=' + yh.userToken



  // 	gslbserv.itv.cmvideo.cn：全局管控地址，固定值；
  // 	xxxxxx.ts：为文件名，注入报文中填写的；
  // 	channel-id：咪咕分配的；
  // 	Contentid：CDI报文中返回的，play-url字段的值；
  // 	authCode：防盗链信息，鉴权报文中返回，联调时未开启防盗链，未校验；
  // 	stbId：机顶盒框架获取，联调时未开启防盗链，未校验；
  // 	usergroup：机顶盒框架获取，联调时未开启防盗链，未校验；
  // 	Token：机顶盒框架获取，联调时未开启防盗链，未校验；




  console.log(playUrl);
  if (!time) {
    time = 0;
  }
  var url = 'cntv://sdk/playurl?playUrl=' + encodeURIComponent(playUrl) + '&checkType=program&programId=' + programId + '&duration=0'
  videoParams = {
    historyTime: 0,
    // playUrl: url,
    playUrl: encodeURIComponent(url)
  }
  // submitPrompt('play', videoParams);
  // 内容鉴权
  var playAuth = authUrl + '/audit/query?app_id=' + appId + '&id=' + programId + '&type=' + videoType
  console.log('playAuth-----' + playAuth)
  submitPrompt('getHttp', { 'httpUrl': encodeURIComponent(playAuth), return: 'getPlayAuth' });
  // 内容鉴权
  // ajax({
  //   type: "GET",
  //   url: authUrl + 'app_id=1fe3144ab9524ce&id=YANHUA00000000043PITEM0097000753&type=program',
  //   timeout: 2000,
  //   dataType: "json",
  //   success: function (res) {
  //     console.log('getPlayAuth------------' + JSON.stringify(res));
  //     // if (res.status == 0 && res.data.status = 'pass') {
  //     if (res.status == 0) {
  //       console.log('getPlayAuth------------play');
  //       submitPrompt('play', videoParams);
  //     } else {
  //       console.log('getPlayAuth------------该节目已下线');
  //       toast('该节目已下线');
  //     }
  //   },
  //   fail: function (error) {
  //     console.log('getPlayAuth------------该节目已下线');
  //     toast('该节目已下线');
  //     console.log(error);
  //   }
  // })
};

function getPlayAuth(res) {
  console.log('getPlayAuth------------' + JSON.stringify(res));
  if (res.status == 0 && res.data.status == 'pass') {
    submitPrompt('play', videoParams);
  } else {
    toast('该节目已下线');
  }

}
// 播放器初始化
player.initPlayer = function (options) {
  submitPrompt('initPlayer')
};

// 播放器暂停和续播( key 为 pause是暂停 key 为resume是续播 )
player.togglePlay = function (key) {
  submitPrompt(key);
};

// 播放器放大缩小
player.toggleFullScreen = function () {
  submitPrompt('toggleFullScreen');
}

// 播放器停止播放
player.stop = function () {
  submitPrompt('stop');
}

// 播放器快进快退
player.seekTime = function (options) {
  submitPrompt('seek', options);
}

player.setCallback = function (options) {
  for (var k in options) {
    videoOptions[k] = options[k];
  }
  window.videoStateChange = videoStateChange;
  submitPrompt('setCallBack', { return: 'videoStateChange' });
}


/**
未来广告SDK对接
*/
var adInfo = {
}
function adInfoFunc(parames) {
  console.log('adInfoFunc-----------' + JSON.stringify(parames))
  // 对接开屏(open)
  parames = JSON.stringify(parames);
  submitPrompt('adInfo', { jsonParam: parames, return: 'adInfoCallBack' });
}
function adInfoCallBack(res) {
  //   console.log('adInfo-----' + JSON.stringify(res));
  //   adInfo = res;
}

function adStatCallBack(res) {
  console.log('广告日志发送回调--------' + JSON.stringify(res))
};
/**
未来日志SDK对接
*/
