import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import EventCard from './EventCard';
import { useTheme } from '../../context/ThemeContext';

const SAMPLE_EVENTS = [
  {
    title: 'Code Clash',
    description: 'A high-intensity competitive programming challenge. Solve algorithmic problems under time pressure.',
    category: 'Tech',
    time: '9:00 AM',
    venue: 'Lab A1',
  },
  {
    title: 'Dance Mania',
    description: 'Show off your moves in solo or group dance competitions. All styles welcome.',
    category: 'Cultural',
    time: '10:30 AM',
    venue: 'Main Stage',
  },
  {
    title: 'Startup Pitch',
    description: 'Pitch your startup idea to a panel of industry experts and investors.',
    category: 'Business',
    time: '11:00 AM',
    venue: 'Seminar Hall',
  },
  {
    title: 'Robo Wars',
    description: 'Build and battle robots in an elimination-style competition. Engineering at its finest.',
    category: 'Tech',
    time: '1:00 PM',
    venue: 'Ground Floor',
  },
  {
    title: 'Band Battle',
    description: 'Live music competition featuring the best college bands. Rock, pop, fusion, and more.',
    category: 'Cultural',
    time: '3:00 PM',
    venue: 'Open Air Theatre',
  },
  {
    title: 'Quiz Quest',
    description: 'Test your knowledge across science, tech, pop culture, and current affairs.',
    category: 'General',
    time: '4:00 PM',
    venue: 'Auditorium',
  },
];

export default function EventsShowcase() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const { isDark } = useTheme();

  return (
    <section ref={sectionRef} className="py-24 relative">
      {/* Section background accent */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse at 50% 0%, rgba(212,168,67,0.03) 0%, transparent 50%)'
            : 'radial-gradient(ellipse at 50% 0%, rgba(212,168,67,0.05) 0%, transparent 50%)',
        }}
      />

      <div className="section-container">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ y: 30, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="text-vyuha-gold font-mono text-sm tracking-[0.3em] uppercase">
            What Awaits You
          </span>
          <h2 className={`font-display text-4xl sm:text-5xl lg:text-6xl font-bold mt-4 ${isDark ? 'text-white' : 'text-vyuha-black'}`}>
            Featured Events
          </h2>
          <p className={`max-w-xl mx-auto mt-4 text-lg ${isDark ? 'text-vyuha-gray-400' : 'text-vyuha-gray-600'}`}>
            From coding battles to cultural extravaganzas, there is something for everyone.
          </p>
        </motion.div>

        {/* Auto-scrolling card carousel + grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SAMPLE_EVENTS.map((event, index) => (
            <EventCard
              key={event.title}
              {...event}
              index={index}
            />
          ))}
        </div>

        {/* View all CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-secondary"
          >
            View All Events
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
