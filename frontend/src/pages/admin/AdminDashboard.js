import React, { useState, useEffect } from 'react';
import api from '../../utils/axiosInstance';
import { productEndpoints, orderEndpoints } from '../../utils/apiEndpoints';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [productsRes, ordersRes] = await Promise.all([
        api.get(productEndpoints.GET_ADMIN_PRODUCTS),
        api.get(orderEndpoints.GET_ALL_ORDERS),
      ]);

      const products = productsRes.data.products;
      const orders = ordersRes.data.orders;

      const totalRevenue = orders.reduce((sum, order) => sum + order.finalAmount, 0);
      const pendingOrders = orders.filter((order) => order.orderStatus === 'Pending').length;

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalRevenue,
        pendingOrders,
      });
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load stats');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-600">Total Products</p>
          <p className="text-4xl font-bold text-orange-500">{stats.totalProducts}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-600">Total Orders</p>
          <p className="text-4xl font-bold text-blue-500">{stats.totalOrders}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-600">Total Revenue</p>
          <p className="text-4xl font-bold text-green-500">₹{stats.totalRevenue}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-600">Pending Orders</p>
          <p className="text-4xl font-bold text-yellow-500">{stats.pendingOrders}</p>
        </div>
      </div>

      <div className="mt-8 bg-blue-100 border-l-4 border-blue-500 p-4 rounded">
        <p className="text-blue-700">
          <span className="font-bold">Welcome Admin!</span> Use the navigation menu to manage products, orders, and users.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
