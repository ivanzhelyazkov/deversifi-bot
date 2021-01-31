const axios = require('axios');

class Deversifi {
    constructor() {
        this.restUrl = 'https://api.stg.deversifi.com/';
        this.timeout = 10000;
        this.restClient = axios.create({
            baseURL: this.restUrl,
            timeout: this.timeout,
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            }
        });
    }

    async getOrderbook(symbol) {
        const params = {
            Symbol: symbol,
            Precision: "P0",
        };
        let res = await this.restClient.get(`bfx/v2/book/${params.Symbol}/${params.Precision}`)
        let book = res.data;
        return book;
    }
}

module.exports = Deversifi