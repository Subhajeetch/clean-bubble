const jwt = require('jsonwebtoken');

const accessToken = (user) => {
    return jwt.sign(
        {
            sub: user._id.toString(),
            email: user.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: '15m',
            algorithm: 'HS256',
            issuer: 'clean-bubble',
            audience: user._id.toString()
        }
    );
};


const refreshToken = (user) => {
    return jwt.sign(
        {
            sub: user._id.toString(),
            email: user.email
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: '30d',
            algorithm: 'HS256',
            issuer: 'clean-bubble',
            audience: user._id.toString()
        }
    );
};


module.exports = {
    accessToken,
    refreshToken
};