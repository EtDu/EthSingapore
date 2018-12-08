<template>
<div></div>
</template>
<script>
export default {
  name: 'Assets',
  props: {
    securities: Array
  },
  mount () {
    console.log(this.securities)
  }
}
</script>
