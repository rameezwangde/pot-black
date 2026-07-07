import { motion } from 'motion/react';
import { ArrowRight, Trophy, Users, Star, Martini, Lock, Crosshair } from 'lucide-react';
import Stats from './Stats';

export default function About() {
  return (
    <section id="about" className="relative z-10 bg-[#0a0505]">
      
      {/* Stats Section */}
      <Stats />

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
              <a href="#" className="inline-flex items-center justify-center gap-3 px-6 py-3.5 bg-[#CBA469] text-black font-semibold text-[10px] uppercase tracking-[0.15em] hover:scale-105 transition-transform duration-300 rounded-[1px]">
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
