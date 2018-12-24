
var db = require('../fn/db');




exports.insertTx = (tx) => {
    var sql = `insert into transactions(hash, account, tx, createAt, height, address)
    values('${tx.hash}', '${tx.account}', '${tx.tx}', '${tx.createAt}', '${tx.height}', '${tx.address}')`;
    return db.save(sql);
}

exports.getListTxs = (idKey) => {
    var sql = `select * from transactions where account='${idKey}' or address='${idKey}' order by createAt DESC`;
    return db.load(sql);
}
