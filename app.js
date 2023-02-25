var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var indexRouter = require('./app_server/routes/index');
var UserRouter = require('./app_server/routes/user.js');
const dotenv = require('dotenv').config();

var app = express();

var session = require('express-session');
var FileStore = require('session-file-store')(session);

const url = process.env.MONGO_URI;

mongoose.connect(url, function (err) {
  if (err) throw err;
  else console.log('Connection Successful');
});

// view engine setup
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    name: 'session-id',
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
    store: new FileStore(),
  })
);
app.use('/', indexRouter);
app.use('/users', UserRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
