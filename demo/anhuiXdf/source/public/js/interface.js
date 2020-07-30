//  接口服务
var baseUrl = "http://112.30.212.138:7080/epg/?s=45|20&"; //主页入口
var historylUrl = "http://112.30.212.138:7081/uds/cloud/collection"; //收藏  历史纪录接口
var conditionUrl = baseUrl + 'p=yhCategoryMulti&k=16&v=1&rootNode=AHXDF&catCode='//左侧筛选类型
var ahxdfLogUrl = 'http://112.30.212.138:7079'//局方行为日志
var MBSUrl = 'http://112.30.212.138:7081/bms'//BMS代理
var poweruUrl = "http://112.30.212.138:7081/userAuth";//正式订购鉴权代理
var ahHisUrl = 'http://112.30.212.138:7081';//局方收藏历史
var uploadUrl = 'http://112.17.251.186';//自升级地址
var playAddress = 'http://120.210.193.151:8006';//安徽播放传拼接地址

// var poweruUrl = "http://120.210.203.26:5081/UserAndProdCheck";//正式订购鉴权
//测试
// var baseUrl = "http://112.17.251.186:10088/?s=41|15&"; //主页入口
// var historylUrl = "http://112.17.251.186:10089/uds/cloud/collection"; //收藏  历史纪录接口
// var conditionUrl = baseUrl + 'p=yhCategoryMulti&k=1&v=1&rootNode=FJXDF&catCode='//左侧筛选类型

// http://112.30.212.138:7081/ystAddFavorites  易视腾代理
// http://112.30.212.138:7081/ystAddBookmarks
// http://112.30.212.138:7081/bstAddFavorites  百视通代理
// http://112.30.212.138:7081/bstAddBookmarks

/**
 * 获取栏目数据
 * @param {*} successfn 
 * @param {*} errorfn 
 */
function getYhNavigationBar(successfn, errorfn) {
  //测试
  // var url = baseUrl + "p=yhNavigationBar&k=1&v=1&catId=205607&c=15"
  var url = baseUrl + "p=yhNavigationBar&k=1&v=1&catId=205967&c=20"
  ajax({ url: url, success: successfn, fail: errorfn })
}

function unifiedOrder() {
  if (playConfig.isforbid == '1') return
  // playerBox.hidePlayer();
  var param = {
    'TransactionID': yh.appId + '' + (new Date()).valueOf(),
    'CPID': yh.cpId,
    'AppID': yh.appId,
    "PackageName": yh.apkName,
    'ItemName': encodeURIComponent('新东方包月'),
    'ItemCode': yh.productId,
    'ChargingPointId': yh.productId,
    // 'ChargingPointId': 'svip001',//测试productId
    'PayCategory': '2',
    'Price': '2900',
    'RepeatOrder': '1',
    'ReturnURL': window.location.href.split('?')[0],
    'OrderDesc': {
      "Describe": encodeURIComponent('新东方包月 - ' + value.detailData.assetName)
    },
    'RentTime': '30',
    'OrderContinue': '1',
    'NotifyURL': window.location.href.split('?')[0],
    'NotifyURL_CP': window.location.href.split('?')[0],
  }

  param = JSON.stringify(param);
  console.log(param)
  submitPrompt('pay', { jsonParam: param, return: 'playCallBack' });

  // var ss = {
  //   "TransactionID": "2019070316491920191211115130166822",
  //   "CPID": "20190703164919",
  //   "AppID": "0000000120190703175600",
  //   "ItemName": encodeURIComponent('新东方包月'),
  //   "ItemCode": "BP8197",
  //   "ChargingPointId": "BP8197",
  //   "PayCategory": "2",
  //   "Price": "1800",
  //   "RepeatOrder": "1",
  //   "BackUrl": "http://112.30.211.99:8301/pic_book/month_order/tel_pay_popup.do",
  //   "OrderDesc": { "Describe": encodeURIComponent('新东方包月') },
  //   "RentTime": "30",
  //   "OrderContinue": "1"
  // }


  // http://120.210.203.25:5080/iptvappsvr/ServiceOrderForTvstore?ItemCode=BP8197&UserCode=sjb_ott11YST0604&ChargingPointId=BP8197&CPName=20190703164919&PayCategory=2&UserToken=5MgPV_bpSixmAO1fMb%40of4e134209202&TransactionID=2019070316491920191211115130166822&Action=1&RentTime=30&ItemName=%25E5%258C%2585%25E6%259C%2588%25E6%2599%25BA%25E6%2585%25A7%25E6%2598%259F%25E7%2590%2583&AppName=0000000120190703175600&Version=2.0&ReserveAPP3=143546&ReserveAPP2=18999&ReserveAPP1=123354&CPID=20190703164919&NotifyURL_CP=http%3A%2F%2F112.30.211.99%3A8301%2Fapi%2FPicBookRemote%2Fcolletion_status&IP=&AppID=0000000120190703175600&OrderContinue=1&TimeStamp=20191211115130&Reserve1=123354&Reserve2=18999&Reserve3=143546&PackageName=com.winside.edu.drawplanet&OrderDesc=%257B%2527Describe%2527%253A%2527%25E6%2599%25BA%25E6%2585%25A7%25E6%2598%259F%25E7%2590%2583%25E5%258C%2585%25E6%259C%2588%25E6%259C%258D%25E5%258A%25A1%2527%257D&Price=1800&NotifyURL=http%3A%2F%2F112.30.211.99%3A8301%2Fapi%2FPicBookRemote%2Fcolletion_status&MAC=58%3AB4%3A2D%3A72%3A4B%3A93&RepeatOrder=1&StbID=0043030000010060180758B42D724B93&ReturnURL=http%3A%2F%2F112.30.211.99%3A8301%2Fpic_book%2Fmonth_order%2Ftel_pay_popup.do&CPUserID=sjb_ott11YST0604&AuthInfo=nahuuEzxOpugyDazcW2sIO3L5p%2FQv0a9OPvBi3cQOqatBPKdYRsKAh59uAgLz41Pd2t9UINBeqDdUOAhDuSodojqUTmd077GKt1PHUMgztQVZB%2BY17jP%2F6erlcbdyYCl%2BrWLWjTnqt0vtZLZH%2FFpxQ%3D%3D


}
function playCallBack(res) {//订购sdk回调，当前使用详情页鉴权，所以没有用到回调
  console.log(JSON.stringify(res));

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
  ajax({ url: poweruUrl, type: "POST", data: data, timeout: 5000, contentType: "text/xml", success: successfn, fail: errorfn })
}
