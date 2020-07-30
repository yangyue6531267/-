;
(function (win) {
  var Base64 = {

    // private property
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    // public method for encoding
    encode: function (input) {
      var output = "";
      var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
      var i = 0;

      input = Base64._utf8_encode(input);

      while (i < input.length) {

        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
          enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
          enc4 = 64;
        }

        output = output +
          this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
          this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

      }

      return output;
    },

    // public method for decoding
    decode: function (input) {
      var output = "";
      var chr1, chr2, chr3;
      var enc1, enc2, enc3, enc4;
      var i = 0;

      input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

      while (i < input.length) {

        enc1 = this._keyStr.indexOf(input.charAt(i++));
        enc2 = this._keyStr.indexOf(input.charAt(i++));
        enc3 = this._keyStr.indexOf(input.charAt(i++));
        enc4 = this._keyStr.indexOf(input.charAt(i++));

        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;

        output = output + String.fromCharCode(chr1);

        if (enc3 != 64) {
          output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
          output = output + String.fromCharCode(chr3);
        }

      }

      output = Base64._utf8_decode(output);

      return output;

    },

    // private method for UTF-8 encoding
    _utf8_encode: function (string) {
      string = string.replace(/\r\n/g, "\n");
      var utftext = "";

      for (var n = 0; n < string.length; n++) {

        var c = string.charCodeAt(n);

        if (c < 128) {
          utftext += String.fromCharCode(c);
        } else if ((c > 127) && (c < 2048)) {
          utftext += String.fromCharCode((c >> 6) | 192);
          utftext += String.fromCharCode((c & 63) | 128);
        } else {
          utftext += String.fromCharCode((c >> 12) | 224);
          utftext += String.fromCharCode(((c >> 6) & 63) | 128);
          utftext += String.fromCharCode((c & 63) | 128);
        }

      }

      return utftext;
    },

    // private method for UTF-8 decoding
    _utf8_decode: function (utftext) {
      var string = "";
      var i = 0;
      var c = c1 = c2 = 0;

      while (i < utftext.length) {

        c = utftext.charCodeAt(i);

        if (c < 128) {
          string += String.fromCharCode(c);
          i++;
        } else if ((c > 191) && (c < 224)) {
          c2 = utftext.charCodeAt(i + 1);
          string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
          i += 2;
        } else {
          c2 = utftext.charCodeAt(i + 1);
          c3 = utftext.charCodeAt(i + 2);
          string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
          i += 3;
        }

      }

      return string;
    }

  }

  var AndroidHtml5 = {
    idCounter: 0, // 参数序列计数器  
    OUTPUT_RESULTS: {}, // 输出的结果         
    CALLBACK_SUCCESS: {}, // 输出的结果成功时调用的方法          
    CALLBACK_FAIL: {}, // 输出的结果失败时调用的方法  

    callNative: function (cmd, type, args, success, fail) {
      var key = "ID_" + (++this.idCounter);
      console.log("cmd:" + JSON.stringify(cmd))

      if (typeof success != 'undefined') {
        AndroidHtml5.CALLBACK_SUCCESS[key] = success;
      } else {
        AndroidHtml5.CALLBACK_SUCCESS[key] = function (result) { };
      }

      if (typeof fail != 'undefined') {
        AndroidHtml5.CALLBACK_FAIL[key] = fail;
      } else {
        AndroidHtml5.CALLBACK_FAIL[key] = function (result) { };
      }
      window.sysmisc.async(JSON.stringify(cmd), type, JSON.stringify(args), key);
      return this.OUTPUT_RESULTS[key];
    },
    callWebService: function (url, nameSpace, methodName, serviceName, property, success, fail) {
      var key = "ID_" + (++this.idCounter);
      if (typeof success != 'undefined') {
        AndroidHtml5.CALLBACK_SUCCESS[key] = success;
      } else {
        AndroidHtml5.CALLBACK_SUCCESS[key] = function (result) { };
      }

      if (typeof fail != 'undefined') {
        AndroidHtml5.CALLBACK_FAIL[key] = fail;
      } else {
        AndroidHtml5.CALLBACK_FAIL[key] = function (result) { };
      }
      var property_string = JSON.stringify(property);
      window.sysmisc.asyncWebService(url, nameSpace, methodName, serviceName, property_string, key);
      return this.OUTPUT_RESULTS[key];
    },

    callBackJs: function (result, type, key) {
      if (type == "json") {
        this.OUTPUT_RESULTS[key] = result;
        var status = result.status;
        console.log(status);
        if (status == 200) {
          console.log(typeof this.CALLBACK_SUCCESS[key]);
          if (typeof this.CALLBACK_SUCCESS[key] != "undefined") {
            //setTimeout("AndroidHtml5.CALLBACK_SUCCESS['" + key + "']("+result.message+")", 0);
            AndroidHtml5.CALLBACK_SUCCESS[key](result.message);
          }
        } else {
          if (typeof this.CALLBACK_FAIL != "undefined") {
            setTimeout("AndroidHtml5.CALLBACK_FAIL['" + key + "'](" + result.message + ")", 0);
          }
        }
      } else {
        console.log('result key:' + key)
        this.OUTPUT_RESULTS[key] = result;
        var obj = eval('(' + result + ')');
        var message = Base64.decode(obj.message);
        console.log('result message:' + message)
        var status = obj.status;
        if (status == 200) {
          if (typeof this.CALLBACK_SUCCESS[key] != "undefined") {
            setTimeout("AndroidHtml5.CALLBACK_SUCCESS['" + key + "']('" + message + "')", 0);
          }
        } else {
          if (typeof this.CALLBACK_FAIL != "undefined") {
            setTimeout("AndroidHtml5.CALLBACK_FAIL['" + key + "']('" + message + "')", 0);
          }
        }
      }
    },
    callWebServiceBackJs: function (result, key) {
      this.OUTPUT_RESULTS[key] = result;
      console.log(key);
      console.log(typeof (result));
      var obj = eval('(' + result + ')');
      var status = obj.code;
      console.log(status);
      if (status == 200) {
        console.log(typeof this.CALLBACK_SUCCESS[key]);
        if (typeof this.CALLBACK_SUCCESS[key] != "undefined") {
          console.log(typeof ("AndroidHtml5.CALLBACK_SUCCESS['" + key + "']('" + result + "')"));
          setTimeout("AndroidHtml5.CALLBACK_SUCCESS['" + key + "']('" + result + "')", 0);
        }
      } else {
        if (typeof this.CALLBACK_FAIL != "undefined") {
          console.log("AndroidHtml5.CALLBACK_FAIL['" + key + "']('" + result + "')");
          setTimeout("AndroidHtml5.CALLBACK_FAIL['" + key + "']('" + result + "')", 0);
        }
      }
    }
  };


  var exec_asyn = function exec_asyn(service, action, type, args, success, fail) {
    var json = {
      "service": service,
      "action": action
    };
    var result = AndroidHtml5.callNative(json, type, args, success, fail);
  }


  var bridge = {}
  bridge.getwebservice = function (url, nameSpace, methodName, serviceName, property, success, fail) {
    AndroidHtml5.callWebService(url, nameSpace, methodName, serviceName, property, success, fail);
  }
  bridge.get = function (url, mediatype, header, success, fail) {

    exec_asyn("request", "", "json", {
      "url": url,
      "method": "get",
      "mediatype": mediatype
    },
      success,
      function () {
        sysmisc.showToast("系统忙,请稍候重试。");
      })

  }

  bridge.post = function (url, mediatype, header, body, success, fail) {

    exec_asyn("request", "", "json", {
      "url": url,
      "method": "post",
      "mediatype": mediatype,
      "body": body,
      "header": header
    },
      success,
      function () {
        sysmisc.showToast("系统忙,请稍候重试。");
      })

  }

  bridge.ajax = function (method, url, mediatype, header, body, success, fail) {
    if (arguments.length < 4) { /*兼容旧传参格式url,success,body*/
      bridge.ajax('post', method, 'text/xml', null, mediatype, url, null)
      return;
    }
    var o = {
      "url": url,
      "method": method.toLowerCase(),
      "mediatype": mediatype || "application/json",
      "body": body || null,
      "header": header || null
    };
    if (method != 'post') {
      delete o.body;
      delete o.header;
    };
    exec_asyn(
      "request",
      "",
      "json",
      o,
      success || function () {
        sysmisc.showToast("success");
      },
      fail || function () {
        sysmisc.showToast("系统忙,请稍候重试。");
      }
    )
  }

  bridge.getstring = function (url, mediatype, header, success, fail) {

    exec_asyn("request", "", "string", {
      "url": url,
      "method": "get",
      "mediatype": mediatype
    },
      success,
      function () {
        sysmisc.showToast("系统忙,请稍候重试。");
      })

  }

  bridge.poststring = function (url, mediatype, header, body, success, fail) {

    exec_asyn("request", "", "string", {
      "url": url,
      "method": "post",
      "mediatype": mediatype,
      "body": body,
      "header": header
    },
      success,
      function () {
        sysmisc.showToast("系统忙,请稍候重试。");
      })

  }

  bridge.ajaxstring = function (method, url, mediatype, header, body, success, fail) {
    if (arguments.length < 4) { /*兼容旧传参格式url,success,body*/
      bridge.ajax('post', method, 'text/xml', null, mediatype, url, null)
      return;
    }
    var o = {
      "url": url,
      "method": method.toLowerCase(),
      "mediatype": mediatype || "application/json",
      "body": body || null,
      "header": header || null
    };
    if (method != 'post') {
      delete o.body;
      delete o.header;
    };
    exec_asyn(
      "request",
      "",
      "string",
      o,
      success || function () {
        sysmisc.showToast("success");
      },
      fail || function () {
        sysmisc.showToast("系统忙,请稍候重试。");
      }
    )
  }

  bridge.version = 2;
  window.bridge = bridge;
  window.AndroidHtml5 = AndroidHtml5;

  console.log('bridge.js init complete')
})(window);

function joinStr(e) {
  var t = [];
  for (var i in e) {
    t[t.length] = i + "=" + encodeURIComponent(e[i])
  }
  return t.join("&").replace(/%20/g, "+").replace(/%25/g, "%")
}

function urlJoin(e, t) {
  for (var i = 1, n = arguments.length; i < n; i++) {
    var s = arguments[i];
    if (s !== undefined) {
      if (s.indexOf("?") === 0 || s.indexOf("&") === 0) s = s.substr(1);
      var r = i > 1 ? "&" : e.indexOf("?") > -1 ? "&" : "?";
      e += r + s
    }
  }
  return e;
}

function setCookie(cname, cvalue, exdays) {
  if (exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
  } else {
    document.cookie = cname + "=" + cvalue + ";"
  }
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i].trim();
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
/**
 *查询url参数
 */
function getQueryStr(_url, _param) {
  var rs = new RegExp("(^|)" + _param + "=([^\&]*)(\&|$)", "g").exec(_url),
    tmp;
  if (tmp = rs) {
    return tmp[2];
  }
  return "";
}

/**
 * base 64加密
 */

function Base64() {
  // private property  
  _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

  // public method for encoding  
  this.encode = function (input) {
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;
    input = _utf8_encode(input);
    while (i < input.length) {
      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);
      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;
      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }
      output = output +
        _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
        _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
    }
    return output;
  }

  // public method for decoding  
  this.decode = function (input) {
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    while (i < input.length) {
      enc1 = _keyStr.indexOf(input.charAt(i++));
      enc2 = _keyStr.indexOf(input.charAt(i++));
      enc3 = _keyStr.indexOf(input.charAt(i++));
      enc4 = _keyStr.indexOf(input.charAt(i++));
      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;
      output = output + String.fromCharCode(chr1);
      if (enc3 != 64) {
        output = output + String.fromCharCode(chr2);
      }
      if (enc4 != 64) {
        output = output + String.fromCharCode(chr3);
      }
    }
    output = _utf8_decode(output);
    return output;
  }

  // private method for UTF-8 encoding  
  _utf8_encode = function (string) {
    string = string.replace(/\r\n/g, "\n");
    var utftext = "";
    for (var n = 0; n < string.length; n++) {
      var c = string.charCodeAt(n);
      if (c < 128) {
        utftext += String.fromCharCode(c);
      } else if ((c > 127) && (c < 2048)) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      } else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }

    }
    return utftext;
  }

  // private method for UTF-8 decoding  
  _utf8_decode = function (utftext) {
    var string = "";
    var i = 0;
    var c = c1 = c2 = 0;
    while (i < utftext.length) {
      c = utftext.charCodeAt(i);
      if (c < 128) {
        string += String.fromCharCode(c);
        i++;
      } else if ((c > 191) && (c < 224)) {
        c2 = utftext.charCodeAt(i + 1);
        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
        i += 2;
      } else {
        c2 = utftext.charCodeAt(i + 1);
        c3 = utftext.charCodeAt(i + 2);
        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
        i += 3;
      }
    }
    return string;
  }
}

function format(item) {
  if (Number(item) < 10) {
    return '0' + item;
  } else {
    return item
  }
}
function timeFormat() {
  var date = new Date();
  var y = date.getFullYear();
  var m = date.getMonth() + 1 <= 9 ? '0' + date.getMonth() + 1 : date.getMonth() + 1;
  var d = date.getDate() <= 9 ? '0' + date.getDate() : date.getDate();
  var h = date.getHours() <= 9 ? '0' + date.getHours() : date.getHours();
  var i = date.getMinutes() <= 9 ? '0' + date.getMinutes() : date.getMinutes();
  var s = date.getSeconds() <= 9 ? '0' + date.getSeconds() : date.getSeconds();
  y = y.toString().substr(2, y.toString().length - 1);
  return y + m.toString() + d.toString() + h.toString() + i.toString() + s.toString();
}
/* ***************************************取播放串********************************************** */

function getObject(vod_id, typeId, flag) {
  var p = {
    playType: flag ? '1' : '11', // 1为电影 11为剧集
    progId: vod_id, // 影片的ID(可传内部与外部ID)
    contentType: 0,
    business: 1,
    idType: vod_id.length > 7 ? 'FSN' : '',
    typeId: typeId
    // parentVodId: parentVodId ? parentVodId : '' // 电视剧要传
  }
  return p;
}

function getRTSP(name, vod_id, typeId, flag, index) { //flag: 0：电视剧 1：电影 2：综艺 3：其他
  // var url = urlJoin('http://192.168.14.113:8082' + '/EPG/jsp/defaultHD/en/go_auth.jsp', joinStr(getObject(vod_id, typeId, flag)));
  var rtsp222 = '';
  var url = urlJoin(sysmisc.getEnv('epg_address', '') + '/EPG/jsp/defaultHD/en/go_auth.jsp', joinStr(getObject(vod_id, typeId, flag)));
  var cookie = '[{"key": "cookie", "value":"' + "JSESSIONID=" + sysmisc.getEnv('sessionid', '') + '"}]';
  bridge.ajax('post', url, 'text/xml', cookie, '', function (resp) {
    var jsonStr = resp.trim().replace(/[\r\n]/g, "");
    if ((/\<html\>/g.test(jsonStr))) {
      sysmisc.showToast('认证失效，请重启机顶盒！');
    } else {
      var json = JSON.parse(jsonStr);
      if (json.retCode == 0 && json.playFlag == 1 && json.playUrl != '') {
        var rtsp = json.playUrl;
        var reportUrl = json.reportUrl;
        if (flag == false) {
          var parentVodId = json.parentVodId;
        }

        var base = new Base64();
        var backUrl = window.location.href;
        if (backUrl.indexOf('?') == -1) {
          backUrl = window.location.href + '?sour=bigScreen';
        } else {
          backUrl = window.location.href + '&sour=bigScreen';
        }
        sysmisc.path_sav(backUrl);
        var previewItem = '1';
        var orderProduct = '2303';
        var authProduct = '100483';
        var spCode = '100027';
        var appCode = '10002701';
        var userNo = sysmisc.getChipId() //'00360340742474858669';
        var appKey = '586513423434154164173432'
        var appId = 'ccnf05e5e0d0bba85cb';
        var sessionId = spCode + '8669' + timeFormat() + Math.floor(Math.random() * 900);
        var flagType = '3';//支付方式 baseFlag 是 String 0：包月；1：按次点播；2：按次点+包月（当为0是走统一播放器流程，为1和2时走原按次点播播放流程）；3：免费；4：体验券（体验券不鉴权） 
        var playType = '1';
        var progId = vod_id;
        var idType = 'FSN';
        var seekTime = '0';
        // var typeId = '10000100000000090000000000112963' 知道;
        var baseFlag = '0';
        var items = '1';
        var previewFlag = '1';
        var previewTime = '0';
        // if (index) {//新版本
        //   location.href = 'http://aoh5.cqccn.com/h5_vod/player/index.html?name=' + encodeURI(name + '(' + index + ')') + '&rtsp=' + base.encode(rtsp) + '&reportUrl=' + base.encode(reportUrl) + '&parentVodId=' + parentVodId + '&time=' + time;
        // } else {
        //   location.href = 'http://aoh5.cqccn.com/h5_vod/player/index.html?name=' + encodeURI(name) + '&rtsp=' + base.encode(rtsp) + '&reportUrl=' + base.encode(reportUrl) + '&vodId=' + vod_id + '&flag=' + flag + '&time=' + time;
        // }

        // if (index) {
        //   location.href = 'http://aoh5.cqccn.com/h5_vod/player/index.html?name=' + encodeURI(name + '(' + index + ')') + '&rtsp=' + base.encode(rtsp) + '&reportUrl=' + base.encode(reportUrl) + '&parentVodId=' + parentVodId + '&type=SP';
        // } else {
        // location.href = 'http://aoh5.cqccn.com/h5_vod/player/index.html?name=' + encodeURI(name) + '&rtsp=' + base.encode(rtsp) + '&reportUrl=' + base.encode(reportUrl) + '&vodId=' + vod_id + '&flag=' + flag + '&type=SP';
        window.location.href = 'http://aoh5.cqccn.com/h5_new/ccplayer/index.html?sessionId=' +
          sessionId + '&flagType=' + flagType + '&playType=' + playType + '&progId=' + progId + '&idType=' +
          idType + '&seekTime=' + seekTime + '&typeId=' + typeId + '&baseFlag=' + baseFlag + '&backUrl=' +
          encodeURIComponent(backUrl) + '&items=' + items + '&previewFlag=' + previewFlag + '&previewTime=' + previewTime + '&previewItem=' +
          previewItem + '&orderProduct=' + orderProduct + '&authProduct=' + authProduct + '&spCode=' +
          spCode + '&appCode=' + appCode + '&userNo=' + userNo + '&appKey=' + appKey + '&appId=' + appId;
        // }
      } else if (json.retCode == '117571586') {
        showTis("弹出订购弹框");
        // showOrder();//弹出订购弹框
      } else {
        //sysmisc.showToast(json.message);
        showTis(json.message);
      }
    }
  }, '')
}