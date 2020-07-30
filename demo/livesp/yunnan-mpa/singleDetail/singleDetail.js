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

var value = { //详情页数据请求所需参数
  JsonUrl: "",
  josnData: '',
  programId: "", //节目ID
  userToken: "", // 用户token
  contentID: "", // 节目唯一标识      "productIDs" : "",      //开机认证的已订购产品
  folderId: "",
  mac: "",
  isBack: false,
  userID: '',
  lastURL: '',
  orderImg: '',
  orderBack: false,
  fromOut: false,
  getValue: function () {
    this.mac = window.Cookies.get("mac");
    var oGetVars = {};
    var comeUrl = window.location.href;
    console.log(comeUrl)
    if (comeUrl.indexOf("indexUrl") != -1 && comeUrl.indexOf("from=order") == -1) {
      this.fromOut = true
      var lastURL = document.referrer;
      var cObj = "lastURL=" + lastURL + "; path=/";
      document.cookie = cObj;
      getInfo(); //获取详情信息
    }
    this.lastURL = window.Cookies.get('lastURL');
    if (window.location.search.length > 1) { //从url里面拿到所需键值
      for (var aItKey, nKeyId = 0, aCouples = window.location.search.substr(1).split("&"); nKeyId < aCouples.length; nKeyId++) {
        aItKey = aCouples[nKeyId].split("=");
        oGetVars[decodeURIComponent(aItKey[0])] = aItKey.length > 1 ? decodeURIComponent(aItKey[1]) : "";
      }
    }
    this.JsonUrl = oGetVars.JsonUrl;
    console.log(this.JsonUrl)
    if (oGetVars.from == "order") {
      this.isBack = true;
      this.orderBack = true;
      try {
        getInfo(); //获取详情信息

      } catch (err) {
        console.log(err);
      }

    }
    if (oGetVars.from == "player") {
      this.isBack = true;
    }
  }
};

$(value.getValue()); //获取参数

var getInfo = function () {
  //获取详情数据
  $.ajax({
    type: "GET",
    url: value.JsonUrl, //获取详情页数据
    dataType: "json", //指定服务器返回的数据类型
    jsonp: "callback", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
    success: function (res) {
      console.log(res);
      value.josnData = res.data;
      $(".description").html(value.josnData.description);
      singleDetail.init(value.josnData);
      try {
        getFavorits(); //判断是否收藏
      } catch (error) {
        console.log('超时')
      }
      getRecommendation(value.josnData.assetList);
    },
    error: function (err) {
      console.log(err)
      debugger
      if (value.isBack) {
        value.isBack = false;
        var preURL = window.Cookies.get("prePage");
        window.location = preURL;
      } else {
        history.go(-1);
      }
    }
  });
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

var getRecommendation = function (res) {
  var getArr = res;
  var filterArr = [];
  for (var i = 0; i < getArr.length; i++) {
    if (getArr[i].programId !== value.programId) {
      filterArr.unshift(getArr[i])
    }
  }
  var ranNum = 6;
  var list = [];
  for (var i = 0; i < ranNum; i++) {
    var ran = Math.floor(Math.random() * filterArr.length);
    list.unshift(filterArr.splice(ran, 1)[0]);
  };
  console.log(list);
  console.log(filterArr);

  singleButtom.init(list)
};


var getProductID = function () {
  var header = ptJson.ptHost();
  $.ajax({
    type: "GET",
    url: header + "ProductAuth", //获取收藏
    data: {
      userToken: value.userToken,
      contentID: value.contentID,
      mac: value.mac,
      timeStamp: new Date().getTime()
    },
    dataType: "json",
    success: function (res) {
      value.productID = res.productList[0].productID;
      getOrderInfo()
    },
    error: function () {}
  });
};

var getOrderInfo = function () {
  var header = ptJson.ptHost();
  $.ajax({
    type: "GET",
    url: header + "GetOrderGoods", //获取订购
    data: {
      productID: value.productID,
      userToken: value.userToken
    },
    dataType: "json",
    success: function (res) {
      var orderImgUrl = "/portal/images/" + res.detailUrl
      $(".bg").attr("src", orderImgUrl);
    },
    error: function () {}
  });
}

if (!value.orderBack && !value.fromOut) {
  if (window.Cookies.get("userToken")) {
    value.userToken = window.Cookies.get("userToken");
    value.productIDs = window.Cookies.get("products");
    value.userID = window.Cookies.get("userId");
  } else {
    value.userToken = 123456;
    value.userID = 123456;
  }
  getInfo(); //获取详情信息
}



var singleDetail = { //单资产上部
  btnNum: 0,
  favorit: false,
  result: {},
  init: function (data) {
    this.result = data;
    value.contentID = data.contentID;
    $("h2").html(data.programName);
    $(".detail .description").html(data.description);
    $(".yy-content-scroll").html(data.description);
    $(".play-border").addClass("active");
    medPlayer.play({
      playUrl: value.josnData.itemList[0].vodList[0].playUrl,
      tiem: 0
    });
  },
  hidePlayer: function () {
    player.stop();
  },
  up: function () {
    return
  },
  down: function () {
    areaObj = singleButtom;
    this.btnNum = 0;
    $("#btn1,#btn2,.play-border").removeClass("active");
    $("#mList .imgbox").eq(0).addClass('active');
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
      this.btnNum++;
      $(".play-border").removeClass("active");
      $("#btn1").addClass("active");
    } else if (this.btnNum == 1) {
      this.btnNum++;
      $("#btn1").removeClass("active");
      $("#btn2").addClass("active");
    }
  },
  enter: function () {
    if (this.btnNum == 0) {
      if (this.result.orderFlag == 1) {
        try {
          // 停止播放
          player.stop();
        } catch (err) {}
        var detailURL = oGetVars.JsonUrl; //存储详情页url
        Cookies.set('detailUrl', detailURL, {
          path: '/'
        })
        setTimeout(function () {
          window.location =
            "../players/player.html"
        }, 100);
      } else {
        console.log("弹出订购页面");
        // getProductID()
        areaObj = order;
        $('.order-box').css("visibility", "visible");
      }
    } else if (this.btnNum == 1) {
      $(".yy-confirm").css({
        visibility: "visible"
      });
      description.init(0); //0为single 
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
    player.stop();
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
    player.stop();
    window.location = value.lastURL
  },
};
var singleButtom = { //单资产下方推荐
  itemNo: 0,
  list: null,
  timer: null,
  init: function (data) {
    this.list = data;
    var html = '';
    for (i in data) {
      html += "<li>" + "<img class='jiaobiao' src='../index/images/jingxuan.png'>" + "<div class='imgbox'>" + "<img src=" +
        data[i].assetImg + ">" + "</div>" +
        "<div class='word'>" + "<div class='text'>" + data[i].assetName + "</div>" + "<div class='text-copy'>" + "</div>" + "</div>" +
        "</li>";
    }
    $("#mList ul").html(html);
  },
  home: function () {
    player.stop();
    window.location = value.lastURL;
  },
  up: function () {
    areaObj = singleDetail;
    this.itemNo = 0;
    $("#mList .imgbox").removeClass('active');
    $(".play-border").addClass('active');
  },
  left: function () {
    if (this.itemNo === 0) return
    this.removeCss();
    this.itemNo--;
    this.addCss();
  },
  right: function () {
    if (this.itemNo === 5) return
    this.removeCss();
    this.itemNo++;
    this.addCss();
  },
  enter: function () {
    player.stop();
    var jsonUrl = encodeURIComponent(this.list[this.itemNo].jsonUrl);
    if (this.list[this.itemNo].layout == "Detail_News") {
      window.location = "../seriesDetail/seriesDetail.html?JsonUrl=" + jsonUrl;
    } else {
      window.location = "../singleDetail/singleDetail.html?JsonUrl=" + jsonUrl;
    }
  },
  back: function () {
    medPlayer.clearMedalArea()
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
  addCss: function () {
    $("#mList .imgbox")
      .eq(this.itemNo)
      .addClass("active");
    var title = $(".wordBox #word")
      .eq(this.itemNo)
      .text();
    if (title.length > 19) {
      var wordBox = document.querySelectorAll(".wordBox")[this.itemNo];
      var text1 = document.querySelectorAll("#word")[this.itemNo];
      var text2 = document.querySelectorAll("#copyWord")[this.itemNo];
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
    $("#mList .imgbox")
      .eq(this.itemNo)
      .removeClass("active");
    if (this.timer !== null) {
      document.querySelectorAll(".wordBox")[this.itemNo].style.textOverflow =
        "ellipsis";
      document.querySelectorAll(".wordBox")[this.itemNo].scrollLeft = 0;
      document.querySelectorAll("#copyWord")[this.itemNo].innerHTML = "";
      clearInterval(this.timer);
    }
  }
}

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
      // var playUrl = obj.playUrl;
      // 正式环境播放
      var playUrl = 'http://ivi.bupt.edu.cn/hls/cctv6hd.m3u8'
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
        // 正式环境播放
        var playUrl = 'http://ivi.bupt.edu.cn/hls/cctv6hd.m3u8'
        // var playUrl = value.josnData.itemList[0].vodList[0].playUrl
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

var description = {
  //详情公共介绍弹窗
  height: 0, //文字高度
  option: 0, //页数
  num: 0, //翻页数
  moveHeight: 0, //动态滚动条高度
  init: function (fromType) {
    this.type = fromType
    this.height = $(".yy-content-scroll").height();
    if (this.height > 289) {
      $(".description-scroll").css({
        visibility: "visible"
      });
      this.option = Math.floor(this.height / 289);
      this.moveHeight = 202 / this.option;
    }
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
    areaObj = singleDetail;
  }
};

var order = {
  btn: 1,
  left: function () {
    if (this.btn === 1) return;
    $('.btn2').removeClass('hover');
    this.btn--
    $('.btn1').addClass('hover');
  },
  right: function () {
    if (this.btn === 2) return;
    $('.btn1').removeClass('hover');
    this.btn++
    $('.btn2').addClass('hover');
  },
  enter: function () {
    if (this.btn == 1) {
      window.Cookies.set('DprogramId', value.programId);
      window.Cookies.set("DfolderId", value.folderId);
      var newURL = window.location.origin + window.location.pathname + "?from=order"
      // 正式   http://112.115.0.130:9099/buy/ProductPurchase
      //测试   http://182.245.29.16:8080/buy/ProductPurchase
      window.location =
        "http://112.115.0.130:9099/buy/ProductPurchase?SPID=&UserID=" + value.userID + "&UserToken=" + value.userToken + "&ContentID=" + singleDetail.result.contentID + "&ServiceID=" + singleDetail.result.ServiceID + "&ProductID=" + value.productID + "&Action=1&TransactionID=&ReturnURL=" + newURL
    } else if (this.btn == 2) {
      $('.btn2').removeClass('hover');
      this.btn--;
      $('.btn1').addClass('hover');
      $('.order-box').css('visibility', 'hidden');
      areaObj = singleDetail
    } else if (this.btn == 0) {
      try {
        // 停止播放
        player.stop();
      } catch (err) {}
      var detailURL = value.JsonUrl; //存储详情页url
      Cookies.set('detailUrl', detailURL, {
        path: '/'
      })
      window.Cookies.set("backUrl", window.location.href);
      areaObj.enter();
      setTimeout(function () {
        window.location =
          "../players/player.html"
      }, 100);
    }
  },
  back: function () {
    $('.btn2').removeClass('hover');
    this.btn = 1
    $('.btn1').addClass('hover');
    $('.order-box').css('visibility', 'hidden');
    areaObj = singleDetail
  },
  home: function () {
    window.location = value.lastURL;
  },
}
areaObj = singleDetail
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