import web3 from './web3'
import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)
export default new Vuex.Store({
  modules: {
    web3: web3
  }
})
