/** 
 * 播放所需
 * 
 * **/
var playConfig = {
  isRelease: true,//// playConfig.isRelease   默认false 开发环境  true线上环境(内网)
  isOrder: '0',//1 鉴权通过  0 未订购
}

var yh = {}

try {
  yh.siteId = '32' // 站点ID

  yh.userId = AT.getEpgUserName() || 123456; // 用户ID

  yh.sys_v = 'jingxuan' // 系统版本

  yh.soft_v = '1.0.1' // 用户软件版本

  yh.device_id = AT.getEpgUserName() || 123456; // 设备号获取不到取userId

  yh.operator_id = '' // 运营商ID（广电：1 电信：2 移动：3 联通：4）

  yh.terrace_id = '' // 平台ID(中兴：1 华为：2 烽火：3)

  yh.brand = '' // 机顶盒品牌

  yh.mode = DT.getModel() // 机顶盒型号

  yh.model = '' // 用户设备版本

  yh.apk_version = '' // apk版本

  yh.reserve_group = '' // 采集方式

  yh.userToken = '' // 用户令牌


  yh.ip = '00:00:00' // IP地址

  yh.bizDomain = '27' // 用户厂商orBMS站点

  yh.userGroup = '' // 用户分组

  yh.productIds = '' // 用户已订购产品ID（多个以逗号隔开）

  yh.areaCode = '10000' // 用户区域

  yh.userName = '' // 用户名称

  yh.telephone = '' // 联系电话

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

  yh.mac = DT.getEth0Mac() // 设备mac地址90d8f36515d8//福建有的盒子会报错，放最后
} catch (error) {
  console.log(error);
}

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
  div.style.cssText = "position: absolute; top: 50%; left: 50%;  -webkit-transform: translate(-50%,-50%);-ms-transform: translate(-50%,-50%);transform:translate(-50%,-50%); text-align:center;z-index:999;word-break: break-all; word-wrap: break-word;";
  div1.style.cssText = "display:inline-block;background:rgba(1,1,1,0.6); color:#fff; padding:20px; min-width:120px; text-align:center; font-size:22px; border-radius:5px;height100%;width: 100%;word-wrap: break-word;";
  div1.textContent = msg;
  div.appendChild(div1);
  body.appendChild(div);
  setTimeout(function () {
    body.removeChild(getId('toast'));
  }, 5000);
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
    }
    else {
      len += 2;
    }
  }
  return parseInt(len / 2);
}
function setSession(key, obj) {
  window.sessionStorage.setItem(key, obj)
}
function getSession(key) {
  return window.sessionStorage.getItem(key) || '';
}
//鉴权
function userPower(callback, contentId) {
  //接口文档有，但是未使用参数
  // var subContentId = "";
  // var path = "";
  // var preview = "";
  // var channelId = "";
  // var productId = "";
  // var token = "";
  try {
    playConfig.isOrder = '0';
    Cookies.set('isOrder', playConfig.isOrder, { path: '/' })
    var userId = AT.getEpgUserName();
    // var userId = "1505917347701";
    var terminalId = AT.getSTBID();
    var copyRightId = 699230;
    var systemId = "0";
    var contentId = contentId;
    var consumeLocal = "14";
    var consumeScene = "01";
    var consumeBehaviour = "02";
    var productId = "8801000428";
    var token = AT.getEpgToken();
    // var subContentId=23
    // var copyRightContentId=4
    var strXml = '<?xml version="1.0" encoding="UTF-8"?>' +
      '<message module="SCSP" version="1.1">' +
      '<header action="REQUEST" command="AUTHORIZE"/>' +
      '<body>' +
      '<authorize userId="' + userId + '" terminalId="' + terminalId + '" contentId="' + contentId
      + '" systemId="' + systemId + '" consumeLocal="' + consumeLocal + '" copyRightId="' + copyRightId
      + '" consumeScene="' + consumeScene + '" consumeBehaviour="' + consumeBehaviour + '" token="' + token + '"/>' +
      '</body>' +
      '</message>'
    console.log('鉴权');
    console.log(strXml);
    power(strXml, function (response) {
      if (!response) {
        callback && callback();
        return
      }
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
      Cookies.set('resultDesc', resultDesc, { path: '/' })
      var result = domXml.getAttribute('result')
      if (result == 0 || result == 50) {
        //鉴权成功
        playConfig.isOrder = '1';
        var isOrder = '1'
        Cookies.set('isOrder', isOrder, { path: '/' })
      }

      //点击订购按钮才会触发
      if (Cookies.get("clickOrder") == '1') {
        if (playConfig.isOrder == '1') {
          // 订购成功上报
          try {
            var param = {
              pkg_type: '2',
              pkg_id: encodeURI(resultDesc),
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
            var resultDesc = '';
            Cookies.set('resultDesc', resultDesc, { path: '/' })
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
      var resultDesc = '';
      Cookies.set('resultDesc', resultDesc, { path: '/' })
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