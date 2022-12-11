let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let passport = require('passport');
let userModel = require('../models/user');
let User = userModel.User;
let Store = require('../models/store');
let Product = require('../models/product');
let Review = require('../models/review');

//jwt
let jwt = require('jsonwebtoken');
let DB = require('../config/db');

/*Display Home Page*/
module.exports.displayHomePage = (req, res, next) => {
    res.render('index', { title: 'Home', displayName: req.user ? req.user.displayName : '' });
};
/*Display Login Page*/
module.exports.displayLoginPage = (req, res, next) => {
    if (!req.user) {
        res.render('auth/login', {
            title: "Login",
            messages: req.flash('loginMessage'),
            displayName: req.user ? req.user.displayName : ""
        });
    } else {
        return res.redirect('/');
    }
    console.log(req.flash('loginMessage'));
};
/* Process the login */
module.exports.processLoginPage = (req, res, next) => {
    passport.authenticate('local',
        (err, user, info) => {
            //server err?
            if (err) {
                return next(err);
            }
            //user login error
            if (!user) {
                req.flash('loginMessage', 'Wrong username or password !');
                return res.redirect('/login',);
            }
            req.login(user, (err) => {
                if (err) {
                    return next(err);
                }
                const payload =
                {
                    id: user._id,
                    displayName: user.displayName,
                    username: user.username,
                    email: user.email
                };
                const authToken = jwt.sign(payload, DB.Secret, {
                    expiresIn: 604800 // 1 week
                });
                /*
                res.json({success: true, msg: 'User logged in Successfully', user: {
                    id: user._id,
                    displayName: user.displayName,
                    username: user.username,
                    email: user.email
                }, token: authToken})
                */
                return res.redirect('/store-list');

            });
        })(req, res, next);
};

/* Display Register Page*/
module.exports.displayRegisterPage = (req, res, next) => {
    if (!req.user) {
        res.render('auth/signup', {
            title: "Register",
            messages: req.flash('registerMessage'),
            displayName: req.user ? req.user.displayName : ""
        });
    } else {
        return res.redirect('auth/login');
    }
};
/* Process the register */
module.exports.processRegisterPage = (req, res, next) => {
    // instantiate a user object
    let newUser = new User({
        'username': req.body.username.trim(),
        'password': req.body.password.trim(),
        'email': req.body.email.trim(),
        'displayName': req.body.displayName.trim()
    });

    User.register(newUser, req.body.password, (err) => {
        if (err) {
            console.log("Error: Inserting New User");
            if (err.name == "UserExistsError") {
                req.flash(
                    'registerMessage',
                    `Registration Error: ${newUser.username} Already Exists!`
                );
            }
            return res.render('auth/signup',
                {
                    title: 'Register',
                    messages: req.flash('registerMessage'),
                    displayName: req.user ? req.user.displayName : ""
                });
        }
        else {   /*
            res.json({success: true, msg:'user successfully registered'})
            */
            return passport.authenticate('local')(req, res, () => {
                res.redirect('/');
            });
        }
    });
};
/* Perform the logout */
module.exports.performLogout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
};
/* Display the statistic */
module.exports.displayStatistic = (req, res, next) => {
    let userId = req.user._id;
    Store.find({ "ownerId": userId }, (err, store) => {
        if (err) {
            console.log(err);
            res.end(err);
        }
        else {
            var storeIdArr = [];
            var numberOfProducts = 0;
            var numberOfReviews = 0;
            var totalRate = 0;
            var numberOfStores = store.length;
            store.forEach(e => {
                storeIdArr.push(e._id);
            });
            console.log(storeIdArr[0]);
            Review.find({ "storeId": { $in: storeIdArr } }, (err, review) => {
                if (err) {
                    console.log(err);
                    res.end(err);
                }
                else {
                    numberOfReviews = review.length;
                    review.forEach(e => {
                        totalRate = totalRate + e.rate;
                    });
                    Product.find({ "storeId": { $in: storeIdArr } }, (err, product) => {
                        if (err) {
                            console.log(err);
                            res.end(err);
                        }
                        else {
                            numberOfProducts = product.length;
                            res.render('statistic', {
                                title: "Statistic",
                                displayName: req.user ? req.user.displayName : "",
                                numberOfStores: numberOfStores,
                                numberOfReviews: numberOfReviews,
                                numberOfProducts: numberOfProducts,
                                averageRate: numberOfReviews !== 0 ? Math.round(totalRate / numberOfReviews) : 0
                            });
                        }
                    });
                }
            });
        }
    });
};