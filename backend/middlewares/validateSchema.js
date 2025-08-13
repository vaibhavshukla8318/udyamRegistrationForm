const { validateRegistration } = require('../utils/validators');

module.exports = (req, res, next) => {
  const { error, value } = validateRegistration(req.body);
  if (error) {
    return res.status(400).json({ success: false, errors: error.details.map(d => d.message) });
  }
  req.validatedBody = value;
  next();
};
