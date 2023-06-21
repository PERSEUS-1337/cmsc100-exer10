const mongoose = require('mongoose');
const api = require('../middleware/apiMessages');

const User = require('../models/User');

// Validation and Authentication
const validator = require('validator');

async function getUser(req, res) {
    const {uId} = req.params;

    try{
        if (!validator.default.isMongoId(uId))
            throw {code: 400, msg: api.INVALID_ID};

        const user = await User.findById(uId);

        if (!user || user.length === 0)
            throw {code: 404, msg: api.NOT_FOUND_USER};
        
        console.info(api.SUCCESS_USER_FETCHED);
        return res.status(200).json({msg: api.SUCCESS_USER_FETCHED, user: user});
    } catch (err) {
        console.error(api.ERROR_FETCHING_USER, err.msg || err);
        return res.status(err.code || 500).json({err: err.msg || api.SERVER_ERROR});
    }
}

// TODO: Implement Filters
async function getAllUsers(req, res) {
    try {
        const all = await User.find({});

        if (all.length === 0)
            throw {code: 404, msg: api.NOT_FOUND_USER}; 

        console.info(api.SUCCESS_USER_FETCHED);
        return res.status(200).json({msg: api.SUCCESS_USER_FETCHED, users: all});

    } catch (err) {
        console.error(api.ERROR_FETCHING_USER, err.msg || err);
        return res.status(err.code || 500).json({err: err.msg || api.SERVER_ERROR});
    }
}

async function searchUsers(req, res) {
    const { uId } = req.params;
    const { search } = req.query;

    try {
        const regex = new RegExp(search, 'i');
        const users = await User.find({
            $and: [
                { _id: { $ne: uId } }, // Exclude the user
                {
                $or: [
                    { fname: regex }, // Match first name
                    { lname: regex }, // Match last name
                    { email: regex } // Match email
                ]
                }
            ]
            }).select('fname lname email');

        if (users.length === 0)
            // throw { code: 404, msg: api.NOT_FOUND_USER };
            return res.status(200).json({ msg: api.ERROR_FETCHING_USER, users });

        console.info(api.SUCCESS_USER_FETCHED);
        return res.status(200).json({ msg: api.SUCCESS_USER_FETCHED, users });
    } catch (err) {
        console.error(api.ERROR_FETCHING_USER, err.msg || err);
        return res.status(err.code || 500).json({ err: err.msg || api.SERVER_ERROR });
    }
}

async function getFriendsList (req, res) {
    const {uId} = req.params;
    try {
        if (!validator.default.isMongoId(uId))
            throw {code: 400, msg: api.INVALID_ID};

        const user = await User.findById(uId);

        console.log(user)
        
        if (!user || user.length === 0)
            throw {code: 404, msg: api.NOT_FOUND_USER};

        const friendsList = user.friends;

        if (!friendsList || friendsList.length === 0)
            // throw {code: 404, msg: api.NOT_FOUND_FRIEND};
            return res.status(200).json({msg: api.NOT_FOUND_FRIEND, friends: friendsList});
        
        console.info(api.SUCCESS_FRIEND_FETCHED);
        return res.status(200).json({msg: api.SUCCESS_FRIEND_FETCHED, friends: friendsList});
    } catch (err) {
        console.error(api.ERROR_FETCHING_FRIEND, err.msg || err);
        return res.status(err.code || 500).json({err: err.msg || api.SERVER_ERROR});
    }
}

async function getFriendRequests(req, res) {
    const {uId} = req.params;
    try {
        if (!validator.default.isMongoId(uId))
            throw {code: 400, msg: api.INVALID_ID};

        const user = await User.findById(uId).populate('friend_request');
        
        if (!user || user.length === 0)
            throw {code: 404, msg: api.NOT_FOUND_USER};

        const requestList = user.friend_request;

        if (!requestList || requestList.length === 0)
            // throw {code: 404, msg: api.NOT_FOUND_FRIEND_REQUEST};
            return res.status(200).json({msg: api.ERROR_FETCHING_FRIEND_REQUEST, requests: requestList});
        
        console.info(api.SUCCESS_FRIEND_REQUEST_FETCHED);
        return res.status(200).json({msg: api.SUCCESS_FRIEND_REQUEST_FETCHED, requests: requestList});
    } catch (err) {
        console.error(api.ERROR_FETCHING_FRIEND_REQUEST, err.msg || err);
        return res.status(err.code || 500).json({err: err.msg || api.SERVER_ERROR});
    }
}

async function addFriend (req, res) {
    const { uId, fId } = req.body;

    try {
        if (!validator.default.isMongoId(uId) || !validator.default.isMongoId(fId)) 
          throw {code: 400, msg: api.INVALID_ID};

        // Validation
        const user = await User.findById(uId);
        const toAdd  = await User.findById(fId);
        const isAFriend = user.friends.find(friend => friend._id.toString() === fId);
        const hasFriendRequest = user.friend_request.find(friend => friend._id.toString() === fId);

        // If User exists
        if (!user)
            throw {code: 404, msg: api.NOT_FOUND_USER};
        
        // If friend user exists
        if (!toAdd)
            throw {code: 404, msg: api.NOT_FOUND_USER};
            
        // If user is already a friend
        if (isAFriend)
            throw {code: 400, msg: api.FOUND_FRIEND_EXISTS};
            
        // If user already sent a request
        if (hasFriendRequest)
            throw {code: 400, msg: api.FOUND_FRIEND_REQUEST_EXISTS};

        // Save in both friend requests respectively
        user.friend_request.addToSet({ _id: fId, status: 'sent'});
        toAdd.friend_request.addToSet({ _id: uId, status: 'received' });
        await user.save();
        await toAdd.save();

        console.info(api.SUCCESS_FRIEND_REQUEST_SENT);
        return res.status(200).json({msg: api.SUCCESS_FRIEND_REQUEST_SENT, user: user.email, friend: toAdd.email});
    } catch (err) {
        console.error(api.ERROR_SENDING_FRIEND_REQUEST, err.msg || err);
        return res.status(err.code || 500).json({err: err.msg || api.SERVER_ERROR})
    }
}

async function acceptFriend (req, res) {
    const { uId, fId } = req.body;

    try {
        if (!validator.default.isMongoId(uId) || !validator.default.isMongoId(fId)) 
          throw {code: 400, msg: api.INVALID_ID};

        // Validation
        const user = await User.findById(uId);
        const toAccept  = await User.findById(fId);
        const isAFriend = await user.friends.find(friend => friend._id.toString() === fId);
        const hasFriendRequest = await user.friend_request.find(friend => friend._id.toString() === fId);

        // If User exists
        if (!user)
            throw {code: 404, msg: api.NOT_FOUND_USER};
        
        // If friend user exists
        if (!toAccept)
            throw {code: 404, msg: api.NOT_FOUND_USER};
            
        // If user is already a friend
        if (isAFriend)
            throw {code: 400, msg: api.FOUND_FRIEND_EXISTS};
            
        // If user already sent a request
        if (!hasFriendRequest)
            throw {code: 400, msg: api.NOT_FOUND_FRIEND_REQUEST};
        
        // If user already sent a request
        if (hasFriendRequest.status == 'sent')
            throw {code: 400, msg: api.INVALID_ACTION_FRIEND_REQUEST};

        // Save in both friend requests respectively
        user.friends.addToSet({ _id: fId});
        toAccept.friends.addToSet({ _id: uId});
        user.friend_request.pull({ _id: fId});
        toAccept.friend_request.pull({ _id: uId});

        await user.save();
        await toAccept.save();

        console.info(api.SUCCESS_FRIEND_ADDED);
        return res.status(200).json({msg: api.SUCCESS_FRIEND_ADDED, user: user.email, friend: toAccept.email});
    } catch (err) {
        console.error(api.ERROR_ADDING_FRIEND, err.msg || err);
        return res.status(err.code || 500).json({err: err.msg || api.SERVER_ERROR})
    }
}

// TODO: UPDATE PROFILE PICTURE
async function editUser (req, res) {
    const {uId, fname, lname, bio} = req.body;

    try {
        if (!validator.default.isMongoId(uId)) 
            throw { code: 400, msg: api.INVALID_ID };

        const user = await User.findById(uId);

        if (!user)
            throw {code: 404, msg: api.NOT_FOUND_USER};
        
        const updatedUser = await User.findOneAndUpdate(
            { _id: uId },
            { fname, lname, bio },
            { new: true }
        );

        if (!updatedUser)
            throw { code: 404, msg: api.NOT_FOUND_USER };
        
        console.info(api.SUCCESS_USER_UPDATED);
        return res.status(201).json({ msg: api.SUCCESS_USER_UPDATED, user: updatedUser });
    } catch (err) {
        console.error(api.ERROR_UPDATING_USER, err.msg || err);
        return res.status(err.code || 500).json({ err: err.msg || api.SERVER_ERROR });
    }
}

async function rejectFriend (req, res) {
    const {uId, fId} = req.body;
    try {
        if (!validator.default.isMongoId(uId) || !validator.default.isMongoId(fId))
            throw { code: 400, msg: api.INVALID_ID };

        const user = await User.findById(uId);
        const friendUser = await User.findById(fId);

        if (!user || !friendUser)
            throw {code: 404, msg: api.NOT_FOUND_USER};
        
        const updatedUser = await User.findOneAndUpdate(
            { _id: uId, 'friend_request._id': fId },
            { $pull: { friend_request: { _id: fId } } },
            { new: true }
        );

        const updatedFriendUser = await User.findOneAndUpdate(
            { _id: fId, 'friend_request._id': uId },
            { $pull: { friend_request: { _id: uId } } },
            { new: true }
        );

        if (!updatedUser || !updatedFriendUser)
            throw { code: 404, msg: api.NOT_FOUND_FRIEND_REQUEST };

        console.info(api.SUCCESS_FRIEND_REQUEST_REJECTED);
        return res.status(201).json({ msg: api.SUCCESS_FRIEND_REQUEST_REJECTED, user: updatedUser });
    } catch (err) {
        console.error(api.ERROR_REJECTING_FRIEND_REQUEST, err.msg || err);
        return res.status(err.code || 500).json({ err: err.msg || api.SERVER_ERROR });
    }
}

async function removeFriend (req, res) {
    const {uId, fId} = req.body;
    try {
        console.log(uId, fId)
        if (!validator.default.isMongoId(uId) || !validator.default.isMongoId(fId))
            throw { code: 400, msg: api.INVALID_ID };

        const user = await User.findById(uId);
        const friendUser = await User.findById(fId);

        if (!user || !friendUser)
            throw {code: 404, msg: api.NOT_FOUND_USER};
        
        const updatedUser = await User.findOneAndUpdate(
            { _id: uId, friends: fId },
            { $pull: { friends: fId } },
            { new: true }
        );

        const updatedFriendUser = await User.findOneAndUpdate(
            { _id: fId, friends: uId },
            { $pull: { friends: uId } },
            { new: true }
        );

        if (!updatedUser || !updatedFriendUser)
            throw { code: 404, msg: api.NOT_FOUND_FRIEND };

        console.info(api.SUCCESS_FRIEND_DELETED);
        return res.status(201).json({ msg: api.SUCCESS_FRIEND_DELETED, user: updatedUser, friend: updatedFriendUser });
    } catch (err) {
        console.error(api.ERROR_DELETING_FRIEND, err.msg || err);
        return res.status(err.code || 500).json({ err: err.msg || api.SERVER_ERROR });
    }
}

module.exports = {
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
}