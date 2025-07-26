const express = require("express");
const router = express.Router();
const User = require("../../models/Users");
const Order = require("../../models/Orders");
const StoreConfig = require("../../models/StoreConfig");
const verify = require("../../utils/verifyTokens");

router.patch("/orders/update-status", async (req, res) => {
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
            message: "Unauthorized!",
        });
    }

    const { orderIds, status } = req.body;

    const allowedStatuses = ['ordered', 'confirmed', 'shipped', 'delivered', 'cancelled'];

    if (!Array.isArray(orderIds) || orderIds.length === 0 || !allowedStatuses.includes(status)) {
        return res.status(400).json({
            success: false,
            message: "Invalid request data",
        });
    }

    try {
        const orders = await Order.find({ _id: { $in: orderIds } });

        if (orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No orders found",
            });
        }


        let totalItemsToReduce = 0;
        if (status === "shipped") {
            totalItemsToReduce = orders
                .filter(order => order.status !== "shipped")
                .reduce((sum, order) => sum + order.totalItems, 0);
        }

        const updateResult = await Order.updateMany(
            { _id: { $in: orderIds } },
            { $set: { status } }
        );


        if (status === "shipped" && totalItemsToReduce > 0) {
            const storeConfig = await StoreConfig.findOne({});
            if (storeConfig) {
                const newStock = Math.max(0, storeConfig.stock - totalItemsToReduce);
                storeConfig.stock = newStock;
                await storeConfig.save();
            }
        }

        // create notifications for each user
        const notificationPromises = orders.map(async (order) => {
            let notification = null;

            switch (status) {
                case "ordered":
                    notification = {
                        title: "Order Received!",
                        message: `We've received your order #${order._id.toString().slice(-6).toUpperCase()} and it's being processed.`,
                        redirectUrl: `/order/${order._id}`
                    };
                    break;
                case "confirmed":
                    notification = {
                        title: "Order Confirmed",
                        message: `Your order #${order._id.toString().slice(-6).toUpperCase()} is confirmed and will be packed soon.`,
                        redirectUrl: `/order/${order._id}`
                    };
                    break;
                case "shipped":
                    notification = {
                        title: "Order Shipped!",
                        message: `Your order #${order._id.toString().slice(-6).toUpperCase()} has been shipped.`,
                        redirectUrl: `/order/${order._id}`
                    };
                    break;
                case "delivered":
                    notification = {
                        title: "Delivered Successfully",
                        message: `Your order #${order._id.toString().slice(-6).toUpperCase()} has been delivered. Enjoy!`,
                        redirectUrl: `/order/${order._id}`
                    };
                    break;
                case "cancelled":
                    notification = {
                        title: "Order Cancelled",
                        message: `Your order #${order._id.toString().slice(-6).toUpperCase()} has been cancelled.`,
                        redirectUrl: `/order/${order._id}`
                    };
                    break;
            }

            if (notification) {
                return User.findByIdAndUpdate(order.user, {
                    $push: {
                        notifications: {
                            ...notification,
                            isRead: false,
                            createdAt: Date.now()
                        }
                    }
                });
            }
        });

        // wait for notifications to sent
        await Promise.all(notificationPromises.filter(Boolean));

        return res.status(200).json({
            success: true,
            message: `Updated ${updateResult.modifiedCount} order(s) to '${status}'`,
            updatedCount: updateResult.modifiedCount,
        });
    } catch (error) {
        console.error("Error updating orders:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

module.exports = router;
