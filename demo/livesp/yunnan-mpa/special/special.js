var ptJson = {
  //设置模式
  ptStyle: "RELEASE",
  ptHost: function () {
    if (this.ptStyle == "RELEASE") {
      //发布模式
      return "/";
    } else if (this.ptStyle == "DEV") {
      //开发模式
      return "http://localhost:8081/api";
    }
  }
};

var value = {
  //详情页数据请求所需参数
  jsonUrl: "",
  jsonData: '',
  userFlag: "", // 用户标识
  userToken: "", // 用户token
  folderName: "",
  imageUrl: "",
  contentID: "", // 节目唯一标识      "productIDs" :
  folderId: "", //节目所属栏目folderId
  itemNo: 0, //右侧资产序号
  time: 0, //翻多少页
  isBack: false,
  lastURL: '',
  getValue: function () {
    this.mac = window.Cookies.get("mac");
    var oGetVars = {};
    var comeUrl = window.location.href;
    if (comeUrl.indexOf("indexUrl") != -1) {
      var lastURL = document.referrer;
      var cObj = "lastURL=" + lastURL + "; path=/";
      document.cookie = cObj;
      getInfo(); //获取详情信息
    }
    this.lastURL = window.Cookies.get("lastURL");
    var oGetVars = {};
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
    this.jsonUrl = oGetVars.JsonUrl;
    // this.folderName = oGetVars.folderName;
    if (oGetVars.itemNo) {
      this.isBack = true;
      this.itemNo = oGetVars.itemNo * 1;
      this.time = oGetVars.time * 1;
    }
  }
};

$(value.getValue());

var getContents = function () {
  var header = ptJson.ptHost();
  $.ajax({
    type: "GET",
    url: value.jsonUrl, //获取详情页数据
    dataType: "json", //指定服务器返回的数据类型
    jsonp: "callback", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
    success: function (res) {
      console.log(res);
      value.jsonData = res.data;
      contentList.init(res.data.elementList);
    },
    error: function (err) {
      console.log(err);
    }
  });
};
$(getContents());

var contentList = {
  itemNo: value.itemNo,
  time: value.time, //当前翻页次数
  pagination: 0, //共多少页
  result: [],
  init: function (data) {
    this.result = data;
    console.log(data)
    var html = "";
    for (i in data) {
      html +=
        "<li>" + "<img class='jiaobiao' src='../index/images/jingxuan.png'>" +
        "<div class='imgbox'>" +
        "<img src='../index/images/img_loading_160x230.png'  data-img=" +

        data[i].elementImg +
        " class='lazyload'>" +
        "</div>" +
        // "<div class='word'>" +
        // "<div class='text'>" +
        // data[i].programName +
        // "</div>" +
        // "   <div class='text-copy'>" +
        // "</div>" +
        // "</div>" +
        "</li>";
    }
    $(".middle-box ul").html(html);
    $.imgLazyLoad(); //懒加载
    $(".middle-box li")
      .eq(this.itemNo)
      .addClass("active");
    // $(".msg").html(value.folderName);
    var url = value.jsonData.specialImg;
    $(".bg").css({
      "background-image": "url(" + url + ")"
    });
    this.pagination = Math.ceil(data.length / 6);
    $(".number").html(this.time + 1 + "/" + this.pagination);
    if (value.isBack) {
      this.addCss();
      $(".scroll-box").css({
        transition: "all 0.3s",
        transform: "translateY(-" + 310 * this.time + "px)"
      });
      value.isBack = false; //关闭isback开关 ，防止双焦点
    }
  },
  home: function () {
    window.location = value.lastURL;
  },
  up: function () {
    if (this.itemNo <= 5) {
      this.removeCss();
      areaObj = btnArea;
      $("#btn-up").addClass("hover");
    } else {
      this.time--;
      $(".scroll-box").css({
        transition: "all 0.3s",
        transform: "translateY(-" + 310 * this.time + "px)"
      });
      this.removeCss();
      this.itemNo -= 6;
      this.addCss();
    }
  },
  down: function () {
    if (this.itemNo > this.result.length - 7) {
      //最后一行或下面无资产
      var num1 = Math.floor(this.result.length / 6) * 6;
      if (this.itemNo >= num1 || num1 === this.result.length) {
        //最后一行
        return;
      } else {
        //倒数第二行，下面无资产
        this.removeCss();
        this.itemNo = this.result.length - 1;
        this.time++;
        this.addCss();
        $(".scroll-box").css({
          transition: "all 0.3s",
          transform: "translateY(-" + 310 * this.time + "px)"
        });
      }
    } else {
      this.removeCss();
      this.itemNo += 6;
      this.time++;
      this.addCss();
      $(".scroll-box").css({
        transition: "all 0.3s",
        transform: "translateY(-" + 310 * this.time + "px)"
      });
    }
  },
  left: function () {
    if (this.itemNo % 6 === 0) return;
    this.removeCss();
    this.itemNo--;
    this.addCss();
  },
  right: function () {
    if (this.itemNo == this.result.length - 1 || (this.itemNo + 1) % 6 == 0)
      //最右边
      return;
    this.removeCss();
    this.itemNo++;
    this.addCss();
  },
  pageup: function () {
    this.removeCss();
    this.time--;
    if (this.time < 0) {
      this.time = this.pagination - 1;
    }
    this.itemNo = this.time * 6;
    this.addCss();
    $(".scroll-box").css({
      transition: "all 0.3s",
      transform: "translateY(-" + 310 * this.time + "px)"
    });
  },
  pagedown: function () {
    this.removeCss();
    this.time++;
    if (this.time > this.pagination - 1) {
      this.time = 0;
    }
    this.itemNo = this.time * 6;
    this.addCss();
    $(".scroll-box").css({
      transition: "all 0.3s",
      transform: "translateY(-" + 310 * this.time + "px)"
    });
  },
  enter: function () {
    var stateObj = {
      index: "backIndex"
    };
    var url =
      "special.html?JsonUrl=" +
      encodeURIComponent(value.jsonUrl) + "&itemNo=" +
      this.itemNo;
    window.Cookies.set("prePage", "../special/" + url);
    history.replaceState(stateObj, "backPage", url); //状态缓存
    var jsonUrl = encodeURIComponent(this.result[this.itemNo].jsonUrl);
    if (this.result[this.itemNo].programType == 0) {
      window.location =
        "../singleDetail/singleDetail.html?JsonUrl=" +
        jsonUrl
    } else {
      window.location =
        "../seriesDetail/seriesDetail.html?JsonUrl=" +
        jsonUrl
    }
  },
  back: function () {
    window.location = "../index.html"
  },
  addCss: function () {
    setTimeout(function () {
      $.imgLazyLoad(); //懒加载
    }, 310);
    $(".number").html(this.time + 1 + "/" + this.pagination);
    $(".middle-box li")
      .eq(this.itemNo)
      .addClass("active");
    // var title = $(".middle-box .text")
    //   .eq(this.itemNo)
    //   .text();
    // if (title.length > 8) {
    //   var wordBox = document.querySelectorAll(".word")[this.itemNo];
    //   var text1 = document.querySelectorAll(".text")[this.itemNo];
    //   var text2 = document.querySelectorAll(".text-copy")[this.itemNo];
    //   text2.innerHTML = text1.innerHTML;
    //   wordBox.style.textOverflow = "clip";
    //   clearInterval(this.timer);
    //   this.timer = setInterval(function() {
    //     if (text2.offsetWidth - wordBox.scrollLeft <= 0) {
    //       wordBox.scrollLeft = 1;
    //     } else {
    //       wordBox.scrollLeft += 2;
    //     }
    //   }, 40);
    // }
  },
  removeCss: function () {
    setTimeout(function () {
      $.imgLazyLoad(); //懒加载
    }, 310);
    $(".number").html(this.time + 1 + "/" + this.pagination);
    $(".middle-box li")
      .eq(this.itemNo)
      .removeClass("active");
    // if (this.timer !== null) {
    //   document.querySelectorAll(".word")[this.itemNo].style.textOverflow =
    //     "ellipsis";
    //   document.querySelectorAll(".word")[this.itemNo].scrollLeft = 0;
    //   document.querySelectorAll(".text-copy")[this.itemNo].innerHTML = "";
    //   clearInterval(this.timer);
    // }
  }
};

var btnArea = {
  btn: 1,
  down: function () {
    this.btn = 1;
    $(".btn div").removeClass("hover");
    areaObj = contentList;
    contentList.addCss();
  },
  left: function () {
    if (this.btn == 1) return;
    this.btn--;
    $("#btn-down").removeClass("hover");
    $("#btn-up").addClass("hover");
  },
  right: function () {
    if (this.btn == 2) return;
    this.btn++;
    $("#btn-up").removeClass("hover");
    $("#btn-down").addClass("hover");
  },
  enter: function () {
    if (this.btn == 1) {
      contentList.pageup();
      contentList.removeCss();
    } else {
      contentList.pagedown();
      contentList.removeCss();
    }
  },
  back: function () {
    window.location = "../index.html"
  },
  home: function () {
    window.location = value.lastURL;
  }
};

areaObj = contentList; //初始焦点赋值
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