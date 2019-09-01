## epub-proj 开发记录
参考网上的课程做的项目 [Sam 老师强推](https://coding.imooc.com/learn/list/285.html)，同时自己做了相应的修改和优化。以下文档记录开发过程中遇到的一些问题及主要技术难点, 顺便记录些有用的 Tips 和 API 等等.（看完这个课程我花了 100 多个小时，文档和 demo 都是后面整理的）

技术栈: vue + vuex + vue-router + node.js + Nginx


- <a href="https://github.com/ChenMingK/epub-Proj/blob/master/%E5%BC%80%E5%8F%91%E6%96%87%E6%A1%A3/%E6%90%AD%E5%BB%BA%E5%BC%80%E5%8F%91%E7%8E%AF%E5%A2%83.md" target="_blank">搭建开发环境</a><br>
- <a href="https://github.com/ChenMingK/epub-Proj/blob/master/%E5%BC%80%E5%8F%91%E6%96%87%E6%A1%A3/%E9%98%85%E8%AF%BB%E5%99%A8%E9%83%A8%E5%88%86%E5%BC%80%E5%8F%91.md" target="_blank">阅读器部分开发</a><br>
- <a href="https://github.com/ChenMingK/epub-Proj/blob/master/%E5%BC%80%E5%8F%91%E6%96%87%E6%A1%A3/epubjs%E7%9B%B8%E5%85%B3API.md" target="_blank">ePubjs相关API</a><br>
- <a href="https://github.com/ChenMingK/epub-Proj/blob/master/%E5%BC%80%E5%8F%91%E6%96%87%E6%A1%A3/%E4%B9%A6%E5%9F%8E%E5%BC%80%E5%8F%91.md" target="_blank">书城部分开发</a><br>
- <a href="https://github.com/ChenMingK/epub-Proj/blob/master/%E5%BC%80%E5%8F%91%E6%96%87%E6%A1%A3/%E4%B9%A6%E6%9E%B6%E5%BC%80%E5%8F%91.md" target="_blank">书架部分开发</a><br>
- <a href="https://github.com/ChenMingK/epub-Proj/blob/master/%E5%BC%80%E5%8F%91%E6%96%87%E6%A1%A3/%E5%90%AC%E4%B9%A6%E6%A8%A1%E5%9D%97%E5%BC%80%E5%8F%91.md" target="_blank">听书模块开发</a><br>
- <a href="https://github.com/ChenMingK/epub-Proj/blob/master/%E5%BC%80%E5%8F%91%E6%96%87%E6%A1%A3/node%E6%9C%8D%E5%8A%A1%E6%90%AD%E5%BB%BA.md" target="_blank">node服务搭建</a><br>
- <a href="https://github.com/ChenMingK/epub-Proj/blob/master/%E5%BC%80%E5%8F%91%E6%96%87%E6%A1%A3/%E9%A1%B9%E7%9B%AE%E4%BC%98%E5%8C%96.md" target="_blank">项目优化</a><br>
- <a href="https://github.com/ChenMingK/epub-Proj/blob/master/%E5%BC%80%E5%8F%91%E6%96%87%E6%A1%A3/Tips.md" target="_blank">Tips</a><br>
- <a href="https://github.com/ChenMingK/epub-Proj/blob/master/%E5%BC%80%E5%8F%91%E6%96%87%E6%A1%A3/%E5%85%AC%E5%85%B1%E7%BB%84%E4%BB%B6%E5%BC%80%E5%8F%91.md">公共组件开发</a>

## 体验地址
项目已发布到服务器，你可以<a href="http://39.108.122.248/works/"> 点击这里体验</a>，~~听书功能因为域名还没备案无法使用~~

## 其他说明

如果你需要下载代码并做本地调试，把 `.env.development` 中的环境变量全部替换为 `.env.production` 即可

另外，由于静态资源服务器上挂了将近 10 GB 的资源，所以不好上传了，你可以下载前端代码以及查看开发文档来 GET 你需要的技能点

## Show
<img src="https://github.com/ChenMingK/ImagesStore/blob/master/imgs/epubProjGif.gif" width=375px>

## 项目结构
```
|-- public
  |-- favicon.ico         // favicon 图标
  |-- index.html          // 项目入口文件(打包前的 index)
|-- src
  |-- api                 // 所有 API 请求(axios)
  |-- assets              // 主题、字体、样式等静态资源
  |-- components          // 各种组件(建一个 common 目录存放全局公用组件)
  |-- lang                // vue-i18n 配置(语言国际化)
  |-- mock                // 没有后端的话 mock 模拟数据
  |-- store               // vuex
  |-- utils               // 全局公用方法
  |-- views               // 视图组件(可视的页面)
  |-- App.vue             // 入口页面
  |-- main.js             // 入口 加载组件 初始化等
  |-- router.js           // vue-router 定义路由
|-- .env.development      // 开发环境配置(线下)
|-- .env.production       // 生产环境配置(线上)
|-- babel.config.js       // babel 配置
|-- .eslintrc.js          // eslint 配置项
|-- .gitignore            // git 忽略项
|-- vue.config.js         // 配置 webpack
```





