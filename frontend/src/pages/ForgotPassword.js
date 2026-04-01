import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/axiosInstance';
import { authEndpoints } from '../utils/apiEndpoints';
import toast from 'react-hot-toast';
import CaptchaComponent from '../components/CaptchaComponent';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [email, setEmail] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    if (!agreeToTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }

    if (!isCaptchaVerified) {
      toast.error('Please verify the CAPTCHA first');
      return;
    }

    setLoading(true);

    try {
      await api.post(authEndpoints.FORGOT_PASSWORD, { email });
      toast.success('OTP sent to your email');
      
      // Navigate to OTP verification page with email
      navigate('/verify-reset-otp', { state: { email } });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
      setIsCaptchaVerified(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-orange-500">StepOut</h1>
        <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>
        <p className="text-gray-600 text-center mb-6 text-sm">
          Enter your email address and we'll send you an OTP to reset your password
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-500"
              placeholder="your@email.com"
            />
          </div>

          <div className="flex items-start space-x-2 bg-orange-50 p-4 rounded-lg">
            <input
              type="checkbox"
              id="agree"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              className="mt-1 w-4 h-4 text-orange-500 rounded cursor-pointer"
            />
            <label htmlFor="agree" className="text-sm text-gray-700 cursor-pointer">
              I agree to the{' '}
              <span className="text-orange-500 font-semibold">
                Terms & Conditions for Password Reset
              </span>
              . I understand that an OTP will be sent to my email for security verification.
            </label>
          </div>

          <CaptchaComponent onVerify={setIsCaptchaVerified} />

          <button
            type="submit"
            disabled={loading || !isCaptchaVerified}
            className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50"
          >
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>

        <p className="text-center mt-4 text-gray-600">
          Remember your password?{' '}
          <Link to="/login" className="text-orange-500 font-semibold hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
