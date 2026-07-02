import { motion } from 'motion/react';
import AnimatedHeading from './AnimatedHeading';

export default function Booking() {
  return (
    <section id="booking" className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-billiards-dark/90 mix-blend-multiply z-10" />
        <div className="absolute inset-0 bg-premium-gradient opacity-60 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1563606616147-36e659eb8f9f?q=80&w=2000&auto=format&fit=crop" 
          alt="Dark Billiards Background" 
          className="w-full h-full object-cover scale-105"
        />
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <motion.div 
          className="glass-card p-10 md:p-16 text-center border-billiards-gold/20 shadow-[0_30px_60px_rgba(0,0,0,0.8)] relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-billiards-gold/50 to-transparent" />
          
          <AnimatedHeading className="text-4xl md:text-5xl lg:text-6xl font-serif mb-6 leading-tight">
            Reserve Your <br/><span className="italic gold-text-gradient">Experience</span>
          </AnimatedHeading>
          <p className="text-gray-400 font-light mb-12 max-w-2xl mx-auto leading-relaxed">
            Book a table for the evening, or reserve our private lounge for your next corporate event or celebration. Exclusivity awaits.
          </p>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div className="space-y-3">
              <label className="text-[10px] uppercase tracking-[0.3em] font-semibold text-billiards-gold">Date</label>
              <input 
                type="date" 
                className="w-full bg-black/40 border border-white/10 p-4 text-white focus:outline-none focus:border-billiards-gold/50 transition-colors font-light shadow-inner rounded-sm"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] uppercase tracking-[0.3em] font-semibold text-billiards-gold">Time</label>
              <input 
                type="time" 
                className="w-full bg-black/40 border border-white/10 p-4 text-white focus:outline-none focus:border-billiards-gold/50 transition-colors font-light shadow-inner rounded-sm"
              />
            </div>
            <div className="space-y-3 md:col-span-2">
              <label className="text-[10px] uppercase tracking-[0.3em] font-semibold text-billiards-gold">Booking Type</label>
              <select className="w-full bg-black/40 border border-white/10 p-4 text-white focus:outline-none focus:border-billiards-gold/50 transition-colors font-light appearance-none shadow-inner rounded-sm">
                <option value="standard" className="bg-billiards-dark text-white">Standard Table (2-4 Players)</option>
                <option value="premium" className="bg-billiards-dark text-white">Premium Table (Pro Room)</option>
                <option value="private" className="bg-billiards-dark text-white">Private Party (10+ Guests)</option>
              </select>
            </div>
            
            <button 
              type="button"
              className="md:col-span-2 mt-6 w-full bg-billiards-gold text-billiards-dark py-5 uppercase tracking-[0.2em] font-bold text-sm hover:bg-billiards-light transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] rounded-sm"
            >
              Check Availability
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
