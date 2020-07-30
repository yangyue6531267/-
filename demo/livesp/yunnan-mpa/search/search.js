var value = {
  userToken: '',
  topMsg: '或许你会喜欢',
  cList: [], //缓存刚继续搜索页面推荐的资产
  isBack: false,
  folderId: '',
  keyword: '',
  time: 0,
  itemNo: 0,
  lastURL: '',
  getValue: function () {
    this.lastURL = window.Cookies.get('lastURL');
    if (window.Cookies.get('userToken')) {
      this.userToken = window.Cookies.get('userToken');
    } else {
      this.userToken = 123456;
    }
    var oGetVars = {};
    if (window.location.search.length > 1) { //从url里面拿到所需键值
      for (var aItKey, nKeyId = 0, aCouples = window.location.search.substr(1).split("&"); nKeyId < aCouples.length; nKeyId++) {
        aItKey = aCouples[nKeyId].split("=");
        oGetVars[decodeURIComponent(aItKey[0])] = aItKey.length > 1 ? decodeURIComponent(aItKey[1]) : "";
      }
    }
    if (oGetVars.itemNo) {
      this.isBack = true;
      this.folderId = oGetVars.folderId;
      this.itemNo = oGetVars.itemNo * 1;
      this.time = oGetVars.time * 1;
      this.keyword = oGetVars.keyword + ""
    }
  }
};
$(value.getValue());

var gitListZ = {
  git: function (srchFolderId, srchProgramId) {
    try {
      var oDate = new Date(); //实例一个时间对象；
      var year = oDate.getFullYear(); //获取系统的年；
      var mon = oDate.getMonth() + 1; //获取系统月份，由于月份是从0开始计算，所以要加1
      var day = oDate.getDate(); // 获取系统日，
      var hou = oDate.getHours(); //获取系统时，
      var moms = oDate.getMinutes(); //分
      var mis = oDate.getSeconds(); //秒
      function p(s) {
        return s < 10 ? '0' + s : s;
      }
      var time = year + "" + p(mon) + '' + p(day) + '' + p(hou) + '' + p(moms) + '' + p(mis) + '';
      var json = {
        "action_type": "search",
        "user_id": Authentication.CTCGetConfig("UserID"),
        "user_group_id": Authentication.CTCGetConfig("UserGroupNMB"),
        "epg_group_id": Authentication.CTCGetConfig("UserGroupNMB").substring(0, 2),
        "stb_ip": Authentication.CTCGetConfig("IP"),
        "stb_id": Authentication.CTCGetConfig("STBID"),
        "stb_type": Authentication.CTCGetConfig("STBType"),
        "stb_mac": Authentication.CTCGetConfig("MAC"),
        "terminal_type": Authentication.CTCGetConfig("TerminalType"),
        "area_node": Authentication.CTCGetConfig("AreaNode"),
        "CountyID": Authentication.CTCGetConfig("CountyID"),
        "srchKeyword": keyBoard.keyword,
        "srchFolderId": srchFolderId,
        "srchProgramId": srchProgramId,
        "enterFlag": 1,
        "log_time": time
      }
      console.log(json);
      // pptDataCollect.pptSendCollectData(json);
    } catch (err) {
      console.log(err);
    }
    var url = "http://182.245.29.86:89/epg-interface/logCollectionServlet/dealData";
    $.ajax({
      url: url,
      timeout: 5000,
      type: "post",
      data: {
        "data": JSON.stringify(json)
      },
      success: function (data) {
        console.log(data);
        alert(JSON.stringify(json));
      },
      error: function (err) { //上传搜索报错
        console.log(err);
      }
    });
  }
}

var getList = function () {
  // var header = ptJson.ptHost();
  // var folderList = [5542, 5543, 5544, 5545, 5546, 5547];
  // var num = Math.floor(Math.random() * 6);
  // var folderId = folderList.splice(num, 1).toString();
  // if (value.isBack) var folderId = value.folderId
  // value.folderId = folderId
  $.ajax({
    type: "GET",
    async: true,
    url: "http://47.97.96.103/?s=123508|16&p=yhSearchRecommend&k=1&v=1", //获取收藏
    dataType: "json",
    success: function (res) {
      console.log('推荐')
      console.log(res)
      var arr = res.data.hotAssetList;
      var ranNum = 8;
      var itemList = [];
      for (var i = 0; i < ranNum; i++) {
        var ran = Math.floor(Math.random() * arr.length);
        itemList.unshift(arr.splice(ran, 1)[0]);
      };
      console.log(itemList);
      value.cList = itemList
      searchBox.init(itemList)
    },
    error: function (err) {
      console.log(err);
    }
  });
}

var getSearchData = function (keyword) {
  $.ajax({
    tpe: "GET",
    async: true,
    url: "http://47.97.96.103/?s=123508|16&p=yhSearch&k=1&v=1&word=" + keyword, //获取收藏
    dataType: "json",
    success: function (res) {
      console.log(res);;
      if (res.code == 200) {
        var searchList = res.data[1].resultList
        console.log(searchList);
        var seriesNum = 0;
        for (i in searchList) {
          if (searchList[i].programType == 1) {
            seriesNum++
          }
        }
        var topWord = '全部' + '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp' + '短片' + (searchList.length - seriesNum) + '部' + '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp' + '系列片' + seriesNum + '部'
        $('.top-c').html(topWord)
        searchBox.init(searchList)
      } else {
        if (keyBoard.keyword.length == 0) { //删除搜索 为空时
          $('.top-c').html("或许你会喜欢")
        } else { // 搜索字段无结果
          $('.top-c').html("无搜索结果，或许你会喜欢")
        }
        $(getList())
        searchBox.init(value.cList)
      }
    },
    error: function (err) { //搜索失败
      $('.top-c').html("无搜索结果，或许你会喜欢")
      searchBox.init(value.cList)
      console.log(err);
    }
  });
}


var keyBoard = {
  keyword: '',
  kCode: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  itemNo: 0,
  position: 0, //0 在字母按键区 ， 1  在删除区域
  init: function () {
    var html = ""
    this.keyword = value.keyword
    for (i in this.kCode) {
      html += '<li>' + this.kCode[i] + '</li>'
    }
    $('.k-code ul').html(html);
    $('.k-code li').eq(0).addClass('active')
  },
  home: function () {
    window.location = value.lastURL
  },
  up: function () {
    if (this.position == 1) return;
    if (this.itemNo <= 5) {
      this.position = 1;
      $('.k-code li').removeClass('active');
      $('.k-do').addClass('hover');
    } else {
      $('.k-code li').eq(this.itemNo).removeClass('active');
      this.itemNo -= 6;
      $('.k-code li').eq(this.itemNo).addClass('active');
    }
  },
  down: function () {
    if (this.position == 0) {
      if (this.itemNo >= 30) {
        $('.k-code li').eq(this.itemNo).removeClass('active');
        this.itemNo -= 30;
        $('.k-code li').eq(this.itemNo).addClass('active');
      } else {
        $('.k-code li').eq(this.itemNo).removeClass('active');
        this.itemNo += 6;
        $('.k-code li').eq(this.itemNo).addClass('active');
      }
    } else {
      this.position = 0;
      $('.k-do').removeClass('hover');
      $('.k-code li').eq(this.itemNo).addClass('active');
    }
  },
  left: function () {
    if (this.position == 1 || this.itemNo == 0) return;
    $('.k-code li').eq(this.itemNo).removeClass('active');
    this.itemNo -= 1;
    $('.k-code li').eq(this.itemNo).addClass('active');
  },
  right: function () {
    if (this.position === 1) return
    if ((this.itemNo + 1) % 6 == 0 && this.position == 0) {
      if (searchBox.result.length <= 0) return; //如果右边无资产
      $('.k-code li').removeClass('active');
      areaObj = searchBox
      searchBox.addCss();
    } else {
      $('.k-code li').eq(this.itemNo).removeClass('active');
      this.itemNo += 1;
      $('.k-code li').eq(this.itemNo).addClass('active');
    }
  },
  enter: function () {
    if (this.position == 0) {
      this.keyword += this.kCode[this.itemNo];
    } else if (this.position == 1) {
      this.keyword = this.keyword.substring(0, this.keyword.length - 1);
    }
    value.keyword = this.keyword //通知上级 
    $('.k-input').html(this.keyword);
    $(getSearchData(this.keyword))
  },
  back: function () {
    window.location = "../index.html"
  }
}

var searchBox = {
  result: [],
  pagination: 0, //共多少页
  time: 0, //当前翻页次数
  itemNo: 0,
  init: function (data) {
    this.time = value.time;
    this.itemNo = value.itemNo;
    this.result = data;
    var html = ''
    for (i in data) {
      html += "<li>" + "<img class='jiaobiao' src='../index/images/jingxuan.png'>" + "<div class='imgbox'>" + "<img src='../index/images/img_loading_160x230.png'  data-img=" +
        data[i].elementImg + " class='lazyload'>" + "</div>" +
        "<div class='word'>" + "<div class='text'>" + data[i].elementName + "</div>" + "   <div class='text-copy'>" + "</div>" + "</div>" +
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
    $(".number-num").html((this.time + 1) + "/" + this.pagination);
    if (this.pagination >= 2) { //控制滚动条显示
      $('.search-scroll').css('visibility', 'visible');
    } else {
      $('.search-scroll').css('visibility', 'hidden');
    }
    if (value.isBack) {
      value.isBack = false
      setTimeout(function () {
        searchBox.addCss();
      }, 300);
      $('.scroll-box').css({
        'transition': 'all 0.3s',
        'transform': 'translateY(-' + 560 * this.time + 'px)'
      });
      var moveHeight = 400 / (this.pagination - 1); //滚动条滚动
      $('.search-bar').css({
        'transition': 'all 0.3s',
        'transform': 'translateY(' + moveHeight * this.time + 'px)'
      });
    }
  },
  home: function () {
    window.location = value.lastURL
  },
  up: function () {
    if (this.itemNo <= 3) return;
    var realHeight = $(".scroll-box li").eq(this.itemNo).offset().top + 240;
    if (realHeight < 500 && this.time > 0) {
      this.time--;
      $('.scroll-box').css({
        'transition': 'all 0.3s',
        'transform': 'translateY(-' + 560 * this.time + 'px)'
      });
      var moveHeight = 400 / (this.pagination - 1); //滚动条滚动
      $('.search-bar').css({
        'transition': 'all 0.3s',
        'transform': 'translateY(' + moveHeight * this.time + 'px)'
      });
    }
    this.removeCss();
    this.itemNo -= 4;
    this.addCss();
  },
  down: function () {
    var realHeight = $(".scroll-box li").eq(this.itemNo).offset().top + 240;
    if (realHeight > 500 && this.time < this.pagination - 1) {
      this.time++;
      $('.scroll-box').css({
        'transition': 'all 0.3s',
        'transform': 'translateY(-' + 560 * this.time + 'px)'
      });

      var moveHeight = 400 / (this.pagination - 1);
      $('.search-bar').css({
        'transition': 'all 0.3s',
        'transform': 'translateY(' + moveHeight * this.time + 'px)'
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
    if ((this.itemNo) % 4 === 0) { //焦点在最左边  还原所有状态
      this.time = 0;
      value.time = 0;
      this.removeCss();
      this.itemNo = 0;
      value.itemNo = 0;
      $('.scroll-box,.search-bar').css({
        'transition': 'all 0.3s',
        'transform': 'translateY(0px)'
      });
      $('.k-code li').eq(keyBoard.itemNo).addClass('active');
      areaObj = keyBoard
    } else {
      this.removeCss();
      this.itemNo--;
      this.addCss();
    }
  },
  right: function () {
    if (this.itemNo == (this.result.length - 1) || (this.itemNo + 1) % 4 == 0) //最右边
      return;
    this.removeCss();
    this.itemNo++;
    this.addCss()
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
      'transform': 'translateY(-' + 560 * this.time + 'px)'
    });
    var moveHeight = 400 / (this.pagination - 1); //滚动条滚动
    $('.search-bar').css({
      'transition': 'all 0.3s',
      'transform': 'translateY(' + moveHeight * this.time + 'px)'
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
      'transform': 'translateY(-' + 560 * this.time + 'px)'
    });
    var moveHeight = 400 / (this.pagination - 1); //滚动条滚动
    $('.search-bar').css({
      'transition': 'all 0.3s',
      'transform': 'translateY(' + moveHeight * this.time + 'px)'
    });
    this.addCss();
  },
  enter: function () {
    // var stateObj = {
    //   index: "backIndex"
    // }
    // var url = "search.html?folderId=" + value.folderId + "&keyword=" + value.keyword + "&time=" + this.time + "&itemNo=" + this.itemNo
    // window.Cookies.set("prePage", "../search/" + url);
    // history.replaceState(stateObj, "backPage", url) //状态缓存
    // var programId = this.result[this.itemNo].programId;
    // var folderId = value.folderId;
    // gitListZ.git(folderId, programId);
    var jsonUrl = encodeURIComponent(this.result[this.itemNo].jsonUrl)
    if (this.result[this.itemNo].layout == "Detail_News") {
      window.location = "../seriesDetail/seriesDetail.html?JsonUrl=" + jsonUrl;
    } else {
      window.location = "../singleDetail/singleDetail.html?JsonUrl=" + jsonUrl;
    }
  },
  back: function () {
    window.location = "../index.html";
  },
  addCss: function () {
    setTimeout(function () {
      $.imgLazyLoad(); //懒加载
    }, 310);
    $(".number-num").html((this.time + 1) + "/" + this.pagination);
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
    $.imgLazyLoad(); //懒加载
  },
  removeCss: function () {
    setTimeout(function () {
      $.imgLazyLoad(); //懒加载
    }, 310);
    $(".number-num").html((this.time + 1) + "/" + this.pagination);
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

// 初始数据获取与渲染
$(keyBoard.init());
if (value.isBack) {
  console.log(value.keyword);
  areaObj = searchBox
  $('.k-code li').removeClass('active');
  $('.k-input').html(value.keyword);
  if (value.keyword.length == 0) {
    $(getList());
  } else {
    $(getSearchData(value.keyword));
  }
} else {
  areaObj = keyBoard
  $(getList());
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