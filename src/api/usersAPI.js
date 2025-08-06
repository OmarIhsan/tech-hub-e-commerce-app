import api from '../config/axios';

// Users API (based on actual Swagger endpoints)
export const usersAPI = {
  getAll: (params = {}) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  getMe: () => api.get('/users/me'),
  create: (userData) => api.post('/users/register', userData), // Admin only
  update: (id, userData) => api.put(`/users/${id}`, userData),
  delete: (id) => api.delete(`/users/${id}`),
};

export default usersAPI;