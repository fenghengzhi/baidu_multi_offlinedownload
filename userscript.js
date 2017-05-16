// ==UserScript==
// @name         百度网盘批量离线
// @namespace    https://greasyfork.org/users/63665
// @homepage     https://greasyfork.org/zh-CN/scripts/23426
// @version      1.2
// @description  批量离线辅助脚本
// @author       fenghengzhi
// @match        http://pan.baidu.com/disk/home*
// @match        http://yun.baidu.com/disk/home*
// @match        https://pan.baidu.com/disk/home*
// @match        https://yun.baidu.com/disk/home*
// @grant        none
// @run-at       document-end
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @note         v1.2小幅优化
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
        var msgObj=$("#offlinelist-dialog").clone().appendTo('body');
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


        var dialogbody=msgObj.find('.dialog-body');
        dialogbody.children().remove();
        var table1=$('<table/>').appendTo(dialogbody).width('100%');
        var tr1=$('<tr/>').appendTo(table1);
        var td1=$('<td colspan="2"/>').appendTo(tr1).width('100%').css('padding','10px');
        var mullineinputbox=$("<textarea/>").attr("id","multi_urls").appendTo(td1);
        mullineinputbox.css('width','100%').css('height','100px').css('border-radius','4px').css('border','1px solid rgb(196,196,196)');
        $('head').append("<style>textarea:focus{border:1px solid rgb(192, 217, 255);}</style>");
        dialogbody.css('text-align','center');
        tr1=$('<tr/>').insertAfter(tr1);
        td1=$('<td/>').appendTo(tr1).css('padding-bottom','15px');
        var td2=$('<td/>').insertAfter(td1).css('padding-bottom','15px');
        var button1=$('<button/>');
        button1.attr('class','mul-button');
        button1.css({
            'width':'104px',
            'height':'34px',
            'border-radius':'4px',
            'border-style':'none',
            'font':"normal normal normal normal 13px / 32px 'Microsoft YaHei': SimSun",
            'outline':'none',
            'cursor':'pointer'
        });
        var button2=button1.clone();
        button1.css('background-color',"rgb(59, 140, 255)").css('color','rgb(255,255,255)').text('确定');
        button2.css('border','1px solid rgb(192, 217, 255)').css('background-color',"rgb(255,255,255)").css('color','rgb(59, 140, 255)').text('关闭');
        $('head').append("<style>button.mul-button:hover{opacity:0.7;}</style>");

        td1.append(button1);
        td2.append(button2);
        button1.click(function(){
            urls=$("#multi_urls").val().split("\n");
            button2.click();
            Multi_offline_start();
            console.debug(urls);
        });
        button2.click(function() {
            bgObj.remove();
            msgObj.remove();
        });
        msgObj.find('.select-text').text(title);
        msgObj.css('width',w);
        msgObj.css({
            'left':bgObj.width()/2-msgObj.width()/2,
            'top':bgObj.height()/2-msgObj.height()/2
        });

    }
    function add_multi_button(){
        if($("#offlinelist-dialog").is(":visible")===false) return setTimeout(arguments.callee,100);
        //$("#offlinelist-dialog").find(".dialog-control").children().click();//点击关闭按钮
        if($("#offlinelist-dialog").find("span.text:contains('批量离线')").length===0){
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
    $(document).one("click","a.g-button:contains('离线下载')",add_multi_button);




    function Multi_offline_start(){
        //$("#_disk_id_2").click();
        i=0;//清空计数器
        offline_download();//进入循环
    }
    function offline_download(){
        $("#_disk_id_2").click();//点击新建按钮
        wait_newoffline_dialog();
    }
    function wait_newoffline_dialog(){//等待新建窗口
        if($("#newoffline-dialog").is(":visible")===false) return setTimeout(arguments.callee,100);
        $("#share-offline-link").val(urls[i]);
        $("#newoffline-dialog").find("span:contains('确定')[class='text']").click();//确定按钮
        check_code();
    }

    function check_code(){
        if($("#offlinelist-dialog").is(":visible")===false && $("#dialog1").is(":visible")===false) return setTimeout(arguments.callee,100);
        if($("#dialog1").is(":visible")){//弹出验证码
            wait_checkcode_input();
        }
        else if($("#offlinelist-dialog").is(":visible")) wait_complete();//没有弹出验证码
        else alert('error');
    }
    function wait_checkcode_input(){
        $("#dialog1").find(".input-code").focus();
        $("#dialog1").find(".input-code").on('input',function(){
            if(this.value.length===4){
                $("#dialog1").find("span:contains('确定')[class='text']").click();
                check_code();
            }
        });
    }
    function wait_complete(){
        if($("#offlinelist-dialog").is(":visible")===false) return setTimeout(arguments.callee,100);
        ++i;
        if(i<urls.length) offline_download();//继续批量下载
        //if条件为假，则批量下载完成，脚本结束
    }
})();
