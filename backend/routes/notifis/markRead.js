const express = require('express');
const router = express.Router();

// models
const User = require('../../models/Users');

// utils
const verify = require('../../utils/verifyTokens');

router.post('/mark-read', async (req, res) => {

    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;


    if (!accessToken && !refreshToken) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized!'
        });
    }

    const { id } = req.body;

    console.log(id)

    if (!id) {
        return res.status(400).json({
            success: false,
            message: 'Notification ID is required!'
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
        // Find the user
        const user = await User.findById(decodedUser.sub);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found!'
            });
        }

        // Find the notification and mark as read
        const notifIndex = user.notifications.findIndex(n => n._id.toString() === id);
        if (notifIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found!'
            });
        }

        user.notifications[notifIndex].isRead = true;

        user.notifications = user.notifications
            .sort((a, b) => b.createdAt - a.createdAt)
            .slice(0, 20);

        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Notification marked as read.',
            notifications: user.notifications
        });
    } catch (error) {
        console.error("Error marking notification as read:", error);
        return res.status(500).json({
            success: false,
            message: 'Server error. Please try again.'
        });
    }
});



module.exports = router;