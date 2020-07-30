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

var jsonUrl = Cookies.get('specialUrl');
standardData(jsonUrl,function (res) {
    var specialList = eval('('+res+')').data
    var elemen=getId('standerd_content');
    var arr = "";
    for(var i = 0;i < specialList.elementList.length;i++){
        var kindDom = specialList.elementList[i];
        var kindList = '<div class="itemWrap"><div class="key-item key' + i + '" id="key-item' + i + '"><div><img src='+kindDom.elementImg+' alt=""></div><span>'+kindDom.score+'</span></div><p>'+kindDom.elementName+'</p></div>';
        arr += kindList;
    }
    elemen.innerHTML=arr;
    keyboard.specialData = specialList.elementList;
    getId('title').innerText = specialList.specialName;
    if(getQueryString('itemNo')){
      keyboard.itemNo = getQueryString('itemNo')*1;
      keyboard.pos = getQueryString('itemNo')*1;
      getId('standerd_content').style.left = getQueryString('pos')+'px';
    }
    toggleClass(getId('key-item'+keyboard.itemNo),'hover')
    areaObj=keyboard;
})

var keyboard={
    itemNo:0,
    pos:'',
    specialData:[],
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
        if (this.itemNo >= 5) {
          var scroLength = -198;
          getId('standerd_content').style.left = 63+scroLength*(this.itemNo-5)+'px';
          var bottom = getId("status");
          bottom.children[0].style.marginLeft = (655/this.specialData.length) * this.itemNo + "px";
      }
    },
    right:function () {
        if (this.itemNo >= this.specialData.length - 1) return
        this.removeCss();
        this.itemNo++;
        this.addCss();
        if (this.itemNo > 5) {
          var scroLength = -198;
          getId('standerd_content').style.left = 63+scroLength*(this.itemNo-5)+'px';
          var bottom = getId("status");
          bottom.children[0].style.marginLeft = (655 / this.specialData.length) * this.itemNo + "px";
      }
    },
    up:function () {
      addClass(getId('shop'),'shopHover')
      this.removeCss();
    },
    down:function () {
      removeClass(getId('shop'),'shopHover')
      this.addCss();
    },
    enter: function () {
      this.pos = getId('standerd_content').style.left == ''?'63px':getId('standerd_content').style.left;
      this.pos = this.pos.slice(0,-2);
      var backUrl = window.location.pathname + '?itemNo=' + this.itemNo + '&pos='+this.pos*1;
			Cookies.set("backUrl", backUrl, { path: '/' });
      Cookies.set('detailUrl', this.specialData[this.itemNo].jsonUrl, { path: '/' })
			window.location.href = '../detail/detail.html'
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