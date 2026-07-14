import { Activity, CalendarCheck2, Clock3, Table2 } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

const cards = [
  { label: "Today's Bookings", icon: CalendarCheck2 },
  { label: 'Playing Now', icon: Activity },
  { label: 'Available Tables', icon: Table2 },
  { label: 'Upcoming Reservations', icon: Clock3 },
];

export default function AdminDashboardPage() {
  const { isAdminVerified } = useAdminAuth();
  return <section className="mx-auto max-w-[1450px]">
    <div className="mb-9 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="mb-2 text-[9px] uppercase tracking-[.3em] text-[#D4AF37]">Secure Workspace</p><h2 className="mb-3 text-4xl text-[#F3E5AB] sm:text-5xl">Operations Overview</h2><p className="max-w-2xl text-sm leading-6 text-gray-400">Manage Pot Black bookings, tables and live sessions from one secure dashboard.</p></div>{isAdminVerified && <p className="flex items-center gap-2 text-[9px] uppercase tracking-[.15em] text-emerald-300"><span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,.7)]"/>Backend connection ready</p>}</div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(card => { const Icon = card.icon; return <article key={card.label} className="border border-[#D4AF37]/15 bg-[#140a0b]/80 p-6 shadow-[0_16px_45px_rgba(0,0,0,.2)]"><div className="mb-8 flex items-start justify-between gap-4"><p className="text-[10px] uppercase tracking-[.16em] text-gray-400">{card.label}</p><Icon size={18} strokeWidth={1.3} className="text-[#D4AF37]"/></div><p className="font-serif text-4xl text-[#F3E5AB]">—</p><div className="mt-5 h-px bg-gradient-to-r from-[#D4AF37]/25 to-transparent"/></article>; })}</div>
    <div className="mt-8 border border-dashed border-white/10 px-6 py-12 text-center"><p className="text-sm text-gray-500">Live dashboard statistics will appear here in the next admin dashboard step.</p></div>
  </section>;
}


