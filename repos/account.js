var db = require('../fn/db');

exports.getListPosts = () => {
    var sql = "select * from posts";
    return db.load(sql);
}

exports.getAccount = (idKey) => {
    var sql = `select * from account where idKey='${idKey}'`;
    return db.load(sql);
}

exports.insertAccount = (account) => {
    const sql = `insert into account(idKey, displayName, avatar)
                    values('${account.idKey}', '${account.displayName}', '${account.avatar}')`;
    return db.save(sql);
}

exports.updateName = (account) => {
    // console.log(data);
    const sql = `update account set displayName='${account.displayName}' where idKey='${account.idKey}'`;
    return db.save(sql);
}

exports.updateAvatar = (account) => {
    // console.log(data);
    const sql = `update account set avatar='${account.avatar}' where idKey='${account.idKey}'`;
    return db.save(sql);
}
// getListPosts = () => {
//     var sql = "select * from posts";
//     return db.load(sql);
// }

// const test = () => {
//     getListPosts().then((res) => {
//         console.log(res);
//         res.forEach(item => {
//             console.log(item.content);
//             console.log('========');
//         });
//     })
// }
// test();
