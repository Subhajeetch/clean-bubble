function validatePhone(phone) {
    // Convert to string if it's a number
    if (typeof phone === 'number') phone = phone.toString();
    return typeof phone === 'string' && /^\d{10}$/.test(phone);
}

module.exports = validatePhone;