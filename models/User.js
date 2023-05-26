const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'userData';

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
  fullName: {
    type: String,
    required: true
  },
  bio: {
    type: String
  },
  avatar: {
    type: String
  },
  friends: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: collectionName
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema, collectionName);

module.exports = User;
