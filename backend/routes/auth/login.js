const express = require('express');
const router = express.Router();

// models
const User = require('../../models/Users');

// hash & compare password functions
const { comparePassword } = require('../../utils/hashPass');
const validateEmail = require('../../utils/validateEmail');

// generate JWT tokens
const generate = require('../../utils/generateTokens');

// DONE IMPORTS!!!!

router.post('/login', async (req, res) => {
    try {
        const {
            identifier, // email or phone..
            password
        } = req.body;

        if (!identifier || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email/Phone and password are required!'
            });
        }

        const isEmail = validateEmail(identifier);

        // user by email or phone
        const user = isEmail
            ? await User.findOne({ email: identifier.toLowerCase().trim() })
            : await User.findOne({ phone: identifier });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Wrong credentials'
            });
        }

        // check password 
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Incorrect Password'
            });
        }


        const accessToken = generate.accessToken(user);
        const refreshToken = generate.refreshToken(user)


        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 15 * 60 * 1000 // 15 minutes
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });

        // Remove password so over smartass ppl cant check their pass in the client side
        const userObj = user.toObject();
        delete userObj.password;

        res.status(200).json({
            success: true,
            message: 'Login successful',
            user: userObj
        });

    } catch (err) {
        console.error('Unexpected error in /login:', err);
        res.status(500).json({
            success: false,
            message: 'Something went wrong!'
        });
    }
});

module.exports = router;