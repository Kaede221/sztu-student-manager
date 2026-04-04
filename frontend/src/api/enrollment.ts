import request from '../utils/request';

export function enrollCourse(courseId: number) {
  return request.post(`/enrollment/enroll/${courseId}`);
}

export function dropCourse(courseId: number) {
  return request.post(`/enrollment/drop/${courseId}`);
}

export function getMyEnrollments() {
  return request.get('/enrollment/my');
}

export function getEnrollmentsByCourse(courseId: number) {
  return request.get(`/enrollment/list/${courseId}`);
}
