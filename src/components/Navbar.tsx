import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar({ show = true }: { show?: boolean }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Tables', href: '#tables' },
    { name: 'Membership', href: '#membership' },
    { name: 'Events', href: '#events' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
      } ${
        isScrolled ? 'bg-[#1A0E0E]/95 backdrop-blur-xl border-b border-white/5 py-2 shadow-2xl' : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-[1600px] mx-auto px-8 flex items-center justify-between">
        
        {/* Logo */}
        <a href="#" className="flex items-center gap-4 group">
          <img src="/logo.png" alt="Pot Black Logo" className="h-12 md:h-16 w-auto object-contain transition-transform hover:scale-105" />
        </a>

        {/* Desktop Nav */}
        <nav className="hidden xl:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              className={`text-[11px] uppercase tracking-[0.2em] transition-colors duration-300 relative py-1 ${link.name === 'Home' ? 'text-[#D4AF37]' : 'text-white hover:text-[#D4AF37]'}`}
            >
              {link.name}
              {link.name === 'Home' && (
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#D4AF37]" />
              )}
            </a>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-6">
          <a 
            href="#booking"
            className="hidden md:flex px-6 py-2.5 bg-gradient-to-r from-[#b38b4d] to-[#d4b075] text-black font-medium uppercase tracking-[0.15em] text-[10px] hover:scale-105 transition-transform duration-300"
          >
            Book A Table
          </a>
          <button 
            className="text-white hover:text-[#D4AF37] transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={32} strokeWidth={1} /> : <Menu size={32} strokeWidth={1} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <motion.div 
        className={`xl:hidden absolute top-full left-0 w-full bg-[#1A0E0E]/95 backdrop-blur-xl border-t border-white/5 overflow-hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: isMobileMenuOpen ? 'auto' : 0, opacity: isMobileMenuOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col items-center py-8 gap-6 px-6">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              className="text-sm uppercase tracking-[0.2em] text-gray-200 hover:text-[#D4AF37] transition-colors duration-300 w-full text-center py-2 border-b border-white/5"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <a 
            href="#booking"
            className="w-full text-center py-4 bg-gradient-to-r from-[#b38b4d] to-[#d4b075] text-black font-semibold uppercase tracking-widest text-sm mt-4"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Book A Table
          </a>
        </div>
      </motion.div>
    </header>
  );
}
