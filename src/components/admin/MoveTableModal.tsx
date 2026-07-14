import { useEffect, useState } from 'react';
import AdminModalShell from './AdminModalShell';
import { getTables, moveBookingToTable, type AdminBooking, type AdminTable } from '../../services/adminBookingService';
import type { AdminApiError } from '../../services/adminService';

export default function MoveTableModal({ booking, onClose, onSuccess }: { booking: AdminBooking; onClose: () => void; onSuccess: () => void }) {
  const [tables, setTables] = useState<AdminTable[]>([]);
  const [selected, setSelected] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => { getTables().then(data => setTables(data.filter(table => table.isActive && table.status === 'active'))).catch(requestError => setError((requestError as AdminApiError).message)).finally(() => setLoading(false)); }, []);
  const submit = async () => {
    if (!selected) { setError('Select a destination table.'); return; }
    setSubmitting(true); setError('');
    try { await moveBookingToTable(booking.bookingReference, selected); onSuccess(); }
    catch (requestError) { setError((requestError as AdminApiError).message); }
    finally { setSubmitting(false); }
  };
  return <AdminModalShell title="Move Booking to Table" onClose={onClose} width="max-w-2xl">
    <p className="mb-5 text-sm text-gray-400">Current table: <span className="text-[#F3E5AB]">{booking.table.name} ({booking.table.code})</span></p>
    {loading ? <div className="h-40 animate-pulse bg-white/[.03]"/> : <div className="grid max-h-[45vh] gap-3 overflow-y-auto sm:grid-cols-2">{tables.map(table => { const current = table._id === booking.table._id; const tooSmall = table.capacity < booking.players; return <button type="button" key={table._id} disabled={current || tooSmall} onClick={() => setSelected(table._id)} className={`border p-4 text-left disabled:cursor-not-allowed disabled:opacity-35 ${selected === table._id ? 'border-[#D4AF37] bg-[#D4AF37]/10' : 'border-white/10 hover:border-[#D4AF37]/40'}`}><div className="flex justify-between gap-3"><p className="text-sm text-[#F3E5AB]">{table.name} · {table.code}</p><span className="text-[8px] text-gray-500">{table.capacity} players</span></div><p className="mt-2 text-[10px] text-gray-500">{table.type} · {table.zone}</p>{current && <p className="mt-2 text-[8px] uppercase text-[#D4AF37]">Current table</p>}{tooSmall && <p className="mt-2 text-[8px] uppercase text-red-300">Capacity too low</p>}</button>; })}</div>}
    {error && <p aria-live="polite" className="mt-4 border border-red-800/40 bg-red-950/20 p-3 text-xs text-red-200">{error}</p>}
    <div className="mt-6 flex gap-3"><button type="button" onClick={onClose} className="flex-1 border border-white/10 py-3 text-[9px] uppercase tracking-[.16em] text-gray-400">Close</button><button type="button" onClick={() => void submit()} disabled={submitting || loading} className="flex-1 bg-[#D4AF37] py-3 text-[9px] font-semibold uppercase tracking-[.16em] text-black disabled:opacity-60">{submitting ? 'Moving...' : 'Move Booking'}</button></div>
  </AdminModalShell>;
}
