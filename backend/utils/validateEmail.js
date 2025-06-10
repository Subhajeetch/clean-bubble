const validateEmail = email => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

module.exports = validateEmail;