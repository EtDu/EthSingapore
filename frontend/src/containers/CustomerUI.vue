<template>
<b-container class="text-center">
<div>
  <b-card align="center" title='Your Securities'>
        <b-row>
    <div v-if="!$store.state.web3.eventsLoaded">
      <b-container class="mx-auto">
        <ping-pong class="mx-auto"/>
      </b-container>
    </div>
    <div v-else-if="this.userSecurities">
      <b-table hover :fields="fields" :items="userSecurities">
        <template slot="Buy" slot-scope="row">
          <b-button variant="light" size="sm" @click.stop="row.toggleDetails" class="mr-2">
          Buy Token
          </b-button>
        </template>
        <template slot="row-details" slot-scope="row">
          <b-card class="text-center display:flex">
            <b-row>
              <b-col>
                <b-form-input v-model="buyQty"
                type="number"
                placeholder="How much?">
                </b-form-input>
              </b-col>
              <b-col>
                <b-button variant="light" size="sm" @click="handleBuy(row)">Confirm</b-button>
                <b-button variant="light" size="sm" @click="row.toggleDetails">Cancel</b-button>
              </b-col>
            </b-row>
          </b-card>
      </template>
      </b-table>
    </div>

        <b-col>  <b-card title="Dividend Payout"
          class="mb-2">
    <p class="card-text">
      Payout {{dividends}}
    </p>
    <b-button @click="handlePayout" variant="warning">DAI NOW</b-button>
  </b-card></b-col>
      </b-row>
  </b-card>
</b-card>
</div>
</b-container>

</template>
<script>
import AsyncComputed from 'vue-async-computed'
import Vue from 'vue'
import store from '../store'
import Assets from '../components/Assets'
import Payouts from '../components/Payouts'
import { PingPong } from 'vue-loading-spinner'
import { ethers } from 'ethers'
import { setInterval, setTimeout } from 'timers';
Vue.use(AsyncComputed)
export default {
  components: {
    Assets,
    Payouts,
    PingPong
  },
  data () {
    return {
      loading: true,
      fields: [
        'name', 'balance', 'Buy'
      ],
      buyQty: 0,
      dividends: 0,
      selectedToken: ''
    }
  },
  methods: {
    async handleBuy(row) {
      console.log(row)
      const tx = await row.item.obj.purchaseSecurity({
        value: ethers.utils.parseEther(this.buyQty)
      })
      console.log(tx)
    },
    toggleDividends(row) {
      this.selectedToken = row.item.obj
    },
    async getUserDividends () {
      const tokenAdr = this.selectedToken.address
      const userAdr =  await store.state.web3.provider.getSigner().getAddress()
      const qty = await this.selectedToken.balanceOf(userAdr)
      const result = await fetch(`getData/${tokenAdr}/${userAdr}/${qty}`)
      const json = await result.json()
      dividends = parseInt(json.dividends)/18
    },
    async handlePayout() {
      const tx = await this.selectedToken.triggerWithdraw()
      console.log(tx)
    }
  },
  asyncComputed: {
    async userSecurities () {
      const secs = await Promise.all(store.state.web3.securities.map(async e => {
        return {
          name: await e.name(),
          balance: `${await e.balanceOf(store.state.web3.provider.getSigner().getAddress())} ${await e.symbol()}`,
          obj: e
        }
      }))
      this.selectedToken = secs[0].obj
      setInterval(this.getUserDividends, 30000)
      return secs;
    }
  },
  store: store
}
</script>