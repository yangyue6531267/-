var ptJson = {
  //设置模式
  ptStyle: "RELEASE",
  ptHost: function () {
    if (this.ptStyle == "RELEASE") {
      //发布模式
      return "/";
    } else if (this.ptStyle == "DEV") {
      //开发模式
      return "http://localhost:8081/api/";
    }
  }
};

var value = {
  //详情页数据请求所需参数
  JsonUrl: "",
  josnData: '',
  userFlag: "", // 用户标识
  userToken: "", // 用户token
  contentID: "", // 节目唯一标识
  productIDs: "", //开机认证的已订购产品
  productID: "",
  contentID: "",
  mac: "",
  userID: "",
  isPlay: 0,
  itemNo: 0,
  isBack: false, //大窗口或者订购页返回
  lastURL: "",
  onOrderFrom: "left",
  orderImg: "",
  orderBack: false,
  fromOut: false,
  getValue: function () {
    this.mac = window.Cookies.get("mac");
    var oGetVars = {};
    var comeUrl = window.location.href;
    if (comeUrl.indexOf("indexUrl") != -1 && comeUrl.indexOf("from=order") == -1) {
      this.fromOut = true;
      var lastURL = document.referrer;
      var cObj = "lastURL=" + lastURL + "; path=/";
      document.cookie = cObj;
      getInfo(); //获取详情信息
    }
    this.lastURL = window.Cookies.get("lastURL");
    if (window.location.search.length > 1) {
      //从url里面拿到所需键值
      for (
        var aItKey,
          nKeyId = 0,
          aCouples = window.location.search.substr(1).split("&"); nKeyId < aCouples.length; nKeyId++
      ) {
        aItKey = aCouples[nKeyId].split("=");
        oGetVars[decodeURIComponent(aItKey[0])] =
          aItKey.length > 1 ? decodeURIComponent(aItKey[1]) : "";
      }
    }
    console.log(oGetVars);
    this.JsonUrl = decodeURI(oGetVars.JsonUrl);
    if (oGetVars.indexUrl == "window.location.href") {
      this.fromOut = true
    }

    if (oGetVars.from == "order") {
      this.isBack = true;
      this.orderBack = true;
      this.programId = window.Cookies.get("DprogramId");
      this.folderId = window.Cookies.get("DfolderId");
      this.isPlay = window.Cookies.get("DisPlay");
      getInfo(); //获取详情信息
    }
    if (oGetVars.from == "player") {
      this.isBack = true;
      this.isPlay = oGetVars.subindex;
    }
  }
};
$(value.getValue()); //获取参数

var getInfo = function () {
  //获取详情数据
  getJsonCallback(value.JsonUrl, function (res) {
    console.log(res);
    value.josnData = res.data;
    $(".detail .description").text(value.josnData.description);
    seriesDetail.init(value.josnData);
    try {
      getFavorits(); //判断是否收藏
    } catch (error) {
      console.log('超时')
    }
  }, function (err) {
    console.log(err)
    if (value.isBack) {
      value.isBack = false;
      var preURL = window.Cookies.get("prePage");
      window.location = preURL;
    } else {
      history.go(-1);
    }
  })
};

var getFavorits = function () {
  //判断收藏
  var url = historylUrl +
    "/list?version=1&siteId=" + yh.siteId + "&userId=" + yh.userId +
    "&relateId=" + value.josnData.assetId + "&collectType=1"
  getYhSpecialList_nc(url, function (res) {
    console.log(res)
    if (typeof (res) == "string") {
      res = eval('(' + res + ')');
    }
    if (res.data.resultNum * 1 === 1) {
      $("#btn2 .isFavorit").show();
      $("#btn2 .noFavorit").hide();
    } else {
      $("#btn2 .isFavorit").hide();
      $("#btn2 .noFavorit").show();
    }
  }, function (error) {
    console.log(error)
  }, true)
};



// 收藏
function delFavorit(data) {
  console.log(data)
  var urls = historylUrl + '/del?version=1';
  console.log(urls);
  getYhSpecialSC(urls, data, function (response) {
    if (response.code == 200) {
      console.log("删除收藏");
      $("#btn2 .isFavorit").hide();
      $("#btn2 .noFavorit").show();
    } else {
      console.log('删除收藏失败')
    }
  })
};

function addFavorit(data) {
  console.log(data)
  var urls = historylUrl + '/collect?version=1';
  getYhSpecialSC(urls, data, function (response) {
    console.log(response);
    if (response.code == 200) {
      console.log("收藏成功");
      $("#btn2 .isFavorit").show();
      $("#btn2 .noFavorit").hide();
    } else {
      console.log('添加收藏失败')
    }
  })
};


// var getProductID = function () {
//   var header = ptJson.ptHost();
//   // var userToken = Authentication.CTCGetConfig("UserToken");
//   var ip = window.location.host;
//   $.ajax({
//     type: "GET",
//     url: header + "ProductAuth", //获取订购
//     data: {
//       userToken: userToken,
//       contentID: value.contentID,
//       ip: ip,
//       mac: value.mac,
//       timeStamp: new Date().getTime()
//     },
//     dataType: "json",
//     success: function (res) {
//       value.productID = res.productList[0].productID;
//       getOrderInfo();
//     },
//     error: function () {}
//   });
// };

// var getOrderInfo = function () {
//   var header = ptJson.ptHost();
//   $.ajax({
//     type: "GET",
//     url: header + "GetOrderGoods", //获取订购·
//     data: {
//       productID: value.productID,
//       userToken: value.userToken
//     },
//     dataType: "json",
//     success: function (res) {
//       var orderImgUrl = "/portal/images/" + res.detailUrl;
//       $(".bg").attr("src", orderImgUrl);
//     },
//     error: function () {}
//   });
// };

if (!value.orderBack && !value.fromOut) {
  if (window.Cookies.get("userToken")) {
    value.userToken = window.Cookies.get("userToken");
    value.productIDs = window.Cookies.get("products");
    value.userID = window.Cookies.get("userId");
  } else {
    value.userToken = 123456;
    value.userFlag = 123456;
    value.userID = 123456;
  }
  getInfo(); //获取详情信息
}


var seriesDetail = {
  //系列片详情页
  itemNo: 0, //集数选择焦点
  isPlay: 0, //正在播放焦点
  time: 0, //翻页次数
  favorit: false, //判断收藏
  position: 1,
  result: {},
  timer: null,
  init: function (data) {
    //初始渲染数据
    this.result = data;
    if (value.isBack) {
      this.isPlay = value.isPlay;
      this.itemNo = this.isPlay;
      if (this.itemNo > 3) {
        //选中播放的资产时前三，time为0
        this.time = this.itemNo - 3;
        $(".play-text").css({
          transition: "all 0.3s",
          transform: "translateY(-" + 47 * this.time + "px)"
        });
      }
    }

    medPlayer.play({
      playUrl: value.josnData.itemList[this.itemNo].vodList[0].playUrl,
      tiem: 0
    });

    $("h2").html(data.assetName);
    $(".detail .description").html(data.description);
    $(".yy-content-scroll").html(data.description);
    var html = "";
    for (var i in data.itemList) {
      html +=
        "<li>" +
        '<div class="point">' +
        "<span>" +
        "</span>" +
        "</div>" +
        '<div class="wordBox">' +
        '<p class="word">' +
        data.itemList[i].itemName +
        "</p>" +
        "&nbsp&nbsp&nbsp" +
        '<p class="copyWord">' +
        "</p>" +
        "</div>" +
        "</li>";
    }

    $(".play-text").html(html);

    $(".play-text li")
      .eq(this.isPlay)
      .addClass("isplay");
    this.addCss();
    $(".play-text li .point")
      .eq(this.isPlay)
      .css({
        visibility: "visible"
      });
  },
  hidePlayer: function () {
    try {
      player.stop();
    } catch (err) {
      console.log(err);
    }
  },
  home: function () {
    this.hidePlayer();
    window.location = value.lastURL;
  },
  up: function () {
    if (this.itemNo <= 0) return;
    if (this.result.itemList.length > 8) {
      if (this.itemNo >= 4) {
        this.removeCss();
        this.time--;
        $(".play-text").css({
          transition: "all 0.3s",
          transform: "translateY(-" + 47 * this.time + "px)"
        });
        this.itemNo--;
        this.addCss();
      } else {
        this.removeCss();
        this.time = 0;
        this.itemNo--;
        this.addCss();
      }
    } else {
      this.removeCss();
      this.itemNo--;
      this.addCss();
    }
  },
  down: function () {
    if (this.itemNo == this.result.itemList.length - 1) {
      this.removeCss();
      $(".btn-page #btn1").addClass("active");
      areaObj = btnArea;
      btnArea.btnNum = 1;
      return;
    }
    if (this.result.itemList.length > 8 && this.itemNo >= 3) {
      //最后一格不要再滚动
      this.time++;
      $(".play-text").css({
        transition: "all 0.3s",
        transform: "translateY(-" + 47 * this.time + "px)"
      });
    }
    this.removeCss();
    this.itemNo++;
    this.addCss();
  },
  left: function () {
    this.removeCss();
    $(".play-border").addClass("active");
    areaObj = btnArea;
  },
  right: function () {
    return;
  },
  enter: function () {
    $(".play-text li").removeClass("isplay");
    this.isPlay = this.itemNo;
    $(".play-text li")
      .eq(this.isPlay)
      .addClass("isplay");
    $(".play-text li .point").css({
      visibility: "hidden"
    });
    $(".play-text li .point")
      .eq(this.isPlay)
      .css({
        visibility: "visible"
      });

    //播放当前集数
    try {
      player.stop();
      medPlayer.play({
        playUrl: value.josnData.itemList[this.isPlay].vodList[0].playUrl,
        tiem: 0
      });
    } catch (err) {
      console.log(err);
    }
  },
  back: function () {
    this.hidePlayer();
    if (value.isBack) {
      value.isBack = false;
      if (window.Cookies.get("prePage")) {
        var preURL = window.Cookies.get("prePage");
        window.location = preURL;
      } else {
        window.location = "../index.html"
      }
    } else if (value.fromOut) {
      window.location = "../index.html"
    } else {
      history.go(-1)
    }
  },
  home: function () {
    try {
      player.stop();
    } catch (err) {
      console.log(err);
    }
    window.location = value.lastURL;
  },
  volumeplus: function () {
    medPlayer.increaseVolume();
  },
  volumeminus: function () {
    medPlayer.reduceVolume();
  },
  mute: function () {
    medPlayer.setMuteFlag();
  },
  addCss: function () {
    $(".play-text li")
      .eq(this.itemNo)
      .addClass("active");
    var title = $(".wordBox .word")
      .eq(this.itemNo)
      .text();
    if (title.length > 19) {
      var wordBox = document.querySelectorAll(".wordBox")[this.itemNo];
      var text1 = document.querySelectorAll(".word")[this.itemNo];
      var text2 = document.querySelectorAll(".copyWord")[this.itemNo];
      text2.innerHTML = text1.innerHTML;
      wordBox.style.textOverflow = "clip";
      clearInterval(this.timer);
      this.timer = setInterval(function () {
        if (text2.offsetWidth - wordBox.scrollLeft <= 0) {
          wordBox.scrollLeft = 1;
        } else {
          wordBox.scrollLeft += 2;
        }
      }, 40);
    }
  },
  removeCss: function () {
    $(".play-text li")
      .eq(this.itemNo)
      .removeClass("active");
    if (this.timer !== null) {
      document.querySelectorAll(".wordBox")[this.itemNo].style.textOverflow =
        "ellipsis";
      document.querySelectorAll(".wordBox")[this.itemNo].scrollLeft = 0;
      document.querySelectorAll(".copyWord")[this.itemNo].innerHTML = "";
      clearInterval(this.timer);
    }
  }
};

var medPlayer = {
  itemNo: 0,
  medPlayerurl: null,
  play: function (obj) {
    try {
      player.setCallback(player.videoStateChange);
      player.setDisplayerLocation({
        x: 60,
        y: 20,
        w: 560,
        h: 460
      });
      player.toggleShow('showPlayer');
      // 正式环境播放
      var playUrl = 'http://ivi.bupt.edu.cn/hls/cctv6hd.m3u8'
      // var playUrl = obj.playUrl;
      console.log(playUrl);
      if (obj.time) {
        var time = obj.time;
      } else {
        var time = 0;
      }
      var OpJson = {
        playUrl: playUrl,
        historyTime: time
      }
      player.play(OpJson)
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
      console.log('开始播放')
    }
    videoOptions.onProgress = function (res) {
      console.log('每秒调用');
      // topContent.curPlayTime = res.curPlayTime;
      // playmode.refreshProgressView(res.curPlayTime,res.allTime);    
    }
    videoOptions.onPause = function (res) {
      console.log('暂停')
      // playmode.stopPlay = true;
    }
    videoOptions.onResume = function (res) {
      console.log('续播')
    }
    videoOptions.onStop = function (res) {
      console.log('手动停止')
    }
    videoOptions.onCompleted = function (res) {
      console.log('播放下一集')
      medPlayer.playNext();
    }
    videoOptions.onError = function (res) {
      console.log('报错')
    }
  },
  hidePlayer: function () {
    // 停止
    try {
      player.stop();
    } catch (err) {
      console.log(err);
    }
  },
  playNext: function () {
    player.stop();
    console.log("切集前" + medPlayer.itemNo)
    if (medPlayer.itemNo >= value.josnData.itemList.length - 1) {
      medPlayer.itemNo = 0;
    } else {
      medPlayer.itemNo += 1;
      try {
        player.setDisplayerLocation({
          x: 60,
          y: 20,
          w: 560,
          h: 460
        });
        player.toggleShow('showPlayer');
        console.log("切集后" + medPlayer.itemNo)
        // var playUrl = value.josnData.itemList[medPlayer.itemNo].vodList[0].playUrl
        // 正式环境播放
        var playUrl = 'http://ivi.bupt.edu.cn/hls/cctv6hd.m3u8'

        var OpJson = {
          playUrl: playUrl,
          historyTime: 0
        }
        player.play(OpJson)
      } catch (error) {
        console.log(error);
        console.log('播放器初始化失败');
      }
      console.log("切集后" + medPlayer.itemNo)
    }
  },
}

var btnArea = {
  // 系列片
  btnNum: 0, //0 大窗口   1 详情介绍    2 收藏
  up: function () {
    if (!this.btnNum == 0) {
      this.btnNum = 0;
      $(".btn-page div").removeClass("active");
      areaObj = seriesDetail;
      seriesDetail.addCss();
    }
  },
  down: function () {
    if (this.btnNum == 0) {
      this.btnNum++;
      $(".play-border").removeClass("active");
      $("#btn1").addClass("active");
    }
  },
  left: function () {
    if (this.btnNum == 1) {
      this.btnNum--;
      $("#btn1").removeClass("active");
      $(".play-border").addClass("active");
    } else if (this.btnNum == 2) {
      this.btnNum--;
      $("#btn2").removeClass("active");
      $("#btn1").addClass("active");
    }
  },
  right: function () {
    if (this.btnNum == 0) {
      areaObj = seriesDetail;
      $(".play-border").removeClass("active");
      seriesDetail.addCss();
    } else if (this.btnNum == 1) {
      this.btnNum++;
      $("#btn1").removeClass("active");
      $("#btn2").addClass("active");
    }
  },
  enter: function () {
    if (this.btnNum == 0) {
      try {
        // 停止播放
        player.stop();
      } catch (err) {
        console.log(err)
      }
      var detailURL = value.JsonUrl; //存储详情页url
      Cookies.set('detailUrl', detailURL, {
        path: '/'
      })
      window.Cookies.set("backUrl", window.location.href);
      window.location =
        "../players/player.html"
    } else if (this.btnNum == 1) {
      $(".yy-confirm").css({
        visibility: "visible"
      });
      description.init(1); // 1为多资产
      areaObj = description;
    } else {
      if ($("#btn2 .isFavorit").is(":hidden")) {
        //判断当前资产是否收藏
        var data = {
          siteId: yh.siteId,
          userId: yh.userId,
          collectType: "1",
          relateId: value.josnData.assetId,
          relateTitle: value.josnData.assetName,
          relateImg: value.josnData.assetImg,
          relateUrl: value.JsonUrl,
          relateLayout: value.josnData.layout,
          relateScore: value.josnData.score == undefined ? '' : value.josnData.score
        }
        $(addFavorit(data));
      } else {
        var data = {
          siteId: yh.siteId,
          userId: yh.userId,
          collectType: "1",
          relateId: value.josnData.assetId,
        }
        $(delFavorit(data));
      }
    }
  },
  back: function () {
    try {
      player.stop();
    } catch (err) {
      console.log(err);
    }
    if (value.isBack) {
      value.isBack = false;
      if (window.Cookies.get("prePage")) {
        var preURL = window.Cookies.get("prePage");
        window.location = preURL;
      } else {
        window.location = "../index.html"
      }
    } else if (value.fromOut) {
      window.location = "../index.html"
    } else {
      history.go(-1)
    }
  },
  home: function () {
    try {
      player.stop();
    } catch (err) {
      console.log(err);
    }
    window.location = value.lastURL;
  },
};

var description = {
  //详情公共介绍弹窗
  height: 0, //文字高度
  option: 0, //页数
  num: 0, //翻页数
  moveHeight: 0, //动态滚动条高度
  init: function (fromType) {
    this.type = fromType;
    this.height = $(".yy-content-scroll").height();
    if (this.height > 289) {
      $(".description-scroll").css({
        visibility: "visible"
      });
      this.option = Math.floor(this.height / 289);
      this.moveHeight = 202 / this.option;
    }
  },
  home: function () {
    $(".yy-confirm,.description-scroll").css({
      visibility: "hidden"
    });
    try {
      player.stop();
    } catch (err) {
      console.log(err);
    }
    window.location = value.lastURL;
  },
  up: function () {
    if (this.num == 0) return;
    this.num--;
    $(".yy-content-scroll").css({
      transition: "all 0.2s",
      transform: "translateY(-" + 289 * this.num + "px)"
    });
    $(".description-bar").css({
      transition: "all 0.2s",
      transform: "translateY(" + this.moveHeight * this.num + "px)"
    });
  },
  down: function () {
    if (this.num == this.option) return;
    this.num++;
    $(".yy-content-scroll").css({
      transition: "all 0.2s",
      transform: "translateY(-" + 289 * this.num + "px)"
    });
    $(".description-bar").css({
      transition: "all 0.2s",
      transform: "translateY(" + this.moveHeight * this.num + "px)"
    });
  },
  back: function () {
    $(".yy-confirm,.description-scroll").css({
      visibility: "hidden"
    });
    areaObj = btnArea;
  }
};

var order = {
  btn: 1,
  left: function () {
    if (this.btn === 1) return;
    $(".btn2").removeClass("hover");
    this.btn--;
    $(".btn1").addClass("hover");
  },
  right: function () {
    if (this.btn === 2) return;
    $(".btn1").removeClass("hover");
    this.btn++;
    $(".btn2").addClass("hover");
  },
  enter: function () {
    if (this.btn == 1) {
      //订购逻辑
      window.Cookies.set("DisPlay", seriesDetail.itemNo);
      window.Cookies.set("DprogramId", value.programId);
      window.Cookies.set("DfolderId", value.folderId);
      var newURL =
        window.location.origin + window.location.pathname + "?from=order";
      // 正式   http://112.115.0.130:9099/buy/ProductPurchase
      //测试   http://182.245.29.16:8080/buy/ProductPurchase
      window.location =
        "http://112.115.0.130:9099/buy/ProductPurchase?SPID=&UserID=" +
        value.userID +
        "&UserToken=" +
        value.userToken +
        "&ContentID=" +
        seriesDetail.result.contentID +
        "&ServiceID=" +
        seriesDetail.result.ServiceID +
        "&ProductID=" +
        value.productID +
        "&Action=1&TransactionID=&ReturnURL=" +
        newURL;
    } else if (this.btn == 2) {
      $(".btn2").removeClass("hover");
      this.btn--;
      $(".btn1").addClass("hover");
      $(".order-box").css("visibility", "hidden");
      if (value.onOrderFrom === "left") {
        areaObj = btnArea;
      } else {
        areaObj = seriesDetail;
      }
    }
  },
  back: function () {
    $(".btn2").removeClass("hover");
    this.btn = 1;
    $(".btn1").addClass("hover");
    if (value.onOrderFrom === "left") {
      areaObj = btnArea;
    } else {
      areaObj = seriesDetail;
    }
    $(".order-box").css("visibility", "hidden");
  },
  home: function () {
    window.location = value.lastURL;
  },
};
areaObj = seriesDetail;
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
    case "pageup":
      areaObj.pageup();
      break;
    case "pagedown":
      areaObj.pagedown();
      break;
    case "back":
      areaObj.back();
      break;
    case "enter":
      areaObj.enter();
      break;
    case "volumeplus":
      areaObj.volumeplus();
      break;
    case "volumeminus":
      areaObj.volumeminus();
      break;
    case "mute":
      areaObj.mute();
      break;
    case "home":
      areaObj.home();
      break;
  }
};
//事件绑定
document.onkeydown = grepEvent;