var SERVER_HOST = "http://" + location.host;
var SERVER_PATH = location.pathname.substring(0, location.pathname.lastIndexOf("/"));

var yh = {
  siteId: "22",
  userId: "123456"

}

var ptJson = {
  //设置模式
  ptStyle: "RELEASE",
  ptHost: function () {
    if (this.ptStyle == "RELEASE") {
      //发布模式
      return "";
    } else if (this.ptStyle == "DEV") {
      //开发模式
      return "http://47.97.96.103";
    }
  }
};

try {
  if ($.cookie('isOrder') == 1) {
    yh.vip = '1'
  } else {
    yh.vip = '0'
  }
  if (Authentication.CTCGetConfig("UserID")) {
    yh.userId = Authentication.CTCGetConfig("UserID");
  }
} catch (error) {
  console.log(error);
}


//遥控器键值表
var KEYMAP = {
  48: "0",
  49: "1",
  50: "2",
  51: "3",
  52: "4",
  53: "5",
  54: "6",
  55: "7",
  56: "8",
  57: "9",
  38: "up",
  40: "down",
  37: "left",
  39: "right",
  13: "enter",
  8: "back",
  58: "iptv",
  263: "play", // 暂停播放-小遥控器
  270: "play", // 中兴播放键 （几个播放键之间会不会有冲突）？
  86: "play", // 创维播放键
  264: "forward", // 创维快进
  265: "rewind", // 创维快退
  181: "home", //../index_epg.html
  97: "1",
  257: "channelplus", // 频道加
  258: "channelminus", // 频道减
  261: "mute", //静音
  209: "soundtrack", // 声道
  259: "volumeplus", // 音量加
  260: "volumeminus", // 音量减
  275: "live", // 直播
  276: "review", // 回看
  277: "vod", // 点播
  278: "message", // 信息
  272: "home",
  280: "refresh", // 刷新
  0x0300: "iptv",
};
//按键分发事件
var onKeyPress;
//按键prev处理函数
var grepEvent = function (e) {
  if (e.keyCode == 8) {
    if (grepEvent.isPress) return; //节流
    grepEvent.isPress = true;
    setTimeout(function () {
      grepEvent.isPress = false;
    }, 180);
  }
  var keyCode = e.keyCode || e.which;
  return onKeyPress(KEYMAP[keyCode]);
};
var unity = { //公共方法区
  jsonp: function (url, successfn, errfn) { // 封装的jq jsonp 请求
    var urlString = url.toString();
    if (urlString.indexOf("http://116.62.93.251/") !== -1) {
      urlString = urlString.replace('http://116.62.93.251/', 'http://202.100.133.115:10324/epg/')
    }
    var jsonUrl = urlString + "&itemSort=1&returnType=jsonp"
    var successfn = successfn || function () { }
    var errfn = errfn || function () { }
    console.log(jsonUrl);
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
  uploadPayList: function (item) {
    //储存播放记录
    // unity.uploadPayList({assetId:'2204',g_palylong:2000,contentNum:100})
    var payList = $.cookie('payList') || '[]';
    payList = JSON.parse(payList);
    item.g_palylong = item.g_palylong || 0;
    item.contentNum = item.contentNum || 1;
    payList.push(item);
    var tmpObj = {};
    var result = [];
    for (var i = 0; i < payList.length; i++) {
      var key = (typeof payList[i].assetId) + payList[i].assetId;
      if (!tmpObj[key]) {
        tmpObj[key] = true;
        result.push(payList[i]);
      } else {
        for (var j = 0; j < result.length; j++) {
          if (item.assetId == result[j].assetId) {
            result.splice(j, 1);
            result.push(payList[i]);
          }
        }
      }
    }
    if (result.length >= 9) {
      result.shift();
    }
    $.cookie('payList', JSON.stringify(result), { path: '/' });
  },
  getPayDetail: function (assetId) {
    //根据assetId获取cookie储存播放记录
    var payList = $.cookie('payList') || '[]';
    payList = JSON.parse(payList);
    for (var i = 0; i < payList.length; i++) {
      if (payList[i].assetId == assetId) {
        return payList[i]
      }
    }
  },
  collectData: function (pindex, psize, successfn, errfn) {
    var header = ptJson.ptHost();
    console.log("收藏数据");
    var url = header + "/uds/cloud/collection/list?version=1&siteId=" + yh.siteId + "&userId=" + yh.userId + "&collectType=1&pindex=" + pindex + "&psize=" + psize
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
    var header = ptJson.ptHost();
    var url = header + "/uds/cloud/collection/del?version=1"
    var data = {
      siteId: yh.siteId,
      userId: yh.userId,
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
    var header = ptJson.ptHost();
    var url =
      header + "/uds/cloud/collection/list?version=1&siteId=" + yh.siteId + "&userId=" + yh.userId +
      "&relateId=" + relateId + "&collectType=1"
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
    var header = ptJson.ptHost();
    var url = header + "/uds/cloud/collection/collect?version=1"
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
    var header = ptJson.ptHost();
    var url = header + "/uds/cloud/collection/del?version=1"
    $.ajax({ // 入口数据
      type: "post",
      url: url,
      data: data,
      success: successfn,
      error: function () {
        unity.alertMsg("请求超时，请稍微再试。")
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
    // * 支付
    // * pkg_type 产品包类型
    // * pkg_id 产品包ID
    // * pkg_price 产品包价格
    // * action 订购动作 1订购，0退订
    // * order_msg 订购信息
    // * parent_page_id 父级页面ID
    // * parent_page_type 父级页面类型
    // * preview 试看类型 1 试看 0 否


    // QH影视优酷专区xxx元续包月	productIDa3j00000000000000001006
    // QH影视优酷专区20元续包月	productIDa3j00000000000000000957
    // QH影视优酷专区59元包季	productIDa3j00000000000000000958
    // QH影视优酷专区99元包半年	productIDa3j00000000000000000959
    // QH影视优酷专区189元包年	productIDa3j00000000000000000960

    // var list = [
    //   { pic: 20, productID: 'productIDa3j00000000000000001006' },
    //   { pic: 20, productID: 'productIDa3j00000000000000000957' },
    //   { pic: 59, productID: 'productIDa3j00000000000000000958' },
    //   { pic: 99, productID: 'productIDa3j00000000000000000959' },
    //   { pic: 189, productID: 'productIDa3j00000000000000000960' }
    // ]

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
  userPower: function (callback, contentId, contentName) {
    //鉴权订购关系
    $.cookie('isOrder', 0, {
      path: '/'
    })
    try {
      var userID = Authentication.CTCGetConfig("UserID");
      var userToken = Authentication.CTCGetConfig("UserToken");
    } catch (error) { }

    var spID = "spaj0104";
    var number = unity.uuid(18, 10);
    var transactionID = spID + unity.format("yyyyMMddHHmmss") + number;
    var contentName = encodeURIComponent('contentName');
    // var text = 'userID=' + userID + '$userToken=' + userToken + '$timeStamp=' + unity.format("yyyyMMddHHmmss");
    var text = 'userID=' + userID + '$userToken=' + userToken + '$contentID=' + contentId;
    var key = "pW0s6g8190g5C3cL9428864a";
    var authenticator = encodeURIComponent(unity.encryptByDES(text, key));

    var postUrl = "http://202.100.133.115:8296/OrderQuery?transactionID=" + transactionID + "&SPID=" + spID +
      "&INFO=" + authenticator; // 测试
    $.ajax({ // 入口数据
      type: "post",
      url: postUrl,
      success: function (res) {
        var resData = res
        unity.alertMsg(res);

        // $.cookie('isOrder', 1, {
        //   path: '/'
        // })
        callback && callback();
      },
      error: function (res) {
        unity.alertMsg(JSON.stringify(res));
        console.log(res);
        callback && callback();
      }
    });
  },
  order: function (returnURL) {
    console.log("前往订购");
    var orderImg = window.location.href.split("/source")[0] + '/source/public/images/order-bg.jpg';
    var spID = "spaj0104"
    var number = this.uuid(18, 10)
    var transactionID = spID + this.format("yyyyMMddHHmmss") + number
    var userID = Authentication.CTCGetConfig('UserID')
    var productID = 'productIDa3j00000000000000000957,productIDa3j00000000000000000958,productIDa3j00000000000000000959,productIDa3j00000000000000000960';
    var text = 'userID=' + userID + '$userToken$productID=' + productID
    var key = "pW0s6g8190g5C3cL9428864a"
    //秘钥key
    console.log('加密前明文:' + text);
    var authenticator = encodeURIComponent(this.encryptByDES(text, key))
    //测试订购
    // var url = 'http://202.100.133.115:9298/AuthOrderQh?version=1.0&transactionID=' + transactionID + '&spID=' + spID + '&authenticator=' + authenticator + '&picUrl=' + orderImg + '&returnUrl=' + returnURL
    //  正式订购接口
    var url = 'http://202.100.133.115:8296/AuthOrderQh?version=1.0&transactionID=' + transactionID + '&spID=' + spID + '&authenticator=' + authenticator + '&picUrl=' + orderImg + '&returnUrl=' + returnURL
    window.location = url
  },
  up: function () {
    //鉴权订购关系
    try {
      var userID = Authentication.CTCGetConfig("UserID");
      var userToken = Authentication.CTCGetConfig("UserToken");
      var backUrl = Authentication.CTCGetConfig("EPGDomain")
    } catch (error) { }
    var spID = "spaj0104";
    var number = unity.uuid(18, 10);
    var transactionID = spID + unity.format("yyyyMMddHHmmss") + number;
    var text = 'userID=' + userID + '$userToken=' + userToken + '$timeStamp=' + unity.format("yyyyMMddHHmmss");
    var key = "pW0s6g8190g5C3cL9428864a";
    var authenticator = encodeURIComponent(unity.encryptByDES(text, key));
    var postUrl = "http://202.100.133.115:8296/OrderQuery?transactionID=" + transactionID + "&SPID=" + spID +
      "&INFO=" + authenticator; // 测试
    $.ajax({ // 入口数据
      type: "post",
      url: postUrl,
      success: function (res) {
        var resData = res
        if (resData.indexOf("productIDa3j0000000000000000") != -1) {
          $.cookie('isOrder', 1, {
            path: '/'
          })
        } else {
          $.cookie('isOrder', 0, {
            path: '/'
          })
        }
      },
      error: function (res) { }
    });
  },
  encryptByDES: function (message, key) {
    var base64 = CryptoJS.enc.Utf8.parse(key)
    var encrypted = CryptoJS.TripleDES.encrypt(message, base64, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });

    return encrypted.toString();
  },
  decryptByJS: function (message, key) {
    var keys = key.split(":");
    var userCharArr = message.split('');
    var result = "";
    try {
      for (var i = 0; i < userCharArr.length; i++) {
        if ((i + 1) % 2 == 1) {
          console.log(+userCharArr[i].charCodeAt());
          userCharArr[i] = String.fromCharCode(userCharArr[i].charCodeAt() + parseInt(keys[1]));
        } else {
          console.log(userCharArr[i]);
          userCharArr[i] = String.fromCharCode(userCharArr[i].charCodeAt() - parseInt(keys[1]));
        }
      }
      for (var j = 0; j < userCharArr.length; j++)
        result += userCharArr[j];
    } catch (e) {
      // 异常处理.
      console.log('处理用户信息解密异常' + e);
    }
    console.log('result：' + result);
    var m1 = result.substring(0, userCharArr.length - parseInt(keys[0]));
    var m2 = result.substring(userCharArr.length - parseInt(keys[0]), userCharArr.length);

    var s = 0, e = m1.length - 1;
    var us = m1.split('');
    while (s < e) {
      var temp = us[e];
      us[e] = us[s];
      us[s] = temp;
      s++;
      e--;
    }
    m1 = "";
    for (var i = 0; i < us.length; i++) {
      m1 += us[i];
    }
    result = m2 + m1;
    return result
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
    var html = '<div style="position:absolute;top:400px;width:1280px;height:160px;text-align:center;z-index:999">' +
      '<div style=" display:inline-block; height:60px; line-height:60px;background:rgba(1,1,1,0.6); color:#fff; padding:0 20px; min-width:120px; text-align:center; font-size:22px; border-radius:5px;">' +
      msg +
      '</div></div>'
    var msgobj = $(html).appendTo("body");
    setTimeout(function () {
      $(msgobj).remove();
    }, 5000);
  },


  uuid: function (len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [],
      i;
    radix = radix || chars.length;

    if (len) {
      // Compact form
      for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
      var r;

      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random() * 16;
          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
      }
    }

    return uuid.join('');
  }
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
              screenTop = screenHeight + scrollTop;
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
})($ || Zepto || jQuery);