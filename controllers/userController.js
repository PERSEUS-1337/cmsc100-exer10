const mongoose = require('mongoose');
const api = require('../middleware/apiMessages');

const User = require('../models/User');
const Post = require('../models/Post');

// Validation and Authentication
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const createToken = (_id) => {
    return jwt.sign({_id}, process.env.PRIVATE_KEY, {expiresIn: '1d' });
}


// GET
async function getUser(req, res) {
    const { uId } = req.params;

    try{
        if (!validator.default.isMongoId(uId))
          throw {code: 400, msg: api.INVALID_ID};

        const user = await User.findById(uId);

        if (!user || user.length === 0)
            throw {code: 404, msg: api.NOT_FOUND_USER};
        
        console.info(api.SUCCESS_USERS_FETCHED);
        return res.status(200).json({msg: api.SUCCESS_USERS_FETCHED, user: user});

    } catch (err) {
        console.error(api.ERROR_FETCHING_USER, err.msg || err);
        return res.status(err.code || 500).json({err: err.msg || api.SERVER_ERROR});
    }
}

async function getAllUsers(req, res) {
    try {
        const all = await User.find({});

        if (all.length === 0)
            throw {code: 404, msg: api.NOT_FOUND_USER}; 

        console.info(api.SUCCESS_USERS_FETCHED);
        return res.status(200).json({msg: api.SUCCESS_USERS_FETCHED, users: all});

    } catch (err) {
        console.error(api.ERROR_FETCHING_USER, err.msg || err);
        return res.status(err.code || 500).json({err: err.msg || api.SERVER_ERROR});
    }
}

// CREATE
async function createUser(req, res) {
    const {email, password, fname, lname} = req.body;

    try {
        if (!validator.default.isEmail(email))
            throw {code: 400, msg: api.INVALID_EMAIL};

        if (!validator.default.isStrongPassword(password))
            throw {code: 400, msg: api.INVALID_PASSWORD};
        
        const exists = await User.findOne({email});

        if (exists)
            throw {code: 400, msg: api.FOUND_USER_EXISTS};
            
        if (!fname || !lname || !email || !password)
            throw {code: 400, msg: api.REQUIRED_ALL_FIELDS};
            

        // // Password encryption before storing in DB
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
    
        const newUser = new User({
            email,
            // password: hash,
            password,
            fname,
            lname,
        });

        const savedUser = await newUser.save();

        console.info(api.SUCCESS_USER_CREATED);
        return res.status(201).json({msg: api.SUCCESS_USER_CREATED, user: savedUser});
        // res.redirect(307, '/api/v1/auth/login/user');
    } catch (err) {
        console.error(api.ERROR_CREATING_USER, err.msg || err);
        return res.status(err.code || 500).json({err: err.msg || api.SERVER_ERROR})
    }
}

// LOGIN
async function loginUser(req, res){
    const { email, password } = req.body;
    try {
        if (!validator.default.isEmail(email))
            throw {code: 400, msg: api.INVALID_EMAIL};
        
        // Find the user by email
        const user = await User.findOne({ email });

        if (!user || user.length === 0)
            throw {code: 404, msg: api.NOT_FOUND_USER};

        // Check if the password matches
        // const matchPass = bcrypt.compare(password, user.password);
        // const matchPass = await user.comparePassword(password);

        if (! (password === user.password))
            throw {code: 400, msg: api.WRONG_PASSWORD};

        const token = createToken(user._id); 

        console.info(api.SUCCESS_USER_LOGGED);
        return res.status(200).json({msg: api.SUCCESS_USER_LOGGED, _id: user._id, token: token});
    } catch (err) {
        console.error(api.ERROR_LOGGING_USER, err.msg || err);
        return res.status(err.code || 500).json({err: err.msg || api.SERVER_ERROR})
    }
};

async function addFriend (req, res) {
    const { uId, fId } = req.params;

    try {
        if (!validator.default.isMongoId(uId) || !validator.default.isMongoId(fId)) 
          throw {code: 400, msg: api.INVALID_ID};

        const user = await User.findById(uId);
        const toAdd  = await User.findById(fId);

        if (!user)
            throw {code: 404, msg: api.NOT_FOUND_USER};
        
        if (!toAdd )
            throw {code: 404, msg: api.NOT_FOUND_USER};
            
        const isAFriend = user.friends.find(friend => friend.uId.toString() === fId);

        if (isAFriend)
            throw {code: 400, msg: api.FOUND_FRIEND_EXISTS};
        
        user.friends.push({ uId: fId, status: 'pending' });

        console.info(api.SUCCESS_FRIEND_ADDED);
        return res.status(200).json({msg: api.SUCCESS_FRIEND_ADDED, user: user.email, friend: toAdd.email});

    } catch (err) {
        console.error(api.ERROR_ADDING_FRIEND, err.msg || err);
        return res.status(err.code || 500).json({err: err.msg || api.SERVER_ERROR})
    }
}

// DELETE
async function deleteUser (req, res) {
    const { uId } = req.params;

    try {
        if (!validator.default.isMongoId(uId)) 
          throw {code: 400, msg: api.INVALID_ID};

        const user = await User.findById(uId);

        if (!user)
            throw {code: 400, msg: api.NOT_FOUND_USER};

        const deletedPosts = await Post.deleteMany({ user: uId });

        const result = await User.deleteOne({ _id: uId });

        if (result.deletedCount !== 1)
            throw {code: 400, msg: api.ERROR_DELETING_USER};


        console.info(api.SUCCESS_USER_DELETED);
        return res.status(200).json({msg: api.SUCCESS_USER_DELETED});

    } catch (err) {
        console.error(api.ERROR_DELETING_USER, err.msg || err);
        return res.status(err.code || 500).json({err: err.msg || api.SERVER_ERROR});
    }
}

module.exports = {
    getUser,
    getAllUsers,
    createUser,
    loginUser,
    deleteUser
}