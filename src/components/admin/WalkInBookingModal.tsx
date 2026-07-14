import { useEffect, useState, type FormEvent } from 'react';
import { DateTime } from 'luxon';
import AdminModalShell from './AdminModalShell';
import { createWalkInBooking, getTables, type AdminTable } from '../../services/adminBookingService';
import type { AdminApiError } from '../../services/adminService';
import { checkAvailability } from '../../services/bookingService';
import { CAFE_TIMEZONE, createDubaiStartDateTime, getDubaiToday } from '../../utils/bookingTime';
import InlineLoadingLabel from '../common/InlineLoadingLabel';

const getDefaultWalkInStart = () => {
  const minimum = DateTime.now().setZone(CAFE_TIMEZONE).plus({ minutes: 15 });
  let candidate = minimum.startOf('hour').plus({ minutes: Math.ceil(minimum.minute / 30) * 30 });
  if (candidate.hour < 10) candidate = candidate.set({ hour: 10, minute: 0 });
  if (candidate.hour >= 23) candidate = candidate.plus({ days: 1 }).startOf('day').set({ hour: 10 });
  return { date: candidate.toISODate()!, time: candidate.toFormat('HH:mm') };
};

const input = 'mt-2 w-full border border-white/10 bg-black/30 px-3 py-3 text-sm text-[#F3E5AB] outline-none focus:border-[#D4AF37] [color-scheme:dark]';
export default function WalkInBookingModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: (bookingReference?: string) => void }) {
  const [tables, setTables] = useState<AdminTable[]>([]);
  const [form, setForm] = useState(() => { const start = getDefaultWalkInStart(); return { customerName: '', phone: '', email: '', players: 2, date: start.date, time: start.time, durationMinutes: 60, tableId: '', specialRequest: '' }; });
  const [error, setError] = useState('');
  const [tablesLoading, setTablesLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => { getTables().then(data => setTables(data.filter(table => table.isActive && table.status === 'active'))).catch(requestError => setError((requestError as AdminApiError).message)).finally(() => setTablesLoading(false)); }, []);
  const set = (key: keyof typeof form, value: string | number) => setForm(current => ({ ...current, [key]: value }));
  const submit = async (event: FormEvent) => {
    event.preventDefault(); setError('');
    if (!form.customerName.trim() || !form.phone.trim() || !form.tableId) { setError('Customer name, phone and table are required.'); return; }
    const table = tables.find(item => item._id === form.tableId);
    if (table && form.players > table.capacity) { setError(`This table can accommodate a maximum of ${table.capacity} players.`); return; }
    setSubmitting(true);
    try {
      const startDateTime = createDubaiStartDateTime({ date: form.date, time: form.time });
      await checkAvailability({ tableId: form.tableId, startDateTime, durationMinutes: form.durationMinutes });
      const result = await createWalkInBooking({ tableId: form.tableId, customerName: form.customerName.trim(), phone: form.phone.trim(), email: form.email.trim() || undefined, players: form.players, startDateTime, durationMinutes: form.durationMinutes, specialRequest: form.specialRequest.trim() });
      onSuccess(result.booking.bookingReference);
    } catch (requestError) { setError((requestError as AdminApiError).message); }
    finally { setSubmitting(false); }
  };
  return <AdminModalShell title="Add Walk-In Booking" onClose={onClose} width="max-w-3xl"><form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
    <label className="text-[9px] uppercase tracking-[.14em] text-gray-400">Customer Name<input value={form.customerName} onChange={event => set('customerName', event.target.value)} className={input}/></label>
    <label className="text-[9px] uppercase tracking-[.14em] text-gray-400">Phone<input type="tel" value={form.phone} onChange={event => set('phone', event.target.value)} className={input}/></label>
    <label className="text-[9px] uppercase tracking-[.14em] text-gray-400">Email <span className="normal-case tracking-normal text-gray-600">(optional)</span><input type="email" value={form.email} onChange={event => set('email', event.target.value)} className={input}/></label>
    <label className="text-[9px] uppercase tracking-[.14em] text-gray-400">Players<input type="number" min={1} value={form.players} onChange={event => set('players', Number(event.target.value))} className={input}/></label>
    <label className="text-[9px] uppercase tracking-[.14em] text-gray-400">Date<input type="date" min={getDubaiToday()} value={form.date} onChange={event => set('date', event.target.value)} className={input}/></label>
    <label className="text-[9px] uppercase tracking-[.14em] text-gray-400">Time<input type="time" step={1800} value={form.time} onChange={event => set('time', event.target.value)} className={input}/></label>
    <label className="text-[9px] uppercase tracking-[.14em] text-gray-400">Duration<select value={form.durationMinutes} onChange={event => set('durationMinutes', Number(event.target.value))} className={input}>{[30,60,90,120].map(value => <option key={value} value={value}>{value} Minutes</option>)}</select></label>
    <label className="text-[9px] uppercase tracking-[.14em] text-gray-400">Table<select value={form.tableId} disabled={tablesLoading} onChange={event => set('tableId', event.target.value)} className={input}><option value="">{tablesLoading ? 'Loading tables...' : 'Select table'}</option>{tables.map(table => <option key={table._id} value={table._id}>{table.code} · {table.name} · {table.capacity} players</option>)}</select></label>
    <label className="sm:col-span-2 text-[9px] uppercase tracking-[.14em] text-gray-400">Special Request<textarea rows={3} maxLength={500} value={form.specialRequest} onChange={event => set('specialRequest', event.target.value)} className={`${input} resize-none`}/></label>
    {error && <p aria-live="polite" className="sm:col-span-2 border border-red-800/40 bg-red-950/20 p-3 text-xs text-red-200">{error}</p>}
    <div className="sm:col-span-2 flex gap-3"><button type="button" onClick={onClose} className="flex-1 border border-white/10 py-3 text-[9px] uppercase tracking-[.16em] text-gray-400">Close</button><button type="submit" disabled={submitting} aria-busy={submitting} className="flex-1 bg-[#D4AF37] py-3 text-[9px] font-semibold uppercase tracking-[.16em] text-black disabled:opacity-60"><InlineLoadingLabel loading={submitting} loadingText="Booking...">Create Walk-In</InlineLoadingLabel></button></div>
  </form></AdminModalShell>;
}
