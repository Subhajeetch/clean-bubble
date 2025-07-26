const express = require('express');
const router = express.Router();
const Review = require("../../models/Reviews");

router.get('/reviews', async (req, res) => {
    try {
        const { filter = "recent", page = 1 } = req.query;
        const pageSize = 10;
        const skip = (parseInt(page) - 1) * pageSize;

        let sort = { createdAt: -1 };
        let ratingFilter = {};

        if (filter === "older") {
            sort = { createdAt: 1 };
        } else if (["1star", "2star", "3star", "4star", "5star"].includes(filter)) {
            const star = parseInt(filter[0]);
            ratingFilter.rating = star;
        }


        ratingFilter.rating = ratingFilter.rating || { $gte: 1, $lte: 5 };

        const reviews = await Review.find(ratingFilter)
            .sort(sort)
            .skip(skip)
            .limit(pageSize);

        const totalCount = await Review.countDocuments(ratingFilter);

        res.status(200).json({
            success: true,
            message: "Fetched reviews successfully.",
            reviews,
            totalCount,
            hasMore: skip + reviews.length < totalCount
        });
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;