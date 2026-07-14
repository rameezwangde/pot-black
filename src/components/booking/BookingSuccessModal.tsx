import { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { BookingTable, TimeSlot } from '../../data/bookingMockData';

export default function BookingSuccessModal({ open, reference, date, table, slot, players, onClose, onReset }: { open: boolean; reference: string; date: string; table?: BookingTable; slot?: TimeSlot; players: number; onClose: () => void; onReset: () => void }) {
  useEffect(() => { const key = (e: KeyboardEvent) => e.key === 'Escape' && onClose(); window.addEventListener('keydown',key); return () => window.removeEventListener('keydown',key); },[onClose]);
  if (!open || !table || !slot) return null;
  return <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm p-4 flex items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="success-title" onMouseDown={e => e.target === e.currentTarget && onClose()}>
    <div className="relative w-full max-w-xl border border-[#D4AF37]/35 bg-[#100b0a] p-6 sm:p-10 shadow-[0_0_80px_rgba(0,0,0,.8)]"><button onClick={onClose} aria-label="Close confirmation" className="absolute top-4 right-4 text-gray-500 hover:text-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"><X /></button><CheckCircle2 className="text-[#D4AF37] mb-5" size={38} strokeWidth={1.2}/><p className="text-[9px] uppercase tracking-[.3em] text-[#D4AF37] mb-2">Booking Reference: {reference}</p><h2 id="success-title" className="text-3xl sm:text-4xl text-[#F3E5AB] mb-4">Reservation Request Received</h2><p className="text-sm text-gray-400 leading-relaxed mb-7">Your selected table has been reserved in this demo. Once the backend is connected, the booking will be saved and live availability will update automatically.</p>
      <div className="grid grid-cols-2 gap-4 border-y border-white/10 py-5 text-xs mb-7"><span><b className="block text-gray-600 font-normal mb-1">Date</b>{new Date(`${date}T12:00:00`).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})}</span><span><b className="block text-gray-600 font-normal mb-1">Table</b>{table.name}</span><span><b className="block text-gray-600 font-normal mb-1">Time</b>{slot.start} – {slot.end}</span><span><b className="block text-gray-600 font-normal mb-1">Players</b>{players}</span></div>
      <div className="grid sm:grid-cols-2 gap-3"><Link to="/" className="text-center border border-[#D4AF37]/40 py-3 text-[9px] uppercase tracking-[.18em] text-[#F3E5AB]">Back to Home</Link><button onClick={onReset} className="bg-[#D4AF37] text-[#080605] py-3 text-[9px] uppercase tracking-[.18em] font-semibold">Make Another Booking</button></div>
    </div>
  </div>;
}
