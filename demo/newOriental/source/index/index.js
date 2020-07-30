
// 首页初始化加载
function init() {
  // 获取首页栏目数据
  getYhNavigationBar(function (response) {
    try {
      var columnData = eval("(" + response + ")");
      Home.template(columnData);
      // 初始化键值监听
      Home.init();
      var accessTime = formatDate();
      var Paramet  = yh.userId + '|xdf|' + accessTime + '|1|首页|2';
      // 重庆局方数据上报-页面访问
      bi.CQlogup(Paramet);
    } catch (error) {
      toast("栏目数据转json异常" + error);
    }
  }, function () {
    toast('请求栏目数据异常!');
  });
  if (playConfig.stbType == "p30") {
    getId('contentBox').className = "contentBox contentBoxP30";
    getId('menu-index0').className = 'menu-index menu-search menu-indexP30'
    getId('menu-index1').className = 'menu-index menu-history menu-indexP30'
    getId('menu-index2').className = 'menu-index menu-collect menu-indexP30'
    getId('navNewYear').className = 'nav-new-yearP30'
  }
  if (playConfig.stbType == "3.0") {
    getId('contentBox').className = "contentBox contentBox30";
  }
  //储存进入首页返回盒子参数
  var backUrl = getQueryString('backURL');
  if(backUrl){
    Cookies.set('homePage', backUrl, {
      path: '/'
    })
  }
  //获取card信息pos
  if (!getQueryString("pos")) {
    appraisal();
    try {
      bi.start();
      Cookies.set('start_time',new Date().getTime(),{path:'/'})
    } catch (error) {

    }
  }
}