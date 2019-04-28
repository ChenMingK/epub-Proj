<template>
  <div class="shelf-search-wrapper" :class="{'search-top': ifInputClicked, 'hide-shadow': ifHideShadow}">
    <div class="shelf-search" :class="{'search-top': ifInputClicked}"> <!--搜索框被点击时生效-->
      <div class="search-wrapper">
        <div class="icon-search-wrapper">
          <span class="icon-search icon"></span>
        </div>
        <div class="search-input-wrapper">
          <input class="search-input"
                 type="text"
                 :placeholder="$t('shelf.search')"
                 @click="onSearchClick"
                 v-model="searchText">
        </div>
        <div class="icon-clear-wrapper"
             v-show="searchText.length > 0"
             @click="clearSearchText">
          <span class="icon-close-circle-fill icon"></span>
        </div>
      </div>
      <div class="icon-locale-wrapper"
           v-if="!ifInputClicked"
           @click="switchLocale"> <!--点击搜索框时隐藏中英文切换按钮-->
        <span class="icon-cn icon" v-if="lang === 'cn'"></span> <!--计算属性-->
        <span class="icon-en icon" v-else></span>
      </div>
      <div class="cancel-btn-wrapper" @click="onCancelClick" v-else> <!--互斥-->
        <span class="cancel-text">{{$t('shelf.cancel')}}</span>
      </div>
    </div>
    <transition name="hot-search-move"> <!--过渡动画无法正常显示why？这里必须在class多加一个transition才行-->
      <div class="shelf-search-tab-wrapper" v-if="ifInputClicked">
        <div class="shelf-search-tab-item" 
            v-for="item in tabs" :key="item.id"
            @click="onTabClick(item.id)">
          <span class="shelf-search-tab-text" :class="{'is-selected': item.id === selectedTab}">{{item.text}}</span>     
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
 import { setLocalStorage } from '../../utils/localStorage'
 import { storeShelfMixin } from '../../utils/mixin'
  export default {
    mixins: [storeShelfMixin],
    data: function() {
      return {
        ifInputClicked: false, // 中英文互斥关系 
        searchText: '',
        selectedTab: 1,
        ifHideShadow: true
      }
    },
    computed: {
      lang() {
        return this.$i18n.locale // 通过i18n获取当前语言
      },
      tabs() {
        return [
          {
            id: 1,
            text: this.$t('shelf.default')
          },
          {
            id: 2,
            text: this.$t('shelf.progress')
          },
          {
            id: 3,
            text: this.$t('shelf.purchase')
          }
        ]
      }
    },
    watch: {
      offsetY(offsetY) {
        if (offsetY > 0 && this.ifInputClicked === true) {
          this.ifHideShadow = false // 滑动时显示阴影
        } else {
          this.ifHideShadow = true
        }
      }
    },
    methods: {
      onTabClick(id) {
        this.selectedTab = id
      },
      onSearchClick() {
        this.ifInputClicked = true
        this.setShelfTitleVisible(false)// 隐藏标题
      },
      onCancelClick() {
        this.ifInputClicked = false
        this.setShelfTitleVisible(true)
      },
      switchLocale() {
        if (this.lang === 'en') {
          this.$i18n.locale = 'cn'
        } else {
          this.$i18n.locale = 'en'
        }
        setLocalStorage('locale', this.$i18n.locale) // 存储到缓存
      },
      clearSearchText() {
        this.searchText = ''
      }
    }
}
</script>

<style lang='scss' scoped>
  @import "../../assets/styles/global.scss";
  .shelf-search-wrapper {
    position: relative;
    z-index: 105;
    width: 100%;
    height: px2rem(94);
    font-size: px2rem(16);
    background: white;
    box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0, 0, 0, .1); // 水平位置 垂直位置 模糊半径 阴影尺寸 颜色 内外
    // 固定标题
    &.search-top {
        position: fixed;
        left: 0;
        top: 0;
      }
    &.hide-shadow {
      box-shadow: none;
    }
    .shelf-search {
      position: absolute;
      top: px2rem(42);
      left: 0;
      z-index: 105;
      width: 100%;
      height: px2rem(52);
      display: flex;
      transition: top $animationTime linear;
      &.search-top {
        top: 0;
      }
      .search-wrapper {
        flex: 1;
        display: flex;
        margin: px2rem(8) 0 px2rem(8) px2rem(10);
        border: px2rem(1) solid #ccc;
        border-radius: px2rem(3);
        .icon-search-wrapper {
          flex: 0 0 px2rem(22);
          @include right;
          .icon-search {
            font-size: px2rem(12);
          }
        }
        .search-input-wrapper {
          flex: 1; // 自动拉伸
          padding: 0 px2rem(10);
          box-sizing: border-box;
          @include center;
          .search-input {
            width: 100%;
            font-size: px2rem(14);
            border: none;
            color: #333;
            &:focus {
              outline: none; // 消除选中时外边框
            }
            &::-webkit-input-placeholder { // 修改placeholder样式
              font-size: px2rem(14);
              color: #ccc;
            }
          }
        }
        .icon-clear-wrapper {
          flex: 0 0 px2rem(24);
          @include left;
          .icon-close-circle-fill {
            font-size: px2rem(14);
            color: #ccc;
          }
        }
      }
      .icon-locale-wrapper {
        flex: 0 0 px2rem(55);
        @include center;
        .icon-cn, .icon-en {
          font-size: px2rem(22);
          color: #666;
        }
      }
      .cancel-btn-wrapper {
        flex: 0 0 px2rem(55);
        @include center;
        .cancel-text {
          font-size: px2rem(14);
          color: $color-blue;
        }
      }
    }
    .shelf-search-tab-wrapper {
      position: absolute;
      top: px2rem(52);
      left: 0;
      z-index: 105;
      display: flex;
      width: 100%;
      height: px2rem(42);
      // transition: all .2s linear; // vue的过渡问题? 直接设置transition会有字体抖动的情况
      .shelf-search-tab-item {
        flex: 1;
        @include center;
        .shelf-search-tab-text {
          font-size: px2rem(12);
          color: #999;
          &.is-selected {
            color: $color-blue;
          }
        }
      }
    }
  }
</style>
