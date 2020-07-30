/** 
 * 播放所需
 * 
 * **/
var playConfig = {
  isRelease: true,//// playConfig.isRelease   默认false 开发环境  true线上环境(内网)
  isOrder: 1,//0 鉴权通过  1 未订购
}

var mobileNos = Cookies.get('mobileNo');

// var baseUrl = '' // 测试代理
var baseUrl = 'http://gsyd-ds.yanhuamedia.tv/' // 正式代理
// var baseUrl1 = 'http://47.97.96.103' 
var baseUrl1 = "http://bms-i.yanhuamedia.tv"

var yh = {}

try {
  yh.siteId = '33' // 站点ID
  // yh.userId = AT.getEpgUserName() || 123456; // 用户ID
  yh.userId =  Cookies.get('mobileNo') ||123456; // 用户ID

  yh.sys_v = 'gansu' // 系统版本

  yh.soft_v = '1.0.1' // 用户软件版本

  yh.device_id = Cookies.get('msgid') ||123456; // 设备号获取不到取userId

  yh.payForId = "158020191212000053"
  //鉴权id
} catch (error) {
  console.log(error);
}

// function setYH(obj){
//   console.log(obj)
//   yh.userId = obj.mobileNos;
//   yh.device_id = obj.device_id;
//   console.log(JSON.stringify(yh))
// }

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
  div.style.cssText = "position: absolute; top: 100%; left: 50%;  -webkit-transform: translate(-50%,-50%);-ms-transform: translate(-50%,-50%);transform:translate(-50%,-50%); text-align:center;z-index:999;word-break: break-all; word-wrap: break-word;";
  div1.style.cssText = "display:inline-block;background:rgba(1,1,1,0.6); color:#fff; padding:20px; min-width:120px; text-align:center; font-size:22px; border-radius:5px;height100%;width: 100%;word-wrap: break-word;";
  div1.textContent = msg;
  div.appendChild(div1);
  body.appendChild(div);
  setTimeout(function () {
    body.removeChild(getId('toast'));
  }, 2000);
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



function getTimeString() {
  function pad2(n) {
    return n < 10 ? '0' + n : n
  }
  var date = new Date()
  return (
    date.getFullYear().toString() +
    pad2(date.getMonth() + 1) +
    pad2(date.getDate()) +
    pad2(date.getHours()) +
    pad2(date.getMinutes()) +
    pad2(date.getSeconds()) +
    pad2(date.getMilliseconds())
  )
}

//鉴权
function userPower(callback,userObj) {
  // var subContentId = "";
  // var path = "";
  // var preview = "";
  // var channelId = "";
  // var token = "";
  var powerKey = 'b875o629m727s567';
  var url = "http://gsyd-ds.yanhuamedia.tv/boms/v1/access_token"
  console.log(url);
  try {
    Cookies.set('isOrder', "1", {
      path: '/'
    })
    playConfig.isOrder = 1;
    $.ajax({
      type: 'POST',
      url: url,
      dataType: 'json',
      timeout: 5000,
      headers: {
        powerkey: powerKey
      },
      success: function (data) {
        console.log(data)
        if (data.result == 1000) {
          accessToken = data.data
          var urls = "http://gsyd-ds.yanhuamedia.tv/v2/gs/verify"  //新版本接口未上线，上线时间待定
      var params = {
        body: {
          "idType": 0, //用户标识类型，0:手机号,1:宽带账号
          "idValue": mobileNos, //手机号
          // productId: "GSBYZT|1,GSBYZT|3,GSBYZT|12,GSBYZT" //产品标识，家开平台定义的产品或套餐编号
          "productId": yh.payForId//产品标识，家开平台定义的产品或套餐编号
          // "contentId": userObj.contentId, //内容标识，点播业务时必选
        },
        header: {
          "version": '1.0',
          "msgid": userObj.stbId,
          "systemtime": getTimeString(),
          "sourceid": "580001",
          "access_token": accessToken
        }
      }
      console.log(JSON.stringify(params));
      ajax({
        type: 'POST',
        url: urls,
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(params),
        success: function (data) {
          console.log(data)
          var datas = JSON.parse(data);
          if (datas.body.isVerified == 1) {
            console.log('订购成功')
            playConfig.isOrder = 0;
            Cookies.set('isOrder', "0", {
              path: '/'
            })
          }
          callback && callback();
        },
        error: function (err) {
          console.log('操作失败')
          console.log(err)
          callback && callback();
        }
      })
        } else {
          console.log('无效powerkey')
        }
      },
      error: function (err) {
        console.log('无效powerkey')
        console.log(err)
        callback && callback();
      }
    })
        // 订购鉴权
  //       var params1 = {"action":"1","platformCode":"32|13","version":"1","accountId":mobileNos}
  //       console.log(params1);
  //       var userTokens = '';
  //       var userId = '';
  //       var baseUrl1 = 'http://47.97.96.103'
  //       $.ajax({
  //         type: 'POST',
  //         url: baseUrl1+"/bms/u/user/gsxdfAuth",
  //         dataType: 'json',
  //         timeout: 5000,
  //         data: params1,
  //         success:function(data){
  //           console.log(data);
  //           userTokens = data.data.userToken;
  //           productIds = data.productIds;
  //           var params ={
  //               "header": {
  //                 "msgid": "asdf",
  //                 "systemtime": "20160712105049367",
  //                 "version": "1.0"
  //               },
  //               "body": { "mobileNumber":mobileNos}
  //           }
  //           var time  = new Date().getTime();
  //           console.log(userTokens)
  //           var sha = hex_sha1(userTokens)
  //           
  //           $.ajax({
  //                 type: 'POST',
  //                 // url: baseUrl +'api/orderListByMobile',
  //                 url: "http://winnow-bs.yanhuamedia.tv/gs_orderlist",
  //                 dataType: "json",
  //                 data:JSON.stringify(params),
  //                 headers: {
  //                   'Content-Type': 'application/json;charset=UTF-8',
  //                   "timestamp":time,
  //                   "powerkey":powerKey,
  //                   "signature":sha
  //                 },
  //                 success:function(data){
  //                   console.warn(data.body)
  //                   console.warn(data.header)
                    
  //                   value.lengths = data.body.data.length;
  //                   console.log(data.body.data);
  //                   if (value.lengths>0) {
  //                     for (var i = 0; i < value.lengths; i++) {
  //                       for (var index = 0; index < array.length; index++) {
  //                         if(data.body.data[i].operatorCode=="158020190611000050"){
  //                           console.log('订购成功');
  //                           Cookies.set('isOrder', "0", {
  //                             path: '/'
  //                           })
  //                           playConfig.isOrder = 0;
  //                         }
  //                       }
  //                       // if(data.body.data[i].operatorCode=="GSBYZT"){
  //                     }
  //                   }else{
  //                     console.log(JSON.stringify(data));
  //                   }
  //                   callback && callback();
  //                 },error:function(error){
  //                   console.log(error);
  //                   callback && callback();
  //                 }
  //               })
  //         },error:function(er){
  //           console.log('鉴权失败');
  //           console.log(er)
  //         }
  //       })
  } catch (e) {
    callback && callback();
    console.log(e)
}
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