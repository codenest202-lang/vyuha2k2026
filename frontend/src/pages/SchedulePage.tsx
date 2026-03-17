import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import Footer from '../components/landing/Footer';

const SCHEDULE = [
  { time: '8:00 AM', title: 'Registration & Welcome Kit', type: 'General' },
  { time: '9:00 AM', title: 'Inaugural Ceremony', type: 'General' },
  { time: '9:30 AM', title: 'Code Clash - Round 1', type: 'Tech' },
  { time: '10:00 AM', title: 'Dance Mania - Solo', type: 'Cultural' },
  { time: '10:30 AM', title: 'Startup Pitch Competition', type: 'Business' },
  { time: '11:00 AM', title: 'Robo Wars - Qualifiers', type: 'Tech' },
  { time: '12:00 PM', title: 'Lunch Break & Open Mic', type: 'General' },
  { time: '1:00 PM', title: 'Code Clash - Finals', type: 'Tech' },
  { time: '1:30 PM', title: 'Dance Mania - Group', type: 'Cultural' },
  { time: '2:30 PM', title: 'Robo Wars - Finals', type: 'Tech' },
  { time: '3:00 PM', title: 'Band Battle', type: 'Cultural' },
  { time: '4:00 PM', title: 'Quiz Quest', type: 'General' },
  { time: '5:00 PM', title: 'Celebrity Guest Session', type: 'Special' },
  { time: '6:00 PM', title: 'Prize Distribution & Closing', type: 'General' },
  { time: '7:00 PM', title: 'DJ Night & After Party', type: 'Special' },
];

const typeColors: Record<string, string> = {
  Tech: 'text-vyuha-gold',
  Cultural: 'text-emerald-400',
  Business: 'text-amber-400',
  General: 'text-vyuha-gray-400',
  Special: 'text-rose-400',
};

export default function SchedulePage() {
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
              March 30, 2026
            </span>
            <h1 className={`font-display text-5xl sm:text-6xl font-bold mt-4 mb-4 ${isDark ? 'text-white' : 'text-vyuha-black'}`}>
              Event <span className="text-gradient-gold">Schedule</span>
            </h1>
            <p className={`text-lg mb-12 ${isDark ? 'text-vyuha-gray-400' : 'text-vyuha-gray-600'}`}>
              A packed day of non-stop action. Here is what awaits you.
            </p>

            {/* Timeline */}
            <div className="relative">
              {/* Vertical line */}
              <div className={`absolute left-[7px] top-2 bottom-2 w-px ${isDark ? 'bg-white/10' : 'bg-vyuha-gray-200'}`} />

              <div className="space-y-6">
                {SCHEDULE.map((item, index) => (
                  <motion.div
                    key={item.title}
                    className="flex gap-6 items-start"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    {/* Dot */}
                    <div className="relative flex-shrink-0 mt-2">
                      <div className="w-[15px] h-[15px] rounded-full border-2 border-vyuha-gold bg-vyuha-black" />
                    </div>

                    {/* Content */}
                    <div className={`flex-1 p-4 rounded-xl border transition-colors ${
                      isDark
                        ? 'bg-white/5 border-white/10 hover:border-vyuha-gold/20'
                        : 'bg-vyuha-gray-50 border-vyuha-gray-200 hover:border-vyuha-gold/40'
                    }`}>
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <div className="font-mono text-xs text-vyuha-gold mb-1">{item.time}</div>
                          <div className={`font-sans font-semibold ${isDark ? 'text-white' : 'text-vyuha-black'}`}>
                            {item.title}
                          </div>
                        </div>
                        <span className={`text-xs font-mono uppercase tracking-wider ${typeColors[item.type] || 'text-vyuha-gray-500'}`}>
                          {item.type}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
