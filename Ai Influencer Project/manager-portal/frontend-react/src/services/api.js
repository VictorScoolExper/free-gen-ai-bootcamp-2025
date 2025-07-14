import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Dashboard API calls
export const dashboardAPI = {
  getRecentChats: () => api.get('/dashboard/recent-chats'),
  getNewestSubscribers: () => api.get('/dashboard/newest-subscribers'),
  getRecentUnreadMessages: () => api.get('/dashboard/recent-unread-messages'),
  getCurrentMood: () => api.get('/dashboard/current-mood'),
  getTotalSubscribers: () => api.get('/dashboard/total-subscribers'),
  getNewSubscribersToday: () => api.get('/dashboard/new-subscribers-today'),
};

// Messages API calls
export const messagesAPI = {
  getMessages: (conversationId) => api.get(`/messages?conversation_id=${conversationId}`),
  sendMessage: (data) => api.post('/messages', data),
  getMessagesBySubscriber: (subscriberId) => api.get(`/messages/by-subscriber/${subscriberId}`),
  updateMessage: (messageId, data) => api.put(`/messages/${messageId}`, data),
  deleteMessage: (messageId) => api.delete(`/messages/${messageId}`),
};

// Mental State API calls
export const mentalStateAPI = {
  getLatest: () => api.get('/mental-state/latest'),
  getLastWeek: () => api.get('/mental-state/last-week'),
  create: (data) => api.post('/mental-state', data),
};

// Subscribers API calls
export const subscribersAPI = {
  getAll: () => api.get('/subscribers'),
  getById: (id) => api.get(`/subscribers/${id}`),
  getRecentActivity: () => api.get('/subscribers/recent-activity'),
  create: (data) => api.post('/subscribers', data),
  update: (id, data) => api.put(`/subscribers/${id}`, data),
  delete: (id) => api.delete(`/subscribers/${id}`),
};

// Diaries API calls
export const diariesAPI = {
  getAll: () => api.get('/diaries'),
  getById: (id) => api.get(`/diaries/${id}`),
  getLatest: () => api.get('/diaries/latest'),
  searchByDate: (date) => api.get(`/diaries/search?date=${date}`),
  create: (data) => api.post('/diaries', data),
  update: (id, data) => api.put(`/diaries/${id}`, data),
  delete: (id) => api.delete(`/diaries/${id}`),
};

export default api; 