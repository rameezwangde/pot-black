import { useEffect } from 'react';
import { X } from 'lucide-react';
import type { AdminBooking, BookingStatus } from '../../services/adminBookingService';
import { canCancel, canExtend, canMove, formatAdminDateTime, formatTimeRange, statusTransitions } from '../../utils/adminBookingUi';
import BookingStatusBadge from './BookingStatusBadge';

const actionLabels: Partial<Record<BookingStatus, string>> = { confirmed: 'Confirm', 'checked-in': 'Check In', playing: 'Start Playing', completed: 'Complete', 'no-show': 'Mark No-Show' };

export default function BookingDetailsPanel({ booking, loading, onClose, onStatus, onExtend, onCancel, onMove }: { booking?: AdminBooking; loading: boolean; onClose: () => void; onStatus: (status: BookingStatus) => void; onExtend: () => void; onCancel: () => void; onMove: () => void }) {
  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [onClose]);
  const rows = booking ? [
    ['Customer', booking.customerName], ['Phone', booking.phone], ['Email', booking.email], ['Players', String(booking.players)],
    ['Table', `${booking.table.name} (${booking.table.code})`], ['Zone', booking.table.zone], ['Start', formatAdminDateTime(booking.startDateTime)], ['End', `${formatAdminDateTime(booking.endDateTime)} · ${formatTimeRange(booking)}`],
    ['Duration', `${booking.durationMinutes} minutes`], ['Extension', booking.extensionMinutes ? `${booking.extensionMinutes} minutes` : undefined], ['Source', booking.source], ['Created by', booking.createdBy],
    ['Created', formatAdminDateTime(booking.createdAt)], ['Updated', formatAdminDateTime(booking.updatedAt)], ['Special request', booking.specialRequest], ['Cancellation reason', booking.cancellationReason], ['Cancelled', booking.cancelledAt ? formatAdminDateTime(booking.cancelledAt) : undefined],
  ].filter((row): row is string[] => Boolean(row[1])) : [];
  return <div className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm" onMouseDown={event => event.target === event.currentTarget && onClose()}><aside role="dialog" aria-modal="true" aria-label="Booking details" className="absolute inset-y-0 right-0 w-full overflow-y-auto border-l border-[#D4AF37]/20 bg-[#12090a] shadow-2xl sm:max-w-xl">
    <header className="sticky top-0 z-10 flex items-start justify-between gap-5 border-b border-white/10 bg-[#12090a]/95 p-5 backdrop-blur sm:p-7"><div><p className="text-[9px] uppercase tracking-[.2em] text-[#D4AF37]">Booking Details</p><h2 className="mt-2 text-2xl text-[#F3E5AB]">{booking?.bookingReference ?? 'Loading...'}</h2></div><button type="button" onClick={onClose} aria-label="Close booking details" className="text-gray-500 hover:text-[#D4AF37]"><X size={23}/></button></header>
    {loading || !booking ? <div className="space-y-3 p-7">{Array.from({length:8}).map((_, index) => <div key={index} className="h-12 animate-pulse bg-white/[.035]"/>)}</div> : <div className="p-5 sm:p-7"><div className="mb-6 flex items-center justify-between gap-4"><BookingStatusBadge status={booking.status}/><span className="text-xs uppercase tracking-[.12em] text-gray-500">{booking.source}</span></div><dl className="divide-y divide-white/5 border-y border-white/10">{rows.map(([label, value]) => <div key={label} className="grid grid-cols-[125px_1fr] gap-4 py-3.5 text-xs"><dt className="text-gray-500">{label}</dt><dd className="break-words text-[#F3E5AB]">{value}</dd></div>)}</dl>
      <div className="mt-7 flex flex-wrap gap-2">{statusTransitions[booking.status].filter(status => status !== 'cancelled').map(status => <button type="button" key={status} onClick={() => onStatus(status)} className="border border-[#D4AF37]/30 px-3 py-2 text-[8px] uppercase tracking-[.13em] text-[#F3E5AB]">{actionLabels[status] ?? status}</button>)}{canExtend(booking) && <button type="button" onClick={onExtend} className="border border-white/15 px-3 py-2 text-[8px] uppercase tracking-[.13em] text-gray-300">Extend</button>}{canMove(booking) && <button type="button" onClick={onMove} className="border border-white/15 px-3 py-2 text-[8px] uppercase tracking-[.13em] text-gray-300">Move Table</button>}{canCancel(booking) && booking.status !== 'playing' && <button type="button" onClick={onCancel} className="border border-red-900/40 px-3 py-2 text-[8px] uppercase tracking-[.13em] text-red-300">Cancel</button>}</div>
    </div>}
  </aside></div>;
}
