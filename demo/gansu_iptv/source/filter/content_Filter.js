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
  if (document.getElementById('li-item' + this.itemNo)) {
    return getId('li-item' + this.itemNo);
  }
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
    filter.filterData(this.pindex - 1, filter.categoryId);
  } else {
    removeClass(this.getCurr(), 'hover');
    connentBox.marquee();
    this.itemNo -= 4;
    toggleClass(this.getCurr(), 'hover');
    connentBox.marquee('add');
  }
}

connentBox.down = function () {
  if (this.pindex >= filter.totalPage && (this.pindex - 1) * 8 + this.itemNo + 4 >= filter.totalNum) {
    if (this.itemNo < 4) {
      removeClass(this.getCurr(), 'hover');
      connentBox.marquee();
      this.itemNo = filter.totalNum % 8 - 1;
      toggleClass(this.getCurr(), 'hover');
      connentBox.marquee('add');
    } else {
      return
    }
  } else if (this.pindex * 8 + this.itemNo - 3 > filter.totalNum) {
    removeClass(this.getCurr(), 'hover');
    connentBox.marquee();
    this.itemNo = filter.totalNum % 8 - 1;
    this.pindex++;
    this.movebar(this.pindex);
    filter.filterData(this.pindex - 1, filter.categoryId);
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
      filter.filterData(this.pindex - 1, filter.categoryId);
    }
  }
}

connentBox.left = function () {
  removeClass(this.getCurr(), 'hover');
  connentBox.marquee();
  if (this.itemNo % 4 == 0) {
    // filter.pos = 2;
    filter.leftMove();
    filter.init();
    connentBox.marquee('');
  } else {
    this.itemNo--
    toggleClass(this.getCurr(), 'hover');
    connentBox.marquee('add');
  }
}

connentBox.right = function () {
  if (this.itemNo % 4 >= 3) return
  if ((this.pindex - 1) * 8 + this.itemNo + 1 >= filter.totalNum) return
  removeClass(this.getCurr(), 'hover');
  connentBox.marquee();
  this.itemNo++;
  toggleClass(this.getCurr(), 'hover');
  connentBox.marquee('add');
}

connentBox.enter = function () {
  var jsonUrl = connentBox.dataList.assetList[this.itemNo].jsonUrl;
  var url = "../filter/filter.html?catCode=" + filter.itemNo + "&pindex=" + this.pindex + "&contentItemNo=" + this.itemNo;
  Cookies.set("backUrl", url, { path: '/' });
  Cookies.set('detailUrl', jsonUrl, { path: '/' });

  // 点击筛选结果上报
  console.log('点击筛选结果上报')
  try {
    var jsonOb = {}
    jsonOb.result = '1'
    var justOne = document.getElementById('single-row-inner').children.length
    if (justOne == 0) {
      console.log('有3列')
      var filter_0 = document.getElementById('filter-0')
      var filter_1 = document.getElementById('filter-1')
      var filter_2 = document.getElementById('filter-2')
      var filter_0_length = (180 - filter_0.style.top.slice(0, -2)) / 62
      var filter_1_length = (180 - filter_1.style.top.slice(0, -2)) / 62
      var filter_2_length = (180 - filter_2.style.top.slice(0, -2)) / 62
      filter_0 = filter_0.children[filter_0_length].innerHTML
      filter_1 = filter_1.children[filter_1_length].innerHTML
      filter_2 = filter_2.children[filter_2_length].innerHTML
      jsonOb.keyword = encodeURIComponent(filter_0) + '|' + encodeURIComponent(filter_1) + '|' + encodeURIComponent(filter_2)
    } else {
      console.log('有1列')
      var filter_0 = document.getElementById('single-row-inner')
      var filter_length = (180 - filter_0.style.top.slice(0, -2)) / 62
      filter_0 = filter_0.children[filter_length].innerHTML
      jsonOb.keyword = encodeURIComponent(filter_0)
    }
    jsonOb.cid = connentBox.dataList.assetList[this.itemNo].assetId.toString()
    jsonOb.cat_id = Cookies.get('cat_id');
    bi.filter(jsonOb)
  } catch (error) {
    console.log('埋点错误', error)
  }

  // 页面访问储存
  var jump = {
    parent_page_type: '0901',
    parent_page_id: '102-1'
  }
  jump = JSON.stringify(jump)
  Cookies.set('jump', jump, {path: '/'})

  window.location = "../detail/detail.html";
}
// 模板内初始化方法
connentBox.init = function () {
  areaObj = connentBox;
  filter.pos = -1;
  filter.slider();
  toggleClass(this.getCurr(), 'hover');
  connentBox.marquee('add');
}
// 每次筛选要重置itemNo
connentBox.resetItemNo = function () {
  this.itemNo = 0;
  this.pindex = 1;
  getId('filter-bar').style.top = '0px';
}
// 获取父组件传过来的收藏数据
connentBox.props = function (data) {
  if (data) { connentBox.dataList = data };
};
connentBox.movebar = function (pageNum) {
  var moveHeight = 543 / (filter.totalPage);
  getId('filter-bar').style.top = moveHeight * (pageNum - 1) + "px";
}