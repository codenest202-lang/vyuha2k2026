import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Navbar from './components/layout/Navbar';
import LoadingScreen from './components/ui/LoadingScreen';
import ChatbotWidget from './components/chatbot/ChatbotWidget';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const SchedulePage = lazy(() => import('./pages/SchedulePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const BookingPage = lazy(() => import('./pages/BookingPage'));
const BookingConfirmation = lazy(() => import('./pages/BookingConfirmation'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const MyBookings = lazy(() => import('./pages/MyBookings'));

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<LoginPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/booking/confirmation/:id" element={<BookingConfirmation />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Suspense>
      <ChatbotWidget />
    </div>
  );
}
