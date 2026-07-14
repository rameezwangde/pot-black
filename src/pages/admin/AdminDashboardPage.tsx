import { useCallback, useEffect, useState } from 'react';
import { Activity, CalendarCheck2, CalendarX2, Clock3, RefreshCw, Table2, UserRoundPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getDashboardData, type DashboardData } from '../../services/adminBookingService';
import type { AdminApiError } from '../../services/adminService';
import { formatAdminDate, formatTimeRange, remainingTime } from '../../utils/adminBookingUi';
import BookingStatusBadge from '../../components/admin/BookingStatusBadge';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { DashboardSkeleton } from '../../components/admin/AdminLoadingSkeletons';
import EmptyState from '../../components/common/EmptyState';
import ApiErrorCard from '../../components/common/ApiErrorCard';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { isAdminVerified } = useAdminAuth();
  const [data, setData] = useState<DashboardData>();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [secondsAgo, setSecondsAgo] = useState(0);
  const load = useCallback(async (background = false) => {
    if (background) setRefreshing(true); else setLoading(true);
    setError('');
    try { setData(await getDashboardData()); setSecondsAgo(0); }
    catch (requestError) { setError((requestError as AdminApiError).message); }
    finally { setLoading(false); setRefreshing(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);
  useEffect(() => {
    // TODO: Replace polling with Socket.IO after the admin UI is stable.
    const refreshInterval = window.setInterval(() => void load(true), 15000);
    const secondsInterval = window.setInterval(() => setSecondsAgo(value => value + 1), 1000);
    return () => { window.clearInterval(refreshInterval); window.clearInterval(secondsInterval); };
  }, [load]);
  const cards = data ? [
    { label: "Today's Bookings", value: data.summary.totalBookingsToday, icon: CalendarCheck2 },
    { label: 'Playing Now', value: data.summary.playingNow, icon: Activity },
    { label: 'Available Tables', value: data.summary.availableTablesNow, icon: Table2 },
    { label: 'Occupied Tables', value: data.summary.occupiedTablesNow, icon: Clock3 },
    { label: 'Walk-ins Today', value: data.summary.walkInsToday, icon: UserRoundPlus },
    { label: 'Website Bookings Today', value: data.summary.websiteBookingsToday, icon: CalendarCheck2 },
  ] : [];
  return <section className="mx-auto max-w-[1450px]">
    <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="mb-2 text-[9px] uppercase tracking-[.3em] text-[#D4AF37]">Live Operations</p><h2 className="mb-3 text-3xl text-[#F3E5AB] min-[390px]:text-4xl sm:text-5xl">Operations Overview</h2><p className="max-w-2xl text-sm leading-6 text-gray-400">Manage Pot Black bookings, tables and live sessions from one secure dashboard.</p></div><div className="flex flex-wrap items-center gap-4">{isAdminVerified && <p className="flex items-center gap-2 text-[8px] uppercase tracking-[.12em] text-emerald-300"><span className="h-2 w-2 rounded-full bg-emerald-500"/>Backend connection ready</p>}<p className="text-[9px] text-gray-500">Last updated {secondsAgo < 2 ? 'just now' : `${secondsAgo} seconds ago`}</p><button type="button" onClick={() => void load(true)} disabled={refreshing} className="flex items-center gap-2 border border-[#D4AF37]/30 px-4 py-2.5 text-[9px] uppercase tracking-[.14em] text-[#F3E5AB]"><RefreshCw size={14} className={refreshing ? 'animate-spin' : ''}/>Refresh</button></div></div>
    {error && data && <p role="alert" className="mb-4 border border-red-900/30 bg-red-950/15 px-4 py-3 text-xs text-red-200">Refresh failed. Current dashboard data remains visible.</p>}
    {error && !data ? <ApiErrorCard title="Dashboard Unavailable" message={error} onRetry={() => void load()}/> : loading && !data ? <DashboardSkeleton/> : <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{cards.map(card => { const Icon = card.icon; return <article key={card.label} className="border border-[#D4AF37]/15 bg-[#140a0b]/80 p-6"><div className="mb-6 flex justify-between gap-4"><p className="text-[10px] uppercase tracking-[.16em] text-gray-400">{card.label}</p><Icon size={18} className="text-[#D4AF37]"/></div><p className="font-serif text-4xl text-[#F3E5AB]">{card.value}</p></article>; })}</div>
      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <section className="border border-[#D4AF37]/15 bg-[#140a0b]/65"><header className="border-b border-white/10 p-5"><h3 className="text-2xl text-[#F3E5AB]">Upcoming Reservations</h3></header><div className="divide-y divide-white/5">{!data?.upcomingBookings.length ? <EmptyState icon={CalendarX2} title="No Upcoming Reservations" description="There are no upcoming bookings in the current schedule." actionLabel="View All Bookings" onAction={() => navigate('/admin/bookings')} compact/> : data.upcomingBookings.slice(0,10).map(booking => <div key={booking._id} className="grid gap-3 p-4 sm:grid-cols-[1fr_auto] sm:items-center"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><p className="text-sm text-[#F3E5AB]">{booking.customerName}</p><BookingStatusBadge status={booking.status}/></div><p className="mt-1 break-words text-[10px] text-gray-500">{booking.bookingReference} · {booking.table.code} · {formatAdminDate(booking.startDateTime)} · {formatTimeRange(booking)} · {booking.players} players</p></div><button type="button" onClick={() => navigate(`/admin/bookings?booking=${encodeURIComponent(booking.bookingReference)}`)} className="border border-white/10 px-3 py-2 text-[8px] uppercase tracking-[.14em] text-gray-300">View</button></div>)}</div></section>
        <section className="border border-[#D4AF37]/15 bg-[#140a0b]/65"><header className="border-b border-white/10 p-5"><h3 className="text-2xl text-[#F3E5AB]">Active Sessions</h3></header><div className="divide-y divide-white/5">{!data?.activeBookings.length ? <EmptyState icon={Activity} title="No Active Sessions" description="No guests are checked in or playing right now." actionLabel="Manage Walk-Ins" onAction={() => navigate('/admin/walk-ins')} compact/> : data.activeBookings.map(booking => <div key={booking._id} className="grid gap-3 p-4 sm:grid-cols-[1fr_auto] sm:items-center"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><p className="text-sm text-[#F3E5AB]">{booking.customerName}</p><BookingStatusBadge status={booking.status}/></div><p className="mt-1 break-words text-[10px] text-gray-500">{booking.table.name} · {formatTimeRange(booking)} · {remainingTime(booking)}</p></div><button type="button" onClick={() => navigate(`/admin/bookings?booking=${encodeURIComponent(booking.bookingReference)}`)} className="border border-[#D4AF37]/25 px-3 py-2 text-[8px] uppercase tracking-[.14em] text-[#F3E5AB]">Manage</button></div>)}</div></section>
      </div>
    </>}
  </section>;
}

