import api from '../config/axios';

// Reviews API (based on actual Swagger endpoints)
export const reviewsAPI = {
  getAll: (params = {}) => api.get('/reviews', { params }),
  getById: (id) => api.get(`/reviews/${id}`),
  getByProduct: (productId, params = {}) =>
    api.get(`/products/${productId}/reviews`, { params }),
  create: (reviewData) => api.post('/reviews', reviewData),
  createForProduct: (productId, reviewData) =>
    api.post(`/products/${productId}/reviews`, reviewData),
  update: (id, reviewData) => api.put(`/reviews/${id}`, reviewData),
  delete: (id) => api.delete(`/reviews/${id}`),
};

export default reviewsAPI;