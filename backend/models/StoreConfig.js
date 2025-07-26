const mongoose = require('mongoose');

const StoreConfigSchema = new mongoose.Schema({
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    discountPercent: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    },
    bulkDiscountPercent: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    },
    bulkQuantityThreshold: {
        type: Number,
        default: 0,
        min: 0,
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});


module.exports = mongoose.model('StoreConfig', StoreConfigSchema);