const express = require("express");
const router = express.Router();
const Review = require("../../models/Reviews");
const verify = require("../../utils/verifyTokens");

router.get("/review/:reviewId", async (req, res) => {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken && !refreshToken) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    let decodedUser;
    try {
        decodedUser = await verify.refreshToken(refreshToken);
    } catch (err) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { reviewId } = req.params;

    if (!reviewId) {
        return res.status(400).json({ success: false, message: "Missing review ID" });
    }

    try {
        const review = await Review.findById(reviewId);

        if (!review) {
            return res.status(404).json({ success: false, message: "Review not found" });
        }

        if (review.user.toString() !== decodedUser.sub) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }

        res.status(200).json({ success: true, review });
    } catch (error) {
        console.error("Error fetching review by ID:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;
