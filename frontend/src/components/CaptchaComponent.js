import React, { useState, useEffect } from 'react';
import api from '../utils/axiosInstance';
import toast from 'react-hot-toast';

const CaptchaComponent = ({ onVerify, onSessionIdChange }) => {
  const [sessionId, setSessionId] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');
  const [captchaDisplay, setCaptchaDisplay] = useState('');

  // Generate CAPTCHA function
  const generateCaptcha = async () => {
    try {
      setIsLoading(true);
      setError('');
      setUserInput('');
      setIsVerified(false);

      const response = await api.post('/captcha/generate');
      
      if (response.data.success) {
        const newSessionId = response.data.sessionId;
        const captchaCode = response.data.captchaCode;
        
        setSessionId(newSessionId);
        onSessionIdChange?.(newSessionId);
        
        // Use the ACTUAL code from backend, not a random one
        setCaptchaDisplay(captchaCode);
      }
    } catch (error) {
      setError('Failed to generate CAPTCHA');
      toast.error('Failed to generate CAPTCHA');
    } finally {
      setIsLoading(false);
    }
  };

  // Generate CAPTCHA on component mount
  useEffect(() => {
    generateCaptcha();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleVerify = async (e) => {
    if (e) {
      e.preventDefault?.();
    }
    
    if (!userInput.trim()) {
      setError('Please enter the CAPTCHA code');
      return;
    }

    if (!sessionId) {
      setError('CAPTCHA session not found. Please refresh.');
      generateCaptcha();
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      console.log('Verifying CAPTCHA with:', { sessionId, userInput: userInput.trim() });

      const response = await api.post('/captcha/verify', {
        sessionId,
        userInput: userInput.trim(),
      });

      console.log('CAPTCHA verification response:', response.data);

      if (response.data && response.data.success) {
        setIsVerified(true);
        setUserInput('');
        console.log('CAPTCHA verified successfully!');
        onVerify?.(true);
        toast.success('✓ CAPTCHA verified successfully!');
      } else {
        const errorMsg = response.data?.message || 'CAPTCHA verification failed';
        setError(errorMsg);
        setUserInput('');
        setIsVerified(false);
        onVerify?.(false);
        console.log('CAPTCHA verification failed:', errorMsg);
        generateCaptcha();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'CAPTCHA verification failed';
      setError(errorMessage);
      console.error('CAPTCHA Verification Error:', error.response?.data || errorMessage);
      setUserInput('');
      setIsVerified(false);
      onVerify?.(false);
      
      // Generate new CAPTCHA on wrong attempt
      setTimeout(() => {
        generateCaptcha();
      }, 1500);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    generateCaptcha();
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold mb-2">
          Security Verification <span className="text-red-500">*</span>
        </label>
        
        {/* CAPTCHA Display Box */}
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-lg p-6 text-center mb-4">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-2">Enter the letters below:</p>
              <p className="text-4xl font-bold tracking-widest text-orange-600 select-none mb-3 font-mono letter-spacing-wide">
                {captchaDisplay.split('').map((letter, index) => (
                  <span
                    key={index}
                    style={{
                      transform: `rotate(${Math.random() * 20 - 10}deg) skewX(${Math.random() * 10 - 5}deg)`,
                      display: 'inline-block',
                      marginRight: '8px',
                      opacity: 0.7 + Math.random() * 0.3,
                    }}
                  >
                    {letter}
                  </span>
                ))}
              </p>
            </div>
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isLoading}
              className="ml-4 p-2 text-orange-500 hover:bg-orange-100 rounded-lg transition disabled:opacity-50"
              title="Refresh CAPTCHA"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Input Field */}
        <div className="flex gap-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => {
              // Allow uppercase, lowercase, and numbers
              const value = e.target.value;
              if (/^[A-Za-z0-9]*$/.test(value) || value === '') {
                setUserInput(value);
                setError('');
              }
            }}
            placeholder="Letters & numbers (case sensitive)"
            maxLength="6"
            disabled={isVerified || isLoading}
            className="flex-1 px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed font-mono tracking-widest text-center font-bold"
          />
          <button
            type="button"
            onClick={handleVerify}
            disabled={isLoading || isVerified || !userInput}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50 transition whitespace-nowrap"
          >
            {isLoading ? 'Verifying...' : isVerified ? '✓ Verified' : 'Verify'}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {isVerified && (
          <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-600 font-semibold">✓ CAPTCHA verified successfully</p>
          </div>
        )}

        {/* Help Text */}
        
      </div>
    </div>
  );
};

export default CaptchaComponent;
