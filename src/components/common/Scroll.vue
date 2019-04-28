<!--通用的滚动条组件-->
<template>
  <div class="scroll-wrapper" 
       :class="{'no-scroll': ifNoScroll}"
       @scroll.passive="handleScroll"
       ref="scrollWrapper"> <!--@scroll监听鼠标滚轮事件 .passive 滚动事件的默认行为会立即触发, 而不会等待'onScroll'完成-->
      <slot></slot><!--利用插槽往滚动条中填充内容-->
  </div>
</template>

<script>
  import { realPx } from '@/utils/utils'
  export default {
    props: {
      // 需要由父组件传入距离上方和下方的距离以确定滚动组件高度
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
      }
    },
    methods: {
      // 鼠标滚动时监听高度偏移量, scrollTop ? pageYOffset?
      handleScroll(e) {
        const offsetY = e.target.scrollTop || window.pageYOffset || document.body.scrollTop
        this.$emit('onScroll', offsetY)
      },
      //初始化组件高度, 利用传入的top 和 bottom, 且未div添加scroll事件监听器
      refresh() {
        if (this.$refs.scrollWrapper) {
          this.$refs.scrollWrapper.style.height = window.innerHeight - 
            realPx(this.top) - realPx(this.bottom) + 'px'
          this.$refs.scrollWrapper.addEventListener('scroll', this.handleScroll)
        }
      },
    },
    mounted() {
      this.refresh()
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
    -webkit-overflow-scrolling: touch; // 解决移动端卡顿, why?
    &::-webkit-scrollbar {
      display: none;
    }
    &.no-scroll {
      overflow: hidden;
    }
  }
</style>
