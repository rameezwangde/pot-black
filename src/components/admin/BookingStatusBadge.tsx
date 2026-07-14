import type { BookingStatus } from '../../services/adminBookingService';
import { statusLabels } from '../../utils/adminBookingUi';

const styles: Record<BookingStatus, string> = {
  pending: 'border-[#8f7835]/40 bg-[#8f7835]/10 text-[#cbb878]',
  confirmed: 'border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#F3E5AB]',
  'checked-in': 'border-slate-500/40 bg-slate-600/15 text-slate-300',
  playing: 'border-emerald-700/40 bg-emerald-900/20 text-emerald-300',
  completed: 'border-gray-700 bg-gray-800/30 text-gray-400',
  cancelled: 'border-red-900/40 bg-red-950/25 text-red-300/80',
  'no-show': 'border-red-950 bg-[#26090a] text-red-400/80',
};

export default function BookingStatusBadge({ status }: { status: BookingStatus }) {
  return <span className={`inline-flex whitespace-nowrap border px-2.5 py-1 text-[8px] uppercase tracking-[.13em] ${styles[status]}`}>{statusLabels[status]}</span>;
}
