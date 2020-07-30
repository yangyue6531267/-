//服务器路径配置  以及常用变量。。
var SERVER_HOST = "http://" + location.host;
var IMAGES_ROOT = SERVER_HOST + "/portal/images/";
var SERVER_PATH = location.pathname.substring(0, location.pathname.lastIndexOf("/"));

var yh = {}
yh.siteId = "123456";
yh.userId = '123456';


//  接口服务
var baseUrl = "http://gsyd-ds.yanhuamedia.tv/?s=33|19&"; //主页入口
var historylUrl = "http://bms-i-test.yanhuamedia.tv/uds/cloud/collection"; //收藏  历史纪录接口
var conditionUrl = 'http://gsyd-ds.yanhuamedia.tv/?s=33|19&p=yhCategoryMulti&k=1&v=1&rootNode=FJXDF&catCode=' //左侧筛选类型



/**
 * 获取推荐数据
 * @param {*} url 
 * @param {*} successfn 
 * @param {*} errorfn 
 */
function getYhSpecialList_nc(url, successfn, errorfn, sc) {
	// console.log(sc);
	if (sc) {
		$.ajax({
			url: url,
			success: successfn,
			fail: errorfn
		})
	} else {
		$.ajax({
			type: 'GET',
			url: url + '&returnType=jsonp',
			dataType: "jsonp",
			jsonpCallback: 'jsonpCallback',
			success: successfn,
			fail: errorfn
		})
	}

	// ajax({ url: url, success: successfn, fail: errorfn })
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
	$.ajax({
		url: url,
		type: "POST",
		data: JSON.stringify(data),
		contentType: "application/json",
		success: successfn,
		fail: errorfn
	})
}

function getJsonCallback(url, successfn, errorfn) {
	// console.log(sc);
	$.ajax({
		type: 'GET',
		url: url + '&returnType=jsonp',
		dataType: "jsonp",
		jsonpCallback: 'jsonpCallback',
		success: successfn,
		fail: errorfn
	})

	// ajax({ url: url, success: successfn, fail: errorfn })
}

//查询收藏/播放记录
/**
 * @param {*} url
 * @param {*} successfn 
 * @param {*} errorfn
 */
function getCollectionList(url, successfn, errorfn) {
	$.ajax({
		url: url,
		success: successfn,
		fail: errorfn
	})
}
// 获取id
function getId(arg) {
	return document.getElementById(arg);
}

//搜索查询
/**
 * @param {*} url
 * @param {*} successfn 
 * @param {*} errorfn
 */
function getSearchList(url, successfn, errorfn) {
	ajax({
		url: url,
		success: successfn,
		fail: errorfn
	})
}

//搜索页推荐
/**
 * @param {*} url
 * @param {*} successfn 
 * @param {*} errorfn
 */
function getRecommend(url, successfn, errorfn) {
	ajax({
		url: url,
		success: successfn,
		fail: errorfn
	})
}




//筛选内容获取
/**
 * @param {*} url
 * @param {*} successfn 
 * @param {*} errorfn
 */
function getFilterResult(url, successfn, errorfn) {
	url = baseUrl + url
	$.ajax({
		url: url,
		success: successfn,
		fail: errorfn
	})
}

//xml鉴权
/**
 * @param {*} url
 * @param {*} successfn 
 * @param {*} errorfn
 */


var Dev = {};
Dev.getConfig = function (key) {
	if (key == "spCode") return "91100001";
	if (key == "ProductID") return "00000000000010010000000000000078";
	if (typeof Authentication === "undefined") {
		return "";
	} else {
		return Authentication.CTCGetConfig(key);
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
	33: "pageup", //上一页
	34: "pagedown", //下一页
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
	0x0300: "iptv"
};
//按键分发事件
var onKeyPress;
//按键prev处理函数
var grepEvent = function (e) {
	if (e.keyCode != 261) {
		e.preventDefault();
	}
	if (e.keyCode == 272 || e.keyCode == 181) {
		window.Cookies.remove('backUlrRot');
	}
	if (grepEvent.isPress) return;
	grepEvent.isPress = true;
	setTimeout(function () {
		grepEvent.isPress = false;
	}, 180);
	var keyCode = e.keyCode || e.which;
	return onKeyPress(KEYMAP[keyCode]);
};
var unity = {
	getParam: function (str) {
		var params = window.location.search.substr(1).match(new RegExp("(^|&)" + str + "=([^&]*)(&|$)"));
		return params ? unescape(params[2]) : null;
	},
	toastMsg: function (msg) {
		var html = '<div style="position:absolute;top:400px;width:1280px;height:60px;text-align:center;z-index:999">' +
			'<div style=" display:inline-block; height:60px; line-height:60px;background:rgba(1,1,1,0.6); color:#fff; padding:0 20px; min-width:120px; text-align:center; font-size:22px; border-radius:5px;">' +
			msg +
			'</div></div>'
		var msgobj = $(html).appendTo(".tvbox");
		setTimeout(function () {
			$(msgobj).remove();
		}, 2000);
	},
	fTime: function (T) {
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
	}
};

function getProducts() {
	if (!$.cookie("UserProducts") || $.cookie("UserProducts") == "null") {
		return "";
	} else {
		return $.cookie("UserProducts");
	}
};
var commhtml = {
	programHtml: function (programObj) {
		var html = "";
		if (programObj.orderFlag * 1 == 0) {
			html += '<span class="prompt"></span>';
		}
		if (programObj.image.length > 0) {
			html += '<p class="mhb"><img src="' +
				IMAGES_ROOT + programObj.image[0].imageUrl + '"></p><p class="mnm" name="' +
				programObj.programName + '">' + programObj.programName + '</p>';
		} else {
			html += '<p class="mhb"><img src="images/defult.jpg"></p><p class="mnm" name=' +
				programObj.programName + '>' + programObj.programName + '</p>';
		}
		return html;
	}
};
//鉴权函数
//var epgAuth = function( cb ){
//	var userToken = typeof Authentication == "undefined"?"":Authentication.CTCGetConfig("UserToken"),spCode= "91100001";
//	if( userToken == "" ){
//		$.cookie("UserProducts","",{expires:1});
//		setTimeout(function(){ cb&&cb("") },300);
//	}else{
//		$.get("/EpgAuthForSp",{ userToken:userToken,spCode:spCode,_:new Date().getTime() },function( res ){
//			var authObj  = JSON.parse( res ); 
//			if( parseInt( authObj.result ) == 0 ){
//				$.cookie("UserProducts",authObj.products,{expires:1});
//			}
//			setTimeout(function(){ cb&&cb( authObj.products );},300);
//		}); 
//	}
//}