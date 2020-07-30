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
  if (this.pos === 0) {
    if (this.itemNo === 0) return;
    removeClass(this.getCurr(), 'hover');
    if (this.itemNo === 5 || this.itemNo === 3 || this.itemNo === 2) {
      this.itemNo -= 2;
    } else {
      this.itemNo--;
    }
    toggleClass(this.getCurr(), 'hover');
  } else if (this.pos === 1) {
    if (this.itemNo === 0) return;
    removeClass(this.getCurr(), 'hover');
    this.itemNo--;
    toggleClass(this.getCurr(), 'hover');
  }
}

recommend.right = function (params) {
  // 当区域为0时
  if (this.pos === 0) {
    if (this.itemNo === (this.data[this.pos].elementList.length - 1)) return;
    removeClass(this.getCurr(), 'hover');
    if (this.itemNo === 1) {
      this.itemNo += 2;
    } else {
      this.itemNo++;
    }
    toggleClass(this.getCurr(), 'hover');
  } else if (this.pos === 1) {
    if (this.itemNo === (this.data[this.pos].elementList.length - 1)) return;
    removeClass(this.getCurr(), 'hover');
    this.itemNo++;
    toggleClass(this.getCurr(), 'hover');
  }
}

recommend.enter = function () {
  //推荐位置活动
  // if (this.pos == 0 && this.itemNo == 0) {
  //   var backUrl = window.location.pathname + '?pos=' + this.pos + '&itemNo=' + this.itemNo + '&columnName=recommend';
  //   Cookies.set("backUrl", backUrl, { path: '/' });
  //   window.location.href = './source/discount/discount.html?soure=shouye'
  //   return
  // }
  Cookies.set('parent_page_type', '0101', { path: '/' });
  try {
    // 推荐位点击上报数据
    commonParams.pos_id = '0' + this.pos + '0' + this.itemNo;
    commonParams.recmd_id = '';
    commonParams.page_type = '0101';
    commonParams.page_id = Cookies.get('parent_page_id');
    if (this.data[this.pos].elementList[this.itemNo].elementType == 1) {
      commonParams.click_type = '1';
      commonParams.cid = this.data[this.pos].elementList[this.itemNo].elementId;
    } else if (this.data[this.pos].elementList[this.itemNo].elementType == 4) {
      commonParams.click_type = '2';
      commonParams.cid = this.data[this.pos].elementList[this.itemNo].elementId;
    } else if (this.data[this.pos].elementList[this.itemNo].elementType == 7) {
      commonParams.click_type = '';
      commonParams.cid = '';
    }
    bi.RecommendedClick(commonParams);
  } catch (e) { }
  var twoStageBackUrl = window.location.pathname + '?pos=' + this.pos + '&itemNo=' + this.itemNo + '&columnName=recommend';
  if (this.data[this.pos].elementList[this.itemNo].elementType == 4) {
    Cookies.set('twoStageBackUrl', twoStageBackUrl, { path: '/' });
    Cookies.set('detailUrl', this.data[this.pos].elementList[this.itemNo].jsonUrl, { path: '/' });
    window.location.href = './source/special/index.html';
  } else if (this.data[this.pos].elementList[this.itemNo].elementType == 1) {
    var backUrl = window.location.pathname + '?pos=' + this.pos + '&itemNo=' + this.itemNo + '&columnName=recommend';
    Cookies.set("backUrl", backUrl, { path: '/' });
    Cookies.set('detailUrl', this.data[this.pos].elementList[this.itemNo].jsonUrl, { path: '/' });
    Cookies.set('pos_id', '0' + this.pos + '0' + this.itemNo, { path: '/' });// 点击首页资产记录推荐位置用做点击推荐位埋点
    window.location.href = './source/detail/detail.html';
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
          // if (j == 0) {
          //   image = "url(./source/public/images/activity.jpg)";
          // }
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
    toast("组装栏目推荐数据异常" + error);
  }
  if (getQueryString("code")) {
    //获取订购信息
    var dgMsg = {};
    dgMsg.code = getQueryString("code");
    dgMsg.msg = getQueryString("msg");
    if (dgMsg.code == 200) {
      playConfig.isOrder = 1;
      Cookies.set('isOrder', "1", {
        path: '/'
      })
      // // 用户订购成功
      // try {
      //   commonParams.pkg_type = '';
      //   commonParams.pkg_id = ''//value.detailData.assetId
      //   commonParams.operator_id = '';
      //   commonParams.point = '4';
      //   commonParams.order_msg = '1';
      //   commonParams.parent_page_id = '';
      //   commonParams.parent_page_type = '';
      //   bi.order(commonParams)
      // } catch (e) {
      //   toast('错误信息' + e)
      // }
    } else {
      Cookies.set('orderErrMsg', dgMsg.msg, { path: '/' })
      //用户取消/支付失败
      // try {
      //   commonParams.pkg_type = ''
      //   commonParams.pkg_id = ''//value.detailData.assetId
      //   commonParams.operator_id = ''
      //   commonParams.point = '4'
      //   commonParams.order_msg = encodeURI(dgMsg.msg) != 'null'?encodeURI(dgMsg.msg):'失败'
      //   commonParams.parent_page_id = ''
      //   commonParams.parent_page_type = ''
      //   bi.order(commonParams)
      // } catch (e) {
      //   toast('错误信息' + e)
      // }
    }
  }
}
recommend.pageBackProcessingLogic = function (data) {
  //页面返回处理逻辑
  removeClass(this.getCurr(), 'hover');
  this.pos = data.pos * 1;
  this.itemNo = data.itemNo * 1;
  // console.log(this.pos, this.itemNo)
  toggleClass(this.getCurr(), 'hover');
};


recommend.init = function () {
  areaObj = recommend;
  // 初始化焦点样式
  toggleClass(this.getCurr(), 'hover');
}