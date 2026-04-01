const { createCaptchaSession } = require('../utils/captcha');

// Store in-memory CAPTCHA sessions (in production, use Redis or session store)
const captchaSessions = new Map();

// Generate CAPTCHA
exports.generateCaptcha = (req, res) => {
  try {
    const sessionId = require('crypto').randomBytes(16).toString('hex');
    const captchaSession = createCaptchaSession();
    
    // Store CAPTCHA session
    captchaSessions.set(sessionId, captchaSession);

    // Clean up old sessions after 10 minutes
    if (captchaSessions.size > 1000) {
      for (let [key, value] of captchaSessions.entries()) {
        if (new Date() > value.expiresAt) {
          captchaSessions.delete(key);
        }
      }
    }

    res.status(200).json({
      success: true,
      sessionId,
      captchaCode: captchaSession.code,
      message: 'CAPTCHA generated successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get CAPTCHA image representation (returns dots/visual)
exports.getCaptchaImage = (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId || !captchaSessions.has(sessionId)) {
      return res.status(400).json({ success: false, message: 'Invalid session' });
    }

    const session = captchaSessions.get(sessionId);

    if (new Date() > session.expiresAt) {
      captchaSessions.delete(sessionId);
      return res.status(400).json({ success: false, message: 'CAPTCHA expired' });
    }

    // Return masked CAPTCHA (for frontend to render as visual puzzle)
    const maskedCaptcha = session.code.split('').map(() => '_').join(' ');

    res.status(200).json({
      success: true,
      captcha: maskedCaptcha,
      sessionId,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Verify CAPTCHA
exports.verifyCaptcha = (req, res) => {
  try {
    const { sessionId, userInput } = req.body;

    if (!sessionId || !userInput) {
      return res.status(400).json({ 
        success: false, 
        message: 'Session ID and CAPTCHA code are required' 
      });
    }

    if (!captchaSessions.has(sessionId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid or expired CAPTCHA session' 
      });
    }

    const session = captchaSessions.get(sessionId);

    if (!session || new Date() > session.expiresAt) {
      captchaSessions.delete(sessionId);
      return res.status(400).json({ 
        success: false, 
        message: 'CAPTCHA expired. Please refresh and try again.' 
      });
    }

    // Exact match - case sensitive for stronger security
    const isValid = userInput.trim() === session.code;

    if (!isValid) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid CAPTCHA. Please check uppercase and lowercase letters.' 
      });
    }

    // Only delete session after successful verification
    captchaSessions.delete(sessionId);

    res.status(200).json({ 
      success: true, 
      message: 'CAPTCHA verified successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Get sessions map for debugging (optional)
exports.getCaptchaSessionsCount = (req, res) => {
  res.status(200).json({
    success: true,
    activeSessions: captchaSessions.size,
  });
};
