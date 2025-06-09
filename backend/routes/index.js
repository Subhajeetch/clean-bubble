const express = require('express');
const router = express.Router();

// auth routes
const authAPI = require('./authApi');



router.use('/auth', authAPI);



module.exports = router;
