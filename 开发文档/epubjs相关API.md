## epub.js 源码地址: https://github.com/futurepress/epub.js
## 1.epub 电子书的解析和渲染

``` javaScript
// 生成 Book 对象
this.book = new Epub(DOWNLOAD_URL)
// 通过Book.renderTo生成Rendition对象
this.rendition = this.book.renderTo('read', {
  width: window.innerWidth,
  height: window.innerHeight,
  method: 'default'
})
// 通过 Rendtion.display 渲染电子书
this.rendition.display()
```

## 2.epub 电子书翻页
``` javaScript
// 上一页
function prevPage() {
  if (this.rendition) {
  this.rendition.prev()
  }
}
// 下一页
function nextPage() {
  if (this.rendition) {
  this.rendition.next()
  }
}
```

## 3.ePub 电子书的字号设置和场景切换

``` javaScript
// 设置主题
function setTheme(index) {
  this.themes.select(this.themeList[index].name) // 通过主题名选择
  this.defaultTheme = index
}
// 注册主题
function registerTheme() {
  this.themeList.forEach(theme => {
  this.themes.register(theme.name, theme.style) // style中设置字体颜色和body颜色
  })
}
// 设置字号大小
function setFontSize(fontSize) {
  this.defaultFontSize = fontSize
  if (this.themes) {
  this.themes.fontSize(fontSize + 'px')
  }
}
```

## 4.ePub 电子书生成目录和定位信息

``` javaScript
// Book 对象的钩子函数 ready
this.book.ready.then(() => {
  // 生成目录
  this.navigation = this.book.navigation
  // 生成Locations对象
  return this.book.locations.generate()
}).then(result => {
  // 保存locations对象
  this.locations = this.book.locations
  // 标记电子书为解析完毕状态
  this.bookAvailable = true
})
```

## 5.epub 电子书通过百分比定位

``` javaScript
function onProgressChange(progress) {
  const percentage = progress / 100
  const location = percentage > 0 ? this.locations.cfiFromPercentage(percentage) : 0
  this.rendition.display(location)
}
```

## 6.设置电子书字体格式
rendition 对象上获取场景对象 theme, 通过 theme 对象的 font() 方法实现

在 main.js 中引用对于独立的 iframe DOM 来说是无效的, 必须将字体注入到阅读器的 iframe 中才能引用.

使用 epubjs 提供的 rendition 的钩子函数, content 表示阅读器渲染完可以获取到资源文件时调用的方法, contents 对象用于管理阅读器的资源.

contents 对象提供 addStylesheet 方法用于添加样式文件

下面是 ePubjs content.js 部分的源码:

``` javaScript
/**
	 * Append a stylesheet link to the document head
	 * @param {string} src url
   */
addStylesheet(src) {
  return new Promise(function(resolve, reject){
    var $stylesheet;
    var ready = false;

    if(!this.document) {
      resolve(false);
      return;
    }

    // Check if link already exists
    $stylesheet = this.document.querySelector("link[href='"+src+"']");
    if ($stylesheet) {
      resolve(true);
      return; // already present
    }

    $stylesheet = this.document.createElement("link");
    $stylesheet.type = "text/css";
    $stylesheet.rel = "stylesheet";
    $stylesheet.href = src;
    $stylesheet.onload = $stylesheet.onreadystatechange = function() {
      if ( !ready && (!this.readyState || this.readyState == "complete") ) {
        ready = true;
        // Let apply
        setTimeout(() => {
          resolve(true);
        }, 1);
      }
    };
    this.document.head.appendChild($stylesheet);
  }.bind(this));
}
```
源码中可以看到这种引用方法必须是一个 url，所以不能用相对路径。那么如何引入呢？

把字体样式放在 Nginx 静态资源服务器下，通过链接来注入(打开的链接能下载这个 css 文件)

``` javaScript
// rendition钩子函数：将字体文件注入epub iframe
 this.rendition.hooks.content.register(contents => {
   Promise.all([
    contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/daysOne.css`), // 不能使用路径，使用 url 才能正确导入（内部通过link引入）
    contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/cabin.css`),   // 该方法放回一个 Promise 对象
    contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/montserrat.css`), // 这里使用环境变量
    contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/tangerine.css`)  // 环境变量存储在.env.development中(开发环境)
   ]).then(() => {
       // 可以在字体加载完毕后做其他操作
   })
})
```
addStylesheet 本身返回一个 Promise 对象, 使用 Promise.all 可以实现在字体全部加载完后执行其他操作.

之后可以通过 `this.currentBook.rendition.themes.font('Times New Roman')` 来切换字体

## 7.主题注册
通过 Themes 对象的 register 方法进行注册，传入的参数为主题名称，对应的样式，theme 对象格式如下：

``` javaScript
{
  alias: vue.$t('book.themeDefault'), // 国际化文字
  name: 'Default', // 主题名称
  style: {
    body: {
      'color': '#4c5059',                         // 字体颜色
      'background': '#cecece',                    // 背景颜色
      'padding-top': `${realPx(48)}px!important`, // 自适应的padding，留给页眉和页脚
      'padding-bottom': `${realPx(48)}px!important`
    }
  }
},
```
主题的切换这里实现的主要是改变字体颜色和背景颜色, 然后只需要注册主题就可以进行主题切换了

``` javaScript
this.themeList.forEach(theme => {
    this.rendition.themes.register(theme.name, theme.style) // 每次初始化都需要给 rendition 对象注册主题
})
this.rendition.themes.select(defaultTheme) // 不要从 vuex 中取，因为是异步执行的
```

## 8.全文搜索功能
使用官方提供的搜索 tips

``` javaScript
/* spineItems 为 Section 对象，管理当前章节的整个内容；
   调用该对象的 load 方法将 book 对象作为上下文传入----获取所有文本信息
   调用该对象的 find 方法，传入搜索关键字---实现当前章节检索
   这里通过遍历的方法将所有章节都进行了一次搜索操作 
*/ 
doSearch(q) {
    return Promise.all(
      this.currentBook.spine.spineItems.map(item => item.load(this.currentBook.load.bind(this.currentBook))
        .then(item.find.bind(item, q))
        .finally(item.unload.bind(item)))) // unload释放资源
        .then(results => Promise.resolve([].concat.apply([], results))) // 二维数组降维
}
```
搜索结构中的 cfi 字段可以传入 Rendition 对象的 display 方法用于展示.

<img src="https://github.com/ChenMingK/ImagesStore/blob/master/imgs/epubProj16.png">

## 9.EpubCfi原 理概述
cfi 格式形如:

"epubcfi(/6/10[A339305_1_En_1_Chapter]!/4/12/2[Sec1]/10[Par9]/1:368)"

"epubcfi(/6/10[A339305_1_En_1_Chapter]!/4/12/2[Sec1]/4[Par2]/1:838)"

通过 book.rendition.currentLocation() 方法打印如下图 

<img src="https://github.com/ChenMingK/ImagesStore/blob/master/imgs/epubProj5.png">

其中的 start 对象的 cfi 和 end 对象的 cfi 就表示当前电子书页面中的第一个文字和最后一个文字的位置

其匹配规则如下:

`epubcfi(/6/10[A339305_1_En_1_Chapter]!/4/12/2[Sec1]/10[Par9]/1:368)`

- 前面一部分是对应的位置
- `[]` 中为当前文件
- `start` 指定第一个文字
- `!`后为路由，双数（2的倍数）表示在 DOM 上进行查找，如果是单数和冒号表示在文本中进行查找

<img src="https://github.com/ChenMingK/ImagesStore/blob/master/imgs/epubProj6.png" width=60%>

<img src="https://github.com/ChenMingK/ImagesStore/blob/master/imgs/epubProj7.png" width=60%>

<img src="https://github.com/ChenMingK/ImagesStore/blob/master/imgs/epubProj8.png" width=60%>

## 10.阅读器分页算法
要把一本书分为多少页以及如何精确地切换页数是一个很困难的问题, 影响分页的因素有很多, 比如:
- 屏幕尺寸的改变
- 字体大小改变, 字越大分到的页越多
- 插图导致分页的不同

<img src="https://github.com/ChenMingK/ImagesStore/blob/master/imgs/epubProj9.png">
