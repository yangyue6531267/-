var APPID = "c64c9f3e2abd47b";
var APPKEY = "7dd06cf7d25fdddb48a17ca0f3d29435";
// AppSecret = 0cef2702dc37f1a76409d0a9c2178638


//  接口服务
// var baseUrl = "http://112.17.251.186:10088/?s=42|17&"; //主页入口
var historylUrl = "http://112.17.251.186:10089/uds/cloud/collection"; //收藏  历史纪录接口
// var conditionUrl = 'http://112.17.251.186:10088/?s=41|15&p=yhCategoryMulti&k=1&v=1&rootNode=FJXDF&catCode='//左侧筛选类型

var authUrl = 'http://ucas.a158.ottcn.com'//未来播放鉴权
var MBSUrl = "http://bms-i.yanhuamedia.tv/bms/u/user/auth"//黑白名单
var poweruUrl = "http://winnow-bs.yanhuamedia.tv/cq-login";//测试订购鉴权代理
var orderBaseUrl = "http://winnow-bs.yanhuamedia.tv/hainan_youkujx/source/pay/payfor/index.html";//测试订购支付地址

// 测试
var baseUrl = "http://47.97.96.103/?s=14|2&"; //主页入口
var historylUrl = "http://47.97.96.103/uds/cloud/collection"; //收藏  历史纪录接口

// 首页接口请求地址
if (!$.cookie('enterUrl')) {
  var url = baseUrl + "p=yhNavigationBar&k=1&v=1&catId=202196&c=2"
  $.cookie('enterUrl', url, {
    path: '/'
  })
}

//遥控器键值表
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
var onKeyPress
//按键prev处理函数
var grepEvent = function (e) {
  console.log(e.keyCode)
  if (e.keyCode == 8) {
    if (grepEvent.isPress) return; //节流
    grepEvent.isPress = true;
    setTimeout(function () {
      grepEvent.isPress = false;
    }, 180);
  }
  var keyCode = e.keyCode || e.which;
  return onKeyPress(KEYMAP[keyCode]);
}

/** 
 * 播放所需
 * 
 * **/
var playConfig = {
  isRelease: true,//// playConfig.isRelease   默认false 开发环境  true线上环境(内网)
  isOrder: '0',//1 鉴权通过  0 未订购
  isforbid: '0',//黑白名单 1 黑名单 2 白名单 0 普通用户
}

var yh = {}

var info = getStorage('AccountInfo') && JSON.parse(getStorage('AccountInfo'))
console.log("info" + JSON.stringify(info));
var device = getStorage('deviceInfo') && JSON.parse(getStorage('deviceInfo'))
console.log("device" + JSON.stringify(device))
try {
  yh.siteId = '42' // 站点ID

  //   yh.userId = info.userId || 123456; // 用户ID
  // yh.userId = 123456; // 用户ID

  yh.userId = info.userId || "13522071528"  // 用户ID

  yh.sys_v = 'hainan' // 系统版本

  yh.soft_v = '1.0.0' // 用户软件版本

  yh.device_id = device.eth0_mac;
  //yh.device_id = device.deviceId ; // 设备号获取不到取userId

  yh.operator_id = '' // 运营商ID（广电：1 电信：2 移动：3 联通：4）

  yh.terrace_id = '' // 平台ID(中兴：1 华为：2 烽火：3)

  yh.brand = '' // 机顶盒品牌

  yh.mode = device.model // 机顶盒型号

  yh.model = '' // 用户设备版本

  yh.softVname = device.softVName //终端版本号

  yh.apk_version = device.softVCode // apk版本

  yh.eth0_mac = device.eth0_mac // 盒子mac

  yh.ip = device.deviceIp //终端ip地址

  yh.reserve_group = '' // 采集方式

  yh.token = info.userToken // 用户令牌

  yh.stbId = device.stbId || "0032030000010040190258B42DCF510A" // 机顶盒号 

  yh.bizDomain = '' // 用户厂商orBMS站点

  yh.userGroup = info.userGroup || 'g29097100000' // 用户分组

  yh.productIds = '' // 用户已订购产品ID（多个以逗号隔开）

  yh.areaCode = info.cpCode // 用户区域

  yh.userName = '' // 用户名称

  yh.telephone = info.mobileNo // 联系电话

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

  yh.mac = "" // 设备mac地址
} catch (error) {
  console.log(error)
}

yh.userId = "0107978571726576928"
yh.stbId = "005103FF0001004019153050FD59C8D9"
yh.token = "57acc47e3adf3db2f43b470a6d71b6f022pb"

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

//广告日志
function adStat(parames) {
  // parames.content = uploadStr(parames.content)
  // parames.content = encodeURIComponent(parames.content)
  parames = JSON.stringify(parames);
  console.log(parames);
  submitPrompt('adStat', { jsonParam: parames, return: 'adStatCallBack' });
}
//日志
function stat(parames) {

  parames.content = uploadStr(parames.content)
  parames.content = encodeURIComponent(parames.content)
  parames = JSON.stringify(parames);
  console.log(parames);
  submitPrompt('stat', { jsonParam: parames, return: 'adStatCallBack' });
}

// 退出apk
function backApp() {
  try {
    if (getStorage('AccountInfo')) {
      var varsion = JSON.parse(getStorage('AccountInfo')).softVCode;
      var params = {
        type: 88,
        content: {
          type: 1
        }
      }
      adStat(params);
    }
  } catch (e) {
    console.log(e)
  }
  submitPrompt('exit');
}


// 同步订单    参数需要对接
function orderwork() {
  qrOrderId = 'T' + yh.stbId.substring(yh.stbId.length - 4) + Math.round(new Date().getTime() / 1000).toString()
  var params1 = { action: "1", platformCode: "54", version: "1", accountId: yh.userId }
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
        platformCode: "54",//业务平台
        transactionId: qrOrderId,//订单号
        accountId: yh.userId,//y用户账户
        userId: userId,//用户id
        userToken: userTokens,//用户令牌
        mac: yh.stbId,//mac
        // mac:"005803FF001827800005748F1B4F7B46",//mac
        productCode: yh.payForId,//产品编码
        payPlatform: 0,//支付方式 0：电话支付 3：二维码支付
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
    }, error: function (er) {
      console.log('鉴权失败');
      console.log(er)
    }
  })

}

var unity = { //公共方法区
  jsonp: function (url, successfn, errfn) { // 封装的jq jsonp 请求
    var urlString = url.toString();
    // if (urlString.indexOf("http://116.62.93.251/") !== -1) {
    //   urlString = urlString.replace('http://116.62.93.251/', 'http://112.17.251.186:10088/epg/')
    // }
    var jsonUrl = urlString + "&itemSort=1&returnType=jsonp"
    var successfn = successfn || function () { }
    var errfn = errfn || function () { }
    console.log(jsonUrl);
    // set()
    $.ajax({ // 入口数据
      type: "get",
      url: jsonUrl,
      dataType: "jsonp", //指定服务器返回的数据类型
      jsonp: 'jsonpCallback',
      jsonpCallback: 'callback' + new Date().getTime(),
      success: successfn,
      error: errfn
    });
  },
  playRecord: function (value, curPlayTime, itemNo) {
    console.log('调存历史记录方法')
    // 存播放历史记录
    var collectType = '3';
    var relateId = value.detailData.assetId;
    var relateTitle = value.detailData.assetName;
    var relateImg = value.detailData.assetImg;
    var relateUrl = value.detailUrl;
    var relateLayout = value.detailData.layout;
    var relateScore = value.detailData.score == undefined ? '' : value.detailData.score;
    var relateEpisode = itemNo + 1;
    var relateTime = curPlayTime;
    if (value.detailData.score && value.detailData.score.length == 1) {
      relateScore += '0'
    }
    var data = '{"siteId":' + '"' + yh.siteId + '"' + ',"relateEpisode":' + '"' + relateEpisode + '"' + ',"relateTime":' + '"' + relateTime + '"' + ',"userId":' + '"' + yh.userId + '"' + ',"collectType":' + '"' + collectType + '"' + ',"relateId":' + '"' + relateId + '"' + ',"relateTitle":' + '"' + relateTitle + '"' + ',"relateImg":' + '"' + relateImg + '"' + ',"relateUrl":' + '"' + relateUrl + '"' + ',"relateLayout":' + '"' + relateLayout + '"' + ',"relateScore":' + '"' + relateScore + '"' + '}';
    console.log(data)
    //{"siteId":"42","relateEpisode":"1","relateTime":"75463","userId":"13522071528","collectType":"3","relateId":"1553320","relateTitle":"蜘蛛侠：英雄远征","relateImg":"http://112.17.251.186:10090/img/201912/10/17/16/3/2019121017163747065e8970f.jpg","relateUrl":"http://112.17.251.186:10088/?s=42|17&p=yhAssetDetail&k=1&v=1&assetId=1553320&c=17","relateLayout":"Detail_Movie","relateScore":"6.6"}
    //{"siteId":"42","relateEpisode":"4","relateTime":"1289","userId":"13522071528","collectType":"3","relateId":"201610","relateTitle":"罐头视频","relateImg":"http://112.17.251.186:10090/img/201801/21/11/44/1/201801211144131808e3336ed.jpg","relateUrl":"http://112.17.251.186:10088/?s=42|17&p=yhAssetDetail&k=1&v=1&assetId=201610&c=17","relateLayout":"Detail_News","relateScore":"7.8"}
    var urls = historylUrl + '/collect?version=1';
    console.log("请求地址:" + urls)
    $.ajax({ // 入口数据
      type: "post",
      url: urls,
      contentType: "application/json; charset=utf-8",
      data: data,
      dataType: 'json',
      success: function (res) {
        console.log(JSON.stringify(res))
        $.cookie('payList', JSON.stringify(res), { path: '/' });
      },
      error: function () {
        unity.alertMsg("请求超时，请稍后再试。")
      }
    });
  },
  qeryHistory: function (CallBack) {
    // 查询播放记录
    console.log("调查询历史记录方法")
    var url = historylUrl + '/list?version=1&siteId=' + yh.siteId + '&userId=' + yh.userId + '&pindex=0' + '&psize=20' + '&collectType=3'
    $.ajax({ // 入口数据
      type: "get",
      url: url,
      contentType: "application/json; charset=utf-8",
      success: function (res) {
        console.log("111" + JSON.stringify(res))
        CallBack && CallBack(res)
      },
      error: function () {
        unity.alertMsg("请求超时，请稍后再试。")
        CallBack && CallBack('err')
      }
    })
  },
  qeryAllHistory: function (pindex, psize, CallBack) {
    // 查询播放记录
    console.log("调查询历史记录方法")
    var url = historylUrl + '/list?version=1&siteId=' + yh.siteId + '&userId=' + yh.userId + '&pindex=' + pindex + '&psize=' + psize + '&collectType=3'
    $.ajax({ // 入口数据
      type: "get",
      url: url,
      contentType: "application/json; charset=utf-8",
      success: function (res) {
        CallBack(res)
        console.log(JSON.stringify(res))
      },
      error: function () {
        unity.alertMsg("请求超时，请稍后再试。")
      }
    })
  },
  delAllHistory: function (successfn) {
    var url = historylUrl + "/del?version=1"
    var data = {
      siteId: yh.siteId,
      userId: yh.userId,
      collectType: 3
    }
    $.ajax({ // 入口数据
      type: "post",
      url: url,
      data: data,
      success: successfn,
      error: function () {
        unity.alertMsg("请求超时，请稍后再试。")
      }
    });
  },
  getPayDetail: function (assetId) {
    //根据assetId获取cookie储存播放记录
    unity.qeryHistory()
    var payList = $.cookie('payList') || '[]';
    payList = JSON.parse(payList);
    for (var i = 0; i < payList.length; i++) {
      if (payList[i].assetId == assetId) {
        return payList[i]
      }
    }
  },
  collectData: function (pindex, psize, successfn, errfn) {
    console.log("收藏数据");
    var url = historylUrl + "/list?version=1&siteId=" + yh.siteId + "&userId=" + yh.userId + "&collectType=1&pindex=" + pindex + "&psize=" + psize
    var jsonUrl = url + "&returnType=jsonp"
    var successfn = successfn || function () { }
    var errfn = errfn || function () { }
    $.ajax({ // 入口数据
      type: "get",
      url: jsonUrl,
      success: successfn,
      error: errfn
    });
  },

  delAllCollect: function (successfn) {
    var url = historylUrl + "/del?version=1"
    var data = {
      siteId: yh.siteId,
      userId: yh.userId,
      collectType: 1
    }
    $.ajax({ // 入口数据
      type: "post",
      url: url,
      data: data,
      success: successfn,
      error: function () {
        unity.alertMsg("请求超时，请稍后再试。")
      }
    });
  },
  isCollect: function (relateId, successfn, errfn) {
    console.log("判断收藏");
    var url = historylUrl + "/list?version=1&siteId=" + yh.siteId + "&userId=" + yh.userId + "&relateId=" + relateId + "&collectType=1"
    var jsonUrl = url + "&returnType=jsonp"
    var successfn = successfn || function () { }
    var errfn = errfn || function () { }
    $.ajax({ // 入口数据
      type: "get",
      url: jsonUrl,
      success: successfn,
      error: errfn
    });
  },

  addCollect: function (data, successfn) {
    var url = historylUrl + "/collect?version=1"
    console.log(data)
    $.ajax({ // 入口数据
      type: "post",
      url: url,
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify(data),
      dataType: 'json',
      success: successfn,
      error: function () {
        unity.alertMsg("请求超时，请稍后再试。")
      }
    });
  },
  delCollect: function (data, successfn) {
    var url = historylUrl + "/del?version=1"
    $.ajax({ // 入口数据
      type: "post",
      url: url,
      data: data,
      success: successfn,
      error: function () {
        unity.alertMsg("请求超时，请稍后再试。")
      }
    });
  },
  getHtmlDocName: function (str) {
    var item = str.substring(str.lastIndexOf("?"), str.length);
    var index = str.substring(str.lastIndexOf("/") + 1);
    index = index.substring(0, index.lastIndexOf("."));
    if (index == 'search') {
      index = '100-1'
    } else if (index == 'filter') {
      index = '102-1'
    } else if (index == 'historyHome') {
      var oGetVars = {};
      if (item.length > 1) {
        for (var aItKey, nKeyId = 0, aCouples = item.substr(1).split("&"); nKeyId < aCouples.length; nKeyId++) {
          aItKey = aCouples[nKeyId].split("=");
          oGetVars[decodeURIComponent(aItKey[0])] = aItKey.length > 1 ? decodeURIComponent(aItKey[1]) : "";
        }
      }
      //判断上个页面历史or收藏
      if (oGetVars['itemNo'] == 1) {
        index = '103-1'
      } else {
        index = '101-1'
      }
    } else {
      index = '105-1'
    }
    return index;
  },
  biOrder: function (type) {
    try {
      var param = {
        pkg_type: '1',
        pkg_id: 'productIDa3j00000000000000000957',
        // pkg_price: '20',
        action: '1',
        order_msg: type,//成功发送“1”，订购失败0
        parent_page_id: this.getHtmlDocName($.cookie("preURL")),
        parent_page_type: this.getHtmlDocName($.cookie("preURL")),
        preview: '0'
      }
      bi.order(param)
    } catch (e) {
      console.log('埋点异常')
    }
  },
  format: function (format) {
    var that = new Date()
    //eg:format="yyyy-MM-dd hh:mm:ss";

    if (!format) {
      format = "yyyy-MM-dd hh:mm:ss";
    }

    var o = {
      "M+": that.getMonth() + 1, // month
      "d+": that.getDate(), // day
      "H+": that.getHours(), // hour
      "h+": that.getHours(), // hour
      "m+": that.getMinutes(), // minute
      "s+": that.getSeconds(), // second
      "q+": Math.floor((that.getMonth() + 3) / 3), // quarter
      "S": that.getMilliseconds()
    };

    if (/(y+)/.test(format)) {
      format = format.replace(RegExp.$1, (that.getFullYear() + "")
        .substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
      if (new RegExp("(" + k + ")").test(format)) {
        format = format.replace(RegExp.$1, RegExp.$1.length == 1 ?
          o[k] :
          ("00" + o[k]).substr(("" + o[k]).length));
      }
    }

    return format;
  },
  fTime: function (T) { // 时间
    if (!T || T * 1 == 0 || T < 0) {
      return "00:00:00";
    }
    var H = Math.floor(T / 3600);
    var M = Math.floor((T % 3600) / 60);
    var S = Math.floor((T % 3600) % 60);
    H = H < 10 ? "0" + H : H;
    M = M < 10 ? "0" + M : M;
    S = S < 10 ? "0" + S : S;
    return [H, M, S].join(":");
  },

  pushcollect: function (url) { //给js加时间戳
    var jsurl = url + "?data=" + new Date().valueOf();
    $('<script type="text/javascript" src="' + jsurl + '"></script>').appendTo('body');
  },

  getVars: function (id) { //获取url内的拼接的参数
    var oGetVars = {};
    if (window.location.search.length > 1) { //从url里面拿到所需键值
      for (var aItKey, nKeyId = 0, aCouples = window.location.search.substr(1).split("&"); nKeyId < aCouples.length; nKeyId++) {
        aItKey = aCouples[nKeyId].split("=");
        oGetVars[decodeURIComponent(aItKey[0])] = aItKey.length > 1 ? decodeURIComponent(aItKey[1]) : "";
      }
    }
    return oGetVars[id]
  },
  cookieVars: function (id, cookieName) {
    var GetVars = {};
    var cookieUrl = $.cookie(cookieName).toString()
    if (cookieUrl) { //从url里面拿到所需键值
      for (var ItKey, KeyId = 0, Couples = cookieUrl.split("&"); KeyId < Couples.length; KeyId++) {
        ItKey = Couples[KeyId].split("=");
        GetVars[decodeURIComponent(ItKey[0])] = ItKey.length > 1 ? decodeURIComponent(ItKey[1]) : "";
      }
    }
    return GetVars[id]
  },
  alertMsg: function (msg) {
    console.log(msg)
    return
    var html = '<div style="position:absolute;top:400px;width:1280px;height:160px;text-align:center;z-index:999">' +
      '<div style=" display:inline-block; height:60px; line-height:60px;background:rgba(1,1,1,0.6); color:#fff; padding:0 20px; min-width:120px; text-align:center; font-size:22px; border-radius:5px;">' +
      msg +
      '</div></div>'
    var msgobj = $(html).appendTo("body");
    setTimeout(function () {
      $(msgobj).remove();
    }, 5000);
  },
};

(function ($) { //懒加载
  $.extend($, {
    imgLazyLoad: function () {
      var timer,
        len = $('img.lazyload').length;
      function getPos(node) {
        var scrollx = document.documentElement.scrollLeft || document.body.scrollLeft,
          scrollt = document.documentElement.scrollTop || document.body.scrollTop;
        var pos = node.getBoundingClientRect();
        return {
          top: pos.top + scrollt,
          right: pos.right + scrollx,
          bottom: pos.bottom + scrollt,
          left: pos.left + scrollx
        }
      }
      function loading() {
        timer && clearTimeout(timer);
        timer = setTimeout(function () {
          var scrollTop = document.documentElement.scrollTop || document.body.scrollTop,
            imgs = $('img.lazyload');
          screenHeight = document.documentElement.clientHeight;
          for (var i = 0; i < imgs.length; i++) {
            var pos = getPos(imgs[i]),
              posT = pos.top,
              posB = pos.bottom,
              screenTop = screenHeight + scrollTop + 300;//+300是因为适配中，实测大部分盒子此参数为550左右
            if ((posT > scrollTop && posT < screenTop) || (posB > scrollTop && posB < screenTop)) {
              imgs[i].src = imgs[i].getAttribute('data-img');
              $(imgs[i]).removeClass('lazyload');
            } else {
              new Image().src = imgs[i].getAttribute('data-img');
            }
          }
        }, 100);
      }
      if (!len) return;
      loading();
      $(window).on('scroll resize', function () {
        if (!$('img.lazyload').length) {
          return;
        } else {
          loading();
        }
      })
    }
  })
})($ || Zepto || jQuery)

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
  // alert(getId('toast'))
  setTimeout(function () {
    body.removeChild(getId('toast'));
  }, 5000);
}

function toastns(msg) {
  var div = document.createElement('div');
  var div1 = document.createElement('div');
  var body = document.body;
  if (getId('toast')) {
    body.removeChild(getId('toast'));
  }
  div.id = "toast";
  div.style.cssText = "position: absolute; top: 60%; left: 63%;  -webkit-transform: translate(-50%,-50%);-ms-transform: translate(-50%,-50%);transform:translate(-50%,-50%); text-align:center;z-index:999;word-break: break-all; word-wrap: break-word;";
  div1.style.cssText = "display:inline-block;background:rgba(1,1,1,0.6); color:#fff; padding:20px; min-width:120px; text-align:center; font-size:22px; border-radius:5px;height100%;width: 100%;word-wrap: break-word;";
  div1.textContent = msg;
  div.appendChild(div1);
  body.appendChild(div);
}

function setStorage(key, obj) {
  window.localStorage.setItem(key, obj)
}
function getStorage(key) {
  return window.localStorage.getItem(key) || ''
}
function delStorage(key) {
  window.localStorage.removeItem(key) || ''
}

// 登陆 测试环境先登陆，再鉴权订购
function login(callback, contentID) {

  try {
    var strXml = '<?xml version="1.0" encoding="UTF-8"?>' +
      '<message module="SCSP" version="1.1">' +
      '<header action="REQUEST" command="LOGINAUTH" />' +
      '<body>' +
      '<loginAuth loginType="5" account="0107978571726576928" password="576928" stbId="005103FF0001004019153050FD59C8D9" />' +
      ' </body>' +
      '</message>'
    console.log('登陆');
    $.ajax({ // 入口数据
      type: "post",
      url: poweruUrl,
      data: strXml,
      dataType: 'xml',
      success: function (res) {
        console.log(res)
        //   // + '" subContentId="' + subContentId+ '"  path="' + path+ '"  preview="' + preview + '" channelId="' + channelId + '" productId="' + productId + '" token="' + token
        //获取节点内容
        var domXml = res.getElementsByTagName("loginAuth")[0];
        // yh.userId = domXml.getAttribute('userId');
        // yh.stbId = domXml.getAttribute('messagePassword');
        // yh.token = domXml.getAttribute('token');

        yh.userId = domXml.getAttribute('userId');
        yh.stbId = domXml.getAttribute('messagePassword');
        yh.token = domXml.getAttribute('token');
        userPower(callback, contentID);
      },
      error: function () {
        callback && callback();
        console.log('登陆err')
      }
    });
  } catch (e) {
    console.log(e)
  }
}

//BMS对接
function userBMS(callback, contentId) {
  //黑白名单
  var action = '1';//1：用户账号认证； 2：用户MAC认证；3：用户账号+mac认证
  var version = '1'
  var platformCode = yh.siteId//站点id
  var accountId = yh.telephone;
  var url = MBSUrl + "?action=" +
    action + "&platformCode=" + platformCode + "&version=" + version + "&accountId=" + accountId;
  console.log('黑白名单url===' + url)
  $.ajax({ // 入口数据
    type: "GET",
    url: url,
    contentType: "application/json; charset=utf-8",
    success: function (res) {
      // toast(response);
      console.log('黑白名单请求数据===' + response)
      response = JSON.parse(response);
      if (response.code == '200') {
        //specialType 是否白名单 1，黑名单；2，白名单
        if (response.data.specialType && response.data.specialType == 1) {
          playConfig.isforbid = '1';
          callback && callback();
        } else if (response.data.specialType && response.data.specialType == 2) {
          // 白名单
          playConfig.isforbid = '2';
          playConfig.isOrder = '1';
          $.cookie('isOrder', '1', {
            path: '/'
          })
          callback && callback();
        } else {
          userPower(callback, contentId)
        }
      } else {
        userPower(callback, contentId)
      }
    },
    error: function () {
      userPower(callback, contentId)
    }
  })
}
//鉴权
function userPower(callback, contentId) {
  //接口文档有，但是未使用参数
  // var subContentId = "";
  // var path = "";
  // var productId = "";
  // var token = "";
  try {
    playConfig.isOrder = '0';
    $.cookie('isOrder', 0, {
      path: '/'
    })
    var userId = yh.userId;
    var terminalId = yh.stbId;
    var token = yh.token;
    var copyRightId = '698057';
    // var contentId = contentId;
    // var userId = '0102327570788553510';
    // var terminalId = '005103FF0001004019153050FD59C8D9';
    // var token = '9977759376bb06cc5699fd30cde867c122vv';
    var contentId = '1584410951014';

    var channelId = "00001";
    var systemId = "1";
    var consumeLocal = "22";
    var consumeScene = "01";
    var consumeBehaviour = "02";
    var preview = "0";
    var productId = "";
    var subContentId = ''
    // var copyRightContentId = 4
    var strXml = '<?xml version="1.0" encoding="UTF-8"?>' +
      '<message module="SCSP" version="1.1">' +
      '<header action="REQUEST" command="AUTHORIZE" />' +
      '<body>' +
      '<authorize userId="' + userId + '" terminalId="' + terminalId + '" contentId="' + contentId +
      '" subContentId="" systemId="' + systemId + '" consumeLocal="' + consumeLocal + '" consumeScene="' + consumeScene +
      '" consumeBehaviour="' + consumeBehaviour + '" path="" preview="' + preview + '" channelId="' + channelId +
      '" productId="' + productId + '" copyRightId="' + copyRightId + '" token="' + token + '" />' +
      '</body>' +
      '</message>'
    // var strXml = '<?<message module="SCSP" version="1.1"><header action="REQUEST" command="AUTHORIZE" /><body><authorize userId="0107978571726576928" terminalId="005103FF0001004019153050FD59C8D9" contentId="1571733697433" subContentId="" systemId="1" consumeLocal="22" consumeScene="01" consumeBehaviour="02" path="" preview="0" channelId="" productId="" token="e4b832af0da493011f7189e3ba7a585f22pb" /></body></message>'
    console.log('鉴权');
    console.log(strXml);
    $.ajax({ // 入口数据
      type: "post",
      url: poweruUrl,
      data: strXml,
      dataType: 'xml',
      success: function (response) {
        if (!response) {
          callback && callback();
          return
        }
        console.log(response)
        //获取节点内容
        var domXml = response.getElementsByTagName("authorize")[0]
        //0：鉴权成功1：鉴权失败需要订购  10: 用户未登录 20：账户的计费标识需要验证 30：您的帐户不能消费 31：对应牌照方没可计费的产品 50:试看鉴权通过
        // var accountIdentify = domXml.getAttribute('accountIdentify');
        // var productCode = domXml.getAttribute('productCode');
        var result = domXml.getAttribute('result')
        var resultDesc = domXml.getAttribute('resultDesc');
        var productCode = domXml.getAttribute('productCode');
        // playConfig.powerParam = window.btoa()
        $.cookie('resultDesc', productCode, {
          path: '/'
        })
        if (result == 0 || result == 50) {
          //鉴权成功
          playConfig.isOrder = '1';
          var isOrder = '1'
          $.cookie('isOrder', isOrder, {
            path: '/'
          })
        }
        //点击订购按钮才会触发

        if ($.cookie("clickOrder") == '1') {
          if (playConfig.isOrder == '1') {
            // 订购成功上报
            try {
              var param = {
                pkg_type: '2',
                pkg_id: encodeURI(productCode),
                operator_id: '',
                order_msg: '1',
                parent_page_id: $.cookie("orderPkg"),
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
              $.cookie('resultDesc', productCode, { path: '/' })
              var param = {
                pkg_type: '2',
                pkg_id: '',
                operator_id: '',
                order_msg: encodeURIComponent('订购失败'),
                parent_page_id: $.cookie("orderPkg"),
                parent_page_type: '0301',
                point: '1'
              }
              bi.order(param)
            } catch (error) {
              console.log('埋点错误', error)
            }
          }
          $.removeCookie('clickOrder')
        }
        callback && callback();

      },
      error: function () {
        callback && callback();
        var productCode = '';
        $.cookie('resultDesc', productCode, { path: '/' })
        console.log("error")
        if ($.cookie("clickOrder") == '1') {
          // 订购失败上报
          try {
            var param = {
              pkg_type: '2',
              pkg_id: '',
              operator_id: '',
              order_msg: encodeURIComponent('订购失败'),
              parent_page_id: $.cookie("orderPkg"),
              parent_page_type: '0301',
              point: '1'
            }
            bi.order(param)
          } catch (error) {
            console.log('埋点错误', error)
          }
          $.removeCookie('clickOrder')
        }
      }
    });
  } catch (e) {
    callback && callback();
    console.log(e)
  }
}
//订购

function unifiedOrder(contentId) {
  if (playConfig.isOrder == "1") {
    toast("已订购")
    return
  }
  $.cookie('clickOrder', "1", {
    path: '/'
  })
  // var userId = yh.userId;
  // var terminalId = yh.stbId;
  // var token = yh.token;
  var userId = yh.userId;
  var terminalId = yh.stbId;
  var token = yh.token;

  var contentId = '1584410951014';
  // var userId = '0102327570788553510';
  // var terminalId = '005103FF0001004019153050FD59C8D9';
  // var token = '9977759376bb06cc5699fd30cde867c122vv';

  var copyRightId = "698057";
  var channelId = '00001';
  var systemId = "0";
  var consumeLocal = "22";
  var consumeScene = "01";
  var consumeBehaviour = "02";
  var preview = "0";
  var productId = "";
  var subContentId = ''
  var backUrl = window.location.href.split('?')[0];
  window.location.href = orderBaseUrl + '?' +
    'userId=' + userId + '&terminalId=' + terminalId + '&token=' + token + '&contentId=' + contentId + '&copyRightId=' + copyRightId +
    '&channelId=' + channelId + '&systemId=' + systemId + '&consumeLocal=' + consumeLocal + '&consumeScene=' + consumeScene +
    '&consumeBehaviour=' + consumeBehaviour + '&preview=' + preview + '&productId=' + productId + '&subContentId=' + subContentId +
    '&returnUrl=' + backUrl;
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
//播放分秒计算
function secondToDate(result) {
  var h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600);
  var m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60));
  var s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60));
  var str = '';
  if (h != '00') {
    m = Number(m) + h * 60
  }
  str += h + ":" + m + ":" + s;
  return str
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