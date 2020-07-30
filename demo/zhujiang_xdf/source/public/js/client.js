/**
 * create:2018-11-06
 *
 * update:jiangjie
 *
 */




/**
 * 将获取的终端信息重新定义给页面使用
 */
yh.setDeviceInfo = function (devices) {
  try {
    var DeviceOb = { "reserve_group": "yanhua", "model": "", "content_id": "", "terrace_id": "", "operator_id": "", "apk_version": "7", "brand": "", "site_id": "19", "user_id": "yanhua123", "device_id": "", "soft_v": "3.0.1", "sys_v": "4.4.2", "mode": "","mac":"","ip":"","apk_version_name":"","cdn":""};
    // var DeviceOb = JSON.parse(devices)
    yh.reserve_group = DeviceOb.reserve_group
    yh.model = DeviceOb.model
    yh.content_id = DeviceOb.content_id
    yh.terrace_id = DeviceOb.terrace_id
    yh.operator_id = DeviceOb.operator_id
    yh.apk_version = DeviceOb.apk_version
    yh.brand = DeviceOb.brand
    yh.siteId = DeviceOb.site_id
    yh.userId = DeviceOb.user_id
    alert(yh.userId);
    yh.device_id = DeviceOb.device_id
    yh.soft_v = DeviceOb.soft_v
    yh.sys_v = DeviceOb.sys_v
    yh.mode = DeviceOb.mode
    yh.mac = DeviceOb.mac
    yh.ip = DeviceOb.ip
    yh.apk_version_name = DeviceOb.apk_version_name
    yh.cdn = DeviceOb.cdn
  } catch (error) {
    console.log('处理设备信息异常')
  }
}

/**
 *  鉴权信息存放
 * @param {*} authOb
 */
yh.setSpAuthInfo = function (authOb) {
  try {
    yh.userToken = authOb.userToken // 用户令牌

    yh.userGroup = authOb.userGroup // 用户分组

    yh.areaCode = authOb.areaCode // 用户区域

    yh.userName = authOb.userName // 用户名称

    yh.telephone = authOb.telephone // 联系电话
  } catch (error) {
    console.log('Sp鉴权结果处理异常')
  }
}

/***
 *  获取地市分组CDN类型
 */
yh.getCdn = function (districtCode) {
  var cdn = ''
  for (var index = 0; index < custInfo.length; index++) {
    var element = custInfo[index]
    if (element.districtCode == districtCode) {
      cdn = element.cdn
      break
    }
  }
  return cdn
}


/**
 * 获取userToken
 */

yh.getEpgToken =function() {
  var userToken = AT.getEpgToken()
  return userToken
}


/**
 * 获取机顶盒业务账号
 */

yh.getEpgUserName= function () {
  var userName = AT.getEpgUserName()
  return userName
}

/**
 * 获取支付接口
 */

yh.getPayUrl = function () {
  var getPayUrl = AT.getPayUrl()
  return getPayUrl
}

/**
 * 获取播放鉴权接口
 */

yh.getPlayAuthUrl = function () {
  var getPlayAuthUrl = AT.getPlayAuthUrl()
  return getPlayAuthUrl
}

/**
 * 获取认证接口地址
 */

yh.getUserAuthUrl = function () {
  var getUserAuthUrl = AT.getUserAuthUrl()
  return getUserAuthUrl
}


/**
 * STB支持的keys
 */
yh.STB_KEYS = {
  DEVICE_ID: 'deviceId', // 设备ID
  STB_IP: 'stbip', // 设备ip
  MAC: 'mac', // mac地址
  TIME_SHIFT: 'timeshift', // 是否支持时移
  USER_ID: 'userId', // 用户主账号
  ACCOUNT_IDENTITY: 'accountIdentity', // 用户主账号(基地盒子）
  USER_TOKEN: 'usertoken', // 鉴权接口spToken参数
  EPG_ADDRESS: 'EPGAddress', // EPGAddress参数
  EPG_SERVER: 'epgserver', // epgserver参数
  STB_ID: 'stbid' // 盒子串号
}

/***
 *  启动apk
 *
 *  @param url 通用地址
 */
yh.OpenApk = function (url) {
  var type = 'OpenUrl'
  // var url = "http://sns.is.ysten.com/CNTV/index.html?action=detail&object=2924645";
  if (window.widgetmanager && window.widgetmanager.launchApp) {
    window.widgetmanager.launchApp(type, url, '', true)
  }
}
/**
 * 获取STB支持的配置参数
 * 也可以通过该方法获取盒子的BIMS下发参数 key为boot的key
 * @param key
 */
yh.getSTBParameter = function(key, defaultVal) {
  if (window.widgetmanager && window.widgetmanager.getParameter) {
    return window.widgetmanager.getParameter(key) || defaultVal
  }
  return defaultVal
}

/**
 * 获取盒子DeviceId
 */
yh.getSTBDeviceId = function(defaultVal){
  try {
    var deviceId = getSTBParameter('deviceId')
    if (deviceId == '' && window.service) {
      deviceId = window.service.getDeviceID()
    }

    return deviceId != '' ? deviceId : defaultVal
  } catch (error) {
    return defaultVal
  }
}



/**
 * 发消息给STB
 * @param content
 */
yh.sendMsg2STB = function(content) {
  if (window.widgetmanager && window.widgetmanager.sendMsg2Android) {
    window.gefoAndroid.sendMsg2Android(content)
  }
}

/***
 *  获取用户账号
 */
yh.getUserAccount = function () {
  try {
    var account = window.widgetmanager.getParameter('userId')
    return account
  } catch (err) {
    return '15196390128'
  }
}

/**
 * 退出当前webview标签
 */
yh.back = function () {
  try {
    ERT.exit();
  } catch (error) {
    console.log('调用ERT.exit()方法异常：');
  }
};

// 查询所有历史记录
// 返回:
// 收藏的条目json
yh.queryHistory = function () {
  try {
    return ERT.queryHistory();
  } catch (error) {
    return [];
    console.log('调用ERT.openqueryHistory()方法异常：');
  }
}

/**
 * 删除所有历史记录
 */
yh.removeHistory = function () {
  try {
    ERT.removeHistory();
  } catch (error) {
    console.log('调用ERT.removeHistory()方法异常：');
  }
}
/**
 * 删除历史记录
 * @param {*} assetId
 * @param {*} specialId
 */
yh.removeHistorys = function (assetId) {
  // console.log('删除' + assetId);
  try {
    ERT.removeHistory(assetId);
  } catch (error) {
    console.log('调用ERT.removeFavorites()方法异常：', assetId);
  }
}
/**
 * 根据资产ID查询播放历史
 * @param {*} assetId
 */
yh.playHistory = function (assetId) {
  try {
    return ERT.queryHistory(assetId);
  } catch (error) {
    console.log('调用ERT.queryHistory()方法异常：', assetId);
    return '';
  }
}

// 获取apk观看总时长
yh.getTotalSeeTime = function () {
  try {
    return JsCallVodPlayer.getTotalSeeTime();
  } catch (error) {
    return 0
    console.log('获取APK观看总时长异常');
  }
}

