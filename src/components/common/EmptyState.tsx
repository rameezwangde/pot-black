import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
  compact?: boolean;
}

export default function EmptyState({ icon: Icon, title, description, actionLabel, onAction, compact = false }: EmptyStateProps) {
  return <div className={`relative overflow-hidden border border-[#D4AF37]/20 bg-[#120b0a]/80 px-5 text-center ${compact ? 'py-7' : 'py-10 sm:px-10 sm:py-14'}`}>
    <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-px w-28 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"/>
    <span className={`mx-auto flex items-center justify-center rounded-full border border-[#D4AF37]/25 bg-[#D4AF37]/[.06] text-[#D4AF37] ${compact ? 'h-11 w-11' : 'h-14 w-14'}`}><Icon aria-hidden="true" size={compact ? 19 : 23} strokeWidth={1.4}/></span>
    <h3 className={`text-[#F3E5AB] ${compact ? 'mt-4 text-xl' : 'mt-5 text-2xl sm:text-3xl'}`}>{title}</h3>
    <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-gray-500 sm:text-sm sm:leading-6">{description}</p>
    <button type="button" onClick={onAction} className="mt-5 border border-[#D4AF37]/40 bg-[#D4AF37]/[.04] px-5 py-2.5 text-[9px] font-semibold uppercase tracking-[.16em] text-[#F3E5AB] transition-colors hover:bg-[#D4AF37] hover:text-[#080605] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]">{actionLabel}</button>
  </div>;
}
