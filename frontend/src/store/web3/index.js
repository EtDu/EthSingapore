import Web3 from 'web3'
export default {
  state: {
    status: '',
    isKovan: false,
    instance: ''
  },
  mutations: {
    setStatus (state, payload) {
      state.status = payload
    },
    setNetwork (state, payload) {
      state.isKovan = payload
    },
    setInstance (state, payload) {
      state.instance = payload
    }
  },
  actions: {
    async onload ({ commit, state }) {
      if (window.ethereum) {
        commit('setInstance', new Web3(window.ethereum))
        try {
          await window.ethereum.enable()
          commit('setStatus', 'enabled')
        } catch (e) {
          commit('setStatus', 'disabled')
        }
      } else if (window.web3) {
        commit('setInstance', new Web3(window.web3.currentProvider))
        commit('setStatus', 'enabled')
      } else {
        commit('setStatus', 'disabled')
      }
      const network = await state.instance.eth.net.getId()
      if (network === 42) {
        commit('setNetwork', true)
      } else {
        commit('setNetwork', false)
      }
    }
  }
}