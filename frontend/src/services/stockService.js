import api from './api';

export async function listStock() {
  const { data } = await api.get('/stock');
  return data;
}

export async function addStock(payload) {
  const { data } = await api.post('/stock', payload);
  return data;
}
