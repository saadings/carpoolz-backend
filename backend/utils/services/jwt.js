const jwt = require("jsonwebtoken");
require("../getEnv");

exports.generateJWTToken = function (payload) {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });
};

exports.generateRefreshToken = function (payload) {
  return jwt.sign(payload, process.env.RT_SECRET_KEY, {
    expiresIn: process.env.RT_EXPIRE_TIME,
  });
};

exports.verifyRefreshToken = function (accessToken) {
  return jwt.verify(accessToken, process.env.RT_SECRET_KEY);
};

exports.isJWTStillValid = function (jwtToken) {
  try {
    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);
    return decoded.exp > Math.floor(Date.now() / 1000);
  } catch (err) {
    return false;
  }
};

exports.isRefreshTokenStillValid = function (jwtToken) {
  try {
    const decoded = jwt.verify(jwtToken, process.env.RT_SECRET_KEY);
    return decoded.exp > Math.floor(Date.now() / 1000);
  } catch (err) {
    return false;
  }
};
