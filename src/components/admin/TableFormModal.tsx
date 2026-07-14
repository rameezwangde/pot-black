import { useState, type FormEvent } from 'react';
import { Plus, X } from 'lucide-react';
import AdminModalShell from './AdminModalShell';
import { createTable, updateTable, type OperationalTable, type TablePayload } from '../../services/adminTableService';
import type { AdminApiError } from '../../services/adminService';

const input = 'mt-2 w-full border border-white/10 bg-black/30 px-3 py-3 text-sm text-[#F3E5AB] outline-none focus:border-[#D4AF37]';
export default function TableFormModal({ table, onClose, onSuccess }: { table?: OperationalTable; onClose: () => void; onSuccess: (message: string) => void }) {
  const [form, setForm] = useState<TablePayload>({ name: table?.name ?? '', code: table?.code ?? '', type: table?.type ?? '', zone: table?.zone ?? '', capacity: table?.capacity ?? 4, features: table?.features ?? [] });
  const [feature, setFeature] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const set = (key: keyof TablePayload, value: string | number | string[]) => setForm(current => ({ ...current, [key]: value }));
  const addFeature = () => { const value = feature.trim(); if (!value || form.features.some(item => item.toLowerCase() === value.toLowerCase())) return; set('features', [...form.features, value]); setFeature(''); };
  const submit = async (event: FormEvent) => {
    event.preventDefault(); setError('');
    const payload = { ...form, name: form.name.trim(), code: form.code.trim().toUpperCase(), type: form.type.trim(), zone: form.zone.trim(), features: [...new Set(form.features.map(item => item.trim()).filter(Boolean))] };
    if (!payload.name || !payload.code || !payload.type || !payload.zone) { setError('All table fields are required.'); return; }
    if (!Number.isInteger(payload.capacity) || payload.capacity < 1) { setError('Capacity must be a whole number of at least 1.'); return; }
    if (payload.name.length > 100 || payload.code.length > 20) { setError('Table name or code is too long.'); return; }
    setSubmitting(true);
    try { if (table) await updateTable(table._id, payload); else await createTable(payload); onSuccess(table ? 'Table updated successfully.' : 'Table created successfully.'); }
    catch (requestError) { setError((requestError as AdminApiError).message); }
    finally { setSubmitting(false); }
  };
  return <AdminModalShell title={table ? 'Edit Table' : 'Add Table'} onClose={onClose} width="max-w-2xl"><form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
    <label className="text-[9px] uppercase tracking-[.14em] text-gray-400">Table Name<input maxLength={100} value={form.name} onChange={event => set('name', event.target.value)} className={input}/></label>
    <label className="text-[9px] uppercase tracking-[.14em] text-gray-400">Code<input maxLength={20} value={form.code} onChange={event => set('code', event.target.value.toUpperCase())} className={`${input} uppercase`}/></label>
    <label className="text-[9px] uppercase tracking-[.14em] text-gray-400">Type<input maxLength={100} value={form.type} onChange={event => set('type', event.target.value)} className={input}/></label>
    <label className="text-[9px] uppercase tracking-[.14em] text-gray-400">Zone<input maxLength={100} value={form.zone} onChange={event => set('zone', event.target.value)} className={input}/></label>
    <label className="text-[9px] uppercase tracking-[.14em] text-gray-400">Capacity<input type="number" min={1} value={form.capacity} onChange={event => set('capacity', Number(event.target.value))} className={input}/></label>
    <div className="sm:col-span-2"><label className="text-[9px] uppercase tracking-[.14em] text-gray-400">Features<span className="mt-2 flex"><input value={feature} onChange={event => setFeature(event.target.value)} onKeyDown={event => { if (event.key === 'Enter') { event.preventDefault(); addFeature(); } }} className={`${input} mt-0`}/><button type="button" onClick={addFeature} aria-label="Add feature" className="border border-l-0 border-white/10 px-4 text-[#D4AF37]"><Plus size={16}/></button></span></label><div className="mt-3 flex flex-wrap gap-2">{form.features.map(item => <span key={item} className="flex items-center gap-2 border border-white/10 px-2.5 py-1.5 text-[9px] text-gray-300">{item}<button type="button" onClick={() => set('features', form.features.filter(featureItem => featureItem !== item))} aria-label={`Remove ${item}`}><X size={12}/></button></span>)}</div></div>
    {error && <p aria-live="polite" className="sm:col-span-2 border border-red-800/40 bg-red-950/20 p-3 text-xs text-red-200">{error}</p>}
    <div className="sm:col-span-2 flex gap-3"><button type="button" onClick={onClose} className="flex-1 border border-white/10 py-3 text-[9px] uppercase tracking-[.14em] text-gray-400">Close</button><button type="submit" disabled={submitting} className="flex-1 bg-[#D4AF37] py-3 text-[9px] font-semibold uppercase tracking-[.14em] text-black disabled:opacity-60">{submitting ? 'Saving...' : table ? 'Save Changes' : 'Add Table'}</button></div>
  </form></AdminModalShell>;
}
