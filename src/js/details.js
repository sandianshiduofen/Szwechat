$(function() {
	/*条形码浮层*/
	horizontalScreen('.bar_code_wrap');
});
/*自助下单成功页面*/
function orderSuccess(){
	loading('获取中...');
	var orderId=GetQueryString('order');
	$.ajax({
		url: apiAn+'/api/wx/waybill/getWaybill',
		type: 'POST',
		dataType: 'json',
		timeout : 10000,
		data: {waybillNo:orderId,requestTokenId:requestTokenId()},
		success:function(data){
			loadingRemove();
			if (data.success) {
				var info=data.info;
				if (info) {
					/*货物数量*/
					$('.parcel_numble span').html(info.goodsQuantity);
					/*条形码num*/
					JsBarcode("#barCode1", orderId, {width:2,height:100,});
					JsBarcode("#barCode2", orderId, {width:4,height:150,});
					/*分享链接*/
					$('.waybill_share a').eq(0).attr('href', '../order/share.html?order='+info.no);
					var curTime=new Date(info.inputDate);
					var time=curTime.format('yyyy-MM-dd hh:mm:ss');
					/*运单信息*/
					if (info.receiverLinkman) {
						var receiverLinkman=info.receiverLinkman;
					}else{
						var receiverLinkman="无";
					};
					var payTypeText="无";
					if (info.payType==1) {
						payTypeText='寄方付';
					}else if(info.payType==2){
						payTypeText='收方付';
					};
					var html='<div class="receive_pop_tit"><span onclick="displayN($(\'.waybill_wrap\'))"></span></div>'
						+'<div class="share_details">'
							+'<p>下单时间：'+time+'</p>'
							+'<p>运单编号：'+info.no+'</p>'
							+'<p>收&nbsp;货&nbsp; 方：'+info.receiverName+'</p>'
							+'<p><span>联&nbsp; 系 人：'+receiverLinkman+'</span><span>电话：<a href="tel:'+info.receiverMobile+'" class="blue">'+info.receiverMobile+'</a></span></p>'
							+'<p>收货地址：'+info.receiverProvinceName+''+info.receiverCityName+''+info.receiverAreaName+''+info.receiverAddress+'</p>'
							+'<p><span>货物件数：'+info.goodsQuantity+'</span><span>货物信息：'+info.goodsName+'</span></p>'
							+'<p><span>代收货款：'+info.goodsAmount.toFixed(2)+'元</span><span>支付方式：'+payTypeText+'</span></p>'
						+'</div>'
						+'<div class="details_button"><input type="button" class="details_btn" value="复制" data-clipboard-text="下单时间：'+time+' ；运单编号：'+info.no+'；收货方：'+info.receiverName+' ；联系人：'+receiverLinkman+' ；电话：'+info.receiverMobile+'；收货地址：'+info.receiverProvinceName+''+info.receiverCityName+''+info.receiverAreaName+''+info.receiverAddress+'；货物件数：'+info.goodsQuantity+' ；货物信息：'+info.goodsName+'；代收货款：'+info.goodsAmount.toFixed(2)+' 元；支付方式：'+payTypeText+'" onclick="MtaH5.clickStat(\'order_scan_copy\')"></div>'
					$('.waybill_pop_c').html(html);
					/*揽货网点*/
					dotMessage(info.inputDotId);
				}else{
					$('a').attr('href', 'javascript:;');
					alert('未找到该订单');
				};
			}else{
				alert(data.message)
			};
		},
        complete : function(XMLHttpRequest,status){
            loadingRemove();
    　　　　if(status=='error'){
     　　　　　 noResultErr($('.waybill_info'),150,'请求超时，请点击重新获取','orderSuccess()');
    　　　　}else if(status=='timeout'){
                noResultErr($('.waybill_info'),150,'请求超时，请点击重新获取','orderSuccess()');
            }
    　　}
	});
};

/*订单分享页面*/
function orderShare(){
	loading('获取中...');
	var orderId=GetQueryString('order');
	$.ajax({
		url: apiAn+'/api/wx/waybill/getWaybill',
		type: 'get',
		dataType: 'json',
		timeout : 10000,
		data: {waybillNo:orderId,requestTokenId:requestTokenId()},
		success:function(data){
			if (data.success) {
				var info=data.info;
				if (info) {
					/*货物数量*/
					$('.parcel_numble span').html(info.goodsQuantity);
					/*条形码num*/
					JsBarcode("#barCode1", orderId, {width:2,height:100,});
					JsBarcode("#barCode2", orderId, {width:4,height:150,});
					/*分享链接*/
					$('.waybill_share a').eq(0).attr('href', '../order/share.html?order='+info.no);
					var curTime=new Date(info.inputDate);
					var time=curTime.format('yyyy-MM-dd hh:mm:ss');
					/*运单信息*/
					if (info.receiverLinkman) {
						var receiverLinkman=info.receiverLinkman;
					}else{
						var receiverLinkman='无';
					};
					var payTypeText="无";
					if (info.payType==1) {
						payTypeText='寄方付';
					}else if(info.payType==2){
						payTypeText='收方付';
					};
					var html='<p>下单时间：'+time+'</p>'
							+'<p>运单编号：'+info.no+'</p>'
							+'<p>收&nbsp;货&nbsp; 方：<b id="receiverName">'+info.receiverName+'</b></p>'
							+'<p><span>联&nbsp; 系 人：'+receiverLinkman+'</span><span>电话：<a href="tel:'+info.receiverMobile+'" class="blue">'+info.receiverMobile+'</a></span></p>'
							+'<p>收货地址：'+info.receiverProvinceName+''+info.receiverCityName+''+info.receiverAreaName+''+info.receiverAddress+'</p>'
							+'<p>货物件数：'+info.goodsQuantity+'</p>'
							+'<p>货物信息：'+info.goodsName+'</p>'
							+'<p><span>代收货款：'+info.goodsAmount.toFixed(2)+'元</span><span>支付方式：'+payTypeText+'</span></p>'
					$('.share_details').html(html);
					/*揽货网点*/
					dotMessage(info.inputDotId);

					// 页面分享
					var curUrl=document.location.href;
					var curTitle=info.receiverName+'的发货单';
					var desc='三真驿道，你所需 我必达！';
					var imgUrl='http://weixinweb.3zqp.com/skin/images/wxshare.png';
					$.ajax({
						url: api+'/api/wx/wecat/config',
						type: 'POST',
						dataType: 'json',
						data: {url:curUrl,requestTokenId:requestTokenId()},
						success:function(data){
							if (data.success) {
								wx.config({
								    debug: false, 
								    appId: data.info.appId,
								    timestamp: data.info.timestamp,
								    nonceStr: data.info.nonceStr,
								    signature: data.info.signature,
								    jsApiList: [
								    	'onMenuShareAppMessage',
								    	'onMenuShareTimeline',
								    	'onMenuShareQQ',
								    	'onMenuShareQZone'
								    ]
								});
							}else{
								alert(data.message);
							};
						}
					});
					wx.ready(function(){
						// 分享给朋友
						wx.onMenuShareAppMessage({
						  	title: curTitle,
						    desc: desc,
						    link: curUrl,
						    imgUrl: imgUrl,
						    type: 'link',
						    dataUrl: '',
						    success: function () {
						        alert('分享给朋友成功');
						    },
						    cancel: function () {
						    }
						});
						// 分享到朋友圈
						wx.onMenuShareTimeline({
						    title: curTitle,
						    link: curUrl,
						    imgUrl: imgUrl,
						    success: function () { 
						        alert('分享朋友圈成功成功');
						    },
						    cancel: function () {
						    }
						});
						/*分享给qq好友*/
						wx.onMenuShareQQ({
						    title: curTitle,
						    desc: desc,
						    link: curUrl,
						    imgUrl: imgUrl,
						    success: function () { 
						       alert('分享给qq好友成功');
						    },
						    cancel: function () { 
						       
						    }
						});
						wx.onMenuShareQZone({
						    title: curTitle,
						    desc: desc,
						    link: curUrl,
						    imgUrl: imgUrl,
						    success: function () { 
						      	alert('qq空间分享成功');
						    },
						    cancel: function () {
						    }
						});
					});
				}else{
					alert('没找改到订单')
				};
			}else{
				alert(data.message)
			};
		},
        complete : function(XMLHttpRequest,status){
            loadingRemove();
    　　　　if(status=='error'){
     　　　　　 noResultErr($('.share_details'),400,'请求超时，请点击重新获取','orderShare()');
    　　　　}else if(status=='timeout'){
                noResultErr($('.share_details'),400,'请求超时，请点击重新获取','orderShare()');
            }
    　　}
	});	
	return true;
};

/*揽货网点*/
function dotMessage(id){
	loading('获取中...');
	$.ajax({
		url: apiAn+'/api/wx/dot/getDotById',
		type: 'POST',
		timeout : 10000,
		dataType: 'json',
		data: {dotId:id,requestTokenId:requestTokenId()},
		success:function(data){
			if (data.success) {
				var info=data.info;
				var dothtml='<p>揽货网点：'+info.name+'</p><p>联系电话：';
				if (info.tel1) {
					dothtml+='<a href="tel:'+info.tel1+'" class="blue">'+info.tel1+'</a>';
				}else if(info.tel2){
					dothtml+='<a href="tel:'+info.tel2+'" class="blue">'+info.tel2+'</a>';
				}else{
					dothtml+='<a href="tel:'+info.tel3+'" class="blue">'+info.tel3+'</a>';
				};
				dothtml+='</p><p>网点地址：'+info.province+''+info.city+''+info.area+''+info.address+'</p>';
				$('.waybill_info').html(dothtml);
			}else{
				alert(data.message)
			};
		},
        complete : function(XMLHttpRequest,status){
            loadingRemove();
    　　　　if(status=='error'){
     　　　　　 noResultErr($('.waybill_info'),150,'揽货网点请求超时，请点击重新获取','dotMessage('+id+')');
    　　　　}else if(status=='timeout'){
                noResultErr($('.waybill_info'),150,'揽货网点请求超时，请点击重新获取','dotMessage('+id+')');
            }
    　　}
	});
}

// 查看待收货款
function lookCollection(){
	window.location.href='../order/collection_info.html?order='+GetQueryString('order');
}
// 查看网点
function receiverDot(id){
	window.location.href='../order/branch_info.html?order='+id;
}
function LogisticsLog(order,way){
	$.ajax({
		url: apiAn+'/api/wx/waybill/getWaybillLog',
		type: 'post',
		dataType: 'json',
		timeout : 10000,
		data: {waybillNo:order,requestTokenId:requestTokenId()},
		success:function(data){
			loadingRemove();
			if (data.success) {
				// console.log(data)
				var html="";
				for (var i = 0; i < data.info.length; i++) {
					var curTime=new Date(data.info[i].logdate);
					var time=curTime.format('yyyy/MM/dd hh:mm:ss');
					var logvalue=data.info[i].contentForUser;
					var r = /((([0-9]{7,13})(?!\d))|((\d{3})-(\d{7,8})(?!\d))|((\d{4})-(\d{7,8})(?!\d)))/gmi;
					var rg = /((\d{3})-(\d{7,8})(?!\d))|((\d{4})-(\d{7,8})(?!\d))/gmi;
					// var r = /(1[3|4|5|6|7|8][0-9]{9}(?!\d)|\d{3}-\d{8}(?!\d)|\d{4}-\d{7}(?!\d)|(400)\d{4,6}(?!\d)|0\d{10,11}(?!\d))/gmi;
					
					if (r.test(logvalue)) {
					    var t1 = logvalue.match(r);
					    for (var j = 0; j < t1.length; j++) {
					    	var t2=t1[j].match(rg);
					    	if (t1[j].length<13||t2) {
						        var item = t1[j];
						        logvalue =logvalue.replace(item, item.replace(r, '<a class="blue" href="tel:$1">$1</a>'));
							}
					    }
					}
					html+='<li><p>'+logvalue+'</p><span>'+time+'</span></li>';
				};
				$('.logis_state ul').html(html);
				if ($('.logis_state ul').outerHeight()<$('.logis_state_b').outerHeight()) {
					$('.logis_state_b').height($('.logis_state ul').outerHeight());
				};
				 $(".logis_state_b").mCustomScrollbar({
		        	scrollSpeed:10,
		        });
			}else{
				alert(data.message)
			};
		},
        complete : function(XMLHttpRequest,status){
            loadingRemove();
    　　　　if(status=='error'){
     			$('.logis_state_b').css('height', '2rem');
     　　　　　 noResultErr($('.logis_state ul'),200,'请求超时，请点击重新获取','LogisticsLog('+order+','+way+')');
    　　　　}else if(status=='timeout'){
     			$('.logis_state_b').css('height', '2rem');
                noResultErr($('.logis_state ul'),200,'请求超时，请点击重新获取','LogisticsLog('+order+','+way+')');
            }
    　　}
	});
}

function LogisticsInfo(order,way){
	$.ajax({
		url: apiAn+'/api/wx/waybill/getWaybill',
		type: 'post',
		dataType: 'json',
		timeout : 10000,
		data: {waybillNo:order,requestTokenId:requestTokenId()},
		success:function(data){
			loadingRemove();
			// console.log(data)
			if (data.success) {
				var info=data.info;
				if (info) {
					var curTime=new Date(info.inputDate);
					var time=curTime.format('yyyy/MM/dd hh:mm:ss');
					var status=info.status;
					// console.log(data);
					var statusHtml="";
					statusHtml+='<p>物流状态：';
					if (status==0) {
						statusHtml+='<span class="red">待揽货</span><b><img src="../skin/images/wuliu4.png" alt=""></b>';
					}else if(status==1){
						statusHtml+='<span class="red">已揽货</span><b><img src="../skin/images/wuliu4.png" alt=""></b>';
					}else if(status==2){
						statusHtml+='<span class="red">运输中</span><b><img src="../skin/images/wuliu1.png" alt=""></b>';
					}else if(status==3){
						statusHtml+='<span class="red">配送中</span><b><img src="../skin/images/wuliu1.png" alt=""></b>';
					}else if(status==4){
						statusHtml+='<span class="red">已取消</span>';
					}else if(status==5){
						statusHtml+='<span class="red">已退货</span>';
					}else if(status==6){
						statusHtml+='<span class="red">已签收</span><b><img src="../skin/images/wuliu2.png" alt=""></b>';
					}else if(status==7){
						statusHtml+='<span class="red">已驳回</span>';
					};
					statusHtml+='</p>';
					/*运输状态*/
					$('.logis_state_t').html(statusHtml);
					if (way==1) {
						if (info.receiverLinkman) {
							var receiverLinkman=info.receiverLinkman;
						}else{
							var receiverLinkman='无';
						};
						var payTypeText="无";
						if (info.payType==1) {
							payTypeText='寄方付';
						}else if(info.payType==2){
							payTypeText='收方付';
						};
						var html='<p>下单时间：'+time+'</p>'
							+'<p>运单编号：'+info.no;
								/*if (info.status>0) {*/
									html+='<a class="barcodeS" href="barcode.html?order='+info.no+'">运单条码</a>';
								/*};*/
								html+='</p><p>收&nbsp;件&nbsp; 方：'+info.receiverName+'</p>'
								+'<p><span>联&nbsp; 系 人：'+receiverLinkman+'</span><span>电&#x3000;话：<a href="tel:'+info.receiverMobile+'" class="blue">'+info.receiverMobile+'</a></span></p>'
								+'<p>收货地址：'+info.receiverProvinceName+''+info.receiverCityName+''+info.receiverAreaName+''+info.receiverAddress+'</p>'
								+'<p><span>物流运费：';
								if (info.freightAmount) {
									html+=info.freightAmount;
								}else{
									html+=0;
								};
								html+='元</span><span>代收货款：'+info.goodsAmount.toFixed(2)+'元</span></p>';
								if (info.poundageAmount) {
									html+='<p><span>代收货款手续费：'+info.poundageAmount+'元</span>';
								}else{
									html+='<p><span>代收货款手续费：0元</span>';
								};

								html+='<span>货物件数：'+info.goodsQuantity+'</span></p>'
								+'<p>支付方式：'+payTypeText+'</p>'
								+'<p>货物信息：'+info.goodsName+'</p>';
						/*运输信息*/
						$('.logis_details').html(html);
						getDotById(info.inputDotId)

						
					}else{
						if (info.senderLinkman) {
							var senderLinkman=info.senderLinkman;
						}else{
							var senderLinkman="无";
						};
						
						var payTypeText="无";
						if (info.payType==1) {
							payTypeText='寄方付';
						}else if(info.payType==2){
							payTypeText='收方付';
						};
						var html='<p>下单时间：'+time+'</p>'
								+'<p>运单编号：'+info.no+'</p>'
								+'<p>发&nbsp;件&nbsp; 方：'+info.senderName+'</p>'
								+'<p><span>联&nbsp; 系 人：'+senderLinkman+'</span><span>电&#x3000;话：<a href="tel:'+info.senderMobile+'" class="blue">'+info.senderMobile+'</a></span></p>'
								+'<p>发货地址：'+info.senderProvinceName+''+info.senderCityName+''+info.senderAreaName+''+info.senderAddress+'</p>'
								+'<p><span>物流运费：';
								if (info.freightAmount) {
									html+=info.freightAmount;
								}else{
									html+=0;
								};
								html+='元</span><span>代收货款：'+info.goodsAmount.toFixed(2)+'元</span></p>';
								html+='<p><span>货物件数：'+info.goodsQuantity+'</span><span>支付方式：'+payTypeText+'</span></p>'
								+'<p>货物信息：'+info.goodsName+'</p>'
						/*运输信息*/
						$('.logis_details').html(html);
					};
				}else{
					alert('未找到该订单')
				};
				
			}else{
				alert(data.message)
			};
		},
        complete : function(XMLHttpRequest,status){
            loadingRemove();
    　　　　if(status=='error'){
     　　　　　 noResultErr($('.logis_details'),200,'请求超时，请点击重新获取','LogisticsInfo('+order+','+way+')');
    　　　　}else if(status=='timeout'){
                noResultErr($('.logis_details'),200,'请求超时，请点击重新获取','LogisticsInfo('+order+','+way+')');
            }
    　　}
	});
}

function getDotById(inputDotId){
	loading('loading...');
	$.ajax({
		url: apiAn+'/api/wx/dot/getDotById',
		type: 'post',
		timeout : 10000,
		dataType: 'json',
		data: {dotId:inputDotId,requestTokenId:requestTokenId()},
		success:function(data2){
			if (data2.success) {
				var info2=data2.info;
				var dotHtml='<p>揽货网点：'+info2.name;
				if (info2.tel1) {
					dotHtml+='<a href="tel:'+info2.tel1+'"><img src="../skin/images/tel.png" alt=""></a>'
				}else if(info2.tel2){
					dotHtml+='<a href="tel:'+info2.tel2+'"><img src="../skin/images/tel.png" alt=""></a>'
				}else if(info2.tel3){
					dotHtml+='<a href="tel:'+info2.tel3+'"><img src="../skin/images/tel.png" alt=""></a>'
				}else{
					dotHtml+='';
				};
				/*网点信息*/
				dotHtml+='</p><p>网点地址：'+info2.province+''+info2.city+''+info2.area+''+info2.address+'</p>';
				$('.logis_dot').html(dotHtml).attr('onclick', 'receiverDot('+inputDotId+')');
			}else{
				alert(data2.message)
			}
		},
        complete : function(XMLHttpRequest,status){
            loadingRemove();
    　　　　if(status=='error'){
     　　　　　 noResultErr($('.logis_dot'),30,'请求超时，请点击重新获取','getDotById('+inputDotId+')');
     			$('.noResult_c span').remove();
    　　　　}else if(status=='timeout'){
                noResultErr($('.logis_dot'),30,'请求超时，请点击重新获取','getDotById('+inputDotId+')');
     			$('.noResult_c span').remove();
            }
    　　}
	});
}
// 发货信息
function logistics(order,way){
	loading('loading...');
	LogisticsLog(order,way);
	LogisticsInfo(order,way)
}

/*网点信息*/
function branchInfo(){
	loading('loading...');
	$.ajax({
		url: apiAn+'/api/wx/dot/getDotById',
		type: 'post',
		dataType: 'json',
		timeout : 10000,
		data: {dotId:GetQueryString('order'),requestTokenId:requestTokenId()},
		success:function(data){
            loadingRemove();
			if (data.success) {
				// console.log(data)
				var info=data.info;
				var html='<p>揽货网点：'+info.name+'</p>'
					+'<p>揽货时间：'+info.startBusinessHour+'-'+info.endBusinessHour+'</p>';
					if (info.tel1!=null||info.tel2!=null||info.tel3!=null) {
						html+='<p>联系电话：';
						if (info.tel1) {
							html+='<a href="tel:'+info.tel1+'" class="blue">'+info.tel1+'</a> &nbsp; &nbsp;'
						};
						if (info.tel2) {
							html+='<a href="tel:'+info.tel2+'" class="blue">'+info.tel2+'</a> &nbsp; &nbsp;'
						};
						if (info.tel3) {
							html+='<a href="tel:'+info.tel3+'" class="blue">'+info.tel3+'</a> &nbsp; &nbsp;'
						};
						html+='</p>';
					};
					html+='<p>网点地址：'+info.province+''+info.city+''+info.area+''+info.address+'</p>';
				$('.branch_info').html(html);
			}else{
				alert(data.message)
			}
		},
        complete : function(XMLHttpRequest,status){
            loadingRemove();
    　　　　if(status=='error'){
     　　　　　 noResultErr($('.branch_info'),400,'请求超时，请点击重新获取','branchInfo()');
    　　　　}else if(status=='timeout'){
                noResultErr($('.branch_info'),400,'请求超时，请点击重新获取','branchInfo()');
            }
    　　}
	});
}

function collection(order){
	loading('loading...');
	$.ajax({
		url: apiAn+'/api/wx/waybill/findBillChangeRecordForWX',
		type: 'post',
		dataType: 'json',
		timeout : 10000,
		data: {waybillNo:order,requestTokenId:requestTokenId()},
		success:function(data){
			if (data.success) {
				var html='';
				html+='<table class="w100" id="coll_info">';
				if (data.info.length>0) {
					for (var i = 0; i < data.info.length; i++) {
						// console.log(data.info[i])
						var curTime=new Date(data.info[i].createTime);
						var time=curTime.format('yyyy-MM-dd hh:mm:ss');
						html+='<tr><td>'+time+'</td><td>用户修改代收款为<span class="red">'+data.info[i].newGoodsAmount+'</span>元</td></tr>';
					};
				}else{
					html+='<tr><td></td><td>您还没有修改信息</td></tr>';
				};
				html+='</table>';
				$('.coll_info_list').html(html);
			}else{
				alert(data.message)
			}
		},
        complete : function(XMLHttpRequest,status){
            loadingRemove();
    　　　　if(status=='error'){
     　　　　　 noResultErr($('.coll_info_list'),400,'请求超时，请点击重新获取','collection('+order+')');
    　　　　}else if(status=='timeout'){
                noResultErr($('.coll_info_list'),400,'请求超时，请点击重新获取','collection('+order+')');
            }
    　　}
	});
}	

/*条形码浮层，垂直水平居中*/
function horizontalScreen(className){
    var conW = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;  
    var conH = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    $(className).css({  
        "transform":"rotate(90deg) translate("+((conH-conW)/2)+"px,"+((conH-conW)/2)+"px)",  
        "width":conH+"px",  
        "height":conW+"px",
        'justify-content':'center',
        'align-items':'center',
        "left":0,
        "top":0,
        "transform-origin":"center center",
        "-webkit-transform-origin": "center center",
        'position': 'fixed',
        'text-align': 'center',
        'background': '#fff',
        'z-index':10,
    });
}