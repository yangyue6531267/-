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
  try{
    if(document.getElementById('filter-header-0').style.display !== 'none'){
      commonParams.result = '1';
      // 通过每一列到顶端距离判断筛选字符串
      var filter_0 = document.getElementById('filter-0').style.top;
      var filter_1 = document.getElementById('filter-1').style.top;
      var filter_2 = document.getElementById('filter-2').style.top;
      filter_1 = parseInt(filter_1.substring(0, filter_1.length - 2))
      filter_2 = parseInt(filter_2.substring(0, filter_2.length - 2))
      // 第一列只有电影
      var f1 = ((180 - filter_1) / 62)
      var f2 = ((180 - filter_2) / 62)
      if (isNaN(f1)) {
        f1 = 0
      }
      if (isNaN(f2)) {
        f2 = 0
      }
      commonParams.keyword = document.getElementById('filter-0').children[filter.itemNo0].innerHTML + '|' + document.getElementById('filter-1').children[f1].innerHTML + '|' + document.getElementById('filter-2').children[f2].innerHTML;
    }else{
      commonParams.result = '1';
      var row_inner = document.getElementById('single-row-inner').style.top
      row_inner = parseInt(row_inner.substring(0, row_inner.length - 2))
      var rheight = ((180 - row_inner) / 62)
      if (isNaN(rheight)) {
        rheight = 0
      }
      commonParams.keyword = document.getElementById('single-row-inner').children[rheight].innerHTML;    
    };
    commonParams.cid = connentBox.dataList.assetList[this.itemNo].assetId;
    commonParams.cat_id = Cookies.get('parent_page_id');
    bi.filterKeyDo(commonParams)
  }catch(e){}
  Cookies.set("backUrl", url, { path: '/' });
  Cookies.set('detailUrl', jsonUrl, { path: '/' });
  Cookies.set('parent_page_type','0901',{path:'/'});
  Cookies.set('parent_page_id','102-1',{path:'/'});
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