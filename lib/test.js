const axios = require('axios');
const transaction = require('./tx/index');
const { Keypair } = require('stellar-base');
const { RpcClient } = require('tendermint');
const base32 = require('base32.js');
const moment = require('moment');
const userRepo = require('../repos/user');
const metaDataRepo = require('../repos/metaData');
const postRepo = require('../repos/post');
const followRepo = require('../repos/follow');
const accountRepo = require('../repos/account');
const txRepo = require('../repos/transaction');
const SIZE_LIMITED = 22020096;
const BANDWIDTH_PERIOD = 86400;
const MAX_CELLULOSE = 9007199254740991;
const NETWORK_BANDWIDTH = BANDWIDTH_PERIOD * SIZE_LIMITED;
const rootKey = 'GA6IW2JOWMP4WGI6LYAZ76ZPMFQSJAX4YLJLOQOWFC5VF5C6IGNV2IW7';
const { decodePost, decodeFollow } = require('../lib/tx/v1')


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

const rootAccount = {
    idKey: 'GA6IW2JOWMP4WGI6LYAZ76ZPMFQSJAX4YLJLOQOWFC5VF5C6IGNV2IW7',
    balance: 500000000000,
    sequence: 0,
    bandwidth: 0,
    bandwidthTime: null,
    avatar: null,
    bandwidthLimit: 0
}

// userRepo.insertUser(rootAccount).then(res => {
//     console.log(res);
// })

const client = RpcClient('https://dragonfly.forest.network:443');
let query = [];
for (let i = 12200; i < 12700; i++) {
    query.push(client.block({ height: i }))
}

Promise.all(query).then(result => {
    backupData(result);
}).catch((err) => {
    console.log(err);
})

async function asyncForEach(array, cb) {
    for (let i = 0; i < array.length; i++) {
        await cb(array[i], i);
    }
}

const backupData = async (result) => {
    await asyncForEach(result, async (item, index) => {
        // if (index + start === end) {
        //     metaDataRepo.updateMetaData(end + 1);
        // }
        const txs = item.block.data.txs;
        // console.log(item);
        if (txs) {
            // const dataTx = transaction.decode(Buffer.from(txs[0], 'base64'))
            await importDB({
                time: item.block.header.time,
                tx: txs[0],
                height: item.block.header.height
            })
        }
    })
}

const importDB = async (params) => {
    const txSize = Buffer.from(params.tx, 'base64').length;
    const tx = transaction.decode(Buffer.from(params.tx, 'base64'));
    
    // if (!transaction.verify(tx)) {
    //     return "Wrong Signature";
    // }
    // let account = await userRepo.getUser(tx.account);
    // if (!account) {
    //     return "Account doesn't exists";
    // }
    // const nextSequence = +account.sequence + 1;
    // if (nextSequence !== +tx.sequence) {
    //     return "Sequence doesn't match";
    // }
    // if (tx.memo.length > 32) {
    //     return 'Memo has more than 32 bytes';
    // }
    // const diff = account.bandwidthTime !== 'null'
    //     ? moment(params.time).unix() - moment(account.bandwidthTime).unix()
    //     : BANDWIDTH_PERIOD;
    // const bandwidthLimit = +account.balance / MAX_CELLULOSE * NETWORK_BANDWIDTH;
    // account.bandwidth = Math.ceil(Math.max(0, (BANDWIDTH_PERIOD - diff) / BANDWIDTH_PERIOD) * (+account.bandwidth) + txSize);
    // if (account.bandwidth > bandwidthLimit) {
    //     return ('Bandwidth limit exceeded');
    // }
    // let updateBandwidthResult = await userRepo.updateBandwidth({
    //     bandwidthTime: params.time,
    //     sequence: nextSequence,
    //     bandwidth: account.bandwidth,
    //     bandwidthLimit: bandwidthLimit,
    //     idKey: account.idKey
    // })
    transaction.hash(tx);
    let txItem = {
        id: tx.hash,
        tx: JSON.stringify(tx),
        createAt: params.time,
        height: params.height,
        account: tx.account,
        address: tx.params.address ? tx.params.address : ''
    }
    console.log(txItem);
    let insertTx = await txRepo.insertTx(txItem);
    switch (tx.operation) {
        case 'create_account1':
            const newUser = {
                idKey: tx.params.address,
                balance: 0,
                sequence: 0,
                bandwidth: 0,
                bandwidthLimit: 0,
                bandwidthTime: params.time,
                avatar: ''
            }
            let insert = await userRepo.insertUser(newUser);
            break;
        case 'payment1':
            let addressResult = await userRepo.getUser(tx.params.address);
            if (!addressResult) {
                return "destination doesn't exists";
            }
            if (tx.params.amount <= 0) {
                return "Amount must be greater than zero";
            }
            if (tx.account == tx.params.address) {
                return "Can not transfer to the same account";
            }
            if (tx.params.amount > account.balance) {
                return "Balance must be greater or equal than Amount";
            }
            const accountResult = await userRepo.getUser(tx.account);
            const updateAccount = await userRepo.updateBalance({
                idKey: tx.account,
                balance: (+accountResult.balance) - (+tx.params.amount)
            });
            const updateAddress = await userRepo.updateBalance({
                idKey: tx.params.address,
                balance: (+addressResult.balance) + (+tx.params.amount)
            });
            break;
        case 'post1':
            try {
                decodePost(tx.params.content)
            } catch (error) {
                break;
            }
            const content = decodePost(tx.params.content);
            if (content.text !== '' && content.type == 1) {
                const newPost = {
                    idKey: tx.account,
                    content: content.text,
                    createAt: params.time
                }
                let insertPost = await postRepo.insertPost(newPost);
            }
            break;

        case 'update_account1':
            // console.log(tx);
            switch (tx.params.key) {
                case 'name1':
                    console.log('---------------------------');
                    console.log(tx);
                    const newName = tx.params.value.toString('utf8');
                    console.log(newName);
                    let updateNameResult = await accountRepo.getAccount(tx.account);
                    if (updateNameResult.length === 0) {
                        console.log('insert name');
                        let insertAccount = await accountRepo.insertAccount({
                            idKey: tx.account,
                            displayName: newName,
                            avatar: ''
                        });
                    } else {
                        console.log('update name');
                        let updateAccount = await accountRepo.updateName({
                            idKey: tx.account,
                            displayName: newName
                        });
                    }
                    break;
                case 'picture1':
                    console.log('--------------------------');
                    console.log(tx);
                    console.log('data:image/jpeg;base64,' + tx.params.value.toString('base64'));
                    const avatar = 'data:image/jpeg;base64,' + tx.params.value.toString('base64');
                    let updateAvatarResult = await accountRepo.getAccount(tx.account);
                    if (updateAvatarResult.length === 0) {
                        console.log('insert avatar');
                        let insertAvatar = await accountRepo.insertAccount({
                            idKey: tx.account,
                            displayName: '',
                            avatar: avatar
                        });
                    } else {
                        console.log('update avatar');
                        let updateAvatar = await accountRepo.updateAvatar({
                            idKey: tx.account,
                            avatar: avatar
                        })
                    }
                    break;
                case 'followings':
                    try {
                        decodeFollow(tx.params.value)
                    } catch (error) {
                        break;
                    }
                    const addressBlock = decodeFollow(tx.params.value).addresses;
                    
                    let followerBlock = [];
                    addressBlock.forEach(item => {
                        followerBlock.push(base32.encode(item));
                    });
                    // console.log('followerBlock',followerBlock);
                    // console.log('==================================');
                    

                    const followerDBResult = await followRepo.getListFollower(tx.account);
                    let followerDB = [];
                    if (followerDBResult.length > 0) {
                        followerDBResult.forEach((item) => {
                            followerDB.push(item.follower);
                        });
                    }
                    // console.log('followerDB', followerDB);
                    // console.log('==================================');

                    let unFollow = [];
                    let newFollow = followerBlock.slice();
                    if (followerDB.length > 0 && followerBlock.length > 0) {
                        unFollow = followerDB.slice();
                        followerDB.forEach(itemDB => {
                            newFollow = newFollow.filter(newItem => {
                                return newItem !== itemDB;
                            })
                        });
                        followerBlock.forEach((itemBlock) => {
                            unFollow = unFollow.filter((unItem) => {
                                return unItem !== itemBlock;
                            })
                        })
                    }
                    // console.log('unFollow', unFollow);
                    // console.log('=============================');
                    // console.log('newFollow', newFollow);
                    // console.log('================================');
                    if (unFollow.length > 0) {
                        asyncForEach(unFollow, async (item, index) => {
                            const deleteItem = {
                                follower: item,
                                following: tx.account,
                                id: item + tx.account
                            }
                            let deleteFollow = await followRepo.deleteFollow(deleteItem);
                        })
                    }
                    if (newFollow.length > 0) {
                        asyncForEach(newFollow, async (item, index) => {
                            const newItem = {
                                follower: item,
                                following: tx.account,
                                id: item + tx.account
                            }
                            let insertFollow = await followRepo.insertFollow(newItem);
                        });
                    }
                    break;
            }
            break;
    }
}

