const mongoose = require('mongoose');
const api = require('../middleware/apiMessages');
const validator = require('validator');

const User = require('../models/User');
const Post = require('../models/Post');

async function getPost(req, res) {
    const { pId } = req.params;

    try{
        if (!validator.default.isMongoId(pId))
          throw {code: 400, msg: api.INVALID_ID};

        const post = await Post.findById(pId);

        if (!post || post.length === 0)
            throw {code: 404, msg: api.NOT_FOUND_POST};
        
        console.info(api.SUCCESS_POST_FETCHED);
        return res.status(200).json({msg: api.SUCCESS_POST_FETCHED, post: post});
    } catch (err) {
        console.error(api.ERROR_FETCHING_POST, err.msg || err);
        return res.status(err.code || 500).json({err: err.msg || api.SERVER_ERROR});
    }
}

async function getAllPosts (req, res) {
  try {
    const all = await Post.find({});

    if (all.length === 0)
        throw {code: 404, msg: api.NOT_FOUND_POST}; 

    console.info(api.SUCCESS_POST_FETCHED);
    return res.status(200).json({msg: api.SUCCESS_POST_FETCHED, posts: all});

  } catch (err) {
    console.error(api.ERROR_FETCHING_POST, err.msg || err);
    return res.status(err.code || 500).json({err: err.msg || api.SERVER_ERROR});
  }
}

// Function to create a new post for a user
async function createPost (req, res) {
  const { uId } = req.params;
  const { content } = req.body;

  try {
    if (!validator.default.isMongoId(uId))
      throw {code: 400, msg: api.INVALID_ID};
    
    const user = await User.findById(uId);

    if (!user || user.length === 0)
      throw {code: 404, msg: api.NOT_FOUND_USER};
    
    if (!content || content.trim() === '')
      throw {code: 400, msg: api.REQUIRED_ALL_FIELDS};

    // Create a new post
    const newPost = new Post({
      user: uId,
      content: content,
      createdAt: new Date()
    });

    // Save the post
    const savedPost = await newPost.save();

    // Add the post reference to the user's posts array
    user.posts.push(savedPost._id);
    await user.save();

    console.info(api.SUCCESS_POST_CREATED);
    return res.status(201).json({msg: api.SUCCESS_POST_CREATED, post: savedPost});
  } catch (err) {
    console.error(api.ERROR_CREATING_POST, err.msg || err);
    return res.status(err.code || 500).json({err: err.msg || api.SERVER_ERROR})
  }
};

async function createComment (req, res) {
  const {uId, pId, text} = req.body;
  try {
    if (!uId || !pId || !text)
      throw {code: 400, msg: api.REQUIRED_ALL_FIELDS};
      
    if (!validator.default.isMongoId(uId) || !validator.default.isMongoId(pId))
      throw {code: 400, msg: api.INVALID_ID};
    
    const user = await User.findById(uId);

    if (!user || user.length === 0)
      throw {code: 404, msg: api.NOT_FOUND_USER};
    
    const post = await Post.findById(pId);

    if (!post || post.length === 0)
      throw {code: 404, msg: api.NOT_FOUND_POST};
    
    if (!text || text.trim() === '')
      throw {code: 400, msg: api.REQUIRED_ALL_FIELDS};

    // Create a new comment object
    const newComment = {
      user: uId,
      text: text,
      createdAt: new Date()
    };

    // Add the comment to the post's comments array
    post.comments.push(newComment);

    // Save the updated post
    const updatedPost = await post.save();

    console.info(api.SUCCESS_COMMENT_CREATED);
    return res.status(201).json({msg: api.SUCCESS_COMMENT_CREATED, post: updatedPost});
  } catch (err) {
    console.error(api.ERROR_CREATING_COMMENT, err.msg || err);
    return res.status(err.code || 500).json({err: err.msg || api.SERVER_ERROR})
  }
}

// DELETE
async function deletePost(req, res) {
  const { pId } = req.params;

  try {
    if (!validator.default.isMongoId(pId)) 
      throw {code: 400, msg: api.INVALID_ID};

    const post = await Post.findById(pId);

    if (!post)
        throw {code: 400, msg: api.NOT_FOUND_POST};

    const result = await Post.deleteOne({ _id: pId });

    if (result.deletedCount !== 1)
        throw {code: 400, msg: api.ERROR_DELETING_POST};

    console.info(api.SUCCESS_POST_DELETED);
    return res.status(200).json({msg: api.SUCCESS_POST_DELETED});

  } catch (err) {
    console.error(api.ERROR_DELETING_POST, err.msg || err);
    return res.status(err.code || 500).json({err: err.msg || api.SERVER_ERROR});
  }
}

module.exports = {
  getPost,
  getAllPosts,
  createPost,
  createComment,
  deletePost
};
