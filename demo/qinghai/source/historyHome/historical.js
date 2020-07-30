var collectCenter;
var value = {
    isBack: false,
    filterUrl: "",
    detailData: [],
    currClass: 1, //1 收藏  2历史
    itemNo: 0,
    pindex: 0, //当前页数
    totalpage: 0,
    totalNum: 0, //总页数
    getValue: function() {
        if (window.location.search.length > 1) {
            this.currClass = Number(unity.getVars("itemNo"));
            this.filterUrl = $.cookie("historical");
            if (unity.getVars("pindex")) {
                this.isBack = true;
                this.pindex = Number(unity.getVars("pindex"));
                this.itemNo = Number(unity.getVars("contentItemNo"));
            }
        }
        historical.init();
        getData(this.pindex, 8);
        if (value.currClass == 1) {
            var param = {
                page_type:bi.type.fav,
                page_id: '103-1'
              }
        }else{
            var param = {
                page_type:bi.type.history,
                page_id: '101-1'
              }
        }
          var jumpJson = $.cookie("jump");
          if (jumpJson) {
              try{
                var arr = eval('('+((jumpJson)+JSON.stringify(param)).replace(/}{/,',')+')');
              bi.jump(arr);
              $.removeCookie("jump",{path:"/"});
              }catch (error){
              $.removeCookie("jump",{path:"/"});
              }
          }
    }
}
var cookieHistory = function(){
    // 历史收藏页公共组件
    try {
        if (value.currClass == 1) {
            var param = {
                parent_page_type:bi.type.fav,
                parent_page_id: '103-1'
              }
        }else{
            var param = {
                parent_page_type:bi.type.history,
                parent_page_id: '101-1'
              }
        }
      $.cookie("jump", JSON.stringify(param),{
        path: '/'
      });
    } catch (error) {
    }
  }
var getData = function(pindex, psize) {
    $(".total-page").html('');
    $(".search-scroll").css({
        "visibility": "hidden"
    });
    //收藏
    if (value.currClass == 1) {
        unity.collectData(pindex * 8, psize, function(res) {
            console.log(res);
            value.totalpage = (res.data.resultNum && (Math.ceil(res.data.resultNum / 8)));
            value.totalNum = res.data.resultNum;
            value.detailData = res.data.resultList;
            $(".his-content ul").empty();
            for (var i = 0; i < value.detailData.length; i++) {
                $(".his-content ul").append('<li><div class="imgbox"><div class="score"><span>' + value.detailData[i].relateScore + '</span></div><img class="lazyload" src="../public/images/img_loading_160x230.png"  data-img="' + value.detailData[i].relateImg + '"/></div><div class="word">' + value.detailData[i].relateTitle + '</div></div></li>')
            }
            $.imgLazyLoad();
            //页数
            if (value.totalpage >= 1) {
                $(".total-page").html(value.pindex + 1 + '/' + value.totalpage);
            }
            //滚动条
            if (value.totalpage > 1) {
                $(".search-scroll").css({
                    "visibility": "visible"
                });
            }
            if (areaObj == collectCenter) {
                collectCenter.addCss();
            }
            if (value.isBack) {
                value.isBack = false;
                if (value.detailData.length == 0) {
                    historical.addCss();
                    areaObj = historical;
                } else if (value.itemNo + 1 > value.detailData.length) {
                    value.itemNo = value.detailData.length - 1;
                    historical.removeCss();
                    collectCenter.addCss();
                    areaObj = collectCenter;
                    collectCenter.movebar(value.pindex);
                } else {
                    historical.removeCss();
                    collectCenter.addCss();
                    areaObj = collectCenter;
                    collectCenter.movebar(value.pindex);
                }
            }
        })
        
    } else {
        //播放记录
        var payList = $.cookie('payList') || '[]';
        payList = JSON.parse(payList);
        console.log(payList);
        if (payList.length > 0) {
            value.detailData = payList.reverse();
            value.totalNum = payList.length;
            value.totalpage = (value.totalNum && (Math.ceil(value.totalNum / 8)));
            $(".his-content ul").empty();
            console.log(value.detailData);
            for (var j = 0; j < value.detailData.length; j++) {
                $(".his-content ul").append('<li><div class="imgbox"><div class="score"><span>' + value.detailData[j].score + '</span></div><img class="lazyload" src="../public/images/img_loading_160x230.png"  data-img="' + value.detailData[j].assetImg + '"/></div><div class="word">' + value.detailData[j].assetName + '</div></div></li>')
            }
            $.imgLazyLoad();
            if (value.totalpage >= 1) {
                $(".total-page").html(value.pindex + 1 + '/' + value.totalpage);
            }
            //滚动条
            if (value.totalpage > 1) {
                $(".search-scroll").css({
                    "visibility": "visible"
                });
            }
            if (areaObj == collectCenter) {
                collectCenter.addCss();
            }
            if (value.isBack) {
                value.isBack = false;
                historical.removeCss();
                collectCenter.addCss();
                areaObj = collectCenter;
                collectCenter.movebar(value.pindex);
            }
        }
    }
}

var historical = {
    init: function() {
        var transformNum = 0;
        if (value.currClass == 2) {
            transformNum = 140;
        } else {
            transformNum = 210;
        }
        historical.addCss();
        $(".cul").css("top", transformNum + "px")
    },
    up: function() {
        if (value.currClass === 1) return
        value.currClass = 1;
        $(".cul").css("top", "210px")
        $(".his-content ul").empty();
        value.itemNo = 0;
        value.pindex = 0;
        value.totalpage = 0;
        value.totalNum = 0;
        value.detailData = [];
        collectCenter.movebar(value.pindex);
        $(".total-page").html('');
        $(".search-scroll").css({
            "visibility": "hidden"
        });
        getData(value.pindex, 8);
    },
    down: function() {
        if (value.currClass === 2) return
        value.currClass = 2;
        $(".cul").css("top", "140px")
        $(".his-content ul").empty();
        value.itemNo = 0;
        value.pindex = 0;
        value.totalNum = 0;
        value.totalpage = 0;
        value.detailData = [];
        collectCenter.movebar(value.pindex);
        $(".total-page").html('');
        $(".search-scroll").css({
            "visibility": "hidden"
        });
        getData(value.pindex, 8);
    },
    left: function() {},
    right: function() {
        if (this.pindex == 0 || value.totalNum == 0) return;
        this.removeCss();
        if (value.currClass == 1) {
            areaObj = collectCenter;
            collectCenter.addCss();
        } else {
            areaObj = collectCenter;
            collectCenter.addCss();
        }
    },
    addCss: function() {
        $('.content').addClass('active');
        $('.changebac').addClass('writediv');
    },
    removeCss: function() {
        $('.content').removeClass('active');
        $('.changebac').removeClass('writediv');
    },
    enter: function() {},
    back: function() {
        window.location = "../index/home.html"
    }
}

collectCenter = {
    addCss: function() {
        $(".scroll-box li").eq(value.itemNo).addClass('active');
        var title = $(".scroll-box .word").eq(value.itemNo).text();
        if (title.length > 8) {
            $(".scroll-box .word").eq(value.itemNo).html('<marquee scrolldelay=80>' + title + '</marquee>')
        }
    },
    removeCss: function() {
        var title = $(".scroll-box .word").eq(value.itemNo).text();
        $(".scroll-box li").eq(value.itemNo).removeClass('active');
        $(".scroll-box .word").eq(value.itemNo).html(title)
    },
    movebar: function(pageNum) {
        var moveHeight = 346 / (value.totalpage - 1); //滚动条滚动
        $(".search-bar").css("top", moveHeight * pageNum + "px")
    },
    up: function() {
        if (value.itemNo === -1) return
        if (value.pindex == 0 && value.itemNo < 4) {
            this.removeCss();
            value.itemNo = -1;
            $('.his-clear').addClass('writediv');
            return
        }

        if (value.itemNo % 8 < 4) {
            value.itemNo = value.itemNo + 4;
            value.pindex--;
            this.movebar(value.pindex);
            getData(value.pindex, 8);
            return
        } else {
            this.removeCss();
            value.itemNo -= 4;
            this.addCss();
        }
    },
    down: function() {
        if (value.itemNo === -1) {
            value.itemNo = 0;
            this.addCss();
            $('.his-clear').removeClass('writediv');
            return
        }
        if (value.pindex + 1 >= value.totalpage && value.pindex * 8 + value.itemNo + 4 >= value.totalNum) return;
        if (value.pindex * 8 + value.itemNo + 5 > value.totalNum) {
            this.removeCss();
            value.itemNo = 0;
            value.pindex++;
            this.movebar(value.pindex);
            getData(value.pindex, 8);
        } else {
            this.removeCss();
            if (value.itemNo < 4) {
                value.itemNo += 4;
                this.addCss();
                return;
            } else {
                value.itemNo += 4;
                value.itemNo = value.itemNo % 8;
                value.pindex++;
                this.movebar(value.pindex);
                getData(value.pindex, 8);
            }
        }
    },
    left: function() {
        if (value.itemNo === -1) return
        if (value.itemNo % 4 == 0) {
            this.removeCss();
            historical.addCss();
            areaObj = historical;
            return
        }
        this.removeCss()
        value.itemNo--
        this.addCss()
    },
    right: function() {
        if (value.itemNo === -1) return
        if (value.itemNo % 4 >= 3) return
        if (value.pindex * 8 + value.itemNo + 1 >= value.totalNum) return
        this.removeCss();
        value.itemNo++;
        this.addCss();
    },
    enter: function() {
        if (value.itemNo == -1) {
            if (value.currClass == 1) {
                console.log('清空');
                unity.delAllCollect(function(res) {
					// 清空收藏上报
                    try {
						var jsonOb = {}
						jsonOb.page_type = '0501'
						jsonOb.cid = ''
						jsonOb.click_type = '3'
                        bi.historical(jsonOb)
                    } catch (error) {
                        console.log('埋点异常', error)
                    }
                    console.log(res);
                    $('.his-clear').removeClass('writediv');
                    $(".total-page").html('');
                    $(".search-scroll").css({
                        "visibility": "hidden"
                    });
                    value.totalpage = 0;
                    value.totalNum = 0;
                    value.detailData = [];
                    $(".his-content ul").empty();
                    historical.addCss();
                    areaObj = historical;
                })
            } else {
                $.cookie('payList', '', { path: '/' });
                $('.his-clear').removeClass('writediv');
                $(".total-page").html('');
                $(".search-scroll").css({
                    "visibility": "hidden"
				});
				// 清空历史上报
                try {
					var jsonOb = {}
					jsonOb.page_type = '0601'
					jsonOb.cid = ''
					jsonOb.click_type = '3'
                    bi.historical(jsonOb)
                } catch (error) {
                    console.log('埋点异常', error)
                }
                value.totalpage = 0;
                value.totalNum = 0;
                value.detailData = [];
                $(".his-content ul").empty();
                historical.addCss();
                areaObj = historical;
            }
        } else {
            try {
				var jsonOb = {}
				if (value.currClass == 2) {
                    jsonOb.page_type = '0601'
					jsonOb.cid = value.detailData[value.itemNo].assetId
					jsonOb.click_type = '1'
				} else {
					jsonOb.page_type = '0501'
					jsonOb.cid = value.detailData[value.itemNo].relateId
					jsonOb.click_type = '1'
				}
                bi.historical(jsonOb)
            } catch (error) {
                console.log('埋点异常', error)
            }
            $(cookieHistory());
            var url = "historyHome.html?itemNo=" + value.currClass + "&pindex=" + value.pindex + "&contentItemNo=" + value.itemNo;
            var preURL = "../historyHome/" + url;
            history.replaceState(null, null, preURL) //状态缓存
            var paydetail = {};
            var detailUrl = "";
            $.cookie("preURL", preURL, { path: "/" });
            if (value.currClass == 1) {
                $.cookie('detailUrl', value.detailData[value.itemNo].relateUrl, { path: '/' });
            } else {
                var relateUrl = 'http://116.62.93.251/?s=22|11&p=yhAssetDetail&k=1&v=1&c=2&assetId=' + value.detailData[value.itemNo].assetId;
                $.cookie('detailUrl', relateUrl, { path: '/' });
                paydetail = unity.getPayDetail(value.detailData[value.itemNo].assetId);
            }
            if (value.detailData[value.itemNo].relateLayout === "Detail_Movie") {
                detailUrl = "../detail/movieDetail.html"
            } else {
                detailUrl = "../detail/seriesDetail.html"
            }
            
            if (paydetail.assetId) {
                // detailUrl = detailUrl + '?assetId=' + paydetail.assetId + '&g_palylong=' + paydetail.g_palylong + '&contentNum=' + paydetail.contentNum;
                detailUrl = detailUrl
            }
            window.location = detailUrl
        }
    },
    back: function() {
        window.location = "../index/home.html"
    }
}

areaObj = historical; //初始焦点赋值
$(value.getValue())
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
            // $(cookieHistory());
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