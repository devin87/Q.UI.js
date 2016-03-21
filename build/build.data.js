//build 配置文件
module.exports = {
    root: "../",
    dir: "../Q.UI.js",

    noStore: true,

    copy: [
        { title: "同步css", match: "css/*.css" },
        { title: "同步images", match: "images/**" },
        { title: "同步demo", match: "demo/**" },
        { title: "同步lib", match: "lib/**" },
        { title: "同步src", match: "src/**" }
    ],

    run: ["copy"]
};