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
  519: "menu"
};
//按键分发事件
var onKeyPress;
//按键prev处理函数
var grepEvent = function (e) {
  var keyCode = e.keyCode || e.which;
  return onKeyPress(KEYMAP[keyCode]);
};

var value = {
  str: '?msg=用户取消&code=400',//页面返回字段，拼接url后
  payParams: {
    OrderId: ''
  },
  timer: null,
  seqId: (new Date()).valueOf() + '' + parseInt((Math.random() + 1) * Math.pow(10, 5 - 1)),//门户端生成18位
  productList: [],
  getValue: function () {
  },
  getData: function () {
    topContent.uploadDom();
    topContent.init();
    addClass(getId("playThere" + payBox.itemNo), 'select')
  }
}

var topContent = {
  itemNo: 0, //按钮编号
  backUrl: '',
  init: function () { //初步渲染
    areaObj = topContent;
    this.addCss();
    removeClass(getId("card" + this.itemNo), 'card-active')
  },
  uploadDom: function () {
    topContent.backUrl = getParam('returnUrl');
    var html = '';
    for (var i = 0; i < value.productList.length; i++) {
      var item = value.productList[i];
      html += '<div id="card' + i + '" class="card" > ' +
        '<p class="card-head">' + item.productName + '</p>' +
        '<p class="card-price">' + item.pic / 100 + '元/' + item.title + '</p>' +
        '</div>'
    }
    getId('tencentCard').innerHTML = html;
  },
  addCss: function () {
    addClass(getId("card" + this.itemNo), 'card-hover')
  },
  removeCss: function () {
    removeClass(getId("card" + this.itemNo), 'card-hover')
  },
  up: function () { },
  down: function () {
    payBox.init();
    this.removeCss();
    addClass(getId("card" + this.itemNo), 'card-active');
  },
  left: function () {
    if (this.itemNo < 1) return
    this.removeCss();
    this.itemNo--;
    this.addCss();
  },
  right: function () {
    if (this.itemNo >= value.productList.length - 1) return
    this.removeCss();
    this.itemNo++;
    this.addCss();
  },
  enter: function () {
    this.down();
  },
  back: function () {
    goBack(value.str);
  },
}

var payBox = {
  itemNo: 0,
  init: function () { //初步渲染
    if (value.productList[topContent.itemNo].type == 0) {
      addClass(getId("playThere" + this.itemNo), 'disabled');
      this.right()
    } else if (value.productList[topContent.itemNo].type == 2) {
      addClass(getId("playThere1"), 'disabled');
    }
    areaObj = payBox;
    this.addCss();
  },
  addCss: function () {
    addClass(getId("playThere" + this.itemNo), 'hover')
    addClass(getId("playThere" + this.itemNo), 'select')
  },
  removeCss: function () {
    removeClass(getId("playThere" + this.itemNo), 'hover')
  },
  up: function () {
    if (value.timer) {
      clearInterval(value.timer);
      value.timer = null;
    }
    if (this.itemNo != 3) {
      //重置状态
      this.removeCss();
      getId('paytext' + this.itemNo).style.display = 'none';
      removeClass(getId("playThere" + this.itemNo), 'select');
      removeClass(getId("playThere0"), 'disabled')
      removeClass(getId("playThere1"), 'disabled')
      this.itemNo = 0;
      addClass(getId("playThere" + this.itemNo), 'select')
      getId('paytext' + this.itemNo).style.display = 'block';
      topContent.init();
    } else {
      removeClass(getId("payButton"), 'hover')
      this.itemNo = 0;
      this.addCss();
    }
  },
  down: function () {
    if (this.itemNo == 0) {
      this.removeCss();
      this.itemNo = 3;
      addClass(getId("payButton"), 'hover')
    }
  },
  left: function () {
    if (value.productList[topContent.itemNo].type == 0) return
    if (this.itemNo == 0) return
    this.removeCss();
    getId('paytext' + this.itemNo).style.display = 'none';
    removeClass(getId("playThere" + this.itemNo), 'select')
    this.itemNo--
    this.addCss();
    addClass(getId("playThere" + this.itemNo), 'select')
    getId('paytext' + this.itemNo).style.display = 'block';
    userData.payType = "16";//新六套话费支付
    if (value.timer) {
      clearInterval(value.timer);
      value.timer = null;
    }
  },
  right: function () {
    if (value.productList[topContent.itemNo].type == 2) return
    if (this.itemNo == 1) return
    this.removeCss();
    getId('money').innerHTML = value.productList[topContent.itemNo].pic / 100 + '元/' + value.productList[topContent.itemNo].title
    getId('paytext' + this.itemNo).style.display = 'none';
    removeClass(getId("playThere" + this.itemNo), 'select');
    this.itemNo++
    this.addCss();
    addClass(getId("playThere" + this.itemNo), 'select')
    getId('paytext' + this.itemNo).style.display = 'block';
    userData.payType = "7";//新六套话费支付
    order()
  },
  enter: function () {
    if (this.itemNo == 3) {
      //话费订购
      console.log('订购');
      order();
    }
  },
  back: function () {
    goBack(value.str);
  },
}

var paySuccess = {
  itemNo: 0,
  init: function () { //初步渲染
    getId('descriptionBox').style.visibility = 'visible';
    areaObj = paySuccess;
    getId('productName').innerHTML = value.productList[topContent.itemNo].productName;
    addClass(getId("successBtn" + this.itemNo), 'hover')
  },
  up: function () {

  },
  down: function () {

  },
  left: function () {
  },
  right: function () {
  },
  enter: function () {
    goBack(value.str);
  },
  back: function () {
    goBack(value.str);
  },
}

function order() {
  userData.userId = getParam('userId');
  userData.terminalId = getParam('terminalId');
  userData.copyRightId = getParam('copyRightId');
  userData.token = getParam('token');
  userData.contentId = getParam('contentId');
  userData.channelId = getParam('channelId');
  userData.systemId = getParam('systemId');
  userData.consumeLocal = getParam('consumeLocal');
  userData.consumeScene = getParam('consumeScene');
  userData.consumeBehaviour = getParam('consumeBehaviour');
  userData.preview = getParam('preview');
  // userData.productId = getParam('productId');
  userData.subContentId = getParam('subContentId');
  userData.backUrl = getParam('returnUrl');

  var pic = value.productList[topContent.itemNo].pic;
  var productCode = value.productList[topContent.itemNo].productCode;


  var strXml = '<?xml version = "1.0" encoding = "UTF-8"?>' +
    '<message module="SCSP" version="1.1">' +
    '<header action="REQUEST" command="ADVPAY" />' +
    '<body><advPay seqId="' + value.seqId + '" userId="' + userData.userId + '"' +
    ' terminalId="' + userData.terminalId + '" copyRightId="' + userData.copyRightId + '"' +
    ' productCode="' + productCode + '" amount="' + pic + '" contentId="' + userData.contentId + '"' +
    ' consumeLocal="' + userData.consumeLocal + '" consumeScene="' + userData.consumeScene + '" consumeBehaviour="' + userData.consumeBehaviour + '"' +
    ' channelId="' + userData.channelId + '" payType="' + userData.payType + '" accountIdentify="' + userData.accountIdentify + '"' +
    ' token="' + userData.token + '" />' +
    '</body>' +
    '</message>'
  console.log('下单传参------' + strXml);
  ajax({
    url: poweruUrl,
    type: "POST",
    data: strXml,
    contentType: "text/xml",
    success: function (res) {
      console.log('下单返参-----' + res);

      var parser = new DOMParser();
      //读取返回字符串
      var _xml = parser.parseFromString(res, "text/xml");
      //获取节点内容
      var domXml = _xml.getElementsByTagName("advPay")[0];
      //0：订购成功1：失败 10: 用户未登录 12：黑名单用户，订购失败 20：计费标识未验证通过
      var result = domXml.getAttribute('result');
      var orderId = domXml.getAttribute('externalSeqNum');
      var infoXml = '';
      value.payParams.OrderId = orderId
      if (result == 0) {
        if (userData.payType == '16') {
          //话费支付
          // infoXml = window.atob(domXml.getAttribute('payParam'));
          infoXml = Base64.decode(domXml.getAttribute('payParam'));
          console.log('解码为' + infoXml);
          var XmlDom = parser.parseFromString(infoXml, "text/xml");
          // XmlDom.getElementsByTagName('OrderId')
          value.payParams = {
            "OrderId": XmlDom.getElementsByTagName('OrderId')[0].textContent,
            "Ctype": XmlDom.getElementsByTagName('Ctype')[0].textContent,
            "OperCode": XmlDom.getElementsByTagName('OperCode')[0].textContent,//0 ：基础点播订购 1 ：基础包月订购   4 ：灵活计费
            "IsSyn": true,
            "StbId": userData.terminalId,
            "PayNum": XmlDom.getElementsByTagName('PayNum')[0].textContent,
            "IsMonthly": XmlDom.getElementsByTagName('IsMonthly')[0].textContent,
            "ChannelId": XmlDom.getElementsByTagName('ChannelCode')[0].textContent,
            "CpId": XmlDom.getElementsByTagName('CooperateCode')[0].textContent,
            "ContentId": XmlDom.getElementsByTagName('ContentCode')[0].textContent,
            "ProductId": XmlDom.getElementsByTagName('ProductCode')[0].textContent,
            "Price": XmlDom.getElementsByTagName('Fee')[0].textContent,
            // "Price": value.productList[topContent.itemNo].pic,
            "SpCode": XmlDom.getElementsByTagName('SpCode')[0].textContent,
            "ServCode": XmlDom.getElementsByTagName('ServCode')[0].textContent,
            "CustomPeriod": "",
            "BillTimes": "",
            "BillInterval": "",
            "CampaignId": "",
            "Desc": "",
            "CustomBizExpiryDate": "",
            "ConfirmPageId": "",
            "Description": "",
            "ScdChannel": "",
            "Cpparam": ""
          }
          paySDK(value.payParams);
        } else {
          // 二维码还
          var image = domXml.getAttribute('qrCodeImg');
          image = 'data:image/png;base64,' + image;
          getId("pay").style.display = "block"
          getId("pay").src = image;
          value.timer = setInterval(function () {
            getPlayStatus();
          }, 1000);
        }
      } else if (result == "12") {
        // 二维码还有效
        getId("pay").style.display = "block";
        value.timer = setInterval(function () {
          getPlayStatus();
        }, 1000);
      } else if (result == "10") {
        toast("用户未登录");
      }
    },
    fail: function (res) {
      console.log('err--------' + res);
    }
  })
};

function paySDK(payParams) {
  console.log('调用SDK传参-------' + JSON.stringify(payParams));
  payParams = JSON.stringify(payParams)
  submitPrompt('pay', { jsonParam: payParams, return: 'payCallBack' })
}
window.payCallBack = function (res) {
  console.log('调用SDK返参------' + JSON.stringify(res));
  if (res.code == 1) {
    value.timer = setInterval(function () {
      getPlayStatus();
    }, 1000);
  } else if (res.code == 2) {
    toast('订购异常，请联系10086---------' + JSON.stringify(res))
    // 未知
  } else if (res.code == 3) {
    //用户取消
    // toast('用户取消')
  }
  value.str = '?code=' + res.code + '&message=' + res.message.split('|')[1];
  // goBack(str);
}
// 调用sdk话费支付成功之后，轮询查询是否扣款成功，成功之后发起订购接口
function getPlayStatus() {
  var strXml = '<?xml version="1.0" encoding="UTF-8"?>' +
    ' <message module = "SCSP" version = "1.1" >' +
    ' <header action="REQUEST" command="ADVPAYRESULT" />' +
    ' <body>' +
    ' <advPayResult terminalId="" appName="" userId="' + userData.userId + '"' +
    ' externalSeqNum="' + value.payParams.OrderId + '" payNum="" param=""' +
    ' token="' + userData.token + '" />' +
    ' </body>' +
    ' </message> '
  console.log('轮询支付状态接口传参-------' + strXml);
  ajax({
    url: poweruUrl,
    type: "POST",
    data: strXml,
    contentType: "text/xml",
    success: function (res) {
      console.log('轮询支付状态接口返参-----' + res);
      var parser = new DOMParser();
      //读取返回字符串
      var _xml = parser.parseFromString(res, "text/xml");
      //获取节点内容
      var domXml = _xml.getElementsByTagName("advPayResult")[0];
      var result = domXml.getAttribute("result");
      var resultDesc = domXml.getAttribute("resultDesc");
      var payResult = domXml.getAttribute("payResult");
      value.str = '?code=' + payResult + '&message=' + resultDesc;
      if (result == 0) {
        if (payResult == 0) {
          //支付成功，调用订购接口
          if (value.timer) {
            clearInterval(value.timer);
            value.timer = null;
          }
          orderPackage();
          return
        } else if (payResult == 1) {
          //支付失败
          // orderPackage();
          if (value.timer) {
            clearInterval(value.timer);
            value.timer = null;
          }
          value.str = '?code=' + result + '&message=支付失败';
          goBack(value.str);
          return
        }
      } else {
        return
      }
    },
    fail: function (res) {
      console.log('err--------' + res);
    }
  })
}

function orderPackage() {
  var strXml = '<?xml version="1.0" encoding="UTF-8"?>' +
    ' <message module="SCSP" version="1.1">' +
    ' <header action="REQUEST" command="ORDER"/>' +
    ' <body>' +
    ' <order seqId="' + value.seqId + '" userId="' + userData.userId + '" accountIdentify="' + userData.accountIdentify + '" terminalId="' + userData.terminalId + '"' +
    ' copyRightId="' + userData.copyRightId + '" systemId="' + userData.systemId + '"  productCode="' + value.productList[topContent.itemNo].productCode + '"   contentId="' + userData.contentId + '" ' +
    ' copyRightContentId="" consumeLocal="' + userData.consumeLocal + '" consumeScene="' + userData.consumeScene + '" consumeBehaviour="' + userData.consumeBehaviour + '"' +
    ' channelId="' + userData.channelId + '" path="" payType ="' + userData.payType + '" orderTimes="1"  thirdTransID="' + value.payParams.OrderId + '"   saleTransID="" ' +
    ' token="' + userData.token + '" subType="' + userData.subType + '"/>' +
    ' </body>' +
    ' </message>'

  console.log('订购产品包传参-------' + strXml);
  ajax({
    url: poweruUrl,
    type: "POST",
    data: strXml,
    contentType: "text/xml",
    success: function (res) {
      console.log('订购产品包返参----' + res);
      var parser = new DOMParser();
      //读取返回字符串
      var _xml = parser.parseFromString(res, "text/xml");
      //获取节点内容
      var domXml = _xml.getElementsByTagName("order")[0];
      var result = domXml.getAttribute("result");
      var resultDesc = domXml.getAttribute("resultDesc");
      var orderSeq = domXml.getAttribute("orderSeq");
      if (result == 0) {
        value.str = '?code=' + result + '&message=' + resultDesc;
        paySuccess.init();
      } else {

      }
    },
    fail: function (res) {
      console.log('err--------' + res);
    }
  })
}

userPower(value.getData);
// value.getData();
onKeyPress = function (keyCode) {
  switch (keyCode) {
    case "up":
      areaObj.up();
      break;
    case "down":
      areaObj.down();
      break;
    case "left":
      areaObj.left();
      break;
    case "right":
      areaObj.right();
      break;
    case "back":
      areaObj.back();
      break;
    case "enter":
      areaObj.enter();
      break;
    case "home":
      areaObj.home();
      break;
    case "menu":
  }
};
//事件绑定
document.onkeydown = grepEvent;