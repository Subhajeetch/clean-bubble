const express = require('express');
const router = express.Router();

router.get('/ratings/data', async (req, res) => {
    try {
        const ratingsCount = 0;
        const averageRating = 0;
        const ratingDistribution = {
            5: 0,
            4: 0,
            3: 0,
            2: 0,
            1: 0
        };

        res.status(201).json({
            success: true,
            message: "Successfully fetched the rating data.",
            ratingData: {
                ratingsCount,
                averageRating,
                ratingDistribution
            }
        })

    } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
});

module.exports = router;