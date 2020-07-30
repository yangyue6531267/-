//  接口服务
var baseUrl = "http://47.97.96.103/?s=116|14&"; //主页入口
var historylUrl = "http://112.17.251.186:10089/uds/cloud/collection"; //收藏  历史纪录接口
var conditionUrl = 'http://jsyd-ds.yanhuamedia.tv/?s=51|21&p=yhCategoryMulti&k=1&v=1&rootNode=FJXDF&catCode='//左侧筛选类型
// var poweruUrl = "http://112.50.245.66/scspProxy";//订购鉴权正式
// var orderBaseUrl = "https://wap.fj.10086.cn/mbhfront/unifiedorderNew/unifiedorder.do";//订购支付地址正式
// 测试
// var poweruUrl = "http://112.50.245.140:9090/cmcc/interface";//订购鉴权测试
// var orderBaseUrl = "http://110.83.50.169:7006/mbhfront/unifiedorderNew/unifiedorder.do";//订购支付地址测试
// var historylUrl = "http://112.13.67.106/uds/cloud/collection"; //收藏  历史纪录接口
// }
/**
 * 获取栏目数据
 * @param {*} successfn 
 * @param {*} errorfn 
 */
function getYhNavigationBar(successfn, errorfn) {
  var url = baseUrl + "p=yhNavigationBar&k=1&v=1&catId=205745&c=14"
  ajax({ url: url, success: successfn, fail: errorfn })
}

// function unifiedOrder(contentId) {
//   var userId = "1505917347702";//测试写死
//   var terminalId = AT.getSTBID();
//   var copyRightId = "699230";
//   var systemId= "0";
//   var contentId = contentId;
//   var consumeLocal = "14";
//   var consumeScene = "01";
//   var consumeBehaviour ="02";
//   var token = AT.getEpgToken();
//   // var backUrl = window.location.href;
//   var backUrl = "http://112.17.251.186:10089/fujian/source/detail/detail.html";
//   var orderUrl = orderBaseUrl+"?subContentId=&copyRightContentId=&path=&preview=&channelId=&productId=&userId=" + userId + "&terminalId=" + terminalId +
//   "&copyRightId=" + copyRightId + "&systemId=" + systemId + "&contentId=" + contentId + "&consumeLocal=" + consumeLocal +
//   "&consumeScene=" + consumeScene + "&consumeBehaviour=" + consumeBehaviour + "&token=" + token + "&backUrl=" + backUrl;
//   Cookies.set('orderUrl', orderUrl, {
//     path: '/'
//   })
//   window.location.href=orderUrl;
// }


/**
 * 获取推荐数据
 * @param {*} url 
 * @param {*} successfn 
 * @param {*} errorfn 
 */
function getYhSpecialList_nc(url, successfn, errorfn) {
  ajax({ url: url, success: successfn, fail: errorfn })
}

// 收藏接口
/**
* @param {*} url
* @param {*} type
* @param {*} data
* @param {*} successfn 
* @param {*} errorfn
*/
function getYhSpecialSC(url, data, successfn, errorfn) {
  ajax({ url: url, type: "POST", data: data, contentType: "application/json", success: successfn, fail: errorfn })
}

//查询收藏/播放记录
/**
* @param {*} url
* @param {*} successfn 
* @param {*} errorfn
*/
function getCollectionList(url, successfn, errorfn) {
  ajax({ url: url, success: successfn, fail: errorfn })
}

//搜索查询
/**
* @param {*} url
* @param {*} successfn 
* @param {*} errorfn
*/
function getSearchList(url, successfn, errorfn) {
  ajax({ url: url, success: successfn, fail: errorfn })
}

//搜索页推荐
/**
* @param {*} url
* @param {*} successfn 
* @param {*} errorfn
*/
function getRecommend(url, successfn, errorfn) {
  ajax({ url: url, success: successfn, fail: errorfn })
}


//筛选条件获取
/**
* @param {*} url
* @param {*} successfn 
* @param {*} errorfn
*/
function getConditionFilter(catCode, successfn, errorfn) {
  var url = conditionUrl + catCode
  ajax({ url: url, success: successfn, fail: errorfn })
}

//筛选条件获取
/**
* @param {*} url
* @param {*} successfn 
* @param {*} errorfn
*/
function getFilterResult(url, successfn, errorfn) {
  url = baseUrl + url
  ajax({ url: url, success: successfn, fail: errorfn })
}

//xml鉴权
/**
* @param {*} url
* @param {*} successfn 
* @param {*} errorfn
*/
function power( data, successfn, errorfn) {




  ajax({ url: poweruUrl, type: "POST", data: data, contentType: "text/xml", success: successfn, fail: errorfn })
}
