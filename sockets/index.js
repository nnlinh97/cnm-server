
const { RpcClient } = require('tendermint');
const wsUrl = require('../constants/urls').webSocketUrl;
const nodeUrl = require('../constants/urls').nodeUrl;


const startWS = () => {
    const client = RpcClient(wsUrl);
    client.subscribe({ query: "tm.event='NewBlock'" }, listener);
    
}

const listener = (value) => {
    console.log(value.block);
    
}

module.exports = startWS;