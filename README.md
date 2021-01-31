## Order placing bot

Bot which places several orders based on best ask/bid using Deversifi API to get orderbook data  
Orders are placed at +-5% of best ask and best bid, 5 orders of each side (buy and sell)  

## Running

1. npm install
2. npm run start

## Run tests

1. npm run test

## Architecture

/app -> Application logic  
    /App.js -> Entrypoint to the Application, initializes classes and starts bot  
    /Bot.js -> Order placement, order tracking and balance tracking logic  
    /OrderService.js -> Order placement/filling/cancellation logic  
    /Balances.js -> Balance storage  
    /Orderbook.js -> Orderbook and best/bid ask storage  
    /Deversifi.js -> API to connect with Deversifi  

/test -> Contains tests  