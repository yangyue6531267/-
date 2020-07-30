var value = {
  detailData: {},
  detailUrl: "",
  subjectsList: [],//电影推荐
  recommendList: [],//相似推荐
  actorsList: [],//演员推荐
  getValue: function () {
    this.detailUrl = decodeURIComponent(getParam('detailUrl'));
  },
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
  var url = value.detailData.item.list[indexSingle.itemNo].jsonUrl;
  ajax({
    type: "GET",
    url: url,
    dataType: "json",
    success: function (response) {
      var data = JSON.parse(response).data;
      videoId = data.vodList[0].playUrl;
      // var videoIds = data.vodList[0].playUrl;
      // console.log(videoIds);
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
  //渲染剧集
  indexSingle.data = value.detailData.item.list;

  indexSingle.element = document.getElementById('slider1');
  var html = '';
  for (var i = 0; i < indexSingle.data.length; i++) {
    // var div = '<div class="buttomNum" id="buttomNum' + i + '">' + indexSingle.data[i].itemName + '</div>';
    var div = '<div class="buttomNum" id="buttomNum' + i + '"><span id="marquee' + i + '">' + indexSingle.data[i].itemName + '</span></div>';
    html += div;
  };
  indexSingle.element.innerHTML = html;
  addClass(getId("buttomNum" + indexSingle.itemNo), 'select')
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
      indexSingle.init();
    }
  },
  left: function () { },
  right: function () { },
  enter: function () {
    if (this.btnNum == 1) {
      document.getElementById('descriptionBox').style.visibility = "visible";
      areaObj = descriptionBox;
      return
    } else if (this.btnNum === 0) {
      if (playClass.status == -1) return
      fullPlay();
      areaObj = playClass;
    } else if (this.btnNum === 2) {
      if (topContent.isCollect) { //已收藏
        removeFav()
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

var indexSingle = {
  data: {},
  timer: null,
  element: null,
  itemNo: 0,
  indexPlay: 0,
  init: function () {
    areaObj = indexSingle;
    this.element = document.getElementById('slider1')
    this.addCss();
  },
  removeCss: function () {
    var length = this.data.length;
    for (var i = 0; i < length; i++) {
      removeClass(getId("buttomNum" + i), 'active')
    };
    indexSingle.marquee()
  },
  addCss: function () {
    addClass(getId("buttomNum" + indexSingle.itemNo), 'active')
    indexSingle.uploadIndexPay();
    indexSingle.element.style.left = 470 + -324 * this.itemNo + 'px'; //单集按钮滚动
    indexSingle.marquee('add')
  },
  uploadIndexPay: function () {
    var length = this.data.length;
    for (var i = 0; i < length; i++) {
      removeClass(getId("buttomNum" + i), 'select');
    };
    addClass(getId("buttomNum" + indexSingle.indexPlay), 'select');
  },
  initPayActive: function () {
    if (indexSingle.itemNo == indexSingle.indexPlay) return
    indexSingle.itemNo = indexSingle.indexPlay;
    indexSingle.element.style.left = 470 + -324 * this.itemNo + 'px'; //单集按钮滚动
    removeClass(getId("buttomNum" + indexSingle.itemNo), 'active')
  },
  marquee: function (status) {
    clearInterval(this.timer);
    var marqueeBox = getId("marquee" + this.itemNo);
    var div1 = getId("buttomNum" + this.itemNo);
    var length = strlen(marqueeBox.innerHTML);
    if (length < 9) return
    if (status == 'add') {
      var scrollLeft = 0;
      div1.style.cssText = 'text-align: left;text-overflow: clip;'
      // console.log(scrollLeft);
      this.timer = setInterval(function () {
        if (scrollLeft <= -18 * length) {
          scrollLeft = 260;
          marqueeBox.style.cssText = "margin-left:" + scrollLeft + "px;"
        } else {
          scrollLeft += -3;
          marqueeBox.style.cssText = "margin-left:" + scrollLeft + "px;"
          // marqueeBox.style.cssText = "margin-left " + scrollLeft + "px;"
        }
      }, 80);
    } else {
      if (marqueeBox.innerHTML.length >= 9) {
        scrollLeft = 0;
        marqueeBox.style.cssText = "text-indent: " + scrollLeft + "px;text-align: left;"
      }
    }
  },
  up: function () {
    this.removeCss();
    this.initPayActive();
    nextClass('up', 'topContent');
  },
  down: function () {
    indexSingle.removeCss();
    indexSingle.initPayActive();
    nextClass('down', 'subjects', indexSingle.addCss);
  },
  left: function () {
    if (this.itemNo === 0) return;
    this.removeCss();
    this.itemNo--;
    this.addCss();
  },
  right: function () {
    if (this.itemNo === this.data.length - 1) return;
    this.removeCss();
    this.itemNo++;
    this.addCss();
  },
  enter: function () {
    this.indexPlay = this.itemNo
    this.addCss();
    playMin();
  }
}

var subjects = {
  itemNo: 0,
  indexPlay: 0,
  init: function () {
    areaObj = subjects;
    this.addCss();
    document.body.scrollTop = document.documentElement.scrollTop = 360;
  },
  removeCss: function () {
    removeClass(getId("subjects" + subjects.itemNo), 'active')
  },
  addCss: function () {
    addClass(getId("subjects" + subjects.itemNo), 'active')
  },
  up: function () {
    this.removeCss();
    indexSingle.init();
  },
  down: function () {
    this.removeCss();
    nextClass('down', 'recommend', this.addCss);
  },
  left: function () {
    if (this.itemNo == 0) return;
    this.removeCss();
    this.itemNo--;
    this.addCss();
  },
  right: function () {
    if (this.itemNo + 1 >= value.subjectsList.length) return;
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
    if (value.actorsList.length == 0) return
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
  // back: function () {
  //   areaObj = topContent
  //   getId('descriptionBox').style.visibility = "hidden";
  // }
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
    episode: indexSingle.itemNo + 1,
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
}

value.getValue();
getData(value.detailUrl);
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
    case "six":

  }
};
//事件绑定
document.onkeydown = grepEvent;