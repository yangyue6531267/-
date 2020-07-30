//  接口服务
var baseUrl = "http://112.35.185.113:18081/?s=39|25&"; //主页入口
var historylUrl = "http://112.17.251.186:10089/uds/cloud/collection"; //收藏  历史纪录接口
var conditionUrl = 'http://112.35.185.113:18081/?s=39|25&p=yhCategoryMulti&k=1&v=1&rootNode=HNXDF&catCode='//左侧筛选类型
// 测试
var poweruUrl = "http://112.50.245.140:9090/cmcc/interface";//订购鉴权测试
var orderBaseUrl = "http://110.83.50.169:7006/mbhfront/unifiedorderNew/unifiedorder.do";//订购支付地址测试
/**
 * 获取栏目数据
 * @param {*} successfn 
 * @param {*} errorfn 
 */
function getYhNavigationBar(successfn, errorfn) {
  var url = baseUrl+"p=yhNavigationBar&k=1&v=1&catId=205623&c=25&returnType=jsonp"
  jsonp({ url: url,callback:'jsonpCallback',time:15000, success: successfn, fail: errorfn })
}

/**
 * 获取推荐数据
 * @param {*} url 
 * @param {*} successfn 
 * @param {*} errorfn 
 */
function getYhSpecialList_nc(url, successfn, errorfn) {
  jsonp({ url: url+'&returnType=jsonp',callback:'jsonpCallback',time:15000, success: successfn, fail: errorfn })
}

/**
 * 历史
 * @param {*} url 
 * @param {*} successfn 
 * @param {*} errorfn 
 */
function getHistoryl(url, successfn, errorfn) {
  ajax({url:url,success:successfn,fail:errorfn})
}
/**
 * 详情页数据
 * @param {*} url 
 * @param {*} successfn 
 * @param {*} errorfn 
 */
function getDetail(url, successfn, errorfn) {
  jsonp({ url: url+'&returnType=jsonp',callback:'jsonpCallback',time:15000, success: successfn, fail: errorfn })
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
  jsonp({ url: url+'&returnType=jsonp',callback:'jsonpCallback',time:15000, success: successfn, fail: errorfn })
}

//搜索页推荐
/**
* @param {*} url
* @param {*} successfn 
* @param {*} errorfn
*/
function getRecommend(url, successfn, errorfn) {
  jsonp({ url: url+'&returnType=jsonp',callback:'jsonpCallback',time:15000, success: successfn, fail: errorfn })
}


//筛选条件获取
/**
* @param {*} url
* @param {*} successfn 
* @param {*} errorfn
*/
function getConditionFilter(catCode, successfn, errorfn) {
  var url = conditionUrl + catCode
  jsonp({ url: url+'&returnType=jsonp',callback:'jsonpCallback',time:15000, success: successfn, fail: errorfn })
}

//筛选条件获取
/**
* @param {*} url
* @param {*} successfn 
* @param {*} errorfn
*/
function getFilterResult(url, successfn, errorfn) {
  url = baseUrl + url
  jsonp({ url: url+'&returnType=jsonp',callback:'jsonpCallback',time:15000, success: successfn, fail: errorfn })
}

//监测升级

function getUpdateChec(operator, firm, modelCode,appDeviceId,successfn) {
  var url = 'http://112.17.251.186:8081/auth/aua?s=6&v=1&operator='+operator+'&firm='+firm+'&modelCode='+modelCode+'&appDeviceId='+appDeviceId+'&appPackage=yanhua.tv.hnyd_xdf&appVer=0';
  getHttp(url,successfn);
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
