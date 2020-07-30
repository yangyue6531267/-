var connentBox = {};
// 组件ID
connentBox.id = 0;
// 组价名称
connentBox.name = 'connentBox'
//当前页
connentBox.pindex = 1;
// 焦点ID
connentBox.itemNo = 0;
// 媒资数据
connentBox.dataList = [];
// 当前元素位置
connentBox.getCurr = function () {
  return getId('li-item' + connentBox.itemNo);
};
// title 滚动
connentBox.marquee = function (status) {
  var scrollLeft = 0;
  clearInterval(this.timer);
  var div = getId("word" + this.itemNo);
  if (status == 'add') {
    if (div.innerHTML.length < 8) return
    scrollLeft = 170;
    div.style.cssText = "text-indent: " + scrollLeft + "px;text-align: left;"
    this.timer = setInterval(function () {
      if (div.offsetWidth + scrollLeft <= -180) {
        scrollLeft = 170;
        div.style.cssText = "text-indent: " + scrollLeft + "px;text-align: left;"
      } else {
        scrollLeft += -3;
        div.style.cssText = "text-indent: " + scrollLeft + "px;text-align: left;"
      }
    }, 40);
  } else {
    if (div.innerHTML.length >= 8) {
      scrollLeft = 0;
      div.style.cssText = "text-indent: " + scrollLeft + "px;text-align: left;"
    }
  }
};

connentBox.up = function () {
  if (this.itemNo % 8 < 4) {
    if (this.pindex == 1) return
    removeClass(this.getCurr(), 'hover');
    connentBox.marquee();
    this.pindex--;
    this.movebar(this.pindex);
    this.itemNo += 4
    history.historyData(history.itemNo, this.pindex);
  } else {
    removeClass(this.getCurr(), 'hover');
    connentBox.marquee();
    this.itemNo -= 4;
    toggleClass(this.getCurr(), 'hover');
    connentBox.marquee('add');
  }
}

connentBox.down = function () {
  if (this.pindex >= history.totalPage && (this.pindex - 1) * 8 + this.itemNo + 4 >= history.totalNum) {
    if (this.itemNo < 4) {
      removeClass(this.getCurr(), 'hover');
      connentBox.marquee();
      this.itemNo = history.totalNum % 8 - 1;
      toggleClass(this.getCurr(), 'hover');
      connentBox.marquee('add');
    } else {
      return
    }
  } else if (this.pindex * 8 + this.itemNo - 3 > history.totalNum) {
    removeClass(this.getCurr(), 'hover');
    connentBox.marquee();
    this.itemNo = history.totalNum % 8 - 1;
    this.pindex++;
    this.movebar(this.pindex);
    history.historyData(history.itemNo, this.pindex);
  } else {
    removeClass(this.getCurr(), 'hover');
    connentBox.marquee();
    if (this.itemNo < 4) {
      this.itemNo += 4;
      toggleClass(this.getCurr(), 'hover');
      connentBox.marquee('add');
    } else {
      this.itemNo = (this.itemNo + 4) % 8;
      this.pindex++;
      this.movebar(this.pindex);
      history.historyData(history.itemNo, this.pindex);
    }
  }
}

connentBox.left = function () {
  removeClass(this.getCurr(), 'hover');
  connentBox.marquee();
  if (this.itemNo % 4 == 0) {
    history.init();
    toggleClass(getId('nav-connent'), 'hover');
    connentBox.marquee('');
  } else {
    this.itemNo--
    toggleClass(this.getCurr(), 'hover');
    connentBox.marquee('add');
  }
}

connentBox.right = function () {
  if (this.itemNo % 4 >= 3) return
  if ((this.pindex - 1) * 8 + this.itemNo + 1 >= history.totalNum) return
  removeClass(this.getCurr(), 'hover');
  connentBox.marquee();
  this.itemNo++;
  toggleClass(this.getCurr(), 'hover');
  connentBox.marquee('add');
}

connentBox.enter = function () {
  var jsonUrl = connentBox.dataList[this.itemNo].relateUrl;
  var url = "../history/history.html?itemNo=" + history.itemNo + "&pindex=" + this.pindex + "&contentItemNo=" + this.itemNo
  Cookies.set("backUrl", url, { path: '/' });
  Cookies.set('detailUrl', jsonUrl, { path: '/' });
  Cookies.set("twoStageBackUrl", url, { path: '/' });

  // 选中并进入（播放）物品时上报
  console.log('历史与收藏页点击上报')
  try {
    var jsonOb = {}
    jsonOb.page_type = history.itemNo
    if (history.itemNo == 1) {
      jsonOb.page_type = '0601'
    } else if (history.itemNo == 0) {
      jsonOb.page_type = '0501'
    }
    if (jsonUrl.indexOf("assetId") != -1) {
      jsonOb.cid = jsonUrl.match(/assetId=(\S*)&c=/)[1]
    } else {
      jsonOb.cid = jsonUrl.match(/specialId=(\S*)&c=/)[1]
    }
    jsonOb.click_type = '1'

    bi.historical(jsonOb)
  } catch (e) {
    console.log('错误信息' + e)
  }

  //  点击资产时上报
  // 页面访问储存
  
    
  if (history.itemNo == 1) {
    var jump = {
      parent_page_type: '0601',
      parent_page_id: '101-1'
    }
    jump = JSON.stringify(jump)
    Cookies.set('jump', jump, {path: '/'})
  } else if (history.itemNo == 0) {
    var jump = {
      parent_page_type: '0501',
      parent_page_id: '103-1'
    }
    jump = JSON.stringify(jump)
    Cookies.set('jump', jump, {path: '/'})
  }
  setTimeout(function(){
    if (connentBox.dataList[history.itemNo].collectType == 1 || connentBox.dataList[history.itemNo].collectType == 3) {
      window.location.href = "../detail/detail.html";
    } else if (connentBox.dataList[history.itemNo].collectType == 2) {
      window.location.href = '../special/index.html'
    }
  },200)
  
}
// 模板内初始化方法
connentBox.init = function () {
  areaObj = connentBox;
  history.pos = 1;
}
// 获取父组件传过来的收藏数据
connentBox.props = function (data) {
  if (data) { connentBox.dataList = data };
};
connentBox.movebar = function (pageNum) {
  var moveHeight = 543 / (history.totalPage);
  getId('history-bar').style.top = moveHeight * (pageNum - 1) + "px";
}