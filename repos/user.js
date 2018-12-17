
var db = require('../fn/db');

exports.getListUsers = () => {
    var sql = "select * from users";
    return db.load(sql);
}

exports.insertUser = (user) => {
    var sql = `insert into users(idKey, balance, sequence, bandwidth, avatar, bandwidthTime, bandwidthLimit)
    values('${user.idKey}', '${user.balance}', '${user.sequence}', '${user.bandwidth}', 'null', '${user.bandwidthTime}', '${user.bandwidthLimit}')`;
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