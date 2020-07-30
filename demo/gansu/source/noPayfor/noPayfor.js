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
  // var baseUrl = 'http://winnow-bs.yanhuamedia.tv/gs_ngx/' // 测试代理
  var lists;
var baseUrl = 'http://gsyd-ds.yanhuamedia.tv/' // 正式代理
// var baseUrl1 = 'http://47.97.96.103'
var baseUrl1 = "http://bms-i.yanhuamedia.tv"
var powerKey = 'b875o629m727s567'
var mobileNos = Cookies.get('mobileNo');
var xubaoyue = false;
var msgid;
// 测试代理
// var baseUrl =  'http://bms-i-test.yanhuamedia.tv/' 
// var baseUrl = 'http://117.156.24.246:8991/';//正式地址
function getData(){
  prompt('yanhua://epg/accountInfo?return=accountInfo')
}
function accountInfo(obj) {
  console.log('获取账号信息-----------accountInfo')
  console.log(obj)
  userObj = obj
  //键盘监听事件
  console.log('基础信息获取完成,绑定键盘事件')
  orderList();
}

function timestampToTime(timestamp) {

  var date =new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
  
      Y = date.getFullYear() +'.';
  
      M = (date.getMonth() +1 <10 ?'0' + (date.getMonth() +1) : date.getMonth() +1) +'.';
  
      D = (date.getDate() <10 ?'0' + date.getDate() : date.getDate())
  
      return Y +M +D;//时分秒可以根据自己的需求加上
  }

function clone() {
  // 退出首页
  document.onkeydown = null
  // prompt('yanhua://epg/exit')
  window.location.href = './../../index.html'
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

function orderList(){
  // 订购列表
  var params1 = {"action":"1","platformCode":"33","version":"1","accountId":mobileNos}
  $('#noPay_top_text').html('账号信息：'+mobileNos);
  console.log(params1);
  var userTokens = '';
  var userId = '';
  var usertoken = $.ajax({
    type: 'POST',
    url: baseUrl1+"/bms/u/user/gsxdfAuth",
    dataType: 'json',
    timeout: 5000,
    contentType: 'application/json',
    data: params1,
    success:function(data){
      userTokens = data.data.userToken;
      userId = data.data.userId;
      msgid = Cookies.get("msgid");
      var params ={
          "header": {
            "msgid": msgid,
            "systemtime": getTimeString(),
            "version": "1.0"
          },
          "body": {
            "mobileNumber":mobileNos,
            "pageSize":"50"
          }
      }
      console.log("请求参数："+JSON.stringify(params))
      var time  = new Date().getTime();
      console.log(userTokens)
      var sha = hex_sha1(userTokens);
      var orderfor = $.ajax({
            type: 'POST',
            url: baseUrl +'api/orderListByMobile',
            contentType: 'application/json',
            dataType: "json",
            data:JSON.stringify(params),
            headers: {
              'Content-Type': 'application/json;charset=UTF-8',
              "timestamp":time,
              "powerkey":powerKey,
              "signature":sha
            },
            success:function(data){
              console.log(JSON.stringify(data))
              var liData = data.body.data;
              value.lengths = data.body.data.length;
              console.log(data.body.data);
              lists = 1;
              if (value.lengths>0) {
                for (var i = 0; i < liData.length; i++) {
                  console.log(liData[i].productId);
                  // if(data.body.data[i].operatorCode=="GSBYZT"){
                  if(liData[i].productId== yh.payForId){
                    lists++
                    Cookies.set("order_list", JSON.stringify(data.body.data[i]), { path: '/' });
                    console.log(data.body.data[i]);
                    var payMoney = parseInt(data.body.data[i].productPrice);
                    $('#shopList').append(
                      '<div class="active" id="s_List-1"><div>'+data.body.data[i].productName+'</div><div>'+payMoney+'元/月</div><img src="./../public/images/1.png" alt="" class="none" id="listimg1"></div>'
                     )
                     var firsttime = timestampToTime(data.body.data[i].takeEffectTime);
                     var lasttime = timestampToTime(data.body.data[i].loseEffectTime);
                     var time = new Date().getTime();
                    //  '+data.body.data[i].productName+'
                    if (time<data.body.data[i].loseEffectTime) {
                      $('#noPay').append(
                        '<p>订购日期：'+firsttime+'——'+lasttime+'</p><div class="ipunt" id="input">取消续包月</div>'
                      )
                      if(liData[i].orderType == 7){
                        xubaoyue = true;
                      }
                    } else {
                      $('#shopList').html('<div class="active" id="s_List-1"><div class="text">暂无订购</div></div>')
                    }
                    // return
                  }
                }
              }else{
                console.log(JSON.stringify(data));
              }
              if (lists==1) {
                $('#shopList').html('<div class="active" id="s_List-1"><div>暂无订购</div></div>')
              }
              // $("#s_List-0").addClass("active");
            },error:function(error){
              console.log(error)
            }
          })
    },error:function(er){
      console.log('鉴权失败');
      console.log(er)
    }
  })
}

var value = {
    item:1,
    list:0,
    lengths:0,
    addcss:function(id,classname){
        var classVal = document.getElementById(id).getAttribute("class");
        console.log(document.getElementById(id));
        classVal = classVal.concat(classname);
        document.getElementById(id).setAttribute("class",classVal );
    },
    removecss:function(id,classname){
        var classVal = document.getElementById(id).getAttribute("class");
        classVal = classVal.replace(classname,"");
        console.log(document.getElementById(id))
        console.log(classVal)
        document.getElementById(id).setAttribute("class",classVal );
    },
    right:function(){
        // if (this.item>1) {
        //     return;
        // }
        // this.item++
        // this.addcss("s_List-"+(this.item*1)+"","active");
        // this.removecss("s_List-"+(this.item*1-1)+"","active");
        // this.addcss("listimg"+(this.item*1)+"","none");
        // this.removecss("listimg"+(this.item*1-1)+"","none");
        // document.getElementById("s_List-1").setAttribute("class","");

    },
    left:function(){
        // if(this.item<=1){
        //     return
        // }
        // this.item--
        // console.log("s_List-"+(this.item*1)+"");
        // this.addcss("s_List-"+(this.item*1)+"","active");
        // this.removecss("s_List-"+(this.item*1+1)+"","active");
        // this.addcss("listimg"+(this.item*1)+"","none");
        // this.removecss("listimg"+(this.item*1+1)+"","none");
    },
    down:function(){
        if(this.list>0){
            return
        }
        if (lists==1) {
          return
        }
        this.list++
        this.addcss("input"," active");
        this.removecss("s_List-1","active");
        this.removecss("listimg1","none");
    },
    up:function(){
        if(this.list==0){
            return;
        }
        if (lists==1) {
          return
        }
        this.list--
        this.removecss("input"," active");
        this.addcss("s_List-"+(this.item*1)+""," active");
        this.addcss("listimg"+(this.item*1)+"","none");
    },
    enter:function(){
        if (lists==1) {
          return
        }
        if(this.list>0){
            if (xubaoyue) {
              toast("续包月已退订");
            } else {
              window.location.href = './../Unsubscribe/Unsubscribe.html'
            }
            
        }
    }
}


areaObj = value; //初始焦点赋值

getData();
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
        clone();
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