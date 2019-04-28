<template>
  <div class="store-shelf">
    <shelf-title :title="$t('shelf.title')"></shelf-title>
    <scroll class="store-shelf-scroll-wrapper"
            :top="0" 
            :bottom="scrollBottom"
            @onScroll="onScroll"
            ref="scroll"
            >
      <shelf-search></shelf-search>
      <shelf-list :data="shelfList"></shelf-list>
    </scroll> <!--全屏的Scroll组件-->
    <shelf-footer></shelf-footer>
  </div>
</template>

<script>
  import { storeShelfMixin } from '../../utils/mixin'
  import ShelfTitle from '../../components/shelf/ShelfTitle'
  import ShelfSearch from '../../components/shelf/ShelfSearch'
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
      ShelfSearch,
      ShelfList,
      ShelfFooter
    },
    watch: {
      // 让scroll组件距底部有一个距离
      isEditMode(isEditMode) {
        this.scrollBottom = isEditMode ? 48 : 0
        this.$nextTick(() => {
          this.$refs.scroll.refresh()
        })
      }
    },
    methods: {
      onScroll(offsetY) {
        this.setOffsetY(offsetY)
      }
    },
    mounted: function() {
      this.getShelfList()
      this.setShelfCategory([])
      this.setCurrentType(1) // 当前处于书架列表
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
  }
</style>
