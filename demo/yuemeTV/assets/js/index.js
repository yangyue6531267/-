
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
  e.preventDefault();
  return onKeyPress(KEYMAP[keyCode]);
};



var detailBox = {
  itemNo: 0,
  isShowBox: false,
  payType: '',
  qrcodeUrl: '',
  init: function () {
    detailBox.payType = getQueryString('payType');//9：微信 11：支付宝 
    detailBox.qrcodeUrl = decodeURIComponent(getQueryString('qrcodeUrl'));
    if (!detailBox.payType || !detailBox.qrcodeUrl) {
      toast('payType或者qrcodeUrl参数为空')
      return
    };

    areaObj = detailBox;
    addClass(getId('detailButton'), 'hover');
    var qrcode = new QRCode("qrCodeImge", {
      text: detailBox.qrcodeUrl,
      width: 150,
      height: 150,
      // colorDark: "#000000",
      // colorLight: "#ffffff"
      // correctLevel: QRCode.CorrectLevel.H
    });
    if (detailBox.payType == '11') {
      getId('payImg').style.backgroundImage = 'url(./assets/images/alipay.png)'
    } else {
      getId('payImg').style.backgroundImage = 'url(./assets/images/weChat.png)'
    }
  },
  left: function () {
    if (this.itemNo <= 0) return
    this.itemNo--
    addClass(getId('detailButton'), 'hover');
    removeClass(getId('detailCheckbox'), 'hover');
  },
  right: function () {
    if (this.itemNo >= 1) return
    this.itemNo++
    removeClass(getId('detailButton'), 'hover');

    if (this.isShowBox) {
      addClass(getId('detailCheckbox'), 'hover');
    } else {
      addClass(getId('detailCheckbox'), 'hover');
    }

  },
  up: function () { },
  down: function () { },
  enter: function () {
    if (this.itemNo == 0) {

    } else if (this.itemNo == 1) {

      if (this.isShowBox) {
        this.isShowBox = false;
        removeClass(getId('detailCheckbox'), 'hover-check');
        addClass(getId('detailCheckbox'), 'hover');
      } else {
        this.isShowBox = true;
        removeClass(getId('detailCheckbox'), 'hover');
        addClass(getId('detailCheckbox'), 'hover-check');
      }
    }
  },
  back: function () {
    // backApp()
  }
}
var code_url = "https://qr.alipay.com/bax06725xqhcgzfskwhq00dd";
$(function () {
  // var qrWidth = 200;
  // var qrHeight = 200;
  // var logoQrWidth = qrWidth / 4;
  // var logoQrHeight = qrHeight / 4;
  // $('#qrcode').qrcode({
  //   render: "canvas", //设置渲染方式，有table和canvas
  //   text: code_url, //扫描二维码后自动跳向该链接
  //   width: qrWidth, //二维码的宽度
  //   height: qrHeight, //二维码的高度
  //   src: 'http://jcp.natapp1.cc/gene_detection/image/logo.jpg'            //二维码中间的图片
  // });
  // $("#qrcode canvas")[0].getContext('2d').drawImage($("#logoImg")[0], (qrWidth - logoQrWidth) / 2, (qrHeight - logoQrHeight) / 2, logoQrWidth, logoQrHeight);

});



detailBox.init();
onKeyPress = function (keyCode) {
  switch (keyCode) {
    case "up": //上边
      areaObj.up();
      break;
    case "down": //下边
      areaObj.down();
      break;
    case "left": //左边
      areaObj.left();
      break;
    case "right": //右边
      areaObj.right();
      break;
    case "back":
      backApp();
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