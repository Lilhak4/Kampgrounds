const Campground = require('../models/campground')
const Comment = require('../models/comment')
const middlewareObj = {};

middlewareObj.checkCampgroundOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, (err, foundCampground) => {
      if (err) {
        console.log(err)
        res.redirect('/campgrounds')
      } else {
        // does user own campground?
        // method of mongoose that returns useable id 
        if (foundCampground.author.id.equals(req.user._id)) {
          next();
        } else {
          res.send('YOU DO NOT HAVE PERMISSION TO DO THAT');
        }
      }
    });
  } else {
    res.redirect('back');
  }
}

middlewareObj.checkCommentOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err) {
        console.log(err)
        res.redirect('/campgrounds')
      } else {
        // does user own comment?
        // method of mongoose that returns useable id 
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          res.send('YOU DO NOT HAVE PERMISSION TO DO THAT');
        }
      }
    });
  } else {
    res.redirect('back');
  }
}

middlewareObj.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.export = middlewareObj