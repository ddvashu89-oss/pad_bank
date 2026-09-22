import api from './api';

export async function fetchSystemStatus() {
  const { data } = await api.get('/system/status');
  return data;
}
