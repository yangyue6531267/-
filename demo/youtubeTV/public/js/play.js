// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// $('#select_all_btn').bind('click',function(event){
//   $('input[type="checkbox"]').trigger('click');
//   });



// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player = null;
var uploadvid = 0;
var videoId = '';
window.onYouTubeIframeAPIReady = function (id) {
  // id = 'youtube://sdk/playurl?id=4SCzXR1AoDo';
  //youtube  onReady和接口都成功之后才能new player

  // if (id) {
  //   videoId = getParam('id', id);
  // }

  // videoId = '_rCjbTnqD-U'
  // videoId = 'b4UPdbhHfz8'
  // uploadvid++
  // if (uploadvid > 1 && videoId) {
  // uploadvid = 0;
  player = new YT.Player('imgBig', {
    height: '1080',
    width: '1440',
    playerVars: {
      // 'mute': 0,
      'autoplay': 0,
      'controls': 0,//是否显示播放器控件
      'rel': 0,//0推荐同频道，1推荐相关
      'fs': 0,//是否显示全屏按钮
      'modestbranding': 0,//	是否显示 YouTube 徽标
      'vq': 'hd1080',
      'hd': 1,
    },
    videoId: '',
    events: {
      'onReady': onPlayerReady,
      'onPlaybackQualityChange': onPlayerPlaybackQualityChange,
      'onStateChange': onPlayerStateChange,
      'onError': onPlayerError
    }
  });
  // videoId = '';
  // }
}

function onPlayerPlaybackQualityChange(event) {
}
function onPlayerError(event) {
  console.log('onPlayerError')
  console.log(event)
  if (event.data == 2 || event.data == 5 || event.data == 100
    || event.data == 101 || event.data == 150) {
    getId('loginImg').style.visibility = "hidden";
    console.log('视频无法播放');
  }
}


// 4. The API will call this function when the video player is ready.
function onPlayerReady(event, playList) {
  // player.getVideoLoadedFraction(0.1)//设置缓冲
  // player.mute();
  player.setSize(678, 382);
  getId('imgBig').style.opacity = 1;
  addClass(getId('loginImg'), 'img-big');
  getId('loginImg').style.visibility = "visible";
  event.target.playVideo();
  console.log('onPlayerReady');
  loadVideoById(videoId);
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
// var done = false;
function onPlayerStateChange(event) {
  console.log(event)

  playClass.status = event.data;
  // - 1 – 未开始 0 – 已结束 1 – 正在播放 2 – 已暂停 3 – 正在缓冲 5 – 已插入视频
  if (event.data == 1) {
    if (document.documentElement.scrollTop >= 360) {
      //避免播放器未初始化，用户上下切换之后失焦
      minPauseVideo();
      return
    }

    getId('loginImg').style.visibility = "hidden";
    if (!playClass.timer) {
      console.log();
      // minPlayVideo();
      playClass.init();
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    }
    playClass.uploadUI();
  } else if (event.data == 0) {
    //已结束
    if (playClass.timer) {
      clearInterval(playClass.timer);
      playClass.timer = null;
    }
    playClass.currTime = 0;
    nextPlay();
  } else if (event.data == 3) {
  } else if (event.data == 2) {
    if (playClass.timer) {
      clearInterval(playClass.timer);
      playClass.timer = null;
    }
    // player.playVideo();
    // console.log(document.querySelector('.ytp-pause-overlay'));
    // document.querySelector('.ytp-pause-overlay').style.display = 'none';
  } else if (event.data == -1) {
    // console.log('未开始');

  }
}

var playClass = {
  isfullPlay: false,
  status: -1,// - 1 – 未开始 0 – 已结束 1 – 正在播放 2 – 已暂停 3 – 正在缓冲 5 – 已插入视频
  totalTime: 0,//总时长
  // minuteTime: 0,//ui显示总时长（分秒）
  currTime: 0,//当前播放时间
  fastTime: 30,////快进时间 (秒)
  currVolume: 100, //音量
  timer: null,
  init: function () { //初步渲染
    playClass.totalTime = player.getDuration();
    // playClass.minuteTime = secondToDate(playClass.totalTime)
    playClass.currVolume = getVolume();
    playClass.fastTime = playClass.totalTime / 50
  },
  uploadUI: function () {
    getId('totalTime').innerHTML = secondToDate(playClass.totalTime);
    // playClass.currTime = getCurrentTime();
    // setInterval(function () {
    //   playClass.currTime++;
    // }, 1000)
    if (player.timer) { clearInterval(player.timer) }
    playClass.timer = setInterval(function () {
      playClass.currTime = getCurrentTime();
      // console.log((playClass.currTime * 10 + 2) / 10)
      // playClass.currTime = (playClass.currTime * 10 + 2) / 10;
      getId('currTime').innerHTML = secondToDate(playClass.currTime);
      getId('currBox').innerHTML = secondToDate(playClass.currTime);
      var currProgress = playClass.currTime / playClass.totalTime * 92;
      getId('currBar').style.width = currProgress + "%";
      getId('currBox').style.left = currProgress + "%";
      // if (playClass.currTime + 2 >= playClass.totalTime) {
      //   console.log(1);
      //   nextPlay();
      //   clearInterval(playClass.timer);
      // }
    }, 200)
  },
  hidden: function () {
    getId('footerPlayer').style.visibility = "visible";
    if (playClass.status == 2) return
    debounce(hiddenBar, 3000);
  },
  up: function () {
    // playClass.currVolume = getVolume();
    // if (playClass.currVolume < 100) {
    //   toast('音量' + (playClass.currVolume + 5));
    // } else {
    //   toast('音量' + (playClass.currVolume));
    // }
    // if (playClass.currVolume > 95) { return }
    // playClass.currVolume += 5
    // console.log('当前音量--' + playClass.currVolume)
    // setVolume(playClass.currVolume)
  },
  down: function () {
    // playClass.currVolume = getVolume();
    // if (playClass.currVolume > 0) {
    //   toast('音量' + (playClass.currVolume - 5));
    // } else {
    //   toast('音量' + (playClass.currVolume));
    // }
    // if (playClass.currVolume < 5) { return }
    // playClass.currVolume -= 5
    // console.log('当前音量--' + playClass.currVolume)
    // setVolume(playClass.currVolume)
  },
  left: function () {
    if (playClass.currTime == 0) return
    if (playClass.currTime - playClass.fastTime < 0) {
      playClass.currTime = 0;
    } else {
      playClass.currTime -= playClass.fastTime;
    }
    seekTo(playClass.currTime, true)
    playClass.hidden();
  },
  right: function () {
    if (playClass.currTime + playClass.fastTime > playClass.totalTime) {
      playClass.currTime = playClass.totalTime
    } else {
      playClass.currTime += playClass.fastTime;
    }
    seekTo(playClass.currTime, true)
    playClass.hidden();
  },
  enter: function () {
    if (playClass.status == 1) {
      pauseVideo()
    } else if (playClass.status == 2 || playClass.status == 5) {
      playVideo()
    }
  }
}

// 播放
function playVideo() {
  player.playVideo();
  getId('pause').style.visibility = "hidden";
  debounce(hiddenBar, 3000);
}
function minPlayVideo() {
  player.playVideo();
  getId('loginImg').style.visibility = "hidden";
  if (playClass.timer) {
    clearInterval(playClass.timer);
    playClass.timer = null;
  }
}
function minPauseVideo() {
  if (playClass.status != -1) {
    player.pauseVideo();
  }
  getId('loginImg').style.visibility = "visible";
}
//暂停
function pauseVideo() {
  player.pauseVideo();
  clearInterval(playClass.timer);
  playClass.timer = null;
  getId('pause').style.visibility = "visible";
  getId('footerPlayer').style.visibility = "visible";
}

//videoId 视频id
// startSeconds 接受浮点值/整数值。如果指定该可选参数，则视频会从距离指定时间最近的关键帧开始播放。
// 可选参数 endSeconds 接受浮点值/整数值。如果指定该可选参数，则视频会在指定的时间停止播放。
// 可选参数 suggestedQuality 用于指定视频的建议播放质量。有关播放质量的更多信息，请参见 setPlaybackQuality 函数的定义。
function loadVideoById(id, startSeconds, endSeconds, suggestedQuality) {
  // player.loadVideoById(videoId, startSeconds, endSeconds, suggestedQuality)
  playClass.currTime = 0;
  if (!startSeconds) { startSeconds = 0 }
  getId('loginImg').style.visibility = "visible";
  id = getParam('id', id);
  player.loadVideoById({ 'videoId': id, 'startSeconds': startSeconds, 'suggestedQuality': 'hd1080' })
}

//下一集
function nextVideo() {
  player.nextVideo()
}
//上一级
function previousVideo() {
  player.previousVideo()
}
//设置全屏
function fullPlay() {
  playClass.isfullPlay = true;
  playVideo();
  player.setSize(1280, 720);
  player.setPlaybackQuality('hd1080');
  addClass(getId('imgBig'), 'full-play');
}

function nextPlay() {
  // seekTo(playClass.totalTime - 4, false);
  if (indexSingle && indexSingle.data.length > 1 && indexSingle.indexPlay + 2 < indexSingle.data.length) {
    indexSingle.itemNo++;
    indexSingle.indexPlay = indexSingle.itemNo;
    indexSingle.initPayActive();
    indexSingle.uploadIndexPay();
    playMin();
  } else {
    playClass.isfullPlay = false;
    player.setSize(640, 360);
    clearVideo();
    removeClass(getId('imgBig'), 'full-play');
    getId('footerPlayer').style.visibility = "hidden";
    areaObj = topContent;
    getId('loginImg').style.visibility = "visible";
    playMin();
  }
}

// 设置小屏
function smillPlay() {
  playClass.isfullPlay = false;
  player.setSize(640, 360);
  clearInterval(playClass.timer);
  playClass.timer = null;
  playVideo()
  removeClass(getId('imgBig'), 'full-play');
  getId('footerPlayer').style.visibility = "hidden";
  areaObj = topContent;
}

//停止和取消加载当前视频。
function stopVideo() {
  player.stopVideo()
}
//清除播放器
function clearVideo() {
  player.clearVideo()
}
//定位到视频的指定时间
// seconds用于标识播放器快进的单位时间
// allowSeekAhead 参数用于确定在 seconds 参数指定的时间超出了当前已缓冲的视频数据对应的播放时间时，播放器是否向服务器发送新的请求
function seekTo(seconds, allowSeekAhead) {
  if (playClass.timer) {
    clearInterval(playClass.timer);
    playClass.timer = null;
  }
  //快进渲染进度条
  player.timer = setInterval(function () {
    getId('currTime').innerHTML = secondToDate(playClass.currTime);
    getId('currBox').innerHTML = secondToDate(playClass.currTime);
    var currProgress = playClass.currTime / playClass.totalTime * 92;
    getId('currBar').style.width = currProgress + "%";
    getId('currBox').style.left = currProgress + "%";
  }, 200)

  player.seekTo(seconds, allowSeekAhead)
}
//使播放器静音
function muteVideo() {
  player.mute()
}
//取消静音
function unMuteVideo() {
  player.unMute()
}
//返回播放器的当前音量
function getVolume() {
  return player.getVolume()
}
//设置音量
function setVolume(num) {
  player.setVolume(num)
}
//播放器的状-1 – 未开始 0 – 已结束 1 – 正在播放 2 – 已暂停 3 – 正在缓冲 5 – 已插入视频
function getPlayerState() {
  return player.getPlayerState()
}

//返回视频已播放的时长（以秒为单位）
function getCurrentTime() {
  return player.getCurrentTime()
}
//返回当前已加载/正在播放的视频的
function getVideoUrl() {
  return player.getVideoUrl()
}
//返回当前已加载/正在播放的视频的嵌入代码。
function getVideoEmbedCode() {
  return player.getVideoEmbedCode()
}
//按当前顺序返回播放列表中视频ID的数组
function getPlaylist() {
  player.getPlaylist()
}
//当前正在播放的播放列表中视频的索引
function getPlaylistIndex() {
  return player.getPlaylistIndex()
}
//移除包含播放器的 <iframe>。
function destroy() {
  player.destroy()
}
function hiddenBar() {
  if (getPlayerState() == 2) return
  getId('footerPlayer').style.visibility = "hidden";
}
var timeout = null;
function debounce(func, wait) {
  // return function () {
  var context = this;
  var args = arguments;
  if (timeout) clearTimeout(timeout);
  // timeout = setTimeout(func, wait);
  timeout = setTimeout(function () {
    func.apply(context, args)
  }, wait);
  // }
}
