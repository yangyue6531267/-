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

// 调用方式
// ajax({
//   url: "data.json",
//   type: "GET",
//   data: {},
//   dataType: "json",
//   success: function (response) {
//     // 此处放成功后执行的代码
//     // 解析返回的字符串 转为json对象
//     var usingdata = JSON.parse(response).data;
//   }
//   fail: function (status) {
//     // 此处放失败后执行的代码
//   }
// });