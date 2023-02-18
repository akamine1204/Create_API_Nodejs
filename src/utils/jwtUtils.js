require('dotenv').config();
const jwt = require('jsonwebtoken');
module.exports = {
  createAccessToken: (payload) => {
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET_KEY || 'secret', {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '365d',
    });
    return accessToken;
  },
  verifyToken: (token) => {
    try {
      const decodedPayload = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET_KEY || 'secret',
      );
      return decodedPayload;
    } catch (error) {
      throw error;
    }
  },
  getToken: (req) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    }
    return null;
  },
};
