const mongoose = require('mongoose');
const api = require('../middleware/apiMessages');
const validator = require('validator');

const User = require('../models/User');
const Post = require('../models/Post');

async function getPost(req, res) {
  const {pId} = req.params;

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

async function getUserPosts (req, res) {
  const {uId} = req.params;
  try {
    if (!validator.default.isMongoId(uId))
      throw {code: 400, msg: api.INVALID_ID};

    const user = await User.findById(uId);

    const posts = await Post.find({author: uId});

    if (!user || user.length === 0)
      throw {code: 404, msg: api.NOT_FOUND_USER};

    if (!posts || posts.length === 0)
      throw {code: 404, msg: api.NOT_FOUND_POST};

    console.info(api.SUCCESS_POST_FETCHED);
    return res.status(200).json({msg: api.SUCCESS_POST_FETCHED, posts: posts});
  } catch (err) {
     console.error(api.ERROR_FETCHING_POST, err.msg || err);
    return res.status(err.code || 500).json({err: err.msg || api.SERVER_ERROR});
  }
}

// async function GetUserFeedAuthorIds(req, res) {
//   const { uId } = req.params;
//   console.log(uId);
//   try {
    
//     if (!validator.default.isMongoId(uId))
//     throw { code: 400, msg: api.INVALID_ID };

//     const user = await User.findById(uId);
    
//     if (!user)
//       throw { code: 404, msg: api.NOT_FOUND_USER };
    
//     const feedPostIds = []

//     for (const pId of user.posts){
//       feedPostIds.push(pId)
//       console.log("Post ID:" + pId)
//     }

//     for (const fId of user.friends) {
//       const friend = await User.findById(fId);
//       for (const pId of friend.posts){
//         feedPostIds.push(pId)
//         console.log("Friend Post ID:" + pId)
//       }
//     }

//     console.log(feedPostIds)

//     // if (!feedPosts || feedPosts.length === 0)
//     //   throw { code: 404, msg: api.NOT_FOUND_POST };

//     console.info(api.SUCCESS_POST_FETCHED);
//     return res.status(200).json({ msg: api.SUCCESS_POST_FETCHED, pIds: feedPostIds });
//   } catch (err) {
//     console.error(api.ERROR_FETCHING_POST, err.msg || err);
//     return res.status(err.code || 500).json({ err: err.msg || api.SERVER_ERROR });
//   }
// }

const getUserFeed = async (req, res) => {
  const { uId } = req.params;

  try {
    // Get the user's friends
    const user = await User.findById(uId);

    if (!user || user.length === 0)
      throw {code: 404, msg: api.NOT_FOUND_USER};

    // Extract the friend IDs
    const friendIds = user.friends.map(friend => friend._id);
    
    // Add the user's ID to include their posts as well
    friendIds.push(user._id);
    console.log(friendIds)

    // Fetch posts using $lookup aggregation
    const feed = await Post.aggregate([
      {
        $match: {
          author: { $in: friendIds }
        }
      },
    ]);

    console.info(api.SUCCESS_POST_FETCHED);
    return res.status(200).json({ msg: api.SUCCESS_POST_FETCHED, feed });
  } catch (err) {
    console.error(api.ERROR_FETCHING_FEED, err.msg || err);
    return res.status(err.code || 500).json({ err: err.msg || api.SERVER_ERROR });
  }
};



async function createPost (req, res) {
  const {uId, content} = req.body;

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
      author: uId,
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
}

async function addComment (req, res) {
  const {uId, pId, text} = req.body;
  try {
    
    if (!validator.default.isMongoId(uId) || !validator.default.isMongoId(pId))
      throw {code: 400, msg: api.INVALID_ID};
    
    const user = await User.findById(uId);
    const post = await Post.findById(pId);

    if (!user || user.length === 0)
      throw {code: 404, msg: api.NOT_FOUND_USER};
    
    if (!post || post.length === 0)
      throw {code: 404, msg: api.NOT_FOUND_POST};
    
    if (!text || text.trim() === '')
      throw {code: 400, msg: api.REQUIRED_ALL_FIELDS};
    
      const newComment = {
      author: uId,
      text: text,
      createdAt: new Date()
    };

    post.comments.push(newComment);

    const updatedPost = await post.save();

    console.info(api.SUCCESS_COMMENT_ADDED);
    return res.status(201).json({msg: api.SUCCESS_COMMENT_ADDED, comments: updatedPost.comments});
  } catch (err) {
    console.error(api.ERROR_ADDING_COMMENT, err.msg || err);
    return res.status(err.code || 500).json({err: err.msg || api.SERVER_ERROR})
  }
}

async function toggleLike (req, res) {
  const {uId, pId} = req.body;

   try {
    if (!validator.default.isMongoId(uId) || !validator.default.isMongoId(pId))
      throw {code: 400, msg: api.INVALID_ID};
    
    const user = await User.findById(uId);
    const post = await Post.findById(pId);

    if (!user || user.length === 0)
      throw {code: 404, msg: api.NOT_FOUND_USER};
    
    if (!post || post.length === 0)
      throw {code: 404, msg: api.NOT_FOUND_POST};

    // Check if the user has already liked the post
    const likedIndex = post.likes.findIndex(like => like.toString() === uId);

    var response = "";
    if (likedIndex === -1) {
      response = api.SUCCESS_ADD_LIKE;
      post.likes.push(uId);
    } else {
      response = api.SUCCESS_REMOVE_LIKE
      post.likes.splice(likedIndex, 1);
    }

    await post.save();

    console.info(response);
    return res.status(201).json({msg: response, post: post});
  } catch (err) {
    console.error(api.ERROR_TOGGLING_LIKE, err.msg || err);
    return res.status(err.code || 500).json({err: err.msg || api.SERVER_ERROR})
  }

}

async function editPost (req, res) {
  const { uId, pId, update } = req.body;

  try {
    if (!uId || !pId || !update)
      throw {code: 400, msg: api.REQUIRED_ALL_FIELDS};
      
    if (!validator.default.isMongoId(uId) || !validator.default.isMongoId(pId))
      throw {code: 400, msg: api.INVALID_ID};

    const user = await User.findById(uId);
    const post = await Post.findById(pId);

    // If user exists
    if (!user || user.length === 0)
      throw {code: 404, msg: api.NOT_FOUND_USER};
    
    // If post exists
    if (!post || post.length === 0)
      throw {code: 404, msg: api.NOT_FOUND_POST};

    // If post user is same as current user
    if (uId != post.user)
      throw {code: 404, msg: api.INVALID_AUTHOR};

    // Update the post content
    post.content = update;
    post.lastEdited = new Date();

    // Save the updated post
    await post.save();

    console.info(api.SUCCESS_POST_EDITED);
    return res.status(201).json({msg: api.SUCCESS_POST_EDITED, post: post});
  } catch (err) {
    console.error(api.ERROR_UPDATING_POST, err.msg || err);
    return res.status(err.code || 500).json({err: err.msg || api.SERVER_ERROR})
  }
}

async function deletePost(req, res) {
  const { uId ,pId } = req.body;

  try {
    if (!validator.default.isMongoId(uId) || !validator.default.isMongoId(pId))
      throw {code: 400, msg: api.INVALID_ID};

    const user = await User.findById(uId);
    const post = await Post.findById(pId);

    // If user exists
    if (!user || user.length === 0)
      throw {code: 404, msg: api.NOT_FOUND_USER};

    // If post exists
    if (!post)
      throw {code: 400, msg: api.NOT_FOUND_POST};
    
    // If post user is same as current user
    if (uId != post.author)
      throw {code: 404, msg: api.INVALID_AUTHOR};
    
    user.posts.pull(pId);
    await user.save();

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

async function deleteComment(req, res) {
  const {uId, pId, cId} = req.body;
  try {
     if (!validator.default.isMongoId(uId) || !validator.default.isMongoId(pId))
      throw {code: 400, msg: api.INVALID_ID};

    const user = await User.findById(uId);
    const post = await Post.findById(pId);
    // If comment exists and if comment author is same as user
    const commentIndex = post.comments.findIndex(
      (comment) => comment._id.toString() === cId && comment.author.toString() === uId
    );

    // If user exists
    if (!user || user.length === 0)
      throw {code: 404, msg: api.NOT_FOUND_USER};

    // If post exists
    if (!post)
      throw {code: 404, msg: api.NOT_FOUND_POST};

    // If comment is in post
    if (commentIndex === -1) {
      throw {code: 404, msg: api.NOT_FOUND_COMMENT};
    }

    // Remove the comment from the comments array
    post.comments.splice(commentIndex, 1);
    await post.save();

    console.info(api.SUCCESS_COMMENT_DELETED);
    return res.status(200).json({msg: api.SUCCESS_COMMENT_DELETED});
  } catch (err) {
    console.error(api.ERROR_DELETING_COMMENT, err.msg || err);
    return res.status(err.code || 500).json({err: err.msg || api.SERVER_ERROR});
  }
}

module.exports = {
  getPost,
  getAllPosts,
  getUserPosts,
  // GetUserFeedAuthorIds,
  getUserFeed,
  createPost,
  editPost,
  deletePost,
  toggleLike,
  addComment,
  deleteComment
};