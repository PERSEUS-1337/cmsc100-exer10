const express = require('express');
const router = express.Router();

const {
    getUser,
    getAllUsers,
    searchUsers,
    getFriendsList,
    getFriendRequests,
    addFriend,
    acceptFriend,
    editUser,
    rejectFriend,
    removeFriend
} = require('../controllers/userController');

// Sample API Call
router.get('/', (req, res, next) => {res.json({msg: 'AUTHORIZED Hello World'});});

// GET
router.get('/all', getAllUsers)
router.get('/:uId', getUser)
router.get('/:uId/search', searchUsers)
router.get('/:uId/friends', getFriendsList)
router.get('/:uId/requests', getFriendRequests)

// POST
router.post('/friend', addFriend)
router.post('/request', acceptFriend)

// PATCH / UPDATE
router.patch('/', editUser)

// DELETE
router.delete('/friend', removeFriend)
router.delete('/request', rejectFriend)

module.exports = router;