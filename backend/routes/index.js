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

// notifications routes
const markRead = require('./notifis/markRead');



router.use('/auth', signup);
router.use('/auth', login);
router.use('/auth', getUser)
router.use('/auth', logout);

// order routes
router.use('/order', createOrder);
router.use('/get', getOrders);

// notifications
router.use('/notifs', markRead)

module.exports = router;
