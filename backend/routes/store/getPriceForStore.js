const express = require("express");
const router = express.Router();
const StoreConfig = require("../../models/StoreConfig");

router.get("/price", async (req, res) => {
    try {
        const config = await StoreConfig.findOne({});
        if (!config) {
            return res.status(404).json({ success: false, message: "Config not found" });
        }
        return res.json({
            success: true,
            price: config.price,
            stock: config.stock
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;