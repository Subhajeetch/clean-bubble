const express = require("express");
const router = express.Router();
const User = require("../../models/Users");
const Order = require("../../models/Orders");
const Rating = require("../../models/Reviews");
const verify = require("../../utils/verifyTokens");
const StoreConfig = require("../../models/StoreConfig");

function getStartDate(period) {
    const now = new Date();
    switch (period) {
        case "1d": return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
        case "3d": return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3);
        case "7d": return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
        case "2w": return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 14);
        case "1m": return new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        case "all": default: return new Date(0);
    }
}

const PERIODS = ["1d", "3d", "7d", "2w", "1m", "all"];

router.get("/overview", async (req, res) => {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken && !refreshToken) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized!'
        });
    }

    let decodedUser = null;
    try {
        decodedUser = await verify.refreshToken(refreshToken);
    } catch (error) {
        console.error("Refresh token invalid:", error);
        return res.status(401).json({
            success: false,
            message: 'Unauthorized!'
        });
    }

    const user = await User.findById(decodedUser.sub);
    if (!user || user.accountType !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Forbidden"
        });
    }

    try {
        const now = new Date();
        const allOrders = await Order.find({}).sort({ createdAt: -1 });
        const allUsers = await User.find({});
        const allRatings = await Rating.find({});
        const storeConfig = await StoreConfig.findOne({});

        async function getStats(period) {
            const startDate = getStartDate(period);

            const orders = allOrders.filter(o => o.createdAt >= startDate && o.createdAt <= now);
            const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0).toFixed(2);

            const users = allUsers.filter(u => u.createdAt >= startDate && u.createdAt <= now);
            const ratings = allRatings.filter(r => r.createdAt >= startDate && r.createdAt <= now);
            const avgRating = ratings.length
                ? (ratings.reduce((sum, r) => sum + (r.rating || 0), 0) / ratings.length)
                : 0;

            const stock = storeConfig ? storeConfig.stock : 0;

            const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const ordersToday = orders.filter(o => o.createdAt >= todayStart && o.createdAt <= now).length;
            const revenueToday = orders
                .filter(o => o.createdAt >= todayStart && o.createdAt <= now)
                .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

            // PREVIOUS PERIOD RANGE
            function getPrevPeriodStart(period) {
                switch (period) {
                    case "1d": return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2);
                    case "3d": return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
                    case "7d": return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 14);
                    case "2w": return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 28);
                    case "1m": return new Date(now.getFullYear(), now.getMonth() - 2, now.getDate());
                    case "all": default: return new Date(0);
                }
            }

            const prevStart = getPrevPeriodStart(period);
            const prevEnd = startDate;

            const prevOrders = allOrders.filter(o => o.createdAt >= prevStart && o.createdAt < prevEnd);
            const prevRevenue = prevOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

            const prevUsers = allUsers.filter(u => u.createdAt >= prevStart && u.createdAt < prevEnd);
            const prevRatings = allRatings.filter(r => r.createdAt >= prevStart && r.createdAt < prevEnd);
            const prevAvgRating = prevRatings.length
                ? (prevRatings.reduce((sum, r) => sum + (r.rating || 0), 0) / prevRatings.length)
                : 0;

            const newUsers = users.length;
            const prevNewUsers = prevUsers.length;

            function percentChange(current, prev) {
                if (prev === 0) return current === 0 ? 0 : 1;
                return (current - prev) / Math.abs(prev);
            }

            const ordersChange = percentChange(orders.length, prevOrders.length);
            const revenueChange = percentChange(totalRevenue, prevRevenue);
            const ratingChange = percentChange(avgRating, prevAvgRating);
            const newUsersPercentage = percentChange(newUsers, prevNewUsers);

            const recentOrders = orders
                .sort((a, b) => b.createdAt - a.createdAt)
                .slice(0, 5)
                .map((o) => ({
                    id: `#${o._id.toString().slice(-6)}`,
                    status: o.status,
                    price: o.totalAmount,
                }));

            return {
                totalOrders: orders.length,
                newUsers,
                totalRevenue,
                avgRating: Number(avgRating.toFixed(2)),
                stock,
                ordersToday,
                revenueToday,
                newUsersPercentage: Number(newUsersPercentage.toFixed(2)),
                ratingChange: Number(ratingChange.toFixed(2)),
                ordersChange: Number(ordersChange.toFixed(2)),
                revenueChange: Number(revenueChange.toFixed(2)),
                recentOrders,
            };
        }

        const stats = {};
        for (const period of PERIODS) {
            stats[period] = await getStats(period);
        }

        return res.json({
            success: true,
            stats
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

module.exports = router;
