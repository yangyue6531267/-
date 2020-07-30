function ajax (options) {
  options = options || {};
  options.type = (options.type || "GET").toUpperCase();
  options.dataType = options.dataType || "json";
  options.contentType = options.contentType || "x-www-form-urlencoded";
  // var params = formatParams(options.data);
  var params = options.data;
  //创建xhr对象 - 非IE6
  if (window.XMLHttpRequest) {
    var xhr = new XMLHttpRequest();
  } else { //IE6及其以下版本浏览器
    var xhr = new ActiveXObject('Microsoft.XMLHTTP');
  }
  //GET POST 两种请求方式
  if (options.type == "GET") {
    // xhr.open("GET", options.url + "?" + params, true);
    xhr.open("GET", options.url, true);
    xhr.send(null);
  } else if (options.type == "POST") {
    xhr.open("POST", options.url, true);
    //设置表单提交时的内容类型    
    xhr.setRequestHeader("Content-Type", options.contentType + ";charset=utf-8");
    xhr.send(params);
    // console.log(params);
  }
  //接收
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      var status = xhr.status;
      if (status >= 200 && status < 300) {
        options.success && options.success(xhr.responseText);
      } else {
        options.fail && options.fail(status);
      }
    }
  }
}
//格式化参数
function formatParams (data) {
  var arr = [];
  for (var name in data) {
    arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
  }
  // 参数随机化,不缓存
  arr.push(("v=" + Math.random()).replace(".", ""));
  return arr.join("&");
}
function jsonp(options) {
  options = options || {};
  if (!options.url || !options.callback) {
      throw new Error("参数不合法");
  }

  //创建 script 标签并加入到页面中
  var callbackName = options.callback;
  var oHead = document.getElementsByTagName('head')[0];
  // options.data[options.callback] = callbackName;
  var params = formatParams(options.data);
  var oS = document.createElement('script');
  oHead.appendChild(oS);

  //创建jsonp回调函数
  window[callbackName] = function (json) {
      oHead.removeChild(oS);
      clearTimeout(oS.timer);
      window[callbackName] = null;
      options.success && options.success(json);
  };

  //发送请求
  oS.src = options.url ;

  //超时处理
  if (options.time) {
      oS.timer = setTimeout(function () {
          window[callbackName] = null;
          oHead.removeChild(oS);
          options.fail && options.fail({ message: "超时" });
      }, options.time);
  }
};

//格式化参数
function formatParams(data) {
  var arr = [];
  for (var name in data) {
      arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[i]));
  }
  return arr.join('&');
}

// 调用方式
// ajax({
//   url: "data.json",
//   type: "GET",
//   data: {},
//   dataType: "json",
//   success: function (response) {
//     // 此处放成功后执行的代码
//     // 解析返回的字符串 转为json对象
//     var usingdata = eval("(" + response + ")").data;
//   }
//   fail: function (status) {
//     // 此处放失败后执行的代码
//   }
// });