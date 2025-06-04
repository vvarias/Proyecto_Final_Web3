// client/src/apis/client.js
import axios from 'axios';
import { useAuthStore } from '../store/auth.js';

const BASE_URL = 'http://localhost:3000/api';

const client = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true      // <- importante
});

client.interceptors.request.use(cfg => {
  const { token } = useAuthStore();
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export default client;