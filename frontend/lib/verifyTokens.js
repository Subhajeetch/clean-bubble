const jwt = require('jsonwebtoken');

const accessToken = (token) => {
    try {
        return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, {
            algorithms: ['HS256'],
            issuer: 'clean-bubble'
        });
    } catch (error) {
        console.error('Access token verification failed:', error);
        return null;
    }
}

const refreshToken = (token) => {
    try {
        return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, {
            algorithms: ['HS256'],
            issuer: 'clean-bubble'
        });
    } catch (error) {
        console.error('Refresh token verification failed:', error);
        return null;
    }
}


module.exports = {
    accessToken,
    refreshToken
};