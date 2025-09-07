import axios from 'axios';
import { BASE_URL } from '../config';

export async function signup({ name, email, password }) {
  const res = await axios.post(BASE_URL + '/api/auth/signup', { name, email, password });
  if (res.data.token) localStorage.setItem('token', res.data.token);
  return res.data;
}

export async function login({ email, password }) {
  const res = await axios.post(BASE_URL + '/api/auth/login', { email, password });
  if (res.data.token) localStorage.setItem('token', res.data.token);
  return res.data;
}

export async function getMe(token) {
  const res = await axios.get(BASE_URL + '/api/auth/me', { headers: { Authorization: `Bearer ${token}` }});
  return res.data;
}
