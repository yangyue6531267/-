/** 
 * 播放所需
 * 
 * **/
var playConfig = {
  isRelease: true, //// playConfig.isRelease   默认false 开发环境  true线上环境(内网)
  isOrder: 1, //0 鉴权通过  1 未订购
}

var yh = {}

try {
  yh.siteId = '54' // 站点ID
  yh.stbId = Cookies.get("XDF_stbId");
  yh.userId = Cookies.get("XDF_userId"); // 用户ID
  yh.sys_v = 'gansu' // 系统版本
  yh.soft_v = '1.0.1' // 用户软件版本

  yh.device_id = Cookies.get("XDF_stbId"); // 设备号获取不到取userId

  yh.mobileNo = Cookies.get('mobileNo') || "18393817034";

  yh.payForId = "158020190429000008";
} catch (error) {
  yh.payForId = "158020190429000008";
  yh.mobileNo = "18393817034";
  yh.userId = "TV9311494111";
  yh.device_id = "005801FF0001090001C810D21CD050B6";
  yh.stbId = "005801FF0001090001C810D21CD050B6";
  console.log(error);
}


// toast('getUserID--' + JSON.stringify(yh));
function backXDF() {
  // 退出应用埋点
  try {
    bi.end()
  } catch (e) {
    console.log(e)
  }
  var backUrl = 'http://111.11.189.150:8080/CMCC2/page/index/index.jsp?categoryId=1227&isMenuFrom=1'; //首页
  if (Cookies.get('XEStv_EPG_returnUrl')) {
    backUrl = Cookies.get('XEStv_EPG_returnUrl')
  }

  try {
    //临时使用
    window.location.replace(backUrl)
  } catch (e) {
    console.log(e)
  }
}
// console.log("用户id:"+yh.userId);
// console.log("stbId:"+yh.stbId);
// console.log("用户手机号"+yh.mobileNo);
// 键值监听
var keyTimer = null;

function Handlekey(callback) {
  document.onkeydown = function (e) {
    e = event || window.event || arguments.callee.caller.arguments[0];
    var keycode = e.which || e.keyCode;
    clearTimeout(keyTimer);
    keyTimer = null;
    keyTimer = setTimeout(function () {
      if (HandleKeyCode(keycode, callback)) {
        e.preventDefault();
      }
    }, 10);
  };
}
// 键值回调
function HandleKeyCode(code, callback) {
  // 触发加载
  if (code === 39 || code === 4) {
    callback('right');
  } else if (code === 37 || code === 3) {
    callback('left');
  } else if (code === 13) {
    callback('ok');
  } else if (code === 38 || code === 1) {
    callback('up')
  } else if (code === 40 || code === 2) {
    callback('down')
  } else if (code === 8 || code === 22 || code == 340 || code == 27 || code == 461) {
    callback('back')
  } else if (code == 513 || code == 832 || code == 835) {
    callback('index')
  }
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
//埋点数据储存localStorage
function storageBi(obj) {
  var data = localStorage.getItem('biObj');
  if (data) {
    data = JSON.parse(data);
    for (var key in obj) {
      if (!data[key]) {
        data[key] = obj[key]
      } else if (data[key] != obj[key]) {
        data[key] = obj[key]
      }
    }
  } else {
    data = obj
  }
  data = JSON.stringify(data);
  localStorage.setItem('biObj', data);
}

function getStorageBi() {
  var data = localStorage.getItem('biObj');
  if (data) {
    data = JSON.parse(data);
  } else {
    data = {}
  }
  return data
}
//获取url参数
function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
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
  div.style.cssText = "position: absolute; top: 80%; left: 50%;  -webkit-transform: translate(-50%,-50%);-ms-transform: translate(-50%,-50%);transform:translate(-50%,-50%); text-align:center;z-index:99999;word-break: break-all; word-wrap: break-word;";
  div1.style.cssText = "display:inline-block;background:rgba(1,1,1,0.6); color:#fff; padding:20px; min-width:120px; text-align:center; font-size:22px; border-radius:5px;height100%;width: 100%;word-wrap: break-word;";
  div1.textContent = msg;
  div.appendChild(div1);
  body.appendChild(div);
  setTimeout(function () {
    body.removeChild(getId('toast'));
  }, 3000);
}
//获取首页传来的"backUrl"函数
function getParam(_key, _url) {
  _url = _url || window.location.href;
  if (new RegExp('.*\\b' + _key + '\\b(\\s*=([^&]+)).*', 'gi').test(_url)) {
    return RegExp.$2;
  } else {
    return null;
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
    } else {
      len += 2;
    }
  }
  return parseInt(len / 2);
}


function getTimeString(timeType) {
  if (!timeType) {
    timeType = "min"
  }

  function pad2(n) {
    return n < 10 ? '0' + n : n
  }
  var date = new Date()
  if (timeType == "hour") {
    return (
      date.getFullYear().toString() +
      pad2(date.getMonth() + 1) +
      pad2(date.getDate()) +
      pad2(date.getHours())
    )
  } else if (timeType == 'min') {
    return (
      date.getFullYear().toString() +
      pad2(date.getMonth() + 1) +
      pad2(date.getDate()) +
      pad2(date.getHours()) +
      pad2(date.getMinutes())
    )
  } else if (timeType == 'yy-pp') {
    return (
      date.getFullYear().toString() + '-' +
      pad2(date.getMonth() + 1) + '-' +
      pad2(date.getDate()) + ' ' +
      pad2(date.getHours()) + ':' +
      pad2(date.getMinutes()) + ':' +
      pad2(date.getSeconds())
    )
  }
}

// 同步订单
function orderwork() {
  qrOrderId = 'T' + yh.stbId.substring(yh.stbId.length - 4) + Math.round(new Date().getTime() / 1000).toString()
  var params1 = {
    action: "1",
    platformCode: "54",
    version: "1",
    accountId: yh.userId
  }
  var userTokens = '';
  var userId = '';
  $.ajax({
    type: 'POST',
    url: "http://bms-i.yanhuamedia.tv/bms/u/user/gsxdfAuth",
    dataType: 'json',
    timeout: 5000,
    contentType: 'application/json',
    data: JSON.stringify(params1),
    success: function (data) {
      console.warn(data);
      if (data.code == 400) {
        return;
      }
      userTokens = data.data.userToken;
      userId = data.data.userId;
      var validFrom = getTimeString("yy-pp");
      var validTo = "2099-12-31 23:59:59"
      var params = {
        platformCode: "54", //业务平台
        transactionId: qrOrderId, //订单号
        accountId: yh.userId, //y用户账户
        userId: userId, //用户id
        userToken: userTokens, //用户令牌
        mac: yh.stbId, //mac
        // mac:"005803FF001827800005748F1B4F7B46",//mac
        productCode: yh.payForId, //产品编码
        payPlatform: 0, //支付方式 0：电话支付 3：二维码支付
        validFrom: validFrom,
        validTo: validTo,
        version: 1
      }
      console.log(params);
      var orderfor = $.ajax({
        type: 'POST',
        url: 'http://bms-i.yanhuamedia.tv/bms/p/order/gsxdfMPay',
        dataType: 'json',
        timeout: 5000,
        contentType: 'application/json',
        data: JSON.stringify(params),
        success: function (data) {
          console.log(data);
          console.log(data.code);
          console.log(data.data);
        },
        error: function (err) {
          console.log('操作失败');
          console.log('err=====' + JSON.stringify(err))
        }
      })
    },
    error: function (er) {
      console.log('鉴权失败');
      console.log(er)
    }
  })

}

//鉴权
function userPower(callback, contentId) {
  Cookies.set('isOrder', "1", {
    path: '/'
  })

  playConfig.isOrder = 1;
  // var subContentId = "";
  // var path = "";
  // var preview = "";
  // var channelId = "";
  var param = {
    "portalcode": "PCODE-t2gwbgzp",
    "sptoken": "4F673775CD9E51276730A9E8EA7EA9D2",
    "contenttype": "3",
    "contentcode": contentId
  }
  $.ajax({
    type: 'POST',
    url: "http://gsyd-ds.yanhuamedia.tv/gsiptv_ngx/IPTVPortalInterface/content/getcontentlist.do",
    dataType: 'json',
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    data: JSON.stringify(param),
    success: function (date) {
      console.warn(date);
      var conID = date.result[0].id;
      console.warn(conID);
      var token = hex_md5(Math.round(getTimeString()).toString() + "PukkaAndGSYD").toUpperCase();
      console.log((getTimeString()).toString() + "PukkaAndGSYD");
      var urls = "http://gsyd-ds.yanhuamedia.tv/gsiptv_order/IPTVPortalInterface/activeUser/userPlay.do"
      var params = {
        "stbid": yh.stbId,
        "userid": yh.userId,
        "billingcode": yh.payForId,
        "contentid": conID,
        "token": token,
        "timeshift": getTimeString(),
        "spsign": "PukkaAndGSYD"
      }
      console.log(params);
      console.log(JSON.stringify(params));
      $.ajax({
        type: 'GET',
        url: urls,
        data: params,
        success: function (data) {
          console.log(data);
          if (data.result == 0) {
            console.log('订购成功')
            Cookies.set('isOrder', "0", {
              path: '/'
            })
            if (Cookies.get('firstChargePay') == '第一次点击订购') {
              Cookies.set("firstChargePay", '', {
                path: '/'
              })
              orderwork();
            }
            playConfig.isOrder = 0;
            callback && callback();
          } else if (data.result == 1) {
            callback && callback(data.productlist[0].billingcode);
          }
        },
        error: function (err) {
          console.log('操作失败')
          console.log(err)
          callback && callback();
        }
      })
    },
    error: function (err) {
      console.log(err);
      callback && callback();
    }
  })
}

var powerData = function (response) {
  console.log(response)
  //   // + '" subContentId="' + subContentId+ '"  path="' + path+ '"  preview="' + preview + '" channelId="' + channelId + '" productId="' + productId + '" token="' + token
  var parser = new DOMParser();
  //读取返回字符串
  var _xml = parser.parseFromString(response, "text/xml");
  //获取节点内容
  var domXml = _xml.getElementsByTagName("authorize")[0]
  //0：鉴权成功1：鉴权失败需要订购  10: 用户未登录 20：账户的计费标识需要验证 30：您的帐户不能消费 31：对应牌照方没可计费的产品 50:试看鉴权通过

  var result = domXml.getAttribute('result')
  var resultDesc = domXml.getAttribute('resultDesc')
  var result = domXml.getAttribute('result')
  if (result == 0 || result == 50) {
    Cookies.set('isOrder', "0", {
      path: '/'
    })
    playConfig.isOrder = 0;
  }
  callback && callback();
}

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