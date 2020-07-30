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
  filter.init();
  if (window.location.search.length > 1) {
    filter.itemNo = getQueryString("catCode");
    getConditionFilter(getQueryString("catCode"), function (res) {
      if (JSON.parse(res).code == 200) {
        filter.fliterList = JSON.parse(res).data.categoryList[0].children;
        filter.createFliter(filter.fliterList, JSON.parse(res).data.level);
      }
    })
    if (getQueryString("pindex")) {
      filter.isBack = true;
      filter.itemNo0 = Number(getQueryString("itemNo0"));
      filter.itemNo1 = Number(getQueryString("itemNo1"));
      filter.itemNo2 = Number(getQueryString("itemNo2"));
      connentBox.pindex = Number(getQueryString("pindex"));
      connentBox.itemNo = Number(getQueryString("contentItemNo"));
      filter.slider();
      filter.removeClass();
    }
  }

  // 页面访问上报
  var jump = Cookies.get('jump')
  if (jump) {
    jump = JSON.parse(jump)
    try {
      var jsonOb = {}
      jsonOb.page_type = '0901'
      jsonOb.page_id = '102-1'
      jsonOb.parent_page_type = jump.parent_page_type
      jsonOb.parent_page_id = jump.parent_page_id
      bi.jump(jsonOb)
      Cookies.set('jump', '', { path: '/' })
    } catch (error) {
      console.log('埋点错误', error)
    }
  }
}

var filter = {};
filter.pos = 0;//区别焦点所在区域 -1，结果区，       0,1,2,选择
filter.itemNo0 = 0;//筛选三个框
filter.itemNo1 = 0;
filter.itemNo2 = 0;
filter.fliterList = [];
filter.searchList = [];
filter.totalPage = 0; // 总页数
filter.totalNum = 0; // 总个数
filter.pindex = 0; // 当前页
filter.categoryId = '';
filter.addClass = function () {
  if (document.getElementById('filter-header-0').style.display !== 'none') {
    toggleClass(getId("filter-header-" + filter.pos), 'ulhover');
  } else {
    toggleClass(getId("single-row"), 'ul-hover');
  }
};
filter.removeClass = function () {
  if (document.getElementById('filter-header-0')) {
    removeClass(getId("filter-header-" + filter.pos), 'ulhover');
  }
};
filter.slider = function () {
  if (document.getElementById('filter-header-0').style.display !== 'none') {
    getId("filter-0").style.top = 180 - filter.itemNo0 * 62 + "px";
    getId("filter-1").style.top = 180 - filter.itemNo1 * 62 + "px";
    getId("filter-2").style.top = 180 - filter.itemNo2 * 62 + "px";
  } else {
    getId('single-row-inner').style.top = 180 - this.itemNo0 * 62 + "px";
  }
};

filter.up = function (params) {
  if (filter.pos == 0) {
    if (this.itemNo0 == 0) return;
    this.itemNo1 = 0;
    this.itemNo0--;
    filter.slider(this.itemNo0);
  } else if (filter.pos == 1) {
    if (this.itemNo1 <= 0) return
    this.itemNo2 = 0;
    this.itemNo1--;
    filter.slider(this.itemNo1);
  } else {
    if (this.itemNo2 <= 0) return
    this.itemNo2--;
    filter.slider(this.itemNo2);
  }
  filter.gather(filter.fliterList, this.itemNo0, filter.pos)
};
filter.down = function (params) {
  if (filter.pos == 0) {
    if (this.itemNo0 + 1 >= filter.fliterList.length) return
    this.itemNo1 = 0;
    this.itemNo2 = 0;
    this.itemNo0++;
    filter.slider(this.itemNo0);
  } else if (filter.pos == 1) {
    if (filter.fliterList[this.itemNo0].children == undefined) return;
    if (this.itemNo1 + 1 >= filter.fliterList[this.itemNo0].children.length) return
    this.itemNo2 = 0;
    this.itemNo1++;
    filter.slider(this.itemNo1);
  } else {
    if (filter.fliterList[this.itemNo0].children == undefined) return;
    if (filter.fliterList[this.itemNo0].children !== undefined && filter.fliterList[this.itemNo0].children[this.itemNo1].children == undefined) return;
    if (this.itemNo2 + 1 >= filter.fliterList[this.itemNo0].children[this.itemNo1].children.length) return
    this.itemNo2++;
    filter.slider(this.itemNo2);
  }
  filter.gather(filter.fliterList, this.itemNo0, filter.pos)
}

filter.left = function (params) {
  if (filter.pos == 0) return
  filter.removeClass();
  this.pos--;
  filter.addClass();
  filter.slider();
}

filter.right = function (params) {
  if (document.getElementById('filter-header-0').style.display !== 'none') {
    if (filter.pos == 2) {
      if (filter.searchList.length == 0) {
        return
      }
      filter.removeClass();
      this.pos = -1;
      connentBox.init();
    } else {
      filter.removeClass();
      this.pos++;
      filter.addClass();
    }
  } else {
    if (filter.searchList.length == 0) {
      return
    }
    this.pos = -1;
    connentBox.init();
    removeClass(getId("single-row"), 'ul-hover');
  }
  filter.slider();
}
filter.enter = function () { }
filter.updated = function () {
  connentBox.pindex = 1;
  connentBox.itemNo = 0;
}
// 结果区左移区别健值
filter.leftMove = function () {
  if (document.getElementById('filter-header-0').style.display !== 'none') {
    this.pos = 2
  } else {
    this.pos = 0;
  }
};
// 模板内初始化方法
filter.init = function (state) {
  areaObj = filter;
  // 初始化焦点样式
  filter.addClass();
  filter.slider();
}
// filter.changeFliter
//初始化左侧筛选栏目
filter.createFliter = function (obj, row) {
  if (row == 4) {
    document.getElementById('single-row').style.display = 'none';
    var fragment0 = "";
    var fragment1 = "";
    var fragment2 = "";
    var filter0 = getId('filter-0');
    var filter1 = getId('filter-1');
    var filter2 = getId('filter-2');
    var list0 = filter.fliterList;
    var list1 = filter.fliterList[filter.itemNo0].children;
    var list2 = filter.fliterList[filter.itemNo0].children[filter.itemNo1].children;
    categoryId = filter.fliterList[filter.itemNo0].children[filter.itemNo1].children[filter.itemNo2].categoryId;
    categoryId = categoryId;
    filter.filterData(filter.pindex, categoryId);
    if (obj) {
      for (var i = 0; i < list0.length; i++) {
        fragment0 += "<li className='" + 'filter-1-' + i + "' categoryId='" + list0[i].categoryId + "' catCode='" + list0[i].catCode + "'  >" + list0[i].categoryName + "</li>";
      }
      filter0.innerHTML = fragment0;
    }
    filter1.innerHTML = '';
    for (var j = 0; j < list1.length; j++) {
      fragment1 += "<li className='" + 'filter-2-' + j + "' categoryId='" + list1[j].categoryId + "' catCode='" + list1[j].catCode + "'  >" + list1[j].categoryName + "</li>";
    }
    filter2.innerHTML = '';
    filter1.innerHTML = fragment1;
    for (var k = 0; k < list2.length; k++) {
      fragment2 += "<li className='" + 'filter-3-' + k + "' categoryId='" + list2[k].categoryId + "' catCode='" + list2[k].catCode + "'  >" + list2[k].categoryName + "</li>";
    }
    filter2.innerHTML = fragment2;
  } else if (row == 2) {
    document.getElementById('filter-header-0').style.display = 'none';
    document.getElementById('filter-header-1').style.display = 'none';
    document.getElementById('filter-header-2').style.display = 'none';
    var ele = "";
    for (var index = 0; index < obj.length; index++) {
      ele += "<li>" + obj[index].categoryName + "</li>"
    }
    document.getElementById('single-row-inner').innerHTML = ele;
    categoryId = obj[filter.itemNo0].categoryId;
    filter.categoryId = categoryId;
    filter.filterData(filter.pindex, categoryId);
  }
  if (getQueryString("itemNo0")) {
    filter.slider();
    removeClass(getId("single-row"), 'ul-hover');
  }
}
filter.gather = function (obj, item, row) {
  connentBox.resetItemNo();
  var condition = '';
  var eleLi1 = '';
  var eleLi2 = '';
  if (row == 0) {
    document.getElementById('filter-1').innerHTML = '';
    document.getElementById('filter-2').innerHTML = '';
    if (obj[item].children == undefined) {
      condition = obj[item].categoryId;
      document.getElementById('filter-1').innerHTML = "<li>其他</li>";
      document.getElementById('filter-2').innerHTML = "<li>其他</li>";
    } else {
      for (var j = 0; j < obj[item].children.length; j++) {
        eleLi1 += "<li className='" + 'filter-2-' + j + "' categoryId='" + obj[item].children[j].categoryId + "' catCode='" + obj[item].children[j].catCode + "'  >" + obj[item].children[j].categoryName + "</li>";
        if (obj[item].children[0].children && j == 0) {
          for (var k = 0; k < obj[item].children[0].children.length; k++) {
            eleLi2 += "<li className='" + 'filter-3-' + k + "' categoryId='" + obj[item].children[0].children[k].categoryId + "' catCode='" + obj[item].children[0].children[k].catCode + "'  >" + obj[item].children[0].children[k].categoryName + "</li>";
          }
          condition = obj[item].children[0].children[0].categoryId;
        }
      }
      document.getElementById('filter-1').innerHTML = eleLi1;
      document.getElementById('filter-2').innerHTML = eleLi2;
    };
  } else if (row == 1) {
    var eleLi = '';
    document.getElementById('filter-2').innerHTML = '';
    if (obj[item].children[filter.itemNo1].children) {
      for (var i = 0; i < obj[item].children[filter.itemNo1].children.length; i++) {
        eleLi += "<li className='" + 'filter-3-' + k + "' categoryId='" + obj[item].children[filter.itemNo1].children[i].categoryId + "' catCode='" + obj[item].children[filter.itemNo1].children[i].catCode + "'  >" + obj[item].children[filter.itemNo1].children[i].categoryName + "</li>";
      }
      document.getElementById('filter-2').innerHTML = eleLi;
      condition = obj[item].children[filter.itemNo1].children[0].categoryId;
    } else {
      condition = obj[item].children[filter.itemNo1].categoryId;
      document.getElementById('filter-2').innerHTML = "<li>其他</li>";
    }
  } else if (row == 2) {
    condition = obj[item].children[filter.itemNo1].children[filter.itemNo2].categoryId;
  }
  filter.categoryId = condition;
  filter.filterData(filter.pindex, condition);
}
filter.template = function (obj) {
  filter.totalNum = obj.assetNum;
  filter.searchList = obj.assetList;
  filter.totalPage = Math.ceil(filter.totalNum / 8);
  //右侧滑块，页数

  getId('filter-num').innerHTML = connentBox.pindex + '/' + filter.totalPage;
  getId('filter-bar').style.height = 543 / filter.totalPage + 'px';
  if (filter.totalPage > 1) {
    getId('filter-num').style.display = 'block';
    getId('filter-scroll').style.display = 'block';
  } else {
    getId('filter-num').style.display = 'none';
    getId('filter-scroll').style.display = 'none';
  }
  getId('top-c').style.display = 'none'
  if (filter.searchList.length == 0) {
    getId('top-c').style.display = 'block'
  }
  var element = getId('filter-connent');
  var fragment = "";
  for (var i = 0; i < this.searchList.length; i++) {
    var elementDom = this.searchList[i];
    var li = "";
    var div = "";
    var div1 = "";
    var span = "";
    var img = "";
    var div2 = "";

    li = "<li class='middle-li' id='" + 'li-item' + i + "' jsonUrl='" + elementDom.jsonUrl + "' ></li>";
    img = "<img src='../public/images/img_loading_160x230.png'  data-img='" + elementDom.assetImg + "'/>";
    span = "<span class=''>" + elementDom.score + "</span>";
    div = "<div class='imgbox'></div>";
    div2 = "<div class='word' id='word" + i + "'>" + elementDom.assetName + "</div>"
    if (elementDom.score) {

      div1 = "<div class='score'>" + span + "</div>"
      div = "<div class='imgbox'>" + img + div1 + "</div>";
    } else {
      div = "<div class='imgbox'>" + img + "</div>";
    }
    li = "<li class='middle-li li-item" + i + "' id='" + 'li-item' + i + "' jsonUrl='" + elementDom.jsonUrl + "' >" + div + div2 + "</li>";
    fragment += li;
  }
  element.innerHTML = fragment;
  lazyLoadImage();
  if (getQueryString("contentItemNo") && filter.isBack) {
    connentBox.init();
  }
};

filter.filterData = function (pindex, categoryId, state) {
  var url = 'p=yhScreenResultMulti&k=1&v=1&pindex=' + pindex * 8 + '&psize=8&sizeFlag=1&catCode=' + filter.itemNo + '&categoryId=' + categoryId;
  getFilterResult(url, function (response) {
    // console.log(categoryId+'===='+JSON.parse(response ))
    if (JSON.parse(response).code !== 200) {
    } else {
      getId('filter-connent').innerHTML = '';
      filter.template(JSON.parse(response).data);
      connentBox.props(JSON.parse(response).data)
    }
  }, function (error) {
  })
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
      var backUrl = Cookies.get('twoStageBackUrl') || '../../index.html';
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