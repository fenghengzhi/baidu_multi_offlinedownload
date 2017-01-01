// ==UserScript==
// @name         百度网盘批量离线
// @namespace    https://greasyfork.org/users/63665
// @homepage     https://greasyfork.org/zh-CN/scripts/23426
// @version      0.8
// @description  批量离线辅助脚本
// @author       fenghengzhi
// @match        http://pan.baidu.com/disk/*
// @match        http://yun.baidu.com/disk/*
// @match        https://pan.baidu.com/disk/*
// @match        https://yun.baidu.com/disk/*
// @grant        none
// @run-at      document-end
// @require     https://code.jquery.com/jquery-3.1.0.min.js
// @note        v0.2 好用多了，就是有点难看 v0.5简单美化
// ==/UserScript==
var urls;
var i;
function alertWin(title, msg, w, h) {
    //title='test1';msg='test2';w=300;h=150;
    var titleheight = "22px"; // 窗口标题高度
    var bordercolor = "#666699"; //窗口的边框颜色
    var titlecolor = "#FFFFFF"; // 窗口的标题颜色
    var titlebgcolor = "#666699"; // 窗口的标题背景色
    var bgcolor = "#FFFFFF"; // 内容背景色
    var iWidth = document.documentElement.clientWidth; //这个窗口的宽度
    var iHeight = document.documentElement.clientHeight; //这个窗口的高度

    //背景层的格式
    var bgObj = $("<div/>");

    bgObj.css("position","absolute");
    bgObj.css("left","0px");
    bgObj.css("top","0px");
    bgObj.css("width",iWidth+"px");
    bgObj.css("height",Math.max(document.body.clientHeight, iHeight)+"px");
    bgObj.css("filter","Alpha(Opacity=30)");
    bgObj.css("opacity","0.3");
    bgObj.css("background-color","#000000");
    bgObj.css("z-index","1000");

    $("body").append(bgObj);

    var iframe2 =  $("<iframe/>");

    iframe2.css("position","absolute");
    iframe2.css("top","0px");
    iframe2.css("filter","Alpha(Opacity=30)");
    iframe2.css("opacity","0.3");
    iframe2.css("background-color","#000000");
    iframe2.css("z-index","1001");
    iframe2.css("border-style","none");
    iframe2.css("border-width","0px");
    iframe2.css("border","0px");
    iframe2.css("width",iWidth+"px");
    iframe2.css("height",iHeight+"px");

    bgObj.append(iframe2);

    //创建一个弹出层
    var msgObj = $("<div/>");
    //设置弹出的层的样式
    msgObj.css("position","absolute");
    msgObj.css("font","1px '宋体'");
    msgObj.css("top",(iHeight - h) / 2+"px");
    msgObj.css("left",(iWidth - w) / 2+"px");
    msgObj.css("width",w+"px");
    msgObj.css("height",h+"px");
    msgObj.css("text-align","center");
    msgObj.css("border","1px solid " + bordercolor);
    msgObj.css("background-color",bgcolor);
    msgObj.css("padding","1px");
    msgObj.css("line-height","22px");
    msgObj.css("z-index","1001");

    $("body").append(msgObj);
    //创建一个table用于容纳层上的内容
    var table = $("<table/>");
    //将Table放到弹出层上
    msgObj.append(table);
    //设置table的格式
    table.css("margin","0px");
    table.css("border","0px");
    table.css("padding","0px");
    table.attr("cellSpacing",0);
    //插入一行用于显示标题
    var tr = $("<tr/>");
    table.append(tr);

    //插入一个单元格用于容纳标题
    var titleBar = $("<td/>");
    tr.append(titleBar);
    titleBar.css("width","100%");
    titleBar.css("width",titleheight + "px");
    titleBar.css("text-align","left");
    titleBar.css("padding","3px");
    titleBar.css("margin","0px");
    titleBar.css("font","bold 13px '宋体'");
    titleBar.css("color",titlecolor);
    titleBar.css("border","1px solid " + bordercolor);
    titleBar.css("cursor","move");
    titleBar.css("background-color",titlebgcolor);

    titleBar.css("paddingLeft","10px");
    //设置标题
    titleBar.text(title);
    //设置曾德拖动事件
    var moveX = 0;
    var moveY = 0;
    var moveTop = 0;
    var moveLeft = 0;
    var moveable = false;
    var docMouseMoveEvent = document.onmousemove;
    var docMouseUpEvent = document.onmouseup;
    //鼠标点击标题
    titleBar.mousedown(function() {
        var evt = getEvent();
        moveable = true;
        moveX = evt.clientX;
        moveY = evt.clientY;
        moveTop = parseInt(msgObj.css("top"));
        moveLeft = parseInt(msgObj.css("left"));
        //鼠标拖动
        function getEvent() {
            return window.event || arguments.callee.caller.arguments[0];
        }
        document.onmousemove = function() {
            if (moveable) {
                var evt = getEvent();
                var x = moveLeft + evt.clientX - moveX;
                var y = moveTop + evt.clientY - moveY;
                if (x > 0 && (x + w < iWidth) && y > 0 && (y + h < iHeight)) {
                    msgObj.css("left",x + "px");
                    msgObj.css("top", y + "px");
                }
            }
        };
        document.onmouseup = function() {
            if (moveable) {
                document.onmousemove = docMouseMoveEvent;
                document.onmouseup = docMouseUpEvent;
                moveable = false;
                moveX = 0;
                moveY = 0;
                moveTop = 0;
                moveLeft = 0;
            }
        };
    });

    //关闭按钮事件
    var closeBtn = $("<td/>");
    tr.append(closeBtn);
    closeBtn.css("cursor","pointer");
    closeBtn.css("text-align","right");
    closeBtn.css("padding","2px");
    closeBtn.css("background-color",titlebgcolor);
    closeBtn.append($("<span/>").css("font-size","15pt").css("color",titlecolor).text("×"));
    closeBtn.click(function() {
        bgObj.remove();
        msgObj.remove();
    });

    //弹出的消息窗口内容
    var msgBox = $("<td/>");
    table.append($("<tr/>").append(msgBox));
    msgBox.css("font","10pt '宋体'");
    msgBox.attr("colSpan",2);
    msgBox.text(msg);
    //层上模板名称的内容
    var nameBox = $("<tr/>");
    table.append(nameBox);
    nameBox.css("height","90px");
    //var nameLable = $("<td/>");
    //nameBox.append(nameLable);
    //nameLable.css("font","12pt '宋体'");
    //nameLable.css("text-align","center");
    //nameLable.html("<br/>输入身份证号：<br/>");
    var nametext = $("<td/>");
    nameBox.append(nametext);
    nametext.css("font","12pt '宋体'");
    nametext.css("text-align","center");
    nametext.attr("colSpan","2");
    nametext.append($("<textarea/>").attr("id","multi_urls").css("width","95%").css("height","80%"));
    //层上动作按钮的内容

    var submitBox = $("<tr/>");
    table.append(submitBox);
    var submitBtn = $("<td/>");
    submitBox.append(submitBtn);
    submitBtn.css("text-align","center;");
    submitBtn.attr("colSpan","2");
    submitBtn.append($("<button/>").text("确定").click(function(){
        urls=$("#multi_urls").val().split("\n");
        closeBtn.click();
        Multi_offline();
        console.debug(urls);
    }));
}
function add_multi_button(){
    if($("#offlinelist-dialog").css("display")!="block") return setTimeout(arguments.callee,100);
    //$("#offlinelist-dialog").find(".dialog-control").children().click();//点击关闭按钮
    if($("#offlinelist-dialog").find("span:contains('批量离线')[class='text']").length==0){
        var a=$("#_disk_id_2");
        var b=a.clone();
        b.find(".text").text("批量离线");
        b.attr('id','multi_download');
        b.click(function(){
            alertWin("输入链接","",300,150);
        });
        a.after(b);
    }
}
function wait_page_complete(){
    $("span:contains('离线下载')[class='text']").click(add_multi_button);
    //add_multi_button();
}
(function() {
    'use strict';
    setTimeout(wait_page_complete,1000);

})();


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
