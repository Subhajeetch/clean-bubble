const express = require('express');
const router = express.Router();

// models
const User = require('../../models/Users');
const Order = require('../../models/Orders');
const StoreConfig = require("../../models/StoreConfig");

// utils
const verify = require('../../utils/verifyTokens');

router.put('/single/order', async (req, res) => {
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

    const { orderId, type, payload } = req.body;

    if (!orderId || !type || !payload) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    try {
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        let notification = null;

        if (type === "status") {
            const previousStatus = order.status;
            order.status = payload.status;

            if (payload.status === "shipped" && previousStatus !== "shipped") {
                const storeConfig = await StoreConfig.findOne({});
                if (storeConfig) {
                    const newStock = Math.max(0, storeConfig.stock - order.totalItems);
                    storeConfig.stock = newStock;
                    await storeConfig.save();
                }
            }

            switch (payload.status) {
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

        } else if (type === "userInfo") {
            order.name = payload.name;
            order.phone = payload.phone;

        } else if (type === "address") {
            order.shippingAddress = [{
                address: payload.address,
                city: payload.city,
                state: payload.state,
                zip: payload.zip,
                landmark: payload.landmark
            }];

        } else {
            return res.status(400).json({ success: false, message: 'Invalid update type' });
        }

        await order.save();

        if (notification) {
            await User.findByIdAndUpdate(order.user, {
                $push: {
                    notifications: {
                        ...notification,
                        isRead: false,
                        createdAt: Date.now()
                    }
                }
            });
        }

        res.status(200).json({
            success: true,
            message: 'Order updated successfully!',
            order
        });

    } catch (error) {
        console.error("Error updating order:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
