import { useCallback, useEffect, useMemo, useState } from 'react';
import { CalendarPlus2, Plus, Search, SearchX, SlidersHorizontal } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import BookingDetailsPanel from '../../components/admin/BookingDetailsPanel';
import BookingStatusBadge from '../../components/admin/BookingStatusBadge';
import CancelBookingModal from '../../components/admin/CancelBookingModal';
import ExtendBookingModal from '../../components/admin/ExtendBookingModal';
import MoveTableModal from '../../components/admin/MoveTableModal';
import WalkInBookingModal from '../../components/admin/WalkInBookingModal';
import { BookingListSkeleton } from '../../components/admin/AdminLoadingSkeletons';
import EmptyState from '../../components/common/EmptyState';
import ApiErrorCard from '../../components/common/ApiErrorCard';
import { useAdminToast } from '../../context/AdminToastContext';
import { getAdminBooking, getAdminBookings, getTables, updateBookingStatus, type AdminBooking, type AdminTable, type BookingStatus, type Pagination } from '../../services/adminBookingService';
import type { AdminApiError } from '../../services/adminService';
import { canExtend, canMove, formatAdminDate, formatTimeRange, statusLabels, statusTransitions } from '../../utils/adminBookingUi';

const field = 'border border-white/10 bg-black/25 px-3 py-3 text-xs text-[#F3E5AB] outline-none focus:border-[#D4AF37] [color-scheme:dark]';
const actionClass = 'border border-white/10 px-2.5 py-2 text-[8px] uppercase tracking-[.11em] text-gray-300 hover:border-[#D4AF37]/40 hover:text-[#F3E5AB]';
const statusActionLabel: Partial<Record<BookingStatus, string>> = { confirmed: 'Confirm', 'checked-in': 'Check In', playing: 'Start Playing', completed: 'Complete', 'no-show': 'Mark No-Show' };

export default function AdminBookingsPage() {
  const { showToast } = useAdminToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, pages: 0 });
  const [tables, setTables] = useState<AdminTable[]>([]);
  const [tablesLoading, setTablesLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchInput, setSearchInput] = useState(searchParams.get('search') ?? '');
  const urlSearch = searchParams.get('search') ?? '';
  const [details, setDetails] = useState<AdminBooking>();
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [extendTarget, setExtendTarget] = useState<AdminBooking>();
  const [cancelTarget, setCancelTarget] = useState<AdminBooking>();
  const [moveTarget, setMoveTarget] = useState<AdminBooking>();
  const [walkInOpen, setWalkInOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState('');

  const queryKey = searchParams.toString();
  const query = useMemo(() => ({
    date: searchParams.get('date') || undefined,
    status: searchParams.get('status') || undefined,
    tableId: searchParams.get('tableId') || undefined,
    search: searchParams.get('search') || undefined,
    sort: searchParams.get('sort') || 'start-asc',
    page: Number(searchParams.get('page')) || 1,
    limit: Number(searchParams.get('limit')) || 20,
  }), [queryKey]);

  const loadBookings = useCallback(async (background = false) => {
    if (!background) setLoading(true); setError('');
    try { const result = await getAdminBookings(query); setBookings(result.bookings); setPagination(result.pagination); }
    catch (requestError) { setError((requestError as AdminApiError).message); }
    finally { if (!background) setLoading(false); }
  }, [query]);

  useEffect(() => { void loadBookings(); }, [loadBookings]);
  useEffect(() => { getTables().then(data => setTables(data.filter(table => table.isActive && table.status === 'active'))).catch(requestError => showToast((requestError as AdminApiError).message, 'error')).finally(() => setTablesLoading(false)); }, [showToast]);
  useEffect(() => setSearchInput(urlSearch), [urlSearch]);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const current = searchParams.get('search') ?? '';
      if (searchInput.trim() === current) return;
      const next = new URLSearchParams(searchParams);
      if (searchInput.trim()) next.set('search', searchInput.trim()); else next.delete('search');
      next.set('page', '1'); setSearchParams(next);
    }, 400);
    return () => window.clearTimeout(timer);
  }, [searchInput, searchParams, setSearchParams]);

  const bookingIdentifier = searchParams.get('booking');
  const loadDetails = useCallback(async (identifier: string, background = false) => {
    if (!background) setDetailsLoading(true);
    try { setDetails(await getAdminBooking(identifier)); }
    catch (requestError) {
      showToast((requestError as AdminApiError).message, 'error');
      if (!background) setSearchParams(current => { const next = new URLSearchParams(current); next.delete('booking'); return next; }, { replace: true });
    }
    finally { if (!background) setDetailsLoading(false); }
  }, [setSearchParams, showToast]);
  useEffect(() => { if (bookingIdentifier) void loadDetails(bookingIdentifier); else setDetails(undefined); }, [bookingIdentifier, loadDetails]);

  const setFilter = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value); else next.delete(key);
    if (key !== 'page' && key !== 'booking') next.set('page', '1');
    setSearchParams(next);
  };
  const clearFilters = () => { setSearchInput(''); const booking = searchParams.get('booking'); setSearchParams(booking ? { booking } : {}); };
  const hasActiveFilters = Boolean(query.date || query.status || query.tableId || query.search);
  const openDetails = (booking: AdminBooking) => setFilter('booking', booking.bookingReference);
  function closeDetails() { const next = new URLSearchParams(searchParams); next.delete('booking'); setSearchParams(next); setDetails(undefined); }

  const refreshAfterAction = async (message: string) => {
    showToast(message); await loadBookings(true);
    if (bookingIdentifier) await loadDetails(bookingIdentifier, true);
  };
  const changeStatus = async (booking: AdminBooking, status: BookingStatus) => {
    setActionLoading(`${booking._id}:${status}`);
    try { await updateBookingStatus(booking.bookingReference, status); await refreshAfterAction('Booking status updated successfully.'); }
    catch (requestError) { showToast((requestError as AdminApiError).message, 'error'); }
    finally { setActionLoading(''); }
  };
  const modalSuccess = async (message: string) => {
    setExtendTarget(undefined); setCancelTarget(undefined); setMoveTarget(undefined); setWalkInOpen(false);
    await refreshAfterAction(message);
  };

  const actions = (booking: AdminBooking) => <div className="flex flex-wrap gap-1.5"><button type="button" onClick={() => openDetails(booking)} className={actionClass}>View</button>{statusTransitions[booking.status].filter(status => status !== 'cancelled').map(status => <button type="button" key={status} disabled={actionLoading === `${booking._id}:${status}`} aria-busy={actionLoading === `${booking._id}:${status}`} onClick={() => void changeStatus(booking, status)} className={actionClass}>{actionLoading === `${booking._id}:${status}` ? 'Updating...' : statusActionLabel[status] ?? statusLabels[status]}</button>)}{canExtend(booking) && <button type="button" onClick={() => setExtendTarget(booking)} className={actionClass}>Extend</button>}{canMove(booking) && <button type="button" onClick={() => setMoveTarget(booking)} className={actionClass}>Move Table</button>}{statusTransitions[booking.status].includes('cancelled') && <button type="button" onClick={() => setCancelTarget(booking)} className={`${actionClass} border-red-900/40 text-red-300`}>Cancel</button>}</div>;

  return <section className="mx-auto max-w-[1550px]">
    <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="mb-2 text-[9px] uppercase tracking-[.3em] text-[#D4AF37]">Reservations Control</p><h2 className="mb-3 text-3xl text-[#F3E5AB] min-[390px]:text-4xl sm:text-5xl">Booking Management</h2><p className="text-sm text-gray-400">Search, review and manage reservations, walk-ins and active playing sessions.</p></div><button type="button" onClick={() => setWalkInOpen(true)} className="flex w-full shrink-0 items-center justify-center gap-2 bg-[#D4AF37] sm:w-auto px-5 py-3.5 text-[9px] font-semibold uppercase tracking-[.16em] text-black"><Plus size={15}/>Add Walk-In Booking</button></div>
    <div className="mb-6 border border-[#D4AF37]/15 bg-[#140a0b]/70 p-4"><div className="mb-4 flex items-center gap-2 text-[9px] uppercase tracking-[.16em] text-[#D4AF37]"><SlidersHorizontal size={14}/>Filters</div><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5"><input type="date" value={query.date ?? ''} onChange={event => setFilter('date', event.target.value)} aria-label="Dubai date" className={field}/><select value={query.status ?? ''} onChange={event => setFilter('status', event.target.value)} aria-label="Booking status" className={field}><option value="">All Statuses</option>{Object.entries(statusLabels).map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select><select value={query.tableId ?? ''} disabled={tablesLoading} onChange={event => setFilter('tableId', event.target.value)} aria-label="Table" className={field}><option value="">{tablesLoading ? 'Loading tables...' : 'All Tables'}</option>{tables.map(table => <option key={table._id} value={table._id}>{table.code} · {table.name}</option>)}</select><label className="relative"><Search size={14} className="absolute left-3 top-3.5 text-gray-600"/><input value={searchInput} onChange={event => setSearchInput(event.target.value)} placeholder="Search reference, customer, phone or email" className={`${field} w-full pl-9`}/></label><select value={query.sort} onChange={event => setFilter('sort', event.target.value)} aria-label="Sort bookings" className={field}><option value="start-asc">Start Time: Earliest</option><option value="start-desc">Start Time: Latest</option><option value="created-desc">Newest Created</option><option value="created-asc">Oldest Created</option></select></div><button type="button" onClick={clearFilters} className="mt-3 text-[8px] uppercase tracking-[.14em] text-gray-500 hover:text-[#D4AF37]">Clear Filters</button></div>
    {error && bookings.length > 0 && <p role="alert" className="mb-4 border border-red-900/30 bg-red-950/15 px-4 py-3 text-xs text-red-200">Refresh failed. Current booking data remains visible.</p>}
    {error && !bookings.length ? <ApiErrorCard title="Unable to Load Bookings" message={error} onRetry={() => void loadBookings()}/> : loading ? <BookingListSkeleton/> : !bookings.length ? <EmptyState icon={hasActiveFilters ? SearchX : CalendarPlus2} title={hasActiveFilters ? 'No Matching Bookings' : 'No Bookings Yet'} description={hasActiveFilters ? 'No reservation matches the selected filters. Clear them to return to the full booking list.' : 'New reservations and walk-ins will appear here as soon as they are created.'} actionLabel={hasActiveFilters ? 'Clear Filters' : 'Add Walk-In Booking'} onAction={hasActiveFilters ? clearFilters : () => setWalkInOpen(true)}/> : <>
      <div className="hidden overflow-x-auto 2xl:block"><table className="w-full min-w-[1000px] border-collapse text-left"><thead><tr className="border-b border-[#D4AF37]/20 text-[8px] uppercase tracking-[.14em] text-gray-500">{['Reference','Customer','Table','Date & Time','Players','Source','Status','Actions'].map(label => <th key={label} className="px-3 py-4 font-normal">{label}</th>)}</tr></thead><tbody className="divide-y divide-white/5">{bookings.map(booking => <tr key={booking._id} className="bg-[#140a0b]/40 text-xs"><td className="px-3 py-4 text-[#D4AF37]">{booking.bookingReference}</td><td className="px-3 py-4"><p className="text-[#F3E5AB]">{booking.customerName}</p><p className="mt-1 text-[9px] text-gray-600">{booking.phone}</p></td><td className="px-3 py-4 text-gray-300">{booking.table.code}<p className="mt-1 text-[9px] text-gray-600">{booking.table.name}</p></td><td className="px-3 py-4 text-gray-300">{formatAdminDate(booking.startDateTime)}<p className="mt-1 text-[9px] text-gray-500">{formatTimeRange(booking)}</p></td><td className="px-3 py-4 text-gray-300">{booking.players}</td><td className="px-3 py-4 capitalize text-gray-400">{booking.source}</td><td className="px-3 py-4"><BookingStatusBadge status={booking.status}/></td><td className="px-3 py-4">{actions(booking)}</td></tr>)}</tbody></table></div>
      <div className="grid gap-4 2xl:hidden">{bookings.map(booking => <article key={booking._id} className="min-w-0 border border-white/10 bg-[#140a0b]/70 p-4 sm:p-5"><div className="mb-4 flex flex-col items-start justify-between gap-3 min-[390px]:flex-row"><div><p className="break-all text-[10px] text-[#D4AF37]">{booking.bookingReference}</p><h3 className="mt-1 text-xl text-[#F3E5AB]">{booking.customerName}</h3><p className="mt-1 text-[10px] text-gray-500">{booking.phone}</p></div><BookingStatusBadge status={booking.status}/></div><div className="grid grid-cols-1 gap-3 border-y min-[360px]:grid-cols-2 border-white/5 py-4 text-xs"><p><span className="block text-[8px] text-gray-600">Table</span>{booking.table.name} ({booking.table.code})</p><p><span className="block text-[8px] text-gray-600">Players</span>{booking.players}</p><p><span className="block text-[8px] text-gray-600">Date</span>{formatAdminDate(booking.startDateTime)}</p><p><span className="block text-[8px] text-gray-600">Time</span>{formatTimeRange(booking)}</p><p><span className="block text-[8px] text-gray-600">Source</span><span className="capitalize">{booking.source}</span></p></div><div className="mt-4">{actions(booking)}</div></article>)}</div>
      <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-5 sm:flex-row"><select value={pagination.limit} onChange={event => setFilter('limit', event.target.value)} className={field}><option value="10">10 per page</option><option value="20">20 per page</option><option value="50">50 per page</option></select><div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4"><button type="button" disabled={pagination.page <= 1} onClick={() => setFilter('page', String(pagination.page - 1))} className="border border-white/10 px-4 py-2 text-[9px] uppercase text-gray-300 disabled:opacity-30">Previous</button><p className="text-xs text-gray-500">Page {pagination.page} of {Math.max(pagination.pages, 1)}</p><button type="button" disabled={pagination.pages === 0 || pagination.page >= pagination.pages} onClick={() => setFilter('page', String(pagination.page + 1))} className="border border-white/10 px-4 py-2 text-[9px] uppercase text-gray-300 disabled:opacity-30">Next</button></div></div>
    </>}
    {bookingIdentifier && <BookingDetailsPanel booking={details} loading={detailsLoading} updatingStatus={actionLoading.startsWith(`${details?._id}:`) ? actionLoading.slice(details!._id.length + 1) as BookingStatus : undefined} onClose={closeDetails} onStatus={status => details && void changeStatus(details, status)} onExtend={() => details && setExtendTarget(details)} onCancel={() => details && setCancelTarget(details)} onMove={() => details && setMoveTarget(details)}/>}
    {extendTarget && <ExtendBookingModal booking={extendTarget} onClose={() => setExtendTarget(undefined)} onSuccess={() => void modalSuccess('Booking extended successfully.')}/>}
    {cancelTarget && <CancelBookingModal booking={cancelTarget} onClose={() => setCancelTarget(undefined)} onSuccess={() => void modalSuccess('Booking cancelled successfully.')}/>}
    {moveTarget && <MoveTableModal booking={moveTarget} onClose={() => setMoveTarget(undefined)} onSuccess={() => void modalSuccess('Booking moved successfully.')}/>}
    {walkInOpen && <WalkInBookingModal onClose={() => setWalkInOpen(false)} onSuccess={() => void modalSuccess('Walk-in booking created successfully.')}/>}
  </section>;
}

