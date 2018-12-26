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
const reactionRepo = require('../repos/reaction');
const commentRepo = require('../repos/comment');
const SIZE_LIMITED = 22020096;
const BANDWIDTH_PERIOD = 86400;
const MAX_CELLULOSE = 9007199254740991;
const NETWORK_BANDWIDTH = BANDWIDTH_PERIOD * SIZE_LIMITED;
const rootKey = 'GA6IW2JOWMP4WGI6LYAZ76ZPMFQSJAX4YLJLOQOWFC5VF5C6IGNV2IW7';
const { decodePost, decodeFollow, decodeType, decodeReact } = require('../lib/tx/v1')


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
for (let i = 29100; i < 29111; i++) {
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

const backupData = async (result, startBlock, endBlock) => {
    await asyncForEach(result, async (item, index) => {
        const txs = item.block.data.txs;
        // if (index + startBlock === endBlock) {
        //     //current: 10511
        //     let updateMeta = await metaDataRepo.updateMetaData(endBlock + 1);
        //     console.log('update metadata => ', endBlock + 1);
        //     console.log('-----------------------------------------------------------');
        // }
        if (txs) {
            await asyncForEach(txs, async (block) => {
                // let dataTx = transaction.decode(Buffer.from(block, 'base64'));
                await importDB({
                    time: item.block.header.time,
                    tx: block,
                    height: item.block.header.height
                });
            })
        }
    })
}

const importDB = async (params) => {
    const txSize = Buffer.from(params.tx, 'base64').length;
    const tx = transaction.decode(Buffer.from(params.tx, 'base64'));
    if (!transaction.verify(tx)) {
        return "Wrong Signature";
    }
    let account = await userRepo.getUser(tx.account);
    if (!account) {
        return "Account doesn't exists";
    }
    const nextSequence = +account.sequence + 1;
    if (nextSequence !== +tx.sequence) {
        return "Sequence doesn't match";
    }
    if (tx.memo.length > 32) {
        return 'Memo has more than 32 bytes';
    }
    const diff = account.bandwidthTime !== 'null'
        ? moment(params.time).unix() - moment(account.bandwidthTime).unix()
        : BANDWIDTH_PERIOD;
    const bandwidthLimit = +account.balance / MAX_CELLULOSE * NETWORK_BANDWIDTH;
    account.bandwidth = Math.ceil(Math.max(0, (BANDWIDTH_PERIOD - diff) / BANDWIDTH_PERIOD) * (+account.bandwidth) + txSize);
    if (account.bandwidth > bandwidthLimit) {
        return ('Bandwidth limit exceeded');
    }
    let updateBandwidthResult = await userRepo.updateBandwidth({
        bandwidthTime: params.time,
        sequence: nextSequence,
        bandwidth: account.bandwidth,
        bandwidthLimit: bandwidthLimit,
        idKey: account.idKey
    })

    //insert tx
    transaction.hash(tx);
    let txItem = {
        hash: tx.hash,
        tx: JSON.stringify(tx),
        createAt: params.time,
        height: params.height,
        account: tx.account,
        address: tx.params.address ? tx.params.address : ''
    }
    // let insertTx = await txRepo.insertTx(txItem);
    switch (tx.operation) {
        case 'create_account':
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
            // let txItem = {
            //     account: tx.account,
            //     address: tx.params.address,
            //     operation: 'create_account',
            //     createAt: params.time,
            //     hash: tx.hash,
            //     tx: JOSN.stringify(tx),
            //     height: params.height
            // }
            txItem.operation = 'create_account';
            txItem.content = null;
            txItem.followed = null;
            txItem.amount = null;
            txItem.key = null;
            txItem.displayName = null;
            txItem.picture = null;
            let insertTx1 = await txRepo.insertTx(txItem);

            console.log(`${tx.account} create_account ${tx.params.address}`);
            break;
        case 'payment':
            // console.log(tx);
            let addressResult = await userRepo.getUser(tx.params.address);
            // console.log('addressResult',addressResult);
            if (!addressResult) {
                return "destination doesn't exists";
            }
            if (tx.params.amount <= 0) {
                return "Amount must be greater than zero";
            }
            if (tx.account == tx.params.address) {
                return "Can not transfer to myself";
            }
            if (tx.params.amount > (+account.balance)) {
                return "Balance must be greater or equal than Amount";
            }
            const accountResult = await userRepo.getUser(tx.account);
            // console.log('accountResult',accountResult);
            const updateAccount = await userRepo.updateBalance({
                idKey: tx.account,
                balance: (+accountResult.balance) - tx.params.amount
            });
            const updateAddress = await userRepo.updateBalance({
                idKey: tx.params.address,
                balance: (+addressResult.balance) + tx.params.amount
            });
            txItem.operation = 'payment';
            txItem.amount = tx.params.amount;
            txItem.content = null;
            txItem.followed = null;
            txItem.key = null;
            txItem.displayName = null;
            txItem.picture = null;
            let insertTx2 = await txRepo.insertTx(txItem);

            console.log(`${tx.account} payment ${tx.params.address} amount ${tx.params.amount}`);
            break;
        case 'post':
            try {
                decodePost(tx.params.content)
            } catch (error) {
                break;
            }
            // console.log(tx.params.content.toString('base64'));
            const content = decodePost(tx.params.content);
            if (content.text !== '' && content.type == 1) {
                const newPost = {
                    id: tx.hash,
                    idKey: tx.account,
                    content: tx.params.content.toString('base64'),
                    createAt: params.time
                }
                let insertPost = await postRepo.insertPost(newPost);
                txItem.operation = 'post';
                txItem.content = tx.params.content.toString('base64');
                txItem.followed = null;
                txItem.amount = null;
                txItem.key = null;
                txItem.displayName = null;
                txItem.picture = null;
                let insertTx3 = await txRepo.insertTx(txItem);

            }
            console.log(`${tx.account} => post => ${content.text}`);
            break;
        case 'update_account':
            txItem.operation = 'update_account';
            switch (tx.params.key) {
                case 'name':
                    const newName = tx.params.value.toString('utf8');
                    let updateNameResult = await accountRepo.getAccount(tx.account);
                    if (updateNameResult.length === 0) {
                        let insertAccount = await accountRepo.insertAccount({
                            idKey: tx.account,
                            displayName: tx.params.value.toString('base64'),
                            avatar: ''
                        });
                    } else {
                        let updateAccount = await accountRepo.updateName({
                            idKey: tx.account,
                            displayName: tx.params.value.toString('base64')
                        });
                    }
                    txItem.key = 'name';
                    txItem.displayName = tx.params.value.toString('base64');
                    txItem.content = null;
                    txItem.followed = null;
                    txItem.amount = null;
                    txItem.picture = null;
                    let insertTx4 = await txRepo.insertTx(txItem);

                    console.log(`${tx.account} => update_account key name => ${newName}`);
                    break;
                case 'picture':
                    const avatar = 'data:image/jpeg;base64,' + tx.params.value.toString('base64');
                    let updateAvatarResult = await accountRepo.getAccount(tx.account);
                    if (updateAvatarResult.length === 0) {
                        let insertAvatar = await accountRepo.insertAccount({
                            idKey: tx.account,
                            displayName: '',
                            avatar: avatar
                        });
                    } else {
                        let updateAvatar = await accountRepo.updateAvatar({
                            idKey: tx.account,
                            avatar: avatar
                        });
                    }
                    txItem.key = 'picture';
                    txItem.picture = avatar;
                    txItem.content = null;
                    txItem.followed = null;
                    txItem.amount = null;
                    txItem.displayName = null;
                    let insertTx = await txRepo.insertTx(txItem);

                    console.log(`${tx.account} => update_account key picture => ${avatar}`);
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
                    if (followerBlock.length == 0) {
                        unFollow = followerDB;
                    }
                    if (followerDB.length == 0) {
                        newFollow = followerBlock;
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
                    txItem.key = 'followings';
                    txItem.followed = followerBlock.toString();
                    txItem.content = null;
                    txItem.amount = null;
                    txItem.displayName = null;
                    txItem.picture = null;
                    let insertTx5 = await txRepo.insertTx(txItem);

                    console.log(`${tx.account} => update_account key followings`);
                    console.log(`${tx.account} => newfollow => ${newFollow}`);
                    console.log(`${tx.account} => unfollow => ${unFollow}`);
                    break;
            }
            break;
        case 'interact':
            //17500
            let client = RpcClient('https://dragonfly.forest.network:443');
            let type = decodeType(tx.params.content).type;
            let hash = await client.tx({ hash: '0x' + tx.params.object });
            let dataInteract = Buffer.from(hash.tx, 'base64');
            dataInteract = transaction.decode(dataInteract);
            switch (type) {
                case 1:
                    //comment
                    // console.log(tx);
                    // console.log(decodePost(tx.params.content).text);
                    let insertComment = await commentRepo.insertComment({
                        hash: tx.params.object,
                        account: tx.account,
                        text: tx.params.content.toString('base64'),
                        createAt: params.time
                    });
                    console.log(`${tx.account} interact key comment ${tx.params.object} text ${decodePost(tx.params.content).text}`);
                    break;
                case 2:
                    const accountReaction = tx.account;
                    const hashTx = tx.params.object;
                    let reaction = decodeReact(tx.params.content).reaction;
                    let check = await reactionRepo.getReaction({
                        hash: tx.params.object,
                        account: tx.account
                    });
                    if (check) {
                        //update
                        let updateReaction = await reactionRepo.updateReaction({
                            hash: tx.params.object,
                            account: tx.account,
                            type: decodeReact(tx.params.content).reaction
                        });
                    } else {
                        //insert
                        let insertReaction = await reactionRepo.insertReaction({
                            hash: tx.params.object,
                            account: tx.account,
                            type: decodeReact(tx.params.content).reaction
                        });
                    }
                    console.log(`${tx.account} interact key reaction ${tx.params.object} type ${decodeReact(tx.params.content).reaction}`);
                    break;
            }
            break;
    }
}

