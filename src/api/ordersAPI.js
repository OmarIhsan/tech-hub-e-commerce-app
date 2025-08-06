import api, { guestApi } from '../config/axios';

// Orders API (based on actual Swagger endpoints)
export const ordersAPI = {
  getAll: (params = {}) => api.get('/orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  create: (orderData) => api.post('/orders', orderData),
  createWithItems: (orderData) => api.post('/orders', orderData), // For orders with items
  createGuest: (orderData) => guestApi.post('/orders/guest', orderData),
  update: (id, updateData) => api.put(`/orders/${id}`, updateData),
  updateStatus: (id, statusData) => api.put(`/orders/${id}/status`, statusData),
  delete: (id) => api.delete(`/orders/${id}`),
  cancel: (id) => api.delete(`/orders/${id}`),
  getStatus: (id) => api.get(`/orders/${id}/status`),
};

export default ordersAPI;