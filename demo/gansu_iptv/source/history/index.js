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
function init() {
  if (window.location.search.length > 1) {
    history.itemNo = Number(getQueryString("itemNo"));
    history.init();
    toggleClass(getId('nav-connent'), 'hover');
    if (getQueryString("pindex")) {
      history.isBack = true;
      history.pos = 1;
      connentBox.pindex = Number(getQueryString("pindex"));
      connentBox.itemNo = Number(getQueryString("contentItemNo"));
    }
    history.historyData(history.itemNo, connentBox.pindex);

    // 页面访问上报
    var url = document.location.search
    url = url.slice(0, 9)
    var jump = Cookies.get('jump')
    if(jump) {
      jump = eval('(' + jump + ')')
      try {
        var jsonOb = {}
        if(url == '?itemNo=0') {
          jsonOb.page_type = '0501'
          jsonOb.page_id = '103-1'
        } else {
          jsonOb.page_type = '0601'
          jsonOb.page_id = '101-1'
        }
        jsonOb.parent_page_type = jump.parent_page_type
        jsonOb.parent_page_id = jump.parent_page_id
        bi.jump(jsonOb)
        Cookies.set('jump', '', {path: '/'})
      } catch (error) {
        console.log('埋点错误', error)
      }
    }
  }
}

// 按键
var history = {};
history.id = 0;
history.name = 'history'
history.text = ''
history.totalNum = 0;
history.totalPage = 0;
history.searchList = [];
history.itemNo = 0;
history.pos = 0;
history.isBack = false;
history.changeClass = function () {
  if (this.itemNo == 1) {
    getId('keycode-connect').style.top = 355.5 - getId('keycode-connect').clientHeight / 2 + 'px';
  } else {
    getId('keycode-connect').style.top = '355.5px';
  }
};
history.up = function (params) {
  if (history.itemNo == 0) return
  this.itemNo = 0;
  history.changeClass();
  history.historyData(this.itemNo, 1);
  history.updated();
}

history.down = function (params) {
  if (this.itemNo == 1) return
  this.itemNo = 1;
  history.changeClass();
  history.historyData(this.itemNo, 1);
  history.updated();
}

history.left = function (params) { }

history.right = function (params) {
  if (history.totalNum == 0) return
  removeClass(getId('nav-connent'), 'hover');
  connentBox.init();
  toggleClass(connentBox.getCurr(), 'hover');
  connentBox.marquee('add');
}
history.enter = function () { }
history.updated = function () {
  connentBox.pindex = 1;
  connentBox.itemNo = 0;
}
// 模板内初始化方法
history.init = function (state) {
  // console.log('栏目导航绑定键值监听');
  areaObj = history;
  history.pos = 0;
  // toggleClass(getId('nav-connent'), 'hover');
  // 初始化焦点样式
  history.changeClass();
}
// 模板字符串
history.template = function (obj) {
  //如果某一页删除最后一项
  if (history.pos == 1 && obj.resultList.length == 0 && connentBox.pindex > 0) {
    connentBox.pindex--;
    history.itemNo = 0;
    history.historyData(history.itemNo, connentBox.pindex);
    return
  }
  history.totalNum = obj.resultNum;
  if (history.itemNo == 1 && history.totalNum >= 16) {//播放记录写死两页
    history.totalNum = 16;
  }
  history.searchList = obj.resultList;
  connentBox.props(history.searchList);
  this.totalPage = Math.ceil(this.totalNum / 8)
  //右侧滑块，页数
  connentBox.movebar(connentBox.pindex);
  getId('history-num').innerHTML = connentBox.pindex + '/' + this.totalPage;
  getId('history-bar').style.height = 543 / this.totalPage + 'px';
  if (this.totalPage > 1) {
    getId('history-num').style.display = 'block';
    getId('history-scroll').style.display = 'block';
  } else {
    getId('history-num').style.display = 'none';
    getId('history-scroll').style.display = 'none';
  }
  getId('top-c').style.display = 'none'
  if (history.totalNum <= 0) {
    if (history.itemNo == 1) {
      getId('top-c').innerHTML = "还没有学习记录，快去学习吧"
    } else {
      getId('top-c').innerHTML = "还没有收藏课程，快去收藏学习吧"
    }
    getId('top-c').style.display = 'block';
  }
  var element = getId('history-connent');
  element.innerHTML = '';
  var html = '';
  var scroe = '';
  for (var i = 0; i < this.searchList.length; i++) {
    var elementDom = this.searchList[i];
    if (elementDom.relateScore) {
      elementDom.relateScore += ''
      if (elementDom.relateScore.length == 1) {
        elementDom.relateScore += ".0"
      }
      scroe = '<div class="score">'
        + '<span>' + elementDom.relateScore + '</span></div>'
    } else {
      scroe = ''
    }
    var div =
      '<li class="middle-li li-item' + i + '" id="li-item' + i + '" jsonurl="' + elementDom.relateUrl + '">'
      + '<div class="imgbox">'
      + scroe
      + "<img src='../public/images/img_loading_160x230.png'  data-img='" + elementDom.relateImg + "'/>"
      + '</div>'
      + '<div class="word" id="word' + i + '">' + elementDom.relateTitle; +'</div></li>'
    html += div;
  }
  element.innerHTML = html;
  lazyLoadImage();
  if (history.isBack && history.pos == 1) {
    if (connentBox.pindex * 8 - 7 + connentBox.itemNo > history.totalNum) {
      history.pos == 0;
      connentBox.itemNo = 0;
      removeClass(connentBox.getCurr(), 'hover');
      history.init();
    } else if (connentBox.pindex == 0 && history.totalNum == 0) {
      history.pos == 0;
      connentBox.itemNo = 0;
      history.init();
    } else {
      connentBox.init();
      history.pos == 1;
      removeClass(getId('nav-connent'), 'hover');
      toggleClass(connentBox.getCurr(), 'hover');
      connentBox.marquee('add');
    }
    history.isBack=false;
  } else {
    if (history.pos == 1) {
      toggleClass(connentBox.getCurr(), 'hover');
      connentBox.marquee('add');
    }
    history.isBack=false;
  }
}

history.historyData = function (type, pindex) {
  ;
  getId('history-connent').innerHTML = '';
  var url = historylUrl + '/list?version=1&siteId=' + yh.siteId + '&userId=' + yh.userId + '&pindex=' + (pindex - 1) * 8 + '&psize=8'
  if (type == 1) {
    url = url + "&collectType=3"
  } else {
    url = url + "&collectType=1,2"
  }
  getCollectionList(url, function (response) {
    if (eval('(' + (response) + ')').data.resultNum == 0) {
      getId('top-c').style.display = 'block';
      if (history.itemNo == 0) {
        getId('top-c').innerHTML = "还没有收藏课程，快去收藏学习吧"
      } else {
        getId('top-c').innerHTML = "还没有播放记录，快去观看吧"
      }
    }
    if (eval('(' + (response) + ')').code !== 200) {
    } else {
      history.template(eval('(' + (response) + ')').data);
    }
  }, function (err) {
  })
}

function acceptBack() {
  var backUrl = Cookies.get('columnName') || '../../index.html';
  window.location = backUrl;
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
      acceptBack();
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