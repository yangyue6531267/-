var enter_time = new Date().getTime()
Cookies.set('qb_datetime', (new Date()).valueOf(), {path: '/'})
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

var value = {
  detailData: {},
  isBack: false,
  detailUrl: "",
  list:null,
  number: 0, //当前播放的集数
  code: "",
  msg: "",
  historytime:{
    time:0,
    id:0,
    index:0
  },
  indexSingleLeft: 435, //单集滑块距离左边距离(为了适配盒子)
  indexSingWidth: 300, //单集滑动距离
  getValue: function () {
    this.detailUrl = Cookies.get('detailUrl');
    if (this.detailUrl.indexOf('itemSort') == -1) {
      this.detailUrl += "&itemSort=1";
    }
  },
}
var getData = function (url) {
  ajax({
    type: "GET",
    url: url,
    data: {},
    dataType: "json",
    success: function (response) {
      value.detailData = eval("(" + response + ")").data;
      if (Cookies.get(value.detailData.assetId)) {
        value.historytime = JSON.parse(Cookies.get(value.detailData.assetId))
      }
      console.warn(JSON.stringify(value.historytime));
      value.list = value.detailData.itemList;
      if (!value.detailData) {//资产下线/不存在，返回
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
          Cookies.set('pos_id', '', {path: '/'})
          Cookies.set('recmd_id', '', {path: '/'})
          if (value.timers!=null) {
            clearInterval(value.timers);
          }
          player.stop()
          var backUrl = Cookies.get('backUrl') || '../../index.html';
          window.location.href = backUrl;
        }, 3000)
        return;
      }
      // var contentID = value.detailData.itemList[0].vodList[0].playUrl.split(":")[2];
      var contentID = "4440000000052373";
      // 4440000000052373  4440000000052504  4440000000052357
      userPower(uploadDom, contentID)//鉴权回调
      // 页面访问上报
      var jump = Cookies.get('jump')
      if (jump) {
        jump = eval('(' + jump + ')')
        try {
          var jsonOb = {}
          jsonOb.page_type = '0301'
          jsonOb.page_id = eval('(' + response + ')').data.assetId
          jsonOb.parent_page_type = jump.parent_page_type
          jsonOb.parent_page_id = jump.parent_page_id
          bi.jump(jsonOb)
          Cookies.set('jump', '', { path: '/' })
        } catch (error) {
          console.log('埋点错误', error)
        }
      }
    },
    fail: function (error) {
      Cookies.set('pos_id', '', {path: '/'})
      Cookies.set('recmd_id', '', {path: '/'})
      var backUrl = Cookies.get("backUrl") || "../../index.html";
      window.location.href = backUrl;
      // console.log(error);
    }
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
  topContent.play(value.historytime);
  if (Cookies.get(value.detailData.assetId)) {
    // 有播放记录，并返回集数
    indexSingle.itemNo = value.historytime.index*1;
    
    indexSingle.indexPlay = indexSingle.itemNo;
    document.getElementById('slider1').style.left = value.indexSingleLeft + -value.indexSingWidth * indexSingle.itemNo + 'px'; //单集按钮滚动
    if (indexSingle.itemNo > 10) { //单集跳转10的倍数，触发总集数滚动
      indexTotal.itemNo = Math.floor(indexSingle.itemNo / 10)
      indexTotal.element.style.left = 530 + -100 * indexTotal.itemNo + 'px'; //单集按钮滚动
    }
  }
  playConfig.isOrder = Cookies.get('isOrder') || 1;
  if (playConfig.isOrder == 0) {
    getId('btnBox2').innerHTML = '已订购 <span>VIP</span>';
  }
}

value.getValue();
getData(value.detailUrl)

var topContent = {
  btnNum: 0, //按钮编号
  isCollect: false, //收藏判断
  element: null, //dom操作元素
  curPlayTime:0,
  isPlay:true,
  timers:null,
  init: function () { //初步渲染
    if (!this.isPlay) {
      // 是否付费
      document.getElementById("imgBig").insertAdjacentHTML('beforeend', '<img src="' + value.detailData.assetImg + '"/>');
    }
    document.getElementById("name").innerHTML = '<span class="header-name">' + value.detailData.assetName + '</span>'
    document.getElementById("info").innerHTML = value.detailData.area + " | " + value.detailData.director + " | " + value.detailData.episodes + "集"
    document.getElementById("btnBox-1").innerHTML = value.detailData.description
    this.element = document.getElementById('btnBox')
    addClass(getId("btnBox" + topContent.btnNum), 'active') //初始化添加样式
    
  },
  play:function(obj){
    try {
      topContent.initPlayer();
      player.setCallback(player.videoStateChange);
      player.setDisplayerLocation({x:60, y:60, w:560, h:315});
      player.toggleShow('showPlayer');
      // yh.showPlayer();
      // var playUrl = obj.index
      // var playUrl ='http://devimages.apple.com.edgekey.net/streaming/examples/bipbop_4x3/gear2/prog_index.m3u8'
      var playUrl ="http://117.156.27.148/270000000122/6990015801111110000000000415021/XXSX2S0018.ts";

      if (obj.time) {
        var time = obj.time;
      }else{
        var time = 0;
      }
      var OpJson ={
        playUrl:playUrl,
        historyTime:time
      }
      player.play(OpJson)
      
    } catch (error) {
      console.log(error);
      console.log('播放器初始化失败');
    }
  },
  initPlayer: function (){
    videoOptions.onStart = function (res){
      console.log('准备播放')
    }
    videoOptions.onPlay = function (res){
      console.log('开始播放')
    }
    videoOptions.onProgress = function (res){
      console.log('每秒调用');
      topContent.curPlayTime = res.curPlayTime;
      // playmode.refreshProgressView(res.curPlayTime,res.allTime);    
    }
    videoOptions.onPause = function (res){
        console.log('暂停')
        // playmode.stopPlay = true;
    }
    videoOptions.onResume = function (res){
        console.log('续播')
        // playmode.cachePlayTime =-1;
        // playmode.stopPlay = false;
    }
    videoOptions.onStop = function (res){
        console.log('手动停止')
        playRecord();
        if (value.historytime.index == indexSingle.itemNo) {
          var json = {
            time: topContent.curPlayTime,
            index:indexSingle.itemNo};
        }else{
          var json = {
            time: 0,
            index:indexSingle.itemNo};
        }
        Cookies.set(value.detailData.assetId, JSON.stringify(json),{
          path: '/'
        })
    }
    videoOptions.onCompleted = function (res){
        console.log('播放完毕')
        topContent.playNext();
        playRecord();
        var json = {time: topContent.curPlayTime,
          index:indexSingle.itemNo*1+1};
        Cookies.set(value.detailData.assetId, JSON.stringify(json),{
          path: '/'
        })
    }
    videoOptions.onError = function (res){
        console.log('报错')
    }
  },
  playNext: function (){
    if (value.timers!=null) {
      clearInterval(value.timers);
    }
    player.stop();
    console.log("切集钱"+indexSingle.itemNo)
      if (indexSingle.itemNo>=value.list.length-1) {
        // var backUrl = Cookies.get('backUrl')
        assetList.removeCss();
        indexSingle.itemNo = 0;
        assetList.addCss();
      } else {
        assetList.removeCss();
        indexSingle.itemNo = indexSingle.itemNo*1+1;
        assetList.addCss();
      try {
          player.setDisplayerLocation({x:60, y:60, w:560, h:315});
          player.toggleShow('showPlayer');
          var playUrl ="http://117.156.27.148/270000000122/6990015801111110000000000415021/XXSX2S0018.ts";
          // var playUrl ='http://devimages.apple.com.edgekey.net/streaming/examples/bipbop_4x3/gear2/prog_index.m3u8'
          // var playUrl = value.list[indexSingle.itemNo].vodList[0].playUrl;
          var OpJson ={
            playUrl:playUrl,
            historyTime:0
          }
          player.play(OpJson)
        } catch (error) {
          console.log(error);
          console.log('播放器初始化失败');
        }
        console.log("切集后"+indexSingle.itemNo)
      }
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
      try {
        if (yh.playStatus == 1) {
        return
        }
        player.stop();
          window.location.href = './../video/player.html'
      } catch (error) { 
        
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
      player.stop();
      // var contentID = indexSingle.data[indexSingle.itemNo].vodList[0].playUrl.split(":")[2];
      window.location.href = './../gansu_payfor/index.html'
      var contentID = "4440000000052373";
      unifiedOrder(contentID)
    }
  }
}

var indexSingle = {
  data: {},
  element: null,
  itemNo: 0,
  indexPlay: 0,
  init: function () {
    this.data = value.detailData.itemList;
    this.element = document.getElementById('slider1');
    var html = '';
    for (var i = 0; i < this.data.length; i++) {
      var div = '<div class="buttomNum" id="buttomNum' + i + '">' + this.data[i].itemName + '</div>';
      html += div;
    };
    this.element.innerHTML = html;
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
    var length = strlen(div.innerHTML);
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
    this.initPayActive();
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
    this.indexPlay = this.itemNo
    this.addCss();
    var supercid = this.data[this.itemNo].vodList[0].playUrl.split(":")[0];
    var cid = this.data[this.itemNo].vodList[0].playUrl.split(":")[1];
    console.log('supercid为:' + supercid + 'cid为：' + cid);
    try {
      // 订购
      // if(this.itemNo>0&&playConfig.isOrder!=0){
      //   player.stop();
      //   // var contentID = indexSingle.data[indexSingle.itemNo].vodList[0].playUrl.split(":")[2];
      //   var contentID = "4440000000052373";
      //   unifiedOrder(contentID)
      // }else{
          player.stop();
          
          window.location.href = './../video/player.html'
      // console.log(window.videoDetailUrl);
      // }
    } catch (error) { 
      
    }
    try {
      commonParams.asset_id = value.detailData.assetId;
      commonParams.item_id = value.detailData.itemList[indexSingle.itemNo].itemId
      commonParams.qb_datetime = Cookies.get('qb_datetime')
      commonParams.zb_datetime = (new Date()).valueOf()
      commonParams.time = commonParams.zb_datetime - commonParams.qb_datetime
      commonParams.ep = value.detailData.episodes
      commonParams.fee = '1'
      commonParams.isFullScreen = '1'
      commonParams.pos_id = Cookies.get('pos_id')
      commonParams.recmd_id = Cookies.get('recmd_id')
      commonParams.parent_page_type = '0301'
      commonParams.parent_page_id = value.detailData.assetId
      if (indexSingle.itemNo > 0) {
        commonParams.fee = '2'
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
  enter: function () { }

}

var assetList = {
  data: {},
  itemNo: 0,
  element: null,
  init: function () {
    this.data = value.detailData.assetList
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

  down: function () { },

  left: function () {
    if (this.itemNo === 0) return
    if (this.itemNo >= 4) {
      this.element.style.left = -(this.itemNo - 4) * 196 + 60 + "px"
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
      this.element.style.left = -(this.itemNo - 4) * 196 + 60 + "px"
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
    Cookies.set('jump', jump, { path: '/' })

    Cookies.set('pos_id', '', {path: '/'})
    Cookies.set('recmd_id', '3', {path: '/'})
    
    // 停止播放
    player.togglePlay('pause');
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
}

function logup(jsonOb) {
  console.log('BI log:' + jsonOb)
  ajax({ // 入口数据
    type: "POST",
    url: logAddress,
    contentType: 'application/json',
    data: jsonOb,
    dataType: "json",
    success: function (data) {
      console.log('bi 日志发生完毕');
    },
    error: function (err) {
      console.log(err)
    }
  });
}


// 播放鉴权
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
  getYhSpecialList_nc(url, function (res) {
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
  console.warn(url);
  getCollectionList(url, function (response) {
    var obj = {
      name: value.detailData.assetName,
      vod_id: value.detailData.itemList[0].vodList[0].playUrl,
      typeId: '10000100000000090000000000111398', //教育栏目id 不会有其他类型栏目注入，
      flag: 11,
      index: 1,
      time:0
    }
    
    if (eval('(' + (response) + ')').code !== 200) { } else {
      // if (Cookies.get('isOrder') && Cookies.get('isOrder') == 0) {
      for (var i = 0; i < eval('(' + (response) + ')').data.resultList.length; i++) {
        var element = eval('(' + (response) + ')').data.resultList[i];
        console.warn(JSON.stringify(element));
        console.warn(JSON.stringify(value.detailData.assetId));

        if (element.relateId == value.detailData.assetId) {
          // 有播放记录，并返回集数
          indexSingle.itemNo = element.relateEpisode*1 - 1;
          
          indexSingle.indexPlay = indexSingle.itemNo
          document.getElementById('slider1').style.left = value.indexSingleLeft + -value.indexSingWidth * indexSingle.itemNo + 'px'; //单集按钮滚动
          if (indexSingle.itemNo > 10) { //单集跳转10的倍数，触发总集数滚动
            indexTotal.itemNo = Math.floor(indexSingle.itemNo / 10)
            indexTotal.element.style.left = 530 + -100 * indexTotal.itemNo + 'px'; //单集按钮滚动
          }
          obj.index = element.relateEpisode || 1;
          obj.vod_id = value.detailData.itemList[indexSingle.itemNo].vodList[0].playUrl;
          obj.time = element.relateTime*1;
        }
      }
      // }
    }
    // alert('播放记录的小窗播放')
    indexSingle.uploadIndexPay();
    topContent.play(obj);
  }, 
  function (response) {
    // 初始化播放器
  })
}

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
        if (value.timers!=null) {
          clearInterval(value.timers);
        }
      player.stop();
      var backUrl = Cookies.get("backUrl") || "../../index.html";
        try {
          commonParams.asset_id = value.detailData.assetId;
          commonParams.item_id = value.detailData.itemList[indexSingle.itemNo].itemId
          commonParams.qb_datetime = Cookies.get('qb_datetime')
          commonParams.zb_datetime = (new Date()).valueOf()
          commonParams.time = commonParams.zb_datetime - commonParams.qb_datetime
          commonParams.ep = value.detailData.episodes
          commonParams.fee = '1'
          commonParams.isFullScreen = '1'
          commonParams.pos_id = Cookies.get('pos_id')
          commonParams.recmd_id = Cookies.get('recmd_id')
          commonParams.parent_page_type = '0301'
          commonParams.parent_page_id = value.detailData.assetId
          if (indexSingle.itemNo > 0) {
            commonParams.fee = '2'
          }
          bi.vod(commonParams)
        } catch (e) {
          console.log('错误信息' + e)
        }
      Cookies.set('pos_id', '', {path: '/'})
      Cookies.set('recmd_id', '', {path: '/'})
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