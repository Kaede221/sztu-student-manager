import request from '../utils/request';

export function getTeacherList(page = 1, size = 10) {
  return request.get('/teacher/list', { params: { page, size } });
}

export function getTeacherById(id: number) {
  return request.get(`/teacher/${id}`);
}

export function addTeacher(data: Record<string, unknown>) {
  return request.post('/teacher', data);
}

export function editTeacher(data: Record<string, unknown>) {
  return request.put('/teacher', data);
}

export function deleteTeacher(id: number) {
  return request.delete(`/teacher/${id}`);
}
