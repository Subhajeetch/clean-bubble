const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: Number,
    },
    password: {
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
    accountType: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isOwner: {
        type: Boolean,
        default: false
    },
    resetPassword: {
        otp: {
            type: Number
        },
        validity: {
            type: Number
        }
    },
    notifications: [{
        title: {
            type: String,
        },
        message: {
            type: String,
        },
        isRead: {
            type: Boolean,
            default: false
        },
        createdAt: {
            type: Number,
        },
        redirectUrl: {
            type: String,
        }
    }],
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }],
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }],
    adminNote: {
        type: String,
    }
}, {
    timestamps: true
}
);

module.exports = mongoose.model('User', userSchema);