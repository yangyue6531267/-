var enter_time = new Date().getTime()
var KEYMAP = {
  38: "up",
  40: "down",
  37: "left",
  39: "right",
  13: "enter",
  8: "back",
  27: "back",
  22: "back",
  283: 'back',
  461: "back",
  340: "back",
  181: "home", // 首页
  278: "message", // 信息
  272: "home"
};
//按键分发事件
var onKeyPress;
//按键prev处理函数
var grepEvent = function (e) {
  var keyCode = e.keyCode || e.which;
  return onKeyPress(KEYMAP[keyCode]);
};

var KeyCodeList = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
function init () {
  // console.log('搜索页面,初始化数据 ' + (new Date()));
  // 页面初始化时上传访问页面日志
  try {
    var accessTime = formatDate();
    var Paramet  = yh.userId + '|xdf|' + accessTime + '|1|搜索页|2';
    // 重庆局方数据上报-页面访问
    bi.CQlogup(Paramet);
  }catch(e){}
  if(Cookies.get('parent_page_type')){
    try {
      commonParams.page_type = '0201'
      commonParams.page_id = '100-1'
      bi.jump(commonParams)
    } catch (e) {
      toast('错误信息' + e)
    }
  }
  var element = getId('keycode-connect');
  var html = "";
  for (var i = 0; i < KeyCodeList.length; i++) {
    var elementDom = KeyCodeList[i];
    var div = '<li class="key-item key' + elementDom + '" id="key-item' + i + '">' + elementDom + '</li>'
    html += div;
  }
  element.innerHTML = html;
  keyboard.init();
  if (window.location.search.length > 1) {
    keyboard.text = getQueryString("keyword");
    keyboard.updated();
    keyboard.isBack = true;
    if (getQueryString("pindex")) {
      removeClass(keyboard.getCurr(), 'hover');
      searchBox.pindex = Number(getQueryString("pindex"));
      searchBox.itemNo = Number(getQueryString("itemNo"));
      keyboard.pos = 1;
      searchBox.movebar(searchBox.pindex);
    }
  }
  keyboard.searchData(keyboard.text, searchBox.pindex);
  if (playConfig.stbType == "p30") {
    getId('search-num').className = "search-numP30";
    getId("search-connent").className = "middle-box middle-boxP30";
    getId('key-item-1').className = 'keycode-devareP30';
    getId('keycode-input').className = 'keycode-inputP30';
    // getId('sanjiaoxing').className = 'sanjiaoxingP30';
  }
  if (playConfig.stbType == "3.0") {
    getId("search-connent").className = "middle-box middle-box30";
  }
}

// 按键
var keyboard = {};
keyboard.id = 0;
keyboard.name = 'keyboard'
keyboard.text = ''
keyboard.totalNum = 0;
keyboard.totalPage = 0;
keyboard.searchList = [];
keyboard.itemNo = 0;
keyboard.pos = 0;
keyboard.isBack = false;
keyboard.getCurr = function () {
  return getId('key-item' + this.itemNo);
};

keyboard.up = function (params) {
  if (keyboard.itemNo <= -1) return
  removeClass(this.getCurr(), 'hover');
  if (this.itemNo < 6) {
    this.itemNo = -1;
  } else {
    this.itemNo -= 6;
  }
  toggleClass(this.getCurr(), 'hover');
}

keyboard.down = function (params) {
  if (keyboard.itemNo > 5 * 6 - 1) return
  removeClass(this.getCurr(), 'hover');
  if (this.itemNo == -1) {
    this.itemNo = 0
  } else {
    this.itemNo += 6
  }
  toggleClass(this.getCurr(), 'hover');
}

keyboard.left = function (params) {
  if (keyboard.itemNo <= -1) return
  if (this.itemNo == 0) return
  removeClass(this.getCurr(), 'hover');
  this.itemNo--;
  toggleClass(this.getCurr(), 'hover');
}

keyboard.right = function (params) {
  if (keyboard.itemNo <= -1) {
    removeClass(this.getCurr(), 'hover');
    searchBox.init();
    toggleClass(searchBox.getCurr(), 'hover');
    return
  }
  if (this.itemNo > 6 * 6 - 1) return
  removeClass(this.getCurr(), 'hover');
  if (this.totalNum > 0 && this.itemNo % 6 == 5) {
    searchBox.init();
    toggleClass(searchBox.getCurr(), 'hover');
  } else {
    this.itemNo++;
    toggleClass(this.getCurr(), 'hover');
  }
}
keyboard.enter = function () {
  if (this.itemNo == -1) {
    if (this.text.length == 0) return
    this.text = this.text.substring(0, this.text.length - 1);
  } else {
    this.text += KeyCodeList[this.itemNo];
  }
  getId('search-connent').innerHTML = '';
  this.updated();
  this.searchData(this.text, 0);
}
keyboard.updated = function () {
  searchBox.pindex = 1;
  searchBox.itemNo = 0;
  this.totalNum = 0;
  this.searchList = [];
  getId('keycode-input').innerHTML = this.text;
}
// 模板内初始化方法
keyboard.init = function (state) {
  // console.log('栏目导航绑定键值监听');
  areaObj = keyboard;
  keyboard.pos = 0;
  // 初始化焦点样式
  toggleClass(this.getCurr(), 'hover');
}

// 模板字符串
keyboard.template = function (obj) {
  keyboard.totalNum = obj.resultNum;
  keyboard.searchList = obj.resultList;
  searchBox.props(keyboard.searchList);
  this.totalPage = Math.ceil(this.totalNum / 8)
  //右侧滑块，页数
  searchBox.movebar(searchBox.pindex);
  getId('search-num').innerHTML = searchBox.pindex + '/' + this.totalPage;
  getId('search-bar').style.height = 543 / this.totalPage + 'px';
  if (this.totalPage > 1) {
    getId('search-num').style.display = 'block';
    getId('search-scroll').style.display = 'block';
  } else {
    getId('search-num').style.display = 'none';
    getId('search-scroll').style.display = 'none';
  }
  getId('top-c').style.display = 'none'
  if (keyboard.searchList.length == 0) {
    getId('top-c').style.display = 'block'
  }
  var element = getId('search-connent');
  var html = '';
  element.innerHTML = '';
  for (var i = 0; i < this.searchList.length; i++) {
    var elementDom = this.searchList[i];
    // console.log(elementDom);
    if (elementDom.elementImg) {
      image = elementDom.elementImg;
    } else {
      image = "../public/images/img_loading_160x230.png";
    }
    if (elementDom.score) {
      scroe = elementDom.score;
    } else {
      scroe = 1.1;
    }
    var div =
      '<li class="middle-li li-item' + i + '" id="li-item' + i + '" jsonurl="sss">'
      // '<li class="middle-li li-item' + i + '" id="li-item' + i + '" jsonurl="' + elementDom.jsonUrl + '">'
      + '<div class="imgbox">'
      + '<div class="score">'
      + '<span>' + scroe + '</span></div>'
      + '<img src="' + image + '">'
      + '</div>'
      + '<div class="word" id="word' + i + '">' + elementDom.elementName; +'</div></li>'
    html += div;
  }
  element.innerHTML = html;
  if (keyboard.pos == 1) {
    searchBox.init();
    // toggleClass(searchBox.getCurr(), 'hover');
    toggleClass(searchBox.getCurr(), 'hover');
  } else {
    removeClass(this.getCurr(), 'hover');
    toggleClass(this.getCurr(), 'hover');
  }
}

// 推荐数据
keyboard.getRecommend = function () {
  //推荐资产
  var url = baseUrl + 'p=yhSearchRecommend&k=1&v=1'
  getRecommend(url, function (response) {
    if (eval('(' + (response) + ')').code == 200) {
      var obj = eval('(' + (response) + ')');
      var data = {
        resultList: obj.data.hotAssetList.splice(0, 8),
        resultNum: 8
      }
      keyboard.template(data);
    }
  }, function (err) {
    // console.log('获取推荐资产失败')
  })
}
// 获取搜索数据
keyboard.searchData = function (keyword, pindex) {
  // console.log('搜索传参' + keyword, pindex);
  if (keyboard.text.length <= 0) {
    keyboard.getRecommend()
  } else {
    var url = baseUrl + 'p=yhSearch&k=1&v=1&searchType=all&word=' + keyword + '&pindex=' + (pindex - 1) * 8 + '&psize=8'
    getSearchList(url, function (response) {
      if (eval('(' + (response) + ')').code !== 200) {
        // console.log("搜索内容返回异常!");
      } else {
        // console.log('搜索内容获取成功' + response);
        keyboard.template(eval('(' + (response) + ')').data[0]);
        // console.log(eval('(' + (response) + ')').data[0])
        if (eval('(' + (response) + ')').data[0].resultList.length == 0) {
          // 键盘搜索后右边无资产时上报
          // console.log('键盘搜索后右边无资产时上报')
          try {
            commonParams.result = '0';
            commonParams.click_type = '';
            commonParams.cid = '';
            commonParams.keyword = document.getElementById('keycode-input').innerText;
            bi.searchkeyDo(commonParams)
          } catch (e) {
            toast('错误信息' + e)
          }
        } else {
          // console.log('有数据')
        }
      }
    }, function (err) {
      // console.log("搜索内容接口失败");
    })
  }
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
        if(Cookies.get('parent_page_type')){
          Cookies.del('parent_page_type','/');
        };
        if(Cookies.get('parent_page_id')){
          Cookies.del('parent_page_id','/');
        }; 
      var backUrl = Cookies.get('columnName') || '../../index.html';
      window.location = backUrl;
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