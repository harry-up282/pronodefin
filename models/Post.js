// models/post.js

// const mongoose = require('mongoose');

// const postSchema = new mongoose.Schema({
//   title: String,
//   content: String,
//   // other fields...
// }, { timestamps: true });

// module.exports = mongoose.model('Post', postSchema);
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  // Add other fields as needed
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;