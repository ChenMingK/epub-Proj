<template>
  <div class="ebook" ref="ebook"> <!--ref for DOM operate-->
      <ebook-header></ebook-header>
      <ebook-title></ebook-title>
      <ebook-reader></ebook-reader>
      <ebook-menu></ebook-menu>
      <ebook-bookmark></ebook-bookmark>
      <ebook-footer></ebook-footer>
  </div>
</template>

<script>
import EbookReader from '../../components/ebook/EbookReader.vue'  
import EbookTitle from '../../components/ebook/EbookTitle.vue'
import EbookMenu from '../../components/ebook/EbookMenu'
import EbookBookmark from '../../components/ebook/EbookBookmark'
import EbookHeader from '../../components/ebook/EbookHeader'
import EbookFooter from '../../components/ebook/EbookFooter'
import { ebookMixin } from '../../utils/mixin' 
import { getReadTime, saveReadTime } from '../../utils/localStorage'
import { setInterval, clearInterval } from 'timers'

export default {
    mixins: [ebookMixin],
    components: {
        EbookReader,
        EbookTitle,
        EbookMenu,
        EbookBookmark,
        EbookHeader,
        EbookFooter
    },
    // 
    watch: {
      offsetY(v) { // 如果在methods中，vuex中的offsetY需要由this.offsetY访问到；这里是因为computed混入了offsetY？
        // 标题和菜单出现时不允许添加书签，因为会造成覆盖
        if (!this.menuVisible && this.bookAvailable) {
          if (v > 0) {
            this.move(v)
          } else if (v === 0) {
            this.restore() // restore screen
          }
        }
      }
    },
    methods: {
        restore(v) {
          this.$refs.ebook.style.top = 0
          this.$refs.ebook.style.transition = `all .2s linear `
          // 需要清除这个动画，否则下次下拉也会触发造成不流畅
          setTimeout(() => {
            this.$refs.ebook.style.transition = ''
          }, 200)
        },
        move(v) {
          this.$refs.ebook.style.top = v + 'px'
        },
        // 记录阅读时间 注意位置 思考：这里用到了vuex中的属性，如果vuex还没加载完成呢？
        startLoopReadTime() {
            // console.log(this.fileName)
            let readTime = getReadTime(this.fileName)
            if (!readTime) {
                readTime = 0
            }
            this.task = setInterval(() => {
                readTime++
                if (readTime % 30 === 0) { // 每半分钟记录一次
                    saveReadTime(this.fileName, readTime) // 缓存阅读时间
                }
            }, 1000)
        }
    },
    mounted() {
        this.startLoopReadTime()
    },
    // 销毁前终止计时功能
    beforeDestroy() {
        if (this.task) {
            clearInterval(this.task)
        }
    }
}

</script>
<style lang='scss' scoped>
  @import "../../assets/styles/global.scss";
  .ebook {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>
