// CAPTCHA Generation and Verification Utility

// Generate a random CAPTCHA code (letters uppercase, lowercase, and numbers)
const generateCaptcha = () => {
  // Mix of uppercase, lowercase, and numbers for harder CAPTCHA
  const uppercase = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // Removed I, O to avoid confusion
  const lowercase = 'abcdefghjkmnpqrstuvwxyz'; // Removed i, o to avoid confusion
  const numbers = '123456789'; // Removed 0 to avoid confusion with O
  
  const allChars = uppercase + lowercase + numbers;
  let captcha = '';
  
  // Ensure at least 1 uppercase, 1 lowercase, and 1 number
  captcha += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
  captcha += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
  captcha += numbers.charAt(Math.floor(Math.random() * numbers.length));
  
  // Fill remaining 3 characters randomly from all
  for (let i = 0; i < 3; i++) {
    captcha += allChars.charAt(Math.floor(Math.random() * allChars.length));
  }
  
  // Shuffle the captcha string
  captcha = captcha.split('').sort(() => Math.random() - 0.5).join('');
  
  return captcha;
};

// Create CAPTCHA object with expiry
const createCaptchaSession = () => {
  const code = generateCaptcha();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry
  return {
    code,
    expiresAt,
    createdAt: new Date(),
  };
};

// Verify CAPTCHA code (case-sensitive for security)
const verifyCaptcha = (userInput, storedCode, expiresAt) => {
  if (!storedCode || !expiresAt) {
    return { valid: false, message: 'CAPTCHA session not found' };
  }

  if (new Date() > expiresAt) {
    return { valid: false, message: 'CAPTCHA expired. Please refresh.' };
  }

  // Exact match - case sensitive
  if (userInput !== storedCode) {
    return { valid: false, message: 'Invalid CAPTCHA. Please try again.' };
  }

  return { valid: true, message: 'CAPTCHA verified successfully' };
};

module.exports = {
  generateCaptcha,
  createCaptchaSession,
  verifyCaptcha,
};
