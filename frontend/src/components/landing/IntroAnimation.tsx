import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface IntroAnimationProps {
  onComplete: () => void;
}

/**
 * The "Vyuha" Intro sequence:
 * - Fast-loading logo in the center
 * - "Vyuha" text slides in from the left
 * - "2K26" text slides in from the right
 * - Gold glow effect and particles
 * - Fades out to reveal the main page
 */
export default function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [phase, setPhase] = useState<'logo' | 'text' | 'glow' | 'exit'>('logo');

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase('text'), 600),
      setTimeout(() => setPhase('glow'), 1800),
      setTimeout(() => setPhase('exit'), 2800),
      setTimeout(() => onComplete(), 3400),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== 'exit' ? (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-vyuha-black overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          {/* Radial glow behind the logo */}
          <motion.div
            className="absolute w-[600px] h-[600px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(212,168,67,0.15) 0%, transparent 70%)',
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={
              phase === 'glow'
                ? { scale: 2, opacity: 1 }
                : { scale: 0.5, opacity: 0.3 }
            }
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />

          {/* Center content */}
          <div className="relative flex flex-col items-center gap-2">
            {/* Logo mark */}
            <motion.div
              className="w-20 h-20 rounded-2xl bg-gradient-to-br from-vyuha-gold to-vyuha-gold-dark flex items-center justify-center"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
            >
              <span className="text-vyuha-black font-display text-3xl font-bold">V</span>
            </motion.div>

            {/* Text row */}
            <div className="flex items-baseline gap-3 mt-4">
              {/* "Vyuha" slides in from left */}
              <motion.span
                className="font-display text-5xl sm:text-7xl lg:text-8xl font-bold text-gradient-gold"
                initial={{ x: -100, opacity: 0 }}
                animate={
                  phase === 'text' || phase === 'glow'
                    ? { x: 0, opacity: 1 }
                    : { x: -100, opacity: 0 }
                }
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                Vyuha
              </motion.span>

              {/* "2K26" slides in from right */}
              <motion.span
                className="font-mono text-2xl sm:text-3xl lg:text-4xl font-bold text-vyuha-gold/70"
                initial={{ x: 100, opacity: 0 }}
                animate={
                  phase === 'text' || phase === 'glow'
                    ? { x: 0, opacity: 1 }
                    : { x: 100, opacity: 0 }
                }
                transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              >
                2K26
              </motion.span>
            </div>

            {/* Tagline */}
            <motion.p
              className="text-vyuha-gray-500 text-sm sm:text-base font-sans mt-3 tracking-[0.3em] uppercase"
              initial={{ y: 20, opacity: 0 }}
              animate={
                phase === 'glow'
                  ? { y: 0, opacity: 1 }
                  : { y: 20, opacity: 0 }
              }
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              March 30, 2026
            </motion.p>
          </div>

          {/* Decorative lines */}
          <motion.div
            className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-vyuha-gold/20 to-transparent"
            initial={{ scaleX: 0 }}
            animate={phase === 'glow' ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
