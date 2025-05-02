import axios from 'axios';

const api = axios.create({
  baseURL: 'https://stamuraitask-production.up.railway.app', // Adjust if your backend runs elsewhere
});

export default api;
