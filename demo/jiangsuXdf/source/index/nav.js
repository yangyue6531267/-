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
    283: "back",
    181: "home", // 首页
    278: "message", // 信息
    272: "home",
    54: "hideKey"
  };
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
  };

  var Home = {};
  Home.itemNo = 0;
  Home.navItemNo = 0;
  Home.pos = 0 ;//0 导航栏  1 菜单
  Home.homeCategoryList = [];
  Home.homeCategoryChildrenList = [];
  Home.scrollArr = [];
  Home.name = 'Home';
  
  Home.enter = function(){
    if(this.pos == 0)return;
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
      window.location.href = 'source/collect/collect.html'
    }else if(this.navItemNo == 4){
      // 搜索
      var pos = Home.scrollArr.length == 0?0:Home.scrollArr[Home.scrollArr.length-1];
			var backUrl = window.location.pathname + '?pos='+pos+'&navItemNo=' + this.navItemNo + '&columnName=navList&navItem='+Home.itemNo;
      Cookies.set('searchBackUrl',backUrl)
      window.location.href = 'source/search/search.html'
    }else if(this.navItemNo == 5){
      // 学习需求
      removeClass(getId('mavHover_'+this.navItemNo),'mavHover')
      getId('navItem_'+this.navItemNo).style.color = '#1D1D1D';
      Switch.init()
    }
  }
  Home.init = function(id){
    if(Cookies.get('homeCatId')){
      Cookies.remove('homeCatId')
    };
    if(window.location.href.indexOf('?') == -1){
      // 首页启动埋点
      try{
        bi.appStart('0101')
      }catch(e){
        console.log('埋点错误'+e)
      };
    };
    try{
      // 首页页面访问埋点
    }catch(e){
      console.log('埋点错误'+e)
    }
    if(Cookies.get('bevaHomeUrl')){
      window.location.href = 'source/beva/beva.html';
      return;
    }
    if(Cookies.get('specialHomeUrl')){
      window.location.href = 'source/special/special.html';
      return;
    }
    if(id){
      areaObj = Home; 
      if(getId('navWrap').style.display == 'none'){
        console.log('没有导航之后上来的焦点')
        this.navItemNo = 5;
        this.pos = 1;
        addClass(getId('mavHover_'+this.navItemNo),'mavHover');
        getId('navItem_'+this.navItemNo).style.color = 'rgba(255,255,255,1)';
        return
      }
      removeClass(getId('item_'+(id-1)),'liHover_'+this.itemNo);   
      if('item_'+(id-1) == 'item_5'){
        addClass(getId('item_'+(id-1)),'navLiHoverLast');   
      }else{
        addClass(getId('item_'+(id-1)),'navLiHover');    
      }      
      return;
    }
    if(getQueryString('navItemNo')){
      this.navItemNo = getQueryString('navItemNo')*1;
      this.itemNo = getQueryString('navItem')*1;
      this.pos = 1;
      if(this.navItemNo == 0){
        getId('navItem_0').style.backgroundImage = 'url(./source/public/images/navVipHover.png)';
      }
      addClass(getId('mavHover_'+this.navItemNo),'mavHover');
      getId('navItem_'+this.navItemNo).style.color = 'rgba(255,255,255,1)';
    }
    if(Cookies.get('homeUrl')){
      Switch.tempHomeInit(Cookies.get('homeUrl'),Cookies.get('homeUrItemNo'),backItemNo*1,backColumnName)
      // 用户选过栏目后加载选择的栏目
      return;
    }
    if(backNavItem){
      this.itemNo = backNavItem*1;
    }
    // if(getQueryString('navItemNo')){
    //   this.navItemNo = getQueryString('navItemNo')*1;
    //   this.itemNo = getQueryString('navItem')*1;
    //   this.pos = 1;
    //   addClass(getId('mavHover_'+this.navItemNo),'mavHover');
    //   getId('navItem_'+this.navItemNo).style.color = 'rgba(255,255,255,1)';
    // }
    var _this = this;
    getYhNavigationBar(function (resp) { 
      console.log(eval('(' + resp + ')'))
      if(eval('(' + resp + ')').code == 200){
        _this.homeCategoryList = eval('(' + resp + ')')
        var catList = eval('(' + resp + ')').data.catList.slice(0,6);
        var itemhtml = ''
        for (var i = 0; i < catList.length; i++) {
          var liHtml = '<li id="item_'+i+'">'+catList[i].catName+'</li>'
          itemhtml+=liHtml;
        }
        getId('navWrap').innerHTML = itemhtml;
        if(!getQueryString('pos')){
          // addClass(getId('item_'+_this.itemNo),'liHover_'+_this.itemNo);
          // addClass(getId('item_'+_this.itemNo),'navLiHover');
          if('item_'+_this.itemNo == 'item_5'){
            addClass(getId('item_'+_this.itemNo),'navLiHoverLast');   
          }else{
            addClass(getId('item_'+_this.itemNo),'navLiHover');    
          }  
        }else{
          addClass(getId('item_'+Home.itemNo),'liHover_'+Home.itemNo);
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
    setTimeout(function () {  
      if(backColumnName && backColumnName != 'navList'){
        if(backColumnName !== 'navList'){
          eval(backColumnName).init(backItemNo*1);
        }
        Home.scrollArr = eval('('+Cookies.get('scrollArr')+')') || [];
        // Home.itemNo = backNavItem*1;
      }else{
        areaObj = Home; 
      }
    },300)
  }
  Home.left = function () { 
    if(this.pos == 0){
      if(this.itemNo == 0)return;
      // removeClass(getId('item_'+this.itemNo),'liHover_'+this.itemNo);
      if(this.itemNo == '5'){
        removeClass(getId('item_'+this.itemNo),'navLiHoverLast');
      }else{
        removeClass(getId('item_'+this.itemNo),'navLiHover');
      }
      this.itemNo--
      // addClass(getId('item_'+this.itemNo),'liHover_'+this.itemNo);
      addClass(getId('item_'+this.itemNo),'navLiHover');
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
      removeClass(getId('mavHover_'+this.navItemNo),'mavHover');
      getId('navItem_'+this.navItemNo).style.color = '#1D1D1D';
      this.navItemNo--;
      if(this.navItemNo == 0){
        getId('navItem_0').style.backgroundImage = 'url(./source/public/images/navVipHover.png)';
      }
      addClass(getId('mavHover_'+this.navItemNo),'mavHover')
      getId('navItem_'+this.navItemNo).style.color = 'rgba(255,255,255,1)';
    }
  }
  Home.right = function () { 
    if(this.pos == 0){
      if(this.itemNo == 5)return;
      // removeClass(getId('item_'+this.itemNo),'liHover_'+this.itemNo);
      removeClass(getId('item_'+this.itemNo),'navLiHover');
      this.itemNo++;
      // addClass(getId('item_'+this.itemNo),'liHover_'+this.itemNo);
      if('item_'+this.itemNo == 'item_5'){
        addClass(getId('item_'+this.itemNo),'navLiHoverLast');   
      }else{
        addClass(getId('item_'+this.itemNo),'navLiHover');
      } 
      var url = this.homeCategoryList.data.catList[this.itemNo].jsonUrl;
      var _this = this;
      this.homeCategoryChildrenList = [];
      getHomeCategoryData(url,function (resp) { 
        _this.homeCategoryChildrenList = eval('(' + resp + ')').data.specialList;
        if(_this.itemNo == 0){
          removeClass(getId('item_'+this.itemNo),'liHover_'+this.itemNo);
          // removeClass(getId('item_'+this.itemNo),'navLiHover');
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
      if(this.navItemNo == 0){
        getId('navItem_0').style.backgroundImage = 'url(./source/public/images/navVip.png)';
      }
      removeClass(getId('mavHover_'+this.navItemNo),'mavHover');
      getId('navItem_'+this.navItemNo).style.color = '#1D1D1D';
      this.navItemNo++;
      addClass(getId('mavHover_'+this.navItemNo),'mavHover')
      getId('navItem_'+this.navItemNo).style.color = 'rgba(255,255,255,1)';
    }
   }
  Home.down = function () { 
    if(this.pos == 0){
      Cookies.set('homeCatId',this.homeCategoryList.data.catList[this.itemNo].catId,{path:'/'}) // 筛选埋点使用      
      if(this.itemNo == '5'){
        removeClass(getId('item_'+this.itemNo),'navLiHoverLast');
      }else{
        removeClass(getId('item_'+this.itemNo),'navLiHover');
      }
      addClass(getId('item_'+this.itemNo),'liHover_'+this.itemNo);
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
      if(getId('navWrap').style.display == 'none'){
        // 没有栏目切换
        if(this.navItemNo == 0){
          getId('navItem_0').style.backgroundImage = 'url(./source/public/images/navVip.png)';
        };
        removeClass(getId('mavHover_'+this.navItemNo),'mavHover');
        getId('navItem_'+this.navItemNo).style.color = '#1D1D1D';
        Home.scrollArr = [];
        eval(Cookies.get('homeName')).firstModularInit();
        return
      }
      this.pos = 0;
      if(this.navItemNo == 0){
        getId('navItem_0').style.backgroundImage = 'url(./source/public/images/navVip.png)';
      };
      removeClass(getId('mavHover_'+this.navItemNo),'mavHover');
      getId('navItem_'+this.navItemNo).style.color = '#1D1D1D';
      removeClass(getId('item_'+this.itemNo),'liHover_'+this.itemNo);
      // addClass(getId('item_'+this.itemNo),'navLiHover');
      if('item_'+this.itemNo == 'item_5'){
        addClass(getId('item_'+this.itemNo),'navLiHoverLast');   
      }else{
        addClass(getId('item_'+this.itemNo),'navLiHover');
      } 
    }
   }
  Home.up = function () { 
    if(this.pos == 1)return;
    this.pos = 1;
    if(this.itemNo == '5'){
      removeClass(getId('item_'+this.itemNo),'navLiHoverLast');
    }else{
      removeClass(getId('item_'+this.itemNo),'navLiHover');
    }
    // this.itemNo = -1;
    // this.navItemNo = 0;
    addClass(getId('item_'+this.itemNo),'liHover_'+this.itemNo);
    if(this.navItemNo == 0){
      getId('navItem_0').style.backgroundImage = 'url(./source/public/images/navVipHover.png)';
    }
    addClass(getId('mavHover_'+this.navItemNo),'mavHover');
    getId('navItem_'+this.navItemNo).style.color = 'rgba(255,255,255,1)';
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
        if(getId('swicthInner')){
          areaObj.back();
        }else if(document.querySelector('.signOutOption')){
          var keyObj = Cookies.get('keyObj');
          areaObj = eval(keyObj);
          Cookies.remove('keyObj')
          document.querySelector('.signOut').innerHTML = '';
        }else{
          if(areaObj.name != 'Home'){
            areaObj.back(); 
          }else{
            signOutObj.init();
            Cookies.set('keyObj',areaObj.name,{path:'/'})
            areaObj = signOutObj;
          }
        }
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