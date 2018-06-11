 'use strict';

/*以下为发货地址薄*/
/*发货地址薄列表（默认）*/
function shipAddress(){
	$('.header_title,.header_goback').attr('onclick', 'window.location.href="../ucenter/ucenter.html"');
	loading('loading...');
	$.ajax({
		url: apiL+'/api/wx/address/find',
		type: 'get',
		dataType: 'json',
		timeout : 10000,
		data: {userId:userId(),type:1,requestTokenId:requestTokenId()},
		success:function(data){
			loadingRemove();
			if (data.success) {
				if (data.info.length) {
					shipAddrList(data);
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
     　　　　　 noResultErr($('.record_list'),400,'请求超时，请点击重新获取','shipAddress()');
    　　　　}else if(status=='timeout'){
                noResultErr($('.record_list'),400,'请求超时，请点击重新获取','shipAddress()');
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
/*发货地址薄内容{默认} */

function shipAddrList(data){
	var info = data.info;
	var html="";
	for(var i = 0; i < info.length; i++){
		if (info[i].isDefault) {
			html+='<div class="record_li ship_li" data-id="'+info[i].id+'">'
			+'<table width="w100">'
				+'<col width="74%">'
				+'<col width="20%">'
				+'<tr><td>发 货 方：'+info[i].company+'</td><td class="t_r moren"><span class="red">默认发货</span></td></tr>'
				if (info[i].contact) {
					html+='<tr><td colspan="2">联 系 人：'+info[i].contact+'</td></tr>'
				};
				html+='<tr><td colspan="2">电&#x3000;&#x3000;话：'+info[i].phone+'<br></td></tr>'
				+'<tr><td colspan="2">发货地址：'+info[i].proName+''+info[i].cityName+''+info[i].areaName+''+info[i].detailed+'<br></td></tr></table>'
			+'<div class="show_details ov_h">'
				+'<label class="ship_moren"></label>'
				+'<a class="f_r f14" href="javascript:;" onclick="del_addr($(this),'+info[i].id+')">删除</a>'
				+'<a class="f_r f14" href="../ucenter/consigner_edit.html?edit='+info[i].id+'">编辑</a>'
			+'</div>'
		+'</div>'
		}else{
			html+='<div class="record_li ship_li"  data-id="'+info[i].id+'">'
				+'<table width="w100" >'
					+'<col width="74%">'
					+'<col width="20%">'
					+'<tr><td>发 货 方：'+info[i].company+'</td><td class="t_r moren"></td></tr>'
				if (info[i].contact) {
					html+='<tr><td colspan="2">联 系 人：'+info[i].contact+'</td></tr>'
				};
				html+='<tr><td colspan="2">电&#x3000;&#x3000;话：'+info[i].phone+'<br></td></tr>'
				+'<tr><td colspan="2">发货地址：'+info[i].proName+''+info[i].cityName+''+info[i].areaName+''+info[i].detailed+'<br></td></tr></table>'
				+'</table>'
				+'<div class="show_details ov_h">'
					+'<label class="ship_moren"><input type="radio" name="default"><span class="radio"></span>设置为默认发货方</label>'
					+'<a class="f_r f14" href="javascript:;" onclick="del_addr($(this),'+info[i].id+')">删除</a>'
					+'<a class="f_r f14" href="../ucenter/consigner_edit.html?edit='+info[i].id+'">编辑</a>'
				+'</div>'
			+'</div>'
		};
	};
	$('.record_list').html(html);
};

/*发货地址搜索（默认）*/
function receiveSearch(){
	var search=$('.search_input').val();
	loading('查询中...');
	var data={
		userId:userId(),
		type:1,
		searchParam:search,
		requestTokenId:requestTokenId()
	};
	if (search){
		$.ajax({
			url: api+'/api/wx/address/find',
			type: 'get',
			dataType: 'json',
			timeout : 10000,
			data: data,
			success:function(data){
				loadingRemove();
				if (data.success) {
					if (data.info.length) {
						shipAddrList(data);
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
	     　　　　　 noResultErr($('.record_list'),400,'请求超时，请点击重新获取','receiveSearch()');
	    　　　　}else if(status=='timeout'){
	                noResultErr($('.record_list'),400,'请求超时，请点击重新获取','receiveSearch()');
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
				loadingRemove();
				if (data.success) {
					if (data.info.length) {
						shipAddrList(data);
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
	     　　　　　 noResultErr($('.record_list'),400,'请求超时，请点击重新获取','shipAddress()');
	    　　　　}else if(status=='timeout'){
	                noResultErr($('.record_list'),400,'请求超时，请点击重新获取','shipAddress()');
	            }
	    　　}
		});
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
				+'<a class="f_r f14" onclick="consignerEdit('+data.info[i].id+')" href="javascript:;">编辑</a>'
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
				+'<label class="ship_moren"><input type="radio" ><span class="radio"></span>设置为默认发货方</label>'
				+'<a class="f_r f14" href="javascript:;" onclick="del_addr($(this),'+data.info[i].id+')">删除</a>'
				+'<a class="f_r f14" onclick="consignerEdit('+data.info[i].id+')" href="javascript:;">编辑</a>'
			+'</div>'
		+'</div>'
		};
	};
	$('.record_list').html(html);
}

/*发货地址薄搜索（自助下单）*/
/*function selfAddrsearch(){
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
			}
		});
	}else{
		$.ajax({
			url: apiL+'/api/wx/address/find',
			type: 'get',
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
			}
		});
	};
}*/
/*以上为发货地址薄*/

/*以下为收货地址薄*/
/*收货地址列表*/
function receivingParty(){
	$('.header_title,.header_goback').attr('onclick', 'window.location.href="../ucenter/ucenter.html"');
	loading('loading...');
	$.ajax({
		url: apiL+'/api/wx/address/find',
		type: 'get',
		dataType: 'json',
		timeout : 10000,
		data: {userId:userId(),type:2,requestTokenId:requestTokenId()},
		success:function(data){
			loadingRemove();
			if (data.success) {
				if (data.info.length) {
					// console.log(data);
					shipReceList(data);
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
     　　　　　 noResultErr($('.record_list'),400,'请求超时，请点击重新获取','receivingParty()');
    　　　　}else if(status=='timeout'){
                noResultErr($('.record_list'),400,'请求超时，请点击重新获取','receivingParty()');
            }
    　　}
	});
}
/*收货地址筛选搜索(默认)*/
function searchRec(){
	loading('loading...');
	var search=$('.search_input').val();
	var data={
		userId:userId(),
		type:2,
		searchParam:search,
		requestTokenId:requestTokenId()
	}
	if (search){
		$.ajax({
			url: api+'/api/wx/address/find',
			type: 'post',
			timeout : 10000,
			dataType: 'json',
			data: data,
			success:function(data){
				loadingRemove();
				if (data.success) {
					if (data.info.length) {
						shipReceList(data);
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
	     　　　　　 noResultErr($('.record_list'),400,'请求超时，请点击重新获取','searchRec()');
	    　　　　}else if(status=='timeout'){
	                noResultErr($('.record_list'),400,'请求超时，请点击重新获取','searchRec()');
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
						selfReceAddr(data)
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
	     　　　　　 noResultErr($('.record_list'),400,'请求超时，请点击重新获取','searchRec()');
	    　　　　}else if(status=='timeout'){
	                noResultErr($('.record_list'),400,'请求超时，请点击重新获取','searchRec()');
	            }
	    　　}
		});
	};
}
/*收货地址列表内容（默认）*/
function shipReceList(data){
	var html="";
	for (var i = 0; i < data.info.length; i++) {
		html+='<div class="record_li ship_li"  data-id="'+data.info[i].id+'">'
			+'<table width="w100">'
				+'<tr><td>收&nbsp; 货 方：'+data.info[i].company+'</td></tr>'
				if (data.info[i].contact) {
					html+='<tr><td colspan="2">联&nbsp; 系 人：'+data.info[i].contact+'</td></tr>'
				};
				html+='<tr><td colspan="2">电&#x3000;&#x3000;话：'+data.info[i].phone+'<br></td></tr>'
				+'<tr><td colspan="2">收货地址：'+data.info[i].proName+''+data.info[i].cityName+''+data.info[i].areaName+''+data.info[i].detailed+'<br></td></tr>'
			+'</table>'
			+'<div class="show_details ov_h">'
				+'<a class="f_r f14" href="javascript:;" onclick="del_rec($(this),'+data.info[i].id+')">删除</a>'
				+'<a class="f_r f14" href="../ucenter/receiving_edit.html?edit='+data.info[i].id+'">编辑</a>'
			+'</div>'
		+'</div>'
	};
	$('.record_list').html(html);
}

/*收货地址内容（自助下单）*/
function selfReceAddr(data){
	var html="";
	for (var i = 0; i < data.info.length; i++) {
		html+='<div class="record_li ship_li" data-id="'+data.info[i].id+'">'
			+'<table width="w100" onclick=recTrue("'+data.info[i].id+'")>'
				+'<tr><td>收&nbsp; 货 方：'+data.info[i].company+'</td></tr>';
				if (data.info[i].contact) {
					html+='<tr><td colspan="2">联&nbsp; 系 人：'+data.info[i].contact+'</td></tr>'
				};
				html+='<tr><td colspan="2">电&#x3000;&#x3000;话：'+data.info[i].phone+'<br></td></tr>'
				+'<tr><td colspan="2">收货地址：'+data.info[i].proName+''+data.info[i].cityName+''+data.info[i].areaName+''+data.info[i].detailed+'<br></td></tr>'
			+'</table>'
			+'<div class="show_details ov_h">'
				+'<a class="f_r f14" href="javascript:;" onclick="del_rec($(this),'+data.info[i].id+')">删除</a>'
				+'<a class="f_r f14" onclick="recrivingEdit('+data.info[i].id+')" href="javascript:;">编辑</a>'
			+'</div>'
		+'</div>'
	};
	$('.record_list').html(html);
}
/*收货地址搜索（自助下单）*/
function selfRecsearch(){
	var search=$('.search_input').val();
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
			dataType: 'json',
			data: data,
			success:function(data){
				if (data.success) {
					if (data.info.length) {
						selfReceAddr(data);
					}else{
						noshipsearch(search);
					};
				}else{
					alert(data.message)
				};
			}
		});
	}else{
		$.ajax({
			url: apiL+'/api/wx/address/find',
			type: 'get',
			dataType: 'json',
			data: {userId:userId(),type:2,requestTokenId:requestTokenId()},
			success:function(data){
				if (data.success) {
					if (data.info.length) {
						selfReceAddr(data);
					}else{
						noshipsearch();
					}
				}else{
					alert(data.message)
				};
			}
		});
	};
}
/*以上为收货地址薄*/

/*发货地址簿删除*/
function del_addr(e,id){
	$.MsgBox.ConfirmL("确定要删除吗？",'取消','确定',function(){
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
						data: {type:1,id:id,userId:userId,isDefault:isDefault,requestTokenId:requestTokenId()},
						success:function(data1){
							if (data1.success) {
								shipAddress();
								e.parents('.record_li').remove();	
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
			dataType: 'json',
			data: {type:2,id:id,userId:userId(),isDefault:0,requestTokenId:requestTokenId()},
			success:function(data){
				loadingRemove();
				if (data.success) {
					e.parents('.record_li').remove();
					if ($('.ship_li').length==0) {
						$('.record_list').html('<div class="ship_nofind"><span><img src="../skin/images/no_find.png" alt=""></span><p>对不起，您还没有添加地址</p></div>')
					};
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
function addrTrue(id){
	$.ajax({
		url: apiL+'/api/wx/address/findedit',
		type: 'get',
		dataType: 'json',
		data: {type:1,id:id,requestTokenId:requestTokenId()},
		success:function(data){
			if (data.success) {
				sessionStorage.consigner='{"company":"'+data.info.company+'","tel":'+data.info.phone+',"provs":"'+data.info.proName+'","city":"'+data.info.cityName+'","dists":"'+data.info.areaName+'","detail":"'+data.info.detailed+'","name":"'+data.info.contact+'","citynum":"'+data.info.proNumber+','+data.info.cityNumber+','+data.info.areaNumber+'"}';
				if (!GetQueryString('waybill')) {
					window.location.href="../order/self_help_order.html";
				}else{
					window.location.href="../order/self_help_order.html?waybill="+GetQueryString('selfHp')+"&amend=1";
				};
			}else{
				alert(data.message);
			};
		}
	});
}
function recTrue(id){
	$.ajax({
		url: apiL+'/api/wx/address/findedit',
		type: 'get',
		dataType: 'json',
		data: {type:2,id:id,requestTokenId:requestTokenId()},
		success:function(data){
			if (data.success) {
				sessionStorage.delivery='{"company":"'+data.info.company+'","tel":'+data.info.phone+',"provs":"'+data.info.proName+'","city":"'+data.info.cityName+'","dists":"'+data.info.areaName+'","detail":"'+data.info.detailed+'","name":"'+data.info.contact+'","citynum":"'+data.info.proNumber+','+data.info.cityNumber+','+data.info.areaNumber+'"}';
				if (!GetQueryString('waybill')) {
					window.location.href="../order/self_help_order.html";
				}else{
					window.location.href="../order/self_help_order.html?waybill="+GetQueryString('selfHp')+"&amend=1";
				};
			}else{
				alert(data.message)
			};
		}
	});
}