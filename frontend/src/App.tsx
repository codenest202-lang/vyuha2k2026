import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Navbar from './components/layout/Navbar';
import LoadingScreen from './components/ui/LoadingScreen';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const SchedulePage = lazy(() => import('./pages/SchedulePage'));

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
        </Routes>
      </Suspense>
    </div>
  );
}
