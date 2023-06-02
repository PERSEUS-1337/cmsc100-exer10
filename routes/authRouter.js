const express = require('express');
const router = express.Router();

const {
    createUser,
    loginUser,
    deleteUser,
} = require('../controllers/authController');

// Sample API Call
router.get('/', (req, res, next) => {res.json({msg: 'AUTHORIZED Hello World'});});

// Authentication
router.post('/signup', createUser)
router.post('/login', loginUser)

// Admin Function
router.delete('/user', deleteUser)

module.exports = router;