const mongoose = require('mongoose');
const User = require('../models/User');

const api = require('../middleware/apiMessages');

// Validation and Authentication
const validator = require('validator');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');

async function getUser(req, res) {
    const { id } = req.params;

    try{
        if (!validator.default.isMongoId(id)) {
          throw {code: 400, msg: api.INVALID_ID};
        }

        const user = await User.findById(id);

        if (!user)
            throw {code: 400, msg: api.NOT_FOUND_USER};
        
        console.info(api.SUCCESS_USERS_FETCHED);
        return res.status(200).json({msg: api.SUCCESS_USERS_FETCHED, user: user});

    } catch (err) {
        console.error(api.ERROR_FETCHING_USER, err.msg);
        return res.status(err.code).json({err: err.msg});
    }
}

async function getAllUsers(req, res) {
    try {
        const all = await User.find({});

        if (!all)
            throw {code: 400, msg: api.NOT_FOUND_USER}; 

        console.info(api.SUCCESS_USERS_FETCHED);
        return res.status(200).json({msg: api.SUCCESS_USERS_FETCHED, users: all});

    } catch (err) {
        console.error(api.ERROR_FETCHING_USER, err.msg);
        return res.status(err.code).json({err: err.msg});
    }
}

async function createUser(req, res) {
    const {email, password, fname, lname} = req.body;

    try {
        const exists = await User.findOne({email});

        if (exists)
            throw {code: 400, msg: api.FOUND_USER_EXISTS};
            
        if (!fname || !lname || !email || !password)
            throw {code: 400, msg: api.REQUIRED_ALL_FIELDS};
            
        if (!validator.default.isEmail(email))
            throw {code: 400, msg: api.INVALID_EMAIL};

        if (!validator.default.isStrongPassword(password))
            throw {code: 400, msg: api.INVALID_PASSWORD};

        // // Password encryption before storing in DB
        // const salt = await bcrypt.genSalt(10);
        // const hash = await bcrypt.hash(password, salt);
    
        const newUser = new User({
            email,
            password,
            fname,
            lname,
        });

        const savedUser = await newUser.save();

        console.info(api.SUCCESS_USER_CREATED);
        return res.status(201).json({msg: api.SUCCESS_USER_CREATED, user: savedUser});
        // res.redirect(307, '/api/v1/auth/login/user');
    } catch (err) {
        console.error(api.ERROR_CREATING_USER, err.msg);
        return res.status(err.code).json({err: err.msg})
    }
}

async function deleteUser(req, res) {
    const { id } = req.params;

    try {
        if (!validator.default.isMongoId(id)) 
          throw {code: 400, msg: api.INVALID_ID};

        const user = await User.findById(id);

        if (!user)
            throw {code: 400, msg: api.NOT_FOUND_USER};

        const result = await User.deleteOne({ _id: id });

        if (result.deletedCount !== 1)
            throw {code: 400, msg: api.ERROR_DELETING_USER};

        console.info(api.SUCCESS_USER_DELETED);
        return res.status(200).json({msg: api.SUCCESS_USER_DELETED});

    } catch (err) {
        console.error(api.ERROR_FETCHING_USER, err.msg);
        return res.status(err.code).json({err: err.msg});
    }
}

module.exports = {
    getUser,
    getAllUsers,
    createUser,
    deleteUser
}