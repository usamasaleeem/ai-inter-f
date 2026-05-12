import axios from 'axios';

// 🔐 Private API (with token)
const api = axios.create({
  baseURL: 'https://api.hirelai.com/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 🌐 Public API (NO token ever)
const publicApi = axios.create({
  baseURL: 'https://api.hirelai.com/api',
});

export { api, publicApi };