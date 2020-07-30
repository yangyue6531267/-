var enter_time = new Date().getTime()
var cuurVersion = 0;
var upVersion = 0;
var deviceInfo = {};
var downloadApkUrl = '';
var apkFileSavePath = '' //apk下载包储存路径；
var fileMd5 = '';
// 获取获取设备信息
// getDeviceInfo('deviceInfoCallBack')
// // getIPV6Address('getIPV6AddressBack')
// function getIPV6AddressBack (res){
//   console.log('ipv6'+JSON.stringify(res))
// }
// // 获取获取设备信息回调
// function deviceInfoCallBack(res){
//   console.log('获取获取设备信息回调------'+JSON.stringify(res))
//   deviceInfo = res;
//   cuurVersion = deviceInfo.softVCode*1;
//   var collectionUpdatUrl = upgradeCollectionUrl+deviceInfo.eth0_mac+'&s=6&v=1'
//   getHttp(collectionUpdatUrl,'collectionUpdatBack');
//   yh.device_id = deviceInfo.eth0_mac;
//   var aaaBody = {
//     action:"2",
//     deviceMac:deviceInfo.eth0_mac,
//     platformCode:"39",
//     version:"1"
//   }
//   var aaaHerder = '{"Content-Type":' + '"application/json"'+ '}';
//   postHttp(aaaUrl,aaaHerder,JSON.stringify(aaaBody),'aaaAuth');
// }
// function aaaAuth(res){
//   console.log('黑白名单请求回调'+JSON.stringify(res))
//   if(res.data.specialType){
//     isAllow = res.data.specialType;
//     console.log('获取黑白名单信息====='+isAllow)
//     Cookies.set('isAllow',isAllow,{path:'/'})
//   }
// }
// function collectionUpdatBack(res) {  
//   console.log('升级采集信息==='+JSON.stringify(res))
// }


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
    // removeClass(this.getCurr(), 'hover');
    removeClass(getId('nav-item' + this.itemNo), 'navHover');
    this.pos = 1;
    // this.menuItemNo = 0;
    toggleClass(getId('menu-index' + this.menuItemNo), 'hover')
  }
}

Home.down = function (params) {
  if (this.pos === 0) {
    removeClass(this.getCurr(), 'navHover');
    addClass(this.getCurr(), 'hover')
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
    toggleClass(this.getCurr(), 'navHover');
  }
}

Home.left = function (params) {
  // 当区域为0时
  if (this.pos === 0) {
    if (this.itemNo === 0) return;
    removeClass(this.getCurr(), 'navHover');
    this.itemNo--;
    toggleClass(this.getCurr(), 'navHover');
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
    // removeClass(getId('nav-item' + this.itemNo), 'hover')
    // this.itemNo++;
    // toggleClass(getId('nav-item' + this.itemNo), 'hover')
    removeClass(getId('nav-item' + this.itemNo), 'navHover')
    this.itemNo++;
    toggleClass(getId('nav-item' + this.itemNo), 'navHover')
    this.getColumnData();
  } else if (this.pos === 1) {
    if (this.menuItemNo < 3) {
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
    Cookies.set('jump', jump, {path: '/'})
    if (this.menuItemNo == 0) {
      var columnName = window.location.pathname + '?pos=1&menuItemNo=0&itemNo=' + this.itemNo;
      Cookies.set("columnName", columnName, { path: '/' });
      window.location.href = "./source/search/search.html"
    } else if (this.menuItemNo == 1) {
      var columnName = window.location.pathname + '?pos=1&menuItemNo=1&itemNo=' + this.itemNo;
      Cookies.set("columnName", columnName, { path: '/' });
      window.location.href = "./source/history/history.html?itemNo=1"
    } else if (this.menuItemNo == 2){
      var columnName = window.location.pathname + '?pos=1&menuItemNo=2&itemNo=' + this.itemNo;
      Cookies.set("columnName", columnName, { path: '/' });
      window.location.href = "./source/history/history.html?itemNo=0"
    } else if (this.menuItemNo == 3){
      // var columnName = window.location.pathname + '?pos=1&menuItemNo=3&itemNo=' + this.itemNo;
      // Cookies.set("columnName", columnName, { path: '/' });
      if(playConfig.isOrder == '0' || Cookies.get('isOrder') == '0')return;
      var isAllow = Cookies.get('isAllow')*1
      console.log('订购按钮获取黑白名单信息====='+isAllow)
      if(isAllow == 1)return; // 黑名单不许订购
      try{
        var jsonOb = {
          page_id:'0101',
          page_type:'0101',
        }
        bi.orderClick(jsonOb); // 点击订购按钮
        Cookies.set('isOrderBtn','1',{'path':'/'}) // 点击订购按钮Cookies记录
      }catch(error){
        console.log(error)
      }
      var vod_id = Cookies.get('homeVodId')?Cookies.get('homeVodId'):'YANHUA00000050PITEM0090006996729';
      orderHandle(vod_id);
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
  console.log('浏览器信息===='+navigator.userAgent)
  if(!state){
    var tempHref = window.location.href;
    if(tempHref.indexOf('?') == -1){
          // 检测有没有升级
      var url = 'http://112.17.251.186:8081/auth/aua?s=6&v=1&operator=&firm=&modelCode=&appDeviceId='+deviceInfo.eth0_mac+'&appPackage=yanhua.tv.xdf.henanyd_HNYD&appVer='+deviceInfo.softVCode;
      getHttp(url,'getUpdateChec');
      try{
        window.getUpdateChec = function (res){
          console.log('升级==='+JSON.stringify(res))
          if(res.code == 200)upVersion = res.data[0].appVer*1;
          console.log('现在的版本=='+cuurVersion)
          console.log('新的版本=='+upVersion)
          if(cuurVersion<upVersion){
            // 有高版本
            downloadApkUrl = res.data[0].fileUrl;
            fileMd5 = res.data[0].fileMd5;
            areaObj = updataObj;
            updataObj.init();
          }else{
            areaObj = Home;
          }
        }
      }catch(error){
        areaObj = Home;
      }
    }else{
      areaObj = Home;
    }
  }
  if(navigator.userAgent.indexOf('Windows') != -1){
    // 本地浏览器端访问 仅限window系统的浏览器登录
    areaObj = Home; // 本地访问需打开
  }
  if (state) {
    areaObj = Home
    this.itemNo = state - 1;
    toggleClass(this.getCurr(), 'navHover');
    removeClass(this.getCurr(), 'hover');
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
          childrenClass.template(response)
          childrenClass.init()
          childrenClass.pageBackProcessingLogic(backObj);
          addClass(getId('nav-item1'),'hover')
        })
      } else if (column == 'recommend') {
        getYhSpecialList_nc(this.data[0].jsonUrl, function (response) {
          recommend.template(response)
          recommend.init()
          recommend.pageBackProcessingLogic(backObj);
          addClass(getId('nav-item0'),'hover')
        })
      } else if (column == 'primaryAdvanced_Classroom') {
        getYhSpecialList_nc(this.data[2].jsonUrl, function (response) {
          primaryAdvanced_Classroom.template(response)
          primaryAdvanced_Classroom.init()
          primaryAdvanced_Classroom.pageBackProcessingLogic(backObj)
          addClass(getId('nav-item2'),'hover')
        })
      } else if (column == 'adultEducation_Classroom') {
        getYhSpecialList_nc(this.data[3].jsonUrl, function (response) {
          adultEducation_Classroom.template(response)
          adultEducation_Classroom.init()
          adultEducation_Classroom.pageBackProcessingLogic(backObj)
          addClass(getId('nav-item3'),'hover')
        })
      }
    } else {
      this.pos = backObj.pos * 1;
      this.itemNo = backObj.itemNo * 1;
      this.menuItemNo = backObj.menuItemNo * 1;
      if (backObj.menuItemNo == 0) {
        // document.getElementById('menu-index1').className = 'menu-index menu-search nav-hover'
        toggleClass(getId('menu-index' + this.menuItemNo), 'hover')
        if (backObj.itemNo == 0) {
          getYhSpecialList_nc(this.data[0].jsonUrl, function (response) {
            recommend.template(response)
          })
        } else if (backObj.itemNo == 1) {
          getYhSpecialList_nc(this.data[1].jsonUrl, function (response) {
            childrenClass.template(response)
          })
        } else if (backObj.itemNo == 2) {
          getYhSpecialList_nc(this.data[2].jsonUrl, function (response) {
            primaryAdvanced_Classroom.template(response)
            // primaryAdvanced_Classroom.pageBackProcessingLogic(backObj)
          })
        } else if (backObj.itemNo == 3) {
          getYhSpecialList_nc(this.data[3].jsonUrl, function (response) {
            adultEducation_Classroom.template(response)
            // adultEducation_Classroom.pageBackProcessingLogic(backObj)
          })
        }
      } else if (backObj.menuItemNo == 1) {
        toggleClass(getId('menu-index' + this.menuItemNo), 'hover')
        if (backObj.itemNo == 0) {
          getYhSpecialList_nc(this.data[0].jsonUrl, function (response) {
            recommend.template(response)
          })
        } else if (backObj.itemNo == 1) {
          getYhSpecialList_nc(this.data[1].jsonUrl, function (response) {
            childrenClass.template(response)
          })
        } else if (backObj.itemNo == 2) {
          getYhSpecialList_nc(this.data[2].jsonUrl, function (response) {
            primaryAdvanced_Classroom.template(response)
            // primaryAdvanced_Classroom.pageBackProcessingLogic(backObj)
          })
        } else if (backObj.itemNo == 3) {
          getYhSpecialList_nc(this.data[3].jsonUrl, function (response) {
            adultEducation_Classroom.template(response)
            // adultEducation_Classroom.pageBackProcessingLogic(backObj)
          })
        }
      } else if (backObj.menuItemNo == 2) {
        toggleClass(getId('menu-index' + this.menuItemNo), 'hover')
        // document.getElementById('menu-index3').className = 'menu-index menu-collect nav-hover'
        if (backObj.itemNo == 0) {
          getYhSpecialList_nc(this.data[0].jsonUrl, function (response) {
            recommend.template(response)
          })
        } else if (backObj.itemNo == 1) {
          getYhSpecialList_nc(this.data[1].jsonUrl, function (response) {
            childrenClass.template(response)
          })
        } else if (backObj.itemNo == 2) {
          getYhSpecialList_nc(this.data[2].jsonUrl, function (response) {
            primaryAdvanced_Classroom.template(response)
          })
        } else if (backObj.itemNo == 3) {
          getYhSpecialList_nc(this.data[3].jsonUrl, function (response) {
            adultEducation_Classroom.template(response)
          })
        }
      }
    }
    console.log('详情页返回判断是否订购='+Cookies.get('isOrder'))
    if(Cookies.get('isOrder') && Cookies.get('isOrder') == 0){
      getId('menu-index3').innerHTML = '已订购 <span></span>';
    }
  } else {
    // toggleClass(getId('nav-item' + this.menuItemNo), 'hover')
    toggleClass(this.getCurr(), 'navHover');
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
    // 清空推荐位
    getId('recommend').innerHTML = '';
    self.modules = [];
    // 推荐模板
     // 首页鉴权
      console.log('首页鉴权1')
     getDetail(response.data.specialList[0].elementList[1].jsonUrl,function(res){
      console.log('首页鉴权2')
      var vod_id = res.data.itemList[0].vodList[0].playUrl;
      Cookies.set('homeVodId',vod_id,{path:'/'})
    })
    if (self.data[self.itemNo].layout === 'Education_Recommend') {
      recommend.template(response);
      self.modules.push(recommend);

    } else if (self.data[self.itemNo].layout === 'Education_Children_Classroom') {
      childrenClass.template(response);
      self.modules.push(childrenClass);

    } else if (self.data[self.itemNo].layout === 'Education_primaryAdvanced_Classroom') {
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

var updataObj = {
  itemNo:0,
  init:function () {  
    document.querySelectorAll('.updataInner span')[this.itemNo].className = 'spanHover';
    document.querySelector('.updataBox').style.display = 'block'
  },
  left:function () {  
    if(this.itemNo == 0)return;
    document.querySelectorAll('.updataInner span')[this.itemNo].className = '';
    this.itemNo--;
    document.querySelectorAll('.updataInner span')[this.itemNo].className = 'spanHover';
  },
  right:function () {  
    if(this.itemNo == 1)return;
    document.querySelectorAll('.updataInner span')[this.itemNo].className = '';
    this.itemNo++;
    document.querySelectorAll('.updataInner span')[this.itemNo].className = 'spanHover';
  },
  down:function () {  },
  up:function () {  },
  back:function () { 
    areaObj = Home;
    document.querySelector('.updataBox').style.display = 'none';
   },
  enter:function () { 
    if(this.itemNo == 0){
      downloadApkFun();
      document.querySelector('.text_two').style.display = 'none';
      document.querySelector('#span_two').style.display = 'none';
      document.querySelector('#span_one').style.display = 'none';
      document.querySelector('.updataStart').style.display = 'block';
    }else{
      areaObj = Home;
      document.querySelector('.updataBox').style.display = 'none';
    }
   }
}
function downloadApkFun(){
  // 下载
  downloadApk(downloadApkUrl,'downloadApkBack',fileMd5)
}
function downloadApkBack(res) {  
  this.console.log('下载apk回调=='+JSON.stringify(res))
  if(res.downloadProgress == 100){
    apkFileSavePath = res.fileSavePath;
    installApk(apkFileSavePath,'installApkBack');
    document.querySelector('.text_two').style.display = 'block';
    document.querySelector('#span_two').style.display = 'inline-block';
    document.querySelector('#span_one').style.display = 'inline-block';
    document.querySelector('.updataStart').style.display = 'none';
  }
}
function installApkBack(res) {  
  console.log('安装Apk回调'+JSON.stringify(res))
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
      if(areaObj.back){
        areaObj.back();
        return;
      }
      try {
        bi.end()
      } catch (e) {
        console.log(e)
      }
      try {
        prompt("yanhua://epg/exit")
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
  }
};
//事件绑定
document.onkeydown = grepEvent;