const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    text: {
        type: String,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
    },
    adminReply: {
        name: {
            type: String
        },
        text: {
            type: String
        },
        date: {
            type: Number
        }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Review', reviewSchema);
