
class Bot {
    constructor(orderbook, balances, orderService, limitPercentage, orderCount, symbol) {
        this.orderbook = orderbook;
        this.orderService = orderService;
        this.balances = balances;
        this.placedOrders = false;
        // Should be environment variables
        this.limitPercentage = limitPercentage;
        this.orderCount = orderCount;
        this.symbol = symbol;
        this.base = this.getBase();
        this.quote = this.getQuote();
    }

    start() {
        this.placeOrders();
        this.trackBalances();
        this.trackPrices();
    }

    // Place 5 buy and sell orders
    placeOrders() {
        for(let i = 0 ; i < this.orderCount ; ++i) {
            this.placeBuyOrder()
            this.placeSellOrder()
        }
        this.placedOrders = true;
        console.log('finished placing orders');
    }

    // Place a limit buy order
    placeBuyOrder() {
        let price = this.calculatePrice('buy');
        let amount = this.calculateAmount();
        let balance = this.balances.getBalance(this.base)
        if(balance < amount) {
            console.log(`insufficient ${this.base} balance, cannot place order (balance: ${balance}, order amount: ${amount}`);
            return;
        }
        this.orderService.placeOrder(this.symbol, 'buy', amount, price);
    }

    // Place a limit sell order
    placeSellOrder() {
        let price = this.calculatePrice('sell');
        let amount = this.calculateAmount();
        let balance = this.balances.getBalance(this.quote)
        if(balance < amount) {
            console.log(`insufficient ${this.quote} balance, cannot place order (balance: ${balance}, order amount: ${amount}`);
            return;
        }
        this.orderService.placeOrder(this.symbol, 'sell', amount, price);
    }

    // Track and print balances every 30 seconds
    trackBalances() {
        this.balances.getAllBalances();
        setTimeout(() => {
            this.trackBalances();
        }, 30000);
    }

    // Track orderbook prices and check if order is filled
    trackPrices() {
        if(!this.placedOrders) {
            setTimeout(() => {
                this.trackPrices()
            }, 1000);
            return;
        }
        let orders = this.orderService.orders;
        let bestAsk = this.orderbook.bestAsk;
        let bestBid = this.orderbook.bestBid;
        for(const id in orders) {
            let order = orders[id];
            if(order.side == 'buy' && order.price < bestAsk) {
                console.log('buy order price', order.price, 'is below best ask:', bestAsk);
                let pnl = this.calculatePnl(order);
                this.orderService.fillOrder(id, pnl);
                this.updateBalances(pnl);
                this.placeBuyOrder();
            } else if(order.side == 'sell' && order.price > bestBid) {
                console.log('sell order price', order.price, 'is above best bid:', bestBid);
                let pnl = this.calculatePnl(order);
                this.orderService.fillOrder(id, pnl);
                this.updateBalances(pnl);
                this.placeSellOrder();
            }
        }
        setTimeout(() => {
            this.trackPrices()
        }, 1000);
    }

    // Calculate eth/usd pnl
    calculatePnl(order) {
        let pnlEth, pnlUsd;
        if(order.side == 'buy') {
            pnlEth = order.amount;
            pnlUsd = - (order.price * order.amount);
        } else if(order.side == 'sell') {
            pnlEth = - order.amount;
            pnlUsd = order.price * order.amount;
        }
        return [pnlEth, pnlUsd]
    }

    // Update balances after an order fill
    // For simplicity's sake, omitting the limit order balance removal logic
    updateBalances(pnl) {
        let eth = pnl[0];
        let usd = pnl[1];
        let balance = this.balances.getBalance('ETH') + eth;
        this.balances.setBalance('ETH', balance);
        balance = this.balances.getBalance('USD') + usd;
        this.balances.setBalance('USD', balance);
    }

    // Get order price
    calculatePrice(side) {
        let price;
        if(side == 'buy') {
            let bestAsk = this.orderbook.bestAsk;
            let upperPriceBound = bestAsk + bestAsk * (this.limitPercentage / 100);
            price = this.getRandomNumber(bestAsk, upperPriceBound);
        } else if(side == 'sell') {
            let bestBid = this.orderbook.bestBid;
            let lowerPriceBound = bestBid - bestBid * (this.limitPercentage / 100);
            price = this.getRandomNumber(lowerPriceBound, bestBid);
        } else {
            console.log('invalid price');
            return;
        }
        return price;
    }

    // in real version will have logic to split the string of the symbol
    getBase() {
        return 'ETH';
    }

    getQuote() {
        return 'USD'
    }

    calculateAmount() {
        return this.getRandomNumber(0, 1);
    }

    getRandomNumber(min, max) {
        return Math.random() * (max - min) + min;
    }
}

module.exports = Bot