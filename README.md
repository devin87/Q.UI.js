# Q.UI.js
基于Q.js的UI库，包括遮罩层、弹出框、下拉列表、右键菜单、颜色选择器、选项卡、进度条、数据分页等

###弹出框、确认框、输入框、加载框等
```
/*ops : {
    title: "自定义标题",
    width: 420,
    height:200,
    maxHeight:500,         //最大高度，若内容超出高度，将显示滚动条
    zIndex:10,
    mask: true,              //是否显示遮罩层
    esc: true,             //是否支持按ESC键退出
    center: true,          //是否居中显示
    drag: true,            //是否允许拖拽
    time: 3000,            //正整数，多少毫秒后自动关闭，若不指定则一直显示

    //remove:移除弹出框
    //hide:隐藏弹出框，可再次显示
    close: "remove",         //关闭行为(remove|hide)
    className: "x-dialog"    //附加的样式名称
}*/

//第2个和第3个为可选参数，可灵活调用，下同;
Q.alert(msg,fn,ops)       //弹出框
Q.confirm(msg,fn,ops)     //确认框
Q.prompt(msg,fn,ops)      //输入框
Q.showLoading(ops)        //加载框

Q.alert('OK!')
Q.confirm('OK?',function(yes){
	//do sth
})
```

###下拉列表
```js
var dl = new Q.DropdownList({
	box: element,
	multiple: true,    //是否是多选框
	value: 2           //初始选中的值
});

//添加项
dl.add(text, value);
dl.add({text:text,value:value,disabled:false});

//初始化下拉列表
dl.init();

//选中指定值的项
dl.select(value);

//单选框
dl.text,
dl.value

//多选框
dl.selectedItems => []
```

###右键菜单
```js
var data={
	width: 180,           //菜单宽度
	maxHeight: 300,       //菜单最大高度，超出后出现滚动条
	className: "xp1",
	
	//菜单项
	items:[
		{text:"菜单1",ico:"",id:"",disabled:false},
		{text:"菜单2"},
		{split: true},  //分隔线
		{text:"子菜单",group:{width:160,items:[]}}
	]
};
var cm = new Q.ContextMenu(data, {
	rangeX: x,
	rangeY: x,
	fixedWidth: true
});

/*------------------- api --------------
//更改菜单项文本
cm.setItemText(id, text);

//启用菜单项
cm.enableItems(ids);

//禁用菜单项
cm.disableItems(ids);

//显示菜单项
cm.showItems(ids);

//隐藏菜单项
cm.hideItems(ids);

//显示菜单
cm.show(x,y);

//隐藏菜单
cm.hide();

//自动切换显示或隐藏
cm.toggle(x, y);

//菜单是否为隐藏状态
cm.isHidden();

//注销菜单
cm.destroy();
*/
```

###颜色选择器
```js
//颜色选择器对象
var picker = new Q.ColorPicker;
picker.callback = function (color) {
	el.style.color = color;
};
picker.show(e.clientX, e.clientY);
```

###选项卡
```js
//具体使用见demo
Q.setTabs();
```

###进度条
```js
var pgb = new Q.Progressbar({
    box: $$(".pg-bar")[0],

    //speed: 1,            //速度(0-100)
    //wait: 100,           //每隔多长时间更新一次进度(ms)

    onprogress: function (progress, speed, time) {
        $(".pg-text").html(progress.toFixed(1) + "%");

        //根据进度修改速度和更新时间，可实现进度条由快到慢等特殊控制
        if (progress > 90) {
            //降低速度和更新时间
            if (speed == 0.5) this.set(0.4, 200);
        } else if (progress > 80) {
            //速度减半
            if (speed == 1) this.set(0.5);
        }
    }
});

//启动进度条
pgb.start();

//停止进度条
//pgb.stop();

//重新启动进度条(进度归0)
//pgb.restart();

//设置速度和等待时间
//pgb.set(speed, wait)
```

###数据分页
```js
var pager = new Q.DataPager({
    size: 10,              //页码数量
    pageSize: 10,          //每页显示的数据条数
    boxNav: $(".pager"),   //页码显示区域
    showSize: true,        //是否显示记录条数
    //href: "",
    page: request["page"] || +location.hash.slice(5),  //初始页码

    //自定义记录条数显示函数，需showSize为true
    //drawSize: function (self, html_page, html_count) { },

    //绘制函数
    draw: function (list) {
        var html =
            '<table class="table">' +
                '<tr>' +
                    '<td style="width:25%;">ID</td>' +
                    '<td>Value</td>' +
                '</tr>' +
                list.map(function (data) {
                    var html_row =
                        '<tr>' +
                            '<td>' + data.id + '</td>' +
                            '<td>' + data.value + '</td>' +
                        '</tr>';

                    return html_row;
                }).join('') +
            '</table>';

        $(".v-grid").html(html)
    },
    //加载数据
    load: function (page, callback) {
        //ajax远程加载数据
        $.getJSON(url, { page: page }, function (data) {
            var list = data.data || [];
            callback({ totalCount: data.total, data: list });
        });
    }
});

//页码改变时触发
pager.onchange = function (page) {
    location.hash = "page" + page;
};

//跳转到指定页
//forced:是否强制跳转
//pager.go(page, forced);

//加载并渲染数据
//pager.load(page);

//重新载入指定或当前页数据并渲染
//pager.reload(page);

//设置总的数据条数和每页显示的数据条数
//pager.set(totalCount, pageSize);

//设置数据列表
//pager.setData(data);
```