const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');


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
  const newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      // passport handles the specific message through err
      // req.flash('error', err.message);
      return res.render('register')
    }
    passport.authenticate("local")(req, res, () => {
      req.flash('success', 'Welcome to Kampgrounds! ' + user.username);
      res.redirect('/campgrounds');
    });
  });
});

// LOGIN FORM ROUTE
router.get('/login', (req, res) => {
  res.render('login');
});

// LOGIN LOGIC ROUTE
router.post("/login", passport.authenticate("local",
  {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
    failureFlash: true,
    successFlash: 'Welcome to Kampgrounds!'
  }), (req, res) => {
  });

// LOGOUT ROUT
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'Logged You Out')
  res.redirect('/campgrounds');
});

module.exports = router;