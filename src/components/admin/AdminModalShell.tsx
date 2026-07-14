import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';

export default function AdminModalShell({ title, children, onClose, width = 'max-w-lg' }: { title: string; children: ReactNode; onClose: () => void; width?: string }) {
  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [onClose]);
  return <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 p-0 backdrop-blur-sm sm:items-center sm:p-4" onMouseDown={event => event.target === event.currentTarget && onClose()}><section role="dialog" aria-modal="true" aria-label={title} className={`max-h-[95dvh] w-full overflow-x-hidden overflow-y-auto border border-[#D4AF37]/25 bg-[#160b0c] p-5 shadow-2xl sm:p-7 ${width}`}><header className="mb-6 flex items-center justify-between gap-5 border-b border-white/10 pb-4"><h2 className="min-w-0 break-words text-xl sm:text-2xl text-[#F3E5AB]">{title}</h2><button type="button" onClick={onClose} aria-label={`Close ${title}`} className="text-gray-500 hover:text-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"><X size={22}/></button></header>{children}</section></div>;
}
