import { motion, useScroll, useTransform, useMotionValueEvent, useMotionValue } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const playSound = (type: 'strike' | 'pocket' | 'whoosh') => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    if (ctx.state === 'suspended') ctx.resume();

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
      const bufferSize = ctx.sampleRate * 0.5;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
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
    console.error('Audio playback failed', e);
  }
};

const TargetBall = ({ ball, scrollYProgress }: { key?: number | string; ball: any, scrollYProgress: any }) => {
  const left = useTransform(scrollYProgress, [0, 0.4, 0.65], [ball.initX, ball.initX, ball.endX]);
  const top = useTransform(scrollYProgress, [0, 0.4, 0.65], [ball.initY, ball.initY, ball.endY]);
  const opacity = useTransform(scrollYProgress, [0.6, 0.65], [1, 0]);
  const scale = useTransform(scrollYProgress, [0.6, 0.65], [1, 0.5]);

  return (
    <motion.div
      className="absolute w-[3.5%] aspect-square rounded-full flex items-center justify-center overflow-hidden"
      style={{
        backgroundColor: ball.color,
        backgroundImage: 'radial-gradient(circle at 35% 25%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.4) 15%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.6) 100%)',
        boxShadow: '4px 8px 12px rgba(0,0,0,0.6), inset -3px -3px 6px rgba(0,0,0,0.5)',
        x: '-50%', y: '-50%',
        left, top, opacity, scale
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
  );
};

export default function Hero({ initiallyFinished = false, onAnimationComplete }: { initiallyFinished?: boolean; onAnimationComplete?: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prevScroll = useRef(0);
  const [isFinished, setIsFinished] = useState(initiallyFinished);

  const { scrollYProgress: rawScrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const scrollYProgress = useMotionValue(initiallyFinished ? 1 : 0);

  const tableY = useTransform(scrollYProgress, [0, 1], ['0%', '0%']);
  const tableOpacity = useTransform(scrollYProgress, [0, 1], [1, 1]);
  const tableScale = useTransform(scrollYProgress, [0.7, 0.9], [1, 1.05]);
  const tableGlobalOpacity = useTransform(scrollYProgress, [0.7, 0.9], [0.8, 0]);

  const bgScale = useTransform(scrollYProgress, [0.7, 0.9], [1.1, 1]);
  const bgOpacity = useTransform(scrollYProgress, [0.7, 0.9], [0, 1]);

  const textOpacity = useTransform(scrollYProgress, [0.75, 0.9], [0, 1]);
  const textY = useTransform(scrollYProgress, [0.75, 0.9], [30, 0]);

  const stickX = useTransform(scrollYProgress, [0, 0.2, 0.25], ['-10%', '-20%', '0%']);
  const stickOpacity = useTransform(scrollYProgress, [0.24, 0.26], [1, 0]);

  const cueLeft = useTransform(scrollYProgress, [0, 0.25, 0.4, 0.65], ['25%', '25%', '70%', '45%']);
  const cueTop = useTransform(scrollYProgress, [0, 0.25, 0.4, 0.65], ['50%', '50%', '50%', '35%']);

  useMotionValueEvent(rawScrollYProgress, "change", (latest) => {
    if (isFinished) return;
    
    scrollYProgress.set(latest);

    const prev = prevScroll.current;
    if (latest > 0.25 && prev <= 0.25) playSound('strike');
    if (latest > 0.4 && prev <= 0.4) playSound('strike');
    if (latest > 0.65 && prev <= 0.65) {
      playSound('pocket');
      setTimeout(() => playSound('pocket'), 150);
      setTimeout(() => playSound('pocket'), 350);
    }
    if (latest > 0.75 && prev <= 0.75) playSound('whoosh');
    if (latest > 0.95 && prev <= 0.95) {
      setIsFinished(true);
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    }
    prevScroll.current = latest;
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

  const targetBalls = [
    { id: 1, color: '#F1C40F', initX: '70%', initY: '50%', endX: '100%', endY: '0%' },
    { id: 2, color: '#2980B9', initX: '73.03%', initY: '46.5%', endX: '0%', endY: '0%' },
    { id: 3, color: '#E74C3C', initX: '73.03%', initY: '53.5%', endX: '100%', endY: '100%' },
    { id: 4, color: '#8E44AD', initX: '76.06%', initY: '43%', endX: '50%', endY: '-2.5%' },
    { id: 5, color: '#E67E22', initX: '76.06%', initY: '50%', endX: '0%', endY: '100%' },
    { id: 8, color: '#111111', initX: '76.06%', initY: '57%', endX: '50%', endY: '102.5%' },
  ];

  return (
    <div ref={containerRef} className={`relative ${isFinished ? 'h-screen' : 'h-[300vh]'}`}>
      <section className="sticky top-0 h-screen w-full flex items-center justify-center pt-20 overflow-hidden bg-billiards-dark">

        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#1A0E0E] z-10" />
          <motion.img
            src="/new-hero-image.png"
            alt="Hero Background"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ zIndex: 15, opacity: bgOpacity, scale: bgScale }}
          />
        </div>

        {/* Animated Table Background */}
        <motion.div
          className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none"
          style={{ y: tableY, opacity: tableOpacity }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-billiards-dark/30 via-transparent to-billiards-dark z-10" />

          <motion.div
            className="relative w-[95vw] max-w-[1600px] aspect-[2/1] md:aspect-[2.2/1] p-4 md:p-8"
            style={{ scale: tableScale, opacity: tableGlobalOpacity }}
          >
            {/* Table Outer Wood */}
            <div className="w-full h-full wood-texture rounded-[2rem] md:rounded-[3rem] shadow-[0_40px_80px_rgba(0,0,0,0.9)] relative ring-[1px] ring-[#3d1212] border-[16px] md:border-[24px] border-[#2b130a] flex items-center justify-center">
              <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-[#333] to-[#111] rounded-tl-[1.5rem] md:rounded-tl-[2.5rem] opacity-50" />
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[#333] to-[#111] rounded-tr-[1.5rem] md:rounded-tr-[2.5rem] opacity-50" />
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-[#333] to-[#111] rounded-bl-[1.5rem] md:rounded-bl-[2.5rem] opacity-50" />
              <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-[#333] to-[#111] rounded-br-[1.5rem] md:rounded-br-[2.5rem] opacity-50" />

              <div className="absolute inset-2 md:inset-4 bg-[#0a0202] rounded-xl z-0" />

              {/* Table Inner Felt */}
              <div className="absolute inset-2 md:inset-4 red-felt shadow-[inset_0_0_80px_rgba(0,0,0,1)] z-0 rounded-xl overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#ffffff] opacity-[0.03] blur-[60px] rounded-full" />
              </div>

              {/* Balls and Stick Container */}
              <div className="absolute inset-2 md:inset-4 z-10">


                {/* Cue Ball */}
                <motion.div
                  className="absolute w-[3.5%] aspect-square rounded-full"
                  style={{
                    y: '-50%', x: '-50%',
                    backgroundColor: '#ffffff',
                    backgroundImage: 'radial-gradient(circle at 35% 25%, #ffffff 0%, rgba(255,255,255,0.8) 20%, rgba(220,220,220,0) 50%, rgba(0,0,0,0.4) 100%)',
                    boxShadow: '4px 8px 12px rgba(0,0,0,0.6), inset -3px -3px 6px rgba(0,0,0,0.3)',
                    left: cueLeft,
                    top: cueTop
                  }}
                />

                {/* Target Balls */}
                {targetBalls.map((ball) => (
                  <TargetBall key={ball.id} ball={ball} scrollYProgress={scrollYProgress} />
                ))}
              </div>

              {/* Rails (Cushions) */}
              <div className="absolute inset-2 md:inset-4 z-20 pointer-events-none">
                <div className="absolute top-0 left-12 right-[calc(50%+20px)] h-8 md:h-12 bg-gradient-to-b from-[#1c0404] via-[#3a0a0a] to-[#110202] shadow-[0_15px_25px_rgba(0,0,0,0.9)] border-b border-[#5c1313]/40 rounded-br-2xl" />
                <div className="absolute top-0 left-[calc(50%+20px)] right-12 h-8 md:h-12 bg-gradient-to-b from-[#1c0404] via-[#3a0a0a] to-[#110202] shadow-[0_15px_25px_rgba(0,0,0,0.9)] border-b border-[#5c1313]/40 rounded-bl-2xl" />
                
                <div className="absolute bottom-0 left-12 right-[calc(50%+20px)] h-8 md:h-12 bg-gradient-to-t from-[#1c0404] via-[#3a0a0a] to-[#110202] shadow-[0_-15px_25px_rgba(0,0,0,0.9)] border-t border-[#5c1313]/40 rounded-tr-2xl" />
                <div className="absolute bottom-0 left-[calc(50%+20px)] right-12 h-8 md:h-12 bg-gradient-to-t from-[#1c0404] via-[#3a0a0a] to-[#110202] shadow-[0_-15px_25px_rgba(0,0,0,0.9)] border-t border-[#5c1313]/40 rounded-tl-2xl" />

                <div className="absolute left-0 top-12 bottom-12 w-8 md:w-12 bg-gradient-to-r from-[#1c0404] via-[#3a0a0a] to-[#110202] shadow-[15px_0_25px_rgba(0,0,0,0.9)] border-r border-[#5c1313]/40 rounded-r-2xl" />
                <div className="absolute right-0 top-12 bottom-12 w-8 md:w-12 bg-gradient-to-l from-[#1c0404] via-[#3a0a0a] to-[#110202] shadow-[-15px_0_25px_rgba(0,0,0,0.9)] border-l border-[#5c1313]/40 rounded-l-2xl" />
              </div>

              {/* Pockets SVG */}
              <div className="absolute inset-2 md:inset-4 z-30 pointer-events-none">
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
                      <circle cx={p.cx} cy={p.cy} r={28} fill="#0a0a0a" filter="url(#pocketShadow)" />
                      <circle cx={p.cx} cy={p.cy} r={24} fill="#111" />
                      <circle cx={p.cx} cy={p.cy} r={22} fill="url(#pocketDepth)" />
                      <path
                        d={`M ${p.cx - 28} ${p.cy - 10} C ${p.cx - 28} ${p.cy - 30}, ${p.cx + 28} ${p.cy - 30}, ${p.cx + 28} ${p.cy - 10}`}
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

              {/* Cue Stick Container (Above Rails and Pockets) */}
              <div className="absolute inset-2 md:inset-4 z-40 pointer-events-none">
                <motion.div
                  className="absolute top-1/2 h-3 md:h-5 rounded-full origin-right"
                  style={{
                    left: 'calc(25% - 40%)',
                    width: '40%',
                    background: 'linear-gradient(to bottom, #7c4c2a 0%, #d9a05b 20%, #e8ba7d 40%, #8B5A2B 80%, #3a2210 100%)',
                    y: '-50%',
                    boxShadow: '0 30px 40px rgba(0,0,0,0.8), inset 0 2px 4px rgba(255,255,255,0.4)',
                    x: stickX,
                    opacity: stickOpacity
                  }}
                >
                  <div className="absolute right-0 top-0 bottom-0 w-8 md:w-12 bg-gradient-to-b from-gray-200 via-white to-gray-400 rounded-r-full border-l-2 border-black/20">
                    <div className="absolute right-0 top-0 bottom-0 w-2 md:w-3 bg-blue-500 rounded-r-full" />
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Hero Text Content */}
        <div className="absolute inset-0 max-w-[1600px] mx-auto px-8 z-40 w-full pointer-events-none flex justify-center items-start pt-8 md:pt-12 lg:pt-16 h-full text-center">
          <div className="max-w-5xl pointer-events-auto flex flex-col items-center">
            <motion.div
              className="flex flex-wrap justify-center items-center gap-2 md:gap-4 text-[9px] md:text-[10px] tracking-[0.25em] uppercase text-[#D4AF37] mb-6 drop-shadow-lg mt-4 md:mt-8"
              style={{ opacity: textOpacity, y: textY }}
            >
              <span>PREMIUM BILLIARDS</span>
              <span className="w-1 h-1 rounded-full bg-[#D4AF37]/50"></span>
              <span>TOURNAMENTS</span>
              <span className="w-1 h-1 rounded-full bg-[#D4AF37]/50"></span>
              <span>LOUNGE</span>
              <span className="w-1 h-1 rounded-full bg-[#D4AF37]/50"></span>
              <span>PRIVATE BOOKINGS</span>
            </motion.div>

            <motion.div
              className="mb-0"
              style={{ opacity: textOpacity, y: textY }}
            >
              <span className="text-gray-300 uppercase tracking-[0.4em] font-medium text-[10px] md:text-xs drop-shadow-lg">
                EXPERIENCE
              </span>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-8xl lg:text-[7.5rem] font-serif leading-[1.05] mb-2 drop-shadow-2xl uppercase tracking-tight text-[#EAE0C8]"
              style={{ opacity: textOpacity, y: textY }}
            >
              <span className="block">THE GAME</span>
              <span className="block">IN STYLE</span>
            </motion.h1>



            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md"
              style={{ opacity: textOpacity, y: textY }}
            >
              <Link to="/booking"
                className="flex-1 flex items-center justify-center px-6 py-3.5 bg-[#CBA469] text-black font-semibold uppercase tracking-[0.15em] text-[10px] hover:scale-105 transition-transform duration-300"
              >
                Book A Table
              </Link>
              <a
                href="#membership"
                className="flex-1 flex items-center justify-center px-6 py-3.5 border border-white/40 text-white font-semibold uppercase tracking-[0.15em] text-[10px] hover:border-[#CBA469] hover:text-[#CBA469] transition-all duration-300"
              >
                Explore Membership
              </a>
            </motion.div>
          </div>

          <motion.div
            className="hidden lg:flex flex-col items-center gap-8 pointer-events-auto absolute right-8 bottom-12"
            style={{ opacity: textOpacity, y: textY }}
          >
            <div className="w-[1px] h-32 bg-white/10 absolute -top-40" />
            <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </a>
          </motion.div>
        </div>

        {/* Bottom Left Pagination */}
        <motion.div
          className="absolute bottom-12 left-8 z-40 flex items-center gap-6"
          style={{ opacity: textOpacity }}
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
          className="absolute bottom-12 right-28 z-40 flex flex-col items-end gap-2 pr-4 border-r border-white/10"
          style={{ opacity: textOpacity }}
        >
          <span className="text-xs uppercase tracking-[0.3em] text-white font-medium">GAME ON</span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400">STRIKE WITH STYLE</span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400">WIN WITH CLASS</span>
        </motion.div>
      </section>
    </div>
  );
}




