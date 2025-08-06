import api from '../config/axios';

// Order Items API (based on actual Swagger endpoints)
export const orderItemsAPI = {
  getAll: (params = {}) => api.get('/order-items', { params }),
  getById: (id) => api.get(`/order-items/${id}`),
  getByOrder: (orderId, params = {}) =>
    api.get(`/orders/${orderId}/items`, { params }),
  create: (orderItemData) => api.post('/order-items', orderItemData),
  update: (id, orderItemData) => api.put(`/order-items/${id}`, orderItemData),
  delete: (id) => api.delete(`/order-items/${id}`),
};

export default orderItemsAPI;