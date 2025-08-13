const request = require('supertest');
const nock = require('nock');
const app = require('../server'); 

describe('Verification API', () => {
  beforeAll(() => {
    // mock external provider
    nock(process.env.IDENTITY_PROVIDER_BASEURL)
      .post('/aadhaar/request-otp')
      .reply(200, { txId: 'tx-123' });

    nock(process.env.IDENTITY_PROVIDER_BASEURL)
      .post('/aadhaar/confirm-otp')
      .reply(200, { verified: true });
  });

  test('request aadhaar otp', async () => {
    const res = await request(app).post('/api/verify/aadhaar/request-otp').send({ aadhaar: '123456789012' });
    expect(res.statusCode).toBe(200);
    expect(res.body.txId).toBe('tx-123');
  });

  test('confirm aadhaar otp', async () => {
    const res = await request(app).post('/api/verify/aadhaar/confirm-otp').send({ txId: 'tx-123', otp: '111111' });
    expect(res.statusCode).toBe(200);
    expect(res.body.verified).toBe(true);
  });
});
