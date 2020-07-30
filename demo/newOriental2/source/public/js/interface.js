console.log(1)
var baseUrl = 'http://jsyd-ds.yanhuamedia.tv/?s=31|12&'

var homeCategory = 'http://47.97.96.103/?s=120|15&p=yhNavigationBar&k=1&v=1&catId=205880&c=15'

// 筛选条件接口
var filterConditionUrl = '&p=yhCategoryMulti&k=3&v=2&rootNode=CQXDF&catCode='

/**
 * 获取栏目数据
 * @param {*} successfn 
 * @param {*} errorfn 
 */
function getYhNavigationBar(successfn, errorfn) {
  var url = homeCategory;
  ajax({ url: url, success: successfn, fail: errorfn })
}


  // 推荐搜素

function getsearchRecommend(successfn, errorfn) {
  ajax({ url:'http://47.96.85.147/epgds/?s=1000|1&p=yhSearchRecommend&k=1&v=1', success: successfn, fail: errorfn })
}

function getsearchResult(url,successfn, errorfn){
  ajax({ url:url, success: successfn, fail: errorfn })
}


//筛选条件获取
/**
* @param {*} url
* @param {*} successfn 
* @param {*} errorfn
*/
function getConditionFilter(catCode, successfn, errorfn) {
  var url = baseUrl + filterConditionUrl + catCode
  ajax({ url: url, success: successfn, fail: errorfn })
}

//
/**
* @param {*} url
* @param {*} successfn 
* @param {*} errorfn
*/
function getHomeCategoryData(url, successfn, errorfn) {
  ajax({ url: url, success: successfn, fail: errorfn })
}


//收藏和观看记录
function userTrack( trackObj,trackType, sucessfn, errorfn   ){
  var trackUrl = 'http://bms-i-test.yanhuamedia.tv/uds/cloud/collection/'+ trackType +'?version=1';
  ajax({
    type: "POST",
    url: trackUrl,
    contentType:'application/json',
    data: JSON.stringify(trackObj),
    success: sucessfn,
    fail: errorfn
  })
}

//查询观看记录和收藏
function userTrackList( trackObj, sucessfn, errorfn ){
  var trackUrl = 'http://bms-i-test.yanhuamedia.tv/uds/cloud/collection/list?version=1&';
  for( var k in trackObj ){
    trackUrl += k + '=' + trackObj[k] + '&';
  }
  ajax({
    type: "GET",
    url: trackUrl,
    contentType:'application/json',
    success: sucessfn,
    fail: errorfn
  })
}