// 多纳乐园专区

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

var list=[]
var story_arr=[]
var ulis=['','','','','','']
var globalPos = 0; // 0 center 1 top 2 order 3 bottom
var pageGlobalPos = getQueryString('pos');
var jsonUrl = Cookies.get('duoNaUrl');
standardData(jsonUrl,function(resp){
  var beveList = [];
  if(eval('('+resp+')').data.specialList){
    beveList = eval('('+resp+')').data.specialList[0].elementList;
  }else{
    beveList =  eval('('+resp+')').data.elementList;
  }
  for (var i = 0; i < beveList.length; i++) {
    if(i <= 2){
      list.push(beveList[i])
    };
    if(i>2 && i<9){
      story_arr.push(beveList[i])
    };
  }
  init();
  storyKinds();
  onFouces()
})
function init () {
    var speStory = getId('special_story');
    var html = '';
    for(var i = 0;i < list.length;i++){
      var elementDom=list[i];
        var div = '<div class="key-item key' + i + '" id="key-item' + i + '">' + elementDom.elementName + '</div>'
        html += div;       
    }
    speStory.innerHTML = html;
    areaObj = keyboard;
}
//故事种类
function storyKinds () {
  var keyKindes = getId('special_ol');
  var arr = "";
  var olInner = "";
  for(var i = 0;i < story_arr.length;i++){
    var kindDom = story_arr[i];
    var kindList = '<li class="key-kin key' + i + '" id="key-kin' + i + '">' + kindDom.elementName + '</li>';
    var olList = '<div id="oll'+i+'">'+kindDom.elementName+'</div>'
    olInner+=olList;
    arr += kindList;
  }
  keyKindes.innerHTML = arr;
  getId('textList').innerHTML = olInner;
  if(!pageGlobalPos){
    toggleClass(getId("key-kin" + keyImg.itemNo), 'zIndex')
  }
}
//焦点图
function onFouces () {
    var keylist = getId('special_ul');
    var str = ""
    for(var i = 0;i < ulis.length;i++){
        var divlist = '<li class="noact key-ite key' + i + '" id="key-ite' + i + '"></li>';
        str += divlist;
    }
    keylist.innerHTML = str;
    if(pageGlobalPos == '2'){
      // 订购返回
      areaObj = keyboard;
      addClass(getId("imgs"), 'Hover');
      globalPos = 2;
      return
    }else if(pageGlobalPos == '1'){
      // 顶部资产详情页返回
      globalPos = 1;
      keyboard.itemNo = getQueryString('itemNo')*1;
      keyboard.addCss();
      areaObj = keyboard;
      return;
    }else if(pageGlobalPos == '0'){
      keyImg.itemNo = getQueryString('itemNo')*1
      keyImg.addCss()
    }
    removeClass(getId('key-ite'+keyImg.itemNo),'noact');
    areaObj = keyImg;
}

//故事切换
var keyboard={
    itemNo:0,
    addCss: function () {
        getId('key-item'+this.itemNo+'Hover').style.display = 'block';
    },
    removeCss: function () {
        getId('key-item'+this.itemNo+'Hover').style.display = 'none';
    },
    left: function () {
      if(globalPos == 2)return;
      this.removeCss();
      if(this.itemNo == 0){
        addClass(getId("imgs"), 'Hover');
        globalPos = 2;
        return;
      }
      this.itemNo--;
      this.addCss();
    },
    right:function () { 
      if(this.itemNo == 2)return;
      if(globalPos == 2){
        removeClass(getId("imgs"), 'Hover');
        globalPos = 1;
        this.addCss();
        return;
      }
      this.removeCss();
      this.itemNo++;
      this.addCss();
    },
    up:function () {},
    down:function () {
      if(globalPos == 2)return;
      this.removeCss();
      keyImg.addCss();
      areaObj = keyImg;
    },
    home:function(){},
    enter:function () { 
      if(globalPos == 1){
        var backUrl = window.location.pathname + '?itemNo=' + this.itemNo + '&pos=1';
        Cookies.set("backUrl", backUrl, { path: '/' });
        Cookies.set('detailUrl', list[keyboard.itemNo].jsonUrl, { path: '/' })
        window.location.href = '../detail/detail.html'
      }
     }
}
var keyImg = {
    itemNo:0,
    list:[],
    addCss: function () {
        // addClass(getId("key-item" + this.itemNo), 'keyHover');
        removeClass(getId("key-ite" + this.itemNo), 'noact');
        addClass(getId("key-kin" + this.itemNo), 'zIndex');
    },
    removeCss: function () {
        // removeClass(getId("key-item" + this.itemNo), 'keyHover')
        addClass(getId("key-ite" + this.itemNo), 'noact')
        removeClass(getId("key-kin" + this.itemNo), 'zIndex')
    },
    left: function () {
      if(this.itemNo == 0)return;
      this.removeCss();
      if(this.itemNo == 5){
        addClass(getId('backBtn'),'backBtnHover');
        addClass(getId('backText'),'backTextHover')
        addClass(getId('backImg'),'backImgHover')
        globalPos = 3;
        return;
      }
      if(this.itemNo<=3)this.itemNo--;
      if(this.itemNo>3)this.itemNo++;
      this.addCss();
    },
    right:function () { 
      if(this.itemNo == 3)return;
      if(globalPos == 3){
        this.itemNo = 5
        this.addCss();
        globalPos = 0;
        removeClass(getId('backBtn'),'backBtnHover');
        removeClass(getId('backText'),'backTextHover')
        removeClass(getId('backImg'),'backImgHover')
        return;
      }
      if(this.itemNo == 4 || this.itemNo == 5){
        this.removeCss();
        this.itemNo--;
        this.addCss();
        return;
      }
      this.removeCss();
      this.itemNo++;
      this.addCss();
      return
    },
    up:function () {
      if(globalPos == 3){
        this.itemNo = 0;
        this.addCss();
        globalPos = 0;
        removeClass(getId('backBtn'),'backBtnHover');
        removeClass(getId('backText'),'backTextHover')
        removeClass(getId('backImg'),'backImgHover')
        return;
      }
      if(this.itemNo<=3){
        this.removeCss()
        keyboard.addCss()
        areaObj = keyboard;
        globalPos = 1;
        return;
      }
      this.removeCss();
      if(this.itemNo == 4)this.itemNo=2;
      if(this.itemNo == 5)this.itemNo=1;
      this.addCss();
    },
    down:function () {
      if(this.itemNo>3)return;
      this.removeCss();
      // if(this.itemNo>3){
      //   // if(this.itemNo == 5){
      //   //   addClass(getId('backBtn'),'backBtnHover');
      //   //   addClass(getId('backText'),'backTextHover')
      //   //   addClass(getId('backImg'),'backImgHover')
      //   //   this.pos = 1;
      //   //   return
      //   // }
      //   this.itemNo++;
      // };
      if(this.itemNo == 0){
        addClass(getId('backBtn'),'backBtnHover');
        addClass(getId('backText'),'backTextHover')
        addClass(getId('backImg'),'backImgHover')
        globalPos = 3;
        return;
      }
      if(this.itemNo == 1)this.itemNo=5;
      if(this.itemNo == 2)this.itemNo=4;
      if(this.itemNo == 3)this.itemNo++;
      this.addCss();
    },
    enter:function () { 
      if(globalPos == 0){
        var backUrl = window.location.pathname + '?itemNo=' + this.itemNo + '&pos=0';
        Cookies.set("backUrl", backUrl, { path: '/' });
        Cookies.set('detailUrl', story_arr[this.itemNo].jsonUrl, { path: '/' })
        window.location.href = '../detail/detail.html'
      }
     }
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
        // var backUrl = Cookies.get('specialBackUrl') || '../../index.html';
        // window.location.href = backUrl;
        break;
      case "enter":
        if(globalPos == 2){
          var backUrl = window.location.pathname + '?pos=2';
          Cookies.set('orderbackUrl',backUrl)
          window.location.href = '../order/order.html'
          return;
        }
        if(globalPos == 3){
          Cookies.remove('specialHomeUrl')
          window.location.href = '../../index.html'
          return;
        }
        areaObj.enter();
        break;
      case "home":
        areaObj.home();
        break;
    }
  };
  //事件绑定
  document.onkeydown = grepEvent;