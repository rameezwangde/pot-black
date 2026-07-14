import axios from 'axios';
import { isSafeApiError, normalizeApiError, type SafeApiError } from './apiError';
import { clearAdminSession, getAdminToken, type AdminUser } from '../utils/adminAuthStorage';

const API_URL = import.meta.env.VITE_API_URL;
export const ADMIN_SESSION_EXPIRED_EVENT = 'potblack:admin-session-expired';
export const SESSION_EXPIRED_MESSAGE = 'Session expired. Please login again.';

export type AdminApiError = SafeApiError;

const publicApi = axios.create({ baseURL: API_URL, headers: { 'Content-Type': 'application/json' }, timeout: 15000 });
export const adminApi = axios.create({ baseURL: API_URL, headers: { 'Content-Type': 'application/json' }, timeout: 15000 });
const sessionFailureCodes = new Set(['AUTH_TOKEN_REQUIRED', 'AUTH_TOKEN_INVALID', 'AUTH_TOKEN_EXPIRED', 'ADMIN_NOT_FOUND', 'ADMIN_INACTIVE']);

const toAdminError = (error: unknown): AdminApiError => normalizeApiError(error);

adminApi.interceptors.request.use((config) => {
  const token = getAdminToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

adminApi.interceptors.response.use(response => response, (error) => {
  const adminError = toAdminError(error);
  const hasAdminSession = Boolean(getAdminToken());
  if ((adminError.status === 401 && hasAdminSession) || (adminError.status === 403 && sessionFailureCodes.has(adminError.code))) {
    clearAdminSession();
    window.dispatchEvent(new CustomEvent(ADMIN_SESSION_EXPIRED_EVENT, { detail: { message: SESSION_EXPIRED_MESSAGE } }));
  }
  return Promise.reject(adminError);
});

export const loginAdmin = async ({ email, password }: { email: string; password: string }) => {
  try {
    const response = await publicApi.post<{ data: { token: string; admin: AdminUser } }>('/admin/login', { email, password });
    return response.data.data;
  } catch (error) { throw toAdminError(error); }
};

export const getCurrentAdmin = async () => {
  try {
    const response = await adminApi.get<{ data: { admin: AdminUser } }>('/admin/me');
    return response.data.data.admin;
  } catch (error) {
    if (isSafeApiError(error)) throw error;
    throw toAdminError(error);
  }
};
