import { useEffect, useState, useRef } from 'react';
import Lenis from 'lenis';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import BookingPage from './pages/BookingPage';

export default function App() {
  const [animationFinished, setAnimationFinished] = useState(() => sessionStorage.getItem('pot-black-intro-complete') === 'true');
  const location = useLocation();
  const lenisRef = useRef<Lenis | null>(null);

  const completeIntroAnimation = () => {
    sessionStorage.setItem('pot-black-intro-complete', 'true');
    setAnimationFinished(true);
  };

  useEffect(() => {
    lenisRef.current = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenisRef.current?.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!location.hash) {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo(0, 0);
      }
    }
  }, [location.pathname, location.hash]);

  return (
    <div className="bg-[#1A0E0E] min-h-screen text-[#F4F6F6] selection:bg-[#D4AF37] selection:text-[#1A0E0E] overflow-x-clip relative font-sans">
      
      {/* Background marble/smoke texture */}
      <div 
        className={`fixed inset-0 pointer-events-none transition-opacity duration-[3000ms] ease-in-out z-0 ${animationFinished || location.pathname !== '/' ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-mamba.png')] opacity-20 mix-blend-overlay" />
        <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-0 w-[800px] h-[800px] bg-[#D4AF37]/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10">
        <Navbar show={animationFinished || location.pathname !== '/'} />
        <main>
          <Routes>
            <Route path="/" element={<Home animationFinished={animationFinished} onAnimationComplete={completeIntroAnimation} />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/booking" element={<BookingPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </div>
  );
}


