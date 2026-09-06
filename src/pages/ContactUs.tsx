import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle, 
  Clock, 
  Send, 
  Instagram, 
  Facebook, 
  Sparkles, 
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  // Pot Black WhatsApp Number (International format for wa.me URL)
  const whatsappNumber = '971566977607'; // +971 56 697 7607

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Construct the formatted WhatsApp message
    const formattedText = 
      `*New Inquiry from Pot Black Website*%0A%0A` +
      `*👤 Name:* ${encodeURIComponent(formData.name)}%0A` +
      `*📞 Phone:* ${encodeURIComponent(formData.phone)}%0A` +
      `*✉️ Email:* ${encodeURIComponent(formData.email || 'Not provided')}%0A` +
      `*🎯 Topic:* ${encodeURIComponent(formData.subject)}%0A%0A` +
      `*💬 Message:*%0A${encodeURIComponent(formData.message)}`;

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${formattedText}`;

    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    setIsSubmitted(true);
  };

  return (
    <>
      {/* Page Header */}
      <section className="relative pt-32 pb-16 px-4 sm:px-6 sm:pt-40 sm:pb-20 lg:px-8 overflow-hidden min-h-[45vh] flex items-center bg-gradient-to-b from-[#180909] to-[#0a0505]">
        <div className="absolute inset-0 z-0">
          <img
            src="/cta_bg.png"
            alt="Contact Us Background"
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0505]/70 via-[#0a0505]/95 to-[#0a0505]" />
        </div>

        <div className="max-w-[1200px] mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-4 mb-4"
          >
            <span className="w-12 h-[1px] bg-[#D4AF37]" />
            <span className="text-[#D4AF37] uppercase tracking-[0.3em] text-xs sm:text-sm font-medium">Get in Touch</span>
            <span className="w-12 h-[1px] bg-[#D4AF37]" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-serif text-[#E2D2A4] uppercase drop-shadow-md mb-4 tracking-wide"
          >
            Contact <span className="italic text-[#D4AF37]">Pot Black</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 max-w-xl mx-auto text-sm sm:text-base font-light leading-relaxed"
          >
            Have a question about table reservations, membership plans, tournaments, or private VIP lounge events? Our team is ready to assist you.
          </motion.p>
        </div>
      </section>

      {/* Main Content & Form Section */}
      <section className="relative z-10 py-12 md:py-20 bg-[#0a0505]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Column: Direct WhatsApp Contact Form */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-7 bg-[#140b0b]/90 border border-[#D4AF37]/30 p-8 sm:p-12 rounded-sm shadow-[0_0_40px_rgba(0,0,0,0.6)] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

              <div className="mb-8">
                <span className="text-[#D4AF37] uppercase tracking-[0.2em] text-[11px] font-semibold block mb-2">Instant WhatsApp Routing</span>
                <h2 className="text-2xl sm:text-3xl font-serif text-[#E2D2A4] uppercase tracking-wide">
                  Send Us a Direct Message
                </h2>
                <p className="text-gray-400 text-xs sm:text-sm font-light mt-2 leading-relaxed">
                  Fill in your details below and hit submit to immediately connect with our concierge desk via WhatsApp.
                </p>
              </div>

              {isSubmitted && (
                <div className="mb-6 p-4 bg-[#D4AF37]/10 border border-[#D4AF37]/40 rounded-sm flex items-center gap-3 text-sm text-[#E2D2A4]">
                  <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0" />
                  <span>Your message has been formatted and redirected to WhatsApp!</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-[0.15em] text-[#E2D2A4] mb-2 font-medium">
                    Your Full Name <span className="text-[#D4AF37]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tariq Mansoor"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3.5 bg-black/60 border border-white/15 focus:border-[#D4AF37] text-white text-sm rounded-sm focus:outline-none transition-colors placeholder-gray-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-[0.15em] text-[#E2D2A4] mb-2 font-medium">
                      Phone Number <span className="text-[#D4AF37]">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+971 50 123 4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3.5 bg-black/60 border border-white/15 focus:border-[#D4AF37] text-white text-sm rounded-sm focus:outline-none transition-colors placeholder-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-[0.15em] text-[#E2D2A4] mb-2 font-medium">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="tariq@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3.5 bg-black/60 border border-white/15 focus:border-[#D4AF37] text-white text-sm rounded-sm focus:outline-none transition-colors placeholder-gray-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-[0.15em] text-[#E2D2A4] mb-2 font-medium">
                    Inquiry Topic
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3.5 bg-[#140b0b] border border-white/15 focus:border-[#D4AF37] text-white text-sm rounded-sm focus:outline-none transition-colors"
                  >
                    <option value="Table Reservation">Table Reservation (Pool / Snooker)</option>
                    <option value="VIP Lounge & Private Suite">VIP Lounge & Private Suite Booking</option>
                    <option value="Club Membership Plans">Club Membership Inquiry</option>
                    <option value="Tournament Registration">Tournament & League Entry</option>
                    <option value="General Inquiry">General Inquiry / Feedback</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-[0.15em] text-[#E2D2A4] mb-2 font-medium">
                    Your Message <span className="text-[#D4AF37]">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about your requirements, preferred timing, or special requests..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3.5 bg-black/60 border border-white/15 focus:border-[#D4AF37] text-white text-sm rounded-sm focus:outline-none transition-colors placeholder-gray-600 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 px-8 bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#20bd5a] hover:to-[#0f776a] text-white font-bold uppercase tracking-[0.15em] text-xs sm:text-sm rounded-[2px] transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_0_25px_rgba(37,211,102,0.3)] hover:scale-[1.01]"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  <span>Send Message via WhatsApp</span>
                </button>
              </form>
            </motion.div>

            {/* Right Column: Contact Details & Info Card */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-5 flex flex-col gap-8"
            >
              {/* Info Card */}
              <div className="bg-[#140b0b]/90 border border-white/10 p-8 rounded-sm">
                <h3 className="text-xl font-serif text-[#E2D2A4] uppercase tracking-wide mb-6 border-b border-white/10 pb-4">
                  Club Inquiries & Info
                </h3>

                <ul className="space-y-6 text-sm">
                  <li className="flex items-start gap-4">
                    <div className="p-3 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-sm text-[#D4AF37] shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] text-gray-400 uppercase tracking-widest block font-medium">Telephone & Bookings</span>
                      <a href="tel:+97143975737" className="text-white hover:text-[#D4AF37] font-medium transition-colors">
                        (+971) 4 397 5737
                      </a>
                      <div className="text-xs text-gray-400 mt-0.5">
                        WhatsApp: <a href="https://wa.me/971566977607" target="_blank" rel="noopener noreferrer" className="text-[#25D366] hover:underline">(+971) 56 697 7607</a>
                      </div>
                    </div>
                  </li>

                  <li className="flex items-start gap-4">
                    <div className="p-3 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-sm text-[#D4AF37] shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] text-gray-400 uppercase tracking-widest block font-medium">Direct Email</span>
                      <a href="mailto:potblackdxb@gmail.com" className="text-white hover:text-[#D4AF37] font-medium transition-colors break-all">
                        potblackdxb@gmail.com
                      </a>
                    </div>
                  </li>

                  <li className="flex items-start gap-4">
                    <div className="p-3 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-sm text-[#D4AF37] shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] text-gray-400 uppercase tracking-widest block font-medium">Our Dubai Location</span>
                      <p className="text-white font-medium leading-relaxed">
                        Office 102-103, First Floor, Crystal Business Center,<br />
                        Near ADCB Metro Station, Next to ADCB Bank,<br />
                        Al Karama, Dubai, United Arab Emirates.
                      </p>
                    </div>
                  </li>

                  <li className="flex items-start gap-4">
                    <div className="p-3 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-sm text-[#D4AF37] shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] text-gray-400 uppercase tracking-widest block font-medium">Operating Hours</span>
                      <div className="text-white text-xs space-y-1 mt-1 font-light">
                        <p><strong className="font-medium text-[#E2D2A4]">Monday – Friday:</strong> 2:00 PM – 12:00 AM</p>
                        <p><strong className="font-medium text-[#E2D2A4]">Saturday – Sunday:</strong> 12:00 PM – 2:00 AM</p>
                      </div>
                    </div>
                  </li>
                </ul>

                {/* Social icons */}
                <div className="pt-6 border-t border-white/10 mt-6 flex items-center justify-between">
                  <span className="text-xs uppercase tracking-widest text-gray-400">Connect With Us:</span>
                  <div className="flex gap-3">
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-[#D4AF37] hover:border-[#D4AF37]/50 transition-colors"
                    >
                      <Instagram size={16} />
                    </a>
                    <a
                      href="https://facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-[#D4AF37] hover:border-[#D4AF37]/50 transition-colors"
                    >
                      <Facebook size={16} />
                    </a>
                    <a
                      href="https://wa.me/971566977607"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-[#25D366] hover:border-[#25D366]/50 transition-colors"
                    >
                      <MessageCircle size={16} />
                    </a>
                  </div>
                </div>
              </div>

              {/* Fast Booking CTA Card */}
              <div className="bg-gradient-to-r from-[#211010] to-[#150a0a] border border-[#D4AF37]/40 p-6 rounded-sm flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-base font-serif text-[#E2D2A4] uppercase">Looking for real-time slots?</h4>
                  <p className="text-xs text-gray-400 font-light mt-0.5">Check real-time table availability online.</p>
                </div>
                <Link
                  to="/booking"
                  className="px-5 py-2.5 bg-[#D4AF37] text-black font-bold uppercase text-[11px] tracking-widest rounded-[2px] shrink-0 hover:bg-[#c49f2c] transition-colors"
                >
                  Book Table
                </Link>
              </div>

            </motion.div>

          </div>
        </div>
      </section>

      {/* Interactive Google Map Section */}
      <section className="relative z-10 py-12 md:py-16 bg-[#0c0606] border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 text-[#D4AF37] text-xs font-semibold tracking-[0.25em] uppercase mb-2">
                <MapPin className="w-4 h-4" />
                <span>Visit Us In Person</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif text-[#E2D2A4] uppercase tracking-wide">
                Interactive Club Location
              </h2>
            </div>

            <a
              href="https://maps.google.com/?q=Crystal+Business+Center+Al+Karama+Dubai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-black/60 border border-[#D4AF37]/50 text-[#E2D2A4] text-xs uppercase tracking-widest hover:bg-[#D4AF37]/10 transition-colors rounded-[2px]"
            >
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Embedded Google Map */}
          <div className="w-full h-[400px] sm:h-[480px] rounded-sm overflow-hidden border border-white/15 relative shadow-[0_0_30px_rgba(0,0,0,0.7)]">
            <iframe
              title="Pot Black Billiards & Snooker Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3608.835848529235!2d55.30230237604928!3d25.24245942988358!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f432fb7786801%3A0xe54d6df1fb05a305!2sCrystal%20Business%20Center!5e0!3m2!1sen!2sae!4v1710000000000!5m2!1sen!2sae"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(85%) contrast(110%)' }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between text-xs text-gray-400 gap-4">
            <p>📍 Conveniently located near ADCB Metro Station (Al Karama) with dedicated customer parking.</p>
            <p className="text-[#D4AF37]">Valet & Free Parking Available for Gold Members</p>
          </div>

        </div>
      </section>
    </>
  );
}
