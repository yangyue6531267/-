/****
 *
 * update: 2019.06.14
 * write: jiang
 */

var logAddress = 'http://192.168.21.27/yanhua';

// var logAddress = 'http://192.168.254.133/yanhua';

// var logAddress = 'http://bigdata.yanhuamedia.tv/logCollect'
function bi () {

}

/****
 * 公共字段
 * site_id(站点ID)
 * device_id（终端设备ID）
 * user_id（用户ID）
 * log_type（日志类型）
 * v(日志版本)
 * model（终端硬件型号）
 * soft_v（终端软件版本号）
 * vip(用户属性)
 * province（用户省份）
 * create_time（触发时间）
 */
var commonParams = {
  site_id: yh.siteId,
  device_id: yh.device_id,
  user_id: yh.userId,
  log_type: '2',
  v: '2',
  model: yh.model,//终端硬件型号 
  soft_v: 'v2.0.002',//终端软件版本
  vip: Cookies.get('isOrder') || '0',
  province: encodeURI("重庆"),
  bigdata_flag: '0',
  create_time: (new Date()).valueOf()
}
var commonParamsStr = getLogString(commonParams);

// 启动
bi.start = function (type) {
  var logOb = commonParams;
  logOb.event = '102';
  logOb.start_type = type || '0101';
  var startTemp = commonParamsStr + '"event":' + '"' + logOb.event + '"' + ',"start_type":' + '"' + logOb.start_type + '"' + '} ';
  // console.log('启动数据:'+startTemp)
  logup(startTemp);
}
// 退出
bi.end = function () {
  commonParamsStr = getLogString(commonParams)
  var logOb = commonParams;
  logOb.event = '103';
  var out_time = new Date().getTime();
  logOb.time = out_time - Cookies.get('start_time')*1;
  var startTemp = commonParamsStr + '"event":' + '"' + logOb.event + '"' + ',"time":' + '"' + logOb.time + '"' + '} ';
  // console.log('退出数据:'+startTemp)
  logup(startTemp);
}


// 页面访问
bi.jump = function (jsonOb) {
  var logOb = commonParams;
  logOb.event = '104';
  logOb.page_type = jsonOb.page_type;
  logOb.page_id = jsonOb.page_id;
  if(arguments[1]){
    logOb.parent_page_type = 'null';
    logOb.parent_page_id = 'null';
  }else{
    logOb.parent_page_type = Cookies.get('parent_page_type')?Cookies.get('parent_page_type'):'null';
    logOb.parent_page_id = Cookies.get('parent_page_id')?Cookies.get('parent_page_id'):'null';
  }
  var startTemp = commonParamsStr + '"event":' + '"' + logOb.event + '"' + ',"parent_page_type":'
    + '"' + logOb.parent_page_type + '"' + ',"parent_page_id":' + '"' + logOb.parent_page_id + '"'
    + ',"page_type": ' + '"' + logOb.page_type + '"' + ',"page_id":' + '"'
    + logOb.page_id + '"' + '} ';
    // console.log('页面访问数据:'+startTemp)
  logup(startTemp);
}


// 订购按钮点击
bi.orderClick = function (jsonOb) {
  var logOb = commonParams;
  logOb.event = '202';
  logOb.page_type = jsonOb.page_type;
  logOb.page_id = jsonOb.page_id;
  var startTemp = commonParamsStr + '"event":' + '"' + logOb.event + '"' + ',"page_type": ' + '"' + logOb.page_type + '"' + ',"page_id":' + '"'
    + logOb.page_id + '"' + '} ';
    // console.log('订购按钮点击数据:'+startTemp)
  logup(startTemp);
}

/****
 * 收藏/取消收藏
 *
 * cid 被收藏对象的id
 * click_type 当前动作类型 	1、收藏 2、取消收藏
 */
bi.collection = function (jsonOb) {
  var logOb = commonParams;
  logOb.event = '4';
  logOb.collect = jsonOb.collect;
  logOb.cid = jsonOb.cid;
  logOb.click_type = jsonOb.click_type;
  var startTemp = commonParamsStr + '"event":' + '"' + logOb.event + '"' + ',"collect":'
    + '"' + logOb.collect + '"' + ',"cid":' + '"' + logOb.cid + '"'
    + ',"click_type": ' + '"' + logOb.click_type + '"' + '} ';
    // console.log('收藏/取消收藏数据:'+startTemp)
  logup(startTemp);
}

/****
 *  筛选页键盘区操作
 *
 * result 当前动作完成的结果类型枚举0、键盘筛选后右边无资产时，1、从键盘右移到结果区时发送，
 * keyword 当前动作完成时的上报的内容 筛选完成时上报筛选的字符串，以“|”隔开
 */
bi.filterKeyDo = function (jsonOb) {
  var logOb = commonParams;
  logOb.event = '14';
  logOb.result = jsonOb.result;
  logOb.keyword = jsonOb.keyword;
  logOb.cid = jsonOb.cid;
  logOb.cat_id = jsonOb.cat_id;
  var startTemp = commonParamsStr + '"event":' + '"' + logOb.event + '"' + ',"cid":' + '"' + logOb.cid + '"' + ',"result":' 
  + '"' + logOb.result + '"' + ',"cat_id":' + '"' + logOb.cat_id + '"' + ',"keyword":' + '"' + logOb.keyword + '"' + '} ';
  // console.log('筛选页数据:'+startTemp)
  logup(startTemp);
}

/****
 *  搜索页键盘区操作
 *
 * result 当前动作完成的结果类型枚举0、键盘筛选后右边无资产时，1、从键盘右移到结果区时发送，
 * keyword 当前动作完成时的上报的内容 筛选完成时上报筛选的字符串，以“|”隔开
 */
bi.searchkeyDo = function (jsonOb) {
  var logOb = commonParams;
  logOb.event = '6';
  logOb.result = jsonOb.result;
  logOb.keyword = jsonOb.keyword;
  logOb.click_type = jsonOb.click_type;
  logOb.cid = jsonOb.cid;
  var startTemp = commonParamsStr + '"event":' + '"' + logOb.event + '"' + ',"result":' + '"' + logOb.result + '"'+ ',"click_type":' + '"' + logOb.click_type + '"'+ ',"cid":' + '"' + logOb.cid + '"' + ',"keyword":' + '"' + logOb.keyword + '"' + '} ';
  // console.log('搜索页数据:'+startTemp)
  logup(startTemp);
}

/****
 *  收藏页/历史页操作
 */
bi.historical = function (jsonOb) {
  var startTemp = commonParamsStr + jsonOb + '} ';
  // console.log('收藏页/历史页操作数据:'+startTemp)
  logup(startTemp);
}

/****
 *  推荐位点击
 */
bi.RecommendedClick = function (jsonOb) {
  var logOb = commonParams;
  logOb.event = '3';
  logOb.pos_id = jsonOb.pos_id;
  logOb.recmd_id = jsonOb.recmd_id;
  logOb.page_type = jsonOb.page_type;
  logOb.page_id = jsonOb.page_id;
  logOb.click_type = jsonOb.click_type;
  logOb.cid = jsonOb.cid;
  var startTemp = commonParamsStr + '"event":' + '"' + logOb.event + '"' + ',"page_type":' + '"' + logOb.page_type + '"' + ',"page_id":' + '"' + logOb.page_id + '"' + ',"pos_id":' + '"' + logOb.pos_id + '"'+ ',"click_type":' + '"' + logOb.click_type + '"'+ ',"cid":' + '"' + logOb.cid + '"' + ',"recmd_id":' + '"' + logOb.recmd_id + '"' + '} ';
  // console.log('推荐位点击数据:'+startTemp)
  logup(startTemp);
}

/****
 * 支付
 *
 * pkg_type 产品包类型
 * pkg_id 产品包ID
 * pkg_price 产品包价格
 * action 订购动作
 * order_msg 订购信息
 * parent_page_id 父级页面ID
 * parent_page_type 父级页面类型
 * preview 试看类型
 * point 订购时机
 * operator_id 影视内容包提供商ID
 */
bi.order = function (jsonOb) {
  var logOb = commonParams;
  logOb.event = '201';
  logOb.pkg_type = jsonOb.pkg_type;
  logOb.pkg_id = jsonOb.pkg_id;
  logOb.point = jsonOb.point;
  logOb.operator_id = jsonOb.operator_id;
  logOb.order_msg = jsonOb.order_msg; 
  logOb.parent_page_id = jsonOb.parent_page_id;
  logOb.parent_page_type = jsonOb.parent_page_type;
  var startTemp = commonParamsStr + '"event": ' + '"' + logOb.event + '"'
    + ',"pkg_type":'+ '"' + logOb.pkg_type + '"' + ',"pkg_id": ' + '"' + logOb.pkg_id + '"'
    + ',"operator_id":' + '"' + logOb.operator_id + '"'
    + ',"point":' + '"' + logOb.point + '"' 
    + ',"order_msg": ' + '"'+ logOb.order_msg + '"' + ',"parent_page_id": ' + '"' + logOb.parent_page_id + '"'
    + ',"parent_page_type": ' + '"' + logOb.parent_page_type + '"' + '} ';
    // console.log('订购数据:'+startTemp)
  logup(startTemp);
}

/***
 *  点播
 * asset_id 资产壳ID
 * item_id  子集ID
 * qb_datetime 起播时间
 * zb_datetime 终止播放时间
 * time 实际播放时长
 * ep 集数
 * fee 是否收费
 * isfullscreen 是否为全屏播放
 * pos_id 推荐页位置
 * recmd_id 大数据推荐类型
 * parent_page_type 父级页面类型
 * parent_page_id 父级页面ID
 * 
 * qb_assettime 视频起播时间
 * zb_assettime 视频终播时间
 * error 错误信息
 * asset_from 资产来源
 * asset_type 资产类型
 * duration 适配总时长
 */
bi.vod = function (jsonOb) {
  commonParamsStr = getLogString(commonParams)
  var logOb = commonParams;
  // logOb.event = '8';
  // logOb.asset_id = jsonOb.asset_id;
  // logOb.item_id = jsonOb.item_id;
  logOb.qb_datetime = Cookies.get('qb_datetime');
  logOb.zb_datetime = (new Date()).valueOf();
  logOb.time = logOb.zb_datetime - logOb.qb_datetime;
  logOb.isFullScreen = Cookies.get('isFullScreen');
  // logOb.ep = jsonOb.ep;
  // logOb.fee = jsonOb.fee;
  // logOb.isFullScreen = logOb.isFullScreen;
  // logOb.pos_id = jsonOb.pos_id;
  // logOb.recmd_id = '3';
  // logOb.parent_page_type = jsonOb.parent_page_type || '';
  // logOb.parent_page_id = jsonOb.parent_page_id || '';
  // logOb.qb_assettime = jsonOb.qb_assettime;
  // logOb.zb_assettime = jsonOb.zb_assettime;
  // logOb.duration = jsonOb.duration;
  // logOb.asset_from = jsonOb.asset_from;
  // logOb.asset_type = jsonOb.asset_type;
  // logOb.error = jsonOb.error;

  var startTemp = commonParamsStr + jsonOb + '"qb_datetime": ' + '"' + logOb.qb_datetime + '"'
  + ',"zb_datetime": ' + '"' + logOb.zb_datetime + '"'
  + ',"isFullScreen": ' + '"' + logOb.isFullScreen + '"'
  + ',"time": ' + '"' + logOb.time + '"' + '} ';
  // var startTemp = commonParamsStr + '"event":' + '"' + logOb.event + '"' + ',"asset_id":'
  //   + '"' + logOb.asset_id + '"' + ',"item_id":' + '"' + logOb.item_id + '"'
  //   + ',"qb_datetime": ' + '"' + logOb.qb_datetime + '"' + ',"zb_datetime": ' + '"'
  //   + logOb.zb_datetime + '"' + ',"ep": ' + '"' + logOb.ep + '"'
  //   + ',"time": ' + '"' + logOb.time + '"'
  //   + ',"fee": ' + '"' + logOb.fee + '"'
  //   + ',"parent_page_type": ' + '"' + logOb.parent_page_type + '"'
  //   + ',"parent_page_id": ' + '"' + logOb.parent_page_id + '"'
  //   + ',"pos_id": ' + '"' + logOb.pos_id + '"'
  //   + ',"isFullScreen": ' + '"' + logOb.isFullScreen + '"'
  //   + ',"recmd_id": ' + '"' + logOb.recmd_id + '"' + '} ';
    // console.log('点播数据:'+startTemp)
  logup(startTemp);
}

// 解决盒子不支持JSON.stringify()
function getLogString () {
  commonParams.create_time = (new Date()).valueOf();
  var value = '{"site_id":' + '"' + commonParams.site_id + '"' + ',"device_id":' + '"' + commonParams.device_id + '"' + ',"user_id":' + '"' + commonParams.user_id + '"' + ',"log_type":' + '"' + commonParams.log_type + '"' + ',"v":' + '"' + commonParams.v + '"' + ',"model":' + '"' + commonParams.model + '"' + ',"soft_v":' + '"' + commonParams.soft_v + '"' + ',"vip":' + '"' + commonParams.vip + '"' + ',"province":' + '"' + commonParams.province + '"' + ',"bigdata_flag":' + '"' + commonParams.bigdata_flag + '"' + ',"create_time":' + '"' + commonParams.create_time + '"' + ', ';
  return value;
}
// 上传
function logup(jsonOb) {
  // console.log('BI log:' +jsonOb)
  if (playConfig.stbType == "p60") {
    bridge.ajax('post', logAddress, 'application/json', '', jsonOb, function () {
      // toast('日志发生完毕')
    }, function (err) {
      // toast('失败')
    })
  } else {
    ajax({ // 入口数据
      type: "POST",
      url: logAddress,
      contentType: 'application/json',
      data: jsonOb,
      dataType: "json",
      success: function (data) {
        // console.log('bi 日志发生完毕'); 
      },
      error: function (err) {
        // console.log(err)
      }
    });
  }
}



// 重庆广电数据上报要求
bi.CQlogup = function(jsonOb) {
  var CQlogAddress = 'http://192.168.21.27:7001/cqxdf?' + encodeURIComponent(jsonOb);
  if (playConfig.stbType == "p60") {
    bridge.ajax('get', CQlogAddress, 'application/json', '', '', function (res) {
    }, function (err) {
    })
  } else {
    ajax({ // 入口数据
      type: "get",
      url: CQlogAddress,
      contentType: 'application/json',
      data: jsonOb,
      dataType: "json",
      success: function (data) {
        // console.log('bi 日志发生完毕'); 
      },
      error: function (err) {
      }
    });
  }
}