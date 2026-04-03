import request from '../utils/request';

export function getDepartmentList(page = 1, size = 10) {
  return request.get('/department/list', { params: { page, size } });
}

export function addDepartment(data: Record<string, unknown>) {
  return request.post('/department', data);
}

export function editDepartment(data: Record<string, unknown>) {
  return request.put('/department', data);
}

export function deleteDepartment(id: number) {
  return request.delete(`/department/${id}`);
}
