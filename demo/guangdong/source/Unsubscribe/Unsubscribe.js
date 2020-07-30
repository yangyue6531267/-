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

  var baseUrl = 'http://gsyd-ds.yanhuamedia.tv/';
  var accessToken = '';
  var powerKey = 'b875o629m727s567';
  var userObj = {}


  prompt('yanhua://epg/accountInfo?return=accountInfo')

  function accountInfo(obj) {
    console.log('获取账号信息-----------accountInfo')
    console.log(obj)
    userObj = obj
    orderList = JSON.parse(Cookies.get('order_list'));
    console.log(orderList)
    firsttime = timestampToTime(orderList.takeEffectTime);
    lasttime = timestampToTime(orderList.loseEffectTime);
      $('#U-text').append(
        '<p>账号：'+orderList.mobileNumber+'</p><p>订购日期：'+firsttime+' 至 '+lasttime+'</p>'
       )
    //键盘监听事件
  }

  function timestampToTime(timestamp) {
    var date =new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    
        Y = date.getFullYear() +':';
    
        M = (date.getMonth() +1 <10 ?'0' + (date.getMonth() +1) : date.getMonth() +1) +' :';
    
        D = date.getDate();
    
        return Y +M +D;//时分秒可以根据自己的需求加上
    
    }

  function getTimeString() {
    function pad2(n) {
      return n < 10 ? '0' + n : n
    }
    var date = new Date()
    return (
      date.getFullYear().toString() +
      pad2(date.getMonth() + 1) +
      pad2(date.getDate()) +
      pad2(date.getHours()) +
      pad2(date.getMinutes()) +
      pad2(date.getSeconds()) +
      pad2(date.getMilliseconds())
    )
  }
  

  function cancel() {
    var url = 'http://winnow-bs.yanhuamedia.tv/gs_orderback'
    var productPrice = orderList.productPrice;
    var params = {
      body: {
        idValue: userObj.idValue, //手机号
        productId: orderList.productId, //产品标识，家开平台定义的产品或套餐编号
        effectiveTime: -4 //订单生效时间 盒子固定为4
      },
      header: {
        version: '1.0',
        msgid: userObj.stbId,
        systemtime: getTimeString(),
        sourceid: userObj.sourceId,
        access_token: accessToken
      }
    }
    var order = $.ajax({
      type: 'POST',
      url: url,
      dataType: 'json',
      timeout: 5000,
      contentType: 'application/json',
      data: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        "powerkey":powerKey,
      },
      success: function (data) {
        console.log(data);
        if (data.result == 1000) {
          console.log('退订成功')
          toast("退订成功");
          setTimeout(function(){
            document.onkeydown = null
            window.location.href = './../../index.html'
          },2000)
        } else {
          console.log('退订失败')
        }
      },
      error: function (err) {
        console.log('退订失败')
        console.log(err)
      }
    })
  }

  function gettoken(){
      $.ajax({
        type: 'POST',
        url: baseUrl+"/boms/v1/access_token",
        dataType: 'json',
        headers: {
          powerkey: powerKey
        },
        success: function (data) {
          if (data.result == 1000) {
            accessToken = data.data;
            console.warn('token:'+accessToken);
            cancel();
          } else {
            console.log('无效powerkey')
          }
        },
        error: function (err) {
          console.log('无效powerkey')
          console.log(err)
        }
      })
  }

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
        if(this.item==0){
            areaObj = value;    
            document.getElementById('U-inout').style.display = 'none';       
        }else{
            gettoken();
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
        window.location.href = './../noPayfor/noPayfor.html'
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