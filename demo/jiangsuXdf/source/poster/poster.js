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
//按键prev处理函数
var grepEvent = function (e) {
  var keyCode = e.keyCode || e.which;
  return onKeyPress(KEYMAP[keyCode]);
};

var Home = {};
Home.itemNo = 0;
Home.navItemNo = 0;
Home.pos = 0 ;//0 导航栏  1 菜单
Home.homeCategoryList = [];
Home.homeCategoryChildrenList = [];
Home.scrollArr = [];

specialData(function(res) {
  // console.log(res)
    data = eval('('+res+')').data
    console.log(data.elementList)
    var elemen=getId('poster_content');
    var arr = "";
    for(var i = 0;i < data.elementList.length;i++){
        var kindDom = data.elementList[i];
        var kindList = '<dl class="key-item key' + i + '" id="key-item' + i + '"><dt><img src='+kindDom.elementImg+' alt=""></dt><dd>'+kindDom.elementName+'</dd><span>'+kindDom.score+'</span></dl>';
        arr += kindList;
    }
    elemen.innerHTML=arr;
    toggleClass(getId('key-item'+keyboard.itemNo),'hover')
    areaObj=keyboard;
})

var keyboard={
    itemNo:0,
    addCss: function () {
        addClass(getId('key-item'+ this.itemNo) ,'hover')
    },
    removeCss: function () {
        removeClass(getId('key-item'+ this.itemNo) ,'hover')
    },
    left: function () {
        if (this.itemNo < 1) return
        this.removeCss();
        this.itemNo--;
        this.addCss();
    },
    right:function () {
        if (this.itemNo >= data.elementList.length - 1) return
        this.removeCss();
        this.itemNo++;
        this.addCss();
    },
    up:function () {},
    down:function () {
        
    },
    enter: function () { 
      var pos = Home.scrollArr.length == 0?0:Home.scrollArr[Home.scrollArr.length-1];
      var backUrl = window.location.pathname + '?pos='+pos+'&itemNo=' + this.itemNo + '&columnName=preschoolRecommendTop_6&navItem='+Home.itemNo;
			Cookies.set("backUrl", backUrl, { path: '/' });
      Cookies.set('speciallUrl', data.elementList[this.itemNo].jsonUrl, { path: '/' })
			window.location.href = '../detail/detail.html'
      // window.location.href = '../detail/detail.html'
    },
    back: function () {
      var backUrl = Cookies.get('specialBackUrl') || '../../index.html';
      window.location.href = backUrl;
    },
    home:function(){}
}
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
        areaObj.back();
        break;
      case "enter":
        areaObj.enter();
        break;
      case "home":
        areaObj.home();
        break;
    }
  };
  //事件绑定
document.onkeydown = grepEvent;