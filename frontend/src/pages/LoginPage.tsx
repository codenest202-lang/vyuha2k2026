import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../lib/api';
import Footer from '../components/landing/Footer';

type Step = 'email' | 'otp' | 'success';

export default function LoginPage() {
  const { isDark } = useTheme();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authApi.sendOtp(email, name);
      setStep('otp');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await authApi.verifyOtp(email, otp);
      if (res.data) {
        login(res.data.token, res.data.user);
        setStep('success');
        setTimeout(() => navigate('/booking'), 1000);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    // In production, use Google OAuth SDK
    // For now, show a placeholder
    setError('Google OAuth requires VITE_GOOGLE_CLIENT_ID to be configured.');
  };

  return (
    <>
      <main className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <div className="section-container max-w-md w-full">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className={`p-8 rounded-2xl border ${
              isDark
                ? 'bg-vyuha-dark/80 border-white/10'
                : 'bg-white border-vyuha-gray-200 shadow-lg'
            }`}
          >
            <div className="text-center mb-8">
              <h1 className={`font-display text-3xl font-bold ${isDark ? 'text-white' : 'text-vyuha-black'}`}>
                {step === 'success' ? 'Welcome!' : 'Register / Login'}
              </h1>
              <p className={`mt-2 text-sm ${isDark ? 'text-vyuha-gray-400' : 'text-vyuha-gray-600'}`}>
                {step === 'email' && 'Enter your details to get started'}
                {step === 'otp' && `We sent a code to ${email}`}
                {step === 'success' && 'Redirecting to booking...'}
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            {step === 'email' && (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-vyuha-gray-300' : 'text-vyuha-gray-700'}`}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Your full name"
                    className={`w-full px-4 py-3 rounded-lg border outline-none transition-colors ${
                      isDark
                        ? 'bg-white/5 border-white/10 text-white placeholder:text-vyuha-gray-600 focus:border-vyuha-gold/50'
                        : 'bg-vyuha-gray-50 border-vyuha-gray-200 text-vyuha-black placeholder:text-vyuha-gray-400 focus:border-vyuha-gold'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-vyuha-gray-300' : 'text-vyuha-gray-700'}`}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@college.edu"
                    className={`w-full px-4 py-3 rounded-lg border outline-none transition-colors ${
                      isDark
                        ? 'bg-white/5 border-white/10 text-white placeholder:text-vyuha-gray-600 focus:border-vyuha-gold/50'
                        : 'bg-vyuha-gray-50 border-vyuha-gray-200 text-vyuha-black placeholder:text-vyuha-gray-400 focus:border-vyuha-gold'
                    }`}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 rounded-full border-2 border-vyuha-black/30 border-t-vyuha-black animate-spin" />
                  ) : (
                    'Send OTP'
                  )}
                </button>

                <div className="relative my-6">
                  <div className={`absolute inset-0 flex items-center ${isDark ? 'text-vyuha-gray-700' : 'text-vyuha-gray-300'}`}>
                    <div className="w-full border-t border-current" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className={`px-3 text-sm ${isDark ? 'bg-vyuha-dark text-vyuha-gray-500' : 'bg-white text-vyuha-gray-500'}`}>
                      or
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className={`w-full px-4 py-3 rounded-lg border font-medium flex items-center justify-center gap-3 transition-colors ${
                    isDark
                      ? 'border-white/10 text-white hover:bg-white/5'
                      : 'border-vyuha-gray-200 text-vyuha-black hover:bg-vyuha-gray-50'
                  }`}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#D4A843"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#A3A3A3"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#737373"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#D4A843"/>
                  </svg>
                  Sign in with Google
                </button>
              </form>
            )}

            {step === 'otp' && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-vyuha-gray-300' : 'text-vyuha-gray-700'}`}>
                    Enter 6-digit OTP
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                    maxLength={6}
                    placeholder="000000"
                    className={`w-full px-4 py-3 rounded-lg border outline-none transition-colors text-center text-2xl font-mono tracking-[0.5em] ${
                      isDark
                        ? 'bg-white/5 border-white/10 text-white focus:border-vyuha-gold/50'
                        : 'bg-vyuha-gray-50 border-vyuha-gray-200 text-vyuha-black focus:border-vyuha-gold'
                    }`}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || otp.length < 6}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 rounded-full border-2 border-vyuha-black/30 border-t-vyuha-black animate-spin" />
                  ) : (
                    'Verify OTP'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="btn-ghost w-full"
                >
                  Back to email
                </button>
              </form>
            )}

            {step === 'success' && (
              <div className="text-center py-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-16 h-16 mx-auto rounded-full bg-vyuha-gold/20 flex items-center justify-center mb-4"
                >
                  <svg className="w-8 h-8 text-vyuha-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
                <p className="text-vyuha-gold font-semibold">Login successful!</p>
              </div>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
