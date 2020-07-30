
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
			272: "home"
		};
		//按键分发事件
		var onKeyPress;
		//按键prev处理函数
		var grepEvent = function (e) {
			var keyCode = e.keyCode || e.which;
			return onKeyPress(KEYMAP[keyCode]);
		};
	var catCode = getQueryString('catCode');
	function init () {
		if(catCode == 'xcgkt'){
			getId('filterCategory').style.display = 'none';
			getId('liHoverEr').style.display = 'none'
			addClass(getId('filterLeft'),'tempFilterLeft');
			addClass(getId('filterRight'),'tempFilterRight');
			document.querySelector('.secondColumnLiHover').style.display = 'none';
		}else if(catCode = 'sekt'){
			getId('sanCategory').style.display = 'none'
		}
		areaObj = filterCondition ;
		filterCondition.init(catCode);
	}

	var filterCondition = {};
	filterCondition.itemNo = 0;
	filterCondition.pos = 0;
	filterCondition.init = function (catCode) { 
		var elementDiv = getId('erCategory');
		getConditionFilter(catCode,function(resp){
			console.log(eval('(' + resp + ')'))
			var data = eval('(' + resp + ')');
			if(data.code == 200){
				var itemLi  = '';
				for (var i = 0; i < data.data.categoryList[0].children.length; i++) {
					var element = data.data.categoryList[0].children[i];
					var li = '<li class="item_'+i+'">'+element.categoryName+'</li>'
						itemLi+=li;
				}
				elementDiv.innerHTML = itemLi;

			}
		},function(error){

		})
	}
	filterCondition.slider = function () {
		if (catCode == 'xcgkt') {
			getId("firstColumnInner").style.marginTop = 191 - filterCondition.itemNo * 50 + "px";
		} else {
			getId('single-row-inner').style.top = 180 - this.itemNo0 * 50 + "px";
		}
	};
	filterCondition.up = function () { 
		if(catCode == 'xcgkt'){
			this.itemNo++;
			this.slider()
			return;
		}
	}
	filterCondition.down = function () { 
		if(catCode == 'xcgkt'){
			this.itemNo--;
			this.slider()
			return;
		}
	}
	filterCondition.left = function () { 

	}
	filterCondition.right = function () { 
		if(this.pos == 1){

		}else if(this.pos == 0){

		}
	}


		init();
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
				break;
			case "enter":
				areaObj.enter();
				break;
			case "home":
				areaObj.home();
				break;
		}
	};
	//事件绑定
	document.onkeydown = grepEvent; 
		