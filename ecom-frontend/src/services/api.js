import axios from 'axios';
import { BASE_URL } from '../config';

export function api(token) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  return axios.create({
    baseURL: BASE_URL + '/api',
    headers
  });
}
