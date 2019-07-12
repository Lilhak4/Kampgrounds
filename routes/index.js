const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const Campground = require('../models/campground');


// HOME ROUTE
router.get('/', (req, res) => {
  res.render('landing', { user: req.body.user });
});

// SIGNUP FORM ROUTE
router.get('/register', (req, res) => {
  res.render('register', { page: 'register' });
});

// SIGNUP LOGIC ROUTE
router.post('/register', (req, res) => {
  // Passport method
  const newUser = new User({
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    avatar: req.body.avatar
  });
  if (req.body.adminCode === 'heymonkey') {
    newUser.isAdmin = true;
  }
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      // passport handles the specific message through err
      return res.render('register', { error: err.message })
    }
    passport.authenticate("local")(req, res, () => {
      req.flash('success', 'Welcome to Kampgrounds! ' + user.username);
      res.redirect('/campgrounds');
    });
  });
});

// LOGIN FORM ROUTE
router.get('/login', (req, res) => {
  res.render('login', { page: 'login' });
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

// LOGOUT ROUTE
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'Logged You Out')
  res.redirect('/campgrounds');
});

// USERS PROFILE
router.get('/users/:id', (req, res) => {
  User.findById(req.params.id, (err, foundUser) => {
    if (err) {
      req.flash('error', err.message);
      res.redirect('back');
    }
    Campground.find().where('author.id').equals(foundUser._id).exec((err, campgrounds) => {
      if (err) {
        req.flash('error', err.message);
        res.redirect('back');
      }
      res.render('users/show', { user: foundUser, campgrounds: campgrounds });
    });
  });
});

module.exports = router;
