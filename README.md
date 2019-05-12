# epub-proj开发记录
跟网上的老师学做的项目，同时自己做了相应的修改和优化。以下文档记录开发过程中遇到的一些问题及主要技术难点, 顺便记录些有用的Tips和API等等.<br>
技术栈: vue + vuex + vue-router + node.js + Nginx<br>
**项目已发布到服务器(仍然有一些Bug)** 你可以<a href="http://39.108.122.248/works/">点击这里体验</a>，听书功能因为域名还没备案无法使用
- <a href="https://github.com/ChenMingK/epub-Proj/blob/master/%E5%BC%80%E5%8F%91%E6%96%87%E6%A1%A3/%E6%90%AD%E5%BB%BA%E5%BC%80%E5%8F%91%E7%8E%AF%E5%A2%83.md" target="_blank">搭建开发环境</a><br>
- <a href="https://github.com/ChenMingK/epub-Proj/blob/master/%E5%BC%80%E5%8F%91%E6%96%87%E6%A1%A3/%E9%98%85%E8%AF%BB%E5%99%A8%E9%83%A8%E5%88%86%E5%BC%80%E5%8F%91.md" target="_blank">阅读器部分开发</a><br>
- <a href="https://github.com/ChenMingK/epub-Proj/blob/master/%E5%BC%80%E5%8F%91%E6%96%87%E6%A1%A3/epubjs%E7%9B%B8%E5%85%B3API.md" target="_blank">ePubjs相关API</a><br>
- <a href="https://github.com/ChenMingK/epub-Proj/blob/master/%E5%BC%80%E5%8F%91%E6%96%87%E6%A1%A3/%E4%B9%A6%E5%9F%8E%E5%BC%80%E5%8F%91.md" target="_blank">书城部分开发</a><br>
- <a href="https://github.com/ChenMingK/epub-Proj/blob/master/%E5%BC%80%E5%8F%91%E6%96%87%E6%A1%A3/%E4%B9%A6%E6%9E%B6%E5%BC%80%E5%8F%91.md" target="_blank">书架部分开发</a><br>
- <a href="https://github.com/ChenMingK/epub-Proj/blob/master/%E5%BC%80%E5%8F%91%E6%96%87%E6%A1%A3/%E5%90%AC%E4%B9%A6%E6%A8%A1%E5%9D%97%E5%BC%80%E5%8F%91.md" target="_blank">听书模块开发</a><br>
- <a href="https://github.com/ChenMingK/epub-Proj/blob/master/%E5%BC%80%E5%8F%91%E6%96%87%E6%A1%A3/node%E6%9C%8D%E5%8A%A1%E6%90%AD%E5%BB%BA.md" target="_blank">node服务搭建</a><br>
- <a href="https://github.com/ChenMingK/epub-Proj/blob/master/%E5%BC%80%E5%8F%91%E6%96%87%E6%A1%A3/%E9%A1%B9%E7%9B%AE%E4%BC%98%E5%8C%96.md" target="_blank">项目优化</a><br>
- <a href="https://github.com/ChenMingK/epub-Proj/blob/master/%E5%BC%80%E5%8F%91%E6%96%87%E6%A1%A3/Tips.md" target="_blank">Tips</a><br>


# 大致代码结构
|-- public<br>
&emsp;|-- favicon.ico &emsp;// favicon图标<br>
&emsp;|-- index.html &emsp;// 项目入口文件(打包前的index)<br>
|-- src<br>
|&emsp;|-- api &emsp;&emsp;// 所有API请求(axios)<br>
|&emsp;|-- assets &emsp;&emsp;// 主题、字体、样式等静态资源<br>
|&emsp;|-- components &emsp;// 各种组件(建一个common目录存放全局公用组件)<br>
|&emsp;|-- lang &emsp;&emsp;// vue-i18n配置(语言国际化)<br>
|&emsp;|-- mock &emsp;&emsp;// 没有后端的话mock模拟数据<br>
|&emsp;|-- store &emsp;&emsp;// vuex<br>
|&emsp;|-- utils &emsp;&emsp;// 全局公用方法<br>
|&emsp;|-- views &emsp;&emsp;// 视图组件(可视的页面)<br>
|&emsp;|-- App.vue &emsp;// 入口页面<br>
|&emsp;|-- main.js &emsp;// 入口 加载组件 初始化等<br>
|&emsp;|-- router.js &emsp;// vue-router定义路由<br>
|-- .env.development &emsp;// 开发环境配置(线下)<br>
|-- .env.production &emsp;// 生产环境配置(线上)<br>
|-- babel.config.js &emsp;// babel配置<br>
|-- .eslintrc.js  &emsp;// eslint配置项<br>
|-- .gitignore  &emsp;// git忽略项<br>
|-- vue.config.js &emsp;// 配置webpack等<br>

# Show
<img src="https://github.com/ChenMingK/ImagesStore/blob/master/imgs/epubProjGif.gif" width=375px>
