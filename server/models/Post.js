const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const PostSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  img: {
    type: String,
    required: true
  },
  aciklama: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});
// Update eklemeyi unutma 2044
module.exports = mongoose.model('Post', PostSchema);