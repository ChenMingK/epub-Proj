<template>
  <div class="ebook-slide-contents">
      <div class="slide-contents-search-wrapper">
          <div class="slide-contents-search-input-wrapper">
              <div class="slide-contents-search-icon">
                  <span class="icon-search"></span>
              </div>
              <input type="text"
                     class="slide-contents-search-input"
                     v-model="searchText"
                     :placeholder="$t('book.searchHint')"
                     @keyup.enter.exact="search()"
                     @click="showSearchPage()"> <!--keyup是按下按键抬起后触发 exact精确要求回车, 不加的话按shift+enter也会触发-->
          </div> <!--input end-->
          <div class="slide-contents-search-cancel"
               v-if="searchVisible"
               @click="hideSearchPage()"> {{$t('book.cancel')}}</div>
      </div><!--搜索框 end-->
      <div class="slide-contents-book-wrapper" v-show="!searchVisible">
          <div class="slide-contents-book-img-wrapper">
              <img :src="cover" class="slide-contents-book-img">
          </div><!--封面-->
          <div class="slide-contents-book-info-wrapper">
              <div class="slide-contents-book-title">
                <span class="slide-contents-book-title-text">{{metadata.title}}</span>
              </div>
              <div class="slide-contents-book-author">
                <span class="slide-contents-book-author-text">{{metadata.creator}}</span>
              </div>
          </div><!--书本信息-->
          <div class="slide-contents-book-progress-wrapper">
              <div class="slide-contents-book-progress">
                  <span class="progress">{{progress + '%'}}</span>
                  <span class="progress-text">{{$t('book.haveRead2')}}</span>
              </div>
              <div class="slide-contents-book-time">{{getReadTimeText()}}</div>
          </div><!--阅读进度信息-->
      </div>
      <scroll class="slide-contents-list"
              :top="156"
              :bottom="48"
              v-show="!searchVisible">
        <div class="slide-contents-item" v-for="(item, index) in navigation" :key="index">
          <span class="slide-contents-item-label"
                :class="{'selected': section === index}"
                :style="contentItemStyle(item)"
                @click="displayContent(item.href)">{{item.label}}</span>
          <span class="slide-contents-item-page">{{item.page}}</span>
        </div><!--这个div填入Scroll组件的<slot></slot>中-->
      </scroll>
      <scroll class="slide-search-list"
              :top="66"
              :bottom="48"
              v-show="searchVisible">
        <!--slot-->
        <div class="slide-search-item" 
            v-for="(item, index) in searchList" 
            :key="index" 
            v-html="item.excerpt"
            @click="displayContent(item.cfi, true)">  <!--使用了span替换文本，需要将搜索出的内容作为html载入-->
        </div>
      </scroll>
  </div>
</template>

<script>
  import { ebookMixin } from '../../utils/mixin'
  import Scroll from '../common/Scroll'
  import { px2rem } from '../../utils/utils'
  export default {
      mixins: [ebookMixin],
      components: {
        Scroll
      },
      data: function () {
        return {
            searchVisible: false,
            searchList: null,
            searchText: ''
        }
      },
      methods: {
        search() {
          if (this.searchText && this.searchText.length > 0) {
            this.doSearch(this.searchText).then(list => {
              this.searchList = list
              this.searchList.map(item => {
                item.excerpt = item.excerpt.replace(this.searchText, 
                `<span class="content-search-text">${this.searchText}</span>`) // highlight 在主题css中添加
                return item // should return a Object
              })
            })
          }
        },
        // Global search 
        /* spineItems为Section对象，管理当前章节的整个内容；
           调用该对象的load方法将book对象作为上下文传入----获取所有文本信息
           调用该对象的find方法，传入搜索关键字---实现当前章节检索
           这里通过遍历的方法将所有章节都进行了一次搜索操作 
        */ 
        doSearch(q) {
            return Promise.all(
                this.currentBook.spine.spineItems.map(item => item.load(this.currentBook.load.bind(this.currentBook))
                  .then(item.find.bind(item, q))
                  .finally(item.unload.bind(item)))) // unload释放资源
                  .then(results => Promise.resolve([].concat.apply([], results))) // 二维数组降维
        },
        // 跳转目录后要隐藏，但是注意不要改display方法，因为不应该影响进度条拖动
        displayContent(target, highlight = false) {
          this.display(target, () => {
            // 跳转时隐藏菜单栏
            this.hideTitleAndMenu()
            if (highlight) {
              this.currentBook.rendition.annotations.highlight(target) // annotations class? 文字高亮效果
            }
          })         
        },
        // 动态绑定样式，调整不同级别目录缩进
        contentItemStyle(item) {
          return {
            marginLeft: `${px2rem(item.level * 15)}rem`
          }
        },
        showSearchPage() {
          this.searchVisible = true
        },
        hideSearchPage() {
          this.searchVisible = false
          this.searchText = ''
          this.searchList = null
        }
      }
  }
</script>

<style lang='scss' scoped>
@import "../../assets/styles/global.scss";
.ebook-slide-contents {
  width: 100%;
  // font-size: 0;
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
                .icon-search {
                  font-size: px2rem(12);
                }
          }
          .slide-contents-search-input {
              flex: 1;
              width: 100%;
              height: px2rem(32);
              font-size: px2rem(14);
              background: transparent; // 删除默认背景颜色
              border: none;            // 删除默认边框
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
            // width: px2rem(153.75);
            font-size: px2rem(14);
            line-height: px2rem(16);
            @include left;
            .slide-contents-book-title-text {
              @include ellipsis2(3);
            }
            
        }
        .slide-contents-book-author {
            // width: px2rem(153.75);
            font-size: px2rem(12);
            margin-top: px2rem(5);
            line-height: px2rem(14);
            @include left;
            .slide-contents-book-author-text {
              @include ellipsis2(1);
            }
        }
    }
    .slide-contents-book-progress-wrapper {
        flex: 0 0 px2rem(70);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        //font-size: 0; // 两个div上方是多余的设置为0就消除了高度
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
  .slide-contents-list {
    padding: 0 px2rem(15);
    box-sizing: border-box;
    .slide-contents-item {
      display: flex; // 使用flex布局会自动计算文字宽度
      padding: px2rem(20) 0;
      box-sizing: border-box;
      .slide-contents-item-label {
        font-size: px2rem(14);
        line-height: px2rem(16);
        flex: 1;
        @include ellipsis;
      }
      .slide-contents-item-page {
        flex: 0 0 px2rem(30);
        font-size: px2rem(10);
        @include right;
      }
    }
  }
  .slide-search-list {
    width: 100%;
    padding: 0 px2rem(15);
    box-sizing: border-box;
    .slide-search-item {
      font-size: px2rem(14);
      line-height: px2rem(16); // for English
      padding: px2rem(20) 0;
      box-sizing: border-box;
    }
  }
}

</style>
