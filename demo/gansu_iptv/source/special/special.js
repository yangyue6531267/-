var enter_time = new Date().getTime()
var special = {};
special.itNum = 0;
special.Num = 0;
special.data = {};
special.url = "";
special.isSC = true;
special.specialDataList = {};
special.cache = null;

if (getQueryString('specialId')) {
  //外链跳转专题页面
  special.url = baseUrl + 'p=yhSpecialDetail&k=1&v=1&specialId=' + getQueryString("specialId") + '&c=13'
  init();
  try {
    bi.start('0201');
  } catch (error) {

  }
} else if (Cookies.get('INDEXY')) {
  special.cache = eval('(' + Cookies.get('INDEXY') + ')');
  // console.log(special.cache);
  special.url = special.cache.url;
  special.itNum = (special.cache.x) * 1;
  special.Num = (special.cache.y) * 1;
  init();
} else if (Cookies.get('detailUrl')) {
  special.url = Cookies.get('detailUrl');
  init();
}
document.body.parentNode.style.overflow = "hidden";
function init() {
  getYhSpecialList_nc(
    special.url, function (response) {
      special.data = response.data;
      special.specialDataList = split_array(special.data.elementList, 6);
      special.initList(special.specialDataList);
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

      // 页面访问上报 
      var jump = Cookies.get('jump')
      if(jump) {
        jump = eval('(' + jump + ')')
        try {
          var jsonOb = {}
          jsonOb.page_type = '0801'
          jsonOb.page_id = response.data.specialId
          jsonOb.parent_page_type = jump.parent_page_type
          jsonOb.parent_page_id = jump.parent_page_id
          bi.jump(jsonOb)
          Cookies.set('jump', '', {path: '/'})
        } catch (error) {
          console.log('埋点错误', error)
        }
      }
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
  exp.setTime(exp.getTime() - 1);
  var cval = Cookies.get(name);
  if (cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
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
    if (res.data.resultNum == 1) {
      special.isSC = false;
      getId("specialIcon").style.backgroundImage = "url(./1837.png)";
    } else {
      special.isSC = true;
      getId("specialIcon").style.backgroundImage = "url(./1838.png)";
    }
  },function(error){
    console.log(error)
  },true)
}

function split_array(arr, len) {
  var a_len = arr.length;
  var result = [];
  for (var i = 0; i < a_len; i += len) {
    result.push(arr.slice(i, i + len));
  }
  return result;
}


special.initList = function (list) {
  var div = '';
  var lists = getId("specail_List");
  lists.innerHTML = '';
  var image = '';
  var length = list[special.itNum].length
  for (var index = 0; index < length; index++) {

    var elementDom = list[special.itNum][index];
    // if (elementDom.elementImg) {
    // image = elementDom.elementImg
    // } else {
    //   image = "./source/public/images/index/img_loading_160x230.png";
    // }
    div += "<div 'jsonUrl='" + elementDom.jsonUrl + "'type='" + elementDom.elementType
      + "'layout='" + elementDom.layout + "'name = '" + elementDom.elementName + "'id='list_center_" + index + "'class = 'list_center list_center" + index + "'><img src='../public/images/img_loading_160x230.png'  data-img='" + elementDom.elementImg + "'/></div>"
  }
  lists.innerHTML += div
  lazyLoadImage();
}

special.removeCss = function () {
  removeClass(getId('list_center_' + this.Num), 'hover');
}

special.addCss = function () {
  toggleClass(getId('list_center_' + this.Num), 'hover');
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
    if (special.isSC) {
      getId("specialIcon").style.backgroundImage = "url(./1837.png)";
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
            console.log('错误信息' + e)
          }
        } else {
          console.log('添加收藏失败')
        }
      });
    } else {
      getId("specialIcon").style.backgroundImage = "url(./1838.png)";
      var collectType = '2'; //收藏类型(0-主播,1-资产,2-专题)
      var relateId = special.data.specialId;

      var data = '{"siteId":' + '"' + yh.siteId + '"' + ',"userId":' + '"' + yh.userId + '"' + ',"collectType":' + '"' + collectType + '"' + ',"relateId":' + '"' + relateId + '"' + '}';
      removeFav(data, function (rsp) {
        if (rsp.indexOf('success') !== -1) {
          special.isSC = true;

          try {
            commonParams.collect = '2';
            commonParams.cid = special.data.specialId;
            commonParams.click_type = '2';
            bi.collection(commonParams)
          } catch (e) {
            console.log('错误信息' + e)
          }
        } else {
          console.log('删除收藏失败')
        }
      });
    }
  } else {
    var xy = '{"x":' + '"' + this.itNum + '"' + ',"y":' + '"' + this.Num + '"' + ',"url":' + '"' + this.url + '"' + '}';
    document.cookie = 'detailUrl=' + this.specialDataList[this.itNum][this.Num].jsonUrl + ';path=/';
    document.cookie = 'backUrl=./../special/index.html;path=/';
    document.cookie = 'INDEXY=' + xy;

    // 页面访问储存
    var jump = {
      parent_page_type: '0801',
      parent_page_id: special.data.specialId
    }
    jump = JSON.stringify(jump)
    Cookies.set('jump', jump, {path: '/'})

    window.location.href = "./../detail/detail.html"
  }
}
special.back = function () {
  if (Cookies.get('INDEXY')) {
    delCookie('INDEXY');
  }
  if (Cookies.get('twoStageBackUrl')) {
    window.location.href = Cookies.get('twoStageBackUrl')
  } else {
    window.location.href = '../../index.html';
  }
}

function acceptBack() {
  areaObj.back();
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
      acceptBack();
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