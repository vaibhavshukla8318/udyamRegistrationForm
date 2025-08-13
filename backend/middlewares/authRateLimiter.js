const rateLimit = require('express-rate-limit');

const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 min
  max: 5,
  message: "Too many OTP requests from this IP, please try later."
});

module.exports = { otpLimiter };
