var enter_time = new Date().getTime()
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
  272: "home"
};
//按键分发事件
var onKeyPress;
var reBackUrl = false;
//按键prev处理函数
var grepEvent = function (e) {
  var keyCode = e.keyCode || e.which;
  return onKeyPress(KEYMAP[keyCode]);
};

var value = {
  code: "",
  msg: "",
  getValue: function () {
    // 页面返回上报
    try {
      var accessTime = formatDate();
      var Paramet  = yh.userId + '|xdf|' + accessTime + '|1|活动页|2';
      // 重庆局方数据上报-页面访问
      bi.CQlogup(Paramet);
    }catch(err){
      // console.log('nihao'+err)
  }
    if(Cookies.get('parent_page_type')){
      try {
        commonParams.page_type = '0803';
        commonParams.page_id = '暑期钜惠VIP包月买一赠二';
        bi.jump(commonParams);
      } catch (e) {
      }
    }
    if (playConfig.stbType == "p30") {
      toggleClass(getId('discountTips'), 'discount-tipsP30')
    }
    playConfig.isOrder = Cookies.get('isOrder') || 0
    if (playConfig.isOrder == 1) {
      // getId('discountTips').style.display = 'block'
      // getId('discountTips').innerHTML = '该活动只面向新订购用户'
      return
    }
    if (getQueryString("code")) {
      //获取订购信息
      value.code = getQueryString("code");
      value.msg = getQueryString("msg");
      if (value.code == 200) {
        playConfig.isOrder = 1;
        Cookies.set('isOrder', "1", {
          path: '/'
        })
        getId('discountTips').style.display = 'block'
        getId('discountTips').innerHTML = '订购成功'
        // 用户订购成功
        try {
          commonParams.pkg_type = ''
          commonParams.pkg_id = ''//value.detailData.assetId
          commonParams.operator_id = ''
          commonParams.point = '4'
          commonParams.order_msg = '1'
          commonParams.parent_page_id = '暑期钜惠VIP包月买一赠二'
          commonParams.parent_page_type = '0803'
          bi.order(commonParams)
        } catch (e) {
          toast('错误信息' + e)
        }
      } else {
        //用户取消/支付失败
        getId('discountTips').style.display = 'block'
        getId('discountTips').innerHTML = '订购失败'
        try {
          commonParams.pkg_type = ''
          commonParams.pkg_id = ''//value.detailData.assetId
          commonParams.operator_id = ''
          commonParams.point = '4'
          commonParams.order_msg = encodeURI(value.msg) !== 'null'?encodeURI(value.msg):'失败'
          commonParams.parent_page_id = '暑期钜惠VIP包月买一赠二'
          commonParams.parent_page_type = '0803'
          bi.order(commonParams)
        } catch (e) {
          toast('错误信息' + e)
        }
      }
    }
  }
}
value.getValue();
if(!getQueryString('soure')){
  Cookies.set('reBackUrl',true,{path:'/'})
  reBackUrl = true;
}
var backUrl = getQueryString('backURL');
if(backUrl){
  Cookies.set('homePage', backUrl, {
    path: '/'
  })
}
var topContent = {
  itemNo: 0,
  up: function () {
    if (this.itemNo == 0) return
    getId('discount').className = 'discount'
    this.itemNo = 0
  },
  down: function () {
    // if (this.itemNo == 1) return
    // getId('discount').className = 'discount discountRule'
    // this.itemNo = 1
  },
  left: function () {
  },
  right: function () {
  },
  enter: function () {
    try{
      commonParams.page_type = '0803';
      commonParams.page_id = '暑期钜惠VIP包月买一赠二';
      bi.orderClick(commonParams);
    }catch(e){}
    // 新老用户都可以参与
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
    var url = playConfig.payUrl + "qryType=I&qryValue=" + getUserId() + "&comboId=2458&appId=ccnf05e5e0d0bba85cb&returnUrl=" + backUrl;
    window.location.href = url;
    // if (playConfig.isOrder == 0) {
    //   createOrder();
    // } else {
    //   getId('discountTips').style.display = 'block'
    //   getId('discountTips').innerHTML = '该活动只面向新订购用户'
    // }
  }
}

// topContent.changeBg();
areaObj = topContent; //初始焦点赋值

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
        if (reBackUrl || Cookies.get('reBackUrl')) {
          Cookies.del('reBackUrl','/');
          goBack();
          return
        }
        if(Cookies.get('parent_page_type')){
          Cookies.del('parent_page_type','/');
        };
        if(Cookies.get('parent_page_id')){
          Cookies.del('parent_page_id','/');
        }; 
      var backUrl = Cookies.get('backUrl')||'../../index.html'
      window.location.href = backUrl;
      break;
    case "enter":
      areaObj.enter();
      break;
    case "home":
      areaObj.home();
  }
};
//事件绑定
document.onkeydown = grepEvent;