import { LoaderCircle } from 'lucide-react';
import type { ReactNode } from 'react';

export default function InlineLoadingLabel({ loading, loadingText, children }: { loading: boolean; loadingText: string; children: ReactNode }) {
  return loading ? <span className="inline-flex items-center justify-center gap-2"><LoaderCircle aria-hidden="true" size={14} className="animate-spin"/>{loadingText}</span> : <>{children}</>;
}
