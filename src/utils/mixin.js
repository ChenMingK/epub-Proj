// 该文件存放各组件重复的代码如Vuex状态的混入,变量、方法、属性皆可以复用
// 思考：mixin.js和book.js？
import { mapGetters, mapActions } from 'vuex'
import { themeList, addCss, removeAllCss, getReadTimeByMinute } from './book'
import { saveLocation, getBookmark, getBookShelf, saveBookShelf } from './localStorage'
import { gotoBookDetail, appendAddToShelf, computeId, removeAddFromShelf } from './store'
import { shelf } from '../api/store.js'
export const ebookMixin = { // 所有组件需要用到的计算属性(vuex)和方法
  computed: {
    ...mapGetters([ 
      'fileName',
      'menuVisible',
      'settingVisible',
      'defaultFontSize',
      'defaultFontFamily',
      'fontFamilyVisible',
      'defaultTheme',
      'bookAvailable', // 电子书是否还处于分页阶段
      'progress',
      'section',
      'isPaginating',
      'currentBook',
      'navigation',
      'cover',
      'metadata',
      'paginate',
      'pagelist',
      'offsetY',
      'isBookmark' // 当前页是否为书签页
    ]),
    themeList() {
      return themeList(this)
    }
  },
  methods: {
    // 命名根据state名字 => fileName => setFileName
    ...mapActions([
      'setFileName',
      'setMenuVisible',
      'setSettingVisible',
      'setDefaultFontSize', 
      'setDefaultFontFamily',
      'setFontFamilyVisible',
      'setDefaultTheme',
      'setBookAvailable',
      'setProgress',
      'setSection',
      'setIsPaginating',
      'setCurrentBook',
      'setNavigation',
      'setCover',
      'setMetadata',
      'setPaginate',
      'setPagelist',
      'setOffsetY',
      'setIsBookmark'
    ]),
    initGlobalStyle() {
      removeAllCss()
      switch (this.defaultTheme) {
        case 'Default':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`)
          break
        case 'Eye':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_eye.css`)
          break
        case 'Gold':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_gold.css`)
          break
        case 'Night':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_night.css`)
          break
        default:
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`)
          break
      }
    },
    // 刷新进度条当前位置 因为需要在多个组件使用所以混入
    refreshLocation() {
      const currentLocation = this.currentBook.rendition.currentLocation()
      // console.log(currentLocation)
      // 异步操作都要注意是否已经获取到了读取的对象否则会报错
      if (currentLocation && currentLocation.start) {
        // console.log(currentLocation)
        const startCfi = currentLocation.start.cfi
        const progress = this.currentBook.locations.percentageFromCfi(currentLocation.start.cfi)
        this.setProgress(Math.floor(progress * 100))
        this.setSection(currentLocation.start.index) // 注意刷新
        saveLocation(this.fileName, startCfi)
        // 添加判断当前页是否为书签的方法
        const bookmark = getBookmark(this.fileName)
        // console.log(bookmark)
        if (bookmark) {
          if (bookmark.some(item => item.cfi === startCfi)) { // 满足一个
            this.setIsBookmark(true)
          } else {
            this.setIsBookmark(false)
          }
        } else {
          this.setIsBookmark(false)
        }
        // 可选：用页数表示进度，不精确的，点击下一页可能跳2页
        /* if (this.pagelist) {
          const totalPage = this.pagelist.length // 总页数
          const currentPage = currentLocation.start.location
          if (currentPage && currentPage > 0) {
            this.setPaginate(currentPage + ' / ' + totalPage)
          } else {
            this.setPaginate('')
          }
        } else {
          this.setPaginate('')
        } */
      }
    },
    // cb 可选的回调 思考：这个API target可以传入哪些值? target要跳转到的章节处
    // 该方法用于电子书显示指定的页数(更准确地说是一个cfi指定的位置)
    display(target, cb) {
      if (target) {
        return this.currentBook.rendition.display(target).then(() => {
          this.refreshLocation()
          if (cb) cb()
        })
      } else {
        return this.currentBook.rendition.display().then(() => {
          this.refreshLocation()
          if (cb) cb()
        })
      }
    },
    // 隐藏菜单和标题
    hideTitleAndMenu() {
      this.setMenuVisible(false)
      this.setSettingVisible(-1)
      this.setFontFamilyVisible(false)
    },
    // $1:占位符, 用时间值代替占位符
    getReadTimeText() {
      return this.$t('book.haveRead').replace('$1', getReadTimeByMinute(this.fileName))
    },
    toggleMenuVisible() {
      if (this.menuVisible) {
        this.setSettingVisible(-1)
        this.setFontFamilyVisible(false)
      }
      this.setMenuVisible(!this.menuVisible)
    },
    // 获取章节名称, 用于EbookSettingProgress组件
    getSectionName() {
      return this.section ? this.navigation[this.section].label : ''
    }
  }
}
// 书城部分需要混入的
export const storeHomeMixin = {
  computed: {
    ...mapGetters([
      'offsetY',
      'hotSearchOffsetY',
      'flapCardVisible',
      'ifStoreHomeScrollShow'
    ])
  },
  methods: {
    ...mapActions([
      'setOffsetY',
      'setHotSearchOffsetY',
      'setFlapCardVisible',
      'setIfStoreHomeScrollShow'
    ]),
    // 路由跳转
    showBookDetail(book) {
      // console.log(book)
      gotoBookDetail(this, book) // 由store.js引入,因为有重复代码
    }
  }
}

// 书架部分混入
export const storeShelfMixin = {
  computed: {
    ...mapGetters([
      'isEditMode',
      'shelfList',
      'shelfSelected',
      'shelfTitleVisible',
      'offsetY',
      'shelfCategory',
      'currentType'
    ])
  },
  methods: {
    ...mapActions([
      'setIsEditMode',
      'setShelfList',
      'setShelfSelected',
      'setShelfTitleVisible',
      'setOffsetY',
      'setShelfCategory',
      'setCurrentType'
    ]),
    showBookDetail(book) {
      gotoBookDetail(this, book)
    },
    // axios获取书架数据并保存到vuex
    // shelfList只存储部分图书信息(包括获取目录和书面等，因此用localStorage存储)
    getShelfList() {
      let shelfList = getBookShelf() // 从localStorage中获取数据
      if (!shelfList) {
        // 第一次的话请求本地数据
        shelf().then(response => {
          // console.log(response)
          if (response.status === 200 && response.data && response.data.bookList) {
            shelfList = appendAddToShelf(response.data.bookList) // 手动添加一个type作为Add item
            saveBookShelf(shelfList) // 存储到本地缓存
            return this.setShelfList(shelfList) // vuex,返回一个Promise对象
          }
        })
      } else {
        return this.setShelfList(shelfList)
      }
    },
    getCategoryList(title) {
      this.getShelfList().then(() => {
        const categoryList = this.shelfList.filter(book => book.type === 2 && book.title === title)[0]
        this.setShelfCategory(categoryList)
      })
    },
    moveOutOfGroup(f) {
      // 1.保留没有被选中的图书
      this.setShelfList(this.shelfList.map(book => {
        if (book.type === 2 && book.itemList) { // 因为只能在type为2(category)中才有移出分组操作
          book.itemList = book.itemList.filter(subBook => !subBook.selected) // 保留该分组中的非选中书籍
        }
        return book
      })).then(() => {
        // 2.将选中的电子书添加到书架的最后
        const list = computeId(appendAddToShelf([].concat(
          removeAddFromShelf(this.shelfList), ...this.shelfSelected)))
        this.setShelfList(list).then(() => {
          this.simpleToast(this.$t('shelf.moveBookOutSuccess'))
          if (f) f() // 回调
        })
      })
    }
  }
}
