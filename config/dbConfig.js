const dbConfig = require('../setting').databaseConfig;
const Sequelize = require('sequelize');
const sequelize = new Sequelize(dbConfig);

let db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require('../models/user')(sequelize, Sequelize);
module.exports = db;