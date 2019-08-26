module.exports = class MoneyExchangeBot {
  exchangeMoney(value, from, to) {
    this.result = parseInt(value) | 0;

    switch (from) {
      case 'dollar': case 'dollars':
        if (to.indexOf("euro") > -1) {
          this.result *= 0.680;
          return `${value} ${from} = ${this.result} ${to}`
        } else {
          return `sorry you can convert only dolars/euro to dollars/euro`
        }
      case 'euro':
        if (to.indexOf("dollar") > -1) {
          this.result *= 1.470;
          return `${value} ${from} = ${this.result} ${to}`
        } else {
          return `sorry you can convert only dolars/euro to dollars/euro`
        }
      default:
        return `sorry you can convert only dolars/euro to dollars/euro`
    }
  }
}
