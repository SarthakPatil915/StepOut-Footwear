import React, { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import { FiX } from 'react-icons/fi';
import api from '../../utils/axiosInstance';
import { productEndpoints } from '../../utils/apiEndpoints';
import toast from 'react-hot-toast';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Men',
    price: '',
    discount: '',
    stock: '',
    brand: '',
    images: [],
    sizes: [],
  });
  
  const availableSizes = ['5', '6', '7', '8', '9', '10', '11', '12', '13', '14'];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get(productEndpoints.GET_ADMIN_PRODUCTS);
      setProducts(response.data.products);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load products');
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSizeChange = (size, field, value) => {
    const updatedSizes = formData.sizes.map((s) =>
      s.size === size ? { ...s, [field]: parseInt(value) || 0 } : s
    );
    setFormData({ ...formData, sizes: updatedSizes });
  };

  const toggleSize = (size) => {
    const sizeExists = formData.sizes.find((s) => s.size === size);
    if (sizeExists) {
      setFormData({
        ...formData,
        sizes: formData.sizes.filter((s) => s.size !== size),
      });
    } else {
      setFormData({
        ...formData,
        sizes: [...formData.sizes, { size, stock: 0 }],
      });
    }
  };

  // eslint-disable-next-line no-unused-vars
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = [];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result);
        if (newPreviews.length === files.length) {
          // Only add new images to preview, don't overwrite existing ones
          const updatedPreviews = [...imagePreviewUrls, ...newPreviews];
          setImagePreviewUrls(updatedPreviews);
          // Only update with new images (data URLs), preserve existing images
          const updatedImages = editingId 
            ? [...formData.images, ...newPreviews]
            : [...formData.images, ...newPreviews];
          setFormData({
            ...formData,
            images: updatedImages,
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // eslint-disable-next-line no-unused-vars
  const removeImage = (index) => {
    const updatedPreviews = imagePreviewUrls.filter((_, i) => i !== index);
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setImagePreviewUrls(updatedPreviews);
    setFormData({
      ...formData,
      images: updatedImages,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(productEndpoints.UPDATE_PRODUCT(editingId), formData);
        toast.success('Product updated successfully');
      } else {
        await api.post(productEndpoints.CREATE_PRODUCT, formData);
        toast.success('Product created successfully');
      }

      setShowForm(false);
      setEditingId(null);
      setImagePreviewUrls([]);
      setFormData({
        name: '',
        description: '',
        category: 'Men',
        price: '',
        discount: '',
        stock: '',
        brand: '',
        images: [],
        sizes: [],
      });
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save product');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(productEndpoints.DELETE_PRODUCT(id));
        // Remove from local state immediately
        setProducts(products.filter((product) => product._id !== id));
        toast.success('Product deleted successfully');
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const handleEdit = (product) => {
    // Only set relevant fields to avoid sending MongoDB fields back
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      discount: product.discount,
      stock: product.stock,
      brand: product.brand,
      images: product.images || [],
      sizes: product.sizes || [],
    });
    setEditingId(product._id);
    setImagePreviewUrls(product.images || []);
    setShowForm(true);
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Product Management</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setImagePreviewUrls([]);
            setFormData({
              name: '',
              description: '',
              category: 'Men',
              price: '',
              discount: '',
              stock: '',
              brand: '',
              images: [],
              sizes: [],
            });
          }}
          className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
        >
          <FiPlus /> Add Product
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-bold mb-4">{editingId ? 'Edit Product' : 'Add New Product'}</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Product Name"
                value={formData.name}
                onChange={handleFormChange}
                required
                className="px-3 py-2 border rounded-lg"
              />

              <input
                type="text"
                name="brand"
                placeholder="Brand"
                value={formData.brand}
                onChange={handleFormChange}
                required
                className="px-3 py-2 border rounded-lg"
              />

              <select
                name="category"
                value={formData.category}
                onChange={handleFormChange}
                className="px-3 py-2 border rounded-lg"
              >
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Sports">Sports</option>
                <option value="Casual">Casual</option>
                <option value="Formal">Formal</option>
              </select>

              <input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleFormChange}
                required
                className="px-3 py-2 border rounded-lg"
              />

              <input
                type="number"
                name="discount"
                placeholder="Discount %"
                value={formData.discount}
                onChange={handleFormChange}
                className="px-3 py-2 border rounded-lg"
              />

              <input
                type="number"
                name="stock"
                placeholder="Stock Quantity"
                value={formData.stock}
                onChange={handleFormChange}
                required
                className="px-3 py-2 border rounded-lg"
              />
            </div>

            <textarea
              name="description"
              placeholder="Product Description"
              value={formData.description}
              onChange={handleFormChange}
              required
              rows="4"
              className="w-full px-3 py-2 border rounded-lg"
            ></textarea>

            {/* Sizes Selection */}
            <div className="w-full">
              <label className="block text-sm font-semibold mb-3">Available Sizes & Stock</label>
              <div className="space-y-2">
                {availableSizes.map((size) => {
                  const selectedSize = formData.sizes.find((s) => s.size === size);
                  return (
                    <div key={size} className="flex items-center gap-3 p-3 border rounded-lg">
                      <input
                        type="checkbox"
                        id={`size-${size}`}
                        checked={!!selectedSize}
                        onChange={() => toggleSize(size)}
                        className="w-4 h-4 cursor-pointer"
                      />
                      <label htmlFor={`size-${size}`} className="font-semibold w-12 cursor-pointer">
                        Size {size}
                      </label>
                      {selectedSize && (
                        <input
                          type="number"
                          min="0"
                          value={selectedSize.stock || 0}
                          onChange={(e) => handleSizeChange(size, 'stock', e.target.value)}
                          placeholder="Stock quantity"
                          className="px-3 py-1 border rounded-lg flex-1"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Image Upload */}
            <div className="w-full">
              <label className="block text-sm font-semibold mb-2">Product Images</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-orange-500 cursor-pointer">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <div className="text-gray-500">
                    Click to upload images or drag and drop
                  </div>
                </label>
              </div>

              {/* Image Previews */}
              {imagePreviewUrls.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-semibold mb-2">Uploaded Images ({imagePreviewUrls.length})</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {imagePreviewUrls.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt={`Preview ${index}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <FiX size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
              >
                {editingId ? 'Update Product' : 'Add Product'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setImagePreviewUrls([]);
                  setFormData({
                    name: '',
                    description: '',
                    category: 'Men',
                    price: '',
                    discount: '',
                    stock: '',
                    brand: '',
                    images: [],
                    sizes: [],
                  });
                }}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Price</th>
              <th className="px-4 py-3 text-left">Discount</th>
              <th className="px-4 py-3 text-left">Stock</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">{product.name}</td>
                <td className="px-4 py-3">{product.category}</td>
                <td className="px-4 py-3">₹{product.price}</td>
                <td className="px-4 py-3">{product.discount}%</td>
                <td className="px-4 py-3">{product.stock}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductManagement;
