const { number } = require('joi');
const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  businessName: { type: String, required: true, trim: true },
  ownerName: { type: String, required: true, trim: true },
  aadhaar: { type: String, required: true, unique: true },
  pan: { type: String, required: true, unique: true },
  panVerified: { type: Boolean, default: false },
  aadhaarVerified: { type: Boolean, default: false },
  otp:{
      type: String
    },
  pinCode: { type: String },
  city: { type: String },
  state: { type: String },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Add indexes for uniqueness
registrationSchema.index({ pan: 1 }, { unique: false });

module.exports = mongoose.model('Registration', registrationSchema);
