import { api } from './api';

export async function fetchItems(params) {
  const token = localStorage.getItem('token');
  const res = await api(token).get('/items', { params });
  return res.data;
}
