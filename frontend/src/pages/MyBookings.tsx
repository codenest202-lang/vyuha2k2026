import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { bookingApi, Booking } from '../lib/api';
import Footer from '../components/landing/Footer';

export default function MyBookings() {
  const { isDark } = useTheme();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    bookingApi
      .getMyBookings()
      .then((res) => {
        if (res.data?.bookings) setBookings(res.data.bookings);
      })
      .finally(() => setLoading(false));
  }, [isAuthenticated, navigate]);

  const statusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-emerald-400';
      case 'pending': return 'text-amber-400';
      case 'failed': return 'text-red-400';
      case 'cancelled': return 'text-vyuha-gray-500';
      default: return 'text-vyuha-gray-400';
    }
  };

  return (
    <>
      <main className="pt-24 pb-16 min-h-screen">
        <div className="section-container max-w-3xl">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <h1 className={`font-display text-4xl font-bold mb-8 ${isDark ? 'text-white' : 'text-vyuha-black'}`}>
              My <span className="text-gradient-gold">Bookings</span>
            </h1>

            {loading ? (
              <div className="flex justify-center py-16">
                <div className="w-10 h-10 rounded-full border-2 border-vyuha-gold/30 border-t-vyuha-gold animate-spin" />
              </div>
            ) : bookings.length === 0 ? (
              <div className={`text-center py-16 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-vyuha-gray-50 border-vyuha-gray-200'}`}>
                <p className={`text-lg mb-4 ${isDark ? 'text-vyuha-gray-400' : 'text-vyuha-gray-600'}`}>
                  No bookings yet.
                </p>
                <Link to="/booking" className="btn-primary">Book Now</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking, index) => (
                  <motion.div
                    key={booking._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={`/booking/confirmation/${booking._id}`}
                      className={`block p-6 rounded-2xl border transition-all hover:scale-[1.01] ${
                        isDark
                          ? 'bg-white/5 border-white/10 hover:border-vyuha-gold/20'
                          : 'bg-white border-vyuha-gray-200 hover:border-vyuha-gold/40 shadow-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-mono text-sm text-vyuha-gold">
                          {booking.transactionId}
                        </span>
                        <span className={`text-xs font-mono uppercase ${statusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className={`text-sm ${isDark ? 'text-vyuha-gray-400' : 'text-vyuha-gray-600'}`}>
                          {booking.participants.length} participant(s)
                        </div>
                        <div className={`font-semibold ${isDark ? 'text-white' : 'text-vyuha-black'}`}>
                          INR {booking.totalAmount.toLocaleString('en-IN')}
                        </div>
                      </div>
                      <div className={`text-xs mt-2 ${isDark ? 'text-vyuha-gray-600' : 'text-vyuha-gray-500'}`}>
                        {new Date(booking.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
