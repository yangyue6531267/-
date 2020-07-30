var codeTime = 60;//验证码事件
var timer = null;//定时器
var baseUrl = "http://bms-i-test.yanhuamedia.tv/bms/u";
var params = {}; //userParams

function uploadUserParams() {
  getId("codeTime").innerHTML = codeTime + "s后";
  params = {
    appv: getQueryString('appv') || "1",
    platformCode: getQueryString('platformCode'),
    version: "1",
    // "spCode": getQueryString('spCode'),
    // "accountId": '',
    // "userCode": '',
    channelId: getQueryString('channelId'),
    mac: getQueryString('mac'),
    areaCode: getQueryString('areaCode'),
    qrcode: getQueryString('qrcode')
  }
  console.log('url获取参数是-------' + JSON.stringify(params))
  var data = JSON.stringify(params)
  //扫码通知接口
  ajax({
    type: "POST",
    url: baseUrl + "/scan/qrcode",
    data: data,
    dataType: "json",
    contentType: "application/json",
    success: function (response) {
      console.log('扫码通知接口---' + response);
    },
    fail: function (error) {
      console.log(error);
    }
  })
}
uploadUserParams();
function submit() {
  var phone = getId("phone").value;
  var userCode = getId("userCode").value;
  if (!(/^1[3456789]\d{9}$/.test(phone))) {
    toast('请填写正确手机号');
    return
  }

  if (userCode.length < 4 || userCode.length > 6) {
    toast('请输入正确验证码');
    return
  }
  var data = params;
  delete data.channelId;
  delete data.appv;
  data.accountId = phone;
  data.userCode = userCode;
  console.log('验证码登陆------' + JSON.stringify(data));
  ajax({
    type: "POST",
    url: baseUrl + "/login/code?version=1",
    data: JSON.stringify(data),
    dataType: "json",
    contentType: "application/json",
    success: function (response) {
      var res = JSON.parse(response)
      if (res.code == 200) {
        window.location.replace("./success.html")
      } else {
        // toast(res.mes);
        toast(res.mes);
      }
    },
    fail: function (error) {
      console.log(error);
    }
  })
}

function getCode() {
  // 获取验证码
  if (timer) { return }
  var phone = getId("phone").value
  if (!(/^1[3456789]\d{9}$/.test(phone))) {
    toast('请填写正确手机号');
    return
  }
  var data = {
    "version": params.version || '1',
    "platformCode": params.platformCode,
    "accountId": phone
  }
  ajax({
    type: "POST",
    url: baseUrl + "/login/getCode?version=1",
    data: JSON.stringify(data),
    dataType: "json",
    contentType: "application/json",
    success: function (response) {
      console.log(response)
      var res = JSON.parse(response)
      if (res.code == 200) {
        toggleClass(getId('msgCode'), 'active')
        timer = setInterval(function () {
          codeTime--
          getId("codeTime").innerHTML = codeTime + "s后";
          if (codeTime == 0) {
            removeClass(getId('msgCode'), 'active')
            clearInterval(timer);
            timer = null;
            codeTime = 60;
            getId("codeTime").innerHTML = codeTime + "s后";
          }
        }, 1000)
      } else {
        toast(res.mes);
      }
    },
    fail: function (error) {
      toast("网络错误");
    }
  })
}