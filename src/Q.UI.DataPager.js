/// <reference path="../lib/Q.js" />
/*
* Q.UI.DataPager.js 数据分页
* https://github.com/devin87/Q.UI.js
* author:devin87@qq.com
* update:2017/03/08 17:21
*/
(function (undefined) {
    "use strict";

    var factory = Q.factory;

    //---------------------- 数据分页 ----------------------

    //生成分页页码数据 eg:create_pager_bar_data(9,28,5) => [1,0,4,5,6,7,8,0,28] 0表示省略号，其它表示页码
    //size:要显示的页码数量(包括省略号),不小于7的奇数
    //totalPage:总页数
    //page:当前页索引
    function create_pager_bar_data(size, totalPage, page) {
        var tmp = [1];

        //只有一页的情况
        if (totalPage == 1) return tmp;

        //if (size < 7) size = 7;
        //else if (size % 2 == 0) size++;

        var first = 2, last;

        //总页数小于或等于页码数量
        if (totalPage <= size) {
            last = totalPage;
        } else {
            var sideCount = (size - 5) / 2;

            //左边无省略号 eg: [1,2,3,4,5,0,20]
            if (page <= sideCount + 3) {
                last = size - 2;
            } else if (page > totalPage - sideCount - 3) {
                //右边无省略号 eg: [1,0,16,17,18,19,20]
                first = totalPage - size + 3;  //=last-(size-4)
                last = totalPage - 1;
            } else {
                //左右均有省略号 eg: [1,0,8,9,10,0,20]
                first = page - ~~sideCount;
                last = first + size - 5;
            }
        }

        if (first > 2) tmp.push(0);
        for (var i = first; i <= last; i++) tmp.push(i);

        if (totalPage > size) {
            if (last < totalPage - 1) tmp.push(0);
            tmp.push(totalPage);
        }

        return tmp;
    }

    //构造器:分页对象
    function DataPager(ops) {
        var self = this;

        self.ops = ops;
        self.size = ops.size || 9;
        self.cache = {};

        if (ops.href == undefined) {
            var boxNav = ops.boxNav;
            if (boxNav) {
                $(boxNav).on("click", "li", function () {
                    self.go($(this).attr("x"), true);

                    if (self.onclick) self.onclick.call(self, self.page);
                });
            }
        } else {
            ops.cache = ops.preload = false;
        }

        self.set(ops.totalCount, ops.pageSize || 10).setData(ops.data).go(ops.page);
    }

    factory(DataPager).extend({
        //设置总的数据条数和每页显示的数据条数
        set: function (totalCount, pageSize) {
            var self = this;
            if (totalCount != undefined) self.totalCount = totalCount;
            if (pageSize != undefined) self.pageSize = pageSize;

            if (self.totalCount != undefined) self.totalPage = Math.ceil(self.totalCount / self.pageSize);

            return self;
        },
        //设置数据列表(为传入ops.load)
        //data:数据列表
        setData: function (data) {
            if (data) {
                this.data = data;
                this.set(data.length);
            }
            return this;
        },
        //加载数据
        _load: function (page, callback) {
            var self = this,
                ops = self.ops,
                onload = self.onload;

            self.page = page;

            var complete = function (list) {
                if (onload) onload.call(self, list);
                if (callback) callback.call(self, list);

                return self;
            };

            //本地数据分页
            if (!ops.load) {
                var pageSize = self.pageSize,
                    start = (page - 1) * pageSize;

                return complete(self.data.slice(start, start + pageSize));
            }

            //使用缓存
            var list = ops.cache ? self.cache[page] : undefined;
            if (list) return complete(list);

            //获取远程数据
            ops.load(page, function (data) {
                list = data.data || [];
                if (ops.cache) self.cache[page] = list;

                self.set(data.totalCount, data.pageSize);

                complete(list);
            });

            return self;
        },
        //加载并渲染数据
        load: function (page) {
            return this._load(page, this.draw);
        },
        //重新载入当前数据并渲染
        reload: function (page) {
            return this.load(page || this.page);
        },
        //跳转到指定页
        //forced:是否强制跳转
        go: function (page, forced) {
            var self = this;

            if (isNaN(page)) return self;

            page = +page;
            if (self.totalPage != undefined && page > self.totalPage) page = self.totalPage;
            if (page < 1) page = 1;

            if (page == self.page && !forced) return self;

            self.load(page);
            if (self.ops.load && self.ops.preload) self._load(page + 1);

            if (self.onchange) self.onchange.call(self, page);

            return self;
        },
        //绘制导航区(分页按钮)
        drawNav: function () {
            var self = this,
                ops = self.ops,
                boxNav = ops.boxNav;

            if (!boxNav) return self;

            var totalCount = self.totalCount,
                pageSize = self.pageSize,

                totalPage = self.totalPage,
                page = self.page,

                href = ops.href,
                text = ops.text || {},

                list_bar = create_pager_bar_data(self.size, totalPage, page);

            if (href != undefined) href += href.indexOf("?") != -1 ? "&" : "?";

            var get_html_bar = function (i, title, className) {
                if (!className) className = i == page ? "on" : (i ? "" : "skip");

                return '<li' + (className ? ' class="' + className + '"' : '') + ' x="' + i + '">' + (href ? '<a' + (i ? ' href="' + href + 'page=' + i + '"' : '') + '>' + title + '</a>' : title) + '</li>';
            };

            var draw_size = ops.drawSize || function (self, html_page, html_count) {
                return html_page + '/' + html_count;
            };

            var html =
                '<div class="inline-block pager-bar' + (href ? ' pager-link' : '') + '">' +
                    '<ul>' +
                        get_html_bar(Math.max(page - 1, 1), text.prev || '&lt;上一页', "prev") +
                        list_bar.map(function (i) {
                            return get_html_bar(i, i || "…");
                        }).join('') +
                        get_html_bar(Math.min(page + 1, totalPage), text.next || '下一页&gt;', "next") +
                    '</ul>' +
                '</div>' +
                (ops.showSize !== false ?
                '<div class="inline-block pager-count">' +
                    draw_size(self, '每页<span class="page-size">' + pageSize + '</span>条', '共<span class="total-count">' + totalCount + '</span>条数据') +
                '</div>' : '');

            $(boxNav).html(html);
        },
        //绘制UI
        draw: function (list) {
            this.drawNav();
            this.ops.draw.call(this, list);

            return this;
        }
    });

    //------------------------- export -------------------------

    Q.DataPager = DataPager;

})();