const express = require('express');
const router = express.Router();

// models
const User = require('../../models/Users');

// utils
const verify = require('../../utils/verifyTokens');
const validatePhone = require("../../utils/validatePhone");

router.post('/profile', async (req, res) => {

    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken && !refreshToken) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized!'
        });
    }

    const {
        fullName,
        email,
        phone
    } = req.body;

    if (!fullName || !email) {
        return res.status(400).json({
            success: false,
            message: 'Empty value(s).'
        });
    }

    if (phone && !validatePhone(phone)) {
        return res.status(400).json({
            success: false,
            message: 'Phone number is not valid.'
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
        // Find & update the user
        const updatedUser = await User.findByIdAndUpdate(
            decodedUser.sub,
            {
                fullName,
                email,
                phone
            },
            { new: true, select: "-password" }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully.",
            user: updatedUser
        });

    } catch (error) {
        console.error("Error editing profile:", error);
        return res.status(500).json({
            success: false,
            message: 'Server error. Please try again.'
        });
    }
});


module.exports = router;