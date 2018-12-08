import { ethers } from 'ethers'
import SecurityCoinFactory from '../../constants/contracts/SecurityCoinFactory'
import SecurityCoin from '../../constants/contracts/SecurityCoin'
import { startBlock } from '../../constants'
export default {
  state: {
    status: '',
    isKovan: false,
    provider: null,
    eventsLoaded: false,
    securities: []
  },
  mutations: {
    setStatus (state, payload) {
      state.status = payload
    },
    setNetwork (state, payload) {
      state.isKovan = payload
    },
    setProvider (state, payload) {
      state.provider = payload
    },
    setLoaded (state, payload) {
      state.eventsLoaded = payload
    },
    setFactoryContract (state, payload) {
      state.factoryContract = payload
    },
    updateSecurity (state, payload) {
      state.securities.push(payload)
    }
  },
  actions: {
    async onload ({ commit, state }) {
      if (window.ethereum) {
        commit('setProvider', new ethers.providers.Web3Provider(window.ethereum))
        try {
          await window.ethereum.enable()
          commit('setStatus', 'enabled')
        } catch (e) {
          commit('setStatus', 'disabled')
        }
      } else {
        commit('setStatus', 'disabled')
      }
      const network = await state.provider.getNetwork()
      state.provider.resetEventsBlock(startBlock)
      if (network.name === 'kovan') {
        commit('setNetwork', true)
      } else {
        commit('setNetwork', false)
      }
      commit('setFactoryContract', new ethers.Contract(
        SecurityCoinFactory.address,
        SecurityCoinFactory.ABI,
        state.provider.getSigner()
      ))
      state.factoryContract.on('NewSecurityCoin', async address => {
        commit('updateSecurity', new ethers.Contract(
          address,
          SecurityCoin.ABI,
          state.provider.getSigner()
        ))
      })
      commit('setLoaded', true)
    }
  }
}
