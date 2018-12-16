
const dbConfig = require('../config/dbConfig')
const Sequelize = require('sequelize');
const sequelize = new Sequelize(dbConfig);
const { RpcClient } = require('tendermint')
const { encode, decode, verify, sign, hash } = require('../lib/tx/index');

const user = sequelize.define('USERS', {
    idKey: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    balance: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0
    },
    sequence: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
    },
    bandwidth: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    // Last transaction date for bandwidth calculate
    bandwidthTime: {
        type: DataTypes.DATE,
    }
});


const privateKey = "SA3CRYDZO732G7FSMSSQOJ5FAJRWZELGLEKFBO6XQ4TJQWASMFK4SSM3";
const publicKey = "GAXVLYJUYND6QKGHK4FGM44XK3U77KJY54VTUJNIORYASOUOHWO63Q7Q";


const client = RpcClient('https://dragonfly.forest.network:443');
let query = [];
for(let i = 0; i < 10; i++){
    query.push(client.block({height: i}))
}
Promise.all(query).then(result => {
    console.log(result);
})