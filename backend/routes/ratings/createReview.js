const express = require("express");
const router = express.Router();
const Review = require("../../models/Reviews");
const Order = require("../../models/Orders");
const User = require("../../models/Users");
const verify = require("../../utils/verifyTokens");

router.post("/review", async (req, res) => {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken && !refreshToken) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        });
    }

    let decodedUser;
    try {
        decodedUser = await verify.refreshToken(refreshToken);
    } catch (err) {
        console.error("Invalid refresh token:", err);
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        });
    }

    const { name, rating, comment, orderId } = req.body;

    //console.log(req.body)

    if (!rating || !name) {
        return res.status(400).json({
            success: false,
            message: "Missing required fields!"
        });
    }

    if (rating < 1 || rating > 5) {
        return res.status(400).json({
            success: false,
            message: "Rating must be between 1 and 5"
        });
    }

    try {
        // If orderId is provided, validate it
        if (orderId) {
            const order = await Order.findById(orderId);
            if (!order || order.user.toString() !== decodedUser.sub) {
                return res.status(403).json({ success: false, message: "You cannot review this order" });
            }

            const existingReview = await Review.findOne({
                user: decodedUser.sub,
                order: orderId
            });

            if (existingReview) {
                return res.status(409).json({
                    success: false,
                    message: "You have already reviewed this order!"
                });
            }
        }

        const newReview = new Review({
            text: comment,
            rating,
            name: name,
            user: decodedUser.sub,
            ...(orderId && { order: orderId }) // only if orderId exist
        });

        await newReview.save();

        await User.findByIdAndUpdate(decodedUser.sub, {
            $push: { reviews: newReview._id }
        });

        if (orderId) {
            await Order.findByIdAndUpdate(orderId, {
                $push: { reviews: newReview._id }
            });

        }

        res.status(201).json({
            success: true,
            message: "Thank you for your feedback!",
            review: newReview
        });

    } catch (error) {
        console.error("Error creating review:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

module.exports = router;
