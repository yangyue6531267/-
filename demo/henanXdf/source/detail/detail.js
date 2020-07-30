var enter_time = new Date().getTime()
var tempTimer = null;
Cookies.set('qb_datetime', (new Date()).valueOf(), {
  path: '/'
})
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
  519: "menu"
};
//按键分发事件
var onKeyPress;
//按键prev处理函数
var grepEvent = function (e) {
  var keyCode = e.keyCode || e.which;
  return onKeyPress(KEYMAP[keyCode]);
};
if(getQueryString('resultCode')){
  console.log('订购返回信息'+getQueryString('resultCode'))
}
console.log('window='+window.location.href)
registerLifecycle('registerLifecycleCallback'); // 生命周期函数调用
function registerLifecycleCallback ( res ){
    try{
      if(res.status==3||res.status==4){
        player.togglePlay('pause');
      }else if(res.status==1 || res.status==2){
        player.togglePlay('resume');
        if(bigScreen.isFullScreen){
          document.getElementById("play_center").style.cssText='display:none'
        }
      }
    }catch(err){

    }
}
var tempParent_page = Cookies.get('jump');
var parent_page = {};
if(tempParent_page){
  // 获取父级页面
  parent_page = JSON.parse(tempParent_page);
}
var value = {
  detailData: {},
  playUrl:'',
  isBack: false,
  detailUrl: "",
  list: null,
  number: 0, //当前播放的集数
  code: "",
  msg: "",
  historytime: 0,
  indexSingleLeft: 435, //单集滑块距离左边距离(为了适配盒子)
  indexSingWidth: 300, //单集滑动距离
  getValue: function () {
    try{
      this.detailUrl = Cookies.get('detailUrl');
      if (this.detailUrl.indexOf('itemSort') == -1) {
        this.detailUrl += "&itemSort=1";
      }
    }catch(e){

    }
  },
}
var getData = function (url) {
  getDetail(url,function(response){
    value.detailData = response.data;
    if (!value.detailData) { //资产下线/不存在，返回
      document.getElementById('toast2').style.display = 'block';
      document.getElementById('box-wrap').style.display = 'none';
      var urls = historylUrl + '/del?version=1';
      var collectType = '1'; //收藏类型(0-主播,1-资产,2-专题)
      var relateId = getParam('assetId', url);
      var dataList = '{"siteId":' + '"' + yh.siteId + '"' + ',"userId":' + '"' + yh.userId + '"' + ',"collectType":' + '"' + collectType + '"' + ',"relateId":' + '"' + relateId + '"' + '}';
      //  下线删除收藏
      getYhSpecialSC(urls, dataList);
      //  下线删除历史
      var dataList2 = '{"siteId":' + '"' + yh.siteId + '"' + ',"userId":' + '"' + yh.userId + '"' + ',"collectType":' + '"' + 3 + '"' + ',"relateId":' + '"' + relateId + '"' + '}';
      getYhSpecialSC(urls, dataList2);
      setTimeout(function () {
        Cookies.set('pos_id', '', {
          path: '/'
        })
        Cookies.set('recmd_id', '', {
          path: '/'
        })
        if (value.timers != null) {
          clearInterval(value.timers);
        }
        // player.stop()
        var backUrl = Cookies.get('backUrl') || '../../index.html';
        window.location.href = backUrl;
      }, 3000)
      return;
    }
    value.list = value.detailData.itemList;
    authentication()//鉴权
    uploadDom();
    qeryHistory();
    var jump = Cookies.get('jump')
    if (jump) {
      jump = eval('(' + jump + ')')
      try {
        var jsonOb = {}
        jsonOb.page_type = '0301'
        jsonOb.page_id = response.data.assetId
        jsonOb.parent_page_type = jump.parent_page_type
        jsonOb.parent_page_id = jump.parent_page_id
        bi.jump(jsonOb)
        Cookies.set('jump', '', {
          path: '/'
        })
      } catch (error) {
        console.log('埋点错误', error)
      }
    }
  },function(error){
    Cookies.set('pos_id', '', {
      path: '/'
    })
    Cookies.set('recmd_id', '', {
      path: '/'
    })
    var backUrl = Cookies.get("backUrl") || "../../index.html";
    window.location.href = backUrl;
  })
}
function uploadDom() {
  areaObj = topContent; //初始焦点赋值
  topContent.init();
  indexSingle.init();
  indexTotal.init();
  assetList.init();
  descriptionBox.init();
  collectData();
}
function authenticationFun(vod_id){
  var tempUrl = '';
  if(yh.epgUrl.indexOf('EPG') != -1){
    tempUrl = yh.epgUrl+'interEpg/user/default/authorize'
  }else{
    tempUrl = yh.epgUrl+'/EPG/interEpg/user/default/authorize'
  }
  var url = tempUrl;
  var token = yh.userToken;
  var bodyString = {cid:vod_id,tid:"-1" ,supercid:"" ,playType:"1",contentType:"0",businessType:"1",idflag:"1"};
  var headersString = {Authorization:token}
  var tempheadersString = JSON.stringify(headersString)
  var tempbodyString = JSON.stringify(bodyString)
  // postHttp(url,tempheadersString,tempbodyString,'authenticationBack')
}
function authenticationBack (res){
    console.log('鉴权回调'+JSON.stringify(res))
    var returncode = res.returncode; 
    if(returncode == 0){
      try{
        if(Cookies.get('isOrderBtn') == '1'){
          // 点击过订购按钮，鉴权成功说明订购成功
          var jsonOb = {
            pkg_type:'2',
            pkg_id:'12612900',
            operator_id:'',
            order_msg:'1',
            parent_page_id:parent_page.parent_page_id?parent_page.parent_page_id:'',
            parent_page_type:parent_page.parent_page_type?parent_page.parent_page_type:'',
            point:'1'
          }
          bi.order(jsonOb)
          Cookies.del('isOrderBtn','/');
        }
      }catch(error){
        console.log(error)
      }
      playConfig.isOrder = 0;
      Cookies.set('isOrder',playConfig.isOrder,{path:'/'})
      value.playUrl = res.urls[0].playurl;
      getId('btnBox2').innerHTML = '已订购 <span>VIP</span>';
      if(indexSingle.isHistory){
        console.log(indexSingle.isHistory+'有历史记录')
        indexSingle.isHistory = false;
        indexSingle.itemNo = indexSingle.HistoryList.relateEpisode * 1 - 1
        indexSingle.indexPlay = indexSingle.itemNo
        document.getElementById('slider1').style.left = value.indexSingleLeft + -value.indexSingWidth * indexSingle.itemNo + 'px'; //单集按钮滚动
        if (indexSingle.itemNo > 10) { //单集跳转10的倍数，触发总集数滚动
          indexTotal.itemNo = Math.floor(indexSingle.itemNo / 10)
          indexTotal.element.style.left = 530 + -100 * indexTotal.itemNo + 'px'; //单集按钮滚动
        }
        var vod_id = value.detailData.itemList[indexSingle.itemNo].vodList[0].playUrl;
        value.historytime = indexSingle.HistoryList.relateTime*1;
        indexSingle.uploadIndexPay();
        // authenticationFun(vod_id)
        return;
      }
    }else{
      // 鉴权失败删除历史记录
      Cookies.set('isOrder',1,{path:'/'})
      try{
        if(Cookies.get('isOrderBtn') == '1'){
          // 点击过订购按钮，鉴权成功说明订购成功
          var jsonOb = {
            pkg_type:'2',
            pkg_id:'12612900',
            operator_id:'',
            order_msg:'失败',
            parent_page_id:parent_page.parent_page_id?parent_page.parent_page_id:'',
            parent_page_type:parent_page.parent_page_type?parent_page.parent_page_type:'',
            point:'1'
          }
          bi.order(jsonOb)
          Cookies.del('isOrderBtn','/');
        }
      }catch(error){
        console.log(error)
      }
      indexSingle.isHistory = false;
      indexSingle.HistoryList = {};
      var url = historylUrl + '/del?version=1';
      var relateId = getParam('assetId', value.detailUrl);
      var dataList2 = '{"siteId":' + '"' + yh.siteId + '"' + ',"userId":' + '"' + yh.userId + '"' + ',"collectType":' + '"' + 3 + '"' + ',"relateId":' + '"' + relateId + '"' + '}';
      getYhSpecialSC(url, dataList2);
      if(Cookies.get('isOrder'))Cookies.del('isOrder','/');
      playConfig.isOrder = 1;
      value.playUrl = res.urls[0].previewurl
      console.log('未订购')
    }
    var temp0bj = {
        vod_id: value.playUrl,
        time:value.historytime,
    }
    console.log('订购打印'+playConfig.isOrder)
    topContent.initPlayer() // 注册回调
    topContent.play(temp0bj);
}

value.getValue();
var tempDetailUrl = window.location.href;
if(getQueryString('assetId')){
  // 外链跳详情页
  if(getQueryString('homeBack') == 'home'){
    Cookies.set('backHome',getQueryString('homeBack'))
  }
  player.initPlayer();
  if(Cookies.get('backUrl')){
    Cookies.del('backUrl','/')
  };
  value.detailUrl = 'http://112.35.185.113:18081/?s=39|25&p=yhAssetDetail&k=1&v=1&assetId='+getQueryString('assetId')+'&c=25&itemSort=1';
}
getData(value.detailUrl);

var topContent = {
  btnNum: 0, //按钮编号
  isCollect: false, //收藏判断
  element: null, //dom操作元素
  curPlayTime: 0,
  allTime:0,
  timers: null,
  bigPlay:false,
  init: function () { //初步渲染
    document.getElementById("name").innerHTML = '<span class="header-name">' + value.detailData.assetName + '</span>'
    document.getElementById("info").innerHTML = value.detailData.area + " | " + value.detailData.director + " | " + value.detailData.episodes + "集"
    document.getElementById("btnBox-1").innerHTML = value.detailData.description;
    this.element = document.getElementById('btnBox');
    addClass(getId("btnBox" + topContent.btnNum), 'active') //初始化添加样式
  },
  play: function (obj) {
    console.log('起播时间==='+value.historytime)
    try {
      // topContent.initPlayer();
      player.setCallback(videoStateChange);
      if(bigScreen.isFullScreen){
        player.setDisplayerLocation({x: 0,y: 0,w: -1,h:-1});
      }else{
        player.setDisplayerLocation({x: 50,y: 50,w: 470,h:268});
      }
      player.toggleShow('showPlayer');
      var playUrl = obj.vod_id;
      Cookies.set('bigUrl','obj.vod_id',{path:'/'});
      if (obj.time) {
        var time = obj.time;
      } else {
        var time = 0;
      }
      console.log('播放地址=====' + playUrl)
      var OpJson = {
        playUrl: playUrl,
        historyTime: time
      }
      setTimeout(function(){
        player.play(OpJson)
      },200)
      indexSingle.uploadIndexPay();
    } catch (error) {
      console.log(error);
      console.log('播放器初始化失败');
    }
  },
  initPlayer: function () {
    videoOptions.onStart = function (res) {
      console.log('准备播放')
    }
    videoOptions.onPlay = function (res) {
      console.log('开始播放'+JSON.stringify(res))
      topContent.bigPlay = true;
      document.querySelector('#imgBig img').style.display = 'none';
      document.getElementById("play_center").style.cssText='display:none';
    }
    videoOptions.onProgress = function (res) {
      topContent.curPlayTime = res.curPlayTime;
      topContent.allTime = res.allTime;
      bigScreen.refreshProgressView(res.curPlayTime,res.allTime);    
    }
    videoOptions.onPause = function (res) {
      console.log('暂停')
      bigScreen.stopPlay = true;
    }
    videoOptions.onResume = function (res) {
      console.log('续播')
      // playmode.cachePlayTime =-1;
      bigScreen.stopPlay = false;
    }
    videoOptions.onStop = function (res) {
      console.log('手动停止')
      document.querySelector('#imgBig img').style.display = 'block';
      playRecord();
    }
    videoOptions.onCompleted = function (res) {
      console.log('播放完毕')
      document.querySelector('#imgBig img').style.display = 'block';
      var isAllow = Cookies.get('isAllow')*1;
      console.log('下一集获取黑白名单信息====='+isAllow)
      if(isAllow == 1 && value.detailData.itemList[indexSingle.itemNo].fee == '2')return; // 黑名单不许播放下一集
      if(playConfig.isOrder == 0){
        // 已订购，自动播放下一集
        topContent.playNext();
      }else{
        if(isAllow == 2){
          // 未订购，白名单，自动播放下一集
          topContent.playNext();
          return;
        }
        if(value.detailData.itemList[indexSingle.itemNo+1].fee == '1'){
          // 此刻播放的下一集是免费就播放下一集
          console.log('未订购自动播放第二集')
          topContent.playNext();
          return;
        }
        // 未订购返回小屏
        if(bigScreen.isFullScreen){
          document.querySelector('#box-wrap').style.background = '';
          document.querySelector('.scroll-box').style.visibility = 'visible';
          document.querySelector('.bigScreen').style.display = 'none';
          // player.upPlayerLocation({x: 50,y: 50,w: 470,h:268});
          bigScreen.isFullScreen = false;
          bigScreen.isBigBack = true;
          areaObj = topContent;
        }
      }
      var json = {
        time: topContent.curPlayTime,
        index: indexSingle.itemNo * 1 + 1
      };
      Cookies.set(value.detailData.assetId, JSON.stringify(json), {path: '/'})
    }
    videoOptions.onError = function (res) {
      console.log('报错')
    }
    videoOptions.onBufferfinish = function(res) {
      console.log('onBufferfinish===缓冲结束')
    }
    videoOptions.onBufferingStart = function(res) {
      console.log('onBufferingStart==缓冲开始')
    }
    videoOptions.onScreenChange = function(res) {
      console.log('onScreenChange')
    }
    videoOptions.onCompvared = function(res){

    }
  },
  playNext: function () {
    if (value.timers != null) {
      clearInterval(value.timers);
    }
    player.stop();
    console.log("切集钱" + indexSingle.itemNo)
    if(indexSingle.itemNo >= value.list.length - 1)return;
    indexSingle.itemNo = indexSingle.itemNo * 1 + 1;
    indexSingle.indexPlay = indexSingle.itemNo;
    indexSingle.initPayActive();
    indexSingle.uploadIndexPay();
    var vod_id =  value.detailData.itemList[indexSingle.itemNo].vodList[0].playUrl;
    value.historytime = 0;
    // authenticationFun(vod_id)
    console.log("切集后" + indexSingle.itemNo)
  },
  up: function () {
    removeClass(getId("btnBox" + topContent.btnNum), 'active')
    this.btnNum = -1;
    addClass(getId("btnBox" + topContent.btnNum), 'active')
  },
  down: function () {
    if (this.btnNum == -1) {
      removeClass(getId("btnBox" + topContent.btnNum), 'active')
      this.btnNum = 0;
      addClass(getId("btnBox" + topContent.btnNum), 'active')
    } else {
      removeClass(getId("btnBox" + topContent.btnNum), 'active')
      areaObj = indexSingle
      indexSingle.addCss()
      indexSingle.marquee('add')
    }
  },
  left: function () {
    if (this.btnNum < 1) return
    removeClass(getId("btnBox" + topContent.btnNum), 'active')
    this.btnNum--
    addClass(getId("btnBox" + topContent.btnNum), 'active')
  },
  right: function () {
    // if (this.btnNum >= 1) return
    if (this.btnNum > 1) return
    removeClass(getId("btnBox" + topContent.btnNum), 'active')
    this.btnNum++
    addClass(getId("btnBox" + topContent.btnNum), 'active')
  },
  enter: function () {
    if (this.btnNum == -1) {
      document.getElementById('descriptionBox').style.visibility = "visible";
      areaObj = descriptionBox;
      // player.stop();
      return
    }
    if (this.btnNum === 0) {
      // 全屏播放
      if(bigScreen.isBigBack){
        if(playConfig.isOrder == 0)return;
        var vod_id = indexSingle.data[0].vodList[0].playUrl;
        bigScreen.rebroadcast();
        player.stop();
        // authenticationFun(vod_id)
      }else{
        bigScreen.init();
      }
    } else if (this.btnNum === 1) {
      if (topContent.isCollect) { //已收藏
        var collectType = '1'; //收藏类型(0-主播,1-资产,2-专题)
        var relateId = value.detailData.assetId;
        var data = '{"siteId":' + '"' + yh.siteId + '"' + ',"userId":' + '"' + yh.userId + '"' + ',"collectType":' + '"' + collectType + '"' + ',"relateId":' + '"' + relateId + '"' + '}';
        removeFav(data, function (rep) {
          if (rep.indexOf('success') !== -1) {
            topContent.isCollect = false
            document.getElementById('collectWord').innerText = "收藏";
            document.getElementById('btnBox1').className = 'noCollect active'
          } else {
            console.log('删除收藏失败')
          }
        })

        // 取消收藏时上报
        console.log('取消收藏资产时上报')
        try {
          var jsonOb = {}
          jsonOb.cid = value.detailData.assetId
          jsonOb.click_type = '1'
          jsonOb.collect = '2'
          bi.collection(jsonOb)
        } catch (e) {
          console.log('错误信息' + e)
        }
      } else { //未收藏
        var collectType = '1'; //收藏类型(0-主播,1-资产,2-专题)
        var relateId = value.detailData.assetId;
        var relateTitle = value.detailData.assetName;
        var relateImg = value.detailData.assetImg;
        var relateUrl = value.detailUrl;
        var relateLayout = value.detailData.layout;
        var relateScore = value.detailData.score == undefined ? '' : value.detailData.score;
        if (value.detailData.score && value.detailData.score.length == 1) {
          relateScore += '0'
        }
        var data = '{"siteId":' + '"' + yh.siteId + '"' + ',"userId":' + '"' + yh.userId + '"' + ',"collectType":' + '"' + collectType + '"' + ',"relateId":' + '"' + relateId + '"' + ',"relateTitle":' + '"' + relateTitle + '"' + ',"relateImg":' + '"' + relateImg + '"' + ',"relateUrl":' + '"' + relateUrl + '"' + ',"relateLayout":' + '"' + relateLayout + '"' + ',"relateScore":' + '"' + relateScore + '"' + '}';
        addFav(data, function (rsp) {
          if (rsp.indexOf('success') !== -1) {
            topContent.isCollect = true;
            document.getElementById('collectWord').innerText = "已经收藏"
            document.getElementById('btnBox1').className = 'noCollect active isCollect'
          } else {
            console.log('添加收藏失败')
          }
        });

        // 收藏时上报	
        console.log('收藏资产时上报')
        try {
          var jsonOb = {}
          jsonOb.cid = value.detailData.assetId
          jsonOb.click_type = '1'
          jsonOb.collect = '1'
          bi.collection(jsonOb)
        } catch (e) {
          console.log('错误信息' + e)
        }
      }
    } else {
      // 点击订购按钮
      if(playConfig.isOrder == 0){
        // 已订购
        console.log('已订购')
        // 播放
      }else{
        // 未订购
        console.log('未订购'+playConfig.orderUrl)
        window.location.href = playConfig.orderUrl
      }
      // setTimeout(function () {
      //   var isAllow = Cookies.get('isAllow')*1
      //   console.log('订购按钮获取黑白名单信息====='+isAllow)
      //   if(isAllow == 1)return; // 黑名单不许订购
      //   if(playConfig.isOrder == 0)return; // 已订购 不可以点击订购按钮
      //   try{
      //     var jsonOb = {
      //       page_id:value.detailData.assetId,
      //       page_type:'0301',
      //     }
      //     bi.orderClick(jsonOb); // 点击订购按钮
      //     Cookies.set('isOrderBtn','1',{'path':'/'}) // 点击订购按钮Cookies记录
      //   }catch(error){
      //     console.log(error)
      //   }
      //   orderHandle(value.list[0].vodList[0].playUrl);
      // },50)
    }
  }
}
var indexSingle = {
  data: {},
  element: null,
  itemNo: 0,
  indexPlay: 0,
  isHistory:false,
  HistoryList:{},
  init: function () {
    this.data = value.detailData.itemList;
    this.element = document.getElementById('slider1');
    var html = '';
    for (var i = 0; i < this.data.length; i++) {
      var div = '<div class="buttomNum" id="buttomNum' + i + '"><span class="mianfei" id="mianfei'+i+'"></span>' + this.data[i].itemName + '</div>';
      html += div;
    };
    this.element.innerHTML = html;
    for (var i = 0; i < value.detailData.itemList.length; i++) {
      if(value.detailData.itemList[i].fee == '2'){
        removeClass(getId("mianfei"+i),'mianfei')
      }
    }
  },
  removeCss: function () {
    var length = this.data.length;
    for (var i = 0; i < length; i++) {
      removeClass(getId("buttomNum" + i), 'active')
    };
  },
  addCss: function () {
    addClass(getId("buttomNum" + indexSingle.itemNo), 'active')
    indexSingle.uploadIndexPay();
    this.element.style.left = value.indexSingleLeft + -value.indexSingWidth * this.itemNo + 'px'; //单集按钮滚动
    if (this.itemNo > 0 && this.itemNo % 10 === 0 || (this.itemNo + 1) % 10 === 0) { //单集跳转10的倍数，触发总集数滚动
      indexTotal.itemNo = Math.floor(this.itemNo / 10)
      indexTotal.element.style.left = 530 + -100 * indexTotal.itemNo + 'px'; //单集按钮滚动
    }
  },
  uploadIndexPay: function () {
    var length = this.data.length;
    for (var i = 0; i < length; i++) {
      removeClass(getId("buttomNum" + i), 'select');
    };
    addClass(getId("buttomNum" + indexSingle.indexPlay), 'select');
  },
  initPayActive: function () {
    this.itemNo = this.indexPlay;
    this.element.style.left = value.indexSingleLeft + -value.indexSingWidth * this.indexPlay + 'px'; //单集按钮滚动
    if (this.itemNo > 0 && this.itemNo % 10 === 0 || (this.itemNo + 1) % 10 === 0) { //单集跳转10的倍数，触发总集数滚动
      indexTotal.itemNo = Math.floor(this.itemNo / 10)
      indexTotal.element.style.left = 530 + -100 * indexTotal.itemNo + 'px'; //单集按钮滚动
    }
    removeClass(getId("buttomNum" + indexSingle.itemNo), 'active')
  },
  marquee: function (status) {
    var scrollLeft = 0;
    clearInterval(this.timer);
    var div = getId("buttomNum" + this.itemNo);
    var length = strlen(div.innerText);
    if (length < 16) return
    if (status == 'add') {
      this.timer = setInterval(function () {
        if (scrollLeft <= -19 * length) {
          scrollLeft = 290;
          div.style.cssText = "text-indent: " + scrollLeft + "px;text-align: left;"
        } else {
          scrollLeft += -3;
          div.style.cssText = "text-indent: " + scrollLeft + "px;text-align: left;"
        }
      }, 160);
    } else {
      if (div.innerHTML.length >= 16) {
        scrollLeft = 0;
        div.style.cssText = "text-indent: " + scrollLeft + "px;text-align: left;"
      }
    }
  },
  up: function () {
    areaObj = topContent
    indexSingle.removeCss();
    this.marquee()
    addClass(getId("btnBox" + topContent.btnNum), 'active')
    this.initPayActive();
  },
  down: function () {
    areaObj = indexTotal
    this.removeCss();
    this.marquee()
    var length = this.data.length;
    addClass(getId("topNum" + indexTotal.itemNo), 'active')
    // this.initPayActive();
  },
  left: function () {
    if (this.itemNo === 0) return;
    this.marquee()
    this.removeCss();
    this.itemNo--;
    this.addCss();
    this.marquee('add')
  },
  right: function () {
    if (this.itemNo === this.data.length - 1) return;
    this.removeCss();
    this.marquee()
    this.itemNo++;
    this.addCss();
    this.marquee('add')
  },
  enter: function () {
    var isAllow = Cookies.get('isAllow')*1
    console.log(value.detailData.itemList[indexSingle.itemNo].fee)
    console.log('选集条获取黑白名单信息====='+isAllow)
    if(value.detailData.itemList[indexSingle.itemNo].fee == '2'){
      if(isAllow == 1)return; // 黑名单 不允许观看第三集以上
      setTimeout(function(){
        console.log('点击二次鉴权')
        if(playConfig.isOrder == 1){
          console.log('二次鉴权没通过')
          // 未订购跳转订购
          if(isAllow == 0){
            // 正常用户未订购可以订购
            try{
              var jsonOb = {
                page_id:value.detailData.assetId,
                page_type:'0301'
              }
              bi.orderClick(jsonOb); // 点击订购按钮
              Cookies.set('isOrderBtn','1',{'path':'/'}) // 点击订购按钮Cookies记录
            }catch(error){
              console.log(error)
            }
            orderHandle(value.list[0].vodList[0].playUrl);
            return;
          }else if(isAllow == 2){
            // 白名单 可以观看不用订购
            indexSingle.indexPlay = indexSingle.itemNo
            indexSingle.addCss();
            player.stop();
            var vod_id = indexSingle.data[indexSingle.itemNo].vodList[0].playUrl;
            value.historytime = 0;
            // authenticationFun(vod_id)     
          }
        }else if(playConfig.isOrder == 0){
          console.log('二次鉴权通过')
          indexSingle.indexPlay = indexSingle.itemNo
          indexSingle.addCss();
          player.stop();
          var vod_id = indexSingle.data[indexSingle.itemNo].vodList[0].playUrl;
          value.historytime = 0;
          // authenticationFun(vod_id)
        }
      },50)
    }else if(value.detailData.itemList[indexSingle.itemNo].fee == '1'){
      console.log('点击第一集或者第二集')
      this.indexPlay = this.itemNo
      this.addCss();
      player.stop();
      var vod_id = this.data[this.itemNo].vodList[0].playUrl;
      value.historytime = 0;
      // authenticationFun(vod_id)
    }
    try {
      commonParams.asset_id = value.detailData.assetId;
      commonParams.item_id = value.detailData.itemList[indexSingle.itemNo].itemId
      commonParams.qb_datetime = Cookies.get('qb_datetime')
      commonParams.zb_datetime = (new Date()).valueOf()
      commonParams.time = commonParams.zb_datetime - commonParams.qb_datetime
      commonParams.ep = value.detailData.episodes
      commonParams.fee = value.detailData.itemList[indexSingle.itemNo].fee
      commonParams.isFullScreen = '1'
      commonParams.pos_id = Cookies.get('pos_id')
      commonParams.recmd_id = Cookies.get('recmd_id')
      commonParams.parent_page_type = '0301'
      commonParams.parent_page_id = value.detailData.assetId
      if(bigScreen.isFullScreen){
        commonParams.isFullScreen = '0'
      }
      bi.vod(commonParams)
    } catch (e) {
      console.log('错误信息' + e)
    }
    Cookies.set('qb_datetime', (new Date()).valueOf(), {path: '/'})
  }
}

var indexTotal = {
  data: {},
  element: null,
  itemNo: 0,
  arrayNum: 0,
  init: function () {
    this.data = value.detailData.itemList;
    var total = this.data.length;
    this.arrayNum = Math.floor((total - 1) / 10) * 1;
    this.element = document.getElementById('slider2');
    var class1 = 'topNum';
    var html = '';
    for (var i = 0; i < this.arrayNum; i++) {
      var div = ''
      if (i == 0) {
        div = '<div class="' + class1 + '" id="topNum' + i + '">1-' + (i + 1) + '0</div>'
      } else {
        div = '<div class="' + class1 + '" id="topNum' + i + '">' + i + "1-" + (i + 1) + "0" + '</div>';
      }
      html += div
    };
    this.element.innerHTML = html;
    if (total > this.arrayNum * 10) {
      var div
      if (i == 0) {
        div = '<div class="' + class1 + '" id="topNum' + i + '">1-' + total + '</div>';
      } else {
        div = '<div class="' + class1 + '" id="topNum' + i + '">' + this.arrayNum + '1-' + total + '</div>';
      }
      html += div
      this.element.innerHTML = html;
    }
  },
  addCss: function () {
    addClass(getId("topNum" + indexTotal.itemNo), 'active')
    this.element.style.left = 530 + -100 * this.itemNo + 'px' //滚动方程
    indexSingle.itemNo = this.itemNo * 10;
    indexSingle.element.style.left = value.indexSingleLeft + -value.indexSingWidth * indexSingle.itemNo + 'px' //滚动方程
  },
  removeCss: function () {
    for (var i = 0; i <= this.arrayNum; i++) {
      removeClass(getId("topNum" + i), 'active')
    };
  },
  up: function () {
    areaObj = indexSingle
    indexTotal.removeCss();
    indexSingle.marquee('add')
    addClass(getId("buttomNum" + indexSingle.itemNo), 'active')
  },
  down: function () {
    this.removeCss()
    areaObj = assetList
    assetList.addCss()
  },
  left: function () {
    if (this.itemNo === 0) return;
    this.removeCss();
    this.itemNo--;
    this.addCss();
  },
  right: function () {
    if (this.itemNo === this.arrayNum) return
    this.removeCss();
    this.itemNo++;
    this.addCss();
  },
  enter: function () {}

}

var assetList = {
  data: {},
  itemNo: 0,
  element: null,
  init: function () {
    this.data = value.detailData.assetList;
    this.element = document.getElementById("scrollContent");
    var html = '';
    var length = this.data.length = 6;
    for (var i = 0; i < length; i++) {
      var div = '<li class="content content' + i + '" id="li-item' + i + '"><div class="contentP60 content-inner">' + this.data[i].assetName + '</div></li > '
      html += div;
    }
    this.element.innerHTML = html;
  },
  addCss: function () {
    addClass(getId("li-item" + this.itemNo), 'active')
  },
  removeCss: function () {
    removeClass(getId("li-item" + this.itemNo), 'active')
  },
  up: function () {
    areaObj = indexTotal
    assetList.removeCss();
    addClass(getId("topNum" + indexTotal.itemNo), 'active')
  },

  down: function () {},

  left: function () {
    if (this.itemNo === 0) return
    if (this.itemNo >= 4) {
      this.element.style.left = -(this.itemNo - 4) * 196 + "px"
    }
    this.removeCss()
    this.itemNo--
    this.addCss()
  },

  right: function () {
    if (this.itemNo === this.data.length - 1) return
    this.removeCss()
    this.itemNo++
    if (this.itemNo >= 4) {
      this.element.style.left = -(this.itemNo - 4) * 196 + "px"
    }
    this.addCss()
  },
  enter: function () {
    // 点击推荐位上报
    console.log('点击推荐位上报')
    try {
      var jsonOb = {}
      jsonOb.pos_id = ''
      jsonOb.recmd_id = '3'
      jsonOb.page_type = '0301'
      jsonOb.page_id = value.detailData.assetId
      jsonOb.click_type = '1'
      jsonOb.cid = value.detailData.assetId
      bi.jumpRecommend(jsonOb)
    } catch (e) {
      console.log('埋点错误', error)
    }

    // 页面访问储存
    var jump = {
      parent_page_type: '0301',
      parent_page_id: value.detailData.assetId
    }
    jump = JSON.stringify(jump)
    Cookies.set('jump', jump, {
      path: '/'
    })

    Cookies.set('pos_id', '', {
      path: '/'
    })
    Cookies.set('recmd_id', '3', {
      path: '/'
    })

    // 停止播放
    // player.togglePlay('pause');
    player.stop();
    // 刷新当前页
    areaObj = topContent
    var detailURL = this.data[this.itemNo].jsonUrl //存储详情页url
    Cookies.set('detailUrl', detailURL, {
      path: '/'
    })

    var pageUrl = window.location.href;
    window.location.replace(pageUrl);
  },
}
var descriptionBox = {
  num: 0, //翻页数
  option: 0, //页数
  height: 0, //文字高度
  init: function () {
    document.getElementById("wordScroll").innerHTML = value.detailData.description;
    this.height = document.getElementById('wordScroll').offsetHeight;
    this.option = Math.floor(this.height / 270);
  },
  enter: function () {
    areaObj = topContent
    document.getElementById('descriptionBox').style.visibility = "hidden";
    var supercid = indexSingle.data[indexSingle.itemNo].vodList[0].playUrl.split(":")[0];
    var cid = indexSingle.data[indexSingle.itemNo].vodList[0].playUrl.split(":")[1];
    console.log('supercid为:' + supercid + 'cid为：' + cid);
    player.togglePlay('resume');
  },
  up: function () {
    if (this.num == 0) return;
    this.num--;
    document.getElementById('wordScroll').style.top = -270 * this.num + "px"
  },
  down: function () {
    if (this.num == this.option) return;
    this.num++;
    document.getElementById('wordScroll').style.top = -270 * this.num + "px"
  },
  left:function(){},
  right:function(){}
}

var bigScreen = {
  // 全屏播放对象
  name:'bigScreen',
  allTime:0,
  timer:null,
  timer2:null,
  stopPlay:false,
  isFullScreen:false,
  isBigBack:false,
  isSelections:false,
  episodeItem:0,
  init:function () {  
    document.querySelector('#play_name').innerText = value.detailData.assetName;
    document.querySelector('#box-wrap').style.background = 'transparent';
    document.querySelector('.scroll-box').style.visibility = 'hidden';
    document.querySelector('.bigScreen').style.display = 'block';
    player.upPlayerLocation({ x: 0, y: 0, w: -1, h: -1 });
    this.hideTopBottom();
    this.isFullScreen = true;
    this.isBigBack = false;
    areaObj = bigScreen;
    this.render();
    this.episodeItem = indexSingle.indexPlay;
    document.querySelector('.inner_box').style.marginTop = 176-this.episodeItem*62 + 'px';
  },
  rebroadcast:function (){
    document.querySelector('#play_name').innerText = value.detailData.assetName;
    document.querySelector('#box-wrap').style.background = 'transparent';
    document.querySelector('.scroll-box').style.visibility = 'hidden';
    document.querySelector('.bigScreen').style.display = 'block';
    this.hideTopBottom();
    this.isFullScreen = true;
    this.isBigBack = false;
    areaObj = bigScreen;
  },
  left:function () {  
    this.goBackView();
  },
  right:function () {  
    this.goForwardView();
  },
  up:function () { 
    // 大屏上键调出选集条
    if(!this.isSelections){
      document.querySelector('.play_center_left').style.display = 'block';
      this.isSelections = true;
      this.marquee('add')
    }else{
      if(this.episodeItem == 0)return;
      this.marquee();
      this.episodeItem--;
      document.querySelector('.inner_box').style.marginTop = 176-this.episodeItem*62 + 'px';
      this.marquee('add')
    }
  },
  down:function () { 
    if(!this.isSelections){
      document.querySelector('.play_center_left').style.display = 'block';
      this.isSelections = true;
      this.marquee('add');
    }else{
      if(this.episodeItem+1==indexSingle.data.length)return;
      this.marquee()
      this.episodeItem++;
      document.querySelector('.inner_box').style.marginTop = 176-this.episodeItem*62 + 'px';
      this.marquee('add')
    }
   },
   marquee: function (status) {
    var scrollLeft = 0;
    clearInterval(this.timer2);
    var div = getId("seletItem" + this.episodeItem);
    var length = strlen(div.innerHTML);
    if (length < 9) return
    if (status == 'add') {
      this.timer2 = setInterval(function () {
        console.log('1')
        if (scrollLeft <= -19 * length) {
          scrollLeft = 170;
          div.style.cssText = "text-indent: " + scrollLeft + "px;text-align: left;"
        } else {
          scrollLeft += -3;
          div.style.cssText = "text-indent: " + scrollLeft + "px;text-align: left;"
        }
      }, 80);
    } else {
      if (div.innerHTML.length >= 9) {
        scrollLeft = 0;
        div.style.cssText = "text-indent: " + scrollLeft + "px;text-align: left;"
      }
    }
  },
  back:function () {
    if(this.isSelections){
      // 隐藏选集条
      document.querySelector('.play_center_left').style.display = 'none';
      this.isSelections = false;
      clearInterval(this.timer2);
      return;
    }
    document.querySelector('#box-wrap').style.background = '';
    document.querySelector('.scroll-box').style.visibility = 'visible';
    document.querySelector('.bigScreen').style.display = 'none';
    player.upPlayerLocation({x: 50,y: 50,w: 470,h:268});
    if(bigScreen.stopPlay){
      // 返回小屏时 暂停需续播
      player.togglePlay('resume');
      bigScreen.stopPlay = false;
      document.getElementById("play_center").style.cssText='display:none'
    }
    this.isFullScreen = false;
    areaObj = topContent;
    playRecord();
  },
  enter:function(){
    if(this.isSelections){
      // 重新更新以及播放对应集数
      clearInterval(this.timer2)
      indexSingle.indexPlay = this.episodeItem;
      document.querySelector('.play_center_left').style.display = 'none';
      this.isSelections = false;

      // 大屏点击播放逻辑
      var isAllow = Cookies.get('isAllow')*1
      console.log('======'+indexSingle.data[this.episodeItem].vodList[0].playUrl)
      console.log(value.detailData.itemList[this.episodeItem].fee)
      console.log('大屏选集条获取黑白名单信息====='+isAllow)
      if(value.detailData.itemList[this.episodeItem].fee == '2'){
        if(isAllow == 1)return; // 黑名单 不允许观看第三集以上
        setTimeout(function(){
          console.log('点击大屏二次鉴权')
          if(playConfig.isOrder == 1){
            console.log('大屏二次鉴权没通过')
            // 未订购跳转订购
            if(isAllow == 0){
              // 正常用户未订购可以订购
              try{
                var jsonOb = {
                  page_id:value.detailData.assetId,
                  page_type:'0301'
                }
                bi.orderClick(jsonOb); // 点击订购按钮
                Cookies.set('isOrderBtn','1',{'path':'/'}) // 点击订购按钮Cookies记录
              }catch(error){
                console.log(error)
              }
              orderHandle(value.list[0].vodList[0].playUrl);
              return;
            }else if(isAllow == 2){
              // 白名单 可以观看不用订购
              indexSingle.indexPlay = this.episodeItem
              indexSingle.addCss();
              player.stop();
              var vod_id = indexSingle.data[this.episodeItem].vodList[0].playUrl;
              value.historytime = 0;
              // authenticationFun(vod_id)     
            }
          }else if(playConfig.isOrder == 0){
            console.log('二次鉴权通过')
            indexSingle.indexPlay = this.episodeItem
            indexSingle.addCss();
            player.stop();
            var vod_id = indexSingle.data[this.episodeItem].vodList[0].playUrl;
            value.historytime = 0;
            // authenticationFun(vod_id)
          }
        },50)
      }else if(value.detailData.itemList[this.episodeItem].fee == '1'){
        console.log('点击第一集或者第二集')
        indexSingle.indexPlay = this.episodeItem
        indexSingle.addCss();
        player.stop();
        var vod_id = indexSingle.data[this.episodeItem].vodList[0].playUrl;
        value.historytime = 0;
        // authenticationFun(vod_id)
      }
      indexSingle.uploadIndexPay();
      indexSingle.itemNo = indexSingle.indexPlay;
      document.getElementById('slider1').style.left = value.indexSingleLeft + -value.indexSingWidth * indexSingle.itemNo + 'px'; //单集按钮滚动
      if (indexSingle.itemNo > 10) { //单集跳转10的倍数，触发总集数滚动
        indexTotal.itemNo = Math.floor(indexSingle.itemNo / 10)
        indexTotal.element.style.left = 530 + -100 * indexTotal.itemNo + 'px'; //单集按钮滚动
      }
      if (this.stopPlay) {
        document.getElementById("play_center").style.cssText='display:none'
      }
      try {
        commonParams.asset_id = value.detailData.assetId;
        commonParams.item_id = value.detailData.itemList[indexSingle.itemNo].itemId
        commonParams.qb_datetime = Cookies.get('qb_datetime')
        commonParams.zb_datetime = (new Date()).valueOf()
        commonParams.time = commonParams.zb_datetime - commonParams.qb_datetime
        commonParams.ep = value.detailData.episodes
        commonParams.fee = value.detailData.itemList[indexSingle.itemNo].fee
        commonParams.isFullScreen = '1'
        commonParams.pos_id = Cookies.get('pos_id')
        commonParams.recmd_id = Cookies.get('recmd_id')
        commonParams.parent_page_type = '0301'
        commonParams.parent_page_id = value.detailData.assetId
        if(bigScreen.isFullScreen){
          commonParams.isFullScreen = '0'
        }
        bi.vod(commonParams)
      } catch (e) {
        console.log('错误信息' + e)
      }
      Cookies.set('qb_datetime', (new Date()).valueOf(), {path: '/'})
      return
    }
    if (this.stopPlay) {
      document.getElementById("play_center").style.cssText='display:none'
      player.togglePlay('resume');
    } else {
      document.getElementById("play_center").style.cssText='display:table'
      this.hideTopBottom();
      player.togglePlay('pause');
    }
  },
  goBackView:function() {
    // 快退
    this.hideTopBottom();
    // if (!this.stopPlay) {
    //   this.pause();
    // }
    var tempSeekTime = topContent.curPlayTime*1-10000;
    if(tempSeekTime<0){
      tempSeekTime = 0;
    }
    if(this.stopPlay){
      document.getElementById("play_center").style.cssText='display:none'
      player.togglePlay('resume');
    }
    player.seekTime({seekTime:tempSeekTime});
  },
  render:function() {
    // 渲染选集条
    // indexSingle.data
    var divItemWrap = ''
    for (var i = 0; i < indexSingle.data.length; i++) {
      var divItem = '<li class="item" id="seletItem'+ i +'">'+indexSingle.data[i].itemName+'</li>'
      divItemWrap+=divItem;
    }
    document.querySelector('.inner_box').innerHTML = divItemWrap;
  },
  goForwardView:function () {
    // 快进
    this.hideTopBottom();
    // if (!this.stopPlay) {
    //   this.pause();
    // } 
    if((topContent.allTime*1-topContent.curPlayTime*1)<10)return;
    var tempSeekTime = topContent.curPlayTime*1+10000;
    // console.log('上'+tempSeekTime)
    // console.log('总'+topContent.allTime*1)
    // if(tempSeekTime>topContent.allTime*1){
    //   tempSeekTime = topContent.allTime*1
    // }
    console.log('下'+tempSeekTime)
    if(this.stopPlay){
      document.getElementById("play_center").style.cssText='display:none'
      player.togglePlay('resume');
    }
    player.seekTime({seekTime:tempSeekTime});
  },
  hideTopBottom:function(){
    document.getElementById("play-top").style.cssText='display:block';
    document.getElementById("play-bottom").style.cssText='display:block'
    // 隐藏ui展示
    clearTimeout(this.timer);
    this.timer = setTimeout(function(){
      document.getElementById("play-top").style.cssText='display:none';
      document.getElementById("play-bottom").style.cssText='display:none'
    },7000)
  },
  timeChange:function(startTime,allTime){
    var progress = startTime/ allTime;
      if (progress > 1) { progress = 1;}
      document.getElementById('allLongs').style.width = progress * 913 + 'px';
      document.getElementById('play_icon').style.left = (progress * 913) + 'px';
      document.getElementById('play_icon').innerHTML = this.getTimeFormat(startTime);
      document.getElementById('play_time').innerHTML = this.getTimeFormat(allTime);
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
    if (!this.stopPlay) {
      this.timeChange(startTime,allTime);
    } 
  },
  getTimeFormat:function(secondTimes) {
    var secondTime = secondTimes/1000;
    if (secondTime <= 0) { return '00:00:00'; }
    var hour = parseInt(secondTime / 3600) + '';
    if (hour.length == 1) { hour = '0' + hour; }
    var minute = parseInt((secondTime%3600)/ 60) + '';
    if (minute.length == 1) { minute = '0' + minute; }
    var second = parseInt(secondTime % 60) + '';
    if (second.length == 1) { second = '0' + second; }
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
}

function removeFav(data, callBackFunction) {
  var urls = historylUrl + '/del?version=1';
  getYhSpecialSC(urls, data, function (response) {
    callBackFunction(response)
  })
};

function addFav(data, callBackFunction) {
  var urls = historylUrl + '/collect?version=1';
  getYhSpecialSC(urls, data, function (response) {
    callBackFunction(response)
  })
};

function collectData() {
  var url = historylUrl +
    "/list?version=1&siteId=" + yh.siteId + "&userId=" + yh.userId +
    "&relateId=" + value.detailData.assetId + "&collectType=1"
    getHistoryl(url, function (res) {
    if (typeof (res) == "string") {
      res = eval('(' + res + ')');
    }
    if (res.data.resultNum == 1) {
      topContent.isCollect = true;
      document.getElementById('collectWord').innerText = "已经收藏"
      // document.getElementById('collect').className = 'isCollect btn'
      addClass(getId("btnBox1"), 'isCollect')
    } else {
      topContent.isCollect = false
      document.getElementById('collectWord').innerText = "收藏"
      // document.getElementById('collect').className = 'noCollect btn'
      addClass(getId("btnBox1"), 'noCollect')
    }
  })
};


function playRecord() {
  // 播放历史记录
  var collectType = '3';
  var relateId = value.detailData.assetId;
  var relateTitle = value.detailData.assetName;
  var relateImg = value.detailData.assetImg;
  var relateUrl = value.detailUrl;
  var relateLayout = value.detailData.layout;
  var relateScore = value.detailData.score == undefined ? '' : value.detailData.score;
  var relateEpisode = indexSingle.itemNo + 1;
  var relateTime = topContent.curPlayTime;
  if (value.detailData.score && value.detailData.score.length == 1) {
    relateScore += '0'
  }
  var data = '{"siteId":' + '"' + yh.siteId + '"' + ',"relateEpisode":' + '"' + relateEpisode + '"' + ',"relateTime":' + '"' + relateTime + '"' + ',"userId":' + '"' + yh.userId + '"' + ',"collectType":' + '"' + collectType + '"' + ',"relateId":' + '"' + relateId + '"' + ',"relateTitle":' + '"' + relateTitle + '"' + ',"relateImg":' + '"' + relateImg + '"' + ',"relateUrl":' + '"' + relateUrl + '"' + ',"relateLayout":' + '"' + relateLayout + '"' + ',"relateScore":' + '"' + relateScore + '"' + '}';
  var urls = historylUrl + '/collect?version=1';
  getYhSpecialSC(urls, data);
};

function qeryHistory() {
  // 查询播放记录
  var url = historylUrl + '/list?version=1&siteId=' + yh.siteId + '&userId=' + yh.userId + '&pindex=0&psize=16&collectType=3'
  getCollectionList(url, function (response) {
      if (eval('(' + (response) + ')').code !== 200) {} else {
        for (var i = 0; i < eval('(' + (response) + ')').data.resultList.length; i++) {
          var element = eval('(' + (response) + ')').data.resultList[i];
          if (element.relateId == value.detailData.assetId) {
            // 有播放记录，并返回集数
            indexSingle.HistoryList = element;
            indexSingle.isHistory = true;
          }
        }
      }
      var vod_id = value.detailData.itemList[0].vodList[0].playUrl;
      Cookies.set('onePlayURL',vod_id,{path:'/'})
      // authenticationFun(vod_id); // 用第一集id鉴权
    },
    function (response) {
      // 初始化播放器
    })
}

onKeyPress = function (keyCode) {
  try{
    if(areaObj.name && areaObj.name == 'bigScreen'){
      if(keyCode == 'down' || keyCode == 'up'){
        clearTimeout(tempTimer)
        tempTimer = setTimeout(function () { 
          // 隐藏选集条
          document.querySelector('.play_center_left').style.display = 'none';
          bigScreen.isSelections = false;
          clearInterval(bigScreen.timer2);
         },7000)
      }
    }
  }catch(e){
    console.log(e)
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
      if(areaObj.back){
        areaObj.back()
        return;
      };
      if(Cookies.get('backHome') == 'home'){
        // 从首屏推荐位直接进入的
        try {
          bi.end();
          Cookies.del('backHome');
          player.stop();
          player.toggleShow('hidePlayer');
          prompt("yanhua://epg/exit")
        } catch (e) {
          console.log(e)
        }
        return;
      }
      if (value.timers != null) {
        clearInterval(value.timers);
      }
      player.stop();
      player.toggleShow('hidePlayer');
      var backUrl = Cookies.get("backUrl") || "../../index.html";
      try {
        commonParams.asset_id = value.detailData.assetId;
        commonParams.item_id = value.detailData.itemList[indexSingle.itemNo].itemId
        commonParams.qb_datetime = Cookies.get('qb_datetime')
        commonParams.zb_datetime = (new Date()).valueOf()
        commonParams.time = commonParams.zb_datetime - commonParams.qb_datetime
        commonParams.ep = value.detailData.episodes
        commonParams.fee = value.detailData.itemList[indexSingle.itemNo].fee
        commonParams.isFullScreen = '1'
        commonParams.pos_id = Cookies.get('pos_id')
        commonParams.recmd_id = Cookies.get('recmd_id')
        commonParams.parent_page_type = '0301'
        commonParams.parent_page_id = value.detailData.assetId
        if(bigScreen.isFullScreen){
          commonParams.isFullScreen = '0'
        }
        bi.vod(commonParams)
      } catch (e) {
        console.log('错误信息' + e)
      }
      Cookies.set('pos_id', '', {
        path: '/'
      })
      Cookies.set('recmd_id', '', {
        path: '/'
      })
      window.location.href = backUrl;
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
//事件绑定
document.onkeydown = grepEvent;