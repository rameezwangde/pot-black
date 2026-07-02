import { motion } from 'motion/react';
import { ReactNode } from 'react';

interface AnimatedHeadingProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function AnimatedHeading({ children, className = '', delay = 0 }: AnimatedHeadingProps) {
  return (
    <div className="relative overflow-hidden pb-4 -mb-4">
      <motion.div
        initial={{ y: '100%', opacity: 0, rotateX: 30 }}
        whileInView={{ y: 0, opacity: 1, rotateX: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ 
          duration: 0.9, 
          ease: [0.215, 0.610, 0.355, 1.000], // cubic-bezier for smooth out
          delay 
        }}
        className={className}
        style={{ transformOrigin: "bottom center", willChange: "transform, opacity" }}
      >
        {children}
      </motion.div>
    </div>
  );
}
