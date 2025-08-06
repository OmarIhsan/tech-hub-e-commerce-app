import api, { guestApi } from '../config/axios';

// Categories API (based on actual Swagger endpoints)
export const categoriesAPI = {
  getAll: (params = {}) => guestApi.get('/categories', { params }), // Support pagination
  getById: (id) => guestApi.get(`/categories/${id}`),
  getCount: () => guestApi.get('/categories/count'),
  create: (categoryData) => api.post('/categories', categoryData),
  update: (id, categoryData) => api.put(`/categories/${id}`, categoryData),
  delete: (id) => api.delete(`/categories/${id}`),
};

export default categoriesAPI;