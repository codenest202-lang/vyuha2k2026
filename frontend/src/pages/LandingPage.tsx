import { useState, useCallback } from 'react';
import PlantRootBackground from '../components/three/PlantRootBackground';
import IntroAnimation from '../components/landing/IntroAnimation';
import HeroSection from '../components/landing/HeroSection';
import AboutSection from '../components/landing/AboutSection';
import EventsShowcase from '../components/landing/EventsShowcase';
import Footer from '../components/landing/Footer';

export default function LandingPage() {
  const [showIntro, setShowIntro] = useState(true);

  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
  }, []);

  return (
    <>
      {showIntro && <IntroAnimation onComplete={handleIntroComplete} />}
      <PlantRootBackground />
      <main>
        <HeroSection />
        <AboutSection />
        <EventsShowcase />
      </main>
      <Footer />
    </>
  );
}
