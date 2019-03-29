import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/ebook'
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
    }
  ]
})
