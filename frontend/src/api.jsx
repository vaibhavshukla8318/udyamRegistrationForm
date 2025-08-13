import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true
});

export async function requestAadhaarOtp(aadhaar) {
  return api.post('/verify/aadhaar/request-otp', { aadhaar });
}
export async function confirmAadhaarOtp(txId, otp) {
  return api.post('/verify/aadhaar/confirm-otp', { txId, otp });
}
export async function requestPanOtp(pan) {
  return api.post('/verify/pan/request-otp', { pan });
}
export async function confirmPanOtp(txId, otp) {
  return api.post('/verify/pan/confirm-otp', { txId, otp });
}
export async function postPinLookup(pin) {
  // Example: PostPin provider request (serverless or direct)
  // We'll call a public PostPin API here; production should call backend proxy to hide API keys
  return axios.get(`https://api.postalpincode.in/pincode/${pin}`);
}
export async function submitRegistration(data) {
  return api.post('/registration', data);
}
