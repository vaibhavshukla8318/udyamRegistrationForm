const express = require('express');
const router = express.Router();
const validateSchema = require('../middlewares/validateSchema');
const { createRegistration } = require('../controllers/registrationController');

router.post('/', validateSchema, createRegistration);

module.exports = router;
