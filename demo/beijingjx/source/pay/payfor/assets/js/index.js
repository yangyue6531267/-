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

// userPower(value.getData)
var value = {
  // str: '?msg=用户取消&code=400',//页面返回字段，拼接url后
  // payParams: {
  //   OrderId: ''
  // },
  // seqId: (new Date()).valueOf() + '' + parseInt((Math.random() + 1) * Math.pow(10, 5 - 1)),//门户端生成18位
  productList: [
    {
      id: 1,
      title: '包月',
      pic: '19.9',
      cycle: '月'
    }
  ],
  getValue: function () {

  },
  getData: function () {
     console.log("获取产品信息")
  //   canOrderlist();
     topContent.uploadDom();
     topContent.init();
     detailAuth();
  }
}


//
var topContent = {
  itemNo: 0, //按钮编号
  init: function () { //初步渲染
    areaObj = topContent;
    this.addCss();
    
  },
  uploadDom: function () {
    var html = '';
    for (var i = 0; i < value.productList.length; i++) {
      var item = value.productList[i];
      html += '<li id="item' + i + '"><div class="title">' + item.title + '</div><div class="price">' + item.pic / 1 + '元/' + item.cycle + '</div></li>'
    }
    getId('containerPacket').innerHTML = html;
  },
  addCss: function () {
    addClass(getId("item0"), 'active')
    addClass(getId("item" + this.itemNo), 'active')
  },
 
  up: function () {
      this.itemNo = 0;
      
      $(".zbdg").removeClass("active")
      $("#item0").addClass("active")
  },
  down: function () {
      //暂不订购
      $(".zbdg").addClass("active")
      removeClass(getClass("#item0"),"active")
      this.itemNo = 1;
      areaObj = zbdg;
  },
  enter: function () {
    //鉴权
    //|| succUser == "ORD-400"
    if(succUser == "ORD-000" ){
      //鉴权通过提示框
      alert("您已经订购,无需再次订购")
    }else{
      //鉴权未通过调支付接口
      order();
      console.log('订购');
    }
  },
  back: function () {
    // window.location="./../../../../index/home.html";
    window.history.back();
  },
}

//暂不订购
var zbdg ={
  enter: function (){
    topContent.back();
  },
  back: function(){
    topContent.back();
  },
  up: function(){
    areaObj =topContent;
    topContent.up();
  }
}

//获取可订购产品包列表
// function canOrderlist(){
  // var params = {
  //   userId : yh.userId,
  //   appid : APPID,
  //   appKey : APPKEY,
  //   businessType : '',
  //   reserve : '',
  // }
//   params = JSON.stringify(params)
//   console.log(params);
//   console.log("orderlistparams----");
//   submitPrompt('canOrder',{ jsonParam : params, return : 'getcanOrderlist' })
// }
// function getcanOrderlist(res){
//   console.log(JSON.stringfy(res));
//   console.log("可订购产品包列表")
// }

//支付接口
function order(){
  var params={
    userId : yh.userId,
    appid : APPID,
    appKey : APPKEY,
    productId: '20181217001',
  }
  params = JSON.stringify(params);
  console.log(params)
  console.log('params-------')
  submitPrompt('pay',{ jsonParam : params, return : 'goOrderres' })
}
function goOrderres(res){
    console.log(JSON.stringfy(res));
    console.log("goOrderres----------")
}

areaObj = topContent;
// topContent.init();
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

// 易视腾用户鉴权
function detailAuth(assentId){
  var parames = {
    userId:yh.userId,
    appid: APPID,
    appKey:APPKEY,
    contentId:assentId,
    productId:'20181217001',
    spToken:''
  }
  parames = JSON.stringify(parames);
  console.log("易视腾鉴权:"+parames);
  // 内容鉴权
  submitPrompt('playAuth', { jsonParam: parames, return: 'getPlayAuth' });
}
var succUser= '';
function getPlayAuth(res) {
  console.log(JSON.stringify(res)),
  console.log('getPlayAuth易视腾用户鉴权------------');
  setStorage('getPlayAuth',JSON.stringify(res))
  console.log(getStorage("getPlayAuth"));
  succUser = res.result;
}
