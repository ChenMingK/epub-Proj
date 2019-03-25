/* eslint-disable */ 
import Vue from 'vue'
import Vuex from 'vuex'
import book from './modules/book'
import getters from './getters'    // 不在node_moduls中的要加./

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    book
  },
  getters
})
