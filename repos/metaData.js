var db = require('../fn/db');

exports.getMetaData = () => {
    var sql = "select * from meta_data";
    return db.load(sql);
}
exports.updateMetaData = (data) => {
    const sql = `update meta_data set metaData='${data}' where id='meta'`;
    return db.save(sql);
}