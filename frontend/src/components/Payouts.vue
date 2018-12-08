<template>
  <b-card  :title="name">
      <b-table hover :items="items" :fields="fields"></b-table>
  </b-card>
</template>
<script>
export default {
  name: 'Payouts',
  props: ['name'],
  data () {
    return {
      // Note 'isActive' is left out and will not appear in the rendered table
      fields: [ 'Time', 'Issued', 'Profit'],
      items: []
    }
  },
  created () {
    this.updateFakeData()
  },
  methods: {
    updateFakeData () {
      setInterval(() => {
        this.items.push( { Time: new Date(Date.now()).toUTCString(), Issued: '2', Profit: '2' } )
        this.items.slice(this.items.length -10)
      }, 30000)
    }
  }
}
</script>
