import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { CheckCircle2, Info, X, XCircle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';
interface Toast { id: number; type: ToastType; message: string; }
interface ToastValue { showToast: (message: string, type?: ToastType) => void; }
const ToastContext = createContext<ToastValue | undefined>(undefined);

export function AdminToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const remove = useCallback((id: number) => setToasts(current => current.filter(toast => toast.id !== id)), []);
  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(current => [...current, { id, type, message }]);
    window.setTimeout(() => remove(id), 4500);
  }, [remove]);
  const value = useMemo(() => ({ showToast }), [showToast]);
  return <ToastContext.Provider value={value}>{children}<div aria-live="polite" className="fixed left-3 right-3 top-3 z-[120] flex w-auto sm:left-auto sm:right-4 sm:top-4 sm:w-[min(390px,calc(100vw-2rem))] flex-col gap-3">{toasts.map(toast => { const Icon = toast.type === 'success' ? CheckCircle2 : toast.type === 'error' ? XCircle : Info; return <div key={toast.id} className={`flex items-start gap-3 border bg-[#180c0d] p-4 shadow-2xl ${toast.type === 'success' ? 'border-emerald-700/40 text-emerald-200' : toast.type === 'error' ? 'border-red-800/50 text-red-200' : 'border-[#D4AF37]/30 text-[#F3E5AB]'}`}><Icon size={18} className="mt-0.5 shrink-0"/><p className="min-w-0 flex-1 break-words text-xs leading-5">{toast.message}</p><button type="button" onClick={() => remove(toast.id)} aria-label="Dismiss notification" className="text-gray-500 hover:text-white"><X size={15}/></button></div>; })}</div></ToastContext.Provider>;
}

export const useAdminToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useAdminToast must be used within AdminToastProvider.');
  return context;
};
