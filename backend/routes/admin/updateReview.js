const express = require('express');
const router = express.Router();
const User = require('../../models/Users');
const Review = require('../../models/Reviews');
const verify = require("../../utils/verifyTokens");
const mongoose = require("mongoose");

router.patch('/review/:id', async (req, res) => {
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
        const {
            action,
            rating,
            text,
            adminReply,
            isVerified
        } = req.body;


        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid review ID format"
            });
        }

        const existingReview = await Review.findById(id);
        if (!existingReview) {
            return res.status(404).json({
                success: false,
                message: "Review not found"
            });
        }

        if (action === 'delete') {
            await Review.findByIdAndDelete(id);
            return res.status(200).json({
                success: true,
                message: "Review deleted successfully"
            });
        }

        const updateData = {};

        if (rating !== undefined) {
            const ratingNum = parseInt(rating);
            if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
                return res.status(400).json({
                    success: false,
                    message: "Rating must be a number between 1 and 5"
                });
            }
            updateData.rating = ratingNum;
        }

        if (text !== undefined) {
            if (typeof text !== 'string') {
                return res.status(400).json({
                    success: false,
                    message: "Review text must be a string"
                });
            }
            updateData.text = text.trim();
        }

        if (isVerified !== undefined) {
            if (typeof isVerified !== 'boolean') {
                return res.status(400).json({
                    success: false,
                    message: "isVerified must be a boolean"
                });
            }
            updateData.isVerified = isVerified;
        }

        if (adminReply !== undefined) {
            if (adminReply === null || adminReply === '') {
                updateData.$unset = { adminReply: 1 };
            } else {
                if (typeof adminReply !== 'object' || !adminReply.text) {
                    return res.status(400).json({
                        success: false,
                        message: "Admin reply must be an object with 'text' property"
                    });
                }

                if (typeof adminReply.text !== 'string' || adminReply.text.trim().length === 0) {
                    return res.status(400).json({
                        success: false,
                        message: "Admin reply text cannot be empty"
                    });
                }

                updateData.adminReply = {
                    name: adminReply.name || user.fullName || "Admin",
                    text: adminReply.text.trim(),
                    date: Date.now()
                };
            }
        }

        if (Object.keys(updateData).length === 0 && !updateData.$unset) {
            return res.status(400).json({
                success: false,
                message: "No valid update data provided"
            });
        }

        const updatedReview = await Review.findByIdAndUpdate(
            id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        ).populate("user", "fullName email accountType createdAt")
            .populate("order", "_id totalAmount status createdAt")
            .lean();

        if (!updatedReview) {
            return res.status(404).json({
                success: false,
                message: "Review not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Review updated successfully",
            review: updatedReview
        });

    } catch (error) {
        console.error("Error updating review:", error);
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: "Invalid review ID format"
            });
        }

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: "Validation error",
                error: error.message
            });
        }

        return res.status(500).json({
            success: false,
            message: "Error updating review",
            error: error.message
        });
    }
});

module.exports = router;
