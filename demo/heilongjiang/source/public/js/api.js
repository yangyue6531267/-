 var HOST = {
   //设置模式
   ptStyle: "DEV",
   ptHost: function () {
     if (this.ptStyle == "RELEASE") {
       //发布模式
       return "/";
     } else if (this.ptStyle == "DEV") {
       //开发模式
       return "http://47.97.96.103/";
     }
   }
 };
 var jsonp =function(url,successfn,errfn) {
   var header = HOST.ptHost(); 
   var jsonUrl = header + url + "&returnType=jsonp"
   $.ajax({ // 入口数据
     type: "get",
     url: jsonUrl,
     dataType: "jsonp", //指定服务器返回的数据类型
     jsonp: 'jsonpCallback',
     jsonpCallback: 'callback' + new Date().getTime(),
     success:successfn,
     error:errfn,
   });
 }