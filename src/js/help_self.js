'use strict';
$(function() {
	/*返回退出*/
	/*if (!GetQueryString('waybill')) {
		var ua = navigator.userAgent.toLowerCase();
		if (/android/.test(ua)) {
			popstate();
		};
	};*/
	if (userId()) {
		selfLoading();
	}else if(!GetQueryString('code')){
		document.write('<p style="text-align:center;line-height:4rem;font-size:20px;">请在微信三真驿道公众号菜单中打开</p>')
	}
	
	$('label').on('change', '.pay_way2', function(event) {
		if ($(this).attr('checked')) {
			/*如果绑定银行卡的操作*/
			$('[name="have_coll"]').attr('onclick', 'price_open()');
			price_open();
		}else{
			$('[name="have_coll"]').val('').removeAttr('onclick');
			$('[name="goodsAmount"]').val('0');
			if ($('[name="payType"]').eq(2).attr('checked')) {
				$('[name="payType"]').eq(2).removeAttr('checked');
			};
		};
		self_btn_show()
	});

	/*自助下单货物件数初始化*/
	addno();

	/*当附近的网点只有一个时，默认转中状态*/
	var nearby_li=$('.nearby ul li');
	if (nearby_li.length==1) {
		nearby_li.find('.pay_way').attr('checked', 'checked');
	};

	$('table').on('click', '[name="payType"]:eq(2)', function(event) {
		if ($('[name="goodsAmount"]').val()<=0) {
			alert('未选择代收货款，选择回单付必须要有代收货款哦！');
			return false;
		}
	});
	
	/*判断是修改还是新增*/
	

	/*付款方式变化*/
	$('[name="payType"]').change(function(event) {
		self_btn_show();
	});
	/*包裹数量变化*/
	$('[name="goodsQuantity"]').change(function(event) {
		self_btn_show();
	});
	/*货物名称变化*/
	$('[name="goodsName"]').keyup(function(event) {
		self_btn_show();
	});
	/*网点变化*/
	$('.nearby').on('click', '[name="inputDotId"]', function(event) {
		self_btn_show();
	});

	setTimeout(function(){
		self_btn_show();
	}, 100);

});

function selfLoading(){
	if (GetQueryString("waybill")) {
		$('[name="senderId"]').val(number());
		$('[name="senderRegisterMobile"]').val(userName());
		loading('loading...');
		document.title='修改运单';
		$('#selfSubmit').attr('onclick', 'auto_help_edit()');
		var waybill=GetQueryString("waybill");
		$.ajax({
			url: apiAn+'/api/wx/waybill/getWaybill',
			type: 'POST',
			timeout: 10000,
			dataType: 'json',
			data: {waybillNo:waybill,requestTokenId:requestTokenId()},
			success:function(data){
				loadingRemove();
				if (data.success) {
					var info=data.info;
					console.log(info);
					// bannceEdit(info.senderCityId,info.senderAreaId,info.receiverAreaId,info.inputDotId);
					$('#selfSubmit').attr('onclick', 'auto_help_edit()');
					/*发货地址*/
					$('[name="receiverName"]').val(info.receiverName);
					$('[name="receiverLinkman"]').val(info.receiverLinkman);
					$('[name="receiverMobile"]').val(info.receiverMobile);
					$('[name="receiverProvinceName"]').val(info.receiverProvinceName);
					$('[name="receiverCityName"]').val(info.receiverCityName);
					$('[name="receiverAreaName"]').val(info.receiverAreaName);
					$('[name="receiverProvinceId"]').val(info.receiverProvinceId);
					$('[name="receiverCityId"]').val(info.receiverCityId);
					$('[name="receiverAreaId"]').val(info.receiverAreaId);
					$('[name="receiverAddress"]').val(info.receiverAddress);
					$('[name="receiverId"]').val(info.receiverId);
					$('[name="receiverRegisterCompany"]').val(info.receiverName);
					if (info.receiverLinkman) {
						var receiverLinkman=info.receiverLinkman;
					}else{
						var receiverLinkman='';
					};
					var receiverhtml='<p id="addr_receiver"> '+info.receiverName+' <br> '+receiverLinkman+' '+info.receiverMobile+'  <br>'+info.receiverProvinceName+' '+info.receiverCityName+' '+info.receiverAreaName+' '+info.receiverAddress+'</p>';
					$('.delivery_edit a').html(receiverhtml);
					/*发货地址*/
					$('[name="senderName"]').val(info.senderName);
					$('[name="senderLinkman"]').val(info.senderLinkman);
					$('[name="senderMobile"]').val(info.senderMobile);
					$('[name="senderProvinceName"]').val(info.senderProvinceName);
					$('[name="senderCityName"]').val(info.senderCityName);
					$('[name="senderAreaName"]').val(info.senderAreaName);
					$('[name="senderProvinceId"]').val(info.senderProvinceId);
					$('[name="senderCityId"]').val(info.senderCityId);
					$('[name="senderAreaId"]').val(info.senderAreaId);
					$('[name="senderAddress"]').val(info.senderAddress);
					if (info.senderLinkman) {
						var senderLinkman=info.senderLinkman;
					}else{
						var senderLinkman='';
					};
					var senderhtml='<p id="addr_consigner"> '+info.senderName+' <br> '+senderLinkman+' '+info.senderMobile+'  <br>'+info.senderProvinceName+' '+info.senderCityName+' '+info.senderAreaName+' '+info.senderAddress+'</p>';
					$('.consigner_edit a').html(senderhtml);
					/*商品名称*/
					$('[name="goodsName"]').val(info.goodsName);
					/*商品数量*/
					$('[name="goodsQuantity"]').val(info.goodsQuantity);
					if (info.goodsQuantity>1) {
						$('#reduce').removeClass('no');
					};
					if (info.goodsQuantity>=999) {
						$('#increase').addClass('no');
					};
					/*代收款金额*/
					if (info.goodsAmount) {
						$('[name="collection"]').attr('checked', 'checked');
						var APrice=parseFloat(info.goodsAmount).toFixed(2);
						var ADian=outputmoney(APrice);
						$('[name="goodsAmount"]').val(info.goodsAmount);
						$('[name="have_coll"]').val(ADian).attr('onclick', 'price_open()');
					};
					/*支付方式*/
					$('[name="payType"]').eq(info.payType-1).attr('checked', 'checked');

					/*判断是不是已发货*/
					if (data.info.status >=1) {
						bannceEdit(info.senderCityId,info.senderAreaId,info.receiverAreaId,info.inputDotId,data.info.status);
						$('.consigner_edit a').removeAttr('onclick').parents('tr').css('background', '#f5f5f5');
						$('.delivery_edit a').removeAttr('onclick').parents('tr').css('background', '#f5f5f5');
						$('.addr_book_btn').remove();
						$('[name="goodsName"]').addClass('lost').attr('readonly', 'readonly');
						$('[name="goodsQuantity"]').attr('readonly', 'readonly').css({
							background: '#f1f1f1',
							borderColor: '#ccc',
							color:'#999'
						});
						$('.have_coll_a').css('background', '#fff');
						$('span#reduce').removeAttr('onclick').css('background-image', 'url(../skin/images/jian2.png)');
						$('span#increase').removeAttr('onclick').css('background-image', 'url(../skin/images/jia2.png)');
						$('[name="payType"]').attr('disabled', 'disabled');
						$('#selfSubmit').attr('onclick', 'auto_help_coll()');

						$('.payment:checked+span').css('border-color', '#999');
						$('.payment:checked+span b').css('background', '#999');
					}else{
						bannceEdit(info.senderCityId,info.senderAreaId,info.receiverAreaId,info.inputDotId);
					};
				}else{
					alert(data.message)
				};
			},
			complete : function(XMLHttpRequest,status){
	            loadingRemove();
	    　　　　if(status=='error'){
	    			$('a').removeAttr('onclick');
	     　　　　　 alert('请求超时，请刷新重新获取');
	    　　　　}else if(status=='timeout'){
	    			$('a').removeAttr('onclick');
	     　　　　　 alert('请求超时，请刷新重新获取');
	            }
	    　　}
		});
	}else{
		if (userId()) {
			self_load();
		};
	};
}
/*返回*/
function selfHeaderGoback(){
	history.back(-1);
}

/*自助下单初始化包裹*/
function addno(){
	var val=parseInt($('.parcel_num').val());
	if (val<=1) {
		$('#reduce').addClass('no');
	}else if (val>=100) {
		$('#increase').addClass('no');
	}else{
		return true;
	};
}
/*自助下单加载*/
function self_load(){
	/*默认一个发货方地址*/
	if (userId()) {
		loading('加载中...');
		$.ajax({
			url: api+'/api/wx/login/finduser',
			type: 'POST',
			dataType: 'json',
			timeout : 10000,
			data: {id:userId(),requestTokenId:requestTokenId()},
			success:function(data){
				if (data.success) {
					if (!data.info.company) {
						window.location.href='/login/login_addr.html?unionid='+data.info.unionid;
					}else{
						$.ajax({
							url: apiL+'/api/wx/address/find',
							type: 'post',
							timeout : 10000,
							dataType: 'json',
							data: {type:1,userId:userId(),requestTokenId:requestTokenId()},
							success:function(data){
								if (data.success) {
									var html="";
									for (var i = 0; i < data.info.length; i++) {
										if (data.info[i].isDefault==1) {
											if (data.info[i].contact) {
												var contact=data.info[i].contact;
											}else{
												var contact="";
											};
											html='<p id="addr_consigner"> '+data.info[i].company+' <br> '+contact+' '+data.info[i].phone+'  <br>'+data.info[i].proName+' '+data.info[i].cityName+' '+data.info[i].areaName+' '+data.info[i].detailed+'</p>';
											$('.consigner_edit a').html(html);
											$('[name="senderAddId"]').val(data.info[i].id);
											$('[name="senderAddIsDf"]').val(data.info[i].isDefault);
											$('[name="senderName"]').val(data.info[i].company);
											$('[name="senderLinkman"]').val(data.info[i].contact);
											$('[name="senderMobile"]').val(data.info[i].phone);
											$('[name="senderProvinceName"]').val(data.info[i].proName);
											$('[name="senderCityName"]').val(data.info[i].cityName);
											$('[name="senderAreaName"]').val(data.info[i].areaName);
											$('[name="senderProvinceId"]').val(data.info[i].proNumber);
											$('[name="senderCityId"]').val(data.info[i].cityNumber);
											$('[name="senderAreaId"]').val(data.info[i].areaNumber);
											$('[name="senderAddress"]').val(data.info[i].detailed);
										};
									};
								}else{
									alert(data.message)
								};
							},
							complete : function(XMLHttpRequest,status){
					            loadingRemove();
								if(status=='error'){
									$.MsgBox.Confirmt("默认发货地址获取失败，重新获取？",'重新获取','我自己选',function(){
										return false;
								    },function(){
								        self_load();
								    });
								}else if(status=='timeout'){
					            	
					            }
							}
						});
					};
				}else{
					alert(data.message);
				};
			},
	        complete : function(XMLHttpRequest,status){
	            loadingRemove();
				if(status=='error'){
					document.write('请求失败,请返回公众号重新进入');
				}else if(status=='timeout'){
	                document.write('请求失败,请返回公众号重新进入');
	            }
			}
		});
		$('[name="senderId"]').val(number());
		$('[name="senderRegisterMobile"]').val(userName());
		
		if ($('[name="senderName"]').val()) {
			var sendCompany=$('[name="senderName"]').val();
			var sendContact=$('[name="senderLinkman"]').val();
			var sendPhone=$('[name="senderMobile"]').val();
			var sendProName=$('[name="senderProvinceName"]').val();
			var sendCityName=$('[name="senderCityName"]').val();
			var sendAreaName=$('[name="senderAreaName"]').val();
			var sendProNumber=$('[name="senderProvinceId"]').val();
			var sendCityNumber=$('[name="senderCityId"]').val();
			var sendAreaNumber=$('[name="senderAreaId"]').val();
			var sendDetailed=$('[name="senderAddress"]').val();
			var html='<p id="addr_consigner"> '+sendCompany+' <br> '+sendContact+' '+sendPhone+'  <br>'+sendProName+' '+sendCityName+' '+sendAreaName+' '+sendDetailed+'</p>';
			$('.consigner_edit a').html(html);
		};
		if ($('[name="receiverName"]').val()) {
			var receCompany=$('[name="receiverName"]').val();
			var receContact=$('[name="receiverLinkman"]').val();
			var recePhone=$('[name="receiverMobile"]').val();
			var receProName=$('[name="receiverProvinceName"]').val();
			var receCityName=$('[name="receiverCityName"]').val();
			var receAreaName=$('[name="receiverAreaName"]').val();
			var receProNumber=$('[name="receiverProvinceId"]').val();
			var receCityNumber=$('[name="receiverCityId"]').val();
			var receAreaNumber=$('[name="receiverAreaId"]').val();
			var receDetailed=$('[name="receiverAddress"]').val();
			var html='<p id="addr_receiver"> '+receCompany+' <br> '+receContact+' '+recePhone+'  <br>'+receProName+' '+receCityName+' '+receAreaName+' '+receDetailed+'</p>';
			$('.delivery_edit a').html(html);
		};
	};
}
/*修改发货人*/
function consigner(){
	if (!$('[name="consigner"]').val()) {
		window.location.href="../ucenter/consigner_edit.html?add=selfH";
	}else{
		if (GetQueryString('waybill')) {
			window.location.href="../ucenter/consigner_edit.html?edit=1&from=selfH&waybill=selfH&order="+GetQueryString('waybill');
		}else{
			window.location.href="../ucenter/consigner_edit.html?edit=1&from=selfH&order="+GetQueryString('waybill');
		};
	};
}
/*修改收货人*/
function delivery(){
	if (!$('[name="delivery"]').val()) {
		window.location.href="../ucenter/receiving_edit.html?add=selfH";
	}else{
		var csgId=$('[name="delivery"]').val();
		if (GetQueryString('waybill')) {
			window.location.href="../ucenter/receiving_edit.html?edit=1&from=selfH&waybill=selfH&order="+GetQueryString('waybill');
		}else{
			window.location.href="../ucenter/receiving_edit.html?edit=1&from=selfH&order="+GetQueryString('waybill');
		};
	};
}
/*代收价格*/
function price_open(){
	if ($('[name="goodsAmount"]').val()>0) {
		var haveColl=$('[name="goodsAmount"]').val();
	}else{
		var haveColl='';
	};
	var html='<div class="receive_pop_w agency_fund">'
			+'<div class="receive_pop">'
				+'<div class="receive_pop_c">'
					+'<div class="receive_pop_close" onclick="receive_close()"></div>'
					+'<div class="uc_cou_bot">'
						+'<div class="receive_pop_tit">'
							+'<span onclick="receive_close()"></span>'
						+'</div>'
						+'<div class="uc_cou_con collection_pop">'
							+'<input class="price_coll" type="number" placeholder="输入代收货款金额" onblur="coll_price($(this))" oninput="if(value.length>9)value=value.slice(0,9);">'
							+'<p class="msg"></p>'
							+'<p>请认真核对代收款金额，运单未签收前您可自助修改金额</p>'
							+'<footer>'
							+'<a class="footer_btn" href="javascript:;" onclick="coll_submit()">确定</a>'
							+'</footer></div></div></div></div></div>'
	$('body').append(html);
	var priceA=parseFloat(haveColl).toFixed(2);
	/*var dianA=outputmoney(priceA);*/
	$('.price_coll').val(priceA).focus();
}
function receive_close(){
	$('.agency_fund').remove();
	if (parseFloat($('[name="goodsAmount"]').val())<5) {
		$('[name="collection"]').removeAttr('checked');
		$('[name="have_coll"]').removeAttr('onclick');
	};
}
/*提交收货款金额*/
function coll_submit(){
	if (coll_price($('.price_coll'))) {
		var val=$('.price_coll').val();
		var price=parseFloat(val).toFixed(2);
		var dian=outputmoney(price);
		$('#have_coll').val(dian);
		$('[name="goodsAmount"]').val(price);
		$('.agency_fund').remove();
	}else{
		coll_price($('.price_coll'))
	};
	
}

/*以下为金额转化为三个字符一个“，”逗号*/
function outputmoney(number) {
	number = number.replace(/\,/g, "");
	if(isNaN(number) || number == "")return "";
	number = Math.round(number * 100) / 100;
	    if (number < 0)
	        return '-' + outputdollars(Math.floor(Math.abs(number) - 0) + '') + outputcents(Math.abs(number) - 0);
	    else
	        return outputdollars(Math.floor(number - 0) + '') + outputcents(number - 0);
} 
/*格式化金额*/
function outputdollars(number) {
    if (number.length <= 3)
        return (number == '' ? '0' : number);
    else {
        var mod = number.length % 3;
        var output = (mod == 0 ? '' : (number.substring(0, mod)));
        for (var i = 0; i < Math.floor(number.length / 3); i++) {
            if ((mod == 0) && (i == 0))
                output += number.substring(mod + 3 * i, mod + 3 * i + 3);
            else
                output += ',' + number.substring(mod + 3 * i, mod + 3 * i + 3);
        }
        return (output);
    }
}
function outputcents(amount) {
    amount = Math.round(((amount) - Math.floor(amount)) * 100);
    return (amount < 10 ? '.0' + amount : '.' + amount);
}
/*以上为金额转化为三个字符一个“，”逗号*/

/*验证输入有代收款是否正确*/
function coll_price(e){
	var price_val=e.val();
	if (price_val) {
		if (!isverify(price_val)) {
			$('.msg').html('<span class="red">小数点后最多保留两位小数,代收货款需低于100万</span>');
			return false;
		}else{
			if (parseFloat(price_val)<2) {
				$('.msg').html('<span class="red">代收货款金额最低为2元</span>');
				return false;
			}else{
				$('.msg').html('');
				return true;
			};
		};
	}else{
		$('.msg').html('<span class="red">请输入正确的代收货款金额</span>');
		return false;
	};
}

/*验证价格*/
function isverify(verify) {
	var pattern = /^\d{1,6}(\.\d{1,2})?$/;
 	return pattern.test(verify);
}
/*货物件数变化时限制*/
function num_change(e){
	if (e.val()<=1) {
		e.val('1');
		$('#reduce').addClass('no');
		$('#increase').removeClass('no');
		return false;
	}else if(e.val()>=999){
		e.val('999');
		$('#reduce').removeClass('no');
		$('#increase').addClass('no');
		return false;
	}else{
		$('#reduce').removeClass('no');
		$('#increase').removeClass('no');
	}
	if(!/^\d+$/.test(e.val())){
		var intval=parseInt(e.val())
		if (!isNaN(intval)) {
			e.val(intval);
			if (intval==1) {
				$('#reduce').addClass('no');
				$('#increase').removeClass('no');
			}
		}else{
			e.val(1);
			$('#reduce').addClass('no');
			$('#increase').removeClass('no');
		};
	}
	self_btn_show();
}
/*减少包裹*/
function reduce(e){
	var val=parseInt(e.siblings('.parcel_num').val());
	if (val<=1) {
		e.addClass('no');
	}else{
		val--;
		if (val==1) {
			e.addClass('no');
		};
		$('#increase').removeClass('no');
	};
	e.siblings('.parcel_num').val(val);
}
/*增加包裹*/
function increase(e){
	var val=parseInt(e.siblings('.parcel_num').val());
	if (val>=999) {
		e.addClass('no');
	}else{
		val++;
		if (val==999) {
			e.addClass('no');
		};
		$('#reduce').removeClass('no');
	};
	e.siblings('.parcel_num').val(val);
}

/*提交运单*/
function self_submit(){
	var consigner=$('input[name="senderName"]').val();
	var delivery=$('input[name="receiverName"]').val();
	var goodsName=$('input[name="goodsName"]').val();
	var branch=$('input[name="inputDotId"]:checked').val();
	var pay_way=$('input[name="payType"]:checked').val();
	var have_coll="1";
	if ($('.pay_way2').attr('checked')) {
		have_coll=$('.have_coll').val();
	}
	if (!consigner) {
		$.MsgBox.Alert("请填写发货人的联系方式和详细信息",'确定');
	}else if(!delivery){
		$.MsgBox.Alert("请填写收货人的联系方式和详细信息",'确定');
	}else if(!goodsName){
		$.MsgBox.Alert("请填写货物信息",'确定');
	}/*else if(!pay_way){
		$.MsgBox.Alert("请选择付款方式",'确定');
	}*/else if(!have_coll){
		$.MsgBox.Alert("请输入代收货款金额",'确定');
	}else if(!branch){
		$.MsgBox.Alert("请选择发货网点",'确定');
	}else{
		protocol();
	};
}

function self_btn_show(){
	var consigner=$('input[name="senderName"]').val();
	var delivery=$('input[name="receiverName"]').val();
	var goodsName=trim($('input[name="goodsName"]').val());
	var branch=$('input[name="inputDotId"]:checked').val();
	// var pay_way=$('input[name="payType"]:checked').val();
	var goodsQuantity=$('input[name="goodsQuantity"]').val();
	if (consigner&&delivery&&goodsName&&branch&&goodsQuantity/*&&pay_way*/) {
		$('.footer_self .footer_btn').removeClass('hui').removeAttr('disabled');
	}else{
		$('.footer_self .footer_btn').addClass('hui').attr('disabled', 'disabled');
	};
}
/*提交后弹出协议*/
function protocol(){
	$('.protocol_w').css('display', 'block');
}
/*提交关闭协议*/
function protocol_close(){
	$('.protocol_w').css('display', 'none');
}
/*协议确认提交*/
function auto_help_ok(){
	loading('提交中...');
	$.ajax({
		url: apiAn+'/api/wx/waybill/insertWaybill',
		type: 'POST',
		timeout : 10000,
		dataType: 'json',
		data: $('#selfHelpOrder').serialize(),
		success:function(data){
			loadingRemove();
			if (data.success) {
			    $('#selfSubmit').attr('disabled', 'disabled');
				var timer=setTimeout(function(){
					clearTimeout(timer);
					$('#selfSubmit').removeAttr('disabled');
				}, 5000);
				var order=data.info;
				window.location.href='../order/order_succeed.html?order='+order;
			}else{
				alert(data.message);
			};
		},
        complete : function(XMLHttpRequest,status){
        	$('[name="requestTokenId"]').val(requestTokenId());
			loadingRemove();
			if(status=='error'){
				alert('提交失败，请重试');
			}else if(status=='timeout'){
				alert('提交失败，请重试');
			}
    　　}
    });
}

/*自助下单修改*/
function auto_help_edit(){
	loading('提交中...');
	var waybillNo=GetQueryString('waybill');
	$.ajax({
		url: apiAn+'/api/wx/waybill/editWaybill',
		type: 'POST',
		timeout : 10000,
		dataType: 'json',
		data: $('#selfHelpOrder').serialize()+'&no='+waybillNo,
		success:function(data){
			loadingRemove();
			if (data.success) {
			    $('#selfSubmit').attr('disabled', 'disabled').css('background', '#999');
				var timer=setTimeout(function(){
					clearTimeout(timer);
					$('#selfSubmit').removeAttr('disabled').css('background', '#52BB03');
				}, 5000);
				var order=data.info;
				window.location.href='../order/scan.html?order='+order;
			}else{
				alert(data.message);
			};
		},
        complete : function(XMLHttpRequest,status){
        	$('[name="requestTokenId"]').val(requestTokenId());
			loadingRemove();
			if(status=='error'){
				fubottom('修改失败，请重试');
    　　　　}else if(status=='timeout'){
				fubottom('修改失败，请重试');
			}
		}
    });
}
/*自助下单修改*/
function auto_help_coll(){
	loading('提交中...');
	var goodsAmount=$('[name="goodsAmount"]').val();
	var waybillNo=GetQueryString('waybill');
	var data={
		no:waybillNo,
		waybillNo:waybillNo,
		goodsAmount:goodsAmount,
		requestTokenId:requestTokenId()
	};
	$.ajax({
		url: apiAn+'/api/wx/waybill/editWaybillGoodsAmount',
		type: 'POST',
		timeout : 10000,
		dataType: 'json',
		data: data,
		success:function(data){
			loadingRemove();
			if (data.success) {
				$('#selfSubmit').attr('disabled', 'disabled').css('background', '#999');
				var timer=setTimeout(function(){
					clearTimeout(timer);
					$('#selfSubmit').removeAttr('disabled').css('background', '#52BB03');
				}, 5000);
				var order=data.info;
				window.location.href='../order/scan.html?order='+order;
			}else{
				alert(data.message);
			};
		},
        complete : function(XMLHttpRequest,status){
			loadingRemove();
			if(status=='error'){
				fubottom('修改失败，请重试');
    　　　　}else if(status=='timeout'){
				fubottom('修改失败，请重试');
			}
		}
	});
}


/*附近网点列表*/
function bannce(cityId,areaId,receiverAreaId){
	if (areaId) {
		$.ajax({
			url: apiAn+'/api/wx/dot/getListByArea',
			type: 'POST',
			timeout : 10000,
			dataType: 'json',
			data: {cityId:cityId,areaId:areaId,receiverAreaId:receiverAreaId,requestTokenId:requestTokenId()},
			success:function(data){
				if (data.success) {
					// console.log(data);
					if (data.info.length>0) {
						var html='<h6>附近可揽货网点：共为您匹配到<span class="red">'+data.info.length+'</span>家可揽货网点</h6>';
						html+='<ul>';
						var nowData=new Date();
						for (var i = 0; i < data.info.length; i++) {
							var startBusinessHour=(data.info[i].startBusinessHour).slice(0,5);
							var endBusinessHour=(data.info[i].endBusinessHour).slice(0,5);

							if (data.info[i].inBusiness) {
								html+='<li data-id="'+data.info[i].id+'">';
							}else{
								html+='<li class="branch_close" data-id="'+data.info[i].id+'">';
							};
							html+='<label><div class="branch_w">'
										+'<div class="branch_l">'
										+'<p><input class="pay_way branch" id="branch'+data.info[i].id+'" type="radio" name="inputDotId"  value="'+data.info[i].id+'"><span><b></b></span>'+ data.info[i].name+'</p>'
											+'<p>&nbsp;</p>'
										+'</div>'
										+'<div class="branch_r">'
											+'<span>揽货时间：<br>'+ startBusinessHour+'--'+ endBusinessHour+'</span>'
										+'</div>'
									+'</div>'
									+'<p>营业地址：'+ data.info[i].province+''+ data.info[i].city+''+ data.info[i].area+''+ data.info[i].address+'</p>'
								+'</label><a href="tel:'+data.info[i].tel1+'" class="blue DotTel">'+ data.info[i].tel1+'</a>'
							+'</li>';
						};
						html+='</ul>';
						$('.nearby').html(html);
					}else{
						var html='<h6>附近可揽货网点：共为您匹配到<span class="red">'+data.info.length+'</span>家可揽货网点</h6>';
						$('.nearby').html(html);
						$.MsgBox.Alert(data.message,'确定');
					};
				}else{
					alert(data.message);
				};
			},
	        complete : function(XMLHttpRequest,status){
	            loadingRemove();
	            if(status=='error'){
	                noResultErr($('.nearby'),200,'获取网点失败，请点击重新获取','bannce('+cityId+','+areaId+','+receiverAreaId+')');
	            }else if(status=='timeout'){
	                noResultErr($('.nearby'),200,'获取网点失败，请点击重新获取','bannce('+cityId+','+areaId+','+receiverAreaId+')');
	            }
	        }
	    });
		return true;
	};
	
}
/*附近网点列表*/
function bannceEdit(cityId,areaId,receiverAreaId,id,status){
	var statu=status;
	if (areaId) {
		$.ajax({
			url: apiAn+'/api/wx/dot/getListByArea',
			type: 'POST',
			timeout : 10000,
			dataType: 'json',
			data: {cityId:cityId,areaId:areaId,receiverAreaId:receiverAreaId,requestTokenId:requestTokenId()},
			success:function(data){
				if (data.success) {
					if (!status) {
						var html='<h6>附近可揽货网点：共为您匹配到<span class="red">'+data.info.length+'</span>家可揽货网点</h6>';
						html+='<ul>';
						var nowData=new Date();
						for (var i = 0; i < data.info.length; i++) {
							var startBusinessHour=(data.info[i].startBusinessHour).slice(0,5);
							var endBusinessHour=(data.info[i].endBusinessHour).slice(0,5);
							if (data.info[i].inBusiness) {
								html+='<li data-id="'+data.info[i].id+'">';
							}else{
								html+='<li class="branch_close" data-id="'+data.info[i].id+'">';
							};
							html+='<label><div class="branch_w">'
										+'<div class="branch_l">';
											html+='<p><input class="pay_way branch" id="branch'+data.info[i].id+'" type="radio" name="inputDotId"  value="'+data.info[i].id+'"><span><b></b></span>'+ data.info[i].name+'</p>';
											html+='<p>&nbsp;</p>'
										+'</div>'
										+'<div class="branch_r">'
											+'<span>揽货时间：<br>'+ startBusinessHour+'--'+ endBusinessHour+'</span>'
										+'</div>'
									+'</div>'
									+'<p>营业地址：'+ data.info[i].province+''+ data.info[i].city+''+ data.info[i].area+''+ data.info[i].address+'</p>'
								+'</label><a href="tel:'+data.info[i].tel1+'" class="blue DotTel">'+ data.info[i].tel1+'</a>'
							+'</li>';
						};
					}else{
						var html='<h6>附近可揽货网点：共为您匹配到<span class="red">1</span>家可揽货网点</h6>';
						html+='<ul>';
						var nowData=new Date();
						$.ajax({
							url: apiAn+'/api/wx/dot/getDotById',
							type: 'post',
							timeout : 10000,
							dataType: 'json',
							async:false,
							data: {dotId:id,requestTokenId:requestTokenId()},
							success:function(data){
								// console.log(data);
								if (data.success) {
									var info=data.info;
									var startBusinessHour=(info.startBusinessHour).slice(0,5);
									var endBusinessHour=(info.endBusinessHour).slice(0,5);
									if (info.inBusiness) {
										html+='<li data-id="'+info.id+'">';
									}else{
										html+='<li class="branch_close" data-id="'+info.id+'">';
									};
									html+='<label><div class="branch_w">'
												+'<div class="branch_l">';
												html+='<p><input class="pay_way branch" id="branch'+info.id+'" type="radio" name="inputDotId"  value="'+info.id+'" disabled="disabled"><span><b></b></span>'+ info.name+'</p>';
													html+='<p>&nbsp;</p>'
												+'</div>'
												+'<div class="branch_r">'
													+'<span>揽货时间：<br>'+ startBusinessHour+'--'+ endBusinessHour+'</span>'
												+'</div>'
											+'</div>'
											+'<p>营业地址：'+ info.province+''+ info.city+''+ info.area+''+ info.address+'</p>'
										+'</label><a href="tel:'+data.info[i].tel1+'" class="blue DotTel">'+ data.info[i].tel1+'</a>'
									+'</li>';
								}else{
									alert(data.message)
								}
							},
					 		complete : function(XMLHttpRequest,status){
								loadingRemove();
								if(status=='error'){
									noResultErr($('.nearby'),200,'获取网点失败，请点击重新获取','bannceEdit('+cityId+','+areaId+','+receiverAreaId+','+id+','+statu+')');
								}else if(status=='timeout'){
									noResultErr($('.nearby'),200,'获取网点失败，请点击重新获取','bannceEdit('+cityId+','+areaId+','+receiverAreaId+','+id+','+statu+')');
								}
							}
						});
					};
					html+='</ul>';
					$('.nearby').html(html);
					$('#branch'+id).attr('checked', 'checked');
					if (status) {
						$('.branch:checked+span').css('border-color', '#999');
						$('.branch:checked+span b').css('background', '#999');
					};
					self_btn_show();
				}else{
					alert(data.message);
				};
			},
	        complete : function(XMLHttpRequest,status){
	            loadingRemove();
	            if(status=='error'){
	                noResultErr($('.nearby'),200,'获取网点失败，请点击重新获取','bannceEdit('+cityId+','+areaId+','+receiverAreaId+','+id+','+statu+')');
	            }else if(status=='timeout'){
	                noResultErr($('.nearby'),200,'获取网点失败，请点击重新获取','bannceEdit('+cityId+','+areaId+','+receiverAreaId+','+id+','+statu+')');
	            }
	        }
	    });
	};
}


/*附近网点列表*/
function bannceEdit(cityId,areaId,receiverAreaId,id,status){
	var statu=status;
	if (areaId) {
		if (!status) {
			$.ajax({
				url: apiAn+'/api/wx/dot/getListByArea',
				type: 'POST',
				timeout : 10000,
				dataType: 'json',
				data: {cityId:cityId,areaId:areaId,receiverAreaId:receiverAreaId,requestTokenId:requestTokenId()},
				success:function(data){
					if (data.success) {
							var html='<h6>附近可揽货网点：共为您匹配到<span class="red">'+data.info.length+'</span>家可揽货网点</h6>';
							html+='<ul>';
							var nowData=new Date();
							for (var i = 0; i < data.info.length; i++) {
								var startBusinessHour=(data.info[i].startBusinessHour).slice(0,5);
								var endBusinessHour=(data.info[i].endBusinessHour).slice(0,5);
								if (data.info[i].inBusiness) {
									html+='<li data-id="'+data.info[i].id+'">';
								}else{
									html+='<li class="branch_close" data-id="'+data.info[i].id+'">';
								};
								html+='<label><div class="branch_w">'
											+'<div class="branch_l">';
												html+='<p><input class="pay_way branch" id="branch'+data.info[i].id+'" type="radio" name="inputDotId"  value="'+data.info[i].id+'"><span><b></b></span>'+ data.info[i].name+'</p>';
												html+='<p>&nbsp;</p>'
											+'</div>'
											+'<div class="branch_r">'
												+'<span>揽货时间：<br>'+ startBusinessHour+'--'+ endBusinessHour+'</span>'
											+'</div>'
										+'</div>'
										+'<p>营业地址：'+ data.info[i].province+''+ data.info[i].city+''+ data.info[i].area+''+ data.info[i].address+'</p>'
									+'</label><a href="tel:'+data.info[i].tel1+'" class="blue DotTel">'+ data.info[i].tel1+'</a>'
								+'</li>';
							};
						
						html+='</ul>';
						$('.nearby').html(html);
						$('#branch'+id).attr('checked', 'checked');
						if (status) {
							$('.branch:checked+span').css('border-color', '#999');
							$('.branch:checked+span b').css('background', '#999');
						};
						self_btn_show();
					}else{
						alert(data.message);
					};
				},
		        complete : function(XMLHttpRequest,status){
		            loadingRemove();
		            if(status=='error'){
		                noResultErr($('.nearby'),200,'获取网点失败，请点击重新获取','bannceEdit('+cityId+','+areaId+','+receiverAreaId+','+id+','+statu+')');
		            }else if(status=='timeout'){
		                noResultErr($('.nearby'),200,'获取网点失败，请点击重新获取','bannceEdit('+cityId+','+areaId+','+receiverAreaId+','+id+','+statu+')');
		            }
		        }
		    });
		}else{
			$.ajax({
				url: apiAn+'/api/wx/dot/getDotById',
				type: 'post',
				timeout : 10000,
				dataType: 'json',
				async:false,
				data: {dotId:id,requestTokenId:requestTokenId()},
				success:function(data){
					// console.log(data);
					if (data.success) {
						var html='<h6>附近可揽货网点：共为您匹配到<span class="red">1</span>家可揽货网点</h6>';
						html+='<ul>';
						var nowData=new Date();
						var info=data.info;
						var startBusinessHour=(info.startBusinessHour).slice(0,5);
						var endBusinessHour=(info.endBusinessHour).slice(0,5);
						if (info.inBusiness) {
							html+='<li data-id="'+info.id+'">';
						}else{
							html+='<li class="branch_close" data-id="'+info.id+'">';
						};
						html+='<label><div class="branch_w">'
									+'<div class="branch_l">';
									html+='<p><input class="pay_way branch" id="branch'+info.id+'" type="radio" name="inputDotId"  value="'+info.id+'" disabled="disabled"><span><b></b></span>'+ info.name+'</p>';
										html+='<p><a href="tel:'+info.tel1+'" class="blue">'+ info.tel1+'</a></p>'
									+'</div>'
									+'<div class="branch_r">'
										+'<span>揽货时间：<br>'+ startBusinessHour+'--'+ endBusinessHour+'</span>'
									+'</div>'
								+'</div>'
								+'<p>营业地址：'+ info.province+''+ info.city+''+ info.area+''+ info.address+'</p>'
							+'</label>'
							+'</li>';
						html+='</ul>';
						$('.nearby').html(html);
						$('#branch'+id).attr('checked', 'checked');
						if (status) {
							$('.branch:checked+span').css('border-color', '#999');
							$('.branch:checked+span b').css('background', '#999');
						};
						self_btn_show();
					}else{
						alert(data.message)
					}
				},
		 		complete : function(XMLHttpRequest,status){
					loadingRemove();
					if(status=='error'){
						noResultErr($('.nearby'),200,'获取网点失败，请点击重新获取','bannceEdit('+cityId+','+areaId+','+receiverAreaId+','+id+','+statu+')');
					}else if(status=='timeout'){
						noResultErr($('.nearby'),200,'获取网点失败，请点击重新获取','bannceEdit('+cityId+','+areaId+','+receiverAreaId+','+id+','+statu+')');
					}
				}
			});
		};
	};
}
/*发货地址薄*/
function consignerBook(){
	if (!GetQueryString('waybill')) {
		window.location.href="../ucenter/ship_address.html?selfHp="+GetQueryString('waybill');
	}else{
		window.location.href="../ucenter/ship_address.html?selfHp="+GetQueryString('waybill')+"&waybill=1";
	};
}
/*收货地址薄*/
function deliveryBook(){
	if (!GetQueryString('waybill')) {
		window.location.href="../ucenter/receiving_party.html?selfHp="+GetQueryString('waybill');
	}else{
		window.location.href="../ucenter/receiving_party.html?selfHp="+GetQueryString('waybill')+"&waybill=addr";
	};
}

/*移除浮层*/
function selfFaEdit(e){
	e.parents('.self_help_w').remove();


}
/*移除浮层*/
function selfShouEdit(e){
	e.parents('.self_help_w').remove();
}

/*发货地址提交*/
function selfShipSubmit(){
	if (!noNullfa($('[name="client"]'),'单位名称')) {
		noNullfa($('[name="client"]'),'单位名称');
		return false;
	}else if(!telNo($('[name="tel"]'))){
		telNo($('[name="tel"]'))
		return false;
	}else if(!noNull($('[name="aeraNum"]'),'所在省、市、区')){
		noNull($('[name="aeraNum"]'),'所在省、市、区');
		return false;
	}else if(!noNullfa($('[name="detail"]'),'详细地址')){
		noNullfa($('[name="detail"]'),'详细地址');
		return false;
	}else{
		loading('提交中...');
		var senderAddId=$('[name="senderAddId"]').val();
		var senderAddIsDf=$('[name="senderAddIsDf"]').val();
		var company=trim($('[name="client"]').val());
		var contact=trim($('[name="name"]').val());
		var phone=trim($('[name="tel"]').val());
		var aera=$('#addr_aera').html();
		var aeraNum=$('[name="aeraNum"]').val();
		var detailed=trim($('[name="detail"]').val());
		var aeraArr=aera.split(' ');
		var aeraNumArr=aeraNum.split(',');
		if (senderAddIsDf==1) {
			var isDefault=1;
		}else{
			var isDefault=0;
		};
		// console.log(isDefault);
		
		if (Recdistinctive()) {
			if (!senderAddId) {
				AMap.service('AMap.Geocoder',function(){
			    var geocoder = new AMap.Geocoder({});
			    geocoder.getLocation(aeraArr[0]+""+aeraArr[1]+""+aeraArr[2]+""+detailed, function(status, result) {
			    	loadingRemove();
				    if (status === 'complete' && result.info === 'OK') {
				        loading('提交中...');
			    		var data={
							userId:userId(),
							type:1,
							company:company,
							contact:contact,
							phone:phone,
							proName:aeraArr[0],
							proNumber:aeraNumArr[0],
							cityName:aeraArr[1],
							cityNumber:aeraNumArr[1],
							areaName:aeraArr[2],
							areaNumber:aeraNumArr[2],
							detailed:detailed,
							lat:result.geocodes[0].location.lat,
							lng:result.geocodes[0].location.lng,
							isDefault:isDefault,
							requestTokenId:requestTokenId()
						};
						$.ajax({
							url: apiL+'/api/wx/address/add',
							type: 'get',
							timeout : 10000,
							dataType: 'json',
							data: data,
							success:function(data){
								loadingRemove();
								if (data.success) {
									// console.log(data)
									$('[name="senderAddId"]').val(data.info.id);
									$('[name="senderAddIsDf"]').val(data.info.isDefault);
									$('[name="senderName"]').val(company);
									$('[name="senderLinkman"]').val(contact);
									$('[name="senderMobile"]').val(phone);
									$('[name="senderProvinceName"]').val(aeraArr[0]);
									$('[name="senderCityName"]').val(aeraArr[1]);
									$('[name="senderAreaName"]').val(aeraArr[2]);
									$('[name="senderProvinceId"]').val(aeraNumArr[0]);
									$('[name="senderCityId"]').val(aeraNumArr[1]);
									$('[name="senderAreaId"]').val(aeraNumArr[2]);
									$('[name="senderAddress"]').val(detailed);
									var html='<p id="addr_consigner"> '+company+' <br> '+contact+' '+phone+'  <br>'+aeraArr[0]+' '+aeraArr[1]+' '+aeraArr[2]+' '+detailed+'</p>';
									$('.consigner_edit a').html(html);
									$('.self_fa_edit').remove();
									var receiverAreaId=$('[name="receiverAreaId"]').val();
									if (receiverAreaId) {
										if (bannce(aeraNumArr[1],aeraNumArr[2],receiverAreaId)) {
											setTimeout(function(){
												self_btn_show();
											}, 100);
										};
									};
								}else{
									alert(data.message);
								};
							},
					        complete : function(XMLHttpRequest,status){
					            loadingRemove();
					            if(status=='error'){
					            	$('.selfShipSubmit').removeAttr('disabled');
					                fubottom('提交失败，请重试');
					            }else if(status=='timeout'){
					            	$('.selfShipSubmit').removeAttr('disabled');
					                fubottom('提交失败，请重试');
					            }
					        }
						});
						/*防止多次提交*/
						$('.selfShipSubmit').attr('disabled', 'disabled');
						setTimeout(function(){
							$('.selfShipSubmit').removeAttr('disabled');
						}, 5000);
				    }else{
				        AMap.service('AMap.Geocoder',function(){//回调函数
						    //实例化Geocoder
						    var geocoder = new AMap.Geocoder({
						        // city: "010"//城市，默认：“全国”
						    });
						    geocoder.getLocation(aeraArr[0]+""+aeraArr[1]+""+aeraArr[2], function(status, result) {
						    	loadingRemove();
							    if (status === 'complete' && result.info === 'OK') {
							        loading('提交中...');
						    		var data={
										userId:userId(),
										type:1,
										company:company,
										contact:contact,
										phone:phone,
										proName:aeraArr[0],
										proNumber:aeraNumArr[0],
										cityName:aeraArr[1],
										cityNumber:aeraNumArr[1],
										areaName:aeraArr[2],
										areaNumber:aeraNumArr[2],
										detailed:detailed,
										lat:result.geocodes[0].location.lat,
										lng:result.geocodes[0].location.lng,
										isDefault:isDefault,
										requestTokenId:requestTokenId()
									};
									$.ajax({
										url: apiL+'/api/wx/address/add',
										type: 'get',
										timeout : 10000,
										dataType: 'json',
										data: data,
										success:function(data){
											loadingRemove();
											if (data.success) {
												// console.log(data)
												$('[name="senderAddId"]').val(data.info.id);
												$('[name="senderAddIsDf"]').val(data.info.isDefault);
												$('[name="senderName"]').val(company);
												$('[name="senderLinkman"]').val(contact);
												$('[name="senderMobile"]').val(phone);
												$('[name="senderProvinceName"]').val(aeraArr[0]);
												$('[name="senderCityName"]').val(aeraArr[1]);
												$('[name="senderAreaName"]').val(aeraArr[2]);
												$('[name="senderProvinceId"]').val(aeraNumArr[0]);
												$('[name="senderCityId"]').val(aeraNumArr[1]);
												$('[name="senderAreaId"]').val(aeraNumArr[2]);
												$('[name="senderAddress"]').val(detailed);
												var html='<p id="addr_consigner"> '+company+' <br> '+contact+' '+phone+'  <br>'+aeraArr[0]+' '+aeraArr[1]+' '+aeraArr[2]+' '+detailed+'</p>';
												$('.consigner_edit a').html(html);
												$('.self_fa_edit').remove();
												var receiverAreaId=$('[name="receiverAreaId"]').val();
												if (receiverAreaId) {
													if (bannce(aeraNumArr[1],aeraNumArr[2],receiverAreaId)) {
														setTimeout(function(){
															self_btn_show();
														}, 100);
													};
												};
											}else{
												alert(data.message);
											};
										},
								        complete : function(XMLHttpRequest,status){
								            loadingRemove();
								            if(status=='error'){
								            	$('.selfShipSubmit').removeAttr('disabled');
								                fubottom('提交失败，请重试');
								            }else if(status=='timeout'){
								            	$('.selfShipSubmit').removeAttr('disabled');
								                fubottom('提交失败，请重试');
								            }
								        }
									});
									/*防止多次提交*/
									$('.selfShipSubmit').attr('disabled', 'disabled');
									setTimeout(function(){
										$('.selfShipSubmit').removeAttr('disabled');
									}, 5000);
							    }else{
							        $.MsgBox.Alert("地址获取失败，请重试或修改地址后再试",'确定');
							    }
							});
						})
				    }
				});
			})
			}else{
				AMap.service('AMap.Geocoder',function(){
					loadingRemove();
				    var geocoder = new AMap.Geocoder({});
				    geocoder.getLocation(aeraArr[0]+""+aeraArr[1]+""+aeraArr[2]+""+detailed, function(status, result) {
					    if (status === 'complete' && result.info === 'OK1') {
					    	loading('提交中...');
					        var data={
								userId:userId(),
								type:1,
								id:senderAddId,
								company:company,
								contact:contact,
								phone:phone,
								proName:aeraArr[0],
								proNumber:aeraNumArr[0],
								cityName:aeraArr[1],
								cityNumber:aeraNumArr[1],
								areaName:aeraArr[2],
								areaNumber:aeraNumArr[2],
								detailed:detailed,
								lat:result.geocodes[0].location.lat,
								lng:result.geocodes[0].location.lng,
								isDefault:isDefault,
								requestTokenId:requestTokenId()
							}
							// console.log(data);
							$.ajax({
								url: apiL+'/api/wx/address/edit',
								type: 'get',
								timeout : 10000,
								dataType: 'json',
								data: data,
								success:function(data){
									loadingRemove();
									if (data.success) {
										// console.log(data)
										$('[name="senderName"]').val(company);
										$('[name="senderLinkman"]').val(contact);
										$('[name="senderMobile"]').val(phone);
										$('[name="senderProvinceName"]').val(aeraArr[0]);
										$('[name="senderCityName"]').val(aeraArr[1]);
										$('[name="senderAreaName"]').val(aeraArr[2]);
										$('[name="senderProvinceId"]').val(aeraNumArr[0]);
										$('[name="senderCityId"]').val(aeraNumArr[1]);
										$('[name="senderAreaId"]').val(aeraNumArr[2]);
										$('[name="senderAddress"]').val(detailed);
										var html='<p id="addr_consigner"> '+company+' <br> '+contact+' '+phone+'  <br>'+aeraArr[0]+' '+aeraArr[1]+' '+aeraArr[2]+' '+detailed+'</p>';
										$('.consigner_edit a').html(html);
										$('.self_fa_edit').remove();
										var receiverAreaId=$('[name="receiverAreaId"]').val();
										if (receiverAreaId) {
											if (bannce(aeraNumArr[1],aeraNumArr[2],receiverAreaId)) {
												setTimeout(function(){
													self_btn_show();
												}, 100);
											};
										};
									}else{
										alert(data.message);
									};
								},
						        complete : function(XMLHttpRequest,status){
						            loadingRemove();
						            if(status=='error'){
						            	$('.selfShipSubmit').removeAttr('disabled');
						                fubottom('提交失败，请重试');
						            }else if(status=='timeout'){
						            	$('.selfShipSubmit').removeAttr('disabled');
						                fubottom('提交失败，请重试');
						            }
						        }
							});
					    }else{
					        AMap.service('AMap.Geocoder',function(){//回调函数
							    //实例化Geocoder
							    var geocoder = new AMap.Geocoder({
							        // city: "010"//城市，默认：“全国”
							    });
							    geocoder.getLocation(aeraArr[0]+""+aeraArr[1]+""+aeraArr[2], function(status, result) {
							    	loadingRemove();
								    if (status === 'complete' && result.info === 'OK') {
								        loading('提交中...');
										var data={
											userId:userId(),
											type:1,
											id:senderAddId,
											company:company,
											contact:contact,
											phone:phone,
											proName:aeraArr[0],
											proNumber:aeraNumArr[0],
											cityName:aeraArr[1],
											cityNumber:aeraNumArr[1],
											areaName:aeraArr[2],
											areaNumber:aeraNumArr[2],
											detailed:detailed,
											lat:result.geocodes[0].location.lat,
											lng:result.geocodes[0].location.lng,
											isDefault:isDefault,
											requestTokenId:requestTokenId()
										}
										// console.log(data);
										$.ajax({
											url: apiL+'/api/wx/address/edit',
											type: 'get',
											timeout : 10000,
											dataType: 'json',
											data: data,
											success:function(data){
												loadingRemove();
												if (data.success) {
													// console.log(data)
													$('[name="senderName"]').val(company);
													$('[name="senderLinkman"]').val(contact);
													$('[name="senderMobile"]').val(phone);
													$('[name="senderProvinceName"]').val(aeraArr[0]);
													$('[name="senderCityName"]').val(aeraArr[1]);
													$('[name="senderAreaName"]').val(aeraArr[2]);
													$('[name="senderProvinceId"]').val(aeraNumArr[0]);
													$('[name="senderCityId"]').val(aeraNumArr[1]);
													$('[name="senderAreaId"]').val(aeraNumArr[2]);
													$('[name="senderAddress"]').val(detailed);
													var html='<p id="addr_consigner"> '+company+' <br> '+contact+' '+phone+'  <br>'+aeraArr[0]+' '+aeraArr[1]+' '+aeraArr[2]+' '+detailed+'</p>';
													$('.consigner_edit a').html(html);
													$('.self_fa_edit').remove();
													var receiverAreaId=$('[name="receiverAreaId"]').val();
													if (receiverAreaId) {
														if (bannce(aeraNumArr[1],aeraNumArr[2],receiverAreaId)) {
															setTimeout(function(){
																self_btn_show();
															}, 100);
														};
													};
												}else{
													alert(data.message);
												};
											},
											complete : function(XMLHttpRequest,status){
												loadingRemove();
												if(status=='error'){
													$('.selfShipSubmit').removeAttr('disabled');
												    fubottom('提交失败，请重试');
												}else if(status=='timeout'){
													$('.selfShipSubmit').removeAttr('disabled');
												    fubottom('提交失败，请重试');
												}
									        }
										});
								    }else{
								        $.MsgBox.Alert("地址获取失败，请重试或修改地址后再试",'确定');
								    }
								});
							})
					    }
					});
				})
			};
		}
	
	}
}

/*显示发货添加*/
function selfConsigner(){
	var html=template('self_fa_edit');
	$('body').append(html);
	$('.self_help_w').animate({right:0}, 300);
	var senderName=$('[name="senderName"]').val();
	var senderLinkman=$('[name="senderLinkman"]').val();
	var senderMobile=$('[name="senderMobile"]').val();
	var senderProvinceName=$('[name="senderProvinceName"]').val();
	var senderCityName=$('[name="senderCityName"]').val();
	var senderAreaName=$('[name="senderAreaName"]').val();
	var senderProvinceId=$('[name="senderProvinceId"]').val();
	var senderCityId=$('[name="senderCityId"]').val();
	var senderAreaId=$('[name="senderAreaId"]').val();
	var senderAddress=$('[name="senderAddress"]').val();
	if (senderName) {
		$('.consigner_t [name="client"]').val(senderName);
		$('.consigner_t [name="name"]').val(senderLinkman);
		$('.consigner_t [name="tel"]').val(senderMobile);
		$('.consigner_t #addr_aera').html(senderProvinceName+' '+senderCityName+' '+senderAreaName).removeClass('c999');
		$('.consigner_t [name="aeraNum"]').val(senderProvinceId+','+senderCityId+','+senderAreaId);
		$('.consigner_t [name="detail"]').val(senderAddress);
		addr_aera2(senderProvinceId,senderCityId,senderAreaId);
	}else{
		addr_aera2();
	};
}
/*收货添加提交*/
function selfRedSubmit(){
	if (!noNullfa($('[name="client"]'),'单位名称')) {
		noNullfa($('[name="client"]'),'单位名称');
		return false;
	}else if(!telNo($('[name="tel"]'))){
		telNo($('[name="tel"]'))
		return false;
	}else if(!noNull($('[name="aeraNum"]'),'所在省、市、区')){
		noNull($('[name="aeraNum"]'),'所在省、市、区');
		return false;
	}else if(!noNullfa($('[name="detail"]'),'详细地址')){
		noNullfa($('[name="detail"]'),'详细地址');
		return false;
	}else{
		
		var company=trim($('[name="client"]').val());
		var contact=trim($('[name="name"]').val());
		var phone=trim($('[name="tel"]').val());
		var aera=$('#addr_aera').html();
		var aeraNum=$('[name="aeraNum"]').val();
		var detailed=trim($('[name="detail"]').val());
		var receiverRegisterCompany=$('[name="receiverRegisterCompany"]').val();
		var receiverRegisterMobile=$('[name="receiverRegisterMobile"]').val();
		var registerTelLin=$('[name="registerTelLin"]').val();
		var registerConLin=$('[name="registerConLin"]').val();
		var receiverIdLin=$('[name="receiverIdLin"]').val();
		var aeraArr=aera.split(' ');
		var aeraNumArr=aeraNum.split(',');
		var isDefault=0;
		if (senddistinctive()) {
			$('[name="receiverRegisterCompany"]').val(company);
			if (registerTelLin) {
				if (registerConLin==company) {
					$('[name="receiverRegisterMobile"]').val(registerTelLin);
				}else{
					$('[name="receiverRegisterMobile"]').val('');
				}
			}else{
				$('[name="receiverRegisterMobile"]').val('');
			};
			/*检索的客户档案号*/
			if (registerConLin==company) {
				$('[name="receiverId"]').val(receiverIdLin);
			}else{
				$('[name="receiverId"]').val('');
			};
			
			$('[name="receiverName"]').val(company);
			$('[name="receiverLinkman"]').val(contact);
			$('[name="receiverMobile"]').val(phone);
			$('[name="receiverProvinceName"]').val(aeraArr[0]);
			$('[name="receiverCityName"]').val(aeraArr[1]);
			$('[name="receiverAreaName"]').val(aeraArr[2]);
			$('[name="receiverProvinceId"]').val(aeraNumArr[0]);
			$('[name="receiverCityId"]').val(aeraNumArr[1]);
			$('[name="receiverAreaId"]').val(aeraNumArr[2]);
			$('[name="receiverAddress"]').val(detailed);
			var html='<p id="addr_receiver"> '+company+' <br> '+contact+' '+phone+'  <br>'+aeraArr[0]+' '+aeraArr[1]+' '+aeraArr[2]+' '+detailed+'</p>';
			$('.delivery_edit a').html(html);
			$('.self_shou_edit,.self_shou_add').remove();
			$('.self_shou_edit').remove();
			var senderCityId=$('[name="senderCityId"]').val();
			var senderAreaId=$('[name="senderAreaId"]').val();
			if (senderAreaId) {
				if (bannce(senderCityId,senderAreaId,aeraNumArr[2])) {
					setTimeout(function(){
						self_btn_show();
					}, 100);
				};
			};
		};
		
	}
}

/*发开添加编辑收货地址*/
function selfDelivery(){
	var html=template('self_shou_add');
	$('body').append(html);
	$('.self_help_w').animate({right:0}, 300);
	var receiverName=$('[name="receiverName"]').val();
	var receiverLinkman=$('[name="receiverLinkman"]').val();
	var receiverMobile=$('[name="receiverMobile"]').val();
	var receiverProvinceName=$('[name="receiverProvinceName"]').val();
	var receiverCityName=$('[name="receiverCityName"]').val();
	var receiverAreaName=$('[name="receiverAreaName"]').val();
	var receiverProvinceId=$('[name="receiverProvinceId"]').val();
	var receiverCityId=$('[name="receiverCityId"]').val();
	var receiverAreaId=$('[name="receiverAreaId"]').val();
	var receiverAddress=$('[name="receiverAddress"]').val();
	var receiverRegisterMobile=$('[name="receiverRegisterMobile"]').val();
	var receiverRegisterCompany=$('[name="receiverRegisterCompany"]').val();
	var receiverId=$('[name="receiverId"]').val();
	if (receiverName) {
		$('.consigner_t [name="client"]').val(receiverName);
		$('.consigner_t [name="name"]').val(receiverLinkman);
		$('.consigner_t [name="tel"]').val(receiverMobile);
		$('.consigner_t #addr_aera').html(receiverProvinceName+' '+receiverCityName+' '+receiverAreaName).removeClass('c999');
		$('.consigner_t [name="aeraNum"]').val(receiverProvinceId+','+receiverCityId+','+receiverAreaId);
		$('.consigner_t [name="detail"]').val(receiverAddress);
		$('.consigner_t [name="registerTelLin"]').val(receiverRegisterMobile);
		$('.consigner_t [name="registerConLin"]').val(receiverRegisterCompany);
		$('.consigner_t [name="receiverIdLin"]').val(receiverId);
		addr_aera2(receiverProvinceId,receiverCityId,receiverAreaId);
	}else{
		addr_aera2();
	};
}

/*发货地址内容（自助下单）*/
function selfshipAddr(data){
	var html="";
	for (var i = 0; i < data.info.length; i++) {
		if (data.info[i].isDefault) {
			html+='<div class="record_li ship_li" data-id="'+data.info[i].id+'">'
			+'<table width="w100"  onclick=addrTrue('+data.info[i].id+')>'
				+'<col width="74%"><col width="20%">'
				+'<tr><td>发 货 方：'+data.info[i].company+'</td><td class="t_r moren"><span class="red">默认发货</span></td></tr>'
				if (data.info[i].contact) {
					html+='<tr><td colspan="2">联 系 人：'+data.info[i].contact+'</td></tr>'
				};
				html+='<tr><td colspan="2">电&#x3000;&#x3000;话：'+data.info[i].phone+'<br></td></tr>'
				+'<tr><td colspan="2">发货地址：'+data.info[i].proName+''+data.info[i].cityName+''+data.info[i].areaName+''+data.info[i].detailed+'<br></td></tr></table>'
			+'<div class="show_details ov_h">'
				+'<label class="ship_moren"></label>'
				+'<a class="f_r f14" href="javascript:;" onclick="del_addr($(this),'+data.info[i].id+')">删除</a>'
				+'<a class="f_r f14" onclick="selfConsignerEdit('+data.info[i].id+')" href="javascript:;">编辑</a>'
			+'</div>'
		+'</div>'
		}else{
			html+='<div class="record_li ship_li" data-id="'+data.info[i].id+'">'
			+'<table width="w100"   onclick=addrTrue('+data.info[i].id+')>'
				+'<col width="74%"><col width="20%">'
				+'<tr><td>发 货 方：'+data.info[i].company+'</td><td class="t_r moren"></td></tr>'
				if (data.info[i].contact) {
					html+='<tr><td colspan="2">联 系 人：'+data.info[i].contact+'</td></tr>'
				};
				html+='<tr><td colspan="2">电&#x3000;&#x3000;话：'+data.info[i].phone+'<br></td></tr>'
				+'<tr><td colspan="2">发货地址：'+data.info[i].proName+''+data.info[i].cityName+''+data.info[i].areaName+''+data.info[i].detailed+'<br></td></tr></table>'
			+'</table>'
			+'<div class="show_details ov_h">'
				+'<label class="ship_moren"><input type="radio"  name="default"><span class="radio"></span>设置为默认发货方</label>'
				+'<a class="f_r f14" href="javascript:;" onclick="del_addr($(this),'+data.info[i].id+')">删除</a>'
				+'<a class="f_r f14" onclick="selfConsignerEdit('+data.info[i].id+')" href="javascript:;">编辑</a>'
			+'</div>'
		+'</div>'
		};
	};
	$('.record_list').html(html);
}

/*发货地址薄搜索（自助下单）*/
function selfAddrsearch(){
	if (userId()) {
		loading('loading...');
		var search=$('.search_input').val();
		var data={
			userId:userId(),
			type:1,
			searchParam:search,
			requestTokenId:requestTokenId()
		}
		if (search){
			$.ajax({
				url: api+'/api/wx/address/find',
				type: 'get',
				timeout : 10000,
				dataType: 'json',
				data: data,
				success:function(data){
					if (data.success) {
						if (data.info.length) {
							selfshipAddr(data)
						}else{
							noshipsearch(search);
						};
					}else{
						alert(data.message)
					};
				},
		        complete : function(XMLHttpRequest,status){
		            loadingRemove();
		    　　　　if(status=='error'){
		     　　　　　 noResultErr($('.record_list'),400,'请求超时，请点击重新获取','selfAddrsearch()');
		    　　　　}else if(status=='timeout'){
		                noResultErr($('.record_list'),400,'请求超时，请点击重新获取','selfAddrsearch()');
		            }
		    　　}
			});
		}else{
			$.ajax({
				url: apiL+'/api/wx/address/find',
				type: 'get',
				timeout : 10000,
				dataType: 'json',
				data: {userId:userId(),type:1,requestTokenId:requestTokenId()},
				success:function(data){
					if (data.success) {
						if (data.info.length) {
							selfshipAddr(data)
						}else{
							noshipsearch();
						}
					}else{
						alert(data.message)
					};
				},
		        complete : function(XMLHttpRequest,status){
		            loadingRemove();
		    　　　　if(status=='error'){
		     　　　　　 noResultErr($('.record_list'),400,'请求超时，请点击重新获取','selfAddrsearch()');
		    　　　　}else if(status=='timeout'){
		                noResultErr($('.record_list'),400,'请求超时，请点击重新获取','selfAddrsearch()');
		            }
		    　　}
			});
		};
	}else{
		document.write('请求失败,请返回公众号重新进入');
	}
}
/*以上为发货地址薄*/

/*发货方地址列表*/
function selfConsignerBook(){
	var html=template('self_fa_book');
	$('body').append(html);
	$('.self_help_w').animate({right:0}, 300);
	if (userId()) {
		selfConsignerBookA();
	}else{
		document.write('请求失败,请返回公众号重新进入');
	}
}
function selfConsignerBookA(){
	loading('loading...');
	$.ajax({
		url: apiL+'/api/wx/address/find',
		type: 'get',
		timeout : 10000,
		dataType: 'json',
		data: {userId:userId(),type:1,requestTokenId:requestTokenId()},
		success:function(data){
			if (data.success) {
				if (data.info.length) {
					selfshipAddr(data);
				}else{
					noshipsearch();
				};
			}else{
				alert(data.message)
			};
		},
        complete : function(XMLHttpRequest,status){
            loadingRemove();
    　　　　if(status=='error'){
     　　　　　 noResultErr($('.record_list'),400,'请求超时，请点击重新获取','selfConsignerBookA()');
    　　　　}else if(status=='timeout'){
                noResultErr($('.record_list'),400,'请求超时，请点击重新获取','selfConsignerBookA()');
            }
    　　}
	});
}
/*没有地址列表*/
function noshipsearch(name){
	if (name) {
		$('.record_list').html('<div class="ship_nofind"><span><img src="../skin/images/no_find.png" alt=""></span><p>对不起，没有找到“'+name+'”，请重新输入</p></div>')
	}else{
		$('.record_list').html('<div class="ship_nofind"><span><img src="../skin/images/no_find.png" alt=""></span><p>对不起，您还没有添加地址</p></div>')
	};
}
/*列表选择发货方*/
function addrTrue(id){
	loading('loading...');
	$.ajax({
		url: apiL+'/api/wx/address/findedit',
		type: 'get',
		timeout : 10000,
		dataType: 'json',
		data: {type:1,id:id,requestTokenId:requestTokenId()},
		success:function(data){
			loadingRemove();
			if (data.success) {
				var info=data.info;
				if (info.company==$('[name="receiverName"]').val()) {
					$.MsgBox.Alert("发货方与收货方名称不能相同",'确定');
					return false;
				};
				/*if (info.phone==$('[name="receiverMobile"]').val()) {
					$.MsgBox.Alert("发货方电话不能与收货方电话相同",'确定');
					return false;
				};*/
				if (info.contact) {
					var contact=info.contact;
				}else{
					var contact='';
				};
				$('[name="senderAddId"]').val(id);
				$('[name="senderAddIsDf"]').val(info.isDefault);
				$('[name="senderName"]').val(info.company);
				$('[name="senderLinkman"]').val(contact);
				$('[name="senderMobile"]').val(info.phone);
				$('[name="senderProvinceName"]').val(info.proName);
				$('[name="senderCityName"]').val(info.cityName);
				$('[name="senderAreaName"]').val(info.areaName);
				$('[name="senderProvinceId"]').val(info.proNumber);
				$('[name="senderCityId"]').val(info.cityNumber);
				$('[name="senderAreaId"]').val(info.areaNumber);
				$('[name="senderAddress"]').val(info.detailed);
				var html='<p id="addr_consigner"> '+info.company+' <br> '+contact+' '+info.phone+'  <br>'+info.proName+' '+info.cityName+' '+info.areaName+' '+info.detailed+'</p>';
				$('.consigner_edit a').html(html);

				$('.self_fa_book').remove();
				var receiverAreaId=$('[name="receiverAreaId"]').val();
				if (receiverAreaId) {
					if (bannce(info.cityNumber,info.areaNumber,receiverAreaId)) {
						setTimeout(function(){
							self_btn_show();
						}, 100);
					};
				};
			}else{
				alert(data.message);
			};
		},
		complete : function(XMLHttpRequest,status){
			loadingRemove();
			if(status=='error'){
				fubottom('选取失败，请重试');
			}else if(status=='timeout'){
				fubottom('选取失败，请重试');
			}
        }
	});
}
/*选择列表选择收货方*/
function recTrue(id){
	loading('loading...');
	$.ajax({
		url: apiL+'/api/wx/address/findedit',
		type: 'get',
		timeout : 10000,
		dataType: 'json',
		data: {type:2,id:id,requestTokenId:requestTokenId()},
		success:function(data){
			loadingRemove();
			if (data.success) {
				var info=data.info;
				if (info.company==$('[name="senderName"]').val()) {
					$.MsgBox.Alert("收货方与发货方单位名称不能相同",'确定');
					return false;
				};
				/*if (info.phone==$('[name="senderMobile"]').val()) {
					$.MsgBox.Alert("收货方电话不能与发货方电话相同",'确定');
					return false;
				};*/
				$('[name="receiverName"]').val(info.company);
				$('[name="receiverLinkman"]').val(info.contact);
				$('[name="receiverMobile"]').val(info.phone);
				$('[name="receiverProvinceName"]').val(info.proName);
				$('[name="receiverCityName"]').val(info.cityName);
				$('[name="receiverAreaName"]').val(info.areaName);
				$('[name="receiverProvinceId"]').val(info.proNumber);
				$('[name="receiverCityId"]').val(info.cityNumber);
				$('[name="receiverAreaId"]').val(info.areaNumber);
				$('[name="receiverAddress"]').val(info.detailed);
				$('[name="receiverRegisterMobile"]').val('');
				$('[name="receiverRegisterCompany"]').val('');
				$('[name="receiverId"]').val('');
				var html='<p id="addr_receiver"> '+info.company+' <br> ';
					if (info.contact) {
						html+=info.contact+' ';
					};
					html+=info.phone+'  <br>'+info.proName+' '+info.cityName+' '+info.areaName+' '+info.detailed+'</p>';
				$('.delivery_edit a').html(html);
				$('.self_shou_book').remove();
				/*获取网点*/
				var senderCityId=$('[name="senderCityId"]').val();
				var senderAreaId=$('[name="senderAreaId"]').val();
				if (senderAreaId) {
					if (bannce(senderCityId,senderAreaId,info.areaNumber)) {
						setTimeout(function(){
							self_btn_show();
						}, 100);
					};
				};
			}else{
				alert(data.message);
			};
		},
		complete : function(XMLHttpRequest,status){
			loadingRemove();
			if(status=='error'){
				fubottom('选取失败，请重试');
			}else if(status=='timeout'){
				fubottom('选取失败，请重试');
			}
        }
	});
}

/*发货地址簿删除*/
function del_addr(e,id){
	$.MsgBox.ConfirmL("确定要删除吗？",'取消','确定',function(){
		loading('删除中...');
		$.ajax({
			url: apiL+'/api/wx/address/findedit',
			type: 'post',
			timeout : 10000,
			dataType: 'json',
			data: {id:id,type:1,requestTokenId:requestTokenId()},
			success:function(data){
				loadingRemove();
				var isDefault=data.info.isDefault;
				if (data.success) {
					$.ajax({
						url: apiL+'/api/wx/address/delete',
						type: 'post',
						timeout : 10000,
						dataType: 'json',
						data: {type:1,id:id,userId:userId(),isDefault:isDefault,requestTokenId:requestTokenId()},
						success:function(data1){
							if (data1.success) {
								$.ajax({
									url: apiL+'/api/wx/address/find',
									type: 'get',
									dataType: 'json',
									data: {userId:userId(),type:1,requestTokenId:requestTokenId()},
									success:function(data){
										if (data.success) {
											var html="";
											for (var i = 0; i < data.info.length; i++) {
												if (data.info[i].isDefault==1) {
													html='<p id="addr_consigner"> '+data.info[i].company+' <br> '+data.info[i].contact+' '+data.info[i].phone+'  <br>'+data.info[i].proName+' '+data.info[i].cityName+' '+data.info[i].areaName+' '+data.info[i].detailed+'</p>';
													$('.consigner_edit a').html(html);
													$('[name="senderAddId"]').val(data.info[i].id);
													$('[name="senderAddIsDf"]').val(data.info[i].isDefault);
													$('[name="senderName"]').val(data.info[i].company);
													$('[name="senderLinkman"]').val(data.info[i].contact);
													$('[name="senderMobile"]').val(data.info[i].phone);
													$('[name="senderProvinceName"]').val(data.info[i].proName);
													$('[name="senderCityName"]').val(data.info[i].cityName);
													$('[name="senderAreaName"]').val(data.info[i].areaName);
													$('[name="senderProvinceId"]').val(data.info[i].proNumber);
													$('[name="senderCityId"]').val(data.info[i].cityNumber);
													$('[name="senderAreaId"]').val(data.info[i].areaNumber);
													$('[name="senderAddress"]').val(data.info[i].detailed);
													/*默认网点*/
													var receiverAreaId=$('[name="receiverAreaId"]').val();
													if (receiverAreaId) {
														bannce(data.info[i].cityNumber,data.info[i].areaNumber,receiverAreaId)
													};
												};
											};
											if (data.info.length==0) {
												$('[name="senderAddId"]').val('');
												$('[name="senderAddIsDf"]').val('');
											};
											if (data.info.length) {
												selfshipAddr(data);
											}else{
												noshipsearch();
											}
										}else{
											alert(data.message)
										};
									}
								});

							}else{
								alert(data1.message);
							};
						},
						complete : function(XMLHttpRequest,status){
							loadingRemove();
							if(status=='error'){
								fubottom('删除失败，请重试');
							}else if(status=='timeout'){
								fubottom('删除失败，请重试');
							}
				        }
					});
				}else{
					alert(data.message);
				};
			},
			complete : function(XMLHttpRequest,status){
				loadingRemove();
				if(status=='error'){
					fubottom('删除失败，请重试');
				}else if(status=='timeout'){
					fubottom('删除失败，请重试');
				}
	        }
		});
    },function(){
        return false;
    })
};
/*收地址簿删除*/
function del_rec(e,id){
	$.MsgBox.ConfirmL("确定要删除吗？",'取消','确定',function(){
		loading('删除中...');
		$.ajax({
			url: apiL+'/api/wx/address/delete',
			type: 'post',
			timeout : 10000,
			dataType: 'json',
			data: {type:2,id:id,userId:userId(),isDefault:0,requestTokenId:requestTokenId()},
			success:function(data){
				loadingRemove();
				if (data.success) {
					e.parents('.record_li').remove();
				}else{
					alert(data.message);
				};
			},
			complete : function(XMLHttpRequest,status){
				loadingRemove();
				if(status=='error'){
					fubottom('删除失败，请重试');
				}else if(status=='timeout'){
					fubottom('删除失败，请重试');
				}
	        }
		});
	},function(){
        return false;
    })
};
/*编辑发货列表地址获取*/
function selfConsignerEdit(id){
	/*$('.self_fa_book').remove();*/
	var html=template('self_fa_edit');
	$('body').append(html);
	$('.self_help_w').animate({right:0}, 300);
	$('.selfShipSubmit').attr('onclick', 'selfShipEditSubmit('+id+')');
	$('.tacitly_approve').html('<label><input type="checkbox" name="default"><span class="checkbox"></span><b id="">设为默认发货方</b></label>');
	loading('获取中...');
	$.ajax({
		url: apiL+'/api/wx/address/findedit',
		type: 'get',
		timeout : 10000,
		dataType: 'json',
		data: {type:1,id:id,requestTokenId:requestTokenId()},
		success:function(data){
			if (data.success) {
				var info=data.info;
				$('.consigner_t [name="client"]').val(info.company);
				$('.consigner_t [name="name"]').val(info.contact);
				$('.consigner_t [name="tel"]').val(info.phone);
				$('.consigner_t #addr_aera').html(info.proName+' '+info.cityName+' '+info.areaName).removeClass('c999');
				$('.consigner_t [name="aeraNum"]').val(info.proNumber+','+info.cityNumber+','+info.areaNumber);
				$('.consigner_t [name="detail"]').val(info.detailed);
				addr_aera2(info.proNumber,info.cityNumber,info.areaNumber);
				if (info.isDefault) {
					$('[name="default"]').attr('checked', 'checked');
				};
			}else{
				alert(data.message);
			};
		},
        complete : function(XMLHttpRequest,status){
            loadingRemove();
    　　　　if(status=='error'){
    			$.MsgBox.Alert("获取信息失败，请点击关闭重试",'好的');
    　　　　}else if(status=='timeout'){
    			$.MsgBox.Alert("获取信息失败，请点击关闭重试",'好的');
            }
    　　}
	});
}
/*编辑发货列表地址提交*/
function selfShipEditSubmit(id){
	if (!noNullfa($('[name="client"]'),'单位名称')) {
		noNullfa($('[name="client"]'),'单位名称');
		return false;
	}else if(!nameLen($('[name="name"]').val())){
		nameLen($('[name="name"]').val());
		return false;
	}else if(!telNo($('[name="tel"]'))){
		telNo($('[name="tel"]'))
		return false;
	}else if(!noNull($('[name="aeraNum"]'),'所在省、市、区')){
		noNull($('[name="aeraNum"]'),'所在省、市、区');
		return false;
	}else if(!noNullfa($('[name="detail"]'),'详细地址')){
		noNullfa($('[name="detail"]'),'详细地址');
		return false;
	}else{
		loading('获取中...');
		var company=trim($('[name="client"]').val());
		var contact=trim($('[name="name"]').val());
		var phone=trim($('[name="tel"]').val());
		var aera=$('#addr_aera').html();
		var aeraNum=$('[name="aeraNum"]').val();
		var detailed=trim($('[name="detail"]').val());
		var aeraArr=aera.split(' ');
		var aeraNumArr=aeraNum.split(',');
		var isDefault="";
		if ($('[name="default"]:checked').length>0) {
			isDefault=1;
		}else{
			isDefault=0;
		};
		AMap.service('AMap.Geocoder',function(){
		    var geocoder = new AMap.Geocoder({});
		    geocoder.getLocation(aeraArr[0]+""+aeraArr[1]+""+aeraArr[2]+""+detailed, function(status, result) {
		    	loadingRemove();
			    if (status === 'complete' && result.info === 'OK') {
			    	loading('获取中...');
			        var data={
						userId:userId(),
						type:1,
						id:id,
						company:company,
						contact:contact,
						phone:phone,
						proName:aeraArr[0],
						proNumber:aeraNumArr[0],
						cityName:aeraArr[1],
						cityNumber:aeraNumArr[1],
						areaName:aeraArr[2],
						areaNumber:aeraNumArr[2],
						detailed:detailed,
						lat:result.geocodes[0].location.lat,
						lng:result.geocodes[0].location.lng,
						isDefault:isDefault,
						requestTokenId:requestTokenId()
					}
					$.ajax({
						url: apiL+'/api/wx/address/edit',
						type: 'get',
						timeout : 10000,
						dataType: 'json',
						data: data,
						success:function(data){
							loadingRemove();
							if (data.success) {
								if ($('[name="senderAddId"]').val()==id) {
									if(Recdistinctive()){
										$.ajax({
											url: apiL+'/api/wx/address/findedit',
											type: 'get',
											timeout : 10000,
											dataType: 'json',
											data: {type:1,id:id,requestTokenId:requestTokenId()},
											success:function(data){
												if (data.success) {
													var info=data.info;
													$('[name="senderAddIsDf"]').val(info.isDefault);
													$('[name="senderName"]').val(info.company);
													$('[name="senderLinkman"]').val(info.contact);
													$('[name="senderMobile"]').val(info.phone);
													$('[name="senderProvinceName"]').val(info.proName);
													$('[name="senderCityName"]').val(info.cityName);
													$('[name="senderAreaName"]').val(info.areaName);
													$('[name="senderProvinceId"]').val(info.proNumber);
													$('[name="senderCityId"]').val(info.cityNumber);
													$('[name="senderAreaId"]').val(info.areaNumber);
													$('[name="senderAddress"]').val(info.detailed);
													var contact="";
													info.contact?contact=info.contact:contact='';
													var html='<p id="addr_consigner"> '+info.company+' <br> '+contact+' '+info.phone+'  <br>'+info.proName+' '+info.cityName+' '+info.areaName+' '+info.detailed+'</p>';
													$('.consigner_edit a').html(html);
													var receiverAreaId=$('[name="receiverAreaId"]').val();
													if (receiverAreaId) {
														if (bannce(info.cityNumber,info.areaNumber,receiverAreaId)) {
															setTimeout(function(){
																self_btn_show();
															}, 100);
														};
													};
													$('.self_fa_edit').remove();
												}else{
													alert(data.message);
												};
											},
									        complete : function(XMLHttpRequest,status){
									            loadingRemove();
									    　　　　if(status=='error'){
									     　　　　　 fubottom('保存失败，请重试');
									    　　　　}else if(status=='timeout'){
									                fubottom('保存失败，请重试');
									            }
									            return false;
									    　　}
										});
										$.ajax({
											url: apiL+'/api/wx/address/find',
											type: 'get',
											timeout : 10000,
											dataType: 'json',
											data: {userId:userId(),type:1,requestTokenId:requestTokenId()},
											success:function(data){
												if (data.success) {
													if (data.info.length) {
														selfshipAddr(data);
													}else{
														noshipsearch();
													};
												}else{
													alert(data.message)
												};
											},
									        complete : function(XMLHttpRequest,status){
									            loadingRemove();
									    　　　　if(status=='error'){
									    			noResultErr($('.record_list'),400,'获取列表失败，请点击重新获取','selfConsignerBookA()');
									    　　　　}else if(status=='timeout'){
									    			noResultErr($('.record_list'),400,'获取列表失败，请点击重新获取','selfConsignerBookA()');
									            }
									    　　}
										});
									}
								}else{
									$('.self_fa_edit').remove();
									$.ajax({
										url: apiL+'/api/wx/address/find',
										type: 'get',
										timeout : 10000,
										dataType: 'json',
										data: {userId:userId(),type:1,requestTokenId:requestTokenId()},
										success:function(data){
											if (data.success) {
												if (data.info.length) {
													selfshipAddr(data);
												}else{
													noshipsearch();
												};
											}else{
												alert(data.message)
											};
										},
								        complete : function(XMLHttpRequest,status){
								            loadingRemove();
								    　　　　if(status=='error'){
								    			noResultErr($('.record_list'),400,'获取列表失败，请点击重新获取','selfConsignerBookA()');
								    　　　　}else if(status=='timeout'){
								    			noResultErr($('.record_list'),400,'获取列表失败，请点击重新获取','selfConsignerBookA()');
								            }
								    　　}
									});
								}
								
							}else{
								alert(data.message);
							};
						},
				        complete : function(XMLHttpRequest,status){
							loadingRemove();
							if(status=='error'){
								fubottom('保存失败，请重试');
							}else if(status=='timeout'){
								fubottom('保存失败，请重试');
				            }
						}
					});
			    }else{
			        AMap.service('AMap.Geocoder',function(){//回调函数
					    //实例化Geocoder
					    var geocoder = new AMap.Geocoder({
					        // city: "010"//城市，默认：“全国”
					    });
					    geocoder.getLocation(aeraArr[0]+""+aeraArr[1]+""+aeraArr[2], function(status, result) {
					    	loadingRemove();
						    if (status === 'complete' && result.info === 'OK') {
						        loading('获取中...');
						        var data={
									userId:userId(),
									type:1,
									id:id,
									company:company,
									contact:contact,
									phone:phone,
									proName:aeraArr[0],
									proNumber:aeraNumArr[0],
									cityName:aeraArr[1],
									cityNumber:aeraNumArr[1],
									areaName:aeraArr[2],
									areaNumber:aeraNumArr[2],
									detailed:detailed,
									lat:result.geocodes[0].location.lat,
									lng:result.geocodes[0].location.lng,
									isDefault:isDefault,
									requestTokenId:requestTokenId()
								}
								$.ajax({
									url: apiL+'/api/wx/address/edit',
									type: 'get',
									timeout : 10000,
									dataType: 'json',
									data: data,
									success:function(data){
										loadingRemove();
										if (data.success) {
											if ($('[name="senderAddId"]').val()==id) {
												if(Recdistinctive()){
													$.ajax({
														url: apiL+'/api/wx/address/findedit',
														type: 'get',
														timeout : 10000,
														dataType: 'json',
														data: {type:1,id:id,requestTokenId:requestTokenId()},
														success:function(data){
															if (data.success) {
																var info=data.info;
																$('[name="senderAddIsDf"]').val(info.isDefault);
																$('[name="senderName"]').val(info.company);
																$('[name="senderLinkman"]').val(info.contact);
																$('[name="senderMobile"]').val(info.phone);
																$('[name="senderProvinceName"]').val(info.proName);
																$('[name="senderCityName"]').val(info.cityName);
																$('[name="senderAreaName"]').val(info.areaName);
																$('[name="senderProvinceId"]').val(info.proNumber);
																$('[name="senderCityId"]').val(info.cityNumber);
																$('[name="senderAreaId"]').val(info.areaNumber);
																$('[name="senderAddress"]').val(info.detailed);
																var contact="";
																info.contact?contact=info.contact:contact='';
																var html='<p id="addr_consigner"> '+info.company+' <br> '+contact+' '+info.phone+'  <br>'+info.proName+' '+info.cityName+' '+info.areaName+' '+info.detailed+'</p>';
																$('.consigner_edit a').html(html);
																var receiverAreaId=$('[name="receiverAreaId"]').val();
																if (receiverAreaId) {
																	if (bannce(info.cityNumber,info.areaNumber,receiverAreaId)) {
																		setTimeout(function(){
																			self_btn_show();
																		}, 100);
																	};
																};
																$('.self_fa_edit').remove();
															}else{
																alert(data.message);
															};
														},
												        complete : function(XMLHttpRequest,status){
												            loadingRemove();
												    　　　　if(status=='error'){
												     　　　　　 fubottom('保存失败，请重试');
												    　　　　}else if(status=='timeout'){
												                fubottom('保存失败，请重试');
												            }
												            return false;
												    　　}
													});
													$.ajax({
														url: apiL+'/api/wx/address/find',
														type: 'get',
														timeout : 10000,
														dataType: 'json',
														data: {userId:userId(),type:1,requestTokenId:requestTokenId()},
														success:function(data){
															if (data.success) {
																if (data.info.length) {
																	selfshipAddr(data);
																}else{
																	noshipsearch();
																};
															}else{
																alert(data.message)
															};
														},
												        complete : function(XMLHttpRequest,status){
												            loadingRemove();
												    　　　　if(status=='error'){
												    			noResultErr($('.record_list'),400,'获取列表失败，请点击重新获取','selfConsignerBookA()');
												    　　　　}else if(status=='timeout'){
												    			noResultErr($('.record_list'),400,'获取列表失败，请点击重新获取','selfConsignerBookA()');
												            }
												    　　}
													});
												}
											}else{
												$('.self_fa_edit').remove();
												$.ajax({
													url: apiL+'/api/wx/address/find',
													type: 'get',
													timeout : 10000,
													dataType: 'json',
													data: {userId:userId(),type:1,requestTokenId:requestTokenId()},
													success:function(data){
														if (data.success) {
															if (data.info.length) {
																selfshipAddr(data);
															}else{
																noshipsearch();
															};
														}else{
															alert(data.message)
														};
													},
											        complete : function(XMLHttpRequest,status){
											            loadingRemove();
											    　　　　if(status=='error'){
											    			noResultErr($('.record_list'),400,'获取列表失败，请点击重新获取','selfConsignerBookA()');
											    　　　　}else if(status=='timeout'){
											    			noResultErr($('.record_list'),400,'获取列表失败，请点击重新获取','selfConsignerBookA()');
											            }
											    　　}
												});
											}
											
										}else{
											alert(data.message);
										};
									},
							        complete : function(XMLHttpRequest,status){
										loadingRemove();
										if(status=='error'){
											fubottom('保存失败，请重试');
										}else if(status=='timeout'){
											fubottom('保存失败，请重试');
							            }
									}
								});
						    }else{
						        $.MsgBox.Alert("地址获取失败，请重试或修改地址后再试",'确定');
						    }
						});
					})
			    }
			});
		})
	}
}	
/*添加发货地址*/
function addFaEdit(){
	var html=template('self_fa_edit');
	$('body').append(html);
	$('.self_help_w').animate({right:0}, 300);
	/*$('.tacitly_approve').html('<label><input type="checkbox" name="default"><span class="checkbox"></span><b id="">设为默认收货方</b></label>')*/
	$('.selfShipSubmit').attr('onclick', 'selfAddShipSubmit()');
	addr_aera2();
}
/*添加发货地址列表提交*/
function selfAddShipSubmit(){
	if (!noNullfa($('[name="client"]'),'单位名称')) {
		noNullfa($('[name="client"]'),'单位名称');
		return false;
	}else if(!telNo($('[name="tel"]'))){
		telNo($('[name="tel"]'))
		return false;
	}else if(!noNull($('[name="aeraNum"]'),'所在省、市、区')){
		noNull($('[name="aeraNum"]'),'所在省、市、区');
		return false;
	}else if(!noNullfa($('[name="detail"]'),'详细地址')){
		noNullfa($('[name="detail"]'),'详细地址');
		return false;
	}else{
		loading('提交中...');
		var company=trim($('[name="client"]').val());
		var contact=trim($('[name="name"]').val());
		var phone=trim($('[name="tel"]').val());
		var aera=$('#addr_aera').html();
		var aeraNum=$('[name="aeraNum"]').val();
		var detailed=trim($('[name="detail"]').val());
		var aeraArr=aera.split(' ');
		var aeraNumArr=aeraNum.split(',');
		var isDefault=0;
		if ($('[name="default"]:checked').length>0) {
			isDefault=1;
		}else{
			isDefault=0;
		};
		AMap.service('AMap.Geocoder',function(){
		    var geocoder = new AMap.Geocoder({});
		    geocoder.getLocation(aeraArr[0]+""+aeraArr[1]+""+aeraArr[2]+""+detailed, function(status, result) {
		    	loadingRemove();
			    if (status === 'complete' && result.info === 'OK') {
			        loading('提交中...');
		    		var data={
						userId:userId(),
						type:1,
						company:company,
						contact:contact,
						phone:phone,
						proName:aeraArr[0],
						proNumber:aeraNumArr[0],
						cityName:aeraArr[1],
						cityNumber:aeraNumArr[1],
						areaName:aeraArr[2],
						areaNumber:aeraNumArr[2],
						detailed:detailed,
						lat:result.geocodes[0].location.lat,
						lng:result.geocodes[0].location.lng,
						isDefault:isDefault,
						requestTokenId:requestTokenId()
					};
					$.ajax({
						url: apiL+'/api/wx/address/add',
						type: 'get',
						timeout : 10000,
						dataType: 'json',
						data: data,
						success:function(data){
							loadingRemove();
							if (data.success) {
								$('.self_fa_edit').remove();
								$.ajax({
									url: apiL+'/api/wx/address/find',
									type: 'get',
									timeout : 10000,
									dataType: 'json',
									data: {userId:userId(),type:1,requestTokenId:requestTokenId()},
									success:function(data){
										if (data.success) {
											if (data.info.length) {
												selfshipAddr(data);
											}else{
												noshipsearch();
											};
										}else{
											alert(data.message)
										};
									},
							        complete : function(XMLHttpRequest,status){
							            loadingRemove();
							    　　　　if(status=='error'){
							    			noResultErr($('.record_list'),400,'获取列表失败，请点击重新获取','selfConsignerBookA()');
							    　　　　}else if(status=='timeout'){
							    			noResultErr($('.record_list'),400,'获取列表失败，请点击重新获取','selfConsignerBookA()');
							            }
							    　　}
								});
								/*selfConsignerBook();*/
							}else{
								alert(data.message);
							};
						},
				        complete : function(XMLHttpRequest,status){
							loadingRemove();
							if(status=='error'){
								fubottom('保存失败，请5秒后重试');
							}else if(status=='timeout'){
								fubottom('保存失败，请5秒后重试');
				            }
						}
					});
			    }else{
			        AMap.service('AMap.Geocoder',function(){//回调函数
					    //实例化Geocoder
					    var geocoder = new AMap.Geocoder({
					        // city: "010"//城市，默认：“全国”
					    });
					    geocoder.getLocation(aeraArr[0]+""+aeraArr[1]+""+aeraArr[2], function(status, result) {
					    	loadingRemove();
						    if (status === 'complete' && result.info === 'OK') {
						        loading('提交中...');
					    		var data={
									userId:userId(),
									type:1,
									company:company,
									contact:contact,
									phone:phone,
									proName:aeraArr[0],
									proNumber:aeraNumArr[0],
									cityName:aeraArr[1],
									cityNumber:aeraNumArr[1],
									areaName:aeraArr[2],
									areaNumber:aeraNumArr[2],
									detailed:detailed,
									lat:result.geocodes[0].location.lat,
									lng:result.geocodes[0].location.lng,
									isDefault:isDefault,
									requestTokenId:requestTokenId()
								};
								$.ajax({
									url: apiL+'/api/wx/address/add',
									type: 'get',
									timeout : 10000,
									dataType: 'json',
									data: data,
									success:function(data){
										loadingRemove();
										if (data.success) {
											$('.self_fa_edit').remove();
											$.ajax({
												url: apiL+'/api/wx/address/find',
												type: 'get',
												timeout : 10000,
												dataType: 'json',
												data: {userId:userId(),type:1,requestTokenId:requestTokenId()},
												success:function(data){
													if (data.success) {
														if (data.info.length) {
															selfshipAddr(data);
														}else{
															noshipsearch();
														};
													}else{
														alert(data.message)
													};
												},
										        complete : function(XMLHttpRequest,status){
										            loadingRemove();
										    　　　　if(status=='error'){
										    			noResultErr($('.record_list'),400,'获取列表失败，请点击重新获取','selfConsignerBookA()');
										    　　　　}else if(status=='timeout'){
										    			noResultErr($('.record_list'),400,'获取列表失败，请点击重新获取','selfConsignerBookA()');
										            }
										    　　}
											});
											/*selfConsignerBook();*/
										}else{
											alert(data.message);
										};
									},
							        complete : function(XMLHttpRequest,status){
										loadingRemove();
										if(status=='error'){
											fubottom('保存失败，请5秒后重试');
										}else if(status=='timeout'){
											fubottom('保存失败，请5秒后重试');
							            }
									}
								});
						    }else{
						    	$.MsgBox.Alert("地址获取失败，请重试或修改地址后再试",'确定');
						    }
						});
					})
			    }
			});
		})
		
		$('.selfShipSubmit').attr('disabled', 'disabled').css('background', '#999');
		setTimeout(function(){
			$('.selfShipSubmit').removeAttr('disabled').css('background', '#52BB03');
		}, 5000);

	}
}
/*收货方地址列表*/
function selfDeliveryBook(){
	var html=template('self_shou_book');
	$('body').append(html);
	$('.self_help_w').animate({right:0}, 300);
	if (userId()) {
		selfDeliveryBookA();
	}else{
		document.write('请求失败,请返回公众号重新进入');
	};
}

function selfDeliveryBookA(){
	loading('loading...');
	$.ajax({
		url: apiL+'/api/wx/address/find',
		type: 'get',
		timeout : 10000,
		dataType: 'json',
		data: {userId:userId(),type:2,requestTokenId:requestTokenId()},
		success:function(data){
			if (data.success) {
				if (data.info.length) {
					selfReceAddr(data);
				}else{
					noshipsearch();
				};
			}else{
				alert(data.message);
			};
		},
        complete : function(XMLHttpRequest,status){
            loadingRemove();
    　　　　if(status=='error'){
     　　　　　 noResultErr($('.record_list'),400,'请求超时，请点击重新获取','selfDeliveryBookA()');
    　　　　}else if(status=='timeout'){
                noResultErr($('.record_list'),400,'请求超时，请点击重新获取','selfDeliveryBookA()');
            }
    　　}
	});
}


/*收货地址搜索（自助下单）*/
function selfAddrShouSearch(){
	var search=$('.search_input').val();
	loading('loading...');
	if (search){
		var data={
			userId:userId(),
			type:2,
			searchParam:search,
			requestTokenId:requestTokenId()
		};
		$.ajax({
			url: api+'/api/wx/address/find',
			type: 'get',
			timeout : 10000,
			dataType: 'json',
			data: data,
			success:function(data){
				loadingRemove();
				if (data.success) {
					if (data.info.length) {
						selfReceAddr(data);
					}else{
						noshipsearch(search);
					};
				}else{
					alert(data.message);
				};
			},
	        complete : function(XMLHttpRequest,status){
	            loadingRemove();
	    　　　　if(status=='error'){
	    			noResultErr($('.record_list'),400,'获取列表失败，请点击重新获取','selfAddrShouSearch()');
	    　　　　}else if(status=='timeout'){
	    			noResultErr($('.record_list'),400,'获取列表失败，请点击重新获取','selfAddrShouSearch()');
	            }
	    　　}
		});
	}else{
		$.ajax({
			url: apiL+'/api/wx/address/find',
			type: 'get',
			timeout : 10000,
			dataType: 'json',
			data: {userId:userId(),type:2,requestTokenId:requestTokenId()},
			success:function(data){
				loadingRemove();
				if (data.success) {
					if (data.info.length) {
						selfReceAddr(data);
					}else{
						noshipsearch();
					}
				}else{
					alert(data.message);
				};
			},
	        complete : function(XMLHttpRequest,status){
	            loadingRemove();
	    　　　　if(status=='error'){
	    			noResultErr($('.record_list'),400,'获取列表失败，请点击重新获取','selfAddrShouSearch()');
	    　　　　}else if(status=='timeout'){
	    			noResultErr($('.record_list'),400,'获取列表失败，请点击重新获取','selfAddrShouSearch()');
	            }
	    　　}
		});
	};
}

/*收货地址内容（自助下单）*/
function selfReceAddr(data){
	var html="";
	for (var i = 0; i < data.info.length; i++) {
		html+='<div class="record_li ship_li" data-id="'+data.info[i].id+'">'
			+'<table width="w100" onclick=recTrue("'+data.info[i].id+'")>'
				+'<tr><td>收&nbsp; 货 方：'+data.info[i].company+'</td></tr>'
				if (data.info[i].contact) {
					html+='<tr><td colspan="2">联&nbsp; 系 人：'+data.info[i].contact+'</td></tr>'
				};
				html+='<tr><td colspan="2">电&#x3000;&#x3000;话：'+data.info[i].phone+'<br></td></tr>'
				+'<tr><td colspan="2">收货地址：'+data.info[i].proName+''+data.info[i].cityName+''+data.info[i].areaName+''+data.info[i].detailed+'<br></td></tr>'
			+'</table>'
			+'<div class="show_details ov_h">'
				+'<a class="f_r f14" href="javascript:;" onclick="del_rec($(this),'+data.info[i].id+')">删除</a>'
				+'<a class="f_r f14" onclick="selfrecrivingEdit('+data.info[i].id+')" href="javascript:;">编辑</a>'
			+'</div>'
		+'</div>'
	};
	$('.record_list').html(html);
}

/*编辑收货列表地址获取*/
function selfrecrivingEdit(id){
	/*$('.self_shou_book').remove();*/
	var html=template('self_shou_edit');
	$('body').append(html);
	$('.self_help_w').animate({right:0}, 300);
	/*$('.tacitly_approve').remove();*/
	$('.selfRedSubmit').attr('onclick', 'selfRedEditSubmit('+id+')');
	$.ajax({
		url: apiL+'/api/wx/address/findedit',
		type: 'get',
		timeout : 10000,
		dataType: 'json',
		data: {type:2,id:id,requestTokenId:requestTokenId()},
		success:function(data){
			if (data.success) {
				var info=data.info;
				// console.log(info)
				$('.consigner_t [name="client"]').val(info.company);
				$('.consigner_t [name="name"]').val(info.contact);
				$('.consigner_t [name="tel"]').val(info.phone);
				$('.consigner_t #addr_aera').html(info.proName+' '+info.cityName+' '+info.areaName).removeClass('c999');
				$('.consigner_t [name="aeraNum"]').val(info.proNumber+','+info.cityNumber+','+info.areaNumber);
				$('.consigner_t [name="detail"]').val(info.detailed);
				addr_aera2(info.proNumber,info.cityNumber,info.areaNumber);
			}else{
				alert(data.message);
			};
		},
        complete : function(XMLHttpRequest,status){
            loadingRemove();
    　　　　if(status=='error'){
    			$.MsgBox.Alert("获取信息失败，请点击关闭重试",'好的');
    　　　　}else if(status=='timeout'){
    			$.MsgBox.Alert("获取信息失败，请点击关闭重试",'好的');
            }
    　　}
	});
	
}
/*编辑收货列表地址提交*/
function selfRedEditSubmit(id){
	if (!noNullfa($('[name="client"]'),'单位名称')) {
		noNullfa($('[name="client"]'),'单位名称');
		return false;
	}else if(!nameLen($('[name="name"]').val())){
		nameLen($('[name="name"]').val());
		return false;
	}else if(!telNo($('[name="tel"]'))){
		telNo($('[name="tel"]'));
		return false;
	}else if(!noNull($('[name="aeraNum"]'),'所在省、市、区')){
		noNull($('[name="aeraNum"]'),'所在省、市、区');
		return false;
	}else if(!noNullfa($('[name="detail"]'),'详细地址')){
		noNullfa($('[name="detail"]'),'详细地址');
		return false;
	}else{
		loading('提交中...');
		var company=trim($('[name="client"]').val());
		var contact=trim($('[name="name"]').val());
		var phone=trim($('[name="tel"]').val());
		var aera=$('#addr_aera').html();
		var aeraNum=$('[name="aeraNum"]').val();
		var detailed=trim($('[name="detail"]').val());
		var aeraArr=aera.split(' ');
		var aeraNumArr=aeraNum.split(',');

		AMap.service('AMap.Geocoder',function(){
		    var geocoder = new AMap.Geocoder({});
		    geocoder.getLocation(aeraArr[0]+""+aeraArr[1]+""+aeraArr[2]+""+detailed, function(status, result) {
		    	loadingRemove();
			    if (status === 'complete' && result.info === 'OK') {
			        loading('提交中...');
		    		var data={
						userId:userId(),
						type:2,
						id:id,
						company:company,
						contact:contact,
						phone:phone,
						proName:aeraArr[0],
						proNumber:aeraNumArr[0],
						cityName:aeraArr[1],
						cityNumber:aeraNumArr[1],
						areaName:aeraArr[2],
						areaNumber:aeraNumArr[2],
						detailed:detailed,
						lat:result.geocodes[0].location.lat,
						lng:result.geocodes[0].location.lng,
						isDefault:0,
						requestTokenId:requestTokenId()
					}
					$.ajax({
						url: apiL+'/api/wx/address/edit',
						type: 'get',
						timeout : 10000,
						dataType: 'json',
						data: data,
						success:function(data){
							loadingRemove();
							if (data.success) {
								$('.self_shou_edit').remove();
								/*selfDeliveryBook();*/
								$.ajax({
									url: apiL+'/api/wx/address/find',
									type: 'get',
									timeout : 10000,
									dataType: 'json',
									data: {userId:userId(),type:2,requestTokenId:requestTokenId()},
									success:function(data){
										if (data.success) {
											if (data.info.length) {
												selfReceAddr(data);
											}else{
												noshipsearch();
											};
										}else{
											alert(data.message);
										};
									},
							        complete : function(XMLHttpRequest,status){
							            loadingRemove();
							    　　　　if(status=='error'){
							     　　　　　 noResultErr($('.record_list'),400,'请求超时，请点击重新获取','selfDeliveryBookA()');
							    　　　　}else if(status=='timeout'){
							                noResultErr($('.record_list'),400,'请求超时，请点击重新获取','selfDeliveryBookA()');
							            }
							    　　}
								});
							}else{
								alert(data.message)
							};
						},
				        complete : function(XMLHttpRequest,status){
				            loadingRemove();
							if(status=='error'){
								fubottom('保存失败，请重试');
							}else if(status=='timeout'){
								fubottom('保存失败，请重试');
							}
							return false;
						}
					});
			    }else{
			        AMap.service('AMap.Geocoder',function(){//回调函数
					    //实例化Geocoder
					    var geocoder = new AMap.Geocoder({
					        // city: "010"//城市，默认：“全国”
					    });
					    geocoder.getLocation(aeraArr[0]+""+aeraArr[1]+""+aeraArr[2], function(status, result) {
					    	loadingRemove();
						    if (status === 'complete' && result.info === 'OK') {
						        loading('提交中...');
					    		var data={
									userId:userId(),
									type:2,
									id:id,
									company:company,
									contact:contact,
									phone:phone,
									proName:aeraArr[0],
									proNumber:aeraNumArr[0],
									cityName:aeraArr[1],
									cityNumber:aeraNumArr[1],
									areaName:aeraArr[2],
									areaNumber:aeraNumArr[2],
									detailed:detailed,
									lat:result.geocodes[0].location.lat,
									lng:result.geocodes[0].location.lng,
									isDefault:0,
									requestTokenId:requestTokenId()
								}
								$.ajax({
									url: apiL+'/api/wx/address/edit',
									type: 'get',
									timeout : 10000,
									dataType: 'json',
									data: data,
									success:function(data){
										loadingRemove();
										if (data.success) {
											$('.self_shou_edit').remove();
											$.ajax({
												url: apiL+'/api/wx/address/find',
												type: 'get',
												timeout : 10000,
												dataType: 'json',
												data: {userId:userId(),type:2,requestTokenId:requestTokenId()},
												success:function(data){
													if (data.success) {
														if (data.info.length) {
															selfReceAddr(data);
														}else{
															noshipsearch();
														};
													}else{
														alert(data.message);
													};
												},
										        complete : function(XMLHttpRequest,status){
										            loadingRemove();
										    　　　　if(status=='error'){
										     　　　　　 noResultErr($('.record_list'),400,'请求超时，请点击重新获取','selfDeliveryBookA()');
										    　　　　}else if(status=='timeout'){
										                noResultErr($('.record_list'),400,'请求超时，请点击重新获取','selfDeliveryBookA()');
										            }
										    　　}
											});
										}else{
											alert(data.message)
										};
									},
							        complete : function(XMLHttpRequest,status){
							            loadingRemove();
										if(status=='error'){
											fubottom('保存失败，请重试');
										}else if(status=='timeout'){
											fubottom('保存失败，请重试');
										}
										return false;
									}
								});
						    }else{
						        $.MsgBox.Alert("地址获取失败，请重试或修改地址后再试",'确定');
						    }
						});
					})
			    }
			});
		})
	}
}
/*添加收货地址*/
function addshouEdit(){
	/*$('.self_shou_book').remove();*/
	var html=template('self_shou_edit');
	$('body').append(html);
	$('.self_help_w').animate({right:0}, 300);
	$('[name="addBook"]').attr('checked', 'checked');
	$('.selfRedSubmit').attr('onclick', 'selfAddRedSubmit()');
	addr_aera2();
}

/*添加收货地址列表提交*/
function selfAddRedSubmit(){
	if (!noNullfa($('[name="client"]'),'单位名称')) {
		noNullfa($('[name="client"]'),'单位名称');
		return false;
	}else if(!telNo($('[name="tel"]'))){
		telNo($('[name="tel"]'))
		return false;
	}else if(!noNull($('[name="aeraNum"]'),'所在省、市、区')){
		noNull($('[name="aeraNum"]'),'所在省、市、区');
		return false;
	}else if(!noNullfa($('[name="detail"]'),'详细地址')){
		noNullfa($('[name="detail"]'),'详细地址');
		return false;
	}else{
		loading('提交中...');
		var company=trim($('[name="client"]').val());
		var contact=trim($('[name="name"]').val());
		var phone=trim($('[name="tel"]').val());
		var aera=$('#addr_aera').html();
		var aeraNum=$('[name="aeraNum"]').val();
		var detailed=trim($('[name="detail"]').val());
		var aeraArr=aera.split(' ');
		var aeraNumArr=aeraNum.split(',');
		AMap.service('AMap.Geocoder',function(){
		    var geocoder = new AMap.Geocoder({});
		    geocoder.getLocation(aeraArr[0]+""+aeraArr[1]+""+aeraArr[2]+""+detailed, function(status, result) {
		    	loadingRemove();
			    if (status === 'complete' && result.info === 'OK') {
			    	loading('提交中...');
		    		var data={
						userId:userId(),
						type:2,
						company:company,
						contact:contact,
						phone:phone,
						proName:aeraArr[0],
						proNumber:aeraNumArr[0],
						cityName:aeraArr[1],
						cityNumber:aeraNumArr[1],
						areaName:aeraArr[2],
						areaNumber:aeraNumArr[2],
						detailed:detailed,
						lat:result.geocodes[0].location.lat,
						lng:result.geocodes[0].location.lng,
						isDefault:0,
						requestTokenId:requestTokenId()
					};
					// console.log(data)
					$.ajax({
						url: apiL+'/api/wx/address/add',
						type: 'post',
						timeout : 10000,
						dataType: 'json',
						data: data,
						success:function(data){
							loadingRemove();
							if (data.success) {
								$('.self_shou_edit').remove();
								$.ajax({
									url: apiL+'/api/wx/address/find',
									type: 'get',
									timeout : 10000,
									dataType: 'json',
									data: {userId:userId(),type:2,requestTokenId:requestTokenId()},
									success:function(data){
										if (data.success) {
											if (data.info.length) {
												selfReceAddr(data);
											}else{
												noshipsearch();
											};
										}else{
											alert(data.message);
										};
									},
							        complete : function(XMLHttpRequest,status){
										loadingRemove();
										if(status=='error'){
											noResultErr($('.record_list'),400,'请求超时，请点击重新获取','selfDeliveryBookA()');
										}else if(status=='timeout'){
											noResultErr($('.record_list'),400,'请求超时，请点击重新获取','selfDeliveryBookA()');
										}
									}
								});
							}else{
								alert(data.message);
							};
						},
				        complete : function(XMLHttpRequest,status){
							loadingRemove();
							if(status=='error'){
								fubottom('保存失败，请5秒后重试');
							}else if(status=='timeout'){
								fubottom('保存失败，请5秒后重试');
				            }
						}
					});
			    }else{
			        AMap.service('AMap.Geocoder',function(){//回调函数
					    //实例化Geocoder
					    var geocoder = new AMap.Geocoder({
					        // city: "010"//城市，默认：“全国”
					    });
					    geocoder.getLocation(aeraArr[0]+""+aeraArr[1]+""+aeraArr[2], function(status, result) {
					    	loadingRemove();
						    if (status === 'complete' && result.info === 'OK') {
						    	loading('提交中...');
					    		var data={
									userId:userId(),
									type:2,
									company:company,
									contact:contact,
									phone:phone,
									proName:aeraArr[0],
									proNumber:aeraNumArr[0],
									cityName:aeraArr[1],
									cityNumber:aeraNumArr[1],
									areaName:aeraArr[2],
									areaNumber:aeraNumArr[2],
									detailed:detailed,
									lat:result.geocodes[0].location.lat,
									lng:result.geocodes[0].location.lng,
									isDefault:0,
									requestTokenId:requestTokenId()
								};
								// console.log(data)
								$.ajax({
									url: apiL+'/api/wx/address/add',
									type: 'post',
									timeout : 10000,
									dataType: 'json',
									data: data,
									success:function(data){
										loadingRemove();
										if (data.success) {
											$('.self_shou_edit').remove();
											$.ajax({
												url: apiL+'/api/wx/address/find',
												type: 'get',
												timeout : 10000,
												dataType: 'json',
												data: {userId:userId(),type:2,requestTokenId:requestTokenId()},
												success:function(data){
													if (data.success) {
														if (data.info.length) {
															selfReceAddr(data);
														}else{
															noshipsearch();
														};
													}else{
														alert(data.message);
													};
												},
										        complete : function(XMLHttpRequest,status){
													loadingRemove();
													if(status=='error'){
														noResultErr($('.record_list'),400,'请求超时，请点击重新获取','selfDeliveryBookA()');
													}else if(status=='timeout'){
														noResultErr($('.record_list'),400,'请求超时，请点击重新获取','selfDeliveryBookA()');
													}
												}
											});
										}else{
											alert(data.message);
										};
									},
							        complete : function(XMLHttpRequest,status){
										loadingRemove();
										if(status=='error'){
											fubottom('保存失败，请5秒后重试');
										}else if(status=='timeout'){
											fubottom('保存失败，请5秒后重试');
							            }
									}
								});
						    }else{
						        $.MsgBox.Alert("地址获取失败，请重试或修改地址后再试",'确定');
						    }
						});
					})
			    }
			});
		})

		$('.selfRedSubmit').attr('disabled', 'disabled').css('background', '#999');
		setTimeout(function(){
			$('.selfRedSubmit').removeAttr('disabled').css('background', '#52BB03');
		}, 5000);

	}
}

function senddistinctive(){
	var companyName=$('[name="client"]').val();
	var phone=$('[name="tel"]').val();
	if (companyName==$('[name="senderName"]').val()) { 
		loadingRemove();
		$.MsgBox.Alert("收货方与发货方单位名称不能相同",'确定');
		return false;
	};
	/*if (phone==$('[name="senderMobile"]').val()) {
		loadingRemove();
		$.MsgBox.Alert("收货方电话不能与发货方电话相同",'确定');
		return false;
	};*/
	return true;
}

function Recdistinctive(){
	var companyName=$('[name="client"]').val();
	var phone=$('[name="tel"]').val();
	if (companyName==$('[name="receiverName"]').val()) {
		loadingRemove();
		$.MsgBox.Alert("发货方与收货方单位名称不能相同",'确定');
		return false;
	};
	/*if (phone==$('[name="receiverMobile"]').val()) {
		loadingRemove();
		$.MsgBox.Alert("发货方电话不能与收货方电话相同",'确定');
		return false;
	};*/
	return true;
}

function sendKeysEnt(){
	if (event.keyCode==13){
		$('.search_input').blur();
		selfAddrsearch()
	}
}
function recKeysEnt(){
	if (event.keyCode==13){
		$('.search_input').blur();
		selfAddrShouSearch();
	}
}

function popping(value){
	if (value.length==0) {
		$('.shouTelSearchBg,.shouTelSearch').css('display', 'block');
		$('.searchTel').focus();
	};
}
function shouTelClose(){
	$('.searchTel').val('');
	$('.shouTelSearchBg,.shouTelSearch').css('display', 'none');
}
// 收货筛选
function shouTelSearch(){
	if (telNo($('[name="tel"]'))) {
		loading('搜索中...');
		var tel=$('[name="tel"]').val();
		var base = new Base64();
		var result = base.decode(sess.info);
		var json=JSON.parse(result);
		/*var cityId=json.cityNumber;
		var areaId=json.areaNumber;*/
		var cityId=$('[name="senderCityId"]').val();
		var areaId=$('[name="senderAreaId"]').val();
		if (cityId) {
			$.ajax({
				url: apiAnY+'/api/wx/guest/list/search',
				type: 'get',
				timeout : 10000,
				dataType: 'json',
				data: {tel:tel,areaId:areaId,cityId:cityId,requestTokenId:requestTokenId()},
				success:function(data){
					loadingRemove();
					if (data.success) {
						var info=data.info;
						// console.log(data);
						if (info instanceof Array) {
							if (info.length==0) {
								$.MsgBox.Alert("未检索到收货方信息<br/>您可修改电话重新搜索，或者直接填写收货方信息",'我知道了');
							}else{
								var html=template('self_shou_list',data);
								$('body').append(html);
							$('.self_help_w').animate({right:0}, 300);
								$('.findNum span').html(info.length);
							};
						}else{
							$.MsgBox.Alert("未检索到收货方信息<br/>您可修改电话重新搜索，或者直接填写收货方信息",'我知道了');
						};
					}else{
						alert(data.message)
					};
				},
		        complete : function(XMLHttpRequest,status){
					loadingRemove();
					if(status=='error'){
						fubottom('请求超时，请重试');
		    　　　　}else if(status=='timeout'){
						fubottom('请求超时，请重试');
					}
				}
			});
		}else{
			loadingRemove();
			$.MsgBox.Alert("请先填写发货方信息！",'我知道了');
		};
		
	};
}
function clientele(data){
	$('.self_shou_add').remove();
	var html=template('self_shou_add');
	$('body').append(html);
	$('.self_help_w').css('right', '0');
	$('.consigner_t [name="client"]').val(data.guestName);
	$('.consigner_t [name="name"]').val(data.linkman);
	$('.consigner_t [name="tel"]').val(data.tel);
	$('.consigner_t #addr_aera').html(data.provinceName+' '+data.cityName+' '+data.areaName).removeClass('c999');
	$('.consigner_t [name="aeraNum"]').val(data.provinceId+','+data.cityId+','+data.areaId);
	$('.consigner_t [name="detail"]').val(data.address);
	$('.consigner_t [name="registerTelLin"]').val(data.registerMobile);
	$('.consigner_t [name="registerConLin"]').val(data.guestName);
	$('.consigner_t [name="receiverIdLin"]').val(data.receiverId);
	$('.self_shou_list').remove();
	addr_aera2(data.provinceId,data.cityId,data.areaId);
}
