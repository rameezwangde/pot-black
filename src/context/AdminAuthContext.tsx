import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ADMIN_SESSION_EXPIRED_EVENT, getCurrentAdmin, loginAdmin } from '../services/adminService';
import { clearAdminSession, getAdminToken, getStoredAdmin, setAdminSession, type AdminUser } from '../utils/adminAuthStorage';
import { normalizeApiError } from '../services/apiError';

interface AdminAuthValue {
  admin: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  isAdminVerified: boolean;
  authError: string;
  login: (credentials: { email: string; password: string }, destination?: string) => Promise<void>;
  logout: () => void;
  refreshAdmin: () => Promise<void>;
}
const AdminAuthContext = createContext<AdminAuthValue | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState<string | null>(() => getAdminToken());
  const [admin, setAdmin] = useState<AdminUser | null>(() => getStoredAdmin());
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isAdminVerified, setIsAdminVerified] = useState(false);
  const [authError, setAuthError] = useState('');

  const refreshAdmin = useCallback(async () => {
    setIsAuthLoading(true);
    setAuthError('');
    const storedToken = getAdminToken();
    if (!storedToken) {
      clearAdminSession();
      setToken(null); setAdmin(null); setIsAdminVerified(false); setIsAuthLoading(false); return;
    }
    try {
      const currentAdmin = await getCurrentAdmin();
      setAdminSession(storedToken, currentAdmin);
      setToken(storedToken); setAdmin(currentAdmin); setIsAdminVerified(true);
    } catch (error) {
      const apiError = normalizeApiError(error);
      if (apiError.status === 401 || apiError.status === 403) {
        clearAdminSession(); setToken(null); setAdmin(null); setIsAdminVerified(false); setAuthError('');
      } else {
        setToken(storedToken); setIsAdminVerified(false); setAuthError(apiError.message);
      }
    } finally { setIsAuthLoading(false); }
  }, []);

  useEffect(() => { void refreshAdmin(); }, [refreshAdmin]);
  useEffect(() => {
    const handleExpiredSession = (event: Event) => {
      const message = (event as CustomEvent<{ message?: string }>).detail?.message ?? 'Your session has expired. Please sign in again.';
      clearAdminSession(); setToken(null); setAdmin(null); setIsAdminVerified(false); setAuthError(''); setIsAuthLoading(false);
      if (location.pathname.startsWith('/admin')) navigate('/admin/login', { replace: true, state: { message } });
    };
    window.addEventListener(ADMIN_SESSION_EXPIRED_EVENT, handleExpiredSession);
    return () => window.removeEventListener(ADMIN_SESSION_EXPIRED_EVENT, handleExpiredSession);
  }, [location.pathname, navigate]);

  const login = useCallback(async (credentials: { email: string; password: string }, destination = '/admin') => {
    setAuthError('');
    const session = await loginAdmin(credentials);
    setAdminSession(session.token, session.admin);
    try {
      const verifiedAdmin = await getCurrentAdmin();
      setAdminSession(session.token, verifiedAdmin);
      setToken(session.token); setAdmin(verifiedAdmin); setIsAdminVerified(true);
      navigate(destination, { replace: true });
    } catch (error) {
      clearAdminSession(); setToken(null); setAdmin(null); setIsAdminVerified(false); setAuthError('');
      throw error;
    }
  }, [navigate]);

  const logout = useCallback(() => {
    clearAdminSession(); setToken(null); setAdmin(null); setIsAdminVerified(false); setAuthError('');
    navigate('/admin/login', { replace: true });
  }, [navigate]);

  const value = useMemo<AdminAuthValue>(() => ({ admin, token, isAuthenticated: Boolean(token && admin), isAuthLoading, isAdminVerified, authError, login, logout, refreshAdmin }), [admin, token, isAuthLoading, isAdminVerified, authError, login, logout, refreshAdmin]);
  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error('useAdminAuth must be used within AdminAuthProvider.');
  return context;
};


