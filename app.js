const createError = require('http-errors');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
var cors = require('cors');
// const db = require('./config/dbConfig');
const startWS = require('./sockets/index');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const followRouter = require('./routes/follow');
const postRouter = require('./routes/post');
const accountRouter = require('./routes/account');
const txRouter = require('./routes/tx');
const reactRouter = require('./routes/reaction');
const commentRouter = require('./routes/comment');

const app = express();
// db.sequelize.sync();

startWS();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({
  credentials: true,
  origin: 'http://localhost:3000',
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH', 'OPTION'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/follow', followRouter);
app.use('/post', postRouter);
app.use('/account', accountRouter);
app.use('/transactions', txRouter);
app.use('/reactions', reactRouter);
app.use('/comments', commentRouter);

const server_port = process.env.PORT || 4200;

const server = app.listen(server_port, function () {
  console.log(`App listening at port ${server_port}`)
});

module.exports = server;
