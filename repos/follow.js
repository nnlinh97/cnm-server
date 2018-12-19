var db = require('../fn/db');

exports.getListPosts = () => {
    var sql = "select * from posts";
    return db.load(sql);
}

//danh sach ma KEY dang follow
exports.getListFollower = (key) => {
    const sql = `select follower from follows where following='${key}'`;
    return db.load(sql);
}

//danh sach ma dang follow KEY
exports.getListFollowings = (key) => {
    const sql = `select following from follows where follower='${key}'`;
    return db.load(sql);
}

exports.insertFollow = (data) => {
    const sql = `insert into follows(id, following, follower)
                    values('${data.id}', '${data.following}', '${data.follower}')`;
    return db.save(sql);
}

exports.deleteFollow = (data) => {
    const sql = `delete from follows where id='${data.id}'`;
    return db.save(sql);
}
