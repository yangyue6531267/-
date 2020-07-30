// 成教课堂模板
var adultEducation_Classroom = {};


adultEducation_Classroom.data = {};

adultEducation_Classroom.id = 0;

adultEducation_Classroom.name = 'adultEducation_Classroom';

adultEducation_Classroom.itemNo = 0;

adultEducation_Classroom.pos = 0;

adultEducation_Classroom.getCurr = function () {
  return getId('recommend-child-' + this.pos + '-' + this.itemNo);
};

adultEducation_Classroom.up = function () {
  if (this.pos === 0) {
    removeClass(this.getCurr(), 'recommend-education-hover');
    if (this.itemNo === 2 || this.itemNo === 5) {
      this.itemNo--;
    } else {
      // 移动到栏目导航
      this.itemNo = 0;
      Home.init(4);
      return;
    }
    toggleClass(this.getCurr(), 'recommend-education-hover');
  } else if (this.pos === 1) {
    removeClass(this.getCurr(), 'recommend-education-hover')
    this.pos = 0;
    if (this.itemNo === 0) {
      this.itemNo = 0;
    } else if (this.itemNo === 1 || this.itemNo === 2) {
      this.itemNo = 2;
    } else if (this.itemNo === 3 || this.itemNo === 4) {
      this.itemNo = 3;
    } else if (this.itemNo >= 5) {
      this.itemNo = 5;
    }
    toggleClass(this.getCurr(), 'recommend-education-hover');
  }

};

adultEducation_Classroom.down = function () {
  if (this.pos === 1) return;
  if (this.pos === 0) {
    removeClass(this.getCurr(), 'recommend-education-hover');
    if (this.itemNo === 1 || this.itemNo === 4) {
      this.itemNo++;
    } else {
      this.pos = 1;
      this.itemNo = 0;
    };
    toggleClass(this.getCurr(), 'recommend-education-hover');
  }
};

adultEducation_Classroom.left = function () {
  if (this.pos === 0) {
    if (this.itemNo === 0) return;
    removeClass(this.getCurr(), 'recommend-education-hover');
    this.itemNo--;
    toggleClass(this.getCurr(), 'recommend-education-hover');
  } else if (this.pos === 1) {
    if (this.itemNo === 0) return;
    removeClass(this.getCurr(), 'recommend-education-hover');
    this.itemNo--;
    toggleClass(this.getCurr(), 'recommend-education-hover');
  }
};

adultEducation_Classroom.right = function () {
  if (this.pos === 0) {
    if (this.itemNo === 5) return;
    removeClass(this.getCurr(), 'recommend-education-hover');
    this.itemNo++;
    toggleClass(this.getCurr(), 'recommend-education-hover');
  } else if (this.pos === 1) {
    if (this.itemNo === 5) return;
    removeClass(this.getCurr(), 'recommend-education-hover');
    this.itemNo++;
    toggleClass(this.getCurr(), 'recommend-education-hover');
  }
};

adultEducation_Classroom.enter = function () {
  Cookies.set('parent_page_type','0101',{path:'/'});
  // Cookies.set('parent_page_id','205760',{path:'/'});
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
  var twoStageBackUrl = window.location.pathname + '?pos=' + this.pos + '&itemNo=' + this.itemNo + '&columnName=adultEducation_Classroom';
  if (this.pos === 1 && this.itemNo === 5) {
    Cookies.set('twoStageBackUrl', twoStageBackUrl, { path: '/' })
    window.location.href = './source/filter/filter.html?catCode=cjkt';
    return;
  }
  if (this.data[this.pos].elementList[this.itemNo].elementType == 1) {
    var backUrl = window.location.pathname + '?pos=' + this.pos + '&itemNo=' + this.itemNo + '&columnName=adultEducation_Classroom';
    Cookies.set("backUrl", backUrl, { path: '/' });
    Cookies.set('detailUrl', this.data[this.pos].elementList[this.itemNo].jsonUrl, { path: '/' })
    Cookies.set('pos_id','0'+this.pos+'0'+this.itemNo,{path:'/'});// 点击首页资产记录推荐位置用做点击推荐位埋点
    window.location.href = './source/detail/detail.html'
  } else if (this.data[this.pos].elementList[this.itemNo].elementType == 4) {
    Cookies.set('twoStageBackUrl', twoStageBackUrl, { path: '/' })
    Cookies.set('detailUrl', this.data[this.pos].elementList[this.itemNo].jsonUrl, { path: '/' })
    window.location.href = './source/special/index.html'
  }
}


adultEducation_Classroom.template = function (data) {
  try {
    this.data = data.data.specialList;
    var div = "";
    var element = document.getElementById('recommend');
    for (var index = 0; index < this.data.length; index++) {
      var elementObj = this.data[index];
      var div1 = "";
      var image = "";
      // 根据layout生成模板字符串
      if (elementObj.layout === 'Education_Head') {
        for (var j = 0; j < elementObj.elementList.length; j++) {
          var element1 = elementObj.elementList[j];
          if (element1.elementImg) {
            image = "url(" + element1.elementImg + ")";
          } else {
            image = "url(./source/public/images/index/recommendi-nit.png)";
          };
          div1 = "<div style='background-image:" + image + ";background-repeat:no-repeat;background-size:100% 100%;'jsonUrl='" + element1.jsonUrl + "'type='" + element1.elementType
            + "'layout='" + element1.layout + "'name = '" + element1.elementName + "'class=recommend-child-" + j + " id=recommend-child-" + index + "-" + j + "></div>"
          div += "<div class='recommend-item-" + index + "'>" + div1 + "</div>"
        }
      } else if (elementObj.layout === 'AdultEducation_Classroom_Bottom') {
        for (var j = 0; j < elementObj.elementList.length; j++) {
          var element1 = elementObj.elementList[j];
          if (element1.elementImg) {
            image = "url(" + element1.elementImg + ")";
          } else {
            image = "url(./source/public/images/index/recommendi-nit.png)";
          }
          div1 = "<div style='background-image:" + image + ";background-repeat:no-repeat;background-size:100% 100%;'jsonUrl='" + element1.jsonUrl + "'type='" + element1.elementType
            + "'layout='" + element1.layout + "'name = '" + element1.elementName + "'class=recommend-education-" + j + " id=recommend-child-" + index + "-" + j + "></div>"
          div += "<div class='recommend-item-" + index + "'>" + div1 + "</div>"
        }
      }
    }
    element.innerHTML = div;
  } catch (error) {
    toast("组装栏目推荐数据异常" + error);
  }
}
adultEducation_Classroom.init = function () {
  // window.Handlekey(this.getKeyValue.bind(this));
  areaObj = adultEducation_Classroom;
  // 初始化焦点样式
  toggleClass(this.getCurr(), 'recommend-education-hover');
}
adultEducation_Classroom.pageBackProcessingLogic = function (data) {
  //页面返回处理逻辑
  removeClass(this.getCurr(), 'recommend-education-hover');
  this.pos = data.pos * 1;
  this.itemNo = data.itemNo * 1;
  // console.log(this.pos, this.itemNo)
  toggleClass(this.getCurr(), 'recommend-education-hover');
}
