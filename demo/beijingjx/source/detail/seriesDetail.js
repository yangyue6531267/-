var pegeId; //全集资产id——>assetId
var seriesItemIndex;
var pageassetType ; //assetType---61
var playReady = false
var indexSingle = {
    data: {},//res.data == value.detailData
    element: null,
    itemNo: 0,
    indexPlay: 0,
    HistoryList: [],
    isHistory :false,
    newplayTime:0
}
var value = {
  detailData: {}, //object--res.data
  authCode: '3a',
  itemNo: 0,  //子集序号
  isBack: false,
  url: "",
  detailUrl: "", //详情页地址
  pageType: 'Series',//页面类型 //column
  isOrder: 0,
  getValue: function () {
    console.log(value.isorder)  //undefined
    if (window.location.search.length > 0) {
      this.isBack = true;
      if (unity.getVars("contentNum")) {  //  播放页返回焦点记忆
        indexButtom.itemNo = unity.getVars("contentNum") - 1;
        column.itemNo = unity.getVars("contentNum") - 1;
      }
      if (unity.getVars("result") == 0) {
        this.isOrder = 1;  // 已订购 直接播放
        $.cookie("isOrder", 1, { path: "/" })
        var itemNo = $.cookie("currItem");
      } else {
        this.isOrder = 0
        $.cookie("isOrder", 0, { path: "/" })
      }
      indexButtom.itemNo = 0;
      column.itemNo = 0;
    } else {
      this.isOrder = $.cookie("isOrder");
      console.log(this.isOrder)
    }
  },
}
var getData = function (url) { //显示页面数据资产 ---  判断类型初始焦点赋值
  // detailAuth(pegeId);
  console.log(url);
  value.detailUrl = url 
  console.log("获取电视剧详情数据");
  unity.jsonp(url, function (res) {
    console.log("res.code--- "+res.code)
    if (res.code == 605) {
      $(".loading").css("visibility", "hidden");
      unity.alertMsg("资产已下线，即将返回上一页。")
      setTimeout(function () { //三秒返回上一个
        var url = $.cookie("preURL")
        window.location = url
      }, 1000);
    }else{
    indexSingle.data = res.data; //object
    $.cookie('detailPageId', res.data.assetId, { path: "" })
    console.log("seriesresdata",res.data) //
    value.detailData = res.data;
    setStorage("seriesresdata",JSON.stringify(res.data))
    pageassetType = res.data.assetType
    console.log("电视剧res.data----")
    //鉴权回来播放   局方鉴权是跳转url，会立即返回returnURL，并且挂参
    // if (unity.getVars("result") == 0) {
    //   var itemNo = $.cookie("currItem");
    //   var historyData = {};
    //   historyData.assetId = value.detailData.assetId;
    //   historyData.g_playlong = 0;
    //   historyData.contentNum = itemNo;
    //   historyData.score = value.detailData.score;
    //   historyData.assetImg = value.detailData.assetImg;
    //   historyData.assetName = value.detailData.assetName;
    //   historyData.relateLayout = value.detailData.layout;
    //   unity.uploadPayList(historyData);
    //   var url = "../player/player.html?fromPage=seriesDetail.html&contentNum=" + itemNo + "&g_playlong=0"
    //   window.location = url
    //   return
    // }
    $(".loading").css("visibility", "hidden"); //loading图片
    var relateId = value.detailData.assetId; //全集资产ID
    pegeId = relateId
    //else 
      //易视腾用户鉴权 
    detailAuth(pegeId);
    
    $.cookie("play_id", pegeId, {
      path: '/'
    }) ///????????
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
    if (res.data.assetType === "Column") { //
      $(".column").remove()
      $(".indexTop,.indexButtom,.ru").remove()
      $(".topContent").append('<div class="column"><div class="scrollLeft"></div></div>')
      value.pageType = "Column"
      column.init()  //
      areaObj = column; //初始焦点赋值综艺
    } else {
      $(".column").remove()
      $(".indexTop,.indexButtom,.ru").remove()
      $(".topContent").append('<div class="indexTop"><div class="scrollLeft"></div></div><div class="ru"></div><div class ="indexButtom"><div class="scrollLeft"></div></div>')
      value.pageType = "Series"
      indexTop.init();
      indexButtom.init();
      areaObj = indexButtom; //初始焦点赋值电视剧
    }
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
 }},
  function (err) {
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
    // debugger
    $(".imgBig").html('<img src="' + value.detailData.assetImg + '"/>')
    $(".name").html('<span class="header-name">' + value.detailData.assetName + '</span> <span class="header-score">' + value.detailData.score + '</span>');
    $(".info").html(value.detailData.area + " | " + value.detailData.language + " | " + value.detailData.year)
    $(".description").html(value.detailData.description);
    console.log("用户鉴权结果")
    console.log(succUser)
    if(succUser == "ORD-000"){
      $(".order").html("已订购")
    }
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
  back: function (){
    window.location= "../index/home.html";
  },
  enter: function () {
    if (this.btnNum === 0) {
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
        //三方收藏取消收藏 --0
        var tdata = {
          cpPrvName : "视嘉TV",
          cpPrvCode : "10000012",
          cpPrvType : "1001",
          cpLicense : "CNTV",
          account : yh.userId || yh.eth0_mac,
          programSeriesName : value.detailData.assetName,
          programSeriesId : value.detailData.assetId ,
          programId : value.detailData.itemList[indexButtom.itemNo].itemId,
          seriesNumber : indexButtom.itemNo*1+1,
          intent : "{\"action\": \" yanhua.tv.web.dispatcher\",\"package\": \"yanhua.tv.jx.beijingyd_BJYDcs\",\"component\": {\"pkg\": \"yanhua.tv.jx.beijingyd_BJYDcs\",\"cls\": \"com.yanhua.tv.yhweb.Dispatcher\"},\"extras\": { \"pageUrl\" : \"http://winnow-bs.yanhuamedia.tv/beijingjx/source/detail/seriesDetail.html?assetId="+value.detailData.assetId+"\"}}",
          imageUrl : value.detailData.assetImg,
          collectionFlag : 0  //0为取消
        };
        console.log(JSON.stringify(tdata))
        unity.TisCollect(tdata , function(res){
          console.log(JSON.stringify(res));
          if( res.code === 0){  //已收藏
            console.log("三方收藏删除成功")
          }else{
            console.log("三方收藏删除失败")
          }
        })
        topContent.isCollect = false
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
        //三方收藏添加收藏
        var tdata = {
          cpPrvName : "视嘉TV",
          cpPrvCode : "10000012",
          cpPrvType : "1001",
          cpLicense : "CNTV",
          account : yh.userId || yh.eth0_mac,
          programSeriesName : value.detailData.assetName,
          programSeriesId : value.detailData.assetId ,
          programId : value.detailData.itemList[indexButtom.itemNo].itemId,
          seriesNumber : indexButtom.itemNo*1+1,
          intent : "{\"action\": \" yanhua.tv.web.dispatcher\",\"package\": \"yanhua.tv.jx.beijingyd_BJYDcs\",\"component\": {\"pkg\": \"yanhua.tv.jx.beijingyd_BJYDcs\",\"cls\": \"com.yanhua.tv.yhweb.Dispatcher\"},\"extras\": { \"pageUrl\" : \"http://winnow-bs.yanhuamedia.tv/beijingjx/source/detail/seriesDetail.html?assetId="+value.detailData.assetId+"\"}}",
          imageUrl : value.detailData.assetImg,
          collectionFlag : 1 //1 为添加
        };
        console.log(typeof(indexButtom.itemNo))
        unity.TisCollect(tdata , function(res){
          console.log("TisCollect--"+ JSON.stringify(res));
          if( res.code == 0){  
            console.log("三方收藏添加成功")
          }else{
            console.log("三方收藏添加失败")
          }
        })
        topContent.isCollect = true;
      }
    } else if (this.btnNum === 1) {
      $(".descriptionBox").css("visibility", "visible");
      descriptionBox.init()
      areaObj = descriptionBox
    } else if (this.btnNum === 2) {
      if(succUser == "ORD-000") return;
      window.location.href="./../pay/payfor/index.html";
    }
  },
}

var indexTop = {
  data: {}, // itemList
  itemNo: 0,
  arrayNum: 0,
  init: function () {
    // debugger
    this.data = value.detailData.itemList;
    var total = this.data.length; //全集集数
    this.arrayNum = Math.floor((total - 1) / 10) * 1;
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
  back: function(){
    history.go(-1)
  }
}

//电视剧
var indexButtom = {
  data: {},
  itemNo: 0,//索引-1
  init: function () {
    //$(".column").empty();
    //判断历史记录--->焦点初始化
    this.data = value.detailData.itemList;
    for (i in this.data) {
      $(".indexButtom .scrollLeft").append('<div class= "buttomNum">' + (i * 1 + 1) + '</div>')
    };
    //$(".indexButtom .scrollLeft div").eq(this.itemNo).addClass("select")
    unity.qeryHistory(function(hisObj){
      if(hisObj){
        console.log('历史对象==='+JSON.stringify(hisObj))
        var hqobj = hisObj.data.resultList;
        console.log(indexSingle.data.itemList.length)
          for(var i=0 ; i< hqobj.length; i++){
            if (value.detailData.assetId == hqobj[i].relateId){
              console.log(JSON.stringify(hqobj[i]))
              console.log("历史记录资产id"+hqobj[i].relateId)
              indexButtom.itemNo = hqobj[i].relateEpisode*1-1;
              console.log(indexButtom.itemNo);
              $(".indexButtom .scrollLeft div").eq(0).removeClass("active")
              if(indexButtom.itemNo === indexSingle.data.itemList.length){
                indexButtom.itemNo --;
                console.log("查询itemNo"+indexButtom.itemNo) 
                indexTop.itemNo = Math.floor((indexButtom.itemNo - indexButtom.itemNo % 10)/ 10)
                console.log("查询indexTop.itemNo"+indexTop.itemNo)
                $(".indexTop .scrollLeft div").removeClass("select")
                $(".indexTop .scrollLeft div").eq(indexTop.itemNo).addClass("select")
                $(".indexTop .scrollLeft").stop(true, true).animate({
                  left: -100 * indexTop.itemNo
                }, 200)           
              }
              indexButtom.addCss();
            }
          }
      }
    });
    this.addCss();
    //三方收藏判断收藏
    // var tdata = {
		// 	cpPrvName : "视嘉TV",
		// 	cpPrvCode : "10000012",
		// 	cpPrvType : "1001",
		// 	cpLicense : "CNTV",
		// 	account : yh.userId || yh.eth0_mac,
		// 	programSeriesName : value.detailData.assetName,
		// 	programSeriesId : value.detailData.assetId ,
		// 	programId : value.detailData.itemList[indexButtom.itemNo].itemId,
    // };
    // unity.TisCollect(tdata , function(res){
    //   console.log(res);
    //   if( res.code == 0){  
    //     console.log("调用判断成功")
    //   }else{
    //     console.log("调用判断失败")
    //   }
    // })
  },
  removeCss: function () {
    $(".indexButtom .scrollLeft div").eq(this.itemNo).removeClass("active")
  },
  addCss: function () {
    console.log(this.itemNo)
    $(".indexButtom .scrollLeft div").eq(this.itemNo).addClass("active")
    $(".indexButtom .scrollLeft").stop(true, true).animate({
      left: -100 * this.itemNo
    }, 200)
    // if (this.itemNo % 10 === 0 || (this.itemNo + 1) % 10 === 0) {
      indexTop.itemNo = Math.floor((indexButtom.itemNo - indexButtom.itemNo % 10)/ 10)
      console.log(indexTop.itemNo)
      $(".indexTop .scrollLeft div").removeClass("select")
      $(".indexTop .scrollLeft div").eq(indexTop.itemNo).addClass("select")
      $(".indexTop .scrollLeft").stop(true, true).animate({
        left: -100 * indexTop.itemNo
      }, 200)
    // }
  },
  cssAll: function(itemNo){
    console.log("this.itemNo—— "+this.itemNo)//
    console.log("indexSingle.itemNo--"+indexSingle.itemNo)
    for(var i = 0 ; i < indexSingle.itemNo ; i++){
          $(".indexButtom .scrollLeft div").eq(this.itemNo).removeClass("active")
    }
    this.itemNo = indexSingle.itemNo
    if(this.itemNo >= indexSingle.data.itemList.length){
      this.itemNo = indexSingle.data.itemList.length-1;
    }
    console.log(this.itemNo)
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
    console.log("this.itemNo----",this.itemNo)
  },
  right: function () {
    if (this.itemNo === this.data.length - 1) return;
    this.removeCss();
    this.itemNo++;
    console.log(this.itemNo)
    console.log("itemNo")
    this.addCss();
  },
  back: function () {
  //   window.location= "../index/home.html";
     history.go(-1)
  },
  enter: function () {
    unity.qeryHistory(function(hisObj){
      if(hisObj){
        var hqobj = hisObj.data.resultList;
          for(var i=0 ; i< hqobj.length; i++){
            if (value.detailData.assetId == hqobj[i].relateId){
              console.log(indexButtom.itemNo)
              if (indexButtom.itemNo == hqobj[i].relateEpisode*1-1){
                indexSingle.newplayTime = hqobj[i].relateTime;
                console.log("播放记录时间"+indexSingle.newplayTime)
              }else{
                playerBox.positionBar = 0;
                indexSingle.newplayTime = 0;
              }
            }
          }
      }
    });
    if (this.itemNo >= 2) { //第三集判断是否是会员，通过继续播放
      itemNoindex = this.itemNo
      seriesItemIndex = this.itemNo
      indexSingle.itemNo = this.itemNo
      if(succUser == "ORD-000"){
        //易视腾用户鉴权通过
        // $(".order").css("display","none")
        // getClass('order').style.visibility = "hidden";
        player.play(seriesItemIndex,pageassetType)
        player.initPlayer()
        player.toggleShow('showPlayer')  //显示播放器
        player.setCallback(videoStateChange)
        try {
          playerBox.fullPlay()
          areaObj = playerBox
        } catch (error) {
          console.log(error)
        }
      }else{
        //易视腾用户未订购，弹框
        console.log("易视腾用户未订购",succUser)
        window.location.href = "./../pay/payfor/index.html"
        // $(".tips").css("display","block")
        // areaObj = tips;
      }
     
      
      // if (window.location.search != null || window.location.search.length > 0) {
      //   var returnURL = window.location.href.split("?")[0]
      // } else {
      //   var returnURL = window.location.href
      // }
      
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

      $.cookie("currItem", this.itemNo, {
        path: '/'
      })
      $.cookie("play_id", pegeId, {
        path: '/'
      })
      //unity.order(returnURL, value.detailData.itemList[this.itemNo].vodList[0].playUrl, value.detailData.assetName);
    } else {
     //免费观看两集
     itemNoindex = this.itemNo
     console.log("this.itemNo---free"+this.itemNo)
     seriesItemIndex = this.itemNo
     indexSingle.itemNo = this.itemNo
     console.log(itemNoindex);
     console.log("this.itemNo")
      player.play(seriesItemIndex,pageassetType)
      player.initPlayer()
      player.toggleShow('showPlayer')  //显示播放器
      player.setCallback(videoStateChange)
      
      try {
        playerBox.fullPlay()
        areaObj = playerBox
      } catch (error) {
        console.log(error)
      }
      
    }
  }
}

//播放器
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
    //全屏初始化
    if (playerBox.timer) {
      clearInterval(playerBox.timer);
    }
    playerBox.timer = setInterval(function () {
      // console.log("playerBox.timer......................")
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
    console.log(JSON.stringify(res))
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
    playerBox.init()
    playerBox.status = -2
    if (playerBox.status != -2) return
    areaObj = playerBox;
    playerBox.isfullPlay = true;
    getId('seriesDetail').style.visibility = 'hidden';
    player.upPlayerLocation({ x: 0, y: 0, w: -1, h: -1 });
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
          programIdID: value.detailData.itemList[indexSingle.itemNo].itemId,
          chargeType: chargeType,
          resolution: 0,
          moveLength: playerBox.detailData.allTime,
          playID: getParam('migu_play_url', value.detailData.itemList[indexSingle.itemNo].vodList[0].playUrl),
          location: playerBox.detailData.curPlayTime
        }
      }
      if (playerBox.detailData.curPlayTime > 0) {
        adStat(params);
      }

      var chargeType = 0;
      if (indexSingle.itemNo > 0) {
        chargeType = 1;
      }
      var params = {
        type: 4,
        content: {
          type: 16,
          seriesID: value.detailData.assetId,
          programIdID: value.detailData.itemList[indexSingle.itemNo].itemId,
          chargeType: chargeType,
          resolution: 0,
          moveLength: playerBox.detailData.allTime,
          playID: getParam('migu_play_url', value.detailData.itemList[indexSingle.itemNo].vodList[0].playUrl),
          location: playerBox.detailData.curPlayTime
        }
      }
      if (playerBox.detailData.curPlayTime > 0) {
        adStat(params);
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
          type: 16,
          seriesID: value.detailData.assetId,
          programIdID: value.detailData.itemList[indexSingle.itemNo].itemId,
          chargeType: chargeType,
          resolution: 0,
          moveLength: playerBox.detailData.allTime,
          playID: getParam('migu_play_url', value.detailData.itemList[indexSingle.itemNo].vodList[0].playUrl),
          location: playerBox.detailData.curPlayTime
        }
      }
      if (playerBox.detailData.curPlayTime > 0) {
        adStat(params);
      }
    } catch (e) {
      console.log(e);
    }
  },
  //停止播放并且隐藏播放器
  hidePlayer: function () {
    // getId('imgBig').style.display = 'block';
    player.stop();
    player.toggleShow('hidePlayer');
    areaObj = topContent
  },
  playNext: function (curr) {
    console.log("播放下一集");
    if (curr == 'next') {
      //自动跳转下一集
      console.log('切集之前'+ indexSingle.itemNo);
      console.log(JSON.stringify(indexSingle.data.itemList.length))//总集数
      indexSingle.itemNo++;
      console.log('切集之后'+indexSingle.itemNo);
      if (indexSingle.itemNo >= indexSingle.data.itemList.length) {// 播放到最后一集了退出播放器
        playerBox.hiddenBar()
        playerBox.back()   
      }
    //  indexSingle.indexPlay = indexSingle.itemNo;
      if(indexSingle.itemNo>1){
        console.log('超过两集')
          if (succUser == "ORD-000") {
            console.log('已订购')
            if (indexSingle.itemNo >= indexSingle.data.itemList.length) return;
            if (playerBox.status != -2) {
              var playUrl = value.detailData.itemList[indexSingle.itemNo].vodList[0].playUrl;
              playerBox.playUrl = playUrl;
              // indexSingle.initPayActive();
              // indexSingle.uploadIndexPay();
              player.stop();
              indexSingle.newplayTime = 0
              player.play(value.authCode, playUrl);
              playerBox.init();
            } else {
              //播放器未初始化
              playerBox.play();
            }
          } else {
            console.log('未订购')
            window.location.href = "./../pay/payfor/index.html"  //unifiedOrder(contentID);
          }
      }else{
        console.log('前两集免费')
        if (playerBox.status != -2) {
          var playUrl = value.detailData.itemList[indexSingle.itemNo].vodList[0].playUrl;
          playerBox.playUrl = playUrl;
          player.stop();
          indexSingle.newplayTime = 0
          player.play();
          playerBox.init();
        } else {
          //播放器未初始化
          player.init();
        }
      }
    } 
  },
  up: function () { },
  down: function () { },
  left: function () {
    if(wlstatus !== "pass") return;//未来审核不通过
    if (this.detailData.allTime == 0) return ;
    playerBox.pauseStatus = 1;//暂停接收回调状态，
    getId('pause').style.visibility = "hidden";
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
    if(wlstatus !== "pass") return;//未来审核不通过
    console.log("视频总时长："+playerBox.detailData.allTime)
    if (playerBox.detailData.allTime <= 0) return;
    playerBox.pauseStatus = 1;
    getId('pause').style.visibility = "hidden";
    // if(playerBox.positionBar = playerBox.detailData.allTime-3000) return;
    console.log("进度条当前时间"+playerBox.positionBar)
    playerBox.positionBar = Number(playerBox.detailData.curPlayTime) + playerBox.fastTime;
    if (playerBox.positionBar >= playerBox.detailData.allTime-3000) {
      console.log("快进时间大于总时长"+ playerBox.detailData.curPlayTime)
      playerBox.positionBar = playerBox.detailData.allTime
      playerBox.positionBar = playerBox.detailData.allTime-3000
    } else {
      playerBox.detailData.curPlayTime = playerBox.positionBar;
    }
    console.log('快进到的时间' + playerBox.positionBar);
    console.log(playerBox.detailData.curPlayTime)
    debounce(playerBox.updateBar, 300);
  },
  enter: function () {
    if(wlstatus !== "pass") return;//未来审核不通过
    console.log(""+this.detailData.allTime)
    console.log('playerBox.status----' + playerBox.status);
    if (this.detailData.allTime == 0) return ;
    console.log("播放状态_ "+playerBox.status)
    if (playerBox.status == 1) {
      console.log("用户暂停");
      player.togglePlay('pause');
      playerBox.showPause();
    }
    if (playerBox.status == 0) {
      console.log("用户续播");
      player.togglePlay('resume');
      playerBox.hiddenPause();
    }
  },
  back: function () {
    getId('pause').style.visibility = "hidden";
    getId('footerPlayer').style.visibility = "hidden";
    if(wlstatus !== "pass") {
      document.body.removeChild(getId('toast')) 
    }//未来审核不通过 
    if (playerBox.timer) {
      clearInterval(playerBox.timer);
    } 
        if(indexSingle.itemNo === indexSingle.data.itemList.length){
          indexSingle.itemNo--;
          console.log(indexSingle.itemNo)
        }
        console.log("fanhuishi"+indexSingle.itemNo)
     playerBox.hidePlayer();
     $(".tips").css("display","none")
     getId('seriesDetail').style.visibility = 'visible';
     console.log("页面返回类型_"+pageassetType)
     if(pageassetType == "Series"){
       console.log("返回焦点---"+indexSingle.itemNo)
      indexButtom.cssAll(indexSingle.itemNo)
      areaObj = indexButtom
     }if(pageassetType == "Column"){
      console.log("返回焦点---"+indexSingle.itemNo)
      column.cssAll();
       areaObj = column
     }

  },
  seekTime: function (to) { //播放器快进快退
    var currTime = Number(playerBox.detailData.curPlayTime) + playerBox.fastTime;
    // player.seekTime({ 'seekTime': currTime });
    playerBox.showBar(); //显示播放器进度条
  },
  onStart: function (res) {
    console.log('开始播放'+JSON.stringify(res))
    playerBox.pauseStatus = 0;
    // this.detailData = res;
  },
  onPlay: function (res) {
    console.log('onplay播放'+JSON.stringify(res))
    // playerBox.hiddenBar();//
    getId('footerPlayer').style.visibility = "hidden";
    getId('pause').style.visibility = "hidden";
    this.detailData = res;
      playerBox.status = 1;
  },
  onPause: function (res) {
    console.log('暂停'+JSON.stringify(res))
    playerBox.status = 0;
    $(".imgLoading").css("visibility", "hidden"); //loading图片
  },
  onResume: function (res) {
    console.log('续播'+JSON.stringify(res))
    playerBox.status = 1;
    $(".imgLoading").css("visibility", "hidden"); //loading图片
    playerBox.hiddenPause();
  },
  onStop: function (res) {
    console.log('手动停止'+JSON.stringify(res))
    playerBox.status = 0;
    console.log('返回时当前播放时间'+ res.curPlayTime)
    // $.cookie("curPlayTime",res.curPlayTime,{path:"/"})
    // var curPlayTime = $.cookie("curPlayTime")
    console.log("当前播放焦点索引"+indexSingle.itemNo)
    console.log("该资产总集数"+value.detailData.itemList.length)
    if(indexSingle.itemNo == value.detailData.itemList.length-1 && res.curPlayTime == res.allTime){
      res.curPlayTime = 0
    }
    console.log("存储的播放记录时间"+res.curPlayTime)
    unity.playRecord(value,res.curPlayTime,indexSingle.itemNo)
    //三方历史记录存储
    var tdata = {
      cpPrvName : "视嘉TV",
      cpPrvCode : "10000012",
      cpPrvType : "1001",
      cpLicense : "CNTV",
      account : yh.userId || yh.eth0_mac,
      programSeriesName : value.detailData.assetName,
      programSeriesId : value.detailData.assetId ,
      programId : value.detailData.itemList[indexSingle.itemNo].itemId,
      seriesNumber : indexSingle.itemNo*1+1,
      score : value.detailData.score,
      totalTime : res.allTime,
      startWatchTime : 0,
      endWatchTime : res.curPlayTime,
      playTime : res.curPlayTime,
      logType : "end",
      intent : "{\"action\": \" yanhua.tv.web.dispatcher\",\"package\": \"yanhua.tv.jx.beijingyd_BJYDcs\",\"component\": {\"pkg\": \"yanhua.tv.jx.beijingyd_BJYDcs\",\"cls\": \"com.yanhua.tv.yhweb.Dispatcher\"},\"extras\": { \"pageUrl\" : \"http://winnow-bs.yanhuamedia.tv/beijingjx/source/detail/seriesDetail.html?assetId="+value.detailData.assetId+"\"}}",
      imageUrl : value.detailData.assetImg,
    };
    console.log("三方历史tdata")
    console.log(tdata)
   unity.Thistory(tdata , function(res){
     console.log(JSON.stringify(res));
     if( res.code == 0){  
       console.log("三方历史记录添加成功")
     }else{
       console.log("三方历史记录添加失败")
     }
   })
 },
  onCompleted: function ( res) {
    playerBox.pauseStatus = 1;
    // this.detailData = res;
    this.status = 2;
    //播放完毕操作
    console.log('onCompleted-------------------' + JSON.stringify(res));
    console.log('onComplete切集之前'+indexSingle.itemNo);
      if (indexSingle.itemNo >= indexSingle.data.itemList.length) {// 播放到最后一集了退出播放器
        playerBox.hiddenBar()
        playerBox.back()   
      }
    this.playNext('next');
  },
  onError: function (res) {
    this.detailData = null;
    this.status = 3;
    console.log('onError-------------------' + JSON.stringify(res))
  },
  onBufferingStart: function (res) {
    // this.status = -1;
    console.log('onBufferingStart-------------------' + JSON.stringify(res))
    // $(".imgLoading").css("visibility", "visible"); //loading图片
  },
  onBufferfinish: function (res) {
    console.log('onBufferfinish-------------------' + JSON.stringify(res))
    // $(".imgLoading").css("visibility", "hidden"); //loading图片
  },
  onProgress: function (res) {
    playerBox.uploadPlayStatus(res);
    console.log('onProgress-------------------' + JSON.stringify(res));
  },
}

//综艺
var column = { //综艺详情
  data: {},
  itemNo: 0,
  init: function () {
    // debugger
    $(".scrollLeft").empty()
    this.data = value.detailData.itemList
    for (i in this.data) {
      // $(".scrollBox").append('<div class= "wordColumn"><div class="textColumn">' + this.data[i].itemName + '</div> <div class="text-copy-column"></div></div>')
      $(".column .scrollLeft").append('<div class= "wordColumn">' + this.data[i].itemName + '</div>')
    }
    unity.qeryHistory(function(hisObj){
      if(hisObj){
        console.log('历史对象==='+JSON.stringify(hisObj))
        var hqobj = hisObj.data.resultList;
        // var allres=[]
          for(var i=0 ; i< hqobj.length; i++){
            if (value.detailData.assetId == hqobj[i].relateId){
              console.log("历史ID"+hqobj[i].relateId)
              column.itemNo = hqobj[i].relateEpisode*1-1;
              if(hqobj[i].relateEpisode*1>1){
                $(".scrollLeft div").eq(0).removeClass("active")
                $(".wordColumn").eq(0).html(value.detailData.itemList[0].itemName)
              }
              column.addCss();
            }
          }
      }
    });
    this.addCss();
        //三方收藏判断收藏
        // console.log(topContent.isCollect)
        // var data = {
        //   cpPrvName : "视嘉TV",
        //   cpPrvCode : "10000012",
        //   cpPrvType : "1001",
        //   cpLicense : "CNTV",
        //   account : yh.userId || yh.eth0_mac,
        //   programSeriesName : value.detailData.assetName,
        //   programSeriesId : value.detailData.assetId ,
        //   programId : value.detailData.itemList[column.itemNo].itemId,
        // };
        // unity.TisCollect(data , function(res){
        //   console.log(res);
        //   if( res.code == 0){  
        //     console.log("调用判断成功")
        //   }else{
        //     console.log("调用判断失败")
        //   }
        // })
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
  cssAll: function(itemNo){
    console.log("this.itemNo—— "+this.itemNo)//
    console.log("indexSingle.itemNo--"+indexSingle.itemNo)
    for(var i = 0 ; i < indexSingle.itemNo ; i++){
      $(".scrollLeft div").eq(this.itemNo).removeClass('active');
      $(".wordColumn").eq(this.itemNo).html(this.data[this.itemNo].itemName)
    }
    this.itemNo = indexSingle.itemNo
    console.log(this.itemNo)
    $(".scrollLeft div").eq(this.itemNo).addClass('active');
    $(".wordColumn").eq(this.itemNo).html('<marquee scrolldelay=80>' + this.data[this.itemNo].itemName + '</marquee>')
    $(".scrollLeft").stop(true, true).animate({
      left: -210 * this.itemNo
    }, 200)
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
    $(".column .scrollLeft div").removeClass("select")
    this.removeCss();
    this.itemNo--;
    this.addCss()

  },
  right: function () {
    if (this.itemNo === this.data.length - 1) return;
    $(".column .scrollLeft div").removeClass("select")
    this.removeCss();
    this.itemNo++;
    this.addCss()
  },
  back: function () {
    if (playerBox.timer) {
      clearInterval(playerBox.timer);
    }
     getId('pause').style.visibility = "hidden";
     getId('footerPlayer').style.visibility = "hidden";
     $(".tips").css("display","none")
     getId('seriesDetail').style.visibility = 'visible';
     //window.location= "../index/home.html";
     history.go(-1)
  },
  enter: function () {
    unity.qeryHistory(function(hisObj){
      if(hisObj){
        var hqobj = hisObj.data.resultList;
          for(var i=0 ; i< hqobj.length; i++){
            if (value.detailData.assetId == hqobj[i].relateId){
              console.log(indexButtom.itemNo)
              if (column.itemNo == hqobj[i].relateEpisode*1-1){
                indexSingle.newplayTime = hqobj[i].relateTime;
                console.log("播放记录时间"+indexSingle.newplayTime)
              }else{
                playerBox.positionBar = 0;
                indexSingle.newplayTime = 0;
              }
            }
          }
      }
    });
    if (this.itemNo >= 2) { ////第三集判断是否是会员，通过继续播放
      indexSingle.itemNo = this.itemNo
      itemNoindex = this.itemNo
      seriesItemIndex = this.itemNo
      
      if(succUser == "ORD-000"){
        //易视腾用户鉴权通过
        //$(".order").html("已订购")
        // getClass('order').style.visibility = "hidden";
        player.initPlayer()
        player.toggleShow('showPlayer')  //显示播放器
        player.play(seriesItemIndex,pageassetType)
        player.setCallback(videoStateChange)
        try {
          playerBox.fullPlay()
          areaObj = playerBox
        } catch (error) {
          console.log(error)
        }
      }else{
        //易视腾用户未订购，弹框
        console.log("易视腾用户未订购",succUser)
        window.location.href = "./../pay/payfor/index.html"
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
      $.cookie("currItem", this.itemNo, {
        path: '/'
      })
      $.cookie("play_id", pegeId, {
        path: '/'
      })
      //unity.order(returnURL, value.detailData.itemList[this.itemNo].vodList[0].playUrl, value.detailData.assetName);
    } else {
      //给播放页parent_page_id存值
      // $.cookie("play_id", pegeId, {
      //   path: '/'
      // })
      // var historyData = {};
      // historyData.assetId = value.detailData.assetId;
      // historyData.g_playlong = 0;
      // historyData.contentNum = this.itemNo;
      // historyData.score = value.detailData.score;
      // historyData.assetImg = value.detailData.assetImg;
      // historyData.assetName = value.detailData.assetName;
      // historyData.relateLayout = value.detailData.layout;
      // unity.uploadPayList(historyData);
      // var url = "../player/player.html?fromPage=seriesDetail.html&contentNum=" + this.itemNo + "&g_playlong=0"
      // window.location = url
      //|| succUser == "ORD-201005"
      indexSingle.itemNo = this.itemNo
      itemNoindex = this.itemNo
     seriesItemIndex = this.itemNo
     console.log(itemNoindex);
     console.log("this.itemNo")
      player.initPlayer()
      player.toggleShow('showPlayer')  //显示播放器
      player.play(seriesItemIndex,pageassetType)
      player.setCallback(videoStateChange)
      try {
        playerBox.fullPlay()
        areaObj = playerBox
      } catch (error) {
        console.log(error)
      }
    }
  }
}

//未订购提示框
var tips={
  init: function(){
    areaObj == tips
  },
  enter: function(){
    $(".tips").css("display","none")
    areaObj = topContent
  },
  back: function(){
    $(".tips").css("display","none")
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
    areaObj = topContent ;
  },
  enter: function () {
    $(".descriptionBox").css("visibility", "hidden");
    areaObj = topContent ;
  },
}

var assetList = {
  data: {},
  itemNo: 0,
  init: function () {
    // debugger
    $(".assetList ul").empty()
    this.data = value.detailData.assetList
    for (var i = 0; i < 12; i++) {
      // $(".assetList ul").append('<li><div class="imgbox"><div class="score"><span>' + this.data[i].score + '</span></div><img class="lazyload" src="../public/images/img_loading_160x230.png"  data-img="' + this.data[i].assetImg + '"/></div><div class="word">' + this.data[i].assetName + '</div></li>')
      $(".assetList ul").append('<li><div class="imgbox"><div class="score"><span>' + this.data[i].score + '</span></div><img class="lazyload" src="' + this.data[i].assetImg +  '"/></div><div class="word">' + this.data[i].assetName + '</div></li>')
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
      if (value.pageType === "Series") {
        areaObj = indexButtom
        this.removeCss();
        $('.indexButtom .scrollLeft div').eq(indexButtom.itemNo).addClass('active')
      }else {
        areaObj = column
        this.removeCss();
        column.addCss();
      }
      $(".seriesDetail").scrollTop(0)
    } else {
      this.removeCss();
      this.itemNo -= 6;
      this.addCss();
    }
    $(".indexButtom .scrollLeft div").removeClass("select");
    $(".seriesDetail").scrollTop(0)
    if (value.pageType === "Series") {
      areaObj = indexButtom
      this.removeCss();
      $('.indexButtom .scrollLeft div').eq(indexButtom.itemNo).addClass('active')
    } else {
      this.removeCss();
      column.removeCss()
      column.addCss();
      areaObj = column
    }
  },

  down: function () {
    if (this.itemNo <= 5) {
      this.removeCss();
      this.itemNo += 6;
      this.addCss();
      $(".seriesDetail").scrollTop(540)
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
    // if (this.itemNo === 5) return
    if (this.itemNo === 11) return
    this.removeCss()
    this.itemNo++
    this.addCss()
  },
  back : function () {
    window.location= "../index/home.html";
  },
  enter: function () {
    areaObj = topContent
    var url = this.data[this.itemNo].jsonUrl
    $.cookie('detailUrl', url, { path: "/" })
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
      $.cookie('recommend', '3', { path: "/" })
      $.cookie('position', '', { path: "/" })
    } catch (error) {
      console.log('埋点错误', error)
    }
    // 点击资产详情上报
    try {
      var param = {
        parent_page_type: '0301',
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

function getQueryString(name) {
    const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    const urlObj = window.location;
    var r = urlObj.href.indexOf('#') > -1 ? urlObj.hash.split("?")[1].match(reg) : urlObj.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
  }
  
  var currentPage = getQueryString('assetId')
  if (currentPage) {
  //   value.url = 'http://112.17.251.186:10088/epg/?s=42|17&p=yhSystemTheme&k=1&v=1&assetId=' + currentPage + '&c=11'
       value.url = 'http://112.17.251.186:10088/?s=42|17&p=yhAssetDetail&k=1&v=1&assetId=' + currentPage + '&c=17'
    getData(value.url)
  } else {
    if (!value.isBack) {
      value.url = $.cookie("detailUrl")
      getData(value.url)
    } else {
      value.url = $.cookie("detailUrl")
      getData(value.url)
    }
  }
