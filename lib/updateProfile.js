const axios = require('axios');
const transaction = require('./tx/index');
const { Keypair } = require('stellar-base');
const { RpcClient } = require('tendermint');
const moment = require('moment');
const userRepo = require('../repos/user');
const metaDataRepo = require('../repos/metaData')
const SIZE_LIMITED = 22020096;
const BANDWIDTH_PERIOD = 86400;
const MAX_CELLULOSE = 9007199254740991;
const NETWORK_BANDWIDTH = BANDWIDTH_PERIOD * SIZE_LIMITED;
const rootKey = 'GA6IW2JOWMP4WGI6LYAZ76ZPMFQSJAX4YLJLOQOWFC5VF5C6IGNV2IW7';

const key = Keypair.random();

const privateKey = "SA3CRYDZO732G7FSMSSQOJ5FAJRWZELGLEKFBO6XQ4TJQWASMFK4SSM3";
const publicKey = "GAXVLYJUYND6QKGHK4FGM44XK3U77KJY54VTUJNIORYASOUOHWO63Q7Q";
const address = "GA6RPEW47CL6LCEC25BC4UAF76AKTNMJELVYAYAO37GHSHHXJVQ2M2VR";

const address_secret = key.secret();
const address_public = key.publicKey();

const tx = {
    version: 1,
    sequence: 17,
    memo: Buffer.alloc(0),
    account: publicKey,
    operation: "update_account",
    params: {
        key: 'name',
        value: new Buffer('Nguyễn Ngọc Linh')
    },
    signature: new Buffer(64)
}

transaction.sign(tx, privateKey);
const txEncode = '0x' + transaction.encode(tx).toString('hex');

axios.get(`https://komodo.forest.network/broadcast_tx_commit?tx=${txEncode}`).then(res => {
    console.log(res);
    console.log('success');
    console.log(address_public);
})