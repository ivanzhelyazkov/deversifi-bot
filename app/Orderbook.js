const Deversifi = require('./Deversifi');

class Orderbook {
    constructor(symbol) {
        this.symbol = symbol;
        this.api = new Deversifi()
        this.orderbook;
        this.getBookTimeout = 5000;
        this.bestBid;
        this.bestAsk;
        this.initAndRefreshOrderbook();
        this.setBestBidAndAsk();
    }

    getOrderbook() {
        this.api.getOrderbook(this.symbol).then(orderbook => {
            this.orderbook = orderbook;
        }).catch((err) => {
            console.log(err.data);
        })
    }

    initAndRefreshOrderbook() {
        this.getOrderbook()
        setInterval(() => {
            this.getOrderbook();
        }, this.getBookTimeout)
    }

    // Set best bid and ask from orderbook data
    setBestBidAndAsk() {
        if(!this.orderbook) {
            setTimeout(() => {
                this.setBestBidAndAsk();
            }, 100);
            return;
        }
        let bestBid = this.orderbook[0][0];
        if(this.orderbook[0][2] < 0) {
            bestBid = undefined;
        }
        let bestAsk;
        for(let i = 0 ; i < this.orderbook.length ; ++i) {
            let ask = this.orderbook[i][2] < 0 ? true : false;
            if(ask) {
                bestAsk = this.orderbook[i][0];
                break;
            }
        }
        this.bestBid = bestBid;
        this.bestAsk = bestAsk;
        setTimeout(() => {
            this.setBestBidAndAsk();
        }, this.getBookTimeout);
    }
}

module.exports = Orderbook