function validatePhone(phone) {
    return typeof phone === 'string' && /^\d{10}$/.test(phone);
}

module.exports = validatePhone;