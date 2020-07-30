var value = {
  detailData: {},
  detailUrl: "",
  subjectsList: [],//电影推荐
  recommendList: [],//相似推荐
  actorsList: [],//演员推荐
  getValue: function () {
    this.detailUrl = decodeURIComponent(getParam('detailUrl'));
  }
}
var getData = function (url) {
  ajax({
    type: "GET",
    url: url,
    data: {},
    dataType: "json",
    success: function (response) {
      value.detailData = JSON.parse(response).data;
      console.log(value.detailData);
      playMin();
      uploadRecommend();
      topContent.init();
      descriptionBox.init();
      collectData();
    },
    fail: function (error) {
    }
  })
}
var playMin = function () {
  var url = value.detailData.item.list[0].jsonUrl
  ajax({
    type: "GET",
    url: url,
    dataType: "json",
    success: function (response) {
      var data = JSON.parse(response).data;
      videoId = data.vodList[0].playUrl;

      qeryHistory();
    },
    fail: function (error) { }
  })
}
var uploadRecommend = function () {
  console.log(value.detailData);
  getId("name").innerHTML = '<span class="header-name">' + value.detailData.detail.assetName + '</span>';
  var infoText = '<span>' + value.detailData.detail.score + '</span>';
  if (value.detailData.detail.area) {
    infoText += value.detailData.detail.area + " | "
  }
  if (value.detailData.detail.language) {
    infoText += value.detailData.detail.language + " | "
  }
  if (value.detailData.detail.year) {
    infoText += value.detailData.detail.year
  }
  getId("info").innerHTML = infoText;
  getId("detail").innerHTML = value.detailData.detail.actor
  getId("btnBox1").innerHTML = value.detailData.detail.description
  if (value.detailData.detail.language == "英文" || value.detailData.detail.language == "English" || value.detailData.detail.language == "english") {
    getId("btnBox1").style.lineHeight = '21px'
  }
  //subjects
  var subjectsUrl = value.detailData.subjects.jsonUrl;
  ajax({
    type: "GET",
    url: subjectsUrl,
    dataType: "json",
    success: function (response) {
      var data = JSON.parse(response).data;
      value.subjectsList = data.subjects;
      var html = '';
      if (value.subjectsList.length > 0) {
        for (var i = 0; i < value.subjectsList.length; i++) {
          html = html + '<li id="subjects' + i + '">' +
            '<div style="background-image: url(' + value.subjectsList[i].coverImage + ');"></div>' +
            '<p>' + value.subjectsList[i].catName + '</p>' +
            '</li>'
        }
        getId('subjectsList').innerHTML = html;
      } else {
        getId('subjects').style.display = "none";
      }
    },
    fail: function (error) { }
  })
  //推荐渲染
  var recommendUrl = value.detailData.recommend.jsonUrl;
  ajax({
    type: "GET",
    url: recommendUrl,
    dataType: "json",
    success: function (response) {
      var data = JSON.parse(response).data;
      value.recommendList = data.assets;
      var html = '';
      if (value.recommendList.length > 0) {
        for (var i = 0; i < value.recommendList.length; i++) {
          var freeHtml = '<div class="noFree">' + '<span>限免</span>' + '</div>';
          if (value.recommendList[i].fee > 0) {
            freeHtml = '<div class="free">' + '<span>付费</span>' + '</div>';
          }

          html = html + '<li class="middle-li" id="li-item' + i + '">' +
            '<div class="imgbox">' +
            '<div class="score">' +
            '<span>' + value.recommendList[i].score + '</span>' +
            '</div>' +
            '<img src="' + value.recommendList[i].assetImg + '">' +
            '</div>' + freeHtml +
            '<div class="word" id="word' + i + '">' + value.recommendList[i].assetName + '</div>' +
            '</li>'
        }
        getId('recommendList').innerHTML = html;
      } else {
        getId('recommend').style.display = 'none';
      }
    },
    fail: function (error) { }
  })

  //演员推荐渲染
  var actorsUrl = value.detailData.actors.jsonUrl;
  ajax({
    type: "GET",
    url: actorsUrl,
    dataType: "json",
    success: function (response) {
      var data = JSON.parse(response).data;
      value.actorsList = data.actors;
      var html = '';
      if (value.actorsList.length > 0) {
        for (var i = 0; i < value.actorsList.length; i++) {
          var assets = '';
          if (value.actorsList.length > 0) {
            for (var j = 0; j < value.actorsList[i].assets.length; j++) {
              assets += '<p class="move' + (j + 1) + '">- ' + value.actorsList[i].assets[j].assetName + '</p>'
            }
          }
          html = html + '<li class="middle-li" id="card-item' + i + '">' +
            '<div class="header-logo" style="background-image: url(' + value.actorsList[i].profileImage + ');"></div>' +
            '<p class="name">' + value.actorsList[i].name + '</p>' + assets
          '</li>'
        }
        getId('scrollContent').innerHTML = html;
      } else {
        getId('assetList').style.display = 'none';
      }
    },
    fail: function (error) { }
  })
}

var topContent = {
  btnNum: 0, //按钮编号
  isCollect: false, //收藏判断
  init: function () { //初步渲染
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    areaObj = topContent; //初始焦点赋值
    this.addCss() //初始化添加样式
  },
  addCss: function () {
    addClass(getId("btnBox" + topContent.btnNum), 'active')
  },
  removeCss: function () {
    removeClass(getId("btnBox" + topContent.btnNum), 'active')
  },
  up: function () {
    if (this.btnNum >= 2) return
    this.removeCss()
    this.btnNum++;
    this.addCss()
  },
  down: function () {
    if (this.btnNum > 0) {
      this.removeCss()
      this.btnNum--;
      this.addCss()
    } else if (this.btnNum == 0) {
      this.removeCss()
      nextClass('down', 'subjects', this.addCss);
    }
  },
  left: function () { },
  right: function () { },
  enter: function () {
    if (this.btnNum == 1) {
      getId('descriptionBox').style.visibility = "visible";
      areaObj = descriptionBox;
      return
    } else if (this.btnNum === 0) {
      if (playClass.status == -1) return
      fullPlay();
      areaObj = playClass;
    } else if (this.btnNum === 2) {
      if (topContent.isCollect) { //已收藏
        removeFav();
      } else { //未收藏
        addFav();
      }
    } else {
      if (playConfig.isOrder == '1') {
        return
      }
      var contentID = recommend.data[recommend.itemNo].vodList[0].playUrl.split(":")[3];
      // var contentID = "8880000002541435";

      // 点击订购上报
      try {
        var param = {
          page_id: value.detailData.assetId,
          page_type: '0301'
        }
        bi.orderClick(param)

        Cookies.set('orderPkg', value.detailData.assetId, { path: '/' })
      } catch (error) {
        console.log('埋点错误', error)
      }
      unifiedOrder(contentID)
    }
  }
}
var subjects = {
  itemNo: 0,
  indexPlay: 0,
  init: function () {
    document.body.scrollTop = document.documentElement.scrollTop = 100;
    areaObj = subjects;
    this.addCss();
  },
  removeCss: function () {
    removeClass(getId("subjects" + subjects.itemNo), 'active')
  },
  addCss: function () {
    addClass(getId("subjects" + subjects.itemNo), 'active')
  },
  up: function () {
    subjects.removeCss();
    nextClass('up', 'topContent');
  },
  down: function () {
    this.removeCss();
    nextClass('down', 'recommend', this.addCss);
  },
  left: function () {
    if (this.itemNo === 0) return;
    this.removeCss();
    this.itemNo--;
    this.addCss();
  },
  right: function () {
    if (this.itemNo >= value.subjectsList.length - 1) return;
    this.removeCss();
    this.itemNo++;
    this.addCss();
  },
  enter: function () {
    nextRouter(value.subjectsList[this.itemNo]);
  }
}
var recommend = {
  itemNo: 0,
  indexPlay: 0,
  init: function () {
    areaObj = recommend;
    recommend.removeCss();
    this.addCss();
    document.body.scrollTop = document.documentElement.scrollTop = 720;
    this.marquee('add')
  },
  removeCss: function () {
    removeClass(getId("li-item" + recommend.itemNo), 'active')
  },
  addCss: function () {
    addClass(getId("li-item" + recommend.itemNo), 'active')
  },
  marquee: function (status) {
    var scrollLeft = 0;
    clearInterval(this.timer);
    var div = getId("word" + this.itemNo);
    var length = strlen(div.innerHTML);
    if (length < 6) return
    if (status == 'add') {
      this.timer = setInterval(function () {
        if (scrollLeft <= -19 * length) {
          scrollLeft = 290;
          div.style.cssText = "text-indent: " + scrollLeft + "px;text-align: left;"
        } else {
          scrollLeft += -3;
          div.style.cssText = "text-indent: " + scrollLeft + "px;text-align: left;"
        }
      }, 160);
    } else {
      if (div.innerHTML.length >= 16) {
        scrollLeft = 0;
        div.style.cssText = "text-indent: " + scrollLeft + "px;text-align: left;"
      }
    }
  },
  up: function () {
    recommend.removeCss();
    nextClass('up', 'subjects');
  },
  down: function () {
    this.marquee()
    this.removeCss();
    nextClass('down', 'actors', this.addCss);
  },
  left: function () {
    if (this.itemNo === 0) return;
    this.marquee()
    this.removeCss();
    this.itemNo--;
    this.addCss();
    this.marquee('add')
    if (this.itemNo <= 3) {
      getId('recommendList').style.left = '79px';
    } else {
      getId('recommendList').style.left = -192 * (this.itemNo - 4) + 'px';
    }
  },
  right: function () {
    if (this.itemNo + 1 >= value.recommendList.length) return;
    if (this.itemNo > 3) {
      getId('recommendList').style.left = -192 * (this.itemNo - 4) + 'px';
    }
    this.removeCss();
    this.marquee()
    this.itemNo++;
    this.addCss();
    this.marquee('add')
  },
  enter: function () {
    nextRouter(value.recommendList[this.itemNo]);
  }
}
var actors = {
  itemNo: 0,
  indexPlay: 0,
  init: function () {
    areaObj = actors;
    this.addCss();
    document.body.scrollTop = document.documentElement.scrollTop = 720;
  },
  removeCss: function () {
    removeClass(getId("card-item" + actors.itemNo), 'active')
  },
  addCss: function () {
    addClass(getId("card-item" + actors.itemNo), 'active')
  },
  up: function () {
    actors.removeCss();
    nextClass('up', 'recommend');
  },
  down: function () {
  },
  left: function () {
    if (this.itemNo === 0) return;
    this.removeCss();
    this.itemNo--;
    this.addCss();
    if (this.itemNo <= 1) {
      getId('scrollContent').style.left = '79px';
    } else {
      getId('scrollContent').style.left = -130 + -260 * (this.itemNo - 3) + 'px';
    }
  },
  right: function () {
    if (this.itemNo + 1 >= value.actorsList.length) return;
    if (this.itemNo > 1) {
      getId('scrollContent').style.left = -130 + -260 * (this.itemNo - 2) + 'px';
    }
    this.removeCss();
    this.itemNo++;
    this.addCss();
  },
  enter: function () {
    nextRouter(value.actorsList[this.itemNo])
  }
}


var descriptionBox = {
  num: 0, //翻页数
  option: 0, //页数
  height: 0, //文字高度
  init: function () {
    getId("wordScroll").innerHTML = value.detailData.detail.description;
    this.height = getId('wordScroll').offsetHeight;
    this.option = Math.floor(this.height / 270);
  },
  enter: function () {
    areaObj = topContent
    getId('descriptionBox').style.visibility = "hidden";
  },
  up: function () {
    if (this.num == 0) return;
    this.num--;
    getId('wordScroll').style.top = -270 * this.num + "px"
  },
  down: function () {
    if (this.num == this.option) return;
    this.num++;
    getId('wordScroll').style.top = -270 * this.num + "px"
  },
}

function removeFav() {
  submitPrompt('favorite', { assetId: value.detailData.detail.assetId, assetType: '1' });
  removeClass(getId('collect'), 'isCollect');
  topContent.isCollect = false;
};

function addFav() {
  var detail = value.detailData.detail;
  var obj = {
    assetId: detail.assetId,
    assetName: detail.assetName,
    assetType: 'Column',
    assetImg: detail.assetImg,
    // score: detail.score,
    episodes: detail.episodes,
    assetFrom: detail.assetFrom || '',
    layoutUrl: encodeURIComponent(value.detailUrl)
  }
  submitPrompt('favorite', obj);
  addClass(getId('collect'), 'isCollect');
  topContent.isCollect = true;
};

function collectData() {
  // value.detailData.detail.assetType
  submitPrompt('queryFavorite', { assetId: value.detailData.detail.assetId, assetType: '1', return: 'queryFavorite' });
};

var queryFavorite = function (res) {
  console.log('queryFavorite-----' + res);
  topContent.isCollect = res;
  if (topContent.isCollect == true) {
    addClass(getId('collect'), 'isCollect');
  }
}

function playRecord() {
  // 播放历史记录

  var detail = value.detailData.detail;
  var data = {
    assetId: detail.assetId,
    assetType: detail.assetType,
    assetName: detail.assetName,
    assetFrom: detail.assetFrom || '',
    assetImg: detail.assetImg,
    episodes: detail.episodes,
    episode: '1',
    watchTime: playClass.currTime * 1000,
    movieLength: playClass.totalTime * 1000,
    score: detail.score,
    itemId: value.detailData.item.list[0].itemId,
    itemName: value.detailData.item.list[0].itemName,
    itemImg: '',
    layoutUrl: encodeURIComponent(value.detailUrl)
  }
  submitPrompt('writeHistory', data);
};

function qeryHistory() {
  // 查询播放记录
  submitPrompt('readHistory', { assetId: value.detailData.detail.assetId, return: 'readHistory' });
}
var readHistory = function (res) {
  console.log('readHistory-----' + JSON.stringify(res));
  var currTime = 0;
  value.historyDetail = res;
  if (value.historyDetail && value.historyDetail.movieLength) {
    currTime = value.historyDetail.movieLength / 1000;
  }
  if (!player) {
    // onYouTubeIframeAPIReady(videoIds);
  } else {
    loadVideoById(videoId)
  }

  // var sss = {
  //   "assetFrom": "18",
  //   "assetId": "1574749267376342539",
  //   "assetImg": "http://223.121.14.237/img/201911/26/14/24/5/20191126142450550zdcotlsg.png",
  //   "assetName": "流行經典50年", "assetType": "Column", "episode": "1", "episodes": "229", "id": 1,
  //   "itemId": "1574749268266352539", "itemImg": "", "itemName": "流行經典50年｜熱情的沙漠 李樂詩｜狀態十足",
  //   "layout": "Page_Detail_YTB",
  //   "layoutUrl": "http://223.121.14.235/?s=65&p=yhsAsset&k=1&v=1&c=1&a=852&i=1&assetId=1574749267376342539",
  //   "movieLength": "239461", "recordTime": 1575282222589, "score": "", "watchTime": "1991.6469408721923"
  // }
}
value.getValue();
getData(value.detailUrl)
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
      if (playClass.isfullPlay) {
        if (playClass.status == 2) {
          playVideo();
        } else {
          smillPlay();
        }
      } else {
        playRecord();
        backApk()
      }
      break;
    case "enter":
      areaObj.enter();
      break;
    case "home":
      areaObj.home();
      break;
    case "menu":
  }
};
//事件绑定
document.onkeydown = grepEvent;