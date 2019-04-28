<!--该组件与StoreShelf类似，是点击目录(分组)时进入的界面-->
<template>
  <div class="store-shelf">
    <shelf-title :title="shelfCategory.title"></shelf-title>
    <scroll class="store-shelf-scroll-wrapper"
            :top="0" 
            :bottom="scrollBottom"
            @onScroll="onScroll"
            ref="scroll"
            v-if="ifShowList">
      <!--分类列表-->
      <shelf-list :top="42" :data="shelfCategory.itemList"></shelf-list> <!--注意传入的data的类型-->
    </scroll> <!--全屏的Scroll组件-->
    <!--分类列表数据为空时展示的内容-->
    <div class="store-shelf-empty-view" v-else>
      {{$t('shelf.groupNone')}}
    </div>
    <!--底部菜单组件-->
    <shelf-footer></shelf-footer>
  </div>
</template>

<script>
  import { storeShelfMixin } from '../../utils/mixin'
  import ShelfTitle from '../../components/shelf/ShelfTitle'
  import Scroll from '../../components/common/Scroll'
  import ShelfList from '../../components/shelf/ShelfList.vue'
  import ShelfFooter from '../../components/shelf/ShelfFooter.vue'
  export default {
    mixins: [storeShelfMixin],
    data: function() {
      return {
        scrollBottom: 0
      }
    },
    components: {
      ShelfTitle,
      Scroll,
      ShelfList,
      ShelfFooter
    },
    computed: {
      ifShowList() {
        return this.shelfCategory.itemList && this.shelfCategory.itemList.length > 0
      }
    },
    watch: {
      // 监听是否为编辑模式
      isEditMode(isEditMode) {
        // 如果是编辑模式，滚动条需要距底部48像素（需要换算成实际px，组件负责运算）
        this.scrollBottom = isEditMode ? 48 : 0
        this.$nextTick(() => {
          // 刷新滚动条，使得设置生效
          this.$refs.scroll.refresh()
        })
      }
    },
    methods: {
       // 列表滚动监听事件
      onScroll(offsetY) {
        // 当列表发生滚动时，设置vuex中的offsetY
        // offsetY的变更会触发ShelfTitle组件的watch生效
        this.setOffsetY(offsetY)
      }
    },
    mounted: function() {
      // 获取分类列表数据
      this.getCategoryList(this.$route.query.title)
      // 标记currentType为2，对于不同的currentType，ShelfTitle将呈现不同状态
      this.setCurrentType(2)
    }
}
</script>

<style lang='scss' scoped>
  @import "../../assets/styles/global.scss";
  .store-shelf {
    position: relative;
    z-index: 100;
    width: 100%;
    height: 100%;
    background: white;
    .store-shelf-scroll-wrapper {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 101;
    }
    .store-shelf-empty-view {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      font-size: px2rem(14);
      color: #333;
      @include center;
    }
  }
</style>
