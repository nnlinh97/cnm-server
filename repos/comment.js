var db = require('../fn/db');




exports.insertComment = (params) => {
    const sql = `insert into comments(hash, account, text, createAt)
                    values('${params.hash}', '${params.account}', '${params.text}', '${params.createAt}')`;
    return db.save(sql);
}


// exports.getComment = (params) => {
//     return new Promise((resolve, reject) => {
//         var sql = `select * from comments where hash='${params.hash}' and account='${params.account}'`;
//         db.load(sql).then(rows => {
//             if (rows.length === 0) {
//                 resolve(null);
//             } else {
//                 resolve(rows[0]);
//             }
//         }).catch(err => {
//             reject(err);
//         });
//     });
// }