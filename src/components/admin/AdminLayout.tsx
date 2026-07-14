import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, LayoutDashboard, LogOut, Menu, Table2, UserRoundPlus, X } from 'lucide-react';
import { DateTime } from 'luxon';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { AdminToastProvider } from '../../context/AdminToastContext';

const navItems = [
  { label: 'Overview', icon: LayoutDashboard, href: '/admin', enabled: true },
  { label: 'Bookings', icon: CalendarDays, href: '/admin/bookings', enabled: true },
  { label: 'Tables', icon: Table2, enabled: false },
  { label: 'Walk-ins', icon: UserRoundPlus, enabled: false },
];

export default function AdminLayout() {
  const { admin, logout } = useAdminAuth();
  const location = useLocation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const currentDate = DateTime.now().setZone('Asia/Dubai').toFormat('cccc, d LLLL yyyy');
  const initials = useMemo(() => admin?.name.split(/\s+/).map(part => part[0]).slice(0, 2).join('').toUpperCase() || 'PB', [admin?.name]);

  useEffect(() => setIsDrawerOpen(false), [location.pathname]);
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => event.key === 'Escape' && setIsDrawerOpen(false);
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, []);

  const sidebar = <div className="flex h-full flex-col bg-[#140a0b]">
    <div className="flex h-24 items-center justify-between border-b border-white/10 px-6"><Link to="/admin" className="flex items-center gap-3 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"><img src="/logo.png" alt="Pot Black" className="h-12 w-auto"/><span className="text-[9px] uppercase tracking-[.24em] text-[#D4AF37]">Operations Panel</span></Link><button type="button" onClick={() => setIsDrawerOpen(false)} aria-label="Close navigation" className="text-gray-500 hover:text-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37] lg:hidden"><X size={22}/></button></div>
    <nav aria-label="Admin navigation" className="flex-1 space-y-2 px-4 py-8">{navItems.map(item => { const Icon = item.icon; return item.enabled ? <Link key={item.label} to={item.href!} aria-current={location.pathname === item.href ? 'page' : undefined} className="flex items-center gap-3 border border-[#D4AF37]/20 bg-[#D4AF37]/8 px-4 py-3.5 text-xs uppercase tracking-[.13em] text-[#F3E5AB] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"><Icon size={17} className="text-[#D4AF37]"/>{item.label}</Link> : <button key={item.label} type="button" disabled className="flex w-full items-center gap-3 border border-transparent px-4 py-3.5 text-left text-xs uppercase tracking-[.13em] text-gray-600"><Icon size={17}/><span>{item.label}</span><span className="ml-auto text-[7px] tracking-[.12em]">Coming Soon</span></button>; })}</nav>
    <div className="border-t border-white/10 p-5"><div className="mb-4 flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-xs text-[#F3E5AB]">{initials}</span><div className="min-w-0"><p className="truncate text-sm text-[#F3E5AB]">{admin?.name}</p><p className="mt-1 text-[8px] uppercase tracking-[.16em] text-gray-500">{admin?.role}</p></div></div><button type="button" onClick={logout} className="flex w-full items-center justify-center gap-2 border border-white/10 py-3 text-[9px] uppercase tracking-[.16em] text-gray-400 hover:border-red-800/50 hover:text-red-300 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"><LogOut size={14}/>Logout</button></div>
  </div>;

  const pageTitle = location.pathname.startsWith('/admin/bookings') ? 'Booking Management' : 'Overview';
  return <AdminToastProvider><div className="min-h-screen overflow-x-hidden bg-[#080605] text-white">
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-[#D4AF37]/15 lg:block">{sidebar}</aside>
    {isDrawerOpen && <div className="fixed inset-0 z-50 lg:hidden"><button type="button" aria-label="Close navigation overlay" onClick={() => setIsDrawerOpen(false)} className="absolute inset-0 bg-black/75 backdrop-blur-sm"/><aside className="relative h-full w-[min(85vw,288px)] border-r border-[#D4AF37]/20 shadow-2xl">{sidebar}</aside></div>}
    <div className="lg:pl-72">
      <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/10 bg-[#0d0807]/95 px-4 backdrop-blur-xl sm:px-7 lg:px-10"><div className="flex min-w-0 items-center gap-4"><button type="button" onClick={() => setIsDrawerOpen(true)} aria-label="Open navigation" aria-expanded={isDrawerOpen} className="shrink-0 text-[#F3E5AB] focus:outline-none focus:ring-1 focus:ring-[#D4AF37] lg:hidden"><Menu size={24}/></button><div><p className="text-[8px] uppercase tracking-[.22em] text-[#D4AF37]">Operations Panel</p><h1 className="truncate text-xl text-[#F3E5AB] sm:text-2xl">{pageTitle}</h1></div></div><div className="flex items-center gap-3 sm:gap-5"><div className="hidden text-right sm:block"><p className="text-[9px] uppercase tracking-[.14em] text-gray-500">Dubai</p><p className="mt-1 text-xs text-gray-300">{currentDate}</p></div><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-xs text-[#F3E5AB]">{initials}</span></div></header>
      <main className="min-h-[calc(100vh-5rem)] px-4 py-7 sm:px-7 lg:px-10 lg:py-10"><Outlet/></main>
    </div>
  </div></AdminToastProvider>;
}
