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
       this.list = 1;
        this.addcss("right"," active");
        this.removecss("left"," active");
    },
    left:function(){
        this.list = 0;
        this.addcss("left"," active");
        this.removecss("right"," active");
    },
    enter:function(){
        if(this.list==1){
            window.location.href = './../noPayfor/noPayfor.html'
        }else{
            areaObj = inout;
            document.getElementById('U-inout').style.display = 'block';
        }
    }
}

var inout = {
    item:0,
    right:function(){
        this.item = 1;
        value.addcss("input-right"," active");
        value.removecss("input-left"," active");
     },
     left:function(){
         this.item = 0;
         value.addcss("input-left"," active");
         value.removecss("input-right"," active");
     },
     enter:function(){
        alert(this.item)
        if(this.item==0){
            areaObj = value;    
            document.getElementById('U-inout').style.display = 'none';       
        }else{
            alert('退订')
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