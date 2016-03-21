/// <reference path="../lib/Q.js" />
/*
* Q.UI.Tabs.js 选项卡插件
* author:devin87@qq.com  
* update:2016/03/08 17:16
*/
(function () {
    "use strict";

    var async = Q.async,

        getFirst = Q.getFirst,
        parseHash = Q.parseHash,

        $$ = $.find;

    //选项卡对象
    function Tabs(ops) {
        ops = ops || {};

        var self = this,

            context = ops.context,

            tabs = ops.tabs || $$(".tabTitle>li", context),
            conts = ops.conts || $$(".tabCont>.turn-box", context);

        self.tabs = tabs;
        self.conts = conts;
        self.map_loaded = {};
        self.map_index = {};

        //扫描index和对应的hash
        tabs.forEach(function (el, i) {
            //优先显示
            if (el.getAttribute("x-def") == "1") ops.index = i;

            var link = getFirst(el);
            if (!link) return;

            var hash = link.href.split("#")[1] || "", nav = parseHash(hash).nav;
            if (nav) self.map_index[nav] = i;
        });

        //选项卡点击事件
        tabs.forEach(function (el, i) {
            $(el).click(function () {
                self.showTab(i);
            });
        });

        $(conts).hide();

        //显示默认的选项卡
        setTimeout(function () {
            var hash = parseHash().nav.slice(1) || ops.hash,
                index = self.map_index[hash];

            if (index == undefined) index = ops.index || 0;

            //默认显示顺序 location hash -> html定义(x-def属性) -> ops.index -> 0
            self.showTab(index);
        }, 20);
    }

    Q.factory(Tabs).extend({
        //获取选项卡元素
        getTab: function (i) {
            return this.tabs[i];
        },
        //获取对应的视图元素
        getCont: function (i) {
            return this.conts[i];
        },
        //该视图是否已加载过
        hasLoaded: function (i) {
            return !!this.map_loaded[i];
        },
        //显示指定索引的选项卡
        showTab: function (index) {
            var self = this,
                lastIndex = self.index;

            if (index === lastIndex) return;

            if (lastIndex !== undefined) {
                var lastTab = self.getTab(lastIndex),
                    lastCont = self.getCont(lastIndex);

                $(lastTab).removeClass("on");
                $(lastCont).hide();
            }

            var tab = self.getTab(index),
                cont = self.getCont(index),
                map_loaded = self.map_loaded;

            $(tab).addClass("on");
            $(cont).show();

            self.index = index;

            //触发选项卡切换事件
            async(window.onTabChange, 200, { index: index, tab: tab, cont: cont, loaded: map_loaded[index] });
            if (!map_loaded[index]) map_loaded[index] = true;
        }
    });

    //设置选项卡切换
    function setTabs(ops) {
        return new Tabs(ops);
    }

    //------------------------- export -------------------------

    Q.Tabs = Tabs;
    Q.setTabs = setTabs;

})();