import { Instagram, Facebook, MessageCircle, MapPin, Phone, Mail, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/5 bg-[#1A0E0E] pt-20 pb-8">
      <div className="max-w-[1600px] mx-auto px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20">
          
          {/* Col 1 */}
          <div className="flex flex-col gap-6">
            <a href="#" className="flex items-center gap-4">
              <div className="w-16 h-16 flex items-center justify-center relative shrink-0">
                <img src="/logo.png" alt="Pot Black Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl tracking-[0.15em] uppercase text-white leading-none">Pot Black</span>
                <span className="text-[9px] tracking-[0.3em] uppercase text-gray-400 mt-1">Billiards Club</span>
              </div>
            </a>
            <p className="text-gray-400 text-sm font-light mt-2 max-w-xs">
              Good times. Great shots.<br/>Unforgettable moments.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-[#D4AF37] hover:border-[#D4AF37]/50 transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-[#D4AF37] hover:border-[#D4AF37]/50 transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-[#D4AF37] hover:border-[#D4AF37]/50 transition-colors">
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-[#D4AF37] uppercase tracking-widest text-xs font-semibold mb-6">QUICK LINKS</h4>
            <ul className="flex flex-col gap-3">
              {['Home', 'About Us', 'Tables', 'Membership', 'Events', 'Gallery', 'Contact'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-400 hover:text-[#D4AF37] text-sm transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 */}
          <div className="flex flex-col gap-10">
            <div>
              <h4 className="text-[#D4AF37] uppercase tracking-widest text-xs font-semibold mb-6">MEMBERSHIP</h4>
              <ul className="flex flex-col gap-3">
                {['Classic', 'Premier', 'Elite', 'Benefits', 'FAQs'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 hover:text-[#D4AF37] text-sm transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Col 4 */}
          <div className="flex flex-col gap-10">
            <div>
              <h4 className="text-[#D4AF37] uppercase tracking-widest text-xs font-semibold mb-6">CONTACT US</h4>
              <ul className="flex flex-col gap-4 text-sm text-gray-400">
                <li className="flex gap-3">
                  <Phone size={16} className="text-[#D4AF37] shrink-0" />
                  <span>+91 98765 43210</span>
                </li>
                <li className="flex gap-3">
                  <Mail size={16} className="text-[#D4AF37] shrink-0" />
                  <span>hello@potblack.com</span>
                </li>
                <li className="flex gap-3">
                  <MapPin size={16} className="text-[#D4AF37] shrink-0 mt-1" />
                  <span className="leading-relaxed text-xs">
                    12, Billiards Street,<br/>
                    Koramangala, Bangalore 560034
                  </span>
                </li>
              </ul>
              <a href="#" className="inline-flex items-center gap-2 px-6 py-3 border border-[#D4AF37]/50 text-white text-[10px] uppercase tracking-widest hover:bg-[#D4AF37]/10 transition-colors mt-6">
                <MessageCircle size={14} className="text-[#D4AF37]" /> WHATSAPP US <ArrowRight size={14} className="ml-1 text-[#D4AF37]" />
              </a>
            </div>

            <div>
              <h4 className="text-[#D4AF37] uppercase tracking-widest text-xs font-semibold mb-6">HOURS</h4>
              <ul className="flex flex-col gap-3 text-xs text-gray-400 tracking-wider">
                <li className="flex justify-between">
                  <span>Mon - Fri :</span>
                  <span>2:00 PM - 12:00 AM</span>
                </li>
                <li className="flex justify-between">
                  <span>Sat - Sun :</span>
                  <span>12:00 PM - 2:00 AM</span>
                </li>
              </ul>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© 2026 Pot Black Billiards Club. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <span>|</span>
            <a href="#" className="hover:text-white transition-colors">Terms & Conditions</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
