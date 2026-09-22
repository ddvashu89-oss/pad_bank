import api from './api';

export async function listDistributions({ from, to } = {}) {
  const params = {};
  if (from) params.from = from;
  if (to) params.to = to;
  const { data } = await api.get('/distributions', { params });
  return data;
}

export async function createDistribution(payload) {
  const { data } = await api.post('/distributions', payload);
  return data;
}
