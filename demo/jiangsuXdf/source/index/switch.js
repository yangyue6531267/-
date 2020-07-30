// 切换页
var htmlStr = '';
var seleList = [];
getYhNavigationBar(function (resp) { 
  if(eval('(' + resp + ')').code == 200){
    seleList = eval('(' + resp + ')').data.catList.slice(1,8);
    for (var i = 0; i < seleList.length; i++) {
      var innerStr = '<div class="tlt" id="switchitem_'+(i+1)+'">'+seleList[i].catName+'</div>'
      htmlStr+=innerStr;
    }
   
    console.log(seleList)
  }
 })
var Switch = {
    itemNo:0,
    template:function () {  
        var switchinnerHtml = '<div class="swicthInner" id="swicthInner">'+
                                  '<div class="tag">选择你的学习需求</div>' +
                                  '<div class="tltWrap"><div class="tlt" id="switchitem_0">标  准</div>' +htmlStr+'</div>'+
                                  '<div class="tps">下次打开将默认显示选择的模板</div>'
                              '</div>'
            getId('switch').innerHTML = switchinnerHtml;
    },
    init:function () {  
        this.template();
        this.itemNo = 0;
        areaObj = Switch;
        addClass(getId('switchitem_'+this.itemNo),'swicthHove')
    },
    up:function () {  
        if(this.itemNo < 4)return;
        removeClass(getId('switchitem_'+this.itemNo),'swicthHove');
        this.itemNo -= 4;
        addClass(getId('switchitem_'+this.itemNo),'swicthHove')
    },
    down:function () {  
        if(this.itemNo < 4){
            removeClass(getId('switchitem_'+this.itemNo),'swicthHove');
            this.itemNo += 4;
            addClass(getId('switchitem_'+this.itemNo),'swicthHove')    
        }else{
            // Home.itemNo = 0;
            if(getId('navWrap').style.display == 'none'){
              Home.pos = 1;
              addClass(getId('mavHover_5'),'mavHover')
              getId('navItem_5').style.color = 'rgba(255,255,255,1)';
              getId('switch').innerHTML = '';
              areaObj = Home;
              return;
            }
            Home.pos = 0;
            if(Home.itemNo == '5'){
              addClass(getId('item_'+Home.itemNo),'navLiHoverLast');
            }else{
              addClass(getId('item_'+Home.itemNo),'navLiHover');
            }
            removeClass(getId('item_'+Home.itemNo),'liHover_'+Home.itemNo);
            getId('switch').innerHTML = '';
            areaObj = Home;
        }
    },
    left:function () {  
        if(this.itemNo == 0 || this.itemNo == 4)return;
        removeClass(getId('switchitem_'+this.itemNo),'swicthHove');
        this.itemNo--;
        addClass(getId('switchitem_'+this.itemNo),'swicthHove')  
    },
    right:function () {  
        if(this.itemNo == 3 || this.itemNo == 7)return;
        removeClass(getId('switchitem_'+this.itemNo),'swicthHove');
        this.itemNo++;
        addClass(getId('switchitem_'+this.itemNo),'swicthHove')  
    },
    back:function () {
        addClass(getId('mavHover_'+Home.navItemNo),'mavHover');
        getId('switch').innerHTML = '';
        areaObj = Home;
    },
    enter:function () {  
        var _this = this;
        if(_this.itemNo>=6){
          if(_this.itemNo == 6){
            // 多纳
            routeJump(4,'',seleList[5].jsonUrl+'&level=3',seleList[5].layout)
            // Cookies.set( 'specialHomeUrl','source/beva/beva.html', {path:'/'});
            // window.location.href = 'source/special/special.html'  
          }else if(_this.itemNo == 7){
            // 贝瓦
            routeJump(4,'',seleList[6].jsonUrl+'&level=3',seleList[6].layout)
            // Cookies.set( 'bevaHomeUrl','source/beva/beva.html', {path:'/'});
            // window.location.href = 'source/beva/beva.html'
          }
          return
        }
        getYhNavigationBar(function (resp) { 
            if(eval('(' + resp + ')').code == 200){
              Home.homeCategoryList = eval('(' + resp + ')')
              var homeCategoryList = eval('(' + resp + ')');
              var catList = eval('(' + resp + ')').data.catList.slice(0,6);
              var itemhtml = ''
              for (var i = 0; i < catList.length; i++) {
                var liHtml = '<li id="item_'+i+'">'+catList[i].catName+'</li>'
                itemhtml+=liHtml;
              }
              getId('navWrap').innerHTML = itemhtml;
              var url = homeCategoryList.data.catList[_this.itemNo].jsonUrl;
              if(_this.itemNo>0 && _this.itemNo<=5){
                if(Cookies.get('homeCatId')){
                  Cookies.remove('homeCatId');
                };
                Cookies.set('homeCatId',homeCategoryList.data.catList[_this.itemNo].catId,{path:'/'});//筛选埋点使用
               }
              console.log('首页地址===='+homeCategoryList.data.catList[_this.itemNo].jsonUrl)
              Cookies.set( 'homeUrl',url, {path:'/'});
              Cookies.set( 'homeUrItemNo',_this.itemNo, {path:'/'});
              _this.tempHomeInit(url,_this.itemNo)
            }
           },function (error) { 
            console.log('栏目数据请求错误：'+error)
            })
    },
    tempHomeInit:function (url,itemNo,backItemNo,backColumnName) {
      if(backItemNo >= 0){
        Home.scrollArr = eval('('+Cookies.get('scrollArr')+')') || [];
      }
      getId('switch').innerHTML = ''; // 删除切换页
      getId('navWrap').style.display = 'none';// 删除导航条
      areaObj = Home;
      Home.homeCategoryChildrenList = [];
      getHomeCategoryData(url,function (data) { 
        Home.homeCategoryChildrenList = eval('(' + data + ')').data.specialList;
        if(itemNo == 0){
          homeRecommend.init(eval('(' + data + ')'))
          getId('navWrap').style.display = 'block';
          Cookies.remove('homeUrl');
          Cookies.remove('homeUrItemNo');
          Cookies.remove('homeName');
          Home.pos = 0;
          Home.itemNo = 0;
          for ( var i = 0; i < 5; i++) {
            removeClass(getId('item_'+i),'liHover_'+i);         
          }
          addClass(getId('item_'+0),'navLiHover');
          // homeRecommend.firstModularInit();
          // Cookies.set('homeName','homeRecommend',{path:'/'})
        }else if(itemNo == 1){
          homePreschool.init(eval('(' + data + ')'));
          if(backColumnName){
            if(backColumnName !== 'navList'){
              eval(backColumnName).init(backItemNo*1);
            }else{
              Home.pos = 1;
              Home.navItemNo = getQueryString('navItemNo')*1;
              addClass(getId('navItem_'+Home.navItemNo),'mavHover');
            }
          }else{
            homePreschool.firstModularInit();              
          }
          Cookies.set('homeName','homePreschool',{path:'/'})    
        }else if(itemNo == 2){
          homePrimarySchool.init(eval('(' + data + ')'))
          if(backColumnName){
            if(backColumnName !== 'navList'){
              eval(backColumnName).init(backItemNo*1);
            }else{
              Home.pos = 1;
              Home.navItemNo = getQueryString('navItemNo')*1;
              addClass(getId('navItem_'+Home.navItemNo),'mavHover');
            }
          }else{
            homePrimarySchool.firstModularInit();              
          }
          Cookies.set('homeName','homePrimarySchool',{path:'/'})
        }else if(itemNo == 3){
          homeMiddleSchool.init(eval('(' + data + ')'))
          if(backColumnName){
            if(backColumnName !== 'navList'){
              eval(backColumnName).init(backItemNo*1);
            }else{
              Home.pos = 1;
              Home.navItemNo = getQueryString('navItemNo')*1;
              addClass(getId('navItem_'+Home.navItemNo),'mavHover');
            }
          }else{
            homeMiddleSchool.firstModularInit();              
          }
          Cookies.set('homeName','homeMiddleSchool',{path:'/'})
        }else if(itemNo == 4){
          homeHighSchool.init(eval('(' + data + ')'))
          if(backColumnName){
            if(backColumnName !== 'navList'){
              eval(backColumnName).init(backItemNo*1);
            }else{
              Home.pos = 1;
              Home.navItemNo = getQueryString('navItemNo')*1;
              addClass(getId('navItem_'+Home.navItemNo),'mavHover');
            }
          }else{
            homeHighSchool.firstModularInit();              
          }
          Cookies.set('homeName','homeHighSchool',{path:'/'})
        }else if(itemNo == 5){
          homeAdultEducation.init(eval('(' + data + ')'))
          if(backColumnName){
            if(backColumnName !== 'navList'){
              eval(backColumnName).init(backItemNo*1);
            }else{
              Home.pos = 1;
              Home.navItemNo = getQueryString('navItemNo')*1;
              addClass(getId('navItem_'+Home.navItemNo),'mavHover');
            }
          }else{
            homeAdultEducation.firstModularInit();              
          }
          Cookies.set('homeName','homeAdultEducation',{path:'/'})
        }
       },function (errer) { 
         console.log(errer)
       })     
    }
};