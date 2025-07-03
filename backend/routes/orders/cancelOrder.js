const express = require('express');
const router = express.Router();

const Order = require('../../models/Orders');
const User = require('../../models/Users');
const verify = require('../../utils/verifyTokens');

router.post('/cancel', async (req, res) => {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken && !refreshToken) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized!',
        });
    }

    const { orderId, cancelReason } = req.body;

    if (!orderId || !cancelReason) {
        return res.status(400).json({
            success: false,
            message: 'Missing orderId or cancelReason',
        });
    }


    let decodedUser;
    try {
        decodedUser = await verify.refreshToken(refreshToken);
    } catch (err) {
        console.error("Refresh token error:", err);
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token!',
        });
    }

    try {

        const user = await User.findById(decodedUser.sub);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found!',
            });
        }


        const ownsOrder = user.orders.some(order => order.toString() === orderId);
        if (!ownsOrder) {
            return res.status(403).json({
                success: false,
                message: 'This order does not belong to your account!',
            });
        }


        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found!',
            });
        }

        if (order.user.toString() !== user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized: This order does not belong to you!',
            });
        }


        if (order.status === 'shipped' || order.status === 'delivered') {
            return res.status(400).json({
                success: false,
                message: `Cannot cancel. This order is already ${order.status}.`,
            });
        }

        if (order.status === 'cancelled') {
            return res.status(400).json({
                success: false,
                message: 'Order is already cancelled.',
            });
        }


        order.status = 'cancelled';
        order.cancelNote = cancelReason;
        await order.save();


        user.notifications.push({
            title: "Order Cancelled",
            message: `Your order for Rs. ${order.totalAmount} has been cancelled.`,
            createdAt: Date.now(),
            redirectUrl: `/order/${order._id}`,
        });

        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Order cancelled successfully!',
        });

    } catch (err) {
        console.error("Error in /cancel-order:", err);
        return res.status(500).json({
            success: false,
            message: 'Server error while cancelling order.',
        });
    }
});

module.exports = router;
