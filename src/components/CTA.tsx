import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export default function CTA() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-black">
      {/* Background with overlay */}
      <div className="absolute inset-0">
        <img 
          src="/cta_bg.png" 
          alt="Ready to take your shot" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0505] via-transparent to-[#0a0505]" />
        <div className="absolute inset-0 bg-[#D4AF37]/10 mix-blend-overlay" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#E2D2A4] uppercase tracking-wide mb-6 drop-shadow-lg">
            Ready to Take Your Shot?
          </h2>
          <p className="text-gray-300 text-lg md:text-xl font-light mb-10 max-w-2xl mx-auto leading-relaxed">
            Experience the ultimate luxury in billiards. Whether it's a casual evening with friends or a competitive match, Pot Black awaits.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-[#CBA469] to-[#D4AF37] text-black font-bold uppercase tracking-[0.15em] text-sm transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] flex items-center justify-center gap-3 rounded-[2px]">
              Book a Table <ArrowRight className="w-5 h-5" />
            </button>
            <button className="w-full sm:w-auto px-10 py-4 border border-[#CBA469] text-[#CBA469] hover:bg-[#CBA469]/10 font-bold uppercase tracking-[0.15em] text-sm transition-all hover:scale-105 flex items-center justify-center rounded-[2px] backdrop-blur-sm">
              Explore Memberships
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
