import axios from 'axios';

const api = axios.create({
  baseURL: 'https://stamurai-task-backend.vercel.app', // Adjust if your backend runs elsewhere
});

export default api;
