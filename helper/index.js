
const db = require('../config/dbConfig');
const user = db.user;


const insertUser = (publicKey) => {
    // console.log(publicKey);
    const newUser = {
        idKey: publicKey,
        balance: 0,
        sequence: 0,
        bandwidth: 0,
        bandwidthTime: null
    }
    user.create(newUser).then(user => {
        console.log(user);
    }).catch(err => {
        console.log(err);
    })
}

module.exports = { insertUser }