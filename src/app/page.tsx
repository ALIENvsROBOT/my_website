"use client";

import { useState, useEffect } from 'react';
import EnhancedParticleBackground from "@/components/EnhancedParticleBackground";
import Navbar from "@/components/Navbar";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import RedesignedHeroSection from "@/components/RedesignedHeroSection";
import { isBrowser, isMobile } from "@/utils/clientUtils";
import ClientOnly from "@/components/ClientOnly";

// Remove any direct browser API calls from the top level
// These should all be moved into effects or the ClientOnly component

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileState, setIsMobileState] = useState(false);
  
  // Check for mobile and set up observers
  useEffect(() => {
    if (!isBrowser) return;
    
    // Make sure the document is visible
    document.documentElement.style.visibility = "visible";
    
    // Check if we're on a mobile device
    const checkMobile = () => {
      setIsMobileState(isMobile());
    };
    
    checkMobile();
    
    // Start with a shorter loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    
    // Listen for window resize to adjust mobile detection
    window.addEventListener('resize', checkMobile);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  useEffect(() => {
    if (!isBrowser) return;
    
    // Fix FOUC and ensure content always becomes visible
    const html = document.documentElement;
    html.style.visibility = "visible";
      
    // Final safety fallback - if still hidden after 1 second, make it visible
    const timer = setTimeout(() => {
      if (html.style.visibility === "hidden") {
        html.style.visibility = "visible";
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      {/* Enhanced Background */}
      <ClientOnly>
        <EnhancedParticleBackground />
      </ClientOnly>
      
      {/* Custom Cursor for Desktop - only show on non-mobile */}
      <ClientOnly>
        {!isMobileState && <CustomCursor />}
      </ClientOnly>
      
      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        
        <div className="content-container">
          <RedesignedHeroSection />
          <AboutSection />
          <ProjectsSection />
          <ContactSection />
        </div>
        
        <Footer />
      </div>
    </main>
  );
} 