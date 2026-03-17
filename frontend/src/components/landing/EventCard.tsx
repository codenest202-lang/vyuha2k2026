import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

interface EventCardProps {
  title: string;
  description: string;
  category: string;
  time: string;
  venue: string;
  image?: string;
  index: number;
}

/**
 * Attractive, highly functional event program card
 * with floating animation effect and shadow reflections.
 */
export default function EventCard({
  title,
  description,
  category,
  time,
  venue,
  image,
  index,
}: EventCardProps) {
  const { isDark } = useTheme();

  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      {/* Shadow reflection below the card */}
      <div
        className="absolute -bottom-4 left-4 right-4 h-16 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(212,168,67,0.15) 0%, transparent 70%)',
        }}
      />

      <motion.div
        className={`relative overflow-hidden rounded-2xl border transition-all duration-500 cursor-pointer ${
          isDark
            ? 'bg-vyuha-dark/80 border-white/10 hover:border-vyuha-gold/30'
            : 'bg-white border-vyuha-gray-200 hover:border-vyuha-gold/50'
        }`}
        whileHover={{
          y: -8,
          transition: { duration: 0.3, ease: 'easeOut' },
        }}
        // Floating animation
        animate={{
          y: [0, -6, 0],
        }}
        transition={{
          y: {
            duration: 4 + index * 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
          },
        }}
      >
        {/* Image / Gradient placeholder */}
        <div className="relative h-48 overflow-hidden">
          {image ? (
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-vyuha-gold/20 via-vyuha-dark to-vyuha-black" />
          )}

          {/* Category badge */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider bg-vyuha-gold/90 text-vyuha-black rounded-full">
              {category}
            </span>
          </div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-vyuha-dark via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className={`font-display text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-vyuha-black'}`}>
            {title}
          </h3>
          <p className={`text-sm leading-relaxed mb-4 line-clamp-2 ${isDark ? 'text-vyuha-gray-400' : 'text-vyuha-gray-600'}`}>
            {description}
          </p>

          {/* Meta info */}
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-vyuha-gold">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {time}
            </div>
            <div className={`flex items-center gap-1.5 ${isDark ? 'text-vyuha-gray-500' : 'text-vyuha-gray-600'}`}>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {venue}
            </div>
          </div>
        </div>

        {/* Hover glow border effect */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            boxShadow: 'inset 0 0 30px rgba(212,168,67,0.05)',
          }}
        />
      </motion.div>
    </motion.div>
  );
}
