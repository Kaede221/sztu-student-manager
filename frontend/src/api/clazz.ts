import request from '../utils/request';

export function getClassList(page = 1, size = 10) {
  return request.get('/class/list', { params: { page, size } });
}

export function getClassListByDepartment(departmentId: number, page = 1, size = 10) {
  return request.get(`/class/list/${departmentId}`, { params: { page, size } });
}

export function addClass(data: Record<string, unknown>) {
  return request.post('/class', data);
}

export function editClass(data: Record<string, unknown>) {
  return request.put('/class', data);
}

export function deleteClass(id: number) {
  return request.delete(`/class/${id}`);
}
