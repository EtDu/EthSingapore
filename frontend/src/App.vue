<template>
  <div id="app">
    <b-navbar type="light">
      <b-nav-item to="companyui"> Security Issuance </b-nav-item>
      <b-nav-item to="customerui"> Customer Dashboard </b-nav-item>
    </b-navbar>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
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
