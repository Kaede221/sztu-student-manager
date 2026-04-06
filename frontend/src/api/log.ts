import request from '../utils/request';

export function getOperationLogs(page = 1, size = 10) {
  return request.get('/log', { params: { page, size } });
}
