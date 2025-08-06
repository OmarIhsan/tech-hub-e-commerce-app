import api from '../config/axios';

// Shipping Addresses API (based on actual Swagger endpoints)
export const shippingAddressesAPI = {
  getAll: (params = {}) => api.get('/shipping/addresses', { params }),
  getById: (id) => api.get(`/shipping/addresses/${id}`),
  create: (addressData) => api.post('/shipping/addresses', addressData),
  update: (id, addressData) =>
    api.put(`/shipping/addresses/${id}`, addressData),
  delete: (id) => api.delete(`/shipping/addresses/${id}`),
};

export default shippingAddressesAPI;