<template>
  <div class="store-home">
    <search-bar ref="searchBar"></search-bar>
    <flap-card :data="random"></flap-card> <!--传递一本随机的图书给子组件-->
    <scroll :top="scrollTop" @onScroll="onScroll" ref="scroll" v-show="this.ifStoreHomeScrollShow"> <!--vuex控制-->
      <div class="banner-wrapper">
        <div class="banner-img" :style="{backgroundImage: `url('${banner}')`}"></div>
      </div>
      <guess-you-like :data="guessYouLike"></guess-you-like> <!--猜你喜欢部分-->
      <recommend :data="recommend" class="recommend"></recommend>
      <featured :data="featured" :titleText="$t('home.featured')" :btnText="$t('home.seeAll')" class="featured"></featured>
      <div class="category-list-wrapper" v-for="(item, index) in categoryList" :key="index">
        <category-book :data="item"></category-book>
      </div>
      <category class="category" :data="categories"></category>
    </scroll>
  </div>
</template>

<script>
  import SearchBar from '../../components/home/SearchBar'
  import Scroll from '../../components/common/Scroll'
  import FlapCard from '../../components/home/FlapCard.vue'
  import GuessYouLike from '../../components/home/GuessYouLike.vue'
  import Recommend from '../../components/home/Recommend.vue'
  import Featured from '../../components/home/Featured.vue'
  import CategoryBook from '../../components/home/CategoryBook.vue'
  import Category from '../../components/home/Category.vue'
  import { storeHomeMixin } from '../../utils/mixin'
  import { home } from '../../api/store'
  export default {
    mixins: [storeHomeMixin],
    components: {
      SearchBar,
      Scroll,
      FlapCard,
      GuessYouLike,
      Recommend,
      Featured,
      CategoryBook,
      Category
    },
    data() {
      return {
        scrollTop: 94,
        random: null,
        banner: '',
        guessYouLike: null,
        recommend: null,
        featured: null,
        categoryList: null,
        categories: null
      }
    },
    methods: {
      // 外层捕捉，内层组件处理
      onScroll(offsetY) {
        this.setOffsetY(offsetY)
        if (offsetY > 0) {
          this.scrollTop = 52
        } else {
          this.scrollTop = 94
        }
        this.$refs.scroll.refresh() // 该方法重新计算滚动条高度
      }
    },
    mounted() {
      // axios接受？？都是异步的
      home().then(response => {
        if (response && response.status) {
          const data = response.data
          const randomIndex = Math.floor(Math.random() * data.random.length)
          this.random = data.random[randomIndex] // 相当于随机一本书
          // console.log(data)
          this.banner = data.banner
          this.guessYouLike = data.guessYouLike
          this.recommend = data.recommend
          this.featured = data.featured
          this.categoryList = data.categoryList
          this.categories = data.categories
        }
      })
    }
}
</script>

<style lang='scss' scoped>
  @import "../../assets/styles/global.scss";
  .store-home {
    width: 100%;
    height: 100%;
    background: white;
    overflow-y: scroll;
    .banner-wrapper {
      width: 100%;
      padding: px2rem(10);
      box-sizing: border-box;
      // 图片展示可以通过img来显示也可以用div的background-image来用
      .banner-img {
        width: 100%; 
        height: px2rem(150);
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }
    }
    .recommend {
      margin-top: px2rem(20);
    }
    .featured {
      margin-top: px2rem(20);
    }
    .category-list-wrapper {
      margin-top: px2rem(20);
    }
    .category {
      margin-top: px2rem(20);
    }
  }
</style>
