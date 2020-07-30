var special = {};
special.itNum = 0;
special.Num = 0;
special.data = {};
special.url = "";
special.isSC = true;
special.specialDataList={};
special.cache = null;
if (Cookies.get('INDEXY')) {
  special.cache =JSON.parse(Cookies.get('INDEXY'));
  special.url = special.cache.url;
  special.itNum = (special.cache.x)*1;
  special.Num = (special.cache.y)*1;
} else if(Cookies.get('detailUrl')){
  console.log(Cookies.get('detailUrl'));
  special.url = Cookies.get('detailUrl');
} 
// if (!special.url) {
//   special.url = "http://47.97.96.103/?s=116|14&p=yhSpecialDetail&k=1&v=1&specialId=205780&c=14"
// }
document.body.parentNode.style.overflow = "hidden";
function init() {
    getYhSpecialList_nc(
      special.url,function (response) {
            special.data = JSON.parse(response).data;
            console.log(special.data);
            special.specialDataList = split_array(special.data.elementList,6);
            special.initList(special.specialDataList);
            var body = document.getElementsByTagName('body')[0];
            var text = document.getElementById('top_text');
            text.innerHTML = special.data.specialName;
            if (special.data.specialImg) {
              body.style.background = "url("+special.data.specialImg+")";
              body.style.backgroundRepeat = "no-repeat";
              body.style.backgroundSize = " 100% 100%";
            } else {
              body.style.background = "#00605D";
              body.style.backgroundRepeat = "no-repeat";
              body.style.backgroundSize = " 100% 100%";
            }
            var bottom = document.getElementById("special_bottom");
            if (special.specialDataList.length<=1) {
              bottom.style.visibility="hidden";
            }else{
              bottom.children[0].style.width = 915/special.specialDataList.length+"px";
            }
            special.areaObj();
            var lists = document.getElementById("specail_List");
            lists.children[special.Num].className ="list_center active"
            collectData("123456","123456");
        }
    )
}

function addFav(data){
  var urls = historylUrl + '/collect?version=1';
  getYhSpecialSC(urls,data,function(response) {
    console.log(response);
  })
}

function delCookie(name){
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var cval = Cookies.get(name);
  if (cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}

function removeFav(data){
  var urls = historylUrl + '/del?version=1';
  getYhSpecialSC(urls,data,function(response) {
    console.log(response);
  })
}

function collectData(siteId,userId) {
  var url = historylUrl +
    "/list?version=1&siteId=" + siteId + "&userId=" + userId +
    "&relateId=" + special.data.specialId + "&collectType=2"
    console.log(url);
    getYhSpecialList_nc(url,function(res){
    console.log(res);
     if (typeof(res)=="string") {
       res = JSON.parse(res);
     }
    var lists = document.getElementById("input");
    if(res.data.resultNum==1) {
      special.isSC=false;
      lists.children[0].src = './1837.png'
    } else {
      special.isSC=true;
      lists.children[0].src = './1838.png'
    }
  })
}

function split_array(arr, len){
    var a_len = arr.length;
    var result = [];    
    for(var i=0;i<a_len;i+=len)
    {    
    result.push(arr.slice(i,i+len));    
    }     
    return result;
}

init();

special.initList = function (list) {
    // var d=document.createDocumentFragment();
    // var list = document.getElementsByClassName("specail_List");
    var lists = document.getElementById("specail_List");
    lists.innerHTML = ""; 
    var fragment = document.createDocumentFragment();
    for (var index = 0; index < list[special.itNum].length; index++) {
        var div = document.createElement("div");
        div.id = 'list_center_' + index;
        div.className = 'list_center';
        var elementDom = list[special.itNum][index];
        if (elementDom.elementImg) {
            div.style.backgroundImage = "url(" + elementDom.elementImg + ")";
          } else {
            div.style.backgroundImage = "url(./source/public/images/index/recommendi-nit.png)";
          }
          // 设置推荐位的css
          div.style.backgroundRepeat = "no-repeat";
          div.style.backgroundSize = " 100% 100%";
          // 设置推荐位属性
          div.setAttribute("jsonUrl", elementDom.jsonUrl);
        fragment.appendChild(div);
    }
    lists.appendChild(fragment);
} 

special.removeCss = function(){
    var lists = document.getElementById("specail_List");
    lists.children[this.Num].className ="list_center";
  },

special.addCss = function(){
    var lists = document.getElementById("specail_List");
    lists.children[this.Num].className ="list_center active";
  }

special.right = function () {
    if (this.isTop)return;
    if (this.Num>=5) {
        if (this.itNum<this.specialDataList.length-1) {
            this.removeCss();
            this.Num = 0;
            this.itNum++;
            var bottom = document.getElementById("special_bottom");
            bottom.children[0].style.marginLeft=(915/special.specialDataList.length)*this.itNum+"px";
            bottom.children[1].innerHTML=(this.itNum+1)+'/'+special.specialDataList.length;
            special.initList(this.specialDataList);
            this.addCss();
        } else {
            return
        }
    } else if (this.Num<this.specialDataList[this.itNum].length-1) {
        this.removeCss();
        this.Num++;
        this.addCss(); 
    }else{
        return
    }
}

special.left = function () {
    if (this.isTop)return;
    if (this.Num<=0) {
        if (this.itNum>0) {
            this.removeCss();
            this.Num = 5;
            this.itNum--;
            var bottom = document.getElementById("special_bottom");
            bottom.children[0].style.marginLeft=(915/special.specialDataList.length)*this.itNum+"px";
            bottom.children[1].innerHTML=(this.itNum+1)+'/'+special.specialDataList.length;
            special.initList(this.specialDataList);
            this.addCss();
        } else {
            return
        }
    } else  {
        this.removeCss();
        this.Num--;
        this.addCss(); 
    }
 }

special.up = function () {
    if (this.isTop)return;
    this.isTop = true;
    this.removeCss();
    var lists = document.getElementById("input");
    lists.className ="top_input hover";
}

special.down = function () {
    if (!this.isTop)return;
    this.isTop = false;
    this.addCss(); 
    var lists = document.getElementById("input");
    lists.className ="top_input";
}
special.enter = function () {
    if (this.isTop){
      var lists = document.getElementById("input");
      if (this.isSC) {
        lists.children[0].src = './1837.png'
        var siteId = '123456';
        var userId = '123456';
        var collectType = '2'; //收藏类型(0-主播,1-资产,2-专题)
        var relateId = special.data.specialId;
        var relateTitle = special.data.specialName;
        var relateImg = special.data.specialImg;
        var relateUrl = special.url;
        var relateLayout = 'Subject_Detail_TP1';
        var data ={
          "siteId":siteId,
          "userId":userId,
          "collectType":collectType,
          "relateId":relateId,
          "relateTitle":relateTitle,
          "relateImg":relateImg,
          "relateUrl":relateUrl,
          "relateLayout":relateLayout
        };
        addFav(data);
        this.isSC = false;
      }else{
        lists.children[0].src = './1838.png'
        var siteId = '123456';
        var userId = '123456';
        var collectType = '2'; //收藏类型(0-主播,1-资产,2-专题)
        var relateId = special.data.specialId;
        var data ={
          "siteId":siteId,
          "userId":userId,
          "collectType":collectType,
          "relateId":relateId,
        };
        removeFav(data);
        this.isSC = true;
      }
    }else{
      // console.log(this.specialDataList[this.itNum][this.Num].jsonUrl);
      var xy = {
        'x':this.itNum,
        'y':this.Num,
        'url':this.url
      }
      document.cookie = 'detailUrl='+this.specialDataList[this.itNum][this.Num].jsonUrl+';path=/';
      document.cookie = 'backUrl=./../special/index.html;path=/';
      document.cookie = 'INDEXY='+JSON.stringify(xy);
      window.location.href= "./../detail/detail.html"

    }
}
special.back = function (){
  if (Cookies.get('INDEXY')) {
    delCookie('INDEXY');
  }
  if (Cookies.get('twoStageBackUrl')) {
    window.location.href = Cookies.get('twoStageBackUrl');
  }
}
special.areaObj = function () {
    console.log('推荐位头部模板绑定键值');
    window.Handlekey(this.getKeyValue.bind(this));
    // 初始化焦点样式
  }
  
special.getKeyValue = function (kc) {
    console.log("推荐位模板接收键值"+kc);
    if (kc === 'right') {
      this.right();
    } else if (kc === 'left') {
      this.left();
    } else if (kc === 'up') {
      this.up();
    } else if (kc === 'down') {
      this.down();
    } else if (kc === 'ok') {
      this.enter();
    } else if (kc === 'back') {
      this.back()
    }
  }