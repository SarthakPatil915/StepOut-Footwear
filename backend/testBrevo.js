/**
 * Test Brevo Configuration
 * 
 * Run this file with: node testBrevo.js
 * This will test if your Brevo API key and configuration are correct
 */

require('dotenv').config();
const axios = require('axios');

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_API_URL = process.env.BREVO_API_URL || 'https://api.brevo.com/v3';
const BREVO_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL;
const BREVO_SENDER_NAME = process.env.BREVO_SENDER_NAME;

console.log('🔍 Brevo Configuration Test\n');
console.log('═'.repeat(50));

// Check environment variables
console.log('\n📋 Configuration Check:');
console.log(`✓ BREVO_API_KEY: ${BREVO_API_KEY ? '✅ Configured' : '❌ Missing'}`);
console.log(`✓ BREVO_API_URL: ${BREVO_API_URL ? '✅ ' + BREVO_API_URL : '❌ Missing'}`);
console.log(`✓ BREVO_SENDER_EMAIL: ${BREVO_SENDER_EMAIL ? '✅ ' + BREVO_SENDER_EMAIL : '❌ Missing'}`);
console.log(`✓ BREVO_SENDER_NAME: ${BREVO_SENDER_NAME ? '✅ ' + BREVO_SENDER_NAME : '❌ Missing'}`);

if (!BREVO_API_KEY) {
  console.error('\n❌ BREVO_API_KEY is not set. Please add it to .env file');
  process.exit(1);
}

if (!BREVO_SENDER_EMAIL) {
  console.error('\n❌ BREVO_SENDER_EMAIL is not set. Please add it to .env file');
  process.exit(1);
}

// Test API connection
async function testBrevoConnection() {
  console.log('\n🔗 Testing Brevo API Connection...\n');
  
  try {
    // Create axios instance
    const brevoClient = axios.create({
      baseURL: BREVO_API_URL,
      headers: {
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json',
      },
    });

    // Test 1: Get account info
    console.log('Test 1️⃣  - Fetching Brevo Account Information...');
    try {
      const accountResponse = await brevoClient.get('/account');
      console.log('✅ Account Info Retrieved Successfully!');
      console.log(`   Company: ${accountResponse.data.companyName}`);
      console.log(`   Email: ${accountResponse.data.email}`);
      console.log(`   Credits Available: ${accountResponse.data.emailCredits}`);
    } catch (error) {
      console.log('❌ Failed to fetch account info');
      if (error.response?.status === 401) {
        console.log('   Reason: Invalid API key');
      } else {
        console.log(`   Error: ${error.response?.data?.message || error.message}`);
      }
      throw error;
    }

    // Test 2: Send test email
    console.log('\nTest 2️⃣  - Sending Test Email...\n');
    const testEmail = BREVO_SENDER_EMAIL;
    
    const emailData = {
      sender: {
        name: BREVO_SENDER_NAME,
        email: BREVO_SENDER_EMAIL,
      },
      to: [
        {
          email: testEmail,
          name: 'Test User',
        },
      ],
      subject: '✅ Brevo Test Email - StepOut Configuration',
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h1 style="color: #ff9500; text-align: center; margin-bottom: 30px;">✅ Brevo Configuration Test</h1>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              If you're reading this email, your Brevo API Key is working correctly!
            </p>
            
            <div style="background-color: #e8f5e9; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0; border-left: 4px solid #4caf50;">
              <p style="color: #2e7d32; font-size: 18px; font-weight: bold; margin: 0;">
                🎉 Configuration Successful!
              </p>
            </div>
            
            <p style="color: #666; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
              Your StepOut OTP verification system is ready to send emails. You can now test the registration flow.
            </p>
            
            <p style="color: #999; font-size: 12px; text-align: center;">
              Sent from StepOut Configuration Test
            </p>
          </div>
        </div>
      `,
    };

    console.log(`Sending test email to: ${testEmail}`);
    console.log(`From: ${BREVO_SENDER_NAME} <${BREVO_SENDER_EMAIL}>\n`);
    
    const response = await brevoClient.post('/smtp/email', emailData);
    
    console.log('✅ Test email sent successfully!');
    console.log(`   Message ID: ${response.data.messageId}`);
    console.log(`   Status: ${response.status} ${response.statusText}`);
    
    console.log('\n✅ All Tests Passed!\n');
    console.log('═'.repeat(50));
    console.log('\n📧 Next Steps:');
    console.log('1. Check your email inbox for the test email');
    console.log('2. If received, your Brevo configuration is working!');
    console.log('3. You can now test the OTP registration flow\n');
    console.log('⚠️  Important Notes:');
    console.log("- OTP emails will be sent to the user's registered email");
    console.log('- Ensure the sender email is verified in Brevo account');
    console.log("- Check spam folder if emails don't arrive\n");
    
  } catch (error) {
    console.log('\n❌ Tests Failed!\n');
    console.log('═'.repeat(50));
    console.log('\n🔧 Troubleshooting:\n');
    
    if (error.response?.status === 401) {
      console.log('❌ Authentication Failed (401)');
      console.log('   This means your BREVO_API_KEY is invalid or expired');
      console.log('\n   Solutions:');
      console.log('   1. Go to https://app.brevo.com/');
      console.log('   2. Login to your account');
      console.log('   3. Settings → SMTP & API');
      console.log('   4. Generate a new API key');
      console.log('   5. Update BREVO_API_KEY in .env file');
      console.log('   6. Restart your backend server\n');
      
    } else if (error.response?.status === 400) {
      console.log('❌ Bad Request (400)');
      console.log(`   Error: ${error.response?.data?.message || 'Invalid request'}`);
      console.log('\n   Solutions:');
      console.log('   1. Verify BREVO_SENDER_EMAIL is verified in Brevo');
      console.log('   2. Go to Senders & Contacts in Brevo dashboard');
      console.log('   3. Confirm the sender email is verified');
      console.log('   4. Try again after verification\n');
      
    } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      console.log('❌ Network Connection Failed');
      console.log('   Cannot connect to Brevo API');
      console.log('\n   Solutions:');
      console.log('   1. Check your internet connection');
      console.log('   2. Check if firewall is blocking the connection');
      console.log('   3. Verify BREVO_API_URL is correct\n');
      
    } else {
      console.log(`❌ Error: ${error.message}`);
      console.log('\n   Full Error Details:');
      console.log('   ' + JSON.stringify(error.response?.data, null, 2));
      console.log();
    }
  }
}

// Run the test
testBrevoConnection().catch(err => {
  console.error('Fatal Error:', err.message);
  process.exit(1);
});
