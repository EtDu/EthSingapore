<template>
  <b-table hover :items="items" :fields="fields"></b-table>
</template>
<script>
export default {
  name: 'Payouts',
  data () {
    return {
      // Note 'isActive' is left out and will not appear in the rendered table
      fields: [ 'Timestamp', 'Issued', 'Profit'],
      items: [
        { Timestamp: Date.now(), Issued: '2', Profit: '2' },
      ]
    }
  },
  created () {
    this.updateFakeData()
  },
  methods: {
    updateFakeData () {
      setInterval(() => this.items.push( { Timestamp: Date.now(), Issued: '2', Profit: '2' } ))
    }
  }
}
</script>
