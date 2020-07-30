var pegeId //---assetId
var pageassetType ;
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
  isOrder:0, //未订购
  getValue: function () {
    console.log(value.isorder)
    this.isOrder = $.cookie("isOrder");
    if (window.location.search.length > 0) {
      this.isBack = true;
      if (unity.getVars("result")==0||$.cookie('isOrder')==1) {
        this.isOrder=1;  // 已订购 直接播放
        $.cookie("isOrder",1,{path:"/"})
      } else {
        this.isOrder=0;
        $.cookie("isOrder",0,{path:"/"})
      }
    }
  }
}
value.getValue();

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
    
    $(".loading").css("visibility", "hidden");
    console.log(JSON.stringify(res)) //电影详情
    console.log(res.data);
    console.log("res.data--")
    moveresdata = res.data
    pageassetType = res.data.assetType;
    indexSingle.itemNo = 0;
    setStorage('moveresdata',JSON.stringify(moveresdata));
    console.log(getStorage("moveresdata"));//true--string
    console.log(JSON.stringify(res.data.itemList[0].vodList[0].playUrl))//"http://ip:port/icntv/p_BJYSTENCOS00000000000100917440"
    setStorage('moviePlayurl',JSON.stringify(res.data.itemList[0].vodList[0].playUrl))  //电影的playUrl
    getcid = res.data.itemList[0].vodList[0].playUrl.split("icntv/")[1];
    setStorage("getcidStorage",getcid)
    console.log(getcid);
    
    console.log("详情页数据填充");
    $.cookie('detailPageId', res.data.assetId, { path: "" })
    value.detailData = res.data;
    indexSingle.data = res.data;
    var relateId = res.data.assetId;
    console.log(value.detailData);
    console.log("value.detailData")
    console.log(relateId)
    console.log("relateId---");
    pegeId = relateId
     // 易视腾用户鉴权
     detailAuth(pegeId);
     console.log("判断订购状态改变dom")
    setStorage("pageId",pegeId)
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

    unity.qeryHistory(function(hisObj){
      if(hisObj){
        console.log('历史对象===')
        var hqobj = hisObj.data.resultList;
        for(var i=0 ; i< hqobj.length; i++){
          if (value.detailData.assetId == hqobj[i].relateId){
            console.log("历史记录中资产ID"+hqobj[i].relateId)
            console.log(JSON.stringify(hqobj[i]))
            indexSingle.newplayTime = hqobj[i].relateTime 
            console.log("播放记录时间"+indexSingle.newplayTime)
            // $.cookie("newplayTime",indexSingle.newplayTime,{path: '/'})
          }
        }
      }
    })
    //三方历史查询
    
    //三方收藏判断收藏
    // console.log(topContent.isCollect)
    // var data = {
		// 	cpPrvName : "视嘉TV",
		// 	cpPrvCode : "10000012",
		// 	cpPrvType : "1001",
		// 	cpLicense : "CNTV",
		// 	account : yh.userId || yh.eth0_mac,
		// 	programSeriesName : value.detailData.assetName,
		// 	programSeriesId : value.detailData.assetId ,
		// 	programId : value.detailData.itemList[0].itemId,
    // };
    // unity.TisCollect(data , function(res){
    //   console.log("TisCollect--"+ res);
    //   if( res.code == 0){  
    //     console.log("调用判断成功")
    //   }else{
    //     console.log("调用判断失败")
    //   }
    // })
    topContent.init();
    assetList.init();
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
        $.removeCookie("jump", {path: "/"})
      } catch(error) {
        console.log('埋点错误', error)
        $.removeCookie("jump", {path: "/"})
      }
    }
    //////
  },function(err) {
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
    $('.btnBox div').eq(this.btnNum).addClass('active')
    console.log("jianqvanjianqvanjianqvan-----")
    console.log(succUser)
    if(succUser == "ORD-000"){
      console.log("判断订购状态改变dom "+succUser)
      $(".order").html("已订购")
    }
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
    window.location= "../index/home.html";
  },
  enter: function () {
    if (this.btnNum === 0) {
      unity.qeryHistory(function(hisObj){
        if(hisObj){
          var hqobj = hisObj.data.resultList;
          for(var i=0 ; i< hqobj.length; i++){
            if (value.detailData.assetId == hqobj[i].relateId){
              indexSingle.newplayTime = hqobj[i].relateTime 
              console.log("播放记录时间"+indexSingle.newplayTime)
            }
          }
        }
      })
      if(succUser == "ORD-000" ){
        //易视腾用户鉴权通过
        player.play()
        player.initPlayer()
        player.toggleShow('showPlayer')
        player.setCallback(videoStateChange)
      try {
        playerBox.fullPlay()
        areaObj = playerBox
      } catch (error) {
        console.log(error)
      }
      }else{
        //易视腾用户未订购免费观看15分钟
        player.play();
        player.initPlayer();
        player.toggleShow('showPlayer');
        player.setCallback(videoStateChange);
        try {
          playerBox.fullPlay()
          areaObj = playerBox
        } catch (error) {
          console.log(error)
        }
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
        //三方收藏取消收藏
        var tdata = {
          cpPrvName : "视嘉TV",
          cpPrvCode : "10000012",
          cpPrvType : "1001",
          cpLicense : "CNTV",
          account : yh.userId || yh.eth0_mac,
          programSeriesName : value.detailData.assetName,
          programSeriesId : value.detailData.assetId ,
          programId : value.detailData.itemList[0].itemId,
          seriesNumber : 1,
          intent : "{\"action\": \" yanhua.tv.web.dispatcher\",\"package\": \"yanhua.tv.jx.beijingyd_BJYDcs\",\"component\": {\"pkg\": \"yanhua.tv.jx.beijingyd_BJYDcs\",\"cls\": \"com.yanhua.tv.yhweb.Dispatcher\"},\"extras\": { \"pageUrl\" : \"http://winnow-bs.yanhuamedia.tv/beijingjx/source/detail/movieDetail.html?assetId="+value.detailData.assetId+"\"}}",
          imageUrl : value.detailData.assetImg,
          collectionFlag : 0
        };
        unity.TisCollect(tdata , function(res){
          console.log("TisCollect--"+ JSON.stringify(res));
          if( res.code == 0){  //已收藏
            console.log("三方收藏删除成功")
          }else{
            console.log("三方收藏删除失败")
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
        //三方收藏添加收藏
        var tdata = {
          cpPrvName : "视嘉TV",
          cpPrvCode : "10000012",
          cpPrvType : "1001",
          cpLicense : "CNTV",
          account : yh.userId || yh.eth0_mac,
          programSeriesName : value.detailData.assetName,
          programSeriesId : value.detailData.assetId ,
          programId : value.detailData.itemList[0].itemId,
          seriesNumber : 1,
          intent : "{\"action\": \" yanhua.tv.web.dispatcher\",\"package\": \"yanhua.tv.jx.beijingyd_BJYDcs\",\"component\": {\"pkg\": \"yanhua.tv.jx.beijingyd_BJYDcs\",\"cls\": \"com.yanhua.tv.yhweb.Dispatcher\"},\"extras\": { \"pageUrl\" : \"http://winnow-bs.yanhuamedia.tv/beijingjx/source/detail/movieDetail.html?assetId="+value.detailData.assetId+"\"}}",
          imageUrl : value.detailData.assetImg,
          collectionFlag : 1
        };
        unity.TisCollect(tdata , function(res){
          console.log("TisCollect--"+ JSON.stringify(res));
          if( res.code == 0){  
            console.log("三方收藏添加成功")
          }else{
            console.log("三方收藏添加失败")
          }
        })
        this.isCollect = true;
      }
    } else if (this.btnNum === 2) {
      $(".descriptionBox").css("visibility", "visible");
      descriptionBox.init()
      areaObj = descriptionBox
    } else if (this.btnNum === 3){
        if(succUser == "ORD-000"){
            return
        }else{
        //跳转到订购页
            window.location.href="./../pay/payfor/index.html";
      }
    }
  },
}

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
  back : function (){
    $(".descriptionBox").css("visibility", "hidden");
    areaObj = topContent ;
  },
  enter : function (){
    $(".descriptionBox").css("visibility", "hidden");
    areaObj = topContent ;
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
    window.location= "../index/home.html";
  },
  enter: function () {
    areaObj = topContent
    var url = this.data[this.itemNo].jsonUrl 
    console.log(url)
    console.log("url")
    $.cookie('detailUrl', url,{path:"/"})
    value.url = url;
    getData(url)
    this.removeCss();
    this.itemNo = 0;
    topContent.btnNum = 0;
    $(".movieDetail").scrollTop(0)
    $(".wordScroll").animate({
      top:0
    },0)
  },
}

areaObj = topContent; //初始焦点赋值

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
    getId('movieDetail').style.visibility = 'hidden';
    player.upPlayerLocation({ x: 0, y: 0, w: -1, h: -1 });
  },
  hidePlayer: function () {
    player.stop();
    player.toggleShow('hidePlayer');
    areaObj = topContent
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
    console.log('快退到的时间' + playerBox.positionBar);
    debounce(playerBox.updateBar, 200);
  },
  right: function () {
    if(wlstatus !== "pass") return;//未来审核不通过
    console.log("视频总时长："+playerBox.detailData.allTime)
    if (playerBox.detailData.allTime <= 0) return;
    playerBox.pauseStatus = 1;
    getId('pause').style.visibility = "hidden";
    console.log("进度条当前时间"+playerBox.positionBar)
    playerBox.positionBar = Number(playerBox.detailData.curPlayTime) + playerBox.fastTime;
    if (playerBox.positionBar >= playerBox.detailData.allTime-3000) {
      console.log("快进时间大于总时长"+ playerBox.detailData.curPlayTime)
      // playerBox.detailData.curPlayTime = playerBox.detailData.allTime-3000
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
    if (playerBox.status == 1) {
      console.log("用户暂停");
      player.togglePlay('pause');
      playerBox.showPause();
    } else if (playerBox.status == 0) {
      console.log("用户续播");
      player.togglePlay('resume');
      playerBox.hiddenPause();
    }
  },
  back: function () {
    getId('pause').style.visibility = "hidden";
    getId('footerPlayer').style.visibility = "hidden";
    $(".tips").css("display","none")
    if(wlstatus !== "pass") {
      document.body.removeChild(getId('toast')) 
    }//未来审核不通过
    if (playerBox.timer) {
      clearInterval(playerBox.timer);
    }
    playerBox.hidePlayer();
     window.location.reload()
    //  getId('movieDetail').style.visibility = 'visible';
     areaObj = topContent
  },
  seekTime: function (to) {
    var currTime = Number(playerBox.detailData.curPlayTime) + playerBox.fastTime;
    // player.seekTime({ 'seekTime': currTime });
    playerBox.showBar();
    player.togglePlay('pause');
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
    console.log('暂停onPause--------'+JSON.stringify(res))
    playerBox.status = 0;
  },
  onResume: function (res) {
    console.log('续播onResume--------'+JSON.stringify(res))
    playerBox.status = 1;
    playerBox.hiddenPause();
  },
  onStop: function (res) {
    console.log('手动停止onStop-------------------' + JSON.stringify(res))
    playerBox.status = 0;
    // $.cookie("curPlayTime",res.curPlayTime,{path:"/"})
    // var curPlayTime = $.cookie("curPlayTime")
    console.log('返回时当前播放时间'+ res.curPlayTime)
    if(res.curPlayTime == res.allTime){
      res.curPlayTime = 0
    }
    console.log('存储的播放记录时间'+ res.curPlayTime)
    unity.playRecord(value, res.curPlayTime, 0)
    //三方历史记录存储
     var tdata = {
       cpPrvName : "视嘉TV",
       cpPrvCode : "10000012",
       cpPrvType : "1001",
       cpLicense : "CNTV",
       account : yh.userId || yh.eth0_mac,
       programSeriesName : value.detailData.assetName,
       programSeriesId : value.detailData.assetId ,
       programId : value.detailData.itemList[0].itemId,
       seriesNumber : 1,
       score : value.detailData.score,
       totalTime : res.allTime,
       startWatchTime : 0,
       endWatchTime : res.curPlayTime,
       playTime : res.curPlayTime,
       logType : "end",
       intent : "{\"action\": \" yanhua.tv.web.dispatcher\",\"package\": \"yanhua.tv.jx.beijingyd_BJYDcs\",\"component\": {\"pkg\": \"yanhua.tv.jx.beijingyd_BJYDcs\",\"cls\": \"com.yanhua.tv.yhweb.Dispatcher\"},\"extras\": { \"pageUrl\" : \"http://winnow-bs.yanhuamedia.tv/beijingjx/source/detail/movieDetail.html?assetId="+value.detailData.assetId+"\"}}",
       imageUrl : value.detailData.assetImg,
     };
     console.log("三方历史tdata")
     console.log(JSON.stringify(tdata))
    unity.Thistory(tdata , function(res){
      console.log(JSON.stringify(res));
      if( res.code == 0){  
        console.log("三方历史记录添加成功")
      }else{
        console.log("三方历史记录添加失败")
      }
    })
    try {
      commonParams.asset_id = value.detailData.assetId;
      commonParams.item_id = value.detailData.itemList[indexSingle.itemNo].itemId
      commonParams.qb_datetime = Cookies.get('qb_datetime')
      commonParams.zb_datetime = (new Date()).valueOf()
      commonParams.time = playerBox.detailData.curPlayTime
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
  },
  onCompleted: function (res) {
    playerBox.pauseStatus = 1;
    // this.detailData = res;
    this.status = 2;
    //播放完毕操作
    console.log('onCompleted-------------------' + JSON.stringify(res));
    try {
      commonParams.asset_id = value.detailData.assetId;
      commonParams.item_id = value.detailData.itemList[indexSingle.itemNo].itemId
      commonParams.qb_datetime = Cookies.get('qb_datetime')
      commonParams.zb_datetime = (new Date()).valueOf()
      // commonParams.time = commonParams.zb_datetime - commonParams.qb_datetime
      commonParams.time = playerBox.detailData.curPlayTime
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
    playerBox.back()
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
  },
  onBufferfinish: function (res) {
    console.log('onBufferfinish-------------------' + JSON.stringify(res))
  },
  onProgress: function (res) {
    playerBox.uploadPlayStatus(res);
    console.log('onProgress-------------------' + JSON.stringify(res));
  },
}

//生命周期回调，避免设置，首页按键切出去切回来播放器bug
submitPrompt('registerLifecycleCallback', { return: 'registerLifecycleCallback' });
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
    console.log(err)
  }
}

//
function getQueryString(name) {
    const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    const urlObj = window.location;
    var r = urlObj.href.indexOf('#') > -1 ? urlObj.hash.split("?")[1].match(reg) : urlObj.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}
  
  var currentPage = getQueryString('assetId')
  if (currentPage) {
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