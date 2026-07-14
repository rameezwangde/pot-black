import axios from 'axios';
import { clearAdminSession, getAdminToken, type AdminUser } from '../utils/adminAuthStorage';

const API_URL = import.meta.env.VITE_API_URL;
export const ADMIN_SESSION_EXPIRED_EVENT = 'potblack:admin-session-expired';

export interface AdminApiError { code: string; message: string; status: number; }

const publicApi = axios.create({ baseURL: API_URL, headers: { 'Content-Type': 'application/json' } });
export const adminApi = axios.create({ baseURL: API_URL, headers: { 'Content-Type': 'application/json' } });
const sessionFailureCodes = new Set(['AUTH_TOKEN_REQUIRED', 'AUTH_TOKEN_INVALID', 'AUTH_TOKEN_EXPIRED', 'ADMIN_NOT_FOUND', 'ADMIN_INACTIVE']);

const toAdminError = (error: unknown): AdminApiError => {
  if (axios.isAxiosError(error)) return {
    code: error.response?.data?.code ?? 'ADMIN_API_ERROR',
    message: error.response?.data?.message ?? 'Unable to connect to Pot Black operations. Please try again.',
    status: error.response?.status ?? 0,
  };
  return { code: 'UNEXPECTED_ERROR', message: 'An unexpected error occurred. Please try again.', status: 0 };
};

adminApi.interceptors.request.use((config) => {
  const token = getAdminToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

adminApi.interceptors.response.use(response => response, (error) => {
  const adminError = toAdminError(error);
  if ((adminError.status === 401 || adminError.status === 403) && sessionFailureCodes.has(adminError.code)) {
    clearAdminSession();
    window.dispatchEvent(new CustomEvent(ADMIN_SESSION_EXPIRED_EVENT, { detail: { message: 'Your session has expired. Please sign in again.' } }));
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
    if ((error as AdminApiError).code) throw error;
    throw toAdminError(error);
  }
};
