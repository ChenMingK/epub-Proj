import Vue from 'vue'
import Vuex from 'vuex'
import book from './modules/book'
import store from './modules/store'
import getters from './getters'
import actions from './actions'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    book, // {state:{},mutations{},actions{}...}
    store
  },
  getters, // {fileName: state => state.book.fileName 用的ES6的解构赋值吧 Store.getters: fileName:xxx menuVisible:xxx}
  actions
})
