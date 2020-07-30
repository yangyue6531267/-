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
  userFlag: "", // 用户标识
  userToken: "", // 用户token
  contentID: "", // 节目唯一标识      "productIDs" : "",      //开机认证的已订购产品
  folderId: "", //节目所属栏目folderId
  navNum: 0, //左侧导航状态
  itemNo: 0, //右侧资产序号
  time: 0, //翻多少页
  isBack: false,
  lastURL: '',
  getValue: function () {
    this.lastURL = window.Cookies.get('lastURL')
    if (window.Cookies.get('userToken')) {
      this.userToken = window.Cookies.get('userToken');
      this.userFlag = window.Cookies.get('userId')
    } else {
      this.userToken = 123456;
      this.userFlag = 123456;
    }
    var oGetVars = {};
    if (window.location.search.length > 1) { //从url里面拿到所需键值
      for (var aItKey, nKeyId = 0, aCouples = window.location.search.substr(1).split("&"); nKeyId < aCouples.length; nKeyId++) {
        aItKey = aCouples[nKeyId].split("=");
        oGetVars[decodeURIComponent(aItKey[0])] = aItKey.length > 1 ? decodeURIComponent(aItKey[1]) : "";
      }
    }
    this.folderId = oGetVars.folderId;
    this.navNum = oGetVars.navNum * 1;
    if (oGetVars.itemNo) {
      this.isBack = true;
      this.itemNo = oGetVars.itemNo * 1;
      this.time = oGetVars.time * 1;
    }
  }
};

$(value.getValue());

var getContents = function () {
  var url = 'http://47.97.96.103/?s=123508|16&p=yhScreenResult&k=1&v=1&content=' + navBar.folderNameList[navBar.navNum].children[0].children[0].categoryId + '&catCode=' + navBar.folderNameList[navBar.navNum].catCode + '&sortType=1'
  console.log(url);
  // var url = 'http://gsyd-ds.yanhuamedia.tv/?s=33|19&p=yhScreenResultMulti&k=1&v=1&pindex=0&psize=8&sizeFlag=1&catCode=' + value.navNum + '&categoryId=' + folderId;
  getYhSpecialList_nc(url, function (response) {
    console.log(response)
    if (response.code == 200) {
      var data = response.data.assetList;
      contentList.init(data);
    }
  }, function (error) {}, false)
}


var getList = function () {
  var url = "http://47.97.96.103/?s=123508|20&p=yhCategoryMulti&k=1&v=1&rootNode=SHBZB";
  $.ajax({
    type: 'GET',
    url: url,
    dataType: "json",
    success: function (res) {
      console.log(res)
      // var list = res.categoryList.slice(1, 7);
      navBar.folderNameList = res.data.categoryList;
      navBar.init(res.data.categoryList);
      console.log(navBar.folderNameList);
      getContents(value.folderId)
    },
    error: function (err) {
      console.log(err)
    }
  })
}
$(getList());

var navBar = {
  navNum: value.navNum,
  result: [],
  folderNameList: [],
  init: function (data) {
    this.result = data;
    var html = ""
    for (i in this.folderNameList) {
      html += '<li>' + '<p>' + this.folderNameList[i].categoryName + '</p>' + '</li>'
    }
    $(".left-box").html(html);
    if (value.isBack) {
      $(".left-box li").eq(this.navNum).addClass("select")
    } else {
      $(".left-box li").eq(this.navNum).addClass("active")
    }
  },
  home: function () {
    window.location = value.lastURL;
  },
  up: function () {
    if (this.navNum === 0) return;
    $(".left-box li").eq(this.navNum).removeClass("active")
    this.navNum--;
    $(".left-box li").eq(this.navNum).addClass("active")
    value.folderId = this.result[this.navNum].folderId
    $(getContents(value.folderId))
    $('.scroll-box').css({
      'transition': 'all 0.3s',
      'transform': 'translateY(0px)'
    });
    contentList.itemNo = 0
    contentList.time = 0
  },
  down: function () {
    if (this.navNum === this.folderNameList.length - 1) return;
    $(".left-box li").eq(this.navNum).removeClass("active")
    this.navNum++;
    $(".left-box li").eq(this.navNum).addClass("active")
    value.folderId = this.result[this.navNum].parCategoryId
    $(getContents(value.folderId))
    $('.scroll-box').css({
      'transition': 'all 0.3s',
      'transform': 'translateY(0px)'
    });
    contentList.itemNo = 0
    contentList.time = 0
  },
  right: function () {
    $(".left-box li").eq(this.navNum).removeClass("active");
    $(".left-box li").eq(this.navNum).addClass("select")
    contentList.addCss();
    areaObj = contentList
  },
  back: function () {
    window.location = "../index.html"
  }
}

var contentList = {
  itemNo: value.itemNo,
  time: value.time, //当前翻页次数
  pagination: 0, //共多少页
  result: [],
  init: function (data) {
    this.result = data;
    var html = ''
    for (i in data) {
      html += "<li>" + "<img class='jiaobiao' src='../index/images/jingxuan.png'>" + "<div class='imgbox'>" + "<img src='../index/images/img_loading_160x230.png'  data-img=" +
        data[i].assetImg + " class='lazyload'>" + "</div>" +
        "<div class='word'>" + "<div class='text'>" + data[i].assetName + "</div>" + "   <div class='text-copy'>" + "</div>" + "</div>" +
        "</li>";
    }
    $(".middle-box ul").html(html);
    for (i in data) {
      if (data[i].services) {
        $(".middle-box li .jiaobiao").eq(i).css({ //角标
          visibility: "visible"
        });
      }
    }
    $.imgLazyLoad(); //懒加载
    this.pagination = Math.ceil(data.length / 8);
    $(".allnum").html("全部" + data.length + "个")
    $(".number").html((this.time + 1) + "/" + this.pagination);
    if (value.isBack) {
      this.addCss();
      $('.scroll-box').css({
        'transition': 'all 0.3s',
        'transform': 'translateY(-' + 616 * this.time + 'px)'
      });
      value.isBack = false //关闭isback开关 ，防止双焦点
    }
  },
  up: function () {
    if (this.itemNo <= 3) return;
    var realHeight = $(".middle-box li").eq(this.itemNo).offset().top + 240;
    if (realHeight < 500 && this.time > 0) {
      this.time--;
      $('.scroll-box').css({
        'transition': 'all 0.3s',
        'transform': 'translateY(-' + 616 * this.time + 'px)'
      });
    }
    this.removeCss();
    this.itemNo -= 4;
    this.addCss();
  },
  down: function () {
    var realHeight = $(".middle-box li").eq(this.itemNo).offset().top + 240;
    if (realHeight > 500 && this.time < this.pagination - 1) {
      this.time++;
      $('.scroll-box').css({
        'transition': 'all 0.3s',
        'transform': 'translateY(-' + 616 * this.time + 'px)'
      });
    }
    if (this.itemNo > this.result.length - 5) { //最后一行或下面无资产
      var num1 = Math.floor(this.result.length / 4) * 4;
      if (this.itemNo >= num1 || num1 === this.result.length) { //最后一行
        return
      } else { //倒数第二行，下面无资产
        this.removeCss();
        this.itemNo = this.result.length - 1;
        this.addCss();
      }
    } else {
      this.removeCss();
      this.itemNo += 4;
      this.addCss();
    }
  },
  left: function () {
    if ((this.itemNo) % 4 === 0) { //焦点在最左边
      this.removeCss();
      $(".left-box li").eq(navBar.navNum).removeClass("select");
      $(".left-box li").eq(navBar.navNum).addClass("active");
      areaObj = navBar
    } else {
      this.removeCss();
      this.itemNo--;
      this.addCss();
    }
  },
  right: function () {
    if (this.itemNo == (this.result.length - 1) || (this.itemNo + 1) % 4 == 0) { //最右边
      this.removeCss()
      areaObj = btnArea
      $("#btn-up").addClass('hover')
    } else {
      this.removeCss();
      this.itemNo++;
      this.addCss();
    }
  },
  pageup: function () {
    this.removeCss();
    this.time--;
    if (this.time < 0) {
      this.time = this.pagination - 1
    }
    this.itemNo = this.time * 8;
    $('.scroll-box').css({
      'transition': 'all 0.3s',
      'transform': 'translateY(-' + 616 * this.time + 'px)'
    });
    this.addCss();
  },
  pagedown: function () {
    this.removeCss();
    this.time++;
    if (this.time > this.pagination - 1) {
      this.time = 0
    }
    this.itemNo = this.time * 8;
    $('.scroll-box').css({
      'transition': 'all 0.3s',
      'transform': 'translateY(-' + 616 * this.time + 'px)'
    });
    this.addCss();
  },
  enter: function () {

    var stateObj = {
      index: "backIndex"
    }
    var url = "allType.html?folderId=" + value.folderId + "&navNum=" + navBar.navNum + "&time=" + this.time + "&itemNo=" + this.itemNo
    window.Cookies.set("prePage", "../allType/" + url);
    history.replaceState(stateObj, "backPage", url) //状态缓存
    var programId = this.result[this.itemNo].programId;
    var folderId = value.folderId;
    var jsonUrl = encodeURIComponent(this.result[this.itemNo].jsonUrl);
    console.log(jsonUrl)
    if (this.result[this.itemNo].layout != "Detail_News") {
      window.location = "../singleDetail/singleDetail.html?JsonUrl=" + jsonUrl;
    } else {
      window.location = "../seriesDetail/seriesDetail.html?JsonUrl=" + jsonUrl;
    }
  },
  back: function () {
    window.location = "../index.html";
  },
  home: function () {
    window.location = value.lastURL;
  },

  addCss: function () {
    setTimeout(function () {
      $.imgLazyLoad(); //懒加载
    }, 310);
    $(".number").html((this.time + 1) + "/" + this.pagination);
    $(".middle-box li")
      .eq(this.itemNo)
      .addClass("active");
    var title = $(".middle-box .text")
      .eq(this.itemNo)
      .text();
    if (title.length > 8) {
      var wordBox = document.querySelectorAll(".word")[this.itemNo];
      var text1 = document.querySelectorAll(".text")[this.itemNo];
      var text2 = document.querySelectorAll(".text-copy")[this.itemNo];
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
    setTimeout(function () {
      $.imgLazyLoad(); //懒加载
    }, 310);
    $(".number").html((this.time + 1) + "/" + this.pagination);
    $(".middle-box li")
      .eq(this.itemNo)
      .removeClass("active");
    if (this.timer !== null) {
      document.querySelectorAll(".word")[this.itemNo].style.textOverflow =
        "ellipsis";
      document.querySelectorAll(".word")[this.itemNo].scrollLeft = 0;
      document.querySelectorAll(".text-copy")[this.itemNo].innerHTML = "";
      clearInterval(this.timer);
    }
    $.imgLazyLoad(); //懒加载
  }
}

var btnArea = {
  btn: 1,
  left: function () {
    this.btn = 1
    $('.btn div').removeClass("hover")
    areaObj = contentList
    contentList.addCss()
  },
  up: function () {
    if (this.btn == 1) return
    this.btn--
    $("#btn-down").removeClass("hover")
    $("#btn-up").addClass("hover")
  },
  down: function () {
    if (this.btn == 2) return
    this.btn++
    $("#btn-up").removeClass("hover")
    $("#btn-down").addClass("hover")
  },
  enter: function () {
    if (this.btn == 1) {
      contentList.pageup()
      contentList.removeCss()
    } else {
      contentList.pagedown()
      contentList.removeCss()
    }
  },
  back: function () {
    window.location = "../index.html"
  },
  home: function () {
    window.location = value.lastURL;
  }
}


if (value.isBack) {
  areaObj = contentList; //初始焦点赋值
} else {
  areaObj = navBar; //初始焦点赋值
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
    case "home":
      areaObj.home();
      break;
  }
};
//事件绑定
document.onkeydown = grepEvent;