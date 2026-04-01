const express = require('express');
const {
  generateCaptcha,
  getCaptchaImage,
  verifyCaptcha,
  getCaptchaSessionsCount,
} = require('../controllers/captchaController');

const router = express.Router();

// Generate new CAPTCHA
router.post('/generate', generateCaptcha);

// Get CAPTCHA image/visual
router.get('/:sessionId', getCaptchaImage);

// Verify CAPTCHA
router.post('/verify', verifyCaptcha);

// Get active sessions (for debugging)
router.get('/sessions/count', getCaptchaSessionsCount);

module.exports = router;
