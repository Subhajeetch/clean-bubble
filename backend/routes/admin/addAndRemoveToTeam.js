const express = require('express');
const router = express.Router();
const User = require('../../models/Users');
const verify = require("../../utils/verifyTokens");
const mongoose = require("mongoose");

router.patch('/team/add-admin', async (req, res) => {
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

    // only owners can add admins
    if (!user || user.accountType !== "admin" || !user.isOwner) {
        return res.status(403).json({
            success: false,
            message: "Forbidden: Owner access only. Regular admins cannot add other admins.",
        });
    }

    try {
        const { type, identifier } = req.body;

        if (!type || !identifier) {
            return res.status(400).json({
                success: false,
                message: "Type and identifier are required"
            });
        }

        let targetUser;
        if (type === "email") {
            targetUser = await User.findOne({ email: identifier.toLowerCase() });
        } else if (type === "userid") {
            if (!mongoose.Types.ObjectId.isValid(identifier)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid user ID format"
                });
            }
            targetUser = await User.findById(identifier);
        } else {
            return res.status(400).json({
                success: false,
                message: "Type must be 'email' or 'userid'"
            });
        }

        if (!targetUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (targetUser.accountType === 'admin') {
            return res.status(400).json({
                success: false,
                message: "User is already an admin"
            });
        }

        // prevent owners from accidentally demoting themselves
        if (targetUser._id.toString() === user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: "Cannot modify your own account through this endpoint"
            });
        }

        await User.findByIdAndUpdate(
            targetUser._id,
            { accountType: 'admin' },
            { new: true, runValidators: true }
        );

        console.log(`Owner ${user.email} promoted user ${targetUser.email} to admin`);

        return res.status(200).json({
            success: true,
            message: "User promoted to admin successfully"
        });

    } catch (error) {
        console.error("Error adding admin:", error);
        return res.status(500).json({
            success: false,
            message: "Error adding admin",
            error: error.message
        });
    }
});

// Remove Admin - OWNER ONLY OPERATION
router.patch('/team/remove-admin', async (req, res) => {
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

    // only owners can remove admins
    if (!user || user.accountType !== "admin" || !user.isOwner) {
        return res.status(403).json({
            success: false,
            message: "Forbidden: Owner access only. Regular admins cannot remove other admins.",
        });
    }

    try {
        const { userIds } = req.body;
        console.log("Received userIds:", userIds);

        if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: "User IDs array is required"
            });
        }


        const invalidIds = userIds.filter(id => !mongoose.Types.ObjectId.isValid(id));
        if (invalidIds.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID format"
            });
        }


        const objectIds = userIds.map(id => new mongoose.Types.ObjectId(id));
        console.log("Converted to ObjectIds:", objectIds);


        const userObjectId = user._id.toString();
        if (userIds.includes(userObjectId)) {
            return res.status(400).json({
                success: false,
                message: "Cannot remove your own admin privileges"
            });
        }


        const targetUsers = await User.find({ _id: { $in: objectIds } });
        console.log("Found target users:", targetUsers.map(u => ({ id: u._id, email: u.email, accountType: u.accountType, isOwner: u.isOwner })));

        if (targetUsers.length !== userIds.length) {
            return res.status(404).json({
                success: false,
                message: "Some users not found"
            });
        }

        const ownerUsers = targetUsers.filter(u => u.isOwner);
        const nonAdminUsers = targetUsers.filter(u => u.accountType !== 'admin');

        if (ownerUsers.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Cannot remove owner privileges. Owners can only be demoted by database administrators."
            });
        }

        if (nonAdminUsers.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Some selected users are not admins"
            });
        }


        const result = await User.updateMany(
            {
                _id: { $in: objectIds },
                accountType: 'admin'
            },
            { accountType: 'user' }
        );

        console.log(`Update result:`, result);
        console.log(`Owner ${user.email} removed admin privileges from ${result.modifiedCount} user(s)`);

        if (result.modifiedCount === 0) {
            return res.status(400).json({
                success: false,
                message: "No admin users were found to update"
            });
        }

        return res.status(200).json({
            success: true,
            message: `${result.modifiedCount} admin(s) removed successfully`
        });

    } catch (error) {
        console.error("Error removing admin:", error);
        return res.status(500).json({
            success: false,
            message: "Error removing admin",
            error: error.message
        });
    }
});

module.exports = router;
