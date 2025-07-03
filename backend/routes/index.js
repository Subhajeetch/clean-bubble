const express = require('express');
const router = express.Router();

// auth routes
const signup = require('./auth/signup');
const login = require('./auth/login');
const getUser = require('./auth/getUser');
const logout = require('./auth/logout');

// order routes
const createOrder = require('./orders/createOrder');
const getOrders = require('./orders/getOrders');
const getOrderData = require('./orders/getOrderData');
const cancelOrder = require('./orders/cancelOrder');

// notifications routes
const markRead = require('./notifis/markRead');

// profile
const editProfile = require("./profile/editProfile");
const changePass = require("./profile/changePass");

// ratings and reviews
const getRatingsData = require('./ratings/ratingData');
const createReview = require('./ratings/createReview');
const getOrderReview = require("./ratings/getOrderReview");



router.use('/auth', signup);
router.use('/auth', login);
router.use('/auth', getUser)
router.use('/auth', logout);

// order routes
router.use('/order', createOrder);
router.use('/get', getOrders);
router.use("/get", getOrderData);
router.use('/order', cancelOrder);

// notifications
router.use('/notifs', markRead);

// profile
router.use("/edit", editProfile);
router.use("/change", changePass);

// ratings and reviews
router.use("/get", getRatingsData);
router.use('/create', createReview);
router.use('/get', getOrderReview);

module.exports = router;
