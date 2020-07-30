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
  272: "home"
};
//按键分发事件
// var onKeyPress;
// //按键prev处理函数
// var grepEvent = function (e) {
//   var keyCode = e.keyCode || e.which;
//   return onKeyPress(KEYMAP[keyCode]);
// };
//按键分发事件
var onKeyPress;
//按键prev处理函数
var grepEvent = function (e) {
  e.preventDefault();
  if (grepEvent.isPress) return;
  grepEvent.isPress = true;
  setTimeout(function () {
    grepEvent.isPress = false;
  }, 300);
  var keyCode = e.keyCode || e.which;
  return onKeyPress(KEYMAP[keyCode]);
};

function urlToObj(str) {
  try {
    var obj = {};
    var arr1 = str.split("?");
    var arr2 = arr1[1].split("&");
    for (var i = 0; i < arr2.length; i++) {
      var res = arr2[i].split("=");
      obj[res[0]] = res[1];
    }
    return obj;
  } catch (error) {
    // console.log(error)
  }
}

function getId(arg) {
  return document.getElementById(arg);
}

function goBack() {
  var backUrl = Cookies.get('XEStv_EPG_returnUrl');
  // 退出应用埋点
  try {
    bi.end()
  } catch (e) {
    console.log(e)
  }
  try {

    //临时使用
    window.location.replace('http://111.11.189.150:8080/CMCC2/page/education/education.jsp?categoryId=1145&areaid=1&areaindex=0&curPage=1')
  } catch (e) {
    console.log(e)
  }
}
// 栏目导航模板
var Home = {};

// 模板字符串
Home.template = function (list) {
  // 导航栏
  try {
    this.data = list.data.catList;
    var element = document.getElementById('nav-column');
    var div = "";
    for (var index = 0; index < this.data.length; index++) {
      // if (index !=1) {
      var elementDom = this.data[index];
      div += "<div class='nav-item nav-item" + index + "' id='nav-item" + index + "'>" + elementDom.catName + "</div>"
      // }
    }
    element.innerHTML = div;
    if (Cookies.get('backUrl')) {
      Cookies.del('backUrl')
    };
    if (Cookies.get('detailUrl')!=''||Cookies.get('detailUrl')) {
      // Cookies.del('detailUrl')
      Cookies.set('detailUrl', '', {
        path: '/'
      })
    }
  } catch (error) {
    console.log("组装栏目数据异常" + error);
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
// 当前元素位置
Home.getCurr = function () {
  return getId('nav-item' + this.itemNo);
};

Home.up = function () {
  if (this.pos === 1) return;
  if (this.pos === 0) {
    // removeClass(this.getCurr(), 'hover');
    removeClass(getId('nav-item' + this.itemNo), 'select');
    toggleClass(getId('nav-item' + this.itemNo), 'hover');
    this.pos = 1;
    // this.menuItemNo = 0;
    toggleClass(getId('menu-index' + this.menuItemNo), 'hover')
  }
}

Home.down = function (params) {
  if (this.pos === 0) {
    removeClass(getId('nav-item' + this.itemNo), 'select');
    toggleClass(getId('nav-item' + this.itemNo), 'hover');
    if (this.itemNo == 0) {
      recommend.init()
    }
    else if (this.itemNo == 1) {
      childrenClass.init()
    }
    else if (this.itemNo == 2) {
      primaryAdvanced_Classroom.init()
    } else if (this.itemNo == 3) {
      adultEducation_Classroom.init()
    }
    // this.modules[0].init();
  } else if (this.pos === 1) {
    this.pos = 0;
    removeClass(getId('menu-index' + this.menuItemNo), 'hover')
    removeClass(getId('nav-item' + this.itemNo), 'hover');
    toggleClass(getId('nav-item' + this.itemNo), 'select');
  }
}

Home.left = function (params) {
  // 当区域为0时
  if (this.pos === 0) {
    if (this.itemNo === 0) return;
    removeClass(this.getCurr(), 'select');
    this.itemNo--;
    toggleClass(this.getCurr(), 'select');
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
    removeClass(getId('nav-item' + this.itemNo), 'select')
    this.itemNo++;
    // toggleClass(this.getCurr(), 'hover');
    toggleClass(getId('nav-item' + this.itemNo), 'select')
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
  if (this.pos == 1) {
    // 页面访问储存
    var jump = {
      parent_page_type: '0101',
      parent_page_id: Cookies.get('cat_id')
    }
    jump = JSON.stringify(jump)
    Cookies.set('jump', jump, { path: '/' })
    if (this.menuItemNo == 0) {
      var columnName = window.location.pathname + '?pos=1&menuItemNo=0&itemNo=' + this.itemNo;
      Cookies.set("columnName", columnName, { path: '/' });
      window.location.href = "./source/search/search.html"
    } else if (this.menuItemNo == 1) {
      var columnName = window.location.pathname + '?pos=1&menuItemNo=1&itemNo=' + this.itemNo;
      Cookies.set("columnName", columnName, { path: '/' });
      window.location.href = "./source/history/history.html?itemNo=1"
    } else if (this.menuItemNo == 2) {
      var columnName = window.location.pathname + '?pos=1&menuItemNo=2&itemNo=' + this.itemNo;
      Cookies.set("columnName", columnName, { path: '/' });
      window.location.href = "./source/history/history.html?itemNo=0"
    } else if (this.menuItemNo == 3) {
      var columnName = window.location.pathname + '?pos=1&menuItemNo=2&itemNo=' + this.itemNo;
      Cookies.set("columnName", columnName, { path: '/' });
      window.location.href = "./source/noPayfor/noPayfor.html"
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
  }
  // else if (i === 2) {
  //   document.getElementById('menu-index3').className = 'menu-index menu-collect'
  // }
}
// 模板内初始化方法
Home.init = function (state) {
  areaObj = Home;
  if (state) {
    this.itemNo = state - 1;
    toggleClass(this.getCurr(), 'select');
    removeClass(this.getCurr(), 'hover');
    return;
  };

  // 初始化焦点样式
  var urlStr = window.location.href;
  var backObj = urlToObj(urlStr);
  if (urlStr.indexOf('?') != -1 && backObj.pos) {
    var column = backObj.columnName;
    if (column != undefined) {
      if (column == 'childrenClass') {
        getYhSpecialList_nc(this.data[1].jsonUrl, function (response) {
          childrenClass.template(response)
          childrenClass.init()
          childrenClass.pageBackProcessingLogic(backObj);
        })
      } else if (column == 'recommend') {
        getYhSpecialList_nc(this.data[0].jsonUrl, function (response) {
          recommend.template(response)
          recommend.init()
          recommend.pageBackProcessingLogic(backObj);
        })
      } else if (column == 'primaryAdvanced_Classroom') {
        getYhSpecialList_nc(this.data[2].jsonUrl, function (response) {
          primaryAdvanced_Classroom.template(response)
          primaryAdvanced_Classroom.init()
          primaryAdvanced_Classroom.pageBackProcessingLogic(backObj)
        })
      } else if (column == 'adultEducation_Classroom') {
        getYhSpecialList_nc(this.data[3].jsonUrl, function (response) {
          adultEducation_Classroom.template(response)
          adultEducation_Classroom.init()
          adultEducation_Classroom.pageBackProcessingLogic(backObj)
        })
      }
    } else {
      this.pos = backObj.pos * 1;
      this.itemNo = backObj.itemNo * 1;
      this.menuItemNo = backObj.menuItemNo * 1;
      toggleClass(getId('menu-index' + this.menuItemNo), 'hover')
      toggleClass(getId('nav-item' + Home.itemNo), 'hover');
      getYhSpecialList_nc(this.data[this.itemNo].jsonUrl, function (response) {
        recommend.template(response)
      })
      // if (backObj.menuItemNo == 0) {
      //   // document.getElementById('menu-index1').className = 'menu-index menu-search nav-hover'
      //   toggleClass(getId('menu-index' + this.menuItemNo), 'hover')
      //   if (backObj.itemNo == 0) {
      //     getYhSpecialList_nc(this.data[0].jsonUrl, function (response) {
      //       recommend.template(response)
      //     })
      //   } else if (backObj.itemNo == 1) {
      //     getYhSpecialList_nc(this.data[1].jsonUrl, function (response) {
      //       childrenClass.template(response)
      //     })
      //   } else if (backObj.itemNo == 2) {
      //     getYhSpecialList_nc(this.data[2].jsonUrl, function (response) {
      //       primaryAdvanced_Classroom.template(response)
      //       // primaryAdvanced_Classroom.pageBackProcessingLogic(backObj)
      //     })
      //   } else if (backObj.itemNo == 3) {
      //     getYhSpecialList_nc(this.data[3].jsonUrl, function (response) {
      //       adultEducation_Classroom.template(response)
      //       // adultEducation_Classroom.pageBackProcessingLogic(backObj)
      //     })
      //   }
      // } else if (backObj.menuItemNo == 1) {
      //   toggleClass(getId('menu-index' + this.menuItemNo), 'hover')
      //   if (backObj.itemNo == 0) {
      //     getYhSpecialList_nc(this.data[0].jsonUrl, function (response) {
      //       recommend.template(response)
      //     })
      //   } else if (backObj.itemNo == 1) {
      //     getYhSpecialList_nc(this.data[1].jsonUrl, function (response) {
      //       childrenClass.template(response)
      //     })
      //   } else if (backObj.itemNo == 2) {
      //     getYhSpecialList_nc(this.data[2].jsonUrl, function (response) {
      //       primaryAdvanced_Classroom.template(response)
      //       // primaryAdvanced_Classroom.pageBackProcessingLogic(backObj)
      //     })
      //   } else if (backObj.itemNo == 3) {
      //     getYhSpecialList_nc(this.data[3].jsonUrl, function (response) {
      //       adultEducation_Classroom.template(response)
      //       // adultEducation_Classroom.pageBackProcessingLogic(backObj)
      //     })
      //   }
      // } else if (backObj.menuItemNo == 2) {
      //   toggleClass(getId('menu-index' + this.menuItemNo), 'hover')
      //   // document.getElementById('menu-index3').className = 'menu-index menu-collect nav-hover'
      //   if (backObj.itemNo == 0) {
      //     getYhSpecialList_nc(this.data[0].jsonUrl, function (response) {
      //       recommend.template(response)
      //     })
      //   } else if (backObj.itemNo == 1) {
      //     getYhSpecialList_nc(this.data[1].jsonUrl, function (response) {
      //       childrenClass.template(response)
      //     })
      //   } else if (backObj.itemNo == 2) {
      //     getYhSpecialList_nc(this.data[2].jsonUrl, function (response) {
      //       primaryAdvanced_Classroom.template(response)
      //     })
      //   } else if (backObj.itemNo == 3) {
      //     getYhSpecialList_nc(this.data[3].jsonUrl, function (response) {
      //       adultEducation_Classroom.template(response)
      //     })
      //   }
      // }
    }
  } else {
    // toggleClass(getId('nav-item' + this.menuItemNo), 'hover')
    toggleClass(this.getCurr(), 'select');
    this.getColumnData();
  }
}
// 获取栏目推荐数据
Home.getColumnData = function () {
  var self = this;
  getYhSpecialList_nc(this.data[this.itemNo].jsonUrl, function (response) {
    var cat_id = this.url
    cat_id = cat_id.match(/catId=(\S*)&c=/)[1]
    Cookies.set('cat_id', cat_id, { path: '/' });
    if (response.code !== 200) {
      console.log("推荐位数据返回异常!");
    };
    // 清空推荐位
    getId('recommend').innerHTML = '';
    self.modules = [];
    // 推荐模板
    if (self.data[self.itemNo].layout === 'Education_Recommend') {
      recommend.template(response);
      self.modules.push(recommend);
    }
    else if (self.data[self.itemNo].layout === 'Education_Children_Classroom') {
      childrenClass.template(response);
      self.modules.push(childrenClass);
    }
    //屏蔽
    else if (self.data[self.itemNo].layout === 'Education_primaryAdvanced_Classroom') {
      primaryAdvanced_Classroom.template(response);
      self.modules.push(primaryAdvanced_Classroom);
    } else if (self.data[self.itemNo].layout === 'Education_AdultEducation_Classroom') {
      adultEducation_Classroom.template(response);
      self.modules.push(adultEducation_Classroom);
    }
  }, function () {
    console.log("请求栏目推荐位接口失败");
  })
}
function acceptBack() {
  backXDF();
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
      acceptBack()
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