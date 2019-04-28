import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/store'
    },
    {
      path: '/ebook',
      component: () => import('./views/ebook/index.vue'), // 路由懒加载，这里用的是ES6的语法  import()函数是动态加载 import 是静态加载
      children: [ // 动态路由
        {
          path: ':fileName',
          component: () => import('./components/ebook/EbookReader.vue')
        }
      ]
    },
    {
      path: '/store',
      component: () => import('./views/store/index.vue'),
      redirect: '/store/shelf', // #/store -> #/store/home
      children: [
        {
          path: 'home',
          component: () => import('./views/store/StoreHome.vue')
        },
        {
          path: 'list',
          component: () => import('./views/store/StoreList.vue')
        },
        {
          path: 'detail', // /store/detail   加斜杠则只能匹配/detail
          component: () => import('./views/store/StoreDetail.vue')
        },
        {
          path: 'shelf', // 书架
          component: () => import('./views/store/StoreShelf.vue')
        },
        {
          path: 'category', // 书架
          component: () => import('./views/store/StoreCategory.vue')
        },
        {
          path: 'speaking', // 书架
          component: () => import('./views/store/StoreSpeaking.vue')
        }
      ]
    }
  ]
})
