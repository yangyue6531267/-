

var KEYMAP = {
  38: "up",
  40: "down",
  37: "left",
  39: "right",
  13: "enter",
  8: "back",
  27: "back",
  22: "back",
  283: 'back',
  461: "back",
  340: "back",
  181: "home", // 首页
  278: "message", // 信息
  272: "home"
};
//按键分发事件
var onKeyPress;
//按键prev处理函数
var grepEvent = function (e) {
  var keyCode = e.keyCode || e.which;
  return onKeyPress(KEYMAP[keyCode]);
};

var pageIndex = getQueryString('pageIndex');
var pageItemNo = getQueryString('itemNo');
var pageKeyWord = getQueryString('keyWord');
var pageKeyItem = getQueryString('keyItem');
var keyList = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
function init(){
    var element = getId('keycodeContent');
    var html = "";
    for (var i = 0; i < keyList.length; i++) {
      var elementDom = keyList[i];
      var div = '<li class="key-item key' + i + '" id="key-item' + i + '">' + elementDom + '</li>'
      html += div;
    }
    element.innerHTML = html;
    areaObj = keyboard;
    if(pageIndex){
      if(pageKeyWord == ''){
        searchContent.init()
      }else{
        searchContent.getData(pageKeyWord,pageIndex,'back');
      }
      keyboard.keyWord = pageKeyWord;
      keyboard.itemNo = pageKeyItem*1;
      getId('inputBox').innerText = keyboard.keyWord;
      areaObj = searchContent;
      return;
    }
    toggleClass(getId('key-item'+keyboard.itemNo),'keyHover');
    keyboard.addkeyboardHover()
    searchContent.init()
    try{
      bi.pageJump('0201','100-1','0101',Cookies.get('homeCatId'))
    }catch(e){
      console.log('错误埋点'+e)
    }
}
// 搜索键盘区
var keyboard = {
  keyWord:'',
  itemNo:14,
  tempItemNo:-1,
  addkeyboardHover:function(){
    addClass(getId('inputBox'),'inputBoxHover');
    addClass(getId('keycodeContent'),'keycodeContentHover');
  },
  removeKeyboardHover:function () { 
    removeClass(getId('inputBox'),'inputBoxHover');
    removeClass(getId('keycodeContent'),'keycodeContentHover');
  },
  up:function () {  
    if(this.itemNo == -1)return;
    if(this.itemNo<=5){
      this.tempItemNo = this.itemNo;
      toggleClass(getId('key-item'+this.itemNo),'keyHover');
      this.itemNo = -1;
      toggleClass(getId('deleteBtn'),'btnHover');
      return;
    };
    toggleClass(getId('key-item'+this.itemNo),'keyHover');
    this.itemNo-=6;
    toggleClass(getId('key-item'+this.itemNo),'keyHover');
  },
  down:function () {  
    if(this.itemNo>=30)return;
    if(this.itemNo == -1){
      this.itemNo = this.tempItemNo;
      toggleClass(getId('deleteBtn'),'btnHover');
      toggleClass(getId('key-item'+this.itemNo),'keyHover');
      return;
    }
    toggleClass(getId('key-item'+this.itemNo),'keyHover');
    this.itemNo+=6;
    toggleClass(getId('key-item'+this.itemNo),'keyHover');
  },
  left:function () {  
    if(this.itemNo == -1)return;
    if(this.itemNo%6 == 0)return;
    toggleClass(getId('key-item'+this.itemNo),'keyHover');
    this.itemNo-=1;
    toggleClass(getId('key-item'+this.itemNo),'keyHover');
  },
  right:function () {  
    if(this.itemNo == -1)return;
    if((this.itemNo+1)%6 == 0){
      this.removeKeyboardHover();
      areaObj = searchContent;
      // this.tempItemNo = this.itemNo;
      toggleClass(getId('key-item'+this.itemNo),'keyHover');
      // this.itemNo = -2;
      // searchContent.itemNo = 0;
      toggleClass(getId('content-item'+searchContent.itemNo),'resultHove');
      return
    };
    toggleClass(getId('key-item'+this.itemNo),'keyHover');
    this.itemNo+=1;
    toggleClass(getId('key-item'+this.itemNo),'keyHover');    
  },
  enter:function () {  
    if(this.itemNo == -1){
      searchContent.itemNo = 0;
      searchContent.pindex = 1;
      searchContent.totalNumber = 0;
      searchContent.dataList = [];
      if(this.keyWord.length == 0)return;
      this.keyWord = this.keyWord.substring(this.keyWord.length-1,0);
      getId('inputBox').innerText = this.keyWord;
      if(this.keyWord.length == 0){
        searchContent.init();
        return
      };
      searchContent.getData(this.keyWord,1);
      return;
    }
    if(this.keyWord.length>=10)return;
    this.keyWord += getId('key-item'+this.itemNo).innerText;
    getId('inputBox').innerText = this.keyWord;
    searchContent.getData(this.keyWord,1);
  },
  back:function () {  
    var backUrl = Cookies.get('searchBackUrl') || '../../index.html';
    window.location.href = backUrl;
  }
};



// 搜索内容区
var searchContent = {
  name:'searchContent',
  itemNo:0,
  pindex:1,
  totalNumber:0,
  dataList:[],
  getData:function (keyWord,pindex,state,itemNo) {  
    console.log(this.itemNo)
    if(arguments[1] == 1){
      this.pindex = 1;
      // toggleClass(getId('content-item'+this.itemNo),'resultHove'); 
    }
    getsearchResult('http://47.97.96.103/?s=120|15&p=yhSearch&k=1&v=1&searchType=all&word='+keyWord+'&pindex='+(pindex-1)*8+'&psize=8',function(resp){
      if(eval('(' + (resp) + ')').code != 200)return;
      searchContent.totalNumber = eval('(' + (resp) + ')').data[0].resultNum;
      if(searchContent.totalNumber == 0){
        // 搜索无内容时上报埋点
        try{
          var tempKeyWord = keyWord.split('').join('|');
          bi.search(0,tempKeyWord,'','');
        }catch(e){
          console.log('埋点报错'+e)
        }
        searchContent.init()
        getId('scrollbox').style.display = 'none'; 
        return;
      }
      if(eval('(' + (resp) + ')').data[0]){
        searchContent.dataList = eval('(' + (resp) + ')').data[0].resultList;
        searchContent.template(eval('(' + (resp) + ')').data[0],state,itemNo);
      }
    },function(error){
        console.log('搜索结果报错'+error)
    })  
  },
  template:function (data,state) {  
    console.log(data)
    getId('scrollbox').style.display = 'block'; 
    var element = getId('searchContent');
    var itemHtml = '';
    for (var i = 0; i < data.resultList.length; i++) {
      var div = '<div class="itemWrap"><div class="imgWrap" id="content-item'+i+'"><li class="content-item'+i+'"><img src="'+data.resultList[i].elementImg+'"></li></div><div class="itemName">'+data.resultList[i].elementName+'</div></div>';
      itemHtml+=div;
    }
    var rcHtml = '<div class="recommendContent"><ul>'+itemHtml+'</ul></div>';
    element.innerHTML = rcHtml;
    if(pageItemNo && state == 'back'){
      this.itemNo = pageItemNo*1;
      this.pindex = pageIndex*1;
      addClass(getId('content-item'+pageItemNo),'resultHove')
    }
    if(data.resultNum>8){
      var scrollHtml = '<div class="pageNum">'+this.pindex+'/'+(Math.ceil(data.resultNum/8))+'</div><div class="barWrap"><div class="bar"></div></div>';
      getId('scrollbox').innerHTML = scrollHtml;
    }else{
      getId('scrollbox').style.display = 'none'; 
    }
    if(state == 'down'){
      if(arguments[2] != undefined){
        this.itemNo = arguments[2];
      }else{
        this.itemNo-=4;
      }
      toggleClass(getId('content-item'+this.itemNo),'resultHove'); 
    }else if(state == 'up'){
      this.itemNo+=4
      toggleClass(getId('content-item'+this.itemNo),'resultHove'); 
    }
  },
  init:function () {  
    var element = getId('searchContent');
    if(keyboard.keyWord == ''){
      getsearchRecommend(function(resp){
        var searchRecomendData = eval('(' + (resp) + ')');
        console.log(searchRecomendData.data.hotAssetList)
        if(searchRecomendData.code == 200){
          if(searchRecomendData.data.hotAssetList){
            var tagHtml = '<div class="recommendTag">热搜榜单</div>';
            var itemHtml = '';
            searchContent.dataList = searchRecomendData.data.hotAssetList;
            for (var i = 0; i < searchRecomendData.data.hotAssetList.length; i++) {
              if(i>3)break;
              var div = '<div class="itemWrap"><div class="imgWrap" id="content-item'+i+'"><li class="content-item'+i+'"><img src="'+searchRecomendData.data.hotAssetList[i].elementImg+'"></li></div><div class="itemName">'+searchRecomendData.data.hotAssetList[i].elementName+'</div></div>';
              itemHtml+=div;
            }
            var rcHtml = '<div class="recommendContent"><ul>'+itemHtml+'</ul></div>';
            element.innerHTML = tagHtml+rcHtml;     
          }
        }
        if(areaObj && areaObj.name == 'searchContent'){
          addClass(getId('content-item'+pageItemNo),'resultHove');
          searchContent.itemNo = pageItemNo*1;
          console.log('推荐资产返回的')
        }
      },function(error){
        console.log('推荐接口请求失败'+error)
      })
    }else{
      // 没有搜到后显示推荐
      if(searchContent.totalNumber == 0){
        getsearchRecommend(function(resp){
          var searchRecomendData = eval('(' + (resp) + ')');
          console.log(searchRecomendData.data.hotAssetList)
          if(searchRecomendData.code == 200){
            if(searchRecomendData.data.hotAssetList){
              var textHtml = '<div class="textHtml">没有搜索到该关键词的内容，换个词试试吧</div>'
              var tagHtml = '<div class="recommendTag">热搜榜单</div>';
              var itemHtml = '';
              searchContent.dataList = searchRecomendData.data.hotAssetList;
              for (var i = 0; i < searchRecomendData.data.hotAssetList.length; i++) {
                if(i>3)break;
                var div = '<div class="itemWrap"><div class="imgWrap" id="content-item'+i+'"><li class="content-item'+i+'"><img src="'+searchRecomendData.data.hotAssetList[i].elementImg+'"></li></div><div class="itemName">'+searchRecomendData.data.hotAssetList[i].elementName+'</div></div>';
                itemHtml+=div;
              }
              var rcHtml = '<div class="recommendContent"><ul>'+itemHtml+'</ul></div>';
              element.innerHTML = textHtml+tagHtml+rcHtml;  
            }
            if(areaObj && areaObj.name == 'searchContent'){
              searchContent.itemNo = pageItemNo*1;
              addClass(getId('content-item'+pageItemNo),'resultHove');
              console.log('推荐资产返回的')
            }
          }
        },function(error){
          console.log('推荐接口请求失败'+error)
        })
      }
    }

  },
  up:function () {  
    if(keyboard.keyWord.length == 0)return;
    if(this.pindex == 1 && this.itemNo <= 3)return;
    if(this.itemNo>3){
      toggleClass(getId('content-item'+this.itemNo),'resultHove');
      this.itemNo -=4;
      toggleClass(getId('content-item'+this.itemNo),'resultHove');
    }else{
      this.pindex--;
      searchContent.getData(keyboard.keyWord,this.pindex,'up')  
    }
  },
  down:function () { 
    if(keyboard.keyWord.length == 0)return;
    var nowItemNo = (this.pindex-1)*8+this.itemNo
    if ( nowItemNo+4 >= this.totalNumber) {
      // 下一行不是完整四个资产 需要判断
      var maxItem = Math.floor(this.totalNumber / 4) * 4;
      if (nowItemNo >= maxItem || maxItem == this.totalNumber ){
        // 此刻是最后一行不需要做任何操作
        return;
      } else {
        // 需要将焦点移到最后一个资产
        var itemNo2 = this.totalNumber - nowItemNo-1 // 差值
        if (this.itemNo > 3){
          // 需要翻页
          this.pindex++;
          var  itemNo = this.itemNo - 8 + itemNo2;
          searchContent.getData(keyboard.keyWord,this.pindex,'down',itemNo)  
        } else {      
          // 不需要翻页
          toggleClass(getId('content-item'+this.itemNo),'resultHove');
          this.itemNo += itemNo2;
          toggleClass(getId('content-item'+this.itemNo),'resultHove');
        }
      }
    }else{
      // 正常翻页
    if(this.itemNo<=3){
      toggleClass(getId('content-item'+this.itemNo),'resultHove');
      this.itemNo+=4;
      toggleClass(getId('content-item'+this.itemNo),'resultHove');
    }else{
      this.pindex++;
      searchContent.getData(keyboard.keyWord,this.pindex,'down')  
    }
    }
  },
  left:function () {  
    if(this.itemNo%4 == 0){
      areaObj = keyboard;
      toggleClass(getId('content-item'+searchContent.itemNo),'resultHove');
      // keyboard.itemNo = keyboard.tempItemNo;
      toggleClass(getId('key-item'+keyboard.itemNo),'keyHover');
      keyboard.addkeyboardHover();
      this.itemNo = 0;
      return;
    }
    toggleClass(getId('content-item'+this.itemNo),'resultHove');
    this.itemNo--;
    toggleClass(getId('content-item'+this.itemNo),'resultHove');
  },
  right:function () {  
    if(keyboard.keyWord.length !== ''){
      if(this.itemNo == 3)return;
    }else{
      if((this.itemNo+1)%4 == 0)return;
      if((this.pindex-1)*8+this.itemNo+1>=this.totalNumber)return;
    }
    toggleClass(getId('content-item'+this.itemNo),'resultHove');
    this.itemNo++;
    toggleClass(getId('content-item'+this.itemNo),'resultHove');
  },
  back:function () {  
    var backUrl = Cookies.get('searchBackUrl') || '../../index.html';
    window.location.href = backUrl;
  },
  enter:function(){
    if(keyboard.keyWord == ''){
      // 点击搜索推荐资产上报埋点
      try{
        bi.search('2',keyboard.keyWord,'1',this.dataList[this.itemNo].elementId);
      }catch(e){
        console.log('埋点报错'+e)
      }
    }else{
      if(searchContent.totalNumber == 0){
        // 没有搜索到资产点击推荐资产上报埋点
        try{
          var tempKeyWord = keyboard.keyWord.split('').join('|');
          bi.search('0',tempKeyWord,'1',this.dataList[this.itemNo].elementId);
        }catch(e){
          console.log('埋点报错'+e)
        }
      }else{
        // 点击搜索资产上报埋点
        try{
          var tempKeyWord = keyboard.keyWord.split('').join('|');
          bi.search('1',tempKeyWord,'1',this.dataList[this.itemNo].elementId);
        }catch(e){
          console.log('埋点报错'+e)
        }
      }
    };
    var backUrl = window.location.pathname + '?pageIndex='+this.pindex+'&itemNo=' + this.itemNo + '&keyWord=' + keyboard.keyWord +'&keyItem=' + keyboard.itemNo;
    Cookies.set("backUrl", backUrl, { path: '/' });
    Cookies.set('detailUrl', this.dataList[this.itemNo].jsonUrl, { path: '/' })
    window.location.href = '../detail/detail.html'
  }
};
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
      areaObj.back();
      break;
    case "enter":
      areaObj.enter();
      break;
    case "home":
      areaObj.home();
      break;
  }
};
//事件绑定
document.onkeydown = grepEvent;