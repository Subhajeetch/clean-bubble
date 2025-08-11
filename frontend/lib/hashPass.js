const bycript = require('bcrypt');

const hashPassword = async (password) => {
    try {
        const salt = await bycript.genSalt(10);
        const hashedPassword = await bycript.hash(password, salt);
        return hashedPassword;
    } catch (error) {
        console.error('Error hashing password:', error);
        throw new Error('Password hashing failed');
    }
}

const comparePassword = async (password, hashedPassword) => {
    try {
        const isMatch = await bycript.compare(password, hashedPassword);
        return isMatch;
    } catch (error) {
        console.error('Error comparing password:', error);
        throw new Error('Password comparison failed');
    }
}

module.exports = {
    hashPassword,
    comparePassword
};