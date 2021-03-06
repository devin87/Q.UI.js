﻿//build 配置文件
module.exports = {
    root: "../",

    noStore: true,

    concat: {
        title: "文件合并",

        dir: "src",

        list: [
            {
                src: ["Q.UI.Box.js", "Q.UI.ContextMenu.js", "Q.UI.DropdownList.js", "Q.UI.DataPager.js", "Q.UI.Tabs.js", "Q.UI.Marquee.js", "Q.UI.ColorPicker.js", "Q.UI.Progressbar.js", "Q.UI.RangeSlider.js"],
                dest: "/Q.UI.js"
            },
            {
                src: ["/lib/Q.mini.js", "adapter/jquery.js", "/Q.UI.js"],
                dest: "/jquery.QUI.js"
            }
        ],

        replace: [
            //移除\r字符
            [/\r/g, ""],
            //移除VS引用
            [/\/\/\/\s*<reference path="[^"]*" \/>\n/gi, ""]
        ]
    },

    cmd: [
        {
            title: "压缩js",

            //cmd: "java -jar D:\\tools\\compiler.jar --js=%f.fullname% --js_output_file=%f.dest%",
            cmd: "uglifyjs %f.fullname% -o %f.dest% -c -m",

            output: "dist",
            match: ["lib/*.js", "*.js", "src/**.js"],

            replace: [
                //去掉文件头部压缩工具可能保留的注释
                [/^\/\*([^~]|~)*?\*\//, ""]
            ],

            //可针对单一的文件配置 before、after,def 表示默认
            before: [
                {
                    "def": "//devin87@qq.com\n",
                    "Q.js": "//Q.js devin87@qq.com\n//mojoQuery&mojoFx scott.cgi\n",
                    "Q.mini.js": "//Q.mini.js devin87@qq.com\n",
                    "jquery-1.11.3.js": "/*! jQuery v1.11.3 | (c) jQuery Foundation | jquery.org/license */\n",
                    "jquery-1.12.0.js": "/*! jQuery v1.12.0 | (c) jQuery Foundation | jquery.org/license */\n"
                },
                {
                    "def": "//build:%NOW%\n",
                    "jquery-1.11.3.js": "",
                    "jquery-1.12.0.js": ""
                }
            ]
        }
    ],

    copy: {
        title: "同步demo到jquery-demo",
        dir: "demo",
        match: ["**"],
        output: "/jquery-demo"
    },

    format: {
        title: "修改jquery-demo html 为jquery引用",

        dir: "jquery-demo",
        match: ["*.html"],
        autoSkip: false,

        replace: [
            ['<script type="text/javascript" src="../lib/Q.js"></script>',
            '<script type="text/javascript" src="../lib/jquery-1.12.0.js"></script>\n    ' +
            '<script type="text/javascript" src="../lib/Q.mini.js"></script>\n    ' +
            '<script type="text/javascript" src="../src/adapter/jquery.js"></script>']
        ]
    },

    run: ["concat", "cmd", "copy", "format"]
};