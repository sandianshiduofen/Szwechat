'use strict';
/*信息修改提交验证*/
function editInfoSubmit(){
	if (!noNullfa($('[name="company"]'),'单位名称')) {
		noNullfa($('[name="company"]'),'单位名称');
		return false;
	}else if(!noNull($('[name="addrAera"]'),'所在省、市、区')){
		noNull($('[name="addrAera"]'),'所在省、市、区');
		return false;
	}else if(!noNullfa($('[name="detail"]'),'详细地址')){
		noNullfa($('[name="detail"]'),'详细地址');
		return false;
	}else{
		var company=trim($('[name="company"]').val());
		var name=trim($('[name="name"]').val());
		var addrAera=$('[name="addrAera"]').val();
		var addrAeraNum=$('[name="addrAeraNum"]').val();
		var addrDetail=trim($('[name="detail"]').val());
		addrAera=addrAera.split(' ');
		addrAeraNum=addrAeraNum.split(',');
		var data={
			userId:userId(),
			company:company,
			proName: addrAera[0],
			proNumber: addrAeraNum[0],
			cityName: addrAera[1],
			cityNumber: addrAeraNum[1],
			areaName: addrAera[2],
			areaNumber: addrAeraNum[2],
			detailed: addrDetail,
			contact: name,
			userName: name,
			account:account(),
			type:type(),
			requestTokenId:requestTokenId()
		};
		$.ajax({
			url: apiL+'/api/wx/login/edituser',
			type: 'POST',
			dataType: 'json',
			data: data,
			success:function(data){
				if (data.success) {
					window.location.href="../ucenter/ucenter.html";
				}else{
					alert(data.message)
				};
			}
		});
	}
}
/*保存常用联系人*/
function comTelSubmit(){
	if (!GetQueryString('id')) {
		var inp=$('[name="tel"]');
		var codeDom=$('[name="code"]');
		if (!PhoneNo(inp)) {
			PhoneNo(inp)
		}else if(!verify(codeDom)){
			verify(codeDom)
		}else{
			loading('保存中...');
			var phone=inp.val();
			var code=codeDom.val();
			$.ajax({
				url: apiL+'/api/wx/contacts/add_v1',
				type: 'POST',
				dataType: 'json',
				data: {userId:userId,phone:phone,code:code,number:number(),requestTokenId:requestTokenId()},
				success:function(data){
					loadingRemove();
					if (data.success) {
						$.MsgBox.AlertL("添加成功",'确定',function(){
					       window.location.href="../ucenter/common_use_tel.html"
					    });
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
		};
	}else{
		var id=GetQueryString('id');
		var inp=$('[name="tel"]');
		var codeDom=$('[name="code"]');
		if (!PhoneNo(inp)) {
			PhoneNo(inp)
		}else if(!verify(codeDom)){
			verify(codeDom)
		}else{
			loading('保存中...');
			var phone=inp.val();
			var code=codeDom.val();
			$.ajax({
				url: apiL+'/api/wx/contacts/edit_v1',
				type: 'POST',
				dataType: 'json',
				data: {userId:userId,phone:phone,code:code,id:id,number:number(),requestTokenId:requestTokenId()},
				success:function(data){
					loadingRemove();
					if (data.success) {
						$.MsgBox.AlertL("修改成功",'确定',function(){
					       window.location.href="../ucenter/common_use_tel.html"
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
		    　　}
			});
		}
	};
}
function delPhone(e,id){
	console.log('x')
	$.MsgBox.ConfirmL("确定要删除吗？",'取消','确定',function(){
		loading('删除中...');
		$.ajax({
			url: apiL+'/api/wx/contacts/delete',
			type: 'POST',
			dataType: 'json',
			data: {id:id,number:number(),requestTokenId:requestTokenId()},
			success:function(data){
				loadingRemove();
				if(data.success) {
					e.parents('li').remove();
					var liLen=$('#telList').children('li').length;
					if(liLen<10 && $('footer').length==0) {
						$('body').append('<footer><a class="footer_btn" href="../ucenter/common_tel_edit.html">添加</a></footer>');
					};
					if(liLen==0) {
						noResult($('.telListBox'),400,'您还没有添加常用联系电话');
					};
				}else{
					alert(data.message)
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
}
/*选择上传图片预览*/
function previewImage(file,imgNum){
	
	var div = document.getElementById('preview'+imgNum);
	if (file.files && file.files[0]){
		complainAdd();

		div.innerHTML ='<img id=imghead'+imgNum+'>';
		var img = document.getElementById('imghead'+imgNum+'');
		var reader = new FileReader();
		reader.onload = function(evt){img.src = evt.target.result;}
		reader.readAsDataURL(file.files[0]);
		var preview=$('#preview'+imgNum);
		var img_close_w=preview.parents('.yanzRight').children('.img_close_w');

		if (!img_close_w.html()) {
			var close='<span class="img_close" onclick="complainDelDmg($(this))"></span>';
			img_close_w.html(close);
		}
  	}else{
	    var sFilter='filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src="';
	    file.select();
	    var src = document.selection.createRange().text;
	    div.innerHTML = '<img id=imghead'+imgNum+'>';
	    var img = document.getElementById('imghead'+imgNum);
	    img.filters.item('DXImageTransform.Microsoft.AlphaImageLoader').src = src;
	    div.innerHTML = "<div id=divhead"+imgNum+sFilter+src+"\"'></div>";
  	}
}

/*添加图片站位*/
function complainAdd(){
	var len=$('.yanzRight').length;
	var yanzNum=$('.yanzRight').eq(len-1).attr('data-num');
	var flag=1;
	for (var i = 0; i < len; i++) {
		var img_src=$('.yanzRight').eq(i).find('img').attr('src');
		if (img_src) {
			flag++;
		};
	};
	if (len<3&&flag==len) {
		var k=parseInt(yanzNum)+1;
		var html='<div class="yanzRight" data-num="'+k+'"><form class="formUp"><label>'
                    +'<input class="images" name="file" onchange="previewImage(this,'+(k)+')" type="file"/><input type="hidden" class="imgsrc">'
                    +'<div class="img_show" id="preview'+k+'">'
                    	 +'<img id="imghead'+k+'" style="display:none;"/>'
                    	 +'</div></label></form><div class="img_close_w"></div></div>';

        $('.complain_img').append(html)
	};
}

/*删除图片*/
function complainDelDmg(e){
	e.parents('.yanzRight').remove();
	var len=$('.yanzRight').length;
	var yanzNum=$('.yanzRight').eq(len-1).attr('data-num');
	var flag=1;
	for (var i = 0; i < len; i++) {
		var img_src=$('.yanzRight').eq(i).find('img').attr('src');
		if (img_src) {
			flag++;
		};
	};
	if (len==2&&flag==3) {
		var k=parseInt(yanzNum)+1;
		var html='<div class="yanzRight" data-num="'+k+'"><form class="formUp"><label>'
                    +'<input class="images" name="file" onchange="previewImage(this,'+(k)+')" type="file"/><input type="hidden" class="imgsrc">'
                    +'<div class="img_show" id="preview'+k+'">'
                    	 +'<img id="imghead'+k+'" style="display:none;"/>'
                    	 +'</div></label></form><div class="img_close_w"></div></div>';
        $('.complain_img').append(html)
	};
	
}

/*反馈信息不能为空*/
function conNoNull(e,msg){
	var val=e.val();
	if (val.length==0) {
		e.parents('.comment_input').next('.msg').html('<span class="red">'+msg+'不能为空</span>');
		e.focus();
		return false;
	}else{
		e.parents('.comment_input').next('.msg').html('');
		return true;
	}
}

/*反馈提交*/
function complainSubmit(){
	if (!conNoNull($('[name="type"]'),'问题类型')) {
		conNoNull($('[name="type"]'),'问题类型');
		return false;
	}else if(!conNoNull($('[name="content"]'),'投诉内容')){
		conNoNull($('[name="content"]'),'投诉内容');
		return false;
	}else if(!comPhoneNo($('[name="phone"]'))){
		comPhoneNo($('[name="phone"]'));
		return false;
	}else{
		var type=$('[name="type"]').val();
		var content=$('[name="content"]').val();
		var phone=$('[name="phone"]').val();
		var imgArr=[];
		for (var i = 0; i < $('.imgsrc').length; i++) {
			var img=$('.imgsrc').eq(i).val();
			if (img) {
				imgArr.push(img);
			};
		};
		var imgsUrl=imgArr.toString()
		var data={
			userId:userId,
			type:type,
			content:content,
			phone:phone,
			image:imgsUrl,
			requestTokenId:requestTokenId()
		}
		$.ajax({
			url: apiL+'/api/wx/feedback/add',
			type: 'POST',
			dataType: 'json',
			data: data,
			success:function(data){
				if (data.success) {
					window.location.href="../ucenter/ucenter.html";
				}else{
					alert(data.message)
				};
			}
		});
	}
}

/*运费券弹框弹出*/
function tickedQrOpen(num,amount){
	loading('加载中...');
	$.ajax({
		url: apiZhao+'/api/platform/coupon/getno',
		type: 'POST',
		dataType: 'json',
		data: {userId:userId(),id:num,requestTokenId:requestTokenId()},
		success:function(data){
			loadingRemove();
			if (data.success) {
				// console.log(data);
				var html='<div class="ticked_wrap">'
				+'<div class="ticked">'
				+'<div class="ticked_pop_c"><span id="tickedQrClose"></span>'
				+'<div class="share_details"><p>运费抵扣券金额：<b class="red">'+amount+'</b>元</p>'
				+'<div><div id="qrcode"></div></div><p class="c999">此二维码有效期为20秒，<b class="blue" id="daoTime">20</b>秒后会对此券号重新生成二维码</p>'
						+'</div></div></div></div>';
				$('body').append(html);
				jQuery('#qrcode').qrcode({text:data.info});
				daoTime(num);
			}else{
				alert(data.message);
				$('.ticked_wrap').remove();
				tickedList();
			};
		}
	});
}
function daoTime(num){
	var motime=20;
	var timer=setInterval(function(){
		motime--;
		if (motime<=0) {
			$.ajax({
				url: apiZhao+'/api/platform/coupon/getno',
				type: 'POST',
				dataType: 'json',
				data: {userId:userId(),id:num,requestTokenId:requestTokenId()},
				success:function(data){
					if (data.success) {
						// console.log(data.info);
						$('#qrcode').html('');
						jQuery('#qrcode').qrcode({text:data.info});
					}else{
						alert(data.message);
						$('.ticked_wrap').remove();
						tickedList();
						clearInterval(timer);
					};
				}
			});
			motime=20
		}
		$('#daoTime').html(motime);
	}, 1000);
	$('#tickedQrClose').click(function(event) {
		$('.ticked_wrap').remove();
		tickedList();
		clearInterval(timer);
	});
}

function exitUser(){
	if (sess.info) {
		var base = new Base64();
		var result = base.decode(sess.info);
		var json=JSON.parse(result);
		var unionid=json.unionid;
		$.MsgBox.Confirmt("<h3 style='margin-bottom:0.05rem'>解除绑定</h3>您确定要解除与该微信的绑定吗？",'确定','取消',function(){
			return true;
	    },function(){
			loading('解除绑定中...');
	        $.ajax({
				url: apiL+'/api/wx/login/unboundwechat',
				type: 'POST',
				dataType: 'json',
				data: {unionid:unionid,requestTokenId:requestTokenId()},
				success:function(data){
					if (data.success) {
						console.log(data);
						sessionStorage.removeItem("info");
						sessionStorage.removeItem("code");
						$.MsgBox.AlertL("解绑成功",'好的',function(){
					        window.location.href='https://open.weixin.qq.com/connect/oauth2/authorize?appid='+appid+'&redirect_uri='+redirect_uri+'/ucenter/ucenter.html&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect'
					    });
					}else{
						alert(data.message);
					};
				},
		        complete : function(XMLHttpRequest,status){
		            loadingRemove();
		    　　　　if(status=='error'){
		    			$.MsgBox.Alert("<h3>解除失败</h3><br /><p style='text-align: left;'>原因：可能是请求服务器失败或者网络出了小差错<br/>1、您可以再次解绑试一试<br />2、退出公众号重新再进入试一试<br />如仍未解决，；联系客服：4001821200</p>",'我知道了');
		    　　　　}else if(status=='timeout'){
		                $.MsgBox.Alert("<h3>解除失败</h3><br /><p style='text-align: left;'>原因：可能是请求服务器失败或者网络出了小差错<br/>1、您可以再次解绑试一试<br />2、退出公众号重新再进入试一试<br />如仍未解决，联系客服：4001821200</p>",'我知道了');
		            }
		    　　}
			});
	    });
		
	};
}

function headImgUpdate(){
	var headUrl=$('[name="headImgShow"]').val();
	if (headUrl) {
		$.ajax({
			url: apiL+'/api/wx/hand/add',
			type: 'POST',
			dataType: 'json',
			data: {userId:userId(),headUrl:headUrl,requestTokenId:requestTokenId()},
			success:function(data){
				if (data.success) {
					alert('上传成功');
					window.location.href='../../ucenter/ucenter.html';
				}else{
					alert(data.message);
				};
			}
		});
	}else{
		window.location.href='../../ucenter/ucenter.html';
	};
	
}