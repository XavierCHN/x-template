// 所有的需要webpack编译的内容
// 包括xml文件，js文件，ts文件，less文件，css文件，都可以在这里配置
// 但是需要同时到custom_ui_manifest.xml里面才可以使用
const entries = [
    { import: './loading-screen/layout.xml', filename: 'custom_loading_screen.xml' },
    { import: './hud/layout.xml', filename: 'hud.xml' },
    { import: './end_screen/layout.xml', filename: 'endscreen.xml' },
];

module.exports = entries;
