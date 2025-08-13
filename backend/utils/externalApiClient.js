// const axios = require('axios');

// const client = axios.create({
//   timeout: 10000,
//   headers: {
//     'Content-Type': 'application/json',
//     'Accept': 'application/json',
//   }
// });

// // Example: provider endpoints in env
// async function postToProvider(path, data) {
//   const base = process.env.IDENTITY_PROVIDER_BASEURL;
//   const apiKey = process.env.IDENTITY_PROVIDER_KEY;
//   return client.post(`${base}${path}`, data, {
//     headers: { 'x-api-key': apiKey }
//   });
// }

// module.exports = { postToProvider };




const axios = require('axios');


const client = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

function postToProvider(path, payload) {
  let baseUrl = '';
  if (path.startsWith('/aadhaar')) {
    baseUrl = process.env.AADHAAR_API_URL;
  } else if (path.startsWith('/pan')) {
    baseUrl = process.env.PAN_API_URL;
  } else {
    baseUrl = process.env.IDENTITY_PROVIDER_BASEURL;
  }
  return axios.post(baseUrl + path, payload);
}

module.exports = { postToProvider };