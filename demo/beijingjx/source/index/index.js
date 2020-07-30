var value = {
  navData: {},
  detailData: {},
  enterUrl: "",
  isBack: false,
  navNum: 0,
  area: "topNav",
  itemNo: 0,
  isDown:false, //节流 nav栏目往下移
  backUrl:"",
  catNum:0,
  getValue: function () {
    // unity.alertMsg($.cookie("isOrder"))
    var jsonUrl = "http://112.17.251.186:10088/?s=42|17&p=yhNavigationBar&k=1&v=1&catId=205685&c=17"
    $.cookie('enterUrl', jsonUrl, {
      path: '/'
    })
    this.backUrl = $.cookie("backUrl");
    this.enterUrl=$.cookie("enterUrl");
    if ($.cookie("indexCookie") && $.cookie("indexCookie")!="null") {
      this.isBack = true
      this.navNum = unity.cookieVars("navNum","indexCookie") * 1 
      this.area = unity.cookieVars("area","indexCookie")
      this.itemNo = unity.cookieVars("itemNo","indexCookie") * 1 
      this.catNum=$.cookie("catNum")
      $.cookie("indexCookie",null)
    }
  }
}

var modelName = {}

var getCookies = function (){
  var param = {
    page_type: bi.type.yjlm,
    page_id:value.navData[topNav.dataNum].catId.toString(),
  }
  console.log(value.navData[topNav.dataNum].catId.toString())
  var jumpJson = $.cookie("jump");
  if($.cookie("oredein")==1){
    if (jumpJson) {
      try{
        var arr = eval('('+((jumpJson)+JSON.stringify(param)).replace(/}{/,',')+')');
        console.log(arr);
        bi.jump(arr);
        $.removeCookie("jump",{path:"/"});
      } catch(error){
        $.removeCookie("jump",{path:"/"});
      }
    } else {
      var acc = {
        parent_page_type:null,
        parent_page_id: null
      }
      var arr = eval('('+(JSON.stringify(acc)+JSON.stringify(param)).replace(/}{/,',')+')');
      console.log(arr);
      bi.jump(arr);
    }
    $.removeCookie("oredein",{path:"/"});
  }
  
}

var getData = function (navNum) {
  console.log("请求导航栏数据");
  var url = value.enterUrl
  unity.jsonp(url, function (res) {
    value.navData = res.data.catList;
    console.log("res.data.catList",value.navData);
    var bgPhoto =value.navData[0].bgPhoto;
    // $(".indexPage").css('background','url('+bgPhoto+') no-repeat')
// var bgcolorlist={
//   first:'linear-gradient(144deg,rgba(71,110,142,1) 0%,rgba(77,130,142,1) 100%);',
//   second:"linear-gradient(168deg,rgba(102,135,156,1) 0%,rgba(62,121,132,1) 100%);",
//   third:"linear-gradient(168deg,rgba(65,132,132,1) 0%,rgba(14,84,128,1) 100%);",
//   forth:"linear-gradient(144deg,rgba(201,94,94,1) 0%,rgba(201,186,104,1) 100%);",
//   fifth:"linear-gradient(168deg,rgba(148,124,168,1) 0%,rgba(104,77,118,1) 100%);",
//   sixth:"linear-gradient(168deg,rgba(138,144,108,1) 0%,rgba(28,112,123,1) 100%);"
// }
// var bgColor=value.navData[0].bgcolor;
//     $(".indexPage").css('background',"linear-gradient(168deg,rgba(148,124,168,1) 0%,rgba(104,77,118,1) 100%)");
    topNav.data = value.navData
    topNav.catNum=res.data.catNum*1;
    $.cookie('catNum', res.data.catNum*1, { path: "" })
    topNav.init() //渲染导航栏
    getContent(navNum)
  },
  function (err) {
    alert("数据请求超时，确定返回上一层。")
  })
}
var getContent = function (navNum) {
  value.isDown= false;
  console.log("请求首页数据---第" + navNum);
  var url = value.navData[navNum].jsonUrl;
  console.log(value.navData[navNum].catId)
  $.cookie('page_id', value.navData[navNum].catId, { path: "" })
  $.cookie('cat_id', value.navData[navNum].catId, { path: "/" })
  unity.jsonp(url, function (res) {
    console.log("res.data.specialList",res.data.specialList);
    value.detailData = res.data.specialList;
    topCommend.init();
    if (navNum === 0) {
      specialSubject.init1(); //推荐页
    } else {
      specialSubject.init2();
    }
    assetList1.init();
    // assetList2.init();
    // assetList3.init();
    // $.imgLazyLoad(); //懒加载
    setInterval(function() {
      value.isBack = false;
    }, 200);
    value.isDown=true;
  },
  function(err){
    alert("数据请求超时，确定返回上一层。")
  })
}

var topNav = {
  data:[],
  navNum: 0,
  dataNum:0,
  catNum:0,
  init: function () {
    modelName = topNav
    var html = ""
    for (i in this.data) {
      html += '<li>' + '<p>' + this.data[i].catName + '</p>' + '</li>'
    }
    console.log("栏目个数为：" + this.catNum);
    $(".topNav .nav").html(html);

    if (value.isBack) {
      this.navNum = value.navNum
      if (this.navNum <= this.catNum-1) {
        this.dataNum = this.navNum
      }
      if (this.navNum >= this.catNum && value.area == "topNav") {
        $(".bar li").eq(this.navNum - this.catNum ).addClass("active")
      } else {
        $(".nav li").eq(this.navNum).addClass("select")
      }
    } else {
      $(".nav li").eq(this.navNum).addClass("active")
    }
  },
  up: function () {
    return
  },
  down: function () {
    if(!value.isDown) return;
    $(".nav li").eq(this.navNum).removeClass("active")
    $(".bar li").eq(this.navNum - this.catNum).removeClass("active")
    $(".nav li").eq(this.navNum).addClass("select")
    areaObj = topCommend;
    topCommend.addCss()
  },
  left: function () {
    if (this.navNum === 0) return
    if (this.navNum <= this.catNum-1 ) {
      $(".nav li").eq(this.navNum).removeClass("active")
      this.navNum--
      $(".nav li").eq(this.navNum).addClass("active")
        topNav.enter()
      topCommend.itemNo = 0;
      specialSubject.itemNo = 0;
      assetList1.itemNo = 0;
      // assetList2.itemNo = 0;
      // assetList3.itemNo = 0;
    } else if (this.navNum == this.catNum) {
      $(".bar li").eq(0).removeClass("active")
      this.navNum--
      $(".nav li").eq(this.navNum).addClass("active")
    } else {
      $(".bar li").eq(this.navNum-this.catNum).removeClass("active")
      this.navNum--
      $(".bar li").eq(this.navNum - this.catNum).addClass("active")
    }

  },
  right: function () {
    if (this.navNum == this.catNum + 3) return
    if (this.navNum < this.catNum - 1) {
      $(".nav li").eq(this.navNum).removeClass("active")
      this.navNum++
      $(".nav li").eq(this.navNum).addClass("active")
        topNav.enter()
      topCommend.itemNo = 0;
      specialSubject.itemNo = 0;
      assetList1.itemNo = 0;
      // assetList2.itemNo = 0;
      // assetList3.itemNo = 0;
    } else {
      $(".nav li").eq(this.navNum).removeClass("active")
      $(".bar li").eq(this.navNum - this.catNum).removeClass("active")
      this.navNum++
      $(".bar li").eq(this.navNum - this.catNum).addClass("active")
    }
  },
  enter: function () {
    if (this.navNum <= this.catNum-1) {
      this.dataNum=this.navNum
      getContent(this.navNum)
    } else {
      var url = "navNum=" + this.navNum + "&area=topNav"
      $.cookie("indexCookie", url) 
      // history.replaceState(null, null, url) //状态缓存
      if (this.navNum == this.catNum) {
        //查询我的订单
        orderList();
        //function获取用户订单信息
        function orderList(){
          var params={
            userId: yh.userId,
            appid: APPID,
            appkey: APPKEY,
            spToken: ''
          }
          params = JSON.stringify(params);
          console.log(params)
          console.log("params")
          submitPrompt("queryOrderList",{ jsonParam: params, return: 'getOrderlist' })
        }
          //定义获取订单信息方法
          function getOrderlist(res){
            console.log(res)
            console.log("查询订单:")
          }
       // window.location.href = '../pay/myorder/myOrder.html'
      } else if (this.navNum == this.catNum + 1) {
        try {
          var param = {
            page_type: bi.type.search,
            page_id:'100-1',
            parent_page_type:'0101',
            parent_page_id: value.navData[this.dataNum].catId.toString()
          }
          $.cookie("jump", JSON.stringify(param),{
            path: '/'
          });
        } catch (error) {

        }
        window.location.href = "../search/search.html"
      
      } else if (this.navNum == this.catNum + 2) {
        try {
          var param = {
            page_type: bi.type.history,
            page_id: '101-1',
            parent_page_type:'0101',
            parent_page_id: value.navData[this.dataNum].catId.toString()
          }
          $.cookie("jump", JSON.stringify(param),{
          path: '/'
        });
        
        } catch (error) {

        }
        window.location.href = "../historyHome/historyHome.html?&itemNo=2"
      } else if (this.navNum == this.catNum + 3) {
        try {
          var param = {
            page_type: bi.type.fav,
            page_id: '103-1',
            parent_page_type:'0101',
            parent_page_id: value.navData[this.dataNum].catId.toString()
          }
          $.cookie("jump", JSON.stringify(param),{
            path: '/'
          });
        } catch (error) {

        }
        window.location.href = "../historyHome/historyHome.html?&itemNo=1"
      }
    }
  },
  back: function () {
    // window.location.href= value.backUrl
    $(".exitapp").css("display","block")
    areaObj = exitapp;
    $(".no").addClass("active");
  },
}

value.getValue()

var topCommend = {
  data: {},
  itemNo: 0,
  init: function () {
    $(".topCommend").empty() //清空div
    this.data = value.detailData[0].elementList
    console.log(this.data)
   // $(".topCommend").append('<li class="bigCommend"><img class="lazyload" src="../public/images/img_loading_352x190.png" data-img="' + this.data[0].elementImg + '"/></li><ul></ul>')
    $(".topCommend").append('<li class="bigCommend"><img class="lazyload" src="' + this.data[0].elementImg +'"/></li><ul></ul>')
    for (var i = 1; i < 5; i++) {
  // $('.topCommend ul').append('<li><img class="lazyload" src="../public/images/img_loading_352x190.png" data-img="' + this.data[i].elementImg + '"/></li>')
      $('.topCommend ul').append('<li><img class="lazyload" src="' + this.data[i].elementImg +'"/></li>')
    }
    if (value.isBack && value.area == "topCommend") {
      this.itemNo = value.itemNo
      this.addCss()
    }
  },
  addCss: function () {
    modelName = topCommend
    $(".topCommend li").eq(this.itemNo).addClass('active');
  },
  removeCss: function () {
    $(".topCommend li").eq(this.itemNo).removeClass('active');
  },
  up: function () {
    if (this.itemNo <= 2) {
      modelName = topNav
      areaObj = topNav;
      this.removeCss();
      if (topNav.navNum > topNav.catNum-1) {
        $(".bar li").eq(topNav.navNum - topNav.catNum).addClass("active")
      } else {
        $(".nav li").eq(topNav.navNum).removeClass("select")
        $(".nav li").eq(topNav.navNum).addClass("active")
      }
    } else {
      this.removeCss()
      this.itemNo -= 2
      this.addCss()
    }
  },
  down: function () {
    if (this.itemNo === 0 || this.itemNo >= 3) {
      areaObj = specialSubject
      this.removeCss();
      specialSubject.addCss()
    } else {
      this.removeCss()
      this.itemNo += 2
      this.addCss()
    }
  },
  left: function () {
    if (this.itemNo === 0) return
    if (this.itemNo === 3) {
      this.removeCss()
      this.itemNo = 0
      this.addCss()
    } else {
      this.removeCss()
      this.itemNo--
      this.addCss()
    }
  },
  right: function () {
    if (this.itemNo === 4) return;
    this.removeCss();
    this.itemNo++;
    this.addCss();
  },
  enter: function () {
    var url = "navNum=" + topNav.dataNum + "&area=topCommend&itemNo=" + this.itemNo
    $.cookie("indexCookie",url)
    $.cookie("preURL", '../index/home.html',{path:"/"})
    // history.replaceState(null, null, url) //状态缓存

    $.cookie('detailUrl', this.data[this.itemNo].jsonUrl,{path:"/"})
    try {
      var param = {
        parent_page_type:bi.type.yjlm,
        parent_page_id: value.navData[topNav.dataNum].catId.toString()
      }
      $.cookie("jump", JSON.stringify(param),{
        path: '/'
      });
    } catch (error) {
    }
    // 点击推荐位上报
    try {
      var jsonOb = {}
      jsonOb.pos_id = '000' + this.itemNo
      jsonOb.recmd_id = ''
      jsonOb.page_type = '0101'
      jsonOb.page_id = $.cookie('page_id')
      jsonOb.click_type = '1'
      jsonOb.cid = this.data[this.itemNo].elementId
      bi.jumpRecommend(jsonOb)
      $.cookie('recommend', '', {path: "/"})
      $.cookie('position', jsonOb.pos_id, {path: "/"})
    } catch (error) {
      console.log('埋点错误', error)
    }
    if (this.data[this.itemNo].layout === "Detail_Movie") {
      window.location = "../detail/movieDetail.html"
    } else {
      window.location = "../detail/seriesDetail.html"
    }
  },
  back: function () {
    // window.location.href = value.backUrl
    $(".exitapp").css("display","block")
      areaObj = exitapp;
      $(".no").addClass("active");
  }
}

var specialSubject = {
  data: {},
  itemNo: 0,
  type: "special",
  init1: function () {
    $(".special-subject").empty() //清空div
    this.data = value.detailData[1].elementList
    $(".special-subject").append('<ul></ul>')
    for (i in this.data) {
      $('.special-subject ul').append('<li class="specialLi"><img src="' +this.data[i].elementImg + '"/></li>')
    }
    if (value.isBack && value.area == "specialSubject") {
      this.itemNo = value.itemNo
      this.addCss()
    }
  },
  init2: function () {
    $(".special-subject").empty() //清空div
    this.data = value.detailData[1].elementList
    $(".special-subject").append('<ul></ul>')
    for (i in this.data) {
      $('.special-subject ul').append('<li class="tagName">' + this.data[i].elementName + '</li>')
    }
    if (value.isBack && value.area == "specialSubject") {
      this.itemNo = value.itemNo
      this.addCss()
    }
  },
  addCss: function () {
    modelName = specialSubject
    $(".special-subject li").eq(this.itemNo).addClass('active');
  },
  removeCss: function () {
    $(".special-subject li").eq(this.itemNo).removeClass('active');
  },
  up: function () {
    this.removeCss();
    areaObj = topCommend;
    topCommend.addCss()
  },
  down: function () {
    this.removeCss();
    areaObj = assetList1;
    assetList1.addCss()
    $(".indexPage").scrollTop(640);
    $.imgLazyLoad(); //懒加载
  },
  left: function () {
    if (this.itemNo === 0) return
    this.removeCss()
    this.itemNo--
    this.addCss()
  },
  right: function () {
    if (this.itemNo === this.data.length - 1) return;
    this.removeCss();
    this.itemNo++;
    this.addCss();
  },
  enter: function () {
    var url = "navNum=" + topNav.dataNum + "&area=specialSubject&itemNo=" + this.itemNo
    $.cookie("indexCookie", url)
    // history.replaceState(null, null, url) //状态缓存
    // 点击推荐位上报
    try {
      var jsonOb = {}
      jsonOb.pos_id = '010' + this.itemNo
      jsonOb.recmd_id = ''
      jsonOb.page_type = '0101'
      jsonOb.page_id = $.cookie('page_id')
      if (topNav.dataNum == 0) {
        jsonOb.click_type = '2'
      } else {
        jsonOb.click_type = '4'
      }
      console.log(this.data[this.itemNo])
      jsonOb.cid = this.data[this.itemNo].elementId
      bi.jumpRecommend(jsonOb)
    } catch (error) {
      console.log('埋点错误', error)
    }
    try {
      var param = {
        parent_page_type:'0101',
        parent_page_id: value.navData[topNav.dataNum].catId.toString()
      }
      $.cookie("jump", JSON.stringify(param),{
        path: '/'
      });
    } catch (error) {
    }
    if (topNav.dataNum === 0) {   //dataNum 导航栏按确定后
      $.cookie("specialUrl", this.data[this.itemNo].jsonUrl,{path:"/"})
      window.location = "../special/special.html"
    } else {
      $.cookie("filterUrl", value.detailData[1].jsonUrl,{path:"/"})
      if(topNav.navNum>=4) {
       catCode = value.navData[4].catCode
      } else {
        catCode = value.navData[topNav.navNum].catCode
      }
      window.location = "../filter/filter.html?catCode=" + catCode + "&itemNo=" + this.itemNo
    }
  },
  back: function () {
    // window.location.href = value.backUrl
    $(".exitapp").css("display","block")
      areaObj = exitapp;
      $(".no").addClass("active");
  }
}

var assetList1 = {
  data: {},
  itemNo: 0,
  init: function () {
    $(".assetList1").empty() //清空div
    this.data = value.detailData[2]
    $(".assetList1").append('<h2>' + this.data.specialName + '</h2><ul></ul>')
    for (var i = 0; i < 11; i++) {
  //    $(".assetList1 ul").append('<li><div class="imgbox"><div class="score"><span>' + this.data.elementList[i].score + '</span></div><img class="lazyload" src="../public/images/img_loading_160x230.png"  data-img="' + this.data.elementList[i].elementImg + '"/></div><div class="word">' + this.data.elementList[i].elementName + '</div></li>')
        $(".assetList1 ul").append('<li><div class="imgbox"><div class="score"><span>' + this.data.elementList[i].score + '</span></div><img src="' + this.data.elementList[i].elementImg + '"/></div><div class="word">' + this.data.elementList[i].elementName + '</div></li>')
    }
    $(".assetList1 ul").append('<li><div class="imgbox"><img src="../public/images/assetListMore.png"/></div></li>')

    if (value.isBack && value.area == "assetList1") {
      this.itemNo = value.itemNo
      $(".indexPage").scrollTop(640)
      this.addCss()
    }

  },
  addCss: function () {
    modelName = assetList1
    $(".assetList1 li").eq(this.itemNo).addClass('active');
    var title = $(".assetList1 .word").eq(this.itemNo);
    if (title.text().length > 9) {
      $(".assetList1 .word").eq(this.itemNo).html('<marquee scrolldelay=80>' + this.data.elementList[this.itemNo].elementName + '</marquee>')
    }
    $.imgLazyLoad(); //懒加载
  },
  removeCss: function () {
    $(".assetList1 li").eq(this.itemNo).removeClass('active');
    $(".assetList1 .word").eq(this.itemNo).html(this.data.elementList[this.itemNo].elementName)
  },
  up: function () {
    if (this.itemNo <= 5) {
      this.removeCss();
      areaObj = specialSubject;
      specialSubject.addCss();
      $(".indexPage").scrollTop(0);
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
    } else {
      return  //去除下面两个组件
    }
  },
  left: function () {
    if (this.itemNo === 0 || this.itemNo === 6) return
    this.removeCss()
    this.itemNo--
    this.addCss()
  },
  right: function () {
    if (this.itemNo === 5 || this.itemNo === 11) return
    this.removeCss()
    this.itemNo++
    this.addCss()
  },
  enter: function () {
    var url = "navNum=" + topNav.dataNum + "&area=assetList1&itemNo=" + this.itemNo
    // history.replaceState(null, null, url) //状态缓存
    $.cookie("indexCookie", url)
    $.cookie("preURL", '../index/home.html',{path:"/"})
    if (this.itemNo === 11) {
      $.cookie("specialUrl", this.data.jsonUrl,{path:"/"})
      // 跳转到专题上报
      try {
        var param = {
          parent_page_type:'0101',
          parent_page_id: value.navData[topNav.dataNum].catId.toString()
        }
        $.cookie("jump", JSON.stringify(param),{
          path: '/'
        });
      } catch (error) {
        console.log('埋点错误', error)
      }
      window.location = "../special/special.html"
    } else {
      $.cookie('detailUrl', this.data.elementList[this.itemNo].jsonUrl,{path:"/"})
      // 跳转资产详情上报
      try {
        var param = {
          parent_page_type:'0101',
          parent_page_id: value.navData[topNav.dataNum].catId.toString()
        }
        $.cookie("jump", JSON.stringify(param),{
          path: '/'
        });
      } catch (error) {
        console.log('埋点错误', error)
      }
      if (this.data.elementList[this.itemNo].layout === "Detail_Movie") {
        $
        window.location = "../detail/movieDetail.html"
      } else {
        window.location = "../detail/seriesDetail.html"
      }
    }
  },
  back: function () {
    // window.location.href = value.backUrl
    $(".exitapp").css("display","block")
      areaObj = exitapp;
      $(".no").addClass("active");
  }
}

var exitapp = {
  itemNo:0,  //按钮编号 0考虑 1确认
  init: function(){
    areaObj == tuidingBox;
    
  },
  left:function(){
    //再考虑
    this.itemNo = 0
    $(".yes").removeClass("active");
    $(".no").addClass("active");
  },
  right: function(){
    this.itemNo = 1
    $(".no").removeClass("active");
    $(".yes").addClass("active");
  },
  enter: function(){
    if(this.itemNo == 1){
      //弹框中确认退出
      console.log("挽留框中退出app")
      backApp()
    }else if(this.itemNo == 0){
      //弹框中再考虑
      $(".exitapp").css("display","none");
      switch( modelName ){
        case topNav :
          areaObj = topNav  ;
          break;
        case topCommend :
          areaObj = topCommend;
          break;
        case specialSubject :
          areaObj = specialSubject;
          break;
        case assetList1 :
          areaObj = assetList1
      }
   }
  },
  back: function(){
    console.log("exitback------");
    console.log(value.isBack)
    $(".exitapp").css("display","none");
    switch( modelName ){
      case topNav :
        areaObj = topNav  ;
        break;
      case topCommend :
        areaObj = topCommend;
        break;
      case specialSubject :
        areaObj = specialSubject;
        break;
      case assetList1 :
        areaObj = assetList1
    }
  }
}

if (value.isBack) {
  areaObj = window[value.area]
  if (value.navNum >= value.catNum-1) {
    console.log(value.catNum - 1);
    $(getData(value.catNum - 1))
  } else {
    $(getData(value.navNum))
  }
} else {
  areaObj = topNav; //初始焦点赋值
  getData(0) //请求首页数据
}
clearTimeout(timer);
var timer =  setTimeout(function(){
  $(getCookies());
},1500)

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
      try {
        bi.end();
      } catch (e) {
        console.log('埋点异常', e)
      }
      areaObj.back();
      break;
    case "enter":
      areaObj.enter();
      break;
  }
};
//事件绑定
document.onkeydown = grepEvent;