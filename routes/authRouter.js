const express = require('express');
const router = express.Router();

const {
    getUser,
    getAllUsers,
    createUser,
    deleteUser
} = require('../controllers/userController');

router.get('/hello', (req, res, next) => {res.json({msg: 'AUTHORIZED Hello World'});});

router.get('/users', getAllUsers)

router.get('/users/:id', getUser)

router.delete('/users/:id', deleteUser)

router.post('/signup', createUser)

module.exports = router;