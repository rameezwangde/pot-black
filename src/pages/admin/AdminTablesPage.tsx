import { useCallback, useEffect, useMemo, useState } from 'react';
import { Clock3, Plus, RefreshCw, Table2, Users } from 'lucide-react';
import { DateTime } from 'luxon';
import { useNavigate } from 'react-router-dom';
import TableFormModal from '../../components/admin/TableFormModal';
import TableStatusModal, { type TableStatusAction } from '../../components/admin/TableStatusModal';
import { useAdminToast } from '../../context/AdminToastContext';
import { getAdminTables, type OperationalTable } from '../../services/adminTableService';
import type { AdminApiError } from '../../services/adminService';
import { CAFE_TIMEZONE } from '../../utils/bookingTime';
import { formatAdminDate, formatAdminTime } from '../../utils/adminBookingUi';

const statusStyle = { available: 'border-emerald-800/40 text-emerald-300', reserved: 'border-[#D4AF37]/40 text-[#F3E5AB]', occupied: 'border-emerald-700/50 bg-emerald-950/20 text-emerald-200', maintenance: 'border-orange-900/50 text-orange-300', unavailable: 'border-red-900/50 text-red-300', inactive: 'border-gray-700 text-gray-500' };
export default function AdminTablesPage() {
  const navigate = useNavigate();
  const { showToast } = useAdminToast();
  const [tables, setTables] = useState<OperationalTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [secondsAgo, setSecondsAgo] = useState(0);
  const [formTable, setFormTable] = useState<OperationalTable | null | undefined>();
  const [statusTarget, setStatusTarget] = useState<{ table: OperationalTable; action: TableStatusAction }>();
  const load = useCallback(async (background = false) => {
    if (background) setRefreshing(true); else setLoading(true); setError('');
    try { setTables(await getAdminTables()); setSecondsAgo(0); }
    catch (requestError) { setError((requestError as AdminApiError).message); }
    finally { setLoading(false); setRefreshing(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);
  useEffect(() => {
    // TODO: Replace polling with Socket.IO after the admin modules are stable.
    const poll = window.setInterval(() => void load(true), 10000);
    const clock = window.setInterval(() => setSecondsAgo(value => value + 1), 1000);
    return () => { window.clearInterval(poll); window.clearInterval(clock); };
  }, [load]);
  const grouped = useMemo(() => Object.entries(tables.reduce<Record<string, OperationalTable[]>>((groups, table) => { (groups[table.zone] ||= []).push(table); return groups; }, {})), [tables]);
  const summary = { total: tables.length, available: tables.filter(table => table.operationalStatus === 'available').length, reserved: tables.filter(table => table.operationalStatus === 'reserved').length, occupied: tables.filter(table => table.operationalStatus === 'occupied').length, restricted: tables.filter(table => ['maintenance','unavailable','inactive'].includes(table.operationalStatus)).length };
  const success = async (message: string) => { setFormTable(undefined); setStatusTarget(undefined); showToast(message); await load(true); };
  const remaining = (end: string) => { const minutes = Math.max(0, Math.ceil(DateTime.fromISO(end).setZone(CAFE_TIMEZONE).diffNow('minutes').minutes)); return minutes ? `${minutes} min remaining` : 'Ending now'; };
  return <section className="mx-auto max-w-[1550px]">
    <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="mb-2 text-[9px] uppercase tracking-[.3em] text-[#D4AF37]">Live Floor Operations</p><h2 className="mb-3 text-3xl text-[#F3E5AB] min-[390px]:text-4xl sm:text-5xl">Table Management</h2><p className="max-w-2xl text-sm text-gray-400">Monitor live table usage, update availability and manage the tables offered for reservation.</p></div><div className="flex w-full gap-3 sm:w-auto"><button type="button" onClick={() => void load(true)} className="flex flex-1 items-center justify-center gap-2 border border-[#D4AF37]/30 sm:flex-none px-4 py-3 text-[9px] uppercase text-[#F3E5AB]"><RefreshCw size={14} className={refreshing ? 'animate-spin' : ''}/>Refresh</button><button type="button" onClick={() => setFormTable(null)} className="flex flex-1 items-center justify-center gap-2 bg-[#D4AF37] sm:flex-none px-5 py-3 text-[9px] font-semibold uppercase text-black"><Plus size={15}/>Add Table</button></div></div>
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border border-emerald-800/25 bg-emerald-950/10 px-4 py-3"><p className="flex items-center gap-2 text-[9px] uppercase tracking-[.14em] text-emerald-300"><span className="h-2 w-2 rounded-full bg-emerald-500"/>Live table status</p><p className="text-[9px] text-gray-500">Last updated {secondsAgo < 2 ? 'just now' : `${secondsAgo} seconds ago`}</p></div>
    <div className="mb-9 grid grid-cols-1 gap-3 min-[390px]:grid-cols-2 lg:grid-cols-5">{Object.entries({ 'Total Tables': summary.total, Available: summary.available, Reserved: summary.reserved, Occupied: summary.occupied, 'Maintenance / Unavailable': summary.restricted }).map(([label,value]) => <article key={label} className="border border-white/10 bg-[#140a0b]/60 p-4"><p className="text-[8px] uppercase tracking-[.13em] text-gray-500">{label}</p><p className="mt-3 font-serif text-3xl text-[#F3E5AB]">{loading ? '—' : value}</p></article>)}</div>
    {error && !tables.length ? <div className="border border-red-900/40 p-10 text-center"><p className="text-red-200">{error}</p><button type="button" onClick={() => void load()} className="mt-4 bg-[#D4AF37] px-5 py-3 text-[9px] text-black">Retry</button></div> : loading ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{Array.from({length:8}).map((_,index) => <div key={index} className="h-80 animate-pulse bg-white/[.025]"/>)}</div> : <div className="space-y-10">{grouped.map(([zone, zoneTables]) => <section key={zone}><div className="mb-4 flex items-center gap-3"><h3 className="text-2xl text-[#F3E5AB]">{zone}</h3><span className="text-[9px] text-gray-600">{zoneTables.length} tables</span></div><div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">{zoneTables.map(table => <article key={table._id} className="min-w-0 border border-white/10 bg-[#140a0b]/70 p-4 sm:p-5"><div className="mb-5 flex flex-col items-start justify-between gap-3 min-[390px]:flex-row"><div><p className="break-words text-[9px] uppercase tracking-[.16em] text-[#D4AF37]">{table.code} · {table.type}</p><h4 className="mt-2 text-2xl text-[#F3E5AB]">{table.name}</h4></div><span className={`border px-2.5 py-1 text-[8px] uppercase tracking-[.12em] ${statusStyle[table.operationalStatus]}`}>{table.operationalStatus}</span></div><p className="mb-4 flex items-center gap-2 text-xs text-gray-400"><Users size={14}/>Up to {table.capacity} players · {table.isActive ? 'Active' : 'Inactive'}</p><div className="mb-5 flex min-h-12 flex-wrap gap-2">{table.features?.map(feature => <span key={feature} className="self-start border border-white/10 px-2 py-1 text-[8px] text-gray-500">{feature}</span>)}</div>
      {table.currentBooking && <div className="mb-3 border border-emerald-800/25 bg-emerald-950/10 p-3"><p className="text-[8px] uppercase text-emerald-300">Current Booking</p><p className="mt-2 text-xs text-[#F3E5AB]">{table.currentBooking.customerName} · {table.currentBooking.players} players</p><p className="mt-1 break-words text-[9px] text-gray-500">{table.currentBooking.bookingReference} · {formatAdminTime(table.currentBooking.startDateTime)}–{formatAdminTime(table.currentBooking.endDateTime)} · {remaining(table.currentBooking.endDateTime)}</p></div>}
      {table.nextBooking && <div className="mb-3 border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-3"><p className="text-[8px] uppercase text-[#D4AF37]">Next Booking</p><p className="mt-2 text-xs text-[#F3E5AB]">{table.nextBooking.customerName}</p><p className="mt-1 break-words text-[9px] text-gray-500">{table.nextBooking.bookingReference} · {formatAdminDate(table.nextBooking.startDateTime)} at {formatAdminTime(table.nextBooking.startDateTime)}</p></div>}
      <div className="mt-5 flex flex-wrap gap-2"><button type="button" onClick={() => setFormTable(table)} className="border border-white/10 px-3 py-2 text-[8px] uppercase text-gray-300">Edit</button>{table.currentBooking && <button type="button" onClick={() => navigate(`/admin/bookings?booking=${table.currentBooking!.bookingReference}`)} className="border border-emerald-800/30 px-3 py-2 text-[8px] uppercase text-emerald-300">View Current</button>}{table.nextBooking && <button type="button" onClick={() => navigate(`/admin/bookings?booking=${table.nextBooking!.bookingReference}`)} className="border border-[#D4AF37]/25 px-3 py-2 text-[8px] uppercase text-[#F3E5AB]">View Next</button>}{table.operationalStatus !== 'occupied' && <>{(table.status !== 'active' || !table.isActive) && <button type="button" onClick={() => setStatusTarget({table,action:'active'})} className="border border-emerald-800/30 px-3 py-2 text-[8px] uppercase text-emerald-300">Mark Active</button>}{table.status === 'active' && table.isActive && <><button type="button" onClick={() => setStatusTarget({table,action:'maintenance'})} className="border border-orange-900/30 px-3 py-2 text-[8px] uppercase text-orange-300">Maintenance</button><button type="button" onClick={() => setStatusTarget({table,action:'unavailable'})} className="border border-red-900/30 px-3 py-2 text-[8px] uppercase text-red-300">Unavailable</button></>}{table.isActive && <button type="button" onClick={() => setStatusTarget({table,action:'deactivate'})} className="border border-red-950 px-3 py-2 text-[8px] uppercase text-red-400">Deactivate</button>}</>}</div>
    </article>)}</div></section>)}</div>}
    {formTable !== undefined && <TableFormModal table={formTable ?? undefined} onClose={() => setFormTable(undefined)} onSuccess={message => void success(message)}/>} 
    {statusTarget && <TableStatusModal table={statusTarget.table} action={statusTarget.action} onClose={() => setStatusTarget(undefined)} onSuccess={message => void success(message)}/>} 
  </section>;
}
