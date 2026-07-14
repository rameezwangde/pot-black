import { motion } from 'motion/react';
import AnimatedHeading from './AnimatedHeading';

export default function Pricing() {
  return (
    <section className="py-16 sm:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-billiards-dark -z-20" />
      
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-billiards-dark/95 mix-blend-multiply z-10" />
        <img 
          src="https://images.unsplash.com/photo-1575444758702-4a6b92f72e9e?q=80&w=2000&auto=format&fit=crop" 
          alt="Billiards Tables" 
          className="w-full h-full object-cover opacity-20 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-billiards-dark via-transparent to-billiards-dark z-20" />
      </div>

      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent z-10" />
      <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-billiards-emerald/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <AnimatedHeading className="text-4xl md:text-5xl lg:text-6xl font-serif mb-6 leading-tight">Table <br/><span className="gold-text-gradient italic">Rates</span></AnimatedHeading>
            <p className="text-gray-400 font-light mb-10 max-w-md leading-relaxed">
              Walk-ins are always welcome, though we highly recommend booking in advance during peak hours. Prices are per hour, per table.
            </p>

            <div className="space-y-8">
              <div className="flex justify-between items-end border-b border-white/5 pb-4 group hover:border-billiards-gold/30 transition-colors">
                <div>
                  <h4 className="font-serif text-xl text-white group-hover:text-billiards-gold transition-colors">Off-Peak Hours</h4>
                  <p className="text-xs uppercase tracking-widest text-gray-500 mt-1">Mon-Thu (Before 5 PM)</p>
                </div>
                <div className="text-3xl font-serif text-billiards-gold">$18</div>
              </div>
              <div className="flex justify-between items-end border-b border-white/5 pb-4 group hover:border-billiards-gold/30 transition-colors">
                <div>
                  <h4 className="font-serif text-xl text-white group-hover:text-billiards-gold transition-colors">Peak Hours</h4>
                  <p className="text-xs uppercase tracking-widest text-gray-500 mt-1">Mon-Thu (After 5 PM) & Fri-Sun</p>
                </div>
                <div className="text-3xl font-serif text-billiards-gold">$28</div>
              </div>
              <div className="flex justify-between items-end border-b border-white/5 pb-4 group hover:border-billiards-gold/30 transition-colors">
                <div>
                  <h4 className="font-serif text-xl gold-text-gradient">Private VIP Room</h4>
                  <p className="text-xs uppercase tracking-widest text-gray-500 mt-1">Requires Reservation</p>
                </div>
                <div className="text-3xl font-serif text-billiards-gold">$60</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="glass-card p-6 sm:p-10 lg:p-14 border border-billiards-gold/20 relative"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-billiards-gold/10 blur-2xl rounded-full" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-billiards-emerald/10 blur-2xl rounded-full" />
            
            <h3 className="text-3xl font-serif mb-6 text-white">Lounge Menu</h3>
            <p className="text-gray-400 text-sm font-light mb-8 leading-relaxed">
              Enjoy our curated selection of craft cocktails and premium bar bites while you play. Handcrafted to perfection.
            </p>
            <ul className="space-y-6 font-light text-sm text-gray-300">
              <li className="flex justify-between items-center group">
                <span className="tracking-wide group-hover:text-white transition-colors">Signature Cocktails</span> 
                <span className="flex-1 border-b border-dotted border-white/20 mx-4" />
                <span className="text-billiards-gold font-serif text-lg">From $14</span>
              </li>
              <li className="flex justify-between items-center group">
                <span className="tracking-wide group-hover:text-white transition-colors">Premium Drafts</span> 
                <span className="flex-1 border-b border-dotted border-white/20 mx-4" />
                <span className="text-billiards-gold font-serif text-lg">From $8</span>
              </li>
              <li className="flex justify-between items-center group">
                <span className="tracking-wide group-hover:text-white transition-colors">Artisan Flatbreads</span> 
                <span className="flex-1 border-b border-dotted border-white/20 mx-4" />
                <span className="text-billiards-gold font-serif text-lg">$16</span>
              </li>
              <li className="flex justify-between items-center group">
                <span className="tracking-wide group-hover:text-white transition-colors">Wagyu Sliders</span> 
                <span className="flex-1 border-b border-dotted border-white/20 mx-4" />
                <span className="text-billiards-gold font-serif text-lg">$22</span>
              </li>
            </ul>
            <button className="mt-12 text-xs uppercase tracking-[0.2em] font-semibold text-billiards-gold hover:text-white transition-colors border-b border-billiards-gold hover:border-white pb-1">
              View Full Menu
            </button>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
