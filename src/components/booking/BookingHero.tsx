import { CalendarCheck, Radio } from 'lucide-react';
import { motion } from 'motion/react';

export default function BookingHero() {
  return (
    <section className="relative min-h-[500px] h-[62vh] max-h-[700px] flex items-end overflow-hidden border-b border-[#D4AF37]/20">
      <motion.img
        src="/booking-hero-v2.png"
        alt="Luxury Pot Black billiards lounge prepared for a reservation"
        initial={{ scale: 1.045, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.4, ease: 'easeOut' }}
        className="absolute inset-0 h-full w-full object-cover object-[67%_center] sm:object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#080605] via-[#080605]/88 to-[#080605]/5" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#080605] via-transparent to-black/65" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_52%,transparent_0%,rgba(8,6,5,.08)_42%,rgba(8,6,5,.58)_100%)]" />
      <div className="absolute left-0 right-0 bottom-0 h-32 bg-gradient-to-t from-[#080605] to-transparent" />

      <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .9, delay: .2 }} className="relative w-full max-w-[1500px] mx-auto px-5 sm:px-8 lg:px-12 pb-16 md:pb-20">
        <div className="max-w-3xl border-l border-[#D4AF37]/55 pl-5 sm:pl-7">
          <p className="flex items-center gap-3 text-[#D4AF37] text-[10px] sm:text-xs tracking-[.32em] uppercase mb-4"><span className="w-8 h-px bg-[#D4AF37]" /> Pot Black Reservations</p>
          <h1 className="text-5xl sm:text-6xl lg:text-[5.25rem] leading-[.98] text-[#F3E5AB] mb-6 drop-shadow-[0_4px_24px_rgba(0,0,0,.8)]">Reserve Your Table</h1>
          <p className="max-w-xl text-sm sm:text-base text-gray-300 font-light leading-relaxed">Choose your preferred table, date, and playing time. Live availability helps you plan your visit without waiting.</p>
        </div>
        <div className="flex flex-wrap gap-5 sm:gap-8 mt-8 pl-5 sm:pl-7 text-[10px] uppercase tracking-[.16em] text-gray-200">
          <span className="flex items-center gap-2"><Radio size={15} className="text-emerald-400" /> Live Table Availability</span>
          <span className="flex items-center gap-2"><CalendarCheck size={15} className="text-[#D4AF37]" /> Quick Slot Reservation</span>
        </div>
      </motion.div>
    </section>
  );
}
