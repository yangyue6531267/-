var value = {
  isBack: false,
  keyword: "",
  pindex: 0,
  itemNo: 0,
  pageTotal: 0,
  cList: [],
  getValue: function () {
    if (window.location.search.length > 1) {
      this.isBack = true
      this.keyword = unity.getVars("keyword");
      this.pindex = unity.getVars("pindex") * 1;
      this.itemNo = unity.getVars("itemNo") * 1;
      searchBox.pindex = this.pindex * 1;
      searchBox.pageNum = Math.floor(this.pindex / 8) * 1;
      searchBox.itemNo = this.itemNo * 1;
    }
    var param = {
      page_type: bi.type.search,
      page_id: '100-1',
    }
    var jumpJson = $.cookie("jump");
    if (jumpJson) {
      try {
        var arr = eval('(' + ((jumpJson) + JSON.stringify(param)).replace(/}{/, ',') + ')');
        bi.jump(arr);
        $.removeCookie("jump", { path: "/" });
      } catch (error) {
        $.removeCookie("jump", { path: "/" });
      }
    }
  }
}

var getList = function () {
  var url = baseUrl + "p=yhSearchRecommend&k=1&v=1"
  unity.jsonp(url, function (res) {
    console.log("获取推荐资产");
    console.log(JSON.stringify(res));
    value.cList = res.data.hotAssetList.splice(0, 8)
    console.log(JSON.stringify(value.cList));
    $(".top-c").css({
      'visibility': 'visible'
    })
    $(".search-scroll,.number-num").css({
      "visibility": "hidden"
    });
    $(".top-c").html("猜你喜欢")
    searchBox.init(value.cList);
    $.imgLazyLoad(); //懒加载
  })
}

var cookieSearch = function () {
  // 搜索页公共组件
  try {
    var param = {
      parent_page_type: bi.type.search,
      parent_page_id: '100-1'
    }
    $.cookie("jump", JSON.stringify(param), {
      path: '/'
    });
  } catch (error) {
  }
}

var getSearchData = function (keyword, pindex) {
  var url = baseUrl + "p=yhSearch&k=1&v=1&searchType=all&word=" + keyword + "&pindex=" + pindex + "&psize=8"
  unity.jsonp(url, function (res) {
    console.log("获取搜索资产");
    console.log(res);
    $(".top-c").css({
      'visibility': 'hidden'
    })
    if (value.keyword.length == 0) {
      getList()
    } else {
      searchBox.isRecommend = false;
    }
    searchBox.isDown = true;
    searchBox.init(res.data);
    $.imgLazyLoad(); //懒加载

  })
}

var keyBoard = {
  keyword: '',
  kCode: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  itemNo: 0,
  position: 0, //0 在字母按键区 ， 1  在删除区域
  init: function () {
    var html = ""
    this.keyword = value.keyword
    $(".yyss").hide();//语音提示文案
    for (i in this.kCode) {
      html += '<li>' + this.kCode[i] + '</li>'
    }
    $('.k-code ul').html(html);
    $('.k-code li').eq(0).addClass('active')
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
      if (searchBox.data.length <= 0) return; //如果右边无资产
      $('.k-code li').removeClass('active');
      areaObj = searchBox
      searchBox.addCss();
      $(".yyss").hide();
    } else {
      $('.k-code li').eq(this.itemNo).removeClass('active')
      this.itemNo += 1;
      $('.k-code li').eq(this.itemNo).addClass('active');
    }
  },
  enter: function () {
    if (this.position == 0) {
      this.keyword += this.kCode[this.itemNo];
    } else if (this.position == 1) {
      if (!value.keyword) return//条件为空跳出
      this.keyword = this.keyword.substring(0, this.keyword.length - 1);
      if ($('.k-input').html(this.keyword)) {
        // $('.yyss').show();
      }
    }
    value.keyword = this.keyword //通知上级 
    $('.k-input').html(this.keyword);
    $('.yyss').hide();
    searchBox.itemNo = 0;
    searchBox.pageNum = 0;
    $(getSearchData(this.keyword, 0))
  },
  back: function () {
    history.go(-1)
  }
}
var searchBox = {
  data: [],
  itemNo: 0,
  pageTotal: 0,
  pageNum: 0,
  pindex: 0,
  isRecommend: true,
  isDown: true,
  init: function (data) {
    this.pindex = this.pageNum * 8;
    if (this.isRecommend) {
      this.data = data
    } else {
      if (data == null) {
        this.isRecommend = true
      } else if (data[0].resultNum === 0) {
        $(".search-scroll,.number-num").css({
          "visibility": "hidden"
        });
        $(".top-c").css({
          'visibility': 'visible'
        })
        $(".top-c").html("搜索无结果")
        this.data = [];
        // 搜索无结果上报
        try {
          var jsonOb = {}
          jsonOb.result = '0'
          jsonOb.keyword = encodeURIComponent(document.getElementsByClassName('k-input')[0].innerText)
          jsonOb.click_type = '1'
          jsonOb.cid = ''
          bi.search(jsonOb)
        } catch (error) {
          console.log('埋点错误', error)
        }
      } else {
        $(".number-num").css({
          'visibility': 'visible'
        })
        this.pageTotal = Math.ceil(data[0].resultNum / 8)
        if (this.pageTotal >= 2) {
          $(".search-scroll").css({
            "visibility": "visible"
          });
        } else {
          $(".search-scroll").css({
            "visibility": "hidden"
          });
        }
        $(".number-num").html("第" + (this.pageNum + 1) + "页")
        this.data = data[0].resultList
      }
    }
    $(".scroll-box").empty();
    for (i in this.data) {
      $(".scroll-box").append('<li><div class="imgbox"><div class="score"><span>' + this.data[i].score + '</span></div><img class="lazyload" src="../public/images/img_loading_160x230.png"  data-img="' + this.data[i].elementImg + '"/></div><div class="word">' + this.data[i].elementName + '</div></li>')
    }
    this.movebar(this.pageNum);
    if (areaObj === searchBox) {
      this.addCss();
    }
  },
  addCss: function () {
    $(".middle-box li").eq(this.itemNo).addClass('active');
    var title = $(".middle-box .word")
      .eq(this.itemNo)
      .text();
    if (title.length > 8) {
      $(".middle-box .word").eq(this.itemNo).html('<marquee scrolldelay=80>' + this.data[this.itemNo].elementName + '</marquee>')
    }
  },
  removeCss: function () {
    $(".middle-box li").eq(this.itemNo).removeClass('active');
    $(".middle-box .word").eq(this.itemNo).html(this.data[this.itemNo].elementName)
  },
  movebar: function (pageNum) {
    var moveHeight = 400 / (this.pageTotal - 1); //滚动条滚动
    $(".search-bar").stop(true, true).animate({
      top: moveHeight * pageNum
    }, 200)
  },
  up: function () {
    if (this.itemNo <= 3) {
      if (this.pageNum === 0) {
        return
      } else {
        this.pageNum--
        this.pindex = this.pageNum * 8
        this.removeCss()
        this.movebar(this.pageNum)
        this.itemNo = 0; //重置焦点
        getSearchData(value.keyword, this.pindex)
      }

    } else {
      this.removeCss()
      this.itemNo -= 4
      this.addCss()
    }
  },
  down: function () {
    $('.yyss').hide()
    if (this.itemNo >= 4) {
      if (this.pageNum === this.pageTotal - 1 || this.pageTotal === 0 || !this.isDown) {
        return
      } else {
        this.isDown = false;
        this.pageNum++
        this.pindex = this.pageNum * 8
        this.removeCss()
        this.movebar(this.pageNum)
        this.itemNo = 0; //重置焦点
        getSearchData(value.keyword, this.pindex)
      }
    } else {
      this.removeCss()
      this.itemNo += 4
      if (this.itemNo >= this.data.length - 1) {
        this.itemNo = this.data.length - 1
      }
      this.addCss()
    }
  },
  left: function () {
    $('.yyss').hide()
    if (this.itemNo === 0 || this.itemNo === 4) {
      this.removeCss()
      areaObj = keyBoard
      $('.k-code li').eq(keyBoard.itemNo).addClass('active');
    } else {
      this.removeCss()
      this.itemNo--
      this.addCss()
    }

  },
  right: function () {
    $('.yyss').hide()
    if ((this.itemNo == 3 || this.itemNo === this.data.length - 1)) return
    this.removeCss()
    this.itemNo++
    this.addCss()
  },
  enter: function () {
    // 搜索上报
    try {
      var jsonOb = {}
      jsonOb.keyword = encodeURIComponent(document.getElementsByClassName('k-input')[0].innerText)
      if (jsonOb.keyword != '') {
        jsonOb.result = '1'
        jsonOb.click_type = '1'
        jsonOb.cid = this.data[this.itemNo].elementId
      } else {
        jsonOb.result = '2'
        jsonOb.click_type = '1'
        jsonOb.cid = this.data[this.itemNo].elementId
      }

      bi.search(jsonOb)
    } catch (error) {
      console.log('埋点错误', error)
    }
    var url = "search.html?keyword=" + value.keyword + "&pindex=" + this.pindex + "&itemNo=" + this.itemNo
    // history.replaceState(null, null, url) //状态缓存
    var preURL = "../search/" + url;
    $(".yyss").hide();
    $.cookie("preURL", preURL, { path: '/' });
    $.cookie('detailUrl', this.data[this.itemNo].jsonUrl, {
      path: '/'
    })
    $(cookieSearch());
    if (this.data[this.itemNo].layout === "Detail_Movie") {
      window.location = "../detail/movieDetail.html"
    } else {
      window.location = "../detail/seriesDetail.html"
    }
  },
  back: function () {
    window.location = "../index/home.html"
  }
}
value.getValue();
keyBoard.init();
if (value.isBack) {
  console.log(value.keyword);
  searchBox.itemNo = value.itemNo
  areaObj = searchBox
  $('.k-code li').removeClass('active');
  $('.k-input').html(value.keyword);
  if (value.keyword.length == 0) {
    getList()
  } else {
    getSearchData(value.keyword, value.pindex)
  }
  value.isBack = false;
} else {
  areaObj = keyBoard
  getList()
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
      // $(cookieSearch());
      window.location = "../index/home.html"
      areaObj.back();
      break;
    case "enter":
      areaObj.enter();
      break;

  }
};
//事件绑定
document.onkeydown = grepEvent;