import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Attach JWT token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth?action=register', userData),
  login: (credentials) => api.post('/auth?action=login', credentials),
};

// Tasks API
export const tasksAPI = {
  getAll: () => api.get('/tasks'),
  create: (taskData) => api.post('/tasks', taskData),
  update: (id, taskData) => api.put(`/tasks?id=${id}`, taskData),
  delete: (id) => api.delete(`/tasks?id=${id}`),
};

// Users API
export const usersAPI = {
  getAll: () => api.get('/users'),
};

export default api;
