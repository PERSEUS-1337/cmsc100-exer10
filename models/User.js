const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'userData';
const postCollectionName = 'postData'

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  fname: {
    type: String,
    required: true
  },
  lname: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    default: 'No bio available'
  },
  avatar: {
    type: String,
    default: 'default_avatar.png'
  },
  posts: [{
    type: Schema.Types.ObjectId,
    ref: postCollectionName
  }],
  friends: [{
    type: Schema.Types.ObjectId,
    ref: collectionName
  }],
  friend_request: [{
    _id: {
      type: Schema.Types.ObjectId,
      ref: collectionName
    },
    status: {
      type: String,
      enum: ['received', 'sent'],
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema, collectionName);

module.exports = User;
