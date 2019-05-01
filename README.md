# epub-proj

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```
## Show
<img src="https://github.com/ChenMingK/ImagesStore/blob/master/imgs/epubProjGif.gif" width=375px>

## Contents
- 项目流程及整体结构
- 搭建开发环境
- 阅读器开发
  - 需求功能分析
  - 代码结构
  - 组件关系
  - 主要技术难点
  - Tips
- 书城开发
  - 需求功能分析
  - 代码结构
  - 组件关系
  - 主要技术难点
  - Tips
- 书架开发
  - 需求功能分析
  - 代码结构
  - 组件关系
  - 主要技术难点
  - Tips
- 使用科大讯飞语音合成技术
- 项目打包
- 搭建node服务及项目上线
- 项目优化

# 项目流程及整体结构
**整体流程**<br>
(1)	搭建开发环境<br>
(2)	阅读器开发<br>
(3)	书城开发<br>
(4)	详情页开发<br>
(5)	书架开发<br>
(6)	听书功能开发<br>
(7)	项目发布<br>

**代码结构**<br>
<img src="https://github.com/ChenMingK/ImagesStore/blob/master/imgs/epubProj15.png">

# 搭建开发环境
具体见<a href="https://blog.csdn.net/qq_37205708/article/details/89399182" target="_blank">vue环境搭建</a>, 包括包括引入iconfont图标和Web字体、配置rem等.

# 阅读器开发
## 需求功能分析
<span><img src="https://github.com/ChenMingK/ImagesStore/blob/master/imgs/epubProj1.png" width=400px></span>&emsp;&emsp;&emsp;
<span><img src="https://github.com/ChenMingK/ImagesStore/blob/master/imgs/epubProj2.png" width= 200px></span><br>
点击阅读器主体中间部分显示菜单栏，再次点击后隐藏；点击主体左侧部分跳转到上一页，点击右侧部分跳转到下一页;<br>
菜单栏选项：目录/书签，进度查看及跳转，主题切换，字号/字体设置

## 代码结构
|-- public<br>
&emsp;     |-- favicon.ico &emsp;       	// favicon图标<br>
&emsp;     |-- index.html &emsp;        // 项目入口文件(打包前的index)<br>
|-- src<br>
|&emsp;    |-- api &emsp;              	 // 所有API请求(axios)<br>
|&emsp;    |-- assets &emsp;            	 // 主题、字体等静态资源、样式<br>
|&emsp;    |-- components &emsp;      	 // 各种组件<br>
&emsp;&emsp;  	  |-- EbookBookmark.vue &emsp; 	// 蒙版组件<br>
&emsp;&emsp;  	  |-- EbookFooter.vue	&emsp; 	// 页脚组件<br>
&emsp;&emsp;  	  |-- EbookHeader.vue &emsp; 	// 页眉组件<br>
&emsp; &emsp; 	  |-- EbookLoading.vue	&emsp;  // 加载动画组件<br>
&emsp;&emsp;  	  |-- EbookMenu.vue	&emsp; 	// （下方）菜单栏组件<br>
&emsp;&emsp;  	  |-- EbookTitle.vue	&emsp; 	// 上方标题组件（与菜单栏一同时）<br>
&emsp;&emsp;  	  |-- EbookReader.vue	&emsp; 	// 挂载电子书的组件<br>
&emsp;&emsp; 	  |-- EbookSettingFont.vue &emsp; 	// 设置字体的组件<br>
&emsp;&emsp; 	  |-- EbookSettingFontPopup.vue &emsp;  // 选择字体时的弹窗组件<br>
&emsp;&emsp; 	  |-- EbookSettingProgress.vue	&emsp;   // 显示阅读进度组件<br>
&emsp;&emsp; 	  |-- EbookSettingTheme.vue	 &emsp;  // 设置主题组件<br>
&emsp;&emsp; 	  |-- EbookSlide.vue	&emsp; 		  // 目录组件<br>
&emsp;&emsp; 	  |-- EbookSlideBookmark.vue	&emsp;   // 滚动蒙版组件<br>
&emsp;&emsp; 	  |-- EbookSlideContents.vue	&emsp;   // 滚动内容组件<br>
|&emsp;    |-- lang    &emsp;          	 //; vue-i18n配置(语言国际化)<br>
&emsp;&emsp; 	  |-- cn.js		&emsp; 	 // 中文内容<br>
&emsp;&emsp; 	  |-- en.js	&emsp; 	 // 英文内容<br>
&emsp;&emsp; 	  |-- index.js		&emsp; 	 // 导出vuei18n（main.js引入）<br>
|&emsp;    |-- store   &emsp;         	 // vuex<br>
&emsp;&emsp; 	  |-- modules<br>&emsp; 
&emsp;&emsp;&emsp; 	  	 |-- book.js	&emsp; 	 // 定义阅读器部分vuex的state和mutations<br>
&emsp;&emsp; 	  |-- action.js	&emsp; 		 // 定义actions（for mapActions）<br>
&emsp;&emsp; 	  |-- getter.js	&emsp; 		 // 定义getters（for mapGetters）<br>
&emsp;&emsp; 	  |-- index.js	&emsp; 		 // 导出vuex（main.js引入）<br>
|&emsp;    |-- utils    &emsp;         	 // 全局公用方法<br>
|&emsp;    |-- views   &emsp;          	 // 视图组件(用于展示页面的组件)<br>
&emsp;&emsp; 	   |-- ebook<br>
&emsp;&emsp;&emsp; 		  |-- index.vue	&emsp;  // 阅读器入口<br>
|&emsp;   |-- App.vue    &emsp;       	 // 入口页面<br>
|&emsp;   |-- main.js    &emsp;       	 // 入口 加载组件 初始化等<br>
|&emsp;  |-- router.js  &emsp;        	// vue-router定义路由<br>
以下省略<br>


## 组件关系
<img src="https://github.com/ChenMingK/ImagesStore/blob/master/imgs/epubProj3.png">

## 主要技术难点

### 1.epubjs相关API的使用
<a href="https://github.com/futurepress/epub.js" target="_blank">ePubjs github地址</a>

**(1)ePub电子书的解析和渲染**<br>

``` javaScript
// 生成Book对象
this.book = new Epub(DOWNLOAD_URL)
// 通过Book.renderTo生成Rendition对象
this.rendition = this.book.renderTo('read', {
  width: window.innerWidth,
  height: window.innerHeight,
  method: 'default'
})
// 通过Rendtion.display渲染电子书
this.rendition.display()
```
**(2)ePub电子书翻页**<br>

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

**(3)ePub电子书的字号设置和场景切换**<br>

``` javaScript
// 设置主题
function setTheme(index) {
  this.themes.select(this.themeList[index].name)
  this.defaultTheme = index
}
// 注册主题
function registerTheme() {
  this.themeList.forEach(theme => {
  this.themes.register(theme.name, theme.style)
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

**(4)ePub电子书生成目录和定位信息**<br>

``` javaScript
// Book对象的钩子函数ready
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

**(5)epub电子书通过百分比定位**<br>

``` javaScript
function onProgressChange(progress) {
  const percentage = progress / 100
  const location = percentage > 0 ? this.locations.cfiFromPercentage(percentage) : 0
  this.rendition.display(location)
}
```

**(6)设置电子书字体格式**<br>
rendition对象上获取场景对象theme, 通过theme对象的font()方法实现<br>
在main.js中引用对于独立的iframe DOM来说是无效的, 必须将字体注入到阅读器的iframe中才能引用.<br>
使用epubjs提供的rendition的钩子函数, content表示阅读器渲染完可以获取到资源文件时调用的方法, contents对象用于管理阅读器的资源.<br>
contents对象提供addStylesheet方法用于添加样式文件<br>
下面是ePubjs content.js部分的源码

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
源码中可以看到这种引用方法必须是一个url，所以不能用相对路径。那么如何引入呢？把字体样式放在Nginx静态资源服务器下，通过链接来注入(打开的链接能直接看到css就行)
``` javaScript
// rendition钩子函数：将字体文件注入epub iframe
 this.rendition.hooks.content.register(contents => {
   Promise.all([
    contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/daysOne.css`), // 不能使用路径，使用url才能正确导入（内部通过link引入）
    contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/cabin.css`),   // 该方法放回一个Promise对象
    contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/montserrat.css`), // 这里使用环境变量
    contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/tangerine.css`)  // 环境变量存储在.env.development中
   ]).then(() => {
       // 可以在字体加载完毕后做其他操作
   })
})
```
addStylesheet本身返回一个Promise对象, 使用Promise.all可以实现在字体全部加载完后执行其他操作.<br>
之后可以通过`this.currentBook.rendition.themes.font('Times New Roman')`来切换字体

**(7)ePub电子书的解析和渲染**<br>
**(8)ePub电子书的解析和渲染**<br>
**(9)ePub电子书的解析和渲染**<br>
## Tips

### 环境变量与模式
.env&emsp;&emsp;        # 在所有的环境中被载入<br>
.env.local&emsp;        # 在所有的环境中被载入，但会被 git 忽略<br>
.env.[mode]&emsp;       # 只在指定的模式中被载入<br>
.env.[mode].local&emsp; # 只在指定的模式中被载入，但会被 git 忽略<br>
<br>
模式是 Vue CLI 项目中一个重要的概念。默认情况下，一个 Vue CLI 项目有三个模式：<br>
•	development 模式用于 vue-cli-service serve<br>
•	production 模式用于 vue-cli-service build 和 vue-cli-service test:e2e<br>
•	test 模式用于 vue-cli-service test:unit<br>
<br>
<font color=red>只有以 VUE_APP_ 开头的变量会被 webpack.DefinePlugin 静态嵌入到客户端侧的包中。</font><br>
你可以在应用的代码中这样访问它们: `console.log(process.env.VUE_APP_SECRET)`<br><br>
在构建过程中，process.env.VUE_APP_SECRET 将会被相应的值所取代. 在 VUE_APP_SECRET=secret 的情况下, 它会被替换为 "sercet". <br><br>
引入环境变量的过程如下: 在与src平级的目录下创建<br>
.env.development：用于vue-cli-serve serve<br>
创建如下一个环境变量: `VUE_APP_RES_URL=http://192.168.197.1:8081`, 组件中引用这个环境变量: `${process.env.VUE_APP_RES_URL}`<br>
.env.production：用于vue-cli-build build<br>
注意：配置了环境变量后需要重新启动服务，因为环境变量是一次性被加载到内存中的<br>

