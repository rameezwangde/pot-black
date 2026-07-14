import { useEffect, useRef, useState } from 'react';
import { Table2 } from 'lucide-react';
import AdminModalShell from './AdminModalShell';
import { getTables, moveBookingToTable, type AdminBooking, type AdminTable } from '../../services/adminBookingService';
import type { AdminApiError } from '../../services/adminService';
import InlineLoadingLabel from '../common/InlineLoadingLabel';
import EmptyState from '../common/EmptyState';

export default function MoveTableModal({ booking, onClose, onSuccess }: { booking: AdminBooking; onClose: () => void; onSuccess: () => void }) {
  const [tables, setTables] = useState<AdminTable[]>([]);
  const [selected, setSelected] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const submissionPending = useRef(false);
  const close = () => { if (!submissionPending.current) onClose(); };
  const [error, setError] = useState('');
  useEffect(() => { getTables().then(data => setTables(data.filter(table => table.isActive && table.status === 'active'))).catch(requestError => setError((requestError as AdminApiError).message)).finally(() => setLoading(false)); }, []);
  const eligibleTables = tables.filter(table => table._id !== booking.table._id && table.capacity >= booking.players);
  const submit = async () => {
    if (submissionPending.current) return;
    if (!selected) { setError('Select a destination table.'); return; }
    submissionPending.current = true;
    setSubmitting(true); setError('');
    try { await moveBookingToTable(booking.bookingReference, selected); onSuccess(); }
    catch (requestError) { setError((requestError as AdminApiError).message); }
    finally { submissionPending.current = false; setSubmitting(false); }
  };
  return <AdminModalShell title="Move Booking to Table" onClose={close} width="max-w-2xl">
    <p className="mb-5 text-sm text-gray-400">Current table: <span className="text-[#F3E5AB]">{booking.table.name} ({booking.table.code})</span></p>
    {loading ? <div role="status" aria-label="Loading tables" className="grid gap-3 sm:grid-cols-2"><span className="sr-only">Loading tables...</span>{Array.from({length:4}).map((_,index)=><div key={index} className="h-24 animate-pulse border border-white/[.06] bg-white/[.03] p-4"><div className="h-3 w-28 bg-white/[.08]"/><div className="mt-4 h-2 w-36 bg-white/[.05]"/></div>)}</div> : !eligibleTables.length ? <EmptyState icon={Table2} title="No Eligible Tables" description="No other active table currently has enough capacity for this booking." actionLabel="Keep Current Table" onAction={onClose} compact/> : <div className="grid max-h-[45vh] gap-3 overflow-y-auto sm:grid-cols-2">{eligibleTables.map(table => { const current = table._id === booking.table._id; const tooSmall = table.capacity < booking.players; return <button type="button" key={table._id} disabled={submitting || current || tooSmall} onClick={() => setSelected(table._id)} className={`border p-4 text-left disabled:cursor-not-allowed disabled:opacity-35 ${selected === table._id ? 'border-[#D4AF37] bg-[#D4AF37]/10' : 'border-white/10 hover:border-[#D4AF37]/40'}`}><div className="flex justify-between gap-3"><p className="text-sm text-[#F3E5AB]">{table.name} · {table.code}</p><span className="text-[8px] text-gray-500">{table.capacity} players</span></div><p className="mt-2 text-[10px] text-gray-500">{table.type} · {table.zone}</p>{current && <p className="mt-2 text-[8px] uppercase text-[#D4AF37]">Current table</p>}{tooSmall && <p className="mt-2 text-[8px] uppercase text-red-300">Capacity too low</p>}</button>; })}</div>}
    {error && <p aria-live="polite" className="mt-4 border border-red-800/40 bg-red-950/20 p-3 text-xs text-red-200">{error}</p>}
    <div className="mt-6 flex gap-3"><button type="button" onClick={close} disabled={submitting} className="flex-1 border border-white/10 py-3 text-[9px] uppercase tracking-[.16em] text-gray-400">Close</button><button type="button" onClick={() => void submit()} disabled={submitting || loading} aria-busy={submitting} className="flex-1 bg-[#D4AF37] py-3 text-[9px] font-semibold uppercase tracking-[.16em] text-black disabled:opacity-60"><InlineLoadingLabel loading={submitting} loadingText="Moving...">Move Booking</InlineLoadingLabel></button></div>
  </AdminModalShell>;
}
