const express = require('express');
const router = express.Router();

// models
const User = require('../../models/Users');
const StoreConfig = require('../../models/StoreConfig');

// utils
const verify = require('../../utils/verifyTokens');


router.get('/store/config', async (req, res) => {
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



    try {
        const config = await StoreConfig.findOne({});
        if (!config) {
            return res.status(404).json({ success: false, message: "Store configuration not found" });
        }

        return res.status(200).json({
            success: true,
            config
        });

    } catch (error) {
        console.error("Error getting store config:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
