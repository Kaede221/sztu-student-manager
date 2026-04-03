import request from '../utils/request';

export function getStudentList(page = 1, size = 10) {
  return request.get('/student/list', { params: { page, size } });
}

export function getStudentById(id: number) {
  return request.get(`/student/${id}`);
}

export function addStudent(data: Record<string, unknown>) {
  return request.post('/student', data);
}

export function editStudent(data: Record<string, unknown>) {
  return request.put('/student', data);
}

export function deleteStudent(id: number) {
  return request.delete(`/student/${id}`);
}
