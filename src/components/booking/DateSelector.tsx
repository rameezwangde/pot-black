const localDate = (date: Date) => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
export const getToday = () => localDate(new Date());

export default function DateSelector({ selected, onSelect }: { selected: string; onSelect: (date: string) => void }) {
  const days = Array.from({ length: 7 }, (_, index) => { const d = new Date(); d.setHours(12,0,0,0); d.setDate(d.getDate() + index); return d; });
  return <div className="overflow-x-auto pb-3"><div className="flex min-w-max gap-3">
    {days.map(date => { const value = localDate(date); const active = value === selected; return <button type="button" key={value} aria-pressed={active} onClick={() => onSelect(value)} className={`w-[100px] py-4 border text-center focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all ${active ? 'bg-[#D4AF37] border-[#D4AF37] text-[#080605] shadow-[0_0_24px_rgba(212,175,55,.2)]' : 'bg-[#100b0a] border-white/10 text-[#F3E5AB] hover:border-[#D4AF37]/60'}`}><span className="block text-[9px] tracking-[.24em] uppercase mb-1">{date.toLocaleDateString('en-US',{weekday:'short'})}</span><span className="font-serif text-lg">{date.toLocaleDateString('en-US',{day:'2-digit',month:'short'}).toUpperCase()}</span></button>; })}
  </div></div>;
}

