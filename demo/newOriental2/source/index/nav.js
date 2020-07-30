var KEYMAP = {
    38: "up",
    40: "down",
    37: "left",
    39: "right",
    13: "enter",
    8: "back",
    27: "back",
    22: "back",
    461: "back",
    340: "back",
    283: "back",// 高清3.0返回按键
    181: "home", // 首页
    278: "message", // 信息
    272: "home",
    54: "hideKey"
  };
  console.log(2)
  //按键分发事件
  var onKeyPress;
  //按键prev处理函数
  var grepEvent = function (e) {
    var keyCode = e.keyCode || e.which;
    return onKeyPress(KEYMAP[keyCode]);
  };
  if(getQueryString('pos')){
    var backNavItem = getQueryString('navItem') || 0;
    var backPos = getQueryString('pos') || 0;
    var backItemNo = getQueryString('itemNo')||0;
    var backColumnName = getQueryString('columnName');
    document.querySelector('#recommend').style.top = backPos + 'px';
  }

  var Home = {};
  Home.itemNo = 0;
  Home.navItemNo = 0;
  Home.pos = 0 ;//0 导航栏  1 菜单
  Home.homeCategoryList = [];
  Home.homeCategoryChildrenList = [];
  Home.scrollArr = [];
  
  Home.enter = function(){
    if(this.navItemNo == 0){
      // vip
      var pos = Home.scrollArr.length == 0?0:Home.scrollArr[Home.scrollArr.length-1];
			var backUrl = window.location.pathname + '?pos='+pos+'&navItemNo=' + this.navItemNo + '&columnName=navList&navItem='+Home.itemNo;
      Cookies.set('orderbackUrl',backUrl)
      window.location.href = 'source/order/order.html'
    }else if(this.navItemNo == 1){
      // 个人中心
      var pos = Home.scrollArr.length == 0?0:Home.scrollArr[Home.scrollArr.length-1];
			var backUrl = window.location.pathname + '?pos='+pos+'&navItemNo=' + this.navItemNo + '&columnName=navList&navItem='+Home.itemNo;
      Cookies.set('mineBackUrl',backUrl)
      window.location.href = 'source/mine/mine.html'
    }else if(this.navItemNo == 2){
      // 抽奖
      alert('开发中')
    }else if(this.navItemNo == 3){
      // 收藏
      var pos = Home.scrollArr.length == 0?0:Home.scrollArr[Home.scrollArr.length-1];
			var backUrl = window.location.pathname + '?pos='+pos+'&navItemNo=' + this.navItemNo + '&columnName=navList&navItem='+Home.itemNo;
      Cookies.set('hobbyBackUrl',backUrl)
      window.location.href = 'source/history/history.html'
    }else if(this.navItemNo == 4){
      // 搜索
      var pos = Home.scrollArr.length == 0?0:Home.scrollArr[Home.scrollArr.length-1];
			var backUrl = window.location.pathname + '?pos='+pos+'&navItemNo=' + this.navItemNo + '&columnName=navList&navItem='+Home.itemNo;
      Cookies.set('searchBackUrl',backUrl)
      window.location.href = 'source/search/search.html'
    }else if(this.navItemNo == 5){
      // 学习需求
    }
    //       window.location.href = 'source/filter/filter.html'
  }
  Home.init = function(id){
    if(id){
      areaObj = Home; 
      addClass(getId('item_'+(id-1)),'liHover_'+this.itemNo);         
      return;
    }
    if(backNavItem){
      this.itemNo = backNavItem*1;
    }
    if(getQueryString('navItemNo')){
      this.navItemNo = getQueryString('navItemNo')*1;
      this.itemNo = getQueryString('navItem')*1;
      this.pos = 1;
      addClass(getId('navItem_'+this.navItemNo),'mavHover');
    }
    var _this = this;
    getYhNavigationBar(function (resp) { 
      console.log(eval('(' + resp + ')'))
      if(eval('(' + resp + ')').code == 200){
        _this.homeCategoryList = eval('(' + resp + ')');
        var catList = eval('(' + resp + ')').data.catList;
        var itemhtml = ''
        for (var i = 0; i < catList.length; i++) {
          var liHtml = '<li id="item_'+i+'">'+catList[i].catName+'</li>'
          itemhtml+=liHtml;
        }
        getId('navWrap').innerHTML = itemhtml;
        if(!getQueryString('pos')){
          addClass(getId('item_'+_this.itemNo),'liHover_'+_this.itemNo);
        }
        var url = _this.homeCategoryList.data.catList[_this.itemNo].jsonUrl;
        this.homeCategoryChildrenList = [];
        getHomeCategoryData(url,function (data) { 
          _this.homeCategoryChildrenList = eval('(' + data + ')').data.specialList;
          if(_this.itemNo == 0){
            homeRecommend.init(eval('(' + data + ')'))
          }else if(_this.itemNo == 1){
            homePreschool.init(eval('(' + data + ')'))            
          }else if(_this.itemNo == 2){
            homePrimarySchool.init(eval('(' + data + ')'))
          }else if(_this.itemNo == 3){
            homeMiddleSchool.init(eval('(' + data + ')'))
          }else if(_this.itemNo == 4){
            homeHighSchool.init(eval('(' + data + ')'))
          }else if(_this.itemNo == 5){
            homeAdultEducation.init(eval('(' + data + ')'))
          }
         },function (errer) { 
           console.log(errer)
         })
      }
     },function (error) { 
      console.log('栏目数据请求错误：'+error)
      })
    areaObj = Home; 
    setTimeout(function () {  
      if(backColumnName){
        if(backColumnName !== 'navList'){
          eval(backColumnName).init(backItemNo*1);
        }
        Home.scrollArr = eval('('+Cookies.get('scrollArr')+')') || [];
        // Home.itemNo = backNavItem*1;
      }
    },500)
  }
  Home.left = function () { 
    if(this.pos == 0){
      if(this.itemNo == 0)return;
      removeClass(getId('item_'+this.itemNo),'liHover_'+this.itemNo);
      this.itemNo--
      addClass(getId('item_'+this.itemNo),'liHover_'+this.itemNo);
      var url = this.homeCategoryList.data.catList[this.itemNo].jsonUrl;
      var _this = this;
      this.homeCategoryChildrenList = [];
      getHomeCategoryData(url,function (resp) { 
        _this.homeCategoryChildrenList = eval('(' + resp + ')').data.specialList;
        if(_this.itemNo == 0){
          homeRecommend.init(eval('(' + resp + ')'))
        }else if(_this.itemNo == 1){
          homePreschool.init(eval('(' + resp + ')'))
        }else if(_this.itemNo == 2){
          homePrimarySchool.init(eval('(' + resp + ')'))
        }else if(_this.itemNo == 3){
          homeMiddleSchool.init(eval('(' + resp + ')'))
        }else if(_this.itemNo == 4){
          homeHighSchool.init(eval('(' + resp + ')'))
        }else if(_this.itemNo == 5){
          homeAdultEducation.init(eval('(' + resp + ')'))
        }
       },function (errer) { 
         console.log(errer)
        })
    }else if(this.pos == 1){
      if(this.navItemNo == 0)return;
      removeClass(getId('navItem_'+this.navItemNo),'mavHover');
      this.navItemNo--;
      addClass(getId('navItem_'+this.navItemNo),'mavHover')
    }
  }
  Home.right = function () { 
    if(this.pos == 0){
      if(this.itemNo == 5)return;
      removeClass(getId('item_'+this.itemNo),'liHover_'+this.itemNo);
      this.itemNo++;
      addClass(getId('item_'+this.itemNo),'liHover_'+this.itemNo);
      var url = this.homeCategoryList.data.catList[this.itemNo].jsonUrl;
      var _this = this;
      this.homeCategoryChildrenList = [];
      getHomeCategoryData(url,function (resp) { 
        _this.homeCategoryChildrenList = eval('(' + resp + ')').data.specialList;
        if(_this.itemNo == 0){
          removeClass(getId('item_'+this.itemNo),'liHover_'+this.itemNo);
          homeRecommend.init(eval('(' + resp + ')'));
        }else if(_this.itemNo == 1){
          homePreschool.init(eval('(' + resp + ')'))
        }else if(_this.itemNo == 2){
          homePrimarySchool.init(eval('(' + resp + ')'))
        }else if(_this.itemNo == 3){
          homeMiddleSchool.init(eval('(' + resp + ')'))
        }else if(_this.itemNo == 4){
          homeHighSchool.init(eval('(' + resp + ')'))
        }else if(_this.itemNo == 5){
          homeAdultEducation.init(eval('(' + resp + ')'))
        }
       },function (errer) { 
         console.log(errer)
        })
    }else if(this.pos == 1){
      if(this.navItemNo == 5)return;
      removeClass(getId('navItem_'+this.navItemNo),'mavHover');
      this.navItemNo++;
      addClass(getId('navItem_'+this.navItemNo),'mavHover')
    }
   }
  Home.down = function () { 
    if(this.pos == 0){
      removeClass(getId('item_'+this.itemNo),'liHover_'+this.itemNo);
      if(this.itemNo == 0){
        homePageRecommendTop.init();
      }else if(this.itemNo == 1){
        preschoolRecommendTop.init();
      }else if(this.itemNo == 2){
        normalRecommendTop.init();
      }else if(this.itemNo == 3){
        normalRecommendTop.init();
      }else if(this.itemNo == 4){
        normalRecommendTop.init();
      }else if(this.itemNo == 5){
        normalRecommendTop.init();
      }
    }else if(this.pos == 1){
      this.pos = 0;
      removeClass(getId('navItem_'+this.navItemNo),'mavHover');
      addClass(getId('item_'+this.itemNo),'liHover_'+this.itemNo);
    }
   }
  Home.up = function () { 
    if(this.pos == 1)return;
    this.pos = 1;
    removeClass(getId('item_'+this.itemNo),'liHover_'+this.itemNo);
    // this.itemNo = -1;
    // this.navItemNo = 0;
    addClass(getId('navItem_'+this.navItemNo),'mavHover');
   }


  onKeyPress = function (keyCode) {
    switch (keyCode) {
      case "up": //上边
        areaObj.up();
        break;
      case "down": //下边
        areaObj.down();
        break;
      case "left": //左边
        areaObj.left();
        break;
      case "right": //右边
        areaObj.right();
        break;
      case "back":
        prompt('yanhua://epg/exit');
        break;
      case "enter":
        areaObj.enter();
        break;
      case "home":
        areaObj.home();
        break; 
    }
  };
  document.onkeydown = grepEvent;