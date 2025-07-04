const express = require('express');
const router = express.Router();
const Review = require("../../models/Reviews");

router.get('/ratings/data', async (req, res) => {
    try {
        // Fetch all reviews
        const reviews = await Review.find({ rating: { $gte: 1, $lte: 5 } });

        const ratingsCount = reviews.length;
        const totalRating = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
        const averageRating = ratingsCount > 0 ? (totalRating / ratingsCount).toFixed(2) : 0;


        const ratingDistribution = {
            5: 0,
            4: 0,
            3: 0,
            2: 0,
            1: 0
        };
        reviews.forEach(review => {
            const r = review.rating;
            if (r >= 1 && r <= 5) {
                ratingDistribution[r] += 1;
            }
        });

        res.status(200).json({
            success: true,
            message: "Successfully fetched the rating data.",
            ratingData: {
                ratingsCount,
                averageRating: Number(averageRating),
                ratingDistribution
            }
        });

    } catch (error) {
        console.error("Error fetching rating data:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;