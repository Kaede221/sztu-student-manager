import { jwtDecode } from './jwtDecode';

export function getToken(): string | null {
  return localStorage.getItem('token');
}

export function setToken(token: string) {
  localStorage.setItem('token', token);
}

export function removeToken() {
  localStorage.removeItem('token');
}

export function isLoggedIn(): boolean {
  return !!getToken();
}

interface TokenPayload {
  sub: string;
  role: string;
  exp: number;
}

export function getTokenPayload(): TokenPayload | null {
  const token = getToken();
  if (!token) return null;
  try {
    return jwtDecode(token) as TokenPayload;
  } catch {
    return null;
  }
}

export function getUsername(): string {
  return getTokenPayload()?.sub || '';
}

export function getRole(): string {
  return getTokenPayload()?.role || '';
}
