<!--底层弹窗组件-->
<template>
  <div class="popup" v-if="popupVisible">
    <transition name="fade">
      <div class="popup-bg" @click.stop.prevent="hide()" v-if="popupVisible"></div>
      <!--灰色的背景图层, 点击后弹窗隐藏. 禁止事件冒泡和预设行为-->
    </transition>
    <transition name="popup-slide-up">
      <div class="popup-wrapper" v-show="visible"> <!--两个visible来控制隐藏, 完善过渡动画-->
        <div class="popup-title" v-if="title && title.length > 0">{{title}}</div>
        <div class="popup-btn"
            :class="{'danger': item.type === 'danger'}"
            v-for="(item, index) in btn"
            :key="index"
            @click="item.click">
            {{item.text}}
        </div><!--danger属性作为警告按钮-->
      </div>
    </transition>
  </div>
</template>

<script>
  export default {
    name: 'popup',
    props: {
      title: String, // 上方提示内容
      btn: Array // 客动态配置的按钮数
    },
    data() {
      return {
        popupVisible: false,
        visible: false    
      }
    },
    methods: {
      show() {
        // 这里反过来, 先显示整个Popup, 再显示下方按钮
        this.popupVisible = true
        // setTimeout保证执行顺序, 先让整个Popup显示出来, 再显示按钮部分
        setTimeout(() => {
          this.visible = true
        })     
      },
      hide() {
        // 先将下方按钮部分隐藏，再隐藏整体的, 即先保留灰色背景层, 让按钮部分显示过渡动画
        this.visible = false
        setTimeout(() => {
          this.popupVisible = false
        }, 200) 
      }
    }
}
</script>

<style lang='scss' scoped>
  @import '../../assets/styles/global.scss';
  .popup {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2000; // 浮于界面上方
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .4);
    .popup-bg {
      width: 100%;
      height: 100%;
    }
    .popup-wrapper {
      position: fixed;
      left: 0;
      bottom: 0;
      z-index: 2000;
      width: 100%;
      background: white;
      .popup-title {
        width: 100%;
        height: px2rem(44);
        border-bottom: px2rem(1) solid #eee;
        font-size: px2rem(12);
        line-height: px2rem(14);
        padding: px2rem(15);
        box-sizing: border-box;
        color: #999;
        @include center;
      }
      .popup-btn {
        width: 100%;
        height: px2rem(60);
        border-bottom: px2rem(1) solid #eee;
        font-size: px2rem(16);
        color: #666;
        font-weight: bold;
        @include center;
        &.danger {
          color: $color-pink;
        }
      }
    }
  }
</style>
