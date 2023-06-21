const express = require('express');
const router = express.Router();

// const requireAuth = require('../middleware/requireAuth');

const {
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
} = require('../controllers/postController')

// router.use(requireAuth);

// Sample API Call
router.get('/', (req, res, next) => {res.json({msg: 'AUTHORIZED Hello World'});});

// GET
router.get('/all', getAllPosts)
router.get('/:pId', getPost)
router.get('/user/:uId', getUserPosts)
router.get('/user/:uId/feed', getUserFeed)

// POST
router.post('/', createPost)
router.post('/comment', addComment)

// PATCH / UPDATE
router.patch('/', editPost)
router.patch('/like', toggleLike)

// DELETE
router.delete('/', deletePost)
router.delete('/comment', deleteComment)

// TEST
router.get('/user/:uId/test', getUserFeed)

module.exports = router;