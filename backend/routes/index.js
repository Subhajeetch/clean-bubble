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
const getReviews = require('./ratings/getReviews');


// admin
const overview = require('./admin/overview');
const getOrdersForAdmin = require('./admin/getOrders');
const updateOrdersForAdmin = require('./admin/updateOrders');
const getOrderInfoForAdmin = require('./admin/getOrderInfo');
const updateSingleOrderForAdmin = require('./admin/updateSingleOrder');
const getStoreConfig = require('./admin/getStoreConfig');
const updateStoreConfig = require('./admin/updateStoreConfig');
const getUsersForAdmin = require('./admin/getUsersForAdmin');
const getSingleUserForAdmin = require('./admin/getSingleUserForAdmin');
const updateSingleUserForAdmin = require('./admin/updateSingleUser');
const getOrdersAndReviews = require('./admin/fetchOrdersAndReviews');
const deleteNotification = require('./admin/deleteNotification');
const getReviewsForAdmin = require('./admin/getReviews');
const getSingleReview = require('./admin/getSingleReview');
const updateReview = require('./admin/updateReview');
const getTeam = require('./admin/getTeam');
const addAndRemoveToTeam = require('./admin/addAndRemoveToTeam');


// store config routes
const getConfigForCart = require('./store/getConfigForCart');
const getPriceForStore = require('./store/getPriceForStore');


// forgot password
const forgotPassWOrd = require("./forgetPassword/forgetPass")


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
router.use('/get', getReviews);

// admin
router.use('/get', overview);
router.use('/admin/get', getOrdersForAdmin);
router.use('/admin', updateOrdersForAdmin);
router.use('/admin/get', getOrderInfoForAdmin);
router.use('/admin/update', updateSingleOrderForAdmin);
router.use('/admin/get', getStoreConfig);
router.use('/admin/update', updateStoreConfig);
router.use('/admin/get', getUsersForAdmin);
router.use('/admin/get', getSingleUserForAdmin);
router.use('/admin/update', updateSingleUserForAdmin);
router.use('/admin/fetch', getOrdersAndReviews);
router.use('/admin/delete', deleteNotification);
router.use('/admin/get', getReviewsForAdmin);
router.use('/admin/get', getSingleReview);
router.use('/admin/update', updateReview);
router.use('/admin/get', getTeam);
router.use('/admin', addAndRemoveToTeam);



// store config
router.use('/store', getConfigForCart);
router.use('/get', getPriceForStore);


// forgot password
router.use('/fpass', forgotPassWOrd);

module.exports = router;
