'use strict';
function mount_hint(){
	var html='<div id="mb_box" style="width: 100%; height: 100%; z-index: 99999; position: fixed; background-color: black; top: 0px; left: 0px; opacity: 0.6;"></div><div id="mb_con" style="z-index: 999999; width: 80%; position: fixed; background-color: white; top: 50%; left: 36px;margin-top:-1.5rem;"><div id="mb_msg2" style="padding: 20px; line-height: 20px; border-bottom: 1px solid rgb(226, 226, 226);"><p style="margin-bottom:0.1rem;">1、可提现金额：可通过“提现”功能，提现到银行卡的金额。</p><p style="margin-bottom:0.1rem;">2、保护期金额：订单已签收，系统分账金额等待银行结算中，结算后即成为可用金额</p><p>3、总金额：可提现金额+保护期金额=总金额</p></div><div id="mb_btnbox" style="text-align: center;"><input id="mb_btn_ok_a" type="button" value="我知道了" style="width: 100%; height: 50px; color: rgb(126, 211, 33); border: none; float: left;"onclick="$(\'#mb_box,#mb_con\').remove()"></div></div>';
	$('body').append(html);
}

function accountAcc(){
	loading('加载中...');
	$.ajax({
		url: api+'/api/wx/account/bank/list',
		type: 'POST',
		dataType: 'json',
		data: {account:account(),requestTokenId:requestTokenId()},
		success:function(data){
			loadingRemove();
			// console.log(data);
			accountClose();
			if (data.success) {
				if (data.info!=null) {
					// 可提现金额
					$('#extractAmount').html(toDecimal2(data.info.extractAmount));
					// 保护期余额
					$('#guardAmount').html(toDecimal2(data.info.guardAmount));
					// 总金额
					$('#sumAmount').html(toDecimal2(data.info.sumAmount));
					if (data.info.bankNo==null) {
						$('#myBindBand').attr('href', '../ucenter/tel_code.html').append('<b class="red">未绑定</b>')
					}else{
						$('#myBindBand').attr('href', '../ucenter/tel_code.html').append('<b class="green">已绑定</b>')
						$('#myBindBand').attr('href', '../ucenter/bank_card.html');
						if (data.info.password) {
							var html='<li class="my_ac_ka"><a href="../ucenter/pay_psw.html"><p><span>安全密码</span> <br>用于提现转账安全验证</p><b class="green">已设置</b></a></li>';
							$('.my_account').append(html);
						};
					};
				}
			}else{
				alert(data.message);
			};
		},
        complete : function(XMLHttpRequest,status){
            loadingRemove();
    　　　　if(status=='error'){
     　　　　　 $.MsgBox.Confirmt("请求超时，获取账户失败，</br>重新获取或跳到上一页",'重新获取','上一页',function(){
					window.location.href='ucenter.html';
			    },function(){
			        accountAcc();
			    });
    　　　　}else if(status=='timeout'){
     　　　　　 $.MsgBox.Confirmt("请求超时，获取账户失败，</br>重新获取或跳到上一页",'重新获取','上一页',function(){
					window.location.href='ucenter.html';
			    },function(){
			        accountAcc();
			    });
            }
    　　}
	});
}
/*账号冻结提示*/
function accountClose(){
	$.ajax({
		url: apiL+'/api/wx/login/finduser',
		type: 'post',
		dataType: 'json',
		data: {id:userId(),requestTokenId:requestTokenId()},
		success:function(data){
			if (data.success) {
				// console.log(data.info);
				if (data.info.accountState==1) {
					var html='<div class="act_remind"><a href="javascript:;" onclick="$.MsgBox.Alert(\'您的账户已冻结</br>冻结原因：'+data.info.accountFreezeReason+'</br>如有疑问，联系客服：<a class=blue href=tel:4000000120>4000001200</a>\',\'确定\')">您的账号已被冻结，冻结原因：'+data.info.accountFreezeReason+'</a></div>';
					$('#act_remind_w').html(html);
				};
			}else{
				alert(data.message);
			};
		}
	});
}


/*打开提现页面*/
function withdraw(){
	$.ajax({
		url: api+'/api/wx/account/bank/list',
		type: 'POST',
		dataType: 'json',
		data: {account:account(),requestTokenId:requestTokenId()},
		success:function(data){
			// console.log(data);
			if (data.success) {
				if (data.info.bankNo==null) {
					$.MsgBox.Confirmt("您还未添加银行卡，前往设置",'去设置','取消',
						function(){
							
						}, function(){
							window.location.href='../ucenter/tel_code.html';
						});
				}else{
					window.location.href="../ucenter/withdraw.html";
				};
			}else{
				alert(data.message);
			};
		}
	});
}

/*验证价格不大于五位数*/
function isverify(verify) {
	var pattern = /^\d{1,8}(\.\d{1,2})?$/;
 	return pattern.test(verify);
} 
/*提现显示输入安全密码*/
function passwordOpen(){
	var amount=$('[name="amount"]').val();
	var keyongAmount=parseFloat($('#extractAmount').html());
	if (!amount) {
		// console.log(amount);
		alert('请输入正确的提现金额');
	}else{
		if (!isverify(amount)) {
			alert('请输入正确的价格,小数点后不大于两位数');
		}else{
			loading('loading...');
			$.ajax({
				url: api+'/api/wx/login/finduser',
				type: 'POST',
				dataType: 'json',
				data: {id:userId(),requestTokenId:requestTokenId()},
				success:function(data){
					loadingRemove();
					// console.log(data);
					if (data.success) {
						if (data.info.accountState==1) {
							$('#mb_box,#mb_con').remove();
							$.MsgBox.Confirmt("对不起，您的账户已被冻结，冻结原因："+data.info.accountFreezeReason+"，如有疑问，请联系客服：4001-821200",'拨打电话','关闭',function(){
							return false;
						    },function(){
						       	window.location.href='tel:4001821200';
						    });
							return false;
						}else{
							loading('loading...');
							$.ajax({
								url: api+'/api/wx/account/findpoundage',
								type: 'POST',
								data: {requestTokenId:requestTokenId()},
								dataType: 'json',
								success:function(data){
									loadingRemove();
									if (data.success) {
										if (data.info!=null) {
											if (amount>=data.info.takeMaxMoney) {
												alert('每笔最大提现金额需小于'+data.info.takeMaxMoney+'元');
											}else if(amount<=data.info.takePoundageMoney){
												if (amount==0) {
													alert('提现金额必须大于0哦~');
												}else{
													alert('提现金额必须大于手续费哦~');
												};
											}else if(amount>keyongAmount){
												alert('提现金额不得大于可用余额');
											}else{
												$('.receive_pop_w').css('display', 'block');
											};
										}else{
											if(amount>keyongAmount){
												alert('提现金额不得大于可用余额');
											}else{
												$('.receive_pop_w').css('display', 'block');
											};
										};
									}else{
										alert(data.message);
									};
								}
							});
						};
					}else{
						alert(data.message);
					};
				}
			});
		};
	};
}

function Bandname(value){
	if (value) {
		if (!hanEng(value)) {
			$('.msg').html('<span class="red">开户人姓名只能中英文</span>');
			return false;
		}else{
			if (value.length<2||value.length>20) {
				$('.msg').html('<span class="red">开户人姓名需输入2-20个字</span>');
				return false;
			}else{
				$('.msg').html('');
				return true;
			};
		};
	}else{
		$('.msg').html('');
		return true;
	};
}

/*显示账单筛选*/
function billFilt(){
	$('.supernatant_w').fadeIn();
	$('.supernatant_r').animate({right: 0}, 300);
}
/*账单返回*/
function billFiltBack(){
	$('.supernatant_w').fadeOut();
	$('.supernatant_r').animate({right: '-90%'}, 300);
}
// 账单列表筛选重置
function billFiltReset(){
	$('[name="type"]').removeAttr('checked');
	$('[name="time"]').val('');
}
// 添加银行卡提交验证码
function codeSubmit(){
	var code=$('[name="code"]');
	if (!verify(code)) {
		verify(code);
	}else{
		loading('提交中');
		var codeVal=code.val();
		if (!GetQueryString('find')) {
			$.ajax({
				url: api+'/api/wx/account/findverificationbycode',
				type: 'POST',
				dataType: 'json',
				data: {code:codeVal,userName:userName(),type:2,requestTokenId:requestTokenId()},
				success:function(data){
					// console.log(data);
					if (data.success) {
						window.location.href='../ucenter/bank_bind.html';
					}else{
						alert(data.message);
					};
				},
		        complete : function(XMLHttpRequest,status){
		            loadingRemove();
		    　　　　if(status=='error'){
		    			fubottom('提交失败，请重试');
		    　　　　}else if(status=='timeout'){
		    			fubottom('提交失败，请重试');
		            }
		    　　}
			});
		}else{
			$.ajax({
				url: api+'/api/wx/account/findverificationbycode',
				type: 'POST',
				dataType: 'json',
				data: {code:codeVal,userName:userName(),type:3,requestTokenId:requestTokenId()},
				success:function(data){
					// console.log(data);
					if (data.success) {
						window.location.href='../ucenter/psw_find.html?edit=1';
					}else{
						alert(data.message);
					};
				},
		        complete : function(XMLHttpRequest,status){
		            loadingRemove();
		    　　　　if(status=='error'){
		    			fubottom('提交失败，请重试');
		    　　　　}else if(status=='timeout'){
		    			fubottom('提交失败，请重试');
		            }
		    　　}
			});
		};
		
	};
}

function creditCardVerify(verify){
	var pattern = /^\d{16,19}$/;
	return pattern.test(verify);
}
function creditCard(e){
	var val=e.val();
	if (!val) {
		$('.msg').html('<span class="red">请输入正确的银行卡号</span>');
		return false;
	}else if(!creditCardVerify(val)){
		$('.msg').html('<span class="red">请输入正确的银行卡号</span>');
		return false;
	}else{
		$('.msg').html('');
		return true;
	};
}
/*判断银行卡类型*/
function bankCardType(text){
	if (text.length==16) {
		creditCard($('[name="bankCard"]'));
		$.ajax({
			url: api+'/api/wx/account/ownedbank/list',
			type: 'POST',
			dataType: 'json',
			data: {bank:text,requestTokenId:requestTokenId()},
			success:function(data){
				if (data.success) {
					if (data.info) {
						$('#bankOwned').removeClass('red').html(data.info.bankname);
						$('[name="bankOwned"]').val(data.info.bankname);
					}else{
						$('#bankOwned').addClass('red').html('没有匹配到银行类型');
						$('[name="bankOwned"]').val('');
					};
				}else{
					alert(data.message);
					$('[name="bankOwned"]').val('');
				};
			},
	        complete : function(XMLHttpRequest,status){
	            loadingRemove();
	    　　　　if(status=='error'){
	    			$('#mb_con,#mb_box').remove();
	    			$.MsgBox.Confirmt("银行卡类型获取失败，请重输银行卡号或重新获取",'重新获取','关闭',function(){
						return false;
				    },function(){
				        bankCardTypeR($('[name="bankCard"]').val())
				    });
	    　　　　}else if(status=='timeout'){
	    			$('#mb_con,#mb_box').remove();
	    			$.MsgBox.Confirmt("银行卡类型获取失败，请重输银行卡号或重新获取",'重新获取','关闭',function(){
						return false;
				    },function(){
				        bankCardTypeR($('[name="bankCard"]').val())
				    });
	            }
	    　　}
		});
	}else if(text.length<16){
		$('[name="bankOwned"]').val('');
		$('#bankOwned').removeClass('red').html('');
	};
}
/*判断银行卡类型网络异常时点击提交*/
function bankCardTypeR(text){
	$.ajax({
		url: api+'/api/wx/account/ownedbank/list',
		type: 'POST',
		dataType: 'json',
		data: {bank:text,requestTokenId:requestTokenId()},
		success:function(data){
			if (data.success) {
				if (data.info) {
					$('#bankOwned').removeClass('red').html(data.info.bankname);
					$('[name="bankOwned"]').val(data.info.bankname);
				}else{
					$('#bankOwned').addClass('red').html('没有匹配到银行类型');
					$('[name="bankOwned"]').val('');
				};
			}else{
				alert(data.message);
				$('[name="bankOwned"]').val('');
			};
		},
        complete : function(XMLHttpRequest,status){
            loadingRemove();
    　　　　if(status=='error'){
    			$('#mb_con,#mb_box').remove();
    			$.MsgBox.Confirmt("银行卡类型获取失败，请重输银行卡号或重新获取",'重新获取','关闭',function(){
					return false;
			    },function(){
			        bankCardTypeR($('[name="bankCard"]').val())
			    });
    　　　　}else if(status=='timeout'){
    			$('#mb_con,#mb_box').remove();
    			$.MsgBox.Confirmt("银行卡类型获取失败，请重输银行卡号或重新获取",'重新获取','关闭',function(){
					return false;
			    },function(){
			        bankCardTypeR($('[name="bankCard"]').val())
			    });
            }
    　　}
	});
}
/*银行卡提交*/
function bankSubmit(){
	if (!creditCard($('[name="bankCard"]'))) {
		creditCard($('[name="bankCard"]'));
		return false;;
	}else if(!Bandname($('[name="name"]').val())){
		Bandname($('[name="name"]').val());
		return false;
	}else if(!$('[name="bankOwned"]').val()){
		$('.msg').html('<span class="red">没有匹配到银行类型</span>');
		return false;
	}else if($('[name="protocol"]:checked').length==0){
		alert('请您阅读并同意《银行卡用户服务协议》');
		return false;
	}else{
		loading('保存中...');
		var editBink=GetQueryString('editBink');
		var bankNo=$('[name="bankCard"]').val();
		var bankName=$('[name="name"]').val();
		var bankOwned=$('[name="bankOwned"]').val();
		if (editBink) {
			var data={
				role:type(),
				account:account(),
				bankNo:bankNo,
				bankName:bankName,
				bankOwned:bankOwned,
				requestTokenId:requestTokenId()
			}
			$.ajax({
				url: api+'/api/wx/account/bank/edit',
				type: 'POST',
				dataType: 'json',
				data: data,
				success:function(data){
					loadingRemove();
					if (data.success) {
						window.location.href="../ucenter/bank_success.html";
					}else{
						alert(data.message);
					};
				},
		        complete : function(XMLHttpRequest,status){
		            loadingRemove();
		    　　　　if(status=='error'){
		     　　　　　 $.MsgBox.Alert("提交失败，请重新提交",'确定');
		    　　　　}else if(status=='timeout'){
		     　　　　　$.MsgBox.Alert("提交失败，请重新提交",'确定');
		            }
		    　　}
			});
		}else{
			window.location.href='../../ucenter/bank_psw.html?cardNum='+bankNo+'&cardName='+bankName+'&bankOwned='+bankOwned;
		};
		
	};
}

function isPswPay(psw){
	var pattern = /^\d{6}$/;
	return pattern.test(psw);
}
/*验证密码*/
function passwordPay(e){
	var val=e.val();
	var val2=$('[name="password2"]').val();
	if (val.length==0) {
		$('.msg').html('<span class="red">密码不能为空</span>');
		return false;
	}else{
		if (!isPswPay(val)) {
			$('.msg').html('<span class="red">请输入6位纯数字安全密码</span>');
			return false;
		}else if((val2.length!=0) && (val2!=val)){
			$('.msg').html('<span class="red">两次输入的密码不一致</span>');
			return false;
		}else{
			$('.msg').html('');
			return true;
		};
	};
}
/*二次密码*/
function passwordPay2(e){
	var val=e.val();
	var val2=$('[name="password"]').val();
	if (val.length==0) {
		$('.msg').html('<span class="red">重复密码不能为空</span>');
		return false;
	}else{
		if (!isPswPay(val)) {
			$('.msg').html('<span class="red">请重复输入6位纯数字安全密码</span>');
			return false;
		}else if((val2.length!=0) && (val2!=val)){
			$('.msg').html('<span class="red">两次输入的密码不一致</span>');
			return false;
		}else{
			$('.msg').html('');
			return true;
		};
	};
}

/*安全密码提交*/
function PayPswSubmit(){
	if(!passwordPay($('[name="password"]'))){
		passwordPay($('[name="password"]'));
		return false;
	}else if(!passwordPay2($('[name="password2"]'))){
		passwordPay2($('[name="password2"]'));
		return false;
	}else{
		loading('提交中...');
		var cardNum=getRequest().cardNum;
		var cardName=getRequest().cardName;
		var bankOwned=getRequest().bankOwned;
		var password=$('[name="password"]').val();
		if (cardNum) {
			$.ajax({
				url: api+'/api/wx/account/passwordandbank/add',
				type: 'POST',
				dataType: 'json',
				data: {role:3,account:account(),bankNo:cardNum,bankName:cardName,bankOwned:bankOwned,password:password,requestTokenId:requestTokenId()},
				success:function(data){
					loadingRemove();
					if (data.success) {
						// console.log(data);
						window.location.href="../ucenter/bank_success.html"
					}else{
						alert(data.message);
					};
				},
		        complete : function(XMLHttpRequest,status){
		            loadingRemove();
		    　　　　if(status=='error'){
		    			alert('提交失败，请重试');
		    　　　　}else if(status=='timeout'){
		    			alert('提交失败，请重试');
		            }
		    　　}
			});
		}else{
			$.ajax({
				url: api+'/api/wx/account/password/edit',
				type: 'POST',
				dataType: 'json',
				data: {password:password,account:account(),requestTokenId:requestTokenId()},
				success:function(data){
					loadingRemove();
					if (data.success) {
						window.location.href="../ucenter/psw_success.html";
					}else{
						alert(data.message);
					};
				},
		        complete : function(XMLHttpRequest,status){
		            loadingRemove();
		    　　　　if(status=='error'){
		    			alert('提交失败，请重试');
		    　　　　}else if(status=='timeout'){
		    			alert('提交失败，请重试');
		            }
		    　　}
			});
		};
		
	}
}

function pswPayShow(){
	$('.psw_pay_w').show();
	$('.ipt-real-nick').focus();
}
function fillInPaySubmit(){
	var password=$('[name="password"]').val();
	if (!password) {
		$('.msg').html('<span class="red">请输入安全密码</span>');
	}else{
		if (password.length==0) {
			$('.msg').html('<span class="red">请输入安全密码</span>');
			return false;
		}else{
			if (!isPswPay(password)) {
				$('.msg').html('<span class="red">请输入6位纯数字安全密码</span>');
				return false;
			}else{
				loading('验证中...');
				$.ajax({
					url: api+'/api/wx/account/findaccountbypassword',
					type: 'POST',
					timeout : 10000,
					dataType: 'json',
					data: {account:account(),password:password,requestTokenId:requestTokenId()},
					success:function(data){ 
						loadingRemove();
						if (data.success) {
							// console.log(data.info);
							if (data.info!=null) {
								window.location.href="../ucenter/bank_psw.html?edit=1";
							}else{
								$('.msg').html('<span class="red">安全密码输入错误</span>');
							};
						}else{
							alert(data.message);
						};
					},
			        complete : function(XMLHttpRequest,status){
			            loadingRemove();
			    　　　　if(status=='error'){
			    			alert('提交失败，请重试');
			    　　　　}else if(status=='timeout'){
			    			alert('提交失败，请重试');
			            }
			    　　}
				});
			};
		};



		/*if (password.length==6) {
			$.ajax({
				url: api+'/api/wx/account/findaccountbypassword',
				type: 'POST',
				timeout : 10000,
				dataType: 'json',
				data: {account:account(),password:password,requestTokenId:requestTokenId()},
				success:function(data){ 
					loadingRemove();
					if (data.success) {
						// console.log(data.info);
						if (data.info!=null) {
							window.location.href="../ucenter/bank_psw.html?edit=1";
						}else{
							$('.msg').html('<span class="red">安全密码输入错误</span>');
						};
					}else{
						alert(data.message);
					};
				},
		        complete : function(XMLHttpRequest,status){
		            loadingRemove();
		    　　　　if(status=='error'){
		    			alert('提交失败，请重试');
		    　　　　}else if(status=='timeout'){
		    			alert('提交失败，请重试');
		            }
		    　　}
			});
		}else{
		    loadingRemove();
			alert('请输入六位纯数字的安全密码')
		};*/
		
	};
}

function resetPswSubmit(){
	if (!PhoneNo($('[name="tel"]'))) {
		PhoneNo($('[name="tel"]'));
		return false;
	}else if(!verify($('[name="code"]'))){
		verify($('[name="code"]'));
		return false;
	}else if(!password($('[name="password"]'))){
		password($('[name="password"]'));
		return false;
	}else if(!password2($('[name="password2"]'))){ 
		password2($('[name="password2"]'));
		return false;
	}else{
		var login_tel=$('[name="tel"]').val();
		var login_code=$('[name="code"]').val();
		var login_psw=$("[name=password]").val();

		var data={
			phone: login_tel,
			code: login_code,
			newPwd: login_psw,
			requestTokenId:requestTokenId()
		};
		$.ajax({
			url: api+'/api/wx/login/pwforget',
			type: 'POST',
			dataType: 'json',
			data: data,
			success:function(data){
				// console.log(data);
				if (data.success) {
					alert('重置成功');

					window.location.href="../ucenter/ucenter.html";
				}else{
					alert(data.message);
				};
			}

		});
	}
}
function resetSubmit(){
	if(!verify($('[name="code"]'))){
		verify($('[name="code"]'));
		return false;
	}else if(!password($('[name="password"]'))){
		password($('[name="password"]'));
		return false;
	}else if(!password2($('[name="password2"]'))){ 
		password2($('[name="password2"]'));
		return false;
	}else{
		loading('保存中...');
		var login_code=$('[name="code"]').val();
		var login_psw=$("[name=password]").val();
		var data={
			phone: userName(),
			code: login_code,
			newPwd: login_psw,
			requestTokenId:requestTokenId()
		};
		// console.log(data);
		$.ajax({
			url: api+'/api/wx/login/pwforget',
			type: 'POST',
			dataType: 'json',
			data: data,
			success:function(data){
				loadingRemove();
				// console.log(data);
				if (data.success) {
					// alert('重置成功');
					$.MsgBox.AlertL("重置成功",'确定',function(){
						window.location.href="../ucenter/ucenter.html";
					});
				}else{
					alert(data.message);
				};
			},
	        complete : function(XMLHttpRequest,status){
	            loadingRemove();
	    　　　　if(status=='error'){
	     　　　　　 fubottom('重置密码失败，请重试');
	    　　　　}else if(status=='timeout'){
	                fubottom('重置密码失败，请重试');
	            }
	    　　}
		});
	}
}
function foPswSubmit(){
	if (!PhoneNo($('[name="tel"]'))) {
		PhoneNo($('[name="tel"]'));
		return false;
	}else if(!verify($('[name="code"]'))){
		verify($('[name="code"]'));
		return false;
	}else if(!password($('[name="password"]'))){
		password($('[name="password"]'));
		return false;
	}else if(!password2($('[name="password2"]'))){ 
		password2($('[name="password2"]'));
		return false;
	}else{
		loading('提交中...');
		var login_tel=$('[name="tel"]').val();
		var login_code=$('[name="code"]').val();
		var login_psw=$("[name=password]").val();
		var data={
			phone: login_tel,
			code: login_code,
			newPwd: login_psw,
			requestTokenId:requestTokenId()
		};
		$.ajax({
			url: api+'/api/wx/login/pwforget',
			type: 'POST',
			dataType: 'json',
			data: data,
			success:function(data){
				loadingRemove();
				if (data.success) {
					alert('重置成功');
					history.back(-1);
				}else{
					alert(data.message);
				};
			}
		});
	}
}

function resetCode(e){
	if (userName()) {
		loading('提交中...');
		$.ajax({
			url: api+'/api/wx/validation/getcode',
			type: 'POST',
			dataType: 'json',
			data: {phone:userName(),type:1,requestTokenId:requestTokenId()},
			success:function(data){
				loadingRemove();
				if (data.success) {
					e.removeAttr('onclick').html('<span id="dao_time">60</span>秒再次获取');
					countDown3('#dao_time',60);
				}else{
					alert(data.message);
				};
			},
	        complete : function(XMLHttpRequest,status){
	            loadingRemove();
	    　　　　if(status=='error'){
	     　　　　　 fubottom('获取验证码失败，请重试');
	    　　　　}else if(status=='timeout'){
	                fubottom('获取验证码失败，请重试');
	            }
	    　　}
		});
	}else{
		alert('您还没有登录，请返回重新登录！')
	}
}
function resetCodeZ(e){
	if (userName()) {
		loading('获取中...');
		$.ajax({
			url: api+'/api/wx/validation/getcode',
			type: 'POST',
			dataType: 'json',
			data: {phone:userName(),type:3,requestTokenId:requestTokenId()},
			success:function(data){
				loadingRemove();
				if (data.success) {
					e.removeAttr('onclick').html('<span id="dao_time">60</span>秒再次获取');
					countDown4('#dao_time',60);
				}else{
					alert(data.message);
				};
			},
	        complete : function(XMLHttpRequest,status){
	            loadingRemove();
	    　　　　if(status=='error'){
	     　　　　　 fubottom('获取验证码失败，请重试');
	    　　　　}else if(status=='timeout'){
	                fubottom('获取验证码失败，请重试');
	            }
	    　　}
		});
	}else{
		alert('您还没有登录，请返回重新登录！')
	}
}
function resetCodeB(e){
	if (userName()) {
		loading('获取中...');
		$.ajax({
			url: api+'/api/wx/validation/getcode',
			type: 'POST',
			dataType: 'json',
			data: {phone:userName(),type:2,requestTokenId:requestTokenId()},
			success:function(data){
				loadingRemove();
				if (data.success) {
					e.removeAttr('onclick').html('<span id="dao_time">60</span>秒再次获取');
					countDown5('#dao_time',60);
				}else{
					alert(data.message);
				};
			},
	        complete : function(XMLHttpRequest,status){
	            loadingRemove();
	    　　　　if(status=='error'){
	     　　　　　 fubottom('获取验证码失败，请重试');
	    　　　　}else if(status=='timeout'){
	                fubottom('获取验证码失败，请重试');
	            }
	    　　}
		});
	}
}
function resetGetCode(e){
	if (PhoneNo($('[name="tel"]'))) {
		loading('获取中...');
		var lonin_tel=$('[name="tel"]').val();
		$.ajax({
			url: api+'/api/wx/validation/getcode', 
			type: 'POST',
			dataType: 'json',
			data: {phone:lonin_tel,type:1,requestTokenId:requestTokenId()},
			success:function(data){
				loadingRemove();
				if (data.success) {
					e.removeAttr('onclick').html('<span id="dao_time">60</span>秒再次获取');
					countDown2('#dao_time',60);
				}else{
					alert(data.message);
				};
			},
	        complete : function(XMLHttpRequest,status){
	            loadingRemove();
	    　　　　if(status=='error'){
	     　　　　　 fubottom('获取验证码失败，请重试');
	    　　　　}else if(status=='timeout'){
	                fubottom('获取验证码失败，请重试');
	            }
	    　　}
		});
	};
}

function countDown2(e,num){
	var num=num;
	var timer=setInterval(function(){
		num--;
		$(e).html(num);
		if (num==0) {
			$('.reset_password li a').attr('onclick', 'resetGetCode($(this))').html('获取验证码');
			clearInterval(timer);
		};
	}, 1000);
}
function countDown3(e,num){
	var num=num;
	var timer=setInterval(function(){
		num--;
		$(e).html(num);
		if (num==0) {
			$('.reset_password li a').attr('onclick', 'resetCode($(this))').html('获取验证码');
			clearInterval(timer);
		};
	}, 1000);
}
function countDown4(e,num){
	var num=num;
	var timer=setInterval(function(){
		num--;
		$(e).html(num);
		if (num==0) {
			$('.tel_code a').attr('onclick', 'resetCodeZ($(this))').html('获取验证码');
			clearInterval(timer);
		};
	}, 1000);
}
function countDown5(e,num){
	var num=num;
	var timer=setInterval(function(){
		num--;
		$(e).html(num);
		if (num==0) {
			$('.tel_code a').attr('onclick', 'resetCodeB($(this))').html('获取验证码');
			clearInterval(timer);
		};
	}, 1000);
}

/*账单明细筛选*/
function accountDetailSearch(){
	var accountTypeD=$('[name="type"]');
	var TypeArr=[];
	for (var i = 0; i < accountTypeD.length; i++) {
		if (accountTypeD.eq(i).attr('checked')) {
			TypeArr.push(accountTypeD.eq(i).val());
		};
	};
	var accountType=TypeArr.toString();

	var searchTimeV=$('[name="time"]').val();
	if (searchTimeV) {
		var searchTimeArr=searchTimeV.split('-');
		var searchTimeCuo=new Date(searchTimeArr[0],searchTimeArr[1]-1,1).getTime();
	}else{
		searchTimeCuo='';
	};
	
	if (accountType||searchTimeCuo) {
		window.location.href=window.location.pathname+'?accountType='+accountType+'&searchTimeCuo='+searchTimeCuo;
	}else{
		window.location.href=window.location.pathname;
	};
}
