/**
 * create:2019-12-10
 *
 * update:songxiz
 *
 */

/**
 * 未来播放器SDK对接
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
player.play = function (str, time) {
  playerBox.playUrl = str;
  var file = getParam('file_name', str);
  var contentid = getParam('movieId', str);
  // var programId = getParam('programId', str);
  // 测试公网 播放串拼接
  // var playUrl = 'http://120.210.193.151:8006/120000000027/YANHUA00000000047MMVOD0006956131/20190724171104118aacc7516.ts?productid=BP8175&cpid=2019081318262220190813182622&stbModel=M101_SKYWORTH_0&stbMac=20:8B:37:CD:05:B3';
  var playUrl = playAddress + '/' + yh.cspid + '/' + contentid + '/' + file + '.ts?productid=' + yh.productId + '&cpid=' + yh.cpId + '&stbModel=' + yh.incremental + '&stbMac=' + yh.mac;
  if (!time) {
    time = 0;
  }
  console.log('playUrl---' + playUrl)
  var videoParams = {
    historyTime: 0,
    // playUrl: url,
    playUrl: encodeURIComponent(playUrl)
  }
  submitPrompt('play', videoParams);
};

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