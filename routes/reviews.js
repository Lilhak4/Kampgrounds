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
