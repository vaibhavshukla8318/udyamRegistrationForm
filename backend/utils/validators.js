const Joi = require('joi');

const aadhaarRegex = /^[0-9]{12}$/;
const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

const registrationSchema = Joi.object({
  businessName: Joi.string().max(200).required(),
  ownerName: Joi.string().max(100).required(),
  aadhaar: Joi.string().pattern(aadhaarRegex).required(),
  pan: Joi.string().uppercase().pattern(panRegex).required(),
  city: Joi.string().allow(''),           
  state: Joi.string().allow(''),          
  aadhaarVerified: Joi.boolean(),   
  panVerified: Joi.boolean(),  
  pinCode: Joi.string().length(6).pattern(/^[0-9]{6}$/).optional()
});

function validateRegistration(payload) {
  return registrationSchema.validate(payload, { abortEarly: false });
}

module.exports = {
  validateRegistration,
  aadhaarRegex,
  panRegex
};
