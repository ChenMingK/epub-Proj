<template>
  <div class="ebook-reader">
      <div id="read"></div>
      <div class="ebook-reader-mask"
           @click="onMaskClick"
           @touchmove="move" 
           @touchend="moveEnd"
           @mousedown.left="onMouseEnter"
           @mousemove.left="onMouseMove"    
           @mouseup.left="onMouseEnd"></div>
           <!--通过蒙版实现下拉手势 @touch由epub提供 @mouse适配PC端 -> vue2.0? left->左键-->
  </div>
</template>

<script>
import Epub from 'epubjs'
// import { mapActions } from 'vuex' // this.#store.dispatch('name', params) => this.name(params) 要在methods里解构
import { ebookMixin } from '../../utils/mixin'
import { getFontFamily,
         saveFontFamily,
         getFontSize,
         saveFontSize,
         getTheme,
         saveTheme,
         getLocation
} from '../../utils/localStorage.js'
import { flatten } from '../../utils/book'
import { getLocalForage } from '../../utils/localForage'
global.ePub = Epub
export default {
    mixins: [ebookMixin],   // 混合公共代码
    methods: {
      // 鼠标开始点击
      // 鼠标要防止触发蒙版事件，因为蒙版也是鼠标点击触发的
      // 1-鼠标进入 2-鼠标进入后的移动 3-鼠标从移动状态松手 4-鼠标还原
      onMouseEnter(e) {
        this.mouseMove = 1
        this.mouseStartTime = e.timeStamp
        e.preventDefault()   // 通知浏览器不要执行与事件关联的默认动作。
        e.stopPropagation()  // 不再派发事件。 what?
      },
      // 鼠标移动
      onMouseMove(e) {
        if (this.mouseMove === 1) {
          this.mouseMove = 2
        } else if (this.mouseMove === 2) {
          let offsetY = 0
          if (this.firstOffsetY) {
            offsetY = e.clientY - this.firstOffsetY
            this.$store.commit('SET_OFFSETY', offsetY)
          } else {
            this.firstOffsetY = e.clientY
          }
        }
        e.preventDefault()
        e.stopPropagation()
      },
      // 鼠标松开
      onMouseEnd(e) {
        if (this.mouseMove === 2) {
          this.$store.dispatch('setOffsetY', 0)
          this.firstOffsetY = 0
          this.mouseMove = 3
        }
        // 优化：追加判断点击时间，而不仅仅用移动来判断应该触发什么
        this.mouseEndTime = e.timeStamp
        const time = this.mouseEndTime - this.mouseStartTime
        if (time < 200) {
          this.mouseMove = 1
        }
        e.preventDefault()
        e.stopPropagation()
      },
      // 确定屏幕Y轴偏移量
      move(e) {
        let offsetY = 0
        if (this.firstOffsetY) {
          offsetY = e.changedTouches[0].clientY - this.firstOffsetY // this - vue
          this.setOffsetY(offsetY)
        } else {
          this.firstOffsetY = e.changedTouches[0].clientY
        }
        e.preventDefault()  // 防止下拉时显示些多余的东西
        e.stopPropagation() // 禁止传播？
      },
      // 手指离开屏幕需要还原
      moveEnd(e) {
        this.setOffsetY(0)
        this.firstOffsetY = 0
      },
      onMaskClick(e) {
        if (this.mouseMove === 2) {
        } else if (this.mouseMove === 1 || this.mouseMove === 4) {
          const offsetX = e.offsetX
          const width = window.innerWidth
          if (offsetX > 0 && offsetX < width * 0.3) {
            this.prevPage()
          } else if (offsetX > 0 && offsetX > width * 0.7) {
            this.nextPage()
          } else {
            this.toggleMenuVisible()
          }
        }
        this.mouseMove = 4
      },
      prevPage () {
          if (this.rendition) {
              this.rendition.prev().then(() => {
                  this.refreshLocation()
              })
              this.hideTitleAndMenu()
          }
      },
      nextPage () {
          if (this.rendition) {
              this.rendition.next().then(() => {
                  this.refreshLocation()
              })
              this.hideTitleAndMenu()
          }
      },
      toggleTitleAndMenu () { // 直接点击电子书时触发
          if (this.menuVisible) {
              this.setSettingVisible(-1)
          }
          this.setMenuVisible(!this.menuVisible)
          this.setFontFamilyVisible(false)
      },
      initTheme() { // 注册主题
          let defaultTheme = getTheme(this.fileName)  // 本地存储
          if (!defaultTheme) { // 缓存中没有则缓存一个默认的
              defaultTheme = this.themeList[0].name
              saveTheme(this.fileName, defaultTheme)
          }
          this.setDefaultTheme(defaultTheme)  // 设置到vuex,
          this.themeList.forEach(theme => {
              this.rendition.themes.register(theme.name, theme.style) // 每次初始化都需要给rendition对象注册主题
          })
          this.rendition.themes.select(defaultTheme) // 不要从vuex中取，因为是异步执行的
      },
      initFontSize() {
          let fontSize = getFontSize(this.fileName)
          if (!fontSize) {
              saveFontSize(this.fileName, this.defaultFontSize)
          } else {
              this.rendition.themes.fontSize(fontSize)
              this.setDefaultFontSize(fontSize)  // 需要传给vuex
          }
      },
      initFontFamily() {
          let font = getFontFamily(this.fileName)
          if (!font) {
              saveFontFamily(this.fileName, this.defaultFontFamily)
          } else {
              this.rendition.themes.font(font)
              this.setDefaultFontFamily(font)  // 需要传给vuex
          }
      },
      // 渲染的初始化过程
      initRendition() {
          this.rendition = this.book.renderTo('read', {       // 需要绑定一个DOM
              width: innerWidth,   // window.innerHeight
              height: innerHeight,
              method: 'default'    // 这个是微信的兼容性配置?
          })
          const location = getLocation(this.fileName) // fileName是在本地存储的书名（文件名）
          // 无论location是否在缓存中都可以用这个方法实现，如果不在会自动判断location是否存在来返回正确结果
          // (target, callback)
          this.display(location, () => {
              this.initTheme()
              this.initFontSize()
              this.initFontFamily()
              this.initGlobalStyle()
          })
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
      },
      // 解析电子书并保存必要的变量
      parseBook() {
          // 获取blob链接，该链接可直接获取图片
          this.book.loaded.cover.then(cover => {
              this.book.archive.createUrl(cover).then(url => {
                  this.setCover(url)
              })
          })
          // 获取作者信息
          this.book.loaded.metadata.then(metadata => {
              this.setMetadata(metadata)
          })
          this.book.loaded.navigation.then(nav => {
              const navItem = flatten(nav.toc) // 导航数组扁平化
              function find(item, level = 0) { // 添加level表示目录层级，顶层：0
                  return !item.parent ? level : find(navItem.filter(parentItem =>
                  parentItem.id === item.parent)[0], ++level)
              }
              // 目的是给扁平化后的数组添加一个level表示层级，parent为undefined则为顶级（只有1级目录），
              // 如果有则说明其有子目录，那么递归向下的加level
              navItem.forEach(item => {
                  item.level = find(item)
              })
              this.setNavigation(navItem) // for vuex
          })
      },
      initEpub (url) {
          this.book = new Epub(url)      // 可以传入url，也可以直接传入blob对象
          this.setCurrentBook(this.book) // 电子书对象存入vuex
          this.initRendition()
          this.parseBook()
          // 分页 ready会在book解析完成后调用 不精确的分页算法，精确的分页还要考虑图片和文字大小的不同
          this.book.ready.then(() => {
              return this.book.locations.generate(750 * (window.innerWidth / 375) * (getFontSize(this.fileName) / 16))
          }).then(locations => {
             // 粗略的分页：location对应到各个目录章节
              this.navigation.forEach(nav => {
                nav.pagelist = []
              })
              // console.log(locations)
              locations.forEach(item => {
                // console.log(item)
                const loc = item.match(/\[(.*)\]!/)[1]
                this.navigation.forEach(nav => {
                  if (nav.href) {
                    // xxx.html
                    // console.log(nav)
                    const href = nav.href.match(/^(.*)\.html$/) // 这里返回的是xhtml
                    if (href) {
                      if (href[1] === loc) {
                        nav.pagelist.push(item)
                      }
                    }
                  }
                })
                let currentPage = 1
                this.navigation.forEach((nav, index) => {
                  if (index === 0) {
                    nav.page = 1
                  } else {
                    nav.page = currentPage
                  }
                  currentPage += nav.pagelist.length + 1 // 页？ 
                })
              })
              // console.log(this.navigation)
              this.setPagelist(locations) // 命名注意...
              this.setBookAvailable(true) // 允分页完毕后许进度条拖动
              this.refreshLocation() // 注意这里的刷新
          })
      }
  },
  mounted() {
      // 考虑到fileName经常使用，使用Vuex来存储
      // 有了离线缓存之后这里修改为如果有缓存使用离线缓存
      const books = this.$route.params.fileName.split('|') // '|'隔开路由
      // console.log(books)
      const fileName = books[1]
      getLocalForage(fileName, (err, blob) => {
        if (!err && blob) {
          // console.log('找到离线缓存电子书')
          this.setFileName(books.join('/')).then(() => {
            this.initEpub(blob)
          })
        } else {
          // console.log('在线获取电子书')
          this.setFileName(books.join('/')) // 注意我们这里规定用 | 分开类别和书名
            .then(() => {
            const url = process.env.VUE_APP_EPUB_URL + '/' + this.fileName + '.epub'
            this.initEpub(url)
         })
        }
      })
      
      // console.log(`${baseUrl}${fileName}.epub`)   // 访问8081端口由Nginx跳转到指定的root目录
      // 怎样才算一次"访问请求?"
  }
}

</script>

<style lang='scss' scoped>
@import "../../assets/styles/global.scss";
.ebook-reader {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .ebook-reader-mask {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 150;
    top: 0;
    left: 0;
  }
}
</style>
