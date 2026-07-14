import { useState } from 'react';
import AdminModalShell from './AdminModalShell';
import { cancelBooking, type AdminBooking } from '../../services/adminBookingService';
import type { AdminApiError } from '../../services/adminService';
import InlineLoadingLabel from '../common/InlineLoadingLabel';

const reasons = ['Customer cancelled', 'No longer required', 'Duplicate booking', 'Incorrect reservation', 'Other'];
export default function CancelBookingModal({ booking, onClose, onSuccess }: { booking: AdminBooking; onClose: () => void; onSuccess: () => void }) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const submit = async () => {
    if (!reason.trim()) { setError('Cancellation reason is required.'); return; }
    setSubmitting(true); setError('');
    try { await cancelBooking(booking.bookingReference, reason.trim()); onSuccess(); }
    catch (requestError) { setError((requestError as AdminApiError).message); }
    finally { setSubmitting(false); }
  };
  return <AdminModalShell title="Cancel Booking" onClose={onClose}>
    <p className="mb-4 text-sm text-gray-400">Cancel <span className="text-[#F3E5AB]">{booking.bookingReference}</span>. This action records the reason and releases the table.</p>
    <div className="mb-4 flex flex-wrap gap-2">{reasons.map(item => <button type="button" key={item} onClick={() => setReason(item === 'Other' ? '' : item)} className="border border-white/10 px-3 py-2 text-[9px] text-gray-400 hover:border-[#D4AF37]/40 hover:text-[#F3E5AB]">{item}</button>)}</div>
    <label className="text-[9px] uppercase tracking-[.16em] text-gray-400">Cancellation Reason<textarea rows={4} maxLength={300} value={reason} onChange={event => setReason(event.target.value)} className="mt-2 w-full resize-none border border-white/10 bg-black/30 p-3 text-sm text-[#F3E5AB] outline-none focus:border-[#D4AF37]"/></label>
    {error && <p aria-live="polite" className="mt-4 border border-red-800/40 bg-red-950/20 p-3 text-xs text-red-200">{error}</p>}
    <div className="mt-6 flex gap-3"><button type="button" onClick={onClose} className="flex-1 border border-white/10 py-3 text-[9px] uppercase tracking-[.16em] text-gray-400">Keep Booking</button><button type="button" onClick={() => void submit()} disabled={submitting} aria-busy={submitting} className="flex-1 bg-[#6f171a] py-3 text-[9px] font-semibold uppercase tracking-[.16em] text-white disabled:opacity-60"><InlineLoadingLabel loading={submitting} loadingText="Cancelling...">Cancel Booking</InlineLoadingLabel></button></div>
  </AdminModalShell>;
}
