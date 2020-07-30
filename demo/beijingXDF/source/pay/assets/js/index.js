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
  productList: [
    {
      productName:"北京新东方",
      id: 1,
      title: '连续包月',
      pic: '29',
      originalPrice: '30',
      cycle: ''
    }
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
      html += '<li id="item' + i + '"><div class="title">' + item.productName + '</div><div class="price">' + item.pic / 1 + '元/' + item.title + '</div><del class="originai">(原价' + item.originalPrice + '元)</del><div class="order">立即订购</div></li>'
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
  },
  back: function () {
    window.location.href="../detail/detail.html"
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
    // goBack(value.str);
  },
  back: function () {
    // goBack(value.str);
  },
}

//支付接口
function order() {
  var params = {
    userId: yh.userId,
    appid: '1fe3144ab9524ce',
    appKey: '60adac342c13f6d6f08c3330ebe26ceb',
    productId: '20181217001',
  }
  params = JSON.stringify(params);
  console.log('params-------'+params)
  submitPrompt('pay', {
    jsonParam: params,
    return: 'goOrderres'
  })
}

function goOrderres(res) {
  console.log(JSON.stringfy(res));
  console.log("goOrderres----------")
}


value.getData();
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