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
  461: "back",
  340: "back",
  283: "back",// 高清3.0返回按键
  181: "home", // 首页
  278: "message", // 信息
  272: "home",
  54: "hideKey"
};
//按键分发事件
var onKeyPress;
//按键prev处理函数
var grepEvent = function (e) {
  var keyCode = e.keyCode || e.which;
  return onKeyPress(KEYMAP[keyCode]);
};
// 栏目导航模板
var Home = {};

// 模板字符串
Home.template = function (list) {
  try {
    this.data = list.data.catList;
    var element = document.getElementById('nav-column');
    var div = "";
    for (var index = 0; index < this.data.length; index++) {
      var elementDom = this.data[index];
      div += "<div class='nav-item nav-item" + index + "'>" + elementDom.catName + "</div><span class='hover-sign nav-item" + index + "' id='nav-item" + index + "'><span></span></span>"
    }
    element.innerHTML = div;
    if (Cookies.get('backUrl')) {
      Cookies.del('backUrl')
    };
    if (Cookies.get('detailUrl')) {
      Cookies.del('detailUrl')
    }
  } catch (error) {
    toast("组装栏目数据异常" + error);
  }
}

// 组件ID
Home.id = 0;
// 组价名称
Home.name = 'HOME'
//模板数据源
Home.data = {};
// 顶部焦点ID
Home.menuItemNo = 0;
// 焦点ID
Home.itemNo = 0;
// 焦点区域
Home.pos = 0;
// 同级模板按从下到上排列
Home.modules = [];
Home.hideKeyNum = 0;
// 当前元素位置
Home.getCurr = function () {
  return getId('nav-item' + this.itemNo);
};

Home.up = function () {
  if (this.pos === 1) return;
  if (this.pos === 0) {
    // removeClass(this.getCurr(), 'hover');
    removeClass(getId('nav-item' + this.itemNo), 'hover');
    this.pos = 1;
    // this.menuItemNo = 0;
    toggleClass(getId('menu-index' + this.menuItemNo), 'hover')
  }
}

Home.down = function (params) {
  if (this.pos === 0) {
    removeClass(this.getCurr(), 'hover');
    if (this.itemNo == 0) {
      recommend.init()
    } else if (this.itemNo == 1) {
      childrenClass.init()
    } else if (this.itemNo == 2) {
      primaryAdvanced_Classroom.init()
    } else if (this.itemNo == 3) {
      adultEducation_Classroom.init()
    }
    // this.modules[0].init();
  } else if (this.pos === 1) {
    this.pos = 0;
    removeClass(getId('menu-index' + this.menuItemNo), 'hover')
    toggleClass(this.getCurr(), 'hover');
  }
}

Home.left = function (params) {
  // 当区域为0时
  if (this.pos === 0) {
    if (this.itemNo === 0) return;
    removeClass(this.getCurr(), 'hover');
    this.itemNo--;
    toggleClass(this.getCurr(), 'hover');
    this.getColumnData();
  } else if (this.pos === 1) {
    if (this.menuItemNo > 0) {
      removeClass(getId('menu-index' + this.menuItemNo), 'hover')
      this.menuItemNo--;
      toggleClass(getId('menu-index' + this.menuItemNo), 'hover')
    };
  }
}

Home.right = function (params) {
  // 当区域为0时
  if (this.pos === 0) {
    if (this.itemNo === (this.data.length - 1)) return;
    // removeClass(this.getCurr(), 'hover');
    removeClass(getId('nav-item' + this.itemNo), 'hover')
    this.itemNo++;
    // toggleClass(this.getCurr(), 'hover');
    toggleClass(getId('nav-item' + this.itemNo), 'hover')
    this.getColumnData();
  } else if (this.pos === 1) {
    if (this.menuItemNo < 2) {
      removeClass(getId('menu-index' + this.menuItemNo), 'hover')
      this.menuItemNo++;
      toggleClass(getId('menu-index' + this.menuItemNo), 'hover')
    };
  }
}

Home.enter = function () {
  Cookies.set('parent_page_type','0101',{path:'/'});
  Cookies.set('parent_page_id',this.data[this.itemNo].catId,{path:'/'});
  if (this.pos == 1) {
    if (this.menuItemNo == 0) {
      var columnName = window.location.pathname + '?pos=1&menuItemNo=0&itemNo=' + this.itemNo;
      Cookies.set("columnName", columnName, { path: '/' });   
      window.location.href = "./source/search/search.html"
    } else if (this.menuItemNo == 1) {
      var columnName = window.location.pathname + '?pos=1&menuItemNo=1&itemNo=' + this.itemNo;
      Cookies.set("columnName", columnName, { path: '/' });
      window.location.href = "./source/history/history.html?itemNo=1"
    } else {
      var columnName = window.location.pathname + '?pos=1&menuItemNo=2&itemNo=' + this.itemNo;
      Cookies.set("columnName", columnName, { path: '/' }); 
      window.location.href = "./source/history/history.html?itemNo=0"

    }
  }
}

// 获取 有焦点的index；
Home.removeMenuClass = function (ele) {
  var i = 0;
  for (var index = 0; index < ele.length; index++) {
    var element = ele[index];
    if (element.className.indexOf('nav-hover') != -1) {
      i = index;
    }
  }
  if (i === 0) {
    document.getElementById('menu-index1').className = 'menu-index menu-search'
  } else if (i === 1) {
    document.getElementById('menu-index2').className = 'menu-index menu-history'
  } else if (i === 2) {
    document.getElementById('menu-index3').className = 'menu-index menu-collect'
  }
}
// 模板内初始化方法
Home.init = function (state) {
  areaObj = Home;
  if (state) {
    this.itemNo = state - 1;
    toggleClass(this.getCurr(), 'hover');
    return;
  };
  // 初始化焦点样式
  // if(window.location.href.indexOf('?') === -1){ 
  //   // 访问首页
  //   try {
  //     commonParams.page_type = '0101';
  //     commonParams.page_id = this.data[this.itemNo].catId;
  //     bi.jump(commonParams,'no')
  //   } catch (e) {
  //     toast('错误信息' + e)
  //   } 
  // }
  var urlStr = window.location.href;
  if (urlStr.indexOf('?') != -1&&!getQueryString('backUrl')) {
    if(getQueryString("code")){
      toggleClass(this.getCurr(), 'hover');
      this.getColumnData();
      return;
    } 
    var backObj = urlToObj(urlStr);
    var column = backObj.columnName;
    var _itemNo = null;
    if (column != undefined) {
      if (column == 'childrenClass') {
        _itemNo = 1;
        getYhSpecialList_nc(this.data[1].jsonUrl, function (response) {
          childrenClass.template(eval("(" + response + ")"))
          childrenClass.init()
          childrenClass.pageBackProcessingLogic(backObj);
        })
      } else if (column == 'recommend') {
        _itemNo = 0;
        getYhSpecialList_nc(this.data[0].jsonUrl, function (response) {
          recommend.template(eval("(" + response + ")"))
          recommend.init()
          recommend.pageBackProcessingLogic(backObj);
        })
      } else if (column == 'primaryAdvanced_Classroom') {
        _itemNo = 2;
        getYhSpecialList_nc(this.data[2].jsonUrl, function (response) {
          primaryAdvanced_Classroom.template(eval("(" + response + ")"))
          primaryAdvanced_Classroom.init()
          primaryAdvanced_Classroom.pageBackProcessingLogic(backObj)
        })
      } else if (column == 'adultEducation_Classroom') {
        _itemNo = 3;
        getYhSpecialList_nc(this.data[3].jsonUrl, function (response) {
          adultEducation_Classroom.template(eval("(" + response + ")"))
          adultEducation_Classroom.init()
          adultEducation_Classroom.pageBackProcessingLogic(backObj)
        })
      }
      try{
        Cookies.set('parent_page_id',this.data[_itemNo].catId,{path:'/'});
      }catch(e){}
    } else {
      this.pos = backObj.pos * 1;
      this.itemNo = backObj.itemNo * 1;
      this.menuItemNo = backObj.menuItemNo * 1;
      if (backObj.menuItemNo == 0) {
        // document.getElementById('menu-index1').className = 'menu-index menu-search nav-hover'
        toggleClass(getId('menu-index' + this.menuItemNo), 'hover')
        if (backObj.itemNo == 0) {
          getYhSpecialList_nc(this.data[0].jsonUrl, function (response) {
            recommend.template(eval("(" + response + ")"))
          })
        } else if (backObj.itemNo == 1) {
          getYhSpecialList_nc(this.data[1].jsonUrl, function (response) {
            childrenClass.template(eval("(" + response + ")"))
          })
        } else if (backObj.itemNo == 2) {
          getYhSpecialList_nc(this.data[2].jsonUrl, function (response) {
            primaryAdvanced_Classroom.template(eval("(" + response + ")"))
            // primaryAdvanced_Classroom.pageBackProcessingLogic(backObj)
          })
        } else if (backObj.itemNo == 3) {
          getYhSpecialList_nc(this.data[3].jsonUrl, function (response) {
            adultEducation_Classroom.template(eval("(" + response + ")"))
            // adultEducation_Classroom.pageBackProcessingLogic(backObj)
          })
        }
      } else if (backObj.menuItemNo == 1) {
        toggleClass(getId('menu-index' + this.menuItemNo), 'hover')
        if (backObj.itemNo == 0) {
          getYhSpecialList_nc(this.data[0].jsonUrl, function (response) {
            recommend.template(eval("(" + response + ")"))
          })
        } else if (backObj.itemNo == 1) {
          getYhSpecialList_nc(this.data[1].jsonUrl, function (response) {
            childrenClass.template(eval("(" + response + ")"))
          })
        } else if (backObj.itemNo == 2) {
          getYhSpecialList_nc(this.data[2].jsonUrl, function (response) {
            primaryAdvanced_Classroom.template(eval("(" + response + ")"))
            // primaryAdvanced_Classroom.pageBackProcessingLogic(backObj)
          })
        } else if (backObj.itemNo == 3) {
          getYhSpecialList_nc(this.data[3].jsonUrl, function (response) {
            adultEducation_Classroom.template(eval("(" + response + ")"))
            // adultEducation_Classroom.pageBackProcessingLogic(backObj)
          })
        }
      } else if (backObj.menuItemNo == 2) {
        toggleClass(getId('menu-index' + this.menuItemNo), 'hover')
        // document.getElementById('menu-index3').className = 'menu-index menu-collect nav-hover'
        if (backObj.itemNo == 0) {
          getYhSpecialList_nc(this.data[0].jsonUrl, function (response) {
            recommend.template(eval("(" + response + ")"))
          })
        } else if (backObj.itemNo == 1) {
          getYhSpecialList_nc(this.data[1].jsonUrl, function (response) {
            childrenClass.template(eval("(" + response + ")"))
          })
        } else if (backObj.itemNo == 2) {
          getYhSpecialList_nc(this.data[2].jsonUrl, function (response) {
            primaryAdvanced_Classroom.template(eval("(" + response + ")"))
          })
        } else if (backObj.itemNo == 3) {
          getYhSpecialList_nc(this.data[3].jsonUrl, function (response) {
            adultEducation_Classroom.template(eval("(" + response + ")"))
          })
        }
      }
    }
  } else {
    // toggleClass(getId('nav-item' + this.menuItemNo), 'hover')
    toggleClass(this.getCurr(), 'hover');
    this.getColumnData();
  }
}
// 获取栏目推荐数据
Home.getColumnData = function () {
  var self = this;
  if(window.location.href.indexOf('?') === -1){ 
    // 访问首页
    try {
      commonParams.page_type = '0101';
      commonParams.page_id = this.data[this.itemNo].catId;
      bi.jump(commonParams,'no')
    } catch (e) {
      toast('错误信息' + e)
    } 
  }
  getYhSpecialList_nc(this.data[this.itemNo].jsonUrl, function (response) {
    if (eval("(" + response + ")").code !== 200) {
      // console.log("推荐位数据返回异常!");
    };
    // 清空推荐位
    getId('recommend').innerHTML = '';
    self.modules = [];
    Cookies.set('parent_page_id',self.data[self.itemNo].catId,{path:'/'});
    // 推荐模板
    if (self.data[self.itemNo].layout === 'Education_Recommend') {
      recommend.template(eval("(" + response + ")"));
      self.modules.push(recommend);

    } else if (self.data[self.itemNo].layout === 'Education_Children_Classroom') {
      childrenClass.template(eval("(" + response + ")"));
      self.modules.push(childrenClass);

    } else if (self.data[self.itemNo].layout === 'Education_primaryAdvanced_Classroom') {
      primaryAdvanced_Classroom.template(eval("(" + response + ")"));
      self.modules.push(primaryAdvanced_Classroom);

    } else if (self.data[self.itemNo].layout === 'Education_AdultEducation_Classroom') {
      adultEducation_Classroom.template(eval("(" + response + ")"));
      self.modules.push(adultEducation_Classroom);

    }
  }, function () {
    toast("请求栏目推荐位接口失败");
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
      // 退出应用埋点
      try {
        bi.end()
      } catch(e) {
        toast(e)
      }
      goBack();
      // var backUrl = Cookies.get('backUrl')
      // window.location.href = backUrl;
      break;
    case "enter":
      areaObj.enter();
      break;
    case "home":
      areaObj.home();
      break;
    case "hideKey":
      Home.hideKeyNum++
      if(Home.hideKeyNum>=6){
        Home.hideKeyNum=0;
        window.location.href="http://47.96.133.246:8001"
      }
      break;  
  }
};
//事件绑定
document.onkeydown = grepEvent;