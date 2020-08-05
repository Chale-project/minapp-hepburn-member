import Vue from 'vue'

const formatMoney = Vue.filter('formatMoney', function (money) {
  if (isNaN(money)) {
    return "0.00"
  }
  const _formatMoney = (money / 100).toFixed(2)
  return _formatMoney;
})

export {
  formatMoney
}