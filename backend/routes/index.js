const express = require('express');
const router = express.Router();

// auth routes
const signup = require('./auth/signup');
const login = require('./auth/login');
const getUser = require('./auth/getUser');
const logout = require('./auth/logout');



router.use('/auth', signup);
router.use('/auth', login);
router.use('/auth', getUser)
router.use('/auth', logout);



module.exports = router;
