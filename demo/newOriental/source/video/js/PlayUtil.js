if (playConfig.stbType != "p30" && getId('playiFrame')) {
  document.body.removeChild(getId('playiFrame'));
}
var isClick = false;//避免多次调用play；
//p60事件通知
var mp = null;
var rtsp = "";
function onEvent(event) {
  var code = event.type;
  var type = event.subtype;
  if (code == 0) {
    if (type == 0) {
      if (!mp) return 0;
      // if (getId("imgBig")) {
      //   getId("imgBig").style.display = 'none';
      // }
      mixplayer.playUrl(mp, rtsp, '0'); // 点播播放
      // totalTime = 250;
      // statisticsDB(2,vodId[playPos],1,totalTime,'首页视频窗-'+playPos+'-'+vodId[playPos],30,function(){});
      // mixplayer.resize(mp, 296, 183, 454, 294);
      // toast('0-0')
    } else if (type == 1) {
      // totalTime = mixplayer.getDuration(mp);
      // mixplayer.resize(mp, 296, 183, 454, 294);
      // toast('0-1')
    } else if (type == 2) {
      getId("imgBig").style.display = 'block';
      if (Cookies.get('strCom')) {
        var strJ = Cookies.get('strCom');
        bi.vod(strJ);
        setTimeout(function () {
          Cookies.set('qb_datetime', (new Date()).valueOf(), { path: '/' });
          Cookies.set('isFullScreen', '0', { path: '/' });
        }, 10)
      }
      if (mp) {
        mixplayer.stop(mp); // 停止
        mixplayer.destroy(mp); // 销毁
        mp = null;
      }
      // playPos++;
      // if (playPos >= vodId.length) {
      //   playPos = 0;
      // }
      // play_ajax(vodId[playPos]);
      // });
    }
  }
}

//p30事件通知
var vodId = '';
function eventHandler(eventObj, type) {
  switch (eventObj.code) {
    case "VOD_PREPAREPLAY_SUCCESS"://开始播放
      media.AV.play();
      break;
    case "EIS_VOD_PROGRAM_END"://重新播放
      getId("imgBig").style.display = 'block';
      if (Cookies.get('strCom')) {
        var strJ = Cookies.get('strCom');
        bi.vod(strJ);
        setTimeout(function () {
          Cookies.set('qb_datetime', (new Date()).valueOf(), { path: '/' });
          Cookies.set('isFullScreen', '0', { path: '/' });
        }, 10)
      }
      // play_ajax(vodId);
      break;
    default:
      return 1;
      break;
  }
  return 0;
}


function delParam(urlString, paramKey) {
  var url = urlString;    //页面url
  var urlParam = urlString.split("?")[1];   //页面参数
  var beforeUrl = url.substr(0, url.indexOf("?"));   //页面主地址（参数之前地址）
  var nextUrl = "";

  var arr = new Array();
  if (urlParam) {
    var urlParamArr = urlParam.split("&"); //将参数按照&符分成数组
    for (var i = 0; i < urlParamArr.length; i++) {
      var paramArr = urlParamArr[i].split("="); //将参数键，值拆开
      //如果键雨要删除的不一致，则加入到参数中
      if (paramArr[0] != paramKey) {
        arr.push(urlParamArr[i]);
      }
    }
  }
  if (arr.length > 0) {
    nextUrl = "?" + arr.join("&");
  }
  url = beforeUrl + nextUrl;
  return url;
}
function play(obj, backFunction) {
  destroy();

  playConfig.isOrder = Cookies.get('isOrder') || 0;

  // //临时调用
  // if (getUserId() == "9950000002587829") {
  //   playConfig.isOrder = 1;
  //   Cookies.set('isOrder', "1", {
  //     path: '/'
  //   })
  // }
  // if(getUserId() == '9950000001850737' || getUserId() == '9950000000252746'){
  //   // 卡号 9950000001850737开白名单无效果，直接写死，12-1日到期
  //   // 9950000000252746 12-03到期
  // }else{
  //   if (obj.index > 0 && playConfig.isOrder == 0) {
  //     createOrder();//鉴权失败跳转订购
  //     backFunction('failure')
  //     return
  //   }
  // }
  if (obj.fee == 2 && playConfig.isOrder == 0) {
    createOrder();//鉴权失败跳转订购
    backFunction('failure')
    return
  }
  if (getId("imgBig")) {
    getId("imgBig").style.display = 'none';
  }

  // categoryMap.put("电视剧", "10000100000000090000000000111371");
  // categoryMap.put("电影", "10000100000000090000000000111372");
  // categoryMap.put("少儿", "10000100000000090000000000111373");
  // categoryMap.put("动漫", "10000100000000090000000000111374");
  // categoryMap.put("纪录片", "10000100000000090000000000111375");
  // categoryMap.put("体育", "10000100000000090000000000111376");
  // categoryMap.put("电竞", "10000100000000090000000000111394");
  // categoryMap.put("综艺", "10000100000000090000000000111395");
  // categoryMap.put("音乐", "10000100000000090000000000111396");
  // categoryMap.put("曲艺", "10000100000000090000000000111397");
  // categoryMap.put("教育", "10000100000000090000000000111398");
  // categoryMap.put("短视频", "10000100000000090000000000111399");
  // categoryMap.put("测试", "10000100000000090000000000109401");
  if (isClick) return//规避多次点击
  isClick = true;
  backFunction('success')
  if (playConfig.stbType == "3.0" || playConfig.stbType == "p30") {
    // 参数
    var typeId = obj.typeId;
    vodId = obj.vod_id;
    var baseFlag = 0;
    var epgFlag = 0; //2：按次点播；0：包月
    var playType = obj.flag;//0：电视剧 1：电影 2：综艺 3：其他
    var idType = vodId.length > 7 ? 'FSN' : '';
    var backUrl = window.location.href;
    if (backUrl.indexOf('?') == -1) {
      backUrl = window.location.href + '?sour=bigScreen';
    } else {
      backUrl = window.location.href + '&sour=bigScreen';
    }
    //去除订购信息
    if (backUrl.indexOf("code") && backUrl.indexOf("code") != -1) {
      backUrl = backUrl.split("?")[0]
    }


    //焦点记忆
    // if (_this.data.source_id != "") {
    //   //订购回到播放原位续播
    //   appBackUrl = _this.delParam(appBackUrl, "display_id");
    //   appBackUrl = appBackUrl + "&display_id=" + btn.current.getAttribute("data-display_id");
    // }

    // backUrl = delParam(backUrl, "code");
    // backUrl = delParam(backUrl, "msg");
    // backUrl = encodeURIComponent(backUrl);
    // var url = playConfig.playUrl + typeId + "&baseFlag=" + baseFlag + "&vodId=" + vodId + "&epgFlag=" + epgFlag + "&playType=" + playType + "&idType=" + idType + "&appBackUrl=" + backUrl;
    var url = playConfig.playUrl + typeId + "&playType=" + playType + "&vodId=" + vodId + "&idType=" + idType + "&appBackUrl=" + backUrl;
    if (playConfig.stbType != "p30") {
      var iframe = document.createElement("iframe"); //创建新的<iframe> 元素
      iframe.setAttribute("id", "playiFrame");
      document.body.appendChild(iframe);
    }
    try {
      document.getElementById("playiFrame").src = iPanel.eventFrame.pre_epg_url + url;
    } catch (e) {
      // toast(e);
    }
  } else if (playConfig.stbType == "p60") {
    var title = obj.name;
    vodId = obj.vod_id;
    var flag = obj.flag;
    var typeId = obj.typeId;
    var index = obj.index + 1;
    getRTSP(title, vodId, typeId, flag, index);
  }
}
function playMin(obj) {
  destroy();
  // 小屏播放存起播时间
  Cookies.set('qb_datetime', (new Date()).valueOf(), { path: '/' });
  Cookies.set('isFullScreen', '1', { path: '/' });
  if (playConfig.stbType == "3.0" || playConfig.stbType == "p30") {
    play30Mix(obj, 60, 65, 555, 315);
  } else if (playConfig.stbType == "p60") {
    playP60Mix(obj, 0.045, 0.0874, 0.44, 0.44);
  }
}

function play30Mix(obj, left, top, width, height) {
  vodId = obj.vod_id;
  var typeId = -1;// 小屏幕传-1 obj.typeId
  // vodId = id || "024PITEM040006996758zjyh";//自己的//"201904222121395266XERS"别人的媒资
  var baseFlag = 0;
  var epgFlag = 0; //2：按次点播；0：包月
  var playType = obj.flag;//0：电视剧 1：电影 2：综艺 3：其他
  var idType = vodId.length > 7 ? 'FSN' : '';
  // var getMovieRtspUrl = iPanel.eventFrame.pre_epg_url + "/defaultHD/en/go_authorization.jsp?playType=" + playType + "&progId=" + vodId + "&contentType=0&business=1&baseFlag=" + baseFlag;
  // /EPG/jsp/defaultHD/en/go_authorization.jsp?playType=11&progId=024PITEM040006832639zjyh&typeId=-1&contentType=0&business=1&baseFlag=0&idType=FSN
  var getMovieRtspUrl = iPanel.eventFrame.pre_epg_url + "/defaultHD/en/go_authorization.jsp?playType=" + playType + "&progId=" + vodId + "&typeId=" + typeId + "&contentType=0&business=1&baseFlag=0&idType=" + idType;
  var XHR = new XMLHttpRequest();
  XHR.onreadystatechange = function () {
    if (XHR.readyState == 4) {
      if (XHR.status == 200) {
        var json = eval("(" + XHR.responseText + ")");
        rtsp = json.playUrl.split("^")[4];
        media.video.setPosition(left, top, width, height);
        media.AV.open(rtsp, "VOD");
      } else {
        XHR.abort();
      }
    }
  }
  XHR.open("GET", getMovieRtspUrl, true);
  XHR.send(null);
}
function playP60Mix(obj, left, top, width, height) {
  var typeId = obj.typeId;
  var flag = obj.flag;
  vod_id = obj.vod_id;
  //var url = urlJoin('http://192.168.14.113:8082' + '/EPG/jsp/defaultHD/en/go_auth.jsp', joinStr(getObject(vod_id, typeId, flag)));
  var url = urlJoin(sysmisc.getEnv('epg_address', '') + '/EPG/jsp/defaultHD/en/go_auth.jsp', joinStr(getObject(vod_id, typeId, flag)));
  var cookie = '[{"key": "cookie", "value":"' + "JSESSIONID=" + sysmisc.getEnv('sessionid', '') + '"}]';
  bridge.ajax('post', url, 'text/xml', cookie, '', function (resp) {
    var jsonStr = resp.trim().replace(/[\r\n]/g, "");
    if (/\<html\>/g.test(jsonStr)) {
      sysmisc.showToast('认证失效，请重启机顶盒！');
    } else {
      var json = JSON.parse(jsonStr);
      if (json.retCode == 0 && json.playFlag == 1 && json.playUrl != '') {
        //获取播放地址
        rtsp = json.playUrl.split("^")[4];
        // rtsp = rtsp.substring(0, rtsp.indexOf("?"));
        mp = mixplayer.create(left, top, width, height);
        // playermix_id = mixplayer.resize(playermix_id, left, top, width, height);
        //播放视屏
        var state = mixplayer.playUrl(playermix_id, playUrl, 0);
      } else if (json.retCode == '117571586') {
        createOrder();//弹出订购弹框
      } else {
        // toast(json.message);
        //sysmisc.showToast(json.message);
        //showTis(json.message);
      }
    }
  }, '')
}
function destroy() {
  try {
    if (playConfig.stbType == 'p60') {
      if (mp) {
        mixplayer.stop(mp); // 停止
        mixplayer.destroy(mp); // 销毁
        mp = null;
      }
    } else {
      DVB.stopAV(0);
      media.AV.close();
    }
  } catch (err) { }
}
