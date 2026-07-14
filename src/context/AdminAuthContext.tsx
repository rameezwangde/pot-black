import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ADMIN_SESSION_EXPIRED_EVENT, getCurrentAdmin, loginAdmin, SESSION_EXPIRED_MESSAGE } from '../services/adminService';
import { clearAdminSession, getAdminToken, getAdminTokenExpiry, getStoredAdmin, setAdminSession, type AdminUser } from '../utils/adminAuthStorage';
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

  const expireSession = useCallback(() => {
    const from = location.pathname.startsWith('/admin') && location.pathname !== '/admin/login'
      ? { pathname: location.pathname, search: location.search, hash: location.hash }
      : undefined;
    clearAdminSession();
    setToken(null); setAdmin(null); setIsAdminVerified(false); setAuthError(''); setIsAuthLoading(false);
    navigate('/admin/login', { replace: true, state: { message: SESSION_EXPIRED_MESSAGE, from } });
  }, [location.hash, location.pathname, location.search, navigate]);

  useEffect(() => { void refreshAdmin(); }, [refreshAdmin]);
  useEffect(() => {
    const handleExpiredSession = () => expireSession();
    window.addEventListener(ADMIN_SESSION_EXPIRED_EVENT, handleExpiredSession);
    return () => window.removeEventListener(ADMIN_SESSION_EXPIRED_EVENT, handleExpiredSession);
  }, [expireSession]);

  useEffect(() => {
    if (!token) return;
    const expiresAt = getAdminTokenExpiry(token);
    if (!expiresAt) return;
    let timer = 0;
    const checkExpiry = () => {
      const remaining = expiresAt - Date.now();
      if (remaining <= 0) { expireSession(); return; }
      timer = window.setTimeout(checkExpiry, Math.min(remaining, 60 * 60 * 1000));
    };
    checkExpiry();
    return () => window.clearTimeout(timer);
  }, [expireSession, token]);

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


