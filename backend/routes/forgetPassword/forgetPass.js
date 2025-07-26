const express = require('express');
const router = express.Router();
const User = require('../../models/Users');
const { sendOTPEmail } = require('../../utils/emailSender');
const validatePassword = require('../../utils/validatePassword');
const { hashPassword } = require('../../utils/hashPass');

// 6 digit
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000);
};


router.post('/verify-email', async (req, res) => {
    try {
        const { email } = req.body;


        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid email address'
            });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'No account found with this email address'
            });
        }


        const otp = generateOTP();
        const validity = Date.now() + (10 * 60 * 1000); // 10 minutes


        user.resetPassword = {
            otp: otp,
            validity: validity
        };
        await user.save();


        const emailResult = await sendOTPEmail(email, otp, user.fullName);

        if (!emailResult.success) {
            return res.status(500).json({
                success: false,
                message: 'Failed to send OTP email. Please try again.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'OTP sent to your email address.'
        });

    } catch (error) {
        console.error('Verify email error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error. Please try again.'
        });
    }
});

router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Email and OTP are required'
            });
        }

        if (!/^\d{6}$/.test(otp)) {
            return res.status(400).json({
                success: false,
                message: 'OTP must be 6 digits'
            });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (!user.resetPassword.otp || !user.resetPassword.validity) {
            return res.status(400).json({
                success: false,
                message: 'No OTP request found. Please request a new OTP.'
            });
        }


        if (Date.now() > user.resetPassword.validity) {
            user.resetPassword = {
                otp: undefined,
                validity: undefined
            };
            await user.save();

            return res.status(400).json({
                success: false,
                message: 'OTP has expired. Please request a new one.'
            });
        }

        if (parseInt(otp) !== user.resetPassword.otp) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP. Please check and try again.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'OTP verified successfully'
        });

    } catch (error) {
        console.error('Verify OTP error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error. Please try again.'
        });
    }
});

router.post('/change-pass', async (req, res) => {
    try {
        const { email, newPassword, confirmNewPassword } = req.body;


        if (!email || !newPassword || !confirmNewPassword) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({
                success: false,
                message: 'Passwords do not match'
            });
        }


        if (!validatePassword(newPassword)) {
            return res.status(400).json({
                success: false,
                message: 'Choose a strong password'
            });
        }


        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }


        if (!user.resetPassword.otp || !user.resetPassword.validity) {
            return res.status(400).json({
                success: false,
                message: 'Invalid session. Please start the password reset process again.'
            });
        }

        if (Date.now() > user.resetPassword.validity) {
            return res.status(400).json({
                success: false,
                message: 'Session expired. Please start the password reset process again.'
            });
        }


        const hashedPassword = await hashPassword(newPassword);

        user.password = hashedPassword;
        user.resetPassword = {
            otp: undefined,
            validity: undefined
        };

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password changed successfully!'
        });

    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error. Please try again.'
        });
    }
});

module.exports = router;
