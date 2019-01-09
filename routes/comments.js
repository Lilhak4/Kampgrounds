const express = require('express');
const router = express.Router({ mergeParams: true });
const Campground = require('../models/campground')
const Comment = require('../models/comment')

// COMMENTS NEW
router.get('/new', isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', { campground: campground });
    }
  });
});

// COMMENTS POST
router.post('/', isLoggedIn, (req, res) => {
  // lookup cg by id
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
      res.redirect('/campgrounds')
    } else {
      // we can pass in comment because in the form we nested text and name within comment comment[text], and comment[author]
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          console.log(err)
        } else {
          // comment.author.id is following the model we created
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          // save comment
          comment.save();
          campground.comments.push(comment);
          campground.save(campground);
          res.redirect('/campgrounds/' + campground._id)
        }
      })
    }
  });
});

router.get('/:comments_id/edit', (req, res) => {
  res.send('edit comments');
});

// MIDDLEWARE
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;