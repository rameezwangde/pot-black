import { motion, useScroll, useTransform, useMotionValueEvent } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useState, useRef } from 'react';

const playSound = (type: 'strike' | 'pocket' | 'whoosh') => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    if (type === 'strike') {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.1);
      gainNode.gain.setValueAtTime(1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.1);
    } else if (type === 'pocket') {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.15);
      gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.15);
    } else if (type === 'whoosh') {
      const bufferSize = ctx.sampleRate * 0.5; // 0.5 seconds
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(100, ctx.currentTime);
      filter.frequency.linearRampToValueAtTime(1000, ctx.currentTime + 0.1);
      filter.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.3);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0, ctx.currentTime);
      noiseGain.gain.linearRampToValueAtTime(1, ctx.currentTime + 0.1);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      noise.start(ctx.currentTime);
      noise.stop(ctx.currentTime + 0.4);
    }
  } catch (e) {
    console.error("Audio playback failed", e);
  }
};

export default function Hero({ onAnimationComplete }: { onAnimationComplete?: () => void }) {
  const [stage, setStage] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const tableY = useTransform(scrollYProgress, [0, 1], ['0%', '0%']);
  const tableOpacity = useTransform(scrollYProgress, [0, 1], [1, 1]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    let newStage = 1;
    if (latest > 0.05) newStage = 2; // strike
    if (latest > 0.1) newStage = 3; // cue ball moves
    if (latest > 0.2) newStage = 4; // scatter
    if (latest > 0.4) newStage = 5; // pockets
    if (latest > 0.6) newStage = 9; // text reveal

    setStage(prev => {
      if (newStage !== prev) {
        if (newStage === 2 && prev < 2) playSound('strike');
        if (newStage === 4 && prev < 4) playSound('strike');
        if (newStage === 5 && prev < 5) {
          playSound('pocket');
          setTimeout(() => playSound('pocket'), 150);
          setTimeout(() => playSound('pocket'), 350);
          setTimeout(() => playSound('pocket'), 450);
          setTimeout(() => playSound('pocket'), 600);
        }
        if (newStage === 8 && prev < 8) playSound('whoosh');
        
        if (newStage === 9 && prev < 9 && onAnimationComplete) {
          onAnimationComplete();
        }
        return newStage;
      }
      return prev;
    });
  });

  const width = 800;
  const height = 400;

  const pockets = [
    { cx: 0, cy: 0 },
    { cx: width / 2, cy: -10 },
    { cx: width, cy: 0 },
    { cx: 0, cy: height },
    { cx: width / 2, cy: height + 10 },
    { cx: width, cy: height },
  ];

  return (
    <div ref={containerRef} className="relative h-[200vh]">
      <section className="sticky top-0 h-screen w-full flex items-center justify-center pt-20 overflow-hidden bg-billiards-dark">

      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        {/* Initial Dark Background */}
        <div className="absolute inset-0 bg-[#1A0E0E] z-10" />

        {/* Revealed Background Image */}
        <motion.img
          src="/new-hero-image.png"
          alt="Hero Background"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: 15 }}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: stage >= 9 ? 1 : 0, scale: stage >= 9 ? 1 : 1.1 }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
      </div>

      {/* Animated Table Background */}
      <motion.div
        className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none"
        style={{ y: tableY, opacity: tableOpacity }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-billiards-dark/30 via-transparent to-billiards-dark z-10" />

        <motion.div
          className="relative w-[95vw] max-w-[1600px] aspect-[2/1] md:aspect-[2.2/1] p-4 md:p-8 opacity-80"
          animate={{ scale: stage >= 9 ? 1.05 : 1, opacity: stage >= 9 ? 0 : 0.8 }}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          {/* Table Outer Wood */}
          <div className="w-full h-full wood-texture rounded-[2rem] md:rounded-[3rem] shadow-[0_40px_80px_rgba(0,0,0,0.9)] relative ring-[1px] ring-[#3d1212] border-[16px] md:border-[24px] border-[#2b130a] flex items-center justify-center">
            
            {/* Corner metallic plates (optional, for realism) */}
            <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-[#333] to-[#111] rounded-tl-[1.5rem] md:rounded-tl-[2.5rem] opacity-50 pointer-events-none" />
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[#333] to-[#111] rounded-tr-[1.5rem] md:rounded-tr-[2.5rem] opacity-50 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-[#333] to-[#111] rounded-bl-[1.5rem] md:rounded-bl-[2.5rem] opacity-50 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-[#333] to-[#111] rounded-br-[1.5rem] md:rounded-br-[2.5rem] opacity-50 pointer-events-none" />

            {/* Inner frame base */}
            <div className="absolute inset-2 md:inset-4 bg-[#0a0202] rounded-xl z-0" />

            {/* 3D Cushions (Rails) */}
            {/* Top Cushion */}
            <div className="absolute top-2 md:top-4 left-16 right-16 h-8 md:h-12 bg-gradient-to-b from-[#1c0404] via-[#3a0a0a] to-[#110202] z-10 shadow-[0_15px_25px_rgba(0,0,0,0.9)] border-b border-[#5c1313]/40 rounded-b-sm" />
            {/* Bottom Cushion */}
            <div className="absolute bottom-2 md:bottom-4 left-16 right-16 h-8 md:h-12 bg-gradient-to-t from-[#1c0404] via-[#3a0a0a] to-[#110202] z-10 shadow-[0_-15px_25px_rgba(0,0,0,0.9)] border-t border-[#5c1313]/40 rounded-t-sm" />
            {/* Left Cushion */}
            <div className="absolute left-2 md:left-4 top-16 bottom-16 w-8 md:w-12 bg-gradient-to-r from-[#1c0404] via-[#3a0a0a] to-[#110202] z-10 shadow-[15px_0_25px_rgba(0,0,0,0.9)] border-r border-[#5c1313]/40 rounded-r-sm" />
            {/* Right Cushion */}
            <div className="absolute right-2 md:right-4 top-16 bottom-16 w-8 md:w-12 bg-gradient-to-l from-[#1c0404] via-[#3a0a0a] to-[#110202] z-10 shadow-[-15px_0_25px_rgba(0,0,0,0.9)] border-l border-[#5c1313]/40 rounded-l-sm" />

            {/* Pockets (SVG) Over Rails - Enhanced Sharpness */}
            <div className="absolute inset-4 md:inset-6 z-20 pointer-events-none">
              <svg viewBox={`0 0 ${width} ${height}`} className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
                <defs>
                  <radialGradient id="pocketDepth">
                    <stop offset="75%" stopColor="#020101" />
                    <stop offset="95%" stopColor="#111" />
                    <stop offset="100%" stopColor="#333" />
                  </radialGradient>
                  <linearGradient id="bracketGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#1a1a1a" />
                    <stop offset="50%" stopColor="#4a4a4a" />
                    <stop offset="100%" stopColor="#0a0a0a" />
                  </linearGradient>
                  <filter id="pocketShadow">
                    <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.8" />
                  </filter>
                </defs>
                {pockets.map((p, i) => (
                  <g key={i}>
                    {/* Sharp leather pocket surround */}
                    <circle cx={p.cx} cy={p.cy} r={26} fill="#0a0a0a" filter="url(#pocketShadow)" />
                    {/* Inner lip */}
                    <circle cx={p.cx} cy={p.cy} r={22} fill="#111" />
                    {/* The sharp deep hole */}
                    <circle cx={p.cx} cy={p.cy} r={20} fill="url(#pocketDepth)" />
                    
                    {/* Sharp Metallic bracket wrapping the pocket */}
                    <path 
                      d={`M ${p.cx - 26} ${p.cy - 8} C ${p.cx - 26} ${p.cy - 28}, ${p.cx + 26} ${p.cy - 28}, ${p.cx + 26} ${p.cy - 8}`} 
                      fill="none" 
                      stroke="url(#bracketGrad)" 
                      strokeWidth="5" 
                      filter="url(#pocketShadow)"
                      transform={
                        i === 0 ? `rotate(-45 ${p.cx} ${p.cy})` :
                        i === 1 ? `rotate(0 ${p.cx} ${p.cy})` :
                        i === 2 ? `rotate(45 ${p.cx} ${p.cy})` :
                        i === 3 ? `rotate(-135 ${p.cx} ${p.cy})` :
                        i === 4 ? `rotate(180 ${p.cx} ${p.cy})` :
                        `rotate(135 ${p.cx} ${p.cy})`
                      }
                      strokeLinecap="round"
                    />
                  </g>
                ))}
              </svg>
            </div>

            {/* Table Inner Felt */}
            <div className="absolute inset-10 md:inset-16 red-felt shadow-[inset_0_0_80px_rgba(0,0,0,1)] z-0 overflow-hidden">
              {/* Center Spotlight */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#ffffff] opacity-[0.03] blur-[60px] rounded-full pointer-events-none z-0" />

              <div className="absolute inset-0 w-full h-full z-10">
                {/* Initial Cue Stick */}
                <motion.div
                  className="absolute top-1/2 h-3 md:h-5 rounded-full origin-right z-20"
                  style={{
                    left: 'calc(25% - 40%)',
                    width: '40%',
                    background: 'linear-gradient(to bottom, #7c4c2a 0%, #d9a05b 20%, #e8ba7d 40%, #8B5A2B 80%, #3a2210 100%)',
                    y: '-50%',
                    boxShadow: '0 20px 25px rgba(0,0,0,0.6), inset 0 2px 4px rgba(255,255,255,0.4)'
                  }}
                  initial={{ x: '-10%', opacity: 0 }}
                  animate={{
                    x: stage === 0 ? '-10%' : stage === 1 ? '-20%' : stage === 2 ? '0%' : '-100%',
                    opacity: stage >= 4 ? 0 : 1
                  }}
                  transition={{
                    x: { duration: stage === 1 ? 1.2 : stage === 2 ? 0.08 : 0.6, ease: stage === 2 ? "easeIn" : "easeOut" },
                    opacity: { duration: 0.3 }
                  }}
                >
                  <div className="absolute right-0 top-0 bottom-0 w-8 md:w-12 bg-gradient-to-b from-gray-200 via-white to-gray-400 rounded-r-full border-l-2 border-black/20">
                    <div className="absolute right-0 top-0 bottom-0 w-2 md:w-3 bg-blue-500 rounded-r-full" />
                  </div>
                </motion.div>



                {/* Cue Ball */}
                <motion.div
                  className="absolute top-1/2 left-[25%] w-8 h-8 md:w-10 md:h-10 rounded-full z-10"
                  style={{
                    y: '-50%', x: '-50%',
                    backgroundColor: '#ffffff',
                    backgroundImage: 'radial-gradient(circle at 35% 25%, #ffffff 0%, rgba(255,255,255,0.8) 20%, rgba(220,220,220,0) 50%, rgba(0,0,0,0.4) 100%)',
                    boxShadow: '4px 8px 12px rgba(0,0,0,0.6), inset -3px -3px 6px rgba(0,0,0,0.3)'
                  }}
                  initial={{ left: '25%', top: '50%' }}
                  animate={{
                    left: stage >= 4 ? '50%' : stage >= 3 ? '75%' : '25%',
                    top: stage >= 4 ? '-1%' : '50%',
                    scale: stage >= 5 ? 0 : 1,
                    opacity: stage >= 5 ? 0 : 1
                  }}
                  transition={{
                    left: { duration: stage >= 4 ? 2 : stage >= 3 ? 0.25 : 0, ease: stage >= 4 ? "easeOut" : "linear" },
                    top: { duration: stage >= 4 ? 2 : stage >= 3 ? 0.25 : 0, ease: stage >= 4 ? "easeOut" : "linear" },
                    scale: { duration: 0.3 },
                    opacity: { duration: 0.3 }
                  }}
                />

                {/* Target Balls */}
                {[
                  { id: 1, color: '#F1C40F', initX: '75%', initY: '50%', endX: '100%', endY: '0%' },
                  { id: 2, color: '#2980B9', initX: 'calc(75% + 34px)', initY: 'calc(50% - 20px)', endX: '0%', endY: '0%' },
                  { id: 3, color: '#E74C3C', initX: 'calc(75% + 34px)', initY: 'calc(50% + 20px)', endX: '100%', endY: '100%' },
                  { id: 4, color: '#8E44AD', initX: 'calc(75% + 68px)', initY: 'calc(50% - 40px)', endX: '50%', endY: '-1%' },
                  { id: 5, color: '#E67E22', initX: 'calc(75% + 68px)', initY: '50%', endX: '0%', endY: '100%' },
                  { id: 8, color: '#111111', initX: 'calc(75% + 68px)', initY: 'calc(50% + 40px)', endX: '50%', endY: '101%' },
                ].map((ball) => (
                  <motion.div
                    key={ball.id}
                    className="absolute w-8 h-8 md:w-10 md:h-10 rounded-full z-10 flex items-center justify-center overflow-hidden"
                    style={{
                      backgroundColor: ball.color,
                      backgroundImage: 'radial-gradient(circle at 35% 25%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.4) 15%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.6) 100%)',
                      boxShadow: '4px 8px 12px rgba(0,0,0,0.6), inset -3px -3px 6px rgba(0,0,0,0.5)',
                      x: '-50%', y: '-50%'
                    }}
                    initial={{ left: ball.initX, top: ball.initY }}
                    animate={{
                      left: stage >= 4 ? ball.endX : ball.initX,
                      top: stage >= 4 ? ball.endY : ball.initY,
                      scale: stage >= 5 ? 0 : 1,
                      opacity: stage >= 5 ? 0 : 1
                    }}
                    transition={{
                      left: { duration: 2 + Math.random() * 0.8, ease: "easeOut" },
                      top: { duration: 2 + Math.random() * 0.8, ease: "easeOut" },
                      scale: { duration: 0.3 },
                      opacity: { duration: 0.3 }
                    }}
                  >
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-transparent to-white opacity-20 pointer-events-none" />
                    {ball.id !== 8 && <div className="w-[45%] h-[45%] bg-white rounded-full flex items-center justify-center shadow-[inset_0_1px_3px_rgba(0,0,0,0.4)]">
                      <span className="text-[10px] md:text-[12px] font-black text-black font-sans leading-none block">{ball.id}</span>
                    </div>}
                    {ball.id === 8 && <div className="w-[45%] h-[45%] bg-white rounded-full flex items-center justify-center shadow-[inset_0_1px_3px_rgba(0,0,0,0.4)]">
                      <span className="text-[10px] md:text-[12px] font-black text-black font-sans leading-none block">8</span>
                    </div>}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Hero Text Content */}
      <div className="max-w-[1600px] mx-auto px-8 relative z-20 w-full pointer-events-none flex justify-center items-center h-full text-center">
        <div className="max-w-5xl pointer-events-auto flex flex-col items-center mb-48 lg:mb-72">
          <motion.div
            className="mb-0 mt-6 md:mt-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: stage >= 9 ? 1 : 0, y: stage >= 9 ? 0 : 30 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <span className="text-gray-300 uppercase tracking-[0.4em] font-medium text-[10px] md:text-xs drop-shadow-lg">
              EXPERIENCE
            </span>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-8xl lg:text-[7.5rem] font-serif leading-[1.05] mb-2 drop-shadow-2xl uppercase tracking-tight text-[#EAE0C8]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: stage >= 9 ? 1 : 0, y: stage >= 9 ? 0 : 30 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <span className="block">THE GAME</span>
            <span className="block">IN STYLE</span>
          </motion.h1>

          <motion.div
            className="flex flex-wrap justify-center items-center gap-2 md:gap-4 text-[9px] md:text-[10px] tracking-[0.25em] uppercase text-gray-300 mb-16 drop-shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: stage >= 9 ? 1 : 0, y: stage >= 9 ? 0 : 30 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <span>PREMIUM BILLIARDS</span>
            <span className="w-1 h-1 rounded-full bg-gray-500"></span>
            <span>TOURNAMENTS</span>
            <span className="w-1 h-1 rounded-full bg-gray-500"></span>
            <span>LOUNGE</span>
            <span className="w-1 h-1 rounded-full bg-gray-500"></span>
            <span>PRIVATE BOOKINGS</span>
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: stage >= 9 ? 1 : 0, y: stage >= 9 ? 0 : 30 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <a
              href="#booking"
              className="flex-1 flex items-center justify-center px-6 py-3.5 bg-[#CBA469] text-black font-semibold uppercase tracking-[0.15em] text-[10px] hover:scale-105 transition-transform duration-300"
            >
              Book A Table
            </a>
            <a
              href="#membership"
              className="flex-1 flex items-center justify-center px-6 py-3.5 border border-white/40 text-white font-semibold uppercase tracking-[0.15em] text-[10px] hover:border-[#CBA469] hover:text-[#CBA469] transition-all duration-300"
            >
              Explore Membership
            </a>
          </motion.div>
        </div>

        {/* Right side social links */}
        <motion.div
          className="hidden lg:flex flex-col items-center gap-8 pointer-events-auto absolute right-8 bottom-12"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: stage >= 9 ? 1 : 0, x: stage >= 9 ? 0 : 20 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <div className="w-[1px] h-32 bg-white/10 absolute -top-40" />
          <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
            </svg>
          </a>
          <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
            </svg>
          </a>
          <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
          </a>
        </motion.div>
      </div>

      {/* Bottom Left Pagination */}
      <motion.div
        className="absolute bottom-12 left-8 z-20 flex items-center gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: stage >= 9 ? 1 : 0 }}
        transition={{ delay: 1.2, duration: 1 }}
      >
        <div className="flex items-center gap-2 group cursor-pointer">
          <span className="text-[10px] text-[#D4AF37] tracking-[0.1em]">01</span>
          <div className="w-8 h-[1px] bg-[#D4AF37] relative">
            <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
          </div>
        </div>
        <span className="text-[10px] text-gray-500 tracking-[0.1em] cursor-pointer hover:text-white transition-colors">02</span>
        <span className="text-[10px] text-gray-500 tracking-[0.1em] cursor-pointer hover:text-white transition-colors">03</span>
      </motion.div>

      {/* Bottom Right Text */}
      <motion.div
        className="absolute bottom-12 right-28 z-20 flex flex-col items-end gap-2 pr-4 border-r border-white/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: stage >= 9 ? 1 : 0 }}
        transition={{ delay: 1.3, duration: 1 }}
      >
        <span className="text-xs uppercase tracking-[0.3em] text-white font-medium">GAME ON</span>
        <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400">STRIKE WITH STYLE</span>
        <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400">WIN WITH CLASS</span>
      </motion.div>
      </section>
    </div>
  );
}
