// import { player } from "./play";
var KEYMAP = {
  38: "up",
  40: "down",
  37: "left",
  39: "right",
  13: "enter",
  8: "back",
  27: "back",
  22: "back",
  461: "back",
  340: "back",
  283: "back",// 高清3.0返回按键
  181: "home", // 首页
  278: "message", // 信息
  272: "home"
};
//按键分发事件
var onKeyPress
//按键prev处理函数
var grepEvent = function (e) {
  var keyCode = e.keyCode || e.which;
  return onKeyPress(KEYMAP[keyCode])
};
var topContent = {
  up: function () {
  },
  down: function () {
  },
  left: function () {
  },
  right: function () {
  },
  enter: function () {
    downloadApk()
  },
  back: function () {
    prompt('yanhua://epg/exit')
  },
}

// 收集信息
function collectMSG(obj) {
  console.log('收集信息-----------collectMSG')
  console.log(obj)
  var object = JSON.stringify(obj)
  console.log(object)
}
var collectUrl = Cookies.get('collectUrl')
prompt(collectUrl)
// 升级检测
function checkUpdate(obj) {
  console.log('升级检测-----------checkUpdate')
  console.log(obj)
  var object = JSON.stringify(obj)
  console.log(object)
  var objs = eval('(' + object + ')')

  if (objs.code == '204') {
    console.log('没有可升级')
    getId('advert').style.display = 'none'
    init()
    return
  }

  var appVer = objs.data[0].appVer
  var appVerBase = objs.data[0].appVerBase
  console.log('当前版本' + appVerBase)
  console.log('升级版本' + appVer)

  if (appVer > appVerBase) {
    // 下载地址
    getId('advert').style.display = 'block'
    getId('upgrade').style.display = 'block'
    fileUrl = encodeURIComponent(objs.data[0].fileUrl)
    fileMd5 = encodeURIComponent(objs.data[0].fileMd5)
    areaObj = topContent
  } else {
    console.log('不用升级')
    getId('advert').style.display = 'none'
    init()
  }
}
var checkUrl = Cookies.get('checkUrl')
prompt(checkUrl)
// apk下载
function downloadApk() {
  prompt('yanhua://epg/download?return=download&url=' + fileUrl + '&fileMd5=' + fileMd5)
}
function download(obj) {
  console.log('apk下载-----------download')
  console.log(obj)
  var object = JSON.stringify(obj)
  console.log(object)
  var objs = eval('(' + object + ')')
  
  removeClass(getId('footerBar'), 'hover');
  getId('footerBar').innerHTML = '<span id="percentageBar"></span>';
  setTimeout(function () {
    getId('percentageBar').style.width = objs.downloadProgress + '%';
  }, 200)
  if (objs.tag == 'downloadStart') {
    //开始下载
  } else if (objs.tag == 'downloading') {
    //正在下载
  } else if (objs.tag == 'downloadFinish') {
    toast('下载成功')
    fileSavePath = objs.fileSavePath
    console.log(fileSavePath)
    installApk(fileSavePath)
  } else if (objs.tag == 'downloadFail') {
    toast('下载失败')
  }
}
// apk安装
function installApk(res) {
  prompt('yanhua://epg/installApp?return=installApp&package=yanhua.tv.xdf.shanxiyd_SXYD&apkPath=' + res + '&installType=1')
}
function installApp(obj) {
  console.log('apk安装-----------installApp')
  console.log(obj)
  var object = JSON.stringify(obj)
  console.log(object)
  var objs = eval('(' + object + ')')
}


function init() {
  if (!getQueryString('pos')) {
    player.initPlayer()
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

onKeyPress = function (keyCode) {
  switch (keyCode) {
    case "up": //上边
      areaObj.up();
      break;
    case "down": //下边
      areaObj.down();
      break;
    case "left": //左边
      areaObj.left();
      break;
    case "right": //右边
      areaObj.right();
      break;
    case "back":
      areaObj.back();
      break
    case "enter":
      areaObj.enter();
      break;
    case "home":
      areaObj.home();
      break;
  }
};
//事件绑定
document.onkeydown = grepEvent