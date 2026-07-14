import type { BookingTable } from '../../data/bookingMockData';
import { SearchX } from 'lucide-react';
import TableCard from './TableCard';
import EmptyState from '../common/EmptyState';

export default function TableAvailabilityGrid({ tables, selectedId, loading, onSelect, onReset }: { tables: BookingTable[]; selectedId?: string; loading: boolean; onSelect: (table: BookingTable) => void; onReset: () => void }) {
  if (loading) return <div role="status" aria-label="Loading table availability"><span className="sr-only">Loading available tables...</span><div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">{Array.from({length:8}).map((_,i)=><div key={i} className="h-72 border border-white/5 bg-white/[.025] animate-pulse motion-reduce:animate-none p-6"><div className="h-3 w-20 bg-white/10 mb-4"/><div className="h-8 w-32 bg-white/10 mb-8"/><div className="h-3 w-full bg-white/5 mb-3"/><div className="h-3 w-2/3 bg-white/5"/></div>)}</div></div>;
  if (!tables.length) return <EmptyState icon={SearchX} title="No Available Tables" description="No active table matches this date, group size and duration. Try adjusting your booking preferences." actionLabel="Reset Booking Filters" onAction={onReset}/>;
  return <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">{tables.map(table => <TableCard key={table.id} table={table} selected={selectedId === table.id} onSelect={() => onSelect(table)} />)}</div>;
}

