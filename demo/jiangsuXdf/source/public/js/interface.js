
var baseUrl = 'http://47.97.96.103/?s=120|15&'

var homeCategory = 'http://47.97.96.103/?s=120|15&p=yhNavigationBar&k=1&v=1&catId=205880&c=15'

// 筛选条件接口
var filterConditionUrl = '&p=yhCategoryMulti&k=3&v=2&rootNode=CQXDF&catCode='

//  筛选内容接口
var filterContentUrl = 'http://47.97.96.103/?s=120|15&p=yhScreenResultMulti&k=1&v=1'
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
  ajax({ url:'http://47.97.96.103/?s=120|15&p=yhSearchRecommend&k=1&v=1', success: successfn, fail: errorfn })
}

function getsearchResult(url,successfn, errorfn){
  ajax({ url:url, success: successfn, fail: errorfn })
}


//
/**筛选内容获取
* @param {*} url
* @param {*} successfn 
* @param {*} errorfn
*/
function getContentFilter(pindex,catCode, categoryId,successfn, errorfn) {
  var url = filterContentUrl + '&pindex='+pindex+'&psize=8&sizeFlag=1&catCode='+catCode+'&categoryId='+categoryId;
  console.log('筛选内容：'+url)
  ajax({ url: url, success: successfn, fail: errorfn })
}

//筛选条件获取
/**
* @param {*} url
* @param {*} successfn 
* @param {*} errorfn
*/
function getConditionFilter(successfn, errorfn) {
  // var url = baseUrl + filterConditionUrl + catCode
  var url = 'http://47.97.96.103/?s=120|15&&p=yhCategoryMulti&k=1&v=1&rootNode=XDF'
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

//专题页数据获取
/**
* @param {*} url
* @param {*} successfn 
* @param {*} errorfn
*/
function specialData ( sucessfn, errorfn) {
  var url = "http://47.97.96.103/?s=120|15&p=yhSpecialDetail&k=1&v=1&specialId=205952&c=15"
  ajax({
      type: "GET",
      url: url,
      data: {},
      dataType: "json",
      success: sucessfn,
      fail: errorfn
    })
}

function voiceContext ( successfn, errorfn ) {
  ajax({
    type: "GET",
    url: "http://jsyd-ds.yanhuamedia.tv/?s=58|30&p=yhVoiceCode&k=1&v=2",
    success: successfn,
    fail: errorfn
  })
}

function standardData (url,sucessfn, errorfn) {
ajax({
    type: "GET",
    url: url,
    data: {},
    dataType: "json",
    success: sucessfn,
    fail: errorfn
  })
}