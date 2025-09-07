import { api } from './api';

export async function getCart() {
  const token = localStorage.getItem('token');
  const res = await api(token).get('/cart');
  return res.data;
}

export async function addToCart(itemId, qty = 1) {
  const token = localStorage.getItem('token');
  const res = await api(token).post('/cart/add', { itemId, qty });
  return res.data;
}

export async function removeFromCart(itemId) {
  const token = localStorage.getItem('token');
  const res = await api(token).post('/cart/remove', { itemId });
  return res.data;
}

export async function updateCart(itemId, qty) {
  const token = localStorage.getItem('token');
  const res = await api(token).post('/cart/update', { itemId, qty });
  return res.data;
}
