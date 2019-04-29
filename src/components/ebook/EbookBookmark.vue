<template>
  <div class="ebook-bookmark" ref="bookmark">
    <div class="ebook-bookmark-text-wrapper">
      <div class="ebook-bookmark-down-wrapper" ref="iconDown">
        <span class="icon-down"></span>
      </div>
      <div class="ebook-bookmark-text">{{text}}</div>
    </div>
    <div class="ebook-bookmark-icon-wrapper" :style="isFixed ? fixedStyle : {}">
      <bookmark :color="color" :width="15" :height="35"></bookmark>
    </div>
  </div>
</template>

<script>
  import { realPx } from '../../utils/utils'
  import { ebookMixin } from '../../utils/mixin'
  import Bookmark from '../common/Bookmark'
  import { getBookmark, saveBookmark } from '../../utils/localStorage'
  const BLUE = '#346cbc'
  const WHITE = '#fff'
  export default {
    mixins: [ebookMixin],
    components: {
      Bookmark
    },
    data() {
      return {
        text: '',
        color: WHITE,
        isFixed: false
      }
    },
    computed: {
      height() {
        return realPx(35)
      },
      // 临界值
      threshold() {
        return realPx(55)
      },
      // 书签定位
      fixedStyle() {
        return {
          position: 'fixed',
          top: 0,
          right: `${(window.innerWidth - this.$refs.bookmark.clientWidth) / 2}px`
        }
      }
    },
    watch: {
      // values: function (newValue, oldValue)
      offsetY(v) { 
        // 不在多余的状态监听, 电子书还在分页不允许下拉, 有设置面板也不允许
        if (!this.bookAvailable || this.menuVisible || this.settingVisible >= 0) { return }
        if (v >= this.height && v <= this.threshold) {
          this.beforeThreshold(v)
        } else if (v >= this.threshold) {
            this.afterThreshold(v)
        } else if (v > 0 && v < this.height) {
          // 状态1
          this.beforeHeight()
        } else if (v === 0) {
          // 归位操作
          this.restore()
        }
      },
      // 对书签状态作出反应
      isBookmark(isBookmark) {
        if (isBookmark) {
          this.color = BLUE
          this.isFixed = true
        } else {
          this.color = WHITE
          this.isFixed = false
        }
      }
    },
    methods: {
      // 状态1：未超过书签的高度
      beforeHeight() {
        // 判断当前页是否为书签页 并做对应的显示
        if (this.isBookmark) {
            this.text = this.$t('book.pulldownDeleteMark')
            this.color = BLUE
            this.isFixed = true // 维护这个变量
          } else {
            this.text = this.$t('book.pulldownAddMark')
            this.color = WHITE
            this.isFixed = false
          }
        this.isFixed = false
      },
      // 状态2
      beforeThreshold(v) {
          // console.log('到达第二阶段') 吸顶效果 状态二：未到达临界状态
          this.$refs.bookmark.style.top = `${-v}px` // 做相对位移达到吸顶效果
          this.beforeHeight() // 重复部分
          const iconDown = this.$refs.iconDown
          if (iconDown.style.transform === 'rotate(180deg)') {
            iconDown.style.transform = 'rotate(0deg)'
          }
      },
      // 状态3
      afterThreshold(v) {
          // console.log('到达第三阶段') 状态三：超越临界状态
          this.$refs.bookmark.style.top = `${-v}px`
          // 判断当前页是否为书签页 并做对应的显示
          if (this.isBookmark) {
            this.text = this.$t('book.releaseDeleteMark')
            this.color = WHITE
            this.isFixed = false
          } else {
            this.text = this.$t('book.releaseAddMark')
            this.color = BLUE
            this.isFixed = true
          }
          const iconDown = this.$refs.iconDown
          if (iconDown.style.transform === '' || iconDown.style.transform === 'rotate(0deg)') {
            iconDown.style.transform = 'rotate(180deg)'
          }
      },
      restore() {
        // 状态四： 归位保存书签标记, 等200ms过渡动画完成后执行
        setTimeout(() => {
          this.$refs.bookmark.style.top = `${-this.height}px`
          this.$refs.iconDown.style.transform = 'rotate(0deg)'
        }, 200)
        if (this.isFixed) {
          this.setIsBookmark(true)
          this.addBookmark()
        } else {
          this.setIsBookmark(false)
          this.removeBookmark()
        }
      },
      addBookmark() {
        this.bookmark = getBookmark(this.fileName)
        // 初次进入设置
        if (!this.bookmark) {
          this.bookmark = []
        }
        const currentLocation = this.currentBook.rendition.currentLocation()
        // 取出cfi ！之前的内容
        const cfibase = currentLocation.start.cfi.replace(/!.*/, '')
        const cfistart = currentLocation.start.cfi.replace(/.*!/, '').replace(/\)$/, '')
        const cfiend = currentLocation.end.cfi.replace(/.*!/, '').replace(/\)$/, '')
        // 将cfistart和cfiend拼接
        const cfirange = `${cfibase}!,${cfistart},${cfiend})`// 注意结尾的括号 之间用逗号隔开
        // console.log(cfirange)
        // epubjs提供getRange方法获取Range对象, 其中有文本内容
        this.currentBook.getRange(cfirange).then(range => {
          const text = range.toString().replace(/\s\s/g, '') // 去除多余的空格
          this.bookmark.push({
            cfi: currentLocation.start.cfi, // 用于书签跳转,判断当前页是否为书签
            text: text // 文本
          })
          saveBookmark(this.fileName, this.bookmark)
        })
      },
      // 删除书签
      removeBookmark() {
        const currentLocation = this.currentBook.rendition.currentLocation()
        const cfi = currentLocation.start.cfi
        this.bookmark = getBookmark(this.fileName)
        if (this.bookmark) {
          saveBookmark(this.fileName, this.bookmark.filter(item => item.cfi !== cfi)) // 过滤掉
          this.setIsBookmark(false) // 当前页不是书签
        }
      }
    }
}
</script>

<style lang='scss' scoped>
  @import "../../assets/styles/global.scss";
  .ebook-bookmark {
    position: absolute;
    top: px2rem(-35);
    left: 0;
    z-index: 200;
    width: 100%;
    height: px2rem(35);
    .ebook-bookmark-text-wrapper {
      position: absolute;
      right: px2rem(45);
      bottom: 0;
      display: flex;
      .ebook-bookmark-down-wrapper {
        font-size: px2rem(14);
        transition: all .2s linear;
        color: white;
        @include center;
      }
      .ebook-bookmark-text {
        font-size: px2rem(14);
        color: white;
      }
    }
    .ebook-bookmark-icon-wrapper {
      position: absolute;
      right: 0;
      bottom: 0;
      margin-right: px2rem(15);
    }
  }
</style>
