const Orderbook = require('./Orderbook');
const Balances = require('./Balances');
const OrderService = require('./OrderService');
const Bot = require('./Bot');

class App {
    constructor() {
        this.symbol = 'tETHUSD';
        this.orderbook = new Orderbook(this.symbol);
        this.balances = new Balances();
        this.orderService = new OrderService();
        this.bot;
        this.initialized = false;
        this.initializeDependencies();
    }

    initializeDependencies() {
        if(!this.orderbook.bestBid || !this.orderbook.bestAsk) {
            setTimeout(() => {
                this.initializeDependencies();
            }, 100);
            return;
        } else {
            this.bot = new Bot(this.orderbook, this.balances, this.orderService, 5, 5, this.symbol);
            this.bot.start();
            this.initialized = true;
        }
    }
}

module.exports = App;