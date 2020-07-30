//  接口服务
var baseUrl = "http://192.168.21.27/epg/?s=31|12&";//重庆服务器
// 历史收藏接口
var historylUrl = "http://192.168.21.27/uds/cloud/collection";//重庆服务器
// 筛选条件接口
var conditionUrl = 'http://192.168.21.27/?s=31|12&p=yhCategoryMulti&k=3&v=2&rootNode=CQXDF&catCode=';

var MBSUrl = 'http://bms-i.yanhuamedia.tv/bms/u/user/auth'

// // 杭州测试
// var baseUrl = "http://47.97.96.103/?s=116|14&";
// // 福建现网
// // var baseUrl = 'http://jsyd-ds.yanhuamedia.tv/?s=31|12&'
// // 历史收藏接口
// var historylUrl = "http://47.97.96.103/uds/cloud/collection";
// // 筛选条件接口
// var conditionUrl = 'http://jsyd-ds.yanhuamedia.tv/?s=116|14&p=yhCategoryMulti&k=3&v=2&rootNode=CQXDF&catCode=';



/**
 * 获取栏目数据
 * @param {*} successfn 
 * @param {*} errorfn 
 */
function getYhNavigationBar(successfn, errorfn) {
  var url = baseUrl + 'p=yhNavigationBar&k=1&v=1&catId=204974&c=12';
  // 测试
  // var url = 'http://47.97.96.103/?s=116|14&p=yhNavigationBar&k=1&v=1&catId=205745&c=14'
  ajax({ url: url, success: successfn, fail: errorfn })
}
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

//查询收藏/播放记录
/**
* @param {*} url
* @param {*} successfn 
* @param {*} errorfn
*/
function tySc(url, successfn, errorfn) {
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