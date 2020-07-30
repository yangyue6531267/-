var enter_time = new Date().getTime()
Cookies.set('qb_datetime', (new Date()).valueOf(), { path: '/' })

var value = {
  detailData: {},
  authCode: '3a',
  isBack: false,
  detailUrl: "",
  number: 0, //当前播放的集数
  code: "",
  msg: "",
  adInfo: '',//未来广告获取
  indexSingleLeft: 435, //单集滑块距离左边距离(为了适配盒子)
  indexSingWidth: 300, //单集滑动距离
  getValue: function () {
    loading();
    this.detailUrl = Cookies.get('detailUrl')
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
      value.detailData = JSON.parse(response).data;
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
          Cookies.set('pos_id', '', { path: '/' })
          Cookies.set('recmd_id', '', { path: '/' })
          var backUrl = Cookies.get('backUrl') || '../../index.html';
          window.location.href = backUrl;
        }, 3000)
        return;
      }
      var playUrl = value.detailData.itemList[0].vodList[0].playUrl
      var contentID = getParam('migu_play_url', playUrl);
      // var playUrl = 'http://ip:port?programId=YANHUA00000000043PITEM0097118357&file_name=20190613160207909e229185c&migu_play_url=1041000196';

      // login(uploadDom, contentID);
      // userPower(uploadDom, contentID)//鉴权回调
      userBMS(uploadDom, contentID)

      //限免
      // playConfig.isOrder = '1';
      // uploadDom();
      //限免

      // 页面访问上报
      var jump = Cookies.get('jump')
      if (jump) {
        jump = JSON.parse(jump)
        try {
          var jsonOb = {}
          jsonOb.page_type = '0301'
          jsonOb.page_id = JSON.parse(response).data.assetId
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
      Cookies.set('pos_id', '', { path: '/' })
      Cookies.set('recmd_id', '', { path: '/' })
      var backUrl = Cookies.get("backUrl") || "../../index.html";
      window.location.href = backUrl;
      // console.log(error);
    }
  })
}
function uploadDom() {
  loading('hidden');
  areaObj = topContent; //初始焦点赋值
  topContent.init();
  indexSingle.init();
  indexTotal.init();
  assetList.init();
  descriptionBox.init();
  collectData();
  qeryHistory();
  if (playConfig.isOrder == '1') {
    getId('btnBox2').innerHTML = '已订购 <span>VIP</span>';
    // getId('btnBox2').innerHTML = '限免 <span>VIP</span>';
  }
}

value.getValue();
getData(value.detailUrl)

var topContent = {
  btnNum: 0, //按钮编号
  isCollect: false, //收藏判断
  element: null, //dom操作元素
  init: function () { //初步渲染
    document.getElementById("name").innerHTML = '<span class="header-name">' + value.detailData.assetName + '</span>'
    document.getElementById("info").innerHTML = value.detailData.area + " | " + value.detailData.director + " | " + value.detailData.episodes + "集"
    document.getElementById("btnBox-1").innerHTML = value.detailData.description
    this.element = document.getElementById('btnBox')
    addClass(getId("btnBox" + topContent.btnNum), 'active') //初始化添加样式
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
    if (this.btnNum > 1) return
    removeClass(getId("btnBox" + topContent.btnNum), 'active')
    this.btnNum++
    addClass(getId("btnBox" + topContent.btnNum), 'active')
  },
  enter: function () {
    if (this.btnNum == -1) {
      document.getElementById('descriptionBox').style.visibility = "visible";
      areaObj = descriptionBox;
      return
    } else if (this.btnNum === 0) {
      try {
        playerBox.fullPlay();
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
      if (playConfig.isforbid == '1') {
        // 黑名单 禁止订购
        getId('blacklist').style.display = 'block';
        return
      };
      if (playConfig.isOrder == '1') {
        return
      }
      playerBox.hidePlayer();

      // 点击订购上报
      try {
        var param = {
          page_id: value.detailData.assetId,
          page_type: '0301'
        }
        bi.orderClick(param)

        Cookies.set('orderPkg', value.detailData.assetId, { path: '/' })
      } catch (error) {
        console.log('埋点错误', error)
      }
      var playUrl = value.detailData.itemList[indexSingle.itemNo].vodList[0].playUrl
      var contentID = getParam('migu_play_url', playUrl);

      unifiedOrder(contentID)
    }
  },
  back: function () {
    playerBox.hidePlayer();
    var backUrl = Cookies.get("backUrl") || "../../index.html";
    window.location.href = backUrl
  },
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
    try {
      commonParams.asset_id = value.detailData.assetId;
      commonParams.item_id = value.detailData.itemList[indexSingle.itemNo].itemId
      commonParams.qb_datetime = Cookies.get('qb_datetime')
      commonParams.zb_datetime = (new Date()).valueOf() + ''
      commonParams.time = playerBox.detailData.curPlayTime
      commonParams.ep = value.detailData.episodes + ''
      commonParams.fee = '1'
      commonParams.isFullScreen = '0'
      commonParams.pos_id = Cookies.get('pos_id')
      commonParams.recmd_id = Cookies.get('recmd_id')
      commonParams.parent_page_type = '0301'
      commonParams.parent_page_id = value.detailData.assetId
      if (indexSingle.itemNo > 0) {
        commonParams.fee = '2'
      }
      if (playerBox.detailData.curPlayTime > 0) {//避免播放器初始化未完成关闭发送点播日志
        bi.vod(commonParams)
      }
    } catch (e) {
      console.log('错误信息' + e)
    }
    Cookies.set('qb_datetime', (new Date()).valueOf(), { path: '/' })
    playerBox.playNext('play');
  },
  back: function () {
    playerBox.hidePlayer();
    var backUrl = Cookies.get("backUrl") || "../../index.html";
    window.location.href = backUrl
  },
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
  enter: function () { },
  back: function () {
    playerBox.hidePlayer();
    var backUrl = Cookies.get("backUrl") || "../../index.html";
    window.location.href = backUrl
  }
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

    Cookies.set('pos_id', '', { path: '/' })
    Cookies.set('recmd_id', '3', { path: '/' })

    // 刷新当前页
    areaObj = topContent
    var detailURL = this.data[this.itemNo].jsonUrl //存储详情页url
    Cookies.set('detailUrl', detailURL, {
      path: '/'
    })
    playerBox.hidePlayer();
    var pageUrl = window.location.href;
    window.location.replace(pageUrl);

    // try {
    //   //点播结束的推荐入口
    //   var chargeType = 0;
    //   if (indexSingle.itemNo > 0) {
    //     chargeType = 1;
    //   }
    //   var params = {
    //     type: 4,
    //     content: {
    //       type: 16,
    //       seriesID: value.detailData.assetId,
    //       programIdID: value.detailData.itemList[indexSingle.itemNo].itemId,
    //       chargeType: chargeType,
    //       resolution: 0,
    //       moveLength: playerBox.detailData.allTime,
    //       playID: getParam('migu_play_url', value.detailData.itemList[indexSingle.itemNo].vodList[0].playUrl),
    //       location: playerBox.detailData.curPlayTime
    //     }
    //   }
    //   if (playerBox.detailData.curPlayTime > 0) {
    //     adStat(params);
    //   }
    // } catch (e) {
    //   console.log(e);
    // }
  },
  back: function () {
    playerBox.hidePlayer();
    var backUrl = Cookies.get("backUrl") || "../../index.html";
    window.location.href = backUrl
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
  back: function () {
    playerBox.hidePlayer();
    var backUrl = Cookies.get("backUrl") || "../../index.html";
    window.location.href = backUrl
  },
}

var playerBox = {
  detailData: {
    curPlayTime: 0,
    allTime: '',
  },
  positionBar: 0,
  timer: null,
  fastTime: 15000,
  playUrl: '',
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
  init: function () {
    // playerBox.init();
    // http://gslbserv.itv.cmvideo.cn/20190613160207909e229185c.ts?channel-id=yanhuasp&Contentid=1041000196&authCode=3a&stbId=005903FF000100606001C0132B043D08&usergroup=g29097100000&userToken=6a83ea9ccbeaef860d6149adf107314029pb

    //全屏初始化
    if (playerBox.timer) {
      clearInterval(playerBox.timer);
    }
    playerBox.timer = setInterval(function () {
      getId('totalTime').innerHTML = secondToDate(playerBox.detailData.allTime / 1000);
      // { "allTime": "885720", "curPlayTime": "940", "tag": "onProgress" }
      getId('currTime').innerHTML = secondToDate(playerBox.detailData.curPlayTime / 1000);
      getId('currBox').innerHTML = secondToDate(playerBox.detailData.curPlayTime / 1000);
      var currProgress = playerBox.detailData.curPlayTime / playerBox.detailData.allTime * 92;
      getId('currBar').style.width = currProgress + "%";
      getId('currBox').style.left = currProgress + "%";
    }, 200);
  },
  uploadPlayStatus: function (res) {
    if (playerBox.pauseStatus == 1) return
    if (res) {
      this.detailData = res;
    }
  },
  updateBar: function () {
    playerBox.pauseStatus = 0;
    player.seekTime({ 'seekTime': playerBox.positionBar });
    playerBox.showBar();
  },
  showPause: function () {
    // 隐藏暂停ui
    getId('pause').style.visibility = "visible";
    playerBox.showBar();
  },
  hiddenPause: function () {
    // 隐藏暂停ui
    getId('pause').style.visibility = "hidden";
    debounce(playerBox.hiddenBar, 3000);
  },
  showBar: function () {
    // 显示播放器进度条
    if (playerBox.status == 2) return;
    getId('footerPlayer').style.visibility = "visible";
    if (playerBox.status == 0) return
    debounce(playerBox.hiddenBar, 3000);
  },
  hiddenBar: function () {
    // 隐藏播放器进度条
    if (playerBox.status == 0) return;
    getId('footerPlayer').style.visibility = "hidden";
  },
  fullPlay: function () {
    //全屏
    // if (playerBox.status != 1) return
    areaObj = playerBox;
    playerBox.isfullPlay = true;
    getId('box-wrap').style.visibility = 'hidden';
    player.upPlayerLocation({ x: 0, y: 0, w: -1, h: -1 });
    removeClass(getId('playLoading'), 'minLoading');

    try {
      //点播调出选集页
      var chargeType = 0;
      if (indexSingle.itemNo > 0) {
        chargeType = 1;
      }
      var params = {
        type: 4,
        content: {
          type: 14,
          seriesID: value.detailData.assetId,
          programIdID: getParam('programId', value.detailData.itemList[indexSingle.itemNo].vodList[0].playUrl),
          chargeType: chargeType,
          resolution: 0,
          moveLength: playerBox.detailData.allTime,
          location: playerBox.detailData.curPlayTime,
          playID: getParam('migu_play_url', value.detailData.itemList[indexSingle.itemNo].vodList[0].playUrl)
        }
      }
      if (playerBox.detailData.curPlayTime > 0) {
        stat(params);
      }

      var chargeType = 0;
      if (indexSingle.itemNo > 0) {
        chargeType = 1;
      }
      var params = {
        type: 4,
        content: {
          type: 15,
          seriesID: value.detailData.assetId,
          programIdID: getParam('programId', value.detailData.itemList[indexSingle.itemNo].vodList[0].playUrl),
          chargeType: chargeType,
          resolution: 0,
          moveLength: playerBox.detailData.allTime,
          location: playerBox.detailData.curPlayTime,
          playID: getParam('migu_play_url', value.detailData.itemList[indexSingle.itemNo].vodList[0].playUrl)
        }
      }
      if (playerBox.detailData.curPlayTime > 0) {
        stat(params);
      }
    } catch (e) {
      console.log(e);
    }
    try {
      //点播调出选集页
      var chargeType = 0;
      if (indexSingle.itemNo > 0) {
        chargeType = 1;
      }
      var params = {
        type: 4,
        content: {
          type: 15,
          seriesID: value.detailData.assetId,
          programIdID: getParam('programId', value.detailData.itemList[indexSingle.itemNo].vodList[0].playUrl),
          chargeType: chargeType,
          resolution: 0,
          moveLength: playerBox.detailData.allTime,
          location: playerBox.detailData.curPlayTime,
          playID: getParam('migu_play_url', value.detailData.itemList[indexSingle.itemNo].vodList[0].playUrl)
        }
      }
      if (playerBox.detailData.curPlayTime > 0) {
        stat(params);
      }
    } catch (e) {
      console.log(e);
    }
  },
  minPlay: function () {
    // 小屏播放器
    getId('footerPlayer').style.visibility = "hidden";
    getId('pause').style.visibility = "hidden";
    getId('box-wrap').style.visibility = 'visible';

    addClass(getId('playLoading'), 'minLoading');
    if (this.status == 0) {
      player.togglePlay('resume');
    }
    areaObj = topContent;
    playerBox.isfullPlay = false;
    setTimeout(function () {//避免大小屏切换导致dom渲染慢
      player.setDisplayerLocation({ x: 50, y: 52, w: 470, h: 270 });
    }, 100);
    try {
      //点播调出详情页
      var chargeType = 0;
      if (indexSingle.itemNo > 0) {
        chargeType = 1;
      }
      var params = {
        type: 4,
        content: {
          type: 5,
          seriesID: value.detailData.assetId,
          programIdID: getParam('programId', value.detailData.itemList[indexSingle.itemNo].vodList[0].playUrl),
          chargeType: chargeType,
          resolution: 0,
          moveLength: playerBox.detailData.allTime,
          location: playerBox.detailData.curPlayTime,
          playID: getParam('migu_play_url', value.detailData.itemList[indexSingle.itemNo].vodList[0].playUrl)
        }
      }
      if (playerBox.detailData.curPlayTime > 0) {
        stat(params);
      }
    } catch (e) {
      console.log(e);
    }
    try {
      //点播调出选集页
      var chargeType = 0;
      if (indexSingle.itemNo > 0) {
        chargeType = 1;
      }
      var params = {
        type: 4,
        content: {
          type: 6,
          seriesID: value.detailData.assetId,
          programIdID: getParam('programId', value.detailData.itemList[indexSingle.itemNo].vodList[0].playUrl),
          chargeType: chargeType,
          resolution: 0,
          moveLength: playerBox.detailData.allTime,
          location: playerBox.detailData.curPlayTime,
          playID: getParam('migu_play_url', value.detailData.itemList[indexSingle.itemNo].vodList[0].playUrl)
        }

      }
      if (playerBox.detailData.curPlayTime > 0) {
        stat(params);
      }
    } catch (e) {
      console.log(e);
    }
  },
  hidePlayer: function () {
    try {
      commonParams.asset_id = value.detailData.assetId;
      commonParams.item_id = value.detailData.itemList[indexSingle.itemNo].itemId
      commonParams.qb_datetime = Cookies.get('qb_datetime')
      commonParams.zb_datetime = (new Date()).valueOf() + ''
      commonParams.time = playerBox.detailData.curPlayTime
      commonParams.ep = value.detailData.episodes + ''
      commonParams.fee = '1'
      commonParams.isFullScreen = '0'
      commonParams.pos_id = Cookies.get('pos_id')
      commonParams.recmd_id = Cookies.get('recmd_id')
      commonParams.parent_page_type = '0301'
      commonParams.parent_page_id = value.detailData.assetId
      if (indexSingle.itemNo > 0) {
        commonParams.fee = '2'
      }
      if (playerBox.detailData.curPlayTime > 0) {//避免播放器初始化未完成关闭发送点播日志
        bi.vod(commonParams)
      }
    } catch (e) {
      console.log('错误信息' + e)
    }
    Cookies.set('qb_datetime', (new Date()).valueOf(), { path: '/' })
    getId('imgBig').style.display = 'block';
    player.stop();
    player.toggleShow('hidePlayer');
  },
  play: function () {
    // var playUrl = 'http://ip:port?programId=YANHUA00000000043PITEM0097118357&file_name=20190613160207909e229185c&migu_play_url=1041000196';
    // var playUrl = 'http://gslbserv.itv.cmvideo.cn/20180626151640187bcda1ef0.ts?channel-id=yanhuasp&Contentid=1041001719&authCode=3a&stbId=005903FF000100606001C0132B043D08&usergroup=g29097100000&userToken=6a83ea9ccbeaef860d6149adf107314029pb';
    // if (indexSingle.indexPlay == 0) {
    //   playUrl = 'http://gslbserv.itv.cmvideo.cn/20190613160207909e229185c.ts?channel-id=yanhuasp&Contentid=1041000196&authCode=3a&stbId=005903FF000100606001C0132B043D08&usergroup=g29097100000&userToken=6a83ea9ccbeaef860d6149adf107314029pb';
    // }
    var playUrl = value.detailData.itemList[indexSingle.itemNo].vodList[0].playUrl
    playerBox.playUrl = playUrl;
    playerBox.minPlay();
    player.initPlayer();
    player.toggleShow('showPlayer');
    player.setCallback(videoStateChange);
    player.play(value.authCode, playUrl);
    playRecord()
  },
  playNext: function (curr) {
    if (indexSingle.itemNo > 0 && playConfig.isforbid == '1') {
      // 黑名单，第二集不能看，不能跳订购
      getId('blacklist').style.display = 'block'
      return
    };
    if (curr == 'next') {
      //自动跳转下一集
      if (indexSingle.itemNo + 1 < indexSingle.data.length) {
        indexSingle.itemNo++;
        if (indexSingle.itemNo > 0 && playConfig.isforbid == '1') {
          // 黑名单，第二集不能看，不能跳订购
          getId('blacklist').style.display = 'block'
          return
        };
      }
      else {
        indexSingle.itemNo = 0;
      }
      indexSingle.indexPlay = indexSingle.itemNo;
      if (playConfig.isOrder == '1') {
        if (indexSingle.itemNo >= indexSingle.data.length) return;
        if (playerBox.status != -2) {
          // var playUrl = 'http://ip:port?programId=YANHUA00000000043PITEM0097118357&file_name=20190613160207909e229185c&migu_play_url=1041000196';
          // var playUrl = 'http://gslbserv.itv.cmvideo.cn/20180626151640187bcda1ef0.ts?channel-id=yanhuasp&Contentid=1041001719&authCode=3a&stbId=005903FF000100606001C0132B043D08&usergroup=g29097100000&userToken=6a83ea9ccbeaef860d6149adf107314029pb';
          var playUrl = value.detailData.itemList[indexSingle.itemNo].vodList[0].playUrl;
          playerBox.playUrl = playUrl;
          indexSingle.initPayActive();
          indexSingle.uploadIndexPay();
          player.stop();
          player.play(value.authCode, playUrl);
          playRecord()
        } else {
          //播放器未初始化
          playerBox.play();
        }
      } else {
        var playUrl = value.detailData.itemList[indexSingle.itemNo].vodList[0].playUrl
        var contentID = getParam('migu_play_url', playUrl);
        unifiedOrder(contentID);
      }
    } else {
      if (indexSingle.itemNo > 0 && playConfig.isforbid == '1') {
        // 黑名单，第二集不能看，不能跳订购
        getId('blacklist').style.display = 'block'
        return
      };
      if (indexSingle.itemNo > 0 && playConfig.isOrder != '1') {
        var playUrl = value.detailData.itemList[indexSingle.itemNo].vodList[0].playUrl
        var contentID = getParam('migu_play_url', playUrl);
        unifiedOrder(contentID);
      } else {
        // var playUrl = 'http://gslbserv.itv.cmvideo.cn/20180626151640187bcda1ef0.ts?channel-id=yanhuasp&Contentid=1041001719&authCode=3a&stbId=005903FF000100606001C0132B043D08&usergroup=g29097100000&userToken=6a83ea9ccbeaef860d6149adf107314029pb';
        // if (indexSingle.indexPlay == 0) {
        //   playUrl = 'http://gslbserv.itv.cmvideo.cn/20190613160207909e229185c.ts?channel-id=yanhuasp&Contentid=1041000196&authCode=3a&stbId=005903FF000100606001C0132B043D08&usergroup=g29097100000&userToken=6a83ea9ccbeaef860d6149adf107314029pb';
        // }
        var playUrl = value.detailData.itemList[indexSingle.itemNo].vodList[0].playUrl
        playerBox.playUrl = playUrl;
        player.stop();
        player.play(value.authCode, playUrl);
        playRecord()
      }
    }
  },
  up: function () { },
  down: function () { },
  left: function () {
    if (playerBox.detailData.curPlayTime == 0 || playerBox.detailData.curPlayTime == '') return
    // playerBox.detailData.curPlayTime
    playerBox.pauseStatus = 1;//暂停接收回调状态，
    playerBox.positionBar = Number(playerBox.detailData.curPlayTime) - playerBox.fastTime;
    if (playerBox.positionBar <= 0) {
      playerBox.detailData.curPlayTime = 0;
      playerBox.positionBar = 0;
    } else {
      playerBox.detailData.curPlayTime = playerBox.positionBar;
    }
    debounce(playerBox.updateBar, 200);
  },
  right: function () {
    if (playerBox.detailData.curPlayTime == 0 || playerBox.detailData.curPlayTime == '' || this.status == 2 || this.status == -2) return
    playerBox.pauseStatus = 1;
    playerBox.positionBar = Number(playerBox.detailData.curPlayTime) + playerBox.fastTime;
    if (playerBox.positionBar > playerBox.detailData.allTime) {
      playerBox.detailData.curPlayTime = playerBox.detailData.allTime
    } else {
      playerBox.detailData.curPlayTime = playerBox.positionBar;
    }
    console.log('快进到的时间' + playerBox.positionBar);
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
    this.minPlay();
  },
  seekTime: function (to) {
    var currTime = Number(playerBox.detailData.curPlayTime) + playerBox.fastTime;
    // player.seekTime({ 'seekTime': currTime });
    playerBox.showBar();

  },
  onStart: function (res) {
    playerBox.pauseStatus = 0;
    // console.log('onStart-------------------' + JSON.stringify(res))
    // this.detailData = res;
  },
  onPlay: function (res) {
    // playerBox.hiddenBar();//
    getId('footerPlayer').style.visibility = "hidden";
    getId('pause').style.visibility = "hidden";
    getId('imgBig').style.display = 'none';
    this.detailData = res;
    playerBox.init();
    this.status = 1;
    console.log('onPlay-------------------' + JSON.stringify(res))
  },
  onPause: function (res) {
    this.status = 0;
    console.log('onPause-------------------' + JSON.stringify(res))
  },
  onResume: function (res) {
    this.status = 1;
    console.log('onResume-------------------' + JSON.stringify(res))
  },
  onStop: function (res) {
    this.status = 0;
    console.log('onStop-------------------' + JSON.stringify(res))
  },
  onCompleted: function (res) {
    playerBox.pauseStatus = 1;
    // this.detailData = res;
    this.status = 2;
    getId('pause').style.visibility = "hidden";
    getId('footerPlayer').style.visibility = "hidden";

    //播放完毕操作
    console.log('onCompleted-------------------' + JSON.stringify(res));
    try {
      commonParams.asset_id = value.detailData.assetId;
      commonParams.item_id = value.detailData.itemList[indexSingle.itemNo].itemId
      commonParams.qb_datetime = Cookies.get('qb_datetime')
      commonParams.zb_datetime = (new Date()).valueOf() + ''
      commonParams.time = res.allTime
      commonParams.ep = value.detailData.episodes
      commonParams.fee = '1'
      commonParams.isFullScreen = '0'
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
    Cookies.set('qb_datetime', (new Date()).valueOf(), { path: '/' })
    playerBox.detailData.curPlayTime = 0;
    this.playNext('next');
  },
  onError: function (res) {
    this.detailData = null;
    this.status = 3;
    console.log('onError-------------------' + JSON.stringify(res))
  },
  onScreenChange: function (res) {
    console.log('onScreenChange-------------------' + JSON.stringify(res))
  },
  onBufferingStart: function (res) {
    // this.status = -1;
    console.log('onBufferingStart-------------------' + JSON.stringify(res))
    getId('playLoading').style.display = 'block';
  },
  onBufferfinish: function (res) {
    console.log('onBufferfinish-------------------' + JSON.stringify(res))
    getId('playLoading').style.display = 'none';
  },
  onProgress: function (res) {
    playerBox.uploadPlayStatus(res);
    console.log('onProgress-------------------' + JSON.stringify(res));
  },
}

//生命周期回调，避免设置，首页按键切出去切回来播放器bug
function registerLifecycleCallback(res) {
  console.log('registerLifecycleCallback' + JSON.stringify(res));
  try {
    if (res.status == 3 || res.status == 4) {
      var time = Math.floor(playerBox.detailData.curPlayTime / 1000) || 0
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
      res = JSON.parse(res);
    }
    if (res.code !== 200) return
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
  var relateTime = '0';
  if (playerBox.detailData.curPlayTime > 0) {
    relateTime = playerBox.detailData.curPlayTime;
  }
  if (value.detailData.score && value.detailData.score.length == 1) {
    relateScore += '0'
  }
  var data = '{"siteId":' + '"' + yh.siteId + '"' + ',"relateEpisode":' + '"' + relateEpisode + '"' + ',"relateTime":' + '"' + relateTime + '"' + ',"userId":' + '"' + yh.userId + '"' + ',"collectType":' + '"' + collectType + '"' + ',"relateId":' + '"' + relateId + '"' + ',"relateTitle":' + '"' + relateTitle + '"' + ',"relateImg":' + '"' + relateImg + '"' + ',"relateUrl":' + '"' + relateUrl + '"' + ',"relateLayout":' + '"' + relateLayout + '"' + ',"relateScore":' + '"' + relateScore + '"' + '}';
  var urls = historylUrl + '/collect?version=1';
  getYhSpecialSC(urls, data)
};

function qeryHistory() {
  // 查询播放记录
  var url = historylUrl + '/list?version=1&siteId=' + yh.siteId + '&userId=' + yh.userId + '&pindex=0&psize=16&collectType=3'
  getCollectionList(url, function (response) {
    if (JSON.parse(response).code !== 200) {
      console.log('查询播放记录')
    } else {
      if (playConfig.isOrder == '1') {
        for (var i = 0; i < JSON.parse(response).data.resultList.length; i++) {
          var element = JSON.parse(response).data.resultList[i];
          if (element.relateId == value.detailData.assetId) {
            // 有播放记录，并返回集数
            indexSingle.itemNo = element.relateEpisode - 1
            indexSingle.indexPlay = indexSingle.itemNo
            document.getElementById('slider1').style.left = value.indexSingleLeft + -value.indexSingWidth * indexSingle.itemNo + 'px'; //单集按钮滚动
            if (indexSingle.itemNo >= 10) { //单集跳转10的倍数，触发总集数滚动
              indexTotal.itemNo = Math.floor(indexSingle.itemNo / 10)
              indexTotal.element.style.left = 530 + -100 * indexTotal.itemNo + 'px'; //单集按钮滚动
            }
          }
        }
      }
    }
    // 初始化播放器
    indexSingle.uploadIndexPay();
    try {
      playerBox.play();
    } catch (error) {

    }
  },
    function (response) {
      // 初始化播放器
      indexSingle.uploadIndexPay();
      try {
        playerBox.play();
      } catch (error) {

      }
    })
}

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
//事件绑定
document.onkeydown = grepEvent;