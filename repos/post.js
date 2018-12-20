var db = require('../fn/db');

exports.getListPosts = (idKey) => {
    var sql = `select * from posts where idKey='${idKey}'`;
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


exports.insertPost = (post) => {
    const sql = `insert into posts(id, idKey, content, createAt)
                    values('${post.id}', '${post.idKey}', '${post.content}', '${post.createAt}')`;
    return db.save(sql);
}


