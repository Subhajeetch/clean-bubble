const express = require('express');
const router = express.Router();
const User = require('../../models/Users');
const Review = require('../../models/Reviews');
const verify = require("../../utils/verifyTokens");
const mongoose = require("mongoose");

router.get('/review/:id', async (req, res) => {
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
            message: "Forbidden: Admin access only",
        });
    }

    try {
        const { id } = req.params;
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid review ID format"
            });
        }

        const review = await Review.findById(id)
            .populate("user", "fullName email accountType createdAt")
            .populate("order", "_id totalAmount status createdAt")
            .lean();

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found"
            });
        }

        return res.status(200).json({
            success: true,
            review
        });

    } catch (error) {
        console.error("Error fetching review:", error);
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: "Invalid review ID format"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Error fetching review",
            error: error.message
        });
    }
});

module.exports = router;
