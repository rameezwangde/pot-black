import { Search } from 'lucide-react';
import { getDubaiToday } from '../../utils/bookingTime';

interface Props { date: string; players: number; duration: string; loading: boolean; onDate: (v: string) => void; onPlayers: (v: number) => void; onDuration: (v: string) => void; onSearch: () => void; }
const field = 'w-full bg-black/35 border border-[#D4AF37]/25 px-4 py-3.5 text-sm text-[#F3E5AB] outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 rounded-sm';

export default function BookingFilters({ date, players, duration, loading, onDate, onPlayers, onDuration, onSearch }: Props) {
  return <section className="border border-[#D4AF37]/20 bg-[#100b0a]/95 shadow-2xl p-5 sm:p-7 lg:p-9">
    <div className="mb-6"><p className="text-[9px] uppercase tracking-[.3em] text-[#D4AF37] mb-2">Plan Your Visit</p><h2 className="text-3xl text-[#F3E5AB]">Find an Available Table</h2></div>
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 items-end">
      <label className="text-[10px] uppercase tracking-[.18em] text-gray-400">Date<input aria-label="Booking date" type="date" min={getDubaiToday()} value={date} onChange={e => onDate(e.target.value)} className={`${field} mt-2 [color-scheme:dark]`} /></label>
      <label className="text-[10px] uppercase tracking-[.18em] text-gray-400">Players<select value={players} onChange={e => onPlayers(Number(e.target.value))} className={`${field} mt-2`}><option value={1}>1 Player</option><option value={2}>2 Players</option><option value={3}>3 Players</option><option value={4}>4 Players</option><option value={5}>5+ Players</option></select></label>
      <label className="text-[10px] uppercase tracking-[.18em] text-gray-400">Preferred Duration<select value={duration} onChange={e => onDuration(e.target.value)} className={`${field} mt-2`}><option>30 Minutes</option><option>1 Hour</option><option>1 Hour 30 Minutes</option><option>2 Hours</option></select></label>
      <button type="button" disabled={loading} onClick={onSearch} className="min-h-[48px] bg-[#D4AF37] text-[#080605] px-5 py-3 uppercase tracking-[.18em] text-[10px] font-semibold hover:bg-[#F3E5AB] focus:outline-none focus:ring-2 focus:ring-[#F3E5AB] disabled:opacity-60 flex items-center justify-center gap-2"><Search size={15} />{loading ? 'Checking...' : 'Check Availability'}</button>
    </div>
  </section>;
}
