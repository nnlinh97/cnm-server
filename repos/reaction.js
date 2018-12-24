var db = require('../fn/db');

exports.getListPosts = (idKey) => {
    var sql = `select * from posts where idKey='${idKey}' order by createAt DESC`;
    return db.load(sql);
}

exports.getPost = (idPost) => {
    return new Promise((resolve, reject) => {
        var sql = `select * from posts where id = '${idPost}'`;
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


exports.updateReaction = (params) => {
    const sql = `update reactions set type='${params.type}' where hash='${params.hash}' and account='${params.account}'`;
    return db.save(sql);
}

exports.insertReaction = (params) => {
    const sql = `insert into reactions(hash, account, type)
                    values('${params.hash}', '${params.account}', '${params.type}')`;
    return db.save(sql);
}


exports.getReaction = (params) => {
    return new Promise((resolve, reject) => {
        var sql = `select * from reactions where hash='${params.hash}' and account='${params.account}'`;
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