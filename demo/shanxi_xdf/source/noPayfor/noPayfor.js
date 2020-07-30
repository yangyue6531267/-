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
  };
  //按键分发事件
  var onKeyPress;
  //按键prev处理函数
  var grepEvent = function (e) {
    var keyCode = e.keyCode || e.which;
    return onKeyPress(KEYMAP[keyCode]);
  };

var value = {
    item:1,
    list:0,
    addcss:function(id,classname){
        var classVal = document.getElementById(id).getAttribute("class");
        console.log(document.getElementById(id));
        classVal = classVal.concat(classname);
        document.getElementById(id).setAttribute("class",classVal );
    },
    removecss:function(id,classname){
        var classVal = document.getElementById(id).getAttribute("class");
        classVal = classVal.replace(classname,"");
        document.getElementById(id).setAttribute("class",classVal );
    },
    right:function(){
        if (this.item>1) {
            return;
        }
        this.item++
        this.addcss("s_List-"+(this.item*1)+"","active");
        this.removecss("s_List-"+(this.item*1-1)+"","active");
        this.addcss("listimg"+(this.item*1)+"","none");
        this.removecss("listimg"+(this.item*1-1)+"","none");

    },
    left:function(){
        if(this.item<=1){
            return
        }
        this.item--
        console.log("s_List-"+(this.item*1)+"");
        this.addcss("s_List-"+(this.item*1)+"","active");
        this.removecss("s_List-"+(this.item*1+1)+"","active");
        this.addcss("listimg"+(this.item*1)+"","none");
        this.removecss("listimg"+(this.item*1+1)+"","none");
    },
    down:function(){
        if(this.list>0){
            return
        }
        this.list++
        this.addcss("input"," active");
        this.removecss("s_List-"+(this.item*1)+"","active");
        this.removecss("listimg"+(this.item*1)+"","none");
    },
    up:function(){
        if(this.list<=0){
            return;
        }
        this.list--
        this.removecss("input"," active");
        this.addcss("s_List-"+(this.item*1)+"","active");
        this.addcss("listimg"+(this.item*1)+"","none");
    },
    enter:function(){
        if(this.list>0){
            window.location.href = './../Unsubscribe/Unsubscribe.html'
        }
    }
}




areaObj = value; //初始焦点赋值

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
        var backUrl = Cookies.get('backUrl')
        window.location.href = backUrl;
        player.stop();
        break;
      case "enter":
        areaObj.enter();
        break;
      case "home":
        areaObj.home();
        break;
    }
};
  
document.onkeydown = grepEvent;