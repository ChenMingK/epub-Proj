import Vue from 'vue'
import Vuex from 'vuex'
import book from './modules/book'
import getters from './getters' // 不在node_moduls中的要加./
import actions from './actions'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    book // {state:{},mutations{},actions{}...}
  },
  getters, // {fileName: state => state.book.fileName 用的ES6的解构赋值吧 Store.getters: fileName:xxx menuVisible:xxx}
  actions

})
