var enter_time = new Date().getTime()
var special = {};
special.itNum = 0;
special.isBackUrl = false;
special.Num = 0;
special.data = {};
special.url = "";
special.isSC = true;
special.specialDataList = {};
special.cache = null;
if (getQueryString('specialId')) {
  //外链跳转专题页面
  special.isBackUrl = true;
  special.url = baseUrl + 'p=yhSpecialDetail&k=1&v=1&specialId=' + getQueryString("specialId") + '&c=12'
  appraisal();
  try {
    bi.start('0202');
    commonParams.page_type = '0801';
    commonParams.page_id = getQueryString("specialId");
    bi.jump(commonParams, 'no')
  } catch (error) {

  }
} else if (Cookies.get('INDEXY')) {
  special.cache = eval('(' + Cookies.get('INDEXY') + ')');
  // console.log(special.cache);
  special.url = special.cache.url;
  special.itNum = (special.cache.x) * 1;
  special.Num = (special.cache.y) * 1;
} else if (Cookies.get('detailUrl')) {
  special.url = Cookies.get('detailUrl');
} else {
  window.location.href = '../../index.html';
}
var backUrl = getQueryString('backURL');
if (backUrl) {
  Cookies.set('homePage', backUrl, {
    path: '/'
  })
}

if (playConfig.stbType == "p30") {
  getId("specail_List").className = "specail_List specail_ListP30";
}

if (playConfig.stbType == "3.0") {
  getId("input").className = "top_input top_input30";
}
// if (!special.url) {
//   special.url = "http://47.97.96.103/?s=116|14&p=yhSpecialDetail&k=1&v=1&specialId=205780&c=14"
// }
document.body.parentNode.style.overflow = "hidden";
function init() {
  // 收藏历史记录页点击后上报数据
  if (Cookies.get('historyJumpUpload')) {
    bi.historical(Cookies.get('historyJumpUpload'));
    Cookies.del('historyJumpUpload', '/')
  };
  getYhSpecialList_nc(
    special.url, function (response) {
      special.data = eval('(' + response + ')').data;
      special.specialDataList = split_array(special.data.elementList, 6);
      special.initList(special.specialDataList);
      // 页面初始化时上传访问页面日志
      if (Cookies.get('parent_page_type')) {
        try {
          commonParams.page_type = '0801';
          commonParams.page_id = special.data.specialId;
          bi.jump(commonParams)
        } catch (e) {
          toast('错误信息' + e)
        }
      }
      try {
        var accessTime = formatDate();
        var Paramet = yh.userId + '|xdf|' + accessTime + '|1|专题页|2';
        // 重庆局方数据上报-页面访问
        bi.CQlogup(Paramet);
      } catch (e) { }
      var bg = document.body;
      var text = document.getElementById('top_text');
      text.innerHTML = special.data.specialName;
      if (special.data.specialImg) {
        bg.style.backgroundImage = "url(" + special.data.specialImg + ")";
      } else {
        bg.style.backgroundColor = "#00605D";
      }
      var bottom = document.getElementById("special_bottom");
      if (special.specialDataList.length <= 1) {
        bottom.style.visibility = "hidden";
        getId('botton-num').style.visibility = "hidden";
      } else {
        bottom.children[0].style.width = 915 / special.specialDataList.length + "px";
      }
      if (special.itNum + 1 > 1) {
        bottom.children[0].style.marginLeft = (915 / special.specialDataList.length) * special.itNum + "px";
      }
      // special.areaObj();
      // var lists = document.getElementById("specail_List");
      // lists.children[special.Num].className = "list_center hover"
      special.addCss();
      collectData();
      getId('botton-num').innerHTML = "" + (special.itNum + 1) + '/' + special.specialDataList.length + "";
    }
  )
}

function addFav(data, callBackFunction) {
  var urls = historylUrl + '/collect?version=1';
  getYhSpecialSC(urls, data, function (response) {
    callBackFunction(response)
  })
}

function delCookie(name) {
  var exp = new Date();
  exp.setTime(exp.getTime() - 10000);
  var cval = Cookies.get(name);
  if (cval != null)
    document.cookie = name + "=" + cval + ";path=/; expires = " + exp.toGMTString();
}

function removeFav(data, callBackFunction) {
  var urls = historylUrl + '/del?version=1';
  getYhSpecialSC(urls, data, function (response) {
    callBackFunction(response)
  })
}

function collectData() {
  var url = historylUrl +
    "/list?version=1&siteId=" + yh.siteId + "&userId=" + yh.userId +
    "&relateId=" + special.data.specialId + "&collectType=2"
  // console.log(url);
  getYhSpecialList_nc(url, function (res) {
    // console.log(res);
    if (typeof (res) == "string") {
      res = eval('(' + res + ')');
    }
    var lists = document.getElementById("input");
    if (res.data.resultNum == 1) {
      special.isSC = false;
      lists.children[0].src = './1837.png'
    } else {
      special.isSC = true;
      lists.children[0].src = './1838.png'
    }
  })
}

function split_array(arr, len) {
  var a_len = arr.length;
  var result = [];
  for (var i = 0; i < a_len; i += len) {
    result.push(arr.slice(i, i + len));
  }
  return result;
}

init();

special.initList = function (list) {
  var div = '';
  var lists = document.getElementById("specail_List");
  lists.innerHTML = '';
  for (var index = 0; index < list[special.itNum].length; index++) {
    var elementDom = list[special.itNum][index];
    if (elementDom.elementImg) {
      image = elementDom.elementImg
    } else {
      image = "url(./source/public/images/index/recommendi-nit.png)";
    }
    div1 = "<div 'jsonUrl='" + elementDom.jsonUrl + "'type='" + elementDom.elementType
      + "'layout='" + elementDom.layout + "'name = '" + elementDom.elementName + "'id='list_center_" + index + "'class = 'list_center list_center" + index + "'><img src='" + image + "'></div>"
    div += div1
  }
  lists.innerHTML += div
}

special.removeCss = function () {
  removeClass(getId('list_center_' + this.Num), 'hover');
  // var lists = document.getElementById("specail_List");
  // lists.children[this.Num].className = "list_center";
}

special.addCss = function () {
  toggleClass(getId('list_center_' + this.Num), 'hover');
  // var lists = document.getElementById("specail_List");
  // lists.children[this.Num].className = "list_center hover";
}

special.right = function () {
  if (this.isTop) return;
  if (this.Num >= 5) {
    if (this.itNum < this.specialDataList.length - 1) {
      this.removeCss();
      this.Num = 0;
      this.itNum++;
      var bottom = document.getElementById("special_bottom");
      bottom.children[0].style.marginLeft = (915 / special.specialDataList.length) * this.itNum + "px";
      getId('botton-num').innerHTML = "" + (this.itNum + 1) + '/' + special.specialDataList.length + "";
      // bottom.children[1].innerHTML = (this.itNum + 1) + '/' + special.specialDataList.length;
      special.initList(this.specialDataList);
      this.addCss();
    } else {
      return
    }
  } else if (this.Num < this.specialDataList[this.itNum].length - 1) {
    this.removeCss();
    this.Num++;
    this.addCss();
  } else {
    return
  }
}

special.left = function () {
  if (this.isTop) return;
  if (this.Num <= 0) {
    if (this.itNum > 0) {
      this.removeCss();
      this.Num = 5;
      this.itNum--;
      var bottom = document.getElementById("special_bottom");
      bottom.children[0].style.marginLeft = (915 / special.specialDataList.length) * this.itNum + "px";
      getId('botton-num').innerHTML = "" + (this.itNum + 1) + '/' + special.specialDataList.length + "";
      special.initList(this.specialDataList);
      this.addCss();
    } else {
      return
    }
  } else {
    this.removeCss();
    this.Num--;
    this.addCss();
  }
}

special.up = function () {
  if (this.isTop) return;
  this.isTop = true;
  this.removeCss();
  toggleClass(getId('input'), 'hover')
}

special.down = function () {
  if (!this.isTop) return;
  this.isTop = false;
  this.addCss();
  removeClass(getId('input'), 'hover')
}
special.enter = function () {
  if (this.isTop) {
    var lists = document.getElementById("input");
    if (special.isSC) {
      lists.children[0].src = './1837.png'
      var collectType = '2'; //收藏类型(0-主播,1-资产,2-专题)
      var relateId = special.data.specialId;
      var relateTitle = special.data.specialName;
      var relateImg = special.data.coverimage;
      var relateUrl = special.url;
      var relateLayout = 'Subject_Detail_TP1';

      var data = '{"siteId":' + '"' + yh.siteId + '"' + ',"userId":' + '"' + yh.userId + '"' + ',"collectType":' + '"' + collectType + '"' + ',"relateId":' + '"' + relateId + '"' + ',"relateTitle":' + '"' + relateTitle + '"' + ',"relateImg":' + '"' + relateImg + '"' + ',"relateUrl":' + '"' + relateUrl + '"' + ',"relateLayout":' + '"' + relateLayout + '"' + '}';
      addFav(data, function (rsp) {
        if (rsp.indexOf('success') !== -1) {
          special.isSC = false;
          try {
            commonParams.collect = '1';
            commonParams.cid = special.data.specialId;
            commonParams.click_type = '2';
            bi.collection(commonParams)
          } catch (e) {
            toast('错误信息' + e)
          }
        } else {
          toast('添加收藏失败')
        }
      });
    } else {
      lists.children[0].src = './1838.png'
      var collectType = '2'; //收藏类型(0-主播,1-资产,2-专题)
      var relateId = special.data.specialId;

      var data = '{"siteId":' + '"' + yh.siteId + '"' + ',"userId":' + '"' + yh.userId + '"' + ',"collectType":' + '"' + collectType + '"' + ',"relateId":' + '"' + relateId + '"' + '}';
      removeFav(data, function (rsp) {
        if (rsp.indexOf('success') !== -1) {
          special.isSC = true;
          // 取消收藏栏目时上报
          try {
            commonParams.collect = '2';
            commonParams.cid = special.data.specialId;
            commonParams.click_type = '2';
            bi.collection(commonParams)
          } catch (e) {
            toast('错误信息' + e)
          }
        } else {
          toast('删除收藏失败')
        }
      });
    }
  } else {
    var xy = '{"x":' + '"' + this.itNum + '"' + ',"y":' + '"' + this.Num + '"' + ',"url":' + '"' + this.url + '"' + '}';
    // document.cookie = 'detailUrl=' + this.specialDataList[this.itNum][this.Num].jsonUrl + ';path=/';
    // document.cookie = 'backUrl=./../special/index.html;path=/';
    // document.cookie = 'INDEXY=' + xy;

    Cookies.set("detailUrl", this.specialDataList[this.itNum][this.Num].jsonUrl, { path: '/' });
    Cookies.set("INDEXY", xy, { path: '/' });
    Cookies.set("backUrl", './../special/index.html', { path: '/' });
    Cookies.set('parent_page_type', '0801', { path: '/' });
    Cookies.set('parent_page_id', special.data.specialId, { path: '/' })
    //  点击资产时上报
    // try {
    //   commonParams.page_type = '0801'
    //   commonParams.page_id = special.data.specialId
    //   commonParams.event = '104';
    //   commonParams.parent_page_type = Cookies.get('parent_page_type')?Cookies.get('parent_page_type'):'null';
    //   commonParams.parent_page_id = Cookies.get('parent_page_id')?Cookies.get('parent_page_id'):'nnull';
    //   var jumpData = '"event":' + '"' + commonParams.event + '"' + ',"parent_page_type":'
    //   + '"' + commonParams.parent_page_type + '"' + ',"parent_page_id":' + '"' + commonParams.parent_page_id + '"'
    //   + ',"page_type": ' + '"' + commonParams.page_type + '"' + ',"page_id":' + '"'
    //   + commonParams.page_id + '"' ;
    //   if(Cookies.get('JumpUpload')){
    //     Cookies.del('JumpUpload');
    //   };
    //   Cookies.set('JumpUpload',jumpData,{path:'/'});
    // } catch (e) {

    // }

    window.location.href = "./../detail/detail.html"

  }
}
special.back = function () {
  //返回
  if (special.isBackUrl == true) {
    goBack();
    return
  }
  if (Cookies.get('INDEXY')) {
    delCookie('INDEXY');
  }
  if (Cookies.get('twoStageBackUrl')) {
    window.location.href = Cookies.get('twoStageBackUrl');
  } else {
    window.location.href = '../../index.html';
  }
}


areaObj = special; //初始焦点赋值

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
      if (Cookies.get('parent_page_type')) {
        Cookies.del('parent_page_type', '/');
      };
      if (Cookies.get('parent_page_id')) {
        Cookies.del('parent_page_id', '/');
      };
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