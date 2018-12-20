const createError = require('http-errors');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
// const db = require('./config/dbConfig');
const startWS = require('./sockets/index');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const followRouter = require('./routes/follow');
const postRouter = require('./routes/post');
const accountRouter = require('./routes/account');
const txRouter = require('./routes/tx');

const app = express();
var cors = require('cors');
// db.sequelize.sync();

startWS();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({
  'allowedHeaders': ['sessionId', 'Content-Type'],
  'exposedHeaders': ['sessionId'],
  'origin': '*',
  'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
  'preflightContinue': false
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/follow', followRouter);
app.use('/post', postRouter);
app.use('/account', accountRouter);
app.use('/transactions', txRouter);

const server_port = process.env.PORT || 4200;

const server = app.listen(server_port, function () {
  console.log(`App listening at port ${server_port}`)
});

module.exports = server;
