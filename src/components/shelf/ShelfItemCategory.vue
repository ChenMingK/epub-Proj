<template>
  <div class="shelf-item-category">
    <div class="shelf-item-category-list" v-if="data.itemList.length > 0">
      <div class="shelf-item-category-item" v-for="(item, index) in data.itemList" :key="index">
        <img class="shelf-item-category-img" :src="item.cover">
      </div>
    </div>
    <div class="shelf-item-category-bg" v-else> <!--空分组样式-->
      <span class="icon-book2"></span>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      data: Object
    }
}
</script>

<style lang='scss' scoped>
  @import "../../assets/styles/global.scss";
  .shelf-item-category {
    width: 100%;
    height: 100%;
    overflow: hidden; // 隐藏超出的部分
    .shelf-item-category-list {
      display: flex;
      flex-flow: row wrap; // 水平 换行
      align-content: flex-start; // 剩余空间如果存在空余空间时的排序方式
      width: 100%;
      height: 100%;
      // 这里让最上方也有一个padding
      padding-top: px2rem(5);
      box-sizing: border-box;
      // 九宫格布局
      .shelf-item-category-item {
        flex: 0 0 33.33%;
        width: 33.33%;
        height: 33.33%;
        box-sizing: border-box;
        // n=0 -> 1 n=1 -> 4
        &:nth-child(3n+1) {
          padding: 0 px2rem(2.5) px2rem(5) px2rem(5); // top right bottom left
        }
        // 中间的
        &:nth-child(3n+2) {
          padding: 0 px2rem(2.5) px2rem(5) px2rem(2.5); // top right bottom left
        }
        // 最右边的
        &:nth-child(3n+3) {
          padding: 0 px2rem(5) px2rem(5) px2rem(2.5);
        }
        .shelf-item-category-img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .shelf-item-category-bg {
      width: 100%;
      height: 100%;
      font-size: px2rem(30);
      color: #ccc;
      background: white;
      @include center;
    }
  }
</style>
