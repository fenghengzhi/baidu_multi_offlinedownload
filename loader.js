// ==UserScript==
// @name         百度网盘批量离线
// @namespace    https://greasyfork.org/users/63665
// @homepage     https://greasyfork.org/zh-CN/scripts/23426
// @version      2.1
// @description  批量离线辅助脚本
// @author       fenghengzhi
// @match        http://pan.baidu.com/disk/home*
// @match        http://yun.baidu.com/disk/home*
// @match        https://pan.baidu.com/disk/home*
// @match        https://yun.baidu.com/disk/home*
// @run-at       document-start
// @require      https://unpkg.com/babel-standalone/babel.min.js
// @require      https://unpkg.com/babel-polyfill/dist/polyfill.min.js
// @require      https://unpkg.com/jquery/dist/jquery.min.js
// @note         改用loader进行脚本加载，确保不同浏览器与不同脚本管理器的兼容性
// @connect      greasyfork.org
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// ==/UserScript==
var http=(GM&&GM.xmlHttpRequest)||GM_xmlhttpRequest;
// console.log(http);
http({
    method:'GET',
    url: "https://greasyfork.org/scripts/37905-%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E6%89%B9%E9%87%8F%E7%A6%BB%E7%BA%BF/code/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E6%89%B9%E9%87%8F%E7%A6%BB%E7%BA%BF.js",
    onload: function(response) {
        var src=response.responseText;
        var c = Babel.transform(src, { presets: ['es2015', 'es2016', 'es2017'] });
        // console.log(c);
        $(function(){
            /* jshint ignore:start */
            eval(c.code);
            /* jshint ignore:end */
            // console.log(src,c.code,'success');
        });
    }
});


