const express = require('express');
const router = express.Router();
const User = require('../../models/Users');
const Order = require('../../models/Orders');
const Review = require('../../models/Reviews');
const verify = require('../../utils/verifyTokens');

router.get('/o-r/:id', async (req, res) => {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken && !refreshToken) {
        return res.status(401).json({ success: false, message: 'Unauthorized!' });
    }

    let decodedUser;
    try {
        decodedUser = await verify.refreshToken(refreshToken);
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Unauthorized!' });
    }

    const adminUser = await User.findById(decodedUser.sub);
    if (!adminUser || adminUser.accountType !== 'admin') {
        return res.status(403).json({ success: false, message: 'Unauthorized!' });
    }

    const userId = req.params.id;
    if (!userId) {
        return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }



        const orders = await Order.find({ user: userId }).lean();
        const reviews = await Review.find({ user: userId }).lean();

        return res.json({ success: true, orders, reviews });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Error fetching orders and reviews', error: err.message });
    }
});

module.exports = router;
