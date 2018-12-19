var db = require('../fn/db');

exports.getListAccounts = () => {
    var sql = "select * from account";
    return db.load(sql);
}

exports.getAccount = (idKey) => {
    var sql = `select * from account where idKey='${idKey}'`;
    return db.load(sql);
}

exports.getAccountV1 = (idKey) => {
    return new Promise((resolve, reject) => {
        var sql = `select * from account where idKey = '${idKey}'`;
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

exports.insertAccount = (account) => {
    const sql = `insert into account(idKey, displayName, avatar)
                    values('${account.idKey}', '${account.displayName}', '${account.avatar}')`;
    return db.save(sql);
}

exports.updateName = (account) => {
    const sql = `update account set displayName='${account.displayName}' where idKey='${account.idKey}'`;
    return db.save(sql);
}

exports.updateAvatar = (account) => {
    const sql = `update account set avatar='${account.avatar}' where idKey='${account.idKey}'`;
    return db.save(sql);
}


