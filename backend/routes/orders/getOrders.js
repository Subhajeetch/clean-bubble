const express = require('express');
const router = express.Router();

// models
const User = require('../../models/Users');
const Order = require('../../models/Orders');

// utils
const verify = require('../../utils/verifyTokens');



router.get('/orders', async (req, res) => {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken && !refreshToken) {
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

    // get all orders from the user
    try {
        const orders = await Order.find({ user: decodedUser.sub }).sort({ createdAt: -1 });

        res.status(201).json({
            success: true,
            orders
        })

    } catch (error) {
        console.log("error on /get/orders :", error);
        return res.status(501).json({
            success: false,
            message: 'Server error, please try again!'
        });

    }

})


module.exports = router;