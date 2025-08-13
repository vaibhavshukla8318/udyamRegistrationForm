const express = require('express');
const router = express.Router();
const { requestAadhaarOtp, confirmAadhaarOtp, requestPanOtp, confirmPanOtp } = require('../controllers/verificationController');
const { otpLimiter } = require('../middlewares/authRateLimiter');

router.post('/aadhaar/request-otp', otpLimiter, requestAadhaarOtp);
router.post('/aadhaar/confirm-otp', otpLimiter, confirmAadhaarOtp);
router.post('/pan/request-otp', otpLimiter, requestPanOtp);
router.post('/pan/confirm-otp', otpLimiter, confirmPanOtp);

module.exports = router;
