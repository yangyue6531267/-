var pegeId //---assetId
var pageassetType;
var indexSingle = {
  data: {},
  element: null,
  itemNo: 0,
  indexPlay: 0,
  newplayTime: 0
}
var value = {
  detailData: {},
  authCode: '3a',
  itemNo: 0,
  isBack: false,
  url: "",
  getValue: function () {
    if (window.location.search.length > 0) {
      this.isBack = true;
      if (unity.getVars("result") == 0 || $.cookie('isOrder') == 1) {
        playConfig.isOrder = "1";  // 已订购 直接播放
        $.cookie("isOrder", 1, { path: "/" })
      } else {
        playConfig.isOrder = "0";  // 已订购 直接播放
        $.cookie("isOrder", 0, { path: "/" })
      }
    }
    value.url = $.cookie("detailUrl")
  }
}

var getcid = ''; //定义全局cid //(p_BJYSTENCOS00000000000100917440) 
var moveresdata = ''//全局rsedata
var getData = function (url) {
  value.detailUrl = url
  console.log("获取电影详情数据");
  $(".loading").css("visibility", "visible");
  unity.jsonp(url, function (res) {
    console.log("详情页数据回调");
    if (res.code == 605) {
      $(".loading").css("visibility", "hidden");
      unity.alertMsg("资产已下线，即将返回上一页。")
      setTimeout(function () { //1秒返回上一个
        var url = $.cookie("preURL")
        window.location = url
      }, 1000);
    }
    console.log("判断订购状态改变dom")
    $(".loading").css("visibility", "hidden");
    console.log(JSON.stringify(res)) //电影详情
    console.log(res.data);
    console.log("res.data--")
    moveresdata = res.data
    pageassetType = res.data.assetType;
    indexSingle.itemNo = 0;
    setStorage('moveresdata', JSON.stringify(moveresdata));
    console.log(getStorage("moveresdata"));//true--string
    console.log(JSON.stringify(res.data.itemList[0].vodList[0].playUrl))//"http://ip:port/icntv/p_BJYSTENCOS00000000000100917440"
    setStorage('moviePlayurl', JSON.stringify(res.data.itemList[0].vodList[0].playUrl))  //电影的playUrl
    getcid = res.data.itemList[0].vodList[0].playUrl.split("icntv/")[1];
    setStorage("getcidStorage", getcid)
    console.log(getcid);

    console.log("详情页数据填充");
    $.cookie('detailPageId', res.data.assetId, { path: "" })
    value.detailData = res.data;
    indexSingle.data = res.data;
    var relateId = res.data.assetId;
    pegeId = relateId
    setStorage("pageId", pegeId)
    $.cookie("play_id", pegeId, {
      path: '/'
    })
    unity.isCollect(relateId, function (res) { //判断收藏
      console.log(res.data);
      if (res.data.resultNum === 1) {
        topContent.isCollect = true;
        $(".btnBox .collect span").css("background-position", "-88px 0px")
      } else {
        topContent.isCollect = false;
        $(".btnBox .collect span").css("background-position", "-66px 0px")
      }
    })
    unity.qeryHistory(function (hisObj) {
      if (hisObj && hisObj != "err") {
        console.log('历史对象===')
        var hqobj = hisObj.data.resultList;
        for (var i = 0; i < hqobj.length; i++) {
          if (value.detailData.assetId == hqobj[i].relateId) {
            console.log("历史记录中资产ID" + hqobj[i].relateId)
            console.log(JSON.stringify(hqobj[i]))
            indexSingle.newplayTime = hqobj[i].relateTime
            console.log("播放记录时间" + indexSingle.newplayTime)
            // $.cookie("newplayTime",indexSingle.newplayTime,{path: '/'})
          }
        }
      }
    })
    var playUrl = value.detailData.itemList[0].vodList[0].playUrl
    var contentID = getParam('migu_play_url', playUrl);

    var contentID = "1571733697433"
    // login(uploadDom, contentID);
    userPower(uploadDom, contentID)//鉴权回调
    // userBMS(uploadDom, contentID);
  }, function (err) {
    unity.alertMsg("资产已下线，即将返回上一页。")
    setTimeout(function () { //三秒返回上一个
      var url = $.cookie("preURL")
      window.location = url
    }, 1000);
  })
}


function uploadDom() {
  topContent.init();
  assetList.init();
  if (playConfig.isOrder == "1") {
    $("#Order").html('已订购')
  }
  areaObj = topContent; //初始焦点赋值
  console.log("懒加载");
  //$.imgLazyLoad(); //懒加载
  // 上报埋点
  var jumpJson = $.cookie("jump")
  try {
    jumpJson = eval('(' + jumpJson + ')')
    jumpJson.page_type = '0301'
    jumpJson.page_id = relateId
    console.log(jumpJson)
  } catch (error) {
    console.log(error)
  }
  if (jumpJson) {
    try {
      bi.jump(jumpJson)
      $.removeCookie("jump", { path: "/" })
    } catch (error) {
      console.log('埋点错误', error)
      $.removeCookie("jump", { path: "/" })
    }
  }
}

var topContent = {
  btnNum: 0,
  isCollect: false,
  play: function () {
    //跳转播放器方法
    var playCode = value.detailData.itemList[indexSingle.itemNo].vodList[0].playUrl
    var playUrl = '../player/player.html?' + "detailUrl=" + encodeURIComponent(value.detailUrl) + "&indexPlay=" + indexSingle.indexPlay + "&currentTime=" + indexSingle.newplayTime + "&returnUrl=" + window.location.href.split("?")[0];;
    console.log('playUrl----' + playUrl);
    window.location.href = playUrl
  },
  init: function () {
    $(".imgBig").html('<img src="' + value.detailData.assetImg + '"/>')
    $(".name").html('<span class="header-name">' + value.detailData.assetName + '</span> <span class="header-score">' + value.detailData.score + '</span>');
    $(".info").html(value.detailData.area + " | " + value.detailData.language + " | " + value.detailData.year)
    $(".description").html(value.detailData.description);
    $('.btnBox div').eq(this.btnNum).addClass('active')
  },
  up: function () {
    return
  },
  down: function () {
    areaObj = assetList
    $('.btnBox div').eq(this.btnNum).removeClass('active')
    assetList.addCss()
    $(".movieDetail").scrollTop(240)
  },
  left: function () {
    if (this.btnNum === 0) return
    $('.btnBox div').eq(this.btnNum).removeClass('active')
    this.btnNum--
    $('.btnBox div').eq(this.btnNum).addClass('active')
  },
  right: function () {
    if (this.btnNum === 3) return
    $('.btnBox div').eq(this.btnNum).removeClass('active')
    this.btnNum++
    $('.btnBox div').eq(this.btnNum).addClass('active')

  },
  back: function () {
    var url = $.cookie("preURL")
    window.location = url;
  },
  enter: function () {
    if (this.btnNum === 0) {
      topContent.play();
    } else if (this.btnNum === 1) {
      if (this.isCollect) { //已收藏
        var data = {
          siteId: yh.siteId,
          userId: yh.userId,
          collectType: 1, //收藏类型(0-主播,1-资产,2-专题)
          relateId: value.detailData.assetId,
          //  layout: this.detailData.layout
        }
        unity.delCollect(data, function (res) {
          console.log(res);
          if (res.mes === "ok")
            console.log("删除收藏成功");
          $(".btnBox .collect span").css("background-position", "-66px 0px")
          try {
            var jsonOb = {}
            jsonOb.click_type = '1'
            jsonOb.cid = value.detailData.assetId
            jsonOb.collect = '2'
            bi.collection(jsonOb)
          } catch (error) {
            console.log('埋点异常', error)
          }
        })
        this.isCollect = false
      } else { //未收藏
        var data = {
          siteId: yh.siteId,
          userId: yh.userId,
          collectType: 1, //收藏类型(0-主播,1-资产,2-专题)
          relateId: value.detailData.assetId,
          relateTitle: value.detailData.assetName,
          relateScore: value.detailData.score,
          relateImg: value.detailData.assetImg,
          relateUrl: value.url,
          relateLayout: value.detailData.layout
        }
        unity.addCollect(data, function (res) {
          console.log(res);
          if (res.mes === "ok")
            console.log("添加收藏成功");
          $(".btnBox .collect span").css("background-position", "-88px 0px")
          try {
            var jsonOb = {}
            jsonOb.click_type = '1'
            jsonOb.cid = value.detailData.assetId
            jsonOb.collect = '1'
            bi.collection(jsonOb)
          } catch (error) {
            console.log('埋点异常', error)
          }
        })
        this.isCollect = true;
      }
    } else if (this.btnNum === 2) {
      $(".descriptionBox").css("visibility", "visible");
      descriptionBox.init()
      areaObj = descriptionBox
    } else if (this.btnNum === 3) {
      var playUrl = value.detailData.itemList[0].vodList[0].playUrl
      var contentID = getParam('migu_play_url', playUrl);
      unifiedOrder(contentID);
    }
  },
}

var tips = {
  init: function () {
    areaObj == tips
  },
  enter: function () {
    $(".tips").css("display", "none")
    areaObj = topContent
  },
  back: function () {
    $(".tips").css("display", "none")
    areaObj = topContent
  },
}

//详情公共介绍弹窗
var descriptionBox = {
  height: 0, //文字高度
  option: 0, //页数
  num: 0, //翻页数
  init: function () {
    $(".scrollBox .topBox").html(value.detailData.assetName)
    $(".wordScroll").html(value.detailData.description)
    this.height = $(".wordScroll").height();
    this.option = Math.floor(this.height / 230);
  },
  up: function () {
    if (this.num == 0) return;
    this.num--;
    $(".wordScroll").stop(true, true).animate({
      top: -210 * this.num
    }, 200)
  },
  down: function () {
    if (this.num == this.option) return;
    this.num++;
    $(".wordScroll").stop(true, true).animate({
      top: -210 * this.num
    }, 200)
  },
  back: function () {
    $(".descriptionBox").css("visibility", "hidden");
    areaObj = topContent;
  },
  enter: function () {
    $(".descriptionBox").css("visibility", "hidden");
    areaObj = topContent;
  }
}

var assetList = {
  data: {},
  itemNo: 0,
  init: function () {
    $(".assetList ul").empty()
    this.data = value.detailData.assetList
    for (var i = 0; i < 12; i++) {
      // $(".assetList ul").append('<li><div class="imgbox"><div class="score"><span>' + this.data[i].score + '</span></div><img class="lazyload" src="../public/images/img_loading_160x230.png"  data-img="' + this.data[i].assetImg + '"/></div><div class="word">' + this.data[i].assetName + '</div></li>')
      $(".assetList ul").append('<li><div class="imgbox"><div class="score"><span>' + this.data[i].score + '</span></div><img class="lazyload" src="' + this.data[i].assetImg + '"/></div><div class="word">' + this.data[i].assetName + '</div></li>')
    }
  },
  addCss: function () {
    $(".assetList li").eq(this.itemNo).addClass('active');
    var title = $(".assetList .word")
      .eq(this.itemNo)
      .text();
    if (title.length > 8) {
      $(".assetList .word").eq(this.itemNo).html('<marquee scrolldelay=80>' + this.data[this.itemNo].assetName + '</marquee>')
    }
    //$.imgLazyLoad(); //懒加载
  },

  removeCss: function () {
    $(".assetList li").eq(this.itemNo).removeClass('active');
    $(".assetList .word").eq(this.itemNo).html(this.data[this.itemNo].assetName)
  },

  up: function () {
    if (this.itemNo <= 5) {
      this.removeCss();
      areaObj = topContent
      this.removeCss();
      $('.btnBox div').eq(topContent.btnNum).addClass('active')
      $(".movieDetail").scrollTop(0)
    } else {
      this.removeCss();
      this.itemNo -= 6;
      this.addCss();
    }
  },

  down: function () {
    if (this.itemNo <= 5) {
      this.removeCss();
      this.itemNo += 6;
      this.addCss();
      $(".movieDetail").scrollTop(540)
    } else {
      return  //去除下面两个组件
    }
  },
  left: function () {
    if (this.itemNo === 0) return
    this.removeCss()
    this.itemNo--
    this.addCss()
    $('.btnBox div').eq(this.btnNum).addClass('active')
  },

  right: function () {
    if (this.itemNo === 11) return
    this.removeCss()
    this.itemNo++
    this.addCss()
  },
  back: function () {
    window.location = "../index/home.html";
  },
  enter: function () {
    areaObj = null
    var url = this.data[this.itemNo].jsonUrl
    console.log(url)
    console.log("url")
    $.cookie('detailUrl', url, { path: "/" })
    value.url = url;
    getData(url)
    this.removeCss();
    this.itemNo = 0;
    topContent.btnNum = 0;
    $(".movieDetail").scrollTop(0)
    $(".wordScroll").animate({
      top: 0
    }, 0)
  },
}
value.getValue();
getData(value.url)



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
      areaObj.back();
      break;
    case "enter":
      areaObj.enter();
      break;
    case "home":
      areaObj.home();
      break;
  }
};
//事件绑定
document.onkeydown = grepEvent;