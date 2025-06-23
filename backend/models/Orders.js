const { sign } = require('jsonwebtoken');
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    products: [{
        id: {
            type: Number,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        size: {
            type: String,
            required: true
        },
    }],
    name: {
        type: String,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    netAmount: {
        type: Number,
        required: true
    },
    totalItems: {
        type: Number,
        required: true
    },
    discountPercent: {
        type: Number,
        default: 0
    },

    status: {
        type: String,
        enum: ['ordered', 'confirmed', 'shipped', 'delivered', 'cancelled'],
        default: 'ordered'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    shippingAddress: [{
        address: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        zip: {
            type: String,
        },
        landmark: {
            type: String,
        }

    }],
    paymentMethod: {
        type: String,
        enum: ['cod', 'online'],
        default: 'cod'
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }],
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
