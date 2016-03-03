//devin87@qq.com
(function () {
    "use strict";

    //获取页名称
    function get_page_name(pathname) {
        pathname = pathname || location.pathname;
        pathname = pathname.toLowerCase().replace(/\\/g, "/");

        var index = pathname.lastIndexOf("/");

        return index != -1 ? pathname.slice(index + 1) : pathname;
    }

    var PAGE_NAME = get_page_name();

    var list_page = [
        { title: "弹出框+确认框+输入框等", href: "dialog.html" },
        { title: "元素拖拽", href: "drag.html" },
        { title: "多级右键菜单", href: "contextmenu.html" },
        { title: "颜色选择器", href: "colorpicker.html" },
        { title: "数据分页", href: "pager.html" },
        { title: "选项卡切换", href: "tabs.html" },
        { title: "进度条", href: "progressbar.html" }
    ];

    var map_page = {};

    function draw_sidebar() {
        var html = [];
        html.push('<div class="title">导航</div>');
        html.push('<ul>');
        for (var i = 0, len = list_page.length; i < len; i++) {
            var item = list_page[i],
                href = item.href;

            item.index = i;
            map_page[href] = item;

            html.push('<li' + (href == PAGE_NAME ? ' class="on"' : '') + '><a href="' + item.href + '">' + item.title + '</a></li>');
        }
        html.push('</ul>');

        document.getElementById("sidebar").innerHTML = html.join('');
    }

    function init() {
        draw_sidebar();

        var boxHeader = document.getElementById("header"),
            page = map_page[PAGE_NAME];

        if (!boxHeader || !page) return;

        if (boxHeader.innerHTML == "Header") boxHeader.innerHTML = page.title;
    }

    init();

})();