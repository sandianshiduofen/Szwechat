'use strict';
/*发货地址编辑*/
function consignerShow(){
	if (userId()) {
	/*编辑*/
		var edit=GetQueryString("edit");
		/*增加后跳到哪个页面*/
		var add=GetQueryString("add");
		/*修改运单*/
		var waybill=GetQueryString('waybill');
		if (edit) {
			$.ajax({
				url: apiL+'/api/wx/address/findedit',
				type: 'get',
				dataType: 'json',
				data: {id:edit,type:1,requestTokenId:requestTokenId()},
				success:function(data){
					if (data.success) {
						$('[name="client"]').val(data.info.company);
						$('[name="name"]').val(data.info.contact);
						$('[name="tel"]').val(data.info.phone);
						$('#addr_aera').html(data.info.proName+' '+data.info.cityName+' '+data.info.areaName).removeClass('c999');
						$('[name="detail"]').val(data.info.detailed);
						$('[name="aeraNum"]').val(data.info.proNumber+','+data.info.cityNumber+','+data.info.areaNumber);
						if (data.info.isDefault) {
							$('.tacitly_approve').html('<label><input type="checkbox" checked="checked" name="default"><span class="checkbox"></span><b id="">设为默认发货方</b></label>')
						}else{
							$('.tacitly_approve').html('<label><input type="checkbox" name="default"><span class="checkbox"></span><b id="">设为默认发货方</b></label>')
						};
						addr_aera2(data.info.proNumber,data.info.cityNumber,data.info.areaNumber);
					}else{
						alert(data.message)
					};
				}
			});
		}else{
			addr_aera2();
			document.title="新增发货方";
			if (add&&add=='addr') {
				$('.tacitly_approve').find('input').attr('checked', 'checked');
			};
			if (!add) {
				$('.tacitly_approve').find('input').attr('checked', 'checked');
			};
		}
	}else{
		window.location.href='../login/not_login.html'
	}
}
/*收货地址*/
function deliveryShow(){
	if (userId()) {
		var edit=GetQueryString("edit");
		var id=GetQueryString("id");
		if (edit) {
			$.ajax({
				url: apiL+'/api/wx/address/findedit',
				type: 'get',
				dataType: 'json',
				data: {id:edit,type:2,requestTokenId:requestTokenId()},
				success:function(data){
					if (data.success) {
						$('[name="client"]').val(data.info.company);
						$('[name="name"]').val(data.info.contact);
						$('[name="tel"]').val(data.info.phone);
						$('#addr_aera').html(data.info.proName+' '+data.info.cityName+' '+data.info.areaName).removeClass('c999');
						$('[name="detail"]').val(data.info.detailed);
						$('[name="aeraNum"]').val(data.info.proNumber+','+data.info.cityNumber+','+data.info.areaNumber);
						addr_aera2(data.info.proNumber,data.info.cityNumber,data.info.areaNumber);
					}else{
						alert(data.message)
					};
				}
			});
		}else{
			addr_aera2();
			document.title="新增收货方";
		}
	}else{
		window.location.href='../login/not_login.html'
	};
	/*编辑*/
		
}

/*发货地址簿删除*/
function del_addr(e,id){
	if(confirm('确定要删除吗？')){
		$.ajax({
			url: apiL+'/api/wx/address/findedit',
			type: 'post',
			dataType: 'json',
			data: {id:id,type:1,requestTokenId:requestTokenId()},
			success:function(data){
				var isDefault=data.info.isDefault;
				if (data.success) {
					$.ajax({
						url: apiL+'/api/wx/address/delete',
						type: 'post',
						dataType: 'json',
						data: {id:edit,type:1,userId:userId(),isDefault:isDefault,requestTokenId:requestTokenId()},
						success:function(data1){
							if (data1.success) {
								e.parents('.record_li').remove();
								if ($('.ship_li').length==0) {
									$('.record_list').html('<div class="ship_nofind"><span><img src="../skin/images/no_find.png" alt=""></span><p>对不起，您还没有添加地址</p></div>')
								};
							}else{
								alert(data1.message);
							};
						}
					});
				}else{
					alert(data.message);
				};
			}
		});
	}
};


/*发货方编辑提交验证*/
function consignerSubmit(){
	if (!noNullfa($('[name="client"]'),'单位名称')) {
		noNullfa($('[name="client"]'),'单位名称');
		return false;
	}else if(!nameLen($('[name="name"]').val())){
		nameLen($('[name="name"]').val());
		return false;
	}else if(!PhoneNo($('[name="tel"]'))){
		PhoneNo($('[name="tel"]'))
		return false;
	}else if(!noNull($('[name="aeraNum"]'),'所在省、市、区')){
		noNull($('[name="aeraNum"]'),'所在省、市、区');
		return false;
	}else if(!noNullfa($('[name="detail"]'),'详细地址')){
		noNullfa($('[name="detail"]'),'详细地址');
		return false;
	}else{
		var mycan=GetQueryString("order");
		if (mycan !=null && mycan==1) {
			window.location.href="../order/self_help_order.html";
		}else{
			window.location.href="../ucenter/ucenter.html";
		};
	}
}
/*发货方编辑提交*/
function shipSubmit(){
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
		loading('保存中...');
		/*编辑*/
		var edit=GetQueryString("edit");
		/*发货方地址编辑*/
		if (edit) {
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
			/*高德地图*/
			AMap.service('AMap.Geocoder',function(){
			    var geocoder = new AMap.Geocoder({});
			    geocoder.getLocation(aeraArr[0]+""+aeraArr[1]+""+aeraArr[2]+""+detailed, function(status, result) {
			    	loadingRemove();
				    if (status === 'complete' && result.info === 'OK') {
				        loading('保存中...');
				    	var data={
							userId:userId(),
							type:1,
							id:edit,
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
						// console.log(data);
			       		$.ajax({
							url: apiL+'/api/wx/address/edit',
							type: 'post',
							timeout : 10000,
							dataType: 'json',
							data: data,
							success:function(data){
								loadingRemove();
								if (data.success) {
									console.log(data);
									window.location.href="../ucenter/ship_address.html";
								}else{
									alert(data.message)
								};
							},
					        complete : function(XMLHttpRequest,status){
					            loadingRemove();
					    　　　　if(status=='error'){
					    			alert('修改失败请重新提交');
					    　　　　}else if(status=='timeout'){
					    			alert('修改失败请重新提交');
					            }
					    　　}
						});
						$('.footer_btn').attr('disabled', 'disabled');
						var timer=setTimeout(function(){
							clearTimeout(timer);
							$('.footer_btn').removeAttr('disabled');
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
							        loading('保存中...');
							    	var data={
										userId:userId(),
										type:1,
										id:edit,
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
										url: apiL+'/api/wx/address/edit',
										type: 'post',
										timeout : 10000,
										dataType: 'json',
										data: data,
										success:function(data){
											loadingRemove();
											if (data.success) {
												window.location.href="../ucenter/ship_address.html";
											}else{
												alert(data.message)
											};
										},
								        complete : function(XMLHttpRequest,status){
								            loadingRemove();
								    　　　　if(status=='error'){
					    						alert('修改失败请重新提交');
								    　　　　}else if(status=='timeout'){
								     　　　　　	alert('修改失败请重新提交');
								            }
								    　　}
									});
									$('.footer_btn').attr('disabled', 'disabled');
									var timer=setTimeout(function(){
										clearTimeout(timer);
										$('.footer_btn').removeAttr('disabled');
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
			/*发货方地址新增*/
			var company=trim($('[name="client"]').val());
			var contact=trim($('[name="name"]').val());
			var phone=$('[name="tel"]').val();
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
				        loading('保存中...');
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
							lat:result.geocodes[0].location.lat,
							lng:result.geocodes[0].location.lng,
							detailed:detailed,
							requestTokenId:requestTokenId()
						};
						$.ajax({
							url: apiL+'/api/wx/address/add',
							type: 'get',
							dataType: 'json',
							data: data,
							success:function(data){
			    				loadingRemove();
								if (data.success) {
									// console.log(data);
									window.location.href="../ucenter/ship_address.html";
								}else{
									alert(data.message)
								};
							}
						});
						$('.footer_btn').attr('disabled', 'disabled');
						var timer=setTimeout(function(){
							clearTimeout(timer);
							$('.footer_btn').removeAttr('disabled');
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
							        loading('保存中...');
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
										lat:result.geocodes[0].location.lat,
										lng:result.geocodes[0].location.lng,
										detailed:detailed,
										requestTokenId:requestTokenId()
									};
									$.ajax({
										url: apiL+'/api/wx/address/add',
										type: 'get',
										dataType: 'json',
										data: data,
										success:function(data){
						    				loadingRemove();
											if (data.success) {
												window.location.href="../ucenter/ship_address.html";
											}else{
												alert(data.message)
											};
										}
									});
									$('.footer_btn').attr('disabled', 'disabled');
									var timer=setTimeout(function(){
										clearTimeout(timer);
										$('.footer_btn').removeAttr('disabled');
									}, 5000);
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



/*收货方编辑提交验证*/
function receivingSubmit(){
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
		loading('保存中...');
		/*编辑*/
		var edit=GetQueryString("edit");
		/*收货方编辑*/
		if (edit) {
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
				        loading('保存中...');
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
							id:edit,
							lat:result.geocodes[0].location.lat,
							lng:result.geocodes[0].location.lng,
							isDefault:0,
							requestTokenId:requestTokenId()
						};
						$.ajax({
							url: apiL+'/api/wx/address/edit',
							type: 'post',
							dataType: 'json',
							data: data,
							success:function(data){
								loadingRemove();
								if (data.success) {
									window.location.href="../ucenter/receiving_party.html";
								}else{
									alert(data.message);
								};
							}
						});
						$('.footer_btn').attr('disabled', 'disabled');
						var timer=setTimeout(function(){
							clearTimeout(timer);
							$('.footer_btn').removeAttr('disabled');
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
							        loading('保存中...');
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
										id:edit,
										lat:result.geocodes[0].location.lat,
										lng:result.geocodes[0].location.lng,
										isDefault:0,
										requestTokenId:requestTokenId()
									};
									$.ajax({
										url: apiL+'/api/wx/address/edit',
										type: 'post',
										dataType: 'json',
										data: data,
										success:function(data){
											loadingRemove();
											if (data.success) {
												window.location.href="../ucenter/receiving_party.html";
											}else{
												alert(data.message);
											};
										}
									});
									$('.footer_btn').attr('disabled', 'disabled');
									var timer=setTimeout(function(){
										clearTimeout(timer);
										$('.footer_btn').removeAttr('disabled');
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
				        loading('保存中...');
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
							lat:result.geocodes[0].location.lat,
							lng:result.geocodes[0].location.lng,
							detailed:detailed,
							requestTokenId:requestTokenId() 
						};
						$.ajax({
							url: apiL+'/api/wx/address/add',
							type: 'post',
							dataType: 'json',
							data: data,
							success:function(data){
								loadingRemove();
								if (data.success) {
									window.location.href="../ucenter/receiving_party.html";
								}else{
									alert(data.message);
								};
							}
						});
						$('.footer_btn').attr('disabled', 'disabled');
						var timer=setTimeout(function(){
							clearTimeout(timer);
							$('.footer_btn').removeAttr('disabled');
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
							    	loading('保存中...');
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
										lat:result.geocodes[0].location.lat,
										lng:result.geocodes[0].location.lng,
										detailed:detailed,
										requestTokenId:requestTokenId()
									};
									$.ajax({
										url: apiL+'/api/wx/address/add',
										type: 'post',
										dataType: 'json',
										data: data, 
										success:function(data){
											loadingRemove();
											if (data.success) {
												window.location.href="../ucenter/receiving_party.html";
											}else{
												alert(data.message);
											};
										}
									});
									$('.footer_btn').attr('disabled', 'disabled');
									var timer=setTimeout(function(){
										clearTimeout(timer);
										$('.footer_btn').removeAttr('disabled');
									}, 5000);
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
