const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = async (req, res, next) => {

    const {authorization} = req.headers;
 
    if (!authorization) {
        return res.status(401).json({err: 'Unauthorized request! Log in first to continue'});
    }

    const token = authorization.split(' ')[1];

    try {
        const _id = jwt.verify(token, process.env.PRIVATE_KEY);

        req.user = await User.findOne({_id}).select('_id');

        next();
    } catch (error) {
        
        res.status(401).json({err: 'Authorization required!'});
    }
    
}

module.exports = requireAuth;