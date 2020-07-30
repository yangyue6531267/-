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

var grepEvent = function( e ){
  var keyCode = e.keyCode || e.which;
  return onKeyPress(KEYMAP[keyCode]);
};



var order_rule_info = [
  '1 该订购包为“新东方教育会员”，首月优惠价格25元/月',
  '2 该会员订购即可生效，本月按照剩余时间扣费',
  '3 该会员包为续月包，确认订购即同意，下月将自动续费',
  '4 退订将于下月生效，退订联系客服：400-000-0000'
];

var order_typeInfo = [
  {
    count:'35元/月',
    price:'25元/月',
    id:0
  },
  {
    count:'81元/月',
    price:'61元/季',
    id:1
  },
  {
    count:'288元/月',
    price:'258元/年',
    id:2
  }
]

var order_menu_listInfo = [{
  text:'新东方教育会员',
  id:1
},{
  text:'新东方学前会员',
  id:2
},{
  text:'新东方小学会员',
  id:3
},{
  text:'新东方初中会员',
  id:4
},{
  text:'新东方高中会员',
  id:5
}]

var getData = function (url, sucessfn, errorfn) {
  ajax({
    type: "GET",
    url: url,
    data: {},
    dataType: "json",
    success: sucessfn,
    fail: errorfn
  })
}


var order_menu_list = {};

var order_type = {};

var order_rule = {};


//订购会员列表
order_menu_list.menu_listInfo = order_menu_listInfo;

order_menu_list.itemNo = 0;

order_menu_list.diff = 0;

order_menu_list.init = function(){
  areaObj = order_menu_list;
  this.el = getElement('.order_menu_list');
  this.template();
  addClass( getElement('.order_menu_item-'+ this.itemNo),'hover' )
}

order_menu_list.template = function(){
  var list = '';
  this.menu_listInfo && this.menu_listInfo.forEach(function( item,index ){
  var dom = '<div class="order_menu_item order_menu_item-'+ index +'">' +item.text+
    '</div>';
    list += dom;
  });
  this.el.innerHTML = list;
}

order_menu_list.up = function(){
  this.direction( 0 )
};

order_menu_list.down = function(){
  this.direction( 1 );
};

order_menu_list.left = function(){};

order_menu_list.right = function(){
  areaObj = order_type;
  removeClass(getElement('.order_list_item-'+ order_type.itemNo),'hover');
  addClass(getElement('.order_list_item-'+ order_type.itemNo),'hover')
};

order_menu_list.enter = function(){};

order_menu_list.direction = function( flag ){
  if( this.diff !== this.el.offsetTop ) return;
  removeClass( getElement('.order_menu_item-'+ this.itemNo),'hover' );
  var before = this.itemNo;
  if( flag ){
    if( this.itemNo >= this.menu_listInfo.length - 1 ){
      this.itemNo = 0
    } else {
      this.itemNo ++;
    }
  } else {
    if( this.itemNo <= 0 ){
      this.itemNo = this.menu_listInfo.length - 1;
    } else {
      this.itemNo --;
    }
  }
  var after = this.itemNo;
  var dis = before - after;
  this.diff = this.el.offsetTop + ( 68 * dis);
  this.el.style.top = this.el.offsetTop + ( 68 * dis) + 'px';
  addClass( getElement('.order_menu_item-'+ this.itemNo),'hover' )
}

order_menu_list.init();

//订购类型( 月,季,年 )
order_type.itemNo = 0;

order_type.pos = 0;

order_type.init = function(){
  this.el = getElement('.order_list_wraper');
  this.template();
};

order_type.template = function(){
  var list = '';
  order_typeInfo && order_typeInfo.forEach(function( item,index ){
    var dom = '<div class="order_list_item order_list_item-'+ item.id +'">'+
                    item.price +
                  '<del> '+item.count+' </del>'+
                  '<i class="order_item_sign"></i>'+
              '</div>';
    list += dom;
  })
  
  this.el.innerHTML = list;
}

order_type.left = function(){
  this.direction( 0 )
};

order_type.right = function(){
  this.direction(1);
};

order_type.up = function(){
  if( this.pos == 1 ){
    this.pos --;
    removeClass(getElement('.order_btn'),'hover');
    
  } else {
    
  }
};

order_type.down = function(){
  if( this.pos == 0 ){
    this.pos ++;
    addClass(getElement('.order_btn'),'hover');
  } else {

  }
};

order_type.enter = function(){
  if( this.pos == 1 ){
    console.log( order_typeInfo[this.itemNo] )
  }
};

order_type.direction = function( flag ){
  removeClass(getElement('.order_list_item-'+ this.itemNo),'hover')
  if( flag ){
    if( this.pos == 0 ){
      if( this.itemNo < 2 ){
        this.itemNo ++;
      }
    }
  } else {
    if( this.pos == 0 ){
      if( this.itemNo > 0 ){
        this.itemNo --;
      } else {
        areaObj = order_menu_list;
        removeClass(getElement('.order_list_item-'+ this.itemNo),'hover');
        return;
      }
    } else {
      areaObj = order_menu_list;
      this.pos = 0;
      removeClass(getElement('.order_btn'),'hover');
    }
  }
  addClass(getElement('.order_list_item-'+ this.itemNo),'hover')
}

order_type.init();

//订购规则
order_rule.init = function(){
  this.el = getElement('.order_rule_list');
  this.btn = getElement('.order_btn');
  this.template();
}

order_rule.template = function(){
  var list = '';
  order_rule_info && order_rule_info.forEach(function( item,index ){
    var dom = '<li>'+ item +'</li>';
    list += dom;
  })
  this.el.innerHTML = list;
}

order_rule.init();

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
      var backUrl = Cookies.get('orderbackUrl') || '../../index.html'
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