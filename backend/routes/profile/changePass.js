const express = require('express');
const router = express.Router();

// models
const User = require('../../models/Users');

// utils
const verify = require('../../utils/verifyTokens');
const validatePassword = require('../../utils/validatePassword');
const { hashPassword, comparePassword } = require('../../utils/hashPass');

router.post('/password', async (req, res) => {

    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken && !refreshToken) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized!'
        });
    }



    const {
        prePassword,
        newPassword,
        confirmNewPassword,
    } = req.body;

    if (!prePassword || !newPassword || !confirmNewPassword) {
        return res.status(400).json({
            success: false,
            message: 'Empty value(s).'
        });
    }

    if (newPassword !== confirmNewPassword) {
        return res.status(401).json({
            success: false,
            message: "New password doesn't match the confirm new password."
        })
    }

    if (prePassword === newPassword) {
        return res.status(401).json({
            success: false,
            message: "Use a different password!"
        })
    }


    if (newPassword && !validatePassword(newPassword)) {
        return res.status(400).json({
            success: false,
            message: 'Password is not strong enough!'
        });
    }


    // verify and get the user id from cookies

    let decodedUser = null;
    try {
        decodedUser = await verify.refreshToken(refreshToken);
    } catch (error) {
        console.error("Refresh token invalid:", error);
        return res.status(401).json({
            success: false,
            message: 'Unauthorized!'
        });
    }

    if (!decodedUser.sub) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized!'
        });
    }



    try {
        const user = await User.findOne({ _id: decodedUser.sub });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized!'
            });
        }


        //check is the previous pass is correct
        const isPrePassMatch = await comparePassword(prePassword, user.password);
        if (!isPrePassMatch) {
            return res.status(401).json({
                success: false,
                message: 'Incorrect previous password.'
            });
        }



        // hash the pass
        let hashedPassword;
        try {
            hashedPassword = await hashPassword(newPassword);
        } catch (err) {
            console.error('Error hashing password:', err);
            return res.status(500).json({
                success: false,
                message: 'Something went wrong, please try again!'
            });
        }


        // find and update the user's pass
        const updatedUser = await User.findByIdAndUpdate(
            decodedUser.sub,
            {
                password: hashedPassword
            },
            { new: true })


        if (updatedUser.password === hashedPassword) {
            return res.status(200).json({
                success: true,
                message: "Password Updated!"
            })
        }


    } catch (error) {
        console.error('Unexpected error in /change/password:', error);
        res.status(500).json({
            success: false,
            message: "Couldn't update the password, try again!"
        });
    }

});


module.exports = router;