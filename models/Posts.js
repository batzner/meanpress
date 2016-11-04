var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
  title: String,
  preview: String,
  body: String,
  createdAt: Date,
  published: Boolean,
  slug: String,
  metaDescription: String,
  focusKeyword: String,
  deleted: Boolean
});

mongoose.model('Post', PostSchema);
