// 3.1.	用户观看行为记录
function ahxdfLog() {
  if (yh.userId == '123456') return//屏蔽本地调试代码
  var startTime = new Date(Number(Cookies.get('qb_datetime')));
  startTime = generateTimeReqestNumber(startTime);
  var endTime = generateTimeReqestNumber(new Date())
  var contentId = getConetntId(value.detailData.assetId)
  var param = {
    Boss_userID: yh.mobileNo || '',
    UserID: yh.userId || '',
    city: yh.cityCode || '',
    county: yh.areaCode || '',
    startTime: startTime || '',
    endTime: endTime || '',
    type: '1',
    contentId: contentId,//待定，epg接口传过来的播放串中获取//业务类型=1：点播内容ID
    // assetName: value.detailData.assetName,//非必填
    // access: '',//非必填
    userType: '1',
    userId: yh.mac || '',
    // IP: '',//非必填
    // flow: ''//非必填
  }
  var url = ahxdfLogUrl + '/ahlogss?' + param.Boss_userID + '|' + param.UserID
    + '|' + param.city + '|' + param.county + '|' + param.startTime
    + '|' + param.endTime + '|' + param.type + '|' + param.contentId
    + '|' + param.userType + '|' + param.userId
  console.log('ahXDF--BI log:' + url);
  ajax({ // 入口数据
    type: "GET",
    url: url,
    contentType: 'application/json',
    dataType: "json",
    success: function (data) {
      console.log('ahXDF-bi 日志发生完毕');
    },
    error: function (err) {
      console.log(err)
    }
  });


  var ahloguv = ahxdfLogUrl + '/ahloguv?' + param.Boss_userID + '|' + param.UserID
    + '|' + param.city + '|' + param.county + '|1' + '&&' + parseInt(playerBox.detailData.curPlayTime / 1000)
  console.log('ahXDF--BI log:' + url);
  ajax({ // 入口数据
    type: "GET",
    url: ahloguv,
    contentType: 'application/json',
    dataType: "json",
    success: function (data) {
      console.log('ahXDF-bi 日志发生完毕');
    },
    error: function (err) {
      console.log(err)
    }
  });
}
