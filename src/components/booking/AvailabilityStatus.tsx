import { useEffect, useState } from 'react';
import { Info } from 'lucide-react';

export default function AvailabilityStatus() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    // TODO: Replace this simulated 15-second refresh with API polling or Socket.IO updates.
    const interval = window.setInterval(() => setSeconds(value => value + 15), 15000);
    return () => window.clearInterval(interval);
  }, []);
  return <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-emerald-500/15 bg-emerald-950/10 px-5 py-4">
    <div className="flex gap-3 text-sm text-gray-400"><Info size={17} className="text-[#D4AF37] shrink-0 mt-0.5" /><p>Availability shown on this page will update automatically when a reservation is created, cancelled, or extended.</p></div>
    <div className="shrink-0"><p className="flex items-center gap-2 text-[10px] uppercase tracking-[.16em] text-emerald-300"><span className="relative flex w-2 h-2"><span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping"/><span className="relative rounded-full w-2 h-2 bg-emerald-400"/></span>Live Availability</p><p className="text-[9px] text-gray-500 mt-1 ml-4">Last updated {seconds === 0 ? 'just now' : `${seconds} seconds ago`}</p></div>
  </div>;
}
