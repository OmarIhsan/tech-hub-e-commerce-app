import api from '../config/axios';

// Wishlist API (based on actual Swagger endpoints)
export const wishlistAPI = {
  getAll: (params = {}) => api.get('/wishlists', { params }),
  getById: (id) => api.get(`/wishlists/${id}`),
  create: (wishlistData) => api.post('/wishlists', wishlistData),
  update: (id, wishlistData) => api.put(`/wishlists/${id}`, wishlistData),
  delete: (id) => api.delete(`/wishlists/${id}`),
  // Legacy methods for backward compatibility
  get: () => api.get('/wishlists'),
  add: (productId) => api.post('/wishlists', { productId }),
  remove: (id) => api.delete(`/wishlists/${id}`),
  clear: () => api.delete('/wishlists'),
};

export default wishlistAPI;