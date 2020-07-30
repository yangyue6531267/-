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
  272: "home",
  519: "menu",
  54: "six", // 测试入口
};
//按键分发事件
var onKeyPress;
//按键prev处理函数
var grepEvent = function (e) {
  e.preventDefault();
  if (grepEvent.isPress) return;
  grepEvent.isPress = true;
  setTimeout(function () {
    grepEvent.isPress = false;
  }, 100);
  var keyCode = e.keyCode || e.which;
  return onKeyPress(KEYMAP[keyCode]);
};
/** 
 * 播放所需
 * 
 * **/
var playConfig = {
  isRelease: true,//// playConfig.isRelease   默认false 开发环境  true线上环境(内网)
  isOrder: '0',//1 鉴权通过  0 未订购
  isforbid: '0',//1 黑名单  0 默认
}



var yh = {}

var info = getStorage('XDF-accountInfo') && JSON.parse(getStorage('XDF-accountInfo'));
var device = getStorage('XDF-deviceInfo') && JSON.parse(getStorage('XDF-deviceInfo'));
try {
  yh.siteId = '45' // 站点ID

  yh.userId = info.userName || "123456"; // 用户ID
  // yh.userId = 123456; // 用户ID

  yh.sys_v = 'anhui' // 系统版本

  yh.soft_v = '1.0.0' // 用户软件版本

  yh.device_id = device.stbId || "123456"; // 设备号获取不到取userId

  yh.operator_id = '' // 运营商ID（广电：1 电信：2 移动：3 联通：4）

  yh.terrace_id = '' // 平台ID(中兴：1 华为：2 烽火：3)

  yh.brand = '' // 机顶盒品牌

  yh.mode = device.model // 机顶盒型号

  yh.incremental = device.incremental // 机顶盒型号(更详细的)

  yh.model = '' // 用户设备版本

  yh.apk_version = device.softVCode // apk版本

  yh.reserve_group = '' // 采集方式

  yh.token = info.userToken // 用户令牌

  yh.stbId = device.stbId // 

  yh.ip = '00:00:00' // IP地址

  yh.bizDomain = '' // 用户厂商orBMS站点

  yh.userGroup = info.userGroup || 'g29097100000' // 用户分组

  yh.productIds = '' // 用户已订购产品ID（多个以逗号隔开）

  yh.areaCode = info.cityCode // 用户区域

  yh.userName = '' // 用户名称

  yh.telephone = info.mobileNo // 联系电话

  yh.mobileNo = info.mobileNo //主账号/宽带账号

  yh.epgDomain = '' // epg域

  yh.stbType = '' // 单播/组播字段

  yh.aaaDomain = '' // aaa域

  yh.ucenterDomain = '' // 用户中心域

  yh.logDomain = '' // 日志域

  yh.updateServer = '' // 更新服务器

  yh.spCode = '' // 内容提供商

  yh.apk_version_name = '' // app版本名称

  yh.cdn = '' // cdn类型

  yh.playStatus = 1;//播放状态0，播放，1播放器销毁

  yh.mac = device.eth0_mac // 设备mac地址

  yh.cpId = '20190813182622';

  yh.appId = '0000000120190813182600';

  yh.cspid = '120000000027';//cspid=lspid=cmsid

  yh.apkName = 'yanhua.tv.xdf.anhuiyd_AHYD';

  yh.className = 'com.yanhua.tv.yhweb.Dispatcher';

  yh.productId = 'BP8175';//计费点编号，即应用CP产品编号，和中兴业务管理平台产品编码一致，产品一一对应

  yh.accessKey = 'AHYD';//牌照方

  yh.cpName = '新东方';

  yh.downloadAddress = 'http://112.17.251.186:8080/originapk/ahyd/xdf_ahyd.apk';

  if (info.cpCode == '001') {
    yh.userLicensor = 'NewTV';//001：未来电视,002：百视通, 003：央广银河
  } else if (info.cpCode == '002') {
    yh.userLicensor = 'BesTV';//001：未来电视,002：百视通, 003：央广银河
  } else {//只有两个牌照方
    yh.userLicensor = 'icntv';
  }
  yh.cityCode = info.cityCode.substring(0, 3); // 用户区域
} catch (error) {
  console.log(error);
}

//token失效通知，调用accountInfo,更新token;
window.uploadToken = function (res) {
  //0--获取失败或更新失败    1--登陆成功    2-----获取到token   3-----token已更新
  console.log('uploadToken------' + this.JSON.stringify(res))
  if (res == 2 || res == 3) {
    submitPrompt('accountInfo', { return: 'getAccountInfo' });
  }
}
function getAccountInfo(res) {
  console.log('accountInfo---------------------' + JSON.stringify(res))
  accountInfo = res;
  yh.token = res.userToken
  setStorage('XDF-accountInfo', JSON.stringify(accountInfo));
}

// 判断类型的方法
function judgeObj(obj) {
  return Object.prototype.toString.call(obj).slice(8, -1)
};

// 提交prompt的方法
function submitPrompt(key, params) {
  var p = 'yanhua://epg/';
  p += key;
  if (params && judgeObj(params) == 'Object') {
    p = p + '?';
    for (var i in params) {
      p += i + '=' + params[i] + '&'
    }
    p = p.slice(0, p.length - 1);
  }
  var a = prompt(p);
};

function backApp() {
  submitPrompt('exit');
}

function uploadStr(obj) {
  var str = '';
  for (var key in obj) {

    if (str) {
      str = str + ',' + obj[key]
    } else {
      str += obj[key]
    }
  }
  return str
}

function lazyLoadImage() {
  //获取全部带有data-img的img
  var limg = document.querySelectorAll("img[data-img]")
  var timer;
  // Array.prototype.forEach.call()是一种快速的方法访问forEach，并将空数组的this换成想要遍历的list
  timer && clearTimeout(timer);
  timer = setTimeout(function () {
    Array.prototype.forEach.call(limg, function (item, index) {
      var rect
      //假如data-img为空跳出
      if (item.getAttribute("data-img") === "")
        return
      //getBoundingClientRect用于获取某个元素相对于视窗的位置集合。集合中有top, right, bottom, left等属性。
      rect = item.getBoundingClientRect()
      // 图片一进入可视区，动态加载
      if (rect.bottom >= 0) {
        (function () {
          //给图片添加过渡效果，让图片显示
          var img = new Image()
          img.src = item.getAttribute("data-img")
          item.src = img.src
          item.removeAttribute('data-img')
        })()
      }
    })
  }, 100)
}


// 获取url后面的参数
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

function generateTimeReqestNumber(date) {
  // yyyymmddhhmmss
  return date.getFullYear().toString() + pad2(date.getMonth() + 1) + pad2(date.getDate()) + pad2(date.getHours()) + pad2(date.getMinutes()) + pad2(date.getSeconds());
}

function pad2(n) { return n < 10 ? '0' + n : n }

// 日期操作 
Date.prototype.format = function (fmt) {
  var o = {
    'M+': this.getMonth() + 1, // 月份
    'd+': this.getDate(), // 日
    'h+': this.getHours(), // 小时
    'm+': this.getMinutes(), // 分
    's+': this.getSeconds(), // 秒
    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
    S: this.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      )
    }
  }
  return fmt
}

// 获取原生dom
function getId(arg) {
  return document.getElementById(arg);
}
// 获取class对应的元素dom
function getClass(arg) {
  // console.log(arg);
  return document.querySelector(arg);
}

// 方法1
function addClass(ele, cls) {
  if (ele.classList) {
    ele.classList.add(cls);
  } else {
    if (!this.hasClass(ele, cls)) ele.className += " " + cls;
  }

}
function arrIndexOf(arr, v) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] == v) {
      return i;
    }
  }
  return -1;
}
//删除指定dom元素的样式
function removeClass(ele, cls) {
  if (ele.classList) {
    ele.classList.remove(cls);
  } else {
    if (ele.className != '') {
      var arrClassName = ele.className.split(' ');
      var classIndex = arrIndexOf(arrClassName, cls);
      if (classIndex !== -1) {
        arrClassName.splice(classIndex, 1);
        ele.className = arrClassName.join(' ');
      }
    }
  }
}
//如果存在(不存在)，就删除(添加)一个样式
function toggleClass(ele, cls) {
  if (hasClass(ele, cls)) {
    removeClass(ele, cls);
  } else {
    addClass(ele, cls);
  }
}
function hasClass(tagStr, classStr) {
  if (tagStr.classList) {
    return tagStr.classList.contains(classStr);
  } else {
    var arr = tagStr.className.split(/\s+/); //这个正则表达式是因为class可以有多个,判断是否包含
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] == classStr) {
        return true;
      }
    }
    return false
  }
}

//toast
function toast(msg) {
  var div = document.createElement('div');
  var div1 = document.createElement('div');
  var body = document.body;
  if (getId('toast')) {
    body.removeChild(getId('toast'));
  }
  div.id = "toast";
  div.style.cssText = "position: absolute; top: 50%; left: 50%;  -webkit-transform: translate(-50%,-50%);-ms-transform: translate(-50%,-50%);transform:translate(-50%,-50%); text-align:center;z-index:999;word-break: break-all; word-wrap: break-word;";
  div1.style.cssText = "display:inline-block;background:rgba(1,1,1,0.6); color:#fff; padding:20px; min-width:120px; text-align:center; font-size:22px; border-radius:5px;height100%;width: 100%;word-wrap: break-word;";
  div1.textContent = msg;
  div.appendChild(div1);
  body.appendChild(div);
  setTimeout(function () {
    body.removeChild(getId('toast'));
  }, 5000);
}

//loading //warning  loading效果是图片，注意路径
function loading(type) {
  var body = document.body;
  if (type == 'hidden') {
    getId('loading') && body.removeChild(getId('loading'));
    return
  }
  var div = document.createElement('div');
  var div1 = document.createElement('div');
  div.id = "loading";
  div.style.cssText = "position: fixed;top: 0;width: 1280px;height: 720px;background-color: #1D5F5C;z-index: 99999;visibility: visible;";
  div1.style.cssText = "width: 120px;height: 120px;position: relative;margin: 0 auto;margin-top: 300px;background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHcAAAByCAYAAABp9E45AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MDdCQ0YzQTI4RDIzMTFFNzk2NUJFODIzNkM5QTdFOEQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MDdCQ0YzQTM4RDIzMTFFNzk2NUJFODIzNkM5QTdFOEQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDowN0JDRjNBMDhEMjMxMUU3OTY1QkU4MjM2QzlBN0U4RCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDowN0JDRjNBMThEMjMxMUU3OTY1QkU4MjM2QzlBN0U4RCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PnIIWP0AAAaNSURBVHja7J1baBxl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);line-height: 0;font-size: 0;text-align: center;animation-name: load;animation-duration: 3s;animation-iteration-count: infinite;animation-timing-function: linear;-webkit-animation-name: load;-webkit-animation-duration: 2s;-webkit-animation-iteration-count: infinite;-webkit-animation-timing-function: linear;white-space: nowrap;overflow: hidden;";
  div.appendChild(div1);
  body.appendChild(div);
}

//获取首页传来的"backUrl"函数
function getParam(_key, _url) {
  _url = _url || window.location.href;
  if (new RegExp('.*\\b' + _key + '\\b(\\s*=([^&]+)).*', 'gi').test(_url)) {
    return RegExp.$2;
  } else {
    return '';
  }
}
//计算字符长度
function strlen(str) {
  var len = 0;
  for (var i = 0; i < str.length; i++) {
    var c = str.charCodeAt(i);
    //单字节加1
    if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
      len++;
    }
    else {
      len += 2;
    }
  }
  return parseInt(len / 2);
}
function setStorage(key, obj) {
  window.localStorage.setItem(key, obj)
}
function getStorage(key) {
  return window.localStorage.getItem(key) || '';
}
function delStorage(key) {
  window.localStorage.removeItem(key) || '';
}
//BMS对接
function userBMS(callback) {
  playConfig.isOrder = '1';
  // var isOrder = '1'
  // Cookies.set('isOrder', isOrder, { path: '/' })
  callback && callback();
  return
  // 限免


  //黑白名单
  // var date = new Date();
  // var currDate = date.getFullYear() + '' + (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + ''
  //   + (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
  // var tiem = new Date().getTime();

  var action = '1';//1：用户账号认证； 2：用户MAC认证；3：用户账号+mac认证
  var version = '1'
  var platformCode = yh.siteId//站点id
  var accountId = yh.userId;
  var url = MBSUrl + "/user/auth?action=" +
    action + "&platformCode=" + platformCode + "&version=" + version + "&accountId=" + accountId;

  ajax({
    type: "GET",
    url: url,
    dataType: "json",
    success: function (response) {
      // toast(response);
      response = JSON.parse(response);
      if (response.code == '200') {
        //specialType 是否白名单 1，黑名单；2，白名单
        if (response.data.specialType && response.data.specialType == 1) {
          playConfig.isforbid = '1';
        } else if (response.data.specialType && response.data.specialType == 2) {
          // 白名单
          playConfig.isOrder = '1';
          Cookies.set('isOrder', "1", {
            path: '/'
          })
        }
        callback && callback()
      } else {
        userPower(callback)
      }
    },
    fail: function (error) {
      userPower(callback)
    }
  })

}
//鉴权
function userPower(callback) {
  try {
    var IfCheck = 0;//0：不校验usertoken和内容  1：校验usertoken和内容  2：仅校验内容  3：仅校验usertoken    
    var xml = '<?xml version="1.0" encoding="UTF-8"?>' +
      '<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">' +
      '<SOAP-ENV:Body>' +
      '<m:instantAPPAuthResponse xmlns:m="http://webservice.iptv3a.shtel.com">' +
      '<m:instantAPPAuthReturn>' +
      '<m:SPID>' + yh.cpId + '</m:SPID>' +
      '<m:UserID>' + yh.userId + '</m:UserID>' +
      '<m:UserToken>' + yh.token + '</m:UserToken>' +
      '<m:ProductID>' + yh.productId + '</m:ProductID>' +
      '<m:ContentID>' + yh.productId + '</m:ContentID>' +
      ' <m:IfCheck>' + IfCheck + '</m:IfCheck>' +
      '</m:instantAPPAuthReturn>' +
      '</m:instantAPPAuthResponse>' +
      '</SOAP-ENV:Body>' +
      '</SOAP-ENV:Envelope>'

    playConfig.isOrder = '0';
    Cookies.set('isOrder', playConfig.isOrder, { path: '/' })
    console.log('鉴权');
    console.log(xml);
    power(xml, function (response) {
      if (!response) {
        callback && callback();
        return
      }
      console.log(response)
      try {
        var result = response.substring((response.indexOf('<m:Result>') + '<m:Result>'.length), response.indexOf('</m:Result>'))
        var resultDesc = response.substring((response.indexOf('<m:ProductID>') + '<m:ProductID>'.length), response.indexOf('</m:ProductID>'))
        var productName = response.substring((response.indexOf('<m:ProductName>') + '<m:ProductName>'.length), response.indexOf('</m:ProductName>'))

        // var reg = /[\u4e00-\u9fa5]/g;
        // productName = productName.match(reg).join("");
        console.log('result------' + result + '----' + resultDesc + '----' + productName)
      } catch (e) {
        console.log(e)
      }

      Cookies.set('resultDesc', productName, { path: '/' })
      if (result == 0) {
        //鉴权成功
        playConfig.isOrder = '1';
        var isOrder = '1'
        Cookies.set('isOrder', isOrder, { path: '/' })
      }
      // 点击订购按钮才会触发
      if (Cookies.get("clickOrder") == '1') {
        if (playConfig.isOrder == '1') {
          // 订购成功上报
          try {
            var param = {
              pkg_type: '2',
              pkg_id: encodeURI(resultDesc),//产品包id
              operator_id: '',
              order_msg: '1',
              parent_page_id: Cookies.get("orderPkg"),
              parent_page_type: '0301',
              point: '1'
            }
            bi.order(param)
          } catch (error) {
            console.log('埋点错误', error)
          }
        } else {
          // 订购失败上报
          try {
            var productName = '';
            Cookies.set('resultDesc', productName, { path: '/' })
            var param = {
              pkg_type: '2',
              pkg_id: '',
              operator_id: '',
              order_msg: encodeURIComponent('订购失败'),
              parent_page_id: Cookies.get("orderPkg"),
              parent_page_type: '0301',
              point: '1'
            }
            bi.order(param)
          } catch (error) {
            console.log('埋点错误', error)
          }
        }
        Cookies.del('clickOrder')
      }
      callback && callback();
    }, function (error) {
      callback && callback();
      var productCode = '';
      Cookies.set('resultDesc', productCode, { path: '/' })
      console.log("error")
      if (Cookies.get("clickOrder") == '1') {
        // 订购失败上报
        try {
          var param = {
            pkg_type: '2',
            pkg_id: '',
            operator_id: '',
            order_msg: encodeURIComponent('订购失败'),
            parent_page_id: Cookies.get("orderPkg"),
            parent_page_type: '0301',
            point: '1'
          }
          bi.order(param)
        } catch (error) {
          console.log('埋点错误', error)
        }
        Cookies.del('clickOrder')
      }
    })
  } catch (e) {
    callback && callback();
    console.log(e)
  }
}

//播放分秒计算
function secondToDate(result) {
  var h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600);
  var m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60));
  var s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60));
  var str = '';
  if (h != '00') {
    m = Number(m) + h * 60
  }
  str += m + ":" + s;
  return str
}

function processingID(id) {
  id = id.split("SEAST")[1];
  var reg = new RegExp("([0]*)([1-9]+[0-9]+)", "g");
  return id.replace(reg, "$2")
}

function getConetntId(id) {
  var str = 'YANHUA00000000047SEAST' // contentId,拼接
  return str + ('000000000' + value.detailData.assetId).slice(-10);
}

//函数防抖
var timeout = null;
function debounce(func, wait) {
  var context = this;
  var args = arguments;
  if (timeout) clearTimeout(timeout);
  timeout = setTimeout(function () {
    func.apply(context, args)
  }, wait);
}