const steps = ['Select Date', 'Choose Table', 'Select Time', 'Your Details'];

export default function BookingSteps({ activeStep }: { activeStep: number }) {
  return (
    <div aria-label="Booking progress" className="pb-2">
      <ol className="grid grid-cols-2 sm:grid-cols-4 border border-[#D4AF37]/15 bg-[#100b0a]/90">
        {steps.map((step, index) => {
          const current = index + 1;
          const active = current <= activeStep;
          return <li key={step} aria-current={current === activeStep ? 'step' : undefined} className="relative flex min-w-0 items-center gap-2 px-3 py-4 sm:gap-3 sm:px-5 sm:py-5 border-r even:border-r-0 sm:even:border-r sm:last:border-r-0 border-[#D4AF37]/15">
            <span className={`w-7 h-7 rounded-full border flex items-center justify-center text-[9px] ${active ? 'bg-[#D4AF37] text-[#080605] border-[#D4AF37]' : 'border-white/20 text-gray-500'}`}>{String(current).padStart(2, '0')}</span>
            <span className={`text-[8px] uppercase tracking-[.12em] sm:text-[10px] sm:tracking-[.18em] ${active ? 'text-[#F3E5AB]' : 'text-gray-500'}`}>{step}</span>
            {current < 4 && <span className={`absolute -right-px top-0 h-[1px] w-full ${active ? 'bg-[#D4AF37]/50' : 'bg-transparent'}`} />}
          </li>;
        })}
      </ol>
    </div>
  );
}

