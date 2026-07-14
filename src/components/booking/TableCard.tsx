import { MapPin, Users } from 'lucide-react';
import type { BookingTable } from '../../data/bookingMockData';

const labels = { available: 'AVAILABLE', 'partially-booked': 'LIMITED SLOTS', booked: 'FULLY BOOKED', unavailable: 'UNAVAILABLE' };
const badge = { available: 'text-emerald-300 bg-emerald-950/50 border-emerald-500/30', 'partially-booked': 'text-[#F3E5AB] bg-[#D4AF37]/10 border-[#D4AF37]/30', booked: 'text-red-300 bg-red-950/40 border-red-800/40', unavailable: 'text-gray-500 bg-gray-900 border-gray-700' };

export default function TableCard({ table, selected, onSelect }: { key?: string; table: BookingTable; selected: boolean; onSelect: () => void }) {
  const disabled = table.status === 'booked' || table.status === 'unavailable';
  return <article className={`group relative border p-5 sm:p-6 bg-[#100b0a]/95 transition-all ${selected ? 'border-[#D4AF37] shadow-[0_0_25px_rgba(212,175,55,.12)]' : 'border-white/10 hover:border-[#D4AF37]/40'} ${disabled ? 'opacity-65' : ''}`}>
    <div className="flex justify-between gap-3 items-start mb-6"><div><p className="text-[9px] text-[#D4AF37] uppercase tracking-[.25em] mb-2">{table.type}</p><h3 className="text-2xl text-[#F3E5AB]">{table.name}</h3></div><span className={`border px-2.5 py-1 text-[8px] tracking-[.14em] ${badge[table.status]}`}>{labels[table.status]}</span></div>
    <div className="space-y-2 text-xs text-gray-400 mb-5"><p className="flex items-center gap-2"><MapPin size={14} className="text-[#D4AF37]" />{table.zone}</p><p className="flex items-center gap-2"><Users size={14} className="text-[#D4AF37]" />Up to {table.capacity} players</p></div>
    <div className="flex flex-wrap gap-2 min-h-14 mb-5">{table.features.map(feature => <span key={feature} className="self-start border border-white/10 bg-black/20 px-2 py-1 text-[9px] text-gray-400">{feature}</span>)}</div>
    <button type="button" disabled={disabled} onClick={onSelect} aria-pressed={selected} className="w-full border border-[#D4AF37]/40 py-3 text-[9px] uppercase tracking-[.2em] text-[#F3E5AB] hover:bg-[#D4AF37] hover:text-[#080605] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] disabled:cursor-not-allowed disabled:border-white/10 disabled:text-gray-600 disabled:hover:bg-transparent">{selected ? 'Selected — View Slots' : disabled ? labels[table.status] : 'View Slots'}</button>
  </article>;
}


