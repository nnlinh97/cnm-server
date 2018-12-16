// import { Buffer } from 'buffer';

const axios = require('axios');
const transaction = require('./tx/index');
const { Keypair } = require('stellar-base');
const { RpcClient } = require('tendermint');
const helper = require('../helper/index');


const key = Keypair.random();


const privateKey = "SA3CRYDZO732G7FSMSSQOJ5FAJRWZELGLEKFBO6XQ4TJQWASMFK4SSM3";
const publicKey = "GAXVLYJUYND6QKGHK4FGM44XK3U77KJY54VTUJNIORYASOUOHWO63Q7Q";

const address_secret = key.secret();
const address_public = key.publicKey();

// const tx = {
//     version: 1,
//     sequence: 3,
//     memo: Buffer.alloc(0),
//     account: publicKey,
//     operation: "create_account",
//     params: {
//         address: address_public,
//     },
// }
// transaction.sign(tx, privateKey);
// const txEncode = '0x' + transaction.encode(tx).toString('hex');

// axios.get(`https://komodo.forest.network/broadcast_tx_commit?tx=${txEncode}`).then(res => {
//     console.log(res);
//     console.log('success');
//     console.log(address_public);
// })

const client = RpcClient('https://komodo.forest.network:443');
let query = [];
for (let i = 8000; i < 8100; i++) {
    query.push(client.block({ height: i }))
}
Promise.all(query).then(result => {
    result.forEach((item, index) => {
        // console.log(item.block.data.txs);
        const txs = item.block.data.txs
        if (txs) {
            const dataTx = transaction.decode(Buffer.from(txs[0], 'base64'))
            // console.log(dataTx);
            switch (dataTx.operation) {
                case 'create_account':
                    helper.insertUser(dataTx.params.address);
                    break;

                case 'payment':
                    break
            }
        }
    });
}).catch((err) => {
    console.log(err);
})


