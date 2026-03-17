import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { adminApi, DashboardStats, Booking } from '../lib/api';
import Footer from '../components/landing/Footer';

type Tab = 'overview' | 'bookings' | 'scanner';

export default function AdminDashboard() {
  const { isDark } = useTheme();
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState<Tab>('overview');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [scanInput, setScanInput] = useState('');
  const [scanResult, setScanResult] = useState<{ message: string; success: boolean } | null>(null);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/login');
      return;
    }
    loadDashboard();
  }, [isAuthenticated, isAdmin, navigate]);

  const loadDashboard = async () => {
    try {
      const res = await adminApi.getDashboard();
      if (res.data) {
        setStats(res.data.stats);
        setRecentBookings(res.data.recentBookings);
      }
    } catch {
      // Handle error silently
    } finally {
      setLoading(false);
    }
  };

  const loadBookings = async (p: number) => {
    try {
      const res = await adminApi.getBookings(p, 20);
      if (res.data) {
        setAllBookings(res.data.bookings);
        setTotalPages(res.data.pagination.pages);
        setPage(res.data.pagination.page);
      }
    } catch {
      // Handle error silently
    }
  };

  useEffect(() => {
    if (tab === 'bookings') loadBookings(1);
  }, [tab]);

  const handleScan = async () => {
    if (!scanInput.trim()) return;
    setScanResult(null);

    try {
      // Try to parse as QR JSON data
      let transactionId = scanInput.trim();
      try {
        const parsed = JSON.parse(scanInput);
        if (parsed.txn) transactionId = parsed.txn;
      } catch {
        // Use raw input as transaction ID
      }

      const res = await adminApi.verifyQr(transactionId);
      if (res.data) {
        setScanResult({
          message: res.data.alreadyCheckedIn
            ? `Already checked in at ${res.data.booking.checkedInAt}`
            : `Check-in successful! ${res.data.booking.participants.length} participant(s)`,
          success: !res.data.alreadyCheckedIn,
        });
      }
    } catch (err: unknown) {
      setScanResult({
        message: err instanceof Error ? err.message : 'Verification failed',
        success: false,
      });
    }

    setScanInput('');
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch {
      setScanResult({ message: 'Camera access denied', success: false });
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((t) => t.stop());
      videoRef.current.srcObject = null;
      setCameraActive(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-vyuha-gold/30 border-t-vyuha-gold animate-spin" />
      </div>
    );
  }

  const cardClass = `p-6 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-vyuha-gray-200 shadow-sm'}`;

  return (
    <>
      <main className="pt-24 pb-16">
        <div className="section-container">
          <h1 className={`font-display text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-vyuha-black'}`}>
            Admin <span className="text-gradient-gold">Dashboard</span>
          </h1>
          <p className={`mb-8 ${isDark ? 'text-vyuha-gray-400' : 'text-vyuha-gray-600'}`}>
            Manage registrations and verify attendance.
          </p>

          {/* Tabs */}
          <div className="flex gap-2 mb-8">
            {(['overview', 'bookings', 'scanner'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                  tab === t
                    ? 'bg-vyuha-gold text-vyuha-black'
                    : isDark
                    ? 'text-vyuha-gray-400 hover:text-white hover:bg-white/5'
                    : 'text-vyuha-gray-600 hover:text-vyuha-black hover:bg-vyuha-gray-50'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Overview tab */}
          {tab === 'overview' && stats && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {[
                  { label: 'Total Bookings', value: stats.totalBookings },
                  { label: 'Confirmed', value: stats.confirmedBookings },
                  { label: 'Total Users', value: stats.totalUsers },
                  { label: 'Revenue', value: `INR ${stats.totalRevenue.toLocaleString('en-IN')}` },
                  { label: 'Participants', value: stats.totalParticipants },
                  { label: 'Attended', value: stats.attendedCount },
                ].map((stat) => (
                  <div key={stat.label} className={cardClass}>
                    <div className={`text-xs uppercase tracking-wider mb-1 ${isDark ? 'text-vyuha-gray-500' : 'text-vyuha-gray-500'}`}>
                      {stat.label}
                    </div>
                    <div className={`font-display text-2xl font-bold ${isDark ? 'text-white' : 'text-vyuha-black'}`}>
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent bookings */}
              <h2 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-vyuha-black'}`}>
                Recent Bookings
              </h2>
              <div className="space-y-2">
                {recentBookings.map((b) => {
                  const userName = typeof b.userId === 'object' ? b.userId.name : 'Unknown';
                  const userEmail = typeof b.userId === 'object' ? b.userId.email : '';
                  return (
                    <div key={b._id} className={`p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-vyuha-gray-50'}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className={`font-medium ${isDark ? 'text-white' : 'text-vyuha-black'}`}>{userName}</span>
                          <span className={`ml-2 text-sm ${isDark ? 'text-vyuha-gray-500' : 'text-vyuha-gray-500'}`}>{userEmail}</span>
                        </div>
                        <span className="font-mono text-xs text-vyuha-gold">{b.transactionId}</span>
                      </div>
                      <div className={`text-sm mt-1 ${isDark ? 'text-vyuha-gray-500' : 'text-vyuha-gray-600'}`}>
                        {b.participants.length} participant(s) - INR {b.totalAmount.toLocaleString('en-IN')}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Bookings tab */}
          {tab === 'bookings' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="space-y-2">
                {allBookings.map((b) => {
                  const userName = typeof b.userId === 'object' ? b.userId.name : 'Unknown';
                  return (
                    <div key={b._id} className={`p-4 rounded-xl flex items-center justify-between ${isDark ? 'bg-white/5' : 'bg-vyuha-gray-50'}`}>
                      <div>
                        <span className={`font-medium ${isDark ? 'text-white' : 'text-vyuha-black'}`}>{userName}</span>
                        <span className="ml-2 font-mono text-xs text-vyuha-gold">{b.transactionId}</span>
                        <div className={`text-sm ${isDark ? 'text-vyuha-gray-500' : 'text-vyuha-gray-600'}`}>
                          {b.participants.length} person(s) - INR {b.totalAmount.toLocaleString('en-IN')}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xs font-mono uppercase ${
                          b.attendanceStatus === 'attended' ? 'text-emerald-400' : 'text-vyuha-gray-500'
                        }`}>
                          {b.attendanceStatus}
                        </div>
                        <div className={`text-xs capitalize ${
                          b.status === 'confirmed' ? 'text-emerald-400' : 'text-amber-400'
                        }`}>
                          {b.status}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-center gap-4 mt-8">
                <button
                  onClick={() => loadBookings(page - 1)}
                  disabled={page <= 1}
                  className="btn-ghost disabled:opacity-30"
                >
                  Previous
                </button>
                <span className={`text-sm ${isDark ? 'text-vyuha-gray-400' : 'text-vyuha-gray-600'}`}>
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => loadBookings(page + 1)}
                  disabled={page >= totalPages}
                  className="btn-ghost disabled:opacity-30"
                >
                  Next
                </button>
              </div>
            </motion.div>
          )}

          {/* Scanner tab */}
          {tab === 'scanner' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-lg">
              {/* Camera view */}
              <div className={`mb-6 rounded-2xl overflow-hidden ${cardClass}`}>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className={`w-full aspect-square object-cover rounded-lg ${!cameraActive ? 'hidden' : ''}`}
                />
                {!cameraActive && (
                  <div className="aspect-square flex items-center justify-center">
                    <button onClick={startCamera} className="btn-primary">
                      Open Camera Scanner
                    </button>
                  </div>
                )}
                {cameraActive && (
                  <button onClick={stopCamera} className="btn-ghost w-full mt-2">
                    Stop Camera
                  </button>
                )}
              </div>

              {/* Manual input */}
              <div className={cardClass}>
                <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-vyuha-black'}`}>
                  Manual Verification
                </h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={scanInput}
                    onChange={(e) => setScanInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleScan()}
                    placeholder="Transaction ID or QR data"
                    className={`flex-1 px-4 py-3 rounded-lg border outline-none ${
                      isDark
                        ? 'bg-white/5 border-white/10 text-white focus:border-vyuha-gold/50'
                        : 'bg-vyuha-gray-50 border-vyuha-gray-200 focus:border-vyuha-gold'
                    }`}
                  />
                  <button onClick={handleScan} className="btn-primary">
                    Verify
                  </button>
                </div>

                {scanResult && (
                  <div className={`mt-4 p-4 rounded-lg border ${
                    scanResult.success
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                      : 'bg-red-500/10 border-red-500/20 text-red-400'
                  }`}>
                    {scanResult.message}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
