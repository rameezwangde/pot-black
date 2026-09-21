import { Instagram, Facebook, MessageCircle, MapPin, Phone, Mail, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/5 bg-[#1A0E0E] pt-14 pb-8 sm:pt-20">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-12 lg:gap-8 mb-20">
          
          {/* Col 1 */}
          <div className="flex flex-col gap-6 items-start">
            <a href="#" className="inline-block">
              <div className="w-32 h-32 md:w-40 md:h-40 relative">
                <img src="/logo.png" alt="Pot Black Logo" className="w-full h-full object-contain object-left" />
              </div>
            </a>
            <p className="text-gray-400 text-sm font-light max-w-xs">
              Good times. Great shots.<br/>Unforgettable moments.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <a href="https://www.instagram.com/potblack_dubai/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-[#D4AF37] hover:border-[#D4AF37]/50 transition-colors">
                <Instagram size={18} />
              </a>
              <a href="https://www.facebook.com/PotBlackDubai/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-[#D4AF37] hover:border-[#D4AF37]/50 transition-colors">
                <Facebook size={18} />
              </a>
              <a href="https://wa.me/971503577687" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-[#25D366] hover:border-[#25D366]/50 transition-colors">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-[#D4AF37] uppercase tracking-widest text-xs font-semibold mb-6">QUICK LINKS</h4>
            <ul className="flex flex-col gap-3">
              {[
                { name: 'Home', href: '/' },
                { name: 'About Us', href: '/about' },
                { name: 'Products', href: '/products' },
                { name: 'Booking System', href: '/booking' },
                { name: 'Gallery', href: '/gallery' },
                { name: 'Blogs', href: '/blogs' },
                { name: 'Contact Us', href: '/contact' },
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-gray-400 hover:text-[#D4AF37] text-sm transition-colors">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>



          {/* Col 4 */}
          <div className="flex flex-col gap-10">
            <div>
              <h4 className="text-[#D4AF37] uppercase tracking-widest text-xs font-semibold mb-6">CONTACT US</h4>
              <ul className="flex flex-col gap-4 text-sm text-gray-400">
                <li className="flex gap-3">
                  <Phone size={16} className="text-[#D4AF37] shrink-0" />
                  <span>+971 50 357 7687</span>
                </li>
                <li className="flex gap-3">
                  <Mail size={16} className="text-[#D4AF37] shrink-0" />
                  <span className="min-w-0 break-all">potblackdxb@gmail.com</span>
                </li>
                <li className="flex gap-3">
                  <MapPin size={16} className="text-[#D4AF37] shrink-0 mt-1" />
                  <span className="leading-relaxed text-[11px] md:text-xs">
                    102-103, first floor, Crystal Business Center,<br/>
                    Near ADCB Metro Station, next to ADCB Bank.<br/>
                    Al Karama, Dubai - United Arab Emirates
                  </span>
                </li>
              </ul>
              <a href="https://wa.me/971503577687" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 border border-[#D4AF37]/50 text-white text-[10px] uppercase tracking-widest hover:bg-[#D4AF37]/10 transition-colors mt-6">
                <MessageCircle size={14} className="text-[#D4AF37]" /> WHATSAPP US <ArrowRight size={14} className="ml-1 text-[#D4AF37]" />
              </a>
            </div>

            <div>
              <h4 className="text-[#D4AF37] uppercase tracking-widest text-xs font-semibold mb-6">HOURS</h4>
              <ul className="flex flex-col gap-3 text-xs text-gray-400 tracking-wider">
                <li className="flex flex-wrap gap-x-4 gap-y-1">
                  <span className="w-24 shrink-0">Mon - Fri :</span>
                  <span>2:00 PM - 12:00 AM</span>
                </li>
                <li className="flex flex-wrap gap-x-4 gap-y-1">
                  <span className="w-24 shrink-0">Sat - Sun :</span>
                  <span>12:00 PM - 2:00 AM</span>
                </li>
              </ul>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-center text-xs text-gray-500 md:text-left">
          <p>© 2026 Pot Black Billiards Club. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-gray-400">
            <a href="/privacy" className="hover:text-[#D4AF37] transition-colors">Privacy Policy</a>
            <span>|</span>
            <a href="/terms" className="hover:text-[#D4AF37] transition-colors">Terms & Conditions</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
