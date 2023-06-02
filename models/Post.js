const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'postData';
const userCollectionName = 'userData'

const postSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: userCollectionName,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: userCollectionName
  }],
  comments: [{
    author: {
      type: Schema.Types.ObjectId,
      ref: userCollectionName,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastEdited: {
    type: Date,
    default: Date.now
  },
});

const Post = mongoose.model('Post', postSchema, collectionName);

module.exports = Post;
