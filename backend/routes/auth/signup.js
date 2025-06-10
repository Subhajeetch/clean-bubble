const express = require('express');
const router = express.Router();

// middlewares
const checkIsUnique = require('../../middlewares/CheckIsUnique');
const checkValidInputs = require('../../middlewares/CheckValidInputs');

// models
const User = require('../../models/Users');

// hash password
const { hashPassword } = require('../../utils/hashPass');

// generate JWT tokens
const generate = require('../../utils/generateTokens');

// signin body validation
const validateSigninBody = require('../../utils/validateSigninBody');

// DONE IMPORTS!!!!

router.post('/signup', checkValidInputs, checkIsUnique, async (req, res) => {
    try {
        const requiredFields = ["fullName", "password", "email"];
        const validation = validateSigninBody(req.body, requiredFields);

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: `Missing: ${validation.missingFields}`
            });
        }

        // Normalize input
        const normalizeEmail = req.body.email?.toLowerCase().trim();
        if (!normalizeEmail) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        let hashedPassword;
        try {
            hashedPassword = await hashPassword(req.body.password);
        } catch (err) {
            console.error('Error hashing password:', err);
            return res.status(500).json({
                success: false,
                message: 'Something went wrong!'
            });
        }

        const userData = {
            fullName: req.body.fullName,
            email: normalizeEmail,
            phone: req.body.phone ? req.body.phone : null,
            password: hashedPassword
        };

        let result;
        try {
            const user = new User(userData);
            result = await user.save();
        } catch (err) {
            // Handle duplicate key error (should be caught by checkIsUnique, but just in case)
            if (err.code === 11000) {
                return res.status(409).json({
                    success: false,
                    message: 'Email already exists'
                });
            }
            console.error('Error saving user:', err);
            return res.status(500).json({
                success: false,
                message: 'Something went wrong!'
            });
        }



        const accessToken = generate.accessToken(result);
        const refreshToken = generate.refreshToken(result)

        // set cookies
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none', // use "strict" if the domain is same.. i wont be using this in the same domain as frontend.
            maxAge: 15 * 60 * 1000 // 15 minutes
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });

        // delete password before sending user to client
        const u = result.toObject();
        delete u.password;

        console.log('User signed up:', u);

        res.status(201).json({
            success: true,
            message: 'User signed up successfully',
            user: u
        });
    } catch (err) {
        console.error('Unexpected error in /signup:', err);
        res.status(500).json({
            success: false,
            message: 'Something went wrong!'
        });
    }
});

module.exports = router;