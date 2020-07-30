// 判断类型的方法
function judgeObj(obj) {
    return Object.prototype.toString.call(obj).slice(8, -1)
  };

  
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