/**
 * create:2019-10-22
 *
 * update:songxiz
 *
 */
console.log()
// 播放、播放鉴权参数
var videoType = 'program';
var channelId = 'yanhuasp';
var videoParams = {};
var authUrl = "http://ucas.a157.ottcn.com:80"; //未来点播鉴权地址 
/**
 * 未来播放器SDK对接
 * 
 * 
 * 1.设置播放器位置
 * 2.初始化状态回调函数
 * 3.显示播放器
 * 4.开始播放
*/

var player = function () { };

// ***************华为***************************************************************************************************************************************************************

//播放地址
//调度接口
function getPlayUrl(){
  var bofangurl = yh.epgUrl + "/EPG/interEpg/user/default/authorize";
  console.log(bofangurl);
  console.log("bofangurl");
  var header={
    "Content-Type":"application/json",
    "Authorization": yh.token, 
  }
// var getcid = "" ; //= getStorage('getcidStorage');
  var resdata ;
  var commoncid ;
//通过判断是否存
  if (pageassetType == "Series"){ //getStorage("seriesresdata")
    var seriesresdata = JSON.parse(getStorage("seriesresdata")) ;
    if( seriesresdata.assetType == "Series"){
      console.log(seriesresdata.assetType)
      resdata = seriesresdata
    }else{
      return
    }
  }if( pageassetType == "Column" ){//综艺
    var columnresdata = JSON.parse(getStorage("seriesresdata")) ;
    if( columnresdata.assetType == "Column"){
      console.log(columnresdata.assetType)
      resdata = columnresdata
    }else{
      return
    }
  }if(pageassetType == "Movie"){//getStorage("moveresdata")
    var moveresdata = JSON.parse(getStorage("moveresdata"));
    if( moveresdata.assetType == "Movie"){
      console.log(moveresdata.assetType )
      resdata = moveresdata
    }else{
      return
    }
  }
  console.log("resdata-----")
  console.log(resdata.assetType);
  console.log("resdata.assetType--类型----");
//判断res.data.assetType类型
  if(resdata.assetType == "Movie"){
  //  var resdata = getStorage("moveresdata");console.log(resdata);console.log("resdata电影------")
//      getcid = getStorage('getcidStorage');
    console.log(getcid) //电影页面定义的全局getcid
    commoncid = getcid
    console.log("获取电影cid")
  }if(resdata.assetType == "Series"){
    resdata = JSON.parse(getStorage("seriesresdata"));console.log(resdata);console.log("resdata电视剧------"); //覆盖赋电视剧resdata
    //seriesDetail.js---待续---点击集数触发事件传参子集cid
    console.log("获取电视剧itemList索引");
    console.log(indexSingle.itemNo)
    commoncid = resdata.itemList[indexSingle.itemNo].vodList[0].playUrl.split("icntv/")[1]
    console.log(commoncid)
    console.log('获取电视剧commoncid')
  }
  if(resdata.assetType == "Column"){ //综艺columnresdata
    resdata = JSON.parse(getStorage("seriesresdata"));console.log(resdata);console.log("resdata电视剧------"); //覆盖赋电视剧resdata
    console.log("获取综艺itemList索引");
    console.log(indexSingle.itemNo);
    commoncid = resdata.itemList[indexSingle.itemNo].vodList[0].playUrl.split("icntv/")[1]

  }
  //body
  var playjson={
    "businessType":"1",
    "cid": commoncid, //p_BJYSTENCOS00000000000100917440
    "contentType":"0",
    "playType":"1",
    "tid":"-1",
    "idflag":"1"
  }
  playjson = JSON.stringify(playjson)
  header = JSON.stringify(header)
  console.log("playjson——");
  console.log(playjson)
  console.log("header");
  console.log(header);
  submitPrompt("postHttp",{ 'httpUrl': encodeURIComponent(bofangurl) ,'header': header , 'body': playjson , return: 'getPlayUrlCallback' })
}
function getPlayUrlCallback(res){
  console.log(JSON.stringify(res))
  console.log("getbofangurl")
  var hwbfurl=res.urls[0].playurl;
  console.log(hwbfurl);
  var resdata = {};
  var programId = '';
  var wlst="YANHUA00000000043PITEM";
  function PrefixZero(num, n) {
    return (Array(n).join(0) + num).slice(-n);
  }
/////////////
  if (pageassetType == "Series"){
    var seriesresdata = JSON.parse(getStorage("seriesresdata")) ;
    console.log(seriesresdata)
    resdata = seriesresdata
  }if(pageassetType == "Movie" ){
    var moveresdata = JSON.parse(getStorage("moveresdata"));
    console.log(moveresdata)
    resdata = moveresdata
  }if(pageassetType == "Column"){
    var columnresdata = JSON.parse(getStorage("seriesresdata")) ;
    console.log(columnresdata)
    resdata = columnresdata
  }
  console.log(resdata);
/////////////
  if(resdata.assetType == "Movie"){
    console.log("resdata电影------")
    var movieItemId = resdata.itemList[0].itemId; 
    console.log(movieItemId)
    var jx= "13";
    var two=jx+movieItemId; 
    console.log(two); 
    console.log("two")
    var Patch = PrefixZero(two,10)
    console.log(Patch)
    programId = wlst + Patch ;
    console.log(programId) ;
    console.log("电影programId---")
  }if(resdata.assetType == "Series"){
    var resdata = JSON.parse(getStorage("seriesresdata"));console.log(resdata);console.log("resdata电视剧------");  // 电视剧itemId 
    console.log("获取电视剧itemList索引");
    console.log(indexSingle.itemNo)
    console.log(resdata.itemList[indexSingle.itemNo])
    var seriesItemId = resdata.itemList[indexSingle.itemNo].itemId;
    console.log(seriesItemId);
    var jx= "13";
    var two=jx+seriesItemId; 
    console.log(two); 
    console.log("two")
    var Patch = PrefixZero(two,10)
    console.log(Patch)
    programId = wlst + Patch 
    console.log(programId)
    console.log("电视剧programId---")
  //  programId = 'YANHUA00000000043PITEM0137149808' //测试  item_id
  }if (resdata.assetType == "Column") {
    var resdata = JSON.parse(getStorage("seriesresdata"));console.log(resdata);console.log("resdata电视剧------");  // 电视剧itemId 
    console.log("获取综艺itemList索引");
    console.log(indexSingle.itemNo)
    console.log(resdata.itemList[indexSingle.itemNo])
    var seriesItemId = resdata.itemList[indexSingle.itemNo].itemId;
    console.log(seriesItemId);
    var jx= "13";
    var two=jx+seriesItemId; 
    console.log(two); 
    console.log("two")
    var Patch = PrefixZero(two,10)
    console.log(Patch)
    programId = wlst + Patch 
    console.log(programId)
    console.log("电视剧programId---")
  }
  //cntv://sdk/playurl?playUrl=，program,checkType,playurl必传
  var url = 'cntv://sdk/playurl?playUrl=' + encodeURIComponent(hwbfurl) +'&authCode=3a&stbId='+ yh.stbId +'&checkType=program&programId='+ programId +'&duration=0'
 // var url = 'cntv://sdk/playurl?playUrl=' + encodeURIComponent(hwbfurl) +'&authCode=3a&stbId='+ yh.stbId +'&checkType=program&programId='+ 'YANHUA00000000043PITEM0137149808'+'&duration=0'
    console.log("-----------------"+indexSingle.newplayTime)   
 videoParams = {
      historyTime: indexSingle.newplayTime ? indexSingle.newplayTime : 0,
      playUrl: encodeURIComponent(url)
    }
    console.log("未来videoParams")
    console.log(JSON.stringify(videoParams))
   // videoParams.historyTime = (indexSingle.newplayTime > 1) ? ($.cookie("newplayTime")) : "0";
    // 未来点播审核
    var playAuthUrl = authUrl + '/audit/query?app_id=' +APPID+ '&id=' + programId + '&type=' + videoType
    console.log('wlPlayAuth-----' +playAuthUrl)
     submitPrompt('getHttp', { 'httpUrl': encodeURIComponent(playAuthUrl), return: 'wlPlayAuth' });
}

// ***************华为********************************************************************************************************************************************************************

// 播放回调
//当前观看时长
var freetime;
function videoStateChange(res) {
  console.log('// 状态值改变的方法' + JSON.stringify(res));
  freetime = res.curPlayTime * 1;
  console.log(typeof(freetime))
  if(pageassetType == "Movie"){
    if(succUser == "ORD-400"){
      //跳转到订购页面
      if(freetime >=600000){
        console.log("易视腾用户未订购",succUser)
        player.stop();
        window.location.href = "./../pay/payfor/index.html"
      }
    }
  }
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
      playerBox.onResume(res);//续播
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
      playerBox.onScreenChange(res);//大小屏切换
      break;
    case 'onBufferingStart':
      playerBox.onBufferingStart(res);//开始缓冲
      break;
    case 'onBufferfinish':
      playerBox.onBufferfinish(res); //缓冲结束
      break;
    case 'onProgress':
      playerBox.onProgress(res);//当前播放时长
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

player.play = function (index , assettype) {
  getPlayUrl()
  // edsUrl()//获取华为播放地址
 console.log("itemList对应索引");
 console.log(index);
 console.log(assettype)
};
// 未来点播鉴权
var wlstatus;
function wlPlayAuth (res){
  console.log("未来点播鉴权结果");
  console.log(JSON.stringify(res));
  wlstatus = res.data.status
   if (res.status == 0 && res.data.status == 'pass') {
        submitPrompt('play',videoParams);
  } else {
      toastns('该节目已下线');
  }
}
// 易视腾用户鉴权
function detailAuth(assentId){
  var parames = {
    userId:yh.userId,
    appid: APPID,
    appKey:APPKEY,
    contentId:assentId,
    productId:'20181217001',
    spToken:''
  }
  parames = JSON.stringify(parames);
  console.log("易视腾鉴权:"+parames);
  // 内容鉴权
  submitPrompt('playAuth', { jsonParam: parames, return: 'getPlayAuth' });
}
var succUser= '';
function getPlayAuth(res) {
  console.log(JSON.stringify(res)),
  console.log('getPlayAuth易视腾用户鉴权------------');
  setStorage('getPlayAuth',JSON.stringify(res))
  console.log(getStorage("getPlayAuth"));
  succUser = res.result;
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
