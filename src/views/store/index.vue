<template>
  <div class="store">
    <router-view></router-view> <!--匹配到的组件将渲染在这里！！！-->
  </div>
</template>

<script>
  export default {
}
</script>

<style lang='scss' scoped>
  @import "../../assets/styles/global.scss";
  .store {
    width: 100%;
    height: 100%;
    background: white;
  }
</style>
