// 初中

var homeMiddleSchool = {
	homeMiddleSchoolList:[],
	coponentIdList:[],
	init:function (data) {  
		console.log(data)
		this.homeMiddleSchoolList = data.data.specialList;
		for (var i = 0; i < this.homeMiddleSchoolList.length; i++) {
			this.coponentIdList.push(this.homeMiddleSchoolList[i].specialId)	 
		}
		var homeCategoryEle = getId('homeContent');
		var homeRecommendHtml = '';
		for (var i = 0; i < data.data.specialList.length; i++) {
			if( data.data.specialList[i].layout == 'normalRecommendTop'){
				homeRecommendHtml+=normalRecommendTop.template(this.coponentIdList,data.data.specialList[i])
			}else if(data.data.specialList[i].layout == 'SortRecommendTop_5'){
				homeRecommendHtml+=SortRecommendTop_5.template(this.coponentIdList,data.data.specialList[i])
			}else if(data.data.specialList[i].layout == 'assetRecommendationBig_1_Small_4'){	
				homeRecommendHtml+=assetRecommendationBig_1_Small_4.template(this.coponentIdList,data.data.specialList[i])
			}else if(data.data.specialList[i].layout == 'assetRecommendationBig_3'){
				homeRecommendHtml+=assetRecommendationBig_3.template(this.coponentIdList,data.data.specialList[i]);
			}else if(data.data.specialList[i].layout == 'assetRecommendation_6'){
				homeRecommendHtml+=assetRecommendation_6.template(this.coponentIdList,data.data.specialList[i]);
			}else if(data.data.specialList[i].layout == 'assetRecommendation_12'){
				homeRecommendHtml+=assetRecommendation_12.template(this.coponentIdList,data.data.specialList[i]);
			}
		}
		homeCategoryEle.innerHTML = homeRecommendHtml;
		imgLazyLoad(); // 懒加载
	}
}

