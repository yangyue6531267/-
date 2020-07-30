var poweruUrl = "http://winnow-bs.yanhuamedia.tv/cq-login";//订购鉴权测试代理
var userData = {
  payType: "1",//1.支付宝 2:微信  8.手机话费老五套支付
  subType: "03",
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

function ajax(options) {
  options = options || {};
  options.type = (options.type || "GET").toUpperCase();
  options.dataType = options.dataType || "json";
  options.contentType = options.contentType || "x-www-form-urlencoded";
  var params = options.data;
  //创建xhr对象 - 非IE6
  if (window.XMLHttpRequest) {
    var xhr = new XMLHttpRequest();
  } else { //IE6及其以下版本浏览器
    var xhr = new ActiveXObject('Microsoft.XMLHTTP');
  }
  //GET POST 两种请求方式
  if (options.type == "GET") {
    // xhr.open("GET", options.url + "?" + params, true);
    xhr.open("GET", options.url, true);
    xhr.send(null);
  } else if (options.type == "POST") {
    xhr.open("POST", options.url, true);
    //设置表单提交时的内容类型    
    xhr.setRequestHeader("Content-Type", options.contentType + ";charset=utf-8");
    xhr.send(params);
    // console.log(params);
  }
  //接收
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      var status = xhr.status;
      if (status >= 200 && status < 300) {
        options.success && options.success(xhr.responseText);
      } else {
        options.fail && options.fail(status);
      }
    }
  }
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
var Base64 = {
  _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
  encode: function (e) {
    var t = "";
    var n, r, i, s, o, u, a;
    var f = 0;
    e = Base64._utf8_encode(e);
    while (f < e.length) {
      n = e.charCodeAt(f++);
      r = e.charCodeAt(f++);
      i = e.charCodeAt(f++);
      s = n >> 2;
      o = (n & 3) << 4 | r >> 4;
      u = (r & 15) << 2 | i >> 6;
      a = i & 63;
      if (isNaN(r)) {
        u = a = 64
      } else if (isNaN(i)) {
        a = 64
      }
      t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a)
    }
    return t
  },
  decode: function (e) {
    var t = "";
    var n, r, i;
    var s, o, u, a;
    var f = 0;
    e = e.replace(/[^A-Za-z0-9+/=]/g, "");
    while (f < e.length) {
      s = this._keyStr.indexOf(e.charAt(f++));
      o = this._keyStr.indexOf(e.charAt(f++));
      u = this._keyStr.indexOf(e.charAt(f++));
      a = this._keyStr.indexOf(e.charAt(f++));
      n = s << 2 | o >> 4;
      r = (o & 15) << 4 | u >> 2;
      i = (u & 3) << 6 | a;
      t = t + String.fromCharCode(n);
      if (u != 64) {
        t = t + String.fromCharCode(r)
      }
      if (a != 64) {
        t = t + String.fromCharCode(i)
      }
    }
    t = Base64._utf8_decode(t);
    return t
  },
  _utf8_encode: function (e) {
    e = e.replace(/rn/g, "n");
    var t = "";
    for (var n = 0; n < e.length; n++) {
      var r = e.charCodeAt(n);
      if (r < 128) {
        t += String.fromCharCode(r)
      } else if (r > 127 && r < 2048) {
        t += String.fromCharCode(r >> 6 | 192);
        t += String.fromCharCode(r & 63 | 128)
      } else {
        t += String.fromCharCode(r >> 12 | 224);
        t += String.fromCharCode(r >> 6 & 63 | 128);
        t += String.fromCharCode(r & 63 | 128)
      }
    }
    return t
  },
  _utf8_decode: function (e) {
    var t = "";
    var n = 0;
    var r = c1 = c2 = 0;
    while (n < e.length) {
      r = e.charCodeAt(n);
      if (r < 128) {
        t += String.fromCharCode(r);
        n++
      } else if (r > 191 && r < 224) {
        c2 = e.charCodeAt(n + 1);
        t += String.fromCharCode((r & 31) << 6 | c2 & 63);
        n += 2
      } else {
        c2 = e.charCodeAt(n + 1);
        c3 = e.charCodeAt(n + 2);
        t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
        n += 3
      }
    }
    return t
  }
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
function goBack(str) {
  // userData.backUrl
  var path = userData.backUrl
  if (str) {
    path = path + str;
  }
  window.location.replace(path);
}
function userPower(callBack) {
  userData.userId = getParam('userId');
  userData.terminalId = getParam('terminalId');
  userData.token = getParam('token');
  userData.contentId = getParam('contentId');
  userData.channelId = getParam('channelId');
  userData.systemId = getParam('systemId');
  userData.consumeLocal = getParam('consumeLocal');
  userData.consumeScene = getParam('consumeScene');
  userData.consumeBehaviour = getParam('consumeBehaviour');
  userData.preview = getParam('preview');
  userData.productId = getParam('productId');
  userData.subContentId = getParam('subContentId');
  userData.copyRightId = getParam('copyRightId');
  userData.backUrl = getParam('returnUrl');

  var strXml = '<?xml version="1.0" encoding="UTF-8"?>' +
    '<message module="SCSP" version="1.1">' +
    '<header action="REQUEST" command="AUTHORIZE"/>' +
    '<body>' +
    '<authorize userId="' + userData.userId + '" terminalId="' + userData.terminalId + '" contentId="' + userData.contentId +
    '" subContentId="" systemId="' + userData.systemId + '" consumeLocal="' + userData.consumeLocal + '" consumeScene="' + userData.consumeScene +
    '" consumeBehaviour="' + userData.consumeBehaviour + '"  path=""  preview="' + userData.preview + '" channelId="' + userData.channelId +
    '" productId="' + userData.productId + '" token="' + userData.token + '"/>' +
    '</body>' +
    '</message>'
  ajax({
    url: poweruUrl,
    type: "POST",
    data: strXml,
    contentType: "text/xml",
    success: function (res) {
      console.log(res)
      var parser = new DOMParser();
      //读取返回字符串
      var _xml = parser.parseFromString(res, "text/xml");
      //获取节点内容
      var domXml = _xml.getElementsByTagName("authorize")[0];
      var productDom = _xml.getElementsByTagName("Product");
      //0：鉴权成功1：鉴权失败需要订购  10: 用户未登录 20：账户的计费标识需要验证 30：您的帐户不能消费 31：对应牌照方没可计费的产品 50:试看鉴权通过
      var result = domXml.getAttribute('result')
      var resultDesc = domXml.getAttribute('resultDesc');
      userData.accountIdentify = domXml.getAttribute('accountIdentify');
      userData.accountIdentifyNonMobile = domXml.getAttribute('accountIdentifyNonMobile');
      console.log(result);
      if (result == 0 || result == 50) {
        goBack();
        return
      }
      for (var i = 0; i < productDom.length; i++) {
        value.productList[i].id = i;
        value.productList[i].productName = productDom[i].getAttribute('productInfo');
        value.productList[i].productCode = productDom[i].getAttribute('productCode');
        value.productList[i].orderContentId = productDom[i].getAttribute('orderContentId');
        value.productList[i].pic = productDom[i].getAttribute('price');
        var unit = '';//1.天、2.连续包月、3.单月、4.年、5.季、6.固定时长、7.按次
        switch (productDom[i].getAttribute('unit')) {
          case '1':
            unit = '天';
          case '2':
            unit = '连续包月';
          case '3':
            unit = '单月';
          case '4':
            unit = '年';
          case '5':
            unit = '季';
          case '6':
            unit = '小时';
          case '7':
            unit = '次';
        }
        value.productList[i].title = productDom[i].getAttribute('cycle') + unit;

      }
      callBack && callBack();
    },
    fail: function (res) {
      console.log(res);
      callBack && callBack();
    }
  })
}