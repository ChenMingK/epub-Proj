<template>
  <div class="ebook-slide-contents">
      <div class="slide-contents-search-wrapper">
          <div class="slide-contents-search-input-wrapper">
              <div class="slide-contents-search-icon">
                  <span class="icon-search"></span>
              </div>
              <input type="text" 
                     class="slide-contents-search-input" 
                     :placeholder="$t('book.searchHint')"
                     @click="showSearchPage()">
          </div> <!--input end-->
          <div class="slide-contents-search-cancel"
               v-if="searchVisible"
               @click="hideSearchPage()"> {{$t('book.cancel')}}</div>
      </div><!--搜索框 end-->
      <div class="slide-contents-book-wrapper">
          <div class="slide-contents-book-img-wrapper">
              <img :src="cover" class="slide-contents-book-img">
          </div>
          <div class="slide-contents-book-info-wrapper">
              <div class="slide-contents-book-title">{{metadata.title}}</div>
              <div class="slide-contents-book-author">{{metadata.creator}}</div>
          </div>
          <div class="slide-contents-book-progress-wrapper">
              <div class="slide-contents-book-progress">
                  <span class="progress">{{progress + '%'}}</span>
                  <span class="progress-text">{{$t('book.haveRead2')}}</span>
              </div>
              <div class="slide-contents-book-time">{{getReadTimeText()}}</div>
          </div>
      </div>
  </div>
</template>

<script>
import { ebookMixin } from '../../utils/mixin'
export default {
    mixins: [ebookMixin],
    data: function () {
        return {
            searchVisible: false
        }
    },
    methods: {
        showSearchPage() {
            this.searchVisible = true;
        },
        hideSearchPage() {
            this.searchVisible = false;
        }
    }
}
</script>

<style lang='scss' scoped>
@import "../../assets/styles/global.scss";
.ebook-slide-contents {
    width: 100%;
    .slide-contents-search-wrapper {
        display: flex;
        width: 100%;
        height: px2rem(36);
        margin: px2rem(20) 0 px2rem(10) 0;
        padding: 0 px2rem(15);
        box-sizing: border-box;
        .slide-contents-search-input-wrapper {
            flex: 1;
            display: flex;
            @include center;
            .slide-contents-search-icon {
                  flex: 0 0 px2rem(28);
                  font-size: px2rem(12);
                  @include center;
            }
            .slide-contents-search-input {
                flex: 1;
                width: 100%;
                height: px2rem(32);
                font-size: px2rem(14);
                background: transparent;
                border: none;
                &:focus {
                    outline: none;  // 删除选中时的边框
                }
            }
        }
        .slide-contents-search-cancel {
            flex: 0 0 px2rem(50);
            font-size:px2rem(14);
            @include right;
        }
    }
}
.slide-contents-book-wrapper {
    display: flex;
    width: 100%;
    height: px2rem(90);
    padding: px2rem(10) px2rem(15) px2rem(20) px2rem(15);
    box-sizing: border-box;
    .slide-contents-book-img-wrapper {
        flex: 0 0 px2rem(45);
        .slide-contents-book-img {
            width: px2rem(45);
            height: px2rem(60);
        }
    }
    .slide-contents-book-info-wrapper {
        flex: 1;
        padding: 0 px2rem(10);
        .slide-contents-book-title {
            // 375*0.85 - 30 - 20 - 45 - 70 = 153.75 需要准确计算出宽度
            width: px2rem(153.75);
            font-size: px2rem(14);
            line-height: px2rem(16);
            @include ellipsis2(3);
        }
        .slide-contents-book-author {
            width: px2rem(153.75);
            font-size: px2rem(12);
            margin-top: px2rem(5);
            @include ellipsis;
        }
    }
    .slide-contents-book-progress-wrapper {
        flex: 0 0 px2rem(70);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        font-size: 0; // 两个div上方是多余的设置为0就消除了高度
        .slide-contents-book-progress {
            .progress {
                font-size: px2rem(14);
            }
            .progress-text {
                font-size: px2rem(12);
            }
        }
        .slide-contents-book-time {
            font-size:px2rem(12);
            margin-top: px2rem(5);
        }
    }
}
</style>
