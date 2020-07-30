// import { player } from "./play";

// 首页初始化加载

// prompt('yanhua://epg/deviceInfo?return=deviceInfo')

// accountInfo({"mobileNo":"15117006612"})

// Utility.getSysInfo("epg.accountidentity")   获取手机号（账号密码关联的手机号）
// Utility.getUserID()   获取账号
// Utility.getStbID()   获取STB

// function deviceInfo(obj) {
//   console.log('获取硬件信息-----------deviceInfo')
//   console.log(obj)
//   deviceObj = obj
//   //获取账号信息
//   Cookies.set('msgid', deviceObj.stbId, {path: '/'})
//   prompt('yanhua://epg/accountInfo?return=accountInfo')
// }
function accountInfo() {
  console.log('获取账号信息')
  try {
    Cookies.set('XDF_stbId', Utility.getStbID(), {
      path: '/'
    })
    Cookies.set('XDF_userId', Utility.getUserID(), {
      path: '/'
    })
    Cookies.set('mobileNo', Utility.getSysInfo("epg.accountidentity"), {
      path: '/'
    }) //正式环境手机号
  } catch (err) {
    console.log(err);
  }

  // console.log('获取账号信息-----------accountInfo')
  // console.log(obj)
  // userObj = obj;
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
  orderList = [{
      "displayName": "话费支付",
      "fee": 2900,
      "packageMode": 0,
      "packageType": 4,
      "proceedProductId": "GSBYZT",
      "productCycle": 30,
      "productId": "158020191212000053|1",
      "remark": "",
      "usFlag": "1"
    },
    {
      "displayName": "二维码支付",
      "fee": 2900,
      "packageMode": 0,
      "packageType": 1,
      "proceedProductId": "GSBYZT",
      "productCycle": 30,
      "productId": "158020191212000053|1",
      "remark": "",
      "usFlag": "0"
    }
  ]
  // {"displayName":"包季","fee":500,"packageMode":0,"packageType":2,"proceedProductId":"GSBYZT","productCycle":90,"productId":"158020190626000003|3","remark":"","usFlag":"0"},
  // {"displayName":"包年","fee":500,"packageMode":0,"packageType":3,"proceedProductId":"GSBYZT","productCycle":365,"productId":"158020190703000005|12","remark":"","usFlag":"0"}]
  // 测试手机号
  Cookies.set('orderList', JSON.stringify(orderList), {
    path: '/'
  })
  var user = Cookies.get('XDF_userId') || "TV9371242791";
  // var baseUrl = 'http://47.97.96.103'
  var baseUrl = "http://bms-i.yanhuamedia.tv"
  // 极光正式代理环境
  var params = {
    action: "1",
    platformCode: "54",
    version: "1",
    accountId: user
  }
  //键盘监听事件
  $.ajax({
    type: 'POST',
    url: baseUrl + "/bms/u/user/gsxdfAuth",
    dataType: 'json',
    timeout: 5000,
    contentType: 'application/json',
    data: JSON.stringify(params),
    success: function (data) {
      if (data.data.specialType != undefined) {
        if (data.data.specialType == 2) {
          Cookies.set('specialType', 0, {
            path: '/'
          })
          // 白名单
        } else if (data.data.specialType == 1) {
          Cookies.set('specialType', 1, {
            path: '/'
          })
          // 黑名单
        }
      } else {
        Cookies.set('specialType', 2, {
          path: '/'
        })
        // 普通
      }
      Cookies.set('productIds', data.data.productIds, {
        path: '/'
      })
      console.log(data.data);
    },
    error: function (err) {
      console.log('无效用户')
      console.log(err)
    }
  })
  getData()
}


function init() {
  var returnurl = getQueryString("returnurl") ? getQueryString("returnurl") : "";
  Cookies.set('XEStv_EPG_returnUrl', returnurl, {
    path: '/'
  })
  accountInfo();
  if (!getQueryString('pos')) {
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
}

function getData() {
  // 获取首页栏目数据
  $.ajax({
    type: 'GET',
    url: baseUrl + "&p=yhNavigationBar&k=1&v=1&catId=207867&c=28&returnType=jsonp",
    dataType: "jsonp",
    jsonpCallback: 'jsonpCallback',
    success: function (response) {
      try {
        Home.template(response);
        // 初始化键值监听
        Home.init();
      } catch (error) {
        console.log("栏目数据转json异常" + error);
      }
    },
    error: function (error) {
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
  console.log('请求完成')
}