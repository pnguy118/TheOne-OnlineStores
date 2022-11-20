let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let passport = require('passport');
let userModel = require('../models/user');
let User = userModel.User;

//jwt
let jwt = require('jsonwebtoken');
let DB = require('../config/db');


module.exports.displayLoginPage = (req, res, next) => {
    if(!req.user){
        res.render('auth/login',{
            title: "Login",
            messages: req.flash('loginMessage'),
            displayName : req.user ? req.user.displayName:""
        })
    }else{
        return res.redirect('/');
    }
};

module.exports.processLoginPage = (req, res, next) => {
    passport.authenticate('local',
    (err,user,info) => {
        //server err?
        if (err){
            return next(err);
        }
        //user login error
        if (!user){
            req.flash('loginMessage', 'Authorization Error');
            return res.redirect('/login', );
        }
        req.login(user,(err) =>{
            if(err){
                return next(err);
            }
            const payload =
            {
                id: user._id,
                displayName: user.displayName,
                username: user.username,
                email: user.email
            }
            const authToken = jwt.sign(payload, DB.Secret,{
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
    })(req, res, next);}


module.exports.displayRegisterPage = (req, res, next) => {
    if(!req.user){
        res.render('auth/signup',{
            title: "Register",
            messages:req.flash('registerMessage'),
            displayName:req.user ? req.user.displayName :""
        })
    }else{
        return res.redirect('auth/login');
    }
};

module.exports.processRegisterPage = (req, res, next) => {
    // instantiate a user object
    let newUser = new User({
        'username': req.body.username,
        'password': req.body.password,
        'email': req.body.email,
        'displayName': req.body.displayName
    });

    User.register(newUser, req.body.password, (err) => {
        if(err)
        {
            console.log("Error: Inserting New User");
            if(err.name == "UserExistsError")
            {
                req.flash(
                    'registerMessage',
                    'Registration Error: User Already Exists!'
                );
                console.log('Error: User Already Exists!')
            }
            return res.render('auth/signup',
            {
                title: 'Register',
                messages: req.flash('registerMessage'),
                displayName: req.user ? req.user.displayName : ""
            });
        }
        else
        {   /*
            res.json({success: true, msg:'user successfully registered'})
            */
            return passport.authenticate('local')(req, res, () => {
                res.redirect('/')
            });
        }
    });
}
module.exports.performLogout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};