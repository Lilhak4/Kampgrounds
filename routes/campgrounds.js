const express = require('express');
const router = express.Router();
const middleware = require('../middleware');
const NodeGeocoder = require('node-geocoder');
const Campground = require('../models/campground');

const options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};

const geocoder = NodeGeocoder(options);

router.get('/', (req, res) => {
  // GET ALL CAMPGROUNDS FROM DB
  Campground.find({}, (err, campgrounds) => {
    if (err) {
      console.log(err)
    } else {
      res.render('campgrounds/index', { campgrounds: campgrounds, currentUser: req.user });
    }
  });
});

router.post('/', middleware.isLoggedIn, (req, res) => {
  // get data from form and add to campgrounds array
  const name = req.body.name;
  const image = req.body.image;
  const price = req.body.price;
  const desc = req.body.description
  const author = {
    id: req.user._id,
    username: req.user.username
  }
  const newCampground = { name: name, image: image, price: price, description: desc, author: author }
  // CREATE A NEW CAMPGROUND AND SAVE TO DB
  Campground.create(newCampground, (err, newlyCreated) => {
    if (err) {
      console.log(err)
    } else {
      res.redirect("/campgrounds");
    }
  });
});

// CAMPGROUNDS NEW
router.get('/new', middleware.isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
})

// CAMPGROUNDS ID
router.get('/:id', (req, res) => {
  Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
    if (err) {
      console.log(err)
    } else {
      res.render('campgrounds/show', { campground: foundCampground });
    }
  });
});

router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res) => {
  // is user logged in?
  Campground.findById(req.params.id, (err, foundCampground) => {
    res.render('campgrounds/edit', { campground: foundCampground });
  });
});

// UPDATE CAMPGROUND
router.put('/:id', middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      res.redirect('/campgrounds/' + req.params.id);
    }
  });
});

// DESTROY CAMPGROUND
router.delete('/:id', middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      res.redirect('/campgrounds')
    } else {
      res.redirect('/campgrounds')
    }
  });
});

module.exports = router;