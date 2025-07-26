const express = require("express");
const router = express.Router();
const Order = require("../../models/Orders");
const User = require("../../models/Users");
const verify = require("../../utils/verifyTokens");

router.get("/order/:id", async (req, res) => {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken && !refreshToken) {
        return res.status(401).json({ success: false, message: "Unauthorized!" });
    }

    let decodedUser;
    try {
        decodedUser = await verify.refreshToken(refreshToken);
    } catch (err) {
        console.error("Token verification failed:", err);
        return res.status(401).json({ success: false, message: "Unauthorized!" });
    }

    const user = await User.findById(decodedUser.sub);
    if (!user || user.accountType !== "admin") {
        return res.status(403).json({ success: false, message: "Forbidden: Admin access only" });
    }

    try {
        const order = await Order.findById(req.params.id)
            .populate("user", "fullName email phone")
            .populate("reviews")
            .lean();

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        return res.status(200).json({ success: true, order });
    } catch (err) {
        console.error("Error fetching order:", err);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});

module.exports = router;
