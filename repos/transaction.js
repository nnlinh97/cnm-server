
var db = require('../fn/db');




exports.insertTx = (tx) => {
    var sql = `insert into transactions(id, account, tx, createAt, height, address)
    values('${tx.id}', '${tx.account}', '${tx.tx}', '${tx.createAt}', '${tx.height}', '${tx.address}')`;
    return db.save(sql);
}

exports.getListTxs = (idKey) => {
    var sql = `select * from transactions where account='${idKey}' or address='${idKey}'`;
    return db.load(sql);
}
