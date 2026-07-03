import { useEffect, useState } from 'react';
import Lenis from 'lenis';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Amenities from './components/Amenities';
import Membership from './components/Membership';
import Testimonials from './components/Testimonials';

import Footer from './components/Footer';
import CTA from './components/CTA';

export default function App() {
  const [animationFinished, setAnimationFinished] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="bg-[#1A0E0E] min-h-screen text-[#F4F6F6] selection:bg-[#D4AF37] selection:text-[#1A0E0E] overflow-x-clip relative font-sans">
      
      {/* Background marble/smoke texture */}
      <div 
        className={`fixed inset-0 pointer-events-none transition-opacity duration-[3000ms] ease-in-out z-0 ${animationFinished ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-mamba.png')] opacity-20 mix-blend-overlay" />
        <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-0 w-[800px] h-[800px] bg-[#D4AF37]/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10">
        <Navbar show={animationFinished} />
        <main>
          <Hero onAnimationComplete={() => setAnimationFinished(true)} />
          <About />
          <Amenities />
          <Membership />
          <Testimonials />

          <CTA />
        </main>
        <Footer />
      </div>
    </div>
  );
}
