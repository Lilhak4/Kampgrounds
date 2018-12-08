var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var campgrounds = [
  { name: "Topeekeegee Lake", image: "https://images.unsplash.com/photo-1526491109672-74740652b963?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80" },
  { name: "Salmon Creek", image: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80" },
  { name: "Salt Dunes", image: "https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80" }
];
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get('/', (req, res) => {
  res.render('landing')
});

app.get('/campgrounds', (req, res) => {
  res.render('campgrounds', { campgrounds: campgrounds });
});

app.post('/campgrounds', (req, res) => {
  // get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var newCampground = { name: name, image: image }
  campgrounds.push(newCampground)
  // redirect back to campgrounds route
  res.redirect('/campgrounds');
});

app.get('/campgrounds/new', (req, res) => {
  res.render('new');
})

app.listen(3000, () => {
  console.log("Yelp Camp Server Online");
});