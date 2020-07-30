// import { player } from "./play";

// 首页初始化加载

prompt('yanhua://epg/accountInfo?return=accountInfo')

// accountInfo({"mobileNo":"15117006612"})

function accountInfo(obj) {
  console.log('获取账号信息-----------accountInfo')
  console.log(obj)
  userObj = obj
  var baseUrl = 'http://47.97.96.103'
// 极光正式代理环境
  var params = {"action":"1","platformCode":"32|13","version":"1","accountId":userObj.mobileNo}
  console.log(params);
  //键盘监听事件
  $.ajax({
    type: 'POST',
    url: baseUrl+"/bms/user/gsxdfAuth",
    dataType: 'json',
    timeout: 5000,
    // contentType: 'json',
    data: params,
    success: function (data) {
      if(data.data.specialType ==undefined){
        Cookies.set('specialType', 0, {path: '/'})
      }else{
        Cookies.set('specialType', 1, {path: '/'})
      }
      Cookies.set('productIds', data.data.productIds, {path: '/'})
      console.log(data.data);
    },
    error: function (err) {
      console.log('无效用户')
      console.log(err)
    }
  })
}


function init() {
  if (!getQueryString('pos')) {
    player.initPlayer();
    try {
      bi.start()
    } catch (error) {
      console.log('埋点错误', error)
    }
    // 首页页面访问埋点
    console.log('bi 首页页面访问埋点')
    try {
      var jsonOb = {}
      jsonOb.page_type = '0101'
      jsonOb.page_id = '205128'
      jsonOb.parent_page_type = 'null'
      jsonOb.parent_page_id = 'null'
      bi.jump(jsonOb)
    } catch (error) {
      console.log('埋点错误', error)
    }
  }
  getData()
}


function getData() {
  // 获取首页栏目数据
  getYhNavigationBar(function (response) {
    try {
      var columnData = eval("(" + response + ")");
      Home.template(columnData);
      // 初始化键值监听
      Home.init();
    } catch (error) {
      console.log("栏目数据转json异常" + error);
    }
  }, function () {
    console.log('请求栏目数据异常!');
  });
}  