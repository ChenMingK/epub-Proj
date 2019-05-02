<template>
  <ebook-dialog :title="title" ref="dialog">
    <div class="dialog-list-wrapper" v-if="!ifNewGroup"> <!--是否处于新增状态-->
      <div class="dialog-list-item"
           :class="{'is-add': item.edit  ? item.edit === 1 : false}"
           v-for="(item, index) in categoryList"
           :key="index"
           @click="onGroupClick(item)"
           v-if="(item.edit === 2 && isInGroup) || item.edit !== 2 || !item.edit">
        <div class="dialog-list-item-text">{{item.title}}</div>
        <div class="dialog-list-icon-wrapper" v-if="isInGroup && shelfCategory.id === item.id">
          <span class="icon-check"></span>
        </div>
      </div>
    </div> <!--替换Dialog组件中第一个slot 新增状态:点击新建分组后的对话框-->
    <div class="dialog-new-group-wrapper" v-else>
      <div class="dialog-input-title-wrapper">
        <span class="dialog-input-title">{{$t('shelf.groupName')}}</span>
      </div>
      <div class="dialog-input-wrapper">
        <div class="dialog-input-inner-wrapper">
          <input type="text" class="dialog-input" v-model="newGroupName" ref="dialogInput"><!--输入内容-->
          <div class="dialog-input-clear-wrapper" @click="clear" v-show="newGroupName && newGroupName.length > 0">
            <span class="icon-close-circle-fill"></span><!--取消文字-->
          </div>
        </div>
      </div>
    </div> <!--替换Dialog组件中第一个slot-->
    <div slot="btn" class="group-dialog-btn-wrapper">
      <div class="dialog-btn" @click="hide">{{$t('shelf.cancel')}}</div>
      <div class="dialog-btn" @click="createNewGroup" :class="{'is-empty': newGroupName && newGroupName.length === 0}"
           v-if="ifNewGroup">{{$t('shelf.confirm')}}
      </div>
    </div> <!--指定了slot为btn，替换Dialog组件中slot为btn的插槽-->
  </ebook-dialog>
</template>

<script>
  import EbookDialog from '../common/Dialog'
  import { storeShelfMixin } from '../../utils/mixin'
  import { removeAddFromShelf, appendAddToShelf } from '../../utils/store'
  import { saveBookShelf } from '../../utils/localStorage'

  export default {
    name: 'group-dialog',
    mixins: [storeShelfMixin],
    props: {
      showNewGroup: {
        type: Boolean,
        default: false
      },
      groupName: String
    },
    components: {
      EbookDialog
    },
    computed: {
      isInGroup() {
        return this.currentType === 2
      },
      defaultCategory() {
        return [
          {
            title: this.$t('shelf.newGroup'),
            edit: 1
          },
          {
            title: this.$t('shelf.groupOut'),
            edit: 2
          }
        ]
      },
      category() {
        return this.shelfList.filter(item => item.type === 2)
      },
      categoryList() {
        return [...this.defaultCategory, ...this.category]
      },
      title() {
        return !this.ifNewGroup ? this.$t('shelf.moveBook') : this.$t('shelf.newGroup')
      }
    },
    data() {
      return {
        ifNewGroup: false,
        newGroupName: ''
      }
    },
    methods: {
      show() {
        this.ifNewGroup = this.showNewGroup
        this.newGroupName = this.groupName
        this.$refs.dialog.show()
      },
      hide() {
        this.$refs.dialog.hide()
        // 防止动画的重叠
        setTimeout(() => {
          this.ifNewGroup = false
        }, 200)
      },
      // 加入到分组, 只有进入分组之后才会有移出分组字样
      onGroupClick(item) {
        if (item.edit && item.edit === 1) { // 新建分组
          this.ifNewGroup = true
        } else if (item.edit && item.edit === 2) { // 移出分组
          this.moveOutFromGroup(item)
        } else {
          this.moveToGroup(item)
        }
      },
      clear() {
        this.newGroupName = ''
      },
      // 加入分组逻辑
      moveToGroup(group) {
        // 记得vuex action都是异步操作
        // 1.对选中图书进行过滤
        this.setShelfList(this.shelfList
          .filter(book => {
            // 注意这里的逻辑
            if (book.itemList) {
              book.itemList = book.itemList.filter(subBook => this.shelfSelected.indexOf(subBook) < 0)
            }
            return this.shelfSelected.indexOf(book) < 0
          }))
          // 2.将选中图书加入到指定的分组
          .then(() => {
            // console.log(group) 选中的分组
            if (group && group.itemList) { // itemList选中分组下的电子书
              group.itemList = [...group.itemList, ...this.shelfSelected]
            }
            // 3.对添加过的分组的id重新排序并重新保存
            // 合并电子书, id重新排序
            group.itemList.forEach((item, index) => {
              item.id = index + 1
            })
            this.simpleToast(this.$t('shelf.moveBookInSuccess').replace('$1', group.title))
            this.onComplete()
          })
      },
      // 移出分组逻辑,从分组中移除，并移动到书架的最后；只有在Category中才能移除分组
      moveOutFromGroup() {
        // // 1.保留没有被选中的图书
        // console.log(this.shelfList)
        // this.setShelfList(this.shelfList.map(book => {
        //   if (book.type === 2 && book.itemList) { // 因为只能在type为2(category)中才有移出分组操作
        //     book.itemList = book.itemList.filter(subBook => !subBook.selected) // 保留该分组中的非选中书籍
        //   }
        //   return book
        // })).then(() => {
        //   // 2.将选中的电子书添加到书架的最后
        //   console.log(this.shelfSelected)
        //   // let list = removeAddFromShelf(this.shelfList)
        //   // list = [].concat(list, ...this.shelfSelected)
        //   // list = appendAddToShelf(list)
        //   // list = computeId(list)
        //   const list = computeId(appendAddToShelf([].concat(
        //     removeAddFromShelf(this.shelfList), ...this.shelfSelected)))
        //   this.setShelfList(list).then(() => {
        //     this.simpleToast(this.$t('shelf.moveBookOutSeccess'))
        //     this.onComplete()
        //   })
        // })
        this.moveOutOfGroup(this.onComplete)
      },
      // 新建分组逻辑
      createNewGroup() {
        if (!this.newGroupName && this.newGroupName.length === 0) { // 名称不为空
          return
        }
        if (this.showNewGroup) { // 修改分组
          this.shelfCategory.title = this.newGroupName
          this.onComplete()
        } else { // 分组新增
          // 分组对象
          const group = {
            // id:书架中倒数第二个元素+1
            id: this.shelfList[this.shelfList.length - 2].id + 1,
            itemList: [],
            selected: false,
            title: this.newGroupName,
            type: 2 // 表示其是一个分组
          }
          let list = removeAddFromShelf(this.shelfList) // 移除 '+'
          list.push(group)
          list = appendAddToShelf(list) // 追加'+'号
          this.setShelfList(list).then(() => {
            this.moveToGroup(group)
          })
        }
      },
      onComplete() {
        saveBookShelf(this.shelfList) // 保存书架
        this.hide() // 隐藏Dialog
        this.setIsEditMode(false) // 取消编辑状态
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .dialog-list-wrapper {
    width: 100%;
    padding: 0 px2rem(20);
    box-sizing: border-box;
    font-size: px2rem(14);
    @include scroll;
    .dialog-list-item {
      display: flex;
      padding: px2rem(15) 0;
      box-sizing: border-box;
      color: #666;
      &.is-add {
        color: $color-blue;
        &:active {
          color: $color-blue-transparent;
        }
      }
      &:active {
        color: rgba(102, 102, 102, .5)
      }
      .dialog-list-item-text {
        flex: 1;
      }
      .dialog-list-icon-wrapper {
        flex: 0 0 px2rem(30);
        color: $color-blue;
        @include right;
      }
    }
  }

  .dialog-new-group-wrapper {
    width: 100%;
    padding: 0 px2rem(20);
    box-sizing: border-box;
    .dialog-input-title-wrapper {
      font-size: px2rem(10);
      margin-top: px2rem(20);
    }
    .dialog-input-wrapper {
      width: 100%;
      padding: 0 0 px2rem(30) 0;
      box-sizing: border-box;
      .dialog-input-inner-wrapper {
        display: flex;
        width: 100%;
        padding: px2rem(10) 0;
        box-sizing: border-box;
        border-bottom: px2rem(1) solid #eee;
        font-size: px2rem(14);
        color: #666;
        .dialog-input {
          flex: 1;
          border: none;
          &:focus {
            outline: none;
          }
        }
        .dialog-input-clear-wrapper {
          flex: 0 0 px2rem(30);
          color: #ccc;
          @include center;
          &:active {
            color: #999;
          }
        }
      }
    }
  }

  .group-dialog-btn-wrapper {
    width: 100%;
    @include center;
  }
  .dialog-btn {
    flex: 1;
    &.is-empty {
      color: rgba(255, 255, 255, .5);
    }
    &:active {
      color: rgba(255, 255, 255, .5)
    }
  }
</style>
