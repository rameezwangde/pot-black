import { motion } from 'motion/react';
import { ArrowRight, Trophy, Users, Star, Martini, Lock, Crosshair } from 'lucide-react';

export default function About() {
  return (
    <section id="about" className="relative z-10">
      
      {/* Stats Section */}
      <div className="max-w-[1200px] mx-auto px-8 py-16 border-b border-white/5">
        <div className="flex flex-col md:flex-row justify-between items-center gap-12">
          
          <motion.div 
            className="flex items-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-12 h-12 rounded-full border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
              <Crosshair size={24} strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-3xl font-serif text-[#D4AF37] mb-1">20+</h3>
              <p className="text-gray-400 text-[10px] uppercase tracking-[0.2em]">Premium Tables</p>
            </div>
          </motion.div>

          <div className="hidden md:block w-[1px] h-16 bg-white/5" />

          <motion.div 
            className="flex items-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="w-12 h-12 rounded-full border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
              <Trophy size={24} strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-3xl font-serif text-[#D4AF37] mb-1">5+</h3>
              <p className="text-gray-400 text-[10px] uppercase tracking-[0.2em]">Years of Legacy</p>
            </div>
          </motion.div>

          <div className="hidden md:block w-[1px] h-16 bg-white/5" />

          <motion.div 
            className="flex items-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="w-12 h-12 rounded-full border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
              <Users size={24} strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-3xl font-serif text-[#D4AF37] mb-1">2K+</h3>
              <p className="text-gray-400 text-[10px] uppercase tracking-[0.2em]">Happy Members</p>
            </div>
          </motion.div>

        </div>
      </div>

      {/* About Section */}
      <div className="max-w-[1600px] mx-auto px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[4fr_5fr] gap-12 lg:gap-20 items-center">
          
          <motion.div 
            className="flex flex-col pr-0 lg:pr-8"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <span className="text-[#968351] uppercase tracking-[0.2em] text-[10px] font-semibold mb-4 block">ABOUT POT BLACK</span>
            <h2 className="text-4xl md:text-5xl lg:text-[2.75rem] font-serif text-[#E2D2A4] leading-[1.15] mb-8 uppercase drop-shadow-md tracking-normal">
              MORE THAN A GAME,<br/>IT'S A LIFESTYLE.
            </h2>
            <p className="text-gray-300 font-light mb-10 leading-relaxed text-sm max-w-lg">
              Pot Black is where precision meets passion.<br/>
              A premium billiards club crafted for connoisseurs<br/>
              of the game and the finer things in life.
            </p>
            <div>
              <a href="#" className="inline-flex items-center gap-3 px-8 py-4 border border-[#8C7640]/40 bg-black/50 text-[#8C7640] font-medium text-[10px] uppercase tracking-[0.2em] hover:bg-[#8C7640]/10 hover:border-[#8C7640] transition-all rounded-[1px]">
                DISCOVER OUR STORY <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <div className="relative w-full aspect-[4/3] lg:aspect-auto lg:h-[600px] xl:h-[700px] rounded-[2px] overflow-hidden shadow-2xl">
              <img 
                src="/about.png" 
                alt="Lounge" 
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
