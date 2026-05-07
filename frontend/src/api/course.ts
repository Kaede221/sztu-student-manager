import request from '../utils/request';

export function getCourseList(page = 1, size = 10) {
  return request.get('/course/list', { params: { page, size } });
}

export function addCourse(data: Record<string, unknown>) {
  return request.post('/course', data);
}

export function editCourse(data: Record<string, unknown>) {
  return request.put('/course', data);
}

export function deleteCourse(id: number) {
  return request.delete(`/course/${id}`);
}
