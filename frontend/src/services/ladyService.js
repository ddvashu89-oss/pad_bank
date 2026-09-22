import api from './api';

export async function listLadies(search = '') {
  const { data } = await api.get('/ladies', { params: search ? { search } : {} });
  return data;
}

export async function searchByAadhaar(aadhaar) {
  const { data } = await api.get('/ladies/search', { params: { aadhaar } });
  return data;
}

export async function getLady(id) {
  const { data } = await api.get(`/ladies/${id}`);
  return data;
}

export async function createLady(payload) {
  const { data } = await api.post('/ladies', payload);
  return data;
}

export async function updateLady(id, payload) {
  const { data } = await api.put(`/ladies/${id}`, payload);
  return data;
}

export async function deleteLady(id) {
  const { data } = await api.delete(`/ladies/${id}`);
  return data;
}
