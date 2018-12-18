const mongoose = require('mongoose');
const campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
});
// MAKING RELATION BETWEEN SCHEMA AND MODEL
module.exports = mongoose.model("Campground", campgroundSchema);