import { useMemo, useState } from 'react';
import { DateTime } from 'luxon';
import AdminModalShell from './AdminModalShell';
import { extendBooking, type AdminBooking } from '../../services/adminBookingService';
import type { AdminApiError } from '../../services/adminService';
import { CAFE_TIMEZONE } from '../../utils/bookingTime';
import { formatAdminTime } from '../../utils/adminBookingUi';

export default function ExtendBookingModal({ booking, onClose, onSuccess }: { booking: AdminBooking; onClose: () => void; onSuccess: () => void }) {
  const [minutes, setMinutes] = useState(30);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const proposed = useMemo(() => DateTime.fromISO(booking.endDateTime).setZone(CAFE_TIMEZONE).plus({ minutes }).toFormat('h:mm a'), [booking.endDateTime, minutes]);
  const submit = async () => {
    setSubmitting(true); setError('');
    try { await extendBooking(booking.bookingReference, minutes); onSuccess(); }
    catch (requestError) { setError((requestError as AdminApiError).message); }
    finally { setSubmitting(false); }
  };
  return <AdminModalShell title="Extend Booking" onClose={onClose}>
    <div className="mb-6 grid grid-cols-2 gap-4 border border-white/10 bg-black/20 p-4 text-xs"><div><p className="text-gray-500">Current end</p><p className="mt-1 text-[#F3E5AB]">{formatAdminTime(booking.endDateTime)}</p></div><div><p className="text-gray-500">Proposed end</p><p className="mt-1 text-[#D4AF37]">{proposed}</p></div></div>
    <div className="grid grid-cols-2 gap-3">{[30, 60, 90, 120].map(option => <button type="button" key={option} onClick={() => setMinutes(option)} className={`border px-3 py-3 text-[10px] uppercase tracking-[.14em] ${minutes === option ? 'border-[#D4AF37] bg-[#D4AF37] text-black' : 'border-white/10 text-gray-300 hover:border-[#D4AF37]/50'}`}>+{option} Minutes</button>)}</div>
    <p className="mt-4 text-xs text-gray-500">Selected additional duration: {minutes} minutes</p>
    {error && <p aria-live="polite" className="mt-4 border border-red-800/40 bg-red-950/20 p-3 text-xs text-red-200">{error}</p>}
    <div className="mt-6 flex gap-3"><button type="button" onClick={onClose} className="flex-1 border border-white/10 py-3 text-[9px] uppercase tracking-[.16em] text-gray-400">Close</button><button type="button" onClick={() => void submit()} disabled={submitting} className="flex-1 bg-[#D4AF37] py-3 text-[9px] font-semibold uppercase tracking-[.16em] text-black disabled:opacity-60">{submitting ? 'Extending...' : 'Extend Booking'}</button></div>
  </AdminModalShell>;
}
