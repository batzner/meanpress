var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
  title: String,
  body: String
});

mongoose.model('Post', PostSchema);
