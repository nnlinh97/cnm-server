
const { RpcClient } = require('tendermint');
const wsUrl = require('../constants/urls').webSocketUrl;
const nodeUrl = require('../constants/urls').nodeUrl;


const startWS = () => {
    const client = RpcClient(wsUrl);
    client.subscribe({ query: "tm.event='NewBlock'" }, listener);
    // client.block({height: 10}).then(res => {
    //     console.log(res);
    // })
}

const listener = (value) => {
    console.log(value.block);
    // if(value.block.header.data.txs){
    //     console.log(value);
    // }
}

module.exports = startWS;