
var db = require('../fn/db');




exports.insertTx = (tx) => {
    
    var sql = `insert into transactions(hash, account, tx, createAt, height, address,
                                        operation, content, followed, amount, keyUpdate, displayName, picture)
    values('${tx.hash}', '${tx.account}', '${tx.tx}', '${tx.createAt}', '${tx.height}', '${tx.address}',
            '${tx.operation}', '${tx.content}', '${tx.followed}', '${tx.amount}', '${tx.key}', '${tx.displayName}', '${tx.picture}')`;
            // console.log(sql);
    return db.save(sql);
}

// exports.insertTxCreateAccount = (tx) => {
//     var sql = `insert into transactions(hash, account, tx, createAt, height, address, operation)
//     values('${tx.hash}', '${tx.account}', '${tx.tx}', '${tx.createAt}', '${tx.height}', '${tx.address}, '${tx.operation}')`;
//     return db.save(sql);
// }

// exports.insertTxPayment = (tx) => {
//     var sql = `insert into transactions(hash, account, tx, createAt, height, address, amount, operation)
//     values('${tx.hash}', '${tx.account}', '${tx.tx}', '${tx.createAt}', '${tx.height}', '${tx.address}', '${tx.amount}', '${tx.operation}')`;
//     return db.save(sql);
// }

exports.getListTxs = (idKey) => {
    var sql = `select * from transactions where account='${idKey}' or address='${idKey}' order by createAt DESC`;
    return db.load(sql);
}
