const User = require("../../models/Users");
const verify = require("../../utils/verifyTokens");
const express = require("express");
const router = express.Router();

router.get('/user/:id', async (req, res) => {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;
    if (!accessToken && !refreshToken) {
        return res.status(401).json({ success: false, message: 'Unauthorized!' });
    }

    let decodedUser;
    try {
        decodedUser = await verify.refreshToken(refreshToken);
    } catch (error) {
        console.error("Invalid refresh token:", error);
        return res.status(401).json({
            success: false,
            message: "Unauthorized!",
        });
    }
    const user = await User.findById(decodedUser.sub);
    if (!user || user.accountType !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Unauthorized!",
        });
    }

    const userId = req.params.id;
    if (!userId) {
        return res.status(400).json({ success: false, message: 'User ID is required' });
    }
    try {
        const foundUser = await User.findById(userId).select('-password');
        if (!foundUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        return res.status(200).json({ success: true, user: foundUser });
    } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({ success: false, message: 'Error fetching user' });
    }
});

module.exports = router;