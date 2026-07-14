import { Info } from 'lucide-react';

export default function AvailabilityStatus({ lastCheckedAt, checking }: { lastCheckedAt?: Date; checking?: boolean }) {
  return <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-emerald-500/15 bg-emerald-950/10 px-5 py-4">
    <div className="flex gap-3 text-sm text-gray-400"><Info size={17} className="text-[#D4AF37] shrink-0 mt-0.5" /><p>Your selected slot is rechecked automatically every five seconds while you complete the reservation.</p></div>
    <div className="shrink-0"><p className="flex items-center gap-2 text-[10px] uppercase tracking-[.16em] text-emerald-300"><span className="relative flex w-2 h-2"><span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping"/><span className="relative rounded-full w-2 h-2 bg-emerald-400"/></span>{checking ? 'Checking Availability' : 'Live Availability'}</p><p className="text-[9px] text-gray-500 mt-1 ml-4">{lastCheckedAt ? `Last checked ${lastCheckedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}` : 'Select a slot to check live availability'}</p></div>
  </div>;
}
