const express = require('express');
const { register, verifyEmail, resendCode, login } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/verify', verifyEmail);
router.post('/resend-code', resendCode);
router.post('/login', login);

module.exports = router;
