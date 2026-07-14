import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ApiErrorCard({ title = 'Unable to Load Data', message, onRetry, compact = false }: { title?: string; message: string; onRetry?: () => void; compact?: boolean }) {
  return <div role="alert" className={`border border-red-900/45 bg-red-950/15 px-5 text-center ${compact ? 'py-5' : 'py-9 sm:px-9'}`}>
    <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-red-800/45 bg-red-950/30 text-red-300"><AlertTriangle aria-hidden="true" size={20} strokeWidth={1.5}/></span>
    <h3 className="mt-4 text-xl text-[#F3E5AB] sm:text-2xl">{title}</h3>
    <p className="mx-auto mt-2 max-w-lg text-xs leading-5 text-red-100/75 sm:text-sm sm:leading-6">{message}</p>
    {onRetry && <button type="button" onClick={onRetry} className="mt-5 inline-flex items-center justify-center gap-2 border border-[#D4AF37]/40 px-5 py-2.5 text-[9px] font-semibold uppercase tracking-[.16em] text-[#F3E5AB] hover:bg-[#D4AF37] hover:text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"><RefreshCw size={13}/>Try Again</button>}
  </div>;
}
