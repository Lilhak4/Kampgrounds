var express = require('express');
var app = express();

app.set("view engine", "ejs");

app.get('/', (req, res) => {
  res.render('landing')
});

app.get('/campgrounds', (req, res) => {
  var campgrounds = [
    { name: "Topeekeegee Lake", image: "https://images.unsplash.com/photo-1526491109672-74740652b963?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80" },
    { name: "Salmon Creek", image: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80" },
    { name: "Salt Dunes", image: "https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80" }
  ];
  res.render('campgrounds', { campgrounds: campgrounds });
});

app.listen(3000, () => {
  console.log("Yelp Camp Server Online");
});