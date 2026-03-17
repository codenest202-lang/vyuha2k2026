import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

export default function HeroSection() {
  const { isDark } = useTheme();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Gradient overlay */}
      <div
        className={`absolute inset-0 ${
          isDark
            ? 'bg-gradient-to-b from-vyuha-black via-transparent to-vyuha-black'
            : 'bg-gradient-to-b from-white via-transparent to-white'
        }`}
      />

      <div className="section-container relative z-10 text-center">
        {/* Date badge */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-vyuha-gold/30 bg-vyuha-gold/5 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-vyuha-gold animate-pulse" />
          <span className="text-vyuha-gold text-sm font-mono tracking-wider">
            March 30, 2026
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          className="font-display text-5xl sm:text-7xl lg:text-9xl font-bold leading-none mb-6"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <span className="text-gradient-gold">Vyuha</span>
          <br />
          <span className={isDark ? 'text-white' : 'text-vyuha-black'}>
            2K26
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className={`max-w-2xl mx-auto text-lg sm:text-xl font-sans leading-relaxed mb-12 ${
            isDark ? 'text-vyuha-gray-400' : 'text-vyuha-gray-600'
          }`}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          The ultimate college event experience. One day. Unlimited memories.
          Join us for the most spectacular celebration of talent, culture, and innovation.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(212,168,67,0.3)' }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary text-lg px-12 py-4"
          >
            Register Now
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-secondary text-lg px-12 py-4"
          >
            View Schedule
          </motion.button>
        </motion.div>

        {/* Stats row */}
        <motion.div
          className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-3xl mx-auto"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          {[
            { value: '50+', label: 'Events' },
            { value: '5000+', label: 'Participants' },
            { value: '1', label: 'Epic Day' },
            { value: '100+', label: 'Prizes' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-3xl sm:text-4xl font-bold text-vyuha-gold">
                {stat.value}
              </div>
              <div className={`text-sm font-sans mt-1 ${isDark ? 'text-vyuha-gray-500' : 'text-vyuha-gray-600'}`}>
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-vyuha-gold/30 flex items-start justify-center pt-2">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-vyuha-gold"
            animate={{ y: [0, 16, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
}
