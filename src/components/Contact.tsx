import { motion } from 'motion/react';
import { MapPin, Phone, Mail, MessageCircle } from 'lucide-react';
import AnimatedHeading from './AnimatedHeading';

export default function Contact() {
  return (
    <section id="contact" className="py-16 sm:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-billiards-dark -z-20" />
      
      {/* Background Image */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute inset-0 bg-billiards-dark/80 mix-blend-multiply z-10" />
        <img 
          src="https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2000&auto=format&fit=crop" 
          alt="Contact Background" 
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-billiards-dark via-transparent to-billiards-dark z-20" />
      </div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-billiards-emerald/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <AnimatedHeading className="text-4xl md:text-5xl lg:text-6xl font-serif mb-6 leading-tight">Connect <br/><span className="italic gold-text-gradient">with Us</span></AnimatedHeading>
            <p className="text-gray-400 font-light mb-12 leading-relaxed max-w-md">
              Have a question about private events, membership, or just want to chat? Reach out to our concierge team.
            </p>

            <div className="space-y-10 mb-14">
              <div className="flex items-start gap-6 group">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center shrink-0 group-hover:border-billiards-gold/50 transition-colors duration-500 shadow-inner bg-white/5">
                  <MapPin className="w-5 h-5 text-billiards-gold group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div>
                  <h4 className="font-serif text-xl mb-2 text-white">Location</h4>
                  <p className="text-gray-400 text-sm font-light leading-relaxed">123 Velvet Avenue<br/>Luxury District, NY 10001</p>
                </div>
              </div>
              <div className="flex items-start gap-6 group">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center shrink-0 group-hover:border-billiards-gold/50 transition-colors duration-500 shadow-inner bg-white/5">
                  <Phone className="w-5 h-5 text-billiards-gold group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div>
                  <h4 className="font-serif text-xl mb-2 text-white">Phone</h4>
                  <p className="text-gray-400 text-sm font-light">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-start gap-6 group">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center shrink-0 group-hover:border-billiards-gold/50 transition-colors duration-500 shadow-inner bg-white/5">
                  <Mail className="w-5 h-5 text-billiards-gold group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div>
                  <h4 className="font-serif text-xl mb-2 text-white">Email</h4>
                  <p className="break-all text-gray-400 text-sm font-light">concierge@velvetpocket.com</p>
                </div>
              </div>
            </div>

            <button className="flex items-center justify-center gap-3 w-full md:w-auto px-8 py-4 bg-[#25D366] hover:bg-[#20b858] text-white font-medium transition-colors rounded-sm shadow-[0_10px_20px_rgba(37,211,102,0.2)] hover:shadow-[0_15px_30px_rgba(37,211,102,0.3)]">
              <MessageCircle className="w-5 h-5" />
              Chat on WhatsApp
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="glass-card p-6 sm:p-10 lg:p-14 border border-billiards-gold/20 relative"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-billiards-gold/5 blur-2xl rounded-full pointer-events-none" />
            
            <h3 className="text-3xl font-serif mb-8 text-white">Send a Message</h3>
            <form className="space-y-6 text-sm font-light">
              <div>
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  className="w-full bg-black/40 border border-white/10 p-4 text-white focus:outline-none focus:border-billiards-gold/50 transition-colors placeholder:text-gray-600 rounded-sm shadow-inner"
                />
              </div>
              <div>
                <input 
                  type="email" 
                  placeholder="Your Email" 
                  className="w-full bg-black/40 border border-white/10 p-4 text-white focus:outline-none focus:border-billiards-gold/50 transition-colors placeholder:text-gray-600 rounded-sm shadow-inner"
                />
              </div>
              <div>
                <select className="w-full bg-black/40 border border-white/10 p-4 text-white focus:outline-none focus:border-billiards-gold/50 transition-colors text-gray-400 appearance-none rounded-sm shadow-inner">
                  <option value="" disabled selected>Subject Inquiry</option>
                  <option value="booking">Table Booking</option>
                  <option value="events">Private Events</option>
                  <option value="membership">Membership</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <textarea 
                  placeholder="Your Message" 
                  rows={4}
                  className="w-full bg-black/40 border border-white/10 p-4 text-white focus:outline-none focus:border-billiards-gold/50 transition-colors placeholder:text-gray-600 resize-none rounded-sm shadow-inner"
                />
              </div>
              <button 
                type="button"
                className="w-full bg-transparent border border-billiards-gold text-billiards-gold hover:bg-billiards-gold hover:text-billiards-dark py-5 uppercase tracking-[0.2em] font-bold text-xs transition-all duration-300 mt-4 rounded-sm"
              >
                Submit Inquiry
              </button>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
