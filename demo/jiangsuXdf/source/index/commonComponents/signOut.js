// 退出挽留页

var signOutObj = {
    itemNo:0,
    name:'signOutObj',
    init:function () {
        var str = "<div class='signOutInner'>" +
        "<div class='signOutTab'>"+
          "<div class='signOutText'>"+
            "今天又有1105名同学加入新东方学习，你也想成为一员吗？"+
          "</div>"+
          "<div class='signOutOption'>"+
            "<span id='signOutOption0'>确认退出<i></i></span><span id='signOutOption1'>返回学习<i></i></span>"+
          "</div>"+
        "</div>"+
      "</div>"
      document.querySelector('.signOut').innerHTML = str;
      addClass(getId('signOutOption'+this.itemNo),'signOutOptionHover');
      document.querySelector('#signOutOption'+this.itemNo+' i').style.backgroundImage= "url('source/public/images/signOut/tuichuHover.png')"
     },
    left:function () { 
        if(this.itemNo == 0)return;
        removeClass(getId('signOutOption'+this.itemNo),'signOutOptionHover')
        document.querySelector('#signOutOption'+this.itemNo+' i').style.backgroundImage= "url('source/public/images/signOut/fanhui.png')"
        this.itemNo--;
        addClass(getId('signOutOption'+this.itemNo),'signOutOptionHover')
        console.log(document.querySelector('#signOutOption'+this.itemNo+' i').style.backgroundImage)
        document.querySelector('#signOutOption'+this.itemNo+' i').style.backgroundImage= "url('source/public/images/signOut/tuichuHover.png')"
     },
    right:function () { 
        if(this.itemNo == 1)return;
        removeClass(getId('signOutOption'+this.itemNo),'signOutOptionHover')
        document.querySelector('#signOutOption'+this.itemNo+' i').style.backgroundImage="url('source/public/images/signOut/tuichu.png')"
        this.itemNo++;
        addClass(getId('signOutOption'+this.itemNo),'signOutOptionHover')
        document.querySelector('#signOutOption'+this.itemNo+' i').style.backgroundImage="url('source/public/images/signOut/fanhuiHover.png')"
     },
    enter:function () { 
        if(this.itemNo == 1){
            var keyObj = Cookies.get('keyObj');
            areaObj = eval(keyObj);
            Cookies.remove('keyObj')
            document.querySelector('.signOut').innerHTML = '';
        }else{
          prompt('yanhua://epg/exit');
          bi.end()
        }
     },
    down:function () {}
};

