/** 
 * 播放所需
 * 
 * **/
var playConfig = {
  isRelease: true,//// playConfig.isRelease   默认false 开发环境  true线上环境(内网)
  isOrder: 1,//0 鉴权通过  1 未订购
}

var yh = {}

try {
  yh.siteId = '51' // 站点ID

  yh.userId =  '' // 用户ID

  yh.sys_v = 'xindongfang' // 系统版本

  yh.soft_v = '1.0.1' // 用户软件版本

  yh.device_id = ''; // 设备号获取不到取userId

  yh.operator_id = '' // 运营商ID（广电：1 电信：2 移动：3 联通：4）

  yh.terrace_id = '' // 平台ID(中兴：1 华为：2 烽火：3)

  yh.brand = '' // 机顶盒品牌

  yh.mode = '' // 机顶盒型号

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

  yh.cdn = '33200' // cdn类型

  yh.playStatus = 0;//播放状态0，播放，1播放器销毁
} catch (error) {
  console.log(error)
}

// 首页初始化加载
var authIp, stbId, deviceId, softVCode
var fileUrl, fileMd5, fileSavePath
// 获取tkoen
prompt('yanhua://epg/sxydPlayerUserAuth?return=sxydPlayerUserAuth')
function sxydPlayerUserAuth(obj) {
  console.log('获取用户token-----------sxydPlayerUserAuth')
  console.log(obj)
  var object = JSON.stringify(obj)
  console.log(object)
  var objs = eval('(' + object + ')')
  yh.userToken = objs.userToken
}

// 获取用户ID
prompt('yanhua://epg/sxydPlayerUserName?return=sxydPlayerUserName')
function sxydPlayerUserName(obj) {
  console.log('获取用户名称-----------sxydPlayerUserName')
  console.log(obj)
  var object = JSON.stringify(obj)
  console.log(object)
  var objs = eval('(' + object + ')')
  userName = objs.userName
  Cookies.set('userId', userName, {path: '/'})
  yh.userId = userName
  yh.device_id = userName
  console.log(JSON.stringify(yh))
}

console.log('初始化获取设备基本参数')
// 获取设备参数
prompt('yanhua://epg/deviceInfo?return=deviceInfo')
function deviceInfo(obj) {
  console.log('获取设备基本参数-----------deviceInfo')
  console.log(obj)
  var object = JSON.stringify(obj)
  console.log(object)
  var objs = eval('(' + object + ')')
  stbId = objs.eth0_mac
  deviceId = objs.eth0_mac
  softVCode = objs.softVCode
  Cookies.set('stbId', stbId, {path: '/'})
  Cookies.set('deviceId', deviceId, {path: '/'})
  Cookies.set('softVCode', softVCode, {path: '/'})

  // 收集信息
  var s = '1'
  var v = '1'
  collectUrl2 = encodeURIComponent('http://112.17.251.186:8082/acds/dic?' + 's=' + s + '&v=' + v + '&appDeviceId=' + deviceId)
  collectUrl = 'yanhua://epg/getHttp?return=collectMSG&httpUrl=' + collectUrl2
  console.log('收集url')
  console.log(collectUrl)
  Cookies.set('collectUrl', collectUrl, {path: '/'})
  // prompt(collectUrl)
  // 更新检测
  checkUrl2 = encodeURIComponent('http://112.17.251.186:8081/auth/aua?s=1&v=1&operator=&firm=&modelCode=&appDeviceId=' + deviceId + '&appPackage=yanhua.tv.xdf.shanxiyd_SXYD&appVer=' + softVCode)
  checkUrl = 'yanhua://epg/getHttp?return=checkUpdate&httpUrl=' + checkUrl2
  console.log('升级url')
  console.log()
  Cookies.set('checkUrl', checkUrl, {path: '/'})
  // prompt(checkUrl)
}


// 获取播放鉴权
prompt('yanhua://epg/sxydPlayerEpgServer?return=sxydPlayerEpgServer')
function sxydPlayerEpgServer(obj) {
  console.log('sxydPlayerEpgServer--------')
  console.log(JSON.stringify(obj), typeof JSON.stringify(obj))
  console.log('接受的对象authIp--------' + obj.authIp)

  var object = JSON.stringify(obj)
  object = object.replace(/\//, '\/')
  var objs = eval('(' + object + ')')
  console.log('解析的json--------' + objs)
  console.log('请求地址--------' + objs.authIp)

  authIp = objs.authIp
  yh.cnd = authIp
  // http://111.20.42.163:33200
  // 判断是华为还是中兴
  // if (authIp == 'http://111.20.33.16:33200') {
  //   yh.cnd = 'http://111.20.33.16:33200' // 华为
  // } else {
  //   yh.cnd = 'http://111.20.105.85:9330' // 中兴
  // }
}
function playVideo(cid, superid) {
  var head = {
    // POST: '/EPG/interEpg/user/default/authorize',
    // Host: authIp,
    Authorization: yh.userToken
    // 'Content-Type': 'application/json;charset=UTF-8',
    // 'Content-Length': ''
  }
  var header = JSON.stringify(head)
  var param = {
    businessType: '1',
    // cid: 'YANHUA90000035PITEM0040006862845', // 华为
    // cid: 'YANHUA00000048PITEM0040006832620', // 中兴
    cid: cid,
    contentType: '0',
    idflag: '1',
    playType: '1',
    // superid: 'YANHUA00000000035SEAST0001554361', // 华为
    // superid: 'YANHUA00000000048SEAST0000610904', // 中兴
    superid: superid,
    // tid: 'YANHUA00000000048PACKA0000000018'
    tid: '-1'
  }
  var params = JSON.stringify(param)
  console.log(params)
  console.log(header)

  console.log('鉴权播放前')
  console.log(yh.cnd)
  prompt('yanhua://epg/postHttp?return=proxyHttpRequestPost&httpUrl=' + yh.cnd + '/EPG/interEpg/user/default/authorize&header=' + header + '&body=' + params)
  console.log('鉴权播放后')
}
function playVideoBig(cid, superid) {
  var head = {
    // POST: '/EPG/interEpg/user/default/authorize',
    // Host: authIp,
    Authorization: yh.userToken
    // 'Content-Type': 'application/json;charset=UTF-8',
    // 'Content-Length': ''
  }
  var header = JSON.stringify(head)
  var param = {
    businessType: '1',
    // cid: 'YANHUA90000035PITEM0040006862845', // 华为
    // cid: 'YANHUA00000048PITEM0040006832620', // 中兴
    cid: cid,
    contentType: '0',
    idflag: '1',
    playType: '1',
    // superid: 'YANHUA00000000035SEAST0001554361', // 华为
    // superid: 'YANHUA00000000048SEAST0000610904', // 中兴
    superid: superid,
    // tid: 'YANHUA00000000048PACKA0000000018'
    tid: '-1'
  }
  var params = JSON.stringify(param)
  console.log(params)
  console.log(header)

  console.log('鉴权播放前')
  console.log(yh.cnd)
  prompt('yanhua://epg/postHttp?return=proxyHttpRequestPostBig&httpUrl=' + yh.cnd + '/EPG/interEpg/user/default/authorize&header=' + header + '&body=' + params)
  // var url = 'http://112.17.251.186:10089/sxyd_zhongxing_play' + '/EPG/interEpg/user/default/authorize'
  // console.log(url)
  // console.log(params)
  // console.log(yh.userToken)
  // ajax({
  //   type: "POST",
  //   url: url,
  //   data: params,
  //   dataType: "json",
  //   contentType: 'application/json',
  //   Authorization: yh.userToken,
  //   success: function (response) {
  //     console.log('鉴权播放完毕----', response)
  //     response = eval('(' + response + ')')
  //     var playurl = response.urls[0]
  //     console.log('获取的playurl----', playurl)
  //     value.play(playurl)
  //   },
  //   error: function(error) {
  //     console.log(error)
  //   }
  // })
  console.log('鉴权播放后')
}

function proxyHttpRequestPost(obj) {
  console.log('鉴权播放完毕----', obj)
  console.log(JSON.stringify(obj), typeof JSON.stringify(obj))
  var playurl = obj.urls[0]
  console.log('获取的playurl----', playurl)
  topContent.play(playurl)
  // value.play(playurl)
}
function proxyHttpRequestPostBig(obj) {
  console.log('鉴权播放完毕----', obj)
  console.log(JSON.stringify(obj), typeof JSON.stringify(obj))
  var playurl = obj.urls[0]
  console.log('获取的playurl----', playurl)
  // topContent.play(playurl)
  value.play(playurl)
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


/***
 *  图片懒加载
 */
// function lazyLoadImage () {
//   // 获取window的引用:
//   var $window = $(window);
//   // 获取包含data-img属性的img，并以jQuery对象存入数组:
//   var lazyImgs = $.map($('img[data-img]').get(), function (i) {
//     return $(i);
//   });
//   // 获取页面滚动的高度:
//   var wtop = $window.scrollTop();
//   // 判断是否还有未加载的img:
//   if (lazyImgs.length > 0) {
//     // 获取可视区域高度:
//     var wheight = $window.height();
//     // 存放待删除的索引:
//     var loadedIndex = [];
//     // 循环处理数组的每个img元素:
//     $.each(lazyImgs, function (index, element) {
//       // 判断是否在可视范围内:
//       if (element.offset().top - wtop < wheight) {
//         // 设置src属性:
//         element.attr('src', element.attr('data-img'));
//         // 添加到待删除数组:
//         loadedIndex.unshift(index);
//       }
//     });
//     // 删除已处理的对象:
//     $.each(loadedIndex, function (index) {
//       lazyImgs.splice(index, 1);
//     });
//   }
// }

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
//鉴权
function userPower(callback, contentId) {
  try {
    // var httpUrl = 'https://sxydbims.bestv.com.cn:8086/aaa/sxinterface'
    var httpUrl = 'https://sxydbims.bestv.com.cn:8085/aaa/sxinterface' // 内容鉴权接口
    var head = {
      // POST: '/EPG/interEpg/user/default/authorize',
      // Host: authIp,
      // Authorization: userToken
      // 'Content-Type': 'application/json;charset=UTF-8',
      // 'Content-Length': ''
    }
    var header = JSON.stringify(head)
    var command = encodeURI('AUTH')
    var spID = encodeURI('926626')
    var userID = encodeURI(Cookies.get("userId"))
    var stbId = encodeURI(Cookies.get("stbId"))
    var contentID = contentId // encodeURI('YANHUA-1555839')
    var productID = encodeURI('XDFTVXT')
    var catagoryID = encodeURI('')
    var transactionID = encodeURI('')
    var param = {
      command: command,
      spID: spID,
      userID: userID,
      stbId: stbId,
      contentID: contentID,
      productID: productID,
      catagoryID: catagoryID,
      transactionID: transactionID,
      sign: encodeURI(hex_md5(command + catagoryID + contentID + productID + spID + stbId + transactionID + userID))
    }
    var params = JSON.stringify(param)
    console.log('鉴权鉴权')
    prompt('yanhua://epg/postHttp?return=powerData&httpUrl=' + httpUrl + '&header=' + header + '&body=' + params)
    // 假设他走通了
    // powerData({result: '1036'}) // 假设未订购
    // powerData({result: '0'}) // 假设已订购

    callback && callback();

    // Cookies.set('isOrder', "1", {
    //   path: '/'
    // })
    // playConfig.isOrder = 1;

    // // var userId = AT.getEpgUserName();
    // var userId = "1505917347702";
    // var terminalId = AT.getSTBID();
    // var copyRightId = 699230;
    // var systemId = "0";
    // var contentId = contentId;
    // var consumeLocal = "14";
    // var consumeScene = "01";
    // var consumeBehaviour = "02";
    // var token = AT.getEpgToken();
    // // var subContentId=23
    // // var copyRightContentId=4

    // var header = {
    //   "Connection": "close",
    //   "Content-Type": "text/xml;charset=UTF-8",
    //   // "Authorization": Authorization,
    //   // "Content-Length": 164,
    //   "Accept-Encoding": "gzip",
    //   "Access-Control-Request-Headers": "content-type",
    //   "Access-Control-Request-Method": "POST"
    // }
    // var strXml = '<?xml version="1.0" encoding="UTF-8"?>' +
    //   '<message module="SCSP" version="1.1">' +
    //   '<header action="REQUEST" command="AUTHORIZE"/>' +
    //   '<body>' +
    //   '<authorize userId="' + userId + '" terminalId="' + terminalId + '" contentId="' + contentId
    //   + '" systemId="' + systemId + '" consumeLocal="' + consumeLocal + '" copyRightId="' + copyRightId
    //   + '" consumeScene="' + consumeScene + '" consumeBehaviour="' + consumeBehaviour + '" token="' + token + '"/>' +
    //   '</body>' +
    //   '</message>'
    // console.log('鉴权');
    // console.log(strXml);

    // var JSONheader = JSON.stringify(header);
    // var JSONplayerData = JSON.stringify(strXml);
    // ERT.proxyHttpRequestPost(url, JSONheader, JSONplayerData, "powerData");
    // ajax({ url: poweruUrl, type: "POST", data: data, contentType: "text/xml", success: successfn, fail: errorfn })
    // power(strXml, function (response) {
    //   console.log(response)
    //   //   // + '" subContentId="' + subContentId+ '"  path="' + path+ '"  preview="' + preview + '" channelId="' + channelId + '" productId="' + productId + '" token="' + token
    //   var parser = new DOMParser();
    //   //读取返回字符串
    //   var _xml = parser.parseFromString(response, "text/xml");
    //   //获取节点内容
    //   var domXml = _xml.getElementsByTagName("authorize")[0]
    //   //0：鉴权成功1：鉴权失败需要订购  10: 用户未登录 20：账户的计费标识需要验证 30：您的帐户不能消费 31：对应牌照方没可计费的产品 50:试看鉴权通过

    //   var result = domXml.getAttribute('result')
    //   var resultDesc = domXml.getAttribute('resultDesc')
    //   var result = domXml.getAttribute('result')
    //   if (result == 0 || result == 50) {
    //     Cookies.set('isOrder', "0", {
    //       path: '/'
    //     })
    //     playConfig.isOrder = 0;
    //   }
    //   callback && callback();
    // }, function (error) {
    //   callback && callback();
    //   console.log("error")
    // })
  } catch (e) {
    callback && callback();
    console.log(e)
  }
}
var powerData = function (obj) {
  console.log('获取鉴权结果-----------powerData')
  console.log(obj)
  var object = JSON.stringify(obj)
  console.log(object)
  var objs = eval('(' + object + ')')
  if (objs.result == 0) {
    Cookies.set('isOrder', "0", {
      path: '/'
    })
    playConfig.isOrder = 0
    // Cookies.set('isOrder', "1", {
    //   path: '/'
    // })
    // playConfig.isOrder = 1
    
  } else if (objs.result == 1036){
    console.log('需要订购')
    Cookies.set('isOrder', "1", {
      path: '/'
    })
    playConfig.isOrder = 1

  } else {
    alert('鉴权失败请重试！')
  }
  uploadDom()
  // callback && callback();
}
// var powerData = function (response) {
//   console.log(response)
//   //   // + '" subContentId="' + subContentId+ '"  path="' + path+ '"  preview="' + preview + '" channelId="' + channelId + '" productId="' + productId + '" token="' + token
//   var parser = new DOMParser();
//   //读取返回字符串
//   var _xml = parser.parseFromString(response, "text/xml");
//   //获取节点内容
//   var domXml = _xml.getElementsByTagName("authorize")[0]
//   //0：鉴权成功1：鉴权失败需要订购  10: 用户未登录 20：账户的计费标识需要验证 30：您的帐户不能消费 31：对应牌照方没可计费的产品 50:试看鉴权通过

//   var result = domXml.getAttribute('result')
//   var resultDesc = domXml.getAttribute('resultDesc')
//   var result = domXml.getAttribute('result')
//   if (result == 0 || result == 50) {
//     Cookies.set('isOrder', "0", {
//       path: '/'
//     })
//     playConfig.isOrder = 0;
//   }
//   callback && callback();
// }


// 判断类型的方法
function judgeObj(obj) {
  return Object.prototype.toString.call(obj).slice(8, -1)
}
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
  console.log(p)
};

// 截取字符串之间的值
function getNum(str,firstStr,secondStr){
  if(str == "" || str == null || str == undefined){ // "",null,undefined
      return "";
  }
  if(str.indexOf(firstStr)<0){
       return "";
  }
  var subFirstStr=str.substring(str.indexOf(firstStr)+firstStr.length,str.length);
  var subSecondStr=subFirstStr.substring(0,subFirstStr.indexOf(secondStr));
  return subSecondStr;
}