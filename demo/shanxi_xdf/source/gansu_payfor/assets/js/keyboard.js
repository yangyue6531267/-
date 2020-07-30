var hoverIndex = 0 //当前card index
var timeout = 5 * 1000 //接口超时时间;
var orderList = [] //套餐价格
var totalCard = orderList.length //套餐卡片数量
// var powerKey = 'm722s566b872o629' //平台提供给百视通的值  
var powerKey = 'b875o629m727s567'
var accessToken = ''
var specialType = ''
var deviceObj = {}
var qrcode =null
var userObj = {}
var downlist = 0
var payType = 1
var payShow = true
var err = 0
var accId = null
var tipObj = {
  isAlert: false,
  itemNo: 0,//0 确定订购    1 暂不订购
};

var firm = {};

firm.KeyBack = function(){
    console.log('KeyBack')
    keyIndex = 0
    clone()
};
// var baseUrl = 'http://47.97.96.103/' // 测试代理
var baseUrl = 'http://gsyd-ds.yanhuamedia.tv/' // 正式代理
var baseUrl1 = 'http://47.97.96.103' 
// 测试代理
// var baseUrl =  'http://bms-i-test.yanhuamedia.tv/' 
// var baseUrl = 'http://117.156.24.246:8991/';//正式地址

$(function () {
  //获取产品信息
  // prompt('yanhua://epg/getProducts?return=getDate')
  getDate();
  console.log(powerKey);
  getToken()
  
})

function keyEvent(e) {
  var timer = null
  e = event || window.event || arguments.callee.caller.arguments[0]
  var keycode = e.which || e.keyCode
  clearTimeout(timer)
  timer = setTimeout(function () {
    if (handleKeyCode(keycode)) {
      e.preventDefault()
    }
  }, 200)
}

function ZfbChange(){
  // 渲染支付内容
  var productPrice = orderList[hoverIndex]
    $('#Text-right').html(
      '<div><span>'+productPrice.displayName+'</span><span>'+productPrice.fee / 100+'元/月</span></div><div>通过扫码支付形式开通包月服务，业务开通后立即生效。</div>'
    )
}

function ZfbShow(){
  $('#playThere2').hide();
  $('#text1').hide();
  $('#playThere1').show();
  $('#text0').show();
  ZfbChange();
  payType = 0;
  $('#pay').html("");
  setTimeout(function(){
    orderCode() //二维码
  },1000);
}

function MobileShow(){
  $('#playThere1').hide();
  $('#text0').hide();
  $('#playThere2').show();
  $('#text1').show();
  payType=1;
}

function getDate() {
  console.log('获取产品信息List-----------getProducts')
  orderList = [{"displayName":"续包月","fee":500,"packageMode":0,"packageType":4,"proceedProductId":"GSBYZT","productCycle":30,"productId":"GSBYZT","remark":"","usFlag":"1"},{"displayName":"包月","fee":500,"packageMode":0,"packageType":1,"proceedProductId":"GSBYZT","productCycle":30,"productId":"GSBYZT|1","remark":"","usFlag":"0"},{"displayName":"包季","fee":500,"packageMode":0,"packageType":2,"proceedProductId":"GSBYZT","productCycle":90,"productId":"GSBYZT|3","remark":"","usFlag":"0"},{"displayName":"包年","fee":500,"packageMode":0,"packageType":3,"proceedProductId":"GSBYZT","productCycle":365,"productId":"GSBYZT|12","remark":"","usFlag":"0"}]
  totalCard = orderList.length;
  specialType = Cookies.get('specialType');
  // 渲染页面
  for (var i = 0; i < orderList.length; i++) {
    $('#tencentCard').append(
      '<div id="card' +
      i +
      '" class="card"><p class="card-head">' +
      orderList[i].displayName +
      '</p><p class="card-price">' +
      orderList[i].fee / 100 +
      '元/月</p></div>'
    )
  }
  switchHover(hoverIndex)
  //获取硬件信息
  prompt('yanhua://epg/deviceInfo?return=deviceInfo')
}

function deviceInfo(obj) {
  console.log('获取硬件信息-----------deviceInfo')
  console.log(obj)
  deviceObj = obj
  //获取账号信息
  accessToken = deviceObj.userToken;
  prompt('yanhua://epg/accountInfo?return=accountInfo')
}

function accountInfo(obj) {
  console.log('获取账号信息-----------accountInfo')
  console.log(obj)
  userObj = obj
  //键盘监听事件
  console.log('基础信息获取完成,绑定键盘事件')
  if (specialType ==1) {
    payShow = false;
    $("#tip_firm").show();
    areaObj = firm;
  }else{
    payShow = true;
    areaObj = window;
    if (orderList[hoverIndex].usFlag==1) {
      ZfbShow()
    } else {
      MobileShow()
    }
  }
}

function handleKeyCode(kc) { 
  kc = parseInt(kc)
  if (kc === 39 || kc === 5) {
    areaObj.KeyRight()
    return true
  } else if (kc === 37 || kc === 3) {
    areaObj.KeyLeft()
    return true
  } else if (kc === 13) {
    areaObj.KeyEnter()
    return true
  } else if (kc === 48) {
    areaObj.num0()
    return true
  } else if (kc === 38 || kc === 1) {
    areaObj.KeyUp()
    return true
  } else if (kc === 40 || kc === 2) {
    areaObj.KeyDown()
    return true
  } else if (kc === 8 || kc === 22 || kc === 340 || kc === 27 || kc === 461) {
    areaObj.KeyBack()
    return true
  } else if (kc === 513 || kc === 832 || kc === 835) {
    areaObj.gotoIndex()
    return true
  } else if (kc === 125 || kc === 415) {
    return true
  } else if (kc === 127 || kc === 19) {
    return true
  }
  return false
}

function KeyRight() {
  if (downlist == 0) {
    if (hoverIndex >= totalCard - 1) {
      return
    }
    hoverIndex++
    switchHover(hoverIndex)
    if (orderList[hoverIndex].usFlag==0) {
      ZfbShow()
    } else {
      MobileShow()
    }
  }
  // else if (downlist == 1){
  //   if (payType>=1) {
  //     return
  //   }
  //   payType++;
  //   downActive(payType);
  // }
  else if (tipObj.isAlert) {
    tipObj.itemNo = 1;
    $('#tipClone').addClass('hover')
    $('#tipOk').removeClass('hover')
  }
}

function KeyLeft() {
  if (downlist == 0) {
  if (hoverIndex <= 0) {
    return
  }
    hoverIndex--
    switchHover(hoverIndex)
    if (orderList[hoverIndex].usFlag==0) {
      ZfbShow()
    } else {
      MobileShow()
    }
  }
  // else if (downlist == 1) {
  //   if (payType<=0) {
  //     return
  //   }
  //   payType--;
  //   downActive(payType);
  //   qrcode.clear(); // 清除代码
  //   orderCode()
  // }
  else if (tipObj.isAlert) {
    tipObj.itemNo = 0;
    $('#tipClone').removeClass('hover')
    $('#tipOk').addClass('hover')
  }
}

function KeyEnter() {
  if (downlist ==2) {
  if (!tipObj.isAlert) {
    tipObj.isAlert = true;
    $('#tip').css('display', 'block')
    $('#tipClone').removeClass('hover')
    $('#tipOk').addClass('hover')
  } else if (tipObj.itemNo == 0) {
    tipObj.isAlert = false;
    $('#tip').css('display', 'none')
  } else if (tipObj.itemNo == 1) {
    tipObj.itemNo = 0;
    console.log('click==========order')
    // 防止多次点击
    // orderCode() //二维码
    document.onkeydown = null
    order()
  }
  }
}

function KeyUp() {
  if (downlist==0) {
    return
  } else if (downlist==1) {
    $('.playThere div').removeClass('active');
    switchHover(hoverIndex)
    downlist--;
  }else if (downlist ==2 ){
    if (payType == 1) {
      downlist--;
      $('#playThere2').addClass('active');
      $('.paytext1 div').removeClass('active');
    }
  }
}

function num0() {
  //退订 线上无此功能，调试临时使用
  cancel()
}

function KeyDown() {
  if (downlist==0) {
    downActive(payType);
    downlist++;
  } else if (downlist==1) {
    if (payType == 1) {
      downlist++;
      $('.playThere div').removeClass('active');
      $('.paytext1 div').addClass('active');
    }
  } else if (downlist==3){
    return
  }
}

function KeyBack() {
  if (tipObj.isAlert) {
    tipObj.isAlert = false;
    tipObj.itemNo = 0;
    $('#tip').css('display', 'none')
  } else {
    console.log('KeyBack')
    keyIndex = 0
    clone()
  }
}

function switchHover(index) {
  $('.card-hover').removeClass('card-hover')
  $('#card' + index).addClass('card-hover')
  console.log(index)
}

function downActive(index) {
  $('.card-hover').removeClass('card-hover')
  $('.playThere div').removeClass('active')
  $('#playThere' + (index+1)).addClass('active')
  if (downlist==1) {
    if (index==0) {
      $('#text0').show()
      $('#text1').hide();
      console.warn($('#text0'))
      console.warn($('#text0'))
    }else if (index ==1){
      $('#text0').hide();
      $('#text1').show();
    }
  }
}

function clone() {
  document.onkeydown = null
  // prompt('yanhua://epg/exit')
  window.location.href = './../detail/detail.html'
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

function getToken() {
  $.ajax({
    type: 'POST',
    url: baseUrl+"/boms/v1/access_token",
    dataType: 'json',
    headers: {
      powerkey: powerKey
    },
    success: function (data) {
      console.log(data)
      if (data.result == 1000) {
        accessToken = data.data
        console.warn('token:'+accessToken);
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

function orderCode() {
  //qrOrderId T开头 不超过15位，保证唯一性， stbId后四位+时间戳
  qrOrderId = 'T' + deviceObj.stbId.substring(deviceObj.stbId.length - 4) + Math.round(new Date().getTime() / 1000).toString()
  // var qrOrderId = 'T1234567893'
  var url = baseUrl + 'v2/gs/ccb/qr_code?qrOrderId=' + qrOrderId;
  var productPrice = orderList[hoverIndex]
  console.warn("获取开头");
  console.warn(productPrice);
  var Ptype = productPrice.productId;
  var result= Ptype.split("|");
  console.warn('切割')
  console.warn(result);
  var months
  var productId
  var chargeType
  if (result.length==2) {
    productId = result[0];
    months = result[1]*1;
    if(months==1 || months==3||months==12){
      chargeType = 2
    }
  }
  var params = {
    body: {
      idType: 1, //用户标识类型，0:手机号,1:宽带账号
      idValue: userObj.mobileNo, //手机号
      deviceType: 1, //设备类型，0：智能网关,1：机顶盒,2：摄像头,3：其它。如果无设备，则选3.[1 机顶盒]
      deviceId: deviceObj.deviceId, //设备MAC，订购需要设备信息时，必选
      // productId: orderList[hoverIndex].productId, //产品标识，家开平台定义的产品或套餐编号
      productId: productId, //产品标识，家开平台定义的产品或套餐编号
      orderChannel: '04', //01	手机客户端	业务平台 02 WAP 业务平台 03 SMS 业务平台 04 机顶盒 业务平台5 智能网关 业务平台06 网上营业厅 BOSS 08 短信营业厅 BOSS 11 营业前台 BOSS 12 WWW网站 业务平台 13 PC客户端 业务平台
      effectiveTime: -1, //订单生效时间，
      chargeType: chargeType, //0免费,1按次计费-点播,2包月计费,3 按时长计费,7包年计费
      months: months, //月
      qrOrderId: qrOrderId //二维码对应的订单id，需确保唯一、不能大于15位
      // idType: 0, //用户标识类型，0:手机号,1:宽带账号
      // idValue: 15002592460, //手机号
      // deviceType: 1, //设备类型，0：智能网关,1：机顶盒,2：摄像头,3：其它。如果无设备，则选3.[1 机顶盒]
      // // deviceId: userObj.clientId, //设备MAC，订购需要设备信息时，必选
      // productId: 123456, //产品标识，家开平台定义的产品或套餐编号
      // orderChannel: '04', //01	手机客户端	业务平台 02 WAP 业务平台 03 SMS 业务平台 04 机顶盒 业务平台5 智能网关 业务平台06 网上营业厅 BOSS 08 短信营业厅 BOSS 11 营业前台 BOSS 12 WWW网站 业务平台 13 PC客户端 业务平台
      // effectiveTime: -1, //订单生效时间，
      // chargeType: 2, //0免费,1按次计费-点播,2包月计费,3 按时长计费,7包年计费
      // months: 1, //月
      // qrOrderId: qrOrderId //二维码对应的订单id，需确保唯一、不能大于15位
    },
    header: {
      // msgid: '61237890345',
      // systemtime: '20160628180001165',
      // version: '1.0',
      // sourceid: '580001',
      // access_token: '1cdacf957c4a496ab3e561ec6486c85c'
      version: '1.0',
      msgid: deviceObj.stbId,
      systemtime: getTimeString(),
      sourceid: '580001',
      access_token: accessToken
    }
  }
  console.log('请求参数');
  console.log(params.body);
  console.log(params.header);
  $.ajax({
    type: 'POST',
    url: url,
    dataType: 'json',
    timeout: timeout,
    contentType: 'application/json',
    data: JSON.stringify(params),
    headers: {
      powerkey: powerKey
    },
    success: function (data) {
      console.log(data.header);
      console.log(data.body);

      if (data.header.resultcode == 1000) {
        console.log('二维码获取成功')
        // $('.qc-code').css('display', 'block')
        if(qrcode!=null){
          qrcode.clear(); 
        }
        $('#pay').html("");
        qrcode = new QRCode("pay", {
          text: data.body.url,
          width: 150,
          height: 150,
          colorDark : "#000000",
          colorLight : "#ffffff",
      });
      // qrcode.clear();
      forTwoOrder();
        // new QRCode(document.getElementById('pay'), data.body.url)
        // $('#pay').css('"background-image"',"url("+data.body.url+")")
      }
    },
    error: function (error) {
      console.log('二维码获取失败')
      console.log(error)
      if (payType == 0&&err==5) {
        orderCode();
        err++;     
      }
    }
  })
}

function jsontype(data){
  console.warn(data);
}

function forTwoOrder(){
// 极光正式代理环境
  var params1 = {"action":"1","platformCode":"32|13","version":"1","accountId":userObj.mobileNo}
  console.log(params);
  var userTokens = '';
  var userId = '';
  var usertoken = $.ajax({
    type: 'POST',
    url: baseUrl1+"/bms/u/user/gsxdfAuth",
    dataType: 'json',
    timeout: 5000,
    data: params1,
    success:function(data){
      console.warn(data.data.userToken);
      userTokens = data.data.userTokendata;
      userId = data.data.userId;
      console.log(userTokens);
      console.warn(url);
      var params ={
        "platformCode":"32|13",
        "accountId":userObj.mobileNo,
        "userId":userId,
        "userToken":userTokens,
        "qrOrderId":qrOrderId,
        "version":"1"
      }
      var orderfor = $.ajax({
            type: 'POST',
            url: baseUrl1+'/bms/p/order/gsxdfQuery',
            dataType: "jsonp",
            // data: JSON.stringify(date),
            data:params,
            success:function(data){
              console.warn(data)
              if (data.result.orders.length>0) {
                console.log('订购完成');
                Cookies.set("order", url, { path: '/' });
                clone();
              }else{
                  var min = 5;
                  if (item> min*60) {
                    return;
                  }else{
                    if (accId !=null) {
                      clearTimeout(accId);
                    }
                    accId = setTimeout(function(){
                      if (payType == 0) {
                        console.warn('未订购')
                          forTwoOrder();
                          item++;
                        }
                    },1000)
                  }
              }
            },error:function(error){
              console.log(error)
            }
          })
    },error:function(er){
      console.log('鉴权失败');
      console.log(er)
    }
  })
  
  // var date = {
  //   spCode:userObj.spCode,
  //   stbld:userObj.stbId,
  //   clientId:userObj.clientId,
  //   vuid:userObj.vuid,
  //   userId:userObj.userId,
  //   qrOrderId:qrOrderId
  // }
}

function order() {
  var url = baseUrl + 'v2/gs/tel/order';  //新版本接口未上线，上线时间待定
  // var url = baseUrl + 'api/orderRequest' //代理  老版本接口，暂用
  var productPrice = orderList[hoverIndex]
  var params = {
    body: {
      userAuthorizationCode: '', //验证码(可选)
      idType: userObj.idType, //用户标识类型，0:手机号,1:宽带账号
      idValue: userObj.idValue, //手机号
      deviceType: 1, //设备类型，0：智能网关,1：机顶盒,2：摄像头,3：其它。如果无设备，则选3.[1 机顶盒]
      deviceId: userObj.stbId, //设备MAC，订购需要设备信息时，必选
      newDeviceId: '', //新设备MAC，变更设备时必选
      productId: orderList[hoverIndex].productId, //产品标识，家开平台定义的产品或套餐编号
      contendId: '', //内容标识，点播业务时必选
      newProductId: '', //新产品标识，变更套餐时有效
      // "chargeType": orderList[hoverIndex].packageType, //计费类型，1:免费；2：按次；3：包月；4：包年计费；5：按时长计费；6：按周期计费。参考附录C 计费类型编码。
      chargeType: 2, //计费类型，1:免费；2：按次；3：包月；4：包年计费；5：按时长计费；6：按周期计费。参考附录C 计费类型编码。
      productPrice: String(orderList[hoverIndex].fee / 100), //计费金额，比如5。如果点播则表示5元/次，如果包月则表示5元/月
      orderType: 1, //订单类型，0:退订，1:订购,2：变更 –百视通没有变更的概念，可以不使用变更业务
      orderChannel: '04', //01	手机客户端	业务平台 02 WAP 业务平台 03 SMS 业务平台 04 机顶盒 业务平台5 智能网关 业务平台06 网上营业厅 BOSS 08 短信营业厅 BOSS 11 营业前台 BOSS 12 WWW网站 业务平台 13 PC客户端 业务平台
      effectiveTime: -1 //订单生效时间，-1
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
    timeout: timeout,
    contentType: 'application/json',
   headers: {
      powerkey: powerKey
    },
    data: JSON.stringify(params),
    success: function (data) {
      tipObj.isAlert = false;
      $('#tip').css('display', 'none')
      console.log('header====' + JSON.stringify(data.header))
      console.log('body=====' + JSON.stringify(data.body))
      document.onkeydown = keyEvent
      if (data.header.resultcode == 1000) {
        console.log('订购成功')
        prompt(
          'yanhua://epg/payNotify?stbId=' +
          userObj.stbId +
          '&clentId=' +
          userObj.clientId +
          '&orderNum=' +
          data.body.orderNumber +
          '&productId=' +
          orderList[hoverIndex].productId +
          '&fee=' +
          orderList[hoverIndex].fee +
          '&spCode=' +
          userObj.spCode +
          '&isOrder=true'
        )
      } else if (data.header.resultcode == 504) {
        //重新鉴权
        authentication()
      } else {
        console.log('操作失败')
        prompt(
          'yanhua://epg/payNotify?stbId=' +
          userObj.stbId +
          '&clientId=' +
          userObj.clientId +
          '&orderNum=' +
          data.body.orderNumber +
          '&productId=' +
          orderList[hoverIndex].productId +
          '&fe' +
          orderList[hoverIndex].fee +
          '&spCode=' +
          userObj.spCode +
          '&isOrder=false'
        )
      }
      // case 2506:
      //     console.log("操作失败，必填参数为空");
      // break;
      // case 2509:
      //     console.log("操作失败，参数输入错误");
      // break;
      // case 2520:
      //     console.log("操作失败，点播不能退订或者变更套餐");
      // break;
      // case 2504:
      //     console.log("操作失败，产品已下架");
      // break;
      // case 2505:
      //     console.log("操作失败，产品信息不一致");
      // break;
      // case 2510:
      //     console.log("操作失败,失效时间小于请求时间");
      // break;
      // case 2511:
      //     cnsole.log("操作失败,生效效时间大于失效时间");
    },
    error: function (err) {
      console.log('操作失败')
      console.log('err=====' + JSON.stringify(err))
      prompt(
        'yanhua://epg/payNotify?stbId=' +
        userObj.stbId +
        '&clientId=' +
        userObj.clientId +
        '&orderNum=' +
        '' +
        '&productId=' +
        orderList[hoverIndex].productId +
        '&fee=' +
        orderList[hoverIndex].fee +
        '&spCode=' +
        userObj.spCode +
        '&isOrder=false'
      )
      tipObj.isAlert = false;
      $('#tip').css('display', 'none')
      document.onkeydown = keyEvent
    },
    complete: function (XMLHttpRequest, status) {
      if (status == 'timeout') {
        tipObjisAlert = false;
        $('#tip').css('display', 'none')
        order.abort() // 超时后中断请求
        console.log('网络超时')
        prompt(
          'yanhua://epg/payNotify?stbId=' +
          userObj.stbId +
          '&clientId=' +
          userObj.clientId +
          '&orderNum=' +
          '' +
          '&productId=' +
          orderList[hoverIndex].productId +
          '&fee=' +
          orderList[hoverIndex].fee +
          '&spCode=' +
          userObj.spCode +
          '&isOrder=false'
        )
      }
    }
  })
}

//退订
function cancel() {
  var url = baeUrl + 'v2/gs/cancel'
  var productPrice = orderList[hoverIndex]
  var params = {
    body: {
      idValue: userObj.idValue, //手机号
      productId: orderList[hoverIndex].productId, //产品标识，家开平台定义的产品或套餐编号
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
    timeout: timeout,
    contentType: 'application/json',
    data: JSON.stringify(params),
    success: function (data) {
      if (data.header.resultcode == 1000) {
        console.log('退订成功')
      } else {      console.log('退订失败')
      }
    },
    error: function (err) {
      console.log('退订失败')
      console.log(err)
    }
  })
}

function authentication() {
  var url = baseUrl + 'v2/gs/verify'  //新版本接口未上线，上线时间待定
  // var url = baseUrl + 'api/orderVerify' //老版本暂用
  var params = {
    body: {
      idType: userObj.idType, //用户标识类型，0:手机号,1:宽带账号
      idValue: userObj.idValue, //手机号
      deviceType: '1', //设备类型，0：智能网关,1：机顶盒,2：摄像头,3：其它。如果无设备，则选3.[1 机顶盒]
      productId: orderList[hoverIndex].productId //产品标识，家开平台定义的产品或套餐编号
      // "contentId": userObj.contentId, //内容标识，点播业务时必选
    },
    header: {
      version: '1.0',
      msgid: userObj.stbId,
      systemtime: getTimeString(),
      sourceid: userObj.sourceId,
      access_token: accessToken
    }
  }
  $.ajax({
    type: 'POST',
    url: url,
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify(params),
    success: function (data) {
      console.log(data)
      if (data.body.isVerified == 1) {
        console.log('订购成功')
        prompt(
          'yanhua://epg/payNotify?stbId=' +
          userObj.stbId +
          '&clientId=' +
          userObj.clientId +
          '&orderNum=' +
          data.body.orderNumber +
          '&productId=' +
          orderList[hoverIndex].productId +
          '&fee=' +
          orderList[hoverIndex].fee +
          '&spCode=' +
          userObj.spCode +        '&isOrder=true'
        )
      } else {
        console.log('操作失败')
      }
    },
    error: function (err) {
      console.log('操作失败')
      console.log(err)
    }
  })
}


document.onkeydown = keyEvent;