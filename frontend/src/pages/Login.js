import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/axiosInstance';
import { authEndpoints } from '../utils/apiEndpoints';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post(authEndpoints.LOGIN, formData);
      login(response.data.user, response.data.token);
      toast.success('Login successful!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAdmin = async () => {
    setLoading(true);
    try {
      const response = await api.post(authEndpoints.ADMIN_LOGIN, {
        email: 'admin@stepout.com',
        password: 'StepOut@123',
      });
      login(response.data.user, response.data.token);
      toast.success('Admin login successful!');
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error('Admin login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-orange-500">StepOut</h1>
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-500"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-500"
              placeholder="Your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t">
          <p className="text-center text-gray-600 mb-4 font-semibold">Demo Login</p>
          <button
            onClick={handleDemoAdmin}
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50"
          >
            Try Admin Demo
          </button>
          <p className="text-xs text-gray-500 text-center mt-2">
            Email: admin@stepout.com | Password: StepOut@123
          </p>
        </div>

        <p className="text-center mt-4 text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-orange-500 font-semibold hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
