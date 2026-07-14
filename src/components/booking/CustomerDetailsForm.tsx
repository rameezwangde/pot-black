import type { ReactNode } from 'react';
import type { CustomerDetails } from '../../pages/BookingPage';
import InlineLoadingLabel from '../common/InlineLoadingLabel';

export type FormErrors = Partial<Record<keyof CustomerDetails, string>>;
interface Props { details: CustomerDetails; errors: FormErrors; capacity: number; submitting: boolean; onChange: (details: CustomerDetails) => void; onSubmit: () => void; summary: ReactNode; }
const input = 'w-full mt-2 bg-black/35 border border-white/10 px-4 py-3.5 text-sm text-[#F3E5AB] placeholder:text-gray-600 outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30';

export default function CustomerDetailsForm({ details, errors, capacity, submitting, onChange, onSubmit, summary }: Props) {
  const set = <K extends keyof CustomerDetails>(key: K, value: CustomerDetails[K]) => onChange({...details,[key]:value});
  return <section id="customer-details" className="scroll-mt-28 border border-[#D4AF37]/20 bg-[#100b0a]/95 p-5 sm:p-8">
    <p className="text-[9px] uppercase tracking-[.3em] text-[#D4AF37] mb-2">Final Step</p><h2 className="text-3xl sm:text-4xl text-[#F3E5AB] mb-8">Complete Your Reservation</h2>
    <div className="grid lg:grid-cols-[minmax(0,1fr)_340px] gap-8"><form noValidate onSubmit={e => {e.preventDefault(); onSubmit();}} className="grid sm:grid-cols-2 gap-5">
      <Field label="Full Name" error={errors.fullName}><input value={details.fullName} onChange={e=>set('fullName',e.target.value)} className={input} autoComplete="name" /></Field>
      <Field label="Mobile Number" error={errors.mobile}><input value={details.mobile} onChange={e=>set('mobile',e.target.value)} className={input} type="tel" autoComplete="tel" /></Field>
      <Field label="Email Address" error={errors.email}><input value={details.email} onChange={e=>set('email',e.target.value)} className={input} type="email" autoComplete="email" /></Field>
      <Field label="Number of Players" error={errors.players}><input value={details.players} onChange={e=>set('players',Number(e.target.value))} className={input} type="number" min={1} max={capacity} /></Field>
      <div className="sm:col-span-2"><label className="text-[10px] uppercase tracking-[.16em] text-gray-400">Special Request <span className="normal-case tracking-normal text-gray-600">(optional)</span><textarea rows={4} value={details.request} onChange={e=>set('request',e.target.value)} className={`${input} resize-none`} /></label></div>
      <div className="sm:col-span-2"><label className="flex items-start gap-3 text-xs text-gray-400 cursor-pointer"><input type="checkbox" checked={details.terms} onChange={e=>set('terms',e.target.checked)} className="mt-0.5 accent-[#D4AF37] w-4 h-4" />I agree to the booking terms and cancellation policy</label>{errors.terms && <p className="text-red-300 text-[10px] mt-2">{errors.terms}</p>}</div>
      <button disabled={submitting} aria-busy={submitting} className="sm:col-span-2 w-full bg-[#D4AF37] text-[#080605] py-4 uppercase tracking-[.2em] text-[10px] font-semibold hover:bg-[#F3E5AB] focus:outline-none focus:ring-2 focus:ring-[#F3E5AB] disabled:opacity-60"><InlineLoadingLabel loading={submitting} loadingText="Booking...">Confirm Reservation</InlineLoadingLabel></button>
    </form><div className="order-first lg:order-none">{summary}</div></div>
  </section>;
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) { return <label className="text-[10px] uppercase tracking-[.16em] text-gray-400">{label}{children}{error && <span className="block text-red-300 normal-case tracking-normal mt-1">{error}</span>}</label>; }

