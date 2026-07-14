import type { BookingTable, TimeSlot } from '../../data/bookingMockData';

export default function BookingSummary({ date, table, slot, players, duration }: { date: string; table?: BookingTable; slot?: TimeSlot; players: number; duration: string }) {
  const rows = table && slot ? [['Date',new Date(`${date}T12:00:00`).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})],['Table',table.name],['Location',table.zone],['Players',String(players)],['Duration',duration],['Time',`${slot.start} – ${slot.end}`]] : [];
  return <aside className="lg:sticky lg:top-28 border border-[#D4AF37]/25 bg-black/30 p-5 sm:p-6 h-fit"><p className="text-[10px] uppercase tracking-[.3em] text-[#D4AF37] mb-6">Your Reservation</p>{rows.length ? <><dl className="space-y-4">{rows.map(([key,value])=><div key={key} className="flex min-w-0 justify-between gap-4 border-b border-white/5 pb-3 text-xs"><dt className="text-gray-500">{key}</dt><dd className="min-w-0 break-words text-right text-[#F3E5AB]">{value}</dd></div>)}</dl><div className="mt-5 flex items-center gap-2 text-[9px] uppercase tracking-wider text-[#F3E5AB]"><span className="w-2 h-2 rounded-full bg-[#D4AF37]"/>Pending Confirmation</div></> : <p className="text-sm leading-relaxed text-gray-500">Complete the steps to see your reservation summary.</p>}</aside>;
}

