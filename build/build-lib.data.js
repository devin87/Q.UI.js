//build 配置文件
module.exports = {
    root: "../",

    noStore: true,

    concat: {
        title: "文件合并",

        dir: "../Q.js/src",

        list: [
            {
                src: ["Q.js", "Q.Queue.js", "Q.core.js", "Q.setTimer.js", "Q.query.js", "Q.dom.js", "Q.event.js", "Q.ajax.js", "Q.$.js", "Q.animate.js"],
                dest: "/lib/Q.js"
            },
            {
                src: ["Q.js", "Q.Queue.js", "Q.core.js", "Q.setTimer.js"],
                dest: "/lib/Q.mini.js",

                prefix: "//Q.mini.js (Q.js、Q.Queue.js、Q.core.js、Q.setTimer.js) for jquery 等库\n"
            }
        ],

        replace: [
            //移除\r字符
            [/\r/g, ""],
            //移除VS引用
            [/\/\/\/\s*<reference path="[^"]*" \/>\n/gi, ""]
        ]
    },

    run: ["concat"]
};