const express = require('express');
const router = express.Router();
const User = require('../../models/Users');
const Review = require('../../models/Reviews');
const verify = require("../../utils/verifyTokens");
const mongoose = require("mongoose");

router.get('/reviews', async (req, res) => {
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
        const { sort = 'recent', query, page = 1, perPage = 20 } = req.query;
        const pageNum = Math.max(1, parseInt(page));
        const perPageNum = Math.max(1, parseInt(perPage));
        let reviews = [];
        let total = 0;

        const ratingOptions = ['5-stars', '4-stars', '3-stars', '2-stars', '1-stars'];

        if (sort === 'search' && query) {
            // by reviewId, userId, userName, or review text
            const searchConditions = [
                { 'userInfo.fullName': new RegExp(query, 'i') },
                { 'userInfo.email': new RegExp(query, 'i') },
                { text: new RegExp(query, 'i') }
            ];

            if (query.match(/^[a-fA-F0-9]{24}$/)) {
                searchConditions.push({ _id: new mongoose.Types.ObjectId(query) });
                searchConditions.push({ user: new mongoose.Types.ObjectId(query) });
            }

            const pipeline = [
                {
                    $lookup: {
                        from: 'users',
                        localField: 'user',
                        foreignField: '_id',
                        as: 'userInfo'
                    }
                },
                {
                    $unwind: '$userInfo'
                },
                {
                    $lookup: {
                        from: 'orders',
                        localField: 'order',
                        foreignField: '_id',
                        as: 'orderInfo'
                    }
                },
                {
                    $match: {
                        $or: searchConditions
                    }
                },
                { $sort: { createdAt: -1 } },
                {
                    $project: {
                        name: 1,
                        isVerified: 1,
                        text: 1,
                        rating: 1,
                        adminReply: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        user: {
                            _id: '$userInfo._id',
                            fullName: '$userInfo.fullName',
                            email: '$userInfo.email'
                        },
                        order: {
                            $cond: {
                                if: { $gt: [{ $size: '$orderInfo' }, 0] },
                                then: { $arrayElemAt: ['$orderInfo._id', 0] },
                                else: null
                            }
                        }
                    }
                }
            ];

            const searchResults = await Review.aggregate(pipeline);
            total = searchResults.length;
            reviews = searchResults.slice((pageNum - 1) * perPageNum, (pageNum - 1) * perPageNum + perPageNum);

        } else if (ratingOptions.includes(sort)) {
            const rating = parseInt(sort.split('-')[0]);
            total = await Review.countDocuments({ rating: rating });
            reviews = await Review.find({ rating: rating })
                .sort({ createdAt: -1 })
                .skip((pageNum - 1) * perPageNum)
                .limit(perPageNum)
                .populate("user", "fullName email")
                .populate("order", "_id")
                .lean();

        } else if (sort === 'older') {
            total = await Review.countDocuments();
            reviews = await Review.find({})
                .sort({ createdAt: 1 })
                .skip((pageNum - 1) * perPageNum)
                .limit(perPageNum)
                .populate("user", "fullName email")
                .populate("order", "_id")
                .lean();

        } else {
            total = await Review.countDocuments();
            reviews = await Review.find({})
                .sort({ createdAt: -1 })
                .skip((pageNum - 1) * perPageNum)
                .limit(perPageNum)
                .populate("user", "fullName email")
                .populate("order", "_id")
                .lean();
        }

        const hasNextPage = pageNum * perPageNum < total;

        return res.status(200).json({
            success: true,
            reviews,
            page: pageNum,
            perPage: perPageNum,
            total,
            hasNextPage
        });

    } catch (error) {
        console.error("Error fetching reviews:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching reviews",
            error: error.message
        });
    }
});

module.exports = router;
