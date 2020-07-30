// 推荐位模板

var recommend = {};

recommend.id = 0;

recommend.name = 'Education_Recommend';

recommend.data = {};

recommend.itemNo = 0;

recommend.pos = 0;

recommend.getCurr = function () {
  return getId('recommend-child-' + this.pos + '-' + this.itemNo);
};


recommend.up = function (params) {
  // 当区域为0时
  if (this.pos === 0) {
    removeClass(this.getCurr(), 'hover');
    if (this.itemNo === 2 || this.itemNo === 5) {
      this.itemNo--;
    } else {
      // 移动到栏目导航
      this.itemNo = 0;
      Home.init(1);
      return;
    }
    toggleClass(this.getCurr(), 'hover');
  } else if (this.pos === 1) {
    removeClass(this.getCurr(), 'hover');
    this.pos = 0;
    if (this.itemNo === 1) {
      this.itemNo = 2;
    } else if (this.itemNo === 2) {
      this.itemNo = 5;
    } else {
      this.itemNo = 0;
    }
    toggleClass(this.getCurr(), 'hover');
  }
}

recommend.down = function (params) {
  // 当区域为0时
  if (this.pos === 0) {
    removeClass(this.getCurr(), 'hover');
    if (this.itemNo === 1 || this.itemNo === 4) {
      this.itemNo++;
    } else {
      this.pos = 1;
      this.itemNo = 0;
    }
    toggleClass(this.getCurr(), 'hover');
  }
}

recommend.left = function (params) {
  // 当区域为0时
  if (this.itemNo == 0) {
    if (Home.itemNo == 0) return
    removeClass(Home.getCurr(), 'select');
    Home.itemNo--;
    toggleClass(Home.getCurr(), 'select');
    Home.getColumnData(uploadFocus)

    return
  }
  if (this.pos === 0) {
    removeClass(this.getCurr(), 'hover');
    if (this.itemNo === 5 || this.itemNo === 3 || this.itemNo === 2) {
      this.itemNo -= 2;
    } else {
      this.itemNo--;
    }
    toggleClass(this.getCurr(), 'hover');
  } else if (this.pos === 1) {
    removeClass(this.getCurr(), 'hover');
    this.itemNo--;
    toggleClass(this.getCurr(), 'hover');
  }
}

recommend.right = function (params) {
  // 当区域为0时
  if (this.pos === 0) {
    if (this.itemNo == 4 || this.itemNo == 5) {
      if (Home.itemNo == Home.data.length - 1) return
      childrenClass.itemNo = 0;
      childrenClass.pos = 0;
      removeClass(Home.getCurr(), 'select');
      Home.itemNo++;
      toggleClass(Home.getCurr(), 'select');
      Home.getColumnData(uploadFocus)
      return
    }
    if (this.itemNo === (this.data[this.pos].elementList.length - 1)) return;
    removeClass(this.getCurr(), 'hover');
    if (this.itemNo === 1) {
      this.itemNo += 2;
    } else {
      this.itemNo++;
    }
    toggleClass(this.getCurr(), 'hover');
  } else if (this.pos === 1) {
    if (this.itemNo == 2) {
      if (Home.itemNo == Home.data.length - 1) return
      childrenClass.itemNo = 0;
      childrenClass.pos = 1;
      removeClass(Home.getCurr(), 'select');
      Home.itemNo++;
      toggleClass(Home.getCurr(), 'select');
      Home.getColumnData(uploadFocus)
      return
    }
    if (this.itemNo === (this.data[this.pos].elementList.length - 1)) return;
    removeClass(this.getCurr(), 'hover');
    this.itemNo++;
    toggleClass(this.getCurr(), 'hover');
  }
}

recommend.enter = function () {
  var twoStageBackUrl = window.location.pathname + '?pos=' + this.pos + '&itemNo=' + this.itemNo + '&columnName=recommend';
  if (this.data[this.pos].elementList[this.itemNo].elementType == 4) {
    Cookies.set('twoStageBackUrl', twoStageBackUrl, { path: '/' })
    Cookies.set('detailUrl', this.data[this.pos].elementList[this.itemNo].jsonUrl, { path: '/' })

    // 页面访问储存
    var jump = {
      parent_page_type: '0101',
      parent_page_id: Cookies.get('cat_id')
    }
    jump = JSON.stringify(jump)
    Cookies.set('jump', jump, { path: '/' })

    // 点击推荐位上报
    try {
      var jsonOb = {}
      jsonOb.pos_id = '0' + this.pos + '0' + this.itemNo
      jsonOb.recmd_id = ''
      jsonOb.page_type = '0101'
      jsonOb.page_id = Cookies.get('cat_id')
      jsonOb.click_type = '2'
      jsonOb.cid = this.data[this.pos].elementList[this.itemNo].elementId
      bi.jumpRecommend(jsonOb)
    } catch (error) {
      console.log('埋点错误', error)
    }

    window.location.href = './source/special/index.html'
  } else if (this.data[this.pos].elementList[this.itemNo].elementType == 1) {
    var backUrl = window.location.pathname + '?pos=' + this.pos + '&itemNo=' + this.itemNo + '&columnName=recommend';
    Cookies.set("backUrl", backUrl, { path: '/' });
    Cookies.set('detailUrl', this.data[this.pos].elementList[this.itemNo].jsonUrl, { path: '/' })

    // 页面访问储存
    var jump = {
      parent_page_type: '0101',
      parent_page_id: Cookies.get('cat_id')
    }
    jump = JSON.stringify(jump)
    Cookies.set('jump', jump, { path: '/' })

    // 点击推荐位上报
    try {
      var jsonOb = {}
      jsonOb.pos_id = '0' + this.pos + '0' + this.itemNo
      Cookies.set('pos_id', jsonOb.pos_id, { path: '/' })
      Cookies.set('recmd_id', '', { path: '/' })
      jsonOb.recmd_id = ''
      jsonOb.page_type = '0101'
      jsonOb.page_id = Cookies.get('cat_id')
      jsonOb.click_type = '1'
      jsonOb.cid = this.data[this.pos].elementList[this.itemNo].elementId
      bi.jumpRecommend(jsonOb)
    } catch (error) {
      console.log('埋点错误', error)
    }

    window.location.href = './source/detail/detail.html'
  } else if (this.data[this.pos].elementList[this.itemNo].elementType == 8) {
    window.location.href = this.data[this.pos].elementList[this.itemNo].jsonUrl;
  }
}
recommend.template = function (list) {
  try {
    this.data = list.data.specialList;
    var element = document.getElementById('recommend');
    var div = "";
    // 循环创建dom片段
    for (var index = 0; index < this.data.length; index++) {
      var elementObj = this.data[index];
      var div1 = "";
      var image = "";
      // 通过layout来生成模板字符串
      if (elementObj.layout === 'Education_Head') {
        for (var j = 0; j < elementObj.elementList.length; j++) {
          var elementDom = elementObj.elementList[j];
          if (elementDom.elementImg) {
            image = "url(" + elementDom.elementImg + ")";
          } else {
            image = "url(./source/public/images/index/recommendi-nit.png)";
          }
          div1 = "<div style='background-image:" + image + ";background-repeat:no-repeat;background-size:100% 100%;'jsonUrl='" + elementDom.jsonUrl + "'type='" + elementDom.elementType
            + "'layout='" + elementDom.layout + "'name = '" + elementDom.elementName + "'class=recommend-child-" + j + " id=recommend-child-" + index + "-" + j + "></div>"
          div += "<div class='recommend-item-" + index + "'>" + div1 + "</div>"
        }
      } else if (elementObj.layout === 'Recommend_Bottom') {
        for (var j = 0; j < elementObj.elementList.length; j++) {
          var elementDom = elementObj.elementList[j];
          if (elementDom.elementImg) {
            image = "url(" + elementDom.elementImg + ")";
          } else {
            image = "url(./source/public/images/index/recommendi-nit.png)";
          }
          div1 = "<div style='background-image:" + image + ";background-repeat:no-repeat;background-size:100% 100%;'jsonUrl='" + elementDom.jsonUrl + "'type='" + elementDom.elementType
            + "'layout='" + elementDom.layout + "'name = '" + elementDom.elementName + "'class=recommend-child-" + j + " id=recommend-child-" + index + "-" + j + "></div>"
          div += "<div class='recommend-item-" + index + "'>" + div1 + "</div>"
        }
      }
    }
    element.innerHTML = div;
  } catch (error) {
    console.log("组装栏目推荐数据异常" + error);
  }
}
recommend.pageBackProcessingLogic = function (data) {
  //页面返回处理逻辑
  removeClass(this.getCurr(), 'hover');
  this.pos = data.pos * 1;
  this.itemNo = data.itemNo * 1;
  // console.log(this.pos, this.itemNo)
  toggleClass(this.getCurr(), 'hover');
  Home.itemNo = 0;
  toggleClass(Home.getCurr(), 'select');
};


recommend.init = function () {
  areaObj = recommend;
  // 初始化焦点样式
  toggleClass(this.getCurr(), 'hover');
}