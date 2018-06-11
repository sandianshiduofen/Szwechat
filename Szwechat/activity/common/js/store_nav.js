(function(window){
	// 方法
	window.incident={
		// 样式
		allStyle:{
			navStyle:{
				'height': '0.48rem',
				'width':'100%',
			},
			liStyle:{
				'display':'table-cell'
			},
			spanStyle:{
				'width':'80px',
				'margin':'0 auto',
				'display':'flex',
				'height':'40px',
				'background': '#ffbd1f',
				'text-shadow': '1px 1px 0 #ee950d',
				'font-size':'0.14rem',
				'color':'#fff',
				'align-items': 'center',
				'justify-content':'center',
				'border-radius':'5px'
			}
		},
		GetQueryString:function(name){//获取参数
		    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
		    var r = window.location.search.substr(1).match(reg);
		    if(r!=null)return  unescape(r[2]); return null;
		},
		requestTokenId:function(num){//随机数
			len =num||32;
			var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
			var maxPos = $chars.length;
			var pwd = '';
			for (i = 0; i < len; i++) {
			　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
			}
			return 'wx_tms_'+pwd;
		},
		userInfo:function(id){
			// 创建Dom
			var html='<div style="position: fixed;bottom:0;left:0;right:0;width:100%;"><ul style="display:table;width:100%"><li><span id="chitchat">聊天</span></li><li><span id="phone">拨打电话</span></li><li><span id="baguette">进店</span></li></ul></div>';
			var navFooter=document.createElement('div');
			navFooter.setAttribute('class', 'navFooter');
			navFooter.setAttribute('id', 'navFooter');
			navFooter.innerHTML=html;
			// 添加样式
			var navSting="";
			var liSting="";
			var spanSting="";
			var navStyle=this.allStyle.navStyle;
			var liStyle=this.allStyle.liStyle;
			var spanStyle=this.allStyle.spanStyle;
			for (var i in navStyle) {
				navSting+=i+':'+navStyle[i]+";"
			};
			for (var i in liStyle) {
				liSting+=i+':'+liStyle[i]+";"
			};
			for (var i in spanStyle) {
				spanSting+=i+':'+spanStyle[i]+";"
			};
			navFooter.setAttribute('style', navSting);
			var liDom=navFooter.children[0].children[0].children;
			for (var i = 0; i < liDom.length; i++) {
				liDom[i].setAttribute('style', liSting);
				var spanDom=liDom[i].children[0];
				spanDom.setAttribute('style', spanSting);
			};
			// 添加到底部
			if (incident.GetQueryString('appCode')) {
				document.getElementsByTagName('body')[0].appendChild(navFooter);
			}

			ajax({
				method: 'POST',
				url: 'http://weixinapi.3zqp.com/api/wx/login/findSupplier',
				// url: 'http://192.168.0.158:8193/api/wx/login/findSupplier',
				data: {
				    id:id,
				    garageId:incident.GetQueryString('garageId'),
				    requestTokenId:incident.requestTokenId()
				},
				success: function (response) {
					var data=(typeof response == "string")?JSON.parse(response):response;
					console.log(data)
					if (data.returnCode==200) {
						console.log(data.info)
						var userinfo=JSON.stringify(data.info);
						document.getElementById('chitchat').onclick=function () {
							window.depot.jumpDealerFromJs(userinfo,1);
						}
						document.getElementById('phone').onclick=function () {
							window.depot.jumpDealerFromJs(userinfo,2);
						}
						document.getElementById('baguette').onclick=function () {
							console.log(userinfo);
							window.depot.jumpDealerFromJs(userinfo,3);
						}
						var allPhoneBtn=document.getElementsByClassName('tel_btn');
						for (var i = 0; i < allPhoneBtn.length; i++) {
							allPhoneBtn[i].setAttribute('href', 'javascript:;');
							allPhoneBtn[i].onclick=function(){
								window.depot.jumpDealerFromJs(userinfo,2);
							}
						};
					}else{
						document.getElementById('chitchat').setAttribute('onclick', 'alert("'+data.message+'")')
						document.getElementById('phone').setAttribute('onclick', 'alert("'+data.message+'")')
						document.getElementById('baguette').setAttribute('onclick', 'alert("'+data.message+'")')
					};
					
				}
			 });
		},

	}
	

	function ajax(opt) {
		opt = opt || {};
		opt.method = opt.method.toUpperCase() || 'POST';
		opt.url = opt.url || '';
		opt.async = opt.async || true;
		opt.data = opt.data || null;
		opt.success = opt.success || function () {};
		opt.error = opt.error || function () {};
		var xmlHttp = null;
		if (XMLHttpRequest) {
		    xmlHttp = new XMLHttpRequest();
		}
		else {
		    xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
		}var params = [];
		for (var key in opt.data){
		    params.push(key + '=' + opt.data[key]);
		}
		var postData = params.join('&');
		if (opt.method.toUpperCase() === 'POST') {
		    xmlHttp.open(opt.method, opt.url, opt.async);
		    xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
		    xmlHttp.send(postData);
		}
		else if (opt.method.toUpperCase() === 'GET') {
		    xmlHttp.open(opt.method, opt.url + '?' + postData, opt.async);
		    xmlHttp.send(null);
		} 
		xmlHttp.onreadystatechange = function () {
		    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
		        opt.success(xmlHttp.responseText);
		    }
		};
	}
})(window)