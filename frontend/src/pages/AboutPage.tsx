import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import Footer from '../components/landing/Footer';

export default function AboutPage() {
  const { isDark } = useTheme();

  return (
    <>
      <main className="pt-24 pb-16">
        <div className="section-container">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <span className="text-vyuha-gold font-mono text-sm tracking-[0.3em] uppercase">
              About
            </span>
            <h1 className={`font-display text-5xl sm:text-6xl font-bold mt-4 mb-8 ${isDark ? 'text-white' : 'text-vyuha-black'}`}>
              About <span className="text-gradient-gold">Vyuha 2K26</span>
            </h1>

            <div className={`space-y-6 text-lg leading-relaxed ${isDark ? 'text-vyuha-gray-400' : 'text-vyuha-gray-600'}`}>
              <p>
                Vyuha 2K26 is the flagship annual cultural and technical festival of our college.
                Scheduled for March 30, 2026, this single-day extravaganza brings together
                thousands of students, artists, engineers, and entrepreneurs under one roof.
              </p>
              <p>
                From high-intensity coding competitions and robotics battles to mesmerizing
                dance performances and live music, Vyuha offers something for every passion.
                Our mission is to create a platform where talent meets opportunity, and where
                memories are made that last a lifetime.
              </p>
              <p>
                This year, we are raising the bar with 50+ curated events, celebrity guest
                appearances, workshops by industry leaders, and prizes worth lakhs. Whether
                you are a participant or a spectator, Vyuha 2K26 promises an experience
                unlike any other.
              </p>
            </div>

            {/* Key highlights */}
            <motion.div
              className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-6"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {[
                { title: 'Date', value: 'March 30, 2026' },
                { title: 'Venue', value: 'Main Campus' },
                { title: 'Expected Footfall', value: '5000+ Attendees' },
                { title: 'Events', value: '50+ Programs' },
              ].map((item) => (
                <div
                  key={item.title}
                  className={`p-6 rounded-2xl border ${
                    isDark
                      ? 'bg-white/5 border-white/10'
                      : 'bg-vyuha-gray-50 border-vyuha-gray-200'
                  }`}
                >
                  <div className="text-vyuha-gold font-mono text-xs uppercase tracking-wider mb-2">
                    {item.title}
                  </div>
                  <div className={`font-display text-xl font-bold ${isDark ? 'text-white' : 'text-vyuha-black'}`}>
                    {item.value}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
