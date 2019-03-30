<template>
  <div class="ebook-reader">
      <div id="read"></div>
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
global.ePub = Epub
export default {
    mixins: [ebookMixin],   // 混合公共代码
    methods: {
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
            if(!defaultTheme) { // 缓存中没有则缓存一个默认的
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
            const location = getLocation(this.fileName)
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
                    contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/tangerine.css`),  // 环境变量存储在.env.development中
                ]).then(() => {
                    // 可以在字体加载完毕后做其他操作 
                })     
            })
        },
        // 初始化手势
        initGesture() {
            this.rendition.on('touchstart', event => {
                this.touchStartX = event.changedTouches[0].clientX   // 当前点击屏幕的X轴位置
                this.touchStartTime = event.timeStamp               // 触摸时间
            })
            this.rendition.on('touchend', event => {
                const offsetX = event.changedTouches[0].clientX - this.touchStartX
                const time = event.timeStamp - this.touchStartTime
                if (time < 500 && offsetX > 40) {   // 从左往右滑过距离大于40且时间小于500ms则进入上一页
                    this.prevPage()
                }else if(time < 500 && offsetX < -40) {
                    this.nextPage()
                }else {
                    this.toggleTitleAndMenu() // 显示标题和菜单栏（也许设置为长按更好？）
                }
                // 禁止事件传播
                event.preventDefault()
                event.stopPropagation()
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
        },
        initEpub () {
            const url = `${process.env.VUE_APP_RES_URL}` + '/epub/' + this.fileName + '.epub'  // 注意通过vuex的mapGetters才能通过this.fileName调用
            this.book = new Epub(url)                           // 通过url就可以获取book对象!
            this.setCurrentBook(this.book)
            this.initRendition()
            this.initGesture()
            this.parseBook()
            // 分页 ready会在book解析完成后调用 不精确的分页算法，精确的分页还要考虑图片和文字大小的不同
            this.book.ready.then(() => {
                return this.book.locations.generate(750 * (window.innerWidth / 375) * (getFontSize(this.fileName) / 16))
            }).then(locations => {
                // console.log(locations)
                this.setBookAvailable(true) // 允分页完毕后许进度条拖动
                this.refreshLocation()      // 注意这里的刷新
            })
        }
    },
    mounted() {
        // 考虑到fileName经常使用，使用Vuex来存储 
        this.setFileName(this.$route.params.fileName.split('|').join('/')) // 注意我们这里规定用 | 分开类别和书名
            .then(() => {
            this.initEpub()
        })
        // console.log(`${baseUrl}${fileName}.epub`)   // 访问8081端口由Nginx跳转到指定的root目录
        // 怎样才算一次"访问请求?"
    }
}

</script>

<style lang='scss' scoped>
</style>