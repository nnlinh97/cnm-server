var db = require('../fn/db');

exports.getListPosts = () => {
    var sql = "select * from posts";
    return db.load(sql);
}
// exports.updateMetaData = (data) => {
//     console.log(data);
//     const sql = `update meta_data set metaData='${data}' where id='meta'`;
//     return db.save(sql);
// }

exports.insertPost = (post) => {
    const sql = `insert into posts(idKey, content, createAt)
                    values('${post.idKey}', '${post.content}', '${post.createAt}')`;
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
