const express = require('express');
const router = express.Router();

// models
const Order = require('../../models/Orders');

// utils
const verify = require('../../utils/verifyTokens');



router.post('/order', async (req, res) => {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken && !refreshToken) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized!'
        });
    }

    const { orderId, userId } = req.body;

    if (!orderId || !userId) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized!'
        });
    }

    // verify and get the user id from cookies
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

    // for security
    if (decodedUser.sub !== userId) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized!'
        });
    }

    // get order data
    try {
        const orderData = await Order.findById(orderId)
        const stringId = orderData.user.toString();


        if (!orderData) {
            return res.status(401).json({
                success: false,
                message: 'Invailid or outdated link!'
            });
        }


        // anyone else cant get someones order details
        if (stringId !== decodedUser.sub) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized!'
            });
        }

        res.status(201).json({
            success: true,
            orderData
        })

    } catch (error) {
        console.log("error on /get/order:", error);
        return res.status(501).json({
            success: false,
            message: 'Server error, please try again!'
        });

    }

})


module.exports = router;