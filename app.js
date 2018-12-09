var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();

// newurlparser used because of deprecating url error, mongo version is greater than 3.1.1
mongoose.connect('mongodb://localhost/yelp-camp', { useNewUrlParser: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});
// MAKING RELATION BETWEEN SCHEMA AND MODEL
var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create({
//   name: "Salmon Creek",
//   image: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
//   description: "A discrete camping area that is close to a fishing creek"
// }, (err, campground) => {
//   if (err) {
//     console.log(err)
//   } else {
//     console.log('NEWLY CREATED CAMPGROUND');
//   }
// });

app.get('/', (req, res) => {
  res.render('landing')
});

app.get('/campgrounds', (req, res) => {
  // GET ALL CAMPGROUNDS FROM DB
  Campground.find({}, (err, campgrounds) => {
    if (err) {
      console.log(err)
    } else {
      res.render('index', { campgrounds: campgrounds });
    }
  });
});

app.post('/campgrounds', (req, res) => {
  // get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var newCampground = { name: name, image: image }
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
  res.render('new');
})

app.get('/campgrounds/:id', (req, res) => {
  res.render('show');
});

app.listen(3000, () => {
  console.log("Yelp Camp Server Online");
});