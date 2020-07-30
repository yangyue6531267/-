/** 
 * 播放所需
 * 
 * **/
var playConfig = {
  isRelease: true,//// playConfig.isRelease   默认false 开发环境  true线上环境(内网)
  isOrder: 1,//0 鉴权通过  1 未订购
  orderUrl:'',
}
var aaaUrl = 'http://112.35.185.113:19001/bms_auth' // 黑白名单url
var upgradeCollectionUrl = 'http://112.17.251.186:8082/acds/dic?appDeviceId=' // 升级采集接口
var authenticationUrl = 'http://183.192.162.197:8082/cashier/cashier-api/authorize'; // 鉴权测试地址
var isAllow = 0; // 1 黑名单 ， 2 白名单  0 普通用户
var yh = {};

try {
  yh.epgUrl = '' // 认证获取epgurl

  yh.userToken = '' // token

  yh.siteId = '39' // 站点ID

  // yh.userId = AT.getEpgUserName() || 123456; // 用户ID
  yh.userId =  123456; // 用户ID

  yh.sys_v = 'jingxuan' // 系统版本

  yh.soft_v = '1.0.1' // 用户软件版本

  yh.device_id = 123456; // 设备号获取不到取userId

  yh.operator_id = '' // 运营商ID（广电：1 电信：2 移动：3 联通：4）

  yh.terrace_id = '' // 平台ID(中兴：1 华为：2 烽火：3)

  yh.brand = '' // 机顶盒品牌

  yh.mode = '' // 机顶盒型号

  yh.model = '' // 用户设备版本

  yh.apk_version = '' // apk版本

  yh.reserve_group = '' // 采集方式

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

  yh.mac = '' // 设备mac地址90d8f36515d8//福建有的盒子会报错，放最后
} catch (error) {
  console.log(error);
}

// 获取用户信息
getAccountInfo('accountInfoBack');
function accountInfoBack (resp) { 
  console.log('token获取==='+JSON.stringify(resp))
  yh.userToken = resp.userToken;
 }
//  鉴权
function authentication(){
  var tempToken = yh.userToken;
  var clientCallBackUrl = window.location.href;
  var tempBody = {
    userId:"0104271578294029557",
    terminalId:"009903FF001815100002A8BD3A5D48D3",
    copyRightId:"699218",
    systemId:"0",
    contentId:"201904081726",
    subContentId:"",
    copyRightContentId:"",
    consumeLocal:"17",
    consumeScene:"01",
    consumeBehaviour:"02",
    path:null,
    preview:"",
    channelId:"00001",
    spId:"699371",
    token:tempToken,
    clientCallBack:clientCallBackUrl
  }
  var tempHeader = '{"Content-Type":' + '"application/json"'+ '}'
  console.log('订购参数='+ JSON.stringify(tempBody))
  postHttp(authenticationUrl,tempHeader,JSON.stringify(tempBody),'orderBack');
}
function orderBack(resp){
  console.log('鉴权回调'+JSON.stringify(resp))
  if(resp.result == 0){
    getId('btnBox2').innerHTML = '已订购 <span>VIP</span>';
    Cookies.set('isOrder', "0", {path: '/'})
  }else{
    Cookies.del('isOrder', {path: '/'})
  }
  playConfig.isOrder = resp.result;
  if(resp.webUrl)playConfig.orderUrl = resp.webUrl;
}

// getAuth('authCallBack')
function authCallBack(res){
  console.log('认证回调------'+JSON.stringify(res))
  yh.epgUrl = res.ePGURL;
  yh.userToken = res.userToken;
  yh.userId = res.iPTVAccount;
  // yh.device_id = res.iPTVAccount; // 用户账号，一般为手机号
  getDeviceInfo('deviceInfoCallBack')
}
// 获取获取设备信息回调
function deviceInfoCallBack(res){
  console.log('获取获取设备信息回调------'+JSON.stringify(res))
  deviceInfo = res;
  cuurVersion = deviceInfo.softVCode*1;
  var collectionUpdatUrl = upgradeCollectionUrl+deviceInfo.eth0_mac+'&s=6&v=1'
  getHttp(collectionUpdatUrl,'collectionUpdatBack');
  yh.device_id = deviceInfo.eth0_mac;
  var aaaBody = {
    action:"1",
    accountId:yh.userId,
    platformCode:"39",
    version:"1"
  }
  var aaaHerder = '{"Content-Type":' + '"application/json"'+ '}';
  postHttp(aaaUrl,aaaHerder,JSON.stringify(aaaBody),'aaaAuth');
}
function aaaAuth(res){
  console.log('黑白名单请求回调'+JSON.stringify(res))
  if(res.data.specialType){
    isAllow = res.data.specialType;
    console.log('获取黑白名单信息====='+isAllow)
    Cookies.set('isAllow',isAllow,{path:'/'})
  }
}
function collectionUpdatBack(res) {  
  console.log('升级采集信息==='+JSON.stringify(res))
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


// 认证

function getAuth (callBack) {  
  prompt('yanhua://epg/auth?jsonParam=&return='+callBack)
}
// 获取获取设备信息

function getDeviceInfo (callBack){
  prompt('yanhua://epg/deviceInfo?return='+callBack)
}
// 获取账户信息

function getAccountInfo (callBack) {
  prompt('yanhua://epg/accountInfo?return='+callBack)
}
// get请求
function getHttp (url,callBack) {  
  prompt('yanhua://epg/getHttp?httpUrl='+encodeURIComponent(url)+'&return='+callBack)
}
// post请求
function postHttp (url,header,body,callBack) {  
  console.log('url====='+url)
  prompt('yanhua://epg/postHttp?httpUrl='+encodeURIComponent(url)+'&return='+callBack+'&header='+header+'&body='+body)
}
// 订购
function order (prObj,callBack){
  prompt('yanhua://epg/startActivityByAction?action=com.huawei.tvbox.action.Pay&json='+prObj+'&return='+callBack);
}
// 下载
function downloadApk(url,callBack,Md5) { 
  prompt('yanhua://epg/download?return='+callBack+'&url='+url+'&fileMd5='+Md5) 
}
// 安装
function installApk(apkPath,callBack) {  
  prompt('yanhua://epg/installApp?return='+callBack+'&package=yanhua.tv.hnyd_xdf&apkPath='+apkPath+'&installType=1')
}
// 生命周期回调
function registerLifecycle(callBack){
  prompt('yanhua://epg/registerLifecycleCallback?return='+callBack)
}
// ipv6网络
function getIPV6Address(callBack){
  prompt('yanhua://epg/getIPV6Address?return='+callBack+'&host=iptv.cdn.ha.chinamobile.com')
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

// 流水号
function randomString(len) {  
　　len = len || 32;  
　　var $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';  
　　var maxPos = $chars.length;  
　　var pwd = '';  
　　for (i = 0; i < len; i++) {  
        //0~32的整数
　　　　pwd += $chars.charAt(Math.floor(Math.random() * (maxPos+1)));  
　　}  
console.log(pwd)
　　return pwd;  
}  

function orderHandle(ovdId){
  // 订购
  var isAllow = Cookies.get('isAllow')*1
  if(isAllow == '2')return;
  var transId2 = randomString(32);
  // var ovdId = value.list[0].vodList[0].playUrl;
  var productList2 = [{
    productId:'12612900',
    productDesc:'1，新东方精心打造的学习课程。2，课程涵盖多纳乐园、贝瓦爱学习、小初高课程、成人教育等，难点突破、考点指导、题目解析、英语培训、课外不断提升。3，标准资费：29元/月，订购生效后费用按天计算，次月自动续订。4，退订方式：可发送短信0000到10086，根据短信提示操作退订，退订次月生效，月底前可继续享用服务。1，话费可以直接订购新东方学习课程。2，标准资费：29元/月，订购生效后费用按天计算，次月自动续订。3，退订方式：可发送短信0000到10086，根据短信提示操作退订，退订次月生效，月底前可继续享用服务。',
    productName:'新东方教育',
    originalPrice:2900,
    price:2900,
    orderTip:'连续包月',
    contentId:ovdId?ovdId:'',
    orderType:'0',
    payTypes:'0',
    pExtra:'',
    sid:'1020',
    promoyionsId:'',
    smsOrderCode:'0000'
  }]
  // 认证
  var orderpmObj = {
    appId:'50867143',
    appKey:'25d3e61f',
    appSecret:'3Jshk',
    notifyUrl:'http://112.35.185.113:19001/bms_payCallback',
    transId:transId2,
    productList:JSON.stringify(productList2),
    pkg:'yanhua.tv.xdf.henanyd_HNYD',
  }
  order(JSON.stringify(orderpmObj),'orderFunction');
}
function orderFunction(res){
  console.log('订购回调==='+JSON.stringify(res))
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