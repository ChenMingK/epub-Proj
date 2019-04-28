<template>
  <div>
    <div class="search-bar" :class="{'hide-title': !titleVisible, 'hide-shadow': !shadowVisible}">
      <transition name="title-move"> <!--触发过度的条件？整体高度改变了-->
        <div class="search-bar-title-wrapper" v-show="titleVisible"> 
          <div class="title-text-wrapper">
            <span class="title-text title">{{$t('home.title')}}</span>
          </div>
          <div class="title-icon-shake-wrapper" @click="showFlapCard">
            <span class="icon-shake icon"></span>
          </div>
        </div> <!--搜索框上方的三个元素，但是返回按钮需要拿出来，它不能消失-->
      </transition>
      <div class="title-icon-back-wrapper" :class="{'hide-title': !titleVisible}"
           @click="back">
            <span class="icon-back icon"></span>
      </div>
      <div class="search-bar-input-wrapper" :class="{'hide-title': !titleVisible}">
        <div class="search-bar-blank" :class="{'hide-title': !titleVisible}"></div> <!--占位，实现变窄-->
        <div class="search-bar-input">
          <span class="icon-search icon"></span>
          <input type="text"
                class="input"
                :placeholder="$t('home.hint')"
                v-model="searchText"
                @click="showHotSearch"
                @keyup.13.exact="search"> <!--只能按下回车键触发-->
        </div>
      </div>
    </div>
      <hot-search-list v-show="hotSearchVisible" ref="hotSearch"></hot-search-list>
  </div><!--注意要有个div根 vue规定-->
</template>

<script>
  import { storeHomeMixin } from '../../utils/mixin'
  import HotSearchList from '../home/HotSearchList.vue'
  export default {
    mixins: [storeHomeMixin],
    components: {
      HotSearchList
    },
    data: function() {
      return {
        searchText: '',
        titleVisible: true,
        shadowVisible: false,
        hotSearchVisible: false
      }
    },
    watch: {
      offsetY(offsetY) {
        // console.log('SearchBar: wtf?')
        if (offsetY > 0) {
          this.hideTitle()
          this.showShadow()
        } else {
          this.showTitle()
          this.hideShadow()
        }
      },
      // 热搜组件监听Y轴偏移，如果向下滚动了则显示阴影
      hotSearchOffsetY(offsetY) {
        // console.log('what?')
        if (offsetY > 0) {
          this.showShadow()
        } else {
          this.hideShadow()
        }
      }
    },
    methods: {
      // 回车搜索
      search() {
        this.$router.push({
          path: '/store/list',
          query: {
            keyword: this.searchText
          }
        })
      },
      showFlapCard() {
        this.setFlapCardVisible(true)
      },
      back() {
        if (this.offsetY > 0) {
          this.showShadow()
        } else {
          this.hideShadow()
        }
        if (this.hotSearchVisible) {
          this.hideHotSearch()
        } else {
          this.$router.push('/store/shelf')
        }
        
        // this.showTitle()
      },
      hideTitle() {
        this.titleVisible = false
      },
      showTitle() {
        this.titleVisible = true
      },
      hideShadow() {
        this.shadowVisible = false
      },
      showShadow() {
        this.shadowVisible = true
      },
      hideHotSearch() {
        this.hotSearchVisible = false
        // 返回时如果已经下拉了，则隐藏标题
        // 隐藏标题显示阴影，显示标题则隐藏阴影
        if (this.offsetY > 0) {
          this.hideTitle()
          this.showShadow()
        } else {
          this.showTitle()
          this.hideShadow()
        }
      },
      // 热搜组件
      showHotSearch() {
        this.hideTitle()
        this.hideShadow()
        this.hotSearchVisible = true
        this.$nextTick(() => { // 在下次 DOM 更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的 DOM。
          this.$refs.hotSearch.reset()
        })  
      }
    }
}
</script>

<style lang='scss' scoped>
  @import "../../assets/styles/global.scss";
  .search-bar {
    position: relative;
    z-index: 150;
    width: 100%;
    height: px2rem(94);
    box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0, 0, 0, .1); // 水平位移 垂直位移 模糊半径 颜色
    &.hide-title {
      height: px2rem(52);
    }
    &.hide-shadow {
      box-shadow: none;
    }
    .search-bar-title-wrapper {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: px2rem(42);
      .title-text-wrapper {
        width: 100%;
        height: px2rem(42);
        @include center;
      }
      .title-icon-shake-wrapper {
        position: absolute;
        right: px2rem(15);
        top: 0;
        height: px2rem(42);
        @include center;
      }
    }
    .title-icon-back-wrapper {
        position: absolute;
        z-index: 200;
        left: px2rem(15);
        top: 0;
        height: px2rem(42);
        transition: height $animationTime $animationType;
        @include center;
        &.hide-title {
          height: px2rem(52); // 改变的是高度，但是看到的是位移
        }
      }
    .search-bar-input-wrapper {
      position: absolute; // 注意这里的绝对定位
      left: 0;
      top: px2rem(42);
      display: flex;
      width: 100%;
      height: px2rem(52);
      padding: px2rem(10) px2rem(10);
      box-sizing: border-box;
      transition: top $animationTime $animationType;
      &.hide-title {
        top: 0;
      }
      .search-bar-blank {
        flex: 0 0 0;
        width: 0;
        transition: all $animationTime $animationType;
        &.hide-title {
          flex: 0 0 px2rem(31);
          width: px2rem(31);
        }
      }
      .search-bar-input {
        flex: 1;
        width: 100%;
        background: #f4f4f4;
        border-radius: px2rem(20);
        padding: px2rem(5) px2rem(15);
        box-sizing: border-box;
        border: px2rem(1) solid #eee;
        @include left;
        .icon-search {
          color: #999;
        }
        .input {
          width: 100%;
          height: px2rem(22);
          border: none;            // 去掉搜索框边框
          background: transparent; // 去掉搜索框背景色
          margin-left: px2rem(12);
          color: #666666;
          &:focus {
            outline: none; // 去除点击时的边框
          }
          &::-webkit-input-placeholder { // placeholder color
            color: #ccc;
          }
        }
      }
    }
  }
</style>
