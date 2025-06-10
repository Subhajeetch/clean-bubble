const express = require('express');
const router = express.Router();

router.post('/logout', async (req, res) => {
    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    });
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    });

    res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
});

module.exports = router;