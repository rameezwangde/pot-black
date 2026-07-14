import { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { CreatedBooking } from '../../services/bookingService';
import { formatUtcToDubaiDate, formatUtcToDubaiTime } from '../../utils/bookingTime';

export default function BookingSuccessModal({ open, booking, onClose, onReset }: { open: boolean; booking?: CreatedBooking; onClose: () => void; onReset: () => void }) {
  useEffect(() => {
    const key = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [onClose]);
  if (!open || !booking) return null;
  return <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm p-0 flex items-end justify-center sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-labelledby="success-title" onMouseDown={event => event.target === event.currentTarget && onClose()}>
    <div className="relative max-h-[95dvh] w-full max-w-xl overflow-y-auto border border-[#D4AF37]/35 bg-[#100b0a] p-5 sm:p-10 shadow-[0_0_80px_rgba(0,0,0,.8)]"><button onClick={onClose} aria-label="Close confirmation" className="absolute top-4 right-4 text-gray-500 hover:text-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"><X /></button><CheckCircle2 className="text-[#D4AF37] mb-5" size={38} strokeWidth={1.2}/><p className="break-all pr-10 text-[9px] uppercase tracking-[.2em] text-[#D4AF37] mb-2 sm:tracking-[.3em]">Booking Reference: {booking.bookingReference}</p><h2 id="success-title" className="text-3xl sm:text-4xl text-[#F3E5AB] mb-4">Reservation Confirmed</h2><p className="text-sm text-gray-400 leading-relaxed mb-7">Your Pot Black table is confirmed. Please keep your booking reference for check-in.</p>
      <div className="grid grid-cols-1 min-[390px]:grid-cols-2 gap-4 border-y border-white/10 py-5 text-xs mb-7"><span><b className="block text-gray-600 font-normal mb-1">Date</b>{formatUtcToDubaiDate(booking.startDateTime)}</span><span><b className="block text-gray-600 font-normal mb-1">Table</b>{booking.table.name} ({booking.table.code})</span><span><b className="block text-gray-600 font-normal mb-1">Time</b>{formatUtcToDubaiTime(booking.startDateTime)} – {formatUtcToDubaiTime(booking.endDateTime)}</span><span><b className="block text-gray-600 font-normal mb-1">Zone</b>{booking.table.zone}</span><span><b className="block text-gray-600 font-normal mb-1">Players</b>{booking.players}</span><span><b className="block text-gray-600 font-normal mb-1">Duration</b>{booking.durationMinutes} minutes</span></div>
      <div className="grid sm:grid-cols-2 gap-3"><Link to="/" className="text-center border border-[#D4AF37]/40 py-3 text-[9px] uppercase tracking-[.18em] text-[#F3E5AB]">Back to Home</Link><button onClick={onReset} className="bg-[#D4AF37] text-[#080605] py-3 text-[9px] uppercase tracking-[.18em] font-semibold">Make Another Booking</button></div>
    </div>
  </div>;
}
