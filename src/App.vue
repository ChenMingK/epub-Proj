<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  export default {
    
  }
  document.addEventListener('DOMContentLoaded', () => {  // DOM加载完毕后回调
    const html = document.querySelector('html')          // 取到html根元素
    let fontSize = window.innerWidth / 10                // 800 -> 80 -> 1rem = 80px 总是假定10个rem就是一个屏幕的宽度
    fontSize = fontSize > 50 ? 50 : fontSize             // 设置一个最大上限，一般都是50 
    html.style.fontSize = fontSize + 'px'                // 设置根元素默认字体大小
  })
  
</script>

<style lang="scss" scoped> /* scoped只在当前文件内有效 */
  #app {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 0;
    width: 100%;
    height: 100%;
    background: #7d8188;
    overflow: hidden;
  }
</style>
