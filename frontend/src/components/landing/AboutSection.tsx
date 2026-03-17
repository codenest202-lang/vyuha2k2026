import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

export default function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { isDark } = useTheme();

  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'High Energy',
      description: 'Non-stop action from dawn to dusk with back-to-back events.',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: 'Innovation',
      description: 'Cutting-edge tech events, hackathons, and startup competitions.',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: 'Community',
      description: '5000+ students, alumni, and guests coming together as one.',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      title: 'Excellence',
      description: 'Prizes worth lakhs. Recognition that lasts a lifetime.',
    },
  ];

  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text content */}
          <div>
            <motion.span
              className="text-vyuha-gold font-mono text-sm tracking-[0.3em] uppercase"
              initial={{ x: -30, opacity: 0 }}
              animate={isInView ? { x: 0, opacity: 1 } : {}}
              transition={{ duration: 0.5 }}
            >
              About Vyuha
            </motion.span>

            <motion.h2
              className={`font-display text-4xl sm:text-5xl font-bold mt-4 mb-6 ${isDark ? 'text-white' : 'text-vyuha-black'}`}
              initial={{ x: -30, opacity: 0 }}
              animate={isInView ? { x: 0, opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Where Talent Meets{' '}
              <span className="text-gradient-gold">Opportunity</span>
            </motion.h2>

            <motion.p
              className={`text-lg leading-relaxed mb-8 ${isDark ? 'text-vyuha-gray-400' : 'text-vyuha-gray-600'}`}
              initial={{ x: -30, opacity: 0 }}
              animate={isInView ? { x: 0, opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Vyuha 2K26 is not just an event -- it is a movement. For one extraordinary day,
              our campus transforms into a hub of creativity, competition, and celebration.
              Whether you are a coder, dancer, entrepreneur, or artist, Vyuha has a stage for you.
            </motion.p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <button className="btn-primary">Learn More</button>
            </motion.div>
          </div>

          {/* Right: Feature cards */}
          <div className="grid grid-cols-2 gap-4">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                className={`p-6 rounded-2xl border transition-all duration-300 ${
                  isDark
                    ? 'bg-white/5 border-white/10 hover:border-vyuha-gold/20'
                    : 'bg-vyuha-gray-50 border-vyuha-gray-200 hover:border-vyuha-gold/40'
                }`}
                initial={{ y: 30, opacity: 0 }}
                animate={isInView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <div className="text-vyuha-gold mb-3">{feature.icon}</div>
                <h3 className={`font-sans font-semibold mb-2 ${isDark ? 'text-white' : 'text-vyuha-black'}`}>
                  {feature.title}
                </h3>
                <p className={`text-sm ${isDark ? 'text-vyuha-gray-500' : 'text-vyuha-gray-600'}`}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
