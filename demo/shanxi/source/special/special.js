var value = {
    detailData: {},
    specialUrl: "",
    pindex: 0, //当前页数
    isBack: false,
    getValue: function() {
        this.specialUrl = $.cookie('specialUrl');
        console.log(this.specialUrl);
        if (window.location.search.length > 1) {
            this.isBack = true;
            special.itemNo = Number(unity.getVars("itemNo"));
            this.pindex = unity.getVars("pindex") - 1;
        }
    }
}

var getData = function(num) {
    unity.jsonp(value.specialUrl, function(res) {
        console.log(res);
        value.detailData = res.data;
        $('.box-header').css('background-image', 'url(' + value.detailData.specialImg + ')');
        $('.header-name').text(value.detailData.specialName);
        $(".scroll-box").empty();
        for (i in value.detailData.elementList) {
            $(".scroll-box").append('<li><div class="imgbox"><div class="score"><span>' + value.detailData.elementList[i].score + '</span></div><img class="lazyload" src="../public/images/1img_loading_160x230.png"  data-img="' + value.detailData.elementList[i].elementImg + '"/></div><div class="word">' + value.detailData.elementList[i].elementName + '</div></div></li>')
        }
        $.imgLazyLoad();
        special.addCss();
        $('.middle-box').css("top", "310px");
        if (special.itemNo > 5) {
            $('.middle-box').css("top", "0px")
		}
		// 上报埋点
		var jumpJson = $.cookie("jump")
		jumpJson = eval('(' + jumpJson + ')')
		jumpJson.page_type = '0801'
		jumpJson.page_id = value.detailData.specialId
		if (jumpJson) {
		  try {
			bi.jump(jumpJson)
			$.removeCookie("jump", {path: "/"})
		  } catch(error) {
			console.log('埋点错误', error)
			$.removeCookie("jump", {path: "/"})
		  }
		}
    });
}
var special = {
    itemNo: 0,
    isCollection: 0,
    addCss: function() {
        $(".scroll-box li").eq(this.itemNo).addClass('active');
        var title = $(".scroll-box .word").eq(this.itemNo).text();
        if (title.length > 8) {
            $(".middle-box .word").eq(this.itemNo).html('<marquee scrolldelay=80>' + value.detailData.elementList[this.itemNo].elementName + '</marquee>')
        }
    },
    removeCss: function() {
        $(".scroll-box li").eq(this.itemNo).removeClass('active');
        $(".middle-box .word").eq(this.itemNo).html(value.detailData.elementList[this.itemNo].elementName)
    },
    up: function() {
        if (this.itemNo < 6) {
            return
        }
        this.removeCss();
        if (this.itemNo >= 6 && this.itemNo < 12) {
            $('.middle-box').css("top", "310px")
        }
        this.itemNo -= 6;
        this.addCss();
    },
    down: function() {
        if (this.itemNo > 5) return
        this.removeCss();
        $('.middle-box').css("top", "0px")
        $.imgLazyLoad();
        if (this.itemNo + 7 > value.detailData.elementList.length) {
            this.itemNo = value.detailData.elementList.length - 1;
            this.addCss();
        } else {
            this.itemNo += 6;
            this.addCss();
        }
    },
    left: function() {
        if (this.itemNo === 0 || this.itemNo % 6 == 0) return
        this.removeCss()
        this.itemNo--;
        this.addCss()
    },
    right: function() {
        if (this.itemNo != 0 && (this.itemNo + 1) % 6 == 0) return;
        if (this.itemNo == value.detailData.elementList.length - 1) return;
        this.removeCss();
        this.itemNo++;
        this.addCss();
    },
    back: function() {
        window.location = "../index/home.html"
    },
    enter: function() {
        var url = "special.html?pindex=" + value.pindex + "&itemNo=" + this.itemNo;
        history.replaceState(null, null, url) //状态缓存
        var preURL = "../special/" + url
        $.cookie("preURL", preURL, { path: "/" });
        $.cookie('detailUrl', value.detailData.elementList[this.itemNo].jsonUrl, { path: '/' });
		// 进入详情页上报
		try {
			var param = {
				parent_page_type:'0801',
				parent_page_id: value.detailData.specialId
			}
			$.cookie("jump", JSON.stringify(param), {
				path: '/'
			});
		} catch (error) {
			console.log('埋点错误', error)
		}
		if (value.detailData.elementList[this.itemNo].layout === "Detail_Movie") {
            window.location = "../detail/movieDetail.html"
        } else {
            window.location = "../detail/seriesDetail.html"
        }
    }
}

$(value.getValue())
$(getData())

areaObj = special; //初始焦点赋值
onKeyPress = function(keyCode) {
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
			// 返回首页上报
            // try {
            //     var param = {
            //         parent_page_type:'0801',
            //         parent_page_id: value.detailData.specialId
			// 	}
			// 	$.cookie("jump", JSON.stringify(param), {
			// 		path: '/'
			// 	});
            // } catch (error) {
            //     console.log('埋点错误', error)
            // }
            areaObj.back();
            break;
        case "enter":
            areaObj.enter();
            break;
        case "home":
            areaObj.home();
            break;
    }
};
//事件绑定
document.onkeydown = grepEvent;