const createError = require('http-errors');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const db = require('./config/dbConfig');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();
db.sequelize.sync();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', indexRouter);
app.use('/users', usersRouter);

const server_port = process.env.PORT || process.env.PORT || 4200;
const server_host = process.env.HOST || '0.0.0.0';

const server = app.listen(server_port, server_host, function () {
  console.log(`App listening at port ${server_port}`)
});

module.exports = server;
