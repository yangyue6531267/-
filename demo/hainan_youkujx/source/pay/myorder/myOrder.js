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

//获取用户订单
function orderList(){
  var params={
    userId: yh.userId,
    appid: APPID,
    appkey: APPKEY,
    spToken: ''
  }
  params = JSON.stringify(params);
  console.log("params",params)
  submitPrompt("queryOrderList",{ jsonParam: params, return: 'getOrderlist' })
  //定义获取订单信息方法
  function getOrderlist(res){
    console.log(res)
    console.log("查询订单:")
  }
  
}

var value = {
    item:1,
    list:0,
    state:open,  //状态
    init:function(){
      //调用订单查询接口
      orderList();
      // this.addcss("input"," active");
    },
    addcss:function(id,classname){
        // var classVal = document.getElementById(id).getAttribute("class");
        // console.log(document.getElementById(id));
        // classVal = classVal.concat(classname);
        // document.getElementById(id).setAttribute("class",classVal );
    },
    removecss:function(id,classname){
        // var classVal = document.getElementById(id).getAttribute("class");
        // classVal = classVal.replace(classname,"");
        // document.getElementById(id).setAttribute("class",classVal );
    },
    down:function(){
        if(this.list>0){
            return
        }
        this.list++
        // this.addcss("input"," active");
        // this.removecss("s_List-"+(this.item*1)+"","active");
        // this.removecss("listimg"+(this.item*1)+"","none");
    },
    up:function(){
        if(this.list<=0){
            return;
        }
        this.list--
        // this.removecss("input"," active");
        // this.addcss("s_List-"+(this.item*1)+"","active");
        // this.addcss("listimg"+(this.item*1)+"","none");
    },
    enter:function(){
        if(this.list>0){
          //  $(".tuidingBox").css("display","block"); 
          //  areaObj = tuidingBox;
          //  $(".no").addClass("active");
          //  $(".yes").removeClass("active");
           // window.location.href = './../Unsubscribe/Unsubscribe.html'
        }
    },
    back:function(){
        // if(this.list>0){
        //   window.location.href='./myOrder.html';
        // }
        window.location.href='./../../index/home.html';
    }
}

// var tuidingBox = {
//     itemNo:0,  //按钮编号 0考虑 1确认
//     init: function(){
//       areaObj == tuidingBox;
      
//     },
//     right:function(){
//        this.itemNo = 1
//         $(".no").removeClass("active");
//         $(".yes").addClass("active");
        
//     },
//     left:function(){
//       //再考虑
//       this.itemNo = 0
//        $(".yes").removeClass("active");
//        $(".no").addClass("active");
//     },
//     enter:function(){
      
//     if(this.itemNo == 1){
//        $(".tuidingBox").css("display","none");
//         //弹框中确认退订
//        $(".message").css("display","block");
//        setTimeout(function(){
//         $(".message").css("display","none")
//        },2000)
//        //焦点切换回
//        $(".o_state_List1").html("关闭")
//        areaObj = value
//     }else if(this.itemNo == 0){
//       //弹框中再考虑
//       $(".tuidingBox").css("display","none");
//       areaObj = value
//     }
//    },
//   back:function(){
//       window.location.href='./myOrder.html';
//   }
// }

areaObj = value; //初始焦点赋值
value.init();

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
        // if (areaObj == tuidingBox){
        //   $(".tuidingBox").css("display","none");
        // }
        // if(areaObj == value){
        //   window.location.href='./../../index/home.html'
        // }
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