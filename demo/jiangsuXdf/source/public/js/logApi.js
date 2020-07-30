function CommonParams(){
    this.site_id = '120';
    this.device_id = '';
    this.user_id = '';
    this.log_type = '2';
    this.v = '';
    this.model = '';
    this.soft_v ='';
    this.vip = '0';
    this.province = "江苏省";
    this.create_datetime = new Date().getTime() + '';
    this.bigdata_flag = '0';
}

CommonParams.prototype.mergeObj = function( obj ){
  for( var k in obj ){
    if( !this[k] ){
        this[k] =  typeof obj[k]  == 'string' && obj[k] || obj[k] + ''; 
    }
  }
}

var bi = {
  init: function( initInfo ){
    this.device_id = initInfo.device_id;
    this.model = initInfo.model;
    this.soft_v = initInfo.soft_v;
    this.user_id = initInfo.user_id;
  },
  //启动应用
  appStart:function(start_type){
      Cookies.set('startTime',new Date()-0)
      var obj = {
        start_type: start_type
      };
      logUp( '102', obj );
  },
  //页面访问
  pageJump:function( id ,page_type,parent_page_type,parent_page_id){
    var obj = {
      page_type: page_type,
      page_id: id,
      parent_page_type: parent_page_type || Cookies.get('parent_page_type') || '',
      parent_page_id: parent_page_id || Cookies.get('parent_page_id') || ''
    }
    logUp( '104' ,obj)
  },
  //订购按钮点击
  orderBtnClick:function ( page_id, page_type, point ){
    var obj = {
      page_id: page_id,
      page_type: page_type,
      point: point
    }
    logUp( '202' ,obj)
  },
  //收藏按钮点击
  collectClick:function ( click_type, cid, collect ){
    var obj = {
      click_type: click_type,
      cid: cid,
      collect:collect
    }
    logUp( '4' ,obj)
  },
  //推荐位点击
  recommendClick:function( pos_id,recmd_id,page_type,page_id,click_type,cid ){
    var obj = {
      pos_id: pos_id,
      recmd_id: recmd_id,
      page_type: page_type,
      page_id: page_id,
      click_type: click_type,
      cid: cid
    }
    logUp( '3',obj );
  },
  //订购
  order:function( pkg_type, pkg_id, operator_id, order_msg, point ){
    var obj = {
      pkg_type: pkg_type,
      pkg_id: pkg_id,
      operator_id: operator_id,
      order_msg: order_msg,
      point: point,
      parent_page_id: Cookies.get('parent_page_id') || '',
      parent_page_type: Cookies.get('parent_page_type') || ''
    }
    logUp( '201', obj );
  },
  //退出apk
  end:function( ){
    if(Cookies.get('startTime')){
      var time = new Date()-0 - Cookies.get('startTime')*1
    }
    var obj = {
      time: time
    };
    logUp( '103', obj );
  },
  //筛选
  filter:function( result,keyword,cid,cat_id ){
    var obj = {
      result: result,
      keyword: keyword,
      cid: cid,
      cat_id: cat_id
    }
    logUp( '14', obj)
  },
  //搜索
  search:function( result,keyword,click_type,cid ){
    var obj ={
      result: result,
      keyword: keyword,
      click_type: click_type,
      cid: cid
    }
    logUp( '6', obj );
  },
  //收藏页,历史页点击
  pageClick:function( page_type,cid,click_type ){
    var obj = {
      page_type: page_type,
      cid: cid,
      click_type: click_type
    }
    logUp( '5', obj );
  }
}

function logUp( event, obj ){
  var logObj = new CommonParams();
  logObj.event = event;
  logObj.mergeObj( obj );
  console.log('bi日志='+ JSON.stringify(logObj) )
}
