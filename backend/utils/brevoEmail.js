const axios = require('axios');

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_API_URL = process.env.BREVO_API_URL || 'https://api.brevo.com/v3';

// Create axios instance with Brevo config
const brevoClient = axios.create({
  baseURL: BREVO_API_URL,
  headers: {
    'api-key': BREVO_API_KEY,
    'Content-Type': 'application/json',
  },
});

/**
 * Send OTP via Brevo Email Service
 * @param {string} recipientEmail - Recipient's email address
 * @param {string} recipientName - Recipient's name
 * @param {string} otp - OTP to send
 * @returns {Promise}
 */
const sendOTPEmail = async (recipientEmail, recipientName, otp) => {
  try {
    if (!BREVO_API_KEY) {
      throw new Error('BREVO_API_KEY is not configured in environment variables');
    }

    const emailData = {
      sender: {
        name: process.env.BREVO_SENDER_NAME || 'StepOut',
        email: process.env.BREVO_SENDER_EMAIL || 'noreply@stepout.com',
      },
      to: [
        {
          email: recipientEmail,
          name: recipientName,
        },
      ],
      subject: 'Verify Your Email - StepOut',
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h1 style="color: #ff9500; text-align: center; margin-bottom: 30px;">StepOut</h1>
            
            <h2 style="color: #333; text-align: center; margin-bottom: 20px;">Email Verification</h2>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Hi <strong>${recipientName}</strong>,
            </p>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
              Thank you for signing up with StepOut! To complete your registration, please verify your email address using the OTP below.
            </p>
            
            <div style="background-color: #f0f0f0; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
              <p style="color: #999; font-size: 12px; margin-bottom: 10px;">Your verification code:</p>
              <p style="color: #ff9500; font-size: 36px; font-weight: bold; letter-spacing: 5px; margin: 0;">
                ${otp}
              </p>
            </div>
            
            <p style="color: #666; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
              This OTP will expire in <strong>10 minutes</strong>. Do not share this code with anyone.
            </p>
            
            <p style="color: #666; font-size: 14px; line-height: 1.6; margin-bottom: 30px;">
              If you didn't sign up for a StepOut account, please ignore this email.
            </p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center;">
              © 2024 StepOut. All rights reserved.
            </p>
          </div>
        </div>
      `,
    };

    console.log('Sending OTP email to:', recipientEmail);
    console.log('Using Brevo API URL:', BREVO_API_URL);
    console.log('Brevo API Key configured:', !!BREVO_API_KEY);
    
    const response = await brevoClient.post('/smtp/email', emailData);

    console.log('OTP email sent successfully. Message ID:', response.data.messageId);
    
    return {
      success: true,
      messageId: response.data.messageId,
    };
  } catch (error) {
    console.error('Brevo Email Error Details:');
    console.error('Status Code:', error.response?.status);
    console.error('Error Message:', error.response?.data || error.message);
    console.error('Error Data:', error.response?.data);
    
    let errorMessage = 'Unknown error occurred';
    
    if (error.response?.status === 401) {
      errorMessage = 'Invalid Brevo API key. Please check BREVO_API_KEY in .env';
    } else if (error.response?.status === 400) {
      errorMessage = `Brevo API validation error: ${error.response?.data?.message || JSON.stringify(error.response?.data)}`;
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else {
      errorMessage = error.message;
    }
    
    throw new Error(`Failed to send OTP email: ${errorMessage}`);
  }
};

/**
 * Send Welcome Email after successful verification
 * @param {string} recipientEmail - Recipient's email address
 * @param {string} recipientName - Recipient's name
 * @returns {Promise}
 */
const sendWelcomeEmail = async (recipientEmail, recipientName) => {
  try {
    if (!BREVO_API_KEY) {
      throw new Error('BREVO_API_KEY is not configured in environment variables');
    }

    const emailData = {
      sender: {
        name: process.env.BREVO_SENDER_NAME || 'StepOut',
        email: process.env.BREVO_SENDER_EMAIL || 'noreply@stepout.com',
      },
      to: [
        {
          email: recipientEmail,
          name: recipientName,
        },
      ],
      subject: 'Welcome to StepOut!',
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h1 style="color: #ff9500; text-align: center; margin-bottom: 30px;">StepOut</h1>
            
            <h2 style="color: #333; text-align: center; margin-bottom: 20px;">Welcome to StepOut!</h2>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Hi <strong>${recipientName}</strong>,
            </p>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Your email has been verified successfully. Welcome to the StepOut family! You're now ready to explore our collection of premium footwear.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'https://stepout.com'}" style="display: inline-block; background-color: #ff9500; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                Start Shopping
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px; line-height: 1.6; margin-bottom: 30px;">
              If you have any questions, feel free to reach out to our support team. Happy shopping!
            </p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center;">
              © 2024 StepOut. All rights reserved.
            </p>
          </div>
        </div>
      `,
    };

    console.log('Sending welcome email to:', recipientEmail);
    
    const response = await brevoClient.post('/smtp/email', emailData);

    console.log('Welcome email sent successfully. Message ID:', response.data.messageId);
    
    return {
      success: true,
      messageId: response.data.messageId,
    };
  } catch (error) {
    console.error('Brevo Welcome Email Error:', error.response?.data || error.message);
    throw new Error(`Failed to send welcome email: ${error.message}`);
  }
};

module.exports = {
  sendOTPEmail,
  sendWelcomeEmail,
};
