const express = require("express");
const router = express.Router();
const User = require("../../models/Users");
const Order = require("../../models/Orders");
const verify = require("../../utils/verifyTokens");
const mongoose = require("mongoose");

router.get("/orders", async (req, res) => {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken && !refreshToken) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized!",
        });
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
        let orders = [];
        let total = 0;

        const statusOptions = ['ordered', 'confirmed', 'shipped', 'delivered', 'cancelled'];

        if (sort === 'search' && query) {
            // by orderId, user email, or user name
            const searchConditions = [
                { 'userInfo.email': new RegExp(query, 'i') },
                { 'userInfo.fullName': new RegExp(query, 'i') }
            ];

            if (query.match(/^[a-fA-F0-9]{24}$/)) {
                searchConditions.push({ _id: new mongoose.Types.ObjectId(query) });
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
                    $match: {
                        $or: searchConditions
                    }
                },
                { $sort: { createdAt: -1 } },
                {
                    $project: {
                        products: 1,
                        name: 1,
                        totalAmount: 1,
                        netAmount: 1,
                        totalItems: 1,
                        discountPercent: 1,
                        status: 1,
                        phone: 1,
                        shippingAddress: 1,
                        paymentMethod: 1,
                        reviews: 1,
                        adminNote: 1,
                        cancelNote: 1,
                        deliveryExpectedDate: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        user: {
                            _id: '$userInfo._id',
                            fullName: '$userInfo.fullName',
                            email: '$userInfo.email'
                        }
                    }
                }
            ];

            const searchResults = await Order.aggregate(pipeline);
            total = searchResults.length;
            orders = searchResults.slice((pageNum - 1) * perPageNum, (pageNum - 1) * perPageNum + perPageNum);

        } else if (statusOptions.includes(sort)) {

            total = await Order.countDocuments({ status: sort });
            orders = await Order.find({ status: sort })
                .sort({ createdAt: -1 })
                .skip((pageNum - 1) * perPageNum)
                .limit(perPageNum)
                .populate("user", "fullName email")
                .lean();

        } else {
            total = await Order.countDocuments();
            orders = await Order.find({})
                .sort({ createdAt: -1 })
                .skip((pageNum - 1) * perPageNum)
                .limit(perPageNum)
                .populate("user", "fullName email")
                .lean();
        }

        const hasNextPage = pageNum * perPageNum < total;

        return res.status(200).json({
            success: true,
            orders,
            page: pageNum,
            perPage: perPageNum,
            total,
            hasNextPage
        });

    } catch (error) {
        console.error("Error fetching orders:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching orders",
            error: error.message
        });
    }
});

module.exports = router;
