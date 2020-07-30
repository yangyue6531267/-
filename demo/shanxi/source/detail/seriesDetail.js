// 进入电视剧
localStorage.setItem('detailsPage', 'series')
var pegeId
var value = {
  detailData: {},
  itemNo: 0,
  isBack: false,
  url: "",
  pageType: 'Series',
  isOrder:0,
  getValue:function() {
    if(window.location.search.length>0) {
      this.isBack=true;
      if (unity.getVars("contentNum")) {  //  播放页返回焦点记忆
        indexButtom.itemNo = unity.getVars("contentNum")-1;
        column.itemNo = unity.getVars("contentNum")-1;
      }
      if (unity.getVars("result")==0||$.cookie('isOrder')==1) {
        this.isOrder=1;  // 已订购 直接播放
        $.cookie("isOrder",1,{path:"/"})
      } else {
        this.isOrder=0;
        $.cookie("isOrder",0,{path:"/"})
      }
       if (window.location.search.indexOf('result=0') != -1) {
         //  unity.biOrder('1');
          // 订购上报
          try {
            var param = {
              pkg_type: '0',
              pkg_id: $.cookie("play_id"),              
              operator_id: '',
              order_msg: '1',
              parent_page_id: $.cookie("play_id"),
              parent_page_type: '0301',
              point: '1'
            }
            bi.order(param)
          } catch (error) {
            console.log('埋点错误', error)
          }
        } else if (window.location.search.indexOf('success') != -1 && unity.getVars("success") !== "0") {
          // unity.biOrder('失败');
          // 订购上报
          try {
            var param = {
              pkg_type: '0',
              pkg_id: $.cookie("play_id"),
              operator_id: '',
              order_msg: encodeURIComponent('订购失败'),
              parent_page_id: $.cookie("play_id"),
              parent_page_type: '0301',
              point: '1'
            }
            bi.order(param)
          } catch (error) {
            console.log('埋点错误', error)
          }
      }
      indexButtom.itemNo = 0;
      column.itemNo = 0;
    }else {
      this.isOrder = $.cookie("isOrder");
    }
  },

}
var getData = function (url) {
  console.log("获取电视剧详情数据");
  $(".loading").css("visibility", "visible");
  unity.jsonp(url, function (res) {
    $(".loading").css("visibility", "hidden");
     if (res.code == 605) {
      // var data = {
      //   siteId: yh.siteId,
      //   userId: yh.userId,
      //   collectType: 1, //收藏类型(0-主播,1-资产,2-专题)
      //   relateId: value.detailData.assetId,
      //   //  layout: this.detailData.layout
      // }
      // unity.delCollect(data, function (res) {
      //   console.log(res);
      //   if (res.mes === "ok")
      //     console.log("删除收藏成功");
      //   $(".btnBox .collect span").css("background-position", "-66px 0px")
      //   try {
      //     var jsonOb = {}
      //     jsonOb.click_type = '1'
      //     jsonOb.cid = value.detailData.assetId
      //     jsonOb.collect = '2'
      //     bi.collection(jsonOb)
      //   } catch (error) {
      //     console.log('埋点异常', error)
      //   }
      // })
      // this.isCollect = false
       unity.alertMsg("资产已下线，即将返回上一页。")
       setTimeout(function () { //三秒返回上一个
         var url = $.cookie("preURL")
         window.location = url
       }, 1000);
     }
    console.log(res.data);
    $.cookie('detailPageId', res.data.assetId, { path: "" })
    value.detailData = res.data;
    var relateId = res.data.assetId;
    pegeId = relateId
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
    topContent.init();
    assetList.init();
    if (res.data.assetType === "Column") {
        $(".column").remove()
        $(".indexTop,.indexButtom,.ru").remove()
      $(".topContent").append('<div class="column"><div class="scrollLeft"></div></div>')
      value.pageType = "Column"
      column.init()
      areaObj = column; //初始焦点赋值
    } else {
       $(".column").remove()
       $(".indexTop,.indexButtom,.ru").remove()
      $(".topContent").append('<div class="indexTop"><div class="scrollLeft"></div></div><div class="ru"></div><div class ="indexButtom"><div class="scrollLeft"></div></div>')
      value.pageType = "Series"
      indexTop.init();
      indexButtom.init();
      areaObj = indexButtom; //初始焦点赋值
    }
    $.imgLazyLoad(); //懒加载
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
        $.removeCookie("jump", {path: "/"})
      } catch(error) {
        console.log('埋点错误', error)
        $.removeCookie("jump", {path: "/"})
      }
    }
  },
  function(err) {
    unity.alertMsg("资产已下线，即将返回上一页。")
    setTimeout(function () { //三秒返回上一个
      var url = $.cookie("preURL")
      window.location = url
    }, 1000);
  })
}


var topContent = {
  btnNum: 0,
  isCollect: false,
  init: function () {
    $(".imgBig").html('<img src="' + value.detailData.assetImg + '"/>')
    $(".name").html('<span class="header-name">' + value.detailData.assetName + '</span> <span class="header-score">' + value.detailData.score + '</span>');
    $(".info").html(value.detailData.area + " | " + value.detailData.language + " | " + value.detailData.year)
    $(".description").html(value.detailData.description);
  },
  up: function () {
    return
  },
  down: function () {
    $('.btnBox div').eq(this.btnNum).removeClass('active')
    if (value.pageType === "Column") {
      areaObj = column
      $(".column .scrollLeft div").removeClass("select")
      column.addCss();
    } else {
      areaObj = indexTop
      $(".indexTop .scrollLeft div").removeClass("select");
      $(".indexTop .scrollLeft div").eq(indexTop.itemNo).addClass("active");
    }

  },
  left: function () {
    if (this.btnNum === 0) return
    $('.btnBox div').eq(this.btnNum).removeClass('active')
    this.btnNum--
    $('.btnBox div').eq(this.btnNum).addClass('active')
  },
  right: function () {
    if (this.btnNum === 2) return
    $('.btnBox div').eq(this.btnNum).removeClass('active')
    this.btnNum++
    $('.btnBox div').eq(this.btnNum).addClass('active')
  },
  enter: function () {
    if (this.btnNum === 0) {
      // 订购
      var contentId = 'YANHUA-' + value.detailData.assetId
      var contentNAME = value.detailData.assetName
      // alert('YANHUA-1555839')
      var userId = encodeURI(localStorage.getItem("userId"))
      var stbId = encodeURI(localStorage.getItem("stbId"))
      // var contentId = encodeURI('YANHUA-1555839')
      var contentId = encodeURI(contentId)
      // var contentName = encodeURI('贝瓦爱学习第一季：贝瓦艾英语')
      var contentName = encodeURI(contentNAME)
      var productIds = encodeURI('ZJYH_SJJX_SVOD')
      var spId = encodeURI('926626')
      var url = encodeURI('http://winnow-bs.yanhuamedia.tv/shanxi/source/detail/movieDetails.html')
      var sign = encodeURI(hex_md5(userId + stbId + contentId + productIds + spId))

      // Cookies.set('contentId', contentId, {path: '/'})
      // Cookies.set('contentName', contentName, {path: '/'})

      localStorage.setItem('contentId', contentId)
      localStorage.setItem('contentName', contentName)
      // console.log('打印订购')
      // console.log('https://sxydbims.bestv.com.cn:8085/aaa/subscribe.jsp?userId=' + userId + '&stbId=' + stbId + '&contentId=' + contentId + '&contentName=' + contentName + '&productIds=' + productIds + '&spId=' + spId + '&backUrl=' + url + '&sign=' + sign)
      if ($.cookie("isOrder") == 1) {
        window.location.href = 'https://sxydbims.bestv.com.cn:8086/aaa/subscribe.jsp?userId=' + userId + '&stbId=' + stbId + '&contentId=' + contentId + '&contentName=' + contentName + '&productIds=' + productIds + '&spId=' + spId + '&backUrl=' + url + '&sign=' + sign
        // window.location.href = 'https://sxydbims.bestv.com.cn:8085/aaa/subscribe.jsp?userId=' + userId + '&stbId=' + stbId + '&contentId=' + contentId + '&contentName=' + contentName + '&productIds=' + productIds + '&spId=' + spId + '&backUrl=' + url + '&sign=' + sign
      }
      
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
    }
  },
}

var indexTop = {
  data: {},
  itemNo: 0,
  arrayNum: 0,
  init: function () {
    this.data = value.detailData.itemList;
    var total = this.data.length;
    this.arrayNum = Math.floor((total-1) / 10) * 1;
    for (var i = 0; i < this.arrayNum; i++) {
      $(".indexTop .scrollLeft").append('<div class= "topNum">' + i + 1 + '-' + (i + 1) + 0 + '</div>')
    };
    if (total > this.arrayNum * 10) {
      $(".indexTop .scrollLeft").append('<div class= "topNum">' + this.arrayNum + 1 + '-' + total + '</div>')
    }
    $(".indexTop .scrollLeft div").eq(this.itemNo).addClass("select")
  },
  addCss: function () {
    $(".indexTop .scrollLeft div").eq(this.itemNo).addClass("active")
    $(".indexTop .scrollLeft").stop(true, true).animate({
      left: -100 * this.itemNo
    }, 200)
    indexButtom.itemNo = this.itemNo * 10;
    $(".indexButtom .scrollLeft div").removeClass("select")
    $(".indexButtom .scrollLeft div").eq(indexButtom.itemNo).addClass("select")
    $(".indexButtom .scrollLeft").stop(true, true).animate({
      left: -100 * indexButtom.itemNo
    }, 200)
  },
  removeCss: function () {
    $(".indexTop .scrollLeft div").eq(this.itemNo).removeClass("active")
  },
  up: function () {
    areaObj = topContent
    this.removeCss();
    $(".indexTop .scrollLeft div").eq(this.itemNo).addClass("select")
    $('.btnBox div').eq(topContent.btnNum).addClass('active')
  },
  down: function () {
    areaObj = indexButtom
    this.removeCss();
    $(".scrollLeft div").removeClass("select");
    $(".indexTop .scrollLeft div").eq(this.itemNo).addClass("select");
    indexButtom.addCss()
  },
  left: function () {
    if (this.itemNo === 0) return;
    this.removeCss();
    this.itemNo--;
    this.addCss();
  },
  right: function () {
    if (this.itemNo === this.arrayNum) return;
    this.removeCss();
    this.itemNo++;
    this.addCss();
  },
  
}

var indexButtom = {
  data: {},
  itemNo: 0,
  init: function () {
    // $(".column").empty();
    this.data = value.detailData.itemList;
    for (i in this.data) {
      $(".indexButtom .scrollLeft").append('<div class= "buttomNum">' + (i * 1 + 1) + '</div>')
    };
    // $(".indexButtom .scrollLeft div").eq(this.itemNo).addClass("select")
    this.addCss();
  },
  removeCss: function () {
    $(".indexButtom .scrollLeft div").eq(this.itemNo).removeClass("active")
  },
  addCss: function () {
    $(".indexButtom .scrollLeft div").eq(this.itemNo).addClass("active")
    $(".indexButtom .scrollLeft").stop(true, true).animate({
      left: -100 * this.itemNo
    }, 200)
    if (this.itemNo % 10 === 0 || (this.itemNo + 1) % 10 === 0) {
      indexTop.itemNo = Math.floor(this.itemNo / 10)
      $(".indexTop .scrollLeft div").removeClass("select")
      $(".indexTop .scrollLeft div").eq(indexTop.itemNo).addClass("select")
      $(".indexTop .scrollLeft").stop(true, true).animate({
        left: -100 * indexTop.itemNo
      }, 200)
    }
  },
  up: function () {
    areaObj = indexTop
    this.removeCss();
    $(".scrollLeft div").removeClass("select")
    $(".indexButtom .scrollLeft div").eq(this.itemNo).addClass("select")
    $(".indexTop .scrollLeft div").eq(indexTop.itemNo).addClass("active")
  },
  down: function () {
    areaObj = assetList
    this.removeCss();
    $(".indexButtom .scrollLeft div").eq(this.itemNo).addClass("select");
    assetList.addCss()
    $(".seriesDetail").scrollTop(350)
  },
  left: function () {
    if (this.itemNo === 0) return;
    this.removeCss();
    this.itemNo--;
    this.addCss();
  },
  right: function () {
    if (this.itemNo === this.data.length - 1) return;
    this.removeCss();
    this.itemNo++;
    this.addCss();
  },
  enter: function() {
    localStorage.setItem('itemNo', this.itemNo)
        // if ($.cookie("isOrder") != 1 && this.itemNo >= 1) { //走订购  未订购 大于三级
        //   if (window.location.search != null || window.location.search.length > 0) {
        //     var returnURL = window.location.href.split("?")[0]
        //   } else {
        //     var returnURL = window.location.href
        //   }
        //   // // 点击订购埋点
        //   // try {
        //   //   var param = {
        //   //     page_id: pegeId,
        //   //     page_type: '0301'
        //   //   }
        //   //   bi.orderClick(param)
        //   // } catch (error) {
        //   //   console.log('埋点错误', error)
        //   // }
        //   var url = "../player/player.html?" + Math.random()
        //   window.location = url
        // } else {
          // 给播放页parent_page_id存值
          $.cookie("play_id", pegeId, {
            path: '/'
          })
          var historyData = {};
          historyData.assetId = value.detailData.assetId;
          historyData.g_playlong = 0;
          historyData.contentNum = this.itemNo;      
          historyData.score = value.detailData.score;
          historyData.assetImg = value.detailData.assetImg;
          historyData.assetName = value.detailData.assetName;
          historyData.relateLayout = value.detailData.layout;
          unity.uploadPayList(historyData);
          
          var url = "../player/player.html?" + Math.random()
          window.location = url
        // }
  }
}

var column = { //综艺详情
  data: {},
  itemNo: 0,
  init: function () {
    $(".scrollLeft").empty()
    this.data = value.detailData.itemList
    for (i in this.data) {
      // $(".scrollBox").append('<div class= "wordColumn"><div class="textColumn">' + this.data[i].itemName + '</div> <div class="text-copy-column"></div></div>')
      $(".column .scrollLeft").append('<div class= "wordColumn">' + this.data[i].itemName + '</div>')
    }
    this.addCss();
  },
  addCss: function () {
    $(".scrollLeft div").eq(this.itemNo).addClass('active');
    $(".wordColumn").eq(this.itemNo).html('<marquee scrolldelay=80>' + this.data[this.itemNo].itemName + '</marquee>')
    $(".scrollLeft").stop(true, true).animate({
       left: -210 * this.itemNo
     }, 200)
  },
  removeCss: function () {
    $(".scrollLeft div").eq(this.itemNo).removeClass('active');
    $(".wordColumn").eq(this.itemNo).html(this.data[this.itemNo].itemName)
  },
  up: function () {
    areaObj = topContent
    this.removeCss();
    $(".column .scrollLeft div").eq(this.itemNo).addClass("select")
    $('.btnBox div').eq(topContent.btnNum).addClass('active')
  },
  down: function () {
    areaObj = assetList
    this.removeCss()
    $(".column .scrollLeft div").removeClass("select")
    $(".column .scrollLeft div").eq(this.itemNo).addClass("select")
    assetList.addCss()
    $(".seriesDetail").scrollTop(350)
  },
  left: function () {
    if (this.itemNo === 0) return;
    this.removeCss();
    this.itemNo--;
    this.addCss()
   
  },
  right: function () {
    if (this.itemNo === this.data.length - 1) return;
    this.removeCss();
    this.itemNo++;
    this.addCss()
  },
  enter: function () {
    if ($.cookie("isOrder") != 1 && this.itemNo >= 1) { //走订购  未订购 大于三级
       if (window.location.search != null || window.location.search.length > 0) {
         var returnURL = window.location.href.split("?")[0]
       } else {
         var returnURL = window.location.href
       }
      // 点击订购埋点
      try {
        var param = {
          page_id: pegeId,
          page_type: '0301'
        }
        bi.orderClick(param)
      } catch (error) {
        console.log('埋点错误', error)
      }
       unity.order(returnURL)
    } else {
      // 给播放页parent_page_id存值
      $.cookie("play_id", pegeId, {
        path: '/'
      })
      var historyData = {};
      historyData.assetId = value.detailData.assetId;
      historyData.g_playlong = 0;
      historyData.contentNum = this.itemNo;
      historyData.score = value.detailData.score;
      historyData.assetImg = value.detailData.assetImg;
      historyData.assetName = value.detailData.assetName;
      historyData.relateLayout = value.detailData.layout;
      unity.uploadPayList(historyData);
      var url = "../player/player.html?fromPage=seriesDetail.html&contentNum=" + this.itemNo + "&g_playlong=0"
      window.location = url
    }
  }
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
 
}
var assetList = {
  data: {},
  itemNo: 0,
  init: function () {
    $(".assetList ul").empty()
    this.data = value.detailData.assetList
    for (var i = 0; i < 6; i++) {
      $(".assetList ul").append('<li><div class="imgbox"><div class="score"><span>' + this.data[i].score + '</span></div><img class="lazyload" src="../public/images/1img_loading_160x230.png"  data-img="' + this.data[i].assetImg + '"/></div><div class="word">' + this.data[i].assetName + '</div></li>')
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
    $.imgLazyLoad(); //懒加载
  },

  removeCss: function () {
    $(".assetList li").eq(this.itemNo).removeClass('active');
    $(".assetList .word").eq(this.itemNo).html(this.data[this.itemNo].assetName)
  },

  up: function () {
    $(".indexButtom .scrollLeft div").removeClass("select");
    $(".seriesDetail").scrollTop(0)
    if (value.pageType === "Series") {
      areaObj = indexButtom
      this.removeCss();
      $('.indexButtom .scrollLeft div').eq(indexButtom.itemNo).addClass('active')
    } else {
      areaObj = column
      this.removeCss();
      column.addCss();
    }
  },

  down: function () {
    return
  },

  left: function () {
    if (this.itemNo === 0) return
    this.removeCss()
    this.itemNo--
    this.addCss()
    $('.btnBox div').eq(this.btnNum).addClass('active')
  },

  right: function () {
    if (this.itemNo === 5) return
    this.removeCss()
    this.itemNo++
    this.addCss()
  },
  enter: function () {
    areaObj = topContent
    var url = this.data[this.itemNo].jsonUrl
    $.cookie('detailUrl', url,{path:"/"})
    localStorage.setItem('detailUrl', url)
    value.url = url;
    // 点击推荐位上报
    try {
      var jsonOb = {}
      jsonOb.pos_id = ''
      jsonOb.recmd_id = '3'
      jsonOb.page_type = '0301'
      jsonOb.page_id = $.cookie('detailPageId')
      jsonOb.click_type = '1'
      jsonOb.cid = this.data[this.itemNo].assetId.toString()
      bi.jumpRecommend(jsonOb)
      $.cookie('recommend', '3', {path: "/"})
      $.cookie('position', '', {path: "/"})
    } catch (error) {
      console.log('埋点错误', error)
    }
    // 点击资产详情上报
    try {
      var param = {
        parent_page_type:'0301',
        parent_page_id: pegeId
      }
      $.cookie("jump", JSON.stringify(param), {
        path: '/'
      });
    } catch (error) {
      console.log('埋点错误', error)
    }
    getData(url)
    this.removeCss();
    this.itemNo = 0;
    topContent.btnNum = 0;
    indexTop.itemNo = 0;
    indexButtom.itemNo = 0;
    column.itemNo = 0;
    $(".scrollLeft").animate({
      left: 0
    }, 200)
    $(".seriesDetail").scrollTop(0)
     $(".wordScroll").animate({
       top: 0
     }, 0)
  },
}

value.getValue();

if (!value.isBack) {
  value.url = $.cookie("detailUrl")
  getData(value.url)
} else {
    value.url = $.cookie("detailUrl")
    getData(value.url)
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
      if(areaObj==descriptionBox) {
         $(".descriptionBox").css("visibility", "hidden");
         areaObj = topContent;
         return
      }
      // 返回上报
      // try {
      //   var param = {
      //     parent_page_type:'0301',
      //     parent_page_id: pegeId
      //   }
      //   $.cookie("jump", JSON.stringify(param), {
      //     path: '/'
      //   });
      // } catch (error) {
      //   console.log('埋点错误', error)
      // }
      if($.cookie("fromEPG")==1) {  //判断是否来自推荐
        $.cookie('fromEPG',0,{path:"/"})
        window.location= "../index/home.html"
      } else {
        var url = $.cookie("preURL")
        window.location = url
      }
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