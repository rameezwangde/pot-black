export const ADMIN_TOKEN_KEY = 'potblack_admin_token';
export const ADMIN_USER_KEY = 'potblack_admin_user';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'manager' | 'receptionist';
  isActive: boolean;
  lastLoginAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export const getAdminToken = () => sessionStorage.getItem(ADMIN_TOKEN_KEY);

export const setAdminSession = (token: string, admin: AdminUser) => {
  sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
  sessionStorage.setItem(ADMIN_USER_KEY, JSON.stringify(admin));
};

export const getStoredAdmin = (): AdminUser | null => {
  const storedAdmin = sessionStorage.getItem(ADMIN_USER_KEY);
  if (!storedAdmin) return null;
  try {
    return JSON.parse(storedAdmin) as AdminUser;
  } catch {
    sessionStorage.removeItem(ADMIN_USER_KEY);
    return null;
  }
};

export const clearAdminSession = () => {
  sessionStorage.removeItem(ADMIN_TOKEN_KEY);
  sessionStorage.removeItem(ADMIN_USER_KEY);
};

// TODO: Consider secure HTTP-only cookies for production admin sessions.
