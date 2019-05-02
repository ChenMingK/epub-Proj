<template>
  <div class="shelf-list" :style="{top: shelfListTop}">
    <transition-group name="list"
                      tag="div"
                      id="shelf-list">  <!--给遍历的每一个item都添加?-->
      <div class="shelf-list-item-wrapper" v-for="item in data" :key="item.id">
        <shelf-item :data="item" :style="{height: itemHeight}"></shelf-item>
        <div class="shelf-list-title-wrapper">
          <span class="shelf-list-title title-small">{{item.title}}</span> <!--title-small在home.scss中定义-->
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script>
  import { storeShelfMixin } from '../../utils/mixin'
  import ShelfItem from './ShelfItem.vue'
  import { realPx, px2rem } from '../../utils/utils' 
  export default {
    mixins: [storeShelfMixin],
    components: {
      ShelfItem
    },
    props: {
      top: {
        type: Number,
        default: 94
      },
      data: Array
    },
    computed: {
      itemHeight() {
        // w / h = 250 / 350
        // h = w * 350 / 250
        // realPx是自适应布局，真实的px
        return (((window.innerWidth - realPx(120)) / 3) / 250 * 350 + 'px') // 每本书的宽高比是250 /350
      },
      shelfListTop() {
        return px2rem(this.top) + 'rem'
      }
    }

  }
</script>

<style lang='scss' scoped>
  @import "../../assets/styles/global.scss";
  .shelf-list {
    position:absolute;
    left: 0;
    z-index: 100;
    width: 100%;
    #shelf-list {
      display: flex;
      flex-flow: row wrap;
      width: 100%;
      padding: 0 px2rem(15);    // 要实现总padding为30，先外层15；再内层15，注意border-box
      box-sizing: border-box;
    }
    .shelf-list-item-wrapper {
      flex: 0 0 33.33%;
      width: 33.33%;
      padding: px2rem(15);
      box-sizing: border-box;
      // transition-group的过渡动画，添加方式与transition一样
      &.list-leave-active {
        display: none; // 注意这里的none
      }
      &.list-move {
        transition: transform .5s; // 改时间可以看得更清楚
      }
    }
    .shelf-list-title {
      margin-top: px2rem(10);
    }
  }
</style>
