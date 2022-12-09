var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let jwt = require('jsonwebtoken');
var app = express();
let cors = require('cors');
var indexRouter = require('../routes/index');
var usersRouter = require('../routes/users');
var storesRouter = require('../routes/store');
var contactRouter = require('../routes/contact');
var aboutRouter = require('../routes/about');

//create usermodel instance
let userModel = require("../models/user");
let User = userModel.User;

//database_setup
let mongoose = require("mongoose");
let DB = require("./db.js");

//modules for authentication
let session = require("express-session");
let passport = require("passport");
let passportLocal = require("passport-local");
let localStratergy = passportLocal.Strategy;
let flash = require("connect-flash");
let passportJWT = require('passport-jwt');

let JWTStategy = passportJWT.Strategy;
let ExtractJwt = passportJWT.ExtractJwt;
//setup express session
app.use(
  session({
    secret: "SomeSecret",
    saveUninitialized: false,
    resave: false,
  })
);

//initialize flash
app.use(flash());

//intialize passport
app.use(passport.initialize());
app.use(passport.session());

//implement a user authenticaion Strategy
passport.use(User.createStrategy());

//serialize and deserialize user object info -encrypt and decrypt
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//point mongoose to the DB URI
mongoose.connect(process.env.URI || DB.URL, { useNewUrlParser: true, useUnifiedTopology: true });
let mongodb = mongoose.connection;
mongodb.on("error", console.error.bind(console, "connection error:"));
mongodb.once("open", () => {
  console.log("Database Connected");
});

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../../public')));
app.use(express.static(path.join(__dirname, '../../node_modules/jquery/dist/')));
app.use(express.static(path.join(__dirname, '../../node_modules/bootstrap/dist/')));

let jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = DB.Secret;

let strategy = new JWTStategy(jwtOptions,(jwt_payload,done) => {
  User.findById(jwt_payload.id)
  .then(user => {
    return done(null,user);
  })
  .catch(err =>{
    return done(err,false);
  });
  });

  passport.use(strategy);

//Set up the router
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/store-list',storesRouter);
app.use('/contact',contactRouter);
app.use('/about',aboutRouter);

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
