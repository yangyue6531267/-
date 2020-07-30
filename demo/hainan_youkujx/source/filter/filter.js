var value = {
  isBack: false,
  keyword: "",
  filterUrl: "",
  detailData: [],
  currClass: 0, //左边栏筛选项
  pindex: 0, //当前页数
  totalpage: 0,
  assetNum: 0,
  getValue: function () {
    this.keyword = unity.getVars("catCode") || 'series';
    this.currClass = Number(unity.getVars("itemNo")) + 1;
    this.filterUrl = $.cookie("filterUrl");
    if (unity.getVars("pindex")) {
      this.isBack = true;
      this.currClass--
      this.pindex = Number(unity.getVars("pindex"));
      collectCenter.itemNo = Number(unity.getVars("contentItemNo")) || 0;
    }
    // 上报埋点
    var jumpJson = $.cookie("jump")
    jumpJson = eval('(' + jumpJson + ')')
    if ($.cookie("jump")) {
      try {
        jumpJson.page_type = '0901'
        jumpJson.page_id = '102-1'
        bi.jump(jumpJson)
        $.removeCookie("jump", { path: "/" })
      } catch (error) {
        console.log('埋点错误', error)
        $.removeCookie("jump", { path: "/" })
      }
    }
  }
}


var getData = function (type, pindex, psize) {
  var url = baseUrl + 'p=yhScreenResult&k=1&v=1&catCode=' + value.keyword + '&content=' + type + '&pindex=' + pindex * 8 + '&psize=' + psize + '&sizeFlag=1';
  unity.jsonp(url, function (res) {
    console.log(res);
    value.totalpage = (res.data.assetNum && (Math.ceil(res.data.assetNum / 8)));
    value.assetNum = res.data.assetNum;
    value.detailData = res.data.assetList;
    $(".scroll-box").empty();
    for (var i = 0; i < value.detailData.length; i++) {
      $(".scroll-box").append('<li><div class="imgbox"><div class="score"><span>' + value.detailData[i].score + '</span></div><img class="lazyload" src="../public/images/img_loading_160x230.png"  data-img="' + value.detailData[i].assetImg + '"/></div><div class="word">' + value.detailData[i].assetName + '</div></div></li>');
    }
    $.imgLazyLoad();
    if (value.totalpage >= 1) {
      $(".total-page").html(value.pindex + 1 + '/' + value.totalpage);
    }
    if (value.totalpage > 1) {
      $(".search-scroll").css({
        "visibility": "visible"
      });
    }
    if (areaObj == collectCenter) {
      collectCenter.addCss();
    }
    if (value.isBack) {
      value.isBack = false;
      navList.removeCss();
      collectCenter.addCss();
      areaObj = collectCenter;
      collectCenter.movebar(value.pindex);
    }
    // 筛选无结果上报
    if (value.assetNum == 0) {
      try {
        var jsonOb = {}
        jsonOb.result = '0'
        var keywordCul = document.getElementsByClassName('cul')[0]
        var keywordList = keywordCul.children
        var keywordOrder = keywordCul.style.top.slice(0, -2)
        console.log(keywordCul.children[(keywordOrder - 210) / (-70)].innerHTML)
        jsonOb.keyword = encodeURIComponent(keywordCul.children[(keywordOrder - 210) / (-70)].innerHTML)
        jsonOb.cid = ''
        jsonOb.cat_id = jsonOb.cat_id = $.cookie('cat_id')
        bi.filter(jsonOb)
      } catch (error) {
        console.log('埋点异常', error)
      }
    }
  });
}


var navList = {
  screenList: [],
  updated: function () {
    this.addCss();
    unity.jsonp(value.filterUrl, function (res) {
      console.log(res);
      navList.screenList = res.data.elementList;
      var allObk = {
        elementCode: "movie",
        elementId: "",
        elementImg: "",
        elementName: "全部",
        elementType: "0"
      }
      navList.screenList.unshift(allObk);
      for (var i = 0; i < navList.screenList.length; i++) {
        $('.cul').append('<li class="text-n">' + navList.screenList[i].elementName + '</li>');
      }
      $(".cul").css("top", 210 - value.currClass * 70 + "px")
      getData(navList.screenList[value.currClass].elementId, value.pindex, 8);
    })
  },
  up: function () {
    if (value.currClass === 0) return
    value.currClass--;
    $(".cul").css("top", 210 - value.currClass * 70 + "px")
    getData(navList.screenList[value.currClass].elementId, 0, 8);
    value.itemNo = 0;
    value.pindex = 0;
    $(".total-page").html('');
    $(".search-scroll").css({
      "visibility": "hidden"
    });
    collectCenter.movebar(value.pindex);
  },
  down: function () {
    if (value.currClass + 1 >= navList.screenList.length) return
    value.currClass++;
    $(".cul").css("top", 210 - value.currClass * 70 + "px")
    getData(navList.screenList[value.currClass].elementId, 0, 8);
    value.itemNo = 0;
    value.pindex = 0;
    $(".total-page").html('');
    $(".search-scroll").css({
      "visibility": "hidden"
    });
    collectCenter.movebar(value.pindex);
  },
  left: function () { },
  right: function () {
    if (value.assetNum == 0) return
    this.removeCss();
    areaObj = collectCenter;
    collectCenter.itemNo = 0;
    collectCenter.addCss();
    // try {
    //   var param = {
    //     result: '1',
    //     content: 'catCode=' + value.keyword + '|content=' + navList.screenList[value.currClass].elementId + '|pindex=' + 0 + '|psize=' + 8
    //   }
    //   // bi.filter(param);
    // } catch (e) {
    //   console.log('埋点异常')
    // }
  },
  addCss: function () {
    $('.content').addClass('active');
    $('.changebac').addClass('writediv');
  },
  removeCss: function () {
    $('.content').removeClass('active');
    $('.changebac').removeClass('writediv');
  },
  back: function () {
    window.location = "../index/home.html"
  },
  enter: function () { }
}

var collectCenter = {
  itemNo: 0,
  addCss: function () {
    $(".scroll-box li").eq(this.itemNo).addClass('active');
    var title = $(".scroll-box .word")
      .eq(this.itemNo)
      .text();
    if (title.length > 8) {
      $(".scroll-box .word").eq(this.itemNo).html('<marquee scrolldelay=80>' + value.detailData[this.itemNo].assetName + '</marquee>')
    }
  },
  removeCss: function () {
    $(".scroll-box li").eq(this.itemNo).removeClass('active');
    $(".scroll-box .word").eq(this.itemNo).html(value.detailData[this.itemNo].assetName)
  },
  movebar: function (pageNum) {
    var moveHeight = 346 / (value.totalpage - 1); //滚动条滚动
    $(".search-bar").css("top", moveHeight * pageNum + "px")
  },
  up: function () {
    if (value.pindex == 0 && this.itemNo % 8 < 4) return;
    if (this.itemNo % 8 < 4) {
      this.itemNo = this.itemNo + 4;
      value.pindex--;
      this.movebar(value.pindex);
      getData(navList.screenList[value.currClass].elementId, value.pindex, 8);
      return
    } else {
      this.removeCss();
      this.itemNo -= 4;
      this.addCss();
    }
  },
  down: function () {
    if (value.pindex + 1 >= value.totalpage && value.pindex * 8 + this.itemNo + 4 >= value.assetNum) return;
    //翻页是否超总页
    if (value.pindex * 8 + this.itemNo + 5 > value.assetNum) {
      this.removeCss();
      this.itemNo = 0;
      value.pindex++;
      this.movebar(value.pindex);
      getData(navList.screenList[value.currClass].elementId, value.pindex, 8);
    } else {
      this.removeCss();
      if (this.itemNo < 4) {
        this.itemNo += 4;
        this.addCss();
        return;
      } else {
        this.itemNo += 4;
        this.itemNo = this.itemNo % 8;
        value.pindex++;
        this.movebar(value.pindex);
        getData(navList.screenList[value.currClass].elementId, value.pindex, 8);
      }
    }
  },
  left: function () {
    if (this.itemNo % 4 == 0) {
      this.removeCss();
      navList.addCss();
      areaObj = navList;
      return;
    }
    this.removeCss();
    this.itemNo--;
    this.addCss();
  },
  right: function () {
    if (this.itemNo % 4 >= 3) return
    if (value.pindex * 8 + this.itemNo + 1 >= value.assetNum) return
    this.removeCss();
    this.itemNo++;
    this.addCss();
  },
  back: function () {
    window.location = "../index/home.html"
  },
  enter: function () {
    var url = "filter.html?catCode=" + value.keyword + "&itemNo=" + value.currClass + "&pindex=" + value.pindex + "&contentItemNo=" + this.itemNo;
    // 筛选上报
    try {
      var jsonOb = {}
      jsonOb.result = '1'
      var keywordCul = document.getElementsByClassName('cul')[0]
      var keywordList = keywordCul.children
      var keywordOrder = keywordCul.style.top.slice(0, -2)
      console.log(keywordCul.children[(keywordOrder - 210) / (-70)].innerHTML)
      jsonOb.keyword = encodeURIComponent(keywordCul.children[(keywordOrder - 210) / (-70)].innerHTML)
      jsonOb.cid = value.detailData[this.itemNo].assetId.toString()
      jsonOb.cat_id = $.cookie('cat_id')
      bi.filter(jsonOb)
    } catch (error) {
      console.log('埋点错误', error)
    }
    history.replaceState(null, null, url) //状态缓存
    var preURL = "../filter/" + url
    $.cookie("preURL", preURL, { path: "/" });
    $.cookie('detailUrl', value.detailData[this.itemNo].jsonUrl, { path: '/' });
    // 进入详情页上报
    try {
      var param = {
        parent_page_type: '0901',
        parent_page_id: '102-1'
      }
      $.cookie("jump", JSON.stringify(param), {
        path: '/'
      });
    } catch (error) {
      console.log('埋点错误', error)
    }
    if (value.detailData[this.itemNo].layout === "Detail_Movie") {
      window.location = "../detail/movieDetail.html"
    } else {
      window.location = "../detail/seriesDetail.html"
    }
  }
}

$(value.getValue())
$(navList.updated())
areaObj = navList; //初始焦点赋值
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
      // 返回首页上报
      // try {
      //   var param = {
      //     parent_page_type:'0901',
      //     parent_page_id: '102-1'
      //   }
      //   $.cookie("jump", JSON.stringify(param), {
      // 		path: '/'
      // 	});
      // } catch (error) {
      //   console.log('埋点错误', error)
      // }
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