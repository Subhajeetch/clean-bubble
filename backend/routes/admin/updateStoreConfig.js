const express = require('express');
const router = express.Router();

// models
const User = require('../../models/Users');
const StoreConfig = require('../../models/StoreConfig');

// utils
const verify = require('../../utils/verifyTokens');


router.put('/store/config', async (req, res) => {
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


    const { price, discountPercent, bulkDiscountPercent, bulkQuantityThreshold, stock, updatedAt } = req.body;

    if (!price || price < 0 || stock === undefined || stock === null) {
        return res.status(400).json({ success: false, message: 'Vaild Price and stock are required!' });
    }

    if (discountPercent < 0 || discountPercent > 100 || bulkDiscountPercent < 0 || bulkDiscountPercent > 100) {
        return res.status(400).json({ success: false, message: 'Discount percentages must be between 0 and 100!' });
    }

    if (bulkQuantityThreshold < 0) {
        return res.status(400).json({ success: false, message: 'Bulk quantity threshold must be a non-negative number!' });
    }

    try {

        const config = await StoreConfig.findOneAndUpdate(
            {},
            {
                price,
                discountPercent,
                bulkDiscountPercent,
                bulkQuantityThreshold,
                stock,
                updatedAt: updatedAt || Date.now(),
            },
            { new: true, upsert: true }
        );

        return res.status(200).json({
            success: true,
            message: 'Store config updated successfully',
            config
        });

    } catch (error) {
        console.error("Error updating store config:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
