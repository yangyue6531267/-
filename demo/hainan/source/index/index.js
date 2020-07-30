// 首页初始化加载
function init() {
  if (!getParam('pos')) {
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
  getData();
  try {
    var params = {
      type: 0,
      content: {
        type: 0
      }
    }
    stat(params);
  } catch (error) {
  }
}
function getData() {
  // 获取首页栏目数据
  getYhNavigationBar(function (response) {
    try {
      var columnData = JSON.parse(response);
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