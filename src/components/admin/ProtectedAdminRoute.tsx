import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function ProtectedAdminRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isAuthLoading } = useAdminAuth();
  const location = useLocation();
  if (isAuthLoading) return <div className="min-h-screen bg-[#080605] flex items-center justify-center px-6 text-center"><div><img src="/logo.png" alt="Pot Black" className="h-20 w-auto mx-auto mb-7"/><span className="mx-auto block h-8 w-8 rounded-full border border-[#D4AF37]/30 border-t-[#D4AF37] animate-spin"/><p className="mt-5 text-[10px] uppercase tracking-[.28em] text-[#F3E5AB]">Verifying Staff Access</p></div></div>;
  if (!isAuthenticated) return <Navigate to="/admin/login" replace state={{ from: location }} />;
  return children;
}
