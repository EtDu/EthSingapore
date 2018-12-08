<template>
  <div id="app">
    <b-navbar type="light">
      <b-nav-item to="companyui"> Security Issuance </b-nav-item>
      <b-nav-item to="customerui"> Customer Dashboard </b-nav-item>
    </b-navbar>
    <div v-if="$store.state.web3.status == 'disabled'">
      Please unlock metamask.
    </div>
    <div v-else-if="$store.state.web3.isKovan == false">
      Please Select kovan testnet in metamask.
    </div>
    <div v-else>
      <router-view ></router-view>
    </div>
  </div>
</template>

<script>
import store from './store'
export default {
  name: 'app',
  store: store,
  created () {
    store.dispatch("onload")
    console.log(store)
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
