var siteId = '120';
var userId = '20';

var userTrackObj = {
  //加入收藏和取消收藏
  collect:function( hasCollect,collectType,relateId, relateScore, relateTitle, relateImg, relateUrl, relateLayout,relateCategory ){
    if( hasCollect ){
      return {
        siteId:siteId,
        userId:userId,
        collectType:collectType,
        relateId:relateId,
      }
    } else {
      return {
        siteId:siteId,
        userId:userId,
        collectType:collectType,
        relateId:relateId,
        relateScore:relateScore,
        relateTitle:relateTitle,
        relateImg:relateImg,
        relateUrl: relateUrl,
        relateLayout:relateLayout,
        relateCategory:relateCategory
      }
    }
  },
  //校验是否收藏
  checkCollect:function( collectType,relateId ){
    return {
      siteId:siteId,
      userId:userId,
      collectType:collectType,
      relateId:relateId,
    }
  },
  searchUserTrack:function( isHistory ){
    //查询历史观看记录
    if( isHistory ){
      return {
        siteId:siteId,
        userId:userId,
        collectType:'3'
      }
    } else {
      //查询收藏记录
      return {
        siteId:siteId,
        userId:userId,
        collectType:'0,1,2',
      }
    }
  },
  //添加历史记录
  addHistory:function( relateId,relateScore,relateTitle,relateImg,relateUrl,relateLayout,relateCategory ){
    return {
      siteId:siteId,
      userId:userId,
      collectType:'3',
      relateId:relateId,
      relateScore:relateScore,
      relateTitle:relateTitle,
      relateImg:relateImg,
      relateUrl:relateUrl,
      relateLayout: relateLayout,
      relateTime:getRelateTime(),
      relateCategory:relateCategory
    }
  },
  findAll:function(){
    return {
      siteId:siteId,
      userId:userId,
      collectType:'0,1,2,3',
    }
  }
}