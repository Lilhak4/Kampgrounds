const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const app = express();
const Campground = require('./models/campground');
const Comment = require('./models/comment');
const User = require('./models/user');
const seedDB = require('./seeds');

// newurlparser used because of deprecating url error, mongo version is greater than 3.1.1
mongoose.connect('mongodb://localhost/yelp-camp', { useNewUrlParser: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();

// PASSPORT CONFIG
app.use(require('express-session')({
  secret: 'My name backwards in lilhak',
  resave: false,
  saveuninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
// method from passport
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

app.get('/', (req, res) => {
  res.render('landing')
});

app.get('/campgrounds', (req, res) => {
  // GET ALL CAMPGROUNDS FROM DB
  Campground.find({}, (err, campgrounds) => {
    if (err) {
      console.log(err)
    } else {
      res.render('campgrounds/index', { campgrounds: campgrounds });
    }
  });
});

app.post('/campgrounds', (req, res) => {
  // get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description
  var newCampground = { name: name, image: image, description: desc }
  // CREATE A NEW CAMPGROUND AND SAVE TO DB
  Campground.create(newCampground, (err, newlyCreated) => {
    if (err) {
      console.log(err)
    } else {
      res.redirect("/campgrounds");
    }
  });
});

app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new');
})

app.get('/campgrounds/:id', (req, res) => {
  Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
    if (err) {
      console.log(err)
    } else {
      res.render('campgrounds/show', { campground: foundCampground });
    }
  });
});

app.get('/campgrounds/:id/comments/new', isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', { campground: campground });
    }
  });
});

app.post('/campgrounds/:id/comments', (req, res) => {
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
          campground.comments.push(comment);
          campground.save(campground);
          res.redirect('/campgrounds/' + campground._id)
        }
      })
    }
  });
  // create new comment
  // connect new comment to campground
  // redirect back to cg show page
});

// AUTH ROUTES
app.get('/register', (req, res) => {
  res.render('register')
});

app.post('/register', (req, res) => {
  // Passport method
  var newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      return res.render('register')
    }
    passport.authenticate("local")(req, res, () => {
      res.redirect('/campgrounds');
    });
  });
});

// Login
app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', passport.authenticate("local",
  {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
  }), (req, res) => {
    res.send('logic logic logic')
  });

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/campgrounds');
});

// Server
app.listen(3000, () => {
  console.log("Yelp Camp Server Online");
});