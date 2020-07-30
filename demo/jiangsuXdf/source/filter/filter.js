
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
	var fatherCategoryId = '';
	var num = getQueryString('num'); // xcgkt(显示两列筛选类别) cjkt(显示一列筛选类别)
	var catCode = getQueryString('catCode');
	var tempCategoryId = '';
	var classification = getQueryString('classification'); // 高中
	var classificationChildren = getQueryString('classificationChildren'); // 高一，高二，全部课程
	// 详情页返回之后的焦点记忆
	var pageCategoryId = getQueryString('tempCategoryId');
	var pageIndex = getQueryString('pageIndex')*1;
	var pageItemNo = getQueryString('itemNo')*1;
	var pageFatherCategoryId = getQueryString('fatherCategoryId');
	fatherCategoryId = getQueryString('fatherCategoryId');
	function init () {
		if(num == 'xcgkt'){
			getId('filterCategory').style.display = 'none';
			getId('liHoverEr').style.display = 'none'
			addClass(getId('filterLeft'),'tempFilterLeft');
			addClass(getId('filterRight'),'tempFilterRight');
			document.querySelector('.secondColumnLiHover').style.display = 'none';
		}else if(num == 'cjkt'){
			getId('sanCategory').style.display = 'none'
			addClass(getId('filterCategory'),'filterCategoryHover')
		};
		if(pageCategoryId){
			// 详情页返回焦点记忆
			if(num == 'cjkt'){
				getConditionFilter(function (resp) { 
					console.log(eval('(' + resp + ')'))
					var dataList = eval('(' + resp + ')').data.categoryList;
					for (var i = 0; i < dataList.length; i++) {
						if(dataList[i].catCode == catCode){
							var elementDiv = getId('erCategory');
							var itemLi = '';
							for (var j = 0; j < dataList[i].children.length; j++) {
								filterCondition.cjktList = dataList[i].children;
								if(dataList[i].children[j].categoryId == pageCategoryId){
									filterCondition.itemNo = j;
									filterCondition.slider();
									filterContent.template((pageIndex-1)*8,catCode,dataList[i].children[j].categoryId)
								}
								itemLi+= '<li id="item_'+j+'">'+dataList[i].children[j].categoryName+'</li>'
							}
							elementDiv.innerHTML = itemLi;
						}				
					};
					setTimeout(function () { 
						filterContent.pindex = pageIndex;
						filterContent.itemNo = pageItemNo;
						filterContent.init();
						removeClass(getId('filterCategory'),'filterCategoryHover')
						document.querySelector('.liHoverEr').style.display = 'none';
						document.querySelector('.tempLiHoverEr').style.display = 'block';
					 },100)
				 })
			}else if(num == 'xcgkt'){
				document.querySelector('.firstColumnLiHover').style.display = 'none';
				document.querySelector('.secondColumnLiHover').style.display = 'none';
				filterCondition.itemNo1 = getQueryString('itemNo1')*1;
				filterCondition.pos = 1;
				filterCondition.slider(); 
				getConditionFilter(function (resp) { 
					console.log(eval('(' + resp + ')'))
					var dataList = eval('(' + resp + ')').data.categoryList;
					for (var i = 0; i < dataList.length; i++) {
						if(dataList[i].catCode == catCode){
							// addClass(getId('firstColumn'),'firstColumnHover');
							var elementDiv = getId('firstColumnInner');
							var itemLi  = '';
							filterCondition.xcgktList1 = dataList[i].children;
							for (var j = 0; j < dataList[i].children.length; j++) {
								var li = '<li id="item_'+j+'">'+dataList[i].children[j].categoryName+'</li>'
								itemLi+=li;
								if(dataList[i].children[j].categoryId == pageFatherCategoryId){
									filterCondition.xcgktList2 = dataList[i].children[j].children;
									filterCondition.template(dataList[i].children[j].children,pageCategoryId)
									filterCondition.itemNo = j;
									// filterCondition.slider();
									getId("firstColumnInner").style.marginTop = 191 - filterCondition.itemNo * 50 + "px";
									filterContent.template((pageIndex-1)*8,catCode,pageCategoryId)
								}	
							}
							elementDiv.innerHTML = itemLi;
						}				
					};
					setTimeout(function () { 
						filterContent.pindex = pageIndex;
						filterContent.itemNo = pageItemNo;
						filterCondition.pos = 1;
						filterContent.init();
						removeClass(getId('secondColumn'),'secondColumnHover');	
						document.querySelector('.tempFirstColumnLiHover').style.display = 'block';
					 },100)
				 })
			}
			return;
		};
		try{
			bi.pageJump('0901','102-1','0101',Cookies.get('homeCatId'))
		}catch(e){
			console.log('错误埋点'+e)
		}
		areaObj = filterCondition ;
		filterCondition.init(num);
	}

	var filterCondition = {
		itemNo:0,
		itemNo1:0,
		pos:0,
		xcgktList1:[],
		xcgktList2:[],
		cjktList:[],
		tempxcgktList2:[{catCode: "",categoryName: "其他",categoryId: ""}],
		classificationChildrenList:[],
		init:function (num) {  
			var _this = this;
			getConditionFilter(function(resp){
				console.log(eval('(' + resp + ')'))
				var data = eval('(' + resp + ')');
				if(data.code == 200){
					for (var i = 0; i < data.data.categoryList.length; i++) {
						if(num == 'xcgkt'){
							addClass(getId('firstColumn'),'firstColumnHover');
							if(data.data.categoryList[i].categoryName == classification){
								var elementDiv = getId('firstColumnInner');
								var itemLi  = '';
								_this.xcgktList1 = data.data.categoryList[i].children;
								for (var j = 0; j < data.data.categoryList[i].children.length; j++) {
									var li = '<li id="item_'+j+'">'+data.data.categoryList[i].children[j].categoryName+'</li>'
									itemLi+=li;
									if(data.data.categoryList[i].children[j].categoryName == classificationChildren){
										_this.xcgktList2 = data.data.categoryList[i].children[j].children;
										_this.template(data.data.categoryList[i].children[j].children)
										_this.itemNo = j;
										_this.slider();
										filterContent.template(0,catCode,data.data.categoryList[i].children[j].children[0].categoryId)
									}	
								}
								elementDiv.innerHTML = itemLi;
								if(classificationChildren == '全部课程' || classificationChildren == '查看全部'){
									_this.xcgktList2 = data.data.categoryList[i].children[0].children;
									_this.template(data.data.categoryList[i].children[0].children)
									filterContent.template(0,catCode,data.data.categoryList[i].children[0].children[0].categoryId)
								}
							}
						}else if(num == 'cjkt'){
							if(data.data.categoryList[i].categoryName == classification){							
								var elementDiv = getId('erCategory');
								var itemLi = ''
								_this.cjktList = data.data.categoryList[i].children;
								for (var j = 0; j < data.data.categoryList[i].children.length; j++) {
									if(data.data.categoryList[i].children[j].categoryName == classificationChildren){
										_this.itemNo = j;
										_this.slider();
										filterContent.template(0,catCode,data.data.categoryList[i].children[j].categoryId)
									}
									itemLi+= '<li id="item_'+j+'">'+data.data.categoryList[i].children[j].categoryName+'</li>'
								}
								if(classificationChildren == '查看更多'){
									filterContent.template(0,catCode,data.data.categoryList[i].children[0].categoryId)
								}
								elementDiv.innerHTML = itemLi;
							}
						}
					}
					filterCondition.addTextColor();
				}
			},function(error){
	
			});
		},
		template:function (list,itemNo) {  
			var elementDiv2 = getId('secondColumnInner')
			var itemLi2 = '';
			if(list){
				this.xcgktList2 = list;
				classificationChildrenList = list;
			}else{
				this.xcgktList2 = this.tempxcgktList2;
				classificationChildrenList = this.tempxcgktList2;
			}
			for (var k = 0; k < classificationChildrenList.length; k++) {
				itemLi2+='<li id="item2_'+k+'">'+classificationChildrenList[k].categoryName+'</li>'									
			}
			elementDiv2.innerHTML = itemLi2;
		},
		slider:function () { 
			if (num == 'xcgkt') {
				if(this.pos == 0 ){
					getId("firstColumnInner").style.marginTop = 191 - filterCondition.itemNo * 50 + "px";
				}else if(this.pos == 1){
					getId("secondColumnInner").style.marginTop = 191 - filterCondition.itemNo1 * 50 + "px";
				}
			} else {
				getId('erCategory').style.marginTop = 186 - filterCondition.itemNo * 60 + "px";
			}
		},
		up:function () {  
			if(num == 'xcgkt'){
				var tempCategoryName = '';
				if(this.pos == 0){
					if(this.itemNo == 0)return;
					this.removeTextColor();
					this.itemNo--;
					this.addTextColor();
					this.itemNo1 = 0;
					getId("secondColumnInner").style.marginTop = "191px";
					if(this.xcgktList1[this.itemNo].children == undefined){
						this.template(this.xcgktList1[this.itemNo].children);
						tempCategoryName = this.xcgktList1[this.itemNo].categoryName+'|其他';
						filterContent.template(0,catCode,this.xcgktList1[this.itemNo].categoryId,undefined,undefined,tempCategoryName)
					}else{
						this.template(this.xcgktList1[this.itemNo].children);
						tempCategoryName = this.xcgktList1[this.itemNo].categoryName+'|'+this.xcgktList1[this.itemNo].children[0].categoryName;
						filterContent.template(0,catCode,this.xcgktList1[this.itemNo].children[0].categoryId,undefined,undefined,tempCategoryName)
					}
				}else if(this.pos == 1){
					if(this.itemNo1 == 0)return;
					this.removeTextColor2();
					this.itemNo1--;
					this.addTextColor2()
					tempCategoryName = this.xcgktList1[this.itemNo].categoryName+'|'+this.xcgktList1[this.itemNo].children[this.itemNo1].categoryName
					filterContent.template(0,catCode,this.xcgktList1[this.itemNo].children[this.itemNo1].categoryId,undefined,undefined,tempCategoryName)
				}
				this.slider();
			}else if(num == 'cjkt'){
				if(this.itemNo == 0)return;
				this.removeTextColor();
				this.itemNo--;
				this.addTextColor();
				this.slider()
				filterContent.pindex = 1;
				filterContent.template(0,catCode,this.cjktList[this.itemNo].categoryId,undefined,undefined,this.cjktList[this.itemNo].categoryName)
			}
		},
		down:function () {  
			if(num == 'xcgkt'){
				var tempCategoryName = '';
				if(this.pos == 0){
					if(this.itemNo >= this.xcgktList1.length-1)return;
					this.removeTextColor();
					this.itemNo++;
					this.addTextColor();
					this.itemNo1 = 0;
					getId("secondColumnInner").style.marginTop = "191px";
					if(this.xcgktList1[this.itemNo].children == undefined){
						this.template(this.xcgktList1[this.itemNo].children);
						tempCategoryName = this.xcgktList1[this.itemNo].categoryName+'|其他';
						filterContent.template(0,catCode,this.xcgktList1[this.itemNo].categoryId,undefined,undefined,tempCategoryName);
					}else{
						tempCategoryName = this.xcgktList1[this.itemNo].categoryName+'|'+this.xcgktList1[this.itemNo].children[0].categoryName;
						this.template(this.xcgktList1[this.itemNo].children);
						filterContent.template(0,catCode,this.xcgktList1[this.itemNo].children[0].categoryId,undefined,undefined,tempCategoryName)
					}
				}else if(this.pos == 1){
					if(this.itemNo1 >= this.xcgktList2.length-1)return;
					this.removeTextColor2();
					this.itemNo1++;
					this.addTextColor2();
					tempCategoryName = this.xcgktList1[this.itemNo].categoryName+'|'+this.xcgktList1[this.itemNo].children[this.itemNo1].categoryName
					filterContent.template(0,catCode,this.xcgktList1[this.itemNo].children[this.itemNo1].categoryId,undefined,undefined,tempCategoryName)
				}
				this.slider();
			}else if(num == 'cjkt'){
				if(this.itemNo >= this.cjktList.length-1)return;
				this.removeTextColor();
				this.itemNo++;
				this.addTextColor();
				this.slider()
				filterContent.template(0,catCode,this.cjktList[this.itemNo].categoryId,undefined,undefined,this.cjktList[this.itemNo].categoryName)
			}
		},
		left:function () {  
			if(num == 'cjkt')return;
			if(num == 'xcgkt'){
				if(this.pos == 0)return;
				this.pos = 0;
				addClass(getId('firstColumn'),'firstColumnHover')
				removeClass(getId('secondColumn'),'secondColumnHover');
				document.querySelector('.firstColumnLiHover').style.display = 'block';
				document.querySelector('.secondColumnLiHover').style.display = 'none';
			}

		},
		right:function () {  
			if(num == 'xcgkt'){
				if(this.pos == 1){
					if(filterContent.filterContentList.length == 0)return;
					filterContent.init();
					removeClass(getId('secondColumn'),'secondColumnHover');
					document.querySelector('.secondColumnLiHover').style.display = 'none';		
					document.querySelector('.tempFirstColumnLiHover').style.display = 'block';
				}else if(this.pos == 0){
					this.pos = 1;
					console.log('父级id'+this.xcgktList1[this.itemNo].categoryId)
					console.log('父级name'+this.xcgktList1[this.itemNo].categoryName)
					fatherCategoryId = this.xcgktList1[this.itemNo].categoryId;
					removeClass(getId('firstColumn'),'firstColumnHover')
					addClass(getId('secondColumn'),'secondColumnHover');
					document.querySelector('.firstColumnLiHover').style.display = 'none';
					document.querySelector('.secondColumnLiHover').style.display = 'block';
					document.querySelector('.tempSecondColumnLiHover').style.display = 'block';
					this.addTextColor2();
				}
			}else if(num == 'cjkt'){
				if(filterContent.filterContentList.length == 0)return;
				filterContent.init();
				removeClass(getId('filterCategory'),'filterCategoryHover')
				document.querySelector('.liHoverEr').style.display = 'none';
				document.querySelector('.tempLiHoverEr').style.display = 'block';
			}
		},
		back:function () {  
			window.location.href = Cookies.get('filterBackUrl') || '../../index.html'
		},
		addTextColor:function () {  
			getId('item_'+this.itemNo).style.opacity = '1';
		},
		addTextColor2:function () {  
			getId('item2_'+this.itemNo1).style.opacity = '1';
		},
		removeTextColor:function () {  
			getId('item_'+this.itemNo).style.opacity = '.74';
		},
		removeTextColor2:function () {  
			getId('item2_'+this.itemNo1).style.opacity = '.74';
		}
	};
	init();
	
	var filterContent = {
		itemNo:0,
		pindex:1,
		filterContentList:[],
		totalNumber:0,
		filterContentCategoryId:'',
		template:function (pindex,catCode,categoryId,state,itemNo,keyWord) {  
			tempCategoryId = categoryId;
			getContentFilter(pindex,catCode, categoryId,function(resp){
				console.log(eval('(' + (resp) + ')'))
				filterContent.filterContentList = eval('(' + (resp) + ')').data.assetList;
				filterContent.totalNumber =  eval('(' + (resp) + ')').data.assetNum*1;
				if(filterContent.totalNumber == 0){
					// 没有筛选到数据
					try{
						bi.filter('0',encodeURIComponent(keyWord),'',Cookies.get('homeCatId'))
					}catch(e){
						console.log('埋点错误'+e)
					}
				}
				var divWrap = getId('filterCtent')
				var divInner = '';
				for (var i = 0; i < filterContent.filterContentList.length; i++) {
					var div = '<div class="itemWrap">'+
									'<div class="imgWrap" id="content-item'+i+'">'+
										'<li class="content-item7"><img src="'+filterContent.filterContentList[i].assetImg+'">'+
										'</li>'+
									'</div>'+
									'<div class="itemName">'+filterContent.filterContentList[i].assetName+'</div>'+
								'</div>'
				    divInner+=div;
				};
				divWrap.innerHTML = divInner;
				if(filterContent.totalNumber>8){
					var div =  '<div class="pageNum">'+filterContent.pindex+'/'+(Math.ceil(filterContent.totalNumber/8))+'</div>'+
							   '<div class="barWrap">'+
									'<div class="bar"></div>'+
							   '</div>'
					getId('scrollbox').innerHTML = div;
				}else{
					getId('scrollbox').innerHTML = '';
				};
				if(filterContent.totalNumber == 0){
					var div = '<div class="tip">没有筛选到该关键词的内容，换个词试试吧！</div>';
					divWrap.innerHTML = div;
				};
				if(state == 'down'){
					if(itemNo != undefined){
					    filterContent.itemNo = itemNo;
					}else{
						filterContent.itemNo-=4;
					}
					toggleClass(getId('content-item'+filterContent.itemNo),'resultHove'); 
				}else if(state == 'up'){
					filterContent.itemNo+=4
					toggleClass(getId('content-item'+filterContent.itemNo),'resultHove'); 
				}
			},function(e){
				var div = '<div class="tip">没有筛选到该关键词的内容，换个词试试吧！</div>';
				divWrap.innerHTML = div;
				console.log('筛选失败'+e)	
			})
		},
		init:function () {  
			areaObj = filterContent;
			toggleClass(getId('content-item'+this.itemNo),'resultHove');
		},
		up:function () {  
			if(this.pindex == 1 && this.itemNo <= 3)return;
			if(this.itemNo>3){
			  toggleClass(getId('content-item'+this.itemNo),'resultHove');
			  this.itemNo -=4;
			  toggleClass(getId('content-item'+this.itemNo),'resultHove');
			}else{
			  this.pindex--;
			  filterContent.template((this.pindex-1)*8,catCode,tempCategoryId,'up')
			}
		},
		down:function () {  
			var nowItemNo = (this.pindex-1)*8+this.itemNo
			if ( nowItemNo+4 >= this.totalNumber) {
			  // 下一行不是完整四个资产 需要判断
			  var maxItem = Math.floor(this.totalNumber / 4) * 4;
			  if (nowItemNo >= maxItem || maxItem == this.totalNumber ){
				// 此刻是最后一行不需要做任何操作
				return;
			  } else {
				// 需要将焦点移到最后一个资产
				var itemNo2 = this.totalNumber - nowItemNo-1 // 差值
				if (this.itemNo > 3){
				  // 需要翻页
				  this.pindex++;
				  var itemNo = this.itemNo - 8 + itemNo2; 
				  filterContent.template((this.pindex-1)*8,catCode,tempCategoryId,'down',itemNo)
				} else {      
				  // 不需要翻页
				  toggleClass(getId('content-item'+this.itemNo),'resultHove');
				  this.itemNo += itemNo2;
				  toggleClass(getId('content-item'+this.itemNo),'resultHove');
				}
			  }
			}else{
			  // 正常翻页
			if(this.itemNo<=3){
			  toggleClass(getId('content-item'+this.itemNo),'resultHove');
			  this.itemNo+=4;
			  toggleClass(getId('content-item'+this.itemNo),'resultHove');
			}else{
			  this.pindex++;
			  filterContent.template((this.pindex-1)*8,catCode,tempCategoryId,'down')
			}
			}
		},
		left:function () {  
			if(this.itemNo%4 == 0){
				areaObj = filterCondition;
				toggleClass(getId('content-item'+this.itemNo),'resultHove');
				if(num == 'xcgkt'){
					this.pos = 1;
					removeClass(getId('firstColumn'),'firstColumnHover')
					addClass(getId('secondColumn'),'secondColumnHover');
					document.querySelector('.firstColumnLiHover').style.display = 'none';
					document.querySelector('.secondColumnLiHover').style.display = 'block';
				}else if(num == 'cjkt'){
					addClass(getId('filterCategory'),'filterCategoryHover')
					document.querySelector('.liHoverEr').style.display = 'block';
					document.querySelector('.tempLiHoverEr').style.display = 'none';
				}
				return;
			}
			toggleClass(getId('content-item'+this.itemNo),'resultHove');
			this.itemNo--;
			toggleClass(getId('content-item'+this.itemNo),'resultHove');
		},
		right:function () {  
			if(this.itemNo+1>=this.filterContentList.length)return;
			if((this.itemNo+1)%4 == 0)return;
			if((this.pindex-1)*8+this.itemNo+1>=this.totalNumber)return;
			toggleClass(getId('content-item'+this.itemNo),'resultHove');
			this.itemNo++;
			toggleClass(getId('content-item'+this.itemNo),'resultHove');
		},
		enter:function () {  
			var tempCategoryName = filterCondition.xcgktList1[filterCondition.itemNo].categoryName +'|'+filterCondition.xcgktList2[filterCondition.itemNo1].categoryName;
			try{
				// 点击筛选资产上报埋点
				bi.filter('1',encodeURIComponent(tempCategoryName),this.filterContentList[this.itemNo].assetId,Cookies.get('homeCatId'))
			}catch(e){
				console.log('埋点错误'+e)
			}
			var backUrl = window.location.pathname + '?pageIndex='+this.pindex+'&itemNo=' + this.itemNo + '&catCode=' +catCode +'&num='+num+'&tempCategoryId='+tempCategoryId + '&fatherCategoryId='+fatherCategoryId+'&itemNo1='+filterCondition.itemNo1;
			Cookies.set("backUrl", backUrl, { path: '/' });
			Cookies.set('detailUrl', this.filterContentList[this.itemNo].jsonUrl, { path: '/' })
			window.location.href = '../detail/detail.html'
		},
		back:function () {  
			window.location.href = Cookies.get('filterBackUrl') || '../../index.html'
		}
	}
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
				areaObj.back();
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
		