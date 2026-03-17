import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../utils/axiosInstance';
import { authEndpoints } from '../utils/apiEndpoints';
import toast from 'react-hot-toast';

const VerifyResetOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState(location.state?.email || '');
  const [timer, setTimer] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (!email) {
      toast.error('Please start from forgot password page');
      navigate('/forgot-password');
      return;
    }

    // Timer for OTP expiry
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [email, navigate]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleChange = (e) => {
    const value = e.target.value;
    // Only allow numbers and max 6 digits
    if (/^\d{0,6}$/.test(value)) {
      setOtp(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);

    try {
      await api.post(authEndpoints.VERIFY_RESET_OTP, {
        email,
        otp,
      });

      toast.success('OTP verified successfully');
      navigate('/reset-password', { state: { email, otp } });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);

    try {
      await api.post(authEndpoints.FORGOT_PASSWORD, { email });
      toast.success('New OTP sent to your email');
      setTimer(300);
      setCanResend(false);
      setOtp('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-orange-500">StepOut</h1>
        <h2 className="text-2xl font-bold mb-2 text-center">Verify OTP</h2>
        <p className="text-gray-600 text-center mb-6 text-sm">
          We've sent an OTP to <span className="font-semibold">{email}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Enter OTP</label>
            <input
              type="text"
              value={otp}
              onChange={handleChange}
              maxLength="6"
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 text-center text-2xl tracking-widest"
              placeholder="000000"
            />
            <p className="text-xs text-gray-500 mt-2">Enter the 6-digit OTP sent to your email</p>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              OTP expires in:{' '}
              <span className={timer > 60 ? 'text-green-600' : 'text-red-600'}>
                {formatTime(timer)}
              </span>
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>

        <div className="mt-4 text-center">
          {!canResend ? (
            <p className="text-sm text-gray-600">
              Didn't receive OTP?
            </p>
          ) : (
            <button
              onClick={handleResend}
              disabled={resendLoading || !canResend}
              className="text-sm text-orange-500 font-semibold hover:underline disabled:opacity-50"
            >
              {resendLoading ? 'Resending...' : 'Resend OTP'}
            </button>
          )}
        </div>

        <p className="text-center mt-6 text-gray-600">
          <Link to="/login" className="text-orange-500 font-semibold hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default VerifyResetOTP;
