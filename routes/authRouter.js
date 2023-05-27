const express = require('express');
const router = express.Router();

const {
    getUser,
    getAllUsers,
    createUser,
    loginUser,
    deleteUser
} = require('../controllers/userController');

const {
    getPost,
    getAllPosts,
    createPost,
    createComment,
    deletePost
} = require('../controllers/postController')

// Sample API Call
router.get('/hello', (req, res, next) => {res.json({msg: 'AUTHORIZED Hello World'});});

// Details of user
router.get('/users', getAllUsers)
router.get('/users/:uId', getUser)

// Admin Function
router.delete('/users/:uId', deleteUser)

// Authentication
router.post('/signup', createUser)
router.post('/login', loginUser)

// User functions
router.post('/add-friend/:uId/:fId', loginUser)

// Post functions
router.get('/posts/', getAllPosts)
router.get('/posts/:pId', getPost)

router.post('/post/:uId', createPost)
router.post('/comment', createComment)

router.delete('/posts/:pId', deletePost)

module.exports = router;