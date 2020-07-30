var ptJson = {
	ptStyle: 'RELEASE',
	ptHost: function () {
		console.log("当前模式 " + this.ptStyle);
		if (this.ptStyle == 'RELEASE') {
			return '/'
		} else if (this.ptStyle == "DEV") {
			return 'http://localhost:8081/api/'
		}
	},
};
var jiaoD = {
	jiaoDian: function (result) {
		var arr = jiaoD.GetRequest();
		if (arr.index == 'first') {
			tab0.getInfoFunction(0, result);
		} else {
			var backUrlRot = window.Cookies.get('backUlrRot');
			if (backUrlRot != '' && backUrlRot != undefined) {
				if (backUrlRot == '收藏') {
					Category.op = -1;
					Category.inNum = 2;
					$('#p' + Category.inNum).addClass('change');
					tab0.getInfoFunction(0, result);
				}
				if (backUrlRot == '历史') {
					Category.op = -1;
					Category.inNum = 1;
					$('#p' + Category.inNum).addClass('change');
					tab0.getInfoFunction(0, result);
				}
				if (backUrlRot == '搜索') {
					Category.op = -1;
					Category.inNum = 0;
					$('#p' + Category.inNum).addClass('change');
					tab0.getInfoFunction(0, result);
				}
				if (backUrlRot == '类型') {
					var num = window.Cookies.get('LXNum');
					var itemNo = num - 0;
					areaObj = list;
					Category.num = itemNo;
					$('#next_' + Category.num).addClass('yh-control-change');
					$('.common_top').show();
					$('.liveRecommendTop').hide();
					$("body").css("background-image", "url(index/images/category.png)")
					list.getInfoFunction(Category.num, result);
					setTimeout(function () {
						list.itemNo = -1;
						list.addCss();
						$('.scroll-lei').hide();
						$('#marqueeS').hide();
						window.Cookies.remove('LXNum');
					}, 300)
				}
				if (backUrlRot == '详情') {
					var num = window.Cookies.get('XQNumS');
					var nums = (window.Cookies.get('XQNum') - 0);
					var downs = (window.Cookies.get('XQNumx') - 0);
					if (downs) {
						Category.num = 0;
						areaObj = tab1;
						tab1.getInfoFunction(downs - 1, Category.json);
						tab1.itemNo = nums;
						tab1.scrollBoxZ(0);
						tab1.scrollBox(downs);
						tab1.op = downs - 1;
						setTimeout(function () {
							$('#next_' + Category.num).addClass('yh-control-change');
							$('.liveHot').show();
							$('.liveRecommendTop').hide();
							$("body").css("background-image", "url(index/images/category.png)");
							$('.XlList' + 0).removeClass('hover');
							tab1.addCss();
							window.Cookies.remove('XQNum');
							window.Cookies.remove('XQNumx');
						}, 300)
					} else {
						if (num == 0) {
							tab0.getInfoFunction(0, result);
							Category.num = 0;
							areaObj = tab0;
							$('#next_' + Category.num).addClass('yh-control-change');
							tab0.itemNo = nums;
							tab0.op = true;
							setTimeout(function () {
								tab0.addCss();
								window.Cookies.remove('XQNum');
								window.Cookies.remove('XQNumS');
							}, 300)
						} else {
							$('.scroll-lei').hide();
							list.getInfoFunction(num, result);
							$('#marqueeS').hide();
							$('.common_top').show();
							$('.liveRecommendTop').hide();
							$("body").css("background-image", "url(index/images/category.png)")
							Category.num = num;
							areaObj = list;
							$('#next_' + Category.num).addClass('yh-control-change');
							list.itemNo = nums;
							setTimeout(function () {
								list.addCss();
								$('.scroll-lei').hide();
								window.Cookies.remove('XQNum');
								window.Cookies.remove('XQNumS');
							}, 300)
						}
					}
				}
				if (backUrlRot == '专题') {
					tab0.getInfoFunction(0, result);
					setTimeout(function () {
						areaObj = tab0;
						Category.num = 0;
						$('#next_' + Category.num).addClass('yh-control-change');
						var num = (window.Cookies.get('ZTNum') * 1);
						tab0.op = true;
						tab0.itemNo = num;
						tab0.addCss();
						window.Cookies.remove('ZTNum');
					}, 500)
				}
				$('.yh-scroll li').eq(0).removeClass('hover');
				window.Cookies.remove('backUlrRot');
				$(".yy-confirm").hide();
			} else {
				tab0.getInfoFunction(0, result);
			}
		}
	},
	GetRequest: function () {
		var url = location.search; //获取url中"?"符后的字串  
		var theRequest = new Object();
		if (url.indexOf("?") != -1) {
			var str = url.substr(1);
			strs = str.split("&");
			for (var i = 0; i < strs.length; i++) {
				theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
			}
		}
		return theRequest;
	}
};
$(function () {
	$.ajax({
		type: "get",
		url: "http://zero-ds.yanhuamedia.tv/?s=59|33&p=yhNavigationBar&k=10&v=1&catId=208590&c=33&returnType=jsonp",
		dataType: "jsonp",
		jsonpCallback: 'jsonpCallback',
		success: function (res) {
			var result = res;
			medPlayer.initPlayer();
			console.log(result);
			Category.inint(result);
			jiaoD.jiaoDian(result);
		},
		error: function () {
			console.log("首页数据fail");
		}
	});
});
var medPlayer = {
	itemNo: 0,
	medPlayerurl: null,
	play: function (obj) {
		getJsonCallback(obj,
			function (res) {
				console.log(res);
				medPlayer.medPlayerurl = res.data;
				try {
					player.setCallback(player.videoStateChange);
					player.setDisplayerLocation({
						x: 32,
						y: 120,
						w: 405,
						h: 320
					});
					player.toggleShow('showPlayer');
					// 正式环境播放
					var playUrl = 'http://ivi.bupt.edu.cn/hls/cctv6hd.m3u8'
					// var playUrl = medPlayer.medPlayerurl.itemList[medPlayer.itemNo].vodList[0].playUrl;
					console.log(playUrl);
					if (obj.time) {
						var time = obj.time;
					} else {
						var time = 0;
					}
					var OpJson = {
						playUrl: playUrl,
						historyTime: time
					}
					player.play(OpJson)
				} catch (error) {
					console.log(error);
					console.log('播放器初始化失败');
				}
			},
			function (error) {
				console.log("请求播放资产失败")
				console.log(error);
				// 请求播放资产失败
			})
	},
	initPlayer: function () {
		videoOptions.onStart = function (res) {
			console.log('准备播放')
		}
		videoOptions.onPlay = function (res) {
			console.log('开始播放')
		}
		videoOptions.onProgress = function (res) {
			console.log('每秒调用');
			// topContent.curPlayTime = res.curPlayTime;
			// playmode.refreshProgressView(res.curPlayTime,res.allTime);    
		}
		videoOptions.onPause = function (res) {
			console.log('暂停')
			// playmode.stopPlay = true;
		}
		videoOptions.onResume = function (res) {
			console.log('续播')
		}
		videoOptions.onStop = function (res) {
			console.log('手动停止')
		}
		videoOptions.onCompleted = function (res) {
			medPlayer.playNext();
		}
		videoOptions.onError = function (res) {
			console.log('报错')
		}
	},
	hidePlayer: function () {
		// 停止
		try {
			player.stop();
		} catch (err) {
			console.log(err);
		}
	},
	playNext: function () {
		player.stop();
		console.log("切集前" + medPlayer.itemNo)
		if (medPlayer.itemNo >= value.list.length - 1) {
			medPlayer.itemNo = 0;
		} else {
			medPlayer.itemNo += 1;
			try {
				player.setDisplayerLocation({
					x: 32,
					y: 120,
					w: 405,
					h: 320
				});
				player.toggleShow('showPlayer');
				console.log("切集后" + medPlayer.itemNo)
				// var playUrl = medPlayer.medPlayerurl.itemList[medPlayer.itemNo].vodList[0].playUrl
				// 正式环境播放
				var playUrl = 'http://ivi.bupt.edu.cn/hls/cctv6hd.m3u8';
				var OpJson = {
					playUrl: playUrl,
					historyTime: 0
				}
				player.play(OpJson)
			} catch (error) {
				console.log(error);
				console.log('播放器初始化失败');
			}
			console.log("切集后" + medPlayer.itemNo)
		}
	},
}
var Category = {
	json: '',
	num: 0,
	urls: '',
	op: 0,
	inNum: 0,
	inint: function (result) {
		this.json = result;
		console.log(this.json.data.catList[0].catName);
		var html = '';
		for (var i = 0; i < this.json.data.catList.length; i++) {
			html += '<li>' + '<span id=nav_' + i + '></span>' + '&nbsp' +
				this.json.data.catList[i].catName + '<div id=next_' + i + '><div></div></div></li>'
		}
		$('.yh-scroll').html(html);
		$('.yh-scroll li').eq(0).addClass('hover');
	},
	enter: function () {
		if (this.op == -1) {
			medPlayer.hidePlayer();
			if (this.inNum == 0) {
				window.Cookies.set('backUlrRot', '搜索');
				window.location = "./search/search.html";
			} else if (this.inNum == 1) {
				window.Cookies.set('backUlrRot', '历史');
				window.location = "./historyHome/historyHome.html?fall=6";
			} else if (this.inNum == 2) {
				window.location = "./historyHome/historyHome.html?fall=5";
				window.Cookies.set('backUlrRot', '收藏');
			}
		}
	},
	up: function () {
		this.op = -1;
		$('#p' + this.inNum).addClass('change');
		$('.yh-scroll li').eq(this.num).removeClass('hover');
		$('#next_' + this.num).addClass('yh-control-change');
	},
	left: function () {
		if (this.op == -1) {
			$('#p' + this.inNum).removeClass('change');
			this.inNum--;
			if (this.inNum < 0) {
				this.inNum = 0;
			}
			$('#p' + this.inNum).addClass('change');
		} else {
			$('.yh-scroll li').eq(this.num).removeClass('hover');
			if (this.num < 1) {
				$('.yh-scroll li').eq(this.num).addClass('hover');
			}
			if (this.num < 1) return;
			this.num--;
			if (this.num != 0) {
				list.getInfoFunction(this.num, this.json);
			} else {
				$('.scroll-lei').show();
				tab0.getInfoFunction(0, this.json);
				$('#marqueeS').show();
				$('.common_top').hide();
				$("body").css("background-image", "url(index/images/categoryplay.png)")
				$('.liveRecommendTop').show();
			}
			$('.yh-scroll li').eq(this.num).addClass('hover');
		}
	},
	right: function () {
		if (this.op == -1) {
			$('#p' + this.inNum).removeClass('change');
			this.inNum++;
			if (this.inNum > 2) {
				this.inNum = 2;
			}
			$('#p' + this.inNum).addClass('change');
		} else {
			$('.yh-scroll li').eq(this.num).removeClass('hover');
			if (this.num > 5) {
				$('.yh-scroll li').eq(this.num).addClass('hover');
			}
			if (this.num > 5) return;
			this.num++;
			if (this.num == 1) {
				$('.common_top').show();
				$('.liveRecommendTop').hide();
				$("body").css("background-image", "url(index/images/category.png)")
				$('#marqueeS').hide();
			}
			if (this.num > 0) {
				$('.scroll-lei').hide();
				// 隐藏播放
				medPlayer.hidePlayer();
				list.getInfoFunction(this.num, this.json);
			}
			$('.yh-scroll li').eq(this.num).addClass('hover');
		}
	},
	down: function () {
		if (this.op == -1) {
			this.op = 0;
			$('#p' + this.inNum).removeClass('change');
			$('.yh-scroll li').eq(this.num).addClass('hover');
			$('#next_' + this.num).removeClass('yh-control-change');
		} else {
			$('.yh-scroll li').eq(this.num).removeClass('hover');
			$('#next_' + this.num).addClass('yh-control-change');
			if (this.num == 0) {
				$('.liveRecommendTop .lt_2').addClass('hover');
				areaObj = tab0;
			} else {
				$('.common_right_img').addClass('item_hover');
				areaObj = list;
			}
		}
	},
	back: function () {
		areaObj = firm;
		$(".yy-confirm").show();
	},
	home: function () {
		medPlayer.hidePlayer();
		var innerURL = window.Cookies.get('lastURL');
		window.location.href = innerURL;
	},
};
var list = {
	urls: '',
	listJson: null,
	itemNo: -1,
	ops: 0,
	getInfoFunction: function (index, result) {
		//获取首页栏目数据
		console.log(index)
		console.log(result.data.catList);
		list.ops = index;
		getJsonCallback(result.data.catList[index].jsonUrl, function (res) {
			console.log(res)
			list.listJson = res;
			list.ops = index;
			list.Addlist(list.listJson.data.specialList);
			$.imgLazyLoad(); //懒加载
		}, function (error) {
			console.log(error);
		})
	},
	back: function () {
		areaObj = Category;
		list.removeCss();
		this.itemNo = -1;
		$('.yh-scroll li').eq(Category.num).addClass('hover');
		$('#next_' + Category.num).removeClass('yh-control-change');
		$('.common_top').show();
		$('.liveRecommendTop').hide();
		$("body").css("background-image", "url(index/images/category.png)")
	},
	Addlist: function (pro) {
		//			  	添加详情页入口
		console.log(pro)
		$('.common_right_news ul').empty();
		var sy = "list"
		for (var i = 1; i < pro[0].elementList.length; i++) {
			// if (!pro[i].services) {
			$('.common_right_news ul').append('<li class=' + sy + (i - 1) + '><img class="lazyload" src="./index/images/img_loading_160x230.png" data-img="' + pro[0].elementList[i].elementImg + '"/></li>')
			// } else {
			// 	$('.common_right_news ul').append('<li class=' + sy + i + '><a class="jiaobiao"></a><img class="lazyload" src="./index/images/img_loading_160x230.png" data-img="' + header + PS[list.ops * 1 + 6].context[i + 1].timeInterval.time0.image + '"/></li>')
			// }
		}
	},
	up: function () {
		list.removeCss();
		if (this.itemNo == -1 || this.itemNo == 0 || this.itemNo == 3 || this.itemNo == 4) {
			areaObj = Category;
			$('.yh-scroll li').eq(Category.num).addClass('hover');
			$('#next_' + Category.num).removeClass('yh-control-change');
			this.itemNo = -1;
		} else if (this.itemNo == 5) {
			this.itemNo--;
			list.addCss();
		} else {
			this.itemNo -= 2;
			list.addCss();
		}
	},
	down: function () {
		list.removeCss();
		if (this.itemNo == 0 || this.itemNo == -1) {
			this.itemNo += 2;
		} else if (this.itemNo == 4) {
			this.itemNo++;
		}
		list.addCss()
	},
	left: function () {
		if (this.itemNo < 0 || this.itemNo == 1) return;
		list.removeCss();
		if (this.itemNo == 3) {
			this.itemNo -= 3;
		} else if (this.itemNo == 5) {
			this.itemNo -= 2
		} else {
			this.itemNo--;
		}
		list.addCss();

	},
	right: function () {
		if (this.itemNo > 3) return;
		list.removeCss();
		if (this.itemNo == 0) {
			this.itemNo += 3;
		} else {
			this.itemNo++;
		}
		list.addCss();
	},
	home: function () {

		var innerURL = window.Cookies.get('lastURL');
		window.location.href = innerURL;
	},
	removeCss: function () {
		if (this.itemNo == -1) {
			$('.common_right_img').removeClass('item_hover');
		} else {
			$('.list' + (this.itemNo)).removeClass('item_hover');
		}
	},
	addCss: function () {
		if (this.itemNo == -1) {
			$('.common_right_img').addClass('item_hover');
		} else {
			$('.list' + (this.itemNo)).addClass('item_hover');
		}
	},
	enter: function () {

		if (this.itemNo == -1) {
			window.location = "./allType/allType.html?folderId=" + list.listJson.data.specialList[0].elementList[0].elementId + "&navNum=" + (Category.num - 1);
			window.Cookies.set('backUlrRot', '类型');
			window.Cookies.set('LXNum', Category.num);
		} else {
			var jsonUrl = encodeURIComponent(list.listJson.data.specialList[0].elementList[this.itemNo + 1].jsonUrl)
			if (list.listJson.data.specialList[0].elementList[this.itemNo + 1].layout == "Subject_Detail_TP1") {
				window.Cookies.set('ZTNum', this.itemNo);
				window.Cookies.set('backUlrRot', '专题');
				console.log("./special/special.html?JsonUrl=" + jsonUrl)
				location.href = "./special/special.html?JsonUrl=" + jsonUrl;
			} else {
				window.Cookies.set('backUlrRot', '详情');
				window.Cookies.set('XQNum', this.itemNo);
				window.Cookies.set('XQNumS', Category.num);
				window.Cookies.set('prePage', '../index.html');
				if (list.listJson.data.specialList[0].elementList[this.itemNo + 1].layout == "Detail_News") {
					window.location = "./seriesDetail/seriesDetail.html?JsonUrl=" + jsonUrl;
				} else {
					window.location = "./singleDetail/singleDetail.html??JsonUrl=" + jsonUrl;
				}
			}
		}
	}
};
var tab0 = { //			首页渲染
	programList: '',
	op: false,
	itemNo: 0,
	back: function () {
		areaObj = Category;
		this.op = 0;
		tab0.removeCss();
		this.itemNo = 0;
		$('.yh-scroll li').eq(0).addClass('hover');
		$('#next_0').removeClass('yh-control-change');

	},
	getInfoFunction: function (index, result) {
		//获取首页下啦栏目数据

		getJsonCallback(result.data.catList[0].jsonUrl, function (res) {
			console.log(res);
			tab0.programList = res.data.specialList;
			localStorage.setItem("DetailJson", JSON.stringify(tab0.programList));
			tab0.Addlist(tab0.programList[index]);
			$.imgLazyLoad(); //懒加载
			console.log('播放')
			medPlayer.play(tab0.programList[0].elementList[0].jsonUrl);
		}, function (error) {
			console.log(error);
		})
	},
	Addlist: function (pro) {
		//			  	添加详情页入口
		var sy = "Sy"
		$('.lt_1_1').empty();
		for (var i = 1; i < pro.elementList.length; i++) {
			$('.lt_1_1').append('<div id=' + sy + i + '><img class="lazyload" src="./index/images/img_loading_160x230.png" data-img="' + pro.elementList[i].elementImg + '"/></div>')

		}
	},
	home: function () {
		medPlayer.hidePlayer();
		var innerURL = window.Cookies.get('lastURL');
		window.location.href = innerURL;
	},
	left: function () {
		tab0.removeCss();
		if (tab0.itemNo < 1) {
			tab0.op = false;
		} else if (tab0.itemNo == 2) {
			tab0.itemNo -= 2;
		} else {
			tab0.itemNo--;
		}
		tab0.addCss();
	},
	right: function () {
		tab0.removeCss();
		if (!tab0.op) {
			tab0.op = true;
		} else {
			if (tab0.itemNo > 1) {
				tab0.itemNo = 1;
			};
			tab0.itemNo++;
		}
		tab0.addCss();
	},
	up: function () {
		tab0.removeCss();
		if (!this.op) {
			areaObj = Category;
			$('.yh-scroll li').eq(Category.num).addClass('hover');
			$('#next_' + Category.num).removeClass('yh-control-change');
		} else {
			if (this.itemNo == 0 || this.itemNo == 1) {
				areaObj = Category;
				this.op = false;
				this.itemNo = 0;
				$('.yh-scroll li').eq(Category.num).addClass('hover');
				$('#next_' + Category.num).removeClass('yh-control-change');
			} else if (this.itemNo == -1) {
				this.op = false;
				$(".lt_2").addClass("hover");
			} else if (this.itemNo == 2) {
				this.itemNo = 1;
				$(".lt_1_1 div").eq(2).addClass("hover");
			}
		}
	},
	scrollBox: function (num) {
		$('.scroll-lei li').eq(num).addClass('changeColor');
	},
	scrollBoxZ: function (num) {
		$('.scroll-lei li').eq(num).removeClass('changeColor');
	},
	down: function () {
		if (this.op) {
			if (this.itemNo == 1) {
				tab0.removeCss();
				this.op = true;
				this.itemNo = 2;
				tab0.addCss();
			} else {
				tab0.removeCss();
				tab0.scrollBoxZ(0);
				tab0.scrollBox(1);
				areaObj = tab1;
				$('.liveRecommendTop').hide();
				$("body").css("background-image", "url(index/images/category.png)");
				if (tab1.itemNo == 0) {
					tab1.getInfoFunction(0, Category.json);
				}
				$('.liveHot').show();
				tab1.addCss();
				medPlayer.hidePlayer();
			}
		} else {
			tab0.removeCss();
			this.op = true;
			this.itemNo = -1;
			$(".lt_1_1 div").eq(0).addClass("hover");
		}
	},
	addCss: function () {
		if (tab0.op) {
			$(".lt_1_1 div")
				.eq(tab0.itemNo + 1)
				.addClass("hover");
		} else {
			$(".lt_2").addClass("hover");
		}
		$.imgLazyLoad(); //懒加载
	},
	removeCss: function () {
		$(".lt_1_1 div").removeClass("hover");
		$(".lt_2").removeClass("hover");
		$.imgLazyLoad(); //懒加载
	},
	enter: function () {
		// var PS = _ZJYHSH.ZJYHSH[0].childWebPage;
		var time = new Date().valueOf();
		if (this.op) {
			medPlayer.hidePlayer();
			var jsonurl = encodeURIComponent(tab0.programList[0].elementList[this.itemNo + 1].jsonUrl)
			if (tab0.programList[0].elementList[this.itemNo + 1].layout == "Subject_Detail_TP1") {
				window.Cookies.set('ZTNum', this.itemNo);
				window.Cookies.set('backUlrRot', '专题');
				console.log("./special/special.html?JsonUrl=" + jsonurl)
				location.href = "./special/special.html?JsonUrl=" + jsonurl;
			} else {
				window.Cookies.set('XQNum', this.itemNo);
				window.Cookies.set('XQNumS', 0);
				window.Cookies.set('backUlrRot', '详情');
				window.Cookies.set('prePage', '../index.html');
				if (tab0.programList[0].elementList[this.itemNo + 1].layout == "Detail_News") {
					window.location = "./seriesDetail/seriesDetail.html?JsonUrl=" + jsonurl;
				} else {
					window.location = "./singleDetail/singleDetail.html??JsonUrl=" + jsonurl;
				}
			}
		} else {
			try {
				medPlayer.hidePlayer();
			} catch (err) {
				console.log(err);
			}
			window.Cookies.set('prePage', '../index.html');
			var jsonurl = tab0.programList[0].elementList[this.itemNo + 1].jsonUrl;
			Cookies.set('detailUrl', jsonurl, {
				path: '/'
			})
			window.location =
				"../yunnan-mpa/players/player.html"
			// setInterval(function () {
			// 	window.location = "./players/player.html"
			// }, 100)
		}
	},
	volumeplus: function () {
		medPlayer.increaseVolume();
	},
	volumeminus: function () {
		medPlayer.reduceVolume();
	},
	mute: function () {
		medPlayer.setMuteFlag();
	},
};
console.log("首页下方资产请求渲染");
var tab1 = {
	timer: '',
	programList: '',
	urls: '',
	itemNo: 0,
	op: 0,
	getInfoFunction: function (index, result) { //获取首页下啦栏目数据
		tab1.programList = JSON.parse(localStorage.getItem("DetailJson"))[index + 1];
		console.log(tab1.programList);
		tab1.Addlist(tab1.programList);
		$('.XlList0').addClass('hover');
		$.imgLazyLoad(); //懒加载
	},
	scrollBox: function (num) {
		$('.scroll-lei li').eq(num).addClass('changeColor');
	},
	scrollBoxZ: function (num) {
		$('.scroll-lei li').eq(num).removeClass('changeColor');
	},
	Addlist: function (pro) {
		$('.fancy').empty();
		console.log(tab1.programList.specialName)
		$('.liveHot h2').text(tab1.programList.specialName);
		//			  	添加详情页入口
		var sy = "XlList"
		for (var i = 0; i < tab1.programList.elementList.length; i++) {
			// 角标
			// if (!pro[i].services) {
			$('.fancy').append('<li class=' + sy + i + '><img class="lazyload" src="./index/images/img_loading_160x230.png" data-img="' + tab1.programList.elementList[i].elementImg + '"/></div>');
			// } else {
			// 	$('.fancy').append('<li class=' + sy + i + '><a class="jiaobiao"></a><img class="lazyload" src="./index/images/img_loading_160x230.png" data-img="' + header + PS[this.op + 1].context[i].timeInterval.time0.image + '"/></div>');
			// }
		}
	},
	back: function () {
		tab1.scrollBoxZ(this.op + 1);
		tab1.scrollBox(0);
		this.op = 0;
		tab1.removeCss();
		areaObj = Category;
		this.itemNo = 0;
		tab0.itemNo = 0;
		tab0.getInfoFunction(0, Category.json);
		$('.yh-scroll li').eq(0).addClass('hover');
		$('#next_0').removeClass('yh-control-change');
		$('.liveHot').hide();
		$("body").css("background-image", "url(index/images/categoryplay.png)")
		$('.liveRecommendTop').show();
	},
	down: function () {
		if (this.itemNo == 1 || this.itemNo == 2 || this.itemNo == 5) {
			if (this.op > 3) {
				$('#marqueeS').hide();
			}
			if (this.op == 5) return;
			tab1.removeCss();
			tab1.scrollBoxZ(this.op + 1);
			this.op++;
			tab1.scrollBox(this.op + 1);
			areaObj = tab1;
			//	                    翻页请求
			tab1.getInfoFunction(this.op, Category.json);
			this.itemNo = 0;
			this.addCss();
		} else {
			tab1.removeCss();
			this.itemNo++;
			tab1.addCss();
		}
	},
	home: function () {
		var innerURL = window.Cookies.get('lastURL');
		window.location.href = innerURL;
	},
	up: function () {
		if (this.itemNo == 1 || this.itemNo == 4 || this.itemNo == 5) {
			tab1.removeCss();
			this.itemNo--;
			tab1.addCss();
		} else {
			tab1.removeCss();
			if (this.op == 0) {
				tab1.scrollBoxZ(1);
				tab1.scrollBox(0);
				if (!tab0.op) {
					tab0.getInfoFunction(0, Category.json);
				} else {
					medPlayer.play(tab0.programList[0].elementList[0].jsonUrl)
				}
				areaObj = tab0;
				$('.liveHot').hide();
				$("body").css("background-image", "url(index/images/categoryplay.png)")
				$('.liveRecommendTop').show();
				tab0.addCss();
			} else {
				areaObj = tab1;
				tab1.scrollBoxZ(this.op + 1);
				this.op--;
				tab1.scrollBox(this.op + 1);
				this.itemNo = 0;
				tab1.getInfoFunction(this.op, Category.json);
				$('#marqueeS').show()
			}
		}
	},
	left: function () {
		if (this.itemNo == 3) {
			tab1.removeCss();
			this.itemNo--;
			tab1.addCss();
		} else if (this.itemNo == 4 || this.itemNo == 2) {
			tab1.removeCss();
			this.itemNo -= 2;
			tab1.addCss();
		} else if (this.itemNo == 5) {
			tab1.removeCss();
			this.itemNo -= 3;
			tab1.addCss();
		}
	},
	right: function () {
		if (this.itemNo == 0) {
			tab1.removeCss();
			this.itemNo += 2;
			tab1.addCss();
		} else
		if (this.itemNo == 1 || this.itemNo == 2) {
			tab1.removeCss();
			this.itemNo++;
			tab1.addCss();
		}
	},
	addCss: function () {
		$('.XlList' + this.itemNo).addClass('hover');
		$.imgLazyLoad(); //懒加载
	},
	removeCss: function () {
		$('.XlList' + this.itemNo).removeClass('hover');
		$.imgLazyLoad(); //懒加载
	},
	enter: function () {
		var jsonurl = encodeURIComponent(tab1.programList.elementList[this.itemNo].jsonUrl);
		if (tab1.programList.elementList[this.itemNo].layout == "Subject_Detail_TP1") {
			window.Cookies.set('ZTNum', this.itemNo);
			window.Cookies.set('backUlrRot', '专题');
			var time = new Date().valueOf();
			console.log("./special/special.html?JsonUrl=" + jsonurl)
			location.href = "./special/special.html?JsonUrl=" + jsonurl
		} else {
			window.Cookies.set('XQNum', this.itemNo);
			window.Cookies.set('XQNumx', this.op + 1);
			window.Cookies.set('backUlrRot', '详情');
			window.Cookies.set('prePage', '../index.html');
			if (tab1.programList.elementList[this.itemNo].layout == "Detail_News") {
				window.location = "./seriesDetail/seriesDetail.html?JsonUrl=" + jsonurl;
			} else {
				window.location = "./singleDetail/singleDetail.html??JsonUrl=" + jsonurl;
			}
		}
	}
};
var firm = {
	num: 0,
	back: function () {
		areaObj = Category;
		$(".yy-confirm").hide();
		this.num = 0;
		$('.cancel').removeClass('select-on');
		$('.make-sure').addClass('select-on');
	},
	enter: function () {
		if (this.num == 0) {
			medPlayer.hidePlayer();
			prompt("yanhua://epg/exit")
			// var innerURL = window.Cookies.get('lastURL');
			// window.location.href = innerURL;
		} else {
			this.num = 0;
			areaObj = Category;
			$(".yy-confirm").hide();
			$('.cancel').removeClass('select-on');
			$('.make-sure').addClass('select-on');
		}
	},
	right: function () {
		this.num++;
		if (this.num > 1) {
			this.num = 1
		}
		$('.make-sure').removeClass('select-on');
		$('.cancel').addClass('select-on');
	},
	left: function () {
		this.num--;
		if (this.num < 0) {
			this.num = 0
		}
		$('.cancel').removeClass('select-on');
		$('.make-sure').addClass('select-on');
	},
};
var areaObj = Category; //初始焦点赋值
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
		case "pageup":
			areaObj.pageup();
			break;
		case "pagedown":
			areaObj.pagedown();
			break;
		case "back":
			areaObj.back();
			break;
		case "enter":
			var urlss = window.location.pathname;
			var stateObj = {
				index: "backIndex"
			}
			history.replaceState(stateObj, "go", urlss);
			window.Cookies.set("backUrl", window.location.href);
			areaObj.enter();
			break;
		case "volumeplus":
			areaObj.volumeplus();
			break;
		case "volumeminus":
			areaObj.volumeminus();
			break;
		case "mute":
			areaObj.mute();
			break;
		case "home":
			areaObj.home();
			window.Cookies.remove('LXNum');
			break;
	}
};
//事件绑定
document.onkeydown = grepEvent;