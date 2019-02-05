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
router.get("/new", middleware.isLoggedIn, middleware.checkReviewExistence, function (req, res) {
  // middleware.checkReviewExistence checks if a user already reviewed the campground, only one review per user is allowed
  Campground.findById(req.params.id, function (err, campground) {
    if (err) {
      req.flash("error", err.message);
      return res.redirect("back");
    }
    res.render("reviews/new", { campground: campground });

  });
});