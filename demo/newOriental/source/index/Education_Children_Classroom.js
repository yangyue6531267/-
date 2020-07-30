// 少儿模板
var childrenClass = {};


childrenClass.id = 0;

childrenClass.name = 'childrenClass'

childrenClass.data = {};

childrenClass.itemNo = 0;

childrenClass.pos = 0;

childrenClass.getCurr = function () {
  return getId('recommend-child-' + this.pos + '-' + this.itemNo);
};


childrenClass.up = function (params) {
  // 当区域为0时
  if (this.pos === 0) {
    removeClass(this.getCurr(), 'recommend-kid-hover');
    if (this.itemNo === 2 || this.itemNo === 5) {
      this.itemNo--;
    } else {
      // 移动到栏目导航
      this.itemNo = 0;
      Home.init(2);
      return;
    }
    toggleClass(this.getCurr(), 'recommend-kid-hover');
  } else if (this.pos === 1) {
    if (this.itemNo < 3) {
      removeClass(this.getCurr(), 'recommend-kid-hover');
      this.pos = 0;
      if (this.itemNo === 1) {
        this.itemNo = 2;
      } else if (this.itemNo === 2) {
        this.itemNo = 5;
      } else {
        this.itemNo = 0;
      }
      toggleClass(this.getCurr(), 'recommend-kid-hover');
    } else {
      // 底部第二排向上
      removeClass(this.getCurr(), 'recommend-kid-hover');
      this.itemNo -= 3;
      toggleClass(this.getCurr(), 'recommend-kid-hover');
    }
  }
}

childrenClass.down = function (params) {
  // 当区域为0时
  if (this.pos === 0) {
    removeClass(this.getCurr(), 'recommend-kid-hover');
    if (this.itemNo === 1 || this.itemNo === 4) {
      this.itemNo++;
    } else {
      this.pos = 1;
      this.itemNo = 0;
    }
    toggleClass(this.getCurr(), 'recommend-kid-hover');
  } else if (this.pos === 1) {
    // 底部第一排向下
    removeClass(this.getCurr(), 'recommend-kid-hover');
    if (this.itemNo < 3) {
      this.itemNo += 3;
    }
    toggleClass(this.getCurr(), 'recommend-kid-hover');
  }
}

childrenClass.left = function (params) {
  // 当区域为0时
  if (this.pos === 0) {
    if (this.itemNo === 0) return;
    removeClass(this.getCurr(), 'recommend-kid-hover');
    this.itemNo--;
    toggleClass(this.getCurr(), 'recommend-kid-hover');
  } else if (this.pos === 1) {
    if (this.itemNo === 0) return;
    removeClass(this.getCurr(), 'recommend-kid-hover');
    this.itemNo--;
    toggleClass(this.getCurr(), 'recommend-kid-hover');
  }
}

childrenClass.right = function (params) {
  // 当区域为0时
  if (this.pos === 0) {
    if (this.itemNo === (this.data[this.pos].elementList.length - 1)) return;
    removeClass(this.getCurr(), 'recommend-kid-hover');
    this.itemNo++;
    toggleClass(this.getCurr(), 'recommend-kid-hover');
  } else if (this.pos === 1) {
    if (this.itemNo === (this.data[this.pos].elementList.length - 1)) return;
    removeClass(this.getCurr(), 'recommend-kid-hover');
    this.itemNo++;
    toggleClass(this.getCurr(), 'recommend-kid-hover');
  }
}

childrenClass.enter = function () {
  var twoStageBackUrl = window.location.pathname + '?pos=' + this.pos + '&itemNo=' + this.itemNo + '&columnName=childrenClass';
  Cookies.set('parent_page_type','0101',{path:'/'});
  // Cookies.set('parent_page_id','205758',{path:'/'});
  try{
    // 推荐位点击上报数据
    commonParams.pos_id = '0'+this.pos+'0'+this.itemNo;
    commonParams.recmd_id = '';
    commonParams.page_type = '0101';
    commonParams.page_id = Cookies.get('parent_page_id');
    if(this.data[this.pos].elementList[this.itemNo].elementType == 1){
      commonParams.click_type = '1';
      commonParams.cid = this.data[this.pos].elementList[this.itemNo].elementId;
    }else if(this.data[this.pos].elementList[this.itemNo].elementType == 4){
      commonParams.click_type = '2';
      commonParams.cid = this.data[this.pos].elementList[this.itemNo].elementId;
    }else if(this.data[this.pos].elementList[this.itemNo].elementType == 7){
      commonParams.click_type = '';
      commonParams.cid = '';
    }
    bi.RecommendedClick(commonParams);
  }catch(e){}
  if (this.pos === 1 && this.itemNo === 5) {
    Cookies.set('twoStageBackUrl', twoStageBackUrl, { path: '/' });
    window.location.href = './source/filter/filter.html?catCode=sekt';
    return;
  }
  if (this.data[this.pos].elementList[this.itemNo].elementType == 1) {
    var backUrl = window.location.pathname + '?pos=' + this.pos + '&itemNo=' + this.itemNo + '&columnName=childrenClass';
    Cookies.set("backUrl", backUrl, { path: '/' });
    Cookies.set('detailUrl', this.data[this.pos].elementList[this.itemNo].jsonUrl, { path: '/' });
    Cookies.set('pos_id','0'+this.pos+'0'+this.itemNo,{path:'/'});// 点击首页资产记录推荐位置用做点击推荐位埋点
    window.location.href = './source/detail/detail.html';
  } else if (this.data[this.pos].elementList[this.itemNo].elementType == 4) {
    Cookies.set('twoStageBackUrl', twoStageBackUrl, { path: '/' });
    Cookies.set('detailUrl', this.data[this.pos].elementList[this.itemNo].jsonUrl, { path: '/' });
    window.location.href = './source/special/index.html';
  }
}

childrenClass.template = function (list) {
  try {
    this.data = list.data.specialList;
    // console.log(this.data);
    var element = document.getElementById('recommend');
    var div = "";
    // 循环创建dom片段
    for (var index = 0; index < this.data.length; index++) {
      var div1 = "";
      var image = "";
      var elementObj = this.data[index];
      // 通过layout来生成模板字符串
      if (elementObj.layout === 'Education_Head') {
        for (var j = 0; j < elementObj.elementList.length; j++) {
          var elementDom = elementObj.elementList[j];
          // 判断图片不存在设置默认图
          if (elementDom.elementImg) {
            image = "url(" + elementDom.elementImg + ")";
          } else {
            image = "url(./source/public/images/index/recommendi-nit.png)";
          }

          div1 = "<div style='background-image:" + image + ";background-repeat:no-repeat;background-size:100% 100%;'jsonUrl='" + elementDom.jsonUrl + "'type='" + elementDom.elementType
            + "'layout='" + elementDom.layout + "'name = '" + elementDom.elementName + "'class=recommend-child-" + j + " id=recommend-child-" + index + "-" + j + "></div>"
          div += "<div class='recommend-item-" + index + "'>" + div1 + "</div>"
        }
      } else if (elementObj.layout === 'Children_Classroom_Bottom') {
        for (var j = 0; j < elementObj.elementList.length; j++) {
          var elementDom = elementObj.elementList[j];
          if (elementDom.elementImg) {
            image = "url(" + elementDom.elementImg + ")";
          } else {
            image = "url(./source/public/images/index/recommendi-nit.png)";
          }
          div1 = "<div style='background-image:" + image + ";background-repeat:no-repeat;background-size:100% 100%;'jsonUrl='" + elementDom.jsonUrl + "'type='" + elementDom.elementType
            + "'layout='" + elementDom.layout + "'name = '" + elementDom.elementName + "'class=recommend-kid-" + j + " id=recommend-child-" + index + "-" + j + "></div>"
          div += "<div class='recommend-item-" + index + "'>" + div1 + "</div>"
        }
      }

    }
    element.innerHTML = div;
  } catch (error) {
    toast("组装栏目推荐数据异常" + error);
  }
}
childrenClass.init = function () {
  // console.log('推荐位头部模板绑定键值');
  // window.Handlekey(this.getKeyValue.bind(this));
  areaObj = childrenClass;
  // 初始化焦点样式
  toggleClass(this.getCurr(), 'recommend-kid-hover');
}
childrenClass.pageBackProcessingLogic = function (data) {
  //页面返回处理逻辑
  removeClass(this.getCurr(), 'recommend-kid-hover');
  this.pos = data.pos * 1;
  this.itemNo = data.itemNo * 1;
  // console.log(this.pos, this.itemNo)
  toggleClass(this.getCurr(), 'recommend-kid-hover');
  // var _this = this;
  // setTimeout(function(){
  // 	_this.pos = data.pos*1;
  // 	_this.itemNo = data.itemNo*1;
  // 	console.log(_this.pos,_this.itemNo)
  // 	toggleClass(_this.getCurr(), 'recommend-kid-hover');
  // },100)
}
