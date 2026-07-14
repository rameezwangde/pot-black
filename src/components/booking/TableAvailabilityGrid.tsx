import type { BookingTable } from '../../data/bookingMockData';
import TableCard from './TableCard';

export default function TableAvailabilityGrid({ tables, selectedId, loading, onSelect }: { tables: BookingTable[]; selectedId?: string; loading: boolean; onSelect: (table: BookingTable) => void }) {
  if (loading) return <div aria-label="Loading availability" className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">{Array.from({length:8}).map((_,i)=><div key={i} className="h-72 border border-white/5 bg-white/[.025] animate-pulse p-6"><div className="h-3 w-20 bg-white/10 mb-4"/><div className="h-8 w-32 bg-white/10 mb-8"/><div className="h-3 w-full bg-white/5 mb-3"/><div className="h-3 w-2/3 bg-white/5"/></div>)}</div>;
  if (!tables.length) return <div className="border border-[#D4AF37]/15 bg-[#100b0a] p-12 text-center text-gray-400">No tables are currently available for the selected date and group size.</div>;
  return <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">{tables.map(table => <TableCard key={table.id} table={table} selected={selectedId === table.id} onSelect={() => onSelect(table)} />)}</div>;
}

