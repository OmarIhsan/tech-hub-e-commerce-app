import api, { guestApi } from '../config/axios';

// Product Images API (based on actual Swagger endpoints)
export const productImagesAPI = {
  getAll: (params = {}) => guestApi.get('/product-images', { params }),
  getByProductId: (productId, params = {}) =>
    guestApi.get(`/product-images/product/${productId}`, { params }),
  getPrimary: (productId) =>
    guestApi.get(`/product-images/product/${productId}`, {
      params: { isPrimary: 'true' },
    }),
  upload: (formData) =>
    api.post('/product-images/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  update: (id, updateData) => api.put(`/product-images/${id}`, updateData),
  delete: (id) => api.delete(`/product-images/${id}`),
};

export default productImagesAPI;