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
function init () {
  if (window.location.search.length > 1) {
    filter.itemNo = getQueryString("catCode");
    filter.init();
    try {
      var accessTime = formatDate();
      var Paramet  = yh.userId + '|xdf|' + accessTime + '|1|筛选页|2';
      // 重庆局方数据上报-页面访问
      bi.CQlogup(Paramet);
    }catch(e){}
    // if(window.location.href.indexOf('contentItemNo') !== -1){
    //   document.getElementById('single-row').className = '';
    //   document.getElementById('single-row-hover').className = '';
    //   document.getElementById('filter-header-0').className = 'filter-0';
    //   document.getElementById('filter-center-0').className = 'filter-center-0';
    // }
    getConditionFilter(getQueryString("catCode"), function (res) {
      if (eval('(' + res + ')').code == 200) {
      if(Cookies.get('parent_page_type')){
        try {
          commonParams.page_type = '0901'
          commonParams.page_id = '102-1'
          bi.jump(commonParams)
        } catch (e) {
          // alert('错误信息' + e)
        }
      }
        filter.fliterList = eval('(' + res + ')').data.categoryList[0].children;
        filter.createFliter(filter.fliterList, eval('(' + res + ')').data.level);
      }
    })
    // if (getQueryString("pindex")) {
    // 焦点记忆功能暂时不做
    //   filter.isBack = true;
    //   connentBox.pindex = Number(getQueryString("pindex"));
    //   connentBox.itemNo = Number(getQueryString("contentItemNo"));
    //   connentBox.init();
    // }
  }
  // if (parameterObj.pindex) {
  //   toast(parameterObj.tempItemNo)
  //   toast(filter.tempItemNo)
  //   // 从详情页返回时需要重新发起请求，重新设置离开页面时的焦点
  //   getDate(parameterObj.pindex);
  //   filter.tempItemNo = (parameterObj.tempItemNo) * 1;
  //   filter.itemNo = parameterObj.itemNo * 1;
  //   filter.pos = 1;
  //   toggleClass(this.getCurr(), 'imgWrap_hover');
  // } else {
  //   getDate(0);
  // }

  if (playConfig.stbType == "p30") {
    getId("filter-connent").className = "middle-box middle-boxP30";
    toggleClass(getId("single-row-hover"), 'single-rowP30');
    toggleClass(getId("filter-center-0"), 'filter-0P30');
    toggleClass(getId("filter-center-1"), 'filter-1P30');
    toggleClass(getId("filter-center-2"), 'filter-2P30');
    toggleClass(getId("filter-header-0"), 'filter-headerP30');
    toggleClass(getId("filter-header-1"), 'filter-headerP30');
    toggleClass(getId("filter-header-2"), 'filter-headerP30');
  }
  if (playConfig.stbType == "3.0") {
    getId("filter-connent").className = "middle-box middle-box30";
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
  // if (this.pos == 1) { this.itemNo2 = 0 }
  filter.addClass();
  filter.slider();
}

filter.right = function (params) {
  if (document.getElementById('filter-header-0').style.display !== 'none') {
    if (filter.pos == 2) {
      if(filter.searchList.length == 0)return;
      filter.removeClass();
      this.pos = -1;
      connentBox.init();
    } else {
      filter.removeClass();
      this.pos++;
      filter.addClass();
    }
  } else {
    if(filter.searchList.length == 0)return;
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
    categoryId = filter.fliterList[filter.itemNo0].children[filter.itemNo1].children[0].categoryId;
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
    categoryId = obj[0].categoryId;
    filter.categoryId = categoryId;
    filter.filterData(filter.pindex, categoryId);
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
    // console.log('condition'+condition)
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
  // console.log('condition'+condition)
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
    img = "<img src=" + elementDom.assetImg + " alt='logo' />";
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
  if (filter.pos == -1) {
    toggleClass(connentBox.getCurr(), 'hover');
    connentBox.marquee('add');
  }
};

filter.filterData = function (pindex, categoryId, state) {
  //筛选接口所需数据，接口需要什么取什么
  //filter.fliterList[this.itemNo0]   第一项
  //filter.fliterList[this.itemNo0].children[this.itemNo1]   第二项
  //filter.fliterList[this.itemNo0].children[this.itemNo1].children[this.itemNo2]   第三项
  // content=1491378878692898072&areaId=1491379100827595987 //接口拼接字段,不确定对不对

  var url = 'p=yhScreenResultMulti&k=1&v=1&pindex=' + pindex * 8 + '&psize=8&sizeFlag=1&catCode=' + filter.itemNo + '&categoryId=' + categoryId;
  getFilterResult(url, function (response) {
    // console.log(categoryId+'===='+eval('(' + response + ')'))
    if (eval('(' + response + ')').code !== 200) {
    } else {
      if(eval('(' + response + ')').data.assetList.length == 0){
        try{
          if(document.getElementById('filter-header-0').style.display !== 'none'){
            commonParams.result = '0';
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
            commonParams.result = '0';
            var row_inner = document.getElementById('single-row-inner').style.top
            row_inner = parseInt(row_inner.substring(0, row_inner.length - 2))
            var rheight = ((180 - row_inner) / 62)
            if (isNaN(rheight)) {
              rheight = 0
            }
            commonParams.keyword = document.getElementById('single-row-inner').children[rheight].innerHTML;    
          };
          commonParams.cid = '';
          commonParams.cat_id = Cookies.get('parent_page_id');
          bi.filterKeyDo(commonParams)
        }catch(e){}
      }
      getId('filter-connent').innerHTML = '';
      filter.template(eval('(' + response + ')').data);
      connentBox.props(eval('(' + response + ')').data)
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
      // // 页面返回上报
      if(Cookies.get('parent_page_type')){
        Cookies.del('parent_page_type','/');
      };
      if(Cookies.get('parent_page_id')){
        Cookies.del('parent_page_id','/');
      }; 
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