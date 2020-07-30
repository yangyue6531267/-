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
  seqId: (new Date()).valueOf() + '' + parseInt((Math.random() + 1) * Math.pow(10, 5 - 1)),//门户端生成18位
  productList: [
    // {
    //   id: 1,
    //   title: '包 月',
    //   pic: '29',
    //   originalPrice: '30',
    //   cycle: ''
    // },
  ],
  getValue: function () {

  },
  getData: function () {
    topContent.uploadDom();
    topContent.init();
  }
}

var topContent = {
  itemNo: 0, //按钮编号
  backUrl: '',
  init: function () { //初步渲染
    areaObj = topContent;
    this.addCss();
  },
  uploadDom: function () {
    topContent.backUrl = getParam('returnUrl');
    var html = '';
    for (var i = 0; i < value.productList.length; i++) {
      var item = value.productList[i];
      html += '<li id="item' + i + '"><div class="title">' + item.productName + '</div><div class="price">' + item.pic / 100 + '元/' + item.title + '</div><del class="originai">(原价' + item.originalPrice + '元)</del><div class="order">立即订购</div></li>'
    }
    getId('containerPacket').innerHTML = html;
  },
  addCss: function () {
    addClass(getId("item" + this.itemNo), 'active')
  },
  removeCss: function () {
    removeClass(getId("item" + this.itemNo), 'active')
  },
  up: function () {

  },
  down: function () {

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
    console.log('订购');
    order();
    // getPlayStatus();
    // playBox.init();
  },
  back: function () {
    goBack(value.str);
  },
}

var paySuccess = {
  init: function () { //初步渲染
    areaObj = paySuccess;
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


// 二次确认弹框
var playBox = {
  itemNo: 0, //按钮编号
  element: null, //dom操作元素
  init: function () { //初步渲染
    areaObj = playBox;
    // value.productList[topContent.itemNo]
    // debugger

    this.showPlay();
    this.addCss();
  },
  showPlay: function () {
    getId('paybox').style.display = 'block';
    getId('pay').style.display = 'block';
  },
  hidePlay: function () {
    getId('paybox').style.display = 'none';
    getId('pay').style.display = 'none';
  },
  addCss: function () {
    addClass(getId("play" + this.itemNo), 'active')
  },
  removeCss: function () {
    removeClass(getId("play" + this.itemNo), 'active')
  },
  up: function () {

  },
  down: function () {

  },
  left: function () {
    // if (this.itemNo < 1) return
    // this.removeCss();
    // this.itemNo--;
    // this.addCss();
  },
  right: function () {
    // if (this.itemNo >= value.productList.length - 1) return
    // this.removeCss();
    // this.itemNo++;
    // this.addCss();
  },
  enter: function () {
    // window.atob()


    console.log('订购');
    // order();
  },
  back: function () {
    this.hidePlay();
    topContent.init();
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
  // userData.paymentType = '16';
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
      if (result == 0) {

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
    getPlayStatus();
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
      value.str = '?code=' + result + '&message=' + resultDesc;
      if (result == 0) {
        if (payResult == 0) {
          //支付成功，调用订购接口
          orderPackage();
          return
        } else if (payResult == 1) {
          //支付失败
          // orderPackage();
          value.str = '?code=' + result + '&message=支付失败';
          goBack(value.str);
          return
        } else {
          getPlayStatus();
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
      value.str = '?code=' + result + '&message=' + resultDesc;
      if (result == 0) {
        getId('descriptionBox').style.visibility = 'visible';
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