const express = require('express');
const router = express.Router();

// models
const User = require('../models/Users');

router.post('/signup', (req, res) => {
    console.log(req.body);
    console.log(req.ip);

    res.json({
        success: true,
        message: 'User signed up successfully',
        user: req.body
    });
});

module.exports = router;