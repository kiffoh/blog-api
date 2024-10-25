var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('passport');
const cors = require('cors');

require('./config/passport');
require('./config/passportJWT'); // This requires and initializes the JWT Strategy

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const postRouter = require('./routes/posts');

const dotenv = require('dotenv')

const envFilePath = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : `.env`;

dotenv.config({path: path.resolve(process.cwd(), envFilePath)})

console.log(`Environment file loaded is: `, process.env.NODE_ENV)
console.log("Database URL: ", process.env.DATABASE_URL)
console.log("API URL: ", process.env.API_URL)

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({ origin: process.env.API_URL }));
app.options('*', cors());

app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', postRouter);

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
