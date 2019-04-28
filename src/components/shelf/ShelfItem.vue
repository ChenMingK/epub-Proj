<!--需要使用动态组件,动态组件需要在data中注册？-->
<template>
  <div class="shelf-item" :class="{'shelf-item-shadow': data.type === 1 || data.type === 2}"
       @click="onItemClick">
    <component class="shelf-item-comp"
               :class="{'is-edit': isEditMode && data.type === 2}" 
               :is="item" 
               :data="data"></component>  <!--目录进入编辑模式时透明-->
    <div class="icon-selected"
         :class="{'is-selected': data.selected}"
         v-show="isEditMode && data.type === 1"></div> <!--编辑模式才出现图标-->
  </div>
</template>

<script>
  import { storeShelfMixin } from '../../utils/mixin'
  import ShelfBook from './ShelfItemBook'
  import ShelfCategory from './ShelfItemCategory'
  import ShelfAdd from './ShelfItemAdd'
  import { gotoStoreHome } from '../../utils/store.js'
  export default {
    mixins: [storeShelfMixin],
    props: {
      data: Object
    },
    data: function() {
      return {
        book: ShelfBook,
        category: ShelfCategory,
        add: ShelfAdd
      }
    },
    computed: {
      item() {
        return this.data.type === 1 ? this.book : (this.data.type === 2) 
          ? this.category : this.add
      }
    },
    methods: {
      onItemClick() {
        if (this.isEditMode) {
          this.data.selected = !this.data.selected
          if (this.data.selected) {
            // 这里使用扩展的数组方法 boost.js 只把选中的图书放入 what?
            this.shelfSelected.pushWithoutDuplicate(this.data) // vuex 存储已选中的图书
          } 
          // 从选中的图书中删除 注意data是每个图书的一个Object对象(父组件传入)
          else {
            this.setShelfSelected(this.shelfSelected.filter(item => item.id !== this.data.id))
          }
        } else {
          if (this.data.type === 1) {
            this.showBookDetail(this.data) // 跳转路由， 度读书界面
          } else if (this.data.type === 2) {
            this.$router.push({
              path: '/store/category',
              query: {
                title: this.data.title
              }
            })
          } else {
          gotoStoreHome(this) // 路由跳转到书城首页
          }
        } 
      }
    }

}
</script>

<style lang='scss' scoped>
  @import "../../assets/styles/global.scss";
  .shelf-item {
    width: 100%;
    height: 100%;
    position: relative;
    &.shelf-item-shadow {
      box-shadow: px2rem(2) px2rem(2) px2rem(6) px2rem(2) rgba(200, 200, 200, .3);
    }
    .shelf-item-comp {
      opacity: 1;
      &.is-edit {
        opacity: .5;
      }
    }
    .icon-selected {
      position: absolute;
      bottom: px2rem(2);
      right: px2rem(2);
      font-size: px2rem(18);
      color: rgba(0, 0, 0, .4);
      &.is-selected {
        color: $color-blue
      }
    }
  } 
  
</style>
