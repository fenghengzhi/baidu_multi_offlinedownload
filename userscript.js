// ==UserScript==
// @name         百度网盘批量离线
// @namespace    https://greasyfork.org/users/63665
// @homepage     https://greasyfork.org/zh-CN/scripts/23426
// @version      0.9
// @description  批量离线辅助脚本
// @author       fenghengzhi
// @match        http://pan.baidu.com/disk/home*
// @match        http://yun.baidu.com/disk/home*
// @match        https://pan.baidu.com/disk/home*
// @match        https://yun.baidu.com/disk/home*
// @grant        none
// @run-at      document-end
// @require     https://code.jquery.com/jquery-3.1.0.min.js
// @note        v0.2 好用多了，就是有点难看 v0.5简单美化 v0.9大幅更新界面
// ==/UserScript==
(function() {

    var urls;
    var i;
    function alertWin(title, msg, w, h) {
        //背景层
        var bgObj = $("<div/>").appendTo('body');
        bgObj.css({
            "position":"absolute",
            "left":"0px",
            "top":"0px",
            "width":"100%",
            "height":"100%",
            "opacity":"0.3",
            "background-color":"#000000",
            "z-index":"1000"
        });

        //创建一个弹出层
        msgObj=$("#offlinelist-dialog").clone().appendTo('body');
        msgObj.attr('id','mul-dialog');
        msgObj.css('z-index','1001');


        msgObj.find('.dialog-drag').mousedown(function (e) {
            var left, top, $this;
            left = e.clientX; top = e.clientY; $this = $(this);
            if(this.setCapture) {
                this.setCapture();
                this.onmousemove = function (ev) { mouseMove(ev || event); };
                this.onmouseup = mouseUp;
            }
            else{
                $(document).bind("mousemove", mouseMove).bind("mouseup", mouseUp);
            }
            function mouseMove(e) {
                var target = msgObj;
                var l = e.clientX - left + Number(target.css('margin-left').replace(/px$/, '')) || 0;
                var t = e.clientY - top + Number(target.css('margin-top').replace(/px$/, '')) || 0;
                //l = Math.min(l, $(window).width() - target.width() - target.position().left);
                //t = Math.min(t, $(window).height() - target.height() - target.position().top);
                left = e.clientX;
                top = e.clientY;
                target.css({ 'margin-left': l, 'margin-top': t });
            }
            function mouseUp(e) {
                var el = $this.get(0);
                if(el.releaseCapture) {
                    el.releaseCapture();
                    el.onmousemove = el.onmouseup = null;
                }
                else{
                    $(document).unbind("mousemove", mouseMove).unbind("mouseup", mouseUp);
                }
            }
        });
        msgObj.find('.dialog-control').click(function() {
            bgObj.remove();
            msgObj.remove();
        });
        msgObj.find('.select-text').text(title);
        msgObj.css('width',w);
        dialogbody=msgObj.find('.dialog-body');
        dialogbody.children().remove();
        mullineinputbox=$("<textarea/>").attr("id","multi_urls").appendTo(dialogbody);
        mullineinputbox.css('width','95%').css('height','100px').css('border-radius','4px').css('border','1px solid rgb(196,196,196)');
        $('head').append("<style>textarea:focus{border:1px solid rgb(192, 217, 255);}</style>");
        dialogbody.css('text-align','center');
        button1=$('<button/>');
        button1.css({
            'width':'104px',
            'height':'34px',
            'border-radius':'4px',
            'border-style':'none',
            'font':"normal normal normal normal 13px / 32px 'Microsoft YaHei': SimSun",
            'outline':'none',
            'cursor':'pointer'
        });
        button2=button1.clone();
        button1.css('background-color',"rgb(59, 140, 255)").css('color','rgb(255,255,255)').text('确定');
        button2.css('border','1px solid rgb(192, 217, 255)').css('background-color',"rgb(255,255,255)").css('color','rgb(59, 140, 255)').text('关闭');
        $('head').append("<style>button:hover{opacity:0.7;}</style>");

        mullineinputbox.after(button1);
        button1.after(button2);
        mullineinputbox.before('<br>').after('<br>').after('<br>');
        button1.after(' ');
        button2.after('<br>');
        button2.after('<br>');
        button1.click(function(){
            urls=$("#multi_urls").val().split("\n");
            button2.click();
            Multi_offline();
            console.debug(urls);
        });
        button2.click(function() {
            bgObj.remove();
            msgObj.remove();
        });

    }
    function add_multi_button(){
        if($("#offlinelist-dialog").css("display")!="block") return setTimeout(arguments.callee,100);
        //$("#offlinelist-dialog").find(".dialog-control").children().click();//点击关闭按钮
        if($("#offlinelist-dialog").find("span:contains('批量离线')[class='text']").length===0){
            $("#offlinelist-dialog").css('width','720px');
            var old_button=$("#_disk_id_2");
            var new_button=old_button.clone();
            new_button.find(".text").text("批量离线");
            new_button.attr('id','multi_download');
            new_button.click(function(){
                alertWin("输入链接","",500,500);
            });
            old_button.after(new_button);
        }
    }

    //'use strict'
    $(document).one("click","span:contains('离线下载')[class='text']",add_multi_button);




    window.Multi_offline=function(urls){
        $('#_disk_id_2').click();
        i=0;
        offline_download();
    };
    function offline_download(){
        $("#_disk_id_2").click();//点击新建按钮
        wait_newoffline_dialog();
    }
    function wait_newoffline_dialog(){//等待新建窗口
        if($("#newoffline-dialog").css("display")!="block") return setTimeout(arguments.callee,1000);
        $("#share-offline-link").val(urls[i]);
        $("#newoffline-dialog").find("span:contains('确定')[class='text']").click();//确定按钮
        check_code();
    }

    function check_code(){
        if($("#offlinelist-dialog").css("display")!="block" && $("#dialog1").css("display")!="block") return setTimeout(arguments.callee,100);
        if($("#dialog1").css("display")=="block"){//弹出验证码
            wait_checkcode_input();
        }
        else  wait_complete();//没有弹出验证码
    }
    function wait_checkcode_input(){
        $("#dialog1").find(".input-code").focus();
        if($("#dialog1").find(".input-code").val().length!=4) return setTimeout(arguments.callee,100);
        $("#dialog1").find("span:contains('确定')[class='text']").click();
        check_code();
    }
    function wait_complete(){
        if($("#offlinelist-dialog").css("display")!="block") return setTimeout(arguments.callee,1000);
        i++;
        if(i>=urls.length) return;//批量下载完成，脚本结束
        else offline_download();
    }
})();
