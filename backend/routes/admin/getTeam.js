const express = require('express');
const router = express.Router();
const User = require('../../models/Users');
const verify = require("../../utils/verifyTokens");
const mongoose = require("mongoose");

router.get('/team', async (req, res) => {
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
        const { page = 1, perPage = 20, sort = 'recent' } = req.query;
        const pageNum = Math.max(1, parseInt(page));
        const perPageNum = Math.max(1, parseInt(perPage));

        const teamQuery = {
            $or: [
                { isOwner: true },
                { accountType: "admin" }
            ]
        };

        let sortOptions = {};
        if (sort === 'recent') {
            sortOptions = { createdAt: -1 };
        } else if (sort === 'older') {
            sortOptions = { createdAt: 1 };
        } else if (sort === 'name') {
            sortOptions = { fullName: 1 };
        } else {
            sortOptions = { createdAt: -1 };
        }

        const total = await User.countDocuments(teamQuery);

        const teamMembers = await User.find(teamQuery)
            .select('-password -resetPasswordToken')
            .sort(sortOptions)
            .skip((pageNum - 1) * perPageNum)
            .limit(perPageNum)
            .populate('orders', '_id status totalAmount createdAt')
            .populate('reviews', '_id rating createdAt')
            .lean();

        const hasNextPage = pageNum * perPageNum < total;

        const enrichedTeamMembers = teamMembers.map(member => ({
            ...member,
            totalOrders: member.orders ? member.orders.length : 0,
            totalReviews: member.reviews ? member.reviews.length : 0,
            role: member.isOwner ? 'Owner' : member.accountType === 'admin' ? 'Admin' : 'User',
            status: member.isVerified ? 'Verified' : 'Unverified'
        }));

        return res.status(200).json({
            success: true,
            teamMembers: enrichedTeamMembers,
            page: pageNum,
            perPage: perPageNum,
            total,
            hasNextPage,
            totalPages: Math.ceil(total / perPageNum)
        });

    } catch (error) {
        console.error("Error fetching team members:", error);

        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: "Invalid query parameters"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Error fetching team members",
            error: error.message
        });
    }
});

module.exports = router;
