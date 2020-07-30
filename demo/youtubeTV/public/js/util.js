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
function backApk() {
  try {//关闭webview之后，类似将系统音频管理的权限给了标签使用），返回后焦点未被改变，网页任将获取音频的使用权限，导致音视频可能继续在后台播放
    clearVideo();
    getPlaylistIndex();
  } catch (error) {

  }
  window.location.href = '../../index.html'
  submitPrompt('exit');
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

// 方法1
function addClass(ele, cls) {
  if (ele.classList) {
    ele.classList.add(cls);
  } else {
    if (!this.hasClass(ele, cls)) ele.className += " " + cls;
  }

}
function arrIndexOf(arr, v) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] == v) {
      return i;
    }
  }
  return -1;
}
//删除指定dom元素的样式
function removeClass(ele, cls) {
  if (ele.classList) {
    ele.classList.remove(cls);
  } else {
    if (ele.className != '') {
      var arrClassName = ele.className.split(' ');
      var classIndex = arrIndexOf(arrClassName, cls);
      if (classIndex !== -1) {
        arrClassName.splice(classIndex, 1);
        ele.className = arrClassName.join(' ');
      }
    }
  }
}
//如果存在(不存在)，就删除(添加)一个样式
function toggleClass(ele, cls) {
  if (hasClass(ele, cls)) {
    removeClass(ele, cls);
  } else {
    addClass(ele, cls);
  }
}
function hasClass(tagStr, classStr) {
  if (tagStr.classList) {
    return tagStr.classList.contains(classStr);
  } else {
    var arr = tagStr.className.split(/\s+/); //这个正则表达式是因为class可以有多个,判断是否包含
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] == classStr) {
        return true;
      }
    }
    return false
  }
}
function getParam(_key, _url) {
  _url = _url || window.location.href;
  if (new RegExp('.*\\b' + _key + '\\b(\\s*=([^&]+)).*', 'gi').test(_url)) {
    return RegExp.$2;
  } else {
    return null;
  }
}
//计算字符长度
function strlen(str) {
  var len = 0;
  for (var i = 0; i < str.length; i++) {
    var c = str.charCodeAt(i);
    //单字节加1
    if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
      len++;
    }
    else {
      len += 2;
    }
  }
  return parseInt(len / 2);
}
function setSession(key, obj) {
  window.sessionStorage.setItem(key, obj)
}
function getSession(key) {
  return window.sessionStorage.getItem(key) || '';
}
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
  54: "six", // 测试入口
};
//按键分发事件
var onKeyPress;
//按键prev处理函数
var grepEvent = function (e) {
  event.preventDefault();
  if (grepEvent.isPress) return;
  grepEvent.isPress = true;
  setTimeout(function () {
    grepEvent.isPress = false;
  }, 100);
  var keyCode = e.keyCode || e.which;
  return onKeyPress(KEYMAP[keyCode]);
};
function lazyLoadImage() {
  //获取全部带有data-img的img
  var limg = document.querySelectorAll("img[data-img]")
  var timer;
  // Array.prototype.forEach.call()是一种快速的方法访问forEach，并将空数组的this换成想要遍历的list
  timer && clearTimeout(timer);
  timer = setTimeout(function () {
    Array.prototype.forEach.call(limg, function (item, index) {
      var rect
      //假如data-img为空跳出
      if (item.getAttribute("data-img") === "")
        return
      //getBoundingClientRect用于获取某个元素相对于视窗的位置集合。集合中有top, right, bottom, left等属性。
      rect = item.getBoundingClientRect()
      // 图片一进入可视区，动态加载
      if (rect.bottom >= 0) {
        (function () {
          //给图片添加过渡效果，让图片显示
          var img = new Image()
          img.src = item.getAttribute("data-img")
          item.src = img.src
          item.removeAttribute('data-img')
        })()
      }
    })
  }, 100)
}
// 日期操作 
Date.prototype.format = function (fmt) {
  var o = {
    'M+': this.getMonth() + 1, // 月份
    'd+': this.getDate(), // 日
    'h+': this.getHours(), // 小时
    'm+': this.getMinutes(), // 分
    's+': this.getSeconds(), // 秒
    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
    S: this.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      )
    }
  }
  return fmt
}

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
//toast
var toastTimer = null;
function toast(msg) {
  var div = document.createElement('div');
  var div1 = document.createElement('div');
  var body = document.body;
  if (toastTimer) {
    clearTimeout(toastTimer);
  }
  if (getId('toast')) {
    body.removeChild(getId('toast'));
  }
  div.id = "toast";
  // div.style.cssText = "position: absolute; top: 50%; left: 50%;  -webkit-transform: translate(-50%,-50%);-ms-transform: translate(-50%,-50%);transform:translate(-50%,-50%); text-align:center;z-index:999;word-break: break-all; word-wrap: break-word;";
  div.style.cssText = "position: absolute;bottom: 10%;right: 10%;  -webkit-transform: translate(-50%,-50%);-ms-transform: translate(-50%,-50%);transform:translate(-50%,-50%); text-align:center;z-index:999;word-break: break-all; word-wrap: break-word;";
  div1.style.cssText = "display:inline-block;background:rgba(1,1,1,0.6); color:#fff; padding:20px; min-width:120px; text-align:center; font-size:22px; border-radius:5px;height100%;width: 100%;word-wrap: break-word;";
  div1.textContent = msg;
  div.appendChild(div1);
  body.appendChild(div);
  toastTimer = setTimeout(function () {
    if (getId('toast')) {
      body.removeChild(getId('toast'));
    }
  }, 3000);
}

function nextRouter(item) {
  var url = item.jsonUrl;
  if (item.assetFrom == 18) {
    if (value.detailData.detail.assetType == 'Movie') {
      //电影
      window.location.href = './moveDetail.html?detailUrl=' + encodeURIComponent(url);
    } else if (value.detailData.detail.assetType == 'Series') {
      //电视剧
      window.location.href = './seriesDetail.html?detailUrl=' + encodeURIComponent(url);
    } else if (value.detailData.detail.assetType == 'Column') {
      //娱乐
      window.location.href = './happyDetail.html?detailUrl=' + encodeURIComponent(url);
    }
  } else {
    url = url + '&layout=' + item.layout
    if (item.assetType) {
      submitPrompt('openDetail', { url: encodeURIComponent(url) });
    } else {
      submitPrompt('openSubject', { url: encodeURIComponent(url) });
    }
  }
}
function nextClass(str, classMame, callBack) {
  // 上下切换焦点使用，模块无，则略过
  if (str == 'up') {
    if (classMame == 'recommend') {
      if (value.recommendList.length > 0) {
        recommend.init();
      } else if (value.subjectsList.length > 0) {
        subjects.init();
      } else {
        topContent.init();
        minPlayVideo();
      }

    } else if (classMame == 'subjects') {
      if (value.subjectsList.length > 0) {
        subjects.init();
      } else {
        topContent.init();
        minPlayVideo();
      }
    } else {
      topContent.init();
      minPlayVideo();
    }
  } else {
    if (classMame == 'subjects') {
      if (value.subjectsList.length > 0) {
        subjects.init();
        minPauseVideo();
      } else if (value.recommendList.length > 0) {
        recommend.init();
        minPauseVideo();
      } else if (value.actorsList.length > 0) {
        actors.init();
        minPauseVideo();
      } else {
        callBack && callBack();
      }
    } else if (classMame == 'recommend') {
      if (value.recommendList.length > 0) {
        recommend.init();
        minPauseVideo();
      } else if (value.actorsList.length > 0) {
        actors.init();
        minPauseVideo();
      } else {
        callBack && callBack();
      }
    } else if (classMame == 'actors') {
      if (value.actorsList.length > 0) {
        actors.init();
        minPauseVideo();
      } else {
        callBack && callBack();
      }
    }
  }
}