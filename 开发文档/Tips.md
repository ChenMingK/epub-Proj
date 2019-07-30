## 1.样式代码的复用
- global.scss 聚合所有其他的 scss 文件，便于组件引入
- transition.scss 保存 vue-transition 相关的样式
- reset.scss 为重置页面样式的代码
- mixin.scss 为可重复使用的样式及 scss 方法

``` scss
@mixin absCenter {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto; // 绝对定位居中
}
@mixin center {
    display: flex;
    justify-content: center;
    align-items: center;
}
```

## 2.统一管理静态变量和通用方法
在 utils 文件夹下新建 book.js(命名表示这些静态变量和方法是谁的)

比如将字号数组放在此处，组件中通过 `import { FONT_SIZE_LIST } from '../../utils/book'` 导入

```
export const FONT_SIZE_LIST = [
  { fontSize: 12 },
  { fontSize: 14 },
  { fontSize: 16 },
  { fontSize: 18 },
  { fontSize: 20 },
  { fontSize: 22 },
  { fontSize: 24 }
]
```

## 3.vue-transition 过渡动画的使用
- 使用 v-show / v-if 动态显示或隐藏元素时，会触发过渡动画
- transition 需要指定 name，并包裹一个含 v-show 的 div
- vue 会为 transition 包裹的 div 动态添加 class，共 6 种

<img src="https://github.com/ChenMingK/ImagesStore/blob/master/imgs/epubProj14.png" width=500px>

v-enter: 显示之前 v-enter-to: 显示之后 v-enter-active: 显示的过程

v-leave: 隐藏之前 v-leave-to: 隐藏之后 v-leave-active: 隐藏的过程

注意 transition 的样式必须和包裹的 div 同级（scss）

PopUp 效果：显示时为上拉淡入效果，隐藏时为下拉淡出效果

``` scss
.popup-slide-up-enter, .popup-slide-up-leave-to {
  transform: translate3d(0, 100%, 0); // 显示之前和隐藏之后高度下移100%
  opacity: 0;
}
.popup-slide-up-enter-to, .popup-slide-up-leave{
  transform: translate3d(0, 0, 0);	 // 显示之后(完成显示)和隐藏之前为原位置（样式位置）
  opacity: 1;
}
// 显示和隐藏的过程所有属性线性过渡
.popup-slide-up-enter-active, .popup-slide-up-leave-active {
  transition: all $animationTime linear; // $animationTime:使用变量统一管理动画时间等
}
```

## 4.环境变量和模式
```js
.env                    # 在所有的环境中被载入
.env.local              # 在所有的环境中被载入，但会被 git 忽略
.env.[mode]             # 只在指定的模式中被载入
.env.[mode].local       # 只在指定的模式中被载入，但会被 git 忽略
```

模式是 Vue CLI 项目中一个重要的概念。默认情况下，一个 Vue CLI 项目有三个模式：
- development 模式用于 vue-cli-service serve
- production 模式用于 vue-cli-service build
- test 模式用于 vue-cli-service test:unit

只有以 VUE_APP_ 开头的变量会被 webpack.DefinePlugin 静态嵌入到客户端侧的包中。

你可以在应用的代码中这样访问它们: `console.log(process.env.VUE_APP_SECRET)`

在构建过程中，process.env.VUE_APP_SECRET 将会被相应的值所取代. 在 VUE_APP_SECRET=secret 的情况下, 它会被替换为 "sercet".

引入环境变量的过程如下: 在与 src 平级的目录下创建

- .env.development：用于 vue-cli-serve serve

创建如下一个环境变量: `VUE_APP_RES_URL=http://192.168.197.1:8081`, 组件中引用这个环境变量: `${process.env.VUE_APP_RES_URL}`

- .env.production：用于vue-cli-build build

:warning: 配置了环境变量后需要重新启动服务，因为环境变量是一次性被加载到内存中的

## 5.localStorage 库的使用
github 地址:https://www.cnblogs.com/wuchangming/p/4897703.html

`cnpm i --save web-storage-cache`

在 utils 目录下创建 localStorage.js 并引入该库

``` javaScript
// 该库可以将传入的字符串/对象变为 JSON，读取时可以将 JSON 变为字符串
// 这是别人封装的，操作起来更方便
import Storage from 'web-storage-cache'
const localStorage = new Storage()
封装基本操作：
export function setLocalStorage(key, value) { // key, value形式存储
  return localStorage.set(key, value)
}

export function getLocalStorage(key) { // 传入key即可获取数据
  return localStorage.get(key)
}

export function removeLocalStorage(key) { // 删除localStorage中的值
  return localStorage.delete(key)
}

export function clearLocalStorage() {   // 清除缓存
  return localStorage.clear()
}
```

## 6.input 标签删除默认样式
``` scss
.slide-contents-search-input {
    flex: 1;
    width: 100%;
    height: px2rem(32);
    font-size: px2rem(14);
    background: transparent; // 删除默认背景颜色
    border: none;            // 删除默认边框
    &:focus {
        outline: none;  // 删除选中时的边框
    }
}
```

## 7.浅灰色的搜索框样式
<img src="https://github.com/ChenMingK/ImagesStore/blob/master/imgs/epubProj18.png">

去除 input 标签自带的边框和背景色，去除点击时的 outline，改变 placeholder 的颜色

``` scss
.input {
  width: 100%;
  height: px2rem(22);
  border: none;            // 去掉搜索框边框
  background: transparent; // 去掉搜索框背景色
  margin-left: px2rem(12);
  color: #666666;
  &:focus {
    outline: none; // 去除点击时的边框
  }
  &::-webkit-input-placeholder { // placeholder color
    color: #ccc;
  }
}
```

## 8.mock.js 模拟后台数据
开发环境下通过 mock.js 模拟接口数据,源码: https://github.com/nuysoft/Mock

实现原理：替换原生的 XMLHttpRequest

好处：不需要改变现有的网络请求代码，线下本地调试与线上 url 一样

提供丰富的数据类型，但是不支持 blob 类型，无法模拟下载

使用步骤:

1.cnpm i mockjs -D (save-dev)

2.cnpm i axios –save (http请求)

3.src 目录下创建 mock 文件夹

4.以 json 对象的形式模拟接口数据（自己编写），同时在该目录下编写 index.js 对 mock 进行初始化，如下

``` javaScript
// export default Mock
import Mock from 'mockjs'
// 各个模块的数据
import home from './bookHome'         
import shelf from './bookShelf'
import list from './bookList'
import flatList from './bookFlatList'

// mock方法，三个参数
Mock.mock(/\/book\/home/, 'get', home) // 前端访问 book/home 时会请求这里的数据
Mock.mock(/\/book\/shelf/, 'get', shelf)
Mock.mock(/\/book\/list/, 'get', list)
Mock.mock(/\/book\/flat-list/, 'get', flatList)
```
mock 方法, 传递参数： 
- 第一个参数：正则表达式：匹配请求的 url
- 第二个参数：请求的方式
- 第三个参数：返回的数据

前端在 /book/home路 径下的网络请求都会得到这里 mock 的数据

>我都用 node.js 直接搭个服务，启动 cors 模块允许所有跨域请求，这样还快点......

5.main.js 导入
### 第二种 mock 方式，利用本地服务
在 vue.config.js 中添加如下代码，重新启动服务，输入：IP:8080/book/home 就可以请求到数据

``` javaScript
// 添加自定义的接口  参数：全局对象，模拟的url，要传递的数据
function mock(app, url, data) {
  app.get(url, (request, response) => {
    response.json(data) // 将data变为json对象传入
  })
}

// 模拟接口,require导入手动编写的数据
const homeData = require('./src/mock/bookHome')
const shelfData = require('./src/mock/bookShelf')
const listData = require('./src/mock/bookList')
const flatListData = require('./src/mock/bookFlatList')
module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
        ? './'
        : '/',
    devServer: {
      // 在应用启动之前模拟接口
      before(app) {
        mock(app, '/book/home', homeData)       // 访问/book/home这个路径能获取数据？
        mock(app, '/book/shelf', shelfData)
        mock(app, '/book/list', listData)
        mock(app, '/book/flat-list', flatListData)
      }
    }
}
```

## 9.使用 vue-create-api 快速创建全局公共组件
github地址：https://github.com/cube-ui/vue-create-api/blob/master/README_zh-CN.md

1.cnpm i -S vue-create-api

2.utils 文件夹下新建 create-api.js

``` javaScript
// use vue-create-api
// 通过API的形式调用组件
// 会在body()最外层添加组件，一般弹窗之类的才会使用(全屏)
// 使用vue-create-api的组件必须增加一个name属性
import CreateAPI from 'vue-create-api'
import Vue from 'vue'
import Toast from '../components/common/Toast' // 需要使用的公共组件
import Popup from '../components/common/Popup'
import GroupDialog from '../components/shelf/ShelfGroupDialog.vue'

Vue.use(CreateAPI)
Vue.createAPI(Toast, true)
Vue.createAPI(Popup, true)
Vue.createAPI(GroupDialog, true)
```
3.组件中使用（JS创建组件）

main.js导入 `import './utils/create-api'`

``` javaScript
// Vue.createAPI(Toast, true) => this.$createToast
this.$createToast({
  $props: {

  }
}).show() // 前面完成DOM的创建, show()方法完成组件的展示
```
注意 vue-create-api 使用的组件必须添加一个 name 属性如 `name: 'toast',`

4.进一步简化
``` javaScript
// 全局mixin 组件中
// mixin后使用this.toast()即可调用
Vue.mixin({
  methods: {
    toast(settings) {
      return this.$createToast({
        // 组件要传入的数据
        $props: settings
      })
    },
    popup(settings) {
      return this.$createPopup({
        $props: settings
      })
    },
    // 更简洁的toast
    simpleToast(text) {
      const toast = this.toast({
        text: text
      })
      toast.show()
      toast.updateText(text)
    },
    dialog(settings) {
      return this.$createGroupDialog({
        $props: settings
      })
    }
  }
})
```
<img src="https://github.com/ChenMingK/ImagesStore/blob/master/imgs/epubProj31.png"><

:warning: 可以看到这类组件应该为全屏的，因为 vue-create-api 是在与 App 组件同级创建新的组件的
## 其他
- 在顶层指定 font-size 为 0 可以消除 div 之间的空格
- 滚动条和文字的缩略显示必须指定最外层的宽度
- 移动端屏幕闪烁问题：在 reset.scss 定义 `-webkit-tap-highlight-color: rgba(0, 0, 0, 0);`
表示移动端触碰屏幕时高亮显示颜色，设置透明度为 0 则不会有高亮颜色。
- 下拉手势在手机上可能触发其他操作的问题：加入 e.preventDefault() 禁止其他操作 e.stopPropagation() 禁止冒泡
- 什么时候使用 this.$nextTick()? DOM 并不会立即更新，对于需要在某些组件显示/更新之后才能调用的操作可以放在 nextTick() 中
- 画分割线：用 border-top 属性来画线，height 设置为 0
