const express = require('express');
const router = express.Router();
const User = require('../../models/Users');
const verify = require("../../utils/verifyTokens");


router.get('/users', async (req, res) => {
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
        const { sort = 'recent', query, page = 1, perPage = 20 } = req.query;
        const pageNum = Math.max(1, parseInt(page));
        const perPageNum = Math.max(1, parseInt(perPage));
        let users = [];
        let total = 0;

        if (sort === 'search' && query) {
            const searchRegex = new RegExp(query, 'i');
            const searchFilter = {
                $or: [
                    { email: searchRegex },
                    { fullName: searchRegex },
                    { _id: query.match(/^[a-fA-F0-9]{24}$/) ? query : null }
                ]
            };
            total = await User.countDocuments(searchFilter);
            users = await User.find(searchFilter)
                .select('-password')
                .sort({ createdAt: -1 })
                .skip((pageNum - 1) * perPageNum)
                .limit(perPageNum);
        } else if (sort === 'older') {
            total = await User.countDocuments();
            users = await User.find({})
                .select('-password')
                .sort({ createdAt: 1 })
                .skip((pageNum - 1) * perPageNum)
                .limit(perPageNum);
        } else if (sort === 'most-orders') {
            const agg = await User.aggregate([
                {
                    $addFields: {
                        orderCount: { $size: { $ifNull: ["$orders", []] } }
                    }
                },
                { $sort: { orderCount: -1, createdAt: -1 } },
                { $project: { password: 0 } }
            ]);
            total = agg.length;
            users = agg.slice((pageNum - 1) * perPageNum, (pageNum - 1) * perPageNum + perPageNum);
        } else {
            total = await User.countDocuments();
            users = await User.find({})
                .select('-password')
                .sort({ createdAt: -1 })
                .skip((pageNum - 1) * perPageNum)
                .limit(perPageNum);
        }

        const hasNextPage = pageNum * perPageNum < total;

        res.json({
            success: true,
            users,
            page: pageNum,
            perPage: perPageNum,
            total,
            hasNextPage
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error fetching users', error: err.message });
    }
});

module.exports = router;
