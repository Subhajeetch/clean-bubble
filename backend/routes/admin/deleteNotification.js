const express = require('express');
const router = express.Router();
const User = require('../../models/Users');
const verify = require('../../utils/verifyTokens');

router.delete('/notification/:userId/:notifId', async (req, res) => {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken && !refreshToken) {
        return res.status(401).json({ success: false, message: 'Unauthorized!' });
    }

    let decodedUser;
    try {
        decodedUser = await verify.refreshToken(refreshToken);
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Unauthorized!' });
    }

    const adminUser = await User.findById(decodedUser.sub);
    if (!adminUser || adminUser.accountType !== 'admin') {
        return res.status(403).json({ success: false, message: 'Unauthorized!' });
    }

    const { userId, notifId } = req.params;
    if (!userId || !notifId) {
        return res.status(400).json({ success: false, message: 'User ID and Notification ID are required' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const notifIndex = user.notifications.findIndex(n => n._id && n._id.toString() === notifId);
        if (notifIndex === -1) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }

        user.notifications.splice(notifIndex, 1);
        await user.save();

        return res.json({ success: true, message: 'Notification deleted' });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Error deleting notification', error: err.message });
    }
});

module.exports = router;
