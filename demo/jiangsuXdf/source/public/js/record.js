var playRecorder = {};

playRecorder.addRecord = function( epoised, curTime ){
  epoised = epoised || 0;
  curTime = curTime || 0;
  var strObj = '{'+
    'epoised:'+ epoised +','+
    'curTime:'+ curTime +','+
    'start:'+ Date.now() +
    '}'

  Cookies.set('record',strObj,{
    path:'/'
  });
}

playRecorder.getRecord = function(){
  var cord =  eval( '('+ Cookies.get( 'record' ) +')' );
  if( !cord ){
    cord = {
      epoised:0,
      curTime:0
    }
  }
  return cord
}

