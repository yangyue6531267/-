//  接口服务
var baseUrl = "http://112.17.251.186:10088/?s=41|15&"; //主页入口
var historylUrl = "http://112.17.251.186:10089/uds/cloud/collection"; //收藏  历史纪录接口
var conditionUrl = 'http://112.17.251.186:10088/?s=41|15&p=yhCategoryMulti&k=1&v=1&rootNode=HAINXDF&catCode='//左侧筛选类型

var poweruUrl = "http://112.17.251.186:10089/hainanorder";//正式订购鉴权代理
var orderBaseUrl = "http://112.17.251.186:10089/hainan/pay/index.html";//订购支付地址正式
var MBSUrl = 'http://bms-i.yanhuamedia.tv/bms/u/user/auth'//黑白名单
var authUrl = 'http://ucas.a158.ottcn.com'//未来播放鉴权
// var authUrl = 'http://hnydxdf.a158.ottcn.com:10089/hainanAudit?'//未来播放鉴权代理


// var poweruUrl = "http://winnow-bs.yanhuamedia.tv/cq-login";//测试订购鉴权代理
// var orderBaseUrl = "http://winnow-bs.yanhuamedia.tv/hainan/pay/index.html";//订购支付地址测试


/**
 * 获取栏目数据
 * @param {*} successfn 
 * @param {*} errorfn 
 */
function getYhNavigationBar(successfn, errorfn) {
  // var url = "http://jsyd-ds.yanhuamedia.tv/?s=32|13&p=yhNavigationBar&k=1&v=1&catId=205125&c=13"
  var url = baseUrl + "p=yhNavigationBar&k=1&v=1&catId=205607&c=15"
  ajax({ url: url, success: successfn, fail: errorfn })
}

function unifiedOrder(contentId) {
  // 设置点击订购状态
  var clickOrder = '1'
  Cookies.set('clickOrder', clickOrder, { path: '/' })
  playerBox.hidePlayer();
  var userId = yh.userId;
  var backUrl = window.location.href.split('?')[0];
  window.location.href = '../pay/index.html' + '?' +'userId=' + userId +  '&contentId=' + contentId + '&returnUrl=' + backUrl;
}
/**
 * 获取推荐数据
 * @param {*} url 
 * @param {*} successfn 
 * @param {*} errorfn 
 */
//首页接口数据缓存，sessionStorage储存
function getYhSpecialList_nc(url, successfn, errorfn) {
  try {
    if (getSession(url)) {
      this.url = url;
      successfn(getSession(url))
    } else {
      ajax({ url: url, success: successfn, fail: errorfn })
    }
  } catch (e) {
    ajax({ url: url, success: successfn, fail: errorfn })
  }
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
function power(data, successfn, errorfn) {
  ajax({ url: poweruUrl, type: "POST", data: data, contentType: "text/xml", success: successfn, fail: errorfn })
}
