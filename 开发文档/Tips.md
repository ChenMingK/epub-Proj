## 1.样式代码的复用
- global.scss 聚合所有其他的scss文件，便于组件引入
- transition.scss 保存vue-transition相关的样式
- reset.scss 为重置页面样式的代码
- mixin.scss 为可重复使用的样式/scss方法

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
在utils文件夹下新建book.js(命名表示这些静态变量和方法是谁的)<br>
比如将字号数组放在此处，组件中通过`import { FONT_SIZE_LIST } from '../../utils/book'`导入

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

## 3.vue-transition过渡动画的使用
- 使用v-show动态显示或隐藏元素时，会触发过渡动画
- transition需要指定name，并包裹一个含v-show的div
- vue会为transition包裹的div动态添加class，共6种

<img src="https://github.com/ChenMingK/ImagesStore/blob/master/imgs/epubProj14.png" width=500px><br>
v-enter: 显示之前 v-enter-to: 显示之后 v-enter-active: 显示的过程<br>
v-leave: 隐藏之前 v-leave-to: 隐藏之后 v-leave-active: 隐藏的过程<br>
注意transition的样式必须和包裹的div同级（scss）<br>

PopUp效果：显示时为上拉淡入效果，隐藏时为下拉淡出效果<br>

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
.env&emsp;&emsp;        # 在所有的环境中被载入<br>
.env.local&emsp;        # 在所有的环境中被载入，但会被 git 忽略<br>
.env.[mode]&emsp;       # 只在指定的模式中被载入<br>
.env.[mode].local&emsp; # 只在指定的模式中被载入，但会被 git 忽略<br>
<br>
模式是 Vue CLI 项目中一个重要的概念。默认情况下，一个 Vue CLI 项目有三个模式：<br>
- development 模式用于 vue-cli-service serve<br>
- production 模式用于 vue-cli-service build 和 vue-cli-service test:e2e<br>
- test 模式用于 vue-cli-service test:unit<br>

只有以 VUE_APP_ 开头的变量会被 webpack.DefinePlugin 静态嵌入到客户端侧的包中。<br>
你可以在应用的代码中这样访问它们: `console.log(process.env.VUE_APP_SECRET)`<br>
在构建过程中，process.env.VUE_APP_SECRET 将会被相应的值所取代. 在 VUE_APP_SECRET=secret 的情况下, 它会被替换为 "sercet". <br><br>
引入环境变量的过程如下: 在与src平级的目录下创建<br>
- .env.development：用于vue-cli-serve serve<br>
创建如下一个环境变量: `VUE_APP_RES_URL=http://192.168.197.1:8081`, 组件中引用这个环境变量: `${process.env.VUE_APP_RES_URL}`<br>
- .env.production：用于vue-cli-build build<br>

:warning: 配置了环境变量后需要重新启动服务，因为环境变量是一次性被加载到内存中的<br>

## 5.localStorage库的使用
`cnpm i --save web-storage-cache`<br>
在utils目录下创建localStorage.js并引入该库

``` javaScript
// 该库可以将传入的字符串/对象变为JSON，读取时可以将JSON变为字符串
// 这是别人封装的，操作起来更方便https://www.cnblogs.com/wuchangming/p/4897703.html
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

## 6.input标签删除默认样式
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
<img src="https://github.com/ChenMingK/ImagesStore/blob/master/imgs/epubProj18.png"><br>
去除input标签自带的边框和背景色，去除点击时的outline，改变placeholder的颜色

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

## 其他
- 在顶层指定font-size为0可以消除div之间的空格
- 滚动条和文字的缩略显示必须指定最外层的宽度
- 移动端屏幕闪烁问题：在reset.scss定义`-webkit-tap-highlight-color: rgba(0, 0, 0, 0);`
表示移动端触碰屏幕时高亮显示颜色，设置透明度为0则不会有高亮颜色。
- 下拉手势在手机上可能触发其他操作的问题：加入e.preventDefault()禁止其他操作 e.stopPropagation()禁止冒泡
- 什么时候使用this.$nextTick()?DOM并不会立即更新，对于需要在某些组件显示/更新之后才能调用的操作可以放在nextTick()中
- 画分割线：用border-top属性来画线，height设置为0
