const express = require('express');
const router = express.Router();
const Campground = require('../models/campground')

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

router.post('/', isLoggedIn, (req, res) => {
  // get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description
  var author = {
    id: req.user._id,
    username: req.user.username
  }
  var newCampground = { name: name, image: image, description: desc, author: author }
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
router.get('/new', isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
})

// CAMPGROUNDS ID
router.get('/:id', (req, res) => {
  Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
    if (err) {
      console.log(err)
    } else {
      res.render('campgrounds/show', { campground: foundCampground });
    }
  });
});

// EDIT CAMPGROUND
// router.get('/:id/edit', (req, res) => {
//   Campground.findById(req.params.id, (err, foundCampground) => {
//     if (err) {
//       console.log(err)
//       res.redirect('/campgrounds')
//     } else {
//       res.render('campgrounds/edit', { campground: foundCampground });
//     }
//   });
// });

router.get('/:id/edit', (req, res) => {
  // is user logged in?
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, (err, foundCampground) => {
      if (err) {
        console.log(err)
        res.redirect('/campgrounds')
      } else {
        // does user own campground?
        // method of mongoose that returns useable id 
        if (foundCampground.author.id.equals(req.user._id)) {
          res.render('campgrounds/edit', { campground: foundCampground });
        } else {
          res.send('YOU DO NOT HAVE PERMISSION TO DO THAT');
        }
      }
    });
  } else {
    console.log('YOU NEED TO BE LOGGED IN TO DO THAT');
    res.send('YOU NEED TO BE LOGGED IN TO DO THAT');
  }
  // if not, redirect
});

// UPDATE CAMPGROUND
router.put('/:id', (req, res) => {
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
router.delete('/:id', (req, res) => {
  Campground.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      res.redirect('/campgrounds')
    } else {
      res.redirect('/campgrounds')
    }
  });
});

// MIDDLEWARE
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;