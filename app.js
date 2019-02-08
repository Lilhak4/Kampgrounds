const dotenv = require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const app = express();
const Campground = require('./models/campground');
const Comment = require('./models/comment');
const User = require('./models/user');
// const seedDB = require('./seeds');

const indexRoute = require('./routes/index')
const campgroundRoute = require('./routes/campgrounds');
const reviewRoute = require("./routes/reviews")
const commentRoute = require('./routes/comments');

// newurlparser used because of deprecating url error, mongo version is greater than 3.1.1
// mongoose.connect('mongodb://localhost/kampgrounds', { useNewUrlParser: true });
mongoose.connect('mongodb://kahlil:Cervantes004@ds127015.mlab.com:27015/kampgrounds')
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
// flash needs to be before passport config or a bug will occur
app.locals.moment = require('moment');
app.use(flash());

// ------PASSPORT CONFIG------
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

// -----MIDDLEWARE-----
// this passes the these variables to all views and routes
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

// -----ROUTES-----
app.use('/', indexRoute);
app.use('/campgrounds', campgroundRoute);
app.use('/campgrounds/:id/comments', commentRoute);
app.use('/campgrounds/:id/reviews', reviewRoute);

// -----SERVER-----
// app.listen(3000, () => {
//   console.log("Kampgrounds Server Online");
// });

var port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("The Kampgrounds Server Has Started!");
});