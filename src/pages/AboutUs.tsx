import { motion } from 'motion/react';
import About from '../components/About';
import { Target, Award, Coffee, Star } from 'lucide-react';

export default function AboutUs() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0505]">
      {/* Page Header */}
      <section className="relative pt-40 pb-20 px-8 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#1A0E0E] via-[#0a0505] to-[#0a0505] opacity-100" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#D4AF37]/5 rounded-full blur-[100px]" />
        </div>
        
        <div className="max-w-[1200px] mx-auto relative z-10 text-center">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[#968351] uppercase tracking-[0.3em] text-[10px] font-semibold mb-6 block"
          >
            Our Heritage
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-6xl lg:text-7xl font-serif text-[#E2D2A4] uppercase drop-shadow-md mb-8 tracking-wide"
          >
            The Legacy of <br className="hidden md:block"/> Pot Black
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-gray-300 max-w-2xl mx-auto font-light leading-relaxed text-sm md:text-base"
          >
            Established with a singular vision: to create the ultimate sanctuary for billiards enthusiasts. We blend world-class equipment with an atmosphere of refined luxury and sportsmanship.
          </motion.p>
        </div>
      </section>

      {/* Existing About Component */}
      <About />

      {/* Our Philosophy Section */}
      <section className="py-24 bg-[#110909] border-t border-white/5 relative">
        <div className="max-w-[1200px] mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif text-[#E2D2A4] uppercase mb-6 tracking-wide">Our Philosophy</h2>
            <div className="w-16 h-[1px] bg-[#D4AF37] mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                icon: <Target className="w-8 h-8" />,
                title: 'Precision & Excellence',
                desc: 'Every table is meticulously leveled, and every cue perfectly weighted. We believe that true mastery requires flawless tools.'
              },
              {
                icon: <Award className="w-8 h-8" />,
                title: 'Unrivaled Ambiance',
                desc: 'From our curated lighting that eliminates shadows on the cloth, to the bespoke interior design, every detail is crafted for your comfort.'
              },
              {
                icon: <Coffee className="w-8 h-8" />,
                title: 'A Community of Gentlemen',
                desc: 'Pot Black is more than a club; it is a gathering of like-minded individuals who appreciate the etiquette and sportsmanship of the game.'
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-[#1A0E0E] p-10 rounded-sm border border-white/5 hover:border-[#D4AF37]/30 transition-all duration-500 group"
              >
                <div className="text-[#D4AF37] mb-8 transform group-hover:scale-110 transition-transform duration-500">
                  {item.icon}
                </div>
                <h3 className="text-xl font-serif text-[#E2D2A4] uppercase tracking-wider mb-4">{item.title}</h3>
                <p className="text-gray-400 font-light text-sm leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Craftsmen Section */}
      <section className="py-24 bg-[#0a0505] relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/2" />
        <div className="max-w-[1200px] mx-auto px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-[#968351] uppercase tracking-[0.2em] text-[10px] font-semibold mb-4 block">THE EQUIPMENT</span>
              <h2 className="text-3xl md:text-5xl font-serif text-[#E2D2A4] uppercase mb-8 leading-tight">The Master's Setup</h2>
              <p className="text-gray-300 font-light leading-relaxed mb-6 text-sm md:text-base">
                Our championship-grade tables feature Italian slate and premium match cloth, offering the fastest, most consistent playing surface in the city. The pockets are cut to professional tournament specifications, ensuring that every shot demands absolute precision.
              </p>
              <p className="text-gray-300 font-light leading-relaxed mb-10 text-sm md:text-base">
                Whether you're practicing for a tournament or enjoying a relaxed evening with friends, our dedicated staff ensures your experience is nothing short of exceptional.
              </p>
              <div className="flex items-center gap-6">
                <div className="flex -space-x-4">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className="w-12 h-12 rounded-full border-2 border-[#0a0505] bg-[#1A0E0E] flex items-center justify-center overflow-hidden z-10 relative shadow-lg">
                      <Star size={16} className="text-[#D4AF37]" fill="#D4AF37" />
                    </div>
                  ))}
                </div>
                <div className="text-sm font-light text-gray-400 uppercase tracking-widest">
                  <span className="text-[#D4AF37] font-semibold block text-lg mb-1">500+</span> 
                  Professional Reviews
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-2 gap-4 md:gap-6"
            >
              <div className="space-y-4 md:space-y-6 pt-12">
                <div className="w-full h-48 md:h-64 bg-[#1A0E0E] rounded-sm overflow-hidden border border-white/5 shadow-2xl">
                  <img src="/gallery_1.png" alt="Billiards detail" className="w-full h-full object-cover opacity-70 hover:opacity-100 hover:scale-105 transition-all duration-700" />
                </div>
                <div className="w-full h-40 md:h-48 bg-[#1A0E0E] rounded-sm overflow-hidden border border-white/5 shadow-2xl">
                  <img src="/gallery_2.png" alt="Pub billiards table" className="w-full h-full object-cover opacity-70 hover:opacity-100 hover:scale-105 transition-all duration-700" />
                </div>
              </div>
              <div className="space-y-4 md:space-y-6">
                <div className="w-full h-40 md:h-48 bg-[#1A0E0E] rounded-sm overflow-hidden border border-white/5 shadow-2xl">
                  <img src="/gallery_3.png" alt="Snooker balls" className="w-full h-full object-cover opacity-70 hover:opacity-100 hover:scale-105 transition-all duration-700" />
                </div>
                <div className="w-full h-48 md:h-64 bg-[#1A0E0E] rounded-sm overflow-hidden border border-white/5 shadow-2xl">
                  <img src="/gallery_4.png" alt="Playing snooker" className="w-full h-full object-cover opacity-70 hover:opacity-100 hover:scale-105 transition-all duration-700" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
