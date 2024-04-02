const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose')
const {config} = require('dotenv')
const expressLayouts = require('express-ejs-layouts')

// Allows us to acces variables from .env
config()

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const catalogRouter = require("./routes/catalog");

const app = express();

const uri = process.env.MONGODB_PATH;
mongoose.connect(uri, { dbName: 'local_library' });
mongoose.set('strictQuery', false);

const connection = mongoose.connection;

connection.once('open', () => {
  console.log('MongoDB database connection established sauccessfully');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts)
app.set('layout', './parts/layout')
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catalog', catalogRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
