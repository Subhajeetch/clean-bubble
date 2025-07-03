const express = require('express');
const router = express.Router();

// models
const User = require('../../models/Users');
const Order = require('../../models/Orders');

// utils
const verify = require('../../utils/verifyTokens');


// DONE IMPORTS!!!!

router.post('/create', async (req, res) => {

    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken && !refreshToken) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized!'
        });
    }

    const {
        products,
        name,
        totalItems,
        netAmount,
        discountPercent,
        totalAmount,
        user,
        phone,
        shippingAddress,
        paymentMethod
    } = req.body;


    if (!products || !Array.isArray(products) || products.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Unauthorized!'
        });
    }

    if (!name || !totalItems || !netAmount || !totalAmount || !user || !phone || !shippingAddress || !paymentMethod) {
        return res.status(400).json({
            success: false,
            message: 'Unauthorized!'
        });
    }

    // check if the user who orderd and the token user are the same
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

    if (decodedUser.sub !== user._id.toString()) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized!'
        });
    }

    // Create the order
    const newOrder = new Order({
        products,
        name,
        totalItems,
        netAmount,
        discountPercent,
        totalAmount,
        user: decodedUser.sub,
        phone,
        shippingAddress,
        paymentMethod
    });

    try {

        // Save the order to the database
        if (!newOrder) {
            return res.status(400).json({
                success: false,
                message: 'Failed to create order'
            });
        }
        await newOrder.save();


        // Update the user's order history
        await User.findByIdAndUpdate(decodedUser.sub, {
            $push: { orders: newOrder._id }
        }, { new: true });

        // add notification to the user
        const updatedUser = await User.findByIdAndUpdate(decodedUser.sub, {
            $push: {
                notifications: {
                    title: 'Order Placed',
                    message: `Your order for ${totalItems} items has been placed successfully.`,
                    isRead: false,
                    createdAt: Date.now(),
                    redirectUrl: `/order/${newOrder._id}`
                }
            }
        }, { new: true, select: "-password" }).select("-password");

        // send response
        res.status(201).json({
            success: true,
            message: 'Order created successfully!',
            order: newOrder,
            user: updatedUser
        });


        // update the phone and shipping address in the user model
        await User.findByIdAndUpdate(decodedUser.sub, {
            phone: phone,
            shippingAddress: [{
                address: shippingAddress.address,
                state: shippingAddress.state,
                city: shippingAddress.city,
                zip: shippingAddress.zip,
                landmark: shippingAddress.landmark
            }]
        }, { new: true });

        console.log("Order created successfully:", newOrder);

    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }


});

module.exports = router;