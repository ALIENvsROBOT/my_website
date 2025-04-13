"use client";

import { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Dynamically import components that use browser APIs with SSR disabled
const EnhancedParticleBackground = dynamic(
  () => import("@/components/EnhancedParticleBackground"),
  { ssr: false }
);

const CustomCursor = dynamic(
  () => import("@/components/CustomCursor"),
  { ssr: false }
);

const RedesignedHeroSection = dynamic(
  () => import("@/components/RedesignedHeroSection"),
  { ssr: false }
);

const AboutSection = dynamic(
  () => import("@/components/AboutSection"),
  { ssr: false }
);

const ProjectsSection = dynamic(
  () => import("@/components/ProjectsSection"),
  { ssr: false }
);

const ContactSection = dynamic(
  () => import("@/components/ContactSection"),
  { ssr: false }
);

// Client-side only code
if (typeof window !== 'undefined') {
  // Only run this on the client side
  const html = document.documentElement;
  html.style.visibility = "hidden";
  
  // Always make content visible after a timeout
  setTimeout(() => {
    html.style.visibility = "visible";
  }, 200);
  
  // Also still listen for DOMContentLoaded
  document.addEventListener("DOMContentLoaded", function() {
    html.style.visibility = "visible";
  });
  
  // Final safety fallback - if still hidden after 1 second, make it visible
  setTimeout(() => {
    if (html.style.visibility === "hidden") {
      html.style.visibility = "visible";
    }
  }, 1000);
}

// Simple loading component
const Loading = () => <div className="min-h-screen bg-black"></div>;

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    // Mark that we're on the client
    setIsClient(true);
    
    // Make sure the document is visible
    if (typeof document !== 'undefined') {
      document.documentElement.style.visibility = "visible";
    }
    
    // Check if we're on a mobile device
    const checkMobile = () => {
      const isMobileDevice = typeof navigator !== 'undefined' 
        ? /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
        : false;
      setIsMobile(isMobileDevice || (typeof window !== 'undefined' && window.innerWidth < 768));
    };
    
    checkMobile();
    
    // Start with a shorter loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    
    // Listen for window resize to adjust mobile detection
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', checkMobile);
    }
    
    return () => {
      clearTimeout(timer);
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', checkMobile);
      }
    };
  }, []);
  
  // Only render full content on client-side
  if (!isClient) {
    return <Loading />;
  }
  
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      {/* Enhanced Background */}
      <Suspense fallback={<div />}>
        <EnhancedParticleBackground />
      </Suspense>
      
      {/* Custom Cursor for Desktop - only show on non-mobile */}
      {!isMobile && (
        <Suspense fallback={<div />}>
          <CustomCursor />
        </Suspense>
      )}
      
      {/* Content */}
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
            <ContactSection />
          </Suspense>
        </div>
        
        <Footer />
      </div>
    </main>
  );
} 