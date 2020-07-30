var enter_time = new Date().getTime()
var KEYMAP = {
  38: "up",
  40: "down",
  37: "left",
  39: "right",
  13: "enter",
  8: "back",
  27: "back",
  22: "back",
  283: 'back',
  461: "back",
  340: "back",
  181: "home", // 首页
  278: "message", // 信息
  272: "home",
  519: "menu"
};
//按键分发事件
var onKeyPress;
//按键prev处理函数
var grepEvent = function (e) {
  var keyCode = e.keyCode || e.which;
  return onKeyPress(KEYMAP[keyCode]);
};
function appraisalBack() {
  //鉴权回调
  playConfig.isOrder = Cookies.get('isOrder') || -1;
  if (playConfig.isOrder == 1) {
    getId('btnBox2').innerHTML = '已订购 <span>VIP</span>';
  }
}
var value = {
  detailData: {},
  isBack: false,
  isBackUrl: false,
  detailUrl: "",
  number: 0,//当前播放的集数
  code: "",
  msg: "",
  indexSingleLeft: 435,//单集滑块距离左边距离(为了适配盒子)
  indexSingWidth: 300,//单集滑动距离
  qb_datetime: 0,//小屏启播时间
  getValue: function () {
    try {
      if (playConfig.isOrder != '1') {
        appraisal(appraisalBack);//详情页鉴权
      }
    } catch (e) {
      toast(e)
    }
    if (getQueryString('assetId')) {
      value.isBackUrl = true;
      //外链跳转专题页面
      this.detailUrl = baseUrl + 'p=yhAssetDetail&k=1&v=1&assetId=' + getQueryString("assetId") + '&c=12';
      try {
        bi.start('0201');
        commonParams.page_type = '0301';
        commonParams.page_id = getQueryString("assetId");
        bi.jump(commonParams, 'no')
      } catch (error) {
      }
    } else {
      this.detailUrl = Cookies.get('detailUrl');
    }
    destroy();
    if (playConfig.isOrder == 1) {
      getId('btnBox2').innerHTML = '已订购 <span>VIP</span>';
    }
    if (playConfig.stbType == "p30") {
      toggleClass(getId('slider1'), 'scrollLeftP30')
      value.indexSingleLeft = 435;
      value.indexSingWidth = 332;
    }
  },
}
var getData = function (url) {
  ajax({
    type: "GET",
    url: url,
    data: {},
    dataType: "json",
    success: function (response) {
      value.detailData = eval("(" + response + ")").data;
      // 页面初始化上传访问页面数据
      try {
        if (Cookies.get('parent_page_type')) {
          commonParams.page_type = '0301';
          commonParams.page_id = value.detailData.assetId;
          bi.jump(commonParams)
        }
      } catch (e) {
        toast('错误信息' + e)
      }
      try {
        var accessTime = formatDate();
        var Paramet = yh.userId + '|xdf|' + accessTime + '|1|详情页|2';
        // 重庆局方数据上报-页面访问
        bi.CQlogup(Paramet);
      } catch (e) { }
      // 小屏播放自动结束时上报小屏播放
      try {
        commonParams.asset_id = value.detailData.assetId;
        commonParams.item_id = value.detailData.itemList[indexSingle.itemNo].itemId;
        commonParams.ep = value.detailData.episodes;
        commonParams.fee = '1';
        commonParams.pos_id = Cookies.get('pos_id') ? Cookies.get('pos_id') : '';
        commonParams.parent_page_id = Cookies.get('parent_page_id');
        commonParams.parent_page_type = Cookies.get('parent_page_type');
        commonParams.event = '8';
        if (Cookies.get('recmd_id')) {
          commonParams.recmd_id = '3';
        } else {
          commonParams.recmd_id = '';
        }
        if (indexSingle.itemNo > 0) {
          commonParams.fee = '2'
        }
        var strCom = '"event":' + '"' + commonParams.event + '"' + ',"asset_id":'
          + '"' + commonParams.asset_id + '"' + ',"item_id":' + '"' + commonParams.item_id + '"'
          + ',"ep":' + '"' + commonParams.ep + '"'
          + ',"fee":' + '"' + commonParams.fee + '"'
          + ',"parent_page_type":' + '"' + commonParams.parent_page_type + '"'
          + ',"parent_page_id":' + '"' + commonParams.parent_page_id + '"'
          + ',"recmd_id":' + '"' + commonParams.recmd_id + '"'
          + ',"pos_id":' + '"' + commonParams.pos_id + '"' + ', ';
        Cookies.set('strCom', strCom, { path: '/' });
        // bi.vod(commonParams)
      } catch (e) {
        toast('错误信息' + e)
      }
      try {
        // 大屏播放返回详情页点播埋点
        if (getQueryString('sour')) {
          if (Cookies.get('strCom')) {
            bi.vod(Cookies.get('strCom'))
          }
        }
      } catch (e) { }
      try {
        // 收藏历史记录页点击后上报数据
        if (Cookies.get('historyJumpUpload')) {
          bi.historical(Cookies.get('historyJumpUpload'));
          Cookies.del('historyJumpUpload', '/')
        };
      } catch (e) {

      }
      if (!value.detailData) {
        document.getElementById('toast2').style.display = 'block';
        document.getElementById('box-wrap').style.display = 'none';
        var urls = historylUrl + '/del?version=1';
        var collectType = '1'; //收藏类型(0-主播,1-资产,2-专题)
        var relateId = getParam('assetId', url);
        var dataList = '{"siteId":' + '"' + yh.siteId + '"' + ',"userId":' + '"' + yh.userId + '"' + ',"collectType":' + '"' + collectType + '"' + ',"relateId":' + '"' + relateId + '"' + '}';
        //  下线删除收藏
        getYhSpecialSC(urls, dataList);
        // 下线删除局方收藏
        try {
          var qxnns_user_id = null;
          var qxscUrl = '';
          if (playConfig.stbType == "p60") {
            qxnns_user_id = sysmisc.get_user_id();
            qxscUrl = 'http://aoepg.cqccn.com/ccn/UserIndex?nns_func=delete_collect_v2&nns_output_type=json&nns_user_id=' + qxnns_user_id + '&nns_version=release@gui@13&nns_video_id=' + relateId + '&nns_no_record=1';
          } else if (playConfig.stbType == "p30") {
            qxnns_user_id = yh.userId;
            qxscUrl = 'http://192.168.18.14/ccn/UserIndex?nns_func=delete_collect_v2&nns_output_type=json&nns_user_id=' + qxnns_user_id + '&nns_version=release@gui@13&nns_video_id=' + relateId + '&nns_no_record=1';
          }
          if (playConfig.stbType == "p60") {
            bridge.ajax('get', qxscUrl, 'application/json', '', '', function (res) {
            }, function (err) {
            })
          } else if (playConfig.stbType == "p30") {
            // alert('P30请求地址：'+qxscUrl)
            tySc(qxscUrl, function (res) {
              // alert('p30取消收藏'+res)
            }, function (error) {
              // alert('p30错误信息：'+error)
            })
          }
        } catch (e) { }
        //  下线删除历史
        var dataList2 = '{"siteId":' + '"' + yh.siteId + '"' + ',"userId":' + '"' + yh.userId + '"' + ',"collectType":' + '"' + 3 + '"' + ',"relateId":' + '"' + relateId + '"' + '}';
        getYhSpecialSC(urls, dataList2);
        setTimeout(function () {
          var backUrl = Cookies.get('backUrl') || '../../index.html';
          window.location.href = backUrl;
        }, 3000)
        return;
      }
      topContent.init();
      indexSingle.init();
      indexTotal.init();
      assetList.init();
      descriptionBox.init();
      collectData();
      qeryHistory();
      // 订购信息，所有订购信息均在订购成功后鉴权信息去获取产品包
      if (getQueryString("code")) {
        //获取订购信息
        value.code = getQueryString("code");
        value.msg = getQueryString("msg");
        if (value.code == 200) {
          playConfig.isOrder = 1;
          Cookies.set('isOrder', "1", {
            path: '/'
          })
          // 用户订购成功
          // try {
          //   commonParams.pkg_type = '';
          //   commonParams.pkg_id = ''//value.detailData.assetId
          //   commonParams.operator_id = '';
          //   commonParams.point = '1';
          //   commonParams.order_msg = '1';
          //   commonParams.parent_page_id = value.detailData.assetId;
          //   commonParams.parent_page_type = '0301';
          //   bi.order(commonParams)
          // } catch (e) {
          //   toast('错误信息' + e)
          // }
        } else {
          Cookies.set('orderErrMsg', value.msg, { path: '/' })
          //用户取消/支付失败
          // try {
          //   commonParams.pkg_type = ''
          //   commonParams.pkg_id = ''//value.detailData.assetId
          //   commonParams.operator_id = ''
          //   commonParams.point = '1'
          //   commonParams.order_msg = encodeURI(value.msg) != 'null' ? encodeURI(value.msg) : '失败'
          //   commonParams.parent_page_id = value.detailData.assetId
          //   commonParams.parent_page_type = '0301'
          //   bi.order(commonParams)
          // } catch (e) {
          //   toast('错误信息' + e)
          // }
        }
      }
    },
    fail: function (error) {
      // console.log(error);
    }
  })
}



//黑白名单
try {
  // var date = new Date();
  // var currDate = date.getFullYear() + '' + (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + ''
  //   + (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
  // var tiem = new Date().getTime();

  var action = '1';//1：用户账号认证； 2：用户MAC认证；3：用户账号+mac认证
  var version = '1'
  var platformCode = '31'//站点id
  var accountId = yh.userId;
  var url = MBSUrl + "?action=" +
    action + "&platformCode=" + platformCode + "&version=" + version + "&accountId=" + accountId;

  ajax({
    type: "GET",
    url: url,
    dataType: "json",
    success: function (response) {
      // toast(response);
      response = eval("(" + response + ")")
      if (response.code == '200') {
        //specialType 是否白名单 1，黑名单；2，白名单
        if (response.data.specialType && response.data.specialType == 1) {
          playConfig.isforbid = '1';
        } else if (response.data.specialType && response.data.specialType == 2) {
          // 白名单
          playConfig.isOrder = '1';
          Cookies.set('isOrder', "1", {
            path: '/'
          })
        }
      }
      value.getValue();
      getData(value.detailUrl);
    },
    fail: function (error) {
      value.getValue();
      getData(value.detailUrl);
      toast(error)
    }
  })
} catch (e) {
  value.getValue();
  getData(value.detailUrl);
  toast(e)
}
// value.getValue();

var backUrl = getQueryString('backURL');
if (backUrl) {
  Cookies.set('homePage', backUrl, {
    path: '/'
  })
}
// if (getUserId() == '9950000001850737' || getUserId() == '9950000000252746') {
//   // 卡号 9950000001850737开白名单无效果，直接写死，12-1日到期
//   // 9950000000252746 12-03到期
//   getId('btnBox2').innerHTML = '已订购 <span>VIP</span>';
// }

var topContent = {
  btnNum: 0, //按钮编号
  isCollect: false, //收藏判断
  element: null, //dom操作元素
  init: function () { //初步渲染
    document.getElementById("name").innerHTML = '<span class="header-name">' + value.detailData.assetName + '</span>'
    document.getElementById("info").innerHTML = value.detailData.area + " | " + value.detailData.director + " | " + value.detailData.episodes + "集"
    document.getElementById("btnBox-1").innerHTML = value.detailData.description
    if (playConfig.stbType == "p30") {
      document.getElementById("btnBox-1").className = 'moreDesP30';
    }
    this.element = document.getElementById('btnBox')
    addClass(getId("btnBox" + topContent.btnNum), 'active') //初始化添加样式
  },
  up: function () {
    removeClass(getId("btnBox" + topContent.btnNum), 'active')
    this.btnNum = -1;
    addClass(getId("btnBox" + topContent.btnNum), 'active')
  },
  down: function () {
    if (this.btnNum == -1) {
      removeClass(getId("btnBox" + topContent.btnNum), 'active')
      this.btnNum = 0;
      addClass(getId("btnBox" + topContent.btnNum), 'active')
    } else {
      removeClass(getId("btnBox" + topContent.btnNum), 'active')
      areaObj = indexSingle
      indexSingle.addCss()
      indexSingle.marquee('add')
    }
  },
  left: function () {
    if (this.btnNum < 1) return
    removeClass(getId("btnBox" + topContent.btnNum), 'active')
    this.btnNum--
    addClass(getId("btnBox" + topContent.btnNum), 'active')
  },
  right: function () {
    if (this.btnNum > 1) return
    removeClass(getId("btnBox" + topContent.btnNum), 'active')
    this.btnNum++
    addClass(getId("btnBox" + topContent.btnNum), 'active')
  },
  enter: function () {
    if (this.btnNum == -1) {
      document.getElementById('descriptionBox').style.visibility = "visible";
      areaObj = descriptionBox;
      return
    }
    if (this.btnNum === 0) {
      // alert('获取p30收藏数据');
      // 添加播放历史记录
      // var id = value.detailData.itemList[indexSingle.itemNo].vodList[0].vodId;
      //   name: 影片名称
      //   vod_id: 影片内部ID(电视剧为剧集ID)或外部ID
      //   typeId: 栏目ID
      // flag: 影片类型标识 (0：电视剧[当为0时,index必传]  1:电影 2:综艺 3:其他)
      // index: 电视剧当前集数
      var data = {
        name: value.detailData.assetName,
        vod_id: value.detailData.itemList[indexSingle.itemNo].vodList[0].playUrl,
        fee: value.detailData.itemList[indexSingle.itemNo].fee,
        typeId: '10000100000000090000000000111398',//教育栏目id 不会有其他类型栏目注入，
        flag: 11,
        index: indexSingle.itemNo
      }
      play(data, function (state) {
        if (state == 'success') {
          // 播放成功后添加播放记录
          playRecord();
          try {
            // 重庆局方数据上报-视频播放
            var vodAccessTimeMaxBtn = formatDate();
            var vodDataaMaxBtn = yh.userId + '|xdf|' + vodAccessTimeMaxBtn + '|2|' + value.detailData.assetName + '|2';
            bi.CQlogup(vodDataaMaxBtn)
          } catch (e) { };
        } else {
          // 需要鉴权不需要添加播放记录
        }
      });
      // 点击全屏播放时上报小屏播放    
      try {
        commonParams.asset_id = value.detailData.assetId;
        commonParams.item_id = value.detailData.itemList[indexSingle.itemNo].itemId;
        commonParams.ep = value.detailData.episodes;
        commonParams.fee = '1';
        commonParams.pos_id = Cookies.get('pos_id') ? Cookies.get('pos_id') : '';
        commonParams.parent_page_id = Cookies.get('parent_page_id');
        commonParams.parent_page_type = Cookies.get('parent_page_type');
        if (Cookies.get('recmd_id')) {
          commonParams.recmd_id = '3';
        } else {
          commonParams.recmd_id = '';
        }
        if (indexSingle.itemNo > 0) {
          commonParams.fee = '2'
        }
        commonParams.event = '8';
        var strCom = '"event":' + '"' + commonParams.event + '"' + ',"asset_id":'
          + '"' + commonParams.asset_id + '"' + ',"item_id":' + '"' + commonParams.item_id + '"'
          + ',"ep": ' + '"' + commonParams.ep + '"'
          + ',"fee": ' + '"' + commonParams.fee + '"'
          + ',"parent_page_type": ' + '"' + commonParams.parent_page_type + '"'
          + ',"parent_page_id": ' + '"' + commonParams.parent_page_id + '"'
          + ',"pos_id": ' + '"' + commonParams.pos_id + '"'
          + ',"recmd_id": ' + '"' + commonParams.recmd_id + '"' + ', ';
        bi.vod(strCom)
        setTimeout(function () {
          Cookies.set('qb_datetime', (new Date()).valueOf(), { path: '/' });
          Cookies.set('isFullScreen', '0', { path: '/' });
        }, 10)
      } catch (e) {
        toast('错误信息' + e)
      }
    } else if (this.btnNum === 1) {
      if (topContent.isCollect) { //已收藏
        // 局方收藏（取消收藏）  
        try {
          var qxnns_user_id = null;
          var qxscUrl = '';
          if (playConfig.stbType == "p60") {
            qxnns_user_id = sysmisc.get_user_id();
            qxscUrl = 'http://aoepg.cqccn.com/ccn/UserIndex?nns_func=delete_collect_v2&nns_output_type=json&nns_user_id=' + qxnns_user_id + '&nns_version=release@gui@13&nns_video_id=' + value.detailData.assetId + '&nns_no_record=1';
          } else if (playConfig.stbType == "p30") {
            qxnns_user_id = yh.userId;
            qxscUrl = 'http://192.168.18.14/ccn/UserIndex?nns_func=delete_collect_v2&nns_output_type=json&nns_user_id=' + qxnns_user_id + '&nns_version=release@gui@13&nns_video_id=' + value.detailData.assetId + '&nns_no_record=1';
          }
          if (playConfig.stbType == "p60") {
            bridge.ajax('get', qxscUrl, 'application/json', '', '', function (res) {
            }, function (err) {
            })
          } else if (playConfig.stbType == "p30") {
            // alert('P30请求地址：'+qxscUrl)
            tySc(qxscUrl, function (res) {
              // alert('p30取消收藏'+res)
            }, function (error) {
              // alert('p30错误信息：'+error)
            })
          }
        } catch (e) { }
        // 取消收藏时上报
        var collectType = '1'; //收藏类型(0-主播,1-资产,2-专题)
        var relateId = value.detailData.assetId;
        var data = '{"siteId":' + '"' + yh.siteId + '"' + ',"userId":' + '"' + yh.userId + '"' + ',"collectType":' + '"' + collectType + '"' + ',"relateId":' + '"' + relateId + '"' + '}';
        removeFav(data, function (rep) {
          if (rep.indexOf('success') !== -1) {
            topContent.isCollect = false
            document.getElementById('collectWord').innerText = "收藏";
            document.getElementById('btnBox1').className = 'noCollect active';
            try {
              commonParams.collect = '2';
              commonParams.cid = value.detailData.assetId;
              commonParams.click_type = '1';
              bi.collection(commonParams)
            } catch (e) {
              toast('错误信息' + e)
            }
          } else {
            toast('删除收藏失败')
          }
        })
      } else { //未收藏
        try {
          // 局方收藏（添加收藏）
          var nns_user_id = null;
          var nns_extension_field = '';
          var scUrl = '';
          if (playConfig.stbType == "p60") {
            nns_user_id = sysmisc.get_user_id();
            nns_extension_field = '{"redirect":"http://192.168.21.27:7001/source/detail/detail.html?assetId=' + value.detailData.assetId + '","img_s":' + '"' + value.detailData.assetImg + '"'
              + ',"img_h":' + '"' + value.detailData.assetImg + '"'
              + ',"video_all_index":' + '"' + value.detailData.episodes + '"'
              + ',"img_v":' + '"' + value.detailData.assetImg + '"' + '}';
            scUrl = 'http://aoepg.cqccn.com/ccn/UserIndex?nns_func=add_collect_v2&nns_output_type=json&nns_user_id=' + nns_user_id + '&nns_version=release@gui@13&nns_video_id=' + value.detailData.assetId + '&nns_video_type=0&nns_cp_id=zjyh&nns_platform_type=sp_xdftvxt&nns_first_one=1&nns_view_type=1&nns_video_name=' + encodeURIComponent(value.detailData.assetName) + '&nns_extension_field=' + nns_extension_field;
          } else if (playConfig.stbType == "p30") {
            nns_user_id = yh.userId;
            nns_extension_field = '{"cmd_start":"am start -n com.ipanel.dtv.chongqing/com.ipanel.dtv.chongqing.IPanel30PortalActivity --es url http://192.168.21.27:7001/source/detail/detail.html?assetId=' + value.detailData.assetId + '","img_s":' + '"' + value.detailData.assetImg +
              '"' + ',"img_h":' + '"' + value.detailData.assetImg +
              '"' + ',"video_all_index":' + '"' + value.detailData.episodes +
              '"' + ',"img_v":' + '"' + value.detailData.assetImg + '"' + '}';
            scUrl = 'http://192.168.18.14/ccn/UserIndex?nns_func=add_collect_v2&nns_output_type=json&nns_user_id=' + nns_user_id + '&nns_version=release@gui@13&nns_video_id=' + value.detailData.assetId + '&nns_video_type=0&nns_cp_id=zjyh&nns_platform_type=sp_xdftvxt&nns_first_one=1&nns_view_type=1&nns_video_name=' + encodeURI(value.detailData.assetName) + '&nns_extension_field=' + nns_extension_field;
          }
          if (playConfig.stbType == "p60") {
            bridge.ajax('get', scUrl, 'application/json', '', '', function (res) {
            }, function (err) {
            })
          } else if (playConfig.stbType == "p30") {
            // alert('P30请求地址：'+scUrl)
            tySc(scUrl, function (res) {
              // alert('30添加用户收藏结果：'+res)
            }, function (error) {
              // alert('p30错误信息：'+error)
            })
          }
        } catch (e) {
        }
        var collectType = '1'; //收藏类型(0-主播,1-资产,2-专题)
        var relateId = value.detailData.assetId;
        var relateTitle = value.detailData.assetName;
        var relateImg = value.detailData.assetImg;
        var relateUrl = value.detailUrl;
        var relateLayout = value.detailData.layout;
        var relateScore = value.detailData.score == undefined ? '' : value.detailData.score;
        if (value.detailData.score && value.detailData.score.length == 1) {
          relateScore += '0'
        }
        var data = '{"siteId":' + '"' + yh.siteId + '"' + ',"userId":' + '"' + yh.userId + '"' + ',"collectType":' + '"' + collectType + '"' + ',"relateId":' + '"' + relateId + '"' + ',"relateTitle":' + '"' + relateTitle + '"' + ',"relateImg":' + '"' + relateImg + '"' + ',"relateUrl":' + '"' + relateUrl + '"' + ',"relateLayout":' + '"' + relateLayout + '"' + ',"relateScore":' + '"' + relateScore + '"' + '}';
        addFav(data, function (rsp) {
          if (rsp.indexOf('success') !== -1) {
            topContent.isCollect = true;
            document.getElementById('collectWord').innerText = "已经收藏";
            document.getElementById('btnBox1').className = 'noCollect active isCollect';
            // 收藏时上报	
            try {
              commonParams.collect = '1';
              commonParams.cid = value.detailData.assetId;
              commonParams.click_type = '1';
              bi.collection(commonParams)
            } catch (e) {
              toast('错误信息' + e)
            }
          } else {
            // alert('岩华添加收藏失败')
            toast('添加收藏失败')
          }
        });
      }
    } else {
      // if (getUserId() == '9950000001850737' || getUserId() == '9950000000252746') {
      //   // 卡号 9950000001850737开白名单无效果，直接写死，12-1日到期
      //   // 9950000000252746 12-03到期
      //   return;
      // }
      try {
        commonParams.page_type = '0301';
        commonParams.page_id = value.detailData.assetId;
        bi.orderClick(commonParams);
      } catch (e) { }
      // 点击订购按钮时上报小屏播放    
      try {
        commonParams.asset_id = value.detailData.assetId;
        commonParams.item_id = value.detailData.itemList[indexSingle.itemNo].itemId;
        commonParams.ep = value.detailData.episodes;
        commonParams.fee = '1';
        commonParams.pos_id = Cookies.get('pos_id') ? Cookies.get('pos_id') : '';
        commonParams.parent_page_id = Cookies.get('parent_page_id');
        commonParams.parent_page_type = Cookies.get('parent_page_type');
        if (Cookies.get('recmd_id')) {
          commonParams.recmd_id = '3';
        } else {
          commonParams.recmd_id = '';
        }
        if (indexSingle.itemNo > 0) {
          commonParams.fee = '2'
        }
        commonParams.event = '8';
        var strCom = '"event":' + '"' + commonParams.event + '"' + ',"asset_id":'
          + '"' + commonParams.asset_id + '"' + ',"item_id":' + '"' + commonParams.item_id + '"'
          + ',"ep": ' + '"' + commonParams.ep + '"'
          + ',"fee": ' + '"' + commonParams.fee + '"'
          + ',"parent_page_type": ' + '"' + commonParams.parent_page_type + '"'
          + ',"parent_page_id": ' + '"' + commonParams.parent_page_id + '"'
          + ',"pos_id": ' + '"' + commonParams.pos_id + '"'
          + ',"recmd_id": ' + '"' + commonParams.recmd_id + '"' + ', ';
        bi.vod(strCom)
      } catch (e) {
        toast('错误信息' + e)
      }
      if (playConfig.isOrder == 0) {
        destroy();
        createOrder();
      }
    }
  },

}

var indexSingle = {
  data: {},
  element: null,
  itemNo: 0,
  init: function () {
    this.data = value.detailData.itemList;
    this.element = document.getElementById('slider1');
    var html = '';
    var freeHtml = '';
    var stbType = "free30";
    if (playConfig.stbType == "p30") {
      stbType = 'freeP30'
    } else if (playConfig.stbType == "3.0") {
      stbType = 'free30'
    } else {
      stbType = 'free60'
    }
    for (var i = 0; i < this.data.length; i++) {
      if (this.data[i].fee == 1) {
        freeHtml = '<span class="free ' + stbType + '" id="free"></span>'
      } else {
        freeHtml = '';
      }

      var div = '<div class="buttomNum" id="buttomNum' + i + '">' + freeHtml + this.data[i].itemName + '</div>';
      // if (i == 0 && Cookies.get('isOrder') == 0) {
      //   var div = '<div class="buttomNum" id="buttomNum' + i + '">' + freeHtml + this.data[i].itemName + '</div>';
      // } else if (i == 0 && Cookies.get('isOrder') == null) {
      //   var div = '<div class="buttomNum" id="buttomNum' + i + '">' + freeHtml + this.data[i].itemName + '</div>';
      // } else {
      //   var div = '<div class="buttomNum" id="buttomNum' + i + '">' + this.data[i].itemName + '</div>';
      // }
      html += div;
    };
    this.element.innerHTML = html;
  },
  removeCss: function () {
    removeClass(getId("buttomNum" + indexSingle.itemNo), 'active')
  },
  addCss: function () {
    addClass(getId("buttomNum" + indexSingle.itemNo), 'active')
    this.element.style.left = value.indexSingleLeft + -value.indexSingWidth * this.itemNo + 'px'; //单集按钮滚动
    if (this.itemNo % 10 === 0 || (this.itemNo + 1) % 10 === 0) { //单集跳转10的倍数，触发总集数滚动
      indexTotal.itemNo = Math.floor(this.itemNo / 10)
      indexTotal.element.style.left = 530 + -100 * indexTotal.itemNo + 'px'; //单集按钮滚动
    }
  },
  marquee: function (status) {
    var scrollLeft = 0;
    clearInterval(this.timer);
    var div = getId("buttomNum" + this.itemNo);
    var length = strlen(div.innerHTML);
    if (length < 16) return
    if (status == 'add') {
      this.timer = setInterval(function () {
        if (scrollLeft <= -19 * length) {
          scrollLeft = 290;
          div.style.cssText = "text-indent: " + scrollLeft + "px;text-align: left;"
        } else {
          scrollLeft += -3;
          div.style.cssText = "text-indent: " + scrollLeft + "px;text-align: left;"
        }
      }, 160);
    } else {
      if (div.innerHTML.length >= 16) {
        scrollLeft = 0;
        div.style.cssText = "text-indent: " + scrollLeft + "px;text-align: left;"
      }
    }
  },
  up: function () {
    areaObj = topContent
    indexSingle.removeCss();
    this.marquee()
    addClass(getId("btnBox" + topContent.btnNum), 'active')
  },
  down: function () {
    areaObj = indexTotal
    this.removeCss();
    this.marquee()
    var length = this.data.length;
    addClass(getId("topNum" + indexTotal.itemNo), 'active')
  },
  left: function () {
    if (this.itemNo === 0) return;
    this.marquee()
    this.removeCss();
    this.itemNo--;
    this.addCss();
    this.marquee('add')
  },
  right: function () {
    if (this.itemNo === this.data.length - 1) return;
    this.removeCss();
    this.marquee()
    this.itemNo++;
    this.addCss();
    this.marquee('add')
  },
  enter: function () {
    if (playConfig.isOrder == 0) {
      try {
        commonParams.page_type = '0301';
        commonParams.page_id = value.detailData.assetId;
        bi.orderClick(commonParams);
      } catch (e) { }
    }
    var data = {
      name: value.detailData.assetName,
      vod_id: value.detailData.itemList[indexSingle.itemNo].vodList[0].playUrl,
      fee: value.detailData.itemList[indexSingle.itemNo].fee,
      typeId: '10000100000000090000000000111398',//教育栏目id  
      flag: 11,
      index: indexSingle.itemNo
    }
    play(data, function (state) {
      if (state == 'success') {
        // 播放成功后添加播放记录
        playRecord()
        try {
          // 重庆局方数据上报-视频播放
          var vodAccessTimeMax = formatDate();
          var vodDataaMax = yh.userId + '|xdf|' + vodAccessTimeMax + '|2|' + value.detailData.assetName + '|2';
          bi.CQlogup(vodDataaMax)
        } catch (e) { };
      } else {
        // 需要鉴权不需要添加播放记录
      }
    });
    try {
      if (Cookies.get('strCom')) {
        bi.vod(Cookies.get('strCom'))
      }
      commonParams.asset_id = value.detailData.assetId;
      commonParams.item_id = value.detailData.itemList[indexSingle.itemNo].itemId;
      commonParams.ep = value.detailData.episodes;
      commonParams.parent_page_id = Cookies.get('parent_page_id');
      commonParams.parent_page_type = Cookies.get('parent_page_type');
      commonParams.pos_id = Cookies.get('pos_id') ? Cookies.get('pos_id') : '';
      commonParams.fee = '1';
      commonParams.event = '8';
      if (Cookies.get('recmd_id')) {
        commonParams.recmd_id = '3';
      } else {
        commonParams.recmd_id = '';
      }
      if (indexSingle.itemNo > 0) {
        commonParams.fee = '2'
      }
      commonParams.event = '8';
      var strCom = '"event":' + '"' + commonParams.event + '"' + ',"asset_id":'
        + '"' + commonParams.asset_id + '"' + ',"item_id":' + '"' + commonParams.item_id + '"'
        + ',"ep":' + '"' + commonParams.ep + '"'
        + ',"fee":' + '"' + commonParams.fee + '"'
        + ',"parent_page_type":' + '"' + commonParams.parent_page_type + '"'
        + ',"parent_page_id":' + '"' + commonParams.parent_page_id + '"'
        + ',"recmd_id":' + '"' + commonParams.recmd_id + '"'
        + ',"pos_id":' + '"' + commonParams.pos_id + '"' + ', '
      Cookies.set('strCom', strCom, { path: '/' });
      setTimeout(function () {
        Cookies.set('qb_datetime', (new Date()).valueOf(), { path: '/' });
        Cookies.set('isFullScreen', '0', { path: '/' });
      }, 10)
      // bi.vod(commonParams)
    } catch (e) {
      toast('错误信息' + e)
    }
  }
}

var indexTotal = {
  data: {},
  element: null,
  itemNo: 0,
  arrayNum: 0,
  init: function () {
    this.data = value.detailData.itemList;
    var total = this.data.length;
    this.arrayNum = Math.floor((total - 1) / 10) * 1;
    this.element = document.getElementById('slider2');
    var class1 = 'topNum';
    if (playConfig.stbType == "p30") {
      class1 = "topNumP30"
    }
    var html = '';
    for (var i = 0; i < this.arrayNum; i++) {
      var div = ''
      if (i == 0) {
        div = '<div class="' + class1 + '" id="topNum' + i + '">1-' + (i + 1) + '0</div>'
      } else {
        div = '<div class="' + class1 + '" id="topNum' + i + '">' + i + "1-" + (i + 1) + "0" + '</div>';
      }
      html += div
    };
    this.element.innerHTML = html;
    if (total > this.arrayNum * 10) {
      var div
      if (i == 0) {
        div = '<div class="' + class1 + '" id="topNum' + i + '">1-' + total + '</div>';
      } else {
        div = '<div class="' + class1 + '" id="topNum' + i + '">' + this.arrayNum + '1-' + total + '</div>';
      }
      html += div
      this.element.innerHTML = html;
    }
  },
  addCss: function () {
    addClass(getId("topNum" + indexTotal.itemNo), 'active')
    this.element.style.left = 530 + -100 * this.itemNo + 'px' //滚动方程
    indexSingle.itemNo = this.itemNo * 10;
    indexSingle.element.style.left = value.indexSingleLeft + -value.indexSingWidth * indexSingle.itemNo + 'px' //滚动方程
  },
  removeCss: function () {
    removeClass(getId("topNum" + indexTotal.itemNo), 'active')
  },
  up: function () {
    areaObj = indexSingle
    indexTotal.removeCss();
    indexSingle.marquee('add')
    addClass(getId("buttomNum" + indexSingle.itemNo), 'active')
  },
  down: function () {
    this.removeCss()
    areaObj = assetList
    assetList.addCss()
  },
  left: function () {
    if (this.itemNo === 0) return;
    this.removeCss();
    this.itemNo--;
    this.addCss();
  },
  right: function () {
    if (this.itemNo === this.arrayNum) return
    this.removeCss();
    this.itemNo++;
    this.addCss();
  }, enter: function () { }

}

var assetList = {
  data: {},
  itemNo: 0,
  element: null,
  init: function () {
    this.data = value.detailData.assetList
    this.element = document.getElementById("scrollContent");
    var html = '';
    var length = this.data.length = 6;
    for (var i = 0; i < length; i++) {
      var div
      if (playConfig.stbType == "p30") {
        div = '<li class="content content' + i + '" id="li-item' + i + '"><div class="contentP30 content-inner">' + this.data[i].assetName + '</div></li > '
      } else {
        div = '<li class="content content' + i + '" id="li-item' + i + '"><div class="contentP60 content-inner">' + this.data[i].assetName + '</div></li > '
      }
      html += div;
    }
    this.element.innerHTML = html;
  },
  addCss: function () {
    addClass(getId("li-item" + this.itemNo), 'active')
  },
  removeCss: function () {
    removeClass(getId("li-item" + this.itemNo), 'active')
  },
  up: function () {
    areaObj = indexTotal
    assetList.removeCss();
    addClass(getId("topNum" + indexTotal.itemNo), 'active')
  },

  down: function () {
  },

  left: function () {
    if (this.itemNo === 0) return
    if (this.itemNo >= 4) {
      this.element.style.left = -(this.itemNo - 4) * 196 + 60 + "px"
    }
    this.removeCss()
    this.itemNo--
    this.addCss()
  },

  right: function () {
    if (this.itemNo === this.data.length - 1) return
    this.removeCss()
    this.itemNo++
    if (this.itemNo >= 4) {
      this.element.style.left = -(this.itemNo - 4) * 196 + 60 + "px"
    }
    this.addCss()
  },
  enter: function () {
    destroy();
    try {
      commonParams.asset_id = value.detailData.assetId;
      commonParams.item_id = value.detailData.itemList[indexSingle.itemNo].itemId;
      commonParams.ep = value.detailData.episodes;
      commonParams.fee = '1';
      commonParams.pos_id = Cookies.get('pos_id') ? Cookies.get('pos_id') : '';
      commonParams.parent_page_id = Cookies.get('parent_page_id');
      commonParams.parent_page_type = Cookies.get('parent_page_type');
      if (Cookies.get('recmd_id')) {
        commonParams.recmd_id = '3';
      } else {
        commonParams.recmd_id = '';
      }
      if (indexSingle.itemNo > 0) {
        commonParams.fee = '2'
      }
      commonParams.event = '8';
      var strCom = '"event":' + '"' + commonParams.event + '"' + ',"asset_id":'
        + '"' + commonParams.asset_id + '"' + ',"item_id":' + '"' + commonParams.item_id + '"'
        + ',"ep": ' + '"' + commonParams.ep + '"'
        + ',"fee": ' + '"' + commonParams.fee + '"'
        + ',"parent_page_type": ' + '"' + commonParams.parent_page_type + '"'
        + ',"parent_page_id": ' + '"' + commonParams.parent_page_id + '"'
        + ',"pos_id": ' + '"' + commonParams.pos_id + '"'
        + ',"recmd_id": ' + '"' + commonParams.recmd_id + '"' + ', ';
      bi.vod(strCom)
      setTimeout(function () {
        Cookies.set('qb_datetime', (new Date()).valueOf(), { path: '/' });
        Cookies.set('isFullScreen', '0', { path: '/' });
      }, 10)
    } catch (e) {
      toast('错误信息' + e)
    }
    Cookies.set('parent_page_id', value.detailData.assetId, { path: '/' });
    Cookies.set('parent_page_type', '0301', { path: '/' });
    Cookies.set('recmd_id', 3, { path: '/' });
    Cookies.del('pos_id', '/');
    try {
      // 推荐位点击上报数据
      commonParams.pos_id = Cookies.get('pos_id') ? Cookies.get('pos_id') : '';
      commonParams.recmd_id = '3';
      commonParams.page_type = '0301';
      commonParams.page_id = value.detailData.assetId;
      commonParams.click_type = '1';
      commonParams.cid = value.detailData.assetId;
      bi.RecommendedClick(commonParams);
    } catch (e) { }
    // 刷新当前页
    areaObj = topContent
    var detailURL = this.data[this.itemNo].jsonUrl //存储详情页url
    Cookies.set('detailUrl', detailURL, {
      path: '/'
    })
    var pageUrl = window.location.href;
    window.location.replace(pageUrl);
  },
}
var descriptionBox = {
  num: 0,//翻页数
  option: 0, //页数
  height: 0, //文字高度
  init: function () {
    if (playConfig.stbType == "p30") {
      getId('scrollBox').className = "scrollBoxP30 scrollBox";
    }
    document.getElementById("wordScroll").innerHTML = value.detailData.description;
    this.height = document.getElementById('wordScroll').offsetHeight;
    this.option = Math.floor(this.height / 270);
  },
  enter: function () {
    areaObj = topContent
    document.getElementById('descriptionBox').style.visibility = "hidden";
  },
  up: function () {
    if (this.num == 0) return;
    this.num--;
    document.getElementById('wordScroll').style.top = -270 * this.num + "px"
  },
  down: function () {
    if (this.num == this.option) return;
    this.num++;
    document.getElementById('wordScroll').style.top = -270 * this.num + "px"
  },
}
function removeFav(data, callBackFunction) {
  var urls = historylUrl + '/del?version=1';
  getYhSpecialSC(urls, data, function (response) {
    callBackFunction(response)
  })
};
function addFav(data, callBackFunction) {
  var urls = historylUrl + '/collect?version=1';
  getYhSpecialSC(urls, data, function (response) {
    callBackFunction(response)
  })
};
function collectData() {
  var url = historylUrl +
    "/list?version=1&siteId=" + yh.siteId + "&userId=" + yh.userId +
    "&relateId=" + value.detailData.assetId + "&collectType=1"
  getYhSpecialList_nc(url, function (res) {
    if (typeof (res) == "string") {
      res = eval('(' + res + ')');
    }
    if (res.data.resultNum == 1) {
      topContent.isCollect = true;
      document.getElementById('collectWord').innerText = "已经收藏"
      // document.getElementById('collect').className = 'isCollect btn'
      addClass(getId("btnBox1"), 'isCollect')
    } else {
      topContent.isCollect = false
      document.getElementById('collectWord').innerText = "收藏"
      // document.getElementById('collect').className = 'noCollect btn'
      addClass(getId("btnBox1"), 'noCollect')
    }
  })
};
function playRecord() {
  // 播放历史记录
  var collectType = '3';
  var relateId = value.detailData.assetId;
  var relateTitle = value.detailData.assetName;
  var relateImg = value.detailData.assetImg;
  var relateUrl = value.detailUrl;
  var relateLayout = value.detailData.layout;
  var relateScore = value.detailData.score == undefined ? '' : value.detailData.score;
  var relateEpisode = indexSingle.itemNo + 1;
  var relateTime = '0';
  if (value.detailData.score && value.detailData.score.length == 1) {
    relateScore += '0'
  }
  var data = '{"siteId":' + '"' + yh.siteId + '"' + ',"relateEpisode":' + '"' + relateEpisode + '"' + ',"relateTime":' + '"' + relateTime + '"' + ',"userId":' + '"' + yh.userId + '"' + ',"collectType":' + '"' + collectType + '"' + ',"relateId":' + '"' + relateId + '"' + ',"relateTitle":' + '"' + relateTitle + '"' + ',"relateImg":' + '"' + relateImg + '"' + ',"relateUrl":' + '"' + relateUrl + '"' + ',"relateLayout":' + '"' + relateLayout + '"' + ',"relateScore":' + '"' + relateScore + '"' + '}';
  var urls = historylUrl + '/collect?version=1';
  getYhSpecialSC(urls, data)
};
function qeryHistory() {
  // 查询播放记录
  var url = historylUrl + '/list?version=1&siteId=' + yh.siteId + '&userId=' + yh.userId + '&pindex=0&psize=16&collectType=3'
  getCollectionList(url, function (response) {
    var obj = {
      name: value.detailData.assetName,
      vod_id: value.detailData.itemList[0].vodList[0].playUrl,
      typeId: '10000100000000090000000000111398',//教育栏目id 不会有其他类型栏目注入，
      flag: 11,
      index: 1
    }
    if (eval('(' + (response) + ')').code !== 200) {
    } else {
      if (Cookies.get('isOrder') && Cookies.get('isOrder') == 1) {
        for (var i = 0; i < eval('(' + (response) + ')').data.resultList.length; i++) {
          var element = eval('(' + (response) + ')').data.resultList[i];
          if (element.relateId == value.detailData.assetId) {
            // 有播放记录，并返回集数
            indexSingle.itemNo = element.relateEpisode - 1
            document.getElementById('slider1').style.left = value.indexSingleLeft + -value.indexSingWidth * indexSingle.itemNo + 'px'; //单集按钮滚动
            if (indexSingle.itemNo > 10) { //单集跳转10的倍数，触发总集数滚动
              indexTotal.itemNo = Math.floor(indexSingle.itemNo / 10)
              indexTotal.element.style.left = 530 + -100 * indexTotal.itemNo + 'px'; //单集按钮滚动
            }
            obj.index = element.relateEpisode || 1;
            obj.vod_id = value.detailData.itemList[indexSingle.itemNo].vodList[0].playUrl;
          }
        }
      }
    }
    try {
      // 重庆局方数据上报-视频播放
      var vodAccessTime = formatDate();
      var vodDataa = yh.userId + '|xdf|' + vodAccessTime + '|2|' + value.detailData.assetName + '|1';
      bi.CQlogup(vodDataa)
    } catch (e) { };
    playMin(obj);
  }, function (response) {
    playMin(obj);
  })
}

areaObj = topContent; //初始焦点赋值

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
      if (getId("imgBig").style.display !== 'block') {
        try {
          commonParams.asset_id = value.detailData.assetId;
          commonParams.item_id = value.detailData.itemList[indexSingle.itemNo].itemId;
          commonParams.ep = value.detailData.episodes;
          commonParams.parent_page_id = Cookies.get('parent_page_id');
          commonParams.parent_page_type = Cookies.get('parent_page_type');
          commonParams.pos_id = Cookies.get('pos_id') ? Cookies.get('pos_id') : '';
          commonParams.fee = '1';
          commonParams.event = '8';
          if (Cookies.get('recmd_id')) {
            commonParams.recmd_id = '3';
          } else {
            commonParams.recmd_id = '';
          }
          if (indexSingle.itemNo > 0) {
            commonParams.fee = '2'
          }
          commonParams.event = '8';
          var strCom = '"event":' + '"' + commonParams.event + '"' + ',"asset_id":'
            + '"' + commonParams.asset_id + '"' + ',"item_id":' + '"' + commonParams.item_id + '"'
            + ',"ep": ' + '"' + commonParams.ep + '"'
            + ',"fee": ' + '"' + commonParams.fee + '"'
            + ',"parent_page_type": ' + '"' + commonParams.parent_page_type + '"'
            + ',"parent_page_id": ' + '"' + commonParams.parent_page_id + '"'
            + ',"pos_id": ' + '"' + commonParams.pos_id + '"'
            + ',"recmd_id": ' + '"' + commonParams.recmd_id + '"' + ', ';
          bi.vod(strCom);
        } catch (e) {
          toast('错误信息' + e)
        }
      }
      if (Cookies.get('parent_page_type')) {
        Cookies.del('parent_page_type', '/');
      };
      if (Cookies.get('parent_page_id')) {
        Cookies.del('parent_page_id', '/');
      };
      if (Cookies.get('pos_id')) {
        Cookies.del('pos_id', '/');
      };
      if (Cookies.get('recmd_id')) {
        Cookies.del('recmd_id', '/')
      }
      if (Cookies.get('qb_datetime')) {
        Cookies.del('qb_datetime', '/')
      }
      destroy();
      //返回
      if (value.isBackUrl == true) {
        goBack();
      } else {
        var backUrl = Cookies.get('backUrl') || '../../index.html'
        window.location.href = backUrl;
      }
      break;
    case "enter":
      areaObj.enter();
      break;
    case "home":
      areaObj.home();
      break;
    case "menu":
      destroy();
  }
};
//事件绑定
document.onkeydown = grepEvent;