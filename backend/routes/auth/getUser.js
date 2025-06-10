const express = require('express');
const router = express.Router();
const User = require('../../models/Users');

// generate and verify JWT tokens
const generate = require('../../utils/generateTokens');
const verify = require('../../utils/verifyTokens');

router.get('/get/user', async (req, res) => {
    try {
        const accessToken = req.cookies.accessToken;
        const refreshToken = req.cookies.refreshToken;

        // console.log("access", accessToken)
        // console.log("refresh", refreshToken)

        if (!accessToken && !refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Not authenticated"
            });
        }

        let decodedUser = null;
        let newAccessToken = null;


        if (accessToken) {
            try {
                decodedUser = await verify.accessToken(accessToken);
            } catch (error) {
                console.error("Access token invalid:", error);
                decodedUser = null;
            }
        }


        if (!decodedUser && refreshToken) {
            try {
                decodedUser = await verify.refreshToken(refreshToken);
                console.log("decoded", decodedUser)
                if (decodedUser) {
                    const tempUser = {
                        _id: decodedUser.sub,
                        email: decodedUser.email
                    }
                    newAccessToken = await generate.accessToken(tempUser);
                    res.cookie('accessToken', newAccessToken, {
                        httpOnly: true,
                        secure: true,
                        sameSite: 'none',
                        maxAge: 15 * 60 * 1000 // 15 minutes
                    });
                }
            } catch (error) {
                console.error("Refresh token invalid:", error);
                return res.status(401).json({ success: false, message: "Unauthorized" });
            }
        }


        if (!decodedUser) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired tokens"
            });
        }

        // Find user by email from decoded token
        const user = await User.findOne({ email: decodedUser.email }).lean();
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Remove password before sending user object
        delete user.password;

        return res.status(200).json({
            success: true,
            message: "Login verified!",
            user
        });

    } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
});

module.exports = router;