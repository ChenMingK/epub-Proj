import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import './assets/styles/icon.css'
import './assets/fonts/daysOne.css'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
