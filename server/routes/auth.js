var express = require('express');
var router = express.Router();


//Create a reference to the user model
let User = require('../models/user');

/* GET login page. */
router.get('/login', function (req, res, next) {
    res.render('auth/login', { title: 'Login', error: "" });
});

/* POST auth process. */
router.post('/login', (req, res, next) => {

    // return error msg in this way 
    //return res.redirect('/auth/login?error=' + info.message);

});


/* GET sign up page. */
router.get('/signup', function (req, res, next) {
    res.render('auth/signup', { title: 'Sign up' });
});

/* POST sign up page. */
router.get('/signup', function (req, res, next) {
    
});

module.exports = router;