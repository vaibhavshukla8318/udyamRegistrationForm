const express = require('express');
const router = express.Router();

const OTP_TTL_MS = parseInt(process.env.OTP_TTL_MS || `${2 * 60 * 1000}`, 10); // 2 minutes
const MAX_ATTEMPTS = parseInt(process.env.OTP_MAX_ATTEMPTS || '5', 10);

const otpStore = new Map(); 
// txId -> { otp: '1234', type: 'aadhaar'|'pan', expiresAt: 123456789, attempts: 0 }

function generateOtp(length) {
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');
}

function makeTxId(prefix) {
  const now = new Date();
  const iso = now.toISOString().replace(/[-:.TZ]/g, '');
  const rand = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}-${iso}-${rand}`;
}

function saveOtp(txId, otp, type) {
  otpStore.set(txId, {
    otp,
    type,
    attempts: 0,
    expiresAt: Date.now() + OTP_TTL_MS
  });
}

function isExpired(record) {
  return Date.now() > record.expiresAt;
}

/* ---------------- Aadhaar ---------------- */

router.post('/aadhaar/request-otp', (req, res) => {
  const txId = makeTxId('aadhaar');
  const otp = generateOtp(4); // 4-digit for Aadhaar
  saveOtp(txId, otp, 'aadhaar');

  console.log(`[MOCK] Aadhaar OTP for ${txId}: ${otp} (expires in ${OTP_TTL_MS / 1000}s)`);
  
  res.json({ txId, otp, expiresInMs: OTP_TTL_MS });
});

router.post('/aadhaar/confirm-otp', (req, res) => {
  const { txId, otp } = req.body || {};
  const record = otpStore.get(txId);

  if (!record) return res.json({ verified: false, reason: 'not_found' });
  if (isExpired(record)) {
    otpStore.delete(txId);
    return res.json({ verified: false, reason: 'expired' });
  }
  if (record.attempts >= MAX_ATTEMPTS) {
    otpStore.delete(txId);
    return res.json({ verified: false, reason: 'too_many_attempts' });
  }

  record.attempts += 1;

  if (record.otp === otp) {
    otpStore.delete(txId); // one-time use
    return res.json({ verified: true, maskedAadhaar: 'XXXX-XXXX-1234' });
  }

  // remaining attempts if not expired
  const remaining = MAX_ATTEMPTS - record.attempts;
  return res.json({ verified: false, reason: 'invalid_otp', attemptsLeft: Math.max(remaining, 0) });
});

/* ---------------- PAN ---------------- */

router.post('/pan/request-otp', (req, res) => {
  const txId = makeTxId('pan');
  const otp = generateOtp(6); // 6-digit for PAN
  saveOtp(txId, otp, 'pan');

  console.log(`[MOCK] PAN OTP for ${txId}: ${otp} (expires in ${OTP_TTL_MS / 1000}s)`);
  res.json({ txId, otp, expiresInMs: OTP_TTL_MS });
});

router.post('/pan/confirm-otp', (req, res) => {
  const { txId, otp } = req.body || {};
  const record = otpStore.get(txId);

  if (!record) return res.json({ verified: false, reason: 'not_found' });
  if (isExpired(record)) {
    otpStore.delete(txId);
    return res.json({ verified: false, reason: 'expired' });
  }
  if (record.attempts >= MAX_ATTEMPTS) {
    otpStore.delete(txId);
    return res.json({ verified: false, reason: 'too_many_attempts' });
  }

  record.attempts += 1;

  if (record.otp === otp) {
    otpStore.delete(txId);
    return res.json({ verified: true, maskedPan: 'XXXXX1234X' });
  }

  const remaining = MAX_ATTEMPTS - record.attempts;
  return res.json({ verified: false, reason: 'invalid_otp', attemptsLeft: Math.max(remaining, 0) });
});

module.exports = router;
