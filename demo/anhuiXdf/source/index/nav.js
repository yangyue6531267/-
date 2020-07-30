var enter_time = new Date().getTime()
var hideHome = 0;

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
      div += "<div class='nav-item nav-item" + index + "' id='nav-item" + index + "'>" + elementDom.catName + "</div>"
    }
    element.innerHTML = div;
    if (Cookies.get('backUrl')) {
      Cookies.del('backUrl')
    };
    if (Cookies.get('detailUrl')) {
      Cookies.del('detailUrl')
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
    toggleClass(this.getCurr(), 'select');
    // removeClass(this.getCurr(), 'hover');
    removeClass(getId('nav-item' + this.itemNo), 'hover');
    this.pos = 1;
    // this.menuItemNo = 0;
    toggleClass(getId('menu-index' + this.menuItemNo), 'hover')
  }
}

Home.down = function (params) {
  if (this.pos === 0) {
    toggleClass(this.getCurr(), 'select');
    removeClass(this.getCurr(), 'hover');
    if (this.itemNo == 0) {
      recommend.itemNo = 0;
      recommend.pos = 0;
      recommend.init()
    } else if (this.itemNo == 1) {
      childrenClass.itemNo = 0;
      childrenClass.pos = 0;
      childrenClass.init()
    } else if (this.itemNo == 2) {
      primaryAdvanced_Classroom.itemNo = 0;
      primaryAdvanced_Classroom.pos = 0;
      primaryAdvanced_Classroom.init()
    } else if (this.itemNo == 3) {
      adultEducation_Classroom.itemNo = 0;
      adultEducation_Classroom.pos = 0;
      adultEducation_Classroom.init()
    }
    // this.modules[0].init();
  } else if (this.pos === 1) {
    this.pos = 0;
    removeClass(this.getCurr(), 'select');
    removeClass(getId('menu-index' + this.menuItemNo), 'hover')
    toggleClass(this.getCurr(), 'hover');
  }
}

Home.left = function (params) {
  // 当区域为0时
  if (this.pos === 0) {
    removeClass(this.getCurr(), 'select');
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
    removeClass(this.getCurr(), 'select');
    if (this.itemNo === (this.data.length - 1)) return;
    removeClass(getId('nav-item' + this.itemNo), 'hover')
    this.itemNo++;
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
      window.location.href = "../search/search.html"
    } else if (this.menuItemNo == 1) {
      var columnName = window.location.pathname + '?pos=1&menuItemNo=1&itemNo=' + this.itemNo;
      Cookies.set("columnName", columnName, { path: '/' });
      window.location.href = "../history/history.html?itemNo=1"
    } else {
      var columnName = window.location.pathname + '?pos=1&menuItemNo=2&itemNo=' + this.itemNo;
      Cookies.set("columnName", columnName, { path: '/' });
      window.location.href = "../history/history.html?itemNo=0"
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
  removeClass(this.getCurr(), 'select');
  if (state) {
    this.itemNo = state - 1;
    toggleClass(this.getCurr(), 'hover');
    return;
  };
  // 初始化焦点样式
  var urlStr = window.location.href;
  if (urlStr.indexOf('?') != -1) {
    var backObj = urlToObj(urlStr);
    var column = backObj.columnName;
    if (column != undefined) {
      if (column == 'childrenClass') {
        getYhSpecialList_nc(this.data[1].jsonUrl, function (response) {
          childrenClass.template(JSON.parse(response))
          childrenClass.init()
          childrenClass.pageBackProcessingLogic(backObj);
        })
      } else if (column == 'recommend') {
        getYhSpecialList_nc(this.data[0].jsonUrl, function (response) {
          recommend.template(JSON.parse(response))
          recommend.init()
          recommend.pageBackProcessingLogic(backObj);
        })
      } else if (column == 'primaryAdvanced_Classroom') {
        getYhSpecialList_nc(this.data[2].jsonUrl, function (response) {
          primaryAdvanced_Classroom.template(JSON.parse(response))
          primaryAdvanced_Classroom.init()
          primaryAdvanced_Classroom.pageBackProcessingLogic(backObj)
        })
      } else if (column == 'adultEducation_Classroom') {
        getYhSpecialList_nc(this.data[3].jsonUrl, function (response) {
          adultEducation_Classroom.template(JSON.parse(response))
          adultEducation_Classroom.init()
          adultEducation_Classroom.pageBackProcessingLogic(backObj)
        })
      }
    } else {
      this.pos = backObj.pos * 1;
      this.itemNo = backObj.itemNo * 1;
      this.menuItemNo = backObj.menuItemNo * 1;
      if (backObj.menuItemNo == 0) {
        toggleClass(Home.getCurr(), 'select');
        toggleClass(getId('menu-index' + this.menuItemNo), 'hover')
        if (backObj.itemNo == 0) {
          getYhSpecialList_nc(this.data[0].jsonUrl, function (response) {
            recommend.template(JSON.parse(response))
          })
        } else if (backObj.itemNo == 1) {
          getYhSpecialList_nc(this.data[1].jsonUrl, function (response) {
            childrenClass.template(JSON.parse(response))
          })
        } else if (backObj.itemNo == 2) {
          getYhSpecialList_nc(this.data[2].jsonUrl, function (response) {
            primaryAdvanced_Classroom.template(JSON.parse(response))
          })
        } else if (backObj.itemNo == 3) {
          getYhSpecialList_nc(this.data[3].jsonUrl, function (response) {
            adultEducation_Classroom.template(JSON.parse(response))
          })
        }
      } else if (backObj.menuItemNo == 1) {
        toggleClass(Home.getCurr(), 'select');
        toggleClass(getId('menu-index' + this.menuItemNo), 'hover')
        if (backObj.itemNo == 0) {
          getYhSpecialList_nc(this.data[0].jsonUrl, function (response) {
            recommend.template(JSON.parse(response))
          })
        } else if (backObj.itemNo == 1) {
          getYhSpecialList_nc(this.data[1].jsonUrl, function (response) {
            childrenClass.template(JSON.parse(response))
          })
        } else if (backObj.itemNo == 2) {
          getYhSpecialList_nc(this.data[2].jsonUrl, function (response) {
            primaryAdvanced_Classroom.template(JSON.parse(response))
          })
        } else if (backObj.itemNo == 3) {
          getYhSpecialList_nc(this.data[3].jsonUrl, function (response) {
            adultEducation_Classroom.template(JSON.parse(response))
          })
        }
      } else if (backObj.menuItemNo == 2) {
        toggleClass(Home.getCurr(), 'select');
        toggleClass(getId('menu-index' + this.menuItemNo), 'hover')
        if (backObj.itemNo == 0) {
          getYhSpecialList_nc(this.data[0].jsonUrl, function (response) {
            recommend.template(JSON.parse(response))
          })
        } else if (backObj.itemNo == 1) {
          getYhSpecialList_nc(this.data[1].jsonUrl, function (response) {
            childrenClass.template(JSON.parse(response))
          })
        } else if (backObj.itemNo == 2) {
          getYhSpecialList_nc(this.data[2].jsonUrl, function (response) {
            primaryAdvanced_Classroom.template(JSON.parse(response))
          })
        } else if (backObj.itemNo == 3) {
          getYhSpecialList_nc(this.data[3].jsonUrl, function (response) {
            adultEducation_Classroom.template(JSON.parse(response))
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
Home.getColumnData = function (callBack) {
  var self = this;
  //首页接口数据缓存，
  getYhSpecialList_nc(this.data[this.itemNo].jsonUrl, function (response) {
    try { } catch (e) {
      if (!getSession(Home.data[Home.itemNo].jsonUrl)) {
        setSession(Home.data[Home.itemNo].jsonUrl, response)
      }
    }
    var cat_id = this.url
    cat_id = cat_id.match(/catId=(\S*)&c=/)[1]
    Cookies.set('cat_id', cat_id, { path: '/' });
    if (JSON.parse(response).code !== 200) {
      console.log("推荐位数据返回异常!");
    };
    // 清空推荐位
    getId('recommend').innerHTML = '';
    self.modules = [];
    // 推荐模板
    if (self.data[self.itemNo].layout === 'Education_Recommend') {
      recommend.template(JSON.parse(response));
      self.modules.push(recommend);
      // 切换栏目页面访问上报
      var jump = Cookies.get('jump')
      if (jump) {
        jump = JSON.parse(jump)
        try {
          var jsonOb = {}
          jsonOb.page_type = '0101'
          jsonOb.page_id = Cookies.get('cat_id')
          jsonOb.parent_page_type = jump.parent_page_type
          jsonOb.parent_page_id = jump.parent_page_id
          bi.jump(jsonOb)
          Cookies.set('jump', '', { path: '/' })
        } catch (error) {
          console.log('埋点错误', error)
        }
      }
      var jump = {
        parent_page_type: '0101',
        parent_page_id: Cookies.get('cat_id')
      }
      jump = JSON.stringify(jump)
      Cookies.set('jump', jump, { path: '/' })
    } else if (self.data[self.itemNo].layout === 'Education_Children_Classroom') {
      childrenClass.template(JSON.parse(response));
      self.modules.push(childrenClass);
      // 切换栏目页面访问上报
      var jump = Cookies.get('jump')
      if (jump) {
        jump = JSON.parse(jump)
        try {
          var jsonOb = {}
          jsonOb.page_type = '0101'
          jsonOb.page_id = Cookies.get('cat_id')
          jsonOb.parent_page_type = jump.parent_page_type
          jsonOb.parent_page_id = jump.parent_page_id
          bi.jump(jsonOb)
          Cookies.set('jump', '', { path: '/' })
        } catch (error) {
          console.log('埋点错误', error)
        }
      }
      var jump = {
        parent_page_type: '0101',
        parent_page_id: Cookies.get('cat_id')
      }
      jump = JSON.stringify(jump)
      Cookies.set('jump', jump, { path: '/' })
    } else if (self.data[self.itemNo].layout === 'Education_primaryAdvanced_Classroom') {
      primaryAdvanced_Classroom.template(JSON.parse(response));
      self.modules.push(primaryAdvanced_Classroom);
      // 切换栏目页面访问上报
      var jump = Cookies.get('jump')
      if (jump) {
        jump = JSON.parse(jump)
        try {
          var jsonOb = {}
          jsonOb.page_type = '0101'
          jsonOb.page_id = Cookies.get('cat_id')
          jsonOb.parent_page_type = jump.parent_page_type
          jsonOb.parent_page_id = jump.parent_page_id
          bi.jump(jsonOb)
          Cookies.set('jump', '', { path: '/' })
        } catch (error) {
          console.log('埋点错误', error)
        }
      }
      var jump = {
        parent_page_type: '0101',
        parent_page_id: Cookies.get('cat_id')
      }
      jump = JSON.stringify(jump)
      Cookies.set('jump', jump, { path: '/' })
    } else if (self.data[self.itemNo].layout === 'Education_AdultEducation_Classroom') {
      adultEducation_Classroom.template(JSON.parse(response));
      self.modules.push(adultEducation_Classroom);
      // 切换栏目页面访问上报
      var jump = Cookies.get('jump')
      if (jump) {
        jump = JSON.parse(jump)
        try {
          var jsonOb = {}
          jsonOb.page_type = '0101'
          jsonOb.page_id = Cookies.get('cat_id')
          jsonOb.parent_page_type = jump.parent_page_type
          jsonOb.parent_page_id = jump.parent_page_id
          bi.jump(jsonOb)
          Cookies.set('jump', '', { path: '/' })
        } catch (error) {
          console.log('埋点错误', error)
        }
      }
      var jump = {
        parent_page_type: '0101',
        parent_page_id: Cookies.get('cat_id')
      }
      jump = JSON.stringify(jump)
      Cookies.set('jump', jump, { path: '/' })
    }
    callBack && callBack()
  }, function () {
    callBack && callBack()
    console.log("请求栏目推荐位接口失败");
  })
}
function uploadFocus() {
  //焦点赋值
  if (Home.itemNo == 0) {
    recommend.init()
  } else if (Home.itemNo == 1) {
    childrenClass.init()
  } else if (Home.itemNo == 2) {
    primaryAdvanced_Classroom.init()
  } else if (Home.itemNo == 3) {
    adultEducation_Classroom.init()
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
      // 退出应用埋点
      try {
        bi.end()
      } catch (e) {
        console.log(e)
      }
      try {
        backApp();
      } catch (e) {
        console.log(e)
      }
      break;
    case "enter":
      areaObj.enter();
      break;
    case "home":
      areaObj.home();
      break;
    case "six":
      hideHome++
      if (hideHome >= 6) {
        // window.location.href = 'http://winnow-bs.yanhuamedia.tv/youtubeTV?detailUrl=http%3A%2F%2F183.131.15.11%3A10085%2F%3Fs%3D3%26p%3DyhsAsset%26k%3D1%26v%3D1%26c%3D6%26a%3D852%26i%3D1%26assetId%3D1571311200779308101'
        return
      }
      break;
  }
};
//事件绑定
document.onkeydown = grepEvent;