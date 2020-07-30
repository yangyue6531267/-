$(function () {
	if (window.Cookies.get('userToken')) {
		var userToken = window.Cookies.get('userToken');
		var userID = window.Cookies.get('userId');
	} else {
		var userToken = 123456;
		var userID = 123456;
	}
	$.get("/GetProgramInfo", {
		programId: data.programid,
		// 		  productIDs:getProducts(),
		userToken: userToken,
		userID: userID,
		_: new Date().getTime()
	}, function (res) {
		if (typeof res == "string") {
			var resobj = JSON.parse(res);
		} else {
			var resobj = res;
		}
		if (resobj.result * 1 === 200) {
			data.init(resobj);
			if (resobj.programType == 0) {
				data.isSeries = false;
			} else {
				data.isSeries = true;
			}
		}
	});
});

$(function () {
	if (window.Cookies.get('userToken')) {
		var userToken = window.Cookies.get('userToken');
		var userID = window.Cookies.get('userId');
	} else {
		var userToken = 123456;
		var userID = 123456;
	}
	$.get("/AddBookMarks", {
		userID: userID,
		programTime: new Date().getTime() * 1,
		userToken: userToken,
		programId: data.programid,
		programSubId: data.subindex,
	}, function (res) {
		console.log("添加观看记录");
	});
});
$(function () {
	if (window.Cookies.get('userToken')) {
		var userToken = window.Cookies.get('userToken');
		var userID = window.Cookies.get('userId');
	} else {
		var userToken = 123456;
		var userID = 123456;
	}
	window.isLast = "noLast";
	if (data.catagory == 5660 || data.catagory == 5538) {
		data.catagory = 5545
	}
	$.get("/GetProgramContents", {
		folderId: data.catagory,
		// folderId: folderStr,
		// startAt: 1,
		maxItems: "1000",
		userToken: userToken,
		userID: userID,
		// userToken: Dev.getConfig("userToken")
	}, function (res) {
		window.programIdList = [];
		window.programTypeList = [];
		if (typeof res == "string") {
			var resobj = JSON.parse(res);
		} else {
			var resobj = res;
		}
		var getArr = resobj.programList;
		var filterArr = [];
		filterArr.splice(0, filterArr.length);
		for (var i = 0; i < getArr.length; i++) {
			if (getArr[i].programId != data.programid) {
				filterArr.push(getArr[i]);
			}
		}
		var ranNum = 6;
		var list = [];
		list.splice(0, list.length);
		for (var i = 0; i < ranNum; i++) {
			var ran = Math.floor(Math.random() * filterArr.length);
			list.unshift(filterArr.splice(ran, 1)[0]);
		};
		// for(var i in list){
		// 	$('.rList li .imgbox img').eq(i).attr("src", '/portal/images/'+list[i].image[0].imageUrl);
		// 	$('.rList li .text').eq(i).html(list[i].programName)
		// 	programIdList[i] = list[i].programId;
		// 	programTypeList[i] = list[i].programType;
		// }
		var html = ''
		var header = "/portal/images/";
		for (i in list) {
			html += "<li class='imgbox'>" + "<img class='jiaobiao' src='../index/images/jingxuan.png'>" + "<div class='imgbox'>" + "<img src='../index/images/img_loading_160x230.png'  data-img=" + header + list[i].image[0].imageUrl + " class='lazyload'>" + "</div>" +
				"<div class='word'>" + "<div class='text'>" + list[i].programName + "</div>" + "<div class='text-copy'>" + "</div>" + "</div>" +
				"</li>";
			programIdList[i] = list[i].programId;
			programTypeList[i] = list[i].programType;
		}
		$(".rList").html(html);
		for (i in list) {
			if (list[i].services) {
				$("#rList ul li .jiaobiao").eq(i).css({ //角标
					visibility: "visible"
				});
			}
		}
	});
});


//current program data
var data = {
	programid: unity.getParam("pgid") * 1,
	catagory: unity.getParam("catagory") * 1,
	subindex: unity.getParam("subindex") * 1 - 1,
	program: null,
	isSeries: true,
	posId: 0,
	Type: '',
	times: 0,
	init: function (resobj) {
		data.times = parseInt((new Date()).getTime());
		this.program = resobj;
		view.renderTopView();
		view.showBtm();

		if (this.program.programType == 1) {
			playerObj.playByassetId(this.program.programSub[this.subindex].programId);
			data.posId = this.program.programSub[this.subindex].programId;
			data.posId = "0";
		} else {
			playerObj.playByassetId(this.program.programId);
			data.posId = this.program.programId;
			data.posId = "1";
		}
	},
	playnext: function () {
		if (this.program.programType * 1 == 0 || this.program.programSub.length <= 1) return;
		// alert("判断可以播放下一集");
		if (this.program.programType * 1 == 1 && this.subindex + 1 < this.program.programSub.length) {
			// alert("开始准备播放下一集");
			this.subindex += 1;
			playerObj.release();
			// alert("清除播放组件");
			playerObj.playByassetId(this.program.programSub[this.subindex].programId);
			// alert("开始准备播放下一集id");
			// alert(this.program.programSub[this.subindex].programId);
			view.renderTopView();
		} else {
			unity.toastMsg("当前已是最后一集，不能再往下翻了");
		}
	},
	playprev: function () {
		if (this.program.programType * 1 == 0 || this.program.programSub.length <= 1) return;
		if (this.program.programType * 1 == 1 && this.subindex > 0) {
			this.subindex -= 1;
			view.renderTopView();
			playerObj.release();
			playerObj.playByassetId(this.program.programSub[this.subindex].programId);
		} else if (this.program.programType * 1 == 1 && this.subindex == 0) {
			unity.toastMsg("当前已是第一集，不能再往上翻了");
		}
	}
};

var playerObj = {
	Player: null,
	totalTime: 0,
	playedTime: 0,
	isPlaying: false,
	ismute: true,
	initPlayer: function () {
		this.totalTime = 0;
		this.playedTime = 0;
		clearInterval(this.getCurrentTime.gCtid);
		this.getCurrentTime.gCtid = null;
		this.Player = new MediaPlayer();
		this.Player.setVideoDisplayMode(1);
		this.Player.refreshVideoDisplay();
		this.Player.setNativeUIFlag(0);
	},
	play: function (playUrl) {
		this.initPlayer();
		this.Player.setSingleMedia(this.toJson(playUrl));
		this.Player.playFromStart();
		playerObj.isplaying = true;
		var _this = this;
		setTimeout(function () {
			_this.getDuration();
			_this.getCurrentTime();
		}, 600);
	},
	playByTime: function () {
		//改变播放按钮
		playerObj.Player.playByTime(1, playerObj.jumpTime, 1);
		// alert(playerObj.jumpTime);
		playerObj.jumpTime = 0;
		setTimeout(function () {
			// var time = playerObj.Player.getCurrentPlayTime() * 1;
			// alert(time);
			playerObj.getCurrentTime(); //开始获取播放时间
			view.renderResume(); //渲染开始播放视图
		}, 600)
	},
	playByassetId: function (programId) {
		var areaNode = Authentication.CTCGetConfig("AreaNode");
		var encryptedUserToke = Authentication.CTCGetConfig("EncryptedUserToken");
		if (window.Cookies.get('userToken')) {
			var userToken = window.Cookies.get('userToken');
		} else {
			var userToken = 123456;
		}
		var that = this;
		$.get("/getVODPlayUrl", {
			programId: programId,
			userToken: userToken,
			areaNode: areaNode,
			encryptedUserToke: encryptedUserToke,
		}, function (res) {
			if (typeof res == "string") {
				var urlObj = JSON.parse(res);
			} else {
				var urlObj = res;
			}
			if (urlObj.playUrl.split(";").length > 1) {
				var playUrl = urlObj.playUrl.split(";")[0];
			} else {
				var playUrl = urlObj.playUrl;
			}
			that.play(playUrl);
		});
	},
	//获取当前时间、
	getCurrentTime: function () {
		var _this = this;
		this.getCurrentTime.gCtid = setInterval(function () {
			var time = playerObj.Player.getCurrentPlayTime() * 1;

			//如果time < = 0 说明还没开始播放、
			if (time == 0) return;
			if (time == -1 && playerObj.playedTime > 0) {
				playerObj.Player.playByTime(1, playerObj.playedTime - 1, 1);
				view.renderPlayedTime(playerObj.playedTime - 1, playerObj.totalTime);
				unity.toastMsg("缓存中");
			};
			//如果两次获取的时间相同，说明在加载中、所以不渲染时间。
			if (playerObj.playedTime == time) return; //如果相等，说明在暂停中，或者为开始播放或者卡顿，获取的时间，跟当前时间一样。
			playerObj.playedTime = time;
			// playerObj.isplaying = true;
			if (playerObj.jumpTime != 0) return;
			view.renderPlayedTime(time, playerObj.totalTime);
			//否则渲染视图 、播放即将结束、清理掉gCtid、然后释放播放器、播放下个视频
			if (playerObj.totalTime > 0 && time > 0 && playerObj.totalTime - 1 <= time) {
				// view.renderPlayedTime(0, _this.totalTime);
				// alert("准备释放");
				// alert(time);
				// alert(_this.totalTime);
				clearInterval(playerObj.getCurrentTime.gCtid);
				setTimeout(function () {
					if (data.subindex + 1 >= data.program.programSub.length) {
						playerObj.release();
						var detailURL = window.location.href;
						if (detailURL.indexOf('from') != -1) {
							history.go(-1);
						} else {
							if (data.isSeries) {
								window.location = "../seriesDetail/seriesDetail.html?from=player&programId=" + data.programid + "&subindex=0&folderId=" + data.catagory
							} else {
								window.location = "../singleDetail/singleDetail.html?from=player&programId=" + data.programid + "&folderId=" + data.catagory
							}
						}
					} else {
						data.playnext();
						view.renderPlayedTime(0, playerObj.totalTime);
					}
				}, 720);
				// unity.toastMsg("播放结束");
			}
		}, 1000);
	},
	//获取总的播放时间、没有问题、
	getDuration: function () {
		var duration = this.Player.getMediaDuration() * 1;
		_this = this;
		if (duration > 0) {
			this.totalTime = duration;
			view.renderTotalTime(this.totalTime);
		} else {
			setTimeout(function () {
				_this.getDuration();
			}, 500);
		}
	},
	getMuteFlag: function () {
		return this.Player.getMuteFlag();
	},
	ismutes: function () {
		if (this.getMuteFlag() == 1) {
			this.Player.setMuteFlag(0);
			view.renderVoice(this.Player.getVolume());
		} else {
			this.Player.setMuteFlag(1);
			view.renderVoice(this.Player.getVolume());
		}
	},
	release: function () {
		var playerId = this.Player.getNativePlayerInstanceID();
		this.Player.stop();
		this.Player.releaseMediaPlayer(playerId);
	},
	resumes: function () {
		playerObj.isplaying = true;
		playerObj.Player.resume();
		view.renderResume();
		$(".PausePhoto").hide();
	},
	pauses: function () {
		playerObj.isplaying = false;
		view.renderPause();
		$(".PausePhoto").show();
		playerObj.Player.pause();
	},
	//暂停与播放切换、
	toggle: function () {
		// if (this.isbyplay == false) {
		this.isplaying ? this.pauses() : this.resumes();
		// }
	},
	//快进 ,快退
	jumpTime: 0,
	rftimer1: null,
	rftimer2: null,
	gressCount: 0,
	rfid: null,
	opplaytime: null,
	// isbyplay:false,
	foward: function () {
		if (playerObj.totalTime == 0 || playerObj.playedTime == 0) return;
		//底部显示。
		view.showBtm();
		// var _this = this;
		clearTimeout(playerObj.rfid);
		playerObj.rfid = null;
		clearInterval(playerObj.getCurrentTime.gCtid);
		playerObj.getCurrentTime.gCtid = null;
		// clearTimeout(playerObj.rftimer1);
		// playerObj.rftimer1 = null;
		clearTimeout(playerObj.rftimer2);
		playerObj.rftimer2 = null;
		//快进前的准备。
		if (playerObj.jumpTime == 0) {
			playerObj.jumpTime = playerObj.Player.getCurrentPlayTime() * 1;
			playerObj.rfid = setTimeout(function () {
				playerObj.jumpTime = 0;
			}, 5000);
			return;
		}
		//清除 获取当前时间的定时器。
		// if (++playerObj.gressCount< 5) {
		playerObj.jumpTime += 10;
		// } else {
		// 	playerObj.jumpTime += Math.round(playerObj.totalTime / 60);
		// };
		if (playerObj.jumpTime > playerObj.totalTime) {
			playerObj.jumpTime = playerObj.totalTime - 5;
		};
		view.renderPlayedTime(playerObj.jumpTime, playerObj.totalTime);
		// playerObj.rftimer1 = setTimeout(function () {
		// 	playerObj.gressCount = 0;
		// }, 320);
		playerObj.rftimer2 = setTimeout(function () {
			_this.playByTime();
		}, 700);
		this.opplaytime = setTimeout(function () {
			playerObj.opplaytime = null;
			playerObj.isbyplay = true;
			setTimeout(function () {
				playerObj.isbyplay = false;
			}, 1000);
		}, 500);
	},
	//快退
	rewind: function () {
		//如果总的时间为0，已经播放的时间为0、而且没有在播放
		if (this.totalTime == 0 || this.playedTime == 0) return;
		//底部显示。
		view.showBtm();
		var _this = this;
		//快进前的准备。  如果jumptime 为0 
		if (this.jumpTime == 0) {
			this.jumpTime = this.Player.getCurrentPlayTime() * 1;
			this.rfid = setTimeout(function () {
				_this.jumpTime = 0;
			}, 5000);
			return;
		}
		//清除 jumpTime 跟 获取当前时间的定时器。
		clearTimeout(this.rfid);
		this.rfid = null;
		clearInterval(this.getCurrentTime.gCtid);
		this.getCurrentTime.gCtid = null;

		++this.gressCount < 5 ? this.jumpTime -= 10 : this.jumpTime -= Math.round(this.totalTime / 60);

		if (this.jumpTime <= 0) this.jumpTime = 1;

		view.renderPlayedTime(this.jumpTime, this.totalTime);

		clearTimeout(this.rftimer1);
		clearTimeout(this.rftimer2);
		this.rftimer1 = setTimeout(function () {
			_this.gressCount = 0;
		}, 320);
		this.rftimer2 = setTimeout(function () {
			_this.playByTime();
		}, 700);
		var that = this;
		this.opplaytime = setTimeout(function () {
			that.opplaytime = null;
			that.isbyplay = true;
			setTimeout(function () {
				that.isbyplay = false;
			}, 1000);
		}, 500);
	},
	//增加声音
	volumePlus: function () {
		var v = this.Player.getVolume();
		if (v < 100) v = v + 5 < 100 ? v + 5 : 100;
		this.Player.setVolume(v);
		view.renderVoices(v);
	},
	//减小声音
	volumeMinus: function () {
		var v = this.Player.getVolume();
		if (v > 0) v = v - 5 > 0 ? v - 5 : 0;
		this.Player.setVolume(v);
		view.renderVoices(v);
	},
	toJson: function (Url) {
		return '[{mediaUrl:"' + Url +
			'",mediaCode:"media1",' +
			'mediaType:2,audioType:1,' +
			'videoType:1,streamType:2,' +
			'drmType:1,fingerPrint:0,' +
			'copyProtection:1,allowTrickmode:1,' +
			'startTime:0,endTime:5000,entryID:"entry1"}]';
	}
};

//视图
var view = {
	renderVoice: function (volumn) {
		$(".volumnbox").show();
		if (this.renderVoice.voiceTid) {
			clearTimeout(this.renderVoice.voiceTid);
		}
		if (playerObj.Player.getMuteFlag() == 1) {
			$('.volumnbox .volumnbg .vilumntu').css('display', 'block');
			$(".volumnbg").html("静音 " + volumn + "%");
			$(".volumnin").css("width", volumn * 1.9 + "px");
		} else {
			$('.volumnbox .volumnbg .vilumntu').css('display', 'none');
			$(".volumnbg").html("音量 " + volumn + "%");
			$(".volumnin").css("width", volumn * 1.9 + "px");
		}
		this.renderVoice.voiceTid = setTimeout(function () {
			$(".volumnbox").hide();
		}, 1200);
	},
	renderVoices: function (volumn) {
		$(".volumnbox").show();
		if (this.renderVoice.voiceTid) {
			clearTimeout(this.renderVoice.voiceTid);
		}
		$(".volumnbg").html("音量 " + volumn + "%");
		$(".volumnin").css("width", volumn * 1.9 + "px");
		this.renderVoice.voiceTid = setTimeout(function () {
			$(".volumnbox").hide();
		}, 1200);
	},
	renderTotalTime: function (T) {
		var timeStr = unity.fTime(T);
		$("#totalTime").html(timeStr);
	},
	renderPlayedTime: function (T, A) {
		var timeStr = unity.fTime(T);
		$("#playedTime").html(timeStr);
		$(".opratebar").css({
			"width": (T / A * 1000) + "px"
		});
	},
	renderTopView: function () {
		//		续集弹出
		$("#fstname").html(data.program.programName);
		if (data.program.programType * 1 == 1) {
			$("#subname").html(data.program.programSub[data.subindex].programName);
		}
		this.showTop();
		this.showBtm();
	},
	renderPause: function () {
		$(".picon").addClass("pause");
		$(".tvbt").show();
		$(".tvhd").show();
	},
	renderResume: function () {
		$(".picon").removeClass("pause");
		this.showBtm();
		$(".tvhd").hide();
	},
	showBtm: function () {
		if (this.showBtm.timer) clearTimeout(this.showBtm.timer);
		$(".tvbt").show();
		this.showBtm.timer = setTimeout(function () {
			$(".tvbt").hide();
		}, 5000);
	},
	showTop: function () {
		if (this.showTop.timer) clearTimeout(this.showTop.timer);
		$(".tvhd").show();
		this.showTop.timer = setTimeout(function () {
			$(".tvhd").hide();
		}, 5000);
	}
};
//播放
var playerArea = {
	up: function () {
		view.showTop();
		view.showBtm();
	},
	down: function () {
		view.showTop();
		view.showBtm();
	},
	left: function () {
		playerObj.rewind();
		$(".PausePhoto").hide();
	},
	right: function () {
		playerObj.foward();
		$(".PausePhoto").hide();
	},
	volumeplus: function () {
		playerObj.volumePlus();
	},
	volumeminus: function () {
		playerObj.volumeMinus();
	},
	pageup: function () {
		data.playprev();
		view.renderPlayedTime(0, _this.totalTime);
	},
	pagedown: function () {
		data.playnext();
		view.renderPlayedTime(0, _this.totalTime);
	},
	enter: function () {
		playerObj.toggle();
	},
	back: function () {
		areaObj = quitArea;
		$(".tvbt").hide();
		$(".tvhd").hide();
		$(".quitbox").show();
		$(".PausePhoto").hide();
		$.imgLazyLoad(); //懒加载
	},
	mute: function () {
		playerObj.ismutes();
	},
	getTime: function () {
		quitArea.start_time = parseInt((new Date()).getTime());
		alert(quitArea.start_time);
	}
};
//离开消息框
var quitArea = { //添加推荐资产---wzh
	// fele: $(".btnok").addClass("focus"),
	number: 0,
	start_time: 0,
	timer: null,
	addMoving: function () {
		var title = $(".bottombox li .text").eq(this.number).text();
		if (title.length > 8) {
			var wordBox = document.querySelector('.word-box' + this.number);
			var text1 = document.querySelector('.word-box' + this.number + ' .text');
			var text2 = document.querySelector('.word-box' + this.number + ' .text-copy');
			text2.innerHTML = text1.innerHTML;
			wordBox.style.textOverflow = 'clip';
			clearInterval(this.timer);
			this.timer = setInterval(function () {
				if (text2.offsetWidth - wordBox.scrollLeft <= 0) {
					wordBox.scrollLeft = 1;
				} else {
					wordBox.scrollLeft += 2
				}
			}, 40)
		}
	},
	removeMoving: function () {
		if (this.timer !== null) {
			document.querySelector('.word-box' + this.number).style.textOverflow = 'ellipsis';
			document.querySelector('.word-box' + this.number).scrollLeft = 0;
			document.querySelector('.word-box' + this.number + ' .text-copy').innerHTML = '';
			clearInterval(this.timer)
		}
	},
	up: function () {
		if (!$(".msgbtn div").hasClass("focus")) {
			this.removeMoving();
			this.number = 0;
			$(".bottombox li .imgbox").removeClass("active");
			$(".btnok").addClass("focus");
		}
	},
	down: function () {
		if ($(".msgbtn div").hasClass("focus")) {
			$(".msgbtn div").removeClass("focus");
			$(".bottombox li .imgbox").eq(this.number).addClass("active");
			this.addMoving();
		}
	},
	left: function () {
		if ($(".msgbtn div").hasClass("focus")) {
			$(".btnno").removeClass("focus");
			$(".btnok").addClass("focus");
		} else {
			if (this.number <= 0) return;
			$(".bottombox li .imgbox").eq(this.number).removeClass("active");
			this.removeMoving();
			this.number--;
			$(".bottombox li .imgbox").eq(this.number).addClass("active");
			var title = $(".bottombox li .text").eq(this.number).text();
			if (title.length > 8) {
				this.addMoving();
			}
		}
	},
	right: function () {
		if ($(".msgbtn div").hasClass("focus")) {
			$(".btnok").removeClass("focus");
			$(".btnno").addClass("focus");
		} else {
			if (this.number >= 5) return;
			$(".bottombox li .imgbox").eq(this.number).removeClass("active");
			this.removeMoving()
			this.number++;
			$(".bottombox li .imgbox").eq(this.number).addClass("active");
			var title = $(".bottombox li .text").eq(this.number).text();
			if (title.length > 8) {
				this.addMoving()
			}
		}
		$.imgLazyLoad(); //懒加载
	},
	back: function () {
		areaObj = playerArea;
		this.number = 0;
		$(".btnok").removeClass("focus");
		$(".bottombox li .imgbox").removeClass("active");
		$(".btnno").addClass("focus");
		$(".quitbox").hide();
	},
	enter: function () {
		if ($(".btnok").hasClass("focus")) {
			$(".btnok").removeClass("focus");
			$(".btnno").addClass("focus");
			areaObj = playerArea;
			$(".quitbox").hide();
		} else {
			// 点播埋点探针
			try {
				var oDate = new Date(); //实例一个时间对象；
				var year = oDate.getFullYear(); //获取系统的年；
				var mon = oDate.getMonth() + 1; //获取系统月份，由于月份是从0开始计算，所以要加1
				var day = oDate.getDate(); // 获取系统日，
				var hou = oDate.getHours(); //获取系统时，
				var moms = oDate.getMinutes(); //分
				var mis = oDate.getSeconds(); //秒
				function p(s) {
					return s < 10 ? '0' + s : s;
				}
				var time = year + "" + p(mon) + '' + p(day) + '' + p(hou) + '' + p(moms) + '' + p(mis) + '';
				var startTime = quitArea.start_time;
				var mediaCode = data.posId;
				// 节目id
				var seriesFlag = data.Type;
				// 节目类型 电影1 电视剧 0
				var currentPlayTime = playerObj.Player.getCurrentPlayTime();
				// 节目退出播放时长
				var folderId = unity.getParam("catagory");
				// 节目栏目id
				var enterFlag = 0;
				// 状态
				var mediaName = encodeURI(data.program.programName);
				// 片名
				var playTimeLength = playerObj.Player.getMediaDuration();
				// 播放总时长
				var timeLag = data.times - startTime;
				// 成功播放时长（开始播放时间-虚拟键播放成功时间）为毫秒数
				var seriesnum = data.subindex + 1;
				// 当前集数
				if (data.program.services) {
					var orderFlag = 0;
				} else {
					var orderFlag = 1;
				}

				if (seriesFlag == 1) {
					var subMediaName = "";
					var subMediaCode = "";
				} else {
					var subMediaName = encodeURI(data.program.programSub[seriesnum].programName);
					var subMediaCode = data.program.programSub[seriesnum].contentID;
				}
				var episodes = data.program.programSub.length;
				var json = {
					"action_type": "vod_playing",
					"user_id": Authentication.CTCGetConfig("UserID"),
					"user_group_id": Authentication.CTCGetConfig("UserGroupNMB"),
					"epg_group_id": Authentication.CTCGetConfig("UserGroupNMB").substring(0, 2),
					"stb_ip": Authentication.CTCGetConfig("IP"),
					"stb_id": Authentication.CTCGetConfig("STBID"),
					"stb_type": Authentication.CTCGetConfig("STBType"),
					"stb_mac": Authentication.CTCGetConfig("MAC"),
					"terminal_type": Authentication.CTCGetConfig("TerminalType"),
					"area_node": Authentication.CTCGetConfig("AreaNode"),
					"CountyID": Authentication.CTCGetConfig("CountyID"),
					"log_time": time,
					"start_time": startTime,
					"mediacode": mediaCode,
					"seriesflag": seriesFlag,
					"seriescode": seriesFlag,
					"definition": "",
					"bitrate": "",
					"currentplaytime": currentPlayTime,
					"play_result": "1",
					"refer_type": "0",
					"refer_page_name": "",
					"refer_pos_id": "",
					"refer_pos_name": "",
					"refer_parent_id": folderId,
					"folderId": folderId,
					"end_time": parseInt((new Date()).getTime()),
					"enter_flag": enterFlag == 1 ? 1 : 0,
					"mediaName": mediaName,
					"playTimeLength": playTimeLength,
					"timeLag": timeLag,
					"seriesnum": seriesnum,
					"spCode": "ZJYH",
					"services": data.program.services,
					"orderFlag": orderFlag,
					"subMediaName": subMediaName,
					"subMediaCode": subMediaCode,
					"episodes": episodes
				}
				// alert(JSON.stringify(json));
			} catch (err) {
				console.log(err);
				alert(err);
			}
			var url = "http://182.245.29.86:89/epg-interface/logCollectionServlet/dealData";
			$.ajax({
				url: url,
				timeout: 5000,
				type: "post",
				data: {
					"data": JSON.stringify(json)
				},
				success: function (data) {
					console.log(data);
					alert(JSON.stringify(json));
				},
				error: function (err) { //上传搜索报错
					console.log(err);
				}
			});
			if ($(".btnno").hasClass("focus")) {
				try {
					playerObj.release();
				} catch (e) {
					console.log(e);
				}
				var detailURL = window.location.href;
				if (detailURL.indexOf('from') != -1) {
					history.go(-1)
				} else {
					if (data.isSeries) {
						window.location = "../seriesDetail/seriesDetail.html?from=player&programId=" + data.programid + "&subindex=" + data.subindex + "&folderId=" + data.catagory
					} else {
						window.location = "../singleDetail/singleDetail.html?from=player&programId=" + data.programid + "&folderId=" + data.catagory
					}
				}
			} else if (!$(".msgbtn div").hasClass("focus")) {
				try {
					playerObj.release();
				} catch (e) {}
				if (programTypeList[this.number] == 1) {
					window.location = "../seriesDetail/seriesDetail.html?from=player&programId=" + programIdList[this.number] + "&subindex=0&folderId=" + data.catagory;
				} else {
					window.location = "../singleDetail/singleDetail.html?from=player&programId=" + programIdList[this.number] + "&folderId=" + data.catagory
				}
			}
		}

	},

};

var areaObj = playerArea;
onKeyPress = function (keyCode) {
	// alert(keyCode);
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
		case "pageup":
			areaObj.pageup();
			break;
		case "pagedown":
			areaObj.pagedown();
			break;
		case "volumeminus":
			areaObj.volumeminus();
			break;
		case "volumeplus":
			areaObj.volumeplus();
			break;
		case "right": //右边
			areaObj.right();
			break;
		case "back":
			areaObj.back();
			break;
		case "home":
			playerObj.release();
			window.location.href = "../index.html";
			break;
		case "enter":
			areaObj.enter();
			break;
		case "play":
			areaObj.enter();
			break;
		case "mute":
			areaObj.mute();
			break;
			// case "EVENT_MEDIA_BEGINING":
		case "iptv":
			areaObj.getTime();
			break;
	}
}
//事件绑定
document.onkeydown = grepEvent;