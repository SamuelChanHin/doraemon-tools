import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || process.env.API_BASE || '';

const api = axios.create({ baseURL: API_BASE, timeout: 5000 });
export default api;
