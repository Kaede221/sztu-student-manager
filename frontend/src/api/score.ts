import request from '../utils/request';

export function insertScore(data: { enrollmentId: number; score: number }) {
  return request.post('/score', data);
}

export function updateScore(data: { id: number; score: number }) {
  return request.put('/score', data);
}

export function getMyScores() {
  return request.get('/score/my');
}

export function getCourseScores(courseId: number) {
  return request.get(`/score/list/${courseId}`);
}
