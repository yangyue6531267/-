
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
  272: "home",
};

//列的滚动距离
var rowDiff = 400;

//行的滚动距离
var colDiff = 1140;

//收藏到推荐内容的距离
var recDiff = 176;

var timeout;

var grepEvent = function( e ){
  var keyCode = e.keyCode || e.which;
  e.preventDefault()
  return onKeyPress(KEYMAP[keyCode]);
};

console.log( 'transform是否存在:' + ( 'transform' in document.documentElement.style ) );

var areaObj;

var url = "http://47.97.96.103/?s=120|15&p=yhAssetDetail&k=1&v=1&assetId=611187&c=15"
var collect_Content = {};

var collect_recommend = {};

var collect_list_progress = {};

var vertical_scrollBar = {};

var value = {
  detailData:null,
  isBack:false,
  detailUrl:'',
  getValue: function(){
    this.detailUrl = Cookies.get('detailUrl')
  }
}

function setCookie ( obj,jsonUrl ){
  Cookies.set( 'parent_page_type', '0501', {
    path:'/'
  });
  Cookies.set( 'parent_page_id', '103-1', {
    path:'/'
  });
  if(!obj) return;
  var href = window.location.href;
  var backUrl = href.indexOf('?') != -1 ? href.split('?')[0] : href;
  var paramString = objToUrl( obj, true );
  Cookies.set( 'backUrl', backUrl + '?'+ paramString, {
    expires:7,
    path:'/'
  });
  Cookies.set('detailUrl',jsonUrl || url,{
    path:'/'
  });
}

function getRecomd(){
  //获取推荐列表
  getsearchRecommend(function( res ){
    timeout = 0;
    res = eval('('+ res +')');
    collect_recommend.recommendList = res.data.hotAssetList;
    console.log(res,'res');
    collect_recommend.init();
    var rec ='';
    rec = getUrlParam('rec');
    if( rec ){
      if(getElement('.yh_list_item-' + collect_Content.pos +'-'+ collect_Content.curPageIndex +'-' + collect_Content.itemNo)){
        removeClass( getElement('.yh_list_item-' + collect_Content.pos +'-'+ collect_Content.curPageIndex +'-' + collect_Content.itemNo),'hover' );
      }
      collect_Content.pos = collect_Content.collect_list.length - 1;
      if(!collect_Content.pos){
        collect_Content.topDiff = collect_Content.el.offsetTop - recDiff;
      } else {
        collect_Content.topDiff = collect_Content.el.offsetTop - ( ( collect_Content.collect_list.length - 1 ) * rowDiff + recDiff);
      }
      if( collect_Content.collect_list.length ){
        collect_Content.domTransition( 'el', 'top', collect_Content.topDiff + 'px');
        if( collect_Content.vProBlock ){
          collect_Content.domTransition( 'vProBlock','top', ( ( collect_Content.pos + 1 ) / ( collect_Content.collect_list.length + 1 )) * 100 + '%' );
        }
      }
      collect_recommend.itemNo = rec;
      if( rec > 5 ){
        collect_recommend.domTransition('scroller',  - ( rec - 5 )  );
      }  
      addClass( getElement('.yh_list_item-' + collect_recommend.itemNo),'hover' );
      areaObj = collect_recommend;
    } else {
      if( collect_Content.collect_list.length ){
        areaObj = collect_Content;
        var exist = getElement('.yh_list_item-' + collect_Content.pos +'-'+ collect_Content.curPageIndex +'-' + collect_Content.itemNo);
        addClass( exist,'hover' );
        if( collect_Content.vProBlock ){
          collect_Content.domTransition( 'vProBlock','top', ( collect_Content.pos / ( collect_Content.collect_list.length + 1 )) * 100 + '%' );
        }
      } else {
        var exist = getElement('.yh_list_item-' + collect_recommend.itemNo);
        if( exist ){
          addClass( getElement('.yh_list_item-' + collect_recommend.itemNo),'hover' );
        }
        areaObj = collect_recommend;
      }
    }
  },function(){
    timeout ++;
    if ( timeout > 3 ) {
      return;
    }
    // getRecomd();
  });
}


//查询用户观看历史记录
var userObj = userTrackObj.searchUserTrack( false );
userTrackList( userObj,function(res){
  value.detailData = eval('('+ res +')').data;
  console.log(value.detailData.resultList);
  if( window.location.href.indexOf('?') != -1 ){
    var tagArr = getUrlParam('tag') && getUrlParam('tag').split('-');
    if( tagArr ){
      collect_Content.pos = tagArr[0];
      collect_Content.curPageIndex = tagArr[1];
      collect_Content.itemNo = tagArr[2];
    }
  }
  collect_Content.init( function(){
    var exist = getElement('.yh_list_item-' + collect_Content.pos +'-'+ collect_Content.curPageIndex +'-' + collect_Content.itemNo);
    if( !exist ){
      console.log('不存在');
      var pageExist = collect_Content.collect_list[ collect_Content.pos ].list[ tagArr[1] ];
      var itemExist = collect_Content.collect_list[ collect_Content.pos ].list;
      collect_Content.pos = tagArr[0];
      if ( pageExist ) {
        collect_Content.curPageIndex = tagArr[1]; 
        collect_Content.itemNo =  tagArr[2] - 1;
      } else {
        if ( itemExist ) {
          collect_Content.curPageIndex = itemExist.length - 1;
          collect_Content.itemNo = 5;
        } else {
          collect_Content.curPageIndex = 0;
          collect_Content.itemNo = 0;
        }
        
      }
    } 
  });
  
  getRecomd();
  bi.pageJump( '103-1', '0501' );
},function(err){
  console.log(err);
});


collect_list_progress.getDomStr = function( tag, pageIndex, totalIndex ){
  var per = pageIndex / totalIndex * 100 + "%";
  var pro = '<div class="list_scrollBar_Content">'+
             '<div class="list_scrollBar">'+
              '<div class="list_scrollBlock list_scrollBlock-'+ tag +'" style="width:'+ per +'"></div>'+
             '</div>'+
            '</div>'
      return pro;
}




collect_Content.itemNo = 0;
 
collect_Content.pos = 0;

//当前页数下标
collect_Content.curPageIndex = 0;

//当前行
collect_Content.curList = '';

//当前页
collect_Content.curPage = '';

//当前滚动元素
collect_Content.curScroller = '';

//当前滑块
collect_Content.curProBlock = '';

collect_Content.hascollect = false;

collect_Content.leftDiff = 0;

collect_Content.topDiff = 0;

collect_Content.init = function( checkExist ){
  this.collect_list = groupingArr(value.detailData.resultList,'relateCategory');
  console.log(this.collect_list,'init')
  this.el = getElement('.collect_wrapper');
  this.template();
  if ( this.collect_list.length ) {
    checkExist();
  }
  this.topDiff = this.el.offsetTop - ( this.pos * rowDiff );
  this.domTransition( 'el', 'top', this.topDiff + 'px');
  this.leftDiff = this.curScroller.offsetLeft - ( colDiff * this.curPageIndex );
  this.domTransition('curScroller','left',this.leftDiff + 'px');
  if( this.vProBlock ){
    this.domTransition( 'vProBlock','top', ( this.pos / ( this.collect_list.length + 1 )) * 100 + '%' );
  }
  if( this.curProBlock ){
    this.curProBlock.style.left =  ( this.curPageIndex / this.curList.length * 100 + '%'); 
  }
};

collect_Content.template = function(){
  if ( this.collect_list.length ){
    var frg = '';
    var _this = this;
    if( this.collect_list.length ){
      vertical_scrollBar.init( 1 ,this.collect_list.length + 1 );
    }
    this.collect_list && this.collect_list.forEach(function( item,index ){
      var domStr = _this.getDomStr( item.list,index );
      var proStr = '';
      if( item.list.length > 1 ){
       proStr = collect_list_progress.getDomStr( index, 1 ,item.list.length );
      }
      var str = '<div class="yh_list">' +
                  '<div class="item_day">'+
                    '<i class="arc"></i>'+
                    '<span class="date"> '+item.title+' </span>'+
                  '</div>'+
                '<div class="yh_list_wrapper">'+
                    '<div class="yh_list_scroller yh_list_scroller-'+ index +'">'+
                      domStr +
                    '</div>'+
                  '</div>'+
                  proStr +
                '</div>'
      frg += str;
    });
    
    this.el.innerHTML = frg;
    this.curList = this.collect_list[this.pos].list;
    this.curScroller = getElement('.yh_list_scroller-' + this.pos);
    this.curProBlock = getElement('.list_scrollBlock-' + this.pos);
    this.vProBlock = getElement('.v_block');
    this.hascollect = true;
  } else {
    var str = '<div class="collect_none">'+
                '<span>还没有收藏记录，快去学习吧</span>'+
              '</div>'
    this.el.innerHTML = str;
  }
};

collect_Content.getDomStr = function( listData,row ){
  var list = '';
  listData && listData.forEach(function( item,tag ){
    item && item.forEach(function( element, index ){
      var dom = '<div class="yh_list_item yh_list_item-'+ row +'-'+tag+'-'+index+'">'+
                  '<div class="video_info">'+
                  '<div class ="info_bg"></div>'
                    +'<div class="video_score">'+
                      '<span class="score"> '+element.relateScore+' </span>'+
                    '</div>'+
                    '<div class="video_img">'+
                    '<img src="'+ element.relateImg +'"/>'
                    +'</div>'+
                  '</div>'+
                  '<div class="video_name">'+
                      element.relateTitle +
                  '</div>'+
                '</div>'
      list += dom;
    })
    
  });
  return list;
}

collect_Content.getCurDom = function(){
  this.curList = this.collect_list[this.pos].list;
  this.curScroller =  getElement('.yh_list_scroller-' + this.pos);
  this.curProBlock =  getElement('.list_scrollBlock-' + this.pos);
} 

collect_Content.domTransition = function( el, dir, dis ){
  if( this[el] ){
    this[el].style[dir] = dis;
  }
}

collect_Content.colTransition = function( flag, dis ){
  this.leftDiff = this.curScroller.offsetLeft - (flag * dis);
  this.domTransition('curScroller','left',this.leftDiff + 'px');
}

collect_Content.rowTransition = function( flag, dis ){
  this.topDiff = this.el.offsetTop - (flag * dis);
  this.domTransition( 'el', 'top', this.topDiff + 'px');
}


collect_Content.up = function(){
  if( this.topDiff != this.el.offsetTop ) return;
  if( this.pos > 0 ){
    removeClass( getElement('.yh_list_item-' + this.pos +'-'+ this.curPageIndex +'-' + this.itemNo),'hover' );
    this.pos --;
    this.getCurDom();
    if( this.vProBlock ){
      this.domTransition( 'vProBlock','top',(  this.pos / ( this.collect_list.length + 1 ) ) * 100 + '%' );
    }
    var dis;
    // this.topDiff = this.el.offsetTop + rowDiff;
    // this.domTransition( 'el', 'top', this.topDiff + 'px');
    if( this.curPageIndex > this.curList.length - 1 ){
      this.curPageIndex = this.curList.length - 1;
      this.leftDiff = - this.curPageIndex * colDiff ;
      
      dis = this.leftDiff + 'px'; 
    } else {
      dis = - this.curPageIndex * colDiff + 'px'; 
    }
    if( this.itemNo > this.curList[this.curPageIndex].length - 1 ){
      this.itemNo = this.curList[this.curPageIndex].length -1;
    }   
    this.rowTransition( -1, rowDiff);
    this.domTransition( 'curScroller','left', dis );
    if( this.curProBlock ){
      this.curProBlock.style.left =  ( this.curPageIndex / this.curList.length * 100 + '%'); 
    }
    addClass( getElement('.yh_list_item-' + this.pos +'-'+ this.curPageIndex +'-' + this.itemNo),'hover' );
  } else {
    console.log('到底了')
  }
};

collect_Content.down = function(){
  if( this.topDiff != this.el.offsetTop ) return;
  if( this.pos < this.collect_list.length - 1 ){
    removeClass( getElement('.yh_list_item-' + this.pos +'-'+ this.curPageIndex +'-' + this.itemNo),'hover' );
    this.pos ++;
    this.getCurDom();
    if( this.vProBlock ){
      this.domTransition( 'vProBlock','top', ( this.pos / ( this.collect_list.length + 1 ) ) * 100 + '%' );
    }
    var dis;
    // this.topDiff = this.el.offsetTop - rowDiff;
    // this.domTransition( 'el', 'top', this.topDiff+ 'px');
    if( this.curPageIndex > this.curList.length - 1 ){
      this.curPageIndex = this.curList.length - 1;
      this.leftDiff = - this.curPageIndex * colDiff ;
      
      dis = this.leftDiff + 'px';
    } else {
      dis = - this.curPageIndex * colDiff + 'px'; 
    }
    if( this.itemNo > this.curList[this.curPageIndex].length - 1 ){
      this.itemNo = this.curList[this.curPageIndex].length -1;
    }
    this.rowTransition( 1, rowDiff);
    this.domTransition( 'curScroller','left', dis );
    if( this.curProBlock ){
      this.curProBlock.style.left =  ( this.curPageIndex / this.curList.length * 100 + '%'); 
    }
    addClass( getElement('.yh_list_item-' + this.pos +'-'+ this.curPageIndex +'-' + this.itemNo),'hover' );
  } else {
    this.rowTransition( 1, recDiff);
    areaObj = collect_recommend;
    if( this.vProBlock ){
      this.domTransition( 'vProBlock','top', ( this.pos + 1  ) / ( this.collect_list.length + 1 ) * 100 + '%' );
    }
    removeClass( getElement('.yh_list_item-' + this.pos +'-'+ this.curPageIndex +'-' + this.itemNo),'hover' );
    addClass( getElement('.yh_list_item-' + collect_recommend.itemNo),'hover' );
  }
};

collect_Content.left = function(){
  this.direction(0);
};

collect_Content.right = function(){
  this.direction(1);
};

collect_Content.enter = function(){
  console.log( this.curList[this.curPageIndex][this.itemNo],'obj' );
  var jsonUrl = this.curList[this.curPageIndex][this.itemNo].relateUrl
  var tag =  this.pos + '-' + this.curPageIndex + '-' + this.itemNo
  setCookie({
    'tag':tag 
  },jsonUrl);
  window.location.href = '../detail/detail.html';
};

//键盘左右方向
collect_Content.direction = function( flag ){
  if( this.leftDiff != this.curScroller.offsetLeft ) return;
  removeClass( getElement('.yh_list_item-' + this.pos +'-'+ this.curPageIndex +'-' + this.itemNo),'hover' );
  if( flag ){
    if( this.itemNo < this.curList[this.curPageIndex].length - 1 ){
      this.itemNo ++;
    } else {
      if( this.curPageIndex < this.curList.length - 1 ){
        this.itemNo = 0;
        this.curPageIndex ++;
        if( this.curProBlock ){
          this.curProBlock.style.left =  ( this.curPageIndex / this.curList.length * 100 + '%'); 
        }
        this.colTransition( 1, colDiff );
        // this.leftDiff = this.curScroller.offsetLeft - colDiff;
        // this.domTransition('curScroller','left',this.leftDiff + 'px');
      }
    }
  } else {
    if( this.itemNo > 0 ){
      this.itemNo --;
    } else {
      if( this.curPageIndex > 0 ){
        this.curPageIndex --;
        this.itemNo = this.curList[this.curPageIndex].length -1;
        // this.leftDiff = this.curScroller.offsetLeft + colDiff
        // // this.curScroller.style.left = this.curScroller.offsetLeft + colDiff + 'px'; 
        // this.domTransition('curScroller','left',this.leftDiff + 'px');
        this.colTransition( -1, colDiff );
        if( this.curProBlock ){
          this.curProBlock.style.left =  ( this.curPageIndex / this.curList.length * 100 + '%'); 
        }
      }
    }
  }
  
  addClass( getElement('.yh_list_item-' + this.pos +'-'+ this.curPageIndex +'-' + this.itemNo),'hover' );
};




collect_recommend.itemNo = 0;

collect_recommend.recommendList = [];

collect_recommend.leftDiff = 0;

collect_recommend.scroller = null; //滚动元素

collect_recommend.transitionDiff = 220;

collect_recommend.init = function(){
  this.el = getElement('.collect_recommend');
  this.template();
  this.scroller = getElement('.yh_list_scroller-re');
  console.log(this.scroller,'sc')
};

collect_recommend.template = function(){
  var list = '';
  this.recommendList && this.recommendList.forEach(function( item,index ){
    var dom = '<div class="yh_list_item yh_list_item-'+index+'">'+
                '<div class="video_info">'+
                '<div class ="info_bg"></div>' +
                  '<div class="video_img">'
                  + '<img src ="'+ item.elementImg +'"/>' +
                  '</div>'+
                '</div>'+
                '<div class="video_name">'+
                item.elementName +
                '</div>'+
              '</div>';
    list += dom;
  });
  var str = '<div class="yh_list">' +
                '<div class="item_day">'+
                  '<i class="arc"></i>'+
                  '<span class="date">大家都在学</span>'+
                '</div>'+
              '<div class="yh_list_wrapper">'+
                  '<div class="yh_list_scroller yh_list_scroller-re">'+
                  list +
                  '</div>'+
                '</div>'+
              '</div>'
  this.el.innerHTML = str;
  collect_Content.el.appendChild( this.el );
};

collect_recommend.up = function(){
  if( collect_Content.collect_list.length ){
    collect_Content.rowTransition( -1, recDiff);
    areaObj = collect_Content;
    if( collect_Content.vProBlock ){
      collect_Content.domTransition( 'vProBlock','top', ( collect_Content.pos / ( collect_Content.collect_list.length + 1 ) ) * 100 + '%' );
    }
    removeClass( getElement('.yh_list_item-' + this.itemNo),'hover' );
    addClass( getElement('.yh_list_item-' + collect_Content.pos +'-'+ collect_Content.curPageIndex +'-' + collect_Content.itemNo),'hover' );
  } 
};

collect_recommend.down = function(){};

collect_recommend.left = function(){
  this.direction(0);
};

collect_recommend.right = function(){
  this.direction(1);
};

collect_recommend.enter = function(){
  console.log( this.recommendList[this.itemNo],'obj' );
  var num = this.itemNo;
  var jsonUrl = this.recommendList[this.itemNo].jsonUrl;
  setCookie({
    'rec':num
  },jsonUrl);
  window.location.href = "../detail/detail.html";
};

collect_recommend.direction = function( flag ){
  if( this.leftDiff != this.scroller.offsetLeft ){
    return;
  }
  removeClass( getElement('.yh_list_item-' + this.itemNo),'hover' );
  if( flag ){
    if( this.itemNo < this.recommendList.length - 1 ){
      this.itemNo ++;
      if( this.itemNo > 5 ){
        this.domTransition( 'scroller', -1 );
      }
    }
  } else {
    if( this.itemNo > 0 ){
      this.itemNo --;
      if( this.itemNo >=  5 ){
        this.domTransition( 'scroller', 1 );
      }
    }
  }
  addClass( getElement('.yh_list_item-' + this.itemNo),'hover' );
};

collect_recommend.domTransition = function( el, dis ){
  if( this[el] ){
    this.leftDiff =  this[el].offsetLeft + dis * this.transitionDiff;
    this[el].style.left = this.leftDiff + 'px';
  } else {
    console.log('元素不存在');
  }
}


vertical_scrollBar.init = function( pIndex , pSize ){
  this.parent = getElement('#collect');
  this.el = getElement('.v_scroller');
  var str = this.getDomStr( pIndex ,pSize );
  this.el.innerHTML = str;
  this.parent.appendChild( this.el );
}

vertical_scrollBar.getDomStr = function ( pIndex, pSize  ){
  var pre = ( pIndex / pSize ) * 100 + '%'
  return  '<div class="v_scroller_content">'+
          '<div class="v_block" style ="height:'+ pre +'"></div>'
}




onKeyPress = function (keyCode) {
  switch (keyCode) {
    case "up": //上边
    areaObj && areaObj.up();
      break;
    case "down": //下边
    areaObj && areaObj.down();
      break;
    case "left": //左边
    areaObj && areaObj.left();
      break;
    case "right": //右边
    areaObj && areaObj.right();
      break;
    case "back":
        var backUrl = Cookies.get('hobbyBackUrl') || '../../index.html';
        window.location.href = backUrl;
      break;
    case "enter":
      areaObj && areaObj.enter();
      break;
    case "home":
      areaObj && areaObj.home();
      break;
  }
};
//事件绑定
document.onkeydown = grepEvent;