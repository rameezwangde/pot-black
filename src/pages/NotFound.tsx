import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#0a0505] text-center px-4 relative z-10 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <h1 className="text-8xl md:text-9xl font-serif text-[#D4AF37] mb-6 drop-shadow-[0_0_30px_rgba(212,175,55,0.3)]">
          404
        </h1>
        <h2 className="text-2xl md:text-4xl text-[#E2D2A4] font-serif mb-6">
          Page Not Found
        </h2>
        <p className="text-gray-400 mb-10 text-sm md:text-base leading-relaxed">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center px-8 py-3.5 bg-gradient-to-r from-[#CBA469] to-[#D4AF37] text-black font-bold text-xs uppercase tracking-[0.15em] hover:scale-105 transition-transform duration-300"
        >
          Return to Homepage
        </Link>
      </motion.div>
    </div>
  );
}
