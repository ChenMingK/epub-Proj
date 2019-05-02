<template>
  <div class="shelf-footer" v-show="isEditMode"><!--只在编辑模式才显示-->
    <div class="shelf-footer-tab-wrapper"
         :class="{'is-selected': isSelected}" 
         v-for="item in tabs" 
         :key="item.index"
         @click="onTabClick(item)">
        <div class="shelf-footer-tab"> <!--isSelected: 选中图书时设置，选中1本或多本时下方不透明-->
          <div class="icon-private tab-icon" v-if="item.index === 1 && !isPrivate"></div>
          <div class="icon-private-see tab-icon" v-if="item.index === 1 && isPrivate"></div>
          <!--split-->
          <div class="icon-download tab-icon" v-if="item.index === 2 && !isDownload"></div>
          <div class="icon-private-see tab-icon" v-if="item.index === 2 && isDownload"></div>
          <!--split-->
          <div class="icon-move tab-icon" v-if="item.index === 3"></div>
          <div class="icon-shelf tab-icon" v-if="item.index === 4"></div>
          <div class="tab-text" :class="{'remove-text': item.index === 4}">{{label(item)}}</div>
        </div>
    </div>
  </div>
</template>

<script>
  import { storeShelfMixin } from '../../utils/mixin.js'
  import { saveBookShelf, removeLocalStorage } from '../../utils/localStorage.js'
  import { download } from '../../api/store.js'
  import { removeLocalForage } from '../../utils/localForage'
  export default {
    mixins: [storeShelfMixin],
    data: function() {
      return {
        popupMenu: null // 该公用组件作为变量, 方便直接调用其方法
      }
    },
    computed: {
      // 有至少1本书被选中时为true
      isSelected() {
        return this.shelfSelected && this.shelfSelected.length > 0
      },
      // 按钮 为什么放在computed?
      tabs() {
        return [
          {
            label: this.$t('shelf.private'),
            label2: this.$t('shelf.noPrivate'),
            index: 1
          },
          {
            label: this.$t('shelf.download'),
            label2: this.$t('shelf.delete'),
            index: 2
          },
          {
            label: this.$t('shelf.move'),
            index: 3
          },
          {
            label: this.$t('shelf.remove'),
            index: 4
          }
        ]
      },
      // 判断是否属于私密阅读状态, 模拟私密阅读
      /*
        1.没有选中图书
        2.选中了多个图书---都不为private状态
        3.选中了多个图书---既有private也有非private
      */
      isPrivate() {
        if (!this.isSelected) {
          return false
        } else {
          return this.shelfSelected.every(item => item.private) // 每本书都是private状态
        }
      },
      // 是否已缓存
      isDownload() {
        if (!this.isSelected) {
          return false
        } else {
          return this.shelfSelected.every(item => item.cache)
        }
      }
    },
    methods: {
      // for downloadSelectedBook
      downloadBook(book) { // book json in bookList.js
        let text = ''
        // 对话框组件
        const toast = this.toast({
          text // text: text
        })
        toast.continueShow() // 让该Toast持续显示
        return new Promise((resolve, reject) => {
          // 异步请求下载，这个axios方法在store.js, 参数:book, onSuccess, onError, (onProgress) 
          download(book, res => {
            // console.log(res)
            // console.log('下载完毕') 
            toast.remove() // 不用hide()用remove，让toast组件重新实例化;这不是组件的方法是create-vue-api方法?
            resolve(res)
          }, reject, progressEvent => { // 下载状态改变时触发, 配合axios的onDownloadProgress使用
            // console.log(progressEvent) // loaded total => loaded/total = progress
            const progress = Math.floor(progressEvent.loaded / progressEvent.total * 100) + '%'
            text = this.$t('shelf.progressDownload').replace('$1', `${book.fileName}.epub(${progress})`)
            // 转换成"正在下载xxx.epub(xx%)"
            // console.log(text)
            toast.updateText(text)
          })
        })
      },
      // indexedDB缓存逻辑, 缓存选中的图书
      async downloadSelectedBook() {
        for (let i = 0; i < this.shelfSelected.length; i++) {
          await this.downloadBook(this.shelfSelected[i])
            .then(book => {
              book.cache = true // 标记为已缓存
          })
        }
      },
      // 离线缓存逻辑
      async setDownload() {
        this.onComplete()
        if (this.isDownload) {
          this.removeSelectedBook() // 删除缓存
        } else {
          await this.downloadSelectedBook() // 下载成功的对话框要等待下载完成
          saveBookShelf(this.shelfList)     // 改变vuex中shelfList的save状态
          this.simpleToast(this.$t('shelf.setDownloadSuccess')) // 组件更新过程中的问题?传入text再传入导致没更新
        }
      },
      // for removeSelectedBook
      removeBook(book) {
        return new Promise((resolve, reject) => {
          // Economics/2018_Book_ApplyingTheKaizenInAfrica-info localStorage存的啥?cfi?
          removeLocalStorage(`${book.categoryText}/${book.fileName}-info`) // key的结构:分类'/'电子书名称-info
          // 2018_Book_InklusivesWachstumUndWirtschaf
          removeLocalForage(`${book.fileName}`) // indexedDB的key就是书名
          resolve(book) // 返回结果
        })
      },
      removeSelectedBook() {
        Promise.all(this.shelfSelected.map(book => this.removeBook(book))) // 删除不需要同步
          .then(books => { // removeBook的resolve返回值的数组
            books.map(book => {
              book.cache = false
            })
            saveBookShelf(this.shelfList) // 注意保存书架数据
            this.simpleToast(this.$t('shelf.removeDownloadSuccess'))
          })
      },
      hidePopup() {
        this.popupMenu.hide()
      },
      // 公共方法
      onComplete() {
        this.hidePopup()
        this.setIsEditMode(false)
        saveBookShelf(this.shelfList) // 本地缓存?真正改变的是shelfList
      },
      // "私密阅读"功能
      setPrivate() {
        let isPrivate
        // this.isPrivate是计算属性, 都不是或部分不是private状态都显示"开启私密阅读"
        if (this.isPrivate) {
          isPrivate = false
        } else {
          isPrivate = true
        }
        this.shelfSelected.forEach(book => {
          book.private = isPrivate
        })
        this.onComplete()
        if (isPrivate) {
          this.simpleToast(this.$t('shelf.setPrivateSuccess'))
        } else {
          this.simpleToast(this.$t('shelf.closePrivateSuccess'))
        }
      },
      // 点击时显示
      showPrivate() {
          // 这里调用vue-create-api简单注入组件
          this.popupMenu = this.popup({
            title: this.isPrivate ? this.$t('shelf.setPrivateTitle') : this.$t('shelf.closePrivateTitle'),
            btn: [
              {
                text: this.isPrivate ? this.$t('shelf.close') : this.$t('shelf.open'),
                click: () => {
                  this.setPrivate()
                }
              }, 
              {
                text: this.$t('shelf.cancel'),
                click: () => {
                  this.hidePopup()
                }
              }
            ]
          }).show()
      },
      showDownload() {
        // 传递给Popup组件的参数, 标题, 按钮
        // 按钮为对象, 传入click点击事件
        this.popupMenu = this.popup({
            title: this.isDownload ? this.$t('shelf.removeDownloadTitle') : this.$t('shelf.setDownloadTitle'),
            btn: [
              {
                text: this.isDownload ? this.$t('shelf.delete') : this.$t('shelf.open'),
                click: () => {
                  this.setDownload()
                }
              }, 
              {
                text: this.$t('shelf.cancel'),
                click: () => {
                  this.hidePopup()
                }
              }
            ]
          }).show()
      },
      showRemove() {
        let title
        if (this.shelfSelected.length === 1) {
          // '是否将$1移出书架？'
          title = this.$t('shelf.removeBookTitle')
            .replace('$1', `《${this.shelfSelected[0].title}》`)
        }  else {  // 移除所选书籍
          title = this.$t('shelf.removeBookTitle')
            .replace('$1', this.$t('shelf.selectedBooks'))
        }
        this.popupMenu = this.popup({
            title: title,
            btn: [
              {
                text: this.$t('shelf.removeBook'),
                type: 'danger',
                click: () => {
                  this.removeSelected()
                }
              }, 
              {
                text: this.$t('shelf.cancel'),
                click: () => {
                  this.hidePopup()
                }
              }
            ]
          }).show()
      },
      // 将书移除书架逻辑
      removeSelected() {
        this.shelfSelected.forEach(selected => {
          // console.log(selected) 这个 !== 能比较对象?
          this.setShelfList(this.shelfList.filter(book => book !== selected)) // filter:对每一项运行指定函数，返回true的项组成的数组
        })
        this.setShelfSelected([])
        this.onComplete()
      },
      // 删除逻辑
      // 选一本书和选多本书要显示的内容不一样
      onTabClick(item) {
        if (!this.isSelected) {
          return
        }
        // 设定选择不同的Tab对应的功能
        switch (item.index) {
          case 1:
            this.showPrivate() // 私密阅读:Popup
            break
          case 2:
            this.showDownload() // 离线缓存:Popup
            break
          case 3:        
            this.dialog().show() // 分组:Dialog
            break
          case 4:
            this.showRemove() // 移出书架:Popup
            break
          default: 
            break
        }
        // 使用create-vue-api来调用组件Toast 省去了import和注册，内部？
        // 传递Toast组件的props即可
        // this.toast({ text: 'hello item' }).show()
      },
      label(item) {
        switch (item.index) {
          case 1:
            return this.isPrivate ? item.label2 : item.label
          case 2:
            return this.isDownload ? item.label2 : item.label
          default:
            return item.label
        }
      }
    }
}
</script>

<style lang='scss' scoped>
  @import '../../assets/styles/global.scss';
  .shelf-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 120;
    display: flex;
    width: 100%;
    height: px2rem(48);
    background: white;
    box-shadow: 0 px2rem(-2) px2rem(4) 0 rgba(0, 0, 0, .1);
    .shelf-footer-tab-wrapper {
      flex: 1;
      width: 25%;
      height: 100%;
      opacity: .5;
      .shelf-footer-tab {
        width: 100%;
        height: 100%;
        @include columnCenter; // 垂直居中
        .tab-icon {
          font-size: px2rem(20);
          color: #666;     
        }
        .tab-text {
          margin-top: px2rem(5);
          font-size: px2rem(12);
          color: #666;
          &.remove-text {
            color: $color-pink;
          }
        }
        .icon-shelf {
          color: $color-pink;
        }
      }
    }
    .is-selected {
        opacity: 1;
    }
  }
</style>
