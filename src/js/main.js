/* 
* @Author: 三点十多分
* @Date:   2017-07-12 15:11:55
* @Last Modified by:   szyg
* @Last Modified time: 2018-06-04 14:11:27
*/

var api=apiL=wxApi(),apiAn=wxApiAn(),apiAnY=wxApiAnY(),wxApiHai=wxApiHai(),apiZhao=wxApiZhao(),apiHaiL=apiHaiL(),sess=sessionStorage,appid=appid(),redirect_uri=redirectUri();
$(function() {
	wecatLoading();

	/*用微信打开*/
	var shou=window.location.pathname;
	if(!isWeiXin()&&shou!='/order/share.html'){
		window.location.href='../login/not_login.html';
	}else if(!isWeiXin()&&shou=='/order/share.html'){ 
		$('.header_box').remove();
	}

	/*除了分享页面，去掉网页右上角菜单*/
	if (shou!='/order/share.html'&&shou!='/shop/share.html') {
		document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
		    // 通过下面这个API隐藏右上角按钮
		    WeixinJSBridge.call('hideOptionMenu');
		});
	};
	/*定义ios手机没有返回按钮*/
	var u = navigator.userAgent, app = navigator.appVersion; 
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isIOS) {
        $('.header_box').remove();
    }

	$('input[readonly]').on('focus', function() {
	    $(this).trigger('blur');
	});
});
function wecatLoading(){
	var code=GetQueryString('code');
	if (code) {
		if (!sess.code) {
			var callbackUrl=window.location.pathname;
			sess.loginUrl=callbackUrl;
			loading('加载中...'); 
			$.ajax({
				url: api+'/api/wx/login/applogin',
				type: 'POST',
				dataType: 'json',
				timeout : 10000,
				data: {code:code,requestTokenId:requestTokenId()},
				success:function(data){
					if (data.success) {
						sess.code=code;
						var info=data.info;
						if (data.info!=null) {
							if (info.user=='null') {
								var base = new Base64();
								var Nickname = base.encode(info.Nickname);
								window.location.href="../../login/login_select.html?Headimgurl="+info.Headimgurl+"&Nickname="+Nickname+"&unionid="+info.unionid;
							}else{
								if (info.user) {
									var user=JSON.parse(info.user);
									// console.log(user);
									if (user.userState==1&&user.accountState==1) {
										$.MsgBox.Confirmt("对不起，您的账号异常，暂不能登录，请联系客服：4001-821200",'拨打电话','关闭',function(){
											WeixinJSBridge.call('closeWindow');
									    },function(){
									        window.location.href='tel:4001821200';
											WeixinJSBridge.call('closeWindow');
									    });
										return false;
									}else{
										if (user.userState==1&&callbackUrl!='/ucenter/ucenter.html') {
											$.MsgBox.Confirmt("对不起，您的账号已被封停，封停原因："+user.userFreezeReason+"，如有疑问，请联系客服：4001-821200",'拨打电话','关闭',function(){
												WeixinJSBridge.call('closeWindow');
										    },function(){
										        window.location.href='tel:4001821200';
												WeixinJSBridge.call('closeWindow');
										    });
											return false;
										}else{
											var base = new Base64();
											var result = base.encode(info.user);
											sess.info=result;
											// return false;
											if (window.location.pathname=='/ucenter/ucenter.html') {
												loading('loading...');
												finduser();
											}else if(window.location.pathname=='/order/send_out.html'){
												sendLoginAddr();
											}else if(window.location.pathname=='/order/self_help_order.html'){
												self_load();
											}else{
												window.location.href=sess.loginUrl;
											};
										};
									};
									
								}else{
									$('.previewimg').remove();
									document.write('登录失败，请关闭重新登录');
								};
							};
						}else{
		        			window.location.href='../login/not_login.html'
						}
					}else{
						alert(data.message);
					};
				},
		        complete : function(XMLHttpRequest,status){
		            loadingRemove();
		    　　　　if(status=='error'){
		    			noResultErr($('body'),400,'请求超时，请返回重新再试','wecatLoading()');
		    　　　　}else if(status=='timeout'){
		    			noResultErr($('body'),400,'请求超时，请返回重新再试','wecatLoading()');
		            }
		    　　}
			});
		}else{
			
		}
	}
}
 
function fengting(){
	var userFreezeReason=$('[name="userFreezeReason"]').val();
	$.MsgBox.Confirmt("对不起，您的账号已被封停，封停原因："+userFreezeReason+"，如有疑问，请联系客服：4001-821200",'拨打电话','关闭',function(){
		return false;
    },function(){
        window.location.href='tel:4001821200';
    });
}
/*返回退出微信页面开始*/
function pushHistory(){
    var state = {
        title: "title",  
        url: "#"  
    };  
    window.history.pushState(state, "title", "");
};
function popstate(){
	pushHistory();
	var bool=false;
	setTimeout(function(){
		bool=true;
    },1000);
    window.addEventListener("popstate", function(e) {  
		if(bool)
		{
			WeixinJSBridge.call('closeWindow');
		}
		pushHistory();
	}, false);
}
function popstateUc(){
	pushHistory();
	var bool=false;
	setTimeout(function(){
		bool=true;
    },1000);
    window.addEventListener("popstate", function(e) {  
		if(bool)
		{
			window.location.href='../../ucenter/account.html'
		}
		pushHistory();
	}, false);
}
function popstateUcenter(){
	pushHistory();
	var bool=false;
	setTimeout(function(){
		bool=true;
    },1000);
    window.addEventListener("popstate", function(e) {  
		if(bool)
		{
			window.location.href='../../ucenter/ucenter.html'
		}
		pushHistory();
	}, false);
}
/*返回退出微信页面结束*/

/*测试*/
/*function wxApi(){
	// 测试
	var wxApi='http://192.168.0.138:8193';
	// 刘本地 
	// var wxApi='http://192.168.0.64:8193';
	// 200 
	// var wxApi='http://192.168.0.138:18193';
	return wxApi;
}
function wxApiAn(){
	// 测试
	// var wxApiAn='http://192.168.0.241:8191';
	// var wxApiAn='http://192.168.0.206:9191';
	var wxApiAn='http://tms.3zqp.com';
	// var wxApiAn='http://192.168.0.61:8191';
	// 200
	// var wxApiAn='http://192.168.0.138:19191'; 
	return wxApiAn;
}
function wxApiAnY(){
	// 本地
	var wxApiAnY='http://tms.3zqp.com';
	// var wxApiAnY='http://192.168.0.61:8191';
	// 138
	// var wxApiAn='http://192.168.0.138:9191';
	return wxApiAnY;
}
function wxApiHai(){
	// var wxApiHai='http://192.168.0.138:9196';
	var wxApiHai='http://tmsimg.3zqp.com';
	return wxApiHai;
}
function wxApiZhao(){
	// var wxApiZhao='http://appapi.3zqp.com';
	// 138
	var wxApiZhao='http://192.168.0.138:8192';
	// 本地
	// var wxApiZhao='http://192.168.0.82:8192';
	return wxApiZhao;
}
function apiHaiL(){
	var apiHaiL='http://acc.3zqp.com';
	// 138
	// var apiHaiL='http://192.168.0.138:9199';
	// 本地
	// var apiHaiL='http://192.168.0.206:9199';
	return apiHaiL;
}
function imgShowApi(){
	// var imgShowApi='https://img3zxg.oss-cn-beijing.aliyuncs.com/';
	var imgShowApi='https://3zxgimg.oss-cn-beijing.aliyuncs.com/';
	return imgShowApi;
}
function appid(){
	var appid='wx9475251f4c74eccd';
	return appid;
}
function redirectUri(){
	var redirectUri='http://192.168.0.73';
	return redirectUri;
}*/

/*线上*/
/*function wxApi(){var wxApi='http://weixinapi.3zqp.com';return wxApi;}
function wxApiAn(){var wxApiAn='http://tms.3zqp.com';return wxApiAn;}
function wxApiAnY(){var wxApiAnY='http://tms.3zqp.com';return wxApiAnY;}
function wxApiHai(){var wxApiHai='http://tmsimg.3zqp.com';return wxApiHai;}
function imgShowApi(){var imgShowApi='https://3zxgimg.oss-cn-beijing.aliyuncs.com/';return imgShowApi;}
function wxApiZhao(){var wxApiZhao='http://appapi.3zqp.com';return wxApiZhao;}
function apiHaiL(){var apiHaiL='http://acc.3zqp.com';return apiHaiL;}
function appid(){var appid='wx6da56d9844be9ca1';return appid;}
function redirectUri(){var redirectUri='http://weixinweb.3zqp.com';return redirectUri;}
*/

/*准生产*/
function wxApi(){var wxApi='http://pweixinapi.3zqp.com';return wxApi;}
function wxApiAn(){var wxApiAn='http://ptms.3zqp.com';return wxApiAn;}
function wxApiAnY(){var wxApiAnY='http://ptms.3zqp.com';return wxApiAnY;}
function wxApiHai(){var wxApiHai='http://ptmsimg.3zqp.com';return wxApiHai;}
function imgShowApi(){var imgShowApi='https://3zxgimg.oss-cn-beijing.aliyuncs.com/';return imgShowApi;}
function wxApiZhao(){var wxApiZhao='http://pappapi.3zqp.com';return wxApiZhao;}
function apiHaiL(){var apiHaiL='http://pacc.3zqp.com';return apiHaiL;}
function appid(){var appid='wx9d37162460f921d8';return appid;}
function redirectUri(){var redirectUri='http://192.168.0.73';return redirectUri;}


/*测试*/
/*function wxApi(){var wxApi='http://tweixinapi.3zqp.com';return wxApi;}
function wxApiAn(){var wxApiAn='http://ttms.3zqp.com';return wxApiAn;}
function wxApiAnY(){var wxApiAnY='http://ttms.3zqp.com';return wxApiAnY;}
function wxApiHai(){var wxApiHai='http://ttmsimg.3zqp.com';return wxApiHai;}
function imgShowApi(){var imgShowApi='https://3zxgimg.oss-cn-beijing.aliyuncs.com/';return imgShowApi;}
function wxApiZhao(){var wxApiZhao='http://tappapi.3zqp.com';return wxApiZhao;}
function apiHaiL(){var apiHaiL='http://tacc.3zqp.com';return apiHaiL;}
function appid(){var appid='wx9d37162460f921d8';return appid;}
function redirectUri(){var redirectUri='http://192.168.0.73';return redirectUri;}*/

/*微信用户*/
function isWeiXin(){ 
	var ua = window.navigator.userAgent.toLowerCase();
	if(ua.match(/MicroMessenger/i) == 'micromessenger'){
		return true;
	}else{
		return false; 
	}
}

function userId(){
	if (sess.info) {
		var base = new Base64();
		var result = base.decode(sess.info);
		var json=JSON.parse(result);
		var userId=json.id;
		return userId;
	}
};

function userTel(){
	if (sess.info) {
		var base = new Base64();
		var result = base.decode(sess.info);
		var json=JSON.parse(result);
		var userTel=json.tel;
		return userTel;
	}
};
function userName(){
	if (sess.info) {
		var base = new Base64();
		var result = base.decode(sess.info);
		var json=JSON.parse(result);
		var userName=json.userName;
		return userName;
	}
};
function number(){
	if (sess.info) {
		var base = new Base64();
		var result = base.decode(sess.info);
		var json=JSON.parse(result);
		var number=json.number;
		return number;
	};
};
function account(){
	if (sess.info) {
		var base = new Base64();
		var result = base.decode(sess.info);
		var json=JSON.parse(result);
		var account=json.account;
		return account;
	};
};
function type(){
	if (sess.info) {
		var base = new Base64();
		var result = base.decode(sess.info);
		var json=JSON.parse(result);
		var type=json.type;
		return type;
	};
};
function requestTokenId(num){
	len =num||32;
	var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
	var maxPos = $chars.length;
	var pwd = '';
	for (i = 0; i < len; i++) {
		pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
	}
	return 'wx_tms_'+pwd;
}
function requestTokenInput(){
	var html='<input name="requestTokenId" type="hidden" value="'+requestTokenId()+'">';
	$('form').append(html);
};

/*详情页复制*/
function clipboard(){
	var clipboard = new Clipboard('.details_btn');
	clipboard.on('success', function(e) {
	   $('.waybill_wrap').css('display', 'none');
	});
	clipboard.on('error', function(e) {
	   alert('失败');
	});
}

/*返回*/
function headerGoback(){
	history.back(-1);
}

function showRem(msg){
	$('.reminder').remove();
	$('body').append('<div class="reminder"><p>'+msg+'</p></div>');
	var timer=setTimeout(function(){
		clearTimeout(timer);
		$('.reminder').fadeOut(500);
		$('.reminder').remove();
	}, 3000);
};

/*获取地址*/
function addr_aera2(pNum,cNum,dNum){
	var city_picker = new mui.PopPicker({layer:3});
	city_picker.setData(provs);
	if (pNum&&cNum&&dNum) {
	    for (var i = 0; i < provs.length; i++) {
	    	var PIndex=i;
	    	if (provs[i].value==pNum) {
	    		for (var j = 0; j < provs.length; j++) {
	    			var cIndex=j;
		    		if (cNum==provs[i].child[j].value) {
		    			for (var k = 0; k < provs[i].child[j].child.length; k++) {
			    			var dIndex=k;
				    		if (dNum==provs[i].child[j].child[k].value) {
				    			break;
				    		};
			    		};
		    			break;
		    		};
	    		};
	    		break;
	    	}
	    };
	    city_picker.pickers[0].setSelectedIndex(PIndex);
		city_picker.pickers[1].setSelectedIndex(cIndex);
		city_picker.pickers[2].setSelectedIndex(dIndex);
	};
	$("#addr_aera").on("tap", function(){
		$('input').blur();
		setTimeout(function(){
			city_picker.show(function(items){
				$("#addr_value").val((items[0] || {}).value + "," + (items[1] || {}).value + "," + (items[2].value || items[1].value));//该ID为接收城市ID字段
				$("#addr_aera").removeClass('c999').html((items[0] || {}).text + " " + (items[1] || {}).text + " " + (items[2].text || items[1].text));
			});
		},200);
	});
}
/*以下是注册页面开始*/
/*获取验证码*/
function sub_tel(e){
	if (PhoneNo($('[name="tel"]'))) {
		loading('获取中...');
		var lonin_tel=$('[name="tel"]').val();
		$.ajax({
			url: apiL+'/api/wx/validation/getcode',
			type: 'POST',
			dataType: 'json',
			data: {phone:lonin_tel,type:0,requestTokenId:requestTokenId()},
			success:function(data){
				loadingRemove();
				if (data.success) {
					e.removeAttr('onclick').html('<span id="dao_time">60</span>秒再次获取');
					countDown('#dao_time',60);
				}else{
					alert(data.message);
				};
			}
		});
	};
}
/*验证倒计时*/
function countDown(e,num){
	var num=num;
	var timer=setInterval(function(){
		num--;
		$(e).html(num);
		if (num==0) {
			$('.gain').attr('onclick', 'sub_tel($(this))').html('获取验证码');
			clearInterval(timer);
		};
	}, 1000);
}
/*手机号提交验证*/
function telSubmit(){
	if (!PhoneNo($('.tel'))) {
		PhoneNo($('.tel'));
		return false;
	}else if(!verify($('.yzm'))){
		verify($('.yzm'));
		return false;
	}else if(!password($('[name="password"]'))){
		password($('[name="password"]'));
		return false;
	}else if(!password2($('[name="password2"]'))){
		password2($('[name="password2"]'));
		return false;
	}else if($('[name="protocol"]:checked').length<1){
		alert('请您先勾选同意《三真车联平台注册协议》');
		return false;
	}else{
		/*防止重复提交*/
		$('.footer_btn').attr('disabled', 'disabled');
		var timer=setTimeout(function(){
			clearTimeout(timer);
			$('.footer_btn').removeAttr('disabled');
		}, 5000);

		loading('提交中...');
		var login_tel=$('[name="tel"]').val();
		var login_code=$('[name="code"]').val();
		var login_psw=$("[name=password]").val();
		var unionid=GetQueryString('uid');
		var data={
			unionid: unionid,
			phone: login_tel,
			code: login_code,
			password: login_psw,
			username:login_tel,
			registerType:3,
			requestTokenId:requestTokenId(),
		};
		$.ajax({
			url: api+'/api/wx/login/register',
			type: 'POST',
			dataType: 'json',
			data: data,
			success:function(data){
				loadingRemove();
				if (data.success) {
					if (data.message) {
						alert(data.message)
					}else{
						console.log(data);
						var base = new Base64();
						var info = base.encode(JSON.stringify(data.info));
						sess.info=info;


						var base = new Base64();
						var result = base.decode(sess.info);
						var json=JSON.parse(result);


						console.log(json)
						// return false;
						window.location.href="../login/login_addr.html?unionid="+unionid;
					}
				}else{
					alert(data.message);
				};
			},
			complete : function(XMLHttpRequest,status){
	            loadingRemove();
	            if(status=='error'){
	            	$('.footer_btn').removeAttr('disabled');
	                fubottom('提交失败，请重试');
	            }else if(status=='timeout'){
	            	$('.footer_btn').removeAttr('disabled');
	                fubottom('提交失败，请重试');
	            }
	        }
		});
	}
}

function protocolClose(){
	$('.protocol_wrap').css('display', 'none');
}

function protocolSelect(){
	$('[name="protocol"]').attr('checked', 'checked');
	$('.protocol_wrap').css('display', 'none');
}
/*地址详情提交验证*/
function addrSubmit(){
	if (!noNullfa($('.company'),'公司名称')) {
		noNullfa($('.company'),'公司名称');
		return false;
	}else if(!nameLen($('[name="name"]').val())){
		nameLen($('[name="name"]').val());
		return false;
	}else if(!noNull($('#addr_value'),'所在地址')){
		noNull($('#addr_value'),'所在地址');
		return false;
	}else if(!noNullfa($('.addr_detail'),'详细地址')){
		noNullfa($('.addr_detail'),'详细地址');
		return false;
	}else{
		/*防止重复提交*/
		$('.footer_btn').attr('disabled', 'disabled');
		var timer=setTimeout(function(){
			clearTimeout(timer);
			$('.footer_btn').removeAttr('disabled');
		}, 5000);

		loading('提交中...');
		var company=trim($('[name="company"]').val());
		var name=trim($('[name="name"]').val());
		var addrAera=$('#addr_aera').html();
		var addrAeraNum=$('[name="addrAeraNum"]').val();
		var addrDetail=trim($('[name="addrDetail"]').val());
		addrAera=addrAera.split(' ');
		addrAeraNum=addrAeraNum.split(',');
		var tel=userName();
		AMap.service('AMap.Geocoder',function(){
		    var geocoder = new AMap.Geocoder({});
		    geocoder.getLocation(addrAera[0]+""+addrAera[1]+""+addrAera[2]+""+addrDetail, function(status, result) {
		    	loadingRemove();
			    if (status === 'complete' && result.info === 'OK') {
			    	loading('提交中...');
			        var data={
						id:userId(),
						company:company,
						proName: addrAera[0],
						proNumber: addrAeraNum[0],
						cityName: addrAera[1],
						cityNumber: addrAeraNum[1],
						areaName: addrAera[2],
						areaNumber: addrAeraNum[2],
						detailed: addrDetail,
						lat:result.geocodes[0].location.lat,
						lng:result.geocodes[0].location.lng,
						contact: name,
						tel: userTel(),
						type:3,
						account:account(),
						number:number(),
						userName:userName(),
						unionid:GetQueryString('unionid'),
						requestTokenId:requestTokenId()
					};
			    	console.log(data)
		    		$.ajax({
						url: apiL+'/api/wx/login/adduser',
						type: 'POST',
						dataType: 'json',
						data: data,
						success:function(data){
							loadingRemove();
							// console.log(data);
							if (data.success) {
								var info=data.info;
								if (info!=null) {
									info=JSON.stringify(info);
									var base = new Base64();
									var result = base.encode(info);
									sess.info=result;
								};
								window.location.href="../login/login_ok.html";
							}else{
								alert(data.message);
							};
						},
						complete : function(XMLHttpRequest,status){
				            loadingRemove();
				            if(status=='error'){
				            	$('.footer_btn').removeAttr('disabled');
				                fubottom('提交失败，请重试');
				            }else if(status=='timeout'){
				            	$('.footer_btn').removeAttr('disabled');
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
					    geocoder.getLocation(addrAera[0]+""+addrAera[1]+""+addrAera[2], function(status, result) {
					    	loadingRemove();
						    if (status === 'complete' && result.info === 'OK') {
						    	loading('提交中...');
						        var data={
									id:userId(),
									company:company,
									proName: addrAera[0],
									proNumber: addrAeraNum[0],
									cityName: addrAera[1],
									cityNumber: addrAeraNum[1],
									areaName: addrAera[2],
									areaNumber: addrAeraNum[2],
									detailed: addrDetail,
									lat:result.geocodes[0].location.lat,
									lng:result.geocodes[0].location.lng,
									contact: name,
									tel: userTel(),
									type:3,
									account:account(),
									number:number(),
									userName:userName(),
									unionid:GetQueryString('unionid'),
									requestTokenId:requestTokenId()
								};
					    		$.ajax({
									url: apiL+'/api/wx/login/adduser',
									type: 'POST',
									dataType: 'json',
									data: data,
									success:function(data){
										loadingRemove();
										// console.log(data);
										if (data.success) {
											var info=data.info;
											if (info!=null) {
												info=JSON.stringify(info);
												var base = new Base64();
												var result = base.encode(info);
												sess.info=result;
											};
											window.location.href="../login/login_ok.html";
										}else{
											alert(data.message);
										};
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
/*注册完成页面倒计时跳转*/
function login_ok(e,time){
	if (!userId()) {
		window.location.href="../login/login_tel.html"
	};
	var i=parseFloat(time)/1000;
	if (i>0) {
		setInterval(function(){
			i--;
			e.html(i);
		}, 1000);
	}else{
		e.html(0);
	};
	setTimeout(function(){
		window.location.href=sess.loginUrl;
	}, time)
}
/*绑定登录*/
function loginBindSubmit(){
	var callbackUrl=sess.loginUrl;
	if (!noNull($('[name="account"]'),'账号')) {
		$('.msg').html('<span class="red">账号不能为空</span>')
	}else if(!noNull($('[name="password"]'),'密码')){
		$('.msg').html('<span class="red">密码不能为空</span>')
	}else{
		loading('绑定中...');
		var login_tel=$('[name="account"]').val();
		var login_psw=$('[name="password"]').val();
		$.ajax({
			url: api+'/api/wx/login/relation',
			type: 'POST',
			dataType: 'json',
			data: {username:login_tel,password:login_psw,unionid:GetQueryString('uid'),requestTokenId:requestTokenId()},
			success:function(data){
				loadingRemove();
				if (data.success) {
					// console.log(data);
					if (data.message) {
						alert(data.message);
					}else{
						var user=data.info;
						// console.log(user)
						if (user.userState==1&&user.accountState==1) {
							$.MsgBox.Confirmt("对不起，您的账号异常，暂不能登录，请联系客服：4001-821200",'拨打电话','关闭',function(){
								WeixinJSBridge.call('closeWindow');
						    },function(){
						        window.location.href='tel:4001821200';
								WeixinJSBridge.call('closeWindow');
						    });
							return false;
						}else{
							if (user.userState==1&&callbackUrl!='/ucenter/ucenter.html') {
								var base = new Base64();
								var result = base.encode(JSON.stringify(data.info));
								sess.info=result;
								alert('绑定成功');
								$.MsgBox.Confirmt("对不起，您的账号已被封停，封停原因："+user.userFreezeReason+"。您可以进入<a class='blue' href='/ucenter/ucenter.html'>个人中心</a>。如有疑问，请联系客服：4001-821200",'拨打电话','关闭',function(){
									WeixinJSBridge.call('closeWindow');
							    },function(){
							        window.location.href='tel:4001821200';
									WeixinJSBridge.call('closeWindow');
							    });
								return false;
							}else{
								var base = new Base64();
								var result = base.encode(JSON.stringify(data.info));
								sess.info=result;
								window.location.href=sess.loginUrl;
							};
						};
					};
				}else{
					alert(data.message);
				};
			}
		});
		
	};
}
/*验证不能为空*/
function noNull(e,msg){
	var val=trim(e.val());
	if (val.length==0) {
		$('.msg').html('<span class="red">'+msg+'不能为空</span>');
		return false;
	}else{
		$('.msg').html('');
		return true;
	}
}
/*验证不能为空*/
function noNullfa(e,msg){
	var val=trim(e.val());
	if (val.length==0) {
		$('.msg').html('<span class="red">'+msg+'不能为空</span>');
		return false;
	}else if(notdot(val)){
		$('.msg').html('<span class="red">'+msg+'不能输入非法字符</span>');
		return false;
	}else{
		$('.msg').html('');
		return true;
	}
}
/*删除左右两端的空格*/
function trim(str){
 	return str.replace(/ /g,'');
}

function nameLen(value){
	if (value) {
		if (!hanEng(value)) {
			$('.msg').html('<span class="red">联系人姓名只能中英文</span>');
			return false;
		}else{
			if (value.length<2||value.length>20) {
				$('.msg').html('<span class="red">联系人需输入2-20个字</span>');
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
/*验证密码*/
function password(e){
	var val=e.val();
	var val2=$('[name="password2"]').val();
	if (val.length==0) {
		$('.msg').html('<span class="red">密码不能为空</span>');
		return false;
	}else{
		if (!ispsw(val)) {
			$('.msg').html('<span class="red">请输入6-16位数字和字母的组合密码</span>');
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
function password2(e){
	var val=e.val();
	var val2=$('[name="password"]').val();
	if (val.length==0) {
		$('.msg').html('<span class="red">重复密码不能为空</span>');
		return false;
	}else{
		if (!ispsw(val)) {
			$('.msg').html('<span class="red">请输入重复6-16位数字和字母的组合密码</span>');
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
/*验证电话*/
function telNo(e){
	var val=trim(e.val());
	if (!isNumberTel(val)) {
		loadingRemove();
		$('.msg').html('<span class="red">请输入7-12位的手机号或固话</span>');
		return false;
	}else{
		$('.msg').html('');
		return true;
	};
}
function telNoFa(e){
	var val=trim(e.val());
	if (!isNumberTel(val)) {
		loadingRemove();
		$('.msg_fuInputTel').html('<span class="red">请输入7-12位的手机号或固话</span>');
		return false;
	}else{
		$('.msg_fuInputTel').html('');
		return true;
	};
}
/*验证手机号*/
function PhoneNo(e){
	var val=e.val();
	if (val.length==0) {
		$('.msg').html('<span class="red">手机号不能为空</span>');
		return false;
	}else{
		if (!isPhoneNo(val)) {
			$('.msg').html('<span class="red">请输入正确的手机号</span>');
			return false;
		}else{
			$('.msg').html('');
			return true;
		};
	};
}
/*常用联系人验证手机号*/
function comPhoneNo(e){
	var val=trim(e.val());
	if (val.length==0) {
		e.parents('.comment_input').siblings('.msg').html('<span class="red">手机号不能为空</span>');
		return false;
	}else{
		if (!isPhoneNo(val)) {
			e.parents('.comment_input').siblings('.msg').html('<span class="red">请输入正确的手机号</span>');
			return false;
		}else{
			e.parents('.comment_input').siblings('.msg').html('');
			return true;
		};
	};
}
/*验证码*/
function verify(e){
	var val=e.val();
	if (val.length==0) {
		$('.msg').html('<span class="red">验证码不能为空</span>');
		return false;
	}else{
		if (!istelverify(val)) {
			$('.msg').html('<span class="red">请输入正确的验证码</span>');
			return false;
		}else{
			$('.msg').html('');
			return true;
		};
	};
}
/*验证手机号*/
function isPhoneNo(phone) {
 	var pattern = /^1\d{10}$/;
	return pattern.test(phone);
}
/*验证验证码*/
function istelverify(verify) { 
	var pattern = /^\d{4,7}$/;
 	return pattern.test(verify);
}
function isNumberTel(tel){
	var pattern = /^\d{7,12}$/;
	return pattern.test(tel);
}
/*判断密码为6-16位*/
/*function ispsw(psw) {
	var pattern = /^(?![\d]+$)(?![a-zA-Z]+$)(?![\(\)\（\）\，\,\.\、\-\/\\\~\_\&\*\#]+$)[\da-zA-Z\(\)\（\）\，\,\.\、\-\/\\\~\_\&\*\#]{6,16}$/;
 	return pattern.test(psw);
}*/
function ispsw(psw) {
	var pattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,16}$/;
 	return pattern.test(psw);
}
/*判断密码为6-16位*/
function hanEng(psw) {
	var pattern = /^[\u4E00-\u9FA5A-Za-z]+$/;
 	return pattern.test(psw);
}
/*判断不能为非法字符*/
function notdot(stry) {
	var pattern = new RegExp("[`~!@#$^&*=|{}':;',\\[\\].<>/?！@#￥……&*|{}‘；：”“'。，？]");
 	return pattern.test(stry);
}
/*以上是注册页面结束*/

/*自助下单发货编辑链接*/
function consignerEdit(id){
	if (!GetQueryString('waybill')) {
		window.location.href="../ucenter/consigner_edit.html?edit="+id+"&from=addr&order="+GetQueryString('selfHp');
	}else{
		window.location.href="../ucenter/consigner_edit.html?edit="+id+"&from=addr&waybill=addr&order="+GetQueryString('selfHp');
	};
}
/*自助下单收货编辑链接*/
function recrivingEdit(id){
	if (!GetQueryString('waybill')) {
		window.location.href="../ucenter/receiving_edit.html?edit="+id+"&from=addr&order="+GetQueryString('selfHp');
	}else{
		window.location.href="../ucenter/receiving_edit.html?edit="+id+"&from=addr&waybill=addr&order="+GetQueryString('selfHp');
	};
}


/*获取链接参数*/
function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}
function GetQueryString2(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[1]); return null;
}

function getRequest(){
   var url = window.location.search;
   var theRequest = new Object();
   if (url.indexOf("?") != -1) {
      var str = url.substr(1);
      strs = str.split("&");
      for(var i = 0; i < strs.length; i ++) {
         theRequest[strs[i].split("=")[0]]=decodeURI(strs[i].split("=")[1]);
      }   
   }
   return theRequest;   
}

function loading(text){
	var html='<div class="loadingZhuan"><div class="loadingZ"><img src="../skin/images/zhuan.gif"><p>'+text+'</p></div></div>';
	$('body').append(html);
}
function loadingRemove(){
	$('.loadingZhuan').remove();
}

/*弹出浮层*/
function displayB(e){
	e.css('display', 'flex');
}
function displayN(e){
	e.css('display', 'none');
}
/*保留小数点后两位*/
function toDecimal2(x) {    
    var f = parseFloat(x);    
    if (isNaN(f)) {    
        return false;    
    }    
    var f = Math.round(x*100)/100;    
    var s = f.toString();    
    var rs = s.indexOf('.');    
    if (rs < 0) {    
        rs = s.length;    
        s += '.';    
    }    
    while (s.length <= rs + 2) {    
        s += '0';    
    }    
    return s;    
}


/*时间转换*/
Date.prototype.format = function(format) {
	var date = {
		"M+": this.getMonth() + 1,
		"d+": this.getDate(),
		"h+": this.getHours(),
		"m+": this.getMinutes(),
		"s+": this.getSeconds(),
		"q+": Math.floor((this.getMonth() + 3) / 3),
		"S+": this.getMilliseconds()
	};
	if (/(y+)/i.test(format)) {
	  	format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
	}
	for (var k in date) {
		  if (new RegExp("(" + k + ")").test(format)) {
		        format = format.replace(RegExp.$1, RegExp.$1.length == 1
		                ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
		  }
	}
	return format;
};

/*三秒消失提示*/
var timerBottom;
function fubottom(text) {
	clearTimeout(timerBottom);
	if ($('body .fubottom').length>0) {
		$('.fubottom').fadeOut().remove();
		var html='<div class="fubottom">'+text+'</div>';
		$('body').append(html).fadeIn();
	}else{
		var html='<div class="fubottom">'+text+'</div>';
		$('body').append(html).fadeIn();
	};
	timerBottom=setTimeout(function(){
		$('.fubottom').fadeOut().remove();
	}, 2000);
}


function noResult(boxDot,height,text){
	boxDot.html('<div class="noResult_flex" style="height:'+height+'px"><div class="noResult_flex"><div class="noResult_c"><span><img src="../skin/images/no_find.png" alt=""></span><p>'+text+'</p></div></div>');
}
function noResultErr(boxDot,height,text,func){
	boxDot.html('<div class="noResult_flex" style="height:'+height+'px"><div class="noResult_flex" onclick="'+func+'"><div class="noResult_c"><span><img src="../skin/images/loading_erro.png" alt=""></span><p>'+text+'</p></div></div>');
}
