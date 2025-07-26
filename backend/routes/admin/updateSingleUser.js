const User = require("../../models/Users");
const verify = require("../../utils/verifyTokens");
const express = require("express");
const router = express.Router();

router.put('/user/:id', async (req, res) => {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken && !refreshToken) {
        return res.status(401).json({ success: false, message: 'Unauthorized!' });
    }

    let decodedUser;
    try {
        decodedUser = await verify.refreshToken(refreshToken);
    } catch (error) {
        console.error("Invalid refresh token:", error);
        return res.status(401).json({
            success: false,
            message: "Unauthorized!",
        });
    }

    const user = await User.findById(decodedUser.sub);
    if (!user || user.accountType !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Unauthorized!",
        });
    }

    const userId = req.params.id;
    if (!userId) {
        return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    try {
        const updateData = req.body;

        if (updateData.fullName !== undefined) {
            if (typeof updateData.fullName !== 'string') {
                return res.status(400).json({
                    success: false,
                    message: 'Full name must be a string'
                });
            }
            if (updateData.fullName.trim().length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Full name cannot be empty'
                });
            }
            if (updateData.fullName.length > 40) {
                return res.status(400).json({
                    success: false,
                    message: 'Full name must be 40 characters or less'
                });
            }

            updateData.fullName = updateData.fullName.trim();
        }

        if (updateData.email !== undefined) {
            if (typeof updateData.email !== 'string') {
                return res.status(400).json({
                    success: false,
                    message: 'Email must be a string'
                });
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const trimmedEmail = updateData.email.trim().toLowerCase();

            if (!emailRegex.test(trimmedEmail)) {
                return res.status(400).json({
                    success: false,
                    message: 'Please enter a valid email address'
                });
            }


            const existingUser = await User.findOne({
                email: trimmedEmail,
                _id: { $ne: userId }
            });

            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already exists'
                });
            }

            updateData.email = trimmedEmail;
        }

        if (updateData.phone !== undefined) {

            let phoneStr = String(updateData.phone).trim();


            phoneStr = phoneStr.replace(/\D/g, '');

            if (phoneStr.length !== 10) {
                return res.status(400).json({
                    success: false,
                    message: 'Phone number must be exactly 10 digits'
                });
            }

            // if it starts with valid mobile prefixes (pakistani mobile numbers)
            const validPrefixes = ['30', '31', '32', '33', '34', '35', '36', '37', '38', '39'];
            const prefix = phoneStr.substring(0, 2);

            if (!validPrefixes.includes(prefix)) {
                return res.status(400).json({
                    success: false,
                    message: 'Please enter a valid Pakistani mobile number'
                });
            }


            updateData.phone = parseInt(phoneStr);
        }

        if (updateData.adminNote !== undefined) {
            if (typeof updateData.adminNote !== 'string') {
                return res.status(400).json({
                    success: false,
                    message: 'Admin note must be a string'
                });
            }

            if (updateData.adminNote.length > 400) {
                return res.status(400).json({
                    success: false,
                    message: 'Admin note must be 400 characters or less'
                });
            }

            // admin note
            updateData.adminNote = updateData.adminNote.trim();
        }


        if (updateData.accountType !== undefined) {
            if (!user.isOwner) {
                return res.status(403).json({
                    success: false,
                    message: 'Only owners can change account type'
                });
            }


            const validAccountTypes = ['user', 'admin'];
            if (!validAccountTypes.includes(updateData.accountType)) {
                return res.status(400).json({
                    success: false,
                    message: 'Account type must be either "user" or "admin"'
                });
            }
        }


        if (updateData.isVerified !== undefined) {
            if (typeof updateData.isVerified !== 'boolean') {
                return res.status(400).json({
                    success: false,
                    message: 'isVerified must be a boolean value'
                });
            }
        }


        const allowedFields = ['fullName', 'email', 'phone', 'accountType', 'adminNote', 'isVerified'];
        const filteredUpdateData = {};

        Object.keys(updateData).forEach(key => {
            if (allowedFields.includes(key) && updateData[key] !== undefined) {
                filteredUpdateData[key] = updateData[key];
            }
        });

        if (Object.keys(filteredUpdateData).length === 0) {
            return res.status(400).json({ success: false, message: 'No valid fields to update' });
        }

        // console.log("Filtered update data:", filteredUpdateData);

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: filteredUpdateData },
            {
                new: true,
                runValidators: true,
                select: '-password'
            }
        );

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }


        return res.status(200).json({ success: true, user: updatedUser });
    } catch (error) {
        console.error("Error updating user:", error);


        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({
                success: false,
                message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Error updating user',
            error: error.message
        });
    }
});

module.exports = router;
