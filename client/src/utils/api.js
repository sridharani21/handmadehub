import axios from 'axios';

const api = axios.create({
  baseURL: 'https://handmadehub-2.onrender.com/api', // your Render backend URL
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
  return config;
});

export default api;