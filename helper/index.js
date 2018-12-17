
const db = require('../config/dbConfig');
const user = db.user;


const insertUser = (publicKey) => {
    // console.log(publicKey);
    const newUser = {
        idKey: publicKey,
        balance: 0,
        sequence: 0,
        bandwith: 0,
        bandwithTime: null,
        avatar: null
    }
    // user.create(newUser).then(user => {
    //     console.log(user);
    // }).catch(err => {
    //     console.log(err);
    // })
}

const updateUser = (params) => {
    console.log(params);
    const account = user.findOne({
        where: {
            idKey: params.account
        }
    });
    const address = user.findOne({
        where:{
            idKey: params.params.address
        }
    })
    // Promise.all([account, address]).then(([RAccount, RAddress]) => {
    //     console.log('account',RAccount);
    //     console.log('address',RAddress);
    // }).catch((err) => {
    //     console.log(err);
    // })
}

module.exports = { insertUser, updateUser }