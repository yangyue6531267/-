/** 
 * 播放所需
 * 
 * **/
var playConfig = {
  isRelease: true,//// playConfig.isRelease   默认false 开发环境  true线上环境(内网)
  cardId: '',
  isOrder: -1,//-1-----未鉴权   0----未订购  1----订购
  isforbid: 0,
  stbType: getStbType(),
  rtspUrl: "",
  getMovieRtspUrl: "",
  // payUrl: "http://192.168.5.73:9991/ubms/tv/dg/comboInfo?",//支付测试
  payUrl: "http://192.168.5.77/ubms/tv/dg/comboInfo/?",//支付正式
  appraisal: "http://192.168.9.74/bhms/webservice/getUserInfo.action",//鉴权地址
  // appraisal:'http://192.168.9.101:8080/bhms/webservice/getUserInfo.action',
  playUrl: "/defaultHD/en/hidden_detail.jsp?typeId=",//3.0播放地址
}

var yh = {}
yh.siteId = "31"; // 站点ID
yh.userId = getUserId(); // 用户ID
yh.device_id = getUserId(); // 设备ID
yh.model = '';//终端硬件型号
yh.soft_v = '';//终软件版本号

try {
  if (typeof iPanel != "undefined" && iPanel && iPanel.eventFrame) {
    iPanel.eventFrame.initPage(window)
  }
} catch (err) {

}
try {
  if (playConfig.stbType == "3.0" || playConfig.stbType == "p30") {
    var systemId = iPanel.eventFrame.systemId; //3.0--------undefined，p30---------1
    playConfig.cardId = CA.card.serialNumber;//卡号
  } else if (playConfig.stbType == "p60") {
    playConfig.cardId = sysmisc.getChipId()
    // var sn = sysmisc.getSn()
    // toast(sysmisc.getChipId())
    // alert(cardId + "-----" + sn)
    // var script = document.createElement("script");
    // script.src = "../video/js/getUrl.js";
    // document.body.appendChild(script);
    yh.model = sysmisc.getHardVersion();//终端硬件型号
    yh.soft_v = sysmisc.getSoftVersion();//终软件版本号
  }
} catch (err) {
}
function formatDate() {
  var date = new Date();
  var YY = date.getFullYear() + '-';
  var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
  var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
  var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
  var ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
  return YY + MM + DD + " " + hh + mm + ss;
}
function getUserId() {
  var caNum = "";
  try {
    if (playConfig.stbType == "3.0" || playConfig.stbType == "p30") {
      caNum = CA.card.serialNumber;
    } else {
      caNum = sysmisc.getChipId();
    }
  } catch (e) {
    caNum = "0001test";
  }
  return caNum;
}
//获取设备号
function getStbType() {
  var stbT = "";
  try {
    stbT = iPanel.eventFrame.systemId;
  } catch (e) {
  }
  if (stbT == "" || stbT == undefined) {
    var lds = "";
    try {
      lds = JSInterface.jsMethodGetOTTid();
    } catch (e) {
    }

    if ("undefined" == typeof (mixplayer) || mixplayer == "") {
      stbT = "3.0";
    } else {
      stbT = "p60";
    }
  } else if (stbT == 1) {
    stbT = "p30";
  }
  return stbT;// 高清3.0————3.0、p60——————p60、p30——————p30
}
function createOrder() {
  if (playConfig.isOrder == '1') return
  //黑名单
  if (playConfig.isforbid == 1) return
  //未鉴权
  if (playConfig.isOrder == -1) return

  // 设置点击订购状态
  var clickOrder = '1'
  Cookies.set('clickOrder', clickOrder, { path: '/' })
  var backUrl = '';
  if (getQueryString("code")) {
    var urlStr = window.location.href;
    var urlStrleng = urlStr.indexOf('?')
    backUrl = urlStr.slice(0, urlStrleng);
  } else {
    backUrl = window.location.href;
  }
  // qryType = I 写死
  // qryValue 配置
  // comboId 配置
  // appId 配置
  // returnUrl 回调地址
  var qryValue = getUserId();
  // var comboId = "1530";//正式 1530
  var comboId = "2303";//正式包 2023
  // var comboId = "2458";//活动包
  var appId = "ccnf05e5e0d0bba85cb";
  var url = playConfig.payUrl + "qryType=I&qryValue=" + qryValue + "&comboId=" + comboId + "&appId=" + appId + "&returnUrl=" + backUrl;
  // alert(url)
  window.location.href = url;
}
// 订购成功
function biOrderSucc(msg) {
  // alert('订购成功埋点'+Cookies.get("clickOrder"))
  if (Cookies.get("clickOrder") != '1') {
    return
  }
  try {
    if (value && value.detailData && value.detailData.assetId) {
      //详情页
      commonParams.point = '1';
      commonParams.parent_page_id = value.detailData.assetId;
      commonParams.parent_page_type = '0301';
    } else {
      //首页
      commonParams.point = '4';
      commonParams.parent_page_id = '';
      commonParams.parent_page_type = '';
    }
  } catch (e) {

  }
  try {
    commonParams.pkg_type = '';
    commonParams.pkg_id = encodeURI(msg) || ''
    commonParams.operator_id = '';
    commonParams.order_msg = '1';
    bi.order(commonParams)
    Cookies.del('clickOrder', '/')
  } catch (e) {
    toast('错误信息' + e)
  }
}
// 订购失败
function biOrderErr() {
  if (Cookies.get("clickOrder") != '1') {
    return
  }

  try {
    var orderMsg = Cookies.get("orderErrMsg") || '失败'
    if (value && value.detailData && value.detailData.assetId) {
      //详情页
      commonParams.point = '1'
      commonParams.parent_page_id = value.detailData.assetId
      commonParams.parent_page_type = '0301'
    } else {
      //首页
      commonParams.point = '4';
      commonParams.parent_page_id = '';
      commonParams.parent_page_type = '';
    }
  } catch (e) {

  }
  try {
    commonParams.pkg_type = ''
    commonParams.pkg_id = ''
    commonParams.operator_id = ''
    commonParams.order_msg = encodeURI(orderMsg)
    bi.order(commonParams)
    Cookies.del('clickOrder', '/')
    Cookies.del('orderErrMsg', '/')
  } catch (e) {
    toast('错误信息' + e)
  }
}
function appraisal(callBack) {
  if (playConfig.isOrder == '1') return
  try {
    if (playConfig.stbType == "p60") {//p60跨域，掉局方ajax
      var cookie = '[{"key": "text/xml", "value":"' + "JSESSIONID=" + sysmisc.getEnv('sessionid', '') + '"}]';
      var url = playConfig.appraisal + "?card=" + getUserId() + "&cardType=U"
      // alert('鉴权'+url)
      bridge.ajax('post', url, 'text/xml', cookie, '',
        function (response) {
          if (response) {
            playConfig.isOrder = isOrder(JSON.parse(response).custInfo.userList[0].productOrderList)
            if (playConfig.isOrder == 1) {
              Cookies.set('isOrder', "1", {
                path: '/'
              })
              callBack && callBack();
            } else {
              Cookies.set('isOrder', "0", { path: '/' })
              biOrderErr()
            }
          } else {
            biOrderErr()
          }
        },
        function (resp) {
          // toast(resp);
          // alert('鉴权失败'+resp)
          biOrderErr()
          Cookies.set('isOrder', "0", { path: '/' })
        })
    } else {
      ajax({
        url: playConfig.appraisal + "?card=" + getUserId() + "&cardType=U",
        type: "GET",
        dataType: "json",
        success: function (response) {
          if (response) {
            playConfig.isOrder = isOrder(eval("(" + response + ")").custInfo.userList[0].productOrderList);
            if (playConfig.isOrder == 1) {
              Cookies.set('isOrder', "1", {
                path: '/'
              })
              callBack && callBack();
            } else {
              Cookies.set('isOrder', "0", { path: '/' })
              biOrderErr()
            }
          } else {
            biOrderErr()
          }
        },
        fail: function (err) {
          // toast('鉴权失败，接口访问失败')
          Cookies.set('isOrder', "0", { path: '/' })
          biOrderErr()
        }
      });
    }
  } catch (err) {
    biOrderErr()
    toast(err)
  }
}

//判断是否订购
function isOrder(orderList) {
  var payList = [
    {
      "productId": "800520150201",
      "title": "新东方小学一年级199/年"
    }, {
      "productId": "800622000282",
      "title": "新东方小学一年级199/年计费产品"
    }, {
      "productId": "800622000311",
      "title": "新东方小学一年级开通产品(年)"
    }, {
      "productId": "800520150203",
      "title": "新东方小学二年级199/年"
    }, {
      "productId": "800622000284",
      "title": "新东方小学二年级199/年计费产品"
    }, {
      "productId": "800622000312",
      "title": "新东方小学二年级开通产品(年)"
    }, {
      "productId": "800520150205",
      "title": "新东方小学三年级199/年"
    }, {
      "productId": "800622000286",
      "title": "新东方小学三年级199/年计费产品"
    }, {
      "productId": "800622000313",
      "title": "新东方小学三年级开通产品(年)"
    }, {
      "productId": "800520150207",
      "title": "新东方小学四年级199/年"
    }, {
      "productId": "800622000288",
      "title": "新东方小学四年级199/年计费产品"
    }, {
      "productId": "800622000314",
      "title": "新东方小学四年级开通产品(年)"
    }, {
      "productId": "800520150209",
      "title": "新东方小学五年级199/年"
    }, {
      "productId": "800622000290",
      "title": "新东方小学五年级199/年计费产品"
    }, {
      "productId": "800622000315",
      "title": "新东方小学五年级开通产品(年)"
    }, {
      "productId": "800520150211",
      "title": "新东方小学六年级199/年"
    }, {
      "productId": "800622000292",
      "title": "新东方小学六年级199/年计费产品"
    }, {
      "productId": "800622000316",
      "title": "新东方小学六年级开通产品(年)"
    }, {
      "productId": "800520150200",
      "title": "新东方小学一年级29元/月"
    }, {
      "productId": "800622000281",
      "title": "新东方小学一年级29元/月计费产品"
    }, {
      "productId": "800622000293",
      "title": "新东方小学一年级开通产品"
    }, {
      "productId": "800520150202",
      "title": "新东方小学二年级29元/月"
    }, {
      "productId": "800622000283",
      "title": "新东方小学二年级29元/月计费产品"
    }, {
      "productId": "800622000294",
      "title": "新东方小学二年级开通产品"
    }, {
      "productId": "800520150204",
      "title": "新东方小学三年级29元/月"
    }, {
      "productId": "800622000285",
      "title": "新东方小学三年级29元/月计费产品"
    }, {
      "productId": "800622000295",
      "title": "新东方小学三年级开通产品"
    }, {
      "productId": "800520150206",
      "title": "新东方小学四年级29元/月"
    }, {
      "productId": "800622000287",
      "title": "新东方小学四年级29元/月计费产品"
    }, {
      "productId": "800622000296",
      "title": "新东方小学四年级开通产品"
    }, {
      "productId": "800520150208",
      "title": "新东方小学五年级29元/月"
    }, {
      "productId": "800622000289",
      "title": "新东方小学五年级29元/月计费产品"
    }, {
      "productId": "800622000297",
      "title": "新东方小学五年级开通产品"
    }, {
      "productId": "800520150210",
      "title": "新东方小学六年级29元/月"
    }, {
      "productId": "800622000291",
      "title": "新东方小学六年级29元/月计费产品"
    }, {
      "productId": "800622000298",
      "title": "新东方小学六年级开通产品"
    }, {
      "productId": "800520150213",
      "title": "新东方初中一年级39元/月"
    }, {
      "productId": "800622000366",
      "title": "新东方初中一年级39元/月计费产品"
    }, {
      "productId": "800622000338",
      "title": "新东方初中一年级开通产品"
    }, {
      "productId": "800520150214",
      "title": "新东方初中一年级299/年"
    }, {
      "productId": "800622000367",
      "title": "新东方初中一年级299/年计费产品"
    }, {
      "productId": "800622000339",
      "title": "新东方初中一年级开通产品(年)"
    }, {
      "productId": "800520150215",
      "title": "新东方初中二年级39元/月"
    }, {
      "productId": "800622000368",
      "title": "新东方初中二年级39元/月计费产品"
    }, {
      "productId": "800622000340",
      "title": "新东方初中二年级开通产品"
    }, {
      "productId": "800520150216",
      "title": "新东方初中二年级299/年"
    }, {
      "productId": "800622000369",
      "title": "新东方初中二年级299/年计费产品"
    }, {
      "productId": "800622000341",
      "title": "新东方初中二年级开通产品(年)"
    }, {
      "productId": "800520150217",
      "title": "新东方初中三年级39元/月"
    }, {
      "productId": "800622000370",
      "title": "新东方初中三年级39元/月计费产品"
    }, {
      "productId": "800622000342",
      "title": "新东方初中三年级开通产品"
    }, {
      "productId": "800520150218",
      "title": "新东方初中三年级299/年"
    }, {
      "productId": "800622000371",
      "title": "新东方初中三年级299/年计费产品"
    }, {
      "productId": "800622000343",
      "title": "新东方初中三年级开通产品(年)"
    }, {
      "productId": "800520150243",
      "title": "新东方初中全年级包49元/月"
    }, {
      "productId": "800622000396",
      "title": "新东方初中全年级包49元/月计费产品"
    }, {
      "productId": "800622000338",
      "title": "新东方初中一年级开通产品"
    }, {
      "productId": "800622000340",
      "title": "新东方初中二年级开通产品"
    }, {
      "productId": "800622000342",
      "title": "新东方初中三年级开通产品"
    }, {
      "productId": "800520150244",
      "title": "新东方初中全年级包399/年"
    }, {
      "productId": "800622000397",
      "title": "新东方初中全年级包399/年计费产品"
    }, {
      "productId": "800622000339",
      "title": "新东方初中一年级开通产品(年)"
    }, {
      "productId": "800622000341",
      "title": "新东方初中二年级开通产品(年)"
    }, {
      "productId": "800622000343",
      "title": "新东方初中三年级开通产品(年)"
    }, {
      "productId": "800520150219",
      "title": "新东方高中一年级39元/月"
    }, {
      "productId": "800622000372",
      "title": "新东方高中一年级39元/月计费产品"
    }, {
      "productId": "800622000344",
      "title": "新东方高中一年级开通产品"
    }, {
      "productId": "800520150220",
      "title": "新东方高中一年级299/年"
    }, {
      "productId": "800622000373",
      "title": "新东方高中一年级299/年计费产品"
    }, {
      "productId": "800622000345",
      "title": "新东方高中一年级开通产品(年)"
    }, {
      "productId": "800520150221",
      "title": "新东方高中二年级39元/月"
    }, {
      "productId": "800622000374",
      "title": "新东方高中二年级39元/月计费产品"
    }, {
      "productId": "800622000346",
      "title": "新东方高中二年级开通产品"
    }, {
      "productId": "800520150222",
      "title": "新东方高中二年级299/年"
    }, {
      "productId": "800622000375",
      "title": "新东方高中二年级299/年计费产品"
    }, {
      "productId": "800622000347",
      "title": "新东方高中二年级开通产品(年)"
    }, {
      "productId": "800520150223",
      "title": "新东方高中三年级39元/月"
    }, {
      "productId": "800622000376",
      "title": "新东方高中三年级39元/月计费产品"
    }, {
      "productId": "800622000348",
      "title": "新东方高中三年级开通产品"
    }, {
      "productId": "800520150224",
      "title": "新东方高中三年级299/年"
    }, {
      "productId": "800622000377",
      "title": "新东方高中三年级299/年计费产品"
    }, {
      "productId": "800622000349",
      "title": "新东方高中三年级开通产品(年)"
    }, {
      "productId": "800520150245",
      "title": "新东方高中全年纪包49元/月"
    }, {
      "productId": "800622000398",
      "title": "新东方高中全年纪包49元/月计费产品"
    }, {
      "productId": "800622000348",
      "title": "新东方高中三年级开通产品"
    }, {
      "productId": "800622000346",
      "title": "新东方高中二年级开通产品"
    }, {
      "productId": "800622000344",
      "title": "新东方高中一年级开通产品"
    }, {
      "productId": "800520150246",
      "title": "新东方高中全年纪包399/年"
    }, {
      "productId": "800622000399",
      "title": "新东方高中全年纪包399/年计费产品"
    }, {
      "productId": "800622000349",
      "title": "新东方高中三年级开通产品(年)"
    }, {
      "productId": "800622000347",
      "title": "新东方高中二年级开通产品(年)"
    }, {
      "productId": "800622000345",
      "title": "新东方高中一年级开通产品(年)"
    }, {
      "productId": "800520150233",
      "title": "新东方托福全程精讲39元/月"
    }, {
      "productId": "800622000358",
      "title": "新东方托福全程精讲开通产品"
    }, {
      "productId": "800622000386",
      "title": "新东方托福全程精讲39元/月计费产品"
    }, {
      "productId": "800520150234",
      "title": "新东方托福全程精讲199/半年"
    }, {
      "productId": "800622000359",
      "title": "新东方托福全程精讲开通产品(半年)"
    }, {
      "productId": "800622000387",
      "title": "新东方托福全程精讲199/半年计费产品"
    }, {
      "productId": "800520150235",
      "title": "新东方托福全程精讲299/年"
    }, {
      "productId": "800622000360",
      "title": "新东方托福全程精讲开通产品(年)"
    }, {
      "productId": "800622000388",
      "title": "新东方托福全程精讲299/年计费产品"
    }, {
      "productId": "800520150236",
      "title": "新东方雅思全程精讲39元/月"
    }, {
      "productId": "800622000361",
      "title": "新东方雅思全程精讲开通产品"
    }, {
      "productId": "800622000389",
      "title": "新东方雅思全程精讲39元/月计费产品"
    }, {
      "productId": "800520150237",
      "title": "新东方雅思全程精讲199/半年"
    }, {
      "productId": "800622000362",
      "title": "新东方雅思全程精讲开通产品(半年)"
    }, {
      "productId": "800622000390",
      "title": "新东方雅思全程精讲199/半年计费产品"
    }, {
      "productId": "800520150238",
      "title": "新东方雅思全程精讲299/年"
    }, {
      "productId": "800622000363",
      "title": "新东方雅思全程精讲开通产品(年)"
    }, {
      "productId": "800622000391",
      "title": "新东方雅思全程精讲299/年计费产品"
    }, {
      "productId": "800520150225",
      "title": "新东方新概念一册29元/月"
    }, {
      "productId": "800622000350",
      "title": "新东方新概念一册开通产品"
    }, {
      "productId": "800622000378",
      "title": "新东方新概念一册29元/月计费产品"
    }, {
      "productId": "800520150226",
      "title": "新东方新概念一册199/年"
    }, {
      "productId": "800622000351",
      "title": "新东方新概念一册开通产品(年)"
    }, {
      "productId": "800622000379",
      "title": "新东方新概念一册199/年计费产品"
    }, {
      "productId": "800520150227",
      "title": "新东方新概念二册29元/月"
    }, {
      "productId": "800622000352",
      "title": "新东方新概念二册开通产品"
    }, {
      "productId": "800622000380",
      "title": "新东方新概念二册29元/月计费产品"
    }, {
      "productId": "800520150228",
      "title": "新东方新概念二册199/年"
    }, {
      "productId": "800622000353",
      "title": "新东方新概念二册开通产品(年)"
    }, {
      "productId": "800622000381",
      "title": "新东方新概念二册199/年计费产品"
    }, {
      "productId": "800520150229",
      "title": "新东方新概念三册29元/月"
    }, {
      "productId": "800622000354",
      "title": "新东方新概念三册开通产品"
    }, {
      "productId": "800622000382",
      "title": "新东方新概念三册29元/月计费产品"
    }, {
      "productId": "800520150230",
      "title": "新东方新概念三册199/年"
    }, {
      "productId": "800622000355",
      "title": "新东方新概念三册开通产品(年)"
    }, {
      "productId": "800622000383",
      "title": "新东方新概念三册199/年计费产品"
    }, {
      "productId": "800520150231",
      "title": "新东方新概念四册29元/月"
    }, {
      "productId": "800622000356",
      "title": "新东方新概念四册开通产品"
    }, {
      "productId": "800622000384",
      "title": "新东方新概念四册29元/月计费产品"
    }, {
      "productId": "800520150232",
      "title": "新东方新概念四册199/年"
    }, {
      "productId": "800622000357",
      "title": "新东方新概念四册开通产品(年)"
    }, {
      "productId": "800622000385",
      "title": "新东方新概念四册199/年计费产品"
    }, {
      "productId": "800520150247",
      "title": "新东方新概念全集39元/月"
    }, {
      "productId": "800622000400",
      "title": "新东方新概念全集39元/月计费产品"
    }, {
      "productId": "800622000356",
      "title": "新东方新概念四册开通产品"
    }, {
      "productId": "800622000354",
      "title": "新东方新概念三册开通产品"
    }, {
      "productId": "800622000352",
      "title": "新东方新概念二册开通产品"
    }, {
      "productId": "800622000350",
      "title": "新东方新概念一册开通产品"
    }, {
      "productId": "800520150248",
      "title": "新东方新概念全集299/年"
    }, {
      "productId": "800622000401",
      "title": "新东方新概念全集299/年计费产品"
    }, {
      "productId": "800622000351",
      "title": "新东方新概念一册开通产品(年)"
    }, {
      "productId": "800622000353",
      "title": "新东方新概念二册开通产品(年)"
    }, {
      "productId": "800622000355",
      "title": "新东方新概念三册开通产品(年)"
    }, {
      "productId": "800622000357",
      "title": "新东方新概念四册开通产品(年)"
    }, {
      "productId": "800520150241",
      "title": "新东方小学全年纪包39元/月"
    }, {
      "productId": "800622000394",
      "title": "新东方小学全年纪包39元/月计费产品"
    }, {
      "productId": "800622000298",
      "title": "新东方小学六年级开通产品"
    }, {
      "productId": "800622000297",
      "title": "新东方小学五年级开通产品"
    }, {
      "productId": "800622000296",
      "title": "新东方小学四年级开通产品"
    }, {
      "productId": "800622000295",
      "title": "新东方小学三年级开通产品"
    }, {
      "productId": "800622000294",
      "title": "新东方小学二年级开通产品"
    }, {
      "productId": "800622000293",
      "title": "新东方小学一年级开通产品"
    }, {
      "productId": "800520150242",
      "title": "新东方小学全年纪包299/年"
    }, {
      "productId": "800622000395",
      "title": "新东方小学全年纪包299/年计费产品"
    }, {
      "productId": "800622000316",
      "title": "新东方小学六年级开通产品(年)"
    }, {
      "productId": "800622000315",
      "title": "新东方小学五年级开通产品(年)"
    }, {
      "productId": "800622000314",
      "title": "新东方小学四年级开通产品(年)"
    }, {
      "productId": "800622000313",
      "title": "新东方小学三年级开通产品(年)"
    }, {
      "productId": "800622000312",
      "title": "新东方小学二年级开通产品(年)"
    }, {
      "productId": "800622000311",
      "title": "新东方小学一年级开通产品(年)"
    }, {
      "productId": "800520150239",
      "title": "多纳学前包20元/月"
    }, {
      "productId": "800622000392",
      "title": "多纳学前包20元/月计费产品"
    }, {
      "productId": "800622000364",
      "title": "多纳学前包开通产品"
    }, {
      "productId": "800520150240",
      "title": "多纳学前包199/年"
    }, {
      "productId": "800622000393",
      "title": "多纳学前包199/年计费产品"
    }, {
      "productId": "800622000365",
      "title": "多纳学前包开通产品(年)"
    }, {
      "productId": "800520180339",
      "title": "新东方畅学包12个月299元(促销)"
    }, {
      "productId": "800622003911",
      "title": "新东方全业务(12个月)"
    }, {
      "productId": "800622003685",
      "title": "新东方畅学包12个月299元(促销)计费"
    }, {
      "productId": "800520180338",
      "title": "新东方畅学包12个月399元"
    }, {
      "productId": "800622003911",
      "title": "新东方全业务(12个月)"
    }, {
      "productId": "800622003684",
      "title": "新东方畅学包12个月399元计费产品"
    }, {
      "productId": "800520180337",
      "title": "新东方畅学包3个月39元(促销)"
    }, {
      "productId": "800622003910",
      "title": "新东方全业务(3个月)"
    }, {
      "productId": "800622003683",
      "title": "新东方畅学包3个月39元(促销)计费产"
    }, {
      "productId": "800520180336",
      "title": "新东方畅学包1个月39元"
    }, {
      "productId": "800622003909",
      "title": "新东方全业务(1个月)"
    }, {
      "productId": "800622003682",
      "title": "新东方畅学包1个月39元计费产品"
    }, {
      "productId": "800520170093",
      "title": "新东方一个月体验卡套餐"
    }, {
      "productId": "800622002536",
      "title": "新东方全业务套餐开通产品(1个月时间"
    }, {
      "productId": "800520170091",
      "title": "新东方全业务套餐39元/月"
    }, {
      "productId": "800622002535",
      "title": "新东方全业务套餐开通产品"
    }, {
      "productId": "800622002443",
      "title": "新东方全业务套餐39元/月计费产品"
    }, {
      "productId": "800521000200",
      "title": "R新东方增补包1元一个月"
    }, {
      "productId": "800622003909",
      "title": "新东方全业务(1个月)"
    }, {
      "productId": "800693000145",
      "title": "R新东方增补包1元一个月1.0元/月计费产品"
    }, {
      "productId": "800521000203",
      "title": "新东方一个月29元"
    }, {
      "productId": "800622003909",
      "title": "新东方全业务(1个月)"
    }, {
      "productId": "800693000148",
      "title": "新东方一个月29元29.0元/月计费产品"
    }, {
      "productId": "800622005130",
      "title": "新东方TV学堂开通计费2元/月(24个月)计费产品"
    }, {
      "productId": "800622001437",
      "title": "新东方新概念全集"
    }, {
      "productId": "800622004113",
      "title": "新东方TV学堂开通产品 "
    }, {
      "productId": "800622004840",
      "title": "新东方开通计费1.5元/月计费产品"
    }, {
      "productId": "800622004842",
      "title": "新东方开通计费1.01元/月计费产品"
    }, {
      "productId": "800622004841",
      "title": "新东方开通计费1.01元/月计费产品"
    }, {
      "productId": "800622004758",
      "title": "新东方全业务(党教)"
    }, {
      "productId": "800622004798",
      "title": "新东方1.5元/月开通计费产品"
    }, {
      "productId": "800622005130",
      "title": "新东方TV学堂开通计费2元/月(24个月)计费产品"
    }
  ]
  //递归  多维数组变一维数组
  var resList = [];
  function parseArr(arr, resList) {
    var i = 0;
    for (i = 0; i < arr.length; i++) {
      if (arr[i].productLs instanceof Array) {
        parseArr(arr[i].productLs, resList);
      } else {
        resList.push(arr[i]);
      }
    }
  }
  parseArr(orderList, resList);

  //对比产品包是否存在，有效
  for (var k = 0; k < payList.length; k++) {
    for (var i = 0; i < resList.length; i++) {
      if (resList[i].productId == payList[k].productId) {
        if (resList[i].status == 0) {//.status//0 正常  1引导充值
          biOrderSucc(resList[i].productName);
          return 1
        }
      }
    }
  }
  biOrderErr();
  return 0
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
//   // 获取包含data-src属性的img，并以jQuery对象存入数组:
//   var lazyImgs = $.map($('img[data-src]').get(), function (i) {
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
//         element.attr('src', element.attr('data-src'));
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

// function lazyLoadImage () {
//   var imgs = document.querySelectorAll('img');
//   for (var i = 0; i < imgs.length; i++) {
//     imgs[i].setAttribute('src', imgs[i].dataset.src)
//     imgs[i].setAttribute('data-src', '')
//   }
// }

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
  if (r != null) return decodeURI(r[2]);
  return null;
}
//toast
function toast(msg) {
  if (playConfig.stbType == "p30") {
    if (playConfig.isRelease) return
    alert(msg);
  } else {
    if (playConfig.isRelease) {
      console.log(msg)
    } else {
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
      }, 50000000);
    }
  }
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
//返回按键调用此函数
function goBack() {
  //首页返回盒子
  if (playConfig.stbType == "p60") {
    if (Cookies.get('homePage')) {
      window.location.href = Cookies.get('homePage');
    } else {
      sysmisc.finish()
    }
  } else if (playConfig.stbType == "p30") {
    if (Cookies.get('homePage')) {
      window.location.href = Cookies.get('homePage');
    } else {
      iPanel.eventFrame.exitToHomePage();
    }
  } else if (playConfig.stbType == "3.0") {
    // 获取应用返回地址（只有一级页面可直接用，如应用存在二级页面时需要自己保存这个backUrl地址并在应用想退出时获取跳转即可）
    if (Cookies.get('homePage')) {
      window.location.href = Cookies.get('homePage');
    } else {
      window.location.href = iPanel.eventFrame.portal_url;
      // 无返回地址则直接返回首页
    }
  }
}