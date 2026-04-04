import request from '../utils/request';

export interface LoginParams {
  username: string;
  password: string;
}

export function login(data: LoginParams) {
  return request.post('/user/login', data);
}

export function register(data: LoginParams) {
  return request.post('/user/register', data);
}

export interface UserFilter {
  username?: string;
  role?: string;
  number?: string;
  classId?: number;
  gender?: string;
  phoneNumber?: string;
  status?: boolean;
}

export function getUserList(page = 1, size = 10, filters?: UserFilter) {
  return request.get('/user/list', { params: { page, size, ...filters } });
}

export function getUserById(id: number) {
  return request.get(`/user/${id}`);
}

export function addUser(data: Record<string, unknown>) {
  return request.post('/user', data);
}

export function editUser(data: Record<string, unknown>) {
  return request.put('/user', data);
}

export function deleteUser(id: number) {
  return request.delete(`/user/${id}`);
}

export function getMyInfo() {
  return request.get('/user/me');
}

export function editMyInfo(data: { gender?: string; phoneNumber?: string }) {
  return request.put('/user/me', data);
}

export function getStats() {
  return request.get('/user/stats');
}
