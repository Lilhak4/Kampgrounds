const express = require("express");
const router = express.Router({ mergeParams: true });
const Campground = require("../models/campground");
const Review = require("../models/review");
const middleware = require("../middleware");

// Reviews Index
router.get("/", (req, res) => {
  Campground.findById(req.params.id).populate({
    path: "reviews",
    // sorting the populated reviews array to show the latest first
    options: { sort: { createdAt: -1 } }
  }).exec((err, campground) => {
    if (err || !campground) {
      req.flash("error", err.message);
      return res.redirect("back");
    }
    res.render("reviews/index", { campground: campground });
  });
});

// Reviews New
router.get("/new", middleware.isLoggedIn, middleware.checkReviewExistence, (req, res) => {
  // middleware.checkReviewExistence checks if a user already reviewed the campground, only one review per user is allowed
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      req.flash("error", err.message);
      return res.redirect("back");
    }
    res.render("reviews/new", { campground: campground });

  });
});

// Reviews Create
router.post("/", middleware.isLoggedIn, middleware.checkReviewExistence, (req, res) => {
  //lookup campground using ID
  Campground.findById(req.params.id).populate("reviews").exec(err, campground) => {
    if (err) {
      req.flash("error", err.message);
      return res.redirect("back");
    }
    Review.create(req.body.review, (err, review) => {
      if (err) {
        req.flash("error", err.message);
        return res.redirect("back");
      }
      //add author username/id and associated campground to the review
      review.author.id = req.user._id;
      review.author.username = req.user.username;
      review.campground = campground;
      //save review
      review.save();
      campground.reviews.push(review);
      // calculate the new average review for the campground
      campground.rating = calculateAverage(campground.reviews);
      //save campground
      campground.save();
      req.flash("success", "Your review has been successfully added.");
      res.redirect('/campgrounds/' + campground._id);
    });
  });
});