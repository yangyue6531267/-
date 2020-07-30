//  接口服务
var baseUrl = "http://gsyd-ds.yanhuamedia.tv/?s=54|28&"; //主页入口
var historylUrl = "http://gsyd-ds.yanhuamedia.tv/uds/cloud/collection"; //收藏  历史纪录接口
var conditionUrl = 'http://gsyd-ds.yanhuamedia.tv/?s=54|28&p=yhCategoryMulti&k=1&v=1&rootNode=GSIPTV&catCode='//左侧筛选类型

var GUplayUrl = 'http://iptvdirect.gs.chinamobile.com/270000000322/'//播放串拼接地址
var GUlayIndex = 'http://gsyd-ds.yanhuamedia.tv/iptv_xdf/source/video/play.html?'//自己的播放页面
/**
 * 获取栏目数据
 * @param {*} successfn
 * @param {*} errorfn 
 */
function getYhNavigationBar(successfn, errorfn) {
  var url = 'http://gsyd-ds.yanhuamedia.tv/?s=54|28&p=yhNavigationBar&k=1&v=1&catId=207867&c=28&returnType=jsonp';
  ajax({ url: url,success: successfn, fail: errorfn})
}

/**
 * 获取推荐数据
 * @param {*} url 
 * @param {*} successfn 
 * @param {*} errorfn 
 */
function getYhSpecialList_nc(url, successfn, errorfn,sc) {
  // console.log(sc);
  if (sc) {
    ajax({ url: url, success: successfn, fail: errorfn })
  } else {
    $.ajax({
      type: 'GET',
      url: url+'&returnType=jsonp',
      dataType: "jsonp",
      jsonpCallback:'jsonpCallback',
      success: successfn,
      fail: errorfn
    })
  }
  
  // ajax({ url: url, success: successfn, fail: errorfn })
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