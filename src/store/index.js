import Vue from 'vue'
import Vuex from 'vuex'
import {getters} from './getters'
import {state} from './state'
import * as actions from './actions'
import mutations from './mutations'
import modules from './modules'
import stock from './modules/stock'
import { createPersistedState, createSharedMutations } from 'vuex-electron'
Vue.use(Vuex)

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  modules,
  stock,
  plugins: [
    // createPersistedState(),
    // createSharedMutations()
  ],
  strict: process.env.NODE_ENV !== 'production'
})
