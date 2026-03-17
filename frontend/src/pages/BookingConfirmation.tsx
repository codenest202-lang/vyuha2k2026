import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { bookingApi, Booking } from '../lib/api';
import Footer from '../components/landing/Footer';

export default function BookingConfirmation() {
  const { id } = useParams<{ id: string }>();
  const { isDark } = useTheme();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    bookingApi
      .getBooking(id)
      .then((res) => {
        if (res.data?.booking) setBooking(res.data.booking);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-vyuha-gold/30 border-t-vyuha-gold animate-spin" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || 'Booking not found'}</p>
          <Link to="/" className="btn-primary">Go Home</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <main className="pt-24 pb-16">
        <div className="section-container max-w-2xl">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center"
          >
            {/* Success icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="w-20 h-20 mx-auto rounded-full bg-vyuha-gold/20 flex items-center justify-center mb-6"
            >
              <svg className="w-10 h-10 text-vyuha-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>

            <h1 className={`font-display text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-vyuha-black'}`}>
              Booking Confirmed!
            </h1>
            <p className={`text-lg mb-8 ${isDark ? 'text-vyuha-gray-400' : 'text-vyuha-gray-600'}`}>
              Your spot at Vyuha 2K26 is secured.
            </p>
          </motion.div>

          {/* Ticket card */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={`rounded-2xl border overflow-hidden ${
              isDark ? 'bg-vyuha-dark border-white/10' : 'bg-white border-vyuha-gray-200 shadow-lg'
            }`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-vyuha-gold-dark via-vyuha-gold to-vyuha-gold-light p-6 text-vyuha-black">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-2xl font-bold">Vyuha 2K26</h2>
                  <p className="text-sm opacity-80">March 30, 2026</p>
                </div>
                <div className="text-right">
                  <div className="text-xs uppercase tracking-wider opacity-70">Event ID</div>
                  <div className="font-mono font-bold">{booking.transactionId}</div>
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div className="flex justify-center py-8">
              {booking.qrCode && (
                <img
                  src={booking.qrCode}
                  alt="Booking QR Code"
                  className="w-48 h-48 rounded-lg"
                />
              )}
            </div>

            {/* Details */}
            <div className="px-6 pb-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <div className={`text-xs uppercase tracking-wider mb-1 ${isDark ? 'text-vyuha-gray-500' : 'text-vyuha-gray-500'}`}>
                    Status
                  </div>
                  <div className="font-semibold text-vyuha-gold capitalize">{booking.status}</div>
                </div>
                <div>
                  <div className={`text-xs uppercase tracking-wider mb-1 ${isDark ? 'text-vyuha-gray-500' : 'text-vyuha-gray-500'}`}>
                    Amount Paid
                  </div>
                  <div className={`font-semibold ${isDark ? 'text-white' : 'text-vyuha-black'}`}>
                    INR {booking.totalAmount.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Participants */}
              <h3 className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-vyuha-black'}`}>
                Participants ({booking.participants.length})
              </h3>
              <div className="space-y-2">
                {booking.participants.map((p, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-lg text-sm ${
                      isDark ? 'bg-white/5' : 'bg-vyuha-gray-50'
                    }`}
                  >
                    <div className={`font-medium ${isDark ? 'text-white' : 'text-vyuha-black'}`}>{p.name}</div>
                    <div className={isDark ? 'text-vyuha-gray-500' : 'text-vyuha-gray-600'}>
                      {p.college} - {p.department} ({p.year})
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Actions */}
          <div className="flex gap-4 mt-8 justify-center">
            <Link to="/my-bookings" className="btn-secondary">
              My Bookings
            </Link>
            <Link to="/" className="btn-primary">
              Back to Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
