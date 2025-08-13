import React, { useState } from 'react';
import { requestPanOtp, confirmPanOtp } from '../api';

export default function PanOtpModal({ pan, onVerified, onClose }) {
  const [txId, setTxId] = useState(null);
  const [otp, setOtp] = useState('');
  const [stage, setStage] = useState('init');
  const [error, setError] = useState('');
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);


  async function sendOtp() {
    setStage('sending');
    setError('');
    setAlreadyRegistered(false);
    
    try {
      const res = await requestPanOtp(pan);
      console.log(res);
      setTxId(res.data.txId);
      setStage('sent');
    } catch (err) {
      if (err?.response?.status === 409) {
        setAlreadyRegistered(true);
        setError('');
      } else {
        setError(err?.response?.data?.error || 'Failed to request OTP');
      }
      setStage('error');
    }
  }

  async function confirm() {
    setError('');
    if (!/^\d{6}$/.test(otp)) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }
    try {
      const res = await confirmPanOtp(txId, otp);
      if (res.data.verified) {
        onVerified(true);
        onClose();
      } else {
        setError('OTP invalid or verification failed');
      }
    } catch (err) {
      setError('Verification failed');
    }
  }

  return (
    <div className="modal">
      {alreadyRegistered && (
        <div className="error" style={{ marginBottom: 8, color: "red" }}>
          PAN already registered
        </div>
      )}
      <h3>PAN verification</h3>
      {!txId ? (
        <>
          <p>Send 6 Digit OTP to PAN: {pan}</p>
          {alreadyRegistered ? (
            <button style={{ backgroundColor: "gray", cursor: "not-allowed" }}>Send OTP</button>
          ) : (
            <button onClick={sendOtp}>Send OTP</button>
          )}
        </>
      ) : (
        <>
          <input
            value={otp}
            onChange={e => setOtp(e.target.value)}
            placeholder="Enter OTP"
            maxLength={6}
          />
          <button onClick={confirm}>Verify</button>
        </>
      )}
      {error && <div className="error">{error}</div>}
      <button onClick={onClose}>Close</button>
    </div>
  );
}