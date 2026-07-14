import { useEffect, useState, type FormEvent } from 'react';
import { Eye, EyeOff, LockKeyhole } from 'lucide-react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import type { AdminApiError } from '../../services/adminService';
import InlineLoadingLabel from '../../components/common/InlineLoadingLabel';

interface LoginErrors { email?: string; password?: string; }
interface LoginLocationState { message?: string; from?: { pathname?: string; search?: string; hash?: string } }

export default function AdminLoginPage() {
  const { isAuthenticated, isAuthLoading, login } = useAdminAuth();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({});
  const locationState = location.state as LoginLocationState | null;
  const [apiError, setApiError] = useState(locationState?.message ?? '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const requestedPath = locationState?.from?.pathname;
  const isSafeAdminDestination = requestedPath === '/admin' || (requestedPath?.startsWith('/admin/') && requestedPath !== '/admin/login');
  const destination = isSafeAdminDestination
    ? `${requestedPath}${locationState?.from?.search ?? ''}${locationState?.from?.hash ?? ''}`
    : '/admin';

  useEffect(() => {
    if (locationState?.message) setApiError(locationState.message);
  }, [locationState?.message]);

  if (!isAuthLoading && isAuthenticated) return <Navigate to={destination} replace />;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const nextErrors: LoginErrors = {};
    if (!email.trim()) nextErrors.email = 'Email address is required.';
    else if (!/^\S+@\S+\.\S+$/.test(email)) nextErrors.email = 'Enter a valid email address.';
    if (!password) nextErrors.password = 'Password is required.';
    else if (password.length < 8) nextErrors.password = 'Password must contain at least 8 characters.';
    setErrors(nextErrors); setApiError('');
    if (Object.keys(nextErrors).length) return;

    setIsSubmitting(true);
    try {
      await login({ email: email.trim().toLowerCase(), password }, destination);
    } catch (error) {
      const adminError = error as AdminApiError;
      if (adminError.code === 'INVALID_CREDENTIALS') setApiError('Invalid email or password.');
      else if (adminError.code === 'TOO_MANY_LOGIN_ATTEMPTS') setApiError('Too many login attempts. Please wait and try again.');
      else if (adminError.code === 'ADMIN_INACTIVE') setApiError('This staff account is currently inactive.');
      else setApiError(adminError.message || 'Unable to sign in. Please try again.');
    } finally { setIsSubmitting(false); }
  };

  return <main className="relative min-h-[100svh] overflow-x-hidden overflow-y-auto bg-[#080605] px-4 py-6 sm:py-10 text-white flex items-center justify-center">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(92,13,13,.38),transparent_58%)]"/>
    <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-[#D4AF37]/5 blur-[120px]"/>
    <section className="relative w-full max-w-md border border-[#D4AF37]/25 bg-[#180c0d]/95 p-7 sm:p-10 shadow-[0_30px_100px_rgba(0,0,0,.65),0_0_45px_rgba(212,175,55,.06)]">
      <div className="flex items-center justify-between gap-5 border-b border-white/10 pb-6 mb-8"><img src="/logo.png" alt="Pot Black" className="h-16 w-auto"/><LockKeyhole size={22} strokeWidth={1.2} className="text-[#D4AF37]"/></div>
      <p className="text-[9px] uppercase tracking-[.32em] text-[#D4AF37] mb-3">Pot Black Operations</p>
      <h1 className="text-3xl min-[390px]:text-4xl sm:text-5xl text-[#F3E5AB] mb-4">Staff Access</h1>
      <p className="text-sm leading-6 text-gray-400 mb-8">Sign in to manage reservations, table availability, walk-ins and live playing sessions.</p>
      <form onSubmit={submit} noValidate className="space-y-5">
        <label className="block text-[10px] uppercase tracking-[.16em] text-gray-400">Email Address
          <input type="email" value={email} onChange={event => setEmail(event.target.value)} disabled={isSubmitting} autoComplete="email" aria-invalid={Boolean(errors.email)} className="mt-2 w-full border border-white/10 bg-black/35 px-4 py-3.5 text-sm text-[#F3E5AB] outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30 disabled:opacity-60"/>
          {errors.email && <span className="mt-1.5 block normal-case tracking-normal text-red-300">{errors.email}</span>}
        </label>
        <label className="block text-[10px] uppercase tracking-[.16em] text-gray-400">Password
          <span className="relative mt-2 block"><input type={showPassword ? 'text' : 'password'} value={password} onChange={event => setPassword(event.target.value)} disabled={isSubmitting} autoComplete="current-password" aria-invalid={Boolean(errors.password)} className="w-full border border-white/10 bg-black/35 px-4 py-3.5 pr-12 text-sm text-[#F3E5AB] outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30 disabled:opacity-60"/><button type="button" disabled={isSubmitting} onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute inset-y-0 right-0 px-4 text-gray-500 hover:text-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]">{showPassword ? <EyeOff size={17}/> : <Eye size={17}/>}</button></span>
          {errors.password && <span className="mt-1.5 block normal-case tracking-normal text-red-300">{errors.password}</span>}
        </label>
        {apiError && <div aria-live="polite" className="border border-red-800/40 bg-red-950/25 px-4 py-3 text-xs leading-5 text-red-200">{apiError}</div>}
        <button type="submit" disabled={isSubmitting || isAuthLoading} aria-busy={isSubmitting} className="w-full bg-[#D4AF37] py-4 text-[10px] font-semibold uppercase tracking-[.2em] text-[#080605] transition-colors hover:bg-[#F3E5AB] focus:outline-none focus:ring-2 focus:ring-[#F3E5AB] disabled:cursor-wait disabled:opacity-60"><InlineLoadingLabel loading={isSubmitting} loadingText="Signing In...">Sign In to Dashboard</InlineLoadingLabel></button>
      </form>
      <Link to="/" className="mt-7 block text-center text-[10px] uppercase tracking-[.16em] text-gray-500 transition-colors hover:text-[#D4AF37] focus:outline-none focus:text-[#D4AF37]">Back to Website</Link>
    </section>
  </main>;
}
