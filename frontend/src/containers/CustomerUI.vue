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
      <b-table striped hover :fields="fields" :items="userSecurities">
        <template slot="Buy" slot-scope="row">
          <b-button size="sm" @click.stop="row.toggleDetails" class="mr-2">
          Buy Token
          </b-button>
        </template>
        <template slot="Dividends" slot-scope="row">
          <b-button size="sm" @click.stop="toggleDividends(row)" class="mr-2">
          Show Dividends
          </b-button>
        </template>
        <template slot="row-details" slot-scope="row">
          <b-card>
            <b-form-input v-model="buyQty"
              type="number"
              placeholder="How much?"></b-form-input>
            <b-button size="sm" @click="handleBuy(row)">Confirm</b-button>
            <b-button size="sm" @click="row.toggleDetails">Cancel</b-button>
          </b-card>
      </template>
      </b-table>
    </div>
  </b-card>
  <b-card footer-tag="footer" :title="name">
      <b-button slot="footer" size="sm" @click="handlePayout(row)">Withdraw Dividends</b-button>
      <b-table hover :items="dividendItems" :fields="dividendFields"></b-table>
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
      dividendFields: [ 'Time', 'Issued', 'Profit'],
      dividendItems: []
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
      console.log(row)
    },
    updateFakeData () {
      setInterval(() => {
        this.dividendItems.push( { Time: new Date(Date.now()).toUTCString(), Issued: '2', Profit: '2' } )
        this.dividendItems.slice(this.items.length -10)
      }, 30000)
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
    }
  },
  store: store
}
</script>
