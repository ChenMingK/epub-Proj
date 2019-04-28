<!--通用的滚动条组件-->
<template>
  <div class="scroll-wrapper" 
       :class="{'no-scroll': ifNoScroll}"
       @scroll.passive="handleScroll"
       ref="scrollWrapper"> <!--滚动行为会立即触发-->
      <slot></slot>
  </div>
</template>

<script>
  import { realPx } from '@/utils/utils'
  export default {
    props: {
      top: {
        type: Number,
        default: 0
      },
      bottom: {
        type: Number,
        default: 0
      },
      ifNoScroll: {
        type: Boolean,
        default: false
      },
      initPosition: {
        type: Object,
        default: () => {
          return {
            x: 0,
            y: 0
          }
        }
      }
    },
    methods: {
      // 捕捉屏幕产生滑动时Y轴的偏移量
      handleScroll(e) {
        // console.log('wtfk?')
        const offsetY = e.target.scrollTop || window.pageYOffset || document.body.scrollTop
        this.$emit('onScroll', offsetY)
      },
      scrollTo(x, y) {
        this.$refs.scrollWrapper.scrollTo(x, y) // scroll的DOM？
      },
      refresh() {
        if (this.$refs.scrollWrapper) { // this.$refs DOM?
          this.$refs.scrollWrapper.style.height = window.innerHeight - 
            realPx(this.top) - realPx(this.bottom) + 'px'
          this.$refs.scrollWrapper.addEventListener('scroll', this.handleScroll)
        }
      },
      mounted() {
        this.refresh()
        this.$nextTick(() => {
          setTimeout(() => {
            this.scrollTo(realPx(this.initPosition.x), realPx(this.initPosition.y))
          }, 1)
        })
      }
    }
  }
</script>

<style lang='scss' scoped>
  @import "../../assets/styles/global.scss";
  .scroll-wrapper {
    position: relative;
    z-index: 100;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    &::-webkit-scrollbar {
      display: none;
    }
    &.no-scroll {
      overflow: hidden;
    }
  }
</style>
