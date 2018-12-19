
var db = require('../fn/db');

exports.getListUsers = (params) => {
    var sql = `select * from users limit ${params.limit} offset ${params.offset}`;
    return db.load(sql);
}

exports.insertUser = (user) => {
    var sql = `insert into users(idKey, balance, sequence, bandwidth, bandwidthTime, bandwidthLimit)
    values('${user.idKey}', '${user.balance}', '${user.sequence}', '${user.bandwidth}', '${user.bandwidthTime}', '${user.bandwidthLimit}')`;
    return db.save(sql);
}

exports.updateBalance = (data) => {
    // console.log(data);
    const sql = `update users set balance='${data.balance}' where idKey='${data.idKey}'`;
    return db.save(sql);
}

exports.updateSequence = (data) => {
    // console.log(data);
    const sql = `update users set sequence='${data.sequence}' where idKey='${data.idKey}'`;
    return db.save(sql);
}

exports.getUser = (idKey) => {
    return new Promise((resolve, reject) => {
        var sql = `select * from users where idKey = '${idKey}'`;
        db.load(sql).then(rows => {
            if (rows.length === 0) {
                resolve(null);
            } else {
                resolve(rows[0]);
            }
        }).catch(err => {
            reject(err);
        });
    });
}

exports.updateBandwidth = (data) => {
    const sql = `update users set bandwidth='${data.bandwidth}', bandwidthTime='${data.bandwidthTime}', 
                bandwidthLimit='${data.bandwidthLimit}', sequence='${data.sequence}'
                where idKey='${data.idKey}'`;
    return db.save(sql);
}

// getListUserss = (params) => {
//     var sql = `select * from users limit ${params.limit} offset ${params.offset}`;
//     return db.load(sql);
// }
// const pr = {
//     offset: 1,
//     limit: 5
// }
//  const test = () => {
//     getListUserss(pr).then(res => {
//         console.log(res);
//     })
//  }

//  test();