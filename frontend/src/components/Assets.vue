<template>
  <b-table hover :items="items" :fields="fields"></b-table>
</template>
<script>
export default {
  name: 'Assets',
  data () {
    return {
      fields: [ 'Security', 'Amount'],
      items: [
        { Security: 'Shitcoin', Amount: '600' },
        { Security: 'Bitchcoin', Amount: '700' }
      ]
    }
  }
}
</script>
