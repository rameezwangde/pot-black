import { motion } from 'motion/react';
import { Target, Award, Coffee, Star, ShieldCheck, Gem, Users, CheckCircle2 } from 'lucide-react';
import Stats from '../components/Stats';
import CTA from '../components/CTA';

export default function AboutUs() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0505]">
      {/* Page Header */}
      <section className="relative pt-40 pb-20 px-8 overflow-hidden min-h-[60vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <img src="/about_hero_bg.png" alt="Pot Black Dubai Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#0a0505]/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0505] via-transparent to-transparent" />
        </div>
        
        <div className="max-w-[1200px] mx-auto relative z-10 text-center">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[#968351] uppercase tracking-[0.3em] text-sm md:text-base font-semibold mb-6 block"
          >
            About Us
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-6xl lg:text-7xl font-serif text-[#E2D2A4] uppercase drop-shadow-md mb-8 tracking-wide"
          >
            Dubai's Premier <br className="hidden md:block"/> Billiards Destination
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-gray-300 max-w-2xl mx-auto font-light leading-relaxed text-sm md:text-base"
          >
            Discover the ultimate luxury sports lounge in Dubai. Pot Black brings together a vibrant community of snooker and pool enthusiasts under one premium roof.
          </motion.p>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-12 relative border-t border-white/5">
        <div className="max-w-[1200px] mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-serif text-[#E2D2A4] uppercase mb-6 tracking-wide">Company Story</h2>
              <div className="w-16 h-[1px] bg-[#D4AF37] mb-8" />
              <p className="text-gray-300 font-light leading-relaxed mb-6 text-sm md:text-base">
                Established as the best billiards club in Dubai, Pot Black was born out of a profound passion for cue sports. Our founders recognized a gap in the UAE market for a truly elite venue that combines professional-grade snooker and pool facilities with high-end hospitality.
              </p>
              <p className="text-gray-300 font-light leading-relaxed mb-6 text-sm md:text-base">
                Over the years, we have grown from a modest pool hall into a cornerstone of the Dubai billiards community. We have hosted numerous local tournaments and provided a sanctuary for professionals and amateurs alike to hone their craft in the heart of the city.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="w-full h-[400px] bg-[#1A0E0E] rounded-sm overflow-hidden border border-white/5 shadow-2xl relative">
                <img src="/about.png" alt="Pot Black Dubai Snooker Lounge" className="w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0505] to-transparent opacity-60" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-12 relative border-t border-white/5">
        <div className="max-w-[1200px] mx-auto px-8">
           <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-[#E2D2A4] uppercase mb-6 tracking-wide">Vision & Mission</h2>
            <div className="w-16 h-[1px] bg-[#D4AF37] mx-auto" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Vision Card */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="group relative bg-[#0d0707] p-10 md:p-14 border border-white/5 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-[#D4AF37]/20 hover:shadow-[0_20px_40px_-15px_rgba(212,175,55,0.05)]"
            >
              {/* Decorative gradient orb */}
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-[80px] group-hover:bg-[#D4AF37]/10 transition-colors duration-700" />
              
              {/* Gold accent line */}
              <div className="absolute top-0 left-0 w-0 h-[2px] bg-gradient-to-r from-[#D4AF37] to-[#968351] transition-all duration-700 ease-out group-hover:w-full" />
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-16 h-16 rounded-full border border-[#D4AF37]/20 bg-[#1A0E0E] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 group-hover:border-[#D4AF37]/50 group-hover:shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                  <Target className="w-7 h-7 text-[#D4AF37]" strokeWidth={1.5} />
                </div>
                <h3 className="text-3xl font-serif text-[#E2D2A4] uppercase mb-4 tracking-wide group-hover:text-white transition-colors duration-300">Our Vision</h3>
                <p className="text-gray-400 font-light leading-relaxed text-sm md:text-base group-hover:text-gray-300 transition-colors duration-300">
                  To be universally recognized as the top pool hall in Dubai and the most prestigious luxury sports lounge in the UAE. We envision a vibrant community where the sport of billiards is celebrated, respected, and elevated to its highest standard.
                </p>
              </div>
            </motion.div>

            {/* Mission Card */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="group relative bg-[#0d0707] p-10 md:p-14 border border-white/5 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-[#D4AF37]/20 hover:shadow-[0_20px_40px_-15px_rgba(212,175,55,0.05)]"
            >
              {/* Decorative gradient orb */}
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-[80px] group-hover:bg-[#D4AF37]/10 transition-colors duration-700" />
              
              {/* Gold accent line */}
              <div className="absolute top-0 left-0 w-0 h-[2px] bg-gradient-to-r from-[#D4AF37] to-[#968351] transition-all duration-700 ease-out group-hover:w-full" />
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-16 h-16 rounded-full border border-[#D4AF37]/20 bg-[#1A0E0E] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 group-hover:border-[#D4AF37]/50 group-hover:shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                  <Award className="w-7 h-7 text-[#D4AF37]" strokeWidth={1.5} />
                </div>
                <h3 className="text-3xl font-serif text-[#E2D2A4] uppercase mb-4 tracking-wide group-hover:text-white transition-colors duration-300">Our Mission</h3>
                <p className="text-gray-400 font-light leading-relaxed text-sm md:text-base group-hover:text-gray-300 transition-colors duration-300">
                  To provide an unparalleled billiards experience by offering professional billiard tables in Dubai, exceptional customer service, and an environment that fosters both competitive excellence and relaxed socialization.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Core Values */}
      <section className="py-20 relative border-t border-white/5 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/values_bg.png" alt="Pot Black Core Values" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#0a0505]/40" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0505] via-transparent to-[#0a0505]" />
        </div>
        <div className="max-w-[1200px] mx-auto px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-[#E2D2A4] uppercase mb-6 tracking-wide">Our Core Values</h2>
            <div className="w-16 h-[1px] bg-[#D4AF37] mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Gem className="w-8 h-8" />,
                title: 'Excellence',
                desc: 'From our Italian slate tables to our meticulously maintained cues, we refuse to compromise on quality.'
              },
              {
                icon: <ShieldCheck className="w-8 h-8" />,
                title: 'Integrity',
                desc: 'We promote a culture of fairness, respect, and sportsmanship across all our games and tournaments.'
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: 'Community',
                desc: 'We are more than just a venue; we are the heartbeat of the Dubai billiards and snooker community.'
              }
            ].map((value, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative bg-[#0d0707]/60 backdrop-blur-md p-10 border border-white/10 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-[#D4AF37]/40 hover:shadow-[0_20px_40px_-15px_rgba(212,175,55,0.15)] group rounded-sm"
              >
                {/* Decorative gradient orb */}
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-[80px] group-hover:bg-[#D4AF37]/20 transition-colors duration-700" />
                
                {/* Gold accent line */}
                <div className="absolute top-0 left-0 w-0 h-[2px] bg-gradient-to-r from-[#D4AF37] to-[#968351] transition-all duration-700 ease-out group-hover:w-full" />

                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full border border-[#D4AF37]/30 bg-[#1A0E0E]/80 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 group-hover:border-[#D4AF37]/60 group-hover:shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                    <div className="text-[#D4AF37] scale-125">{value.icon}</div>
                  </div>
                  <h3 className="text-2xl font-serif text-[#E2D2A4] uppercase tracking-wider mb-4 group-hover:text-white transition-colors duration-300">{value.title}</h3>
                  <p className="text-gray-300 font-light text-sm md:text-base leading-relaxed group-hover:text-gray-200 transition-colors duration-300">{value.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Pot Black - Bento Grid */}
      <section className="py-24 relative overflow-hidden bg-[#050202]">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay pointer-events-none" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#D4AF37]/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        
        <div className="max-w-[1400px] mx-auto px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#E2D2A4] uppercase mb-6 tracking-wide drop-shadow-md">Why Choose Pot Black</h2>
            <div className="w-20 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[300px]">
            
            {/* Card 1 - Tables (Large/Wide) */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2 group relative overflow-hidden rounded-sm border border-white/5 bg-[#1A0E0E]"
            >
              <img src="/gallery_4.png" alt="Championship Tables" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-80 transition-all duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8 md:p-12">
                <div className="bg-[#D4AF37]/20 p-3 rounded-full inline-block mb-4 border border-[#D4AF37]/30 backdrop-blur-md">
                  <Target className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <h3 className="text-2xl md:text-3xl font-serif text-[#E2D2A4] uppercase tracking-wide mb-3">Championship-grade tables</h3>
                <p className="text-gray-300 font-light max-w-xl">Dubai's largest selection of professional, meticulously leveled Italian slate tables ensuring the perfect roll every time.</p>
              </div>
            </motion.div>

            {/* Card 2 - VIP Rooms (Tall) */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:row-span-2 group relative overflow-hidden rounded-sm border border-white/5 bg-[#1A0E0E]"
            >
              <img src="/gallery_5.png" alt="VIP Rooms" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-80 transition-all duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8 md:p-10 w-full">
                <div className="bg-[#D4AF37]/20 p-3 rounded-full inline-block mb-4 border border-[#D4AF37]/30 backdrop-blur-md">
                  <Star className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <h3 className="text-2xl font-serif text-[#E2D2A4] uppercase tracking-wide mb-3">Exclusive VIP Rooms</h3>
                <p className="text-gray-300 font-light">Private sanctuaries for discerning players, corporate events, and exclusive gatherings, featuring dedicated service and ultimate privacy.</p>
              </div>
            </motion.div>

            {/* Card 3 - Coaching (Square) */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="group relative overflow-hidden rounded-sm border border-white/5 bg-[#1A0E0E]"
            >
              <img src="/expert_coaching.png" alt="Expert Coaching" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-80 transition-all duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <div className="bg-[#D4AF37]/20 p-2.5 rounded-full inline-block mb-3 border border-[#D4AF37]/30 backdrop-blur-md">
                  <Award className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <h3 className="text-xl font-serif text-[#E2D2A4] uppercase tracking-wide mb-2">Expert Coaching</h3>
                <p className="text-gray-300 font-light text-sm">In-house instruction from seasoned professionals to elevate your game.</p>
              </div>
            </motion.div>



            {/* Card 5 - Environment (Square) */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="group relative overflow-hidden rounded-sm border border-white/5 bg-[#1A0E0E]"
            >
              <img src="/gallery_1.png" alt="Distraction-free environment" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-80 transition-all duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <div className="bg-[#D4AF37]/20 p-2.5 rounded-full inline-block mb-3 border border-[#D4AF37]/30 backdrop-blur-md">
                  <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <h3 className="text-xl font-serif text-[#E2D2A4] uppercase tracking-wide mb-2">Refined Ambiance</h3>
                <p className="text-gray-300 font-light text-sm">A sophisticated, distraction-free environment for pure focus.</p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>


      
      <CTA />
    </div>
  );
}
