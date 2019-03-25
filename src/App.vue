<template>
  <div id="app">
    <span class="text">ABCDEFG</span>
    <span class="icon-add"></span>
    <router-view/>
  </div>
</template>

<script>
/* eslint-disable */
  import { mapGetters } from 'vuex'
  export default {
    computed: {
      ...mapGetters(['test'])     // vuex语法 mapGetters是一个方法,参数当作keys数组？
    },
    mounted () {
      this.$store.dispatch('setTest', 9).then(() => {
        console.log(this.test)  // this.$store.state.book.test
      })
    }
  }
  document.addEventListener('DOMContentLoaded', () => {  // DOM加载完毕后回调
    const html = document.querySelector('html')          // 取到html根元素
    let fontSize = window.innerWidth / 10                // 800 -> 80 -> 1rem = 80px 
    fontSize = fontSize > 50 ? 50 : fontSize             // 设置一个最大上限  
    html.style.fontSize = fontSize + 'px'                // 设置根元素默认字体大小
  })

</script>

<style lang="scss" scoped> /* scoped只在当前文件内有效 */
  @import "./assets/styles/global";
  .text {
    font-family: 'Days One';
    color: orange;
    font-size: px2rem(20);
  }

</style>
