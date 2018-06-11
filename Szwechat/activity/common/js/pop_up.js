(function () {
    $.MsgBox = {
        Alert: function (msg,truebtn) {
            GenerateHtmlt("alert", msg,truebtn,'');
            btnOk(); 
            btnNo();
        },
        AlertL: function (msg,truebtn,callback) {
            GenerateHtmlt("alert", msg,truebtn,'');
            btnOk(callback);
        },
        Confirm: function (title, msg, callback) {
            GenerateHtml("confirm", title, msg);
            btnOk(callback);
            btnNo();
        },
        Confirmt: function (msg,truebtn,falsebtn,callbackt, callback) {
            GenerateHtmlt("confirm", msg,truebtn,falsebtn);
            btnOk(callback);
            btnNot(callbackt);
        },
        ConfirmL: function (msg,truebtn,falsebtn,callback,callbackt) {
            GenerateHtmlL("confirm", msg,falsebtn,truebtn);
            btnOk(callback);
            btnNot(callbackt);
        }
    }
    //生成Html
    var GenerateHtml = function (type, title, msg) {
        var _html = "";
        _html += '<div id="mb_box"></div><div id="mb_con"><span id="mb_tit">' + title + '</span>';
        _html += '<a id="mb_ico">x</a><div id="mb_msg">' + msg + '</div><div id="mb_btnbox">';
        if (type == "alert") {
            _html += '<input id="mb_btn_ok" type="button" value="确定" />';
        }
        if (type == "confirm") {
            _html += '<input id="mb_btn_ok" type="button" value="确定" />';
            _html += '<input id="mb_btn_no" type="button" value="取消" />';
        }
        if (type == "confirm2") {
            _html += '<input id="mb_btn_ok" type="button" value="确定" />';
            _html += '<input id="mb_btn_no" type="button" value="取消" />';
        }
        _html += '</div></div>';
        //必须先将_html添加到body，再设置Css样式
        $("body").append(_html); 
        //生成Css
         GenerateCss();
    }
    var GenerateHtmlt = function (type, msg,truebtn,falsebtn) {
        var _html = "";
        _html += '<div id="mb_box"></div><div id="mb_con">';
        _html += '<div id="mb_msg2">' + msg + '</div><div id="mb_btnbox">';
        if (type == "alert") {
            _html += '<input id="mb_btn_ok_a" type="button" value="'+truebtn+'" />';
        }
        if (type == "confirm") {
            _html += '<input id="mb_btn_no" type="button" value="'+falsebtn+'" />';
            _html += '<input id="mb_btn_ok" type="button" value="'+truebtn+'" />';
        }
        _html += '</div></div>';
        /*必须先将_html添加到body，再设置Css样式*/
        $("body").append(_html); 
        /*生成Css*/
         GenerateCss();
    }
    var GenerateHtmlL = function (type, msg,truebtn,falsebtn) {
        var _html = "";
        _html += '<div id="mb_box"></div><div id="mb_con">';
        _html += '<div id="mb_msg2">' + msg + '</div><div id="mb_btnbox">';
        if (type == "confirm") {
            _html += '<input id="mb_btn_ok_l" type="button" value="'+truebtn+'" />';
            _html += '<input id="mb_btn_no_l" type="button" value="'+falsebtn+'" />';
        }
        _html += '</div></div>';
        /*必须先将_html添加到body，再设置Css样式*/
        $("body").append(_html); 
        /*生成Css*/
         GenerateCss();
    }

    /*生成Css*/
    var GenerateCss = function () {
        $("#mb_box").css({ width: '100%', height: '100%', zIndex: '99999', position: 'fixed',
            filter: 'Alpha(opacity=60)', backgroundColor: 'black', top: '0', left: '0', opacity: '0.6'
        });
        $("#mb_con").css({ zIndex: '999999', width: '80%', position: 'fixed',borderRadius:'5px',
            backgroundColor: 'White'
        });
        $("#mb_tit").css({ display: 'block', fontSize: '14px', color: '#444', padding: '10px 15px',
            backgroundColor: '#e2e2e2',
            borderBottom: '3px solid #009BFE', fontWeight: 'bold'
        });
        $("#mb_msg").css({ padding: '20px', lineHeight: '20px',
            borderBottom: '1px solid #e2e2e2', fontSize: '0.14rem'
        });
        $("#mb_msg2").css({ padding: '20px', lineHeight: '20px',
            borderBottom: '1px solid #e2e2e2', fontSize: '0.14rem',textAlign:'center'
        });
        $("#mb_ico").css({ display: 'block', position: 'absolute', right: '10px', top: '9px',
            border: '1px solid Gray', width: '18px', height: '18px', textAlign: 'center',
            lineHeight: '16px', cursor: 'pointer', borderRadius: '12px', fontFamily: '微软雅黑'
        });
        $("#mb_btnbox").css({textAlign: 'center' });
        $("#mb_btn_ok,#mb_btn_no,#mb_btn_ok_l,#mb_btn_no_l").css({ width: '50%', height: '50px', color: '#666', border: 'none' ,float : 'left'});
        $("#mb_btn_ok_a").css({ width: '100%', height: '50px', color: '#666', border: 'none' ,float : 'left',color:'#7ed321'});
        $("#mb_btn_ok").css({boxShadow:'-1px 0 0 #e2e2e2',color:'#7ed321'});
        $("#mb_btn_ok_l").css({color:'#7ed321'});
        $("#mb_btn_no_l").css({boxShadow:'-1px 0 0 #e2e2e2',color:'#666'});
        // $("#mb_btn_no").css({ backgroundColor: 'gray'});
        //右上角关闭按钮hover样式
        $("#mb_ico").hover(function () {
            $(this).css({ backgroundColor: 'Red', color: 'White' });
        }, function () {
            $(this).css({ backgroundColor: '#e2e2e2', color: 'black' });
        });
        var _widht = document.documentElement.clientWidth;  //屏幕宽
        var _height = document.documentElement.clientHeight; //屏幕高
        var boxWidth = $("#mb_con").width();
        var boxHeight = $("#mb_con").height();
        /*让提示框居中*/
        $("#mb_con").css({ top: (_height - boxHeight) / 2 -30 + "px", left: (_widht - boxWidth) / 2 + "px" });
    }
    /*确定按钮事件*/
    var btnOk = function (callback) {
        $("#mb_btn_ok,#mb_btn_ok_a,#mb_btn_ok_l").click(function () {
            $("#mb_box,#mb_con").remove();
            if (typeof (callback) == 'function') {
                callback();
            }
        });
    }
    /*取消按钮事件*/
    var btnNo = function () {
        $("#mb_btn_no,#mb_btn_no_l,#mb_ico").click(function () {
            $("#mb_box,#mb_con").remove();
        });
    }
    var btnNot = function (callbackt) {
         $("#mb_btn_no,#mb_btn_no_l,#mb_ico").click(function () {
            $("#mb_box,#mb_con").remove();
            if (typeof (callbackt) == 'function') {
                callbackt();
            }
        });

    }

    
    /*$.MsgBox.Alert("确定要删除吗？",'确定');*/
    /*$.MsgBox.AlertL("重置成功",'确定',function(){
        window.location.href="../ucenter/ucenter.html";
    });*/
   /* $.MsgBox.ConfirmL("确定要删除吗？",'取消','确定',function(){

    },function(){
        return false;
    })*/
})();