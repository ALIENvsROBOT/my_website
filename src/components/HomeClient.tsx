"use client";

import { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const EnhancedParticleBackground = dynamic(() => import('@/components/EnhancedParticleBackground'), { ssr: false });
const CustomCursor = dynamic(() => import('@/components/CustomCursor'), { ssr: false });
const RedesignedHeroSection = dynamic(() => import('@/components/RedesignedHeroSection'), { ssr: false });
const AboutSection = dynamic(() => import('@/components/AboutSection'), { ssr: false });
const AwardsSection = dynamic(() => import('@/components/AwardsSection'), { ssr: false });
const ProjectsSection = dynamic(() => import('@/components/ProjectsSection'), { ssr: false });
const ContactSection = dynamic(() => import('@/components/ContactSection'), { ssr: false });

export default function HomeClient() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      if (typeof window === 'undefined') {
        return;
      }

      const isMobileDevice = typeof navigator !== 'undefined'
        ? /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        : false;

      setIsMobile(isMobileDevice || window.innerWidth < 768);
    };

    checkMobile();

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', checkMobile);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', checkMobile);
      }
    };
  }, []);

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <Suspense fallback={<div />}>
        <EnhancedParticleBackground />
      </Suspense>

      {!isMobile && (
        <Suspense fallback={<div />}>
          <CustomCursor />
        </Suspense>
      )}

      <div className="relative z-10">
        <Navbar />

        <div className="content-container">
          <Suspense fallback={<div className="min-h-screen" />}>
            <RedesignedHeroSection />
          </Suspense>
          <Suspense fallback={<div className="min-h-screen" />}>
            <AboutSection />
          </Suspense>
          <Suspense fallback={<div className="min-h-screen" />}>
            <ProjectsSection />
          </Suspense>
          <Suspense fallback={<div className="min-h-screen" />}>
            <AwardsSection />
          </Suspense>
          <Suspense fallback={<div className="min-h-screen" />}>
            <ContactSection />
          </Suspense>
        </div>

        <Footer />
      </div>
    </main>
  );
}
