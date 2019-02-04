const express = require('express');
const router = express.Router();
const middleware = require('../middleware');
const NodeGeocoder = require('node-geocoder');
const Campground = require('../models/campground');
const multer = require('multer');
// multer enable
const storage = multer.diskStorage({
  filename: (req, file, callback) => {
    callback(null, Date.now() + file.originalname);
  }
});
const imageFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};
const upload = multer({ storage: storage, fileFilter: imageFilter })
// cloudinary enable
const cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: 'ddgwilv7v',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
// maps enable
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
      res.render('campgrounds/index', { campgrounds: campgrounds, currentUser: req.user, page: 'campgrounds' });
    }
  });
});

//CAMPGROUNDS CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, upload.single('image'), (req, res) => {
  cloudinary.v2.uploader.upload(req.file.path, (err, result) => {
    if (err) {
      req.flash('error', err.message);
      return res.redirect('back');
    }
    // Cloudinary add on to filter explicit images
    // cloudinary.v2.uploader.upload("local_file.jpg",
    //   { moderation: "webpurify" }),
    //   (error, result) => { console.log(result); };
    geocoder.geocode(req.body.location, (err, data) => {
      if (err || !data.length) {
        req.flash('error', 'Invalid address');
        return res.redirect('back');
      }
      req.body.campground.lat = data[0].latitude;
      req.body.campground.lng = data[0].longitude;
      req.body.campground.location = data[0].formattedAddress;

      // add cloudinary url for the image to the campground object under image property
      req.body.campground.image = result.secure_url;
      req.body.campground.imageId = result.public_id;
      // add author to campground
      req.body.campground.author = {
        id: req.user._id,
        username: req.user.username
      }
      Campground.create(req.body.campground, (err, campground) => {
        if (err) {
          console.log(err)
          req.flash('error', err.message);
          return res.redirect('back');
        }
        res.redirect('/campgrounds/' + campground.id);
      });
    });
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
router.put("/:id", middleware.checkCampgroundOwnership, upload.single('image'), (req, res) => {
  geocoder.geocode(req.body.location, (err, data) => {
    if (err || !data.length) {
      console.log(err);
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    req.body.campground.lat = data[0].latitude;
    req.body.campground.lng = data[0].longitude;
    req.body.campground.location = data[0].formattedAddress;

    Campground.findByIdAndUpdate(req.params.id, req.body.campground, async (err, campground) => {
      if (err) {
        req.flash("error", err.message);
        res.redirect("back");
      } else {
        if (req.file) {
          try {
            await cloudinary.v2.uploader.destroy(campground.imageId);
            let result = await cloudinary.v2.uploader.upload(req.file.path);
            campground.image = result.secure_url;
            campground.imageId = result.public_id;
          } catch (err) {
            req.flash("error", err.message);
            res.redirect("back");
          }
        }
        campground.name = req.body.campground.name ? req.body.campground.name : campground.name;
        campground.description = req.body.campground.description ? req.body.campground.description : campground.name;
        campground.save();
        req.flash("success", "Successfully Updated!");
        res.redirect("/campgrounds/" + campground._id);
      }
    });
  });
});

// DESTROY CAMPGROUND
router.delete('/:id', middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndRemove(req.params.id, async (err) => {
    try {
      await cloudinary.v2.uploader.destroy(campground.imageId);
      req.flash("success", "Campground was successfully deleted");
      res.redirect('/campgrounds');
    }
    catch (err) {
      if (err) {
        req.flash("error", "Campground was not deleted");
        res.redirect('/campgrounds');
      }
    }
  });
});

module.exports = router;