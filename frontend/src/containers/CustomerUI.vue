<template>
<b-container class="text-center">
<div>
  <b-card align="center" title='Your Securities'>
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
        <template slot="Dividends" slot-scope="row">
          <b-button variant="light" size="sm" @click.stop="toggleDividends(row)" class="mr-2">
          Show Dividends
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
      <b-row>
        <b-col><b-table hover :items="dividendItems" :fields="dividendFields"></b-table></b-col>
        <b-col>  <b-card title="Divend Payout"
          class="mb-2">
    <p class="card-text">
      Payout dividends for all securities.
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
Vue.use(AsyncComputed)
export default {
  components: {
    Assets,
    Payouts,
    PingPong
  },
  mounted () {
    this.updateFakeData()
  },
  data () {
    return {
      loading: true,
      fields: [
        'name', 'balance', 'Buy', 'Dividends'
      ],
      buyQty: 0,
      dividendFields: [ 'Time', 'Rate', 'Cumulative profit'],
      dividendItems: [],
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
    handlePayout() {
      console.log('oayo')
    }
  },
  asyncComputed: {
    async userSecurities () {
      return Promise.all(store.state.web3.securities.map(async e => {
        return {
          name: await e.name(),
          balance: `${await e.balanceOf(store.state.web3.provider.getSigner().getAddress())} ${await e.symbol()}`,
          obj: e
        }
      }))
    }, 
    async userDividends () {
      const tokenAdr = this.selectedToken.address
      const userAdr =  await store.state.web3.provider.getSigner().getAddress()
      const qty = await this.selectedToken.balanceOf(userAdr)
      const result = await fetch(`https://ethsg.hamisu.me/${tokenAdr}/${userAdr}/${qty}`)
      console.log(result)
    }
  },
  store: store
}
</script>
