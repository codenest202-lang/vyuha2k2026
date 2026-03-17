import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { bookingApi, Participant } from '../lib/api';
import Footer from '../components/landing/Footer';

const PRICE_PER_PERSON = 1000;

const emptyParticipant = (): Participant => ({
  name: '',
  mobile: '',
  college: '',
  year: '',
  department: '',
});

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

export default function BookingPage() {
  const { isDark } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [participants, setParticipants] = useState<Participant[]>([
    {
      name: user?.name || '',
      mobile: user?.phone || '',
      college: user?.college || '',
      year: user?.year || '',
      department: user?.department || '',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const totalAmount = participants.length * PRICE_PER_PERSON;

  const updateParticipant = (index: number, field: keyof Participant, value: string) => {
    setParticipants((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    );
  };

  const addParticipant = () => {
    setParticipants((prev) => [...prev, emptyParticipant()]);
  };

  const removeParticipant = (index: number) => {
    if (participants.length <= 1) return;
    setParticipants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate all fields
      for (const p of participants) {
        if (!p.name || !p.mobile || !p.college || !p.year || !p.department) {
          throw new Error('All fields are required for each participant.');
        }
      }

      const res = await bookingApi.create(participants);

      if (!res.data) {
        throw new Error('Failed to create booking');
      }

      // Load Razorpay checkout
      const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID;

      if (razorpayKeyId && res.data.razorpayOrderId) {
        const options = {
          key: razorpayKeyId,
          amount: res.data.totalAmount * 100,
          currency: 'INR',
          name: 'Vyuha 2K26',
          description: `Event Registration - ${res.data.participantCount} person(s)`,
          order_id: res.data.razorpayOrderId,
          handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
            try {
              await bookingApi.verifyPayment({
                bookingId: res.data!.bookingId,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
              });
              navigate(`/booking/confirmation/${res.data!.bookingId}`);
            } catch {
              setError('Payment verification failed. Contact support.');
            }
          },
          prefill: {
            name: user?.name,
            email: user?.email,
          },
          theme: {
            color: '#D4A843',
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Dev mode: simulate payment success
        try {
          await bookingApi.verifyPayment({
            bookingId: res.data.bookingId,
            razorpayPaymentId: `pay_dev_${Date.now()}`,
            razorpayOrderId: res.data.razorpayOrderId || `order_dev_${Date.now()}`,
            razorpaySignature: 'dev_signature',
          });
        } catch {
          // Ignore verification errors in dev
        }
        navigate(`/booking/confirmation/${res.data.bookingId}`);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `w-full px-4 py-3 rounded-lg border outline-none transition-colors ${
    isDark
      ? 'bg-white/5 border-white/10 text-white placeholder:text-vyuha-gray-600 focus:border-vyuha-gold/50'
      : 'bg-vyuha-gray-50 border-vyuha-gray-200 text-vyuha-black placeholder:text-vyuha-gray-400 focus:border-vyuha-gold'
  }`;

  const labelClass = `block text-sm font-medium mb-1 ${isDark ? 'text-vyuha-gray-300' : 'text-vyuha-gray-700'}`;

  return (
    <>
      <main className="pt-24 pb-16">
        <div className="section-container max-w-3xl">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-vyuha-gold font-mono text-sm tracking-[0.3em] uppercase">
              March 30, 2026
            </span>
            <h1 className={`font-display text-4xl sm:text-5xl font-bold mt-4 mb-2 ${isDark ? 'text-white' : 'text-vyuha-black'}`}>
              Book Your <span className="text-gradient-gold">Spot</span>
            </h1>
            <p className={`text-lg mb-8 ${isDark ? 'text-vyuha-gray-400' : 'text-vyuha-gray-600'}`}>
              Register yourself and your friends for Vyuha 2K26.
            </p>

            {error && (
              <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {participants.map((p, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-6 rounded-2xl border mb-6 ${
                    isDark ? 'bg-white/5 border-white/10' : 'bg-white border-vyuha-gray-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`font-sans font-semibold ${isDark ? 'text-white' : 'text-vyuha-black'}`}>
                      {index === 0 ? 'Your Details' : `Person ${index + 1}`}
                    </h3>
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeParticipant(index)}
                        className="text-red-400 hover:text-red-300 text-sm font-medium"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Full Name *</label>
                      <input
                        type="text"
                        value={p.name}
                        onChange={(e) => updateParticipant(index, 'name', e.target.value)}
                        required
                        placeholder="Full name"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Mobile Number *</label>
                      <input
                        type="tel"
                        value={p.mobile}
                        onChange={(e) => updateParticipant(index, 'mobile', e.target.value)}
                        required
                        placeholder="+91 98765 43210"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>College *</label>
                      <input
                        type="text"
                        value={p.college}
                        onChange={(e) => updateParticipant(index, 'college', e.target.value)}
                        required
                        placeholder="College name"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Year *</label>
                      <select
                        value={p.year}
                        onChange={(e) => updateParticipant(index, 'year', e.target.value)}
                        required
                        className={inputClass}
                      >
                        <option value="">Select year</option>
                        <option value="1st">1st Year</option>
                        <option value="2nd">2nd Year</option>
                        <option value="3rd">3rd Year</option>
                        <option value="4th">4th Year</option>
                        <option value="PG">Post Graduate</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelClass}>Department *</label>
                      <input
                        type="text"
                        value={p.department}
                        onChange={(e) => updateParticipant(index, 'department', e.target.value)}
                        required
                        placeholder="e.g. Computer Science"
                        className={inputClass}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Add person button */}
              <button
                type="button"
                onClick={addParticipant}
                className={`w-full p-4 rounded-2xl border-2 border-dashed mb-8 font-medium transition-colors ${
                  isDark
                    ? 'border-white/10 text-vyuha-gray-400 hover:border-vyuha-gold/30 hover:text-vyuha-gold'
                    : 'border-vyuha-gray-200 text-vyuha-gray-500 hover:border-vyuha-gold/40 hover:text-vyuha-gold'
                }`}
              >
                + Add Another Person
              </button>

              {/* Price summary */}
              <div className={`p-6 rounded-2xl border mb-6 ${
                isDark ? 'bg-vyuha-gold/5 border-vyuha-gold/20' : 'bg-vyuha-cream border-vyuha-gold/30'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={isDark ? 'text-vyuha-gray-300' : 'text-vyuha-gray-700'}>
                    {participants.length} person(s) x INR {PRICE_PER_PERSON.toLocaleString('en-IN')}
                  </span>
                  <span className={`font-mono ${isDark ? 'text-vyuha-gray-300' : 'text-vyuha-gray-700'}`}>
                    INR {totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-vyuha-gold/20">
                  <span className="font-semibold text-vyuha-gold">Total Amount</span>
                  <span className="font-display text-2xl font-bold text-vyuha-gold">
                    INR {totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary w-full text-lg py-4 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 rounded-full border-2 border-vyuha-black/30 border-t-vyuha-black animate-spin" />
                ) : (
                  `Pay INR ${totalAmount.toLocaleString('en-IN')}`
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
