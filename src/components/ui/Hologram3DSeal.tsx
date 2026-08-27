import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

interface Hologram3DSealProps {
  size?: number;
  className?: string;
  activeLabel?: string;
  statusText?: string;
}

export const Hologram3DSeal: React.FC<Hologram3DSealProps> = ({
  size = 280,
  className = '',
  activeLabel = 'IS 14543 : 2024',
  statusText = 'CERTIFIED COMPLIANCE',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 200, mass: 0.6 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [20, -20]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-25, 25]), springConfig);

  useEffect(() => {
    let animId: number;
    const animate = () => {
      setRotationAngle((prev) => (prev + 0.35) % 360);
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`relative flex items-center justify-center perspective-1000 select-none cursor-pointer ${className}`}
      style={{ width: size, height: size }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative w-full h-full flex items-center justify-center preserve-3d"
      >
        {/* Layer 0: Deep Backdrop Plate */}
        <div
          className="absolute inset-2 rounded-full border border-zinc-200/80 bg-gradient-to-b from-zinc-100/90 to-zinc-50/50 shadow-inner"
          style={{ transform: 'translateZ(-20px)' }}
        />

        {/* Layer 1: Geometric Concentric Precision Rings */}
        <div
          className="absolute inset-6 rounded-full border border-dashed border-zinc-300 transition-transform duration-700"
          style={{
            transform: `translateZ(-5px) rotate(${rotationAngle}deg)`,
          }}
        />
        
        <div
          className="absolute inset-10 rounded-full border border-zinc-900/10"
          style={{
            transform: `translateZ(5px) rotate(${-rotationAngle * 0.8}deg)`,
          }}
        />

        {/* Layer 2: 3D Isometric Calibration Compass / Standards Crosshair */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ transform: 'translateZ(15px)' }}
        >
          <svg className="w-full h-full p-8 text-zinc-900/40" viewBox="0 0 100 100" fill="none">
            {/* Precision Grid Coordinates */}
            <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 3" />
            <circle cx="50" cy="50" r="32" stroke="currentColor" strokeWidth="0.75" />
            <circle cx="50" cy="50" r="18" stroke="currentColor" strokeWidth="0.5" />
            
            {/* Cardinal Tick Marks */}
            <line x1="50" y1="4" x2="50" y2="12" stroke="currentColor" strokeWidth="1" />
            <line x1="50" y1="88" x2="50" y2="96" stroke="currentColor" strokeWidth="1" />
            <line x1="4" y1="50" x2="12" y2="50" stroke="currentColor" strokeWidth="1" />
            <line x1="88" y1="50" x2="96" y2="50" stroke="currentColor" strokeWidth="1" />
            
            {/* Diagonal Precision Cross */}
            <line x1="28" y1="28" x2="72" y2="72" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
            <line x1="28" y1="72" x2="72" y2="28" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
          </svg>
        </div>

        {/* Layer 3: Central High-Relief Standards Monolith Token */}
        <motion.div
          className="relative z-20 flex flex-col items-center justify-center p-5 rounded-2xl bg-zinc-900 text-zinc-50 border border-zinc-700 shadow-xl"
          style={{
            transform: 'translateZ(35px)',
            width: size * 0.58,
            height: size * 0.58,
          }}
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          {/* Subtle light sheen on token */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/0 via-white/10 to-white/0 pointer-events-none" />
          
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[9px] font-mono tracking-widest text-zinc-400 uppercase">
              {statusText}
            </span>
          </div>

          <div className="font-display font-bold text-center text-sm md:text-base text-zinc-100 tracking-tight leading-tight px-1">
            {activeLabel}
          </div>

          <div className="mt-2 text-[9px] font-mono text-zinc-400 border-t border-zinc-800 pt-1.5 w-full text-center">
            BIS ACT 2016 // RAG
          </div>
        </motion.div>

        {/* Floating 3D Orbiting Badges */}
        <motion.div
          className="absolute top-2 right-4 px-2 py-1 bg-white/95 border border-zinc-300 rounded-md shadow-md text-[10px] font-mono font-medium text-zinc-800"
          style={{ transform: 'translateZ(45px)' }}
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        >
          SCHEME-I
        </motion.div>

        <motion.div
          className="absolute bottom-3 left-4 px-2 py-1 bg-white/95 border border-zinc-300 rounded-md shadow-md text-[10px] font-mono font-medium text-zinc-800"
          style={{ transform: 'translateZ(40px)' }}
          animate={{ y: [0, 4, 0] }}
          transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut', delay: 0.5 }}
        >
          MANDATORY QCO
        </motion.div>
      </motion.div>
    </div>
  );
};
