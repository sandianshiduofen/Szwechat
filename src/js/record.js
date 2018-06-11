'use strict';

// 发货列表
function sendOutList(page){
	loading('加载中...');
	var search=GetQueryString('search');
	var state=GetQueryString('status');
	var startTimeCuo=GetQueryString('startTime');
	var endTimeCuo=GetQueryString('endTime');
	/*获取当前以及一个月前的时间*/
	var dataTime=new Date();
	var curYear=dataTime.getFullYear();
	var curMonth=addZero(dataTime.getMonth()+1);
	var curDays=addZero(dataTime.getDate());
	var curTime=curYear+'/'+curMonth+'/'+curDays;
	var curSerTime=curYear+'-'+curMonth+'-'+curDays;
	/*var prevData=new Date(dataTime-2592000000);
	var prevYear=prevData.getFullYear();
	var prevMonth=addZero(prevData.getMonth()+1);
	var prevDays=addZero(prevData.getDate());
	var prevTime=prevYear+'/'+prevMonth+'/'+prevDays;
	var prevSerTime=prevYear+'-'+prevMonth+'-'+prevDays;*/
	// 获取筛选时间
	if (startTimeCuo&&endTimeCuo) {
		var startTime = new Date();
		startTime.setTime(startTimeCuo);
		var startTimeShow=startTime.format('yyyy/MM/dd');
		var startTimeChange=startTime.format('yyyy-MM-dd');
		var endTime = new Date();
		endTime.setTime(endTimeCuo);
		var endTimeShow=endTime.format('yyyy/MM/dd');
		var endTimeChange=endTime.format('yyyy-MM-dd');

	}
	var searchhtml="";
	if (startTime && endTime) {
		searchhtml='<span class="swiper-slide">'+startTimeShow+'-'+endTimeShow+'</span>';
	};
	/*状态*/
	if (state===0||state) {
		var stateArr=state.split(',');
		var selestStatus="";
		var selestStatusArr=[];
		for (var i = 0; i < stateArr.length; i++) {
			if (stateArr[i]=='0') {
				selestStatus="待揽货";
			}else if(stateArr[i]==1){
				selestStatus="已揽货";
			}else if(stateArr[i]==2){
				selestStatus="运输中";
			}else if(stateArr[i]==3){
				selestStatus="配送中";
			}else if(stateArr[i]==6){
				selestStatus="已签收";
			}else if(stateArr[i]==4){
				selestStatus="取消发货";
			}else if(stateArr[i]==5){
				selestStatus="已退货";
			}else if(stateArr[i]==7){
				selestStatus="已驳回";
			};
			selestStatusArr.push(selestStatus);
		};

		for (var i = 0; i < selestStatusArr.length; i++) {
			searchhtml+='<span  class="swiper-slide">'+selestStatusArr[i]+'</span>';
		};
	};

	$('.swiper-wrapper').html(searchhtml);
	

	if (((startTimeCuo&&endTimeCuo)||state===0||state)) {
		if (stateArr) {
			for (var i = 0; i < stateArr.length; i++) {
				$('.filtrateTop ul [value="'+stateArr[i]+'"]').attr('checked', 'checked');
			};
		};
		$('#date_start').val(startTimeChange);
		$('#date_end').val(endTimeChange);
		var data={
			senderId:number(),
			pageSize:15,
			currentPage:page,
			status:state,
			startTime:startTimeCuo,
			endTime:endTimeCuo,
			requestTokenId:requestTokenId()
		};
		$.ajax({
			url: apiAn+'/api/wx/waybill/selectWaybillForSender',
			type: 'POST',
			dataType: 'json',
			timeout : 10000,
			data: data,
			success:function(data){
				if (data.success) {
					loadingRemove();
					sess.sendPages=data.info.pages
					correspCon(data.info,startTimeChange,endTimeChange,state);
				}else{
					alert(data.message)
				};
			},
	        complete : function(XMLHttpRequest,status){
	            loadingRemove();
	    　　　　if(status=='error'){
	    			sess.nowSendPage=1;
	     　　　　　 noResultErr($('.record_list'),400,'请求超时，请点击重新获取','sendOutList(1)');
	     			$('.loading').html('');
	    　　　　}else if(status=='timeout'){
	    			sess.nowSendPage=1;
	                noResultErr($('.record_list'),400,'请求超时，请点击重新获取','sendOutList(1)');
	     			$('.loading').html('');
	            }
	    　　}
		});
	}else{
		$.ajax({
			url: apiAn+'/api/wx/waybill/selectWaybillForSender',
			type: 'POST',
			dataType: 'json',
			timeout : 10000,
			data: {senderId:number(),pageSize:15,currentPage:page,requestTokenId:requestTokenId()},
			success:function(data){
				loadingRemove();
				if (data.success) {
					// console.log(data);
					sess.sendPages=data.info.pages
					correspCon(data.info);
				}else{
					alert(data.message);
				};
			},
	        complete : function(XMLHttpRequest,status){
	            loadingRemove();
	    　　　　if(status=='error'){
	    			sess.nowSendPage=1;
	     　　　　　 noResultErr($('.record_list'),400,'请求超时，请点击重新获取','sendOutList(1)');
	     			$('.loading').html('');
	    　　　　}else if(status=='timeout'){
	    			sess.nowSendPage=1;
	                noResultErr($('.record_list'),400,'请求超时，请点击重新获取','sendOutList(1)');
	     			$('.loading').html('');
	            }
	    　　}
		});
	};
	var swiper = new Swiper('.swiper-container', {
		scrollbar: '.swiper-scrollbar',
		scrollbarHide: true,
		slidesPerView: 'auto',
		// centeredSlides: true,
		// spaceBetween: 10,
		grabCursor: true
	});
	return true;
}

/*收发货搜索列表*/
function corresponSearch(current){
	/*获取当前以及一个月前的时间*/
	var dataTime=new Date();
	var curYear=dataTime.getFullYear();
	var curMonth=addZero(dataTime.getMonth()+1);
	var curDays=addZero(dataTime.getDate());
	var curTime=curYear+'/'+curMonth+'/'+curDays;
	/*var prevData=new Date(dataTime-2592000000);
	var prevYear=prevData.getFullYear();
	var prevMonth=addZero(prevData.getMonth()+1);
	var prevDays=addZero(prevData.getDate());
	var prevTime=prevYear+'/'+prevMonth+'/'+prevDays;*/

	/*获取选中的状态*/
	var statu=$('[name="state"]');
	var statuArr=[];
	for (var i = 0; i < statu.length; i++) {
		if (statu.eq(i).attr('checked')) {
			statuArr.push(statu.eq(i).val());
		};
	};
	var status=statuArr.toString();
	
	/*当状态为待揽货时*/
	if (status===0) {
		var statusJ=true;
	};

	var startTime=$('#date_start').val();
	var endTime=$('#date_end').val();
	var startArr=startTime.split('-');
	var endArr=endTime.split('-');
	var searchhtml="";
	
	/*开始结束时间搓*/
	var startTimeT=new Date(startArr[0],startArr[1]-1,startArr[2]);
	var EndTimeT=new Date(endArr[0],endArr[1]-1,endArr[2],23,59,59);
	var startTimeCuo=startTimeT.getTime();
	var endTimecuo=EndTimeT.getTime();
	if (!startTimeCuo) {
		startTimeCuo="";
	};
	if (!endTimecuo) {
		endTimecuo="";
	};
	if(!startTimeCuo&&endTimecuo){
		alert('请选择开始日期');
		return false;
	}else if(startTimeCuo&&!endTimecuo){
		alert('请选择截止日期');
		return false;
	}

	/*当为搜索的时候*/
	if ((startTimeCuo&&endTimecuo)||statusJ||status) {
		if ((startTimeCuo&&endTimecuo)&&parseInt(endTimecuo)<parseInt(startTimeCuo)) {
			alert('结束日期不可大于开始日期');
			$('#date_start').val($('#date_end').val());
		}else{
			var data={
				senderId:number(),
				pageSize:15,
				currentPage:current,
				status:status,
				startTime:startTimeCuo,
				endTime:endTimecuo
			}
			window.location.href=window.location.pathname+'?search=1&status='+status+'&startTime='+startTimeCuo+'&endTime='+endTimecuo;
		};
	}else{
		window.location.href=window.location.pathname;
	};
}


/*发货列表内容*/
function correspCon(info,startTime,endTime,state){
	var html="";
	var ahtml="";
	if (info.list) {
		for(var i = 0; i < info.list.length; i++){
			var status=info.list[i].status;
			var statusShow="";
			if (status=='0') {
				statusShow="待揽货";
			}else if(status==1){
				statusShow="已揽货";
			}else if(status==2){
				statusShow="运输中";
			}else if(status==3){
				statusShow="配送中";
			}else if(status==6){
				statusShow="已签收";
			}else if(status==4){
				statusShow="取消发货";
			}else if(status==5){
				statusShow="已退货";
			}else if(status==7){
				statusShow="已驳回";
			};
			html+='<div class="record_li" data-id="'+info.list[i].id+'"><table>'
				+'<col width="52%"><col width="24%"><col width="17%">'
				+'<tr><td colspan="2">揽货网点：'+info.list[i].inputDotName+'</td>'
					+'<td class="t_r"><span class="red">'+statusShow+'</span></td>'
				+'</tr><tr>'
					+'<td>运单编号：'+info.list[i].no+'</td>'
					+'<td colspan="2">货物件数：'+info.list[i].goodsQuantity+'</td>'
				+'</tr><tr>'
					+'<td colspan="2">收 货 方：<b>'+info.list[i].receiverName+'</b></td>'
					+'<td><a href="tel:'+info.list[i].receiverMobile+'"><img src="../skin/images/tel.png" alt="电话"></a></td>'
				+'</tr></table>'
			+'<div class="show_details ov_h">';
				if (info.list[i].status==0) {
					html+='<a class="f_r f14" href="../order/scan.html?order='+info.list[i].no+'">运单条码</a>'
				};
				html+='<a class="f_r f14" href="../order/logistics.html?order='+info.list[i].no+'">运单详情</a>'
				if (info.list[i].status<4) {
					html+='<a class="f_r f14" href="../order/self_help_order.html?waybill='+info.list[i].no+'">修改运单</a>'
				};
			html+='</div></div>';
		};
		if (info.currentPage==1) {
			$('#record_list').html(html);
		}else{
			$('#record_list').append(html);
		};
	}else{
		$('.loading').html('');
		if (state===0) {
			var statusJ=true;
		};
		if ((startTime&&endTime) || statusJ||state) {
			if (!(startTime&&endTime)) {
				startTime="";
				endTime="";
			};
			if (state.length<1) {
				state="";
			};
			var statuArr=state.split(',');
			var stateA=[];
			var statu="";
			for (var i = 0; i < statuArr.length; i++) {
				if (statuArr[i]=='0') {
					statu="待揽货";
				}else if(statuArr[i]==1){
					statu="已揽货";
				}else if(statuArr[i]==2){
					statu="运输中";
				}else if(statuArr[i]==3){
					statu="配送中";
				}else if(statuArr[i]==6){
					statu="已签收";
				}else if(statuArr[i]==4){
					statu="取消发货";
				}else if(statuArr[i]==5){
					statu="已退货";
				}else if(statuArr[i]==7){
					statu="已驳回";
				};
				stateA.push(statu);
			};
			var statusStr=stateA.toString();
			$('#record_list').html('<div class="ship_nofind"><span><img src="../skin/images/no_find.png" alt=""></span><p>对不起，没有找到“'+statusStr+''+startTime+' '+endTime+'”的</br>相关信息，请重新输入。</p></div>');
		}else{
			$('#record_list').html('<div class="ship_nofind"><span><img src="../skin/images/no_find.png" alt=""></span><p>您还没有发货记录</p></div>');
		};
	}
}


// 收货列表
function recordOutList(page){
	loading('加载中...');
	var search=GetQueryString('search');
	var state=GetQueryString('status');
	var startTimeCuo=GetQueryString('startTime');
	var endTimeCuo=GetQueryString('endTime');
	/*获取当前以及一个月前的时间*/
	var dataTime=new Date();
	var curYear=dataTime.getFullYear();
	var curMonth=addZero(dataTime.getMonth()+1);
	var curDays=addZero(dataTime.getDate());
	var curTime=curYear+'/'+curMonth+'/'+curDays;
	var curSerTime=curYear+'-'+curMonth+'-'+curDays;
	/*var prevData=new Date(dataTime-2592000000);
	var prevYear=prevData.getFullYear();
	var prevMonth=addZero(prevData.getMonth()+1);
	var prevDays=addZero(prevData.getDate());
	var prevTime=prevYear+'/'+prevMonth+'/'+prevDays;
	var prevSerTime=prevYear+'-'+prevMonth+'-'+prevDays;*/
	// 获取筛选时间
	if (startTimeCuo&&endTimeCuo) {
		var startTime = new Date();
		startTime.setTime(startTimeCuo);
		var startTimeShow=startTime.format('yyyy/MM/dd');
		var startTimeChange=startTime.format('yyyy-MM-dd');
		var endTime = new Date();
		endTime.setTime(endTimeCuo);
		var endTimeShow=endTime.format('yyyy/MM/dd');
		var endTimeChange=endTime.format('yyyy-MM-dd');
	}
	/*var startCurTimeCuo=Date.parse(prevData);
	var endCurTimeCuo=Date.parse(dataTime);*/

	var searchhtml="";
	if (startTime && endTime) {
		searchhtml+='<span class="swiper-slide">'+startTimeShow+'-'+endTimeShow+'</span>';
	}/*else{
		searchhtml+='<span class="swiper-slide">'+prevTime+'-'+curTime+'</span>';
	};*/
	/*状态*/
	if (state===0||state) {
		var stateArr=state.split(',');
		var selestStatus="";
		var selestStatusArr=[];
		for (var i = 0; i < stateArr.length; i++) {
			if (stateArr[i]=='0') {
				selestStatus="待揽货";
			}else if(stateArr[i]==1){
				selestStatus="已揽货";
			}else if(stateArr[i]==2){
				selestStatus="运输中";
			}else if(stateArr[i]==3){
				selestStatus="配送中";
			}else if(stateArr[i]==6){
				selestStatus="已签收";
			}else if(stateArr[i]==4){
				selestStatus="取消发货";
			}else if(stateArr[i]==5){
				selestStatus="已退货";
			}else if(stateArr[i]==7){
				selestStatus="已驳回";
			};
			selestStatusArr.push(selestStatus);
		};
		for (var i = 0; i < selestStatusArr.length; i++) { 
			searchhtml+='<span class="swiper-slide">'+selestStatusArr[i]+'</span>';
		};
	};
	$('.swiper-wrapper').html(searchhtml);
	/*$('#date_start').val(prevSerTime);
	$('#date_end').val(curSerTime);*/

	if (((startTimeCuo&&endTimeCuo)||state=='0'||state)) {
		if (stateArr) {
			for (var i = 0; i < stateArr.length; i++) {
				$('.filtrateTop ul [value="'+stateArr[i]+'"]').attr('checked', 'checked');
			};
		};
		
		$('#date_start').val(startTimeChange);
		$('#date_end').val(endTimeChange);
		
		var data={
			pageSize:15,
			currentPage:page,
			status:state,
			startTime:startTimeCuo,
			endTime:endTimeCuo,
			// receiverMobile:userName(),
			receiverId:number(),
			requestTokenId:requestTokenId()
		};

		$.ajax({
			url: apiAn+'/api/wx/waybill/list/receiver',
			type: 'POST',
			timeout : 10000,
			dataType: 'json',
			data: data,
			success:function(data){
				if (data.success) {
					loadingRemove();
					sess.recordPages=data.info.pages;
					console.log(data)
					receiveCon(data.info,state,startTimeChange,endTimeChange);
				}else{
					alert(data.message);
				};
			},
	        complete : function(XMLHttpRequest,status){
	            loadingRemove();
	    　　　　if(status=='error'){
	    			sess.nowRecPage=1;
	     　　　　　 noResultErr($('.record_list'),400,'请求超时，请点击重新获取','recordOutList(1)');
	     			$('.loading').html('');
	    　　　　}else if(status=='timeout'){
	    			sess.nowRecPage=1;
	                noResultErr($('.record_list'),400,'请求超时，请点击重新获取','recordOutList(1)');
	     			$('.loading').html('');
	            }
	    　　}
		});
	}else{
		$.ajax({
			url: apiAn+'/api/wx/waybill/list/receiver',
			type: 'POST',
			timeout : 10000,
			dataType: 'json',
			data: {
				receiverId:number(),
				pageSize:15,
				currentPage:page,
				requestTokenId:requestTokenId()
			},
			success:function(data){
				if (data.success) {
					loadingRemove();
					console.log(data)
					sess.recordPages=data.info.pages;
					receiveCon(data.info);
				}else{
					alert(data.message);
				};
			},
	        complete : function(XMLHttpRequest,status){
	            loadingRemove();
	    　　　　if(status=='error'){
	    			sess.nowRecPage=1;
	     　　　　　 noResultErr($('.record_list'),400,'请求超时，请点击重新获取','recordOutList(1)');
	     			$('.loading').html('');
	    　　　　}else if(status=='timeout'){
	    			sess.nowRecPage=1;
	                noResultErr($('.record_list'),400,'请求超时，请点击重新获取','recordOutList(1)');
	     			$('.loading').html('');
	            }
	    　　}
		});
	};
	var swiper = new Swiper('.swiper-container', {
		scrollbar: '.swiper-scrollbar',
		scrollbarHide: true,
		slidesPerView: 'auto',
		// spaceBetween: 10,
		grabCursor: true
	});
	return true;
}

/*收货列表内容*/
function receiveCon(info,status,startTime,endTime){
	var pages=info.pages;
	var html="";
	var ahtml="";
	if (info.list) {
		for(var i = 0; i < info.list.length; i++){
			var status=info.list[i].status;
			switch(status){
				case 0:
					status="待揽货"
					break;
				case 1:
					status="已揽货"
					break;
				case 2:
					status="运输中"
					break;
				case 3:
					status="配送中"
					break;
				case 4:
					status="取消发货"
					break;
				case 5:
					status="已退货"
					break;
				case 6:
					status="已签收"
					break;
				case 7:
					status="已驳回"
					break;
			};
			html+='<div class="record_li"><table><col width="52%"><col width="24%"><col width="17%">'
					+'<tr><td colspan="2">运单编号：'+info.list[i].no+'</td>'
						+'<td class="t_r"><span class="red">'+status+'</span></td></tr>'
					+'<tr><td colspan="3">货物件数：'+info.list[i].goodsQuantity+'</td></tr>'
						+'<tr><td colspan="2">发 货 方：<b>'+info.list[i].senderName+'</b></td>'
						+'<td><a href="tel:'+info.list[i].senderMobile+'"><img src="../skin/images/tel.png" alt="电话"></a></td></tr></table>'
				+'<div class="show_details ov_h"><a class="f_r f14" href="../order/logistics2.html?order='+info.list[i].no+'">运单详情</a></div>'
			+'</div>';
		};
		if (info.currentPage==1) {
			$('#record_list').html(html);
		}else{
			$('#record_list').append(html);
		};
	}else{
		$('.loading').html('');
		if ((startTime&&endTime) || status) {
			if (!(startTime&&endTime)) {
				startTime="";
				endTime="";
			};
			if (status.length<1) {
				status="";
			};
			var statuArr=status.split(',');
			var state=[];
			var statu="";
			for (var i = 0; i < statuArr.length; i++) {
				if(statuArr[i]=='0'){
					statu="未揽货";
				}else if(statuArr[i]==1){
					statu="已揽货";
				}else if(statuArr[i]==2){
					statu="运输中";
				}else if(statuArr[i]==3){
					statu="配送中";
				}else if(statuArr[i]==6){
					statu="已签收";
				}else if(statuArr[i]==4){
					statu="取消发货";
				}else if(statuArr[i]==5){
					statu="已退货";
				}else if(statuArr[i]==7){
					statu="已驳回";
				}else{
					statu="";
				};
				state.push(statu);
			};
			status=state.toString();
			$('#record_list').html('<div class="ship_nofind"><span><img src="../skin/images/no_find.png" alt=""></span><p>对不起，没有找到“'+status+''+startTime+' '+endTime+'”的</br>相关信息，请重新输入。</p></div>');
			$('#Pagination').html('');
		}else{
			$('#record_list').html('<div class="ship_nofind"><span><img src="../skin/images/no_find.png" alt=""></span><p>您还没有收货记录</p></div>');
			$('#Pagination').html('');
		};
	}
}


/*关闭筛选*/
function filetrsHide(){
	$('.protocol_pop_send_w').fadeOut(400);
	$('.protocol_pop_send').animate({right:'-90%'}, 400);
}

function filetrShow(){
	$('.protocol_pop_send_w').fadeIn(400);
	$('.protocol_pop_send').animate({right:0}, 400);
}

/*筛选重置*/
function filetrsReset(){
	$('[name="state"]').removeAttr('checked');
	$('.filetrsTime').val('');
}

/*日期为两位数*/
function addZero(input){
	if (input<10) {
		return '0'+input;
	}else{
		return input;
	};
}
/*开始时间不能大于当前时间*/
function startTime(value){
	// var startTime=$('#date_start').val();
	var startArr=value.split('-');
	var startTimeT=new Date(startArr[0],startArr[1]-1,startArr[2]);
	/*开始结束时间搓*/
	var startTimeCuo=startTimeT.getTime();

	var dataTime=new Date();
	var curYear=dataTime.getFullYear();
	var curMonth=addZero(dataTime.getMonth()+1);
	var curDays=addZero(dataTime.getDate());
	var curTimeT=new Date(curYear,curMonth,curDays);
	var curTime=curYear+'-'+curMonth+'-'+curDays;
	/*结束时间搓*/
	var curTimeCuo=curTimeT.getTime();
	if (startTimeCuo>curTimeCuo) {
		$('#date_start').val(curTime);
	};
}
/*结束日期不能大于当前时间*/
function endTime(value){
	// var endTime=$('#date_end').val();
	var endArr=value.split('-');
	var endTimeT=new Date(endArr[0],endArr[1]-1,endArr[2]);
	/*开始结束时间搓*/
	var endTimeCuo=endTimeT.getTime();

	var dataTime=new Date();
	var curYear=dataTime.getFullYear();
	var curMonth=addZero(dataTime.getMonth()+1);
	var curDays=addZero(dataTime.getDate());
	var curTimeT=new Date(curYear,curMonth,curDays);
	var curTime=curYear+'-'+curMonth+'-'+curDays;
	/*结束时间搓*/
	var curTimeCuo=curTimeT.getTime();
	if (endTimeCuo>curTimeCuo) {
		$('#date_end').val(curTime);
	};
}