const { v4 } = require('uuid');

class OrderService {
    constructor() {
        this.orders = {}
    }

    placeOrder(symbol, side, amount, price) {
        let id = v4();
        if(side == 'buy') {
            console.log(`PLACE ${symbol} ASK @ ${price} ${amount} with id: ${id}`)
        } else if(side == 'sell') {
            console.log(`PLACE ${symbol} BID @ ${price} ${amount} with id: ${id}`)
        }
        this.storeOrder(id, symbol, side, amount, price);
        return id;
    }

    storeOrder(id, symbol, side, amount, price) {
        this.orders[id] = {
            symbol: symbol,
            side: side,
            amount: amount,
            price: price
        }
    }

    fillOrder(id, pnl) {
        let order = this.orders[id];
        if(!order) {
            console.log(`invalid order to fill with id ${id}`);
            return false;
        }
        let eth = pnl[0];
        let usd = pnl[1];
        this.orders[id] = undefined;
        if(order.side == 'buy') {
            console.log(`FILLED ASK @ ${order.price} ${order.amount} (ETH + ${eth} USD ${usd})`);
        } else if(order.side == 'sell') {
            console.log(`FILLED BID @ ${order.price} ${order.amount} (ETH ${eth} USD + ${usd})`);
        }
        return true;
    }

    cancelOrder(id) {
        this.orders[id] = undefined;
        console.log('cancelled order with id', id);
        return true;
    }
}

module.exports = OrderService;