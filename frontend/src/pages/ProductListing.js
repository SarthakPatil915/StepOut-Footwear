import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import QuickAddToCart from '../components/QuickAddToCart';
import api from '../utils/axiosInstance';
import { productEndpoints } from '../utils/apiEndpoints';
import toast from 'react-hot-toast';

const ProductListing = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    search: '',
    minPrice: '',
    maxPrice: '',
    brand: '',
    sort: 'newest',
  });

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.category) params.category = filters.category;
      if (filters.search) params.search = filters.search;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.brand) params.brand = filters.brand;
      if (filters.sort) params.sort = filters.sort;

      const response = await api.get(productEndpoints.GET_ALL_PRODUCTS, { params });
      setProducts(response.data.products);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load products');
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white p-4 rounded-lg shadow-md sticky top-20">
            <h3 className="text-xl font-bold mb-4">Filters</h3>

            {/* Search */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Search</label>
              <input
                type="text"
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            {/* Category */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">All Categories</option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Sports">Sports</option>
                <option value="Casual">Casual</option>
                <option value="Formal">Formal</option>
              </select>
            </div>

            {/* Price Range */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Price Range</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="w-full px-2 py-2 border rounded-lg text-sm"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="w-full px-2 py-2 border rounded-lg text-sm"
                />
              </div>
            </div>

            {/* Brand */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Brand</label>
              <input
                type="text"
                placeholder="Filter by brand..."
                value={filters.brand}
                onChange={(e) => handleFilterChange('brand', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            {/* Sort */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Sort By</label>
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="md:col-span-3">
          <h1 className="text-3xl font-bold mb-6">Products</h1>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product._id}>
                  <ProductCard 
                    product={product}
                    onClick={() => navigate(`/product/${product._id}`)}
                    onQuickAdd={(product) => {
                      setSelectedProduct(product);
                      setIsQuickAddOpen(true);
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-gray-500">No products found</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Add to Cart Modal */}
      <QuickAddToCart 
        product={selectedProduct}
        isOpen={isQuickAddOpen}
        onClose={() => {
          setIsQuickAddOpen(false);
          setSelectedProduct(null);
        }}
      />
    </div>
  );
};

export default ProductListing;
