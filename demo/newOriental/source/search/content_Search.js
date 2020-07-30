var searchBox = {};
// 组件ID
searchBox.id = 0;
// 组价名称
searchBox.name = 'searchBox'
//当前页
searchBox.pindex = 1;
// 焦点ID
searchBox.itemNo = 0;
// 媒资数据
searchBox.dataList = [];
// 当前元素位置
searchBox.getCurr = function () {
  return getId('li-item' + this.itemNo);
};
// title 滚动
searchBox.marquee = function (status) {
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

searchBox.up = function () {
  if (this.itemNo % 8 < 4) {
    if (this.pindex == 1) return
    removeClass(this.getCurr(), 'hover');
    searchBox.marquee();
    this.pindex--;
    this.movebar(this.pindex);
    this.itemNo += 4
    keyboard.searchData(keyboard.text, this.pindex)
  } else {
    removeClass(this.getCurr(), 'hover');
    searchBox.marquee();
    this.itemNo -= 4;
    toggleClass(this.getCurr(), 'hover');
    searchBox.marquee('add');
  }
}

searchBox.down = function () {
  if (this.pindex >= keyboard.totalPage && (this.pindex - 1) * 8 + this.itemNo + 4 >= keyboard.totalNum) {
    if (this.itemNo < 4) {
      removeClass(this.getCurr(), 'hover');
      searchBox.marquee();
      this.itemNo = keyboard.totalNum % 8 - 1;
      toggleClass(this.getCurr(), 'hover');
      searchBox.marquee('add');
    } else {
      return
    }
  } else if (this.pindex * 8 + this.itemNo - 3 > keyboard.totalNum) {
    removeClass(this.getCurr(), 'hover');
    searchBox.marquee();
    this.itemNo = keyboard.totalNum % 8 - 1;
    this.pindex++;
    this.movebar(this.pindex);
    keyboard.searchData(keyboard.text, this.pindex)
  } else {
    removeClass(this.getCurr(), 'hover');
    searchBox.marquee();
    if (this.itemNo < 4) {
      this.itemNo += 4;
      toggleClass(this.getCurr(), 'hover');
      searchBox.marquee('add');
    } else {
      this.itemNo = (this.itemNo + 4) % 8;
      this.pindex++;
      this.movebar(this.pindex);
      keyboard.searchData(keyboard.text, this.pindex)
    }
  }
}

searchBox.left = function () {
  removeClass(this.getCurr(), 'hover');
  searchBox.marquee();
  if (this.itemNo % 4 == 0) {
    keyboard.init();
  } else {
    this.itemNo--
    toggleClass(this.getCurr(), 'hover');
    searchBox.marquee('add');
  }
}

searchBox.right = function () {
  if (this.itemNo % 4 >= 3) return
  if ((this.pindex - 1) * 8 + this.itemNo + 1 >= keyboard.totalNum) return
  removeClass(this.getCurr(), 'hover');
  searchBox.marquee();
  this.itemNo++;
  toggleClass(this.getCurr(), 'hover');
  searchBox.marquee('add');
}

searchBox.enter = function () {
  try {
    var text = '';
    if(keyboard.text.length>0){
      text = keyboard.text.split('').join('|');
      commonParams.result = '1';
    }else{
      commonParams.result = '2';
    }
    commonParams.click_type = '1';
    commonParams.cid = keyboard.searchList[this.itemNo].elementId;
    commonParams.keyword = text;
    bi.searchkeyDo(commonParams)
  } catch (e) {
    toast('错误信息' + e)
  }
  var jsonUrl = searchBox.dataList[this.itemNo].jsonUrl;
  var url = "../search/search.html?keyword=" + keyboard.text + "&pindex=" + this.pindex + "&itemNo=" + this.itemNo
  Cookies.set("backUrl", url, { path: '/' });
  Cookies.set('detailUrl', jsonUrl, { path: '/' });
  Cookies.set('parent_page_id','100-1',{path:'/'});
  Cookies.set('parent_page_type','0201',{path:'/'});
  window.location = "../detail/detail.html";
}
// 模板内初始化方法
searchBox.init = function () {
  areaObj = searchBox;
  searchBox.marquee('add')
  keyboard.pos = 1;
};
// 获取父组件传过来的收藏数据
searchBox.props = function (data) {
  if (data) { searchBox.dataList = data };
};
searchBox.movebar = function (pageNum) {
  var moveHeight = 543 / (keyboard.totalPage);
  getId('search-bar').style.top = moveHeight * (pageNum - 1) + "px";
}