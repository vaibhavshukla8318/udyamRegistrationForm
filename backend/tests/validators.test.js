const { aadhaarRegex, panRegex } = require('../utils/validators');

test('valid aadhaar', () => {
  expect(aadhaarRegex.test('123456789012')).toBe(true);
  expect(aadhaarRegex.test('1234')).toBe(false);
});

test('valid pan', () => {
  expect(panRegex.test('ABCDE1234F')).toBe(true);
  expect(panRegex.test('abcde1234f')).toBe(false); // backend requires uppercase
});
