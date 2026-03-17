import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

export default function Footer() {
  const { isDark } = useTheme();

  return (
    <footer className={`py-16 border-t ${isDark ? 'border-white/5 bg-vyuha-black' : 'border-vyuha-gray-200 bg-white'}`}>
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="font-display text-2xl font-bold text-gradient-gold">Vyuha</span>
              <span className="font-mono text-sm text-vyuha-gold/60">2K26</span>
            </div>
            <p className={`text-sm leading-relaxed ${isDark ? 'text-vyuha-gray-500' : 'text-vyuha-gray-600'}`}>
              The ultimate college event experience.
              March 30, 2026. One day. Unlimited memories.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className={`font-sans font-semibold mb-4 ${isDark ? 'text-white' : 'text-vyuha-black'}`}>
              Quick Links
            </h4>
            <ul className="space-y-2">
              {['Home', 'About', 'Schedule', 'Register', 'Contact'].map((link) => (
                <li key={link}>
                  <a
                    href={`/${link.toLowerCase()}`}
                    className={`text-sm transition-colors duration-200 ${
                      isDark
                        ? 'text-vyuha-gray-500 hover:text-vyuha-gold'
                        : 'text-vyuha-gray-600 hover:text-vyuha-gold'
                    }`}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className={`font-sans font-semibold mb-4 ${isDark ? 'text-white' : 'text-vyuha-black'}`}>
              Contact
            </h4>
            <ul className="space-y-2">
              <li className={`text-sm ${isDark ? 'text-vyuha-gray-500' : 'text-vyuha-gray-600'}`}>
                Email: vyuha2k26@college.edu
              </li>
              <li className={`text-sm ${isDark ? 'text-vyuha-gray-500' : 'text-vyuha-gray-600'}`}>
                Phone: +91 98765 43210
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className={`mt-12 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${
          isDark ? 'border-white/5' : 'border-vyuha-gray-200'
        }`}>
          <p className={`text-xs ${isDark ? 'text-vyuha-gray-600' : 'text-vyuha-gray-500'}`}>
            &copy; 2026 Vyuha 2K26. All rights reserved.
          </p>
          <motion.a
            href="#"
            className="text-xs text-vyuha-gold/60 hover:text-vyuha-gold transition-colors"
            whileHover={{ scale: 1.05 }}
          >
            Built with passion
          </motion.a>
        </div>
      </div>
    </footer>
  );
}
