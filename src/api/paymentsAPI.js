import api from '../config/axios';

// Payments API (based on actual Swagger endpoints)
export const paymentsAPI = {
  getAll: (params = {}) => api.get('/payments', { params }),
  getById: (id) => api.get(`/payments/${id}`),
  create: (paymentData) => api.post('/payments', paymentData),
  update: (id, paymentData) => api.put(`/payments/${id}`, paymentData),
  delete: (id) => api.delete(`/payments/${id}`),
  process: (id, processData) => api.put(`/payments/${id}/process`, processData),
};

export default paymentsAPI;