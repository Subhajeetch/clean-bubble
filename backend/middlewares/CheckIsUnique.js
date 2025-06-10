// this file is imported in the routes file: routes/authApi.js

const User = require('../models/Users');

const checkIsUnique = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'Email already exists'
            });
        }
        next();
    } catch (err) {
        console.error('Error in checkIsUnique middleware:', err);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

module.exports = checkIsUnique;