import { getDubaiDateOptions, getDubaiToday } from '../../utils/bookingTime';

export { getDubaiToday as getToday };

export default function DateSelector({ selected, onSelect }: { selected: string; onSelect: (date: string) => void }) {
  const days = getDubaiDateOptions();
  return <div className="pb-3"><div className="grid grid-cols-2 gap-3 min-[390px]:grid-cols-3 sm:grid-cols-4 lg:grid-cols-7">
    {days.map(date => { const active = date.value === selected; return <button type="button" key={date.value} aria-pressed={active} onClick={() => onSelect(date.value)} className={`w-full min-w-0 py-4 border text-center focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all ${active ? 'bg-[#D4AF37] border-[#D4AF37] text-[#080605] shadow-[0_0_24px_rgba(212,175,55,.2)]' : 'bg-[#100b0a] border-white/10 text-[#F3E5AB] hover:border-[#D4AF37]/60'}`}><span className="block text-[9px] tracking-[.24em] uppercase mb-1">{date.weekday}</span><span className="font-serif text-lg">{date.label}</span></button>; })}
  </div></div>;
}
