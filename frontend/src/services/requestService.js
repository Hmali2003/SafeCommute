import api from './api';

export async function createRequest({ reason, latitude, longitude, imageFile }) {
  const formData = new FormData();
  formData.append('reason', reason);
  formData.append('latitude', latitude);
  formData.append('longitude', longitude);
  if (imageFile) formData.append('image', imageFile);

  const { data } = await api.post('/api/employee/requests', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function getMyRequests() {
  const { data } = await api.get('/api/employee/requests');
  return data;
}

export async function getAllRequests(statusFilter = null) {
  const params = statusFilter ? { status: statusFilter } : {};
  const { data } = await api.get('/api/manager/requests', { params });
  return data;
}

export async function getRequestDetail(requestId) {
  const { data } = await api.get(`/api/manager/requests/${requestId}`);
  return data;
}

export async function makeDecision(requestId, status, managerComment) {
  const { data } = await api.patch(`/api/manager/requests/${requestId}/decision`, {
    status,
    manager_comment: managerComment,
  });
  return data;
}