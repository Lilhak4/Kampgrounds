var mongoose = require('mongoose');
var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});
// MAKING RELATION BETWEEN SCHEMA AND MODEL
module.exports = mongoose.model("Campground", campgroundSchema);