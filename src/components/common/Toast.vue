<template>
  <transition name="fade">
    <div class="toast-bg-wrapper" @click.prevent v-show="visible"> <!--不处理任何的点击事件-->
      <div class="toast-bg">
        <div class="toast-wrapper">
          <div class="toast" v-html="showText"></div>
        </div>
      </div>
    </div>
  </transition>
</template>
<!--Toast组件要注意一个问题：在Toast未消失前跳转到其他页面会报错
why?如何防止? 加上一个背景蒙版, @click.prevent能防止页面上的任何点击?-->

<script>
  export default {
    // 要使用create-vue-api需要加上name
    name: 'toast',
    props: {
      text: [String, Number],
      timeout: {
        type: Number,
        default: 1500
      }
    },
    data() {
      return {
        visible: false,
        showText: ''
      }
    },
    methods: {
      hide() {
        this.visible = false
      },
      show() {
        this.updateText(this.text)
        clearTimeout(this.task)
        this.task = null
        this.visible = true
        this.task = setTimeout(() => {
          this.visible = false
        }, this.timeout)
      },
      // 持续显示对话框 用于显示下载进度
      continueShow() {
        this.updateText(this.text) // 持续显示的过程中可能需要更新文本
        clearTimeout(this.task) // what?
        this.task = null
        this.visible = true
      },
      updateText(text) {
        this.showText = text
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";
  .toast-bg-wrapper{
    position: absolute;
    left: 0;
    top: 0;
    z-index: 2500;
    width: 100%;
    height: 100%;
    background: transparent;
    .toast-bg {
      position: absolute;
      top: 50%;
      left: 50%;
      margin: 0 0 0 -50%;
      z-index: 2500;
      width: 100%;
      @include center;
      .toast-wrapper {
        width: 60%;
        line-height: px2rem(20);
        padding: px2rem(10) px2rem(20);
        box-sizing: border-box;
        background: #ccc;
        border-radius: px2rem(10);
        font-size: px2rem(14);
        color: white;
        .toast {
          text-align: center;
          word-break: break-all;
        }
      }
    }
  }
  
</style>
