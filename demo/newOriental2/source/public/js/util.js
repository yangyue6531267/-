function getElement( elementName ){
  if( typeof elementName != 'string' ) return console.log('传入的元素名称必须是字符串')
  return document.querySelector( elementName );
}

function splitArray( arr,size ){
  if(!arr.length || !typeof arr == 'object'){
    return [];
  }
  var segs = [];
  for( var i = 0,len = arr.length; i < len; i+= size ){
    if( i + size> arr.length - 1){
      segs.push( arr.slice(i) );
    } else {
      segs.push( arr.slice(i, i + size) );
    }
  }
  return segs;
}

function groupingArr( arr, key ){
  if( !arr.length ){
    return [];
  }
  var groupObj = {};
  for( var i = 0,len = arr.length; i < len; i++ ){
    var letters = arr[i][key];
    if( letters ){
      if( groupObj[letters] ){
        groupObj[letters].push( arr[i] );
      } else {
        groupObj[letters] = [arr[i]];
      }
    }
  }

  var groupArr = [];
  for( var j in groupObj ){
    groupArr.push({
      title: j,
      list: splitArray(groupObj[j],6)
    })
  }

  groupArr = groupArr.sort( function( a,b ){
    return a.title[0].localeCompare(b.title[0]);
  })

  return groupArr || [];
}

function groupArrByTime( arr, key ){
  if( !arr.length ){
    return [];
  }
  var timeLine = ['今天','昨天','前天'];
  var groupObj = {};
  var now = Date.now();
  for( var i = 0, len = arr.length; i < len; i ++ ){
    var date = arr[i][key].split(' ')[0];
    var between = now - new Date( date ).getTime();
    var pastDay = parseInt(between / 1000 / 60 / 60 / 24);
    var letters = '';
    if( pastDay > timeLine.length - 1 ){
      letters = date;
    } else {
      letters = timeLine[pastDay];
    }
    
    if( groupObj[letters] ){
      groupObj[letters].list.push( arr[i] );
    } else {
      groupObj[letters] = {
        timeSort: between,
        list:[arr[i]]
      };
    }
  }
  
  var groupArr = [];
  for ( var j in groupObj ){
    groupArr.push({
      title:j,
      timeSort: groupObj[j].timeSort,
      list: splitArray(groupObj[j].list,6)
    })
  }
  
  groupArr = groupArr.sort(function( a,b ){
    return a.timeSort - b.timeSort
  })

  return groupArr || [];
}

function segsArr( arr,key ){
  if( !arr.length ){
    return {
      a:[],
      s:[]
    };
  }
  var a = arr;
  var s = [];
  for( var i = 0; i < arr.length; i++ ){
    console.log(a[i]);
    if( a[i][key] ){
      s.push( a[i] );
      a.splice( i, 1 );
    }
  }
  return {
    a: a,
    s: s
  }
}

//获取url参数
var getUrlParam = (function(){
  var href = window.location.href;
  var obj = null;
  var list;
  return function(){  
    var arg = arguments[0];
    if( !obj ){
      obj = {};
      if( href.indexOf('?') > -1 ){
        var str = href.split('?')[1];
        list = str.split('&');
        for( var i = 0,len =list.length; i < len; i++ ){
          var item = list[i].split('=');
          obj[item[0]] = item[1];
        }
      }
    }
    return obj[arg] || '';
  }
})();


function getRelateTime() {
  function format( time ){
    return time >= 10 ? time : '0' + time;
  }
   var date = new Date( Date.now() );
   var year = format(date.getFullYear());
   var month = format(date.getMonth() +1);
   var day = format(date.getDate());
   var hour = format(date.getHours());
   var min = format(date.getMinutes());
   var sec = format(date.getSeconds());
   return [ year,month,day ].join('-') + ' ' + [ hour, min, sec].join(':');
 }

//遍历对象生成url字符串
function objToUrl ( obj, has ){
  if( typeof obj != 'object' ) {
    return;
  }
  var str =  has ? '' : '?';
  for( var key in obj ){
    str += key + '=' + obj[key] + '&';
  }
  str = str.slice( 0, str.length - 1 );
  return str || '';
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
  function addClass(ele, cls) {
    if (ele.classList) {
      ele.classList.add(cls);
    } else {
      if (!this.hasClass(ele, cls)) ele.className += " " + cls;
    }
  
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
//获取url参数
function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}

// 懒加载
function imgLazyLoad () { 
  var timer,
    len = document.querySelectorAll('img').length;

  function getPos(node) {
    var scrollx = document.documentElement.scrollLeft || document.body.scrollLeft,
      scrollt = document.documentElement.scrollTop || document.body.scrollTop;
    var pos = node.getBoundingClientRect();
    return {
      top: pos.top + scrollt,
      right: pos.right + scrollx,
      bottom: pos.bottom + scrollt,
      left: pos.left + scrollx
    }
  }

  function loading() {
    timer && clearTimeout(timer);
    timer = setTimeout(function () {
      var scrollTop = document.documentElement.scrollTop || document.body.scrollTop,imgs = document.querySelectorAll('img.lazyload');
      screenHeight = document.documentElement.clientHeight;
      for (var i = 0; i < imgs.length; i++) {
        var pos = getPos(imgs[i]),
          posT = pos.top,
          posB = pos.bottom,
          screenTop = screenHeight + scrollTop;
        if ((posT > scrollTop && posT < screenTop) || (posB > scrollTop && posB < screenTop)) {
          imgs[i].src = imgs[i].getAttribute('data-img');
          imgs[i].classList.remove('lazyload')
        } else {
          new Image().src = imgs[i].getAttribute('data-img');
        }
      }
    }, 100);
  }
  if (!len) return;
  loading();
  window.addEventListener('scroll',function () {  
    if (!document.querySelectorAll('img.lazyload').length) {
      return;
    } else {
      loading();
    }
  })
  window.addEventListener('resize',function () {  
    if (!document.querySelectorAll('img.lazyload').length) {
      return;
    } else {
      loading();
    }
  })
 }
//  处理各组件里面的健值逻辑
function handleCoponentsKey (dataList,coponentId,state) {  
for (var i = 0; i < dataList.length; i++) {
  if(coponentId == dataList[i]){
    if(state == 'up'){
      return i-1;
    }else if(state == 'down'){
      if(i == dataList.length-1){
        return ;
      }
      return i+1;
    }
  }

}
}
// 页面滚动
function pageScroll (ele,state,height){
  if(state=='down'){
    height += document.querySelector('.'+ele).offsetHeight
    var scrollY  = $('#recommend').position().top-20; // 距离顶部窗口的距离需要减去
    if(height>650){
      var _temp = height-500;
      scrollY = Math.round(scrollY-_temp);
      console.log("down:"+scrollY);
      Home.scrollArr.push(scrollY)
      console.log(Home.scrollArr)
      document.querySelector('#recommend').style.top = scrollY + 'px';
    }
  }else if(state=='up'){
    var k = null;
    if(Home.scrollArr.length == 1){
      k = 0;
    }else{
      k =Home.scrollArr[Home.scrollArr.length-2]
    }
    document.querySelector('#recommend').style.top =  k+ 'px';
    Home.scrollArr.pop();
    console.log(Home.scrollArr)   
  }
imgLazyLoad(); // 懒加载
}

function eleOffsetTop(ele){
  return $(ele).offset().top; 
}
function routeJump(type,backUrl,jsonUrl) { 
  Cookies.set("backUrl", backUrl, { path: '/' });
  Cookies.set('scrollArr',JSON.stringify(Home.scrollArr),{ path: '/' })
  if(type == 1){
    // 详情页
    Cookies.set('detailUrl', jsonUrl, { path: '/' })
    window.location.href = 'source/detail/detail.html';
  }else if(type == 7){
    window.location.href = 'source/filter/filter.html';
  }
 }
