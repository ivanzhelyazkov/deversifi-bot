

class Balances {
    constructor() {
        this.balances = {
            'ETH': 10,
            'USD': 2000
        }
    }

    getBalance(currency) {
        return this.balances[currency];
    }

    setBalance(currency, amount) {
        this.balances[currency] = amount;
    }

    getAllBalances() {
        console.log('balances:\n', this.balances);
    }
}

module.exports = Balances;