const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user')

// HOME ROUTE
router.get('/', (req, res) => {
  res.render('landing')
});

// SIGNUP FORM ROUTE
router.get('/register', (req, res) => {
  res.render('register')
});

// SIGNUP LOGIC ROUTE
router.post('/register', (req, res) => {
  // Passport method
  var newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      return res.render('register')
    }
    passport.authenticate("local")(req, res, () => {
      res.redirect('/campgrounds');
    });
  });
});

// LOGIN FORM ROUTE
router.get('/login', (req, res) => {
  res.render('login');
});

// LOGIN LOGIC ROUTE
router.post('/login', passport.authenticate("local",
  {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
  }), (req, res) => {
    res.send('logic logic logic')
  });

// LOGOUT ROUT
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/campgrounds');
});

// MIDDLEWARE
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;