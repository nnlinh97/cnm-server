
const { RpcClient } = require('tendermint');
const moment = require('moment');
const base32 = require('base32.js');
const wsUrl = require('../constants/urls').webSocketUrl;
const nodeUrl = require('../constants/urls').nodeUrl;
const metaDataRepo = require('../repos/metaData');
const userRepo = require('../repos/user');
const accountRepo = require('../repos/account');
const reactionRepo = require('../repos/reaction');
const commentRepo = require('../repos/comment');
const txRepo = require('../repos/transaction');
const transaction = require('../lib/tx/index');
const postRepo = require('../repos/post');
const followRepo = require('../repos/follow');
const { decodePost, decodeFollow, decodeType, decodeReact } = require('../lib/tx/v1');
const SIZE_LIMITED = 22020096;
const BANDWIDTH_PERIOD = 86400;
const MAX_CELLULOSE = 9007199254740991;
const NETWORK_BANDWIDTH = BANDWIDTH_PERIOD * SIZE_LIMITED;



const backupData = async (result, startBlock, endBlock) => {
    await asyncForEach(result, async (item, index) => {
        const txs = item.block.data.txs;
        if (index + startBlock === endBlock) {
            //current: 10511
            let updateMeta = await metaDataRepo.updateMetaData(endBlock + 1);
            console.log('update metadata => ', endBlock + 1);
            console.log('-----------------------------------------------------------');
        }
        if (txs) {
            const dataTx = transaction.decode(Buffer.from(txs[0], 'base64'))
            await importDB({
                time: item.block.header.time,
                tx: txs[0],
                height: item.block.header.height
            })
        }
    })
}

async function asyncForEach(array, cb) {
    for (let i = 0; i < array.length; i++) {
        await cb(array[i], i);
    }
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
    let insertTx = await txRepo.insertTx(txItem);
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
            console.log(`${tx.account} create_account ${tx.params.address}`);
            break;
        case 'payment':
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
            console.log(`${tx.account} payment ${tx.params.address} amount ${tx.params.amount}`);
            break;
        case 'post':
            try {
                decodePost(tx.params.content)
            } catch (error) {
                break;
            }
            const content = decodePost(tx.params.content);
            if (content.text !== '' && content.type == 1) {
                const newPost = {
                    id: tx.hash,
                    idKey: tx.account,
                    content: content.text,
                    createAt: params.time
                }
                let insertPost = await postRepo.insertPost(newPost);
            }
            console.log(`${tx.account} => post => ${content.text}`);
            break;
        case 'update_account':
            switch (tx.params.key) {
                case 'name':
                    const newName = tx.params.value.toString('utf8');
                    let updateNameResult = await accountRepo.getAccount(tx.account);
                    if (updateNameResult.length === 0) {
                        let insertAccount = await accountRepo.insertAccount({
                            idKey: tx.account,
                            displayName: newName,
                            avatar: ''
                        });
                    } else {
                        let updateAccount = await accountRepo.updateName({
                            idKey: tx.account,
                            displayName: newName
                        });
                    }
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
                        text: decodePost(tx.params.content).text,
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

const startWS = () => {
    const client = RpcClient(wsUrl);
    client.subscribe({ query: "tm.event='NewBlock'" }, listener);
}


const listener = async (value) => {
    const client = RpcClient('https://dragonfly.forest.network:443');
    let meta = await metaDataRepo.getMetaData();
    const start = +meta[0].metaData;
    let end = +value.block.header.height;
    if (end - start > 500) {
        end = start + 500;
    }
    console.log(`${start} => ${end}`);
    let queryBlocks = [];
    for (let i = start; i <= end; i++) {
        queryBlocks.push(client.block({ height: i }));
    }
    Promise.all(queryBlocks).then(async (result) => {
        await backupData(result, start, end);
    }).catch((err) => {
        console.log(err);
    })
}

module.exports = startWS;