const Registration = require('../models/Registration');
const { postToProvider } = require('../utils/externalApiClient');
const { hashValue } = require('../utils/hashUtils');

function validateAadhaar(aadhaar) {
  return /^\d{12}$/.test(aadhaar);
}

function validatePan(pan) {
  return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);
}

async function requestAadhaarOtp(req, res) {
  try {
    const { aadhaar } = req.body;

    // 1️⃣ Validate Aadhaar
    if (!validateAadhaar(aadhaar)) {
      return res.status(400).json({ success: false, error: 'Invalid Aadhaar number format.' });
    }

    const hashedAadhaar = hashValue(aadhaar);

    // 2️⃣ Check duplicate
    if (await Registration.findOne({ aadhaar: hashedAadhaar })) {
      return res.status(409).json({ success: false, error: 'Aadhaar already registered.' });
    }

    // 3️⃣ Request OTP
    let providerResp;
    try {
      providerResp = await postToProvider('/aadhaar/request-otp', { aadhaar });
    } catch (err) {
      console.error("OTP Provider Error (Aadhaar):", err.message);
      return res.status(502).json({ success: false, error: 'Failed to request Aadhaar OTP.' });
    }

    if (!providerResp?.data?.txId || !providerResp?.data?.otp) {
      return res.status(500).json({ success: false, error: 'Invalid OTP provider response.' });
    }

    return res.json({
      success: true,
      txId: providerResp.data.txId,
      otp: providerResp.data.otp,
      expiresInMs: providerResp.data.expiresInMs || 300000
    });

  } catch (err) {
    console.error("Unexpected Error in requestAadhaarOtp:", err);
    return res.status(500).json({ success: false, error: 'Internal server error.' });
  }
}

async function confirmAadhaarOtp(req, res) {
  try {
    const { txId, otp } = req.body;

    if (!txId || !otp) {
      return res.status(400).json({ success: false, error: 'txId and OTP are required.' });
    }

    let providerResp;
    try {
      providerResp = await postToProvider('/aadhaar/confirm-otp', { txId, otp });
    } catch (err) {
      console.error("OTP Provider Error (Aadhaar Confirm):", err.message);
      return res.status(502).json({ success: false, error: 'Failed to confirm Aadhaar OTP.' });
    }

    return res.json({
      success: true,
      verified: providerResp.data?.verified || false
    });

  } catch (err) {
    console.error("Unexpected Error in confirmAadhaarOtp:", err);
    return res.status(500).json({ success: false, error: 'Internal server error.' });
  }
}

async function requestPanOtp(req, res) {
  try {
    const { pan } = req.body;

    // 1️⃣ Validate PAN
    if (!validatePan(pan)) {
      return res.status(400).json({ success: false, error: 'Invalid PAN number format.' });
    }

    const hashedPan = hashValue(pan);

    // 2️⃣ Check duplicate
    if (await Registration.findOne({ pan: hashedPan })) {
      return res.status(409).json({ success: false, error: 'PAN already registered.' });
    }

    // 3️⃣ Request OTP
    let providerResp;
    try {
      providerResp = await postToProvider('/pan/request-otp', { pan });
    } catch (err) {
      console.error("OTP Provider Error (PAN):", err.message);
      return res.status(502).json({ success: false, error: 'Failed to request PAN OTP.' });
    }

    if (!providerResp?.data?.txId || !providerResp?.data?.otp) {
      return res.status(500).json({ success: false, error: 'Invalid OTP provider response.' });
    }

    return res.json({
      success: true,
      txId: providerResp.data.txId,
      otp: providerResp.data.otp,
      expiresInMs: providerResp.data.expiresInMs || 300000
    });

  } catch (err) {
    console.error("Unexpected Error in requestPanOtp:", err);
    return res.status(500).json({ success: false, error: 'Internal server error.' });
  }
}

async function confirmPanOtp(req, res) {
  try {
    const { txId, otp } = req.body;

    if (!txId || !otp) {
      return res.status(400).json({ success: false, error: 'txId and OTP are required.' });
    }

    let providerResp;
    try {
      providerResp = await postToProvider('/pan/confirm-otp', { txId, otp });
    } catch (err) {
      console.error("OTP Provider Error (PAN Confirm):", err.message);
      return res.status(502).json({ success: false, error: 'Failed to confirm PAN OTP.' });
    }

    return res.json({
      success: true,
      verified: providerResp.data?.verified || false
    });

  } catch (err) {
    console.error("Unexpected Error in confirmPanOtp:", err);
    return res.status(500).json({ success: false, error: 'Internal server error.' });
  }
}

module.exports = {
  requestAadhaarOtp,
  confirmAadhaarOtp,
  requestPanOtp,
  confirmPanOtp
};
