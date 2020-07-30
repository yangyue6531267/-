/****
 *
 * update: 2019.07.23
 * write: xizeng
 */

// var logAddress = 'http://47.96.135.84/logCollect';//测试地址

var logAddress = 'http://112.17.251.186:10089/yanhua';//正式地址
function bi() {

}

/****
 * 公共字段
 * 
 * model 终端信息--机顶盒型号(华为XXX，xiaomi)
 * soft_v 产品版本--产品版本号(产品发版/升级的版本号)
 * v 产品版本--埋点的版本(从1开始)
 * log_type 产品版本(日志类型--1.CS; 2.BS)
 * site_id 产品版本--站点（项目的唯一标识）
 * user_id 用户身份相关--用户唯一ID（运营商鉴权返回的用户ID）
 * device_id 用户身份相关--设备号deviceid，唯一-（设备号，一般为mac地址，代表用户唯一标识）
 * province 用户身份相关--省份（开机请求接口获得，中文省份，utf-8 encode）
 * vip 用户身份相关--用户鉴权状态（用户是否为产品包有效用户，即鉴权状态）
 * create_time 其它--行为上报时间(13位时间戳（毫秒）)
 * bigdata_flag 其它--产品是否有首页推荐(1产品有首页推荐，0该产品无首页推荐)
 */
function commonParams() {
  this.model = yh.mode || ' ' // 终端信息，机顶盖型号
  // this.soft_v = yh.soft_v // 产品版本号
  this.soft_v = '2.0.001' // 产品版本号
  this.v = '1' // 埋点的版本
  this.log_type = '2' // 日志类型
  this.site_id = yh.siteId // 站点
  this.user_id = yh.userId // 用户唯一ID
  this.device_id = yh.device_id // 设备号deviceid，唯一
  this.province = encodeURIComponent('陕西') // 省份
  this.vip = '0'
  this.create_time = (new Date()).valueOf().toString() // 行为上报时间
  this.bigdata_flag = '0' // 产品是否有首页推荐
}
var commonParams = new commonParams()
var commonParamsStr = getLogString(commonParams)

/**** 
 * 启动应用
 * 
 * event 事件代号(固定值102)
 * start_type 启动方式
    0101 点击apk启动；
    0201 合作方桌面资产推荐位启动apk
    0202 合作方桌面栏目推荐启动apk
    0203 合作方统一搜索入口启动apk
    0204 合作方统一历史入口启动apk
*/
bi.start = function (type) {
  console.log('bi 启动应用日志')
  var startTime = new Date().getTime()
  Cookies.set("startTime", startTime, { path: '/' });
  var logOb = commonParams;
  logOb.event = '102';
  logOb.start_type = type || '0101';
  var startTemp = commonParamsStr + '"event":' + '"' + logOb.event + '"' + ',"start_type":' + '"' + logOb.start_type + '"' + '}';
  logup(startTemp);
}

/**** 
 * 退出APK
 * 
 * event 事件代号(固定值1030
 * time apk使用时长(从应用启动到关闭的时间毫秒数)
*/
bi.end = function (type) {
  console.log('bi 退出APK日志')
  var logOb = commonParams;
  logOb.event = '103';
  var out_time = new Date().getTime()
  logOb.time = out_time - Cookies.get("startTime")
  var startTemp = commonParamsStr + '"event":' + '"' + logOb.event + '"' + ',"time":' + '"' + logOb.time + '"' + '}';
  logup(startTemp);
}

/**** 
 * 页面访问
 * 
 * event 事件代号(固定值104)
 * page_type 当前页面类型
 * page_id 当前页面id
    当前页面对象的id：与page_type对应的页面id，如栏目id，标签id，收藏页id。
    特别地，对于一些特别的页面，其id定义如下：
    100-1、 搜索页；
    101-1、 历史页；
    102-1、 筛选页；
    103-1、 收藏页
 * parent_page_type 父页类面类型(没有父级页面，则为NULL)
 * parent_page_id 父页id(没有父级页，则为NULL)
*/
bi.jump = function (jsonOb) {
  console.log('bi 页面访问日志')
  var logOb = commonParams;
  logOb.event = '104'; // 事件代号
  logOb.page_type = jsonOb.page_type; // 当前页面类型
  logOb.page_id = jsonOb.page_id; // 当前页面id
  logOb.parent_page_type = jsonOb.parent_page_type; // 父页类面类型
  logOb.parent_page_id = jsonOb.parent_page_id; // 父页id
  var startTemp = commonParamsStr + '"event":' + '"' + logOb.event + '"' 
    + ',"page_type":' + '"' + logOb.page_type + '"' 
    + ',"page_id":' + '"' + logOb.page_id + '"'
    + ',"parent_page_type": ' + '"' + logOb.parent_page_type + '"' 
    + ',"parent_page_id":' + '"' + logOb.parent_page_id + '"' + '}';
  logup(startTemp);
}

/**** 
 * 点击推荐位
 * 
 * pos_id 推荐位置(若是从栏目首页推荐位进入，则回传，否则为空;代表当前页是从上一父页（栏目首页）什么推荐位过来的)
 * recmd_id 是否是智能推荐
    智能推荐系统：
    0首页大数据推荐,
    1热门搜索点播排行榜推荐,
    2热门筛选点播排行榜推荐,
    3资产详情页关联推荐（关联的资产、专题、演员）
 * page_type 当前页面类型
 * page_id 当前页面id
    当前页面对象的id：与page_type对应的页面id，如栏目id，标签id，收藏页id。
    特别地，对于一些特别的页面，其id定义如下：
    100-1、 搜索页；
    101-1、 历史页；
    102-1、 筛选页；
    103-1、 收藏页
 * click_type 被点击的对象类型
    推荐位点击的内容类型：
    1、点击资产；
    2、点击专题；
    3、点击演员；
    4、点击标签；
 * cid 点击的对象id(click_type的对应id，可能为栏目id、资产id、标签id、专题id、演员id等)
*/
bi.jumpRecommend = function (jsonOb) {
  console.log('点击推荐位上报')
  var logOb = commonParams;
  logOb.event = '3'; // 事件代号
  logOb.pos_id = jsonOb.pos_id; // 推荐位置
  logOb.recmd_id = jsonOb.recmd_id; // 是否是智能推荐
  logOb.page_type = jsonOb.page_type; // 当前页面类型
  logOb.page_id = jsonOb.page_id; // 当前页面id
  logOb.click_type = jsonOb.click_type; // 被点击的对象类型
  logOb.cid = jsonOb.cid; // 点击的对象id
  var startTemp = commonParamsStr + '"event": "' + logOb.event + '","pos_id": "' + logOb.pos_id + 
    '"' + ',"recmd_id":' + '"' + logOb.recmd_id + '"' + ',"page_type":' + '"' + logOb.page_type +
    '"' + ',"page_id":' + '"' + logOb.page_id + '"' + ',"click_type":' + '"' + logOb.click_type +
    '"' + ',"cid":' + '"' + logOb.cid + '"' + '}';
  logup(startTemp);
  // console.log(startTemp)
}

/****
 * 收藏/取消收藏
 *
 * event 事件代号(固定值 4)
 * click_type 收藏对象的类型 
    1、点击资产；
    2、点击专题；
    3、点击演员（暂无）；
    4、点击标签（暂无）；
    若有其他收藏内容，则增加代号，但是已有代号不可随意更改
 * cid 收藏对象id(被收藏对象的id，可能为专题id、资产id)
 * collect 收藏动作(1收藏；2取消收藏)
 */
bi.collection = function (jsonOb) {
  console.log('bi 收藏日志');
  var logOb = commonParams;
  logOb.event = '4'; // 事件代号
  logOb.click_type = jsonOb.click_type; // 收藏对象的类型
  logOb.cid = jsonOb.cid; // 收藏对象id
  logOb.collect = jsonOb.collect; // 收藏动作
  var startTemp = commonParamsStr + '"event":' + '"' + logOb.event + '"' 
    + ',"click_type":' + '"' + logOb.click_type + '"' 
    + ',"cid":' + '"' + logOb.cid + '"'
    + ',"collect": ' + '"' + logOb.collect + '"' + '}';
  logup(startTemp);
}

/****
 * 筛选
 *
 * event 事件代号(固定值14)
 * result 筛选结果
    当前动作完成的结果类型枚举：
    0、筛选后无结果
    1、筛选有结果，点击筛选结果
 * keyword 筛选条件(当前动作完成时的上报的内容，以“|”隔开，中文 Encode utf-8编码)
 * cid 被点击的资产id(筛选无结果，cid可为空)
 * cat_id 导航栏id(导航栏id，见epg接口cat_id，用于区分筛选入口)
 */
bi.filter = function (jsonOb) {
  console.log('bi 筛选日志');
  var logOb = commonParams;
  logOb.event = '14'; // 事件代号
  logOb.result = jsonOb.result; // 筛选结果
  logOb.keyword = jsonOb.keyword; // 筛选条件
  logOb.cid = jsonOb.cid; // 被点击的资产id
  logOb.cat_id = jsonOb.cat_id; // 导航栏id
  var startTemp = commonParamsStr + '"event":' + '"' + logOb.event + '"' 
  + ',"result":' + '"' + logOb.result + '"' 
  + ',"keyword":' + '"' + logOb.keyword + '"' 
  + ',"cid":' + '"' + logOb.cid + '"' 
  + ',"cat_id":' + '"' + logOb.cat_id + '"' + '}';
  logup(startTemp);
}

/****
 * 搜索
 *
 * event 事件代号(固定值6)
 * result 搜索结果
    当前动作完成的结果类型枚举：
    0:搜索无结果
    1:搜索有结果，点击搜索结果
    2:不搜索，点击默认推荐内容
 * keyword 搜索关键词(当前动作完成时的上报的内容字符串，以“|”隔开)
 * click_type 被点击的对象类型
    1、点击资产；
    2、点击专题（暂无）；
    3、点击演员；
    4、点击标签（暂无）；
    若有其他搜索内容，则增加代号，但是已有代号不可随意更改
 * cid 被点击的资产id(对应result_type, 资产id，明星id；筛选无结果，cid可为空)
 */
bi.search = function (jsonOb) {
  console.log('bi 搜索日志');
  var logOb = commonParams;
  logOb.event = '6'; // 事件代号
  logOb.result = jsonOb.result; // 搜索结果
  logOb.keyword = jsonOb.keyword; // 搜索关键词
  logOb.click_type = jsonOb.click_type; // 被点击的对象类型
  logOb.cid = jsonOb.cid; // 被点击的资产id
  var startTemp = commonParamsStr + '"event":' + '"' + logOb.event + '"' 
  + ',"result":' + '"' + logOb.result + '"' 
  + ',"keyword":' + '"' + logOb.keyword + '"' 
  + ',"click_type":' + '"' + logOb.click_type + '"' 
  + ',"cid":' + '"' + logOb.cid + '"' + '}';
  logup(startTemp);
}

/****
 * 收藏页/历史页
 * 
 * event 事件代号(固定值5)
 * page_type 页面类型(0501收藏页；0601历史页)
 * cid 被点击的对象id(可能为专题id、资产id等，见epg接口)
 * click_type 当前动作类型
    1、选中并进入（播放）物品；
    2、选中并删除某个收藏物品/历史物品；
    3、清空收藏/历史
 */
bi.historical = function (jsonOb) {
  console.log('bi 收藏历史页日志');
  var logOb = commonParams;
  logOb.event = '5'; // 事件代号
  logOb.page_type = jsonOb.page_type; // 页面类型
  logOb.cid = jsonOb.cid; // 被点击的对象id
  logOb.click_type = jsonOb.click_type; // 当前动作类型
  var startTemp = commonParamsStr + '"event":' + '"' + logOb.event + '"' 
    + ',"page_type": ' + '"' + logOb.page_type + '"' 
    + ',"cid":' + '"' + logOb.cid + '"'
    + ',"click_type":' + '"' + logOb.click_type + '"' + '}';
  logup(startTemp);
}

/****
 * 订购
 * event 事件代号
 * pkg_type 产品类型
 * pkg_id 产品id
 * operator_id 影视内容包提供商ID
 * order_msg 订购信息
 * parent_page_id 父页id
 * parent_page_type 父页类型
 * point 订购时机
 */
bi.order = function (jsonOb) {
  console.log('bi 订购日志');
  var logOb = commonParams;
  logOb.event = '201'; //事件代号
  logOb.pkg_type = jsonOb.pkg_type; //产品类型
  logOb.pkg_id = jsonOb.pkg_id; //产品id
  logOb.operator_id = jsonOb.operator_id; //影视内容包提供商ID
  logOb.order_msg = encodeURI(jsonOb.order_msg); //订购信息
  logOb.parent_page_id = jsonOb.parent_page_id; //父页id
  logOb.parent_page_type = jsonOb.parent_page_type; //父页类型
  logOb.point = jsonOb.point; //订购时机
  var startTemp = commonParamsStr + '"event": ' + '"' + logOb.event + '"' 
    + ',"pkg_type":' + '"' + logOb.pkg_type + '"' 
    + ',"pkg_id": ' + '"' + logOb.pkg_id + '"' 
    + ',"operator_id":' + '"' + logOb.operator_id + '"' +
    + ',"order_msg": ' + '"' + logOb.order_msg + '"' 
    + ',"parent_page_id": ' + '"' + logOb.parent_page_id + '"'
    + ',"parent_page_type": ' + '"' + logOb.parent_page_type + '"' 
    + ',"point": ' + '"' + logOb.point + '"' + '}';
  logup(startTemp);
}

/****
 * 点击订购按钮
 *
 * page_id 页面id
 * page_type 页面类型
 */
bi.orderClick = function (jsonOb) {
  console.log('bi 点击订购按钮日志');
  var logOb = commonParams;
  logOb.event = '202';
  logOb.page_id = jsonOb.page_id;
  logOb.page_type = jsonOb.page_type;
  var startTemp = commonParamsStr + '"event": ' + '"' + logOb.event + '"'
    + ',"page_id":' + '"' + logOb.page_id + '"' + ',"page_type": ' + '"' + logOb.page_type + '"' + '}';
  logup(startTemp);
}

/***
 * 点播
 * event 事件代号
 * asset_id 资产id
 * item_id  资产子集id
 * qb_datetime 起播日历时间点
 * zb_datetime 终播日历时间点
 * time 播放时长
 * ep 总集数
 * fee 是否为收费内容
 * isFullScreen 是否为全屏播放
 * pos_id 栏目首页推荐位置
 * recmd_id 是否是智能推荐
 * parent_page_type 父页类型
 * parent_page_id 父页id
 */
bi.vod = function (jsonOb) {
  console.log('bi 点播日志');
  var logOb = commonParams;
  logOb.event = '8'; //事件代号
  logOb.asset_id = jsonOb.asset_id; //资产id
  logOb.item_id = jsonOb.item_id; //资产子集id
  logOb.qb_datetime = jsonOb.qb_datetime; //起播日历时间点
  logOb.zb_datetime = jsonOb.zb_datetime; //终播日历时间点
  logOb.time = jsonOb.time; //播放时长------BS架构中，若受局方播放器的限制，无法计时，则采用time=zb_datetime-qb_datetime
  logOb.ep = jsonOb.ep; //总集数
  logOb.fee = jsonOb.fee; //是否为收费内容
  logOb.isFullScreen = logOb.isFullScreen; //是否为全屏播放
  logOb.pos_id = jsonOb.pos_id; //栏目首页推荐位置
  logOb.recmd_id = jsonOb.recmd_id; //是否是智能推荐
  logOb.parent_page_type = jsonOb.parent_page_type || ''; //父页类型
  logOb.parent_page_id = jsonOb.parent_page_id || ''; //父页id
  
  var startTemp = commonParamsStr + '"event":' + '"' + logOb.event + '"'
    + ',"asset_id":' + '"' + logOb.asset_id + '"' 
    + ',"item_id":' + '"' + logOb.item_id + '"'
    + ',"qb_datetime": ' + '"' + logOb.qb_datetime + '"' 
    + ',"zb_datetime": ' + '"' + logOb.zb_datetime + '"' 
    + ',"time": ' + '"' + logOb.time + '"'
    + ',"ep": ' + '"' + logOb.ep + '"'
    + ',"fee": ' + '"' + logOb.fee + '"'
    + ',"isFullScreen": ' + '"' + logOb.isFullScreen + '"'
    + ',"pos_id": ' + '"' + logOb.pos_id + '"'
    + ',"recmd_id": ' + '"' + logOb.recmd_id + '"'
    + ',"parent_page_type": ' + '"' + logOb.parent_page_type + '"'
    + ',"parent_page_id": ' + '"' + logOb.parent_page_id + '"' + '}';
  logup(startTemp);
}

// 解决盒子不支持JSON.stringify()
function getLogString() {
  var value = '{"model":' + '"' + commonParams.model + '"' + ',"soft_v":' + '"' + commonParams.soft_v + '"' + ',"v":' + '"' + commonParams.v + '"'
    + ',"log_type":' + '"' + commonParams.log_type + '"' + ',"site_id":' + '"' + commonParams.site_id + '"'
    + ',"user_id":' + '"' + commonParams.user_id + '"' + ',"device_id":' + '"' + commonParams.device_id + '"'
    + ',"province":' + '"' + commonParams.province + '"' + ',"vip":' + '"' + commonParams.vip + '"'
    + ',"create_time":' + '"' + commonParams.create_time + '"' + ',"bigdata_flag":' + '"' + commonParams.bigdata_flag + '"' + ', ';
  return value;
}
// 上传
function logup(jsonOb) {
  console.log('BI log:' + jsonOb)
  jsonOb = eval('(' + jsonOb + ')')
  jsonOb = JSON.stringify(jsonOb, function (k, v) {
    return typeof v === "number" ? v + "" : v
  })
  console.log(jsonOb, typeof jsonOb)
  ajax({ // 入口数据
    type: "POST",
    url: logAddress,
    contentType: 'application/json',
    data: jsonOb,
    dataType: "json",
    success: function (data) {
      console.log('bi 日志发生完毕');
    },
    error: function (err) {
      console.log(err)
    }
  });
}