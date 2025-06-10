const validateEmail = require('../utils/validateEmail');
const validatePassword = require('../utils/validatePassword');
const validatePhone = require('../utils/validatePhone');

const checkValidInputs = (req, res, next) => {
    const { email, password, phone } = req.body;

    // Validate email format
    if (!validateEmail(email)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid email format'
        });
    }

    // If phone exists, validate phone number format
    if (phone !== undefined && phone !== null && phone !== '') {
        if (!validatePhone(phone)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid phone number format'
            });
        }
    }

    // Validate password strength
    if (!validatePassword(password)) {
        return res.status(400).json({
            success: false,
            message: 'Choose a stronger password.'
        });
    }

    next();
}

module.exports = checkValidInputs;