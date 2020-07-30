var SERVER_HOST = "http://" + location.host;
var SERVER_PATH = location.pathname.substring(0, location.pathname.lastIndexOf("/"));
var  APPID = "c64c9f3e2abd47b";
var  APPKEY = "7dd06cf7d25fdddb48a17ca0f3d29435";

var ptJson = {
	//设置模式
	ptStyle: "RELEASE",
	ptHost: function () {
	  if (this.ptStyle == "RELEASE") {
		//发布模式
		return "http://112.17.251.186:10089";
	  } else if (this.ptStyle == "DEV") {
		//开发模式
		return "http://47.97.96.103";
	  }
	}
}

//遥控器键值表
var KEYMAP = {
	48: "0",
	49: "1",
	50: "2",
	51: "3",
	52: "4",
	53: "5",
	54: "6",
	55: "7",
	56: "8",
	57: "9",
	38: "up",
	40: "down",
	37: "left",
	39: "right",
	13: "enter",
	8: "back",
	27: "back",
	58: "iptv",
	263: "play", // 暂停播放-小遥控器
	270: "play", // 中兴播放键 （几个播放键之间会不会有冲突）？
	86: "play", // 创维播放键
	264: "forward", // 创维快进
	265: "rewind", // 创维快退
	181: "home", //../index_epg.html
	97: "1",
	257: "channelplus", // 频道加
	258: "channelminus", // 频道减
	261: "mute", //静音
	209: "soundtrack", // 声道
	259: "volumeplus", // 音量加
	260: "volumeminus", // 音量减
	275: "live", // 直播
	276: "review", // 回看
	277: "vod", // 点播
	278: "message", // 信息
	272: "home",
	280: "refresh", // 刷新
	0x0300: "iptv",
};
//按键分发事件
var onKeyPress
//按键prev处理函数
var grepEvent = function (e) {
	console.log(e.keyCode)
	if (e.keyCode == 8) {
			if (grepEvent.isPress) return; //节流
			grepEvent.isPress = true;
			setTimeout(function () {
				grepEvent.isPress = false;
			}, 180);
	}
	var keyCode = e.keyCode || e.which;
	return onKeyPress(KEYMAP[keyCode]);
}

/** 
 * 播放所需
 * 
 * **/
var playConfig = {
  isRelease: true,//// playConfig.isRelease   默认false 开发环境  true线上环境(内网)
  isOrder: '0',//1 鉴权通过  0 未订购
}

var yh = {}

var info = getStorage('AccountInfo') && JSON.parse(getStorage('AccountInfo'))
console.log("info"+ JSON.stringify(info));
//{"epgUrl":"http://111.13.42.17:33200","playEds":"http://eds.bja.bcs.ottcn.com:8082/EDS/XML/CheckToken","userId":"13522071528","userToken":"108914E0707632387C7045C0C37C3231"}
//{"adUrl":"https://a157.api.adott.ottcn.com","playEds":"http://eds.bja.bcs.ottcn.com:8082/EDS/XML/CheckToken","statisticsUrl":"loga157.cloud.ottcn.com:14630","updateUrl":"https://bzoa157.cloud.ottcn.com","userId":"13522071528","userToken":"105A7471367532367C759AD09A7C3231"}"
var device = getStorage('deviceInfo') && JSON.parse(getStorage('deviceInfo'))
console.log("device"+  JSON.stringify(device))
//{"androidV":"4.4.2","brand":"Android","deviceId":"e8ca700c492f4fdc80eb9b96ffed6f74","deviceIp":"192.168.123.35","eth0_mac":"58b42dcf510a","hardware":"amlogic","incremental":"201907080939","manufacturer":"CMDC","model":"CM201-1-YS","product":"p201_iptv","signMD5":"8BBFD3861468AB0D971E0420FED33D78","softVCode":"1","softVName":"1.0.000","stbId":"0032030000010040190258B42DCF510A","wifi_mac":"b4041838ba1b"}
try {
  yh.siteId = '42' // 站点ID

//   yh.userId = info.userId || 123456; // 用户ID
  // yh.userId = 123456; // 用户ID

  yh.userId = info.userId || "13522071528"  // 用户ID
  
  yh.playEds = info.playEds //播放
  console.log(info.playEds)

  yh.epgUrl = info.epgUrl //epg地址

  yh.sys_v = 'hainan' // 系统版本

  yh.soft_v = '1.0.0' // 用户软件版本

  yh.device_id = device.eth0_mac;
  //yh.device_id = device.deviceId ; // 设备号获取不到取userId

  yh.operator_id = '' // 运营商ID（广电：1 电信：2 移动：3 联通：4）

  yh.terrace_id = '' // 平台ID(中兴：1 华为：2 烽火：3)

  yh.brand = '' // 机顶盒品牌

  yh.mode = device.model // 机顶盒型号

  yh.model = '' // 用户设备版本

  yh.softVname = device.softVName //终端版本号

  yh.apk_version = device.softVCode // apk版本

  yh.eth0_mac = device.eth0_mac // 盒子mac

  yh.ip = device.deviceIp //终端ip地址

  yh.reserve_group = '' // 采集方式

  yh.token = info.userToken // 用户令牌

  yh.stbId = device.stbId || "0032030000010040190258B42DCF510A" // 机顶盒号 

  yh.bizDomain = '' // 用户厂商orBMS站点

  yh.userGroup = '' // 用户分组

  yh.productIds = '' // 用户已订购产品ID（多个以逗号隔开）

  yh.areaCode = info.cpCode // 用户区域

  yh.userName = '' // 用户名称

  yh.telephone = info.mobileNo // 联系电话

  yh.epgDomain = '' // epg域

  yh.stbType = '' // 单播/组播字段

  yh.aaaDomain = '' // aaa域

  yh.ucenterDomain = '' // 用户中心域

  yh.logDomain = '' // 日志域

  yh.updateServer = '' // 更新服务器

  yh.spCode = '' // 内容提供商

  yh.apk_version_name = '' // app版本名称

  yh.cdn = '' // cdn类型

  yh.playStatus = 1;//播放状态0，播放，1播放器销毁

  yh.mac = "" // 设备mac地址
} catch (error) {
  console.log(error)
}

// 判断类型的方法
function judgeObj(obj) {
  return Object.prototype.toString.call(obj).slice(8, -1)
};

// 提交prompt的方法
function submitPrompt(key, params) {
  var p = 'yanhua://epg/';
  p += key;
  if (params && judgeObj(params) == 'Object') {
    p = p + '?';
    for (var i in params) {
      p += i + '=' + params[i] + '&'
    }
    p = p.slice(0, p.length - 1);
  }
  var a = prompt(p);
};

//广告日志
function adStat(parames) {
	return 
  parames = JSON.stringify(parames);
  console.log(parames);
  submitPrompt('adStat', { jsonParam: parames, return: 'adStatCallBack' });
  
}

// 退出apk
function backApp() {
  try {
    if (getStorage('AccountInfo')) {
      var varsion = JSON.parse(getStorage('AccountInfo')).softVCode;
      var params = {
        type: 88,
        content: {
          type: 1
        }
      }
      adStat(params);
    }
  } catch (e) {
    console.log(e)
  }
  submitPrompt('exit');
}

var unity = { //公共方法区
  jsonp: function (url, successfn, errfn) { // 封装的jq jsonp 请求
		var urlString = url.toString();
		if (urlString.indexOf("http://116.62.93.251/") !== -1) {
			// urlString = urlString.replace('http://116.62.93.251/', 'http://202.100.133.115:10324/epg/')
			  urlString = urlString.replace('http://116.62.93.251/', 'http://112.17.251.186:10088/epg/')
		}
		var jsonUrl = urlString + "&itemSort=1&returnType=jsonp"
		var successfn = successfn || function () {}
		var errfn = errfn || function () {}
		console.log(jsonUrl);
		// set()
		$.ajax({ // 入口数据
			type: "get",
			url: jsonUrl,
			dataType: "jsonp", //指定服务器返回的数据类型
			jsonp: 'jsonpCallback',
			jsonpCallback: 'callback' + new Date().getTime(),
			success: successfn,
			error: errfn
		});
	},
  playRecord: function(value, curPlayTime, itemNo) {
		console.log('调存历史记录方法')
		  // 存播放历史记录
		  var collectType = '3';
		  var relateId = value.detailData.assetId;
		  var relateTitle = value.detailData.assetName;
		  var relateImg = value.detailData.assetImg;
		  var relateUrl = value.detailUrl;
		  var relateLayout = value.detailData.layout;
		  var relateScore = value.detailData.score == undefined ? '' : value.detailData.score;
		  var relateEpisode = itemNo+ 1;
		  var relateTime = curPlayTime;
		  if (value.detailData.score && value.detailData.score.length == 1) {
		    relateScore += '0'
		  }
		  var data = '{"siteId":' + '"' + yh.siteId + '"' + ',"relateEpisode":' + '"' + relateEpisode + '"' + ',"relateTime":' + '"' + relateTime + '"' + ',"userId":' + '"' + yh.userId + '"' + ',"collectType":' + '"' + collectType + '"' + ',"relateId":' + '"' + relateId + '"' + ',"relateTitle":' + '"' + relateTitle + '"' + ',"relateImg":' + '"' + relateImg + '"' + ',"relateUrl":' + '"' + relateUrl + '"' + ',"relateLayout":' + '"' + relateLayout + '"' + ',"relateScore":' + '"' + relateScore + '"' + '}';
		  console.log(data)
	  //{"siteId":"42","relateEpisode":"1","relateTime":"75463","userId":"13522071528","collectType":"3","relateId":"1553320","relateTitle":"蜘蛛侠：英雄远征","relateImg":"http://112.17.251.186:10090/img/201912/10/17/16/3/2019121017163747065e8970f.jpg","relateUrl":"http://112.17.251.186:10088/?s=42|17&p=yhAssetDetail&k=1&v=1&assetId=1553320&c=17","relateLayout":"Detail_Movie","relateScore":"6.6"}
	  //{"siteId":"42","relateEpisode":"4","relateTime":"1289","userId":"13522071528","collectType":"3","relateId":"201610","relateTitle":"罐头视频","relateImg":"http://112.17.251.186:10090/img/201801/21/11/44/1/201801211144131808e3336ed.jpg","relateUrl":"http://112.17.251.186:10088/?s=42|17&p=yhAssetDetail&k=1&v=1&assetId=201610&c=17","relateLayout":"Detail_News","relateScore":"7.8"}
		  var urls = historylUrl + '/collect?version=1';
		  console.log("请求地址:"+urls)
			$.ajax({ // 入口数据
				type: "post",
				url: urls,
				contentType: "application/json; charset=utf-8",
				data: data,
				dataType:'json',
				success: function(res){
					console.log("存储历史成功")
					console.log(JSON.stringify(res))
					$.cookie('payList', JSON.stringify(res), { path: '/' });
				},
				error: function() {
					unity.alertMsg("请求超时，请稍后再试。")
				}
			});
	},
  qeryHistory: function (CallBack) {
		  // 查询播放记录
		console.log("调查询历史记录方法")
		  var url = historylUrl + '/list?version=1&siteId=' + yh.siteId + '&userId=' + yh.userId + '&pindex=0' +'&psize=20' + '&collectType=3'
			$.ajax({ // 入口数据
				type: "get",
				url: url,
				contentType: "application/json; charset=utf-8",
				success: function(res){
					console.log("111"+JSON.stringify(res))
					CallBack(res)
				},
				error: function() {
					unity.alertMsg("请求超时，请稍后再试。")
				}
			})
		   
		//   getCollectionList(url, function (response) {
		//       if (eval('(' + (response) + ')').code !== 200) {} else {
		//         for (var i = 0; i < eval('(' + (response) + ')').data.resultList.length; i++) {
		//           var element = eval('(' + (response) + ')').data.resultList[i];
		//           if (element.relateId == value.detailData.assetId) {
		//             // 有播放记录，并返回集数
		//             indexSingle.HistoryList = element;
		//             indexSingle.isHistory = true;
		//           }
		//         }
		//       }
		//       var vod_id = value.detailData.itemList[0].vodList[0].playUrl;
		//       Cookies.set('onePlayURL',vod_id)
		//       authenticationFun(vod_id); // 用第一集id鉴权
		//   },
		},
  qeryAllHistory: function (pindex,psize,CallBack) {
			  // 查询播放记录
			console.log("调查询历史记录方法")
			  var url = historylUrl + '/list?version=1&siteId=' + yh.siteId + '&userId=' + yh.userId + '&pindex='+ pindex +'&psize=' + psize + '&collectType=3'
				$.ajax({ // 入口数据
					type: "get",
					url: url,
					contentType: "application/json; charset=utf-8",
					success: function(res){
						CallBack(res)
						console.log(JSON.stringify(res))
					},
					error: function() {
						unity.alertMsg("请求超时，请稍后再试。")
					}
				})
  },
  delAllHistory: function (successfn) {
	var header = ptJson.ptHost();
	var url = header+"/uds/cloud/collection/del?version=1"
	var data = {
		siteId: yh.siteId,
		userId: yh.userId,
		collectType:3
	}
	$.ajax({ // 入口数据
		type: "post",
		url: url,
		data: data,
		success: successfn,
		error: function() {
			unity.alertMsg("请求超时，请稍后再试。")
		}
	});
},

	// uploadPayList: function(item) {
	// 	//储存播放记录
	// 	// unity.uploadPayList({assetId:'2204',g_palylong:2000,contentNum:100})
	// 	var payList = $.cookie('payList') || '[]';
	// 	payList = JSON.parse(payList);
	// 	item.g_palylong = item.g_palylong || 0;
	// 	item.contentNum = item.contentNum || 1;
	// 	payList.push(item);
	// 	var tmpObj = {};
	// 	var result = [];
	// 	for(var i = 0; i < payList.length; i ++){
	// 			var key = (typeof payList[i].assetId) + payList[i].assetId;
	// 			if (!tmpObj[key]) {
	// 					tmpObj[key] = true;
	// 					result.push(payList[i]);
	// 			}else{
	// 				for(var j = 0; j < result.length; j ++){
	// 					if(item.assetId==result[j].assetId){
	// 						result.splice(j,1);
	// 						result.push(payList[i]);
	// 					}
	// 				}
	// 			}
	// 	}
	// 	if (result.length>=9) {
	// 		result.shift();
	// 	}
	// 	$.cookie('payList', JSON.stringify(result), { path: '/' });
	// },
	getPayDetail: function(assetId) {
		//根据assetId获取cookie储存播放记录
		unity.qeryHistory()
		var payList = $.cookie('payList') || '[]';
		payList = JSON.parse(payList);
		for(var i = 0;i < payList.length; i ++){
			if(payList[i].assetId==assetId){
				return payList[i]
			}
		}
	},
	collectData: function (pindex, psize, successfn, errfn) {
		var header = ptJson.ptHost();
		console.log("收藏数据");
		var url = header+"/uds/cloud/collection/list?version=1&siteId=" + yh.siteId + "&userId=" + yh.userId + "&collectType=1&pindex=" + pindex + "&psize=" + psize
		var jsonUrl = url + "&returnType=jsonp"
		var successfn = successfn || function () {}
		var errfn = errfn || function () {}
		$.ajax({ // 入口数据
			type: "get",
			url: jsonUrl,
			success: successfn,
			error: errfn
		});
	},
	
	delAllCollect: function (successfn) {
		var header = ptJson.ptHost();
		var url = header+"/uds/cloud/collection/del?version=1"
		var data = {
			siteId: yh.siteId,
			userId: yh.userId,
			collectType:1
		}
		$.ajax({ // 入口数据
			type: "post",
			url: url,
			data: data,
			success: successfn,
			error: function() {
				unity.alertMsg("请求超时，请稍后再试。")
			}
		});
	},
	isCollect: function (relateId, successfn, errfn) {
		console.log("判断收藏");
		var header = ptJson.ptHost();
		var url = header+"/uds/cloud/collection/list?version=1&siteId=" + yh.siteId + "&userId=" + yh.userId + "&relateId=" + relateId + "&collectType=1"
		var jsonUrl = url + "&returnType=jsonp"
		var successfn = successfn || function () {}
		var errfn = errfn || function () {}
		$.ajax({ // 入口数据
			type: "get",
			url: jsonUrl,
			success: successfn,
			error: errfn
		});
	},
	//三方收藏判断
	TisCollect: function(data , successfn){
		console.log("data+"+JSON.stringify(data))
		var url ="http://winnow-bs.yanhuamedia.tv/beijingjingxuansc";//测试     //"http://seen.t.taipan.bja.bcs.ottcn.com/box_api/integration/2.0/cpAddCollection";
		$.ajax({
			type : "post", 
			url : url,
			contentType : "application/json ; charset=utf-8",
			data: JSON.stringify(data),
			dataType: 'json',
			success: successfn,
			error: function() {
				unity.alertMsg("请求超时，请稍后再试。")
			}
		})
	},
	//三方历史记录判断
	Thistory: function(data , successfn){
		console.log("data+"+JSON.stringify(data))
		var url = "http://winnow-bs.yanhuamedia.tv/beijingjingxuanjl";//测试   //"http://seen.t.taipan.bja.bcs.ottcn.com/box_api/integration/2.0/cpAddHistory"   
		$.ajax({
			type : "post", 
			url : url,
			contentType : "application/json ; charset=utf-8",
			data: JSON.stringify(data),
			dataType: 'json',
			success: successfn,
			error: function() {
				unity.alertMsg("请求超时，请稍后再试。")
			}
		})
	},
	addCollect: function (data, successfn) {
		var header = ptJson.ptHost();
		var url = header+"/uds/cloud/collection/collect?version=1"
		$.ajax({ // 入口数据
			type: "post",
			url: url,
			contentType: "application/json; charset=utf-8",
			data: JSON.stringify(data),
			dataType:'json',
			success: successfn,
			error: function() {
				unity.alertMsg("请求超时，请稍后再试。")
			}
		});
	},
	delCollect: function (data, successfn) {
		var header = ptJson.ptHost();
		var url = header+"/uds/cloud/collection/del?version=1"
		$.ajax({ // 入口数据
			type: "post",
			url: url,
			data: data,
			success: successfn,
			error: function(){
				unity.alertMsg("请求超时，请稍后再试。")
			}
		});
	},
	getHtmlDocName: function (str) {
    var item = str.substring(str.lastIndexOf("?"), str.length); 
    var index = str.substring(str.lastIndexOf("/") + 1);
    index = index.substring(0, index.lastIndexOf("."));
    if (index == 'search') {
      index = '100-1'
    } else if (index == 'filter') {
      index = '102-1'
    } else if (index == 'historyHome') {
      var oGetVars = {};
      if (item.length > 1) {
        for (var aItKey, nKeyId = 0, aCouples = item.substr(1).split("&"); nKeyId < aCouples.length; nKeyId++) {
          aItKey = aCouples[nKeyId].split("=");
          oGetVars[decodeURIComponent(aItKey[0])] = aItKey.length > 1 ? decodeURIComponent(aItKey[1]) : "";
        }
      }
      //判断上个页面历史or收藏
      if (oGetVars['itemNo'] == 1) {
        index = '103-1'
      } else {
        index = '101-1'
      }
    } else {
      index = '105-1'
    }
    return index;
  },
  biOrder: function (type){
    try {
      var param = {
        pkg_type: '1',
        pkg_id: 'productIDa3j00000000000000000957',
        // pkg_price: '20',
        action: '1',
        order_msg: type,//成功发送“1”，订购失败0
        parent_page_id: this.getHtmlDocName($.cookie("preURL")),
        parent_page_type: this.getHtmlDocName($.cookie("preURL")),
        preview: '0' 
      }
      bi.order(param)
    } catch (e){
      console.log('埋点异常')
    }
  },
	order: function (returnURL) {
		console.log("前往订购");
		window.location.href = '../pay/pay.html'
		// var orderImg = window.location.href.split("/source")[0] + '/source/public/images/order-bg.jpg';
		// var spID = "spaj0104"
		// var number = this.uuid(18, 10)
		// var transactionID = spID + this.format("yyyyMMddHHmmss") + number
		// var userID= Authentication.CTCGetConfig('UserID')
		// var productID = 'productIDa3j00000000000000000957,productIDa3j00000000000000000958,productIDa3j00000000000000000959,productIDa3j00000000000000000960';
		// var text = 'userID=' + userID + '$userToken$productID=' + productID
		// var key = "pW0s6g8190g5C3cL9428864a"
		// //秘钥key
		// console.log('加密前明文:' + text);
		// var authenticator = encodeURIComponent(this.encryptByDES(text, key))
		// //测试订购
		// // var url = 'http://202.100.133.115:9298/AuthOrderQh?version=1.0&transactionID=' + transactionID + '&spID=' + spID + '&authenticator=' + authenticator + '&picUrl=' + orderImg + '&returnUrl=' + returnURL
		// //  正式订购接口
		// var url = 'http://202.100.133.115:8296/AuthOrderQh?version=1.0&transactionID=' + transactionID + '&spID=' + spID + '&authenticator=' + authenticator + '&picUrl=' + orderImg + '&returnUrl=' + returnURL
		// window.location = url
	},

	encryptByDES: function (message, key) {
		var base64 = CryptoJS.enc.Utf8.parse(key)
		var encrypted = CryptoJS.TripleDES.encrypt(message, base64, {
			mode: CryptoJS.mode.ECB,
			padding: CryptoJS.pad.Pkcs7
		});

		return encrypted.toString();
	},
	decryptByJS: function (message, key) {
		var keys = key.split(":");
		var userCharArr = message.split('');
		var result = "";
		try {
			for (var i = 0; i < userCharArr.length; i++) {
				if ((i + 1) % 2 == 1) {
					console.log(+userCharArr[i].charCodeAt());
					userCharArr[i] = String.fromCharCode(userCharArr[i].charCodeAt() + parseInt(keys[1]));
				} else {
					console.log(userCharArr[i]);
					userCharArr[i] = String.fromCharCode(userCharArr[i].charCodeAt() - parseInt(keys[1]));
				}
			}
			for (var j = 0; j < userCharArr.length; j++)
				result += userCharArr[j];
		} catch (e) {
			// 异常处理.
			console.log('处理用户信息解密异常' + e);
		}
		console.log('result：' + result);
		var m1 = result.substring(0, userCharArr.length - parseInt(keys[0]));
		var m2 = result.substring(userCharArr.length - parseInt(keys[0]), userCharArr.length);

		var s = 0,e = m1.length - 1;
		var us = m1.split('');
		while (s < e) {
			var temp = us[e];
			us[e] = us[s];
			us[s] = temp;
			s++;
			e--;
		}
		m1 = "";
		for (var i = 0; i < us.length; i++) {
			m1 += us[i];
		}
		result = m2 + m1;
		return result
	},
	format: function (format) {
		var that = new Date()
		//eg:format="yyyy-MM-dd hh:mm:ss";

		if (!format) {
			format = "yyyy-MM-dd hh:mm:ss";
		}

		var o = {
			"M+": that.getMonth() + 1, // month
			"d+": that.getDate(), // day
			"H+": that.getHours(), // hour
			"h+": that.getHours(), // hour
			"m+": that.getMinutes(), // minute
			"s+": that.getSeconds(), // second
			"q+": Math.floor((that.getMonth() + 3) / 3), // quarter
			"S": that.getMilliseconds()
		};

		if (/(y+)/.test(format)) {
			format = format.replace(RegExp.$1, (that.getFullYear() + "")
				.substr(4 - RegExp.$1.length));
		}

		for (var k in o) {
			if (new RegExp("(" + k + ")").test(format)) {
				format = format.replace(RegExp.$1, RegExp.$1.length == 1 ?
					o[k] :
					("00" + o[k]).substr(("" + o[k]).length));
			}
		}

		return format;
	},
	fTime: function (T) { // 时间
		if (!T || T * 1 == 0 || T < 0) {
			return "00:00:00";
		}
		var H = Math.floor(T / 3600);
		var M = Math.floor((T % 3600) / 60);
		var S = Math.floor((T % 3600) % 60);
		H = H < 10 ? "0" + H : H;
		M = M < 10 ? "0" + M : M;
		S = S < 10 ? "0" + S : S;
		return [H, M, S].join(":");
	},

	pushcollect: function (url) { //给js加时间戳
		var jsurl = url + "?data=" + new Date().valueOf();
		$('<script type="text/javascript" src="' + jsurl + '"></script>').appendTo('body');
	},

	getVars: function (id) { //获取url内的拼接的参数
		var oGetVars = {};
		if (window.location.search.length > 1) { //从url里面拿到所需键值
			for (var aItKey, nKeyId = 0, aCouples = window.location.search.substr(1).split("&"); nKeyId < aCouples.length; nKeyId++) {
				aItKey = aCouples[nKeyId].split("=");
				oGetVars[decodeURIComponent(aItKey[0])] = aItKey.length > 1 ? decodeURIComponent(aItKey[1]) : "";
			}
		}
		return oGetVars[id]
	},
	cookieVars: function (id, cookieName) {
		var GetVars = {};
		var cookieUrl = $.cookie(cookieName).toString()
		if (cookieUrl) { //从url里面拿到所需键值
			for (var ItKey, KeyId = 0, Couples = cookieUrl.split("&"); KeyId < Couples.length; KeyId++) {
				ItKey = Couples[KeyId].split("=");
				GetVars[decodeURIComponent(ItKey[0])] = ItKey.length > 1 ? decodeURIComponent(ItKey[1]) : "";
			}
		}
		return GetVars[id]
	},
	alertMsg: function (msg) {
		var html = '<div style="position:absolute;top:400px;width:1280px;height:160px;text-align:center;z-index:999">' +
			'<div style=" display:inline-block; height:60px; line-height:60px;background:rgba(1,1,1,0.6); color:#fff; padding:0 20px; min-width:120px; text-align:center; font-size:22px; border-radius:5px;">' +
			msg +
			'</div></div>'
		var msgobj = $(html).appendTo("body");
		setTimeout(function () {
			$(msgobj).remove();
		}, 5000);
	},

	
	uuid: function (len, radix) {
		var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
		var uuid = [],
			i;
		radix = radix || chars.length;

		if (len) {
			// Compact form
			for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
		} else {
			var r;

			for (i = 0; i < 36; i++) {
				if (!uuid[i]) {
					r = 0 | Math.random() * 16;
					uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
				}
			}
		}

		return uuid.join('');
	}
};

(function ($) { //懒加载
	$.extend($, {
		imgLazyLoad: function () {
			var timer,
				len = $('img.lazyload').length;

			function getPos(node) {
				var scrollx = document.documentElement.scrollLeft || document.body.scrollLeft,
					scrollt = document.documentElement.scrollTop || document.body.scrollTop;
				var pos = node.getBoundingClientRect();
				return {
					top: pos.top + scrollt,
					right: pos.right + scrollx,
					bottom: pos.bottom + scrollt,
					left: pos.left + scrollx
				}
			}

			function loading() {
				timer && clearTimeout(timer);
				timer = setTimeout(function () {
					var scrollTop = document.documentElement.scrollTop || document.body.scrollTop,
						imgs = $('img.lazyload');
					screenHeight = document.documentElement.clientHeight;
					for (var i = 0; i < imgs.length; i++) {
						var pos = getPos(imgs[i]),
							posT = pos.top,
							posB = pos.bottom,
							screenTop = screenHeight + scrollTop;
						if ((posT > scrollTop && posT < screenTop) || (posB > scrollTop && posB < screenTop)) {
							imgs[i].src = imgs[i].getAttribute('data-img');
							$(imgs[i]).removeClass('lazyload');
						} else {
							new Image().src = imgs[i].getAttribute('data-img');
						}
					}
				}, 100);
			}
			if (!len) return;
			loading();
			$(window).on('scroll resize', function () {
				if (!$('img.lazyload').length) {
					return;
				} else {
					loading();
				}
			})
		}
	})
})($ || Zepto || jQuery)


//获取首页传来的"backUrl"函数
function getParam(_key, _url) {
  _url = _url || window.location.href;
  if (new RegExp('.*\\b' + _key + '\\b(\\s*=([^&]+)).*', 'gi').test(_url)) {
    return RegExp.$2;
  } else {
    return '';
  }
}
//toast
function toast(msg) {
	alert(msg)
  var div = document.createElement('div');
  var div1 = document.createElement('div');
  var body = document.body;
  if (getId('toast')) {
    body.removeChild(getId('toast'));
  }
  div.id = "toast";
  div.style.cssText = "position: absolute; top: 50%; left: 50%;  -webkit-transform: translate(-50%,-50%);-ms-transform: translate(-50%,-50%);transform:translate(-50%,-50%); text-align:center;z-index:999;word-break: break-all; word-wrap: break-word;";
  div1.style.cssText = "display:inline-block;background:rgba(1,1,1,0.6); color:#fff; padding:20px; min-width:120px; text-align:center; font-size:22px; border-radius:5px;height100%;width: 100%;word-wrap: break-word;";
  div1.textContent = msg;
  div.appendChild(div1);
  body.appendChild(div);
  alert(getId('toast'))
  setTimeout(function () {
    body.removeChild(getId('toast'));
  }, 5000);
}

function toastns(msg) {
	var div = document.createElement('div');
	var div1 = document.createElement('div');
	var body = document.body;
	if (getId('toast')) {
	  body.removeChild(getId('toast'));
	}
	div.id = "toast";
	div.style.cssText = "position: absolute; top: 60%; left: 63%;  -webkit-transform: translate(-50%,-50%);-ms-transform: translate(-50%,-50%);transform:translate(-50%,-50%); text-align:center;z-index:999;word-break: break-all; word-wrap: break-word;";
	div1.style.cssText = "display:inline-block;background:rgba(1,1,1,0.6); color:#fff; padding:20px; min-width:120px; text-align:center; font-size:22px; border-radius:5px;height100%;width: 100%;word-wrap: break-word;";
	div1.textContent = msg;
	div.appendChild(div1);
	body.appendChild(div);
  }
  
function setStorage(key, obj) {
  window.localStorage.setItem(key, obj)
}
function getStorage(key) {
  return window.localStorage.getItem(key) || ''
}
function delStorage(key) {
  window.localStorage.removeItem(key) || ''
}

// 登陆 测试环境先登陆，再鉴权订购
function login(callback, contentID) {
  try {
    var strXml = '<?xml version="1.0" encoding="UTF-8"?>' +
      '<message module="SCSP" version="1.1">' +
      '<header action="REQUEST" command="LOGINAUTH" />' +
      '<body>' +
      '<loginAuth loginType="5" account="0107978571726576928" password="576928" stbId="005103FF0001004019153050FD59C8D9" />' +
      ' </body>' +
      '</message>'
    console.log('登陆');
    console.log(strXml);
    ajax({
      url: poweruUrl,
      type: "POST",
      data: strXml,
      contentType: "text/xml",
      success: function (res) {
        console.log(res)
        //   // + '" subContentId="' + subContentId+ '"  path="' + path+ '"  preview="' + preview + '" channelId="' + channelId + '" productId="' + productId + '" token="' + token
        var parser = new DOMParser();
        //读取返回字符串
        var _xml = parser.parseFromString(res, "text/xml");
        //获取节点内容
        var domXml = _xml.getElementsByTagName("loginAuth")[0];
        // yh.userId = domXml.getAttribute('userId');
        // yh.stbId = domXml.getAttribute('messagePassword');
        // yh.token = domXml.getAttribute('token');

        yh.userId = domXml.getAttribute('userId');
        yh.stbId = domXml.getAttribute('messagePassword');
        yh.token = domXml.getAttribute('token');
        userPower(callback, contentID);
      },
      fail: function (res) {
        callback && callback();
        console.log('登陆err')
      }
    })
  } catch (e) {
    console.log(e)
  }
}


//鉴权
function userPower(callback, contentId) {
  //接口文档有，但是未使用参数
  // var subContentId = "";
  // var path = "";
  // var productId = "";
  // var token = "";

  try {
    playConfig.isOrder = '0';
    Cookies.set('isOrder', playConfig.isOrder, { path: '/' })
    // var userId = yh.userId;
    // var terminalId = yh.stbId;
    // var token = yh.token;
    var userId = yh.userId;
    var terminalId = yh.stbId;
    var token = yh.token;
    var copyRightId = '698057';
    var contentId = contentId;

    // var userId = '0102327570788553510';
    // var terminalId = '005103FF0001004019153050FD59C8D9';
    // var token = '9977759376bb06cc5699fd30cde867c122vv';
    // var contentId = '1571733697433';

    var channelId = "00001";
    var systemId = "1";
    var consumeLocal = "22";
    var consumeScene = "01";
    var consumeBehaviour = "02";
    var preview = "0";
    var productId = "";
    var subContentId = ''
    // var copyRightContentId = 4
    var strXml = '<?xml version="1.0" encoding="UTF-8"?>' +
      '<message module="SCSP" version="1.1">' +
      '<header action="REQUEST" command="AUTHORIZE"/>' +
      '<body>' +
      '<authorize userId="' + userId + '" terminalId="' + terminalId + '" contentId="' + contentId +
      '" subContentId="" systemId="' + systemId + '" consumeLocal="' + consumeLocal + '" consumeScene="' + consumeScene +
      '" consumeBehaviour="' + consumeBehaviour + '"  path=""  preview="' + preview + '" channelId="' + channelId +
      '" productId="' + productId + '" copyRightId="' + copyRightId + '" token="' + token + '"/>' +
      '</body>' +
      '</message>'
    // var strXml = '<?xml version="1.0" encoding="UTF-8"?><message module="SCSP" version="1.1"><header action="REQUEST" command="AUTHORIZE"/><body><authorize userId="0107978571726576928" terminalId="005103FF0001004019153050FD59C8D9" contentId="1571733697433" subContentId="" systemId="1" consumeLocal="22" consumeScene="01" consumeBehaviour="02"  path=""  preview="0" channelId="" productId="" token="e4b832af0da493011f7189e3ba7a585f22pb"/></body></message>'
    console.log('鉴权');
    console.log(strXml);
    power(strXml, function (response) {
      if (!response) {
        callback && callback();
        return
      }
      console.log(response)
      //   // + '" subContentId="' + subContentId+ '"  path="' + path+ '"  preview="' + preview + '" channelId="' + channelId + '" productId="' + productId + '" token="' + token
      var parser = new DOMParser();
      //读取返回字符串
      var _xml = parser.parseFromString(response, "text/xml");
      //获取节点内容
      var domXml = _xml.getElementsByTagName("authorize")[0]
      //0：鉴权成功1：鉴权失败需要订购  10: 用户未登录 20：账户的计费标识需要验证 30：您的帐户不能消费 31：对应牌照方没可计费的产品 50:试看鉴权通过

      // var accountIdentify = domXml.getAttribute('accountIdentify');
      // var productCode = domXml.getAttribute('productCode');

      var result = domXml.getAttribute('result')
      var resultDesc = domXml.getAttribute('resultDesc');
      var productCode = domXml.getAttribute('productCode');
      // playConfig.powerParam = window.btoa()
      Cookies.set('resultDesc', productCode, { path: '/' })
      if (result == 0 || result == 50) {
        //鉴权成功
        playConfig.isOrder = '1';
        var isOrder = '1'
        Cookies.set('isOrder', isOrder, { path: '/' })
      }

      //点击订购按钮才会触发
      if (Cookies.get("clickOrder") == '1') {
        if (playConfig.isOrder == '1') {
          // 订购成功上报
          try {
            var param = {
              pkg_type: '2',
              pkg_id: encodeURI(resultDesc),
              operator_id: '',
              order_msg: '1',
              parent_page_id: Cookies.get("orderPkg"),
              parent_page_type: '0301',
              point: '1'
            }
            bi.order(param)
          } catch (error) {
            console.log('埋点错误', error)
          }
        } else {
          // 订购失败上报
          try {
            var resultDesc = '';
            Cookies.set('resultDesc', productCode, { path: '/' })
            var param = {
              pkg_type: '2',
              pkg_id: '',
              operator_id: '',
              order_msg: encodeURIComponent('订购失败'),
              parent_page_id: Cookies.get("orderPkg"),
              parent_page_type: '0301',
              point: '1'
            }
            bi.order(param)
          } catch (error) {
            console.log('埋点错误', error)
          }
        }
        Cookies.del('clickOrder')
      }
      callback && callback();
    }, function (error) {
      callback && callback();
      var productCode = '';
      Cookies.set('resultDesc', productCode, { path: '/' })
      console.log("error")
      if (Cookies.get("clickOrder") == '1') {
        // 订购失败上报
        try {
          var param = {
            pkg_type: '2',
            pkg_id: '',
            operator_id: '',
            order_msg: encodeURIComponent('订购失败'),
            parent_page_id: Cookies.get("orderPkg"),
            parent_page_type: '0301',
            point: '1'
          }
          bi.order(param)
        } catch (error) {
          console.log('埋点错误', error)
        }
        Cookies.del('clickOrder')
      }
    })
  } catch (e) {
    callback && callback();
    console.log(e)
  }
}

// 获取原生dom
function getId(arg) {
  return document.getElementById(arg);
}
// 获取class对应的元素dom
function getClass(arg) {
  // console.log(arg);
  return document.querySelector(arg);
}
//播放分秒计算
function secondToDate(result) {
	var h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600);
	var m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60));
	var s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60));
	var str = '';
	if (h != '00') {
	  m = Number(m) + h * 60
	}
	str += m + ":" + s;
	return str
  }
  //函数防抖
  var timeout = null;
  function debounce(func, wait) {
	// return function () {
	var context = this;
	var args = arguments;
	if (timeout) clearTimeout(timeout);
	timeout = setTimeout(function () {
	  func.apply(context, args)
	}, wait);
	// }
  }

