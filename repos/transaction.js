
var db = require('../fn/db');




exports.insertTx = (tx) => {
    var sql = `insert into transactions(id, account, tx, createAt)
    values('${tx.id}', '${tx.account}', '${tx.tx}', '${tx.createAt}')`;
    return db.save(sql);
}



