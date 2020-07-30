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