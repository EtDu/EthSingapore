<template>
  <div>
    <b-form @submit="onSubmit" @reset="onReset" v-if="show">
      <b-form-group id="namegroup"
                    label="Token Name"
                    label-for="name">
        <b-form-input id="name"
                      type="text"
                      v-model="form.tokenName"
                      required
                      placeholder="ETHSingapore Coin">
        </b-form-input>
      </b-form-group>
      <b-form-group id="tickergroup"
                    label="Ticker"
                    label-for="ticker">
        <b-form-input id="ticker"
                      type="text"
                      v-model="form.tokenTicker"
                      required
                      placeholder="ESG">
        </b-form-input>
      </b-form-group>
      <b-form-group id="supplygroup"
                    label="Total Supply"
                    label-for="supply">
        <b-form-input id="supply"
                      type="text"
                      v-model="form.tokenSupply"
                      required
                      placeholder="1000000">
        </b-form-input>
      </b-form-group>
      <b-form-group id="intervalgroup"
                    label="Payout Interval (seconds)"
                    label-for="interval">
        <b-form-input id="interval"
                      type="text"
                      v-model="form.payoutInterval"
                      required
                      placeholder="30">
        </b-form-input>
      </b-form-group>
      <b-form-group id="amountgroup"
                    label="Payout Amount"
                    label-for="amount">
        <b-form-input id="amount"
                      type="text"
                      v-model="form.payoutAmount"
                      required
                      placeholder="3">
        </b-form-input>
      </b-form-group>
      <b-form-group id="feegroup"
                    label="Withdrawal Fee"
                    label-for="fee">
        <b-form-input id="fee"
                      type="text"
                      v-model="form.withdrawalFee"
                      required
                      placeholder="1">
        </b-form-input>
      </b-form-group>
      <b-button type="submit" variant="primary">Submit</b-button>
      <b-button type="reset" variant="danger">Reset</b-button>
    </b-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        tokenName: '',
        tokenTicker: '',
        tokenSupply: '',
        payoutInterval: '',
        payoutAmount: '',
        withdrawalFee: ''
      },
      show: true
    }
  },
  methods: {
    onSubmit (evt) {
      evt.preventDefault();
      alert(JSON.stringify(this.form));
    },
    onReset (evt) {
      evt.preventDefault();
      form.tokenName = '';
      from.tokenTicker = '';
      form.tokenSupply = '';
      form.payoutInterval = '';
      form.payoutAmount = '';
      form.withdrawalFee = '';
      this.show = false;
      this.$nextTick(() => { this.show = true });
    }
  }
}
</script>
