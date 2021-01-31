const assert = require('assert');
const App = require('../app/App');

app = new App();

describe('Bot', () => {
    let bot;
    before(async function () {
        while(!app.initialized) {
            await sleep(100);
        }
        bot = app.bot;
        while(!bot.placedOrders) {
            await sleep(100);
        }
    })

    it('should have placed 5 ask and 5 bid orders', () => {
        let orders = bot.orderService.orders;
        let buyCount = 0, sellCount = 0;
        for(const id in orders) {
            let order = orders[id];
            if(order.side == 'buy') {
                buyCount++;
            } else if(order.side == 'sell') {
                sellCount++;
            }
        }
        assert(buyCount == 5);
        assert(sellCount == 5);
    })
})

describe('Orderbook', () => {
    let orderbook;
    before(async function () {
        orderbook = app.orderbook;
        while(!app.initialized) {
            await sleep(100);
        }
    })
    it('should get orderbook', () => {
        let book = orderbook.orderbook;
        assert(book !== undefined || book !== null);
    })
    it('should get best ask and bid', () => {
        let bestAsk = orderbook.bestAsk;
        let bestBid = orderbook.bestBid;
        assert(bestBid !== undefined || bestAsk !== undefined);
    })
})

describe('Balances', () => {
    let balances;
    before(function () {
        balances = app.balances;
    })

    it('should get balances', () => {
        let ethBalance = balances.getBalance('ETH');
        let usdBalance = balances.getBalance('USD');
        assert(ethBalance == 10);
        assert(usdBalance == 2000);
    })
})

describe('OrderService', () => {
    let orderService, orderId;
    before(function () {
        orderService = app.orderService;
    })

    it('should place and store order', () => {
        let id = orderService.placeOrder('tETHUSD', 'buy', '1', '1500');
        assert(id !== undefined || id !== null);
        let order = orderService.orders[id];
        console.log('placed order:')
        console.log(order);
        orderId = id;
        assert(order !== undefined);
    })
})




function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}  