// 程序入口
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import i18n from './lang'
import './assets/styles/icon.css'
import './assets/styles/global.scss'
import './assets/fonts/daysOne.css'
import './utils/boost'
import './utils/create-api'
// import './mock' // 引用mock 注意如果在vue.js中进行了模拟则不能再引入mock了，会导致电子书无法加载
Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
