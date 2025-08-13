const Registration = require('../models/Registration');
const { hashValue } = require('../utils/hashUtils');

async function createRegistration(req, res, next) {
  try {
    const payload = req.validatedBody;

    const hashedAadhaar = hashValue(payload.aadhaar);
    const hashedPan = hashValue(payload.pan);

    // Check duplicates by hashed values
    const exists = await Registration.findOne({
      $or: [{ aadhaar: hashedAadhaar }, { pan: hashedPan }]
    });
    if (exists) {
      return res.status(409).json({ success: false, error: 'Aadhaar or PAN already registered' });
    }

    const record = new Registration({
      businessName: payload.businessName,
      ownerName: payload.ownerName,
      aadhaar: hashedAadhaar,
      pan: hashedPan,
      otp: payload.otp,
      pinCode: payload.pinCode,
      city: payload.city,
      state: payload.state,
      aadhaarVerified: payload.aadhaarVerified || false,
      panVerified: payload.panVerified || false
    });

    await record.save();
    res.status(201).json({ success: true, id: record._id });
  } catch (err) {
    return next(err);
  }
}

module.exports = { createRegistration };
