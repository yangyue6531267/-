// import { player } from "./play";

// 首页初始化加载

prompt('yanhua://epg/deviceInfo?return=deviceInfo');

// accountInfo()


function deviceInfo(obj) {
  console.log('获取硬件信息-----------deviceInfo')
  console.log(obj)
  deviceObj = obj
  //获取账号信息
  Cookies.set('msgid', deviceObj.stbId, {path: '/'})
  prompt('yanhua://epg/accountInfo?return=accountInfo')
}

function accountInfo(obj) {
  console.log('获取账号信息-----------accountInfo')
  console.log(obj)
  userObj = obj;
  Cookies.set('mobileNo', userObj.mobileNo, {path: '/'}) //正式环境手机号
  Cookies.set('detailUrl', '', {path: '/'});
  // var obj = {
  //   device_id:Cookies.get('msgid'),
  //   mobileNos:userObj.mobileNo
  // }
  // // setYH(obj);
  // init()
//   158020190611000050
// 158020190626000001 
// 158020190626000003
// 158020190703000005
// 158020190703000007
// 158020190703000009 
// 158020190703000011
// 158020190703000013
// 158020190703000015
// 158020190703000017 
// 158020190703000019
  orderList = [{"displayName":"话费支付","fee":2900,"packageMode":0,"packageType":4,"proceedProductId":"GSBYZT","productCycle":30,"productId":"158020191212000053|1","remark":"","usFlag":"1"},
  {"displayName":"二维码支付","fee":2900,"packageMode":0,"packageType":1,"proceedProductId":"GSBYZT","productCycle":30,"productId":"158020191212000053|1","remark":"","usFlag":"0"}]
  // {"displayName":"包季","fee":500,"packageMode":0,"packageType":2,"proceedProductId":"GSBYZT","productCycle":90,"productId":"158020190626000003|3","remark":"","usFlag":"0"},
  // {"displayName":"包年","fee":500,"packageMode":0,"packageType":3,"proceedProductId":"GSBYZT","productCycle":365,"productId":"158020190703000005|12","remark":"","usFlag":"0"}]
  // Cookies.set('mobileNo', "15209450496", {path: '/'})
  // 15719311449
  // 测试手机号
  Cookies.set('orderList', JSON.stringify(orderList), {path: '/'})
  var user = Cookies.get('mobileNo');
  var msgid = Cookies.get('msgid');
  // 18393817034
  var baseUrl = "http://bms-i.yanhuamedia.tv"
// 白名单正式代理环境
  var params = {"action":"3","platformCode":"33","version":"1","accountId":user,"deviceMac":msgid}
  console.log(params);
  //键盘监听事件
  $.ajax({
    type: 'POST',
    url: baseUrl+"/bms/u/user/gsxdfAuth",
    dataType: 'json',
    timeout: 5000,
    contentType: 'application/json',
    data: params,
    success: function (data) {
      console.warn(data)
      if(data.data.specialType !=undefined){
        if (data.data.specialType == 2) {
          Cookies.set('specialType', 0, {path: '/'})
          // 白名单
        }else if(data.data.specialType == 1){
          Cookies.set('specialType', 1, {path: '/'})
          // 黑名单
        }
      }else{
        Cookies.set('specialType', 2, {path: '/'})
        // 普通
      }
      Cookies.set('productIds', data.data.productIds, {path: '/'})
      console.log(data.data);
    },
    error: function (err) {
      console.log('无效用户')
      console.log(err)
    }
  })
}


function init() {
  if (!getQueryString('pos')) {
    player.initPlayer();
    try {
      bi.start()
    } catch (error) {
      console.log('埋点错误', error)
    }
    // 首页页面访问埋点
    console.log('bi 首页页面访问埋点')
    try {
      var jsonOb = {}
      jsonOb.page_type = '0101'
      jsonOb.page_id = '205128'
      jsonOb.parent_page_type = 'null'
      jsonOb.parent_page_id = 'null'
      bi.jump(jsonOb)
    } catch (error) {
      console.log('埋点错误', error)
    }
  }
  getData()
}

function getData() {
  // 获取首页栏目数据
  $.ajax({
    type: 'GET',
    url: "http://gsyd-ds.yanhuamedia.tv/?s=33|19&p=yhNavigationBar&k=1&v=1&catId=205243&c=19&returnType=jsonp",
    dataType: "jsonp",
    jsonpCallback:'jsonpCallback',
    success:function(response){
      try {
        // var columnData = eval("(" + response + ")");
        Home.template(response);
        // 初始化键值监听
        Home.init();
      } catch (error) {
        console.log("栏目数据转json异常" + error);
      }
    },error:function(error){
      console.log(error)
    }
  })


  // getYhNavigationBar(function (response) {
  //   try {
  //     var columnData = eval("(" + response + ")");
  //     Home.template(columnData);
  //     // 初始化键值监听
  //     Home.init();
  //   } catch (error) {
  //     console.log("栏目数据转json异常" + error);
  //   }
  // }, function () {
  //   console.log('请求栏目数据异常!');
  // });
}  